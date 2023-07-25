(function() {

/************************************************\
 ================================================
 
                      WUKONG
              javascript chess engine
           
                        by
                        
                 Code Monkey King
 
 ===============================================
\************************************************/

// chess engine object
const Evaluator = function() {

  /****************************\
   ============================
   
         GLOBAL CONSTANTS

   ============================              
  \****************************/
  
  
  // sides to move  
  const white = 0;
  const black = 1;
  
  // piece encoding  
  const P = 1, N = 2, B = 3, R = 4, Q = 5, K = 6;
  const p = 7, n = 8, b = 9, r = 10, q = 11, k = 12;
  
  // empty square & offboard square
  const e = 0, o = 13;
  
  // square encoding
  const a8 = 0,    b8 = 1,    c8 = 2,   d8 = 3,   e8 = 4,   f8 = 5,   g8 = 6,   h8 = 7;
  const a7 = 16,   b7 = 17,   c7 = 18,  d7 = 19,  e7 = 20,  f7 = 21,  g7 = 22,  h7 = 23;
  const a6 = 32,   b6 = 33,   c6 = 34,  d6 = 35,  e6 = 36,  f6 = 37,  g6 = 39,  h6 = 40;
  const a5 = 48,   b5 = 49,   c5 = 50,  d5 = 51,  e5 = 52,  f5 = 53,  g5 = 54,  h5 = 55;
  const a4 = 64,   b4 = 65,   c4 = 66,  d4 = 67,  e4 = 68,  f4 = 69,  g4 = 70,  h4 = 71;
  const a3 = 80,   b3 = 81,   c3 = 82,  d3 = 83,  e3 = 84,  f3 = 85,  g3 = 86,  h3 = 87;
  const a2 = 96,   b2 = 97,   c2 = 98,  d2 = 99,  e2 = 100, f2 = 101, g2 = 102, h2 = 103;
  const a1 = 112,  b1 = 113,  c1 = 114, d1 = 115, e1 = 116, f1 = 117, g1 = 118, h1 = 119;
  
  // 0x88 chess board representation
  const board = [
    r, n, b, q, k, b, n, r,  o, o, o, o, o, o, o, o,
    p, p, p, p, p, p, p, p,  o, o, o, o, o, o, o, o,
    e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
    e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
    e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
    e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
    P, P, P, P, P, P, P, P,  o, o, o, o, o, o, o, o,
    R, N, B, Q, K, B, N, R,  o, o, o, o, o, o, o, o
  ];
  
  // chess board state variables
  let side = white;
  let fifty = 0;
  let kingSquare = [e1, e8];
  
  // piece list
  const pieceList = {
    // piece counts
    [P]: 0, [N]: 0, [B]: 0, [R]: 0, [Q]: 0, [K]: 0,
    [p]: 0, [n]: 0, [b]: 0, [r]: 0, [q]: 0, [k]: 0,
    
    // list of pieces with associated squares
    pieces: new Array(13 * 10)
  };
  
 
  /****************************\
   ============================
   
           BOARD METHODS

   ============================              
  \****************************/
  
  // reset board
  function resetBoard() {
    // reset board position
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 16; file++) {
        const square = rank * 16 + file;
        if ((square & 0x88) == 0) board[square] = e;
      }
    }
    
    // reset board state variables
    side = -1;
    fifty = 0;
    kingSquare = [0, 0];
    
    
  }
  
  // init piece list
  function initPieceList() {
    // reset piece counts
    for (let piece = P; piece <= k; piece++)
      pieceList[piece] = 0;
    
    // reset piece list
    for (let index = 0; index < pieceList.pieces.length; index++)
      pieceList.pieces[index] = 0;
    
    // associate pieces with squares and count material
    for (let square = 0; square < 128; square++) {
      if ((square & 0x88) == 0) {
        const piece = board[square];
        
        if (piece) {
          pieceList.pieces[piece * 10 + pieceList[piece]] = square;
          pieceList[piece]++;
        }
      }
    }
  }
  
  /****************************\
   ============================
   
            EVALUATION

   ============================              
  \****************************/
  
  /*
       Following material weights and PST values are obtained
      using a mixture of supervised and reinforcement learning
  */
  
  const opening = 0, endgame = 1, middlegame = 2;
  const PAWN_PST = 0, KNIGHT_PST = 1, BISHOP_PST = 2, ROOK_PST = 3, QUEEN_PST = 4, KING_PST = 5;
  const openingPhaseScore = 5900;
  const endgamePhaseScore = 500;

  // material score
  const materialWeights = [
    // opening material score
    [0, 89, 308, 319, 488, 888, 20001, -92, -307, -323, -492, -888, -20002],

    // endgame material score
    [0, 96, 319, 331, 497, 853, 19998, -102, -318, -334, -501, -845, -20000]

  ];

  // piece-square tables
  const pst = [
    // opening phase scores
    [
      // pawn
      [
           0,   0,   0,   0,   0,   0,   0,   0,   o, o, o, o, o, o, o, o,
          -4,  68,  61,  47,  47,  49,  45,  -1,   o, o, o, o, o, o, o, o,
           6,  16,  25,  33,  24,  24,  14,  -6,   o, o, o, o, o, o, o, o,
           0,  -1,   9,  28,  20,   8,  -1,  11,   o, o, o, o, o, o, o, o,
           6,   4,   6,  14,  14,  -5,   6,  -6,   o, o, o, o, o, o, o, o,
          -1,  -8,  -4,   4,   2, -12,  -1,   5,   o, o, o, o, o, o, o, o,
           5,  16,  16, -14, -14,  13,  15,   8,   o, o, o, o, o, o, o, o,
           0,   0,   0,   0,   0,   0,   0,   0,   o, o, o, o, o, o, o, o
      ],

      // knight
      [
         -55, -40, -30, -28, -26, -30, -40, -50,   o, o, o, o, o, o, o, o,
         -37, -15,   0,  -6,   4,   3, -17, -40,   o, o, o, o, o, o, o, o,
         -25,   5,  16,  12,  11,   6,   6, -29,   o, o, o, o, o, o, o, o,
         -24,   5,  21,  14,  18,   9,  11, -26,   o, o, o, o, o, o, o, o,
         -36,  -5,   9,  23,  24,  21,   2, -24,   o, o, o, o, o, o, o, o,
         -32,  -1,   4,  19,  20,   4,  11, -25,   o, o, o, o, o, o, o, o,
         -38, -22,   4,  -1,   8,  -5, -18, -34,   o, o, o, o, o, o, o, o,
         -50, -46, -32, -24, -36, -25, -34, -50,   o, o, o, o, o, o, o, o
      ],

      // bishop
      [
         -16, -15, -12,  -5, -10, -12, -10, -20,   o, o, o, o, o, o, o, o,
         -13,   5,   6,   1,  -6,  -5,   3,  -6,   o, o, o, o, o, o, o, o,
         -16,   6,  -1,  16,   7,  -1,  -6,  -5,   o, o, o, o, o, o, o, o,
         -14,  -1,  11,  14,   4,  10,  11, -13,   o, o, o, o, o, o, o, o,
          -4,   5,  12,  16,   4,   6,   2, -16,   o, o, o, o, o, o, o, o,
         -15,   4,  14,   8,  16,   4,  16, -15,   o, o, o, o, o, o, o, o,
          -5,   6,   6,   6,   3,   6,   9,  -7,   o, o, o, o, o, o, o, o,
         -14,  -4, -15,  -4,  -9,  -4, -12, -14,   o, o, o, o, o, o, o, o
      ],

      // rook
      [
           5,  -2,   6,   2,  -2,  -6,   4,  -2,   o, o, o, o, o, o, o, o,
           8,  13,  11,  15,  11,  15,  16,   4,   o, o, o, o, o, o, o, o,
          -6,   3,   3,   6,   1,  -2,   3,  -5,   o, o, o, o, o, o, o, o,
         -10,   5,  -4,  -4,  -1,  -6,   3,  -2,   o, o, o, o, o, o, o, o,
          -4,   3,   5,  -2,   4,   1,  -5,   1,   o, o, o, o, o, o, o, o,
           0,   1,   1,  -3,   5,   6,   1,  -9,   o, o, o, o, o, o, o, o,
         -10,  -1,  -4,   0,   5,  -6,  -6,  -9,   o, o, o, o, o, o, o, o,
          -1,  -2,  -6,   9,   9,   5,   4,  -5,   o, o, o, o, o, o, o, o
      ],

      // queen
      [
         -25,  -9, -11,  -3,  -7, -13, -10, -17,   o, o, o, o, o, o, o, o,
          -4,  -6,   4,  -5,  -1,   6,   4,  -5,   o, o, o, o, o, o, o, o,
          -8,  -5,   2,   0,   7,   6,  -4,  -5,   o, o, o, o, o, o, o, o,
           0,  -4,   7,  -1,   7,  11,   0,   1,   o, o, o, o, o, o, o, o,
          -6,   4,   7,   1,  -1,   2,  -6,  -2,   o, o, o, o, o, o, o, o,
         -15,  11,  11,  11,   4,  11,   6, -15,   o, o, o, o, o, o, o, o,
          -5,  -6,   1,  -6,   3,  -3,   3, -10,   o, o, o, o, o, o, o, o,
         -15,  -4, -13,  -8,  -3, -16,  -8, -24,   o, o, o, o, o, o, o, o
      ],

      // king
      [
         -30, -40, -40, -50, -50, -40, -40, -30,   o, o, o, o, o, o, o, o,
         -30, -37, -43, -49, -50, -39, -40, -30,   o, o, o, o, o, o, o, o,
         -32, -41, -40, -46, -49, -40, -46, -30,   o, o, o, o, o, o, o, o,
         -32, -38, -39, -52, -54, -39, -39, -30,   o, o, o, o, o, o, o, o,
         -20, -33, -29, -42, -44, -29, -30, -19,   o, o, o, o, o, o, o, o,
         -10, -18, -17, -20, -22, -21, -20, -13,   o, o, o, o, o, o, o, o,
          14,  18,  -1,  -1,   4,  -1,  15,  14,   o, o, o, o, o, o, o, o,
          21,  35,  11,   6,   1,  14,  32,  22,   o, o, o, o, o, o, o, o
      ]
    ],

    // endgame phase score
    [
      // pawn
      [
           0,   0,   0,   0,   0,   0,   0,   0,   o, o, o, o, o, o, o, o,
          -4, 174, 120,  94,  85,  98,  68,   4,   o, o, o, o, o, o, o, o,
           6,  48,  44,  45,  31,  38,  37,  -6,   o, o, o, o, o, o, o, o,
          -6,  -4,  -1,  -6,   2,  -1,  -2,  -2,   o, o, o, o, o, o, o, o,
           2,   2,   5,  -3,   0,  -5,   4,  -3,   o, o, o, o, o, o, o, o,
          -2,   0,   1,   5,   0,  -1,   0,   1,   o, o, o, o, o, o, o, o,
          -2,   5,   6,  -6,   0,   3,   4,  -4,   o, o, o, o, o, o, o, o,
           0,   0,   0,   0,   0,   0,   0,   0,   o, o, o, o, o, o, o, o
      ],

      // knight
      [
         -50, -40, -30, -24, -24, -35, -40, -50,   o, o, o, o, o, o, o, o,
         -38, -17,   6,  -5,   5,  -4, -15, -40,   o, o, o, o, o, o, o, o,
         -24,   3,  15,   9,  15,  10,  -6, -26,   o, o, o, o, o, o, o, o,
         -29,   5,  21,  17,  18,   9,  10, -28,   o, o, o, o, o, o, o, o,
         -36,  -5,  18,  16,  14,  20,   5, -26,   o, o, o, o, o, o, o, o,
         -32,   7,   5,  20,  11,  15,   9, -27,   o, o, o, o, o, o, o, o,
         -43, -20,   5,  -1,   5,   1, -22, -40,   o, o, o, o, o, o, o, o,
         -50, -40, -32, -27, -30, -25, -35, -50,   o, o, o, o, o, o, o, o
      ],

      // bishop
      [
         -14, -13,  -4,  -7, -14,  -9, -16, -20,   o, o, o, o, o, o, o, o,
         -11,   6,   3,  -6,   4,  -3,   5,  -4,   o, o, o, o, o, o, o, o,
         -11,  -3,   5,  15,   4,  -1,  -5, -10,   o, o, o, o, o, o, o, o,
          -7,  -1,  11,  16,   5,  11,   7, -13,   o, o, o, o, o, o, o, o,
          -4,   4,  10,  16,   6,  12,   4, -16,   o, o, o, o, o, o, o, o,
          -4,   4,  11,  12,  10,   7,   7, -12,   o, o, o, o, o, o, o, o,
         -11,   7,   6,   6,  -3,   2,   1,  -7,   o, o, o, o, o, o, o, o,
         -15,  -4, -11,  -4, -10, -10,  -6, -17,   o, o, o, o, o, o, o, o
      ],

      // rook
      [
           5,  -6,   1,  -4,  -4,  -6,   6,  -3,   o, o, o, o, o, o, o, o,
          -6,   4,   2,   5,  -1,   3,   4, -15,   o, o, o, o, o, o, o, o,
         -15,   3,   3,   0,  -1,  -6,   5,  -9,   o, o, o, o, o, o, o, o,
         -16,   6,   0,  -6,  -3,  -3,  -4,  -4,   o, o, o, o, o, o, o, o,
         -15,   6,   2,  -6,   6,   0,  -6, -10,   o, o, o, o, o, o, o, o,
          -6,  -1,   3,  -2,   6,   5,   0, -15,   o, o, o, o, o, o, o, o,
          -8,  -4,   1,  -4,   3,  -5,  -6,  -5,   o, o, o, o, o, o, o, o,
           1,   0,  -2,   1,   1,   4,   2,   0,   o, o, o, o, o, o, o, o
      ],

      // queen
      [
         -21,  -7,  -6,   1,  -8, -15, -10, -16,   o, o, o, o, o, o, o, o,
          -4,  -5,   3,  -4,   2,   6,   3, -10,   o, o, o, o, o, o, o, o,
         -13,  -2,   7,   2,   6,  10,  -4,  -6,   o, o, o, o, o, o, o, o,
          -1,  -4,   3,   1,   8,   8,  -2,  -2,   o, o, o, o, o, o, o, o,
           0,   6,   8,   1,  -1,   1,   0,  -3,   o, o, o, o, o, o, o, o,
         -11,  10,   6,   3,   7,   9,   4, -10,   o, o, o, o, o, o, o, o,
         -12,  -6,   5,   0,   0,  -5,   4, -10,   o, o, o, o, o, o, o, o,
         -20,  -6,  -7,  -7,  -4, -12,  -9, -20,   o, o, o, o, o, o, o, o
      ],

      // king
      [
         -50, -40, -30, -20, -20, -30, -40, -50,   o, o, o, o, o, o, o, o,
         -30, -18, -15,   6,   3,  -6, -24, -30,   o, o, o, o, o, o, o, o,
         -35, -16,  20,  32,  34,  14, -11, -30,   o, o, o, o, o, o, o, o,
         -34,  -5,  24,  35,  34,  35, -16, -35,   o, o, o, o, o, o, o, o,
         -36,  -7,  31,  34,  34,  34, -12, -31,   o, o, o, o, o, o, o, o,
         -30,  -7,  14,  33,  36,  16, -13, -33,   o, o, o, o, o, o, o, o,
         -36, -27,   5,   2,   5,  -1, -31, -33,   o, o, o, o, o, o, o, o,
         -48, -26, -26, -26, -28, -25, -30, -51,   o, o, o, o, o, o, o, o
      ]
    ]
  ];

  // mirror positional score tables for opposite side
  const mirrorSquare = [
    a1, b1, c1, d1, e1, f1, g1, h1,   o, o, o, o, o, o, o, o,
    a2, b2, c2, d2, e2, f2, g2, h2,   o, o, o, o, o, o, o, o,
    a3, b3, c3, d3, e3, f3, g3, h3,   o, o, o, o, o, o, o, o,
    a4, b4, c4, d4, e4, f4, g4, h4,   o, o, o, o, o, o, o, o,
    a5, b5, c5, d5, e5, f5, g5, h5,   o, o, o, o, o, o, o, o,
    a6, b6, c6, d6, e6, f6, g6, h6,   o, o, o, o, o, o, o, o,
    a7, b7, c7, d7, e7, f7, g7, h7,   o, o, o, o, o, o, o, o,
    a8, b8, c8, d8, e8, f8, g8, h8,   o, o, o, o, o, o, o, o
  ];
  
  // insufficient material detection
  function isMaterialDraw() {
    if(pieceList[P] == 0 && pieceList[p] == 0) {
      if (pieceList[R] == 0 && pieceList[r] == 0 && pieceList[Q] == 0 && pieceList[q] == 0) {
        if (pieceList[B] == 0 && pieceList[b] == 0) {
          if (pieceList[N] < 3 && pieceList[n] < 3)
            return 1;
      } else if (pieceList[N] == 0 && pieceList[n] == 0) {
        if (Math.abs(pieceList[B] - pieceList[b]) < 2)
          return 1;
      } else if ((pieceList[N] < 3 && pieceList[B] == 0) || (pieceList[B] == 1 && pieceList[N] == 0)) {
        if ((pieceList[n] < 3 && pieceList[b] == 0) || (pieceList[b] == 1 && pieceList[n] == 0))
          return 1;
        }
      } else if (pieceList[Q] == 0 && pieceList[q] == 0) {
        if (pieceList[R] == 1 && pieceList[r] == 1) {
          if ((pieceList[N] + pieceList[B]) < 2 && (pieceList[n] + pieceList[b]) < 2) return 1;
        } else if (pieceList[R] == 1 && pieceList[r] == 0) {        
          if ((pieceList[N] + pieceList[B] == 0) &&
            (((pieceList[n] + pieceList[b]) == 1) || 
             ((pieceList[n] + pieceList[b]) == 2)))
            return 1;
        } else if (pieceList[r] == 1 && pieceList[R] == 0) {
          if ((pieceList[n] + pieceList[b] == 0) &&
            (((pieceList[N] + pieceList[B]) == 1) ||
             ((pieceList[N] + pieceList[B]) == 2)))
            return 1;
        }
      }
    }
    
    return 0;
  }
  
  // get game phase score
  function getGamePhaseScore() {
    let gamePhaseScore = 0;

    for (let piece = N; piece <= Q; piece++) gamePhaseScore += pieceList[piece] * materialWeights[opening][piece];
    for (let piece = n; piece <= q; piece++) gamePhaseScore += pieceList[piece] * -materialWeights[opening][piece];

    return gamePhaseScore;
  }
  
  // static evaluation
  function evaluate() {
    if (isMaterialDraw()) return 0;
    
    let gamePhaseScore = getGamePhaseScore();
    let gamePhase = -1;
    
    if (gamePhaseScore > openingPhaseScore) gamePhase = opening;
    else if (gamePhaseScore < endgamePhaseScore) gamePhase = endgame;
    else gamePhase = middlegame;

    let score = 0;
    let scoreOpening = 0;
    let scoreEndgame = 0;
    
    for (let piece = P; piece <= k; piece++) {
      for (let pieceIndex = 0; pieceIndex < pieceList[piece]; pieceIndex++) {
        let square = pieceList.pieces[piece * 10 + pieceIndex];

        // evaluate material
        scoreOpening += materialWeights[opening][piece];
        scoreEndgame += materialWeights[endgame][piece];

        // positional score
        switch (piece) {
          case P:
            scoreOpening += pst[opening][PAWN_PST][square];
            scoreEndgame += pst[endgame][PAWN_PST][square];
            break;

          case N:
            scoreOpening += pst[opening][KNIGHT_PST][square];
            scoreEndgame += pst[endgame][KNIGHT_PST][square];
            break;

          case B:
            scoreOpening += pst[opening][BISHOP_PST][square];
            scoreEndgame += pst[endgame][BISHOP_PST][square];
            break;

          case R:
            scoreOpening += pst[opening][ROOK_PST][square];
            scoreEndgame += pst[endgame][ROOK_PST][square];
            break;

          case Q:
            scoreOpening += pst[opening][QUEEN_PST][square];
            scoreEndgame += pst[endgame][QUEEN_PST][square];
            break;

          case K:
            scoreOpening += pst[opening][KING_PST][square];
            scoreEndgame += pst[endgame][KING_PST][square];
            break;

          case p:
            scoreOpening -= pst[opening][PAWN_PST][mirrorSquare[square]];
            scoreEndgame -= pst[endgame][PAWN_PST][mirrorSquare[square]];
            break;

          case n:
            scoreOpening -= pst[opening][KNIGHT_PST][mirrorSquare[square]];
            scoreEndgame -= pst[endgame][KNIGHT_PST][mirrorSquare[square]];
            break;

          case b:
            scoreOpening -= pst[opening][BISHOP_PST][mirrorSquare[square]];
            scoreEndgame -= pst[endgame][BISHOP_PST][mirrorSquare[square]];
            break;

          case r:
            scoreOpening -= pst[opening][ROOK_PST][mirrorSquare[square]];
            scoreEndgame -= pst[endgame][ROOK_PST][mirrorSquare[square]];
            break;
          
          case q:
            scoreOpening -= pst[opening][QUEEN_PST][mirrorSquare[square]];
            scoreEndgame -= pst[endgame][QUEEN_PST][mirrorSquare[square]];
            break;

          case k:
            scoreOpening -= pst[opening][KING_PST][mirrorSquare[square]];
            scoreEndgame -= pst[endgame][KING_PST][mirrorSquare[square]];
            break;
        }
      }
    }

    // interpolate score in the middlegame
    if (gamePhase == middlegame)
        score = (
            scoreOpening * gamePhaseScore +
            scoreEndgame * (openingPhaseScore - gamePhaseScore)
        ) / openingPhaseScore;
    
    else if (gamePhase == opening) score = scoreOpening;
    else if (gamePhase == endgame) score = scoreEndgame;
    
    score = (score * (100 - fifty) / 100) << 0;
    return (side == white) ? score: -score;
  }

  
  
  /****************************\
   ============================
   
          INPUT & OUTPUT

   ============================              
  \****************************/
  
  // encode ascii pieces
  const charPieces = {
      'P': P, 'N': N, 'B': B, 'R': R, 'Q': Q, 'K': K,
      'p': p, 'n': n, 'b': b, 'r': r, 'q': q, 'k': k,
  };
  
  
  // set board position from FEN
  function setBoard(fen) {
    resetBoard();
    let index = 0;
    
    // parse board position
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 16; file++) {
        const square = rank * 16 + file;
        if ((square & 0x88) == 0) {
          if ((fen[index].charCodeAt() >= 'a'.charCodeAt() &&
               fen[index].charCodeAt() <= 'z'.charCodeAt()) || 
              (fen[index].charCodeAt() >= 'A'.charCodeAt() &&
               fen[index].charCodeAt() <= 'Z'.charCodeAt())) {
            if (fen[index] == 'K') kingSquare[white] = square;
            else if (fen[index] == 'k') kingSquare[black] = square;
            board[square] = charPieces[fen[index]];
            index++;
          }
          if (fen[index].charCodeAt() >= '0'.charCodeAt() &&
              fen[index].charCodeAt() <= '9'.charCodeAt()) {
            const offset = fen[index] - '0';
            if (!(board[square])) file--;
            file += offset;
            index++;
          }
          if (fen[index] == '/') index++;
        }
      }
    }
    
    // parse side to move
    index++;
    side = (fen[index] == 'w') ? white : black;
    index += 2;
    
    // parse castling rights
    while (fen[index] != ' ') {
      index++;
    }
    
    index++;
    
    // parse 50 rule move counter
    fifty = parseInt(fen.slice(index, fen.length - 1).split(' ')[1]);

    // init piece list
    initPieceList();
  }

  return {                         
    evaluate: function(fen) { 
      setBoard(fen);
      return evaluate();
    }
  }
}

if (window.LiChessTools) LiChessTools.Evaluator=Evaluator;

})();