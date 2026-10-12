(() => {

  // Positional valuation (ported from Raccoon by Michael Edegware, GPL v3), adapted to chessops.
  class ChessPositionValuator {
    static PIECE_VALUE_MG = { pawn: 128, knight: 781, bishop: 825, rook: 1276, queen: 2538, king: 0 };
    static PIECE_VALUE_EG = { pawn: 213, knight: 854, bishop: 915, rook: 1380, queen: 1380, king: 0 };

    // Piece-square tables [middlegame, endgame], 64 entries each, a1 = 0 .. h8 = 63 (White's perspective).
    static PAWN_PSQT = [
      [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 10, 19, 16, 19, 7, -5, -9, -15, 11, 15, 32, 22, 5, -22, -8, -23, 6, 20, 40, 17, 4, -12, 13, 0, -13, 1, 11, -2, -13, 5, -5, -12, -7, 22, -8, -5, -15, -18, -7, 7, -3, -13, 5, -16, 10, -8, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, -10, -6, 10, 0, 14, 7, -5, -19, -10, -10, -10, 4, 4, 3, -6, -4, 6, -2, -8, -4, -13, -12, -10, -9, 9, 4, 3, -12, -12, -6, 13, 8, 28, 20, 21, 28, 30, 7, 6, 13, 0, -11, 12, 21, 25, 19, 4, 7, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    static BISHOP_PSQT = [
      [-53, -5, -8, -23, -23, -8, -5, -53, -15, 8, 19, 4, 4, 19, 8, -15, -7, 21, -5, 17, 17, -5, 21, -7, -5, 11, 25, 39, 39, 25, 11, -5, -12, 29, 22, 31, 31, 22, 29, -12, -16, 6, 1, 11, 11, 1, 6, -16, -17, -14, 5, 0, 0, 5, -14, -17, -48, 1, -14, -23, -23, -14, 1, -48],
      [-57, -30, -37, -12, -12, -37, -30, -57, -37, -13, -17, 1, 1, -17, -13, -37, -16, -1, -2, 10, 10, -2, -1, -16, -20, -6, 0, 17, 17, 0, -6, -20, -17, -1, -14, 15, 15, -14, -1, -17, -30, 6, 4, 6, 6, 4, 6, -30, -31, -20, -1, 1, 1, -1, -20, -31, -46, -42, -37, -24, -24, -37, -42, -46]
    ];
    static KNIGHT_PSQT = [
      [-175, -92, -74, -73, -73, -74, -92, -175, -77, -41, -27, -15, -15, -27, -41, -77, -61, -17, 6, 12, 12, 6, -17, -61, -35, 8, 40, 49, 49, 40, 8, -35, -34, 13, 44, 51, 51, 44, 13, -34, -9, 22, 58, 53, 53, 58, 22, -9, -67, -27, 4, 37, 37, 4, -27, -67, -201, -83, -56, -26, -26, -56, -83, -201],
      [-96, -65, -49, -21, -21, -49, -65, -96, -67, -54, -18, 8, 8, -18, -54, -67, -40, -27, -8, 29, 29, -8, -27, -40, -35, -2, 13, 28, 28, 13, -2, -35, -45, -16, 9, 39, 39, 9, -16, -45, -51, -44, -16, 17, 17, -16, -44, -51, -69, -50, -51, 12, 12, -51, -50, -69, -100, -88, -56, -17, -17, -56, -88, -100]
    ];
    static ROOK_PSQT = [
      [-31, -20, -14, -5, -5, -14, -20, -31, -21, -13, -8, 6, 6, -8, -13, -21, -25, -11, -1, 3, 3, -1, -11, -25, -13, -5, -4, -6, -6, -4, -5, -13, -27, -15, -4, 3, 3, -4, -15, -27, -22, -2, 6, 12, 12, 6, -2, -22, -2, 12, 16, 18, 18, 16, 12, -2, -17, -19, -1, 9, 9, -1, -19, -17],
      [-9, -13, -10, -9, -9, -10, -13, -9, -12, -9, -1, -2, -2, -1, -9, -12, 6, -8, -2, -6, -6, -2, -8, 6, -6, 1, -9, 7, 7, -9, 1, -6, -5, 8, 7, -6, -6, 7, 8, -5, 6, 1, -7, 10, 10, -7, 1, 6, 4, 5, 20, -5, -5, 20, 5, 4, 18, 0, 19, 13, 13, 19, 0, 18]
    ];
    static QUEEN_PSQT = [
      [3, -5, -5, 4, 4, -5, -5, 3, -3, 5, 8, 12, 12, 8, 5, 3, -3, 6, 13, 7, 7, 13, 6, -3, 4, 5, 9, 8, 8, 9, 5, 4, 0, 14, 12, 5, 5, 12, 14, 0, -4, 10, 6, 8, 8, 6, 10, -4, -5, 6, 10, 8, 8, 10, 6, -5, -2, -2, 1, -2, -2, 1, -2, -2],
      [-69, -57, -47, -26, -26, -47, -57, -69, -55, -31, -22, -4, -4, -22, -31, -55, -39, -18, -9, 3, 3, -9, -18, -39, -23, -3, 13, 24, 24, 13, -3, -23, -29, -6, 9, 21, 21, 9, -6, -29, -38, -18, -12, 1, 1, -12, -18, -38, -50, -27, -24, -8, -8, -24, -27, -50, -75, -52, -43, -36, -36, -43, -52, -75]
    ];
    static KING_PSQT = [
      [271, 327, 271, 198, 198, 271, 327, 271, 278, 303, 234, 179, 179, 234, 303, 278, 195, 258, 169, 120, 120, 169, 258, 195, 164, 190, 138, 98, 98, 138, 190, 164, 154, 179, 105, 70, 70, 105, 179, 154, 123, 145, 81, 31, 31, 81, 145, 123, 88, 120, 65, 33, 33, 65, 120, 88, 59, 89, 45, -1, -1, 45, 89, 59],
      [1, 45, 85, 76, 76, 85, 45, 1, 53, 100, 133, 135, 135, 133, 100, 53, 88, 130, 169, 175, 175, 169, 130, 88, 103, 156, 172, 172, 172, 172, 156, 103, 96, 166, 199, 199, 199, 199, 166, 96, 92, 172, 184, 191, 191, 184, 172, 92, 47, 121, 116, 131, 131, 116, 121, 47, 11, 59, 73, 78, 78, 73, 59, 11]
    ];

    // MOBILITY_BONUS[phase][pieceIndex][count] - 0 knight, 1 bishop, 2 rook, 3 queen
    static MOBILITY_BONUS = [
      [
        [-62, -53, -12, -4, 3, 13, 22, 28, 33],
        [-48, -20, 16, 26, 38, 51, 55, 63, 63, 68, 81, 81, 91, 98],
        [-58, -27, -15, -10, -5, -2, 9, 16, 30, 29, 32, 38, 46, 48, 58],
        [-39, -21, 3, 3, 14, 22, 28, 41, 43, 48, 56, 60, 60, 66, 67, 70, 71, 73, 79, 88, 88, 99, 102, 102, 106, 109, 113, 116]
      ],
      [
        [-81, -56, -30, -14, 8, 15, 23, 27, 33],
        [-59, -23, -3, 13, 24, 42, 54, 57, 65, 73, 78, 86, 88, 97],
        [-76, -18, 28, 55, 69, 82, 112, 118, 132, 142, 155, 165, 166, 169, 171],
        [-36, -15, 8, 18, 34, 54, 61, 73, 79, 92, 94, 104, 113, 120, 123, 126, 133, 136, 140, 143, 148, 166, 170, 175, 184, 191, 206, 212]
      ]
    ];

    // Material imbalance (Stockfish-style) - qo: our pieces, qt: their pieces
    static QO = [[1438], [40, 38], [32, 255, -62], [0, 104, 4, 0], [-26, -2, 47, 105, -208], [-189, 24, 117, 133, -134, -6]];
    static QT = [[0], [36, 0], [9, 63, 0], [59, 65, 42, 0], [46, 39, 24, -24, 0], [97, 100, -42, 137, 268, 0]];

    static ISOLATED_PAWN = [5, 15];
    static BACKWARD_PAWN = [9, 24];
    static DOUBLE_PAWN = [11, 56];
    static WEAK_UNOPPOSED_PAWN = [13, 27];
    static WEAK_LEVER_PAWN = [0, 56];

    static OUTPOST_T = [[0, 32, 30, 60], [0, 10, 21, 42]];
    static MINOR_BEHIND_T = [18, 3];
    static BISHOP_PAWN_T = [3, 7];
    static ROOK_QUEEN_FILE_T = [7, 6];
    static ROOK_ON_FILE_T = [[0, 21, 47], [0, 4, 25]];
    static TRAPPED_ROOK_T = [52, 10];
    static WEAK_QUEEN_T = [49, 15];
    static KING_PROTECTION_T = [7, 8];
    static LONG_DIAGONAL_BISHOP_T = 45;
    static PAWN_PUSH_THREAT_T = [48, 39];

    constructor(co, addTempo) {
      this.co = co;
      this.addTempo = !!addTempo;
    }

    evaluate(fen) {
      if (!this.co) return 0;
      const pos = this._setup(fen);
      if (!pos) return 0;
      return this._mainEvaluate(pos);
    }

    _setup(fen) {
      const co = this.co;
      const setup = co.fen.parseFen(fen);
      const value = setup && typeof setup.unwrap === 'function' ? setup.unwrap() : setup;
      const board = value?.board;
      if (!board) return null;
      const white = board.white;
      const black = board.black;
      const pos = {
        board,
        turn: value.turn,
        halfmoves: value.halfmoves || 0,
        occupied: board.occupied,
        wP: board.pawn.intersect(white),
        bP: board.pawn.intersect(black),
        wN: board.knight.intersect(white),
        bN: board.knight.intersect(black),
        wB: board.bishop.intersect(white),
        bB: board.bishop.intersect(black),
        wR: board.rook.intersect(white),
        bR: board.rook.intersect(black),
        wQ: board.queen.intersect(white),
        bQ: board.queen.intersect(black),
        wK: board.king.intersect(white),
        bK: board.king.intersect(black),
        castlingWhite: this._canCastle(fen, 'white'),
        castlingBlack: this._canCastle(fen, 'black'),
      };
      pos.pawnFileWhite = this._pawnFileCounts(pos.wP);
      pos.pawnFileBlack = this._pawnFileCounts(pos.bP);
      return pos;
    }

    _canCastle(fen, color) {
      const field = fen.split(' ')[2] || '';
      return color === 'white' ? /[KQ]/.test(field) : /[kq]/.test(field);
    }

    _pawnFileCounts(pawns) {
      const counts = new Array(8).fill(0);
      for (const sq of pawns) counts[sq & 7]++;
      return counts;
    }

    _opp(color) { return color === 'white' ? 'black' : 'white'; }
    _onBoard(sq) { return sq >= 0 && sq < 64; }
    _relativeRank(color, sq) { const r = sq >> 3; return color === 'white' ? r + 1 : 8 - r; }
    _first(set) { return set.first ? set.first() : Array.from(set)[0]; }
    _newEval() { return { psqt: [0, 0], pawns: [0, 0], pieces: [0, 0], mobility: [0, 0], threat: [0, 0] }; }

    _psqt(table, sq, color) {
      const idx = color === 'white' ? sq : (sq ^ 56);
      return [table[0][idx], table[1][idx]];
    }

    _mobBonus(phase, idx, mb) {
      const arr = ChessPositionValuator.MOBILITY_BONUS[phase][idx];
      return arr[Math.max(0, Math.min(mb, arr.length - 1))];
    }

    _material(pos, phase) {
      const V = phase === 0 ? ChessPositionValuator.PIECE_VALUE_MG : ChessPositionValuator.PIECE_VALUE_EG;
      return LiChessTools.Material.value(pos.board, 'white', V) - LiChessTools.Material.value(pos.board, 'black', V);
    }

    _nonPawnMaterial(pos, color) {
      const V = ChessPositionValuator.PIECE_VALUE_MG;
      const counts = LiChessTools.Material.count(pos.board)[color];
      return counts.knight * V.knight + counts.bishop * V.bishop + counts.rook * V.rook + counts.queen * V.queen;
    }

    _imbalance(pos) {
      const qo = ChessPositionValuator.QO;
      const qt = ChessPositionValuator.QT;
      const counts = [
        [pos.wB.size() > 1 ? 1 : 0, pos.wP.size(), pos.wN.size(), pos.wB.size(), pos.wR.size(), pos.wQ.size()],
        [pos.bB.size() > 1 ? 1 : 0, pos.bP.size(), pos.bN.size(), pos.bB.size(), pos.bR.size(), pos.bQ.size()],
      ];
      const imbalance = (my) => {
        const opp = my ^ 1;
        let bonus = 0;
        for (let j = 0; j <= 5; ++j) {
          if (!counts[my][j]) continue;
          let v = 0;
          for (let i = 0; i <= j; ++i) {
            v += qo[j][i] * counts[my][i] + qt[j][i] * counts[opp][i];
          }
          bonus += counts[my][j] * v;
        }
        return bonus;
      };
      const v = imbalance(0) - imbalance(1);
      return [(v / 16) | 0, (v / 16) | 0];
    }

    _phase(pos) {
      const mgLimit = 15258;
      const egLimit = 3915;
      let npm = this._nonPawnMaterial(pos, 'white') + this._nonPawnMaterial(pos, 'black');
      npm = Math.max(egLimit, Math.min(npm, mgLimit));
      return (((npm - egLimit) * 128) / (mgLimit - egLimit)) | 0;
    }

    _oppositeBishops(pos) {
      if (pos.wB.size() !== 1 || pos.bB.size() !== 1) return 0;
      const color = sq => ((sq & 7) + (sq >> 3)) & 1;
      return color(this._first(pos.wB)) !== color(this._first(pos.bB)) ? 1 : 0;
    }

    _scaleFactor(pos, eg) {
      let sf = 64;
      const posW = eg > 0 ? pos.turn : this._opp(pos.turn);
      const posB = eg > 0 ? this._opp(pos.turn) : pos.turn;
      const pcWhite = (posW === 'white' ? pos.wP : pos.bP).size();
      const pcBlack = (posB === 'white' ? pos.wP : pos.bP).size();
      const PV = ChessPositionValuator.PIECE_VALUE_MG;
      const npmWhite = this._nonPawnMaterial(pos, posW);
      const npmBlack = this._nonPawnMaterial(pos, posB);
      const bishopValueMg = PV.bishop;
      const rookValueMg = PV.rook;
      if (pcWhite === 0 && npmWhite - npmBlack <= bishopValueMg) {
        sf = npmWhite < rookValueMg ? 0 : (npmBlack <= bishopValueMg ? 4 : 14);
      }
      if (sf === 64) {
        const ob = this._oppositeBishops(pos);
        if (ob && npmWhite === bishopValueMg && npmBlack === bishopValueMg) {
          sf = 22;
        } else {
          sf = Math.min(sf, 36 + (ob ? 2 : 7) * pcWhite);
        }
        const rule50 = pos.halfmoves;
        sf = Math.max(0, sf - (((rule50 - 12) / 4) | 0));
      }
      return sf;
    }
    _isCentral(sq) { const f = sq & 7; return f >= 2 && f <= 5; }

    _scanPawns(pos, pawnColor, centralBlocked) {
      for (const sq of pos.wP) {
        const dark = (((sq & 7) + (sq >> 3)) & 1) === 0;
        pawnColor[0][dark ? 1 : 0]++;
        if (this._isCentral(sq) && this._onBoard(sq + 8) && pos.occupied.has(sq + 8)) centralBlocked[0]++;
      }
      for (const sq of pos.bP) {
        const dark = (((sq & 7) + (sq >> 3)) & 1) === 0;
        pawnColor[1][dark ? 1 : 0]++;
        if (this._isCentral(sq) && this._onBoard(sq - 8) && pos.occupied.has(sq - 8)) centralBlocked[1]++;
      }
    }

    _supported(pos, color, sq) {
      const pawns = color === 'white' ? pos.wP : pos.bP;
      return pawns.intersect(this.co.pawnAttacks(this._opp(color), sq)).size();
    }

    _phalanx(pos, color, sq) {
      const pawns = color === 'white' ? pos.wP : pos.bP;
      const f = sq & 7;
      if (f > 0 && pawns.has(sq - 1)) return 1;
      if (f < 7 && pawns.has(sq + 1)) return 1;
      return 0;
    }

    _opposed(pos, color, sq) {
      const files = color === 'white' ? pos.pawnFileBlack : pos.pawnFileWhite;
      return files[sq & 7] > 0 ? 1 : 0;
    }

    _connected(pos, color, sq) {
      return this._supported(pos, color, sq) || this._phalanx(pos, color, sq) ? 1 : 0;
    }

    _isolated(pos, color, sq) {
      const files = color === 'white' ? pos.pawnFileWhite : pos.pawnFileBlack;
      const f = sq & 7;
      if (f === 0) return files[1] === 0;
      if (f === 7) return files[6] === 0;
      return files[f + 1] === 0 && files[f - 1] === 0;
    }

    _doubled(pos, color, sq) {
      return LiChessTools.PawnStructure.isDoubled(pos.board, sq, color === 'white') ? 1 : 0;
    }

    _backward(pos, color, sq) {
      return LiChessTools.PawnStructure.isBackward(pos.board, sq, color === 'white') ? 1 : 0;
    }

    _connectedBonus(pos, color, sq) {
      const seed = [0, 7, 8, 12, 29, 48, 86];
      const op = this._opposed(pos, color, sq);
      const ph = this._phalanx(pos, color, sq);
      const su = this._supported(pos, color, sq);
      let r = sq >> 3;
      if (r === 0 || r === 7) return 0;
      r = color === 'white' ? r : 7 - r;
      return seed[r] * (2 + ph - op) + 21 * su;
    }

    _weakUnopposed(pos, color, sq) {
      if (this._opposed(pos, color, sq)) return 0;
      if (this._isolated(pos, color, sq)) return 1;
      if (this._backward(pos, color, sq)) return 1;
      return 0;
    }

    _weakLever(pos, color, sq) {
      if (this._supported(pos, color, sq)) return 0;
      const oppPawns = color === 'white' ? pos.bP : pos.wP;
      const sg = color === 'white' ? 1 : -1;
      for (const d of [7, 9]) {
        const t = sq + d * sg;
        if (this._onBoard(t) && !oppPawns.has(t)) return 0;
      }
      return 1;
    }

    _pawns(pos, color, ctx) {
      const v = this._newEval();
      const pawns = color === 'white' ? pos.wP : pos.bP;
      const table = ChessPositionValuator.PAWN_PSQT;
      for (const sq of pawns) {
        const p = this._psqt(table, sq, color);
        v.psqt[0] += p[0]; v.psqt[1] += p[1];
        if (this._isolated(pos, color, sq)) {
          v.pawns[0] -= ChessPositionValuator.ISOLATED_PAWN[0];
          v.pawns[1] -= ChessPositionValuator.ISOLATED_PAWN[1];
        } else if (this._backward(pos, color, sq)) {
          v.pawns[0] -= ChessPositionValuator.BACKWARD_PAWN[0];
          v.pawns[1] -= ChessPositionValuator.BACKWARD_PAWN[1];
        }
        if (this._doubled(pos, color, sq)) {
          v.pawns[0] -= ChessPositionValuator.DOUBLE_PAWN[0];
          v.pawns[1] -= ChessPositionValuator.DOUBLE_PAWN[1];
        }
        if (this._connected(pos, color, sq)) {
          const cb = this._connectedBonus(pos, color, sq);
          v.pawns[0] += cb;
          const r = this._relativeRank(color, sq);
          v.pawns[1] += (cb * (r - 3) / 4) | 0;
        }
        if (this._weakUnopposed(pos, color, sq)) {
          v.pawns[0] -= ChessPositionValuator.WEAK_UNOPPOSED_PAWN[0];
          v.pawns[1] -= ChessPositionValuator.WEAK_UNOPPOSED_PAWN[1];
        }
        if (this._weakLever(pos, color, sq)) {
          v.pawns[0] -= ChessPositionValuator.WEAK_LEVER_PAWN[0];
          v.pawns[1] -= ChessPositionValuator.WEAK_LEVER_PAWN[1];
        }
        const ppt = this._pawnPushThreat(pos, this._opp(color), sq);
        v.threat[0] += ChessPositionValuator.PAWN_PUSH_THREAT_T[0] * ppt;
        v.threat[1] += ChessPositionValuator.PAWN_PUSH_THREAT_T[1] * ppt;
      }
      return v;
    }
    _mobilityArea(pos, color, sq) {
      const piece = pos.board.get(sq);
      if (!piece) return 0;
      if (piece.role === 'king' || piece.role === 'queen') return 0;
      if (this._supported(pos, this._opp(color), sq)) return 0;
      if (piece.role === 'pawn') {
        if (this._relativeRank(color, sq) < 4) return 0;
        if (pos.occupied.has(sq + (color === 'white' ? 8 : -8))) return 0;
      }
      return 1;
    }

    _mobility(pos, color, sq) {
      const co = this.co;
      const piece = pos.board.get(sq);
      if (!piece) return 0;
      const role = piece.role;
      if (role !== 'knight' && role !== 'bishop' && role !== 'rook' && role !== 'queen') return 0;
      let attacks;
      if (role === 'knight') attacks = co.knightAttacks(sq);
      else if (role === 'bishop') attacks = co.bishopAttacks(sq, pos.occupied);
      else if (role === 'rook') attacks = co.rookAttacks(sq, pos.occupied);
      else attacks = co.queenAttacks(sq, pos.occupied);
      const ownQueen = color === 'white' ? pos.wQ : pos.bQ;
      let v = 0;
      for (const t of attacks) {
        if (!this._mobilityArea(pos, color, t)) continue;
        if ((role === 'knight' || role === 'bishop') && ownQueen.has(t)) continue;
        v++;
      }
      return v;
    }

    _outpostSquare(pos, color, sq) {
      const r = this._relativeRank(color, sq);
      if (r < 4 || r > 6) return 0;
      if (!this._supported(pos, color, sq)) return 0;
      const f = sq & 7;
      const oppFiles = color === 'white' ? pos.pawnFileBlack : pos.pawnFileWhite;
      if ((f === 0 || oppFiles[f - 1] === 0) && (f === 7 || oppFiles[f + 1] === 0)) return 1;
      const dir = color === 'white' ? 8 : -8;
      const oppPawn = color === 'white' ? pos.bP : pos.wP;
      let t = sq + dir;
      while (this._onBoard(t)) {
        if (this._onBoard(t - 1) && oppPawn.has(t - 1)) return 0;
        if (this._onBoard(t + 1) && oppPawn.has(t + 1)) return 0;
        t += dir;
      }
      return 1;
    }

    _reachableOutpost(pos, color, sq) {
      const co = this.co;
      const piece = pos.board.get(sq);
      if (!piece || (piece.role !== 'knight' && piece.role !== 'bishop')) return 0;
      for (let r = 2; r <= 5; r++) {
        for (let f = 0; f < 8; f++) {
          const t = f + 8 * r;
          const tp = pos.board.get(t);
          if (tp && tp.color === color) continue;
          if (!this._outpostSquare(pos, color, t)) continue;
          let attacks;
          if (piece.role === 'knight') attacks = co.knightAttacks(sq);
          else attacks = co.bishopAttacks(sq, pos.occupied);
          if (attacks.has(t)) return this._supported(pos, color, t) ? 2 : 1;
        }
      }
      return 0;
    }

    _outpostTotal(pos, color, sq) {
      const piece = pos.board.get(sq);
      if (!piece || (piece.role !== 'knight' && piece.role !== 'bishop')) return 0;
      if (!this._outpostSquare(pos, color, sq)) {
        if (piece.role !== 'knight') return 0;
        const reachable = this._reachableOutpost(pos, color, sq);
        return reachable ? 1 : 0;
      }
      return piece.color === color ? (piece.role === 'knight' ? 3 : 2) : 0;
    }

    _minorBehindPawn(pos, color, sq) {
      const piece = pos.board.get(sq);
      if (!piece || (piece.role !== 'knight' && piece.role !== 'bishop')) return 0;
      const ahead = sq + (color === 'white' ? 8 : -8);
      if (!this._onBoard(ahead)) return 0;
      return pos.board.get(ahead)?.role === 'pawn' ? 1 : 0;
    }

    _bishopPawns(pos, color, sq, ctx) {
      const ci = color === 'white' ? 0 : 1;
      const dark = (((sq & 7) + (sq >> 3)) & 1) === 0;
      return ctx.pawnColor[ci][dark ? 1 : 0] * (1 + ctx.centralBlocked[ci]);
    }

    _kingProtector(pos, color, sq) {
      const piece = pos.board.get(sq);
      if (!piece || (piece.role !== 'knight' && piece.role !== 'bishop')) return 0;
      const kingSq = this._first(color === 'white' ? pos.wK : pos.bK);
      const f = Math.abs((sq & 7) - (kingSq & 7));
      const r = Math.abs((sq >> 3) - (kingSq >> 3));
      return Math.max(f, r);
    }

    _longDiagonalBishop(pos, color, sq) {
      const piece = pos.board.get(sq);
      if (!piece || piece.role !== 'bishop') return 0;
      const f = sq & 7;
      const r = sq >> 3;
      if ((f - r !== 0) && (f - (7 - r) !== 0)) return 0;
      if (Math.min(f, 7 - f) > 2) return 0;
      const dark = ((f + r) & 1) === 0;
      const target = dark ? 36 : 28; // e5 (dark diagonal) or e4 (light diagonal)
      const between = this.co.between(sq, target);
      for (const t of between) {
        if (pos.board.get(t)?.role === 'pawn') return 0;
      }
      return 1;
    }

    _rookOnFile(pos, color, sq) {
      const f = sq & 7;
      const myPawns = (color === 'white' ? pos.pawnFileWhite : pos.pawnFileBlack)[f];
      const allPawns = pos.pawnFileWhite[f] + pos.pawnFileBlack[f];
      if (myPawns !== 0) return 0;
      return allPawns === 0 ? 2 : 1;
    }

    _trappedRook(pos, color, sq) {
      if (this._rookOnFile(pos, color, sq)) return 0;
      if (this._mobility(pos, color, sq) > 3) return 0;
      const kingSq = this._first(color === 'white' ? pos.wK : pos.bK);
      const kf = kingSq & 7;
      const rf = sq & 7;
      return ((kf < 4) === (rf < kf)) ? 1 : 0;
    }

    _weakQueen(pos, color, sq) {
      const piece = pos.board.get(sq);
      if (!piece || piece.role !== 'queen') return 0;
      const oppRooks = color === 'white' ? pos.bR : pos.wR;
      const oppBishops = color === 'white' ? pos.bB : pos.wB;
      if (this.co.rookAttacks(sq, pos.occupied).intersects(oppRooks)) return 1;
      if (this.co.bishopAttacks(sq, pos.occupied).intersects(oppBishops)) return 1;
      return 0;
    }

    _pawnPushThreat(pos, color, sq) {
      const myPawns = color === 'white' ? pos.wP : pos.bP;
      const forward = color === 'white' ? 8 : -8;
      for (const d of [7, 9]) {
        const diag = forward > 0 ? d : -d;
        const pawnSq = sq - (forward + diag);
        const pushTarget = pawnSq + forward;
        if (!this._onBoard(pawnSq) || !this._onBoard(pushTarget)) continue;
        if (!myPawns.has(pawnSq)) continue;
        if (pos.occupied.has(pushTarget)) continue;
        return 1;
      }
      return 0;
    }

    _queen(pos, color, ctx) {
      const v = this._newEval();
      const queens = color === 'white' ? pos.wQ : pos.bQ;
      const table = ChessPositionValuator.QUEEN_PSQT;
      for (const sq of queens) {
        const p = this._psqt(table, sq, color);
        v.psqt[0] += p[0]; v.psqt[1] += p[1];
        const wq = this._weakQueen(pos, color, sq);
        v.pieces[0] -= ChessPositionValuator.WEAK_QUEEN_T[0] * wq;
        v.pieces[1] -= ChessPositionValuator.WEAK_QUEEN_T[1] * wq;
        const mb = this._mobility(pos, color, sq);
        v.mobility[0] += this._mobBonus(0, 3, mb);
        v.mobility[1] += this._mobBonus(1, 3, mb);
        const ppt = this._pawnPushThreat(pos, this._opp(color), sq);
        v.threat[0] += ChessPositionValuator.PAWN_PUSH_THREAT_T[0] * ppt;
        v.threat[1] += ChessPositionValuator.PAWN_PUSH_THREAT_T[1] * ppt;
      }
      return v;
    }

    _pieces(pos, color, ctx) {
      const v = this._newEval();
      for (const sq of (color === 'white' ? pos.wN : pos.bN)) {
        const p = this._psqt(ChessPositionValuator.KNIGHT_PSQT, sq, color);
        v.psqt[0] += p[0]; v.psqt[1] += p[1];
        const opt = this._outpostTotal(pos, color, sq);
        v.pieces[0] += ChessPositionValuator.OUTPOST_T[0][opt];
        v.pieces[1] += ChessPositionValuator.OUTPOST_T[1][opt];
        const mbp = this._minorBehindPawn(pos, color, sq);
        v.pieces[0] += ChessPositionValuator.MINOR_BEHIND_T[0] * mbp;
        v.pieces[1] += ChessPositionValuator.MINOR_BEHIND_T[1] * mbp;
        const kp = this._kingProtector(pos, color, sq);
        v.pieces[0] -= ChessPositionValuator.KING_PROTECTION_T[0] * kp;
        v.pieces[1] -= ChessPositionValuator.KING_PROTECTION_T[1] * kp;
        const mb = this._mobility(pos, color, sq);
        v.mobility[0] += this._mobBonus(0, 0, mb);
        v.mobility[1] += this._mobBonus(1, 0, mb);
        const ppt = this._pawnPushThreat(pos, this._opp(color), sq);
        v.threat[0] += ChessPositionValuator.PAWN_PUSH_THREAT_T[0] * ppt;
        v.threat[1] += ChessPositionValuator.PAWN_PUSH_THREAT_T[1] * ppt;
      }
      for (const sq of (color === 'white' ? pos.wB : pos.bB)) {
        const p = this._psqt(ChessPositionValuator.BISHOP_PSQT, sq, color);
        v.psqt[0] += p[0]; v.psqt[1] += p[1];
        const opt = this._outpostTotal(pos, color, sq);
        v.pieces[0] += ChessPositionValuator.OUTPOST_T[0][opt];
        v.pieces[1] += ChessPositionValuator.OUTPOST_T[1][opt];
        const mbp = this._minorBehindPawn(pos, color, sq);
        v.pieces[0] += ChessPositionValuator.MINOR_BEHIND_T[0] * mbp;
        v.pieces[1] += ChessPositionValuator.MINOR_BEHIND_T[1] * mbp;
        const bsp = this._bishopPawns(pos, color, sq, ctx);
        v.pieces[0] -= ChessPositionValuator.BISHOP_PAWN_T[0] * bsp;
        v.pieces[1] -= ChessPositionValuator.BISHOP_PAWN_T[1] * bsp;
        const kp = this._kingProtector(pos, color, sq);
        v.pieces[0] -= ChessPositionValuator.KING_PROTECTION_T[0] * kp;
        v.pieces[1] -= ChessPositionValuator.KING_PROTECTION_T[1] * kp;
        v.pieces[0] += ChessPositionValuator.LONG_DIAGONAL_BISHOP_T * this._longDiagonalBishop(pos, color, sq);
        const mb = this._mobility(pos, color, sq);
        v.mobility[0] += this._mobBonus(0, 1, mb);
        v.mobility[1] += this._mobBonus(1, 1, mb);
        const ppt = this._pawnPushThreat(pos, this._opp(color), sq);
        v.threat[0] += ChessPositionValuator.PAWN_PUSH_THREAT_T[0] * ppt;
        v.threat[1] += ChessPositionValuator.PAWN_PUSH_THREAT_T[1] * ppt;
      }
      for (const sq of (color === 'white' ? pos.wR : pos.bR)) {
        const p = this._psqt(ChessPositionValuator.ROOK_PSQT, sq, color);
        v.psqt[0] += p[0]; v.psqt[1] += p[1];
        const csb = ctx.queenFiles.has(sq & 7) ? 1 : 0;
        v.pieces[0] += ChessPositionValuator.ROOK_QUEEN_FILE_T[0] * csb;
        v.pieces[1] += ChessPositionValuator.ROOK_QUEEN_FILE_T[1] * csb;
        const ind = this._rookOnFile(pos, color, sq);
        v.pieces[0] += ChessPositionValuator.ROOK_ON_FILE_T[0][ind];
        v.pieces[1] += ChessPositionValuator.ROOK_ON_FILE_T[1][ind];
        const tr = this._trappedRook(pos, color, sq);
        const c = (color === 'white' ? pos.castlingWhite : pos.castlingBlack) ? 1 : 2;
        v.pieces[0] -= tr * ChessPositionValuator.TRAPPED_ROOK_T[0] * c;
        v.pieces[1] -= tr * ChessPositionValuator.TRAPPED_ROOK_T[1] * c;
        const mb = this._mobility(pos, color, sq);
        v.mobility[0] += this._mobBonus(0, 2, mb);
        v.mobility[1] += this._mobBonus(1, 2, mb);
        const ppt = this._pawnPushThreat(pos, this._opp(color), sq);
        v.threat[0] += ChessPositionValuator.PAWN_PUSH_THREAT_T[0] * ppt;
        v.threat[1] += ChessPositionValuator.PAWN_PUSH_THREAT_T[1] * ppt;
      }
      for (const sq of (color === 'white' ? pos.wK : pos.bK)) {
        const p = this._psqt(ChessPositionValuator.KING_PSQT, sq, color);
        v.psqt[0] += p[0]; v.psqt[1] += p[1];
        const ppt = this._pawnPushThreat(pos, this._opp(color), sq);
        v.threat[0] += ChessPositionValuator.PAWN_PUSH_THREAT_T[0] * ppt;
        v.threat[1] += ChessPositionValuator.PAWN_PUSH_THREAT_T[1] * ppt;
      }
      return v;
    }

    _piecesTotal(pos) {
      const pawnColor = [[0, 0], [0, 0]];
      const centralBlocked = [0, 0];
      this._scanPawns(pos, pawnColor, centralBlocked);
      const queenFiles = new Set();
      for (const sq of pos.wQ) queenFiles.add(sq & 7);
      for (const sq of pos.bQ) queenFiles.add(sq & 7);
      const ctx = { pos, pawnColor, centralBlocked, queenFiles };
      const wp = this._pawns(pos, 'white', ctx);
      const bp = this._pawns(pos, 'black', ctx);
      const wq = this._queen(pos, 'white', ctx);
      const bq = this._queen(pos, 'black', ctx);
      const wn = this._pieces(pos, 'white', ctx);
      const bn = this._pieces(pos, 'black', ctx);
      const r = this._newEval();
      r.pawns[0] = wp.pawns[0] - bp.pawns[0];
      r.pawns[1] = wp.pawns[1] - bp.pawns[1];
      r.mobility[0] = (wq.mobility[0] + wn.mobility[0]) - (bq.mobility[0] + bn.mobility[0]);
      r.mobility[1] = (wq.mobility[1] + wn.mobility[1]) - (bq.mobility[1] + bn.mobility[1]);
      r.psqt[0] = (wp.psqt[0] + wq.psqt[0] + wn.psqt[0]) - (bp.psqt[0] + bq.psqt[0] + bn.psqt[0]);
      r.psqt[1] = (wp.psqt[1] + wq.psqt[1] + wn.psqt[1]) - (bp.psqt[1] + bq.psqt[1] + bn.psqt[1]);
      r.pieces[0] = (wq.pieces[0] + wn.pieces[0]) - (bq.pieces[0] + bn.pieces[0]);
      r.pieces[1] = (wq.pieces[1] + wn.pieces[1]) - (bq.pieces[1] + bn.pieces[1]);
      const wThreat = [wp.threat[0] + wq.threat[0] + wn.threat[0], wp.threat[1] + wq.threat[1] + wn.threat[1]];
      const bThreat = [bp.threat[0] + bq.threat[0] + bn.threat[0], bp.threat[1] + bq.threat[1] + bn.threat[1]];
      r.threat[0] = bThreat[0] - wThreat[0];
      r.threat[1] = bThreat[1] - wThreat[1];
      return r;
    }
    _gameEvaluation(pos) {
      const pieces = this._piecesTotal(pos);
      const material = [this._material(pos, 0), this._material(pos, 1)];
      const imbalance = this._imbalance(pos);
      const mg = pieces.psqt[0] + imbalance[0] + pieces.pawns[0] + pieces.pieces[0] + material[0] + pieces.mobility[0] + pieces.threat[0];
      const eg = pieces.psqt[1] + imbalance[1] + pieces.pawns[1] + pieces.pieces[1] + material[1] + pieces.mobility[1] + pieces.threat[1];
      return [mg, eg];
    }

    _mainEvaluate(pos) {
      const gameEval = this._gameEvaluation(pos);
      let mg = gameEval[0];
      let eg = gameEval[1];
      const p = this._phase(pos);
      eg = (eg * this._scaleFactor(pos, eg)) / 64;
      let score = ((mg * p + ((eg * (128 - p)) | 0)) / 128) | 0;
      if (this.addTempo) {
        score += 28 * (pos.turn === 'white' ? 1 : -1);
      }
      return score;
    }
  }

  LiChessTools.ChessPositionValuator = ChessPositionValuator;
})();
