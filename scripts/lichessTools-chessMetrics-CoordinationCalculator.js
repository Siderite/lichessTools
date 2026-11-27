(() => {

  // Piece coordination (how well friendly pieces defend each other). Adapted to chessops.
  class CoordinationCalculator {
    MOVE_CAP = 3; // treat up to 3 moves as their real cost
    ISOLATED_PENALTY = 5; // anything >MOVE_CAP or unreachable => this penalty

    static _parseBoard = LiChessTools.Cache.memoize((fen, co) => LiChessTools.MoveGen.boardFromFen(fen, co), { key: (fen) => fen });

    get co() {
      return LiChessTools.chessopsModule || null;
    }

    parseBoard(fen) {
      // chessops is required to read a board at all; without it there is nothing to parse
      if (!this.co?.fen?.parseBoardFen) return null;
      // hand out a private copy: the memoized board is shared, the bfs mutates this one
      return CoordinationCalculator._parseBoard(fen, this.co)?.clone();
    }

    inBounds(sq) {
      return sq >= 0 && sq < 64;
    }

    attacks(board, sq) {
      return LiChessTools.MoveGen.attacks(board, sq);
    }

    computeControlMap(board, color) {
      return LiChessTools.MoveGen.controlMap(board, color);
    }

    // one non-capture move of the piece standing on sq; control is the side to move set
    movementTargets(board, sq, control) {
      const role = board.get(sq)?.role;
      if (!role || role === 'pawn') return [];
      const results = [];
      for (const t of this.attacks(board, sq)) {
        if (!this.inBounds(t) || board.get(t) || !control.has(t)) continue;
        results.push(t);
      }
      return results;
    }

    bfsDistances(board, startSq, control) {
      const dist = Array(64).fill(Infinity);
      dist[startSq] = 0;
      const piece = board.get(startSq);
      if (!piece || piece.role === 'pawn') return dist;

      // the tracked piece travels with the search, so the generators see the occupancy
      // each square needs; the origin stays vacated and gets restored on return
      const queue = [startSq];
      let at = startSq;
      while (queue.length) {
        const sq = queue.shift();
        if (sq !== at) { board.take(at); board.set(sq, piece); at = sq; }
        const d = dist[sq];
        for (const t of this.movementTargets(board, sq, control)) {
          if (dist[t] > d + 1) { dist[t] = d + 1; queue.push(t); }
        }
      }
      if (at !== startSq) { board.take(at); board.set(startSq, piece); }

      return dist;
    }

    computeConnectionMetric(fen) {
      const board = this.parseBoard(fen);
      if (!board) return [];

      const pieces = [];
      for (const sq of board.occupied) {
        const piece = board.get(sq);
        if (piece && piece.role !== 'pawn') pieces.push({ sq, color: piece.color });
      }

      const controlW = this.computeControlMap(board, 'white');
      const controlB = this.computeControlMap(board, 'black');

      const cost = [];

      for (let i = 0; i < pieces.length; i++) {
        const { sq, color } = pieces[i];
        const control = color === 'white' ? controlW : controlB;

        const dist = this.bfsDistances(board, sq, control);

        let best = Infinity;
        for (let j = 0; j < pieces.length; j++) {
          if (i === j) continue;
          if (pieces[j].color !== color) continue;

          const defending = this.detectMutualOrReachableDefense(board, pieces[i].sq, pieces[j].sq, dist);
          if (defending < best) best = defending;
        }

        cost.push({
          piece: pieces[i],
          cost: best,
        });
      }

      return cost;
    }

    detectMutualOrReachableDefense(board, sqA, sqB, distA) {
      const attacksB = this.attacks(board, sqB);
      if (attacksB.includes(sqA)) return 0;

      let best = Infinity;
      for (const t of attacksB) {
        if (distA[t] < best) best = distA[t];
      }
      return best;
    }

    computeConnectivityScoreCapped(fen) {
      const board = this.parseBoard(fen);
      if (!board) return { white: { sum: 0, avg: 0, pieces: 0 }, black: { sum: 0, avg: 0, pieces: 0 } };

      const whitePieces = [];
      const blackPieces = [];
      for (const sq of board.occupied) {
        const piece = board.get(sq);
        if (!piece || piece.role === 'pawn') continue;
        (piece.color === 'white' ? whitePieces : blackPieces).push(sq);
      }

      const controlW = this.computeControlMap(board, 'white');
      const controlB = this.computeControlMap(board, 'black');

      const scoreWhiteSum = this.computeSideScoreCapped(board, whitePieces, controlW, 'white');
      const scoreBlackSum = this.computeSideScoreCapped(board, blackPieces, controlB, 'black');

      const scoreWhiteAvg = whitePieces.length ? scoreWhiteSum / whitePieces.length : 0;
      const scoreBlackAvg = blackPieces.length ? scoreBlackSum / blackPieces.length : 0;

      return {
        white: { sum: scoreWhiteSum, avg: scoreWhiteAvg, pieces: whitePieces.length },
        black: { sum: scoreBlackSum, avg: scoreBlackAvg, pieces: blackPieces.length },
      };
    }

    computeSideScoreCapped(board, pieces, control, color) {
      let sum = 0;

      for (let i = 0; i < pieces.length; i++) {
        const sqA = pieces[i];

        const dist = this.bfsDistances(board, sqA, control);

        let best = Infinity;

        for (let j = 0; j < pieces.length; j++) {
          if (i === j) continue;
          const sqB = pieces[j];
          const bp = board.get(sqB);
          if (bp && bp.color !== color) continue;

          const cost = this.detectMutualOrReachableDefense(board, sqA, sqB, dist);

          if (cost < best) best = cost;
        }

        if (best === Infinity || best > this.MOVE_CAP) sum += this.ISOLATED_PENALTY;
        else sum += best;
      }

      return sum;
    }

    getCoordination(fen) {
      const result = this.computeConnectivityScoreCapped(fen);
      const whiteVal = (5 - result.white.avg) * result.white.pieces;
      const blackVal = (5 - result.black.avg) * result.black.pieces;
      const coordination = (Math.min(50, whiteVal) - Math.min(50, blackVal)) * 2;
      return coordination;
    }
  }

  LiChessTools.CoordinationCalculator = CoordinationCalculator;
})();
