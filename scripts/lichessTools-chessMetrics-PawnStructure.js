(() => {
  class PawnStructure {
    static get co() {
      return LiChessTools.MoveGen.co;
    }

    static _square(x, y) { return x + (7 - y) * 8; }

    static _pieceChar(b, sq) {
      return LiChessTools.Material.letterOf(b.get(sq));
    }

    static range(start, end, step) {
      if (start == end) return [start];
      if (!step) step = end > start ? 1 : -1;
      return Array.from(
        { length: Math.floor((end - start) / step) + 1 },
        (_, i) => start + i * step
      );
    }

    static getStructure(board, blackOrientation) {
      if (!board) return null;
      const b = board;
      const result = {
        pawns: { 'w': new Array(8).fill(-1), 'b': new Array(8).fill(-1) },
        led: { 'w': new Array(8).fill(false), 'b': new Array(8).fill(false) },
        islands: { w: [], b: [] },
        qSide: { 'w': 0, 'b': 0 },
        kSide: { 'w': 0, 'b': 0 }
      };
      for (const sq of b.pawn) {
        const piece = b.get(sq);
        const file = sq & 7;
        const rank = sq >> 3;
        if (piece.color === 'black') {
          if (rank >= 3) {
            if (result.pawns.b[file] > -1) result.led.b[file] = true;
            result.pawns.b[file] = 6 - rank;
          }
        } else {
          if (rank <= 4) {
            if (result.pawns.w[file] > -1) result.led.w[file] = true;
            result.pawns.w[file] = rank - 1;
          }
        }
      }

      const buildIslands = (color) => {
        const ps = result.pawns[color];
        const list = result.islands[color];
        let current = null;
        for (let x = 0; x < 8; x++) {
          if (ps[x] === -1) {
            current = null;
            continue;
          }
          if (current && current.end === x - 1) {
            current.end = x;
          } else {
            current = { start: x, end: x };
            list.push(current);
          }
        }
      };

      buildIslands('w');
      buildIslands('b');

      const calcSide = (color) => {
        const list = result.islands[color];
        if (list.length === 0) return;
        const first = list[0];
        if (first.start < 2) {
          result.qSide[color] = Math.min(3, first.end) - first.start + 1;
        }
        const last = list[list.length - 1];
        if (last.end > 5) {
          result.kSide[color] = last.end - Math.max(4, last.start) + 1;
        }
      };

      calcSide('w');
      calcSide('b');

      const [me, they] = blackOrientation ? ['b', 'w'] : ['w', 'b'];
      const toChar = (s) => {
        if (s == ' ') return s;
        if (s == 'Q') {
          const mv = result.qSide[me];
          const mt = result.qSide[they];
          return mv > mt ? 'M' : mv < mt ? 'T' : 'X';
        }
        if (s == 'K') {
          const mv = result.kSide[me];
          const mt = result.kSide[they];
          return mv > mt ? 'M' : mv < mt ? 'T' : 'X';
        }
        if (s.startsWith('P')) {
          const v = result.pawns[s[1] == 'M' ? me : they][+s[2]];
          return v < 0 ? 'X' : v;
        }
        if (s.startsWith('L')) {
          const v = result.led[s[1] == 'M' ? me : they][+s[2]];
          return v ? 'L' : 'X';
        }
        throw new Error('Unknown primitive: ' + s);
      };
      const structureText = [
        'PM3', 'PM4', 'PM2', 'PT3', 'PT4', 'PT2', 'Q', 'K', ' ',
        'PM5', 'PM1', 'PM6', 'PT5', 'PT1', 'PT6', ' ',
        'PM0', 'PM7', 'PT0', 'PT7', ' ',
        'LM3', 'LM4', 'LM2', 'LT3', 'LT4', 'LT2', ' ',
        'LM5', 'LM1', 'LM6', 'LT5', 'LT1', 'LT6', ' ',
        'LM0', 'LM7', 'LT0', 'LT7',
      ].map(toChar).join('');
      return structureText;
    }

    static getWeakSquares(board, isWhite) {
      const result = [];
      const b = board;
      if (!b) return result;
      const pawn = isWhite ? 'P' : 'p';
      const opponentPawn = isWhite ? 'p' : 'P';
      const dy = isWhite ? -1 : 1;
      const at = (x, y) => (x >= 0 && x < 8 && y >= 0 && y < 8) ? PawnStructure._pieceChar(b, PawnStructure._square(x, y)) : null;
      for (let x = 0; x < 8; x++) {
        const candidates = [];
        for (let y = 0; y < 8; y++) {
          if (b.get(PawnStructure._square(x, y))) continue;
          if ((isWhite || y > 1) && (!isWhite || y < 6) && at(x, y - dy) === pawn) {
            candidates.push(y);
          } else
          if ((isWhite || y < 4) && (!isWhite || y > 3) && (at(x + 1, y + dy) === opponentPawn || at(x - 1, y + dy) === opponentPawn)) {
            candidates.push(y);
          }
        }
        for (const c of candidates) {
          let weak = true;
          const ys = isWhite ? (c < 6 ? PawnStructure.range(c + 1, 6) : []) : (c > 1 ? PawnStructure.range(c - 1, 1) : []);
          for (const y of ys) {
            if (at(x - 1, y) === pawn || at(x + 1, y) === pawn) {
              weak = false;
              break;
            }
          }
          if (weak) result.push({ x: x, y: c });
        }
      }
      return result;
    }
    static getPawns(board, isWhite) {
      const b = board;
      if (!b) return [];
      const myPawns = [];
      for (const sq of b.pawn) {
        const piece = b.get(sq);
        const x = sq & 7;
        const y = 7 - (sq >> 3);
        if (piece.color === (isWhite ? 'white' : 'black')) {
          myPawns.push({ x, y });
        }
      }
      const files = PawnStructure.range(0, 7).filter(x => myPawns.find(p => p.x == x));
      files.filter(f => !files.includes(f - 1) && !files.includes(f + 1))
           .forEach(f => myPawns.filter(p => p.x == f).forEach(p => p.isolated = true));

      myPawns
        .filter(p => p.x > 1 && p.x < 6 && (isWhite || p.y > 1) && (!isWhite || p.y < 6))
        .forEach(p => {
          let surroundingPawns = [];
          if (!files.includes(p.x - 1) && !files.includes(p.x + 2)) {
            surroundingPawns = myPawns.filter(mp => mp != p && mp.x == p.x + 1);
          } else
          if (!files.includes(p.x + 1) && !files.includes(p.x - 2)) {
            surroundingPawns = myPawns.filter(mp => mp != p && mp.x == p.x - 1);
          }
          if (surroundingPawns.length != 1) return;
          const op = surroundingPawns[0];
          if (op.x <= 1 || op.x >= 6 || op.y != p.y) return;
          p.hanging = true;
        });

      myPawns.forEach(p => {
        if (PawnStructure.isBackward(b, PawnStructure._square(p.x, p.y), isWhite)) p.backward = true;
      });

      return myPawns;
    }
    static getPawnBreaks(board, isWhite) {
      const b = board;
      if (!b) return [];
      const myPawns = [];
      const theirPawns = [];
      for (const sq of b.pawn) {
        const piece = b.get(sq);
        const x = sq & 7;
        const y = 7 - (sq >> 3);
        if (piece.color === (isWhite ? 'white' : 'black')) {
          myPawns.push({ x, y });
        } else {
          theirPawns.push({ x, y });
        }
      }
      const at = (x, y) => (x >= 0 && x < 8 && y >= 0 && y < 8) ? b.get(PawnStructure._square(x, y)) : null;
      myPawns.forEach(p => {
        const dests = [];
        const dy = isWhite ? -1 : 1;
        if (!at(p.x, p.y + dy)) {
          dests.push({ x: p.x, y: p.y + dy });
          if (p.y == (isWhite ? 6 : 1) && !at(p.x, p.y + dy * 2)) dests.push({ x: p.x, y: p.y + dy * 2 });
        }
        for (const dest of dests) {
          if ([-1, 1].find(dx => myPawns.find(mp => mp.x == dest.x + dx && mp.y == dest.y) && theirPawns.find(tp => tp.x == dest.x + dx && tp.y == dest.y + dy))) {
            (p.breaks ||= []).push(dest);
          }
        }
      });
      return myPawns.filter(p => p.breaks?.length);
    }
    static getPawnShield(board, kingIdx, isWhite) {
      const file = kingIdx & 7;
      let score = 0;
      const offsets = isWhite ? [7, 8, 9] : [-7, -8, -9];
      for (const offset of offsets) {
        const idx = kingIdx + offset;
        if (idx >= 0 && idx < 64 && Math.abs((idx % 8) - file) <= 1) {
          const piece = board.get(idx);
          if (piece && piece.role === 'pawn' && piece.color === (isWhite ? 'white' : 'black')) score += 1;
        }
      }
      return score;
    }

    static getOpenFilesNearKing(board, kingIdx, isWhite) {
      const file = kingIdx & 7;
      let openFiles = 0;
      for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
        if (PawnStructure.co.SquareSet.fromFile(f).intersect(board.pawn).isEmpty()) openFiles++;
      }
      return openFiles;
    }

    static getEnemyThreats(board, kingIdx, isWhite) {
      const file = kingIdx & 7;
      const rank = kingIdx >> 3;
      let threats = 0;
      for (let r = Math.max(0, rank - 2); r <= Math.min(7, rank + 2); r++) {
        for (let f = Math.max(0, file - 2); f <= Math.min(7, file + 2); f++) {
          const piece = board.get(r * 8 + f);
          if (!piece || piece.role === 'king') continue;
          if (piece.color !== (isWhite ? 'white' : 'black')) threats += LiChessTools.Material.VALUE[piece.role] || 0;
        }
      }
      return threats / 10;
    }

    static getKingHoles(board, kingIdx, isWhite) {
      const file = kingIdx & 7;
      const rank = kingIdx >> 3;
      let holes = 0;
      for (let r = Math.max(0, rank - 1); r <= Math.min(7, rank + 1); r++) {
        for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
          if (r === rank && f === file) continue;
          if (isWhite && r >= 6) continue;
          if (!isWhite && r <= 1) continue;
          if (!PawnStructure.canEverBeAttackedByPawn(board, r * 8 + f, isWhite)) holes++;
        }
      }
      return holes;
    }

    static canEverBeAttackedByPawn(board, idx, isWhite) {
      const file = idx & 7;
      const rank = idx >> 3;
      const pawnRank = isWhite ? rank + 1 : rank - 1;
      if (pawnRank < 0 || pawnRank > 7) return false;
      const friendlyPawn = isWhite ? 'white' : 'black';
      for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
        if (f === file) continue;
        const piece = board.get(pawnRank * 8 + f);
        if (piece && piece.role === 'pawn' && piece.color === friendlyPawn) return true;
      }
      return false;
    }

    static isOpenFile(board, file) {
      return PawnStructure.co.SquareSet.fromFile(file).intersect(board.pawn).isEmpty();
    }

    static _sidePawns(board, isWhite) {
      return board.pawn.intersect(isWhite ? board.white : board.black);
    }

    static isPassed(board, sq, isWhite) {
      const file = sq & 7;
      const rank = sq >> 3;
      const dir = isWhite ? 1 : -1;
      const their = PawnStructure._sidePawns(board, !isWhite);
      for (let r = rank + dir; isWhite ? r < 8 : r >= 0; r += dir) {
        for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
          if (their.has(r * 8 + f)) return false;
        }
      }
      return true;
    }

    static isDoubled(board, sq, isWhite) {
      const file = sq & 7;
      const my = PawnStructure._sidePawns(board, isWhite);
      return PawnStructure.co.SquareSet.fromFile(file).intersect(my).size() > 1;
    }

    static isBackward(board, sq, isWhite) {
      const file = sq & 7;
      const rank = sq >> 3;
      const my = PawnStructure._sidePawns(board, isWhite);
      const their = PawnStructure._sidePawns(board, !isWhite);
      for (let r = rank; r >= 0 && r <= 7; r += (isWhite ? -1 : 1)) {
        const s = r * 8 + file;
        if ((file > 0 && my.has(s - 1)) || (file < 7 && my.has(s + 1))) return false;
      }
      const ahead = rank + (isWhite ? 2 : -2);
      if (ahead < 0 || ahead > 7) return false;
      for (const df of [-1, 1]) {
        const f = file + df;
        if (f < 0 || f > 7) continue;
        if (their.has(ahead * 8 + f)) return true;
      }
      return false;
    }
  }

  LiChessTools.PawnStructure = PawnStructure;
})();
