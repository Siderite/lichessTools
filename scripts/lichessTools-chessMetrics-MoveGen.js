(() => {

  // One attack/move generator (chessops attacks).
  class MoveGen {
    static get co() {
      return LiChessTools.chessopsModule || null;
    }
    static square(x, y) { return x + (7 - y) * 8; }
    static boardFromFen(fen, co) {
      co = co || MoveGen.co;
      if (!co?.fen?.parseBoardFen) return null;
      try {
        const parsed = co.fen.parseBoardFen(String(fen).split(' ')[0]);
        const board = parsed && typeof parsed.unwrap === 'function' ? parsed.unwrap() : parsed;
        return board || null;
      } catch (e) {
        return null;
      }
    }
    static positionFromFen(fen, co) {
      co = co || MoveGen.co;
      if (!co?.fen?.parseFen || !co?.Chess?.fromSetup) return null;
      return co.Chess.fromSetup(co.fen.parseFen(fen).unwrap()).unwrap();
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

    static legalMoves(pos) {
      const co = MoveGen.co;
      const out = [];
      for (const [from, dests] of pos.allDests()) {
        const p = pos.board.get(from);
        for (const to of dests) {
          const r = co.squareRank(to);
          out.push(p.role === 'pawn' && (r === 0 || r === 7) ? { from, to, promotion: 'queen' } : { from, to });
        }
      }
      return out;
    }
  }

  LiChessTools.MoveGen = MoveGen;
})();
