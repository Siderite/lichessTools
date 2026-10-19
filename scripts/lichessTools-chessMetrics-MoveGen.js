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
      const read = (part) => {
        try {
          const parsed = co.fen.parseBoardFen(part);
          const board = typeof parsed.unwrap === 'function' ? parsed.unwrap() : parsed;
          return board || null;
        } catch (e) {
          return null;
        }
      };
      const board = read(String(fen).split(' ')[0]);
      if (board) return board;
      // a board chessops cannot read gets one repair attempt (issue #1202)
      const repaired = MoveGen.fixFen(fen);
      return repaired ? read(repaired.split(' ')[0]) : null;
    }
    static positionFromFen(fen, co) {
      co = co || MoveGen.co;
      if (!co?.fen?.parseFen || !co?.Chess?.fromSetup) return null;
      const read = (text) => {
        try {
          return co.Chess.fromSetup(co.fen.parseFen(text).unwrap()).unwrap();
        } catch (e) {
          return null;
        }
      };
      const pos = read(fen);
      if (pos) return pos;
      // a FEN chessops rejects gets one repair attempt before the error propagates
      const repaired = MoveGen.fixFen(fen);
      if (repaired) return read(repaired);
      return co.Chess.fromSetup(co.fen.parseFen(fen).unwrap()).unwrap();
    }
    // Normalizes a possibly malformed FEN so that chessops accepts it (issue #1202):
    // pawns on rank 1/8 are promoted to queens, each side ends up with exactly one king
    // (extra kings are removed, a missing king takes its home e-file square or the
    // nearest free square), the two kings are kept non-adjacent, a castling right is
    // kept only while that side's king is on its home e-file square and the corner
    // rook is still on its home corner square, an en-passant square is kept only while
    // the side that is not to move could have just pushed a pawn past it (it lands on
    // the recorded square), and the counters are clamped to non-negative integers.
    // The input's field count is preserved, so a board-only FEN stays board-only; extra
    // fields are dropped. Malformed characters are read as empty squares. Returns null
    // for boards that cannot be read at all (not eight rows, or pocketed pieces), and
    // for positions with no legal way to seat the kings. fixFen(fixFen(fen)) == fixFen(fen).
    static fixFen(fen) {
      const fields = String(fen ?? '').trim().split(/\s+/).filter(field => field.length);
      if (!fields.length || /[[\]]/.test(fields[0])) return null;
      const rows = String(fields[0]).split('/');
      if (rows.length != 8) return null;
      const board = new Array(64);
      // squares are indexed as chessops indexes them: sq = file + rank * 8, rank 0 = rank 1
      for (let row = 0; row < 8; ++row) {
        const rank = 7 - row;
        let file = 0;
        for (const ch of rows[row]) {
          if (ch >= '1' && ch <= '9') { file += ch.charCodeAt(0) - 48; continue; }
          let role;
          switch (ch) {
            case 'P': case 'p': role = 'pawn'; break;
            case 'N': case 'n': role = 'knight'; break;
            case 'B': case 'b': role = 'bishop'; break;
            case 'R': case 'r': role = 'rook'; break;
            case 'Q': case 'q': role = 'queen'; break;
            case 'K': case 'k': role = 'king'; break;
            case '.': case '*': ++file; continue;
            default: continue;
          }
          if (file > 7) continue;
          // a pawn that reached a home rank must have been promoted
          if (role == 'pawn' && (rank == 0 || rank == 7)) role = 'queen';
          board[rank * 8 + file] = { role, color: ch < 'a' ? 'white' : 'black' };
          ++file;
        }
      }
      const fileOf = (sq) => sq & 7;
      const rankOf = (sq) => sq >> 3;
      const at = (sq, color, role) => board[sq]?.color == color && board[sq]?.role == role;
      const home = { white: 4, black: 60 };
      const kings = (color) => {
        const found = [];
        for (let sq = 0; sq < 64; ++sq) if (at(sq, color, 'king')) found.push(sq);
        return found;
      };
      const adjacent = (a, b) => Math.abs(fileOf(a) - fileOf(b)) <= 1 && Math.abs(rankOf(a) - rankOf(b)) <= 1;
      const freeSquare = (origin, avoid) => {
        let best = null;
        let bestDistance = Infinity;
        for (let sq = 0; sq < 64; ++sq) {
          if (board[sq] || (avoid != null && adjacent(sq, avoid))) continue;
          const distance = Math.max(Math.abs(fileOf(sq) - fileOf(origin)), Math.abs(rankOf(sq) - rankOf(origin)));
          if (distance < bestDistance) { bestDistance = distance; best = sq; }
        }
        return best;
      };
      for (const color of ['white', 'black']) {
        const found = kings(color);
        for (let i = 1; i < found.length; ++i) board[found[i]] = undefined;
        if (found.length) continue;
        const square = freeSquare(home[color], kings(color == 'white' ? 'black' : 'white')[0]);
        if (square == null) return null;
        board[square] = { role: 'king', color };
      }
      const whiteKing = kings('white')[0];
      const blackKing = kings('black')[0];
      if (whiteKing == null || blackKing == null) return null;
      if (adjacent(whiteKing, blackKing)) {
        const black = board[blackKing];
        board[blackKing] = undefined;
        const moved = freeSquare(blackKing, whiteKing);
        if (moved != null) board[moved] = black;
        else {
          board[blackKing] = black;
          const white = board[whiteKing];
          board[whiteKing] = undefined;
          const movedWhite = freeSquare(whiteKing, blackKing);
          if (movedWhite == null) return null;
          board[movedWhite] = white;
        }
      }
      const claimed = new Set([...(fields.length > 2 ? fields[2] : '-')]);
      let castling = '';
      if (claimed.has('K') && at(home.white, 'white', 'king') && at(7, 'white', 'rook')) castling += 'K';
      if (claimed.has('Q') && at(home.white, 'white', 'king') && at(0, 'white', 'rook')) castling += 'Q';
      if (claimed.has('k') && at(home.black, 'black', 'king') && at(63, 'black', 'rook')) castling += 'k';
      if (claimed.has('q') && at(home.black, 'black', 'king') && at(56, 'black', 'rook')) castling += 'q';
      if (!castling) castling = '-';
      const turn = (fields.length > 1 ? fields[1] : 'w')[0].toLowerCase() == 'b' ? 'b' : 'w';
      const epRankNeeded = turn == 'w' ? 5 : 2;
      const epField = fields.length > 3 ? fields[3] : '-';
      let ep = '-';
      const epFile = epField.length == 2 ? 'abcdefgh'.indexOf(epField[0].toLowerCase()) : -1;
      const epRank = epFile >= 0 && epField[1] >= '1' && epField[1] <= '8' ? epField.charCodeAt(1) - 49 : -1;
      if (epRank == epRankNeeded && !board[epRank * 8 + epFile]) {
        const pushedColor = turn == 'w' ? 'black' : 'white';
        for (const file of [epFile - 1, epFile + 1]) {
          if (file < 0 || file > 7) continue;
          for (const rank of [epRank - 1, epRank + 1]) {
            if (at(rank * 8 + file, pushedColor, 'pawn')) ep = epField[0].toLowerCase() + epField[1];
          }
        }
      }
      const counters = [];
      if (fields.length > 4) {
        const halfmoves = parseInt(fields[4], 10);
        counters.push(halfmoves > 0 ? String(halfmoves) : '0');
        if (fields.length > 5) {
          const fullmoves = parseInt(fields[5], 10);
          counters.push(fullmoves > 0 ? String(fullmoves) : '1');
        }
      }
      const letters = { pawn: 'P', knight: 'N', bishop: 'B', rook: 'R', queen: 'Q', king: 'K' };
      let placement = '';
      for (let rank = 7; rank >= 0; --rank) {
        let empty = 0;
        for (let file = 0; file < 8; ++file) {
          const piece = board[rank * 8 + file];
          if (!piece) { ++empty; continue; }
          if (empty) { placement += empty; empty = 0; }
          const letter = letters[piece.role];
          placement += piece.color == 'white' ? letter : letter.toLowerCase();
        }
        if (empty) placement += empty;
        if (rank) placement += '/';
      }
      const fixed = [placement, turn, castling, ep];
      return fixed.slice(0, Math.min(fields.length, 6)).concat(counters).join(' ');
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
