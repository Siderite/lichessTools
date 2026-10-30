(() => {

  // Approximate ply distance between two chess positions, used for "position
  // similarity" search (issue #1393). No move generation and no search: empty-
  // board piece distances plus one minimum-cost assignment (Hungarian) per
  // side, plus sanity checks on castling rights and pawn file shifts. Returns
  // an integer number of plies (0 when the positions match) or Infinity when
  // the target is provably unreachable.
  //
  // Ported from the fen-distance draft to chessops and tightened for hot
  // paths: the 64x64 knight-distance table is built once per load, per-side
  // piece lists are parallel typed arrays, the Hungarian cost matrix is a
  // flat Int32Array, and pieces are enumerated via chessops SquareSets so we
  // never pay a per-square board.get() round-trip.
  class FenDistance {

    static get co() {
      return LiChessTools.chessopsModule || null;
    }

    // 64x64 empty-board knight distances (0..6; the 99 sentinel is safe for a
    // Uint8 and never hits on a real knight path since the knight diameter on
    // 8x8 is 6). Index: KN[(r * 8 + f) * 64 + (r2 * 8 + f2)] = plies.
    static KN = (() => {
      const d = new Uint8Array(4096).fill(99);
      const mv = [1, 2, 2, 1, -1, 2, -2, 1, -2, -1, -1, -2, 1, -2, 2, -1];
      for (let s = 0; s < 64; ++s) {
        const row = s << 6;
        d[row | s] = 0;
        const q = [s];
        for (let qi = 0; qi < q.length; ++qi) {
          const c = q[qi];
          const cf = c & 7;
          const cr = c >> 3;
          const cd = d[row | c];
          for (let k = 0; k < 16; k += 2) {
            const nf = cf + mv[k];
            const nr = cr + mv[k + 1];
            if (nf < 0 || nf > 7 || nr < 0 || nr > 7) continue;
            const n = (nr << 3) | nf;
            const idx = row | n;
            if (d[idx] === 99) { d[idx] = cd + 1; q.push(n); }
          }
        }
      }
      return d;
    })();

    // Edge costs are packed as moves * SHIFT_BASE + shifts so the Hungarian
    // minimizes plies first and pawn file shifts (each implying a capture)
    // second. SHIFT_BASE stays well above the maximum per-side shifts (8 pawns
    // x 7 file steps = 56), and BIG sits well above any real cost so the
    // sum-of-assignment check can flag "impossible" transitions.
    static SHIFT_BASE = 1000;
    static BIG = 1000000;

    // Role indexes for the compact piece arrays: 1 knight, 2 bishop, 3 rook,
    // 4 queen, 5 pawn. Kings live on their own (kf/kr) so roleIdx 6 is unused.
    // Piece distances on an empty board, keyed by rank/file in chessops
    // coordinates (rank 0 = rank 1, rank 7 = rank 8); pawn transitions are
    // handled separately because they need orientation and the home-rank /
    // promotion rules.
    static _pieceDist(roleIdx, f1, r1, f2, r2) {
      if (f1 === f2 && r1 === r2) return 0;
      const dx = f1 > f2 ? f1 - f2 : f2 - f1;
      const dy = r1 > r2 ? r1 - r2 : r2 - r1;
      switch (roleIdx) {
        case 1: return FenDistance.KN[((r1 << 3) | f1) << 6 | ((r2 << 3) | f2)];
        case 2: return ((f1 + r1) & 1) !== ((f2 + r2) & 1)
          ? FenDistance.BIG
          : (dx === dy ? 1 : 2);
        case 3: return (dx === 0 || dy === 0) ? 1 : 2;
        case 4: return (dx === 0 || dy === 0 || dx === dy) ? 1 : 2;
        default: return FenDistance.BIG;
      }
    }

    // Home-rank / promotion rules operate on normalized ranks: files stay put,
    // rank is flipped for black so the side always "advances" toward rank 7 and
    // the side's pawn start rank is 1. Cost = moves * SHIFT_BASE + fileShifts.
    static _pawnToPawn(sf, sr, tf, tr) {
      const rankDelta = tr - sr;
      if (rankDelta < 0) return FenDistance.BIG;
      const fileShift = tf > sf ? tf - sf : sf - tf;
      if (fileShift > rankDelta) return FenDistance.BIG;
      const homeDouble = (fileShift === 0 && sr === 1 && rankDelta >= 2) ? 1 : 0;
      const moves = rankDelta - homeDouble;
      return moves * FenDistance.SHIFT_BASE + fileShift;
    }

    // Promotion path: the pawn walks up to rank 7 (its own file shifts count as
    // captures), gets promoted to roleIdx, then walks on an empty board to the
    // target square. Every legal file-shift combo is tried and the minimum
    // wins, keeping the "moves first, shifts second" packing.
    static _pawnToPiece(sf, sr, roleIdx, tf, tr) {
      const steps = 7 - sr;
      if (steps <= 0) return FenDistance.BIG;
      const big = FenDistance.BIG;
      const shiftBase = FenDistance.SHIFT_BASE;
      let best = big;
      for (let pf = 0; pf < 8; ++pf) {
        const sh = pf > sf ? pf - sf : sf - pf;
        if (sh > steps) continue;
        const pd = FenDistance._pieceDist(roleIdx, pf, 7, tf, tr);
        if (pd >= big) continue;
        const homeDouble = (sh === 0 && sr === 1) ? 1 : 0;
        const moves = steps - homeDouble + pd;
        const cost = moves * shiftBase + sh;
        if (cost < best) best = cost;
      }
      return best;
    }

    // Enumerate one side's pieces into parallel typed arrays. A side has at
    // most 15 non-king pieces; king lives on its own (kf/kr). Rank is flipped
    // for black (rank ^ 7 = 7 - rank) so the color advances toward rank 7 and
    // its pawn start rank is 1. Returns null when the side has no king.
    static _collectSide(board, color) {
      if (!board) return null;
      const colorSet = color === 'white' ? board.white : board.black;
      const kingSq = board.king.intersect(colorSet).first();
      if (kingSq === undefined) return null;
      const roles = new Uint8Array(16);
      const files = new Uint8Array(16);
      const ranks = new Uint8Array(16);
      const flip = color === 'white' ? 0 : 7;
      let n = 0;
      const add = (set, roleIdx) => {
        for (const sq of set.intersect(colorSet)) {
          if (n >= roles.length) return;
          roles[n] = roleIdx;
          files[n] = sq & 7;
          ranks[n] = (sq >> 3) ^ flip;
          ++n;
        }
      };
      add(board.pawn, 5);
      add(board.knight, 1);
      add(board.bishop, 2);
      add(board.rook, 3);
      add(board.queen, 4);
      return { n, roles, files, ranks, kf: kingSq & 7, kr: kingSq >> 3 };
    }


    // Hungarian (Jonker-Volgenant shortest-augmenting-path variant, n rows
    // <= m columns). The cost matrix is a flat Int32Array (row i starts at
    // a[i * m]). Returns an Int32Array of length n giving the column each
    // row is assigned to; rows whose cost >= BIG stay assigned but the
    // caller rejects them via the "c >= BIG" check.
    static _hungarian(a, n, m) {
      const u = new Int32Array(n + 1);
      const v = new Int32Array(m + 1);
      const p = new Int32Array(m + 1);
      const way = new Int32Array(m + 1);
      const INF = 2147483647;
      for (let i = 1; i <= n; ++i) {
        p[0] = i;
        let j0 = 0;
        const minv = new Int32Array(m + 1).fill(INF);
        const used = new Uint8Array(m + 1);
        do {
          used[j0] = 1;
          const i0 = p[j0];
          const i0m = (i0 - 1) * m;
          let delta = INF;
          let j1 = 0;
          for (let j = 1; j <= m; ++j) {
            if (used[j]) continue;
            const cur = a[i0m + j - 1] - u[i0] - v[j];
            if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
            if (minv[j] < delta) { delta = minv[j]; j1 = j; }
          }
          for (let j = 0; j <= m; ++j) {
            if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
            else minv[j] -= delta;
          }
          j0 = j1;
        } while (p[j0] !== 0);
        do {
          const j1 = way[j0];
          p[j0] = p[j1];
          j0 = j1;
        } while (j0);
      }
      const res = new Int32Array(n);
      for (let j = 1; j <= m; ++j) if (p[j]) res[p[j] - 1] = j - 1;
      return res;
    }

    // One side's cost given pre-collected piece lists. Returns { moves, shifts,
    // lost } or null when the transformation is provably impossible (missing
    // king, pieces cannot appear from nowhere, unreachable transition).
    static _sideCost(src, dst) {
      if (!src || !dst) return null;
      const n = dst.n;
      const m = src.n;
      if (n > m) return null;
      const kfD = src.kf > dst.kf ? src.kf - dst.kf : dst.kf - src.kf;
      const krD = src.kr > dst.kr ? src.kr - dst.kr : dst.kr - src.kr;
      const kingMoves = kfD > krD ? kfD : krD;
      let moves = kingMoves;
      let shifts = 0;
      if (n > 0) {
        const big = FenDistance.BIG;
        const shiftBase = FenDistance.SHIFT_BASE;
        const a = new Int32Array(n * m);
        for (let i = 0; i < n; ++i) {
          const ti = dst.roles[i];
          const tf = dst.files[i];
          const tr = dst.ranks[i];
          const rowBase = i * m;
          for (let j = 0; j < m; ++j) {
            const sj = src.roles[j];
            const sf = src.files[j];
            const sr = src.ranks[j];
            let c;
            if (sj === 5) {
              // src pawn: same role stays a pawn, otherwise it must promote.
              c = ti === 5
                ? FenDistance._pawnToPawn(sf, sr, tf, tr)
                : FenDistance._pawnToPiece(sf, sr, ti, tf, tr);
            } else if (ti === 5 || ti !== sj) {
              // non-pawn can never become a pawn, and roles cannot swap.
              c = big;
            } else {
              const d = FenDistance._pieceDist(sj, sf, sr, tf, tr);
              c = d >= big ? big : d * shiftBase;
            }
            a[rowBase + j] = c;
          }
        }
        const asg = FenDistance._hungarian(a, n, m);
        for (let i = 0; i < n; ++i) {
          const c = a[i * m + asg[i]];
          if (c >= big) return null;
          moves += (c / shiftBase) | 0;
          shifts += c % shiftBase;
        }
      }
      return { moves, shifts, lost: m - n };
    }


    // Normalize a chessops Setup (fen.parseFen output, has .castling) or a
    // chessops Position (has .castles with a .castlingRights getter) into the
    // flat shape the core consumes.
    static _setupOf(p) {
      if (!p) return null;
      const turn = p.turn;
      let castling = p.castling;
      if (castling === undefined || castling === null) {
        castling = p.castles?.castlingRights ?? 0;
      }
      return {
        board: p.board,
        stm: turn === 'white' ? 'w' : 'b',
        castling: castling & 15,
        fullmoves: p.fullmoves ?? 1
      };
    }

    // Core: two normalized setups + opts -> plies or Infinity.
    static _distance(A, B, opts) {
      if (!A || !B) return Infinity;

      // Castling rights can only be lost, never gained.
      const ca = A.castling;
      const cb = B.castling;
      if ((cb & ~ca) !== 0) return Infinity;

      const w = FenDistance._sideCost(
        FenDistance._collectSide(A.board, 'white'),
        FenDistance._collectSide(B.board, 'white'));
      const b = FenDistance._sideCost(
        FenDistance._collectSide(A.board, 'black'),
        FenDistance._collectSide(B.board, 'black'));
      if (!w || !b) return Infinity;

      // A lost castling right means the king or its corner rook moved. If the
      // pieces otherwise end where they started, that still takes a move away
      // and back, so bump the side's move count to 2 in that case.
      if (((ca ^ cb) & 3) !== 0 && w.moves === 0) w.moves = 2;
      if (((ca ^ cb) & 12) !== 0 && b.moves === 0) b.moves = 2;

      // Pawn file changes require captures; each side's captures can only come
      // from pieces the other side lost.
      if (w.shifts > b.lost || b.shifts > w.lost) return Infinity;

      // Every lost enemy piece needs at least one capturing move by us.
      const wm = w.moves > b.lost ? w.moves : b.lost;
      const bm = b.moves > w.lost ? b.moves : w.lost;

      // Interleave the two sides' plies. The side that moves first can end
      // one move ahead.
      const aFirst = A.stm === 'w';
      const firstMax = aFirst ? wm : bm;
      const secondMax = aFirst ? bm : wm;
      let plies = firstMax > secondMax ? 2 * firstMax - 1 : 2 * secondMax;

      // Side to move after `plies` plies must match B.stm.
      const finalStm = (plies & 1) === 0 ? A.stm : (A.stm === 'w' ? 'b' : 'w');
      if (finalStm !== B.stm) ++plies;

      // Optional: the fullmove counters constrain the ply gap.
      if (opts?.useMoveCounters) {
        const ply = (x) => 2 * x.fullmoves + (x.stm === 'b' ? 1 : 0);
        const avail = ply(B) - ply(A);
        if (avail < plies) return Infinity;
      }
      return plies;
    }

    // Public: two chessops Setups / Positions. Skip FEN parsing when the
    // caller already has them (hot search loops).
    static positionDistance(posA, posB, opts) {
      const A = FenDistance._setupOf(posA);
      const B = FenDistance._setupOf(posB);
      if (!A || !B) return Infinity;
      return FenDistance._distance(A, B, opts);
    }

    // Public: two FENs. Fast-paths identical strings, then parses both via
    // chessops (no validation pass - we don't need one for a similarity
    // metric) and delegates to the core.
    static fenDistance(fenA, fenB, opts) {
      if (fenA === fenB) return 0;
      const co = FenDistance.co;
      if (!co?.fen?.parseFen) return Infinity;
      let setupA;
      let setupB;
      try {
        setupA = co.fen.parseFen(fenA).unwrap();
        setupB = co.fen.parseFen(fenB).unwrap();
      } catch (e) {
        return Infinity;
      }
      if (!setupA || !setupB) return Infinity;
      return FenDistance._distance(FenDistance._setupOf(setupA), FenDistance._setupOf(setupB), opts);
    }
  }

  LiChessTools.FenDistance = FenDistance;
})();

