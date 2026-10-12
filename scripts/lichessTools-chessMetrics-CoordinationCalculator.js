(() => {

  // Piece coordination (how well friendly pieces defend each other). Adapted to chessops.
  class CoordinationCalculator {
    MOVE_CAP = 3; // treat up to 3 moves as their real cost
    ISOLATED_PENALTY = 5; // anything >MOVE_CAP or unreachable => this penalty

    static _parseBoard = LiChessTools.Cache.memoize((fen, co) => LiChessTools.MoveGen.boardFromFen(fen, co), { key: (fen) => fen });

    get co() {
      return LiChessTools.MoveGen.co;
    }

    parseBoard(fen) {
      return CoordinationCalculator._parseBoard(fen, this.co);
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

    movementTargets(board, sq, control) {
      const piece = board.get(sq);
      if (!piece) return [];
      const role = piece.role;
      const results = [];

      const tryPush = (t) => {
        if (!this.inBounds(t)) return;
        if (board.get(t)) return;
        if (!control.has(t)) return;
        results.push(t);
      };

      if (role === 'knight' || role === 'king') {
        for (const t of this.attacks(board, sq)) tryPush(t);
        return results;
      }

      if (role === 'bishop' || role === 'rook' || role === 'queen') {
        for (const t of this.attacks(board, sq)) {
          if (board.get(t)) continue;
          if (control.has(t)) results.push(t);
        }
        return results;
      }

      return results;
    }

    bfsDistances(board, startSq, control) {
      const dist = Array(64).fill(Infinity);
      const queue = [startSq];
      dist[startSq] = 0;

      while (queue.length) {
        const sq = queue.shift();
        const d = dist[sq];
        for (const t of this.movementTargets(board, sq, control)) {
          if (dist[t] > d + 1) {
            dist[t] = d + 1;
            queue.push(t);
          }
        }
      }

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
