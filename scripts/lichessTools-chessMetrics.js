(() => {
/**
 * BrilliantMoveAnalyzer
 *
 * Scores one chess move on a set of "brilliancy principles", combines them with weights and checks whether the
 * result lies in an interval. Browser JavaScript; chessops must be loaded as the global `co` (or pass options.co).
 *
 *   const a = new BrilliantMoveAnalyzer({
 *     fen,                          // position before the move
 *     san,                          // the move
 *     evalBefore: { cp: 30 },       // Lichess style, from White's point of view: { cp } or { mate }
 *     evalAfter:  { cp: 25 },       // the position after the move, same convention (not needed when the move mates)
 *     multiPv: [                    // optional: engine lines for the position BEFORE the move
 *       { moves: 'd1h5 g7g6 ...', cp: 30 },   // `moves` = UCI line (its first move identifies the line), or `uci`, or `san`
 *       { uci: 'g1f3', cp: -40 },
 *     ],
 *     evalTwoBefore: { cp: -120 },  // optional: the position `twoBeforePlies` (default 2) plies before the move
 *     book: false,                  // optional: true when the move is opening theory (never brilliant)
 *   });
 *
 *   // 1. one principle at a time; each returns { value: 0..1 or null, raw: {...} }
 *   a.sacrifice();  a.onlyMove();  a.surprise();  ...        (names in BrilliantMoveAnalyzer.PRINCIPLES)
 *   a.principles();                 // all values at once;  a.details() adds the raw numbers
 *
 *   // 2. a weighted sum checked against an interval
 *   a.computeBrilliance(weights, interval)   // any weight vector; defaults to the "sacrifice" type
 *   a.computeBrillianceSacrifice()           // sound sacrifice (the chess.com / MoveLens idea)
 *   a.computeBrillianceMating()              // sacrifice that leads to a short forced mate
 *   a.computeBrillianceCombination()         // sacrifice that the engine line wins back
 *   a.computeBrilliancePositional()          // sacrifice for lasting compensation
 *   a.computeBrillianceQuiet()               // sacrifice that is not a capture or a check
 *   // each returns { score, interval, inInterval, applicable, disqualified, isBrilliant, values, missing }
 *
 *   // 3. everything in one call
 *   a.computeUberBrilliance()       // { score: 0..100, isBrilliant: score >= 70, type, label, inInterval, interestingScore, isInteresting, interestingType, interestingLabel, inInterestingInterval, byType, disqualified }
 *
 * A weighted sum is the weighted average of the principles that returned a value (null ones are left out).
 * Weights are never negative; a principle that is needed the other way round exists in that form
 * (notAlreadyWinning rather than "already winning").
 */
class BrilliantMoveAnalyzer {
  // ---------------------------------------------------------------- constants
  static VALUE = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
  static ATTACKER_VALUE = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 2.5 }; // a king capturing is "cheap"

  static PRINCIPLES = [
    'bestMove', 'notAlreadyWinning', 'soundAfter',
    'sacrifice', 'heavySacrifice', 'compensation', 'regainsMaterial', 'lastingSacrifice',
    'surprise', 'quietMove', 'onlyMove', 'independence',
    'matingAttack', 'attackerValue', 'checkOffer', 'comeback',
  ];

  // principles ignored when computing interesting
  static NI_PRINCIPLES = [
    'bestMove', 'soundAfter', 'compensation', 'regainsMaterial', 'lastingSacrifice', 'onlyMove', 'comeback'
  ];
  static INTERESTING_INTERVAL_WEIGHT = 0.7; // the intervals are relaxed for interesting detection

  // Principles that nearly every good move satisfies; they form the baseline of a type's weighted sum.
  static PRECONDITIONS = ['bestMove', 'soundAfter', 'notAlreadyWinning', 'independence', 'quietMove'];

  static DEFAULTS = {
    twoBeforePlies: 2,       // plies from the evalTwoBefore position to the position before the move; only odd or even matters (odd = other side to move there)
    qsDepth: 8,              // capture-only search depth used to count material
    qsNodes: 2000,           // node budget of one capture-only search
    bestMoveFullLoss: 1,     // win% lost at which bestMove() is still 1 ...
    bestMoveZeroLoss: 6,     // ... and at which it reaches 0
    winningFull: 80,         // notAlreadyWinning(): 1 while the mover's win% before the move is at most this ...
    winningZero: 97,         // ... and 0 from this value (MoveLens uses 97)
    worseZero: 35,           // soundAfter(): 0 at this win% after the move ...
    worseFull: 48,           // ... and 1 from this value (MoveLens uses 48)
    sacrificeZero: 1,        // pawns given up for sacrifice() = 0 (a pawn gambit is not a brilliancy)
    sacrificeFull: 2,        // pawns given up for sacrifice() = 1 (MoveLens: two pawns; an exchange sacrifice)
    surpriseFull: 4,         // materialist regret in pawns that maps to surprise() = 1
    onlyMoveFullGap: 20,     // win% gap to the 2nd line that maps to onlyMove() = 1
    mateFull: 6,             // mate in this many moves or fewer: matingAttack() = 1 ...
    mateZero: 14,            // ... and 0 from this many
    comebackBelow: 45,       // comeback() only applies when the mover's win% was below this two plies earlier
    uberThreshold: 70,       // computeUberBrilliance(): scores >= this are brilliant
  };

  /**
   * One entry per type of brilliancy: weights (any subset of PRINCIPLES, relative sizes matter), interval for the
   * weighted average, and the principles that must be available for the type to apply.
   * An "essential" principle is one whose normalized weight is larger than 1 - interval[0]: if it is 0, the sum
   * cannot reach the interval, so it behaves like a hard requirement (see necessaryPrinciples()).
   */
  static TYPES = {
    sacrifice: {
      label: 'Sound sacrifice',
      priority: 1,
      about: 'Best move that gives up material, in a position that is not already won, without ending up worse.',
      weights: { bestMove: 20, sacrifice: 20, soundAfter: 15, notAlreadyWinning: 13, independence: 13,
                 compensation: 6, surprise: 6, heavySacrifice: 3, attackerValue: 2, checkOffer: 1, comeback: 1 },
      interval: [0.88, 1],
      requires: [],
    },
    mating: {
      label: 'Mating sacrifice',
      priority: 5,
      about: 'Material is given up and the engine finds a short forced mate. Already winning is allowed: the beauty is the sacrifice.',
      weights: { matingAttack: 28, sacrifice: 22, bestMove: 18, heavySacrifice: 8, surprise: 8, soundAfter: 6,
                 attackerValue: 5, checkOffer: 5 },
      interval: [0.85, 1],
      requires: [],
    },
    combination: {
      label: 'Sacrificial combination',
      priority: 2,
      about: 'Material is given up and the principal line wins it back (or mates). Deflection, decoy, clearance style tactics.',
      weights: { bestMove: 18, sacrifice: 18, regainsMaterial: 18, soundAfter: 15, independence: 15, surprise: 8,
                 notAlreadyWinning: 5, compensation: 3 },
      interval: [0.86, 1],
      requires: ['regainsMaterial'],
    },
    positional: {
      label: 'Positional sacrifice',
      priority: 3,
      about: 'Material is given up for lasting compensation: the principal line does not win it back and the engine still likes the position.',
      weights: { bestMove: 18, sacrifice: 18, lastingSacrifice: 18, soundAfter: 15, notAlreadyWinning: 13, independence: 13, compensation: 5 },
      interval: [0.88, 1],
      requires: ['lastingSacrifice'],
    },
    quiet: {
      label: 'Quiet sacrifice',
      priority: 4,
      about: 'A move that is neither a capture nor a check (nor an answer to one) and still gives up material. Hard to see because nothing is being taken.',
      weights: { quietMove: 16, bestMove: 16, sacrifice: 18, soundAfter: 14, independence: 12, notAlreadyWinning: 6, onlyMove: 12, surprise: 6 },
      interval: [0.87, 1],
      requires: [],
    },
  };

  // ---------------------------------------------------------------- construction
  constructor(input, options = {}) {
    const { co: lib, types, ...rest } = options;
    this.co = lib || (typeof co !== 'undefined' ? co : null);
    if (!this.co) throw new Error('chessops is not loaded: expected a global `co` or options.co');
    this.options = { ...BrilliantMoveAnalyzer.DEFAULTS, ...rest };
    this.types = {};
    for (const [name, def] of Object.entries({ ...BrilliantMoveAnalyzer.TYPES, ...(types || {}) })) {
      this.types[name] = { ...(BrilliantMoveAnalyzer.TYPES[name] || {}), ...def };
    }
    this._memo = {};
    this._init(input);
  }

  _init(input) {
    const lib = this.co, B = BrilliantMoveAnalyzer;
    if (!input || typeof input.fen !== 'string' || typeof input.san !== 'string') throw new Error('input needs { fen, san, evalBefore, evalAfter }');
    const setup = lib.fen.parseFen(input.fen);
    if (setup.isErr) throw new Error('Invalid FEN: ' + input.fen);
    const posRes = lib.Chess.fromSetup(setup.unwrap());
    if (posRes.isErr) throw new Error('Illegal position: ' + input.fen);
    this.pos0 = posRes.unwrap();
    this.move = lib.san.parseSan(this.pos0, input.san);
    if (!this.move) throw new Error(`Illegal or unparsable SAN "${input.san}" in ${input.fen}`);
    this.book = !!input.book;
    this.mover = this.pos0.turn;
    this.other = this.mover === 'white' ? 'black' : 'white';
    this.piece = this.pos0.board.get(this.move.from);
    this.victim = this._victim(this.pos0, this.move);
    this.pos1 = this.pos0.clone();
    this.pos1.play(this.move);
    this.inCheck = this.pos0.isCheck();
    this.givesCheck = this.pos1.isCheck();
    this.givesMate = this.pos1.isCheckmate();
    this.playedUci = this._uci(this.pos0, this.move);

    // every evaluation is converted to the mover's point of view
    const flip = this.mover === 'black';
    this.evBefore = B._pov(input.evalBefore, flip, 'evalBefore');
    this.evAfter = this.givesMate ? { mate: 0, delivered: true } : B._pov(input.evalAfter, flip, 'evalAfter');
    this.evTwoBefore = input.evalTwoBefore
      ? B._pov(input.evalTwoBefore, flip !== (this.options.twoBeforePlies % 2 === 1), 'evalTwoBefore') : null;
    this.wBefore = B.winPercent(this.evBefore);
    this.wAfter = B.winPercent(this.evAfter);
    this.wTwoBefore = this.evTwoBefore ? B.winPercent(this.evTwoBefore) : null;

    this.lines = this._parseLines(input.multiPv, flip);
    const idx = this.lines ? this.lines.findIndex((l) => l.uci === this.playedUci) : -1;
    this.rank = idx >= 0 ? idx + 1 : null;
    this.wBest = this.lines ? this.lines[0].win : this.wBefore;
    this.wPlayed = idx >= 0 ? this.lines[idx].win : this.wAfter;
  }

  // ---------------------------------------------------------------- static helpers
  /** Lichess win% curve. `ev` = { cp } or { mate }, from the side whose chances you want. */
  static winPercent(ev) {
    if (!ev) return null;
    if (ev.delivered) return 100;
    if (ev.mate != null) return ev.mate > 0 ? 100 : ev.mate < 0 ? 0 : 50;
    const cp = Math.min(1000, Math.max(-1000, ev.cp || 0));
    return ChessMetrics.centipawnsToWinPercentage(cp);
  }
  static _cp(ev) { // centipawns, mate = +-1000
    if (ev.delivered) return 1000;
    if (ev.mate != null) return ev.mate > 0 ? 1000 : ev.mate < 0 ? -1000 : 0;
    return Math.min(1000, Math.max(-1000, ev.cp || 0));
  }
  static _pov(ev, flip, name) {
    if (!ev || (typeof ev.cp !== 'number' && typeof ev.mate !== 'number')) throw new Error(`${name} must be { cp } or { mate }`);
    if (typeof ev.mate === 'number') return { mate: flip ? -ev.mate : ev.mate };
    return { cp: flip ? -ev.cp : ev.cp };
  }
  static _ramp(x, zero, full) { // 0 at `zero`, 1 at `full`, linear between, works in both directions
    return Math.min(1, Math.max(0, (x - zero) / (full - zero)));
  }
  static _r(value, raw) { return { value, raw: raw || {} }; }

  // ---------------------------------------------------------------- chess helpers
  _victim(pos, m) { // opponent piece captured by m (en passant included), else null
    const t = pos.board.get(m.to);
    if (t && t.color !== pos.turn) return t;
    const p = pos.board.get(m.from);
    if (p && p.role === 'pawn' && !t && this.co.squareFile(m.from) !== this.co.squareFile(m.to)) {
      return { role: 'pawn', color: pos.turn === 'white' ? 'black' : 'white' };
    }
    return null;
  }
  _legal(pos) {
    const out = [];
    for (const [from, dests] of pos.allDests()) {
      const p = pos.board.get(from);
      for (const to of dests) {
        const r = this.co.squareRank(to);
        out.push(p.role === 'pawn' && (r === 0 || r === 7) ? { from, to, promotion: 'queen' } : { from, to });
      }
    }
    return out;
  }
  _uci(pos, m) { // Lichess writes castling as the king's two-square move, chessops as king-takes-rook
    const p = pos.board.get(m.from), t = pos.board.get(m.to);
    if (p && p.role === 'king' && t && t.color === p.color && t.role === 'rook') {
      const file = this.co.squareFile(m.to) > this.co.squareFile(m.from) ? 6 : 2;
      return this.co.makeSquare(m.from) + this.co.makeSquare(file + this.co.squareRank(m.from) * 8);
    }
    return this.co.makeUci(m);
  }
  _material(pos, color) {
    const V = BrilliantMoveAnalyzer.VALUE;
    return Object.keys(V).reduce((s, r) => s + V[r] * pos.board.pieces(color, r).size(), 0);
  }
  _balance(pos) { return this._material(pos, this.mover) - this._material(pos, this.other); } // mover minus opponent
  /** Most material (in pawns) the side to move wins by captures alone. Standing pat = 0. */
  _qs(pos, alpha, beta, depth, budget) {
    const V = BrilliantMoveAnalyzer.VALUE;
    let best = 0;
    if (best >= beta || depth === 0 || budget.n-- <= 0) return best;
    alpha = Math.max(alpha, best);
    const caps = [];
    for (const m of this._legal(pos)) {
      const t = this._victim(pos, m);
      if (t) caps.push({ m, v: V[t.role] + (m.promotion ? 8 : 0), a: V[pos.board.get(m.from).role] });
    }
    caps.sort((x, y) => y.v - x.v || x.a - y.a);
    for (const c of caps) {
      const child = pos.clone();
      child.play(c.m);
      best = Math.max(best, c.v - this._qs(child, c.v - beta, c.v - alpha, depth - 1, budget));
      if (best >= beta) break;
      alpha = Math.max(alpha, best);
    }
    return best;
  }
  _qsRoot(pos) { return this._qs(pos, -99, 99, this.options.qsDepth, { n: this.options.qsNodes }); }
  /** Non-pawn pieces of `color` that the opponent wins by capturing, judged statically. */
  _threatened(pos, color) {
    const V = BrilliantMoveAnalyzer.VALUE, AV = BrilliantMoveAnalyzer.ATTACKER_VALUE;
    const enemy = color === 'white' ? 'black' : 'white', occ = pos.board.occupied, out = [];
    for (const role of ['knight', 'bishop', 'rook', 'queen']) {
      for (const sq of pos.board.pieces(color, role)) {
        const att = pos.kingAttackers(sq, enemy, occ);
        if (att.isEmpty()) continue;
        let cheapest = 99;
        for (const a of att) cheapest = Math.min(cheapest, AV[pos.board.get(a).role]);
        if (pos.kingAttackers(sq, color, occ).isEmpty() || cheapest < V[role]) out.push(sq);
      }
    }
    return out;
  }
  _parseLines(multiPv, flip) {
    if (!Array.isArray(multiPv) || !multiPv.length) return null;
    const B = BrilliantMoveAnalyzer;
    const lines = [];
    multiPv.forEach((l, i) => {
      if (typeof l.cp !== 'number' && typeof l.mate !== 'number') return;
      const raw = l.moves != null ? l.moves : l.pv;
      let pv = Array.isArray(raw) ? raw.slice() : typeof raw === 'string' ? raw.trim().split(/\s+/).filter(Boolean) : [];
      let uci = l.uci || pv[0] || null;
      if (!uci && l.san) { const m = this.co.san.parseSan(this.pos0, l.san); uci = m ? this._uci(this.pos0, m) : null; }
      if (!uci) return;
      if (!pv.length) pv = [uci];
      const ev = B._pov({ cp: l.cp, mate: l.mate }, flip, `multiPv[${i}]`);
      lines.push({ uci, pv, ev, win: B.winPercent(ev) });
    });
    if (!lines.length) return null;
    return lines.sort((a, b) => b.win - a.win); // stable: engine order is kept for equal win%
  }
  _once(key, fn) { return key in this._memo ? this._memo[key] : (this._memo[key] = fn()); }

  // ---------------------------------------------------------------- shared analysis (lazy, cached)
  /** Material bookkeeping in pawns, from the mover's side. sacrifice = material given up once captures are resolved. */
  _mat() {
    return this._once('mat', () => {
      const before = this._balance(this.pos0);
      const now = this._balance(this.pos1) - (this.move.promotion ? 8 : 0);
      const oppGain = this._qsRoot(this.pos1);
      return { before, now, oppGain, afterExchange: now - oppGain, sacrifice: before - (now - oppGain) };
    });
  }
  /** Opponent's capture replies after the move, each with its net material result for the opponent. */
  _offers() {
    return this._once('offers', () => {
      const V = BrilliantMoveAnalyzer.VALUE, out = [];
      for (const m2 of this._legal(this.pos1)) {
        const t = this._victim(this.pos1, m2);
        if (!t || V[t.role] === 0) continue;
        const c = this.pos1.clone();
        c.play(m2);
        out.push({ to: m2.to, victim: t.role, attacker: this.pos1.board.get(m2.from).role, net: V[t.role] - this._qsRoot(c), withCheck: c.isCheck() });
      }
      return out;
    });
  }
  /**
   * The "sacrificed" piece: the opponent captures that gain the most material, then take the most valuable victim.
   * Equal candidates are all kept (`squares`) so that the result does not depend on move generation order.
   */
  _target() {
    return this._once('target', () => {
      const V = BrilliantMoveAnalyzer.VALUE;
      const wins = this._offers().filter((o) => o.net > 0);
      if (!wins.length) return null;
      const top = Math.max(...wins.map((o) => o.net));
      const best = wins.filter((o) => o.net === top);
      const worth = Math.max(...best.map((o) => V[o.victim]));
      const picked = best.filter((o) => V[o.victim] === worth);
      return { victim: picked[0].victim, worth, squares: [...new Set(picked.map((o) => o.to))] };
    });
  }
  /**
   * Follows the engine line of the played move to its end (needs multiPv with `moves`) and returns the material
   * balance there with captures resolved, and whether the line ends in a checkmate.
   */
  _pv() {
    return this._once('pv', () => {
      const line = this.lines && this.lines.find((l) => l.uci === this.playedUci && l.pv.length > 1);
      if (!line) return null;
      const pos = this.pos0.clone();
      for (const u of line.pv) {
        try {
          const m = this.co.parseUci(u);
          if (!m || !pos.isLegal(m)) break;
          pos.play(m);
        } catch (e) { break; }
        if (pos.isEnd()) break;
      }
      const mated = pos.isCheckmate() ? (pos.turn === this.mover ? 'mover' : 'opponent') : null;
      const gain = pos.isEnd() ? 0 : this._qsRoot(pos);
      return { matedSide: mated, settledBalance: this._balance(pos) + (pos.turn === this.mover ? gain : -gain) };
    });
  }
  /** Share of the sacrificed material the principal line wins back, 0..1. null when it cannot be told. */
  _recovery() {
    return this._once('recovery', () => {
      const m = this._mat(), s = m.sacrifice;
      if (s <= 0) return { value: 0, how: 'no sacrifice' };
      if (this.evAfter.delivered || this.evAfter.mate > 0) return { value: 1, how: 'mate' };
      const pv = this._pv();
      if (!pv) return { value: null, how: 'no principal line' };
      if (pv.matedSide === 'opponent') return { value: 1, how: 'mate in line' };
      if (pv.matedSide === 'mover') return { value: 0, how: 'mated in line' };
      return { value: Math.min(1, Math.max(0, (pv.settledBalance - (m.before - s)) / s)), how: 'line' };
    });
  }
  /** Material result (mover's side, captures resolved) of every legal move: what a materialist would compare. */
  _outcomes() {
    return this._once('outcomes', () => {
      const V = BrilliantMoveAnalyzer.VALUE;
      return this._legal(this.pos0).map((m) => {
        const t = this._victim(this.pos0, m), c = this.pos0.clone();
        c.play(m);
        return (t ? V[t.role] : 0) - this._qsRoot(c);
      });
    });
  }

  // ---------------------------------------------------------------- principles
  // 1. The move is the engine's best, or loses very little win probability.
  bestMove() {
    const B = BrilliantMoveAnalyzer, o = this.options;
    if (this.wBest == null || this.wPlayed == null) return B._r(null);
    const loss = Math.max(0, this.wBest - this.wPlayed);
    return B._r(B._ramp(loss, o.bestMoveZeroLoss, o.bestMoveFullLoss), { winPctLoss: loss, rank: this.rank });
  }

  // 2. The mover is not already winning (a sacrifice in a won position costs nothing). 1 = not winning.
  notAlreadyWinning() {
    const B = BrilliantMoveAnalyzer, o = this.options;
    return B._r(B._ramp(this.wBefore, o.winningZero, o.winningFull), { winPctBefore: this.wBefore });
  }

  // 3. Not worse afterwards: win% after the move is at least equal.
  soundAfter() {
    const B = BrilliantMoveAnalyzer, o = this.options;
    return B._r(B._ramp(this.wAfter, o.worseZero, o.worseFull), { winPctAfter: this.wAfter });
  }

  // 4. Material given up, in pawns, once the opponent's capture sequence is resolved: 0 up to sacrificeZero (a pawn
  //    gambit), 1 from sacrificeFull (two pawns, i.e. an exchange or a piece). Principles 5 to 8, 14 and 15 describe a
  //    sacrifice, so they are multiplied by this value and are 0 when nothing is given up.
  sacrifice() {
    const B = BrilliantMoveAnalyzer, o = this.options, s = this._mat().sacrifice;
    return B._r(B._ramp(s, o.sacrificeZero, o.sacrificeFull), { pawns: s, balanceBefore: this._mat().before, balanceAfterExchange: this._mat().afterExchange });
  }
  _gate() { return this.sacrifice().value; }

  // 5. The piece given up is a heavy one: pawn 0, minor piece 0.25, rook 0.5, queen 1.
  heavySacrifice() {
    const B = BrilliantMoveAnalyzer, t = this._target();
    if (!t) return B._r(0);
    return B._r(this._gate() * Math.min(1, Math.max(0, (B.VALUE[t.victim] - 1) / 8)), { piece: t.victim });
  }

  // 6. The engine does not punish the missing material: the eval holds although material is down.
  compensation() {
    const B = BrilliantMoveAnalyzer, s = this._mat().sacrifice;
    if (s <= 0) return B._r(0, { pawns: 0 });
    const pawns = (B._cp(this.evAfter) - B._cp(this.evBefore)) / 100 + s;
    return B._r(this._gate() * Math.min(1, Math.max(0, pawns / s)), { pawns });
  }

  // 7. Temporary sacrifice: the engine line wins the material back (or mates). Needs multiPv with `moves`, or a mate score.
  regainsMaterial() {
    const B = BrilliantMoveAnalyzer, r = this._recovery();
    return B._r(r.value == null ? null : this._gate() * r.value, { how: r.how, recovered: r.value });
  }

  // 8. Lasting sacrifice: material is given up and the engine line does not win it back (positional compensation).
  lastingSacrifice() {
    const B = BrilliantMoveAnalyzer, r = this._recovery();
    return B._r(r.value == null ? null : this._gate() * (1 - r.value), { how: r.how, recovered: r.value });
  }

  // 9. Counterintuitive for a materialist: a greedy player would rate other moves higher (regret in pawns),
  //    more so for retreats and moves onto attacked squares.
  surprise() {
    const B = BrilliantMoveAnalyzer, o = this.options;
    const outcomes = this._outcomes();
    const regret = Math.max(0, Math.max(...outcomes) + this._mat().sacrifice);
    const dir = this.mover === 'white' ? 1 : -1;
    const retreat = this.piece.role !== 'pawn' && (this.co.squareRank(this.move.to) - this.co.squareRank(this.move.from)) * dir < 0;
    const onAttacked = !this.pos1.kingAttackers(this.move.to, this.other, this.pos1.board.occupied).isEmpty();
    const v = Math.min(1, regret / o.surpriseFull) * (0.8 + 0.1 * retreat + 0.1 * onAttacked);
    return B._r(Math.min(1, v), { regret, retreat, onAttacked });
  }

  // 10. Not a capture and not a check.
  quietMove() {
    const B = BrilliantMoveAnalyzer;
    return B._r(this.inCheck || this.victim ? 0 : this.givesCheck ? 0.3 : 1, { capture: !!this.victim, check: this.givesCheck, evasion: this.inCheck });
  }

  // 11. Only move: the played move is the top line and the next best line is much worse. Needs multiPv.
  onlyMove() {
    const B = BrilliantMoveAnalyzer, o = this.options;
    if (!this.lines || this.lines.length < 2) return B._r(null);
    const gap = this.lines[0].win - this.lines[1].win;
    return B._r(this.rank === 1 ? Math.min(1, gap / o.onlyMoveFullGap) : 0, { gap, rank: this.rank });
  }

  // 12. Independent of other issues: not a rescue of a hanging piece, not a grab of an undefended piece, not an even trade.
  independence() {
    const B = BrilliantMoveAnalyzer;
    const before = this._threatened(this.pos0, this.mover), after = this._threatened(this.pos1, this.mover);
    const rescues = before.length > 0 && after.length < before.length;
    const undefended = !!this.victim && this.pos0.kingAttackers(this.move.to, this.other, this.pos0.board.occupied).isEmpty();
    const evenTrade = !!this.victim && this._mat().sacrifice <= 0;
    const evasion = this.inCheck;
    return B._r(rescues || undefended || evenTrade || evasion ? 0 : 1, { rescues, undefended, evenTrade, evasion });
  }

  // 13. The engine sees a forced mate for the mover: 1 for mate within mateFull moves, fading to 0 at mateZero.
  matingAttack() {
    const B = BrilliantMoveAnalyzer, o = this.options, e = this.evAfter;
    const mateIn = e.delivered ? 1 : e.mate > 0 ? e.mate + 1 : null; // counted from the played move
    return B._r(mateIn ? B._ramp(mateIn, o.mateZero, o.mateFull) : 0, { mateIn });
  }

  // 14. The sacrificed piece can be taken by a much cheaper piece (queen attacked by a pawn = 1).
  attackerValue() {
    const B = BrilliantMoveAnalyzer, t = this._target();
    if (!t) return B._r(0);
    const cheapest = Math.min(...this._offers().filter((o) => t.squares.includes(o.to)).map((o) => B.ATTACKER_VALUE[o.attacker]));
    return B._r(this._gate() * Math.min(1, Math.max(0, 1 - cheapest / t.worth)), { victim: t.victim, cheapestAttacker: cheapest });
  }

  // 15. The sacrificed piece can be captured with check (WintrChess bonus).
  checkOffer() {
    const B = BrilliantMoveAnalyzer, t = this._target();
    const ways = t ? this._offers().filter((o) => t.squares.includes(o.to)) : [];
    return B._r(this._gate() * (ways.some((o) => o.withCheck) ? 1 : 0), { waysToCapture: ways.length });
  }

  // 16. Comeback: two plies earlier the mover was clearly worse, and the position after the move is better.
  //     Needs evalTwoBefore; returns null (left out of the sum) when the mover was not worse.
  comeback() {
    const B = BrilliantMoveAnalyzer, o = this.options;
    if (this.wTwoBefore == null || this.wTwoBefore >= o.comebackBelow) return B._r(null);
    return B._r(Math.min(1, Math.max(0, (this.wAfter - this.wTwoBefore) / 30)), { winPctTwoBefore: this.wTwoBefore, winPctAfter: this.wAfter });
  }

  // ---------------------------------------------------------------- running principles
  /** Why this move can never count as brilliant, whatever its score. */
  disqualifiers() {
    const out = [];
    if (this._legal(this.pos0).length === 1) out.push('forced move (only one legal move)');
    if (this.move.promotion) out.push('pawn promotion');
    if (this.book) out.push('opening book move');
    return out;
  }
  /** All principles with their raw numbers: { name: { value, raw } }. Computed once per analyzer. */
  details() {
    return this._once('details', () => Object.fromEntries(BrilliantMoveAnalyzer.PRINCIPLES.map((n) => [n, this[n]()])));
  }
  /** All principle values: { name: value | null }. */
  principles() {
    return Object.fromEntries(Object.entries(this.details()).map(([n, d]) => [n, d.value]));
  }

  // ---------------------------------------------------------------- weighted sums
  /**
   * Generic version. Runs every principle, takes the weighted average of those named in `weights` (principles that
   * return null are left out) and checks it against `interval` = [lo, hi] (inclusive).
   * Defaults to the "sacrifice" type. `required` lists principles that must not be null for the result to apply.
   * Returns { score, interval, inInterval, applicable, disqualified, isBrilliant, values (all principles), missing }.
   */
  computeBrilliance(weights, interval, required = []) {
    const values = this.principles();
    let sum = 0, used = 0;
    let isum = 0, iused = 0;
    const missing = [];
    for (const [name, w] of Object.entries(weights)) {
      if (!(name in values)) throw new Error('Unknown principle: ' + name);
      if (w < 0) throw new Error('Weights must not be negative: ' + name);
      if (!w) continue;
      if (values[name] == null) { missing.push(name); continue; }
      sum += w * values[name];
      used += w;
      const ignorePrinciple = BrilliantMoveAnalyzer.NI_PRINCIPLES.includes(name);
      if (!ignorePrinciple) {
        isum += w * values[name];
        iused += w;
      }
    }
    const applicable = required.every((n) => values[n] != null);
    const score = used ? sum / used : 0;
    const [lo, hi] = interval;
    const disqualified = this.disqualifiers();
    const inInterval = applicable && score >= lo && score <= hi;
    const iscore = iused ? isum / iused : 0;
    const inInterestingInterval = applicable && iscore >= lo && iscore <= hi;
    return { score, interval: [lo, hi], inInterval, applicable, disqualified,
      isBrilliant: inInterval && !disqualified.length,
      interestingScore: iscore,
      inInterestingInterval,
      isInteresting: inInterestingInterval && !disqualified.length,
      values, missing };
  }

  _computeType(name) {
    const t = this.types[name];
    if (!t) throw new Error('Unknown type: ' + name);
    return { type: name, label: t.label, ...this.computeBrilliance(t.weights, t.interval, t.requires || []) };
  }
  computeBrillianceSacrifice() { return this._computeType('sacrifice'); }
  computeBrillianceMating() { return this._computeType('mating'); }
  computeBrillianceCombination() { return this._computeType('combination'); }
  computeBrilliancePositional() { return this._computeType('positional'); }
  computeBrillianceQuiet() { return this._computeType('quiet'); }

  /**
   * Share of a type's weight that sits on preconditions: what an ordinary good move (best, not losing, independent,
   * not already winning) earns with no sacrifice at all.
   */
  _baseline(weights) {
    const total = Object.values(weights).reduce((s, w) => s + w, 0);
    return BrilliantMoveAnalyzer.PRECONDITIONS.reduce((s, n) => s + (weights[n] || 0), 0) / total;
  }

  /**
   * Maps a type's weighted average to 0..100: the baseline = 0, the interval's lower edge = uberThreshold, its upper
   * edge = 100. Above the upper edge (only when hi < 1) it falls off again.
   */
  _fit(score, [lo, hi], weights) {
    const T = this.options.uberThreshold, clamp = (x) => Math.min(1, Math.max(0, x));
    if (score < lo) {
      const b = this._baseline(weights);
      return lo > b ? T * clamp((score - b) / (lo - b)) : 0;
    }
    if (score <= hi) return hi > lo ? T + (100 - T) * (score - lo) / (hi - lo) : 100;
    return T * clamp(1 - (score - hi) / (1 - hi));
  }

  /**
   * Runs every type and returns the best fit as a 0..100 score. Anything at or above `threshold` is brilliant.
   * `type` is the most specific type whose interval holds (mating > quiet > positional > combination > sacrifice);
   * when none holds it is the closest one. Returns
   * { score, isBrilliant, threshold, type, label, inInterval: [types whose interval holds], byType, disqualified }
   */
  computeUberBrilliance() {
    const T = this.options.uberThreshold, byType = {};
    for (const name of Object.keys(this.types)) {
      const t = this.types[name], r = this._computeType(name);
      const iweights = {};
      for (const k in t.weights) {
        iweights[k] = BrilliantMoveAnalyzer.NI_PRINCIPLES.includes(k) ? 0 : t.weights[k];
      }
      byType[name] = { score: r.score,
        fit: r.applicable ? this._fit(r.score, r.interval, t.weights) : 0,
        ifit: r.applicable ? this._fit(r.interestingScore, [r.interval[0] * BrilliantMoveAnalyzer.INTERESTING_INTERVAL_WEIGHT, 1], iweights) : 0,
        inInterval: r.inInterval, applicable: r.applicable, missing: r.missing, priority: t.priority || 0, values: r.values };
    }
    const names = Object.keys(byType);
    const disqualified = this.disqualifiers();

    const inside = names.filter((n) => byType[n].inInterval)
      .sort((a, b) => byType[b].priority - byType[a].priority || byType[b].fit - byType[a].fit);
    const bestFit = Math.max(...names.map((n) => byType[n].fit));
    const closest = names.find((n) => byType[n].fit === bestFit);
    const score = disqualified.length ? 0 : Math.round(bestFit * 10) / 10;
    const type = score > 0 ? (inside[0] || closest) : null;

    const iinside = names.filter((n) => byType[n].inInterestingInterval)
      .sort((a, b) => byType[b].priority - byType[a].priority || byType[b].ifit - byType[a].ifit);
    const ibestFit = Math.max(...names.map((n) => byType[n].ifit));
    const iclosest = names.find((n) => byType[n].ifit === ibestFit);
    const iscore = disqualified.length ? 0 : Math.round(ibestFit * 10) / 10;
    const itype = iscore > 0 ? (iinside[0] || iclosest) : null;

    return {
      threshold: T,

      score,
      isBrilliant: score >= T,
      type,
      label: type ? this.types[type].label : null,
      inInterval: inside,

      interestingScore: iscore,
      isInteresting: iscore >= T,
      interestingType: itype,
      interestingLabel: itype ? this.types[itype].label : null,
      inInterestingInterval: iinside,

      byType,
      disqualified,
    };
  }

  // ---------------------------------------------------------------- tuning aid
  /** Principles of a type that are individually necessary: normalized weight > 1 - interval[0]. */
  static necessaryPrinciples(type) {
    const t = BrilliantMoveAnalyzer.TYPES[type];
    const total = Object.values(t.weights).reduce((s, w) => s + w, 0);
    return Object.entries(t.weights).filter(([, w]) => w / total > 1 - t.interval[0]).map(([n]) => n);
  }
}

  LiChessTools.BrilliantMoveAnalyzer = BrilliantMoveAnalyzer;

  class ChessMetrics {
    static pieceMaterial = {
      'k': 0,
      'q': 900,
      'r': 500,
      'b': 310,
      'n': 300,
      'p': 100
    };

    static getCentipawnOnlyValue(info) {
      if (!info || info.depth === 0) return;
      let cp = undefined;
      const mate = Array.isArray(info.mate) ? info.mate[0] : info.mate;
      if (mate !== undefined) {
        const sign = mate?.toString()?.trim()?.startsWith('-')
          ? -1
          : 1;
        cp = sign * (10000 - Math.abs(+mate) * 100);
      }
      if (info.cp !== undefined) {
        cp = +(Array.isArray(info.cp) ? info.cp[0] : info.cp);
      }
      if (cp === undefined || Number.isNaN(cp)) {
        console.warn('Failed getting centipawns from ', info);
        return 0;
      }
      return cp;
    }

    static centipawnsToWinPercentage(cp) {
      return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
    }

    static winDeltaToAccuracy(expected, played) {
      return Math.max(0, 103.1668 * Math.exp(-0.04354 * Math.max(0, expected - (played || 0))) - 3.1669);
    }

    static wdlToSharpness(w, d, l) {
      return Math.round(Math.min(w, l) / 50 * 333 / d * 1 / (1 + Math.exp(-(w + l) / 1000)));
    }

    static isSanMate(node) {
      return node.san?.endsWith('#');
    }

    static isSanCheck(node) {
      return node.san?.includes('+');
    }

    static isStartFen(fen) {
      return fen?.startsWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    }

    static mirrorFen(fen) {
      if (!fen) return fen;

      const flipCapitalization = s => {
        const pieces = 'RNBQKPrnbqkp';
        return s.split('').map(ch => {
          const i = pieces.indexOf(ch);
          if (i < 0) return ch;
          return pieces[(i + 6) % 12];
        }).join('');
      };

      const splits = fen.split(' ');
      splits[0] = flipCapitalization(splits[0].split('/').reverse().join('/'));
      if (splits[1]) {
        splits[1] = splits[1] == 'w' ? 'b' : 'w';
      }
      if (splits[2]) {
        splits[2] = flipCapitalization(splits[2]);
        const arr = splits[2].split('');
        arr.sort();
        splits[2] = arr.join('');
      }
      if (splits[3]) {
        const m = /^([a-h])([1-8])$/.test(splits[3]);
        if (m) {
          splits[3] = m[1] + (9 - (+m[2]));
        }
      }
      return splits.join(' ');
    }

    static simpleMaterial(node, isTotal, side) {
      let result = 0;
      if (!node.fen) return result;
      const board = node.fen.split(' ')[0];
      for (const ch of board) {
        const p = ChessMetrics.pieceMaterial[ch.toLowerCase()];
        if (p) {
          const m = ch === ch.toUpperCase() ? 1 : -1;
          if (!side || side == m) {
            result += isTotal
              ? p
              : m * p;
          }
        }
      }
      return result;
    }

    static onBoard(x, y) {
      return x >= 0 && x < 8 && y >= 0 && y < 8;
    }

    static pieceTension(x, y, board, withSupport) {
      const underAttack = [];
      const ch = board[y][x];
      if (!ch) return underAttack;
      const m = ch === ch.toUpperCase() ? 1 : -1;
      switch (ch.toLowerCase()) {
        case 'k':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (!dx && !dy) continue;
              if (!ChessMetrics.onBoard(x + dx, y + dy)) continue;
              const pc = board[y + dy][x + dx];
              if (!pc) continue;
              const pm = pc === pc.toUpperCase() ? 1 : -1;
              if (m != pm) {
                underAttack.push({
                  m: m,
                  sx: x,
                  sy: y,
                  spc: ch,
                  x: x + dx,
                  y: y + dy,
                  pc: pc
                });
              }
            }
          }
          break;
        case 'q':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (!dx && !dy) continue;
              const isDiagonal = dx && dy;
              const isForward = dy === -m;
              for (let i = 1; i < 8; i++) {
                if (!ChessMetrics.onBoard(x + dx * i, y + dy * i)) break;
                const pc = board[y + dy * i][x + dx * i];
                if (!pc) continue;
                const pm = pc === pc.toUpperCase() ? 1 : -1;
                if (m != pm) {
                  underAttack.push({
                    m: m,
                    sx: x,
                    sy: y,
                    spc: ch,
                    x: x + dx * i,
                    y: y + dy * i,
                    pc: pc
                  });
                } else if (withSupport) {
                  if (pc.toLowerCase() === 'q') continue;
                  if (isDiagonal && pc.toLowerCase() === 'b') continue;
                  if (!isDiagonal && pc.toLowerCase() === 'r') continue;
                  if ((isForward && pc.toLowerCase() === 'p') || pc.toLowerCase() === 'k') {
                    const ppc = ChessMetrics.onBoard(x + dx * (i + 1), y + dy * (i + 1)) && board[y + dy * (i + 1)][x + dx * (i + 1)];
                    if (ppc) {
                      const ppm = ppc === ppc.toUpperCase() ? 1 : -1;
                      if (m != ppm) {
                        underAttack.push({
                          m: m,
                          sx: x,
                          sy: y,
                          spc: ch,
                          x: x + dx * (i + 1),
                          y: y + dy * (i + 1),
                          pc: pc
                        });
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        case 'r':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if ((dx && dy) || (!dx && !dy)) continue;
              for (let i = 1; i < 8; i++) {
                if (!ChessMetrics.onBoard(x + dx * i, y + dy * i)) break;
                const pc = board[y + dy * i][x + dx * i];
                if (!pc) continue;
                const pm = pc === pc.toUpperCase() ? 1 : -1;
                if (m != pm) {
                  underAttack.push({
                    m: m,
                    sx: x,
                    sy: y,
                    spc: ch,
                    x: x + dx * i,
                    y: y + dy * i,
                    pc: pc
                  });
                } else if (withSupport) {
                  if (pc.toLowerCase() === 'q') continue;
                  if (pc.toLowerCase() === 'r') continue;
                  if (pc.toLowerCase() === 'k') {
                    const ppc = ChessMetrics.onBoard(x + dx * (i + 1), y + dy * (i + 1)) && board[y + dy * (i + 1)][x + dx * (i + 1)];
                    if (ppc) {
                      const ppm = ppc === ppc.toUpperCase() ? 1 : -1;
                      if (m != ppm) {
                        underAttack.push({
                          m: m,
                          sx: x,
                          sy: y,
                          spc: ch,
                          x: x + dx * (i + 1),
                          y: y + dy * (i + 1),
                          pc: pc
                        });
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        case 'b':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (!dx || !dy) continue;
              const isForward = dy === -m;
              for (let i = 1; i < 8; i++) {
                if (!ChessMetrics.onBoard(x + dx * i, y + dy * i)) break;;
                const pc = board[y + dy * i][x + dx * i];
                if (!pc) continue;
                const pm = pc === pc.toUpperCase() ? 1 : -1;
                if (m != pm) {
                  underAttack.push({
                    m: m,
                    sx: x,
                    sy: y,
                    spc: ch,
                    x: x + dx * i,
                    y: y + dy * i,
                    pc: pc
                  });
                } else if (withSupport) {
                  if (pc.toLowerCase() === 'q') continue;
                  if (pc.toLowerCase() === 'b') continue;
                  if ((isForward && pc.toLowerCase() === 'p') || pc.toLowerCase() === 'k') {
                    const ppc = ChessMetrics.onBoard(x + dx * (i + 1), y + dy * (i + 1)) && board[y + dy * (i + 1)][x + dx * (i + 1)];
                    if (ppc) {
                      const ppm = ppc === ppc.toUpperCase() ? 1 : -1;
                      if (m != ppm) {
                        underAttack.push({
                          m: m,
                          sx: x,
                          sy: y,
                          spc: ch,
                          x: x + dx * (i + 1),
                          y: y + dy * (i + 1),
                          pc: pc
                        });
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        case 'n':
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (!dx || !dy) continue;
              if (ChessMetrics.onBoard(x + dx * 1, y + dy * 2)) {
                const pc = board[y + dy * 2][x + dx * 1];
                if (pc) {
                  const pm = pc === pc.toUpperCase() ? 1 : -1;
                  if (m != pm) {
                    underAttack.push({
                      m: m,
                      sx: x,
                      sy: y,
                      spc: ch,
                      x: x + dx * 1,
                      y: y + dy * 2,
                      pc: pc
                    });
                  }
                }
              }
              if (ChessMetrics.onBoard(x + dx * 2, y + dy * 1)) {
                const pc = board[y + dy * 1][x + dx * 2];
                if (pc) {
                  const pm = pc === pc.toUpperCase() ? 1 : -1;
                  if (m != pm) {
                    underAttack.push({
                      m: m,
                      sx: x,
                      sy: y,
                      spc: ch,
                      x: x + dx * 2,
                      y: y + dy * 1,
                      pc: pc
                    });
                  }
                }
              }
            }
          }
          break;
        case 'p':
          if (ChessMetrics.onBoard(x - 1, y - m)) {
            const pc = board[y - m][x - 1];
            if (pc) {
              const pm = pc === pc.toUpperCase() ? 1 : -1;
              if (m != pm) {
                underAttack.push({
                  m: m,
                  sx: x,
                  sy: y,
                  spc: ch,
                  x: x - 1,
                  y: y - m,
                  pc: pc
                });
              }
            } else if (board.enpassant && board.enpassant.x == x - 1 && board.enpassant.y == y - m) {
              const pm = -m;
              underAttack.push({
                m: m,
                sx: x,
                sy: y,
                spc: ch,
                x: x - 1,
                y: y - m,
                pc: pm == 1 ? 'P' : 'p'
              });
            }
          }
          if (ChessMetrics.onBoard(x + 1, y - m)) {
            const pc = board[y - m][x + 1];
            if (pc) {
              const pm = pc === pc.toUpperCase() ? 1 : -1;
              if (m != pm) {
                underAttack.push({
                  m: m,
                  sx: x,
                  sy: y,
                  spc: ch,
                  x: x + 1,
                  y: y - m,
                  pc: pc
                });
              }
            } else if (board.enpassant && board.enpassant.x == x + 1 && board.enpassant.y == y - m) {
              const pm = -m;
              underAttack.push({
                m: m,
                sx: x,
                sy: y,
                spc: ch,
                x: x + 1,
                y: y - m,
                pc: pm == 1 ? 'P' : 'p'
              });
            }
          }
          break;
      }
      return underAttack;
    }

    static tensionCache = new LiChessTools.MaxSizedMap(10000);

    static tension(node, lt) {
      const fen = node.fen;
      let result = ChessMetrics.tensionCache.get(fen);
      if (result) return result;
      const board = lt.getBoardFromFen(node.fen);
      const underAttack = [];
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const ua = ChessMetrics.pieceTension(x, y, board, true);
          underAttack.push.apply(underAttack, ua);
        }
      }
      result = [...new Set(underAttack.map(i => i.x + ',' + i.y + '=' + i.pc))]
                  .map(i => i.split('=')[1].toLowerCase())
                  .reduce((acc, val) => ChessMetrics.pieceMaterial[val] + acc, 0);
      ChessMetrics.tensionCache.set(fen, result);
      return result;
    }

    static capturingMoveCache = new LiChessTools.MaxSizedMap(10000);

    static getAllCapturingMoves(board, lt) {
      const fen = lt.getFenFromBoard(board);
      let result = ChessMetrics.capturingMoveCache.get(fen);
      if (result) return result;
      result = [];
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const ua = ChessMetrics.pieceTension(x, y, board, false);
          result.push.apply(result, ua);
        }
      }
      ChessMetrics.capturingMoveCache.set(fen, result);
      return result;
    }

    static materialWonCache = new LiChessTools.MaxSizedMap(10000);

    static materialWon(board, x, y, lt) {
      const Math = lt.global.Math;
      const key = [lt.getFenFromBoard(board), x, y].join('|');
      let result = ChessMetrics.materialWonCache.get(key);
      if (result) return result;
      board = lt.clone(board);
      const ch = board[y][x];
      if (!ch) return 0;
      const side = ch === ch.toUpperCase() ? -1 : 1;
      const moves = ChessMetrics.getAllCapturingMoves(board, lt)
        .filter(m => m.x == x && m.y == y && m.m == side)
        .sort((m1, m2) => ChessMetrics.pieceMaterial[m1.spc.toLowerCase()] - ChessMetrics.pieceMaterial[m2.spc.toLowerCase()]);
      const move = moves[0];
      if (!move) return 0;
      result = ChessMetrics.pieceMaterial[ch.toLowerCase()] * side; //capture piece
      board[y][x] = move.spc;
      board[move.sy][move.sx] = null;
      result += ChessMetrics.materialWon(board, x, y, lt);
      result = Math.sign(result) != side ? 0 : result;
      ChessMetrics.materialWonCache.set(key, result);
      return result;
    }

    static maxMaterialWonCache = new LiChessTools.MaxSizedMap(10000);

    static maxMaterialWon(board, m, lt) {
      const Math = lt.global.Math;
      const key = [lt.getFenFromBoard(board), m].join('|');
      let result = ChessMetrics.maxMaterialWonCache.get(key);
      if (result) return result;
      let mx = 0;
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const ch = board[y][x];
          if (!ch) continue; // no piece
          const pm = ch === ch.toUpperCase() ? 1 : -1;
          if (pm == m) continue; // wrong turn
          const mw = ChessMetrics.materialWon(board, x, y, lt);
          if (Math.sign(mw) == m && Math.abs(mw) > mx) {
            mx = Math.abs(mw);
          }
        }
      }
      result = mx * m;
      ChessMetrics.maxMaterialWonCache.set(key, result);
      return result;
    }

    static getGamePhase(fen, lt) {
      const board = lt.getBoardFromFen(fen);
      if (!board) return 'opening';

      const majorsAndMinors = (board) => {
        return board
                 .flat()
                 .filter(p => 'rnbq'.includes(p.toLowerCase()))
                 .length;
      };

      const backrankSparse = (board) => {
        return board[0].filter(p => p).length < 4
               || board[7].filter(p => p).length < 4;
      };

      const score = (y) => {
        return (white, black) => {
          const w = Number(white);
          const b = Number(black);

          switch (true) {
            case w === 0 && b === 0: return 0;
            case w === 1 && b === 0: return 1 + (8 - y);
            case w === 2 && b === 0: return y > 2 ? 2 + (y - 2) : 0;
            case w === 3 && b === 0: return y > 1 ? 3 + (y - 1) : 0;
            case w === 4 && b === 0: return y > 1 ? 3 + (y - 1) : 0;
            case w === 0 && b === 1: return 1 + y;
            case w === 1 && b === 1: return 5 + Math.abs(4 - y);
            case w === 2 && b === 1: return 4 + (y - 1);
            case w === 3 && b === 1: return 5 + (y - 1);
            case w === 0 && b === 2: return y < 6 ? 2 + (6 - y) : 0;
            case w === 1 && b === 2: return 4 + (7 - y);
            case w === 2 && b === 2: return 7;
            case w === 0 && b === 3: return y < 7 ? 3 + (7 - y) : 0;
            case w === 1 && b === 3: return 5 + (7 - y);
            case w === 0 && b === 4: return y < 7 ? 3 + (7 - y) : 0;
            default: return 0;
          }
        };
      };

      const mixednessRegions = [];
      for (let y = 0; y <= 6; ++y) {
        for (let x = 0; x <= 6; ++x) {
          mixednessRegions.push({ x, y });
        }
      }

      const countInSquare = (board, topX, topY) => {
        let white = 0, black = 0;
        for (let dy = 0; dy < 2; ++dy) {
          for (let dx = 0; dx < 2; ++dx) {
            const piece = board[topY + dy][topX + dx];
            if (!piece) continue;
            if (piece === piece.toUpperCase()) ++white;
            else                               ++black;
          }
        }
        return [white, black];
      };

      const mixedness = (board) => {
        return mixednessRegions.reduce((acc, region) => {
          const [w, b] = countInSquare(board, region.x, region.y);
          return acc + score(7 - region.y)(w, b);
        }, 0);
      };

      const mm = majorsAndMinors(board);
      const bs = backrankSparse(board);
      const mx = mixedness(board);

      if (mm <= 6) return 'endGame';
      if (mm <= 10 || bs || mx > 150) return 'middleGame';
      return 'opening';
    }

    static getStructure(board, blackOrientation) {
      if (!board) return null;
      const result = {
        pawns: {
          'w': new Array(8).fill(-1),
          'b': new Array(8).fill(-1)
        },
        led: {
          'w': new Array(8).fill(false),
          'b': new Array(8).fill(false)
        },
        islands: { w: [], b: [] },
        qSide: { 'w': 0, 'b': 0 },
        kSide: { 'w': 0, 'b': 0 }
      };
      for (let y = 0; y < 8; y++) {
        const rank = board[y];
        for (let x = 0; x < 8; x++) {
          switch (rank[x]) {
            case 'p':
              if (y <= 4) {
                if (result.pawns.b[x] > -1) result.led.b[x] = true;
                result.pawns.b[x] = y - 1;
              }
              break;
            case 'P':
              if (y >= 3) {
                if (result.pawns.w[x] > -1) result.led.w[x] = true;
                result.pawns.w[x] = 6 - y;
              }
              break;
          }
        }
      }

      const buildIslands = (color) => {
        const ps = result.pawns[color];
        const list = result.islands[color];
        let current = null;
        for (let x = 0; x < 8; x++) {
          if (ps[x] === -1) {
            current = null;
            continue;
          }
          if (current && current.end === x - 1) {
            current.end = x;
          } else {
            current = { start: x, end: x };
            list.push(current);
          }
        }
      };

      buildIslands('w');
      buildIslands('b');

      const calcSide = (color) => {
        const list = result.islands[color];
        if (list.length === 0) return;

        const first = list[0];
        if (first.start < 2) {
          result.qSide[color] = Math.min(3, first.end) - first.start + 1;
        }

        const last = list[list.length - 1];
        if (last.end > 5) {
          result.kSide[color] = last.end - Math.max(4, last.start) + 1;
        }
      };

      calcSide('w');
      calcSide('b');

      const [ me, they ] = blackOrientation ? ['b','w'] : ['w','b'];
      const toChar = (s)=>{
        if (s==' ') return s;
        if (s=='Q') {
          const mv=result.qSide[me];
          const mt=result.qSide[they];
          return mv>mt ? 'M' : mv<mt ? 'T' : 'X';
        }
        if (s=='K') {
          const mv=result.kSide[me];
          const mt=result.kSide[they];
          return mv>mt ? 'M' : mv<mt ? 'T' : 'X';
        }
        if (s.startsWith('P')) {
          const v=result.pawns[s[1]=='M'?me:they][+s[2]];
          return v<0 ? 'X' : v;
        }
        if (s.startsWith('L')) {
          const v=result.led[s[1]=='M'?me:they][+s[2]];
          return v ? 'L' : 'X';
        }
        throw new Error('Unknown primitive: '+s);
      };
      const structureText = [
        'PM3','PM4','PM2','PT3','PT4','PT2','Q','K',' ',
        'PM5','PM1','PM6','PT5','PT1','PT6',' ',
        'PM0','PM7','PT0','PT7',' ',
        'LM3','LM4','LM2','LT3','LT4','LT2',' ',
        'LM5','LM1','LM6','LT5','LT1','LT6',' ',
        'LM0','LM7','LT0','LT7',
      ].map(toChar).join('');
      return structureText;
    }

    static keySimilarityDirect(kSearch, kNamed) {
      kSearch = kSearch.replaceAll(' ', '');
      kNamed = kNamed.replaceAll(' ', '');
      const l = Math.min(kSearch.length, kNamed.length);
      let sim = 0;
      let prefixOver = false;
      for (let i = 0; i < l; i++) {
        if (kSearch[i] == kNamed[i]) {
          sim += prefixOver ? 0.8 : 1;
        } else {
          prefixOver = true;
          const pSearch = +kSearch[i];
          const pNamed = +kNamed[i];
          if (pSearch >= 0 && pNamed >= 0 && pSearch < pNamed) {
            sim += 0.2;
          }
        }
      }
      return Math.round(sim * 100 / l);
    }

    static keyCache = {};

    static keySimilarity(kSearch, kNamed) {
      const k = kSearch + '|' + kNamed;
      let result = ChessMetrics.keyCache[k];
      if (!result) {
        result = ChessMetrics.keySimilarityDirect(kSearch, kNamed);
        ChessMetrics.keyCache[k] = result;
      }
      return result;
    }

    static getOpposingStructure(structure) {
      const result =
        structure.substr(3, 3) +
        structure.substr(0, 3) +
        structure.substr(6, 2).replaceAll('M', 'x').replaceAll('T', 'M').replaceAll('x', 'T') +
        ' ' +
        structure.substr(12, 3) +
        structure.substr(9, 3) +
        ' ' +
        structure.substr(18, 2) +
        structure.substr(16, 2) +
        ' ' +
        structure.substr(24, 3) +
        structure.substr(21, 3) +
        ' ' +
        structure.substr(31, 3) +
        structure.substr(28, 3) +
        ' ' +
        structure.substr(37, 2) +
        structure.substr(35, 2);
      return result;
    }

    static range(start, end, step) {
      if (start == end) return [start];
      if (!step) step = end > start ? 1 : -1;
      return Array.from(
        { length: Math.floor((end - start) / step) + 1 },
        (_, i) => start + i * step
      );
    }

    static getWeakSquares(board, isWhite) {
      const result = [];
      const pawn = isWhite ? 'P' : 'p';
      const opponentPawn = isWhite ? 'p' : 'P';
      const dy = isWhite ? -1 : 1;
      for (let x = 0; x < 8; x++) {
        const candidates = [];
        for (let y = 0; y < 8; y++) {
          const p = board[y][x];
          if (!p) {
            if ((isWhite || y > 1) && (!isWhite || y < 6) && board[y - dy][x] == pawn) {
              candidates.push(y);
            } else
            if ((isWhite || y < 4) && (!isWhite || y > 3) && (board[y + dy]?.[x + 1] == opponentPawn || board[y + dy]?.[x - 1] == opponentPawn)) {
              candidates.push(y);
            }
          }
        }
        for (const c of candidates) {
          let weak = true;
          const ys = isWhite ? (c < 6 ? ChessMetrics.range(c + 1, 6) : []) : (c > 1 ? ChessMetrics.range(c - 1, 1) : []);
          for (const y of ys) {
            if (board[y][x - 1] == pawn || board[y][x + 1] == pawn) {
              weak = false;
              break;
            }
          }
          if (weak) result.push({ x: x, y: c });
        }
      }
      return result;
    }

    static getPawns(board, isWhite) {
      const pawn = isWhite ? 'P' : 'p';
      const myPawns = [];
      const theirPawns = [];
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const p = board[y][x];
          if (p?.toLowerCase() == 'p') {
            if (p == pawn) {
              myPawns.push({ x, y });
            } else {
              theirPawns.push({ x, y });
            }
          }
        }
      }
      const files = ChessMetrics.range(0, 7).filter(x => myPawns.find(p => p.x == x));
      files.filter(f => !files.includes(f - 1) && !files.includes(f + 1))
           .forEach(f => myPawns.filter(p => p.x == f).forEach(p => p.isolated = true));

      myPawns
        .filter(p => p.x > 1 && p.x < 6 && (isWhite || p.y > 1) && (!isWhite || p.y < 6))
        .forEach(p => {
          let surroundingPawns = [];
          if (!files.includes(p.x - 1) && !files.includes(p.x + 2)) {
            surroundingPawns = myPawns.filter(mp => mp != p && mp.x == p.x + 1);
          } else
          if (!files.includes(p.x + 1) && !files.includes(p.x - 2)) {
            surroundingPawns = myPawns.filter(mp => mp != p && mp.x == p.x - 1);
          }
          if (surroundingPawns.length != 1) return;
          const op = surroundingPawns[0];
          if (op.x <= 1 || op.x >= 6 || op.y != p.y) return;
          p.hanging = true;
        });

      myPawns.forEach(p => {
        const dy = isWhite ? -1 : 1;
        if (board[p.y + dy][p.x]) return;
        const ys = isWhite ? (p.y < 7 ? ChessMetrics.range(p.y, 7) : []) : (p.y > 1 ? ChessMetrics.range(p.y, 1) : []);
        if (myPawns.find(mp => ys.includes(mp.y) && ((mp.x == p.x + 1) || (mp.x == p.x - 1)))) return;
        if (theirPawns.find(mp => mp.y == p.y + dy * 2 && ((mp.x == p.x + 1) || (mp.x == p.x - 1)))) p.backward = true;
      });

      return myPawns;
    }

    static getPawnBreaks(board, isWhite) {
      const pawn = isWhite ? 'P' : 'p';
      const myPawns = [];
      const theirPawns = [];
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const p = board[y][x];
          if (p?.toLowerCase() == 'p') {
            if (p == pawn) {
              myPawns.push({ x, y });
            } else {
              theirPawns.push({ x, y });
            }
          }
        }
      }
      myPawns.forEach(p => {
        const dests = [];
        const dy = isWhite ? -1 : 1;
        if (!board[p.y + dy][p.x]) {
          dests.push({ x: p.x, y: p.y + dy });
          if (p.y == (isWhite ? 6 : 1) && !board[p.y + dy * 2][p.x]) dests.push({ x: p.x, y: p.y + dy * 2 });
        }
        for (const dest of dests) {
          if ([-1, 1].find(dx => myPawns.find(mp => mp.x == dest.x + dx && mp.y == dest.y) && theirPawns.find(tp => tp.x == dest.x + dx && tp.y == dest.y + dy))) {
            (p.breaks ||= []).push(dest);
          }
        }
      });

      return myPawns.filter(p => p.breaks?.length);
    }
  }

  LiChessTools.ChessMetrics = ChessMetrics;

  class ChessPositionEvaluator {
    constructor(fen) {
      this.board = this.parseFEN(fen);
      this.movesCache = new Map();
      this.pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
      this.centralSquares = [27, 28, 35, 36]; // d4, d5, e4, e5
    }
  
    // Parse FEN string to 8x8 board array
    parseFEN(fen) {
      const board = Array(64).fill(null);
      const position = fen.split(' ')[0];
      let square = 0;
      for (const char of position) {
        if (square >= board.length) break;
        if (char === '/') continue;
        if (/\d/.test(char)) {
          square += parseInt(char);
        } else {
          board[square] = char;
          square++;
        }
      }
      return board;
    }
  
    // Normalize a score to [-1, 1]
    normalize(score, min, max, area) {
      if (score >= max) {
        return 1;
      }
      if (score <= min) {
        return -1;
      }
      const normalized = (2 * (score - min)) / (max - min) - 1;
      return normalized;
    }
  
    // King Safety (K)
    evaluateKingSafety() {
      let whiteScore = 0, blackScore = 0;
      const whiteKingIdx = this.board.indexOf('K');
      const blackKingIdx = this.board.indexOf('k');
      if (whiteKingIdx === -1 || blackKingIdx === -1) return 0;
  
      // Pawn shield (pawns in front of king)
      const whitePawnShield = this.getPawnShield(whiteKingIdx, true);
      const blackPawnShield = this.getPawnShield(blackKingIdx, false);
      whiteScore += whitePawnShield * 2;
      blackScore += blackPawnShield * 2;
  
      // Open files near king
      const whiteOpenFiles = this.getOpenFilesNearKing(whiteKingIdx, true);
      const blackOpenFiles = this.getOpenFilesNearKing(blackKingIdx, false);
      whiteScore -= whiteOpenFiles * 1.5;
      blackScore -= blackOpenFiles * 1.5;
  
      // Enemy pieces near king
      const whiteThreats = this.getEnemyThreats(whiteKingIdx, true);
      const blackThreats = this.getEnemyThreats(blackKingIdx, false);
      whiteScore -= whiteThreats * 1;
      blackScore -= blackThreats * 1;

      // Hole detection: squares that can never be attacked by friendly pawns
      const whiteHoles = this.getKingHoles(whiteKingIdx, true);
      const blackHoles = this.getKingHoles(blackKingIdx, false);
      whiteScore -= whiteHoles * 0.5;  // Penalize 1 point per hole
      blackScore -= blackHoles * 0.5;
  
      const diff = whiteScore - blackScore;
      return this.normalize(diff, -15, 15,'K'); //max is ~-10, but it can go to -25
    }
  
    getPawnShield(kingIdx, isWhite) {
      const rank = Math.floor(kingIdx / 8);
      const file = kingIdx % 8;
      let score = 0;
      const offsets = isWhite ? [-9, -8, -7] : [7, 8, 9]; // Adjacent squares in front
      for (const offset of offsets) {
        const idx = kingIdx + offset;
        if (idx >= 0 && idx < 64 && Math.abs((idx % 8) - file) <= 1) {
          const piece = this.board[idx];
          if ((isWhite && piece === 'P') || (!isWhite && piece === 'p')) score += 1;
        }
      }
      return score;
    }
  
    getOpenFilesNearKing(kingIdx, isWhite) {
      const file = kingIdx % 8;
      let openFiles = 0;
      for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
        let hasPawn = false;
        for (let r = 0; r < 8; r++) {
          const idx = r * 8 + f;
          if ((isWhite && this.board[idx] === 'P') || (!isWhite && this.board[idx] === 'p')) {
            hasPawn = true;
            break;
          }
        }
        if (!hasPawn) openFiles++;
      }
      return openFiles;
    }
  
    getEnemyThreats(kingIdx, isWhite) {
      const file = kingIdx % 8;
      const rank = Math.floor(kingIdx / 8);
      let threats = 0;
      for (let r = Math.max(0, rank - 2); r <= Math.min(7, rank + 2); r++) {
        for (let f = Math.max(0, file - 2); f <= Math.min(7, file + 2); f++) {
          const idx = r * 8 + f;
          const piece = this.board[idx];
          if (piece && piece !== 'K' && piece !== 'k') {
            const isEnemy = isWhite ? /[a-z]/.test(piece) : /[A-Z]/.test(piece);
            if (isEnemy) threats += this.pieceValues[piece.toLowerCase()] || 0;
          }
        }
      }
      return threats / 10;
    }

    getKingHoles(kingIdx, isWhite) {
      const file = kingIdx % 8;
      const rank = Math.floor(kingIdx / 8);
      let holes = 0;
      for (let r = Math.max(0, rank - 1); r <= Math.min(7, rank + 1); r++) {
        for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
          if (r === rank && f === file) continue;
          if (isWhite && r <= 1) continue;
          if (!isWhite && r >= 6) continue;
          const idx = r * 8 + f;
          if (!this.canEverBeAttackedByPawn(idx, isWhite)) holes++;
        }
      }
      return holes;
    }

    canEverBeAttackedByPawn(idx, isWhite) {
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const pawnRank = isWhite ? rank - 1 : rank + 1; // Rank where pawn would attack from

      if (pawnRank < 0 || pawnRank > 7) return false;

      const friendlyPawn = isWhite ? 'P' : 'p';
      for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
        if (f === file) continue;
        const pawnIdx = pawnRank * 8 + f;
        if (this.board[pawnIdx] === friendlyPawn) return true;
      }
      return false;
    }

    // Material (M)
    evaluateMaterial() {
      let whiteMaterial = 0, blackMaterial = 0;
      let whiteBishops = 0, blackBishops = 0;
      let whiteKnights = 0, blackKnights = 0;
      let whiteRooks = 0, blackRooks = 0;
      for (const piece of this.board) {
        switch(piece) {
          case 'B': whiteBishops++; break;
          case 'b': blackBishops++; break;
          case 'N': whiteKnights++; break;
          case 'n': blackKnights++; break;
          case 'R': whiteRooks++; break;
          case 'r': blackRooks++; break;
        }

        const value = this.pieceValues[piece?.toLowerCase()] || 0;
        if (/[A-Z]/.test(piece)) {
          whiteMaterial += value;
        } else {
          blackMaterial += value;
        }
      }

      // bishop pair
      if (whiteBishops == 2) whiteMaterial += 0.3;
      if (blackBishops == 2) blackMaterial += 0.3;

      // Minor piece vs. rook imbalance penalty
      if (whiteRooks === 1 && whiteBishops + whiteKnights >= 2 && blackRooks === 0) whiteMaterial -= 0.2;
      if (blackRooks === 1 && blackBishops + blackKnights >= 2 && whiteRooks === 0) blackMaterial -= 0.2;

      const diff = whiteMaterial - blackMaterial;
      return this.normalize(diff, -10, 10,'M'); // Max ~39, but 10 is decisive
    }
  
    // Piece Activity (A)
    evaluatePieceActivity() {
      let whiteScore = 0, blackScore = 0;
  
      // Mobility: Count pseudo-legal moves (simplified)
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (!piece) continue;
        const isWhite = /[A-Z]/.test(piece);
        const moves = this.getPseudoLegalMoves(i, piece);
        if (isWhite) {
          whiteScore += moves.length * 0.1;
        } else {
          blackScore += moves.length * 0.1;
        }
      }

      // Bonus for rooks and queens on open files
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (!piece) continue;
        const isWhite = /[A-Z]/.test(piece);
        const type = piece.toLowerCase();
        if (type === 'r' || type === 'q') {
          const file = i % 8;
          if (this.isOpenFile(file)) {
            if (isWhite) {
              whiteScore += 0.3;
            } else {
              blackScore += 0.3;
            }
          }
        }
      }

     // Knight outpost bonus
     const outpostSquares = [19, 20, 27, 28, 35, 36, 43, 44]; // c4, c5, d4, d5, e4, e5, f4, f5
     for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (piece?.toLowerCase() !== 'n') continue;
        const isWhite = /[A-Z]/.test(piece);
        const rank = Math.floor(i / 8);
        const file = i % 8;
        if (outpostSquares.includes(i)) { // Knight on d4, d5, e4, e5
          const pawnSupport = (isWhite
            ? (file > 0 && this.board[(rank + 1) * 8 + file - 1] === 'P') || (file < 7 && this.board[(rank + 1) * 8 + file + 1] === 'P')
            : (file > 0 && this.board[(rank - 1) * 8 + file - 1] === 'p') || (file < 7 && this.board[(rank - 1) * 8 + file + 1] === 'p'));
          const enemyPawnAttack = this.canEverBeAttackedByPawn(i, !isWhite);
          if (!enemyPawnAttack) {
            if (isWhite) {
              whiteScore += pawnSupport ? 0.3 : 0.15; // Full bonus with support, half without
            } else {
              blackScore += pawnSupport ? 0.3 : 0.15;
            }
          }
        }
      }

      // Central control
      for (const centerIdx of this.centralSquares) {
        let whiteAttacks = 0, blackAttacks = 0;
        for (let i = 0; i < 64; i++) {
          const piece = this.board[i];
          if (!piece) continue;
          const isWhitePiece = /[A-Z]/.test(piece);
          if (piece.toLowerCase() === 'p') {
            // Pawn attacks
            const attacks = this.getPawnAttacks(i, isWhitePiece);
            if (attacks.includes(centerIdx)) {
              if (isWhitePiece) {
                whiteAttacks++;
              } else {
                blackAttacks++;
              }
            }
          } else {
            // Other pieces use pseudo-legal moves
            const moves = this.getPseudoLegalMoves(i, piece);
            if (moves.includes(centerIdx)) {
              if (isWhitePiece) {
                whiteAttacks++;
              } else {
                blackAttacks++;
              }
            }
          }
        }
        // Award bonus if more attackers
        if (whiteAttacks > blackAttacks) {
          whiteScore += 0.5;
        } else if (blackAttacks > whiteAttacks) {
          blackScore += 0.5;
        }
      }

      // Diagonal control
      const longDiagonals = [
        [0, 9, 18, 27, 36, 45, 54, 63], // a1-h8
        [7, 14, 21, 28, 35, 42, 49, 56] // a8-h1
      ];

      for (const diagonal of longDiagonals) {
        let whiteAttacks = 0, blackAttacks = 0;
        let whitePieceOnDiagonal = false, blackPieceOnDiagonal = false;

        // Check for pieces directly on the diagonal
        for (const idx of diagonal) {
          const piece = this.board[idx];
          if (!piece) continue;
          const isWhite = /[A-Z]/.test(piece);
          const type = piece.toLowerCase();
          if (type === 'b' || type === 'q') {
            if (isWhite) whitePieceOnDiagonal = true;
            else blackPieceOnDiagonal = true;
          }
        }

        // Check for pieces controlling the diagonal
        for (let i = 0; i < 64; i++) {
          const piece = this.board[i];
          if (!['b','q'].includes(piece?.toLowerCase())) continue; // Only bishops and queens
          const isWhite = /[A-Z]/.test(piece);
          const moves = this.getPseudoLegalMoves(i, piece, true); // Use control moves
          for (const idx of diagonal) {
            if (moves.includes(idx)) {
              if (isWhite) whiteAttacks++;
              else blackAttacks++;
            }
          }
        }

        // Scoring
        if (whitePieceOnDiagonal) whiteScore += 0.3; // Bonus for bishop/queen on diagonal
        if (blackPieceOnDiagonal) blackScore += 0.3;
        whiteScore += whiteAttacks * 0.1; // Bonus for each controlled square
        blackScore += blackAttacks * 0.1;
      }  

      // Threats
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (!piece) continue;
        const isWhite = /[A-Z]/.test(piece);
        const moves = piece.toLowerCase() === 'p'
          ? this.getPawnAttacks(i, isWhite).concat(this.getPseudoLegalMoves(i, piece))
          : this.getPseudoLegalMoves(i, piece);
        const oppKing = isWhite ? 'k' : 'K';
        const oppKingIdx = this.board.indexOf(oppKing);

        for (const move of moves) {
          const targetPiece = this.board[move];
          // Check for checks
          if (move === oppKingIdx) {
            if (isWhite) {
              whiteScore += 0.3; // Bonus for delivering check
            } else {
              blackScore += 0.3;
            }
          }
          // Check for captures
          if (targetPiece && (isWhite ? /[a-z]/.test(targetPiece) : /[A-Z]/.test(targetPiece))) {
            const value = this.pieceValues[targetPiece.toLowerCase()] || 0;
            if (isWhite) {
              whiteScore += value * 0.1; // Scaled capture value
            } else {
              blackScore += value * 0.1;
            }
          }
          // Check for promotion threats (pawns on 6th/2nd rank with clear path)
          if (piece.toLowerCase() === 'p') {
            const rank = Math.floor(i / 8);
            const file = i % 8;
            const dir = isWhite ? -1 : 1;
            const nextIdx = (rank + dir) * 8 + file;
            if ((isWhite && rank === 1) || (!isWhite && rank === 6)) {
              if (!this.board[nextIdx] || (this.board[nextIdx] && (isWhite ? /[a-z]/.test(this.board[nextIdx]) : /[A-Z]/.test(this.board[nextIdx])))) {
                if (isWhite) {
                  whiteScore += 0.4; // Bonus for promotion threat
                } else {
                  blackScore += 0.4;
                }
              }
            }
          }
        }
      }

      const diff = whiteScore - blackScore;
      return this.normalize(diff, -15, 15,'A'); // max is 22+, but decisive would be 15
    }

    getPawnAttacks(idx, isWhite) {
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const attacks = [];
      const dir = isWhite ? -1 : 1; // White attacks up, Black attacks down
      // Diagonal attacks
      const attackOffsets = [-1, 1]; // Left and right files
      for (const fOffset of attackOffsets) {
        const newFile = file + fOffset;
        const newRank = rank + dir;
        if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
          const attackIdx = newRank * 8 + newFile;
          attacks.push(attackIdx);
        }
      }
      return attacks;
    }
  
    getPseudoLegalMoves(idx, piece, control) {
      const cacheKey = `${piece}${idx}`;
      let result = this.movesCache.get(cacheKey);
      if (result) return result;

      const moves = [];
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const isWhite = /[A-Z]/.test(piece);
      const type = piece.toLowerCase();
  
      const directions = {
        r: [[0, 1], [0, -1], [1, 0], [-1, 0]],
        b: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
        q: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
        n: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
        k: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
      };
  
      if (type === 'p') {
        if (control) throw new Error('Should not use control=true for pawns');
        const dir = isWhite ? -1 : 1;
        const startRank = isWhite ? 6 : 1;
        // Forward move
        let newIdx = idx + dir * 8;
        if (newIdx >= 0 && newIdx < 64 && !this.board[newIdx]) {
          moves.push(newIdx);
          // Double move from starting rank
          if (rank === startRank) {
            newIdx += dir * 8;
            if (!this.board[newIdx]) moves.push(newIdx);
          }
        }
        // Captures
        for (const f of [-1, 1]) {
          newIdx = idx + dir * 8 + f;
          if (newIdx >= 0 && newIdx < 64 && Math.abs((newIdx % 8) - file) === 1) {
            if (this.board[newIdx] && (isWhite ? /[a-z]/.test(this.board[newIdx]) : /[A-Z]/.test(this.board[newIdx]))) {
              moves.push(newIdx);
            }
          }
        }
      } else if (directions[type]) {
        for (const [dr, df] of directions[type]) {
          let r = rank + dr;
          let f = file + df;
          let steps = type === 'n' || type === 'k' ? 1 : 7;
          while (steps-- && r >= 0 && r < 8 && f >= 0 && f < 8) {
            const newIdx = r * 8 + f;
            const target = this.board[newIdx];
            if (target) {
              const targetWhite = /[A-Z]/.test(target);
              if (targetWhite == isWhite && !control) break;
              moves.push(newIdx);
              break;
            }
            moves.push(newIdx);
            r += dr;
            f += df;
          }
        }
      }
  
      result = moves.filter(i => i >= 0 && i < 64);
      this.movesCache.set(cacheKey, result);
      return result;
    }

    isOpenFile(file) {
      for (let r = 0; r < 8; r++) {
        const idx = r * 8 + file;
        if (this.board[idx] === 'P' || this.board[idx] === 'p') return false;
      }
      return true;
    }
  
    // Pawn Structure (P)
    evaluatePawnStructure() {
      let whiteScore = 0, blackScore = 0;
  
      // Count pawns per file
      const whitePawns = Array(8).fill(0);
      const blackPawns = Array(8).fill(0);
      for (let i = 0; i < 64; i++) {
        if (this.board[i] === 'P') whitePawns[i % 8]++;
        if (this.board[i] === 'p') blackPawns[i % 8]++;
      }
  
      // Doubled pawns
      for (let f = 0; f < 8; f++) {
        if (whitePawns[f] > 1) whiteScore -= (whitePawns[f] - 1) * 0.5;
        if (blackPawns[f] > 1) blackScore -= (blackPawns[f] - 1) * 0.5;
      }
  
      // Isolated pawns
      for (let f = 0; f < 8; f++) {
        if (whitePawns[f]) {
          const isIsolated = !whitePawns[Math.max(0, f - 1)] && !whitePawns[Math.min(7, f + 1)];
          if (isIsolated) whiteScore -= 0.5;
        }
        if (blackPawns[f]) {
          const isIsolated = !blackPawns[Math.max(0, f - 1)] && !blackPawns[Math.min(7, f + 1)];
          if (isIsolated) blackScore -= 0.5;
        }
      }
  
      // Passed pawns
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (piece === 'P') { // White pawn
          if (this.isPassedPawn(i, true)) {
            const r = Math.floor(i / 8); // Row from 0 (rank 8) to 7 (rank 1)
            const advancedRows = 6 - r; // Rows advanced from starting row 6
            whiteScore += 0.2 * advancedRows;
          }
        } else if (piece === 'p') { // Black pawn
          if (this.isPassedPawn(i, false)) {
            const r = Math.floor(i / 8);
            const advancedRows = r - 1; // Rows advanced from starting row 1
            blackScore += 0.2 * advancedRows;
          }
        }
      }

      // Pawn islands
      const whiteIslands = this.countPawnIslands(whitePawns);
      const blackIslands = this.countPawnIslands(blackPawns);
      whiteScore -= (whiteIslands - 1) * 0.5;
      blackScore -= (blackIslands - 1) * 0.5;

      // Backward pawns
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (piece === 'P' && this.isBackwardPawn(i, true)) {
          whiteScore -= this.isOpenFile(i % 8) ? 0.5 : 0.3;
        }
        if (piece === 'p' && this.isBackwardPawn(i, false)) {
          blackScore -= this.isOpenFile(i % 8) ? 0.5 : 0.3;
        }
      }

      // Pawn chain bonus
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (piece?.toLowerCase() != 'p') continue;
        const isWhite = piece === 'P';
        const file = i % 8;
        const rank = Math.floor(i / 8);
        const supportOffsets = isWhite ? [9, 7] : [-9, -7]; // Diagonal support (e.g., c3 supports d4 for white)
        for (const offset of supportOffsets) {
          const supportIdx = i + offset;
          if (supportIdx >= 0 && supportIdx < 64 && Math.abs((supportIdx % 8) - file) === 1) {
            if (this.board[supportIdx] === piece) {
              if (isWhite) {
                whiteScore += 0.1; // Bonus for each supported pawn
              } else {
                blackScore += 0.1;
              }
            }
          }
        }
      }
      const diff = whiteScore - blackScore; //TODO should we take into account the number of the pawns?
      return this.normalize(diff, -7, 7,'P'); //max delta ~15.5, but average is ~7
    }
  
    isPassedPawn(idx, isWhite) {
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const direction = isWhite ? -1 : 1;
      for (let r = rank + direction; isWhite ? r >= 0 : r < 8; r += direction) {
        for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
          const checkIdx = r * 8 + f;
          if ((isWhite && this.board[checkIdx] === 'p') || (!isWhite && this.board[checkIdx] === 'P')) {
            return false;
          }
        }
      }
      return true;
    }

    countPawnIslands(pawns) {
      let islands = 0;
      let inIsland = false;
      for (let f = 0; f < 8; f++) {
        if (pawns[f] > 0) {
          if (!inIsland) {
            islands++;
            inIsland = true;
          }
        } else {
          inIsland = false;
        }
      }
      return islands;
    }

    canBeCaptured(idx, isWhite) {
      const oppPieces = isWhite ? /[a-z]/ : /[A-Z]/;
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (!piece || !oppPieces.test(piece)) continue;
        const isPawn = piece.toLowerCase() === 'p';
        const moves = isPawn
          ? this.getPawnAttacks(i, !isWhite)
          : this.getPseudoLegalMoves(i, piece);
        if (moves.includes(idx)) return true;
      }
      return false;
    }
   
    isBackwardPawn(idx, isWhite) {
      const file = idx % 8;
      const rank = Math.floor(idx / 8);
      const dir = isWhite ? -1 : 1;
      const nextRank = rank + dir;
      if (nextRank < 0 || nextRank > 7) return false;

      const forwardIdx = nextRank * 8 + file;
      if (this.board[forwardIdx]) return false; // Blocked

      if (this.canBeCaptured(forwardIdx, isWhite)) {
        const hasSupport = (file > 0 && this.board[rank * 8 + file - 1] === (isWhite ? 'P' : 'p')) ||
                           (file < 7 && this.board[rank * 8 + file + 1] === (isWhite ? 'P' : 'p'));
        return !hasSupport;
      }
      return false;
    }
  
    // Space Advantage (S)
    evaluateSpace() {
      let whiteScore = 0, blackScore = 0;
  
      // Count controlled squares in opponent's half
      const whiteControlled = new Set();
      const blackControlled = new Set();
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (!piece) continue;
        const isPawn = /p/i.test(piece);
        const isWhite = /[A-Z]/.test(piece);
        const moves = isPawn
                        ? this.getPawnAttacks(i, isWhite)
                        : this.getPseudoLegalMoves(i, piece, true);
        for (const move of moves) {
          const rank = Math.floor(move / 8);
          if (isWhite && rank <= 3) whiteControlled.add(move);
          if (!isWhite && rank >= 4) blackControlled.add(move);
        }
      }
      whiteScore += whiteControlled.size * 0.1;
      blackScore += blackControlled.size * 0.1;
  
      // Bonus for central pawns
      for (const idx of this.centralSquares) {
        if (this.board[idx] === 'P') whiteScore += 1;
        if (this.board[idx] === 'p') blackScore += 1;
      }

      // Penalty for cramped pieces
      for (let i = 0; i < 64; i++) {
        const piece = this.board[i];
        if (!piece || piece.toLowerCase() === 'k') continue; // Skip kings
        const isWhite = /[A-Z]/.test(piece);
        const moves = piece.toLowerCase() === 'p' 
          ? this.getPseudoLegalMoves(i, piece).concat(this.getPawnAttacks(i, isWhite))
          : this.getPseudoLegalMoves(i, piece);
        if (moves.length === 0) {
          const penalty = this.pieceValues[piece.toLowerCase()] || 1;
          if (isWhite) {
            whiteScore -= penalty * 0.1 + 0.2;
          } else {
            blackScore -= penalty * 0.1 + 0.2;
          }
        }
      }
  
      const diff = whiteScore - blackScore;
      return this.normalize(diff, -7, 7,'S'); //max is ~11, 7 should be decisive
    }
  
    // Main evaluation function
    async evaluate() {
      return {
        K: this.evaluateKingSafety(),
        M: this.evaluateMaterial(),
        A: this.evaluatePieceActivity(),
        P: this.evaluatePawnStructure(),
        S: this.evaluateSpace(),
      };
    }
  }

  LiChessTools.ChessPositionEvaluator = ChessPositionEvaluator;

  class ChessActivityEvaluator {
    constructor(board) {
      this.board = board;
      this.directions = {
        p: [], // handled separately
        n: [
          [1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]
        ],
        b: [[1,1],[1,-1],[-1,1],[-1,-1]],
        r: [[1,0],[-1,0],[0,1],[0,-1]],
        q: [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
        k: [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
      };
      this.pieceBaseMobility = {
        p: 3,
        n: 8,
        b: 13,
        r: 14,
        q: 27,
        k: 8
      };
    }
  
    SECONDARY = 0.2;
    CONTROLLED_BY_OPPONENT = 0.1;
    FREE = 1;
  
    inBounds(x, y) {
      return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
  
    getColor(piece) { 
      if (!piece) return 0;
      if (piece >= 'A' && piece <= 'Z') return 1;
      if (piece >= 'a' && piece <= 'z') return -1;
      throw new Error('piece '+piece+' not recognized');
    }
  
    getPieceType(piece) { return piece.toLowerCase(); }
  
    generateMoves(x, y) {
      const piece = this.board[y][x];
      if (!piece) return [];
      const color = this.getColor(piece);
      const type = this.getPieceType(piece);
      const moves = [];
  
      if (type === 'p') {
        const dir = -color;
        const ny = y + dir;
        if (this.inBounds(x, ny) && !this.board[ny][x]) {
          moves.push([x, ny]);
        }
        for (const dx of [-1, 1]) {
          const cx = x + dx;
          if (this.inBounds(cx, ny) && this.getColor(this.board[ny][cx])==-color) moves.push([cx, ny]);
        }
        return moves;
      }
  
      const dirs = this.directions[type];
      for (const [dx, dy] of dirs) {
        let nx = x + dx, ny = y + dy;
        if (['n', 'k'].includes(type)) {
          if (this.inBounds(nx, ny) && this.getColor(this.board[ny][nx])!=color) moves.push([nx, ny]);
        } else {
          while (this.inBounds(nx, ny) && this.getColor(this.board[ny][nx])!=color) {
            moves.push([nx, ny]);
            if (this.board[ny][nx]) break;
            nx += dx; ny += dy;
          }
        }
      }
      return moves;
    }
  
    computeControlMap() {
      const control = Array.from({ length: 8 }, () => Array(8).fill(0));
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const piece = this.board[y][x];
          if (!piece) continue;
          const color = this.getColor(piece);
          const moves = this.generateMoves(x, y);
          for (const [mx, my] of moves) {
            control[my][mx] += color;
          }
        }
      }
      return control;
    }
  
    evaluatePieceActivity(x, y, controlMap) {
      const piece = this.board[y][x];
      const type = this.getPieceType(piece);
      const color = this.getColor(piece);
      const moves = this.generateMoves(x, y);
  
      let score = 0;
      for (const [mx, my] of moves) {
        const control = controlMap[my][mx];
        score += control * color < 0 ? this.CONTROLLED_BY_OPPONENT : this.FREE;
      }
  
      // second-level mobility
      for (const [mx, my] of moves) {
        if (controlMap[my][mx] * color < 0) continue;
        const clone = this.cloneBoard();
        clone[my][mx] = piece;
        clone[y][x] = undefined;
        const sub = new ChessActivityEvaluator(clone);
        const subMoves = sub.generateMoves(mx, my);
        for (const [sx, sy] of subMoves) {
          if (controlMap[sy][sx] * color >= 0) score += this.SECONDARY;
        }
      }
  
      return score / this.pieceBaseMobility[type];
    }
  
    cloneBoard() {
      return this.board.map(r => r.slice());
    }
  
    evaluateAll() {
      const control = this.computeControlMap();
      const result = { white: [], black: [] };
  
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const piece = this.board[y][x];
          if (!piece) continue;
          const score = this.evaluatePieceActivity(x, y, control);
          const arr = this.getColor(piece)==1 ? result.white : result.black;
          arr.push({ piece, x, y, score });
        }
      }
      result.white.sort((a,b)=>a.score-b.score);
      result.black.sort((a,b)=>a.score-b.score);
  
      return result;
    }
  }

  LiChessTools.ChessActivityEvaluator = ChessActivityEvaluator;
})();
