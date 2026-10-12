(() => {
  class ChessKmapsEvaluator {
    constructor(fen, co) {
      this.co = co;
      this.board = co ? this.parseFEN(fen) : null;
      this.movesCache = new Map();
      this.pieceValues = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
      this.centralSquares = [27, 28, 35, 36];
    }

    parseFEN(fen) {
      if (!fen || !this.co?.fen?.parseBoardFen) return null;
      try {
        const result = this.co.fen.parseBoardFen(String(fen).split(' ')[0]);
        const board = result && typeof result.unwrap === 'function' ? result.unwrap() : result;
        return board || null;
      } catch (e) {
        return null;
      }
    }

    normalize(score, min, max, area) {
      if (score >= max) return 1;
      if (score <= min) return -1;
      return (2 * (score - min)) / (max - min) - 1;
    }

    evaluateKingSafety() {
      const whiteKingIdx = this.board.king.intersect(this.board.white).first();
      const blackKingIdx = this.board.king.intersect(this.board.black).first();
      if (whiteKingIdx === undefined || blackKingIdx === undefined) return 0;
      let whiteScore = 0, blackScore = 0;
      const whitePawnShield = this.getPawnShield(whiteKingIdx, true);
      const blackPawnShield = this.getPawnShield(blackKingIdx, false);
      whiteScore += whitePawnShield * 2;
      blackScore += blackPawnShield * 2;
      const whiteOpenFiles = this.getOpenFilesNearKing(whiteKingIdx, true);
      const blackOpenFiles = this.getOpenFilesNearKing(blackKingIdx, false);
      whiteScore -= whiteOpenFiles * 1.5;
      blackScore -= blackOpenFiles * 1.5;
      const whiteThreats = this.getEnemyThreats(whiteKingIdx, true);
      const blackThreats = this.getEnemyThreats(blackKingIdx, false);
      whiteScore -= whiteThreats * 1;
      blackScore -= blackThreats * 1;
      const whiteHoles = this.getKingHoles(whiteKingIdx, true);
      const blackHoles = this.getKingHoles(blackKingIdx, false);
      whiteScore -= whiteHoles * 0.5;
      blackScore -= blackHoles * 0.5;
      const diff = whiteScore - blackScore;
      return this.normalize(diff, -15, 15, 'K');
    }

    getPawnShield(kingIdx, isWhite) {
      return LiChessTools.PawnStructure.getPawnShield(this.board, kingIdx, isWhite);
    }

    getOpenFilesNearKing(kingIdx, isWhite) {
      return LiChessTools.PawnStructure.getOpenFilesNearKing(this.board, kingIdx, isWhite);
    }

    getEnemyThreats(kingIdx, isWhite) {
      return LiChessTools.PawnStructure.getEnemyThreats(this.board, kingIdx, isWhite);
    }

    getKingHoles(kingIdx, isWhite) {
      return LiChessTools.PawnStructure.getKingHoles(this.board, kingIdx, isWhite);
    }

    canEverBeAttackedByPawn(idx, isWhite) {
      return LiChessTools.PawnStructure.canEverBeAttackedByPawn(this.board, idx, isWhite);
    }

    evaluateMaterial() {
      let whiteMaterial = 0, blackMaterial = 0;
      let whiteBishops = 0, blackBishops = 0;
      let whiteKnights = 0, blackKnights = 0;
      let whiteRooks = 0, blackRooks = 0;
      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        if (piece.role === 'bishop') { if (piece.color === 'white') whiteBishops++; else blackBishops++; }
        else if (piece.role === 'knight') { if (piece.color === 'white') whiteKnights++; else blackKnights++; }
        else if (piece.role === 'rook') { if (piece.color === 'white') whiteRooks++; else blackRooks++; }
        const value = this.pieceValues[piece.role] || 0;
        if (piece.color === 'white') whiteMaterial += value;
        else blackMaterial += value;
      }
      if (whiteBishops == 2) whiteMaterial += 0.3;
      if (blackBishops == 2) blackMaterial += 0.3;
      if (whiteRooks === 1 && whiteBishops + whiteKnights >= 2 && blackRooks === 0) whiteMaterial -= 0.2;
      if (blackRooks === 1 && blackBishops + blackKnights >= 2 && whiteRooks === 0) blackMaterial -= 0.2;
      const diff = whiteMaterial - blackMaterial;
      return this.normalize(diff, -10, 10, 'M');
    }
    evaluatePieceActivity() {
      let whiteScore = 0, blackScore = 0;

      // Mobility: count pseudo-legal moves
      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        const moves = this.getPseudoLegalMoves(sq, piece);
        if (piece.color === 'white') whiteScore += moves.length * 0.1;
        else blackScore += moves.length * 0.1;
      }

      // Bonus for rooks and queens on open files
      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        if (piece.role === 'rook' || piece.role === 'queen') {
          if (this.isOpenFile(sq & 7)) {
            if (piece.color === 'white') whiteScore += 0.3;
            else blackScore += 0.3;
          }
        }
      }

      // Knight outpost bonus
      const outpostSquares = [19, 20, 27, 28, 35, 36, 43, 44]; // d/e files on ranks 3-6
      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        if (piece.role !== 'knight') continue;
        const rank = sq >> 3;
        const file = sq & 7;
        if (outpostSquares.includes(sq)) {
          const isPawn = (t, color) => {
            const p = this.board.get(t);
            return p && p.role === 'pawn' && p.color === color;
          };
          const pawnSupport = piece.color === 'white'
            ? (file > 0 && isPawn((rank - 1) * 8 + file - 1, 'white')) || (file < 7 && isPawn((rank - 1) * 8 + file + 1, 'white'))
            : (file > 0 && isPawn((rank + 1) * 8 + file - 1, 'black')) || (file < 7 && isPawn((rank + 1) * 8 + file + 1, 'black'));
          const enemyPawnAttack = this.canEverBeAttackedByPawn(sq, piece.color === 'black');
          if (!enemyPawnAttack) {
            if (piece.color === 'white') whiteScore += pawnSupport ? 0.3 : 0.15;
            else blackScore += pawnSupport ? 0.3 : 0.15;
          }
        }
      }

      // Central control
      for (const centerIdx of this.centralSquares) {
        let whiteAttacks = 0, blackAttacks = 0;
        for (const sq of this.board.occupied) {
          const piece = this.board.get(sq);
          const attacks = piece.role === 'pawn'
            ? this.getPawnAttacks(sq, piece.color === 'white')
            : this.getPseudoLegalMoves(sq, piece);
          if (attacks.includes(centerIdx)) {
            if (piece.color === 'white') whiteAttacks++;
            else blackAttacks++;
          }
        }
        if (whiteAttacks > blackAttacks) whiteScore += 0.5;
        else if (blackAttacks > whiteAttacks) blackScore += 0.5;
      }

      // Diagonal control
      const longDiagonals = [
        [0, 9, 18, 27, 36, 45, 54, 63], // a1-h8
        [7, 14, 21, 28, 35, 42, 49, 56]  // a8-h1
      ];
      for (const diagonal of longDiagonals) {
        let whiteAttacks = 0, blackAttacks = 0;
        let whitePieceOnDiagonal = false, blackPieceOnDiagonal = false;
        for (const idx of diagonal) {
          const piece = this.board.get(idx);
          if (!piece) continue;
          if (piece.role === 'bishop' || piece.role === 'queen') {
            if (piece.color === 'white') whitePieceOnDiagonal = true;
            else blackPieceOnDiagonal = true;
          }
        }
        for (const sq of this.board.occupied) {
          const piece = this.board.get(sq);
          if (piece.role !== 'bishop' && piece.role !== 'queen') continue;
          const moves = this.getPseudoLegalMoves(sq, piece, true);
          for (const idx of diagonal) {
            if (moves.includes(idx)) {
              if (piece.color === 'white') whiteAttacks++;
              else blackAttacks++;
            }
          }
        }
        if (whitePieceOnDiagonal) whiteScore += 0.3;
        if (blackPieceOnDiagonal) blackScore += 0.3;
        whiteScore += whiteAttacks * 0.1;
        blackScore += blackAttacks * 0.1;
      }

      // Threats
      const whiteKing = this.board.king.intersect(this.board.white).first();
      const blackKing = this.board.king.intersect(this.board.black).first();
      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        const isWhite = piece.color === 'white';
        const moves = piece.role === 'pawn'
          ? this.getPawnAttacks(sq, isWhite).concat(this.getPseudoLegalMoves(sq, piece))
          : this.getPseudoLegalMoves(sq, piece);
        const oppKingIdx = isWhite ? blackKing : whiteKing;
        for (const move of moves) {
          const targetPiece = this.board.get(move);
          if (move === oppKingIdx) {
            if (isWhite) whiteScore += 0.3;
            else blackScore += 0.3;
          }
          if (targetPiece && targetPiece.color !== piece.color) {
            const value = this.pieceValues[targetPiece.role] || 0;
            if (isWhite) whiteScore += value * 0.1;
            else blackScore += value * 0.1;
          }
          if (piece.role === 'pawn') {
            const rank = sq >> 3;
            const file = sq & 7;
            const dir = isWhite ? 1 : -1;
            const nextIdx = (rank + dir) * 8 + file;
            if ((isWhite && rank === 6) || (!isWhite && rank === 1)) {
              const target = this.board.get(nextIdx);
              if (!target || target.color !== piece.color) {
                if (isWhite) whiteScore += 0.4;
                else blackScore += 0.4;
              }
            }
          }
        }
      }

      const diff = whiteScore - blackScore;
      return this.normalize(diff, -15, 15, 'A');
    }
    getPawnAttacks(idx, isWhite) {
      return Array.from(this.co.pawnAttacks(isWhite ? 'white' : 'black', idx));
    }

    getPseudoLegalMoves(sq, piece, control) {
      const cacheKey = piece.role + sq;
      let result = this.movesCache.get(cacheKey);
      if (result) return result;
      const moves = [];
      if (piece.role === 'pawn') {
        if (control) throw new Error('Should not use control=true for pawns');
        const dir = piece.color === 'white' ? 8 : -8;
        const startRank = piece.color === 'white' ? 1 : 6;
        const one = sq + dir;
        if (one >= 0 && one < 64 && !this.board.get(one)) {
          moves.push(one);
          if ((sq >> 3) === startRank) {
            const two = one + dir;
            if (!this.board.get(two)) moves.push(two);
          }
        }
        for (const t of this.co.pawnAttacks(piece.color, sq)) {
          const target = this.board.get(t);
          if (target && target.color !== piece.color) moves.push(t);
        }
      } else {
        let attacked;
        switch (piece.role) {
          case 'knight': attacked = this.co.knightAttacks(sq); break;
          case 'bishop': attacked = this.co.bishopAttacks(sq, this.board.occupied); break;
          case 'rook': attacked = this.co.rookAttacks(sq, this.board.occupied); break;
          case 'queen': attacked = this.co.queenAttacks(sq, this.board.occupied); break;
          case 'king': attacked = this.co.kingAttacks(sq); break;
          default: attacked = this.co.SquareSet.empty(); break;
        }
        for (const t of attacked) {
          const target = this.board.get(t);
          if (target && target.color === piece.color && !control) continue;
          moves.push(t);
        }
      }
      this.movesCache.set(cacheKey, moves);
      return moves;
    }

    isOpenFile(file) {
      return LiChessTools.PawnStructure.isOpenFile(this.board, file);
    }
    evaluatePawnStructure() {
      let whiteScore = 0, blackScore = 0;
      const whitePawns = Array(8).fill(0);
      const blackPawns = Array(8).fill(0);
      for (const sq of this.board.pawn) {
        const piece = this.board.get(sq);
        if (piece.color === 'white') whitePawns[sq & 7]++;
        else blackPawns[sq & 7]++;
      }

      for (let f = 0; f < 8; f++) {
        if (whitePawns[f] > 1) whiteScore -= (whitePawns[f] - 1) * 0.5;
        if (blackPawns[f] > 1) blackScore -= (blackPawns[f] - 1) * 0.5;
      }

      for (let f = 0; f < 8; f++) {
        if (whitePawns[f]) {
          const isIsolated = !whitePawns[Math.max(0, f - 1)] && !whitePawns[Math.min(7, f + 1)];
          if (isIsolated) whiteScore -= 0.5;
        }
        if (blackPawns[f]) {
          const isIsolated = !blackPawns[Math.max(0, f - 1)] && !blackPawns[Math.min(7, f + 1)];
          if (isIsolated) blackScore -= 0.5;
        }
      }

      for (const sq of this.board.pawn) {
        const piece = this.board.get(sq);
        if (piece.color === 'white' && this.isPassedPawn(sq, true)) {
          whiteScore += 0.2 * ((sq >> 3) - 1);
        } else if (piece.color === 'black' && this.isPassedPawn(sq, false)) {
          blackScore += 0.2 * (6 - (sq >> 3));
        }
      }

      const whiteIslands = this.countPawnIslands(whitePawns);
      const blackIslands = this.countPawnIslands(blackPawns);
      whiteScore -= (whiteIslands - 1) * 0.5;
      blackScore -= (blackIslands - 1) * 0.5;

      for (const sq of this.board.pawn) {
        const piece = this.board.get(sq);
        if (piece.color === 'white' && this.isBackwardPawn(sq, true)) {
          whiteScore -= this.isOpenFile(sq & 7) ? 0.5 : 0.3;
        }
        if (piece.color === 'black' && this.isBackwardPawn(sq, false)) {
          blackScore -= this.isOpenFile(sq & 7) ? 0.5 : 0.3;
        }
      }

      for (const sq of this.board.pawn) {
        const piece = this.board.get(sq);
        const isWhite = piece.color === 'white';
        const file = sq & 7;
        const supportOffsets = isWhite ? [-9, -7] : [7, 9];
        for (const offset of supportOffsets) {
          const supportIdx = sq + offset;
          if (supportIdx >= 0 && supportIdx < 64 && Math.abs((supportIdx % 8) - file) === 1) {
            const support = this.board.get(supportIdx);
            if (support && support.role === 'pawn' && support.color === piece.color) {
              if (isWhite) whiteScore += 0.1;
              else blackScore += 0.1;
            }
          }
        }
      }

      const diff = whiteScore - blackScore;
      return this.normalize(diff, -7, 7, 'P');
    }

    isPassedPawn(idx, isWhite) {
      const file = idx & 7;
      const rank = idx >> 3;
      const direction = isWhite ? 1 : -1;
      for (let r = rank + direction; isWhite ? r < 8 : r >= 0; r += direction) {
        for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
          const piece = this.board.get(r * 8 + f);
          if (piece && piece.role === 'pawn' && piece.color === (isWhite ? 'black' : 'white')) return false;
        }
      }
      return true;
    }

    countPawnIslands(pawns) {
      let islands = 0;
      let inIsland = false;
      for (let f = 0; f < 8; f++) {
        if (pawns[f] > 0) {
          if (!inIsland) { islands++; inIsland = true; }
        } else {
          inIsland = false;
        }
      }
      return islands;
    }

    canBeCaptured(idx, isWhite) {
      const enemy = isWhite ? 'black' : 'white';
      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        if (!piece || piece.color !== enemy) continue;
        const moves = piece.role === 'pawn'
          ? this.getPawnAttacks(sq, piece.color === 'white')
          : this.getPseudoLegalMoves(sq, piece);
        if (moves.includes(idx)) return true;
      }
      return false;
    }

    isBackwardPawn(idx, isWhite) {
      const file = idx & 7;
      const rank = idx >> 3;
      const dir = isWhite ? 1 : -1;
      const nextRank = rank + dir;
      if (nextRank < 0 || nextRank > 7) return false;
      const forwardIdx = nextRank * 8 + file;
      if (this.board.get(forwardIdx)) return false;
      if (!this.canBeCaptured(forwardIdx, isWhite)) return false;
      const friendly = (sq) => {
        const p = this.board.get(sq);
        return p && p.role === 'pawn' && p.color === (isWhite ? 'white' : 'black');
      };
      return !((file > 0 && friendly(rank * 8 + file - 1)) || (file < 7 && friendly(rank * 8 + file + 1)));
    }
    evaluateSpace() {
      let whiteScore = 0, blackScore = 0;
      const whiteControlled = new Set();
      const blackControlled = new Set();
      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        const isWhite = piece.color === 'white';
        const moves = piece.role === 'pawn'
          ? this.getPawnAttacks(sq, isWhite)
          : this.getPseudoLegalMoves(sq, piece, true);
        for (const move of moves) {
          const rank = move >> 3;
          if (isWhite && rank >= 4) whiteControlled.add(move);
          if (!isWhite && rank <= 3) blackControlled.add(move);
        }
      }
      whiteScore += whiteControlled.size * 0.1;
      blackScore += blackControlled.size * 0.1;

      for (const idx of this.centralSquares) {
        const piece = this.board.get(idx);
        if (piece && piece.role === 'pawn') {
          if (piece.color === 'white') whiteScore += 1;
          else blackScore += 1;
        }
      }

      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        if (!piece || piece.role === 'king') continue;
        const isWhite = piece.color === 'white';
        const moves = piece.role === 'pawn'
          ? this.getPseudoLegalMoves(sq, piece).concat(this.getPawnAttacks(sq, isWhite))
          : this.getPseudoLegalMoves(sq, piece);
        if (moves.length === 0) {
          const penalty = this.pieceValues[piece.role] || 1;
          if (isWhite) whiteScore -= penalty * 0.1 + 0.2;
          else blackScore -= penalty * 0.1 + 0.2;
        }
      }

      const diff = whiteScore - blackScore;
      return this.normalize(diff, -7, 7, 'S');
    }

    async evaluate() {
      if (!this.board) return { K: 0, M: 0, A: 0, P: 0, S: 0 };
      return {
        K: this.evaluateKingSafety(),
        M: this.evaluateMaterial(),
        A: this.evaluatePieceActivity(),
        P: this.evaluatePawnStructure(),
        S: this.evaluateSpace(),
      };
    }
  }

  LiChessTools.ChessKmapsEvaluator = ChessKmapsEvaluator;
})();
