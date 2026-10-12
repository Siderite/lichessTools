(() => {
  class ChessKmapsEvaluator {
    static WEIGHTS = {
      kingSafety: { pawnShield: 2, openFiles: -1.5, threats: -1, holes: -0.5, range: [-15, 15] },
      material: { bishopPair: 0.3, rookPenalty: -0.2, range: [-10, 10] },
      activity: {
        mobility: 0.1, openFile: 0.3, outpostSupported: 0.3, outpost: 0.15, central: 0.5,
        diagonalPiece: 0.3, diagonalAttack: 0.1, kingThreat: 0.3, pieceThreat: 0.1, pawnPush: 0.4,
        range: [-15, 15],
      },
      pawns: {
        doubled: -0.5, isolated: -0.5, passed: 0.2, island: -0.5,
        backwardOpen: -0.5, backward: -0.3, support: 0.1, range: [-7, 7],
      },
      space: { control: 0.1, centralPawn: 1, trapped: -0.1, trappedBase: -0.2, range: [-7, 7] },
    };

    constructor(fen, co) {
      this.co = co;
      this.board = co ? this.parseFEN(fen) : null;
      this.memoMoves = LiChessTools.Cache.memoize(this._computePseudoLegalMoves.bind(this), { key: (sq, piece) => piece.role + sq, size: 1000 });
      this.pieceValues = LiChessTools.Material.VALUE;
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
      return LiChessTools.Scoring.normalize(score, min, max);
    }

    evaluateKingSafety() {
      const whiteKingIdx = this.board.king.intersect(this.board.white).first();
      const blackKingIdx = this.board.king.intersect(this.board.black).first();
      if (whiteKingIdx === undefined || blackKingIdx === undefined) return 0;
      const W = ChessKmapsEvaluator.WEIGHTS.kingSafety;
      const whiteScore = this.getPawnShield(whiteKingIdx, true) * W.pawnShield
        + this.getOpenFilesNearKing(whiteKingIdx, true) * W.openFiles
        + this.getEnemyThreats(whiteKingIdx, true) * W.threats
        + this.getKingHoles(whiteKingIdx, true) * W.holes;
      const blackScore = this.getPawnShield(blackKingIdx, false) * W.pawnShield
        + this.getOpenFilesNearKing(blackKingIdx, false) * W.openFiles
        + this.getEnemyThreats(blackKingIdx, false) * W.threats
        + this.getKingHoles(blackKingIdx, false) * W.holes;
      return this.normalize(whiteScore - blackScore, W.range[0], W.range[1], 'K');
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
      const W = ChessKmapsEvaluator.WEIGHTS.material;
      const counts = LiChessTools.Material.count(this.board);
      let whiteMaterial = LiChessTools.Material.value(this.board, 'white');
      let blackMaterial = LiChessTools.Material.value(this.board, 'black');
      if (counts.white.bishop == 2) whiteMaterial += W.bishopPair;
      if (counts.black.bishop == 2) blackMaterial += W.bishopPair;
      if (counts.white.rook === 1 && counts.white.bishop + counts.white.knight >= 2 && counts.black.rook === 0) whiteMaterial += W.rookPenalty;
      if (counts.black.rook === 1 && counts.black.bishop + counts.black.knight >= 2 && counts.white.rook === 0) blackMaterial += W.rookPenalty;
      const diff = whiteMaterial - blackMaterial;
      return this.normalize(diff, W.range[0], W.range[1], 'M');
    }
    evaluatePieceActivity() {
      const W = ChessKmapsEvaluator.WEIGHTS.activity;
      let whiteScore = 0, blackScore = 0;

      // Mobility: count pseudo-legal moves
      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        const moves = this.getPseudoLegalMoves(sq, piece);
        if (piece.color === 'white') whiteScore += moves.length * W.mobility;
        else blackScore += moves.length * W.mobility;
      }

      // Bonus for rooks and queens on open files
      for (const sq of this.board.occupied) {
        const piece = this.board.get(sq);
        if (piece.role === 'rook' || piece.role === 'queen') {
          if (this.isOpenFile(sq & 7)) {
            if (piece.color === 'white') whiteScore += W.openFile;
            else blackScore += W.openFile;
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
            if (piece.color === 'white') whiteScore += pawnSupport ? W.outpostSupported : W.outpost;
            else blackScore += pawnSupport ? W.outpostSupported : W.outpost;
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
        if (whiteAttacks > blackAttacks) whiteScore += W.central;
        else if (blackAttacks > whiteAttacks) blackScore += W.central;
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
        if (whitePieceOnDiagonal) whiteScore += W.diagonalPiece;
        if (blackPieceOnDiagonal) blackScore += W.diagonalPiece;
        whiteScore += whiteAttacks * W.diagonalAttack;
        blackScore += blackAttacks * W.diagonalAttack;
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
            if (isWhite) whiteScore += W.kingThreat;
            else blackScore += W.kingThreat;
          }
          if (targetPiece && targetPiece.color !== piece.color) {
            const value = this.pieceValues[targetPiece.role] || 0;
            if (isWhite) whiteScore += value * W.pieceThreat;
            else blackScore += value * W.pieceThreat;
          }
          if (piece.role === 'pawn') {
            const rank = sq >> 3;
            const file = sq & 7;
            const dir = isWhite ? 1 : -1;
            const nextIdx = (rank + dir) * 8 + file;
            if ((isWhite && rank === 6) || (!isWhite && rank === 1)) {
              const target = this.board.get(nextIdx);
              if (!target || target.color !== piece.color) {
                if (isWhite) whiteScore += W.pawnPush;
                else blackScore += W.pawnPush;
              }
            }
          }
        }
      }

      const diff = whiteScore - blackScore;
      return this.normalize(diff, W.range[0], W.range[1], 'A');
    }
    getPawnAttacks(idx) {
      return LiChessTools.MoveGen.attacks(this.board, idx);
    }

    getPseudoLegalMoves(sq, piece, control) {
      return this.memoMoves(sq, piece, control);
    }

    _computePseudoLegalMoves(sq, piece, control) {
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
        for (const t of LiChessTools.MoveGen.attacks(this.board, sq)) {
          const target = this.board.get(t);
          if (target && target.color !== piece.color) moves.push(t);
        }
      } else {
        for (const t of LiChessTools.MoveGen.attacks(this.board, sq)) {
          const target = this.board.get(t);
          if (target && target.color === piece.color && !control) continue;
          moves.push(t);
        }
      }
      return moves;
    }

    isOpenFile(file) {
      return LiChessTools.PawnStructure.isOpenFile(this.board, file);
    }
    evaluatePawnStructure() {
      const W = ChessKmapsEvaluator.WEIGHTS.pawns;
      let whiteScore = 0, blackScore = 0;
      const whitePawns = Array(8).fill(0);
      const blackPawns = Array(8).fill(0);
      for (const sq of this.board.pawn) {
        const piece = this.board.get(sq);
        if (piece.color === 'white') whitePawns[sq & 7]++;
        else blackPawns[sq & 7]++;
      }

      for (let f = 0; f < 8; f++) {
        if (whitePawns[f] > 1) whiteScore += (whitePawns[f] - 1) * W.doubled;
        if (blackPawns[f] > 1) blackScore += (blackPawns[f] - 1) * W.doubled;
      }

      for (let f = 0; f < 8; f++) {
        if (whitePawns[f]) {
          const isIsolated = !whitePawns[Math.max(0, f - 1)] && !whitePawns[Math.min(7, f + 1)];
          if (isIsolated) whiteScore += W.isolated;
        }
        if (blackPawns[f]) {
          const isIsolated = !blackPawns[Math.max(0, f - 1)] && !blackPawns[Math.min(7, f + 1)];
          if (isIsolated) blackScore += W.isolated;
        }
      }

      for (const sq of this.board.pawn) {
        const piece = this.board.get(sq);
        if (piece.color === 'white' && this.isPassedPawn(sq, true)) {
          whiteScore += W.passed * ((sq >> 3) - 1);
        } else if (piece.color === 'black' && this.isPassedPawn(sq, false)) {
          blackScore += W.passed * (6 - (sq >> 3));
        }
      }

      const whiteIslands = this.countPawnIslands(whitePawns);
      const blackIslands = this.countPawnIslands(blackPawns);
      whiteScore += (whiteIslands - 1) * W.island;
      blackScore += (blackIslands - 1) * W.island;

      for (const sq of this.board.pawn) {
        const piece = this.board.get(sq);
        if (piece.color === 'white' && this.isBackwardPawn(sq, true)) {
          whiteScore += this.isOpenFile(sq & 7) ? W.backwardOpen : W.backward;
        }
        if (piece.color === 'black' && this.isBackwardPawn(sq, false)) {
          blackScore += this.isOpenFile(sq & 7) ? W.backwardOpen : W.backward;
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
              if (isWhite) whiteScore += W.support;
              else blackScore += W.support;
            }
          }
        }
      }

      const diff = whiteScore - blackScore;
      return this.normalize(diff, W.range[0], W.range[1], 'P');
    }

    isPassedPawn(idx, isWhite) {
      return LiChessTools.PawnStructure.isPassed(this.board, idx, isWhite);
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
      return LiChessTools.PawnStructure.isBackward(this.board, idx, isWhite);
    }
    evaluateSpace() {
      const W = ChessKmapsEvaluator.WEIGHTS.space;
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
      whiteScore += whiteControlled.size * W.control;
      blackScore += blackControlled.size * W.control;

      for (const idx of this.centralSquares) {
        const piece = this.board.get(idx);
        if (piece && piece.role === 'pawn') {
          if (piece.color === 'white') whiteScore += W.centralPawn;
          else blackScore += W.centralPawn;
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
          if (isWhite) whiteScore += penalty * W.trapped + W.trappedBase;
          else blackScore += penalty * W.trapped + W.trappedBase;
        }
      }

      const diff = whiteScore - blackScore;
      return this.normalize(diff, W.range[0], W.range[1], 'S');
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
