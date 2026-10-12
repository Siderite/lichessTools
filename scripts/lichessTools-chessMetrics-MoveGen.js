(() => {

  // One attack/move generator (chessops attacks).
  class MoveGen {
    static get co() {
      return (typeof window !== 'undefined' && window.lichessTools?.chessopsModule) || null;
    }
    static attacks(board, sq) {
      const co = MoveGen.co;
      const piece = board?.get(sq);
      if (!piece || !co) return [];
      let attacked;
      switch (piece.role) {
        case 'knight': attacked = co.knightAttacks(sq); break;
        case 'bishop': attacked = co.bishopAttacks(sq, board.occupied); break;
        case 'rook': attacked = co.rookAttacks(sq, board.occupied); break;
        case 'queen': attacked = co.queenAttacks(sq, board.occupied); break;
        case 'king': attacked = co.kingAttacks(sq); break;
        case 'pawn': attacked = co.pawnAttacks(piece.color, sq); break;
        default: return [];
      }
      return [...attacked];
    }
    static controlMap(board, color) {
      const control = new Set();
      const side = board?.[color === 'white' ? 'white' : 'black'];
      for (const sq of side || []) {
        for (const t of MoveGen.attacks(board, sq)) control.add(t);
      }
      return control;
    }
  }

  LiChessTools.MoveGen = MoveGen;
})();
