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
 *   a.computeUberBrilliance()       // { score: 0..100, isBrilliant: score >= 70, type, label, inInterval, byType, disqualified }
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
    return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
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
  computeBrilliance(weights = this.types.sacrifice.weights, interval = this.types.sacrifice.interval, required = []) {
    const values = this.principles();
    let sum = 0, used = 0;
    const missing = [];
    for (const [name, w] of Object.entries(weights)) {
      if (!(name in values)) throw new Error('Unknown principle: ' + name);
      if (w < 0) throw new Error('Weights must not be negative: ' + name);
      if (!w) continue;
      if (values[name] == null) { missing.push(name); continue; }
      sum += w * values[name];
      used += w;
    }
    const applicable = required.every((n) => values[n] != null);
    const score = used ? sum / used : 0;
    const [lo, hi] = interval;
    const disqualified = this.disqualifiers();
    const inInterval = applicable && score >= lo && score <= hi;
    return { score, interval: [lo, hi], inInterval, applicable, disqualified, isBrilliant: inInterval && !disqualified.length, values, missing };
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
      byType[name] = { score: r.score, fit: r.applicable ? this._fit(r.score, r.interval, t.weights) : 0,
        inInterval: r.inInterval, applicable: r.applicable, missing: r.missing, priority: t.priority || 0, values: r.values };
    }
    const names = Object.keys(byType);
    const inside = names.filter((n) => byType[n].inInterval)
      .sort((a, b) => byType[b].priority - byType[a].priority || byType[b].fit - byType[a].fit);
    const bestFit = Math.max(...names.map((n) => byType[n].fit));
    const closest = names.find((n) => byType[n].fit === bestFit);
    const disqualified = this.disqualifiers();
    const score = disqualified.length ? 0 : Math.round(bestFit * 10) / 10;
    const type = score > 0 ? (inside[0] || closest) : null;
    return {
      score, threshold: T, isBrilliant: score >= T,
      type, label: type ? this.types[type].label : null,
      inInterval: inside, byType, disqualified,
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
})();