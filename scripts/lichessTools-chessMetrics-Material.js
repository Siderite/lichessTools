(() => {
  // One material helper with a shared value table.
  class Material {
    // piece value in "piece units" (pawn = 1)
    static VALUE = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
    // value of an attacker (a king capturing is "cheap")
    static ATTACKER_VALUE = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 2.5 };
    // centipawn value keyed by letter (historical ChessMetrics table)
    static VALUE_CP = { 'k': 0, 'q': 900, 'r': 500, 'b': 310, 'n': 300, 'p': 100 };
    static ROLE_LETTER = { king: 'k', queen: 'q', rook: 'r', bishop: 'b', knight: 'n', pawn: 'p' };
    static LETTER_TO_ROLE = { 'k': 'king', 'q': 'queen', 'r': 'rook', 'b': 'bishop', 'n': 'knight', 'p': 'pawn' };

    static letterOf(piece) {
      const ch = Material.ROLE_LETTER[piece?.role];
      if (!ch) return null;
      return piece.color === 'white' ? ch.toUpperCase() : ch;
    }

    static simpleMaterial(fen, isTotal, side) {
      let result = 0;
      if (!fen) return result;
      const board = String(fen).split(' ')[0];
      for (const ch of board) {
        const p = Material.VALUE_CP[ch.toLowerCase()];
        if (p) {
          const m = ch === ch.toUpperCase() ? 1 : -1;
          if (!side || side == m) result += isTotal ? p : m * p;
        }
      }
      return result;
    }
  }

  LiChessTools.Material = Material;
})();
