(() => {
  class ChessActivityEvaluator {
    constructor(board) {
      this.co = board || null;
      this.pieceBaseMobility = { pawn: 3, knight: 8, bishop: 13, rook: 14, queen: 27, king: 8 };
    }

    SECONDARY = 0.2;
    CONTROLLED_BY_OPPONENT = 0.1;
    FREE = 1;

    getColor(sq) {
      const piece = this.co?.get(sq);
      if (!piece) return 0;
      return piece.color === 'white' ? 1 : -1;
    }

    getPieceType(sq) {
      return this.co?.get(sq)?.role;
    }

    generateMoves(sq) {
      const piece = this.co?.get(sq);
      if (!piece) return [];
      const attacked = LiChessTools.MoveGen.attacks(this.co, sq);
      const friendly = piece.color === 'white' ? this.co.white : this.co.black;
      const moves = [];
      for (const t of attacked) {
        if (!friendly.has(t)) moves.push(t);
      }
      if (piece.role === 'pawn') {
        const forward = piece.color === 'white' ? sq + 8 : sq - 8;
        if (forward >= 0 && forward < 64 && !this.co.get(forward)) moves.push(forward);
      }
      return moves;
    }

    computeControlMap() {
      const control = Array.from({ length: 8 }, () => Array(8).fill(0));
      for (const sq of this.co.occupied) {
        const piece = this.co.get(sq);
        const color = piece.color === 'white' ? 1 : -1;
        for (const t of this.generateMoves(sq)) {
          control[7 - (t >> 3)][t & 7] += color;
        }
      }
      return control;
    }

    evaluatePieceActivity(sq, controlMap) {
      const piece = this.co.get(sq);
      const type = piece.role;
      const color = piece.color === 'white' ? 1 : -1;
      const moves = this.generateMoves(sq);
      let score = 0;
      for (const t of moves) {
        const control = controlMap[7 - (t >> 3)][t & 7];
        score += control * color < 0 ? this.CONTROLLED_BY_OPPONENT : this.FREE;
      }
      for (const t of moves) {
        if (controlMap[7 - (t >> 3)][t & 7] * color < 0) continue;
        const clone = this.co.clone();
        clone.set(t, piece);
        clone.take(sq);
        const sub = new ChessActivityEvaluator(clone);
        for (const s2 of sub.generateMoves(t)) {
          if (controlMap[7 - (s2 >> 3)][s2 & 7] * color >= 0) score += this.SECONDARY;
        }
      }
      return score / this.pieceBaseMobility[type];
    }

    cloneBoard() {
      return this.co.clone();
    }

    evaluateAll() {
      if (!this.co) return { white: [], black: [] };
      const control = this.computeControlMap();
      const result = { white: [], black: [] };
      for (const sq of this.co.occupied) {
        const piece = this.co.get(sq);
        const score = this.evaluatePieceActivity(sq, control);
        const ch = LiChessTools.ChessMetrics.ROLE_LETTERS[piece.role];
        const letter = piece.color === 'white' ? ch.toUpperCase() : ch;
        const arr = piece.color === 'white' ? result.white : result.black;
        arr.push({ piece: letter, x: sq & 7, y: 7 - (sq >> 3), score });
      }
      result.white.sort((a, b) => a.score - b.score);
      result.black.sort((a, b) => a.score - b.score);
      return result;
    }
  }

  LiChessTools.ChessActivityEvaluator = ChessActivityEvaluator;
})();
