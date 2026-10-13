(() => {

  class ChessMetrics {
    static pieceMaterial = LiChessTools.Material.VALUE_CP;

    static ROLE_LETTERS = LiChessTools.Material.ROLE_LETTER;

    static LETTER_TO_ROLE = LiChessTools.Material.LETTER_TO_ROLE;

    static get chessops() {
      return LiChessTools.chessopsModule || null;
    }

    static _square(x, y) { return LiChessTools.MoveGen.square(x, y); }

    static _pieceChar(b, sq) {
      return LiChessTools.Material.letterOf(b.get(sq));
    }

    static _boardFen(board) {
      const b = board;
      if (!b) return '';
      const co = ChessMetrics.chessops;
      if (co?.fen?.makeBoardFen) return co.fen.makeBoardFen(b);
      let fen = '';
      for (let r = 7; r >= 0; r--) {
        let empty = 0;
        for (let f = 0; f < 8; f++) {
          const piece = b.get(r * 8 + f);
          if (piece) {
            if (empty) { fen += empty; empty = 0; }
            const ch = ChessMetrics.ROLE_LETTERS[piece.role];
            fen += piece.color === 'white' ? ch.toUpperCase() : ch;
          } else empty++;
        }
        if (empty) fen += empty;
        if (r) fen += '/';
      }
      return fen;
    }

    static occupiedSquares(board) {
      const result = [];
      const co = board;
      if (co?.occupied && typeof co.get === 'function') {
        for (const square of co.occupied) {
          const piece = co.get(square);
          if (!piece) continue;
          const ch = ChessMetrics.ROLE_LETTERS[piece.role];
          if (!ch) continue;
          result.push({
            x: square & 7,
            y: 7 - (square >> 3),
            ch: piece.color === 'white' ? ch.toUpperCase() : ch
          });
        }
      }
      return result;
    }

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
      return LiChessTools.Scoring.centipawnsToWinPercentage(cp);
    }

    static winDeltaToAccuracy(expected, played) {
      return LiChessTools.Scoring.winDeltaToAccuracy(expected, played);
    }

    static wdlToSharpness(w, d, l) {
      return LiChessTools.Scoring.wdlToSharpness(w, d, l);
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
      return LiChessTools.Material.simpleMaterial(node?.fen, isTotal, side);
    }

    static onBoard(x, y) {
      return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
    static pieceTension(x, y, board, withSupport) {
      const underAttack = [];
      const co = ChessMetrics.chessops;
      const b = board;
      if (!co || !b) return underAttack;
      const sq = ChessMetrics._square(x, y);
      const piece = b.get(sq);
      if (!piece) return underAttack;
      const m = piece.color === 'white' ? 1 : -1;
      const spc = ChessMetrics._pieceChar(b, sq);
      const attacked = LiChessTools.MoveGen.attacks(b, sq);
      for (const t of attacked) {
        const tp = b.get(t);
        if (!tp) continue;
        if (m === (tp.color === 'white' ? 1 : -1)) continue;
        underAttack.push({
          m: m,
          sx: x,
          sy: y,
          spc: spc,
          x: t & 7,
          y: 7 - (t >> 3),
          pc: ChessMetrics._pieceChar(b, t)
        });
      }
      if (withSupport && (piece.role === 'queen' || piece.role === 'rook' || piece.role === 'bishop')) {
        const dirs = piece.role === 'queen'
          ? [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]
          : piece.role === 'bishop'
            ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
            : [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dx, dy] of dirs) {
          const isDiagonal = dx && dy;
          const isForward = dy === -m;
          let fx = x + dx;
          let fy = y + dy;
          while (fx >= 0 && fx < 8 && fy >= 0 && fy < 8) {
            const fsq = ChessMetrics._square(fx, fy);
            const pc = b.get(fsq);
            if (!pc) { fx += dx; fy += dy; continue; }
            const pm = pc.color === 'white' ? 1 : -1;
            if (m !== pm) break;
            const pcl = pc.role;
            if (pcl === 'queen') { fx += dx; fy += dy; continue; }
            if (isDiagonal && pcl === 'bishop') { fx += dx; fy += dy; continue; }
            if (!isDiagonal && pcl === 'rook') { fx += dx; fy += dy; continue; }
            if ((isForward && pcl === 'pawn') || pcl === 'king') {
              const bx = fx + dx;
              const by = fy + dy;
              if (bx >= 0 && bx < 8 && by >= 0 && by < 8) {
                const ppc = b.get(ChessMetrics._square(bx, by));
                if (ppc && m !== (ppc.color === 'white' ? 1 : -1)) {
                  underAttack.push({ m: m, sx: x, sy: y, spc: spc, x: bx, y: by, pc: ChessMetrics._pieceChar(b, fsq) });
                }
              }
            }
            break;
          }
        }
      }
      return underAttack;
    }

    static tension = LiChessTools.Cache.memoize((node, lt) => {
      const board = lt.getBoardFromFen(node.fen);
      const underAttack = [];
      for (const { x, y } of ChessMetrics.occupiedSquares(board)) {
        const ua = ChessMetrics.pieceTension(x, y, board, true);
        underAttack.push.apply(underAttack, ua);
      }
      return [...new Set(underAttack.map(i => i.x + ',' + i.y + '=' + i.pc))]
        .map(i => i.split('=')[1].toLowerCase())
        .reduce((acc, val) => ChessMetrics.pieceMaterial[val] + acc, 0);
    }, { key: (node) => node.fen });

    static getAllCapturingMoves = LiChessTools.Cache.memoize((board, lt) => {
      const result = [];
      for (const { x, y } of ChessMetrics.occupiedSquares(board)) {
        const ua = ChessMetrics.pieceTension(x, y, board, false);
        result.push.apply(result, ua);
      }
      return result;
    }, { key: (board) => ChessMetrics._boardFen(board) });

    static materialWon = LiChessTools.Cache.memoize((board, x, y, lt) => {
      const Math = lt.global.Math;
      const b = board;
      if (!b) return 0;
      const sq = ChessMetrics._square(x, y);
      const piece = b.get(sq);
      if (!piece) return 0;
      const ch = ChessMetrics.ROLE_LETTERS[piece.role];
      const side = piece.color === 'white' ? -1 : 1;
      const moves = ChessMetrics.getAllCapturingMoves(board, lt)
        .filter(m => m.x == x && m.y == y && m.m == side)
        .sort((m1, m2) => ChessMetrics.pieceMaterial[m1.spc.toLowerCase()] - ChessMetrics.pieceMaterial[m2.spc.toLowerCase()]);
      const move = moves[0];
      if (!move) return 0;
      let result = ChessMetrics.pieceMaterial[ch] * side;
      const cloned = b.clone();
      const attacker = { color: move.m === 1 ? 'white' : 'black', role: ChessMetrics.LETTER_TO_ROLE[move.spc.toLowerCase()] };
      cloned.take(ChessMetrics._square(move.sx, move.sy));
      cloned.set(sq, attacker);
      result += ChessMetrics.materialWon(cloned, x, y, lt);
      result = Math.sign(result) != side ? 0 : result;
      return result;
    }, { key: (board, x, y) => [ChessMetrics._boardFen(board), x, y].join('|') });

    static maxMaterialWon = LiChessTools.Cache.memoize((board, m, lt) => {
      const Math = lt.global.Math;
      let mx = 0;
      for (const { x, y, ch } of ChessMetrics.occupiedSquares(board)) {
        const pm = ch === ch.toUpperCase() ? 1 : -1;
        if (pm == m) continue; // wrong turn
        const mw = ChessMetrics.materialWon(board, x, y, lt);
        if (Math.sign(mw) == m && Math.abs(mw) > mx) {
          mx = Math.abs(mw);
        }
      }
      return mx * m;
    }, { key: (board, m) => [ChessMetrics._boardFen(board), m].join('|') });
    static getGamePhase(fen, lt) {
      const board = lt.getBoardFromFen(fen);
      if (!board) return 'opening';
      const b = board;
      const co = ChessMetrics.chessops;
      if (!b || !co) return 'opening';

      const majorsAndMinors = () => b.knight.size() + b.bishop.size() + b.rook.size() + b.queen.size();

      const backrankSparse = () => co.SquareSet.fromRank(0).intersect(b.occupied).size() < 4
        || co.SquareSet.fromRank(7).intersect(b.occupied).size() < 4;

      const score = (y) => {
        return (white, black) => {
          const w = Number(white);
          const bn = Number(black);
          switch (true) {
            case w === 0 && bn === 0: return 0;
            case w === 1 && bn === 0: return 1 + (8 - y);
            case w === 2 && bn === 0: return y > 2 ? 2 + (y - 2) : 0;
            case w === 3 && bn === 0: return y > 1 ? 3 + (y - 1) : 0;
            case w === 4 && bn === 0: return y > 1 ? 3 + (y - 1) : 0;
            case w === 0 && bn === 1: return 1 + y;
            case w === 1 && bn === 1: return 5 + Math.abs(4 - y);
            case w === 2 && bn === 1: return 4 + (y - 1);
            case w === 3 && bn === 1: return 5 + (y - 1);
            case w === 0 && bn === 2: return y < 6 ? 2 + (6 - y) : 0;
            case w === 1 && bn === 2: return 4 + (7 - y);
            case w === 2 && bn === 2: return 7;
            case w === 0 && bn === 3: return y < 7 ? 3 + (7 - y) : 0;
            case w === 1 && bn === 3: return 5 + (7 - y);
            case w === 0 && bn === 4: return y < 7 ? 3 + (7 - y) : 0;
            default: return 0;
          }
        };
      };

      const mixedness = () => {
        let acc = 0;
        for (let y = 0; y <= 6; ++y) {
          for (let x = 0; x <= 6; ++x) {
            let white = 0, black = 0;
            for (let dy = 0; dy < 2; ++dy) {
              for (let dx = 0; dx < 2; ++dx) {
                const piece = b.get(ChessMetrics._square(x + dx, y + dy));
                if (!piece) continue;
                if (piece.color === 'white') ++white;
                else ++black;
              }
            }
            acc += score(7 - y)(white, black);
          }
        }
        return acc;
      };

      const mm = majorsAndMinors();
      const bs = backrankSparse();
      const mx = mixedness();

      if (mm <= 6) return 'endGame';
      if (mm <= 10 || bs || mx > 150) return 'middleGame';
      return 'opening';
    }
    static getStructure(board, blackOrientation) {
      return LiChessTools.PawnStructure.getStructure(board, blackOrientation);
    }

    static range(start, end, step) {
      return LiChessTools.PawnStructure.range(start, end, step);
    }
    static getWeakSquares(board, isWhite) {
      return LiChessTools.PawnStructure.getWeakSquares(board, isWhite);
    }
    static getPawns(board, isWhite) {
      return LiChessTools.PawnStructure.getPawns(board, isWhite);
    }
    static getPawnBreaks(board, isWhite) {
      return LiChessTools.PawnStructure.getPawnBreaks(board, isWhite);
    }
  }

  LiChessTools.ChessMetrics = ChessMetrics;
})();
