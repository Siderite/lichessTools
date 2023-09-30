(function () {

  const gambits = {
    "white": {
      "r1bqkbnr/pp1ppppp/2n5/2p5/1P2P3/5N2/P1PP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/pp1p1pbp/2n3p1/1Bp1p3/3PP3/2P2N2/PP3PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/pp1p1pbp/2n3p1/1Bp1p3/4P3/2P2N2/PP1P1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqk2r/pp1pppbp/2n2np1/1Bp5/3PP3/2P2N2/PP3PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/pp1pppbp/2n2np1/1Bp5/4P3/2P2N2/PP1P1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqk1nr/pp1pppbp/2n3p1/1Bp5/4P3/2P2N2/PP1P1PPP/RNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pp1pppbp/2n3p1/1Bp5/4P3/5N2/PPPP1PPP/RNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 2
          }
        ]
      },
      "r1bqkbnr/pp1ppp1p/2n3p1/1Bp5/4P3/5N2/PPPP1PPP/RNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 2
          }
        ]
      },
      "r1bqkbnr/pp1ppp1p/2n3p1/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "r1bqkbnr/pp1ppppp/8/nBp5/1P2P3/5N2/P1PP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pp1ppppp/8/nBp5/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pp1ppppp/2n5/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 2
          }, {
            "uci": "c6a5",
            "san": "Na5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }, {
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 3
          }
        ]
      },
      "r2qkbnr/pp1bpp1p/2np2p1/1Bp1P3/8/5N2/PPPPQPPP/RNB2RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkbnr/pp1bpp1p/2np2p1/1Bp5/4P3/5N2/PPPPQPPP/RNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "r2qkbnr/pp1bpppp/2np4/1Bp5/4P3/5N2/PPPPQPPP/RNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/1p2pppp/p2p1n2/2p3B1/3Pb3/2P2N2/PP3PPP/RN1QR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r/1p2pppp/p2p1n2/2p5/3Pb3/2P2N2/PP3PPP/RNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "r2qkb1r/1p2pppp/p1bp1n2/2p5/3PP3/2P2N2/PP3PPP/RNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e4",
            "san": "Bxe4",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/1p2pppp/p1bp1n2/2p5/4P3/2P2N2/PP1P1PPP/RNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r2qkbnr/1p2pppp/p1bp4/2p5/4P3/2P2N2/PP1P1PPP/RNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r2qkbnr/1p2pppp/p1bp4/2p5/4P3/2P2N2/PP1P1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1",
            "nr": 1
          }
        ]
      },
      "r2qkbnr/1p1bpppp/p1Bp4/2p5/4P3/2P2N2/PP1P1PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7c6",
            "san": "Bxc6",
            "nr": 1
          }
        ]
      },
      "r2qkbnr/1p1bpppp/p1np4/1Bp5/4P3/2P2N2/PP1P1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5c6",
            "san": "Bxc6",
            "nr": 1
          }
        ]
      },
      "r2qkbnr/pp1bpppp/2np4/1Bp5/4P3/2P2N2/PP1P1PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "r2qkbnr/pp1bpppp/2np4/1Bp5/4P3/5N2/PPPP1PPP/RNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pp2pppp/2np4/1Bp5/4P3/5N2/PPPP1PPP/RNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8d7",
            "san": "Bd7",
            "nr": 2
          }
        ]
      },
      "r1bqkbnr/pp2pppp/2np4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "r3kb1r/pp1qpppp/2np1n2/2p5/3PP3/2P2N2/PP3PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r3kb1r/pp1qpppp/2np1n2/2p5/4P3/2P2N2/PP1P1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r3kbnr/pp1qpppp/2np4/2p5/4P3/2P2N2/PP1P1PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r3kbnr/pp1qpppp/2np4/2p5/4P3/5N2/PPPP1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rn2kbnr/pp1qpppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rn2kbnr/pp1qpppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rn1qkbnr/pp1Bpppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d7",
            "san": "Qxd7",
            "nr": 1
          }
        ]
      },
      "rn1qkbnr/pp1bpppp/3p4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5d7",
            "san": "Bxd7+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/3p4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 2
          }, {
            "uci": "c8d7",
            "san": "Bd7",
            "nr": 1
          }
        ]
      },
      "r1b1kb1r/pp2pppp/2np4/q2P4/8/2P2N2/P3BPPP/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kb1r/pp2pppp/2np4/q2P4/8/2n2N2/PP2BPPP/R1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2c3",
            "san": "bxc3",
            "nr": 0
          }
        ]
      },
      "r1b1kb1r/pp2pppp/2np4/q2P4/4n3/2N2N2/PP2BPPP/R1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "r1b1kb1r/pp2pppp/2np4/q2P4/4n3/5N2/PP2BPPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp2pppp/2np4/3P4/4n3/5N2/PP2BPPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5+",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp2pppp/2np4/8/3Pn3/5N2/PP2BPPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp2pppp/2np1n2/8/3PP3/5N2/PP2BPPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp2pppp/2np1n2/8/3pP3/2P2N2/PP2BPPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp2pppp/2np1n2/2p5/3PP3/2P2N2/PP2BPPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp2pppp/2np1n2/2p5/4P3/2P2N2/PP1PBPPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/3p1n2/2p5/4P3/2P2N2/PP1PBPPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/3p1n2/2p5/4P3/2P2N2/PP1P1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/3p4/2p5/4P3/2P2N2/PP1P1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/1p2pppp/p2p1n2/8/3NP1P1/2N5/PPP2P1P/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/1p3p1p/p2p1np1/4pNP1/4P3/2N1B3/PPP2P1P/R2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/1p3p1p/p2p1np1/4pN2/4P1P1/2N1B3/PPP2P1P/R2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4g5",
            "san": "g5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/1p3ppp/p2p1n2/4pN2/4P1P1/2N1B3/PPP2P1P/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP1P1/2N1B3/PPP2P1P/R2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4f5",
            "san": "Nf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/1p3ppp/p2ppn2/8/3NP1P1/2N1B3/PPP2P1P/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/1p3ppp/p2ppn2/8/3NP3/2N1B3/PPP2PPP/R2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N1B3/PPP2PPP/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N5/PPP2PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp2pppp/3p4/2p5/1P2P3/5N2/P1PP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5+",
            "nr": 3
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/1p1ppppp/p7/8/2BpP3/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/1p1ppppp/p7/8/3pP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/1p1ppppp/p7/2p5/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/1p1ppppp/p7/2p5/1P2P3/5N2/P1PP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/1p1ppppp/p7/2p5/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rqb1kbnr/1p1p1ppp/pBn1p3/1N6/4P3/2N5/PPP2PPP/R2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rqb1kbnr/1p1p1ppp/p1n1p3/1N6/4P3/2N1B3/PPP2PPP/R2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e3b6",
            "san": "Bb6",
            "nr": 0
          }
        ]
      },
      "rqb1kbnr/pp1p1ppp/2n1p3/1N6/4P3/2N1B3/PPP2PPP/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rqb1kbnr/pp1p1ppp/2n1p3/1N6/4P3/2N5/PPP2PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 1
          }
        ]
      },
      "r1b1kbnr/ppqp1ppp/2n1p3/1N6/4P3/2N5/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7b8",
            "san": "Qb8",
            "nr": 1
          }
        ]
      },
      "r1b1kbnr/ppqp1ppp/2n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4b5",
            "san": "Ndb5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8c7",
            "san": "Qc7",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/8/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1p1ppp/4p3/8/3NP3/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1p1ppp/4p3/8/3pP3/2P2N2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1p1ppp/4p3/8/3pP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 1
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1p1ppp/4p3/2p5/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp1p1ppp/4p3/2p5/1P2P3/5N2/P1PP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1p1ppp/4p3/2p5/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 16,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 4
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 7
          }, {
            "uci": "a7a6",
            "san": "a6",
            "nr": 2
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 3
          }
        ]
      },
      "r1bqkb1r/pp1ppppp/2n2n2/8/2B1P3/8/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pp1ppppp/2n2n2/8/4P3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pp1ppppp/2n5/8/4P3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pp1ppppp/2n5/8/3QP3/8/PPP2PPP/RNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d1",
            "san": "Qd1",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/3QP3/8/PPP2PPP/RNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/3pPP2/8/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1p1ppp/8/4p3/3pP3/2P2N2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1p1ppp/8/4p3/3pP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/3pP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/4P3/2p2N2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/8/4P3/2p5/PP3PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/2P1P3/3p4/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/8/4P3/2Pp4/PP3PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3c4",
            "san": "c4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }, {
            "uci": "d4d3",
            "san": "d3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/3pP3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d1d4",
            "san": "Qxd4",
            "nr": 1
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 5
          }
        ]
      },
      "r1bqkbnr/pp1ppppp/2n5/8/2BpP3/N7/PPP2PPP/R1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pp1ppppp/2n5/8/3pP3/N7/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pp1ppppp/2n5/2p5/3PP3/N7/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/N7/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/4P3/N7/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/1p2P3/8/PBPP1PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pp3ppp/4q3/4p3/1pP5/P2B1N2/3P1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pp3ppp/4q3/4p3/1pP5/P4N2/3P1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/pp3ppp/8/3qp3/1pP5/P4N2/3P1PPP/RNBQKB1RbKQkqc3": {
        "total": 1,
        "moves": [{
            "uci": "d5e6",
            "san": "Qe6",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pp3ppp/8/3qp3/1p6/P4N2/2PP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pp2pppp/8/3q4/1p6/P4N2/2PP1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pp2pppp/8/3q4/1p6/P7/2PP1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/3P4/1p6/P7/2PP1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/3p4/1p2P3/P7/2PP1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/1p2P3/P7/2PP1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/1p2P3/8/P1PP1PPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 0
          }, {
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/1P2P3/8/P1PP1PPP/RNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5b4",
            "san": "cxb4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 24,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 16
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 5
          }, {
            "uci": "b1a3",
            "san": "Na3",
            "nr": 1
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/4p3/2PnP3/2B5/2N5/PP1P1PPP/R1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/4p3/2PnP3/8/2N5/PP1P1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p4/2P1P1B1/8/2P5/PP3PPP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pppp/3p4/2P1P3/8/2P5/PP3PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/2P1P3/8/2P5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/2P1P3/8/2n5/PP1P1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/2PnP3/8/2N5/PP1P1PPP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }, {
            "uci": "d5c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/3p4/2PBP3/8/8/PP1P1PPP/R1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/3p4/2PpP3/2B5/8/PP1P1PPP/R1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "Bxd5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/3pp3/2PNP3/2B5/8/PP1P1PPP/R1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/3pp3/2PnP3/2B5/2N5/PP1P1PPP/R1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/4p3/2PnP3/2B5/8/PP1P1PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/2PnP3/2B5/8/PP1P1PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/2PnP3/8/8/PP1P1PPP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/1n6/2P1P3/8/8/PP1P1PPP/RNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "b6d5",
            "san": "Nd5",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/pppppppp/1n6/4P3/2P5/8/PP1P1PPP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c4c5",
            "san": "c5",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/3nP3/2P5/8/PP1P1PPP/RNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d5b6",
            "san": "Nb6",
            "nr": 3
          }
        ]
      },
      "rn1qkb1r/ppp1pppp/1n1p4/4P3/2PP2b1/5N2/PP2BPPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r/ppp1pppp/1n1p4/4P3/2PP2b1/5N2/PP3PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 0
          }
        ]
      },
      "rn1qkb1r/ppp1pppp/3p4/3nP3/2PP2b1/5N2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5b6",
            "san": "Nb6",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/ppp1pppp/3p4/3nP3/3P2b1/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p4/3nP3/3P4/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p4/3nP3/3P4/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/3nP3/3P4/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/3nP3/8/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 3
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f6d5",
            "san": "Nd5",
            "nr": 4
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/4P3/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppBpp/8/8/4n3/8/PPPP1PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppppp/8/8/2B1n3/8/PPPP1PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4f7",
            "san": "Bxf7+",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/2B1P3/8/PPPP1PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/6B1/4p3/2NP4/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pppp/5n2/8/4p3/2NP4/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/4P3/2NP4/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppnpppp/4P3/3p4/8/2N5/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppnpppp/8/3pP3/8/2N5/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e6",
            "san": "e6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3pP3/8/2N5/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d7",
            "san": "Nfd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/4P3/2N5/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/4P3/2N5/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 4
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/2B1PP2/8/PPPP2PP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/8/4p3/2B1n3/2N5/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/8/4p3/2B1n3/8/PPPPNPPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2c3",
            "san": "Nec3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPPNPPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/8/8/2BQn3/5N2/PPP2PPP/RNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/8/8/2Bpn3/5N2/PPP2PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d4",
            "san": "Qxd4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/8/2BpP3/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/8/2BpP3/2P5/PP3PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/8/2BpP3/8/PPP2PPP/RNBQK1NRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/2BPP3/8/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }, {
            "uci": "g1e2",
            "san": "Ne2",
            "nr": 1
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqk2r/ppp2ppp/5n2/2bBp3/3PP3/2P5/PP3PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2r/ppp2ppp/5n2/2bBp3/4P3/2P5/PP1P1PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/ppp2ppp/8/2bBp3/4P3/2P5/PP1P1PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp2ppp/8/2bpp3/2B1P3/2P5/PP1P1PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "Bxd5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b1p3/2B1P3/2P5/PP1P1PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b1p3/2BPP3/8/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1PP2/8/PPPPQ1PP/RNB1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/8/PPPPQPPP/RNB1K1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b1p3/2B1P3/8/PPPPQPPP/RNB1K1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/4p3/1bB1P3/2P5/P2P1PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pppp1ppp/8/4p3/1bB1PP2/8/P1PP2PP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pppp1ppp/8/4p3/1bB1P3/8/P1PP1PPP/RNBQK1NRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b1p3/1PB1P3/8/P1PP1PPP/RNBQK1NRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5b4",
            "san": "Bxb4",
            "nr": 2
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b1p3/2B1PP2/8/PPPP2PP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pppp1ppp/8/2b1p3/2B1P3/8/PPPP1PPP/RNBQK1NRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }, {
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 2
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NRbKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 4
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 6
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/8/4p3/2B1n3/2N2N2/PPPP1PPP/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/8/4p3/2B1n3/2N5/PPPP1PPP/R1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/2N5/PPPP1PPP/R1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/ppp2ppp/2n2n2/2bPp3/8/2N3P1/PPPPNPBP/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/ppp2ppp/2n2n2/2bpp3/4P3/2N3P1/PPPPNPBP/R1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 0
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b1p3/4P3/2N3P1/PPPPNPBP/R1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b1p3/4P3/2N3P1/PPPP1PBP/R1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1e2",
            "san": "Nge2",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/pppp1ppp/5n2/2b1p3/4P3/2N3P1/PPPP1PBP/R1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/pppp1ppp/5n2/2b1p3/4P3/2N3P1/PPPP1P1P/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N3P1/PPPP1P1P/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/ppp2ppp/8/3pP3/4n1b1/2N2N2/PPPPQ1PP/R1B1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r/ppp2ppp/8/3pP3/4n1b1/2N2N2/PPPP2PP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/8/3pP3/4n3/2N2N2/PPPP2PP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/ppp2ppp/8/3NP2q/8/3P1Nn1/PPP4P/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1r/ppp2ppp/8/3pP2q/8/2NP1Nn1/PPP4P/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nxd5",
            "nr": 0
          }
        ]
      },
      "rnb1kb1r/ppp2ppp/8/3pP3/7q/2NP1Nn1/PPP4P/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h4h5",
            "san": "Qh5",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/ppp2ppp/8/3pP3/7q/2NP2n1/PPP4P/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/ppp2ppp/8/3pP3/4n2q/2NP2P1/PPP4P/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4g3",
            "san": "Nxg3",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/ppp2ppp/8/3pP3/4n2q/2NP4/PPP3PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/8/3pP3/4n3/2NP4/PPP3PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/8/3pP3/4n3/2N2Q2/PPPP2PP/R1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/8/3pP3/4n3/2N5/PPPP2PP/R1BQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }, {
            "uci": "d1f3",
            "san": "Qf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/5n2/3pP3/4P3/2N5/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/5n2/3pp3/4PP2/2NP4/PPP3PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/5n2/3pp3/4PP2/2N5/PPPP2PP/R1BQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f4e5",
            "san": "fxe5",
            "nr": 3
          }, {
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/4PP2/2N5/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 4
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }, {
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 4
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1ppp/2n5/4p3/2B1nP2/2N2N2/PPPP2PP/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1ppp/2n5/4p3/2B1nP2/2N5/PPPP2PP/R1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1PP2/2N5/PPPP2PP/R1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N5/PPPP1PPP/R1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "r1b1k1nr/pppp1ppp/2n2q2/2bNp3/2B1P1Q1/8/PPPP1PPP/R1B1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k1nr/pppp1ppp/2n2q2/2b1p3/2B1P1Q1/2N5/PPPP1PPP/R1B1K1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nd5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P1Q1/2N5/PPPP1PPP/R1B1K1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2N5/PPPP1PPP/R1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1g4",
            "san": "Qg4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/2N5/PPPP1PPP/R1BQK1NRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "r1bq1bnr/pppp1k2/2n4p/8/3PPppP/2N5/PPP3P1/R1BQKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1bnr/pppp1k2/2n4p/8/4PppP/2N5/PPPP2P1/R1BQKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1N2/2n4p/8/4PppP/2N5/PPPP2P1/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8f7",
            "san": "Kxf7",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1p2/2n4p/6N1/4PppP/2N5/PPPP2P1/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f7",
            "san": "Nxf7",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1p1p/2n5/6N1/4PppP/2N5/PPPP2P1/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1p1p/2n5/8/4PppP/2N2N2/PPPP2P1/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1p1p/2n5/6p1/4Pp1P/2N2N2/PPPP2P1/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1p1p/2n5/6p1/3PPp2/2N2N2/PPP3PP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp1p1p/2n5/6p1/4Pp2/2N2N2/PPPP2PP/R1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 1
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/8/4Pp2/2N2N2/PPPP2PP/R1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 2
          }
        ]
      },
      "r1b1kbnr/pppp1ppp/2n5/8/3PPp1q/2N5/PPP1K1PP/R1BQ1BNRbkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr/pppp1ppp/2n5/8/3PPp1q/2N5/PPP3PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1e2",
            "san": "Ke2",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/8/3PPp2/2N5/PPP3PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/8/4Pp2/2N5/PPPP2PP/R1BQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/4PP2/2N5/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 3
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N5/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 2
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/3p4/4p3/4PP2/2N5/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/2N5/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 6
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 6
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b5/3pPP2/2P2N2/PP4PP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/pppp1ppp/2n5/2b5/3pPP2/5N2/PPP3PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b5/3pPP2/5N2/PPP3PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b5/3pPP2/8/PPP3PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/3pPP2/8/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b5/2B1P3/2p2N2/PP3PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pppp1ppp/8/2b5/4P3/2p2N2/PP3PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b5/3pP3/2P2N2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b5/3pP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/3pP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/3pP3/3B4/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/2BpP3/8/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/2B1P3/8/PB3PPP/RN1QK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/2B1P3/8/Pp3PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bxb2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/2B1P3/2p5/PP3PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3b2",
            "san": "cxb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/4P3/2p5/PP3PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/3pP3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 5
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4N3/4P3/2N5/PPPP1PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1Bpp/2n5/4p3/4n3/2N2N2/PPPP1PPP/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/2N2N2/PPPP1PPP/R1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4f7",
            "san": "Bxf7+",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/3N4/3pP3/5N2/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1ppp/2n2n2/8/3pP3/2N2N2/PPP2PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nd5",
            "nr": 0
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/4N3/1b1PP3/2N5/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/pppp1ppp/2n2n2/4p3/1b1PP3/2N2N2/PPP2PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }, {
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 4
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/pppp1ppp/2n5/8/1bBP4/2n2N2/PP3PPP/R1BQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/ppp1nppp/3p1b2/3P4/2B1R1P1/5N2/PP3P1P/R1BQ2K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/ppp1nppp/3p1b2/3P4/2B1R3/5N2/PP3PPP/R1BQ2K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "r1bqk2r/ppppnppp/5b2/3P4/2B1R3/5N2/PP3PPP/R1BQ2K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/ppppnppp/5b2/3P4/2B1n3/5N2/PP3PPP/R1BQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1e4",
            "san": "Rxe4",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2b2/3P4/2B1n3/5N2/PP3PPP/R1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e7",
            "san": "Ne7",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2b2/3P4/2B1n3/5N2/PP3PPP/R1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n5/3P4/2B1n3/2b2N2/PP3PPP/R1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3f6",
            "san": "Bf6",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n5/8/2BPn3/2b2N2/PP3PPP/R1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n5/8/1bBPn3/2N2N2/PP3PPP/R1BQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "e4c3",
            "san": "Nxc3",
            "nr": 0
          }, {
            "uci": "b4c3",
            "san": "Bxc3",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n5/8/1bBPn3/2N2N2/PP3PPP/R1BQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/2N2N2/PP3PPP/R1BQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 2
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP3PPP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5b4",
            "san": "Bb4+",
            "nr": 2
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c3d4",
            "san": "cxd4",
            "nr": 2
          }, {
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 3
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 4
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/5N2/PPP2PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1b1k2r/ppppnppp/2n3q1/b3P3/2B5/BQN2N2/P4PPP/R4RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k2r/ppppnppp/2n3q1/b3P3/2B5/1QN2N2/P4PPP/R1B2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1a3",
            "san": "Ba3",
            "nr": 0
          }
        ]
      },
      "r1b1k1nr/pppp1ppp/2n3q1/b3P3/2B5/1QN2N2/P4PPP/R1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8e7",
            "san": "Nge7",
            "nr": 1
          }
        ]
      },
      "r1b1k1nr/pppp1ppp/2n3q1/b3P3/2B5/1Qp2N2/P4PPP/RNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "r1b1k1nr/pppp1ppp/2n2q2/b3P3/2B5/1Qp2N2/P4PPP/RNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g6",
            "san": "Qg6",
            "nr": 1
          }
        ]
      },
      "r1b1k1nr/pppp1ppp/2n2q2/b7/2B1P3/1Qp2N2/P4PPP/RNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/b7/2B1P3/1Qp2N2/P4PPP/RNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/b7/2B1P3/2p2N2/P4PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/b7/2BpP3/2P2N2/P4PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/b7/2BpP3/2P2N2/P4PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/ppp2ppp/2np4/b3p3/2BPP3/1QP2N2/P4PPP/RNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/ppp2ppp/2np4/b3p3/2BPP3/2P2N2/P4PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/b3p3/2BPP3/2P2N2/P4PPP/RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/ppp2ppp/2np4/b7/2BpP3/1QP2N2/P4PPP/RNB2RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/ppp2ppp/2np4/b7/2BpP3/2P2N2/P4PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "r1bqk1nr/ppp2ppp/2np4/b3p3/2BPP3/2P2N2/P4PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/ppp2ppp/2np4/b3p3/2B1P3/2P2N2/P2P1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/P2P1PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/P2P1PPP/RNBQK2RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }, {
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/ppp2ppp/1b1p4/n5B1/2BPP3/2N2N2/P4PPP/R2Q1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/ppp2ppp/1b1p4/n7/2BPP3/2N2N2/P4PPP/R1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nr/ppp2ppp/1bnp4/8/2BPP3/2N2N2/P4PPP/R1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6a5",
            "san": "Na5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/ppp2ppp/1bnp4/8/2BPP3/5N2/P4PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/ppp2ppp/2np4/2b5/2BPP3/5N2/P4PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5b6",
            "san": "Bb6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/ppp2ppp/2np4/2b5/2BpP3/2P2N2/P4PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b5/2BpP3/2P2N2/P4PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/8/1bBPP3/5N2/P2B1PPP/RN1QK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/pppp1ppp/2n5/8/1bBPP3/5N2/P4PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 0
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b5/2BPP3/5N2/P4PPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5b4",
            "san": "Bb4+",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b5/2BpP3/2P2N2/P4PPP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }, {
            "uci": "c3d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b1p3/2BPP3/2P2N2/P4PPP/RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 2
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/P2P1PPP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/2P2N2/P2P1PPP/RNBQK2RbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "b4a5",
            "san": "Ba5",
            "nr": 3
          }, {
            "uci": "b4c5",
            "san": "Bc5",
            "nr": 2
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/5N2/P1PP1PPP/RNBQK2RwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 5
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2RbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c5b4",
            "san": "Bxb4",
            "nr": 5
          }
        ]
      },
      "r1bqk1nr/pppp1Bpp/2n5/2b1p3/4P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/pppp1ppp/2n5/2b1p3/2BPP3/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 12,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 4
          }, {
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 5
          }, {
            "uci": "c4f7",
            "san": "Bxf7+",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r3kb1r/ppp2ppp/2n1b3/3q2B1/3pN3/5N2/PPP2PPP/R2QR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r3kb1r/ppp2ppp/2n1b3/3q4/3pN3/5N2/PPPB1PPP/R2QR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "r3kb1r/ppp2ppp/2n1b3/q7/3pN3/5N2/PPPB1PPP/R2QR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "a5d5",
            "san": "Qd5",
            "nr": 1
          }
        ]
      },
      "r3kb1r/ppp2ppp/2n1b3/q7/3pN3/5N2/PPP2PPP/R1BQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "r1b1kb1r/ppp2ppp/2n5/q7/3pN3/5N2/PPP2PPP/R1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 1
          }
        ]
      },
      "r1b1kb1r/ppp2ppp/2n5/q7/3pn3/2N2N2/PPP2PPP/R1BQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1b1kb1r/ppp2ppp/2n5/3q4/3pn3/2N2N2/PPP2PPP/R1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5a5",
            "san": "Qa5",
            "nr": 1
          }
        ]
      },
      "r1b1kb1r/ppp2ppp/2n5/3q4/3pn3/5N2/PPP2PPP/RNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/ppp2ppp/2n5/3B4/3pn3/5N2/PPP2PPP/RNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/ppp2ppp/2n5/3p4/2Bpn3/2N2N2/PPP2PPP/R1BQR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/ppp2ppp/2n5/3p4/2Bpn3/5N2/PPP2PPP/RNBQR1K1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "Bxd5",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n5/8/2Bpn3/5N2/PPP2PPP/RNBQR1K1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n5/8/2Bpn3/2N2N2/PPP2PPP/R1BQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1ppp/2n5/8/2Bpn3/5N2/PPP2PPP/RNBQ1RK1wkq-": {
        "total": 3,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1",
            "nr": 2
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "r2qk2r/ppp2pPp/2n1b3/2b5/2pp4/5N2/PPP2PPP/RNBQR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r3k2r/ppp2ppp/2n1bP2/2b2qN1/2ppN3/8/PPP2PPP/R1BQR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r3k2r/ppp2ppp/2n1bP2/2b2qN1/2pp4/2N5/PPP2PPP/R1BQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3e4",
            "san": "Nce4",
            "nr": 0
          }
        ]
      },
      "r3k2r/ppp2ppp/2n1bP2/2bq2N1/2pp4/2N5/PPP2PPP/R1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5f5",
            "san": "Qf5",
            "nr": 1
          }
        ]
      },
      "r3k2r/ppp2ppp/2n1bP2/2bq2N1/2pp4/8/PPP2PPP/RNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r2qk2r/ppp2ppp/2n1bP2/2b3N1/2pp4/8/PPP2PPP/RNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qd5",
            "nr": 1
          }
        ]
      },
      "r2qk2r/ppp2ppp/2n1bP2/2b5/2pp4/5N2/PPP2PPP/RNBQR1K1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6g7",
            "san": "fxg7",
            "nr": 0
          }, {
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/ppp2ppp/2n2P2/2b5/2pp4/5N2/PPP2PPP/RNBQR1K1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 2
          }
        ]
      },
      "r1bqk2r/ppp2ppp/2n2P2/2b5/2pp4/5N2/PPP2PPP/RNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1+",
            "nr": 2
          }
        ]
      },
      "r1bqk2r/ppp2ppp/2n2P2/2bp4/2Bp4/5N2/PPP2PPP/RNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 2
          }
        ]
      },
      "r1bqk2r/ppp2ppp/2n2n2/2bpP3/2Bp4/5N2/PPP2PPP/RNBQ1RK1wkqd6": {
        "total": 2,
        "moves": [{
            "uci": "e5f6",
            "san": "exf6",
            "nr": 2
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b1P3/2Bp4/5N2/PPP2PPP/RNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/5N2/PPP2PPP/RNBQ1RK1wkq-": {
        "total": 3,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 2
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/8/2BpP3/5N2/PPP2PPP/RNBQ1RK1bkq-": {
        "total": 6,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 3
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 3
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/8/2BpP3/5N2/PPP2PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/2BPP3/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 6
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/p1p2Np1/2n2n1p/1p1Pp3/8/8/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/p1p2pp1/2n2n1p/1p1Pp1N1/8/8/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f7",
            "san": "Nxf7",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/p1p2ppp/2n2n2/1p1Pp1N1/8/8/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/p1p2ppp/2n2n2/1p1Pp1N1/2B5/8/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4f1",
            "san": "Bf1",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/ppp2ppp/2n2n2/3pp1N1/2B1P3/8/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 6
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }, {
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 20,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 12
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 8
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/1P2P3/5N2/P1PP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp1ppp/8/4n3/3PP3/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp1ppp/8/4n3/4P3/8/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4N3/4P3/8/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4P3/3p4/5N2/PPP1BPPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1ppp/2n2n2/8/3pP3/5N2/PPP1BPPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/3PP3/5N2/PPP1BPPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/5N2/PPPPBPPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPPBPPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2P2N2/PP1P1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1b1kbnr/ppp2ppp/2n5/1B1qN3/Q3p3/2P5/PP1P1PPP/RNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr/ppp2ppp/2n5/1B1qN3/4p3/2P5/PP1P1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2n5/1B2N3/4p3/2P5/PP1P1PPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qd5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2n5/1B2p3/4p3/2P2N2/PP1P1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2n5/1B1pp3/4P3/2P2N2/PP1P1PPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2n5/3pp3/4P3/2P2N2/PP1P1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2P2N2/PP1P1PPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4P3/3N4/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/8/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/8/2B1P3/2p2N2/PP3PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp1ppp/2n5/8/4P3/2p2N2/PP3PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/8/3pP3/2P2N2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/1B6/3pP3/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4P3/2Bp4/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/pppp1ppp/2n5/2b3N1/2BpP3/8/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nr/pppp1ppp/2n5/2b5/2BpP3/5N2/PPP2PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/8/2BpP3/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 1
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }, {
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 2
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/8/8/2BpP3/8/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp1ppp/8/8/3pP3/8/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/8/4p3/3NP3/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/8/4p3/3nP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 5
          }, {
            "uci": "c6d4",
            "san": "Nxd4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/1Bb1p3/1P2P3/5N2/P1PP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/pppp1ppp/2n2n2/1Bb1p3/4P3/2P2N2/PP1P1PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/pppp1ppp/2n2n2/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr/pppp1ppp/2n5/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }, {
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r4rk1/2q1bppp/p2p1n2/npp1p3/3PP3/2P1NQ2/PPB2PPP/R1B1R1K1b--": {
        "total": 0,
        "moves": []
      },
      "r4rk1/2q1bppp/p2p1n2/npp1p3/3PP3/2P1Nb2/PPB2PPP/R1BQR1K1w--": {
        "total": 1,
        "moves": [{
            "uci": "d1f3",
            "san": "Qxf3",
            "nr": 0
          }
        ]
      },
      "r4rk1/2q1bppp/p2p1n2/npp1p3/3PP1b1/2P1NN2/PPB2PPP/R1BQR1K1b--": {
        "total": 1,
        "moves": [{
            "uci": "g4f3",
            "san": "Bxf3",
            "nr": 1
          }
        ]
      },
      "r4rk1/2q1bppp/p2p1n2/npp1p3/3PP1b1/2P2N2/PPB2PPP/R1BQRNK1w--": {
        "total": 1,
        "moves": [{
            "uci": "f1e3",
            "san": "Ne3",
            "nr": 1
          }
        ]
      },
      "r1b2rk1/2q1bppp/p2p1n2/npp1p3/3PP3/2P2N2/PPB2PPP/R1BQRNK1b--": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "r1b2rk1/2q1bppp/p2p1n2/npp1p3/3PP3/2P2N2/PPBN1PPP/R1BQR1K1w--": {
        "total": 1,
        "moves": [{
            "uci": "d2f1",
            "san": "Nf1",
            "nr": 1
          }
        ]
      },
      "r1b1k2r/2q1bppp/p2p1n2/npp1p3/3PP3/2P2N2/PPBN1PPP/R1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1b1k2r/2q1bppp/p2p1n2/npp1p3/3PP3/2P2N2/PPB2PPP/RNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1d2",
            "san": "Nbd2",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/4bppp/p2p1n2/npp1p3/3PP3/2P2N2/PPB2PPP/RNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8c7",
            "san": "Qc7",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/4bppp/p2p1n2/npp1p3/4P3/2P2N2/PPBP1PPP/RNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/2p1bppp/p2p1n2/np2p3/4P3/2P2N2/PPBP1PPP/RNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/2p1bppp/p2p1n2/np2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b3c2",
            "san": "Bc2",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6a5",
            "san": "Na5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/2ppbppp/p1n2n2/1p2p3/B3P3/5N2/PPPP1PPP/RNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "a4b3",
            "san": "Bb3",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/2p2ppp/p1n5/1p1pp3/2PPn3/1B3N2/PP3PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r/2p2ppp/p1n1b3/1pn1P1N1/3p4/1BP5/PP1N1PPP/R1BQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r/2p2ppp/p1n1b3/1pn1P3/3p4/1BP2N2/PP1N1PPP/R1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 0
          }
        ]
      },
      "r2qkb1r/2p2ppp/p1n1b3/1pnpP3/8/1BP2N2/PP1N1PPP/R1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/2p2ppp/p1n1b3/1pnpP3/8/1B3N2/PPPN1PPP/R1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/2p2ppp/p1n1b3/1p1pP3/4n3/1B3N2/PPPN1PPP/R1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4c5",
            "san": "Nc5",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/2p2ppp/p1n1b3/1p1pP3/4n3/1B3N2/PPP2PPP/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1d2",
            "san": "Nbd2",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/2p2ppp/p1n5/1p1pP3/4n3/1B3N2/PPP2PPP/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/2p2ppp/p1n5/1p1pp3/3Pn3/1B3N2/PPP2PPP/RNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 0
          }, {
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/2pp1ppp/p1n5/1p2p3/3Pn3/1B3N2/PPP2PPP/RNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r/2pp1ppp/p1n5/1p2p3/B2Pn3/5N2/PPP2PPP/RNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "a4b3",
            "san": "Bb3",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r/1ppp1ppp/p1n5/4p3/B2Pn3/5N2/PPP2PPP/RNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r/1ppp1ppp/p1n5/4p3/B3n3/5N2/PPPP1PPP/RNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1bkq-": {
        "total": 3,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }, {
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/2P2N2/PP1P1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 3
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/2pp1Bpp/p7/np2p3/4P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/2pp1ppp/p7/np2p3/4P3/1B3N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b3f7",
            "san": "Bxf7+",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/2pp1ppp/p1n5/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6a5",
            "san": "Na5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/2pp1ppp/p1n5/1p2p3/B3P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a4b3",
            "san": "Bb3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/1ppp2pp/p1n5/4pP2/B7/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/1ppp2pp/p1n5/4pp2/B3P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 4
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "b5a4",
            "san": "Ba4",
            "nr": 6
          }
        ]
      },
      "r1bqkbnr/pppp2pp/2n5/1B2pP2/8/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp2pp/2n5/1B2pp2/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 0
          }
        ]
      },
      "r1b1kbnr/ppp2ppp/2n5/1B1pN1q1/4P3/8/PPPP1PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr/ppp2ppp/2N5/1B1p2q1/4P3/8/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr/ppp2ppp/2n5/1B1pN1q1/4P3/8/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }, {
            "uci": "e5c6",
            "san": "Nxc6",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2n5/1B1pN3/4P3/8/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d8g5",
            "san": "Qg5",
            "nr": 2
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2n5/1B1pp3/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 2
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2np4/1B6/3pP3/5N2/PPP2PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/ppp2ppp/2np4/1B6/3pP3/5N2/PPP2PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2np4/1B2p3/3PP3/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2np4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 12,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 2
          }, {
            "uci": "a7a6",
            "san": "a6",
            "nr": 6
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 47,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 4
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 20
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }, {
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 1
          }, {
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 2
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 6
          }, {
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 12
          }
        ]
      },
      "rnb1kbnQ/ppppq2p/6p1/8/4P3/8/PPPP1PPP/RNB1KB1RbKQq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppppq2p/6p1/4Q3/4P3/8/PPPP1PPP/RNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5h8",
            "san": "Qxh8",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp3p/6p1/4Q3/4P3/8/PPPP1PPP/RNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp3p/6p1/4p2Q/4P3/8/PPPP1PPP/RNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h5e5",
            "san": "Qxe5+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/4p3/4P3/8/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1h5",
            "san": "Qh5+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/5p2/4N3/4P3/8/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e5",
            "san": "fxe5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/5p2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1ppp/6q1/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pppp1ppp/6q1/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/pppp1ppp/5q2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g6",
            "san": "Qg6",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1ppp/5q2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/ppp3pp/3p1q2/8/2NPp3/8/PPP1BPPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp4p/3p1qp1/8/2NPp3/8/PPP1QPPP/RNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp4p/3p1qp1/7Q/2NPp3/8/PPP2PPP/RNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h5e2",
            "san": "Qe2",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/ppp3pp/3p1q2/7Q/2NPp3/8/PPP2PPP/RNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/ppp3pp/3p1q2/8/3Pp3/4N3/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp3pp/3p1q2/8/2NPp3/8/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 0
          }, {
            "uci": "d1h5",
            "san": "Qh5+",
            "nr": 1
          }, {
            "uci": "c4e3",
            "san": "Ne3",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/ppp3pp/3p1q2/5p2/2NPP3/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 3
          }
        ]
      },
      "rnb1kbnr/ppp3pp/3p1q2/4Np2/3PP3/8/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e5c4",
            "san": "Nc4",
            "nr": 3
          }
        ]
      },
      "rnb1kbnr/pppp2pp/5q2/4Np2/3PP3/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 3
          }
        ]
      },
      "rnb1kbnr/pppp2pp/5q2/8/2N1p3/3P4/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pppp2pp/5q2/8/2N1p3/2N5/PPPP1PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pppp2pp/5q2/8/2N1p3/8/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/pppp2pp/5q2/5p2/2N1P3/8/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 2
          }
        ]
      },
      "rnb1kbnr/pppp2pp/5q2/4Np2/4P3/8/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }, {
            "uci": "e5c4",
            "san": "Nc4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/4Np2/4P3/8/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 5
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/4pP2/8/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp2pp/2n5/4pP2/8/3P1N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp2pp/2n5/4pp2/4P3/3P1N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/4pp2/4P3/3P1N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/4pp2/2P1P3/5N2/PP1P1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/8/4pp2/4P1P1/5N2/PPPP1P1P/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/8/4pp2/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/8/4pp2/2B1P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/8/4pp2/4P3/2N2N2/PPPP1PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/8/4pp2/1P2P3/5N2/P1PP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/8/4pp2/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 5
          }, {
            "uci": "e4f5",
            "san": "exf5",
            "nr": 0
          }, {
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 0
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/3p4/8/3pP3/2P2N2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/3p4/8/2BpP3/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppn1ppp/3p1n2/4p3/3PP1P1/2N2N2/PPP2P1P/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppn1ppp/3p1n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppn1ppp/3p4/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Ngf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppn1ppp/3p4/4p3/3PP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp3pp/3p4/4pp2/3PP3/2N2N2/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp3pp/3p4/4pp2/3PP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/3p4/4p3/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 2
          }, {
            "uci": "b8d7",
            "san": "Nd7",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 4
          }
        ]
      },
      "rnbq1b1r/ppp2kpp/3p1n2/8/2B1P3/8/PPPP1PPP/RNBQK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1b1r/ppp2kpp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1b1r/ppp2kpp/3p1n2/8/4P3/8/PPPP1PPP/RNBQKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4+",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp2Npp/3p1n2/8/4P3/8/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e8f7",
            "san": "Kxf7",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/3p1n2/4N3/4P3/8/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5f7",
            "san": "Nxf7",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4N3/4P3/8/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/8/1B2P3/3pn3/5N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/8/4P3/3pn3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4P3/3p4/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/8/3pP3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }, {
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/3PP3/5N2/PPP1QPPP/RNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/5N2/PPPPQPPP/RNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPPQPPP/RNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 2
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }, {
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 72,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 47
          }, {
            "uci": "f7f6",
            "san": "f6",
            "nr": 1
          }, {
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 13
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 4
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 6
          }
        ]
      },
      "rnbq1bnr/pppp1k2/7p/8/3PPppP/8/PPP3P1/RNBQKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1bnr/pppp1k2/7p/8/2B1PppP/8/PPPP2P1/RNBQK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1bnr/pppp1k2/7p/8/4PppP/8/PPPP2P1/RNBQKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4+",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1N2/7p/8/4PppP/8/PPPP2P1/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1p2/7p/6N1/4PppP/8/PPPP2P1/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g5f7",
            "san": "Nxf7",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/6N1/4PppP/8/PPPP2P1/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp1p2/7p/4N3/4PppP/8/PPPP2P1/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f7",
            "san": "Nxf7",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1p1p/5n2/4N3/3PPppP/8/PPP3P1/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1p1p/5n2/4N3/4PppP/8/PPPP2P1/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/4N3/4PppP/8/PPPP2P1/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/8/4PppP/5N2/PPPP2P1/RNBQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 2
          }, {
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/6p1/4Pp1P/5N2/PPPP2P1/RNBQKB1RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/8/2B1PppP/5N2/PPPP2P1/RNBQK2RbKQkqh3": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pppp1p1p/8/3N4/2q1Pp2/5Q2/PPPP2PP/R1B2R1Kbkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pppp1p1p/8/8/2q1Pp2/2N2Q2/PPPP2PP/R1B2R1Kwkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nd5",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/pppp1p1p/8/8/2BqPp2/2N2Q2/PPPP2PP/R1B2R1Kbkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c4",
            "san": "Qxc4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1p1p/8/8/2BqPp2/2N2Q2/PPPP2PP/R1B2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1h1",
            "san": "Kh1",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1p1p/5q2/8/2B1Pp2/2N2Q2/PPPP2PP/R1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d4",
            "san": "Qd4+",
            "nr": 1
          }
        ]
      },
      "r1b1k2r/ppppnp1p/2n4b/4q3/2B2p2/2NP1Q2/PPPB2PP/4RRK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k2r/ppppnp1p/2n4b/4q3/2B2p2/2NP1Q2/PPPB2PP/R4RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "a1e1",
            "san": "Rae1",
            "nr": 0
          }
        ]
      },
      "rnb1k2r/ppppnp1p/7b/4q3/2B2p2/2NP1Q2/PPPB2PP/R4RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nbc6",
            "nr": 1
          }
        ]
      },
      "rnb1k2r/ppppnp1p/7b/4q3/2B2p2/2NP1Q2/PPP3PP/R1B2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "rnb1k1nr/pppp1p1p/7b/4q3/2B2p2/2NP1Q2/PPP3PP/R1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 1
          }
        ]
      },
      "rnb1k1nr/pppp1p1p/7b/4q3/2B2p2/3P1Q2/PPP3PP/RNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1p1p/8/4q3/2B2p2/3P1Q2/PPP3PP/RNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8h6",
            "san": "Bh6",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1B1p/8/4q3/5p2/5Q2/PPPP2PP/RNB2RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pppp1p1p/8/4q3/2B2p2/5Q2/PPPP2PP/RNB2RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }, {
            "uci": "c4f7",
            "san": "Bxf7+",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/pppp1p1p/5q2/4P3/2B2p2/5Q2/PPPP2PP/RNB2RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6e5",
            "san": "Qxe5",
            "nr": 2
          }
        ]
      },
      "rnb1kbnr/pppp1p1p/5q2/8/2B1Pp2/5Q2/PPPP2PP/RNB2RK1wkq-": {
        "total": 3,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "e4e5",
            "san": "e5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/8/2B1Pp2/5Q2/PPPP2PP/RNB2RK1bkq-": {
        "total": 3,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/8/2B1Pp2/5p2/PPPP2PP/RNBQ1RK1wkq-": {
        "total": 3,
        "moves": [{
            "uci": "d1f3",
            "san": "Qxf3",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/8/2B1Ppp1/5N2/PPPP2PP/RNBQ1RK1bkq-": {
        "total": 3,
        "moves": [{
            "uci": "g4f3",
            "san": "gxf3",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/8/2BPPp2/5Q2/PPP3PP/RNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1p1p/8/8/2BPPB2/5p2/PPP3PP/RN1QK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1p1p/8/8/2BPPp2/5p2/PPP3PP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d1f3",
            "san": "Qxf3",
            "nr": 0
          }, {
            "uci": "c1f4",
            "san": "Bxf4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/8/2BPPpp1/5N2/PPP3PP/RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g4f3",
            "san": "gxf3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp1B1p/8/8/4Ppp1/5N2/PPPP2PP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1p1p/8/8/2B1Ppp1/2N2N2/PPPP2PP/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1p1p/8/4N3/2B1Ppp1/8/PPPP2PP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1p1p/8/8/2B1Ppp1/5N2/PPPP2PP/RNBQK2RwKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 0
          }, {
            "uci": "e1h1",
            "san": "O-O",
            "nr": 3
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }, {
            "uci": "c4f7",
            "san": "Bxf7+",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }, {
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nb/pp3p2/2pp4/4N1p1/2BPPp2/2N5/PPP3P1/R1BQK3bQq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nb/pp3p2/2pp4/6p1/2BPPp2/2N2N2/PPP3P1/R1BQK3wQq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nb/ppp2p2/3p4/6p1/2BPPp2/2N2N2/PPP3P1/R1BQK3bQq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nb/ppp2p2/3p4/6p1/2BPPp2/5N2/PPP3P1/RNBQK3wQq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nR/ppp2pb1/3p4/6p1/2BPPp2/5N2/PPP3P1/RNBQK3bQq-": {
        "total": 1,
        "moves": [{
            "uci": "g7h8",
            "san": "Bxh8",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp2pb1/3p4/6p1/2BPPp2/5N2/PPP3P1/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h1h8",
            "san": "Rxh8",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp2pb1/3p3p/6P1/2BPPp2/5N2/PPP3P1/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h6g5",
            "san": "hxg5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp2pb1/3p3p/6p1/2BPPp1P/3Q1N2/PPP3P1/RNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppp2pb1/3p3p/6p1/2BPPp1P/5N2/PPP3P1/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "h4g5",
            "san": "hxg5",
            "nr": 1
          }, {
            "uci": "d1d3",
            "san": "Qd3",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/pppp1pb1/7p/6p1/2BPPp1P/5N2/PPP3P1/RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "rnbqk1nr/pppp1pb1/7p/6p1/2B1Pp1P/5N2/PPPP2P1/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqk1nr/pppp1pbp/8/6p1/2B1Pp1P/5N2/PPPP2P1/RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 2
          }
        ]
      },
      "rnbqk1nr/pppp1pbp/8/6p1/2B1Pp2/5N2/PPPP2PP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppp2pbp/3p4/6p1/2BPPp2/2P2N2/PP4PP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppp2pbp/3p4/6p1/2BPPp2/5N2/PPP3PP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/pppp1pbp/8/6p1/2BPPp2/5N2/PPP3PP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1pbp/8/6p1/2B1Pp2/5N2/PPPP2PP/RNBQK2RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 2
          }, {
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/6p1/2B1Pp2/5N2/PPPP2PP/RNBQK2RbKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 9
          }, {
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/6p1/4Pp2/2N2N2/PPPP2PP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pppp1p1p/8/4N3/3PPppq/6P1/PPP4P/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pppp1p1p/8/4N3/3PPppq/8/PPP3PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/4N3/3PPpp1/8/PPP3PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/8/3PPpp1/2N2N2/PPP3PP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1p1p/8/8/3PPBp1/5N2/PPP3PP/RN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1p1p/8/8/3PPpp1/5N2/PPP3PP/RNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }, {
            "uci": "c1f4",
            "san": "Bxf4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/6p1/3PPp2/5N2/PPP3PP/RNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pppp1p1p/8/6p1/4Pp2/5N2/PPPP2PP/RNBQKB1RwKQkq-": {
        "total": 21,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 4
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 13
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/8/2B1P2b/5N2/PPPP3p/RNBQ1R1Kbkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pppp1ppp/8/8/2B1P2b/5N2/PPPP3p/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1h1",
            "san": "Kh1",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/8/2B1P2b/5Np1/PPPP3P/RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g3h2",
            "san": "gxh2+",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/8/2B1P2b/5Np1/PPPP3P/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/8/2B1Pp1b/5NP1/PPPP3P/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f4g3",
            "san": "fxg3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/8/2B1Pp1b/5N2/PPPP2PP/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppppbppp/8/8/2B1Pp2/5N2/PPPP2PP/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7h4",
            "san": "Bh4+",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppppbppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/3p4/8/1P2Pp2/5N2/P1PP2PP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/3p1n2/8/3PPp2/3B1N2/PPP3PP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/3p1n2/8/3PPp2/5N2/PPP3PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/3p4/8/3PPp2/5N2/PPP3PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/3p4/8/4Pp2/5N2/PPPP2PP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/8/4P2n/5pP1/5N2/PPPP3P/RNBQKB1RbKQkqg3": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/8/4P2n/5p2/5N2/PPPP2PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4P3/5p2/5N2/PPPP2PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6h5",
            "san": "Nh5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/8/4Pp2/5N2/PPPP2PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1RbKQkq-": {
        "total": 25,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 21
          }, {
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPPQ1PP/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/8/2B1Pp2/2N5/PPPP2PP/R1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/8/2B1Pp2/8/PPPP2PP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnb1k2r/ppppnpbp/8/6p1/2BPPp1q/2N3P1/PPP4P/R1BQ1KNRbkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k2r/ppppnpbp/8/6p1/2BPPp1q/2N5/PPP3PP/R1BQ1KNRwkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 0
          }
        ]
      },
      "rnb1k1nr/pppp1pbp/8/6p1/2BPPp1q/2N5/PPP3PP/R1BQ1KNRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 1
          }
        ]
      },
      "rnb1k1nr/pppp1pbp/8/6p1/2B1Pp1q/2N5/PPPP2PP/R1BQ1KNRwkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1p1p/8/6p1/2B1Pp1q/2N5/PPPP2PP/R1BQ1KNRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1p1p/8/6p1/2B1Pp1q/8/PPPP2PP/RNBQ1KNRwkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1ppp/8/8/2B1Pp1q/8/PPPP2PP/RNBQ1KNRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1ppp/8/8/2B1Pp1q/8/PPPP2PP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1f1",
            "san": "Kf1",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/2B1Pp2/8/PPPP2PP/RNBQK1NRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/5Q2/PPPP2PP/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/7Q/4Pp2/8/PPPP2PP/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4PpQ1/8/PPPP2PP/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/7N/PPPP2PP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/6P1/PPPP3P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/2N5/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/1P6/P1PP2PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPPN1PP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/3PPp2/8/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/1B6/4Pp2/8/PPPP2PP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp1P/8/PPPP2P1/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPPB1PP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPP1KPP/RNBQ1BNRbkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 41,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 25
          }, {
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 2
          }, {
            "uci": "d1f3",
            "san": "Qf3",
            "nr": 0
          }, {
            "uci": "d1h5",
            "san": "Qh5",
            "nr": 0
          }, {
            "uci": "d1g4",
            "san": "Qg4",
            "nr": 0
          }, {
            "uci": "g1h3",
            "san": "Nh3",
            "nr": 0
          }, {
            "uci": "g2g3",
            "san": "g3",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }, {
            "uci": "b2b3",
            "san": "b3",
            "nr": 0
          }, {
            "uci": "g1e2",
            "san": "Ne2",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }, {
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 0
          }, {
            "uci": "h2h4",
            "san": "h4",
            "nr": 0
          }, {
            "uci": "f1e2",
            "san": "Be2",
            "nr": 0
          }, {
            "uci": "e1f2",
            "san": "Kf2",
            "nr": 0
          }
        ]
      },
      "rn1qk1nr/ppp2ppp/8/2b1p3/Q3P1b1/2P2N2/PP1P2PP/RNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qk1nr/ppp2ppp/8/2b1p3/4P1b1/2P2N2/PP1P2PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4+",
            "nr": 0
          }
        ]
      },
      "rn1qk1nr/ppp2ppp/3p4/2b1P3/4P1b1/2P2N2/PP1P2PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d6e5",
            "san": "dxe5",
            "nr": 1
          }
        ]
      },
      "rn1qk1nr/ppp2ppp/3p4/2b1p3/4PPb1/2P2N2/PP1P2PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f4e5",
            "san": "fxe5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp2ppp/3p4/2b1p3/4PP2/2P2N2/PP1P2PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp2ppp/3p4/2b1p3/1P2PP2/5N2/P1PP2PP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppp2ppp/3p4/2b1p3/4PP2/5N2/PPPP2PP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b1p3/4PP2/5N2/PPPP2PP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/2b1p3/4PP2/8/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }
        ]
      },
      "rnb1kbnr/pppp1ppp/8/4p3/3PPq2/2N5/PPP3PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/pppp1ppp/8/4p3/4Pq2/2N5/PPPP2PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/pppp1ppp/5q2/4p3/4PP2/2N5/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6f4",
            "san": "Qxf4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/pppp1ppp/5q2/4p3/4PP2/8/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/1B1P4/4pP2/8/PPPP2PP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/5n2/3P4/4PP2/8/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/5n2/3P4/4pP2/3P4/PPPN2PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/5n2/3P4/4pP2/3P4/PPP1Q1PP/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/5n2/3P4/4pP2/3P4/PPP3PP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d3e4",
            "san": "dxe4",
            "nr": 0
          }, {
            "uci": "b1d2",
            "san": "Nd2",
            "nr": 0
          }, {
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3P4/4pP2/3P4/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3P4/4pP2/8/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5+",
            "nr": 0
          }, {
            "uci": "d2d3",
            "san": "d3",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3Pp3/5P2/8/PPPP2PP/RNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/4PP2/5N2/PPPP2PP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/3PPP2/8/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/4PP2/8/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 4
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/ppppq2p/6P1/7Q/5p2/8/PPPP2PP/RNBK1BNRbkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppppq2p/6P1/7Q/5p2/8/PPPP2PP/RNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1d1",
            "san": "Kd1",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp3p/6P1/7Q/5p2/8/PPPP2PP/RNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp3p/6p1/5P1Q/5p2/8/PPPP2PP/RNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5g6",
            "san": "fxg6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/5P1Q/5p2/8/PPPP2PP/RNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp3pp/3b4/3p1P2/3P1p2/3B1N2/PPP3PP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppp3pp/3b4/3p1P2/3P1p2/5N2/PPP3PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp3pp/8/3p1P2/3P1p2/5N2/PPP3PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8d6",
            "san": "Bd6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp3pp/8/3p1P2/5p2/5N2/PPPP2PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/5P2/5p2/5N2/PPPP2PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/5P2/5p2/8/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d1h5",
            "san": "Qh5+",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/4pP2/5P2/8/PPPP2PP/RNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp2pp/8/4pp2/4PP2/8/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNRbKQkq-": {
        "total": 52,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 41
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 2
          }, {
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 6
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 2
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/8/1Bb1p3/1P2P3/8/P1PP1PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pppp1ppp/8/1Bb1p3/4P3/8/PPPP1PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/1B2p3/3PP3/8/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/1B2p3/4P3/8/PPPP1PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/1B2p3/4P3/8/PPPP1PPP/RNBQK1NRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 154,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 10
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 13
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 5
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 72
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 52
          }, {
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/3B4/PPP2PPP/R1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N2P2/PPP3PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/8/2BPp3/2N5/PPP2PPP/R1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c3e4",
            "san": "Nxe4",
            "nr": 1
          }, {
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p5/8/2BpP3/5N2/PPP3PP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp3ppp/2p5/8/3pP3/5N2/PPP3PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p5/4p3/3PP3/5N2/PPP3PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p5/4p3/3PP3/8/PPP3PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/8/3PP3/8/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/8/3Pp3/5P2/PPP3PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/5P2/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp1npppp/2p1P3/3p4/3P4/3B4/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp1npppp/2p5/3pP3/3P4/3B4/PPP2PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e6",
            "san": "e6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp2pppp/2p2n2/3pP3/3P4/3B4/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d7",
            "san": "Nfd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/2p2n2/3p4/3PP3/3B4/PPP2PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/3B4/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/4B3/PPP2PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/6N1/3Pp3/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/8/3Pp3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 3
          }, {
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }, {
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }, {
            "uci": "c1e3",
            "san": "Be3",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 7
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/6N1/4p3/2N5/PPPP1PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/8/4p3/2N2N2/PPPP1PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N2N2/PPPP1PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/6B1/4p3/2NP4/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/8/4p3/2NP4/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2NP4/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/2p5/8/4P3/2N5/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/7Q/4p3/1B6/PPPP1PPP/RNB1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/8/4p3/1B6/PPPP1PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1h5",
            "san": "Qh5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/4P3/1B6/PPPP1PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/2B1P3/8/PPPP1PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4b3",
            "san": "Bb3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/2p5/8/2B1P3/8/PPPP1PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/1P1p4/4P3/8/P1PP1PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/1P2P3/8/P1PP1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/2p5/8/1P2P3/8/P1PP1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3pP3/2P5/8/PP1P1PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/2P1P3/8/PP1P1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/2p5/8/2P1P3/8/PP1P1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 12,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 7
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 1
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp3ppp/4p3/2ppP3/1P1P4/8/P1P2PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2PB1N2/PP3PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8b6",
            "san": "Qb6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/3pP3/3p2Q1/5N2/PPP2PPP/RNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp3ppp/4p3/3pP3/3p2Q1/8/PPP2PPP/RNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/2ppP3/3P2Q1/8/PPP2PPP/RNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/3pP3/3p4/3B1N2/PPP2PPP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp3ppp/4p3/3pP3/3p4/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }, {
            "uci": "d1g4",
            "san": "Qg4",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/4B3/PPP2PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/4p3/4N3/3Pp3/8/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/4p3/8/3Pp3/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/ppp2ppp/4pn2/3p2B1/1b1PP3/2N5/PPP1NPPP/R2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2r/ppp2ppp/4pn2/3p2B1/1b1PP3/2N5/PPP2PPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1e2",
            "san": "Ne2",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP1NPPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/P1N5/1PP2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1e2",
            "san": "Ne2",
            "nr": 0
          }, {
            "uci": "a2a3",
            "san": "a3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/7N/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 4
          }, {
            "uci": "c1e3",
            "san": "Be3",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 3
          }, {
            "uci": "g1h3",
            "san": "Nh3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 10
          }
        ]
      },
      "rnbqk1nr/pppp1ppp/4p3/4P3/1b6/8/P1PP1PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pppp1ppp/4p3/8/1b2P3/8/P1PP1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/1P2P3/8/P1PP1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bxb4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/1P6/PBPP1PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/1P6/P1PP1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/4P3/1P6/P1PP1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3p4/4P3/1Q6/PP1P1PPP/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/3p4/4P3/8/PP1P1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3P4/4P3/8/PP1P1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/2P1P3/8/PP1P1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/2P1P3/8/PP1P1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/2ppP3/1P6/5N2/P1PP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp3ppp/4p3/2ppP3/8/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3pP3/8/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/4P3/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 14,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 10
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 1
          }, {
            "uci": "b2b3",
            "san": "b3",
            "nr": 1
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppppppbp/6p1/8/3PP3/8/PPPB1PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppppppbp/6p1/8/3PP3/3B4/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k1nr/pp1pppbp/6p1/q1pP4/4P3/2N2N2/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k1nr/pp1pppbp/6p1/q1p5/3PP3/2N2N2/PPP2PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/pp1pppbp/6p1/2p5/3PP3/2N2N2/PPP2PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/pp1pppbp/6p1/2p5/3PP3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppppppbp/6p1/8/3PP3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 0
          }, {
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pppppp1p/6p1/8/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }
        ]
      },
      "r1bqkb1r/ppp1pppp/2npP2n/8/3P4/5N1P/PPP2PP1/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/ppp1pppp/2np3n/4P3/3P4/5N1P/PPP2PP1/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e6",
            "san": "e6",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/ppp1pppp/2np4/4P3/3P2n1/5N1P/PPP2PP1/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4h6",
            "san": "Nh6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/ppp1pppp/2np4/4P3/3P2n1/5N2/PPP2PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h3",
            "san": "h3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppppppp/2n5/4P3/3P2n1/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppppppp/2n5/4P3/6n1/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppppppp/2n2n2/4P3/8/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g4",
            "san": "Ng4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppppppp/2n2n2/8/4P3/5N2/PPPP1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3p4/3PP3/4B3/PPP2PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/3P4/4p3/2N2P2/PPP3PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/3P4/4p3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3P4/4p3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/ppp1pppp/2n5/8/3Pp3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "r1b1kbnr/ppp1pppp/2n5/3q4/3P4/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr/ppp1pppp/2n5/3q4/3P4/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3P4/3P4/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3p4/3PP3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppppppp/2n5/8/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 3
          }
        ]
      },
      "r1bqkbnr/pppppppp/2n5/8/1P2P3/8/P1PP1PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppppppp/2n5/8/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rn1qkbnr/pbpppppp/1p6/6B1/3PP3/8/PPP2PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnr/pbpppppp/1p6/8/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnr/pbpppppp/1p6/8/3PP3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/p1pppppp/1p6/8/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/p1pppppp/1p6/8/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/5N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/ppp1pppp/8/q7/1P6/2N5/P1PP1PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp1pppp/8/q7/8/2N5/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5a5",
            "san": "Qa5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/4P3/1P6/P1PP1PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/3p4/1P2P3/8/P1PP1PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }, {
            "uci": "b2b3",
            "san": "b3",
            "nr": 0
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNRbKQkq-": {
        "total": 227,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 24
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 8
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 154
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 12
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 14
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 3
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 5
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 2
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 3
          }
        ]
      },
      "rn1qkbnr/ppp2ppp/8/3p4/8/6PB/PPPPP3/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnr/ppp2ppp/8/3p4/8/6pB/PPPPP2P/RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2g3",
            "san": "hxg3",
            "nr": 0
          }
        ]
      },
      "rn1qkbnr/ppp2ppp/8/3p4/5p2/6PB/PPPPP2P/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnr/ppp2ppp/8/3p4/5p2/6PB/PPPPP2P/RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "rn1qkbnr/ppp2ppp/8/3pp3/5P2/6PB/PPPPP2P/RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rn1qkbnr/ppp2ppp/8/3pp3/5P2/6Pb/PPPPP2P/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1h3",
            "san": "Bxh3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/5P2/6PN/PPPPP2P/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8h3",
            "san": "Bxh3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/8/6PN/PPPPPP1P/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/6PN/PPPPPP1P/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/7N/PPPPPPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/7N/PPPPPPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/1ppppppp/8/p7/1P6/P7/2PPPPPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/1ppppppp/8/p7/8/P7/1PPPPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a5",
            "san": "a5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pp1p/6p1/8/3Pp3/2P2P2/PP4PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pp1p/6p1/8/3Pp3/5P2/PPP3PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pp1p/6p1/3p4/3PP3/5P2/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pp1p/6p1/3p4/4P3/5P2/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/4P3/5P2/PPPP2PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/5P2/PPPPP1PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/8/4p3/2N2P2/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp1pp/8/8/4p3/5P2/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/4P3/5P2/PPPP2PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/8/5P2/PPPPP1PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/3ppp1p/b4np1/2pP4/5P2/2N5/PP2P1PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r/3ppp1p/b4np1/2pP4/8/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/3ppp1p/P4np1/2pP4/8/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8a6",
            "san": "Bxa6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/3ppp1p/P4np1/2pP4/8/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rn1qk2r/4ppbp/b2p1np1/2pP4/8/2N2NP1/PP2PPBP/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qk2r/4ppbp/b2p1np1/2pP4/8/2N2NP1/PP2PP1P/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 0
          }
        ]
      },
      "rn1qkb1r/4pp1p/b2p1np1/2pP4/8/2N2NP1/PP2PP1P/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/4pp1p/b2p1np1/2pP4/8/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/3ppp1p/b4np1/2pP4/8/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rn1q1rk1/4ppbp/3p1np1/2pP4/4P3/2N2NP1/PP3PKP/R1BQ3Rb--": {
        "total": 0,
        "moves": []
      },
      "rn1q1rk1/4ppbp/3p1np1/2pP4/4P3/2N3P1/PP3PKP/R1BQ2NRw--": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rn1qk2r/4ppbp/3p1np1/2pP4/4P3/2N3P1/PP3PKP/R1BQ2NRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rn1qk2r/4ppbp/3p1np1/2pP4/4P3/2N3P1/PP3P1P/R1BQ1KNRwkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Kg2",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/4pp1p/3p1np1/2pP4/4P3/2N3P1/PP3P1P/R1BQ1KNRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/4pp1p/3p1np1/2pP4/4P3/2N5/PP2NPPP/R1BQ1K1Rbkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r/4pp1p/3p1np1/2pP4/4P3/2N5/PP3PPP/R1BQ1KNRwkq-": {
        "total": 2,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }, {
            "uci": "g1e2",
            "san": "Nge2",
            "nr": 0
          }
        ]
      },
      "rn1qkb1r/4pppp/3p1n2/2pP4/4P3/2N5/PP3PPP/R1BQ1KNRbkq-": {
        "total": 2,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r/4pppp/3p1n2/2pP4/4P3/2N5/PP3PPP/R1BQKbNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1f1",
            "san": "Kxf1",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r/4pppp/b2p1n2/2pP4/4P3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "a6f1",
            "san": "Bxf1",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r/4pppp/b2p1n2/2pP4/8/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r/3ppppp/b4n2/2pP4/8/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r/3ppppp/b4n2/2pP4/8/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/3ppppp/P4n2/2pP4/8/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }, {
            "uci": "c8a6",
            "san": "Bxa6",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/3ppppp/p4n2/1PpP4/8/5P2/PP2P1PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/3ppppp/p4n2/1PpP4/8/4P3/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/3ppppp/pP3n2/2pP4/8/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/3ppppp/5n2/1NpP4/1p2P3/8/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/3ppppp/5n2/2pP4/1p2P3/2N5/PP3PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3b5",
            "san": "Nb5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/3ppppp/5n2/1ppP4/4P3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5b4",
            "san": "b4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/3ppppp/5n2/1ppP4/8/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/3ppppp/p4n2/1PpP4/8/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a6b5",
            "san": "axb5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/3ppppp/p4n2/1PpP4/8/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "b5a6",
            "san": "bxa6",
            "nr": 4
          }, {
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }, {
            "uci": "b5b6",
            "san": "b6",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/p2ppppp/5n2/1PpP4/8/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 8
          }
        ]
      },
      "rnbqkb1r/p2ppppp/5n2/1ppP2B1/2P5/8/PP2PPPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p2ppppp/5n2/1ppP4/2P1P3/8/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p2ppppp/5n2/1ppP4/2P5/5N2/PP2PPPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p2ppppp/5n2/1ppP4/2P5/5P2/PP2P1PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p2ppppp/5n2/1ppP4/2P5/8/PP1NPPPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p2ppppp/5n2/1ppP4/P1P5/8/1P2PPPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p2ppppp/5n2/1ppP4/2P3P1/8/PP2PP1P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p2ppppp/5n2/1ppP4/2P5/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 15,
        "moves": [{
            "uci": "c4b5",
            "san": "cxb5",
            "nr": 8
          }, {
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }, {
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }, {
            "uci": "b1d2",
            "san": "Nd2",
            "nr": 0
          }, {
            "uci": "a2a4",
            "san": "a4",
            "nr": 0
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 15,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 15
          }
        ]
      },
      "rnbqkb1r/pp1ppppp/5n2/2p5/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 15,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 15
          }
        ]
      },
      "rnbqkb1r/p2p1ppp/4pn2/1ppP2B1/2P5/5N2/PP2PPPP/RN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p2p1ppp/4pn2/1ppP4/2P5/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/5N2/PP2PPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp1p1ppp/4pn2/2p5/2PP4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rn1q1rk1/pbppbppp/1p3n2/3p4/2P4N/6P1/PP2PPBP/RNBQ1RK1b--": {
        "total": 0,
        "moves": []
      },
      "rn1q1rk1/pbppbppp/1p3n2/3p4/2PN4/6P1/PP2PPBP/RNBQ1RK1b--": {
        "total": 0,
        "moves": []
      },
      "rn1q1rk1/pbppbppp/1p3n2/3p4/2P5/5NP1/PP2PPBP/RNBQ1RK1w--": {
        "total": 2,
        "moves": [{
            "uci": "f3h4",
            "san": "Nh4",
            "nr": 0
          }, {
            "uci": "f3d4",
            "san": "Nd4",
            "nr": 0
          }
        ]
      },
      "rn1q1rk1/pbppbppp/1p2pn2/3P4/2P5/5NP1/PP2PPBP/RNBQ1RK1b--": {
        "total": 2,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 2
          }
        ]
      },
      "rn1q1rk1/pbppbppp/1p2pn2/8/2PP4/5NP1/PP2PPBP/RNBQ1RK1w--": {
        "total": 2,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rn1qk2r/pbppbppp/1p2pn2/8/2PP4/5NP1/PP2PPBP/RNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "rn1qk2r/pbppbppp/1p2pn2/8/2PP4/5NP1/PP2PPBP/RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r/pbpp1ppp/1p2pn2/8/2PP4/5NP1/PP2PPBP/RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r/pbpp1ppp/1p2pn2/8/2PP4/5NP1/PP2PP1P/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5NP1/PP2PP1P/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r/pbp2ppp/1p2p3/3n4/3PP3/P1N2N2/1P3PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r/pbp2ppp/1p2p3/3n4/3P4/P1N2N2/1P2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rn1qkb1r/pbp2ppp/1p2pn2/3P4/3P4/P1N2N2/1P2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d5",
            "san": "Nxd5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/pbp2ppp/1p2pn2/3p4/2PP4/P1N2N2/1P2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/pbpp1ppp/1p2pn2/8/2PP4/P1N2N2/1P2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/pbpp1ppp/1p2pn2/8/2PP4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 2
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/4pn2/8/2PP2P1/8/PP2PP1P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 4
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnb2rk1/ppB1ppbp/6p1/3q4/3P4/4P3/PP3PPP/R2QKBNRbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnb2rk1/ppp1ppbp/6p1/3q4/3P1B2/4P3/PP3PPP/R2QKBNRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f4c7",
            "san": "Bxc7",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1/ppp1ppbp/6p1/3N4/3P1B2/4P3/PP3PPP/R2QKBNRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1ppbp/6p1/3n4/3P1B2/2N1P3/PP3PPP/R2QKBNRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nxd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1ppbp/5np1/3P4/3P1B2/2N1P3/PP3PPP/R2QKBNRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f6d5",
            "san": "Nxd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1ppbp/5np1/3p4/2PP1B2/2N1P3/PP3PPP/2RQKBNRbK-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1/ppp1ppbp/5np1/3p4/2PP1B2/2N1P3/PP3PPP/R2QKBNRwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }, {
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 0
          }
        ]
      },
      "rnbqk2r/ppp1ppbp/5np1/3p4/2PP1B2/2N1P3/PP3PPP/R2QKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "rnbqk2r/ppp1ppbp/5np1/3p4/2PP1B2/2N5/PP2PPPP/R2QKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP1B2/2N5/PP2PPPP/R2QKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP2P1/2N5/PP2PP1P/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP3P/2N5/PP2PPP1/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 2
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }, {
            "uci": "h2h4",
            "san": "h4",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1/pp3pbp/3p1np1/2ppP3/2P2P2/2N2N2/PP2B1PP/R1BQK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1/pp3pbp/3p1np1/2pp4/2P1PP2/2N2N2/PP2B1PP/R1BQK2RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1/pp3pbp/3ppnp1/2pP4/2P1PP2/2N2N2/PP2B1PP/R1BQK2RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/pp3pbp/3ppnp1/2pP4/2P1PP2/2N5/PP2B1PP/R1BQK1NRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/pp2ppbp/3p1np1/2pP4/2P1PP2/2N5/PP2B1PP/R1BQK1NRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/pp2ppbp/3p1np1/2p5/2PPPP2/2N5/PP2B1PP/R1BQK1NRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPPP2/2N5/PP2B1PP/R1BQK1NRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPPP2/2N5/PP4PP/R1BQKBNRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/ppp1ppbp/3p1np1/8/2PPPP2/2N5/PP4PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pppn2bp/3p2n1/2PPp1p1/4Pp2/2N2P2/PP2BBPP/2RQNRK1b--": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/pppn2bp/3p2n1/3Pp1p1/2P1Pp2/2N2P2/PP2BBPP/2RQNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "c4c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1/pppnn1bp/3p4/3Pp1p1/2P1Pp2/2N2P2/PP2BBPP/2RQNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "e7g6",
            "san": "Ng6",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pppnn1bp/3p4/3Pp1p1/2P1Pp2/2N2P2/PP2BBPP/R2QNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pppnn1bp/3p2p1/3Pp3/2P1Pp2/2N2P2/PP2BBPP/R2QNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "g6g5",
            "san": "g5",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pppnn1bp/3p2p1/3Pp3/2P1Pp2/2N1BP2/PP2B1PP/R2QNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "e3f2",
            "san": "Bf2",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pppnn1bp/3p2p1/3Ppp2/2P1P3/2N1BP2/PP2B1PP/R2QNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "f5f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pppnn1bp/3p2p1/3Ppp2/2P1P3/2N1B3/PP2BPPP/R2QNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pppnnpbp/3p2p1/3Pp3/2P1P3/2N1B3/PP2BPPP/R2QNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pppnnpbp/3p2p1/3Pp3/2P1P3/2N5/PP2BPPP/R1BQNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N5/PP2BPPP/R1BQNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "f6d7",
            "san": "Nd7",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "f3e1",
            "san": "Ne1",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/ppp2pbp/2np1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "c6e7",
            "san": "Ne7",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/ppp2pbp/2np1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQK2RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 4
          }, {
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 6
          }
        ]
      },
      "r1bqkb1r/pppppppp/5n2/3Pn3/2P2P2/8/PP2P1PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppppppp/5n2/3Pn3/2P5/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppppppp/2n2n2/3P4/2P5/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e5",
            "san": "Ne5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppppppp/2n2n2/8/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p1n2/8/2PP2P1/8/PP2PP1P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r/ppp1pppp/3p1n2/5b2/2PPP3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r/ppp1pppp/3p1n2/5b2/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p1n2/8/2PP4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p1n2/8/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 29,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 15
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 5
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 6
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/3PP3/5P2/PPP4P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppppp/5n2/8/3P4/5P2/PPP1P2P/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/8/3P2n1/5P2/PPP1P2P/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP1BP1P/R1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP1BP1P/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p4/8/3PP1n1/8/PPP1BP1P/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/3p4/8/3PP1n1/8/PPP2P1P/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/8/3PP1n1/8/PPP2P1P/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/8/3P2n1/8/PPP1PP1P/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/3P2P1/8/PPP1PP1P/RNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6g4",
            "san": "Nxg4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/6B1/3P4/3B4/PPP2PPP/RN1QK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppppp/5n2/8/3P4/3B4/PPP2PPP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/8/3Pn3/3B4/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/8/3Pn3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/3PP3/5P2/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5P2/PPP1P1PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/3P4/5P2/PPP1P1PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/p2p1ppp/1p2pn2/2pP2B1/8/4PN2/PPP2PPP/RN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p2p1ppp/1p2pn2/2p3B1/3P4/4PN2/PPP2PPP/RN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp1p1ppp/4pn2/2p3B1/3P4/4PN2/PPP2PPP/RN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp1p1ppp/4pn2/2p3B1/3PP3/5N2/PPP2PPP/RN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp1p1ppp/4pn2/2p3B1/3P4/5N2/PPP1PPPP/RN1QKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/4pn2/6B1/3P4/5N2/PPP1PPPP/RN1QKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/4pn2/8/3P4/5N2/PPP1PPPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/3P4/5N2/PPP1PPPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r/ppp1pppp/5n2/3p1b2/3PP2B/2N2P2/PPP3PP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r/ppp1pppp/5n2/3p1b2/3P3B/2N2P2/PPP1P1PP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/3P3B/2N2P2/PPP1P1PP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/3P3B/5P2/PPP1P1PP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/8/3p4/3Pn2B/5P2/PPP1P1PP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/8/3p4/3Pn2B/8/PPP1PPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/pp2pppp/2p5/q2p4/3PP2B/2P5/PP1Q1PPP/R3KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1r/pp2pppp/2p5/q2p4/3P3B/2P5/PP1QPPPP/R3KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnb1kb1r/pp1ppppp/2p5/q7/3P3B/2P5/PP1QPPPP/R3KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/pp1ppppp/2p5/q7/3P3B/2P5/PP1nPPPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d2",
            "san": "Qxd2",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/pp1ppppp/2p5/q7/3Pn2B/2P5/PP1NPPPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d2",
            "san": "Nxd2",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/pp1ppppp/2p5/q7/3Pn2B/8/PPPNPPPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp1ppppp/2p5/8/3Pn2B/8/PPPNPPPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp1ppppp/2p5/8/3Pn2B/8/PPP1PPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1d2",
            "san": "Nd2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/8/3Pn2B/8/PPP1PPPP/RN1QKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/8/6B1/3Pn3/8/PPP1PPPP/RN1QKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g5h4",
            "san": "Bh4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pp2pp1p/5p2/2pP4/4p3/2N5/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp2pp1p/5p2/2p5/3Pp3/2N5/PPP2PPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp2pp1p/5p2/2pp4/3PP3/2N5/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pp1p/5p2/2pp4/3P4/2N5/PPP1PPPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/5B2/2pp4/3P4/2N5/PPP1PPPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7f6",
            "san": "gxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/5n2/2pp2B1/3P4/2N5/PPP1PPPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f6",
            "san": "Bxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p2B1/3P4/2N5/PPP1PPPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/3P4/2N5/PPP1PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 38,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 29
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 2
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }, {
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 2
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2P5/8/8/PPP1PPPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1pp1pp/8/2pP1p2/4P3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1pp1pp/8/2pP1p2/8/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2pP4/8/8/PPP1PPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/1P1P4/8/P1P1PPPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/8/1P1p4/5N2/P1P1PPPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/8/3p4/5N2/PPP1PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/3P4/5N2/PPP1PPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/8/2Pp4/4P3/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/8/2Pp4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/2PP4/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/3P4/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 0
          }, {
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/ppp1ppbp/5np1/8/2BP3P/2N2N2/PPP3P1/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1/ppp1ppbp/5np1/8/2BP4/2N2N2/PPP3PP/R1BQ1R1Kb--": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1/ppp1ppbp/5np1/8/2BP4/2N2N2/PPP3PP/R1B1QRK1b--": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1/ppp1ppbp/5np1/8/2BP4/2N2N2/PPP3PP/R1BQ1RK1w--": {
        "total": 2,
        "moves": [{
            "uci": "g1h1",
            "san": "Kh1",
            "nr": 0
          }, {
            "uci": "d1e1",
            "san": "Qe1",
            "nr": 0
          }
        ]
      },
      "rnbqk2r/ppp1ppbp/5np1/8/2BP4/2N2N2/PPP3PP/R1BQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "rnbqk2r/ppp1ppbp/5np1/4N3/2BP4/2N5/PPP3PP/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2r/ppp1ppbp/5np1/8/2BP4/2N2N2/PPP3PP/R1BQK2RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 0
          }, {
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }, {
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pp1p/5np1/8/2BP4/2N2N2/PPP3PP/R1BQK2RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 4
          }
        ]
      },
      "rnbqkb1r/ppp1pp1p/5np1/8/3P4/2N2N2/PPP3PP/R1BQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 4
          }
        ]
      },
      "r1bqk2r/ppp1bppp/4pn2/6B1/3n4/2NB1N2/PPP3PP/R2Q1R1Kbkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r/ppp1bppp/4pn2/6B1/3n4/2NB1N2/PPP3PP/R2Q1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1h1",
            "san": "Kh1",
            "nr": 0
          }
        ]
      },
      "r1bqk2r/ppp1bppp/2n1pn2/6B1/3P4/2NB1N2/PPP3PP/R2Q1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6d4",
            "san": "Nxd4",
            "nr": 1
          }
        ]
      },
      "r1bqk2r/ppp1bppp/2n1pn2/6B1/3P4/2NB1N2/PPP3PP/R2QK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/ppp1bppp/4pn2/6B1/3P4/2NB1N2/PPP3PP/R2QK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/ppp1bppp/4pn2/6B1/3P4/2N2N2/PPP3PP/R2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/6B1/3P4/2N2N2/PPP3PP/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/8/3P4/2N2N2/PPP3PP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/3P4/2N2N2/PPP3PP/R1BQKB1RbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 4
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/3P4/2N2Q2/PPP3PP/R1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pppp/5n2/8/3P4/2N2p2/PPP3PP/R1BQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "g1f3",
            "san": "Nxf3",
            "nr": 5
          }, {
            "uci": "d1f3",
            "san": "Qxf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/3Pp3/2N2P2/PPP3PP/R1BQKBNRbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "e4f3",
            "san": "exf3",
            "nr": 6
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/3Pp3/2N1B3/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qk2r/ppp2ppp/5pb1/1Q6/1b1Pp1P1/2N5/PPP2P1P/R3KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qk2r/ppp2ppp/5pb1/8/1b1Pp1P1/2N5/PPP1QP1P/R3KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2b5",
            "san": "Qb5+",
            "nr": 0
          }
        ]
      },
      "rn1qkb1r/ppp2ppp/5pb1/8/3Pp1P1/2N5/PPP1QP1P/R3KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/ppp2ppp/5pb1/8/3Pp1P1/2N5/PPP2P1P/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/ppp2ppp/5p2/5b2/3Pp1P1/2N5/PPP2P1P/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5g6",
            "san": "Bg6",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/ppp2ppp/5p2/5b2/3Pp3/2N5/PPP2PPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/ppp1pppp/5B2/5b2/3Pp3/2N5/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7f6",
            "san": "exf6",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/ppp1pppp/5n2/5bB1/3Pp3/2N5/PPP2PPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f6",
            "san": "Bxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/6B1/3Pp3/2N5/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/3Pp3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 6
          }, {
            "uci": "c1e3",
            "san": "Be3",
            "nr": 0
          }, {
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4p3/3Pp3/2N1B3/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4P3/4p3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/3Pp3/2N5/PPP1NPPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/3PN3/8/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p2Q/3Pp3/2N5/PPP2PPP/R1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/3Pp3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 0
          }, {
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 0
          }, {
            "uci": "g1e2",
            "san": "Nge2",
            "nr": 0
          }, {
            "uci": "c3e4",
            "san": "Nxe4",
            "nr": 0
          }, {
            "uci": "d1h5",
            "san": "Qh5",
            "nr": 0
          }
        ]
      },
      "rn1qkb1r/ppp1pppp/5n2/5b2/2BPp3/2N2P2/PPP3PP/R1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r/ppp1pppp/5n2/5b2/3Pp3/2N2P2/PPP3PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rn1qkbnr/ppp1pppp/8/5b2/3Pp3/2N2P2/PPP3PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rn1qkbnr/ppp1pppp/8/5b2/3Pp3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/3Pp3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 14,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 8
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 5
          }, {
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/3Pp3/4B3/PPP2PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/8/2BPp3/8/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/8/3Pp3/5P2/PPP3PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/8/3Pp3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 17,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 14
          }, {
            "uci": "c1e3",
            "san": "Be3",
            "nr": 0
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }, {
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 17,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 17
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/3p4/3p4/5NP1/PPP1PPBP/RNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/8/3p4/3p4/5NP1/PPP1PP1P/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2pp4/3P4/5NP1/PPP1PP1P/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2pp4/3P4/5N2/PPP1PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p1p3/8/2pP4/2N2NP1/PP2PP1P/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp3ppp/2p1p3/8/2pP4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p1p3/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p1p3/3p4/2PP4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/5N2/PP2PPPP/RNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/3P4/5N2/PPP1PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2pp4/3PPB2/8/PPP2PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/8/2pp4/3P1B2/8/PPP1PPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/3P2P1/8/PPP1PP1P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/8/Q1pP4/8/PP2PPPP/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/1pp1pppp/p7/8/2pPP3/5N2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/1pp1pppp/p7/8/2pP4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/1pp1pppp/p4n2/8/2pPP3/2N2N2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/1pp1pppp/p4n2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/1p3ppp/p3pn2/2p5/2BP4/4PN2/PP2QPPP/RNB2RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/1p3ppp/p3pn2/2p5/P1BP4/4PN2/1P3PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/1p3ppp/p3pn2/2p5/2BPP3/5N2/PP3PPP/RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/1p3ppp/p3pn2/2p5/2BP4/4PN2/PP3PPP/RNBQ1RK1wkq-": {
        "total": 3,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 0
          }, {
            "uci": "a2a4",
            "san": "a4",
            "nr": 0
          }, {
            "uci": "e3e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4pn2/2p5/2BP4/4PN2/PP3PPP/RNBQ1RK1bkq-": {
        "total": 3,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4pn2/2p5/2BP4/4PN2/PP3PPP/RNBQK2RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/8/2BP4/4PN2/PP3PPP/RNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/4PN2/PP3PPP/RNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f1c4",
            "san": "Bxc4",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/2pP4/4PN2/PP3PPP/RNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/Q1pP4/5N2/PP2PPPP/RNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pppp/5n2/8/2pP4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 3
          }, {
            "uci": "d1a4",
            "san": "Qa4+",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/2pP4/5N2/PP2PPPP/RNBQKB1RbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 5
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4p3/2BPP3/8/PP3PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/2pPP3/8/PP3PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bxc4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/2pPP3/8/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp3ppp/5n2/2ppP3/2p5/2N2N2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp3ppp/5n2/2pp4/2p1P3/2N2N2/PP3PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4pn2/2pP4/2p1P3/2N2N2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4pn2/2pP4/2p5/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/5n2/2pP4/2p5/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/5n2/2pP4/2p5/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2pP4/2p5/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2p5/2pP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/2pP4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/ppp1qppp/8/8/2Bp4/PQ2P3/1P3PPP/RNB1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp1qppp/8/8/2Bp4/1Q2PN2/PP3PPP/RNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp1qppp/8/8/2Bp4/1Q2P3/PP3PPP/RNB2KNRbkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp1qppp/8/8/2Bp4/1Q2P3/PP1N1PPP/R1B1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp1qppp/8/8/2Bp4/1Q2P3/PP3PPP/RNB1K1NRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }, {
            "uci": "e1f1",
            "san": "Kf1",
            "nr": 0
          }, {
            "uci": "b1d2",
            "san": "Nd2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/8/2Bp4/1Q2P3/PP3PPP/RNB1K1NRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/8/2Bp4/4P3/PP3PPP/RNBQK1NRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4p3/2BP4/4P3/PP3PPP/RNBQK1NRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4p3/2pP4/4P3/PP3PPP/RNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f1c4",
            "san": "Bxc4",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/2pP4/4P3/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4+",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 6
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 4
          }
        ]
      },
      "r1bqkb1r/pp1n1ppp/2p1pn2/3p2B1/2PPP3/2N2N2/PP3PPP/R2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pp1n1ppp/2p1pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppn1ppp/4pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppn1ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pp1n1pp1/2p1pb1p/8/2BP4/2N1PN2/PP3PPP/2RQ1RK1b--": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/pp1n1pp1/2p1pb1p/8/2pP4/2NBPN2/PP3PPP/2RQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "d3c4",
            "san": "Bxc4",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1/pp1n1pp1/2p1pb1p/3p4/2PP4/2NBPN2/PP3PPP/2RQ1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pp1n1pp1/2p1pb1p/3p4/2PP4/2NBPN2/PP3PPP/2RQK2RwK-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/pp3pp1/2p1pb1p/3p4/2PP4/2NBPN2/PP3PPP/2RQK2RbK-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nd7",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/pp3pp1/2p1pb1p/3p4/2PP4/2N1PN2/PP3PPP/2RQKB1RwK-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp2pp1/4pb1p/3p4/2PP4/2N1PN2/PP3PPP/2RQKB1RbK-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp2pp1/4pb1p/3p4/2PP4/2N1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1bpp1/4pB1p/3p4/2PP4/2N1PN2/PP3PPP/R2QKB1RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e7f6",
            "san": "Bxf6",
            "nr": 1
          }
        ]
      },
      "rnb2rk1/ppp1qpp1/4p2p/3P4/3P4/2P1PN2/P4PPP/R2QKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnb2rk1/ppp1qpp1/4p2p/3P4/3P4/2n1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "b2c3",
            "san": "bxc3",
            "nr": 0
          }
        ]
      },
      "rnb2rk1/ppp1qpp1/4p2p/3P4/3Pn3/2N1PN2/PP3PPP/R2QKB1RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e4c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "rnb2rk1/ppp1qpp1/4p2p/3p4/2PPn3/2N1PN2/PPQ2PPP/R3KB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnb2rk1/ppp1qpp1/4p2p/3p4/2PPn3/2N1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }, {
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1/ppp1Bpp1/4p2p/3p4/2PPn3/2N1PN2/PP3PPP/R2QKB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d8e7",
            "san": "Qxe7",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1/ppp1bpp1/4p2p/3p4/2PPn2B/2N1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "h4e7",
            "san": "Bxe7",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1/ppp1bpp1/4pn1p/3p4/2PP3B/2N1PN2/PP3PPP/R2QKB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1/ppp1bpp1/4pn1p/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 3,
        "moves": [{
            "uci": "g5f6",
            "san": "Bxf6",
            "nr": 1
          }, {
            "uci": "g5h4",
            "san": "Bh4",
            "nr": 2
          }
        ]
      },
      "r1b2rk1/pp1nqppp/2p1p3/3n4/2BPN3/4PN2/PP3PPP/2RQK2RbK-": {
        "total": 0,
        "moves": []
      },
      "r1b2rk1/pp1nqppp/2p1p3/3n4/2BP4/2N1PN2/PP3PPP/2RQK2RwK-": {
        "total": 1,
        "moves": [{
            "uci": "c3e4",
            "san": "Ne4",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1/pp1nBppp/2p1p3/3n4/2BP4/2N1PN2/PP3PPP/2RQK2RbK-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qxe7",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pp1nbppp/2p1p3/3n2B1/2BP3P/2N1PN2/PP3PP1/2RQK2RbK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/pp1nbppp/2p1p3/3n2B1/2BP4/2N1PN2/PP3PPP/2RQK2RwK-": {
        "total": 2,
        "moves": [{
            "uci": "g5e7",
            "san": "Bxe7",
            "nr": 1
          }, {
            "uci": "h2h4",
            "san": "h4",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1/pp1nbppp/2p1pn2/6B1/2BP4/2N1PN2/PP3PPP/2RQK2RbK-": {
        "total": 2,
        "moves": [{
            "uci": "f6d5",
            "san": "Nd5",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1/pp1nbppp/2p1pn2/6B1/2pP4/2NBPN2/PP3PPP/2RQK2RwK-": {
        "total": 2,
        "moves": [{
            "uci": "d3c4",
            "san": "Bxc4",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1/pp1nbppp/2p1pn2/3p2B1/2PP4/2NBPN2/PP3PPP/2RQK2RbK-": {
        "total": 2,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1/1p1nbppp/p1p1pn2/3p2B1/2PP4/P1N1PN2/1PQ2PPP/2R1KB1RbK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/1p1nbppp/p1p1pn2/3p2B1/2PP4/2N1PN2/PPQ2PPP/2R1KB1RwK-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1/pp1nbppp/2p1pn2/3p2B1/2PP4/2N1PN2/PPQ2PPP/2R1KB1RbK-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pp1nbppp/2p1pn2/3p2B1/2PP4/2N1PN2/PP3PPP/2RQKB1RwK-": {
        "total": 3,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 2
          }, {
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/p1pnbppp/1p3n2/1B1p2B1/3P4/2N1PN2/PP3PPP/2RQK2RbK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/p1pnbppp/1p3n2/3p2B1/3P4/2NBPN2/PP3PPP/2RQK2RbK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/p1pnbppp/1p3n2/3p2B1/3P4/2N1PN2/PP3PPP/2RQKB1RwK-": {
        "total": 2,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 0
          }, {
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1/p1pnbppp/1p2pn2/3P2B1/3P4/2N1PN2/PP3PPP/2RQKB1RbK-": {
        "total": 2,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1/p1pnbppp/1p2pn2/3p2B1/2PP4/2N1PN2/PP3PPP/2RQKB1RwK-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/2RQKB1RbK-": {
        "total": 5,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 3
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2NBPN2/PP3PPP/R2QK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/1QN1PN2/PP3PPP/R3KB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/pp1nbppp/4pn2/2pP2B1/3P4/2N1PN2/PPQ2PPP/R3KB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/pp1nbppp/4pn2/2pp2B1/2PP4/2N1PN2/PPQ2PPP/R3KB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PPQ2PPP/R3KB1RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 8,
        "moves": [{
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 5
          }, {
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }, {
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }, {
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 1
          }
        ]
      },
      "rn1q1rk1/pbp1bppp/1p3n2/3pN1B1/3P4/2NBP3/PP3PPP/R2QK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rn1q1rk1/pbp1bppp/1p3n2/3p2B1/3P4/2NBPN2/PP3PPP/R2QK2RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "rn1q1rk1/pbp1bppp/1p2pn2/3P2B1/3P4/2NBPN2/PP3PPP/R2QK2RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rn1q1rk1/pbp1bppp/1p2pn2/3p2B1/2PP4/2NBPN2/PP3PPP/R2QK2RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/p1p1bppp/1p2pn2/3p2B1/2PP4/2NBPN2/PP3PPP/R2QK2RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/p1p1bppp/1p2pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1RbKQ-": {
        "total": 12,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 3
          }, {
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 8
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/2RQKBNRbK-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNRwKQ-": {
        "total": 13,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 12
          }, {
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 0
          }
        ]
      },
      "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNRbKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 13
          }
        ]
      },
      "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N2N2/PPQ1PPPP/R3KB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 0
          }
        ]
      },
      "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2r/ppp1bppp/4pB2/3p4/2PP4/2N5/PP2PPPP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNRwKQkq-": {
        "total": 15,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 13
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "g5f6",
            "san": "Bxf6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4pn2/2pP2B1/3P4/2N5/PP2PPPP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp3ppp/4pn2/3p2B1/2PQ4/2N2N2/PP2PPPP/R3KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp3ppp/4pn2/3p2B1/2Pp4/2N2N2/PP2PPPP/R2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d4",
            "san": "Qxd4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4pn2/2pp2B1/2PP4/2N2N2/PP2PPPP/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4pn2/2pp2B1/2PP4/2N5/PP2PPPP/R2QKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNRbKQkq-": {
        "total": 18,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }, {
            "uci": "f8e7",
            "san": "Be7",
            "nr": 15
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pp3ppp/2p2n2/3p2B1/3P4/2N5/PPQ1PPPP/R3KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp3ppp/2p2n2/3p2B1/3P4/2N5/PP2PPPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/5n2/3p2B1/3P4/2N5/PP2PPPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppn1ppp/5n2/3p4/3P1B2/2N2N2/PP2PPPP/R2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pppn1ppp/5n2/3p4/3P4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/5n2/3p4/3P4/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/5n2/3p4/3P4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/3P4/3P4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 2
          }
        ]
      },
      "r1b2rk1/pp3ppp/2n1pn2/q1bp4/2P2B2/P1N1PN2/1PQ2PPP/2KR1B1Rb--": {
        "total": 0,
        "moves": []
      },
      "r1b2rk1/pp3ppp/2n1pn2/q1bp4/2P2B2/P1N1PN2/1PQ2PPP/3RKB1RbK-": {
        "total": 0,
        "moves": []
      },
      "r1b2rk1/pp3ppp/2n1pn2/q1bp4/2P2B2/P1N1PN2/1PQ2PPP/R3KB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "e1a1",
            "san": "O-O-O",
            "nr": 0
          }, {
            "uci": "a1d1",
            "san": "Rd1",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1/pp3ppp/2n1pn2/2bp4/2P2B2/P1N1PN2/1PQ2PPP/R3KB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1/pp3ppp/2n1pn2/2bp4/2P2B2/2N1PN2/PPQ2PPP/R3KB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1/pp3ppp/4pn2/2bp4/2P2B2/2N1PN2/PPQ2PPP/R3KB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1/pp3ppp/4pn2/2bp4/2P2B2/2N1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1/pp2bppp/4pn2/2Pp4/2P2B2/2N1PN2/PP3PPP/R2QKB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "e7c5",
            "san": "Bxc5",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1/pp2bppp/4pn2/2pp4/2PP1B2/2N1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1/pppnbppp/4pn2/2Pp4/3P1B2/2N1PN2/PP3PPP/R2QKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1/pppnbppp/4pn2/3p4/2PP1B2/2N1PN2/PP3PPP/R2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c4c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1/ppp1bppp/4pn2/3p4/2PP1B2/2N1PN2/PP3PPP/R2QKB1RbKQ-": {
        "total": 3,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }, {
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1/ppp1bppp/4pn2/3p4/2PP1B2/2N2N2/PP2PPPP/R2QKB1RwKQ-": {
        "total": 3,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 3
          }
        ]
      },
      "rnbqk2r/ppp1bppp/4pn2/3p4/2PP1B2/2N2N2/PP2PPPP/R2QKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 3
          }
        ]
      },
      "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 3
          }
        ]
      },
      "rnbqk2r/ppp2ppp/4pn2/3p4/QbPP4/2N2N2/PP2PPPP/R1B1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2r/ppp2ppp/4pn2/3p4/1bPP4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4+",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4p3/2pn4/3PP3/2N2N2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pp3ppp/2n1p3/2pn4/3P4/2NBPN2/PP3PPP/R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pp3ppp/2n1p3/2pn4/3P4/2N1PN2/PP3PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4p3/2pn4/3P4/2N1PN2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4p3/2pn4/3P4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4pn2/2pP4/3P4/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6d5",
            "san": "Nxd5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pp3ppp/4pn2/2pp4/2PP4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/2N1PN2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp3pp1/2p1pn1p/3p4/2PP3B/2N2N2/PP2PPPP/R2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp3pp1/2p1pn1p/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5h4",
            "san": "Bh4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp3ppp/2p1pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/pb1n1ppp/4p3/3nP3/Np1N4/3B4/PP3PPP/R1BQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r/pb1n1ppp/4p3/3nP3/Np1p4/3B1N2/PP3PPP/R1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 0
          }
        ]
      },
      "r2qkb1r/pb1n1ppp/4p3/2pnP3/Np1P4/3B1N2/PP3PPP/R1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/pb1n1ppp/4p3/2pnP3/Np1P4/3B1N2/PP3PPP/R1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/pb1n1ppp/4pn2/2p1P3/Np1P4/3B1N2/PP3PPP/R1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d5",
            "san": "Nd5",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/pb1n1ppp/4pn2/2p5/Np1PP3/3B1N2/PP3PPP/R1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/pb1n1ppp/2p1pn2/8/Np1PP3/3B1N2/PP3PPP/R1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/pb1n1ppp/2p1pn2/8/1p1PP3/2NB1N2/PP3PPP/R1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3a4",
            "san": "Na4",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/pb1n1ppp/2p1pn2/1p6/3PP3/2NB1N2/PP3PPP/R1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5b4",
            "san": "b4",
            "nr": 1
          }
        ]
      },
      "r2qkb1r/pb1n1ppp/2p1pn2/1p6/3P4/2NBPN2/PP3PPP/R1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e3e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/p2n1ppp/2p1pn2/1p6/3P4/2NBPN2/PP3PPP/R1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/p2n1ppp/2p1pn2/1p6/2BP4/2N1PN2/PP3PPP/R1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp1n1ppp/2p1pn2/8/2BP4/2N1PN2/PP3PPP/R1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp1n1ppp/2p1pn2/8/2pP4/2NBPN2/PP3PPP/R1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d3c4",
            "san": "Bxc4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 3
          }, {
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }, {
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 29,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 18
          }, {
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 2
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 9
          }
        ]
      },
      "rnbqk1nr/ppp1bppp/4p3/8/2PPp3/2N2P2/PP4PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppp1bppp/4p3/8/2PPp3/2N5/PP3PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }
        ]
      },
      "rnbqk1nr/ppp1bppp/4p3/3p4/2PPP3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp1bppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp4pp/2p1p3/3p1p2/2PP2P1/2N1P3/PP3P1P/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp4pp/2p1p3/3p1p2/2PP4/2N1P3/PP3PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p1p3/3p4/2PP4/2N1P3/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p1p3/8/2PPp3/2N2P2/PP4PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pp3ppp/2p1p3/8/1bPP4/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pp3ppp/2p1p3/8/1bPPN3/8/PP1B1PPP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/pp3ppp/2p1p3/8/1bPPN3/8/PP3PPP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e4c3",
            "san": "Nc3",
            "nr": 0
          }, {
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p1p3/8/2PPN3/8/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4+",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p1p3/8/2PPp3/2N5/PP3PPP/R1BQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }, {
            "uci": "c3e4",
            "san": "Nxe4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p1p3/3p4/2PPP3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p1p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pp3ppp/8/2pp4/3PP3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp3ppp/8/2pp4/3P4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/2pP4/3P4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/2pp4/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 35,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 29
          }, {
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 4
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pp1n1ppp/2p1pn2/3p2B1/2PP4/4PN2/PP1N1PPP/R2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r/pp1n1ppp/2p1pn2/3p2B1/2PP4/4PN2/PP3PPP/RN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1d2",
            "san": "Nbd2",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r/pppn1ppp/4pn2/3p2B1/2PP4/4PN2/PP3PPP/RN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r/pppn1ppp/4pn2/3p2B1/2PP4/5N2/PP2PPPP/RN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/pp3pp1/2p1pq1p/3p4/2PP4/1QN2N2/PP2PPPP/R3KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1r/pp3pp1/2p1pq1p/3p4/2PP4/2N2N2/PP2PPPP/R2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "rnb1kb1r/ppp2pp1/4pq1p/3p4/2PP4/2N2N2/PP2PPPP/R2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnb1kb1r/ppp2pp1/4pq1p/3p4/2PP4/5N2/PP2PPPP/RN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2pp1/4pB1p/3p4/2PP4/5N2/PP2PPPP/RN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8f6",
            "san": "Qxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2pp1/4pn1p/3p2B1/2PP4/5N2/PP2PPPP/RN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f6",
            "san": "Bxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/5N2/PP2PPPP/RN1QKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }, {
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp3ppp/8/2pp2B1/3P4/5N2/PP2PPPP/RN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp3ppp/8/2pp4/3P4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/2pP4/3P4/5N2/PP2PPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp3ppp/4p3/2pp4/2PP4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/5N2/PP2PPPP/RNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 38,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 35
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 3
          }
        ]
      },
      "r1bqkbnr/ppp2ppp/2n5/4P3/2Pp4/5NP1/PP2PP1P/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/ppp2ppp/2n5/4P3/2Pp4/5N2/PP1NPPPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/ppp2ppp/2n5/4P3/2Pp4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 0
          }, {
            "uci": "b1d2",
            "san": "Nbd2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4P3/2Pp4/5N2/PP2PPPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4P3/2Pp4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pP3/2P5/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 2
          }
        ]
      },
      "rn1qkbnr/ppp2ppp/4p3/3p1b2/2PP4/1QN5/PP2PPPP/R1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnr/ppp2ppp/4p3/3p1b2/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "rn1qkbnr/ppp1pppp/8/3p1b2/2PP4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rn1qkbnr/ppp1pppp/8/3p1b2/2PP4/1Q6/PP2PPPP/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnr/ppp1pppp/8/3p1b2/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "r1b1k1nr/ppp2ppp/2n5/3q4/3p4/2B1P3/PP2NPPP/R2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k1nr/ppp2ppp/2n5/3q4/3p4/2B1P3/PP3PPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1e2",
            "san": "Ne2",
            "nr": 0
          }
        ]
      },
      "r1b1k1nr/ppp2ppp/2n5/3qp3/3P4/2B1P3/PP3PPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1b1k1nr/ppp2ppp/2n5/3qp3/3P4/2b1P3/PP1B1PPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2c3",
            "san": "Bxc3",
            "nr": 1
          }
        ]
      },
      "r1b1k1nr/ppp2ppp/2n5/3qp3/1b1P4/2N1P3/PP1B1PPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4c3",
            "san": "Bxc3",
            "nr": 1
          }
        ]
      },
      "r1b1k1nr/ppp2ppp/2n5/3qp3/1b1P4/2N1P3/PP3PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "r1b1kbnr/ppp2ppp/2n5/3qp3/3P4/2N1P3/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "r1b1kbnr/ppp2ppp/2n5/3qp3/3P4/4P3/PP3PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1b1kbnr/ppp1pppp/2n5/3q4/3P4/4P3/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1b1kbnr/ppp1pppp/2n5/3q4/3P4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3P4/3P4/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/8/2pP4/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/ppp1pppp/2n5/8/2pP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3p4/2PP4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "r2qkbnr/ppp1pppp/2n5/3p4/Q1PP2b1/5N2/PP2PPPP/RNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkbnr/ppp1pppp/2n5/3p4/2PP2b1/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3p4/2PP4/5N2/PP2PPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3p4/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/2p2n2/3p2B1/2PP4/5N2/PP2PPPP/RN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r/pp2pppp/n1p2n2/4Nb2/P1pPP3/2N5/1P3PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r/pp2pppp/n1p2n2/4Nb2/P1pP4/2N5/1P2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rn1qkb1r/pp2pppp/2p2n2/4Nb2/P1pP4/2N5/1P2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8a6",
            "san": "Na6",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r/pp2pppp/2p2n2/5b2/P1pP4/2N2N2/1P2PPPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/2p2n2/8/P1pP4/2N2N2/1P2PPPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/p3pppp/2p2n2/1p2P3/2pP4/2N2N2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/p3pppp/2p2n2/1p6/2pPP3/2N2N2/PP3PPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pp2pppp/2p2n2/8/2pPP3/2N2N2/PP3PPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/2p2n2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "a2a4",
            "san": "a4",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/2PPP3/8/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/8/2pPP3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/8/2pP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp3ppp/2p5/3pp3/2PPP3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp3ppp/2p5/3pp3/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 3
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 64,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 13
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 38
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 2
          }, {
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 2
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 3
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 6
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 85,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 17
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 1
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 64
          }
        ]
      },
      "rnbqkbnr/pppp2pp/4p3/5p2/2PPP3/8/PP3PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/4p3/5p2/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/2PP4/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppppp1pp/5n2/8/3Pp3/2N2P2/PPP3PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppppp2p/5np1/6B1/3Pp3/2N2P2/PPP3PP/R2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppppp2p/5np1/6B1/3Pp3/2N5/PPP2PPP/R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppppp1pp/5n2/6B1/3Pp3/2N5/PPP2PPP/R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppppp1pp/5n2/8/3Pp1P1/2N5/PPP2P1P/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppppp1pp/5n2/8/3Pp3/2N5/PPP2PPP/R1BQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }, {
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/8/3Pp3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/8/3Pp3/8/PPPN1PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp1pp/8/8/3Pp3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 3
          }, {
            "uci": "b1d2",
            "san": "Nd2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 4
          }
        ]
      },
      "rnbqkb1r/ppppp1pp/5n2/5p2/3P2P1/7P/PPP1PP2/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppppp1pp/5n2/5p2/3P4/7P/PPP1PPP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/3P4/7P/PPP1PPP1/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1p1pp/8/3p1p2/3PP3/2N5/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1p1pp/8/3p1p2/3P4/2N5/PPP1PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppppp1pp/5n2/5p2/3P2P1/2N5/PPP1PP1P/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppppp1pp/5n2/5p2/3P4/2N5/PPP1PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/3P4/2N5/PPP1PPPP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1p1pp/8/3p4/3PP1p1/2N5/PPP2P1P/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1p1pp/8/3p4/3PP1p1/8/PPP2P1P/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/8/3PP1p1/8/PPP2P1P/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/8/3P2p1/8/PPP1PP1P/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/3P2P1/8/PPP1PP1P/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5g4",
            "san": "fxg4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/4p3/5p2/3P2P1/3Q4/PPP1PP1P/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/4p3/5p2/3P4/3Q4/PPP1PPPP/RNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp2p/6p1/5p2/3P2P1/3Q4/PPP1PP1P/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp2p/6p1/5p2/3P4/3Q4/PPP1PPPP/RNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1p1pp/3p4/5p2/3P2P1/3Q4/PPP1PP1P/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1p1pp/3p4/5p2/3P4/3Q4/PPP1PPPP/RNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1p1pp/8/3p1p2/3P2P1/3Q4/PPP1PP1P/RNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1p1pp/8/3p1p2/3P4/3Q4/PPP1PPPP/RNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/3P4/3Q4/PPP1PPPP/RNB1KBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 4
          }, {
            "uci": "h2h3",
            "san": "h3",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 1
          }, {
            "uci": "d1d3",
            "san": "Qd3",
            "nr": 4
          }
        ]
      },
      "rnbqkbnr/pppp2pp/4p3/5p2/3P1BP1/8/PPP1PP1P/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/4p3/5p2/3P1B2/8/PPP1PPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/3P1B2/8/PPP1PPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/2PP4/8/PP2PPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/3P4/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 1
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/3Pp3/8/8/PPP1PPPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr/ppppqppp/2n5/3QP3/8/5N2/PPP1PPPP/RNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr/ppppqppp/2n5/4P3/8/5N2/PPP1PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d5",
            "san": "Qd5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4P3/8/5N2/PPP1PPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4P3/8/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4P3/8/8/PPP1PPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/3Pp3/8/PPP1PPPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/4N3/3Pp3/8/PPP1PPPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/3Pp3/5N2/PPP1PPPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f3g1",
            "san": "Ng1",
            "nr": 0
          }, {
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/3P4/5N2/PPP1PPPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/3P4/4P3/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }, {
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppppp1p/5np1/7P/3P4/8/PPP1PPP1/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppp1p/5np1/8/3P3P/8/PPP1PPP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h4h5",
            "san": "h5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppppp1p/6p1/8/3P3P/8/PPP1PPP1/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppp1p/6p1/8/3P4/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 1
          }
        ]
      },
      "rn1qkbnr/pbpppppp/8/1B6/3PP3/8/PPP2PPP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnr/pbpppppp/8/1p6/3PP3/8/PPP2PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bxb5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/p1pppppp/8/1p6/3PP3/8/PPP2PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/p1pppppp/8/1p6/3P4/8/PPP1PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNRbKQkq-": {
        "total": 150,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 38
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 5
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 85
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 13
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 2
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 5
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/5PP1/8/PPPPP2P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/3p4/2P2P2/8/PP1PP1PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp2pppp/5n2/2p5/3p1P2/1P2PN2/PBPP2PP/RN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp2pppp/5n2/2p5/3p1P2/1P3N2/PBPPP1PP/RN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/3p1P2/1P3N2/PBPPP1PP/RN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/3p1P2/1P6/PBPPP1PP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/5P2/1P6/PBPPP1PP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/5P2/1P6/P1PPP1PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/5P2/1P6/P1PPP1PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/8/4pP2/2N5/PPPPQ1PP/R1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pppp/5n2/8/4pP2/2N5/PPPPN1PP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp1pppp/5n2/8/4pP2/2N5/PPPP2PP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 0
          }, {
            "uci": "g1e2",
            "san": "Nge2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/4pP2/2N5/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/4pP2/8/PPPP2PP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/4PP2/8/PPPP2PP/RNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/5P2/8/PPPPP1PP/RNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 0
          }, {
            "uci": "b2b3",
            "san": "b3",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/5P2/2N5/PPPPP1PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1p1ppp/8/2p5/3p1P2/2P2N2/PP2P1PP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1p1ppp/8/2p5/3p1P2/5N2/PPP1P1PP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/3p1P2/5N2/PPP1P1PP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/3p1P2/8/PPP1P1PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/3P1P2/8/PPP1P1PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/5P2/8/PPPPP1PP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppp1p/8/6p1/5P2/8/PPPPP1PP/RNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp1pp/8/5p2/4PP2/8/PPPP2PP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp1pp/8/5p2/5P2/8/PPPPP1PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNRbKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 5
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 2
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppppp1/8/7p/6P1/7P/PPPPPP2/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppppp1/8/7p/8/7P/PPPPPPP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h5",
            "san": "h5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnr/pbpp2pp/1p2p3/3P1p2/2P1P3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnr/pbpp2pp/1p2p3/5p2/2PPP3/2N5/PP3PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rn1qkbnr/pbpp1ppp/1p2p3/8/2PPP3/2N5/PP3PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnr/pbpp1ppp/1p2p3/8/2PP4/2N5/PP2PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/p1pp1ppp/1p2p3/8/2PP4/2N5/PP2PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/p1pp1ppp/1p2p3/8/2PP4/8/PP2PPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/2P5/8/PP1PPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/2P1P3/8/PP1P1PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppppp/5n2/8/2P3P1/8/PP1PPP1P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppppp/5n2/8/2P5/8/PP1PPPPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/2P1P3/8/PP1P1PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1p1pp/3p4/5p2/2P1P3/5N2/PP1P1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1p1pp/3p4/5p2/2P5/5N2/PP1PPPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/2P5/5N2/PP1PPPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppppp1pp/5n2/5p2/2P1P3/2N5/PP1P1PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppppp1pp/5n2/5p2/2P5/2N5/PP1PPPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/2P5/2N5/PP1PPPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/2P3P1/8/PP1PPP1P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp1pp/8/5p2/2P5/8/PP1PPPPP/RNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/p1pppppp/8/1p6/2P5/8/PP1PPPPP/RNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/8/2P2p2/4PN2/PP1P2PP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/8/2P2p2/4P3/PP1P2PP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/2P2P2/4P3/PP1P2PP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/2P5/4P3/PP1P1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/2P5/4P3/PP1P1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp1ppppp/5n2/2p5/1PP5/5N2/P2PPPPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp1ppppp/5n2/2p5/2P5/5N2/PP1PPPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/2P5/5N2/PP1PPPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/1PP5/8/P2PPPPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/2p5/2P5/8/PP1PPPPP/RNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNRbKQkq-": {
        "total": 11,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 4
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/6P1/8/PPPPPP1P/RNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppppp1p/8/6p1/5PP1/8/PPPPP2P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppppp1p/8/6p1/6P1/8/PPPPPP1P/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1ppp1/8/3p3P/8/8/PPPPPPBP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1ppp1/8/3p3p/6P1/8/PPPPPPBP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4h5",
            "san": "gxh5",
            "nr": 0
          }
        ]
      },
      "rn1qkbnr/ppp1pppp/8/3p4/2P3b1/8/PP1PPPBP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnr/ppp1pppp/8/3p4/6b1/8/PPPPPPBP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3p4/3p2P1/2P5/PP2PPBP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/3p4/3p2P1/8/PPP1PPBP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/3P2P1/8/PPP1PPBP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/6P1/8/PPPPPPBP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/8/2p3P1/1P6/P2PPPBP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/2p5/8/2p3P1/8/PP1PPPBP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b3",
            "san": "b3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/2P3P1/8/PP1PPPBP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/2p5/3p4/6P1/8/PPPPPPBP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPPBP/RNBQK1NRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "h7h5",
            "san": "h5",
            "nr": 1
          }, {
            "uci": "c8g4",
            "san": "Bxg4",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4p3/4p1P1/2NP4/PPP2P1P/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/4p1P1/2N5/PPPP1P1P/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/4p1P1/2N5/PPPP1P1P/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/4p1P1/8/PPPP1P1P/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/4P1P1/8/PPPP1P1P/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPP1P/RNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 4
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/6P1/8/PPPPPP1P/RNBQKBNRbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 5
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/1P6/6P1/P1PPPPBP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/8/6P1/PPPPPPBP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/6P1/PPPPPPBP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nr/ppp1bppp/8/3p4/4p2N/P2P2P1/1PP1PP1P/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nr/ppp1bppp/8/3p4/4p2N/P5P1/1PPPPP1P/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3p4/4p2N/P5P1/1PPPPP1P/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3p4/4p3/P4NP1/1PPPPP1P/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3h4",
            "san": "Nh4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/8/P4NP1/1PPPPP1P/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/8/P5P1/1PPPPP1P/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/P5P1/1PPPPP1P/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/6PN/PPPPPP1P/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/8/1P2p3/6P1/P1PPPP1P/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/8/4p3/6P1/PPPPPP1P/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/4p3/6P1/PPPPPP1P/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/4p3/5NP1/PPPPPP1P/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g1",
            "san": "Ng1",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/5NP1/PPPPPP1P/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/6P1/PPPPPP1P/RNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 1
          }, {
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }, {
            "uci": "g1h3",
            "san": "Nh3",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4p3/2p5/1P4P1/P2PPPBP/RNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/2p5/6P1/PP1PPPBP/RNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b3",
            "san": "b3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/2P5/6P1/PP1PPPBP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/6P1/PPPPPPBP/RNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/6P1/PPPPPP1P/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 4
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/1P5P/8/P1PPPPP1/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/2p5/7P/8/PPPPPPP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/3p4/3p3P/2P2N2/PP2PPP1/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/8/3p4/3p3P/5N2/PPP1PPP1/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2pp4/3P3P/5N2/PPP1PPP1/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2pp4/3P3P/8/PPP1PPP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/3P3P/8/PPP1PPP1/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/7P/8/PPPPPPP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/3p3P/2P5/PP2PPP1/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/3p3P/8/PPP1PPP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/3P3P/8/PPP1PPP1/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/7P/8/PPPPPPP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppp1p/8/6p1/7P/8/PPPPPPP1/RNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp1pp/8/8/4p2P/3P4/PPP2PP1/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp1pp/8/8/4p2P/8/PPPP1PP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/4P2P/8/PPPP1PP1/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/7P/8/PPPPPPP1/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/7P/8/PPPPPPP1/RNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2pppp/5n2/2pp4/4P3/1P3N2/PBPP1PPP/RN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp2pppp/5n2/2pp4/8/1P3N2/PBPPPPPP/RN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P3N2/PBPPPPPP/RN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P3N2/P1PPPPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2pp4/4P3/1P3N2/P1PP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/8/2p5/2p5/1P2PN2/P2P1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/8/2p5/2p5/1PN2N2/P2PPPPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/8/2p5/2p5/1P3N2/P2PPPPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2pp4/2P5/1P3N2/P2PPPPP/RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2pp4/8/1P3N2/P1PPPPPP/RNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/1P3N2/P1PPPPPP/RNBQKB1RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr/pp2pppp/8/2p5/1PPp4/4PN2/P2P1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp2pppp/8/2p5/2Pp4/4PN2/PP1P1PPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/2Pp4/4PN2/PP1P1PPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/2Pp4/5N2/PP1PPPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/2P5/5N2/PP1PPPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1RwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "b2b3",
            "san": "b3",
            "nr": 4
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppppp1p/8/6p1/8/5N2/PPPPPPPP/RNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppppp1pp/5n2/5p2/4P3/3P1N2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppppp1pp/5n2/5p2/8/3P1N2/PPP1PPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/8/3P1N2/PPP1PPPP/RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/4P3/5N2/PPPP1PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp1pp/8/5p2/8/5N2/PPPPPPPP/RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/8/5N2/PPPPPPPP/RNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/5N2/PPPPPPPP/RNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/8/3p4/4PN2/PPP2PPP/RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/2p5/8/5N2/PPPPPPPP/RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1RbKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 6
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 2
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 0
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/5P2/1P6/PBPPP1PP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/PBPPPPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/4p3/5p2/4P3/1P6/PBPP1PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/4p3/5p2/8/1P6/PBPPPPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/8/1P6/PBPPPPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/4p3/8/8/1P6/P1PPPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/1P6/8/P1PPPPPP/RNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp2ppp/3q4/4p3/1P2p3/P4P2/1BPP2PP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnr/ppp2ppp/3q4/4p3/1P2p3/P7/1BPP1PPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }
        ]
      },
      "rnb1kbnr/ppp2ppp/3q4/3pp3/1P2P3/P7/1BPP1PPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/ppp2ppp/3q4/3pp3/1P6/P7/1BPPPPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/ppp1pppp/3q4/3p4/1P6/P7/1BPPPPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnr/ppp1pppp/3q4/3p4/1P6/8/PBPPPPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/1P6/8/PBPPPPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d6",
            "san": "Qd6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/1P6/8/P1PPPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/1p3ppp/2p1pn2/P2p4/4P3/P2P4/1BP2PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/1p3ppp/2p1pn2/P2p4/8/P2P4/1BP1PPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/1p1p1ppp/2p1pn2/P7/8/P2P4/1BP1PPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/1p1p1ppp/2p1pn2/p7/1P6/P2P4/1BP1PPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4a5",
            "san": "bxa5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp1p1ppp/2p1pn2/8/1P6/P2P4/1BP1PPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a5",
            "san": "a5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp1p1ppp/2p1pn2/8/1P6/P7/1BPPPPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/4pn2/8/1P6/P7/1BPPPPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/4pn2/8/1P6/8/PBPPPPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/1P6/8/PBPPPPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppppppp/5n2/8/1P6/8/P1PPPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/1p1ppppp/8/pp6/4P3/8/PBPP1PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/1p1ppppp/8/pp6/8/8/PBPPPPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/1p1ppppp/2p5/pP6/8/8/PBPPPPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6b5",
            "san": "cxb5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/1p1ppppp/2p5/p7/1P6/8/PBPPPPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/2p5/8/1P6/8/PBPPPPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a5",
            "san": "a5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/2p5/8/1P6/8/P1PPPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp2pp/5p2/4p3/1P2P3/8/PBPP1PPP/RN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp2pp/5p2/4p3/1P6/8/PBPPPPPP/RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/1P6/8/PBPPPPPP/RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f6",
            "san": "f6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/1P6/8/P1PPPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/ppp1pppp/2n5/3p4/3P4/2N5/PPP1PPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppppppp/2n5/8/3P4/2N5/PPP1PPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/4p3/2N2P2/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/8/4p3/2NP4/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/4NP2/8/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/4N3/8/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/4N3/8/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/2B1p3/2N5/PPPP1PPP/R1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp1pppp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }, {
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }, {
            "uci": "c3e4",
            "san": "Nxe4",
            "nr": 1
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/4P3/2N5/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 4
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pp2p1pp/5n2/2p2p2/1P1p1P2/5N2/P1PPPNPP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pp2p1pp/5n2/2p2p2/3p1P2/5N2/PPPPPNPP/R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp1p1pp/5n2/5p2/3p1P2/5N2/PPPPPNPP/R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1p1pp/5n2/5p2/3p1P2/8/PPPPPNPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1p1pp/8/5p2/3p1P2/8/PPPPPNPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1p1pp/8/5p2/3pNP2/8/PPPPP1PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f2",
            "san": "Nf2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4p3/3pNP2/5N2/PPPPP1PP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/3pNP2/8/PPPPP1PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/3pNP2/8/PPPPP1PP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/8/3p1P2/2N5/PPPPP1PP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c3e4",
            "san": "Ne4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/5P2/2N5/PPPPP1PP/R1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/2N5/PPPPPPPP/R1BQKBNRwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 5
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnr/pp1ppppp/8/2p5/1P6/2N5/P1PPPPPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pp1ppppp/8/2p5/8/2N5/PPPPPPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/4p3/4p3/1PNP4/P1P2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/4p3/4p3/1PN5/P1PP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/4P3/1PN5/P1PP1PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/8/1PN5/P1PPPPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/1PN5/P1PPPPPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/8/4Pp2/2N5/PPPP2PP/R1BQKBNRbKQkqe3": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/pppp1ppp/8/8/5p2/2N5/PPPPP1PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/2N5/PPPPPPPP/R1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b2b3",
            "san": "b3",
            "nr": 1
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/8/4p3/2NP4/PPP2PPP/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppppp1pp/8/8/4p3/2N5/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/4P3/2N5/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppppp1pp/8/5p2/8/2N5/PPPPPPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/p1pppppp/8/1p6/8/2N5/PPPPPPPP/R1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppppp/5n2/8/6P1/2N5/PPPPPP1P/R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppppppp/5n2/8/8/2N5/PPPPPPPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNRbKQkq-": {
        "total": 14,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 7
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 2
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/8/5p2/2N1PN2/PPPP2PP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/pppp1ppp/5n2/8/5p2/2N1P3/PPPP2PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/5P2/2N1P3/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/pppp1ppp/5n2/4p3/8/2N1P3/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/8/5p2/2N1PN2/PPPP2PP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr/pppp1ppp/2n5/8/5p2/2N1P3/PPPP2PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/5P2/2N1P3/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr/pppp1ppp/2n5/4p3/8/2N1P3/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3p4/5p2/2N1PN2/PPPP2PP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp2ppp/8/3p4/5p2/2N1P3/PPPP2PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/5P2/2N1P3/PPPP2PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/3pp3/8/2N1P3/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/2N1P3/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/8/4P3/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/5n2/3p4/5p2/P1N1PN2/1PPP2PP/R1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r/ppp2ppp/5n2/3p4/5p2/P1N1P3/1PPP2PP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/5n2/3pp3/5P2/P1N1P3/1PPP2PP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp2ppp/5n2/3pp3/8/P1N1P3/1PPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/8/P1N1P3/1PPP1PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r/ppp1pppp/5n2/3p4/8/2N1P3/PPPP1PPP/R1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/2N1P3/PPPP1PPP/R1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp1pppp/8/3p4/8/4P3/PPPP1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 3
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp3pp/P7/3ppp2/8/4P3/1PPP1PPP/RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr/ppp3pp/8/P2ppp2/8/4P3/1PPP1PPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a5a6",
            "san": "a6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/P2pp3/8/4P3/1PPP1PPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/ppp2ppp/8/P2pp3/8/8/1PPPPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/P3p3/8/8/1PPPPPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppp1ppp/8/4p3/P7/8/1PPPPPPP/RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a4a5",
            "san": "a5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNRwKQkq-": {
        "total": 458,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 227
          }, {
            "uci": "g1h3",
            "san": "Nh3",
            "nr": 1
          }, {
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }, {
            "uci": "f2f3",
            "san": "f3",
            "nr": 2
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 150
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 9
          }, {
            "uci": "h2h3",
            "san": "h3",
            "nr": 1
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 11
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 7
          }, {
            "uci": "g2g3",
            "san": "g3",
            "nr": 5
          }, {
            "uci": "h2h4",
            "san": "h4",
            "nr": 5
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 13
          }, {
            "uci": "b2b3",
            "san": "b3",
            "nr": 2
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 5
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 14
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 4
          }, {
            "uci": "a2a4",
            "san": "a4",
            "nr": 1
          }
        ]
      }
    },
    "black": {
      "r3kbnrpp1q1ppp4p31B1pPb23P42P2N23K1PPPnNBQ3Rwkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkbnrpp3ppp4p31B1pPb23P42P2N23K1PPPnNBQ3Rbkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d7",
            "san": "Qd7",
            "nr": 0
          }
        ]
      },
      "r2qkbnrpp3ppp4p33pPb23P42P2N23K1PPPnNBQ1B1Rwkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5+",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp3ppp4p33pPb23P42P2N22nK1PPPRNBQ1B1Rbkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2a1",
            "san": "Nxa1",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp3ppp4p33pPb23P42P2N22n2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1d2",
            "san": "Kd2",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp3ppp4p33pPb21n1P42P2N25PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4c2",
            "san": "Nc2+",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp3ppp4p33pPb21n1P45N22P2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp3ppp2n1p33pPb21P1P45N22P2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6b4",
            "san": "Nxb4",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp3ppp2n1p33pPb21p1P4P4N22P2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a3b4",
            "san": "axb4",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp2pppp2n53pPb21p1P4P4N22P2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp2pppp2n53pPb21p1P4P72P2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp2pppp2n53pP31p1P4P72P2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp2pppp2n53pP31p1P48P1P2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp83pP31p1P48P1P2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp83p41p1PP38P1P2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp881p1PP38P1P2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp884P3p72PP1PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpp3ppp2n1q34p31pP5P4N21B1P1PPPRN1QKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpp3ppp2n53qp31pP5P4N21B1P1PPPRN1QKB1RbKQkqc3": {
        "total": 1,
        "moves": [{
            "uci": "d5e6",
            "san": "Qe6",
            "nr": 0
          }
        ]
      },
      "r1b1kbnrpp3ppp2n53qp31p6P4N21BPP1PPPRN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpp3ppp83qp31p6P4N21BPP1PPPRN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpp3ppp83qp31p6P4N22PP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpp2pppp83q41p6P4N22PP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpp2pppp83q41p6P72PP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp83P41p6P72PP1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp83p41p2P3P72PP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp881p2P3P72PP1PPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b4a3",
            "san": "bxa3",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp881p2P38P1PP1PPPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }, {
            "uci": "a2a3",
            "san": "a3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p51P2P38P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c5b4",
            "san": "cxb4",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rpp1pp1pp7n2p2P285N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1pp1pp82p2P285N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8h6",
            "san": "Nh6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1pp1pp82p2p24P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp2pppp2np483Pn35N2PP2BPPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpp2pppp2np1n283PP35N2PP2BPPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpp2pppp2np1n283pP32P2N2PP2BPPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp2pppp2np1n22p53PP32P2N2PP2BPPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp2pppp2np1n22p54P32P2N2PP1PBPPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp3p1n22p54P32P2N2PP1PBPPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp3p1n22p54P32P2N2PP1P1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp3p42p54P32P2N2PP1P1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp3pppp3p41pp54P35NP1PPPP1P1PRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp3p42p54P35NP1PPPP1P1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp3p42p54P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }, {
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r1p2ppppp4n22pP482P2N2PP1P1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1p2ppppp72pP482P2N2PP1P1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr1p2ppppp72pp44P32P2N2PP1P1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1p1pppppp72p54P32P2N2PP1P1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1p1pppppp72p54P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r1p3pppp1n1pn23p42P1P3N1N5PP3PPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r1p3pppp1nppn282P1P3N1N5PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d6d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r1p3pppp1nppn21N62P1P32N5PP3PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5a3",
            "san": "Na3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp3ppp2nppn21N62P1P32N5PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp3ppp2nppn21N62P1P38PP3PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "N1c3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2npp31N62P1P38PP3PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2npp31N64P38PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1p1ppp2n1p31N64P38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1p1ppp2n1p383NP38PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4b5",
            "san": "Nb5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp4p383NP38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp4p383pP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp4p32p53PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp4p32p54P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp2ppppp81pp54P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp82p54P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }, {
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32pp43PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1ppp4p32p53PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1p1ppp4p32p54P32N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p54P32N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp5n22pP45P28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82pP45P28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp44PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p54PP28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r1p3pppp2ppn282B1P32N2N2PP3PPPR1BQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp3ppp3ppn282B1P32N2N2PP3PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp3ppn282B1P32N2N2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp3pp382B1P32N2N2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp3pp382B1P32N5PP3PPPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp3p482B1P32N5PP3PPPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp3p484P32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r1p2ppppp1np1n282B1P32N2N2PP3PPPR1BQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr1p2ppppp1np482B1P32N2N2PP3PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr1p2ppppp1np482B1P32N2N2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2npp382B1P32N2N2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp2pppp2np482B1P32N2N2PP3PPPR1BQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpp2pppp2np484P32N2N2PP3PPPR1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrpp1ppp1p2n3p184P32N2N2PP3PPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k1nr1pqp1pppp1nbp382B1P32N2N2PP2QPPPR1B2RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnr1pqp1pppp1n1p382B1P32N2N2PP2QPPPR1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8d6",
            "san": "Bd6",
            "nr": 0
          }
        ]
      },
      "r1b1kbnr1pqp1pppp1n1p382B1P32N2N2PP3PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }
        ]
      },
      "r1bqk1nr3p1pppp1n1p31pb54P31BN2N2PP3PPPR1BQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr3p1pppp1n1p31p64P31BN2N2PP3PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr3p1pppp1n1p31p62B1P32N2N2PP3PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4b3",
            "san": "Bb3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr1p1p1pppp1n1p382B1P32N2N2PP3PPPR1BQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d8c7",
            "san": "Qc7",
            "nr": 1
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr1p1p1pppp1n1p382B1P32N2N2PP3PPPR1BQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "r1bqk1nrpp1p1ppp2n1p32b52B1P32N2N2PP3PPPR1BQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpp1p1ppp2n1p381bB1P32N2N2PP3PPPR1BQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr5pppp1npp31p62B1P32N2N2PP2QPPPR1B2RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr1p3pppp1npp382B1P32N2N2PP2QPPPR1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr1p3pppp1npp382B1P32N2N2PP3PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2npp382B1P32N2N2PP3PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1p1ppp2n1p382B1P32N2N2PP3PPPR1BQK2RbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 2
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }, {
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 0
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1p1ppp2n1p384P32N2N2PP3PPPR1BQKB1RwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 5
          }
        ]
      },
      "r1bqkbnrpp1ppppp2n584P32N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 0
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 5
          }
        ]
      },
      "r1bqkbnrpp1ppppp2n584P32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 8
          }
        ]
      },
      "rnbqkbnr1p1p1pppp3p384P32N2N2PP3PPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1ppp4p384P32N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r1p1pnpppp3p382B1P32N2N2PP3PPPR1BQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1p1p1pppp3p382B1P32N2N2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr1p1p1pppp3p382B1P32N5PP3PPPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp4p382B1P32N5PP3PPPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp4p384P32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp884P32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 11,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 8
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp1ppppp884P32p5PP3PPPRNBQKBNRwKQkq-": {
        "total": 11,
        "moves": [{
            "uci": "b1c3",
            "san": "Nxc3",
            "nr": 11
          }
        ]
      },
      "rnbqkb1rpp1ppppp5n283pP32P5PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1ppp84p33pP32P5PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp884P32Pp4PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp83p43pP32P5PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpp1ppppp8q73pP32P5PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp883pP32P5PP3PPPRNBQKBNRbKQkq-": {
        "total": 16,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 11
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }, {
            "uci": "d4d3",
            "san": "d3",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }, {
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp883pP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 16,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 16
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p53PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 16,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 16
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p54P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 27,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 3
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 6
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 16
          }
        ]
      },
      "rnbqkb1rppp1pp1p1n1p44P1p12PP1P28PP4PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp1n1p44P32PP1P28PP4PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp1n1p44P32PP48PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p43nP32PP48PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5b6",
            "san": "Nb6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p43nP33P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp83nP33P48PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp83nP388PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n24P388PPPP1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d5",
            "san": "Nd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n23P482N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n23P482N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p44P32N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n284P32N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n284P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp2p1ppp2p51B2p34P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp1pp2pp81B2pp24P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp1pp1ppp81B2p34P38PPPP1PPPRNBQK1NRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrp1pp1ppp81p2p32B1P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c4b5",
            "san": "Bxb5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp84p32B1n32N5PPPP1PPPR1BQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp1pp1ppp5n21p2p32B1P32N5PPPP1PPPR1BQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n24p32B1P32N5PPPP1PPPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32B1P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp22B1P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83pp32B1P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp2ppp5n22bBp34P32P5PP1P1PPPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp82bBp34P32P5PP1P1PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp2ppp82bpp32B1P32P5PP1P1PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "Bxd5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b1p32B1P32P5PP1P1PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b1p32B1P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p32B1P38PPPP1PPPRNBQK1NRbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 2
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppppqppp882B1P38PB3PPPRN1QK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n282B1P38PB3PPPRN1QK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp881bB1P38PB3PPPRN1QK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83p42B1P38PB3PPPRN1QK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp882B1P38PB3PPPRN1QK1NRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "f8b4",
            "san": "Bb4+",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp882B1P38Pp3PPPRNBQK1NRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c1b2",
            "san": "Bxb2",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrpppp1ppp882B1P32p5PP3PPPRNBQK1NRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c3b2",
            "san": "cxb2",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrpppp1ppp884P32p5PP3PPPRNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 4
          }
        ]
      },
      "rnbqkb1rppppnppp883pP32P5PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83p43pP32P5PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp883pP32P5PP3PPPRNBQKBNRbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 4
          }, {
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp883pP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 6
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp33PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpppb1ppp3p44P34P38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp3p44P34P38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8d7",
            "san": "Bd7",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp3p44p33PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p33PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 6
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2ppp3b43Pp385N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83P44p35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83Pp385N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8d6",
            "san": "Bd6",
            "nr": 0
          }, {
            "uci": "e5e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrppp2ppp84N1q12B1p38PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84N32B1p38PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8g5",
            "san": "Qg5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp84N34p38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pN34P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 2
          }, {
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp2pp6n14Pp21bBP42N2Q2PPP2PPPR1B1K2RwKQkqf6": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp6n14P31bBP42N2Q2PPP2PPPR1B1K2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp6n14P31bBP42N5PPP2PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1f3",
            "san": "Qf3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp6n14P32BP42N5PPP2PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp6n14P33P42N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp5nn14P33P42N5PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g8",
            "san": "Ng8",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp5nn183PP32N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "1rb1kbnrpp1p1ppp3P1qn11N65P28PPP3PPR1BQKB1RwKQk-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpp1p1ppp3P1qn11N65P28PPP3PPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a8b8",
            "san": "Rb8",
            "nr": 0
          }
        ]
      },
      "r1b1kbnrpp1p1ppp3P1qn185P22N5PPP3PPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3b5",
            "san": "Nb5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1p1ppp3P2n185P22N5PPP3PPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1p1ppp3p2n14P35P22N5PPP3PPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d6",
            "san": "exd6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp3P2n14P35P22N5PPP3PPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7d6",
            "san": "cxd6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp6n13PP35P22N5PPP3PPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp5nn13PP35P22N5PPP3PPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g8",
            "san": "Ng8",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp5nn13P44PP22N5PPP3PPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp5n23Pn34PP22N5PPP3PPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5g6",
            "san": "Ng6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp5n23Pn34P32N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n23P44P32N5PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e5",
            "san": "Ne5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n283PP32N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp5n24n33PP32N5PPP2PPPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5g6",
            "san": "Ng6",
            "nr": 1
          }, {
            "uci": "e5c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp5n24n34P32N5PPPP1PPPR1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24N34P32N5PPPP1PPPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c6e5",
            "san": "Nxe5",
            "nr": 2
          }
        ]
      },
      "r1b1k2rppppqppp2n2n24N31b1PP32N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n24N31b1PP32N5PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpppp1ppp5n23Pp31b1nP32N2N2PPP2PPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n23Pp31b2P32N2N2PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6d4",
            "san": "Nd4",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n24p31b1PP32N2N2PPP2PPPR1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 1
          }, {
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp2pp2n53N1p23pn35N2PPP1QPPPR1B1KB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n53N43pn35N2PPP1QPPPR1B1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n53N43pn35N2PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n23N43pP35N2PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n283pP32N2N2PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nd5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p33PP32N2N2PPP2PPPR1BQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 2
          }, {
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppp1ppp5n22b1N3B2nP32N5PPPP1PPPR1BQK2RwKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp5n22b1N3B2nP32N5PPPP1PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpppp1ppp5n21Bb1N33nP32N5PPPP1PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5a4",
            "san": "Ba4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n21Bb1N34P32N5PPPP1PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6d4",
            "san": "Nd4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n21Bb1p34P32N2N2PPPP1PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n21B2p34P32N2N2PPPP1PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p34P32N2N2PPPP1PPPR1BQKB1RwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 2
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }, {
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P32N2N2PPPP1PPPR1BQKB1RbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 6
          }
        ]
      },
      "r1bqk1nrpppp2pp2n52b1pp22B1P32P2N2PP1P1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rppp2ppp2n51B1pP31b1Pn35N2PP3PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rppp2ppp2n51BbpP33Pn35N2PP3PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5b4",
            "san": "Bb4+",
            "nr": 0
          }
        ]
      },
      "r1bqk2rppp2ppp2n51BbpP33pn32P2N2PP3PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rppp2ppp2n2n21BbpP33p42P2N2PP3PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rppp2ppp2n2n22bpP32Bp42P2N2PP3PPPRNBQK2RwKQkqd6": {
        "total": 1,
        "moves": [{
            "uci": "c4b5",
            "san": "Bb5",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1P32Bp42P2N2PP3PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b52BpP32P2N2PP3PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1p32BPP32P2N2PP3PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1p32B1P32P2N2PP1P1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p32B1P32P2N2PP1P1PPPRNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n2b72BpP32P2N2P4PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n5b72B1P32p2N2P4PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n5b72B1P32Pp1N2P4PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrp1pp1ppp2n5bp62BpP32P2N2P4PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rppppnppp2n5b72BpP32P2N2P4PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n5b72BpP32P2N2P4PPPRNBQ1RK1bkq-": {
        "total": 5,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 0
          }, {
            "uci": "d4d3",
            "san": "d3",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "g8e7",
            "san": "Nge7",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n5b72BpP32P2N2P4PPPRNBQK2RwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 5
          }
        ]
      },
      "r1bqk1nrppp2ppp2np4b3p32BPP32P2N2P4PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n2b3p32BPP32P2N2P4PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrp1pp1ppp2n5bp2p32BPP32P2N2P4PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n5b3p32BPP32P2N2P4PPPRNBQK2RbKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 5
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrppp2ppp1bnp44p32BPP32P2N2P4PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrppp2ppp2np4b3p32BPP32P2N2P4PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "a5b6",
            "san": "Bb6",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrppp2ppp2np4b3p32B1P32P2N2P2P1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n5b3p32B1P32P2N2P2P1PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n5b3p32B1P32P2N2P2P1PPPRNBQK2RwKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 8
          }, {
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppppbppp8n3p32BPP32P2N2P4PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrppppbppp2n54p32BPP32P2N2P4PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6a5",
            "san": "Na5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrppppbppp2n54p32B1P32P2N2P2P1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r2q2nrpppb1kpp1b1p4n73PP32N2N2P1Q2PPPR1B2RK1w--": {
        "total": 0,
        "moves": []
      },
      "r2q1knrpppb1Bpp1b1p4n73PP32N2N2P1Q2PPPR1B2RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "f8f7",
            "san": "Kxf7",
            "nr": 0
          }
        ]
      },
      "r2q1knrpppb1Bpp1b1p4n73PP31QN2N2P4PPPR1B2RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "b3c2",
            "san": "Qc2",
            "nr": 1
          }
        ]
      },
      "r2qk1nrpppb1Bpp1b1p4n73PP31QN2N2P4PPPR1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8f8",
            "san": "Kf8",
            "nr": 1
          }
        ]
      },
      "r2qk1nrpppb1ppp1b1p4n72BPP31QN2N2P4PPPR1B2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4f7",
            "san": "Bxf7+",
            "nr": 1
          }
        ]
      },
      "r2qk1nrpppb1ppp1bnp482BPP31QN2N2P4PPPR1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6a5",
            "san": "Na5",
            "nr": 1
          }
        ]
      },
      "r2qk1nrpppb1ppp1bnp48Q1BPP32N2N2P4PPPR1B2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "a4b3",
            "san": "Qb3",
            "nr": 1
          }
        ]
      },
      "r2qk1nrppp2ppp1bnp48Q1BPP1b12N2N2P4PPPR1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4d7",
            "san": "Bd7",
            "nr": 1
          }
        ]
      },
      "r2qk1nrppp2ppp1bnp482BPP1b12N2N2P4PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppp2ppp1bnp482BPP32N2N2P4PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rppp1nppp1b1p4n2P42B1P35N2PB3PPPRN1Q1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrppp2ppp1b1p4n2P42B1P35N2PB3PPPRN1Q1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrppp2ppp1b1p4n2P42B1P35N2P4PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppp2ppp1bnp43P42B1P35N2P4PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6a5",
            "san": "Na5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppp2ppp1bnp482BPP35N2P4PPPRNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppp2ppp2np42b52BPP35N2P4PPPRNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5b6",
            "san": "Bb6",
            "nr": 2
          }
        ]
      },
      "r1bqk1nrppp2ppp2np42b52BpP32P2N2P4PPPRNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "c3d4",
            "san": "cxd4",
            "nr": 2
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b52BpP32P2N2P4PPPRNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b52BpP32P2N2P4PPPRNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p32BPP32P2N2P4PPPRNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 2
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p32B1P32P2N2P2P1PPPRNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "r1bqk1nrpppp1ppp2nb44p32B1P32P2N2P2P1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n54p31bB1P32P2N2P2P1PPPRNBQK2RbKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "b4a5",
            "san": "Ba5",
            "nr": 9
          }, {
            "uci": "b4e7",
            "san": "Be7",
            "nr": 1
          }, {
            "uci": "b4c5",
            "san": "Bc5",
            "nr": 2
          }, {
            "uci": "b4d6",
            "san": "Bd6",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n54p31bB1P35N2P1PP1PPPRNBQK2RwKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 13
          }
        ]
      },
      "r1bqk1nrpppp1ppp1bn54p31PB1P35N2P1PP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrp1pp1ppp2n51pb1p31PB1P35N2P1PP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrppp2ppp2n52bpp31PB1P35N2P1PP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n52b1p31PB1P35N2P1PP1PPPRNBQK2RbKQkq-": {
        "total": 16,
        "moves": [{
            "uci": "c5b4",
            "san": "Bxb4",
            "nr": 13
          }, {
            "uci": "c5b6",
            "san": "Bb6",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp2pp2n52b1pp22B1P33P1N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n52b1p32B1P33P1N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p32B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 19,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 2
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 16
          }, {
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp2pp2n54pp22B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp84p32BnP35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppp2ppp2np1n24p32BPP35N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rppppbppp2n2n282BpP35N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n582Bpn35N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppp2ppp2np1n282BpP35N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n52b1P32Bp2n15N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n22b1P32Bp45N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g4",
            "san": "Ng4",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b52BpP35N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n282BpP35N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 4,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 0
          }, {
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 0
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n282BpP35N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p32BPP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }, {
            "uci": "e5d4",
            "san": "exd4",
            "nr": 4
          }
        ]
      },
      "r1bqkb1rppp2ppp5n23Pp1N11nB58PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppp2ppp2n2n23Pp1N12B58PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6b4",
            "san": "Nb4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rppp2ppp2n2n23pp1N12B1P38PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n54p1N12B1n38PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n2n24p1N12B1P38PPPP1PPPRNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p32B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 5
          }, {
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p32B1P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 28,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 19
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "c6d4",
            "san": "Nd4",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 7
          }
        ]
      },
      "r2qkbnrpppb1ppp2n53pp3Q3P32P2N2PP1P1PPPRNB1KB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2n53pp3Q3P32P2N2PP1P1PPPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8d7",
            "san": "Bd7",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp2ppp2n53pp34P32P2N2PP1P1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp2pp2n54pp24P32P2N2PP1P1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n52bPp34n32P2N2PP3PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n53Pp34n32P2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n54p33Pn32P2N2PP3PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p33PP32P2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p34P32P2N2PP1P1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P32P2N2PP1P1PPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n281bB1P32N2N2PP3PPPR1BQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n581bB1P32N2N2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n581b2P32N2N2PP3PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n584P32N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n584P32p2N2PP3PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp2ppp2n53p43pP32P2N2PP3PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n583pP32P2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r2qk1nrppp2ppp2np42b52BpP1b12P2N2PP3PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrppp2ppp2np42b52BpP32P2N2PP3PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrppp2ppp2np42b52BpP35N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b52BpP35N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b52BpP35N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n54P32Bp2n15N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n2n24P32Bp45N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g4",
            "san": "Ng4",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n581bBpP35N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n582BpP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "f8b4",
            "san": "Bb4+",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n583Nn32N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n2n283NP32N5PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n283NP38PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n583NP38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n583pP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 2
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 3
          }, {
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p33PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 6
          }
        ]
      },
      "r1bqk1nrppp2ppp2p5b3p34P32P2N2PP1P1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2B5b3p34P32P2N2PP1P1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7c6",
            "san": "dxc6",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n5bB2p34P32P2N2PP1P1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5c6",
            "san": "Bxc6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n51B2p31b2P32P2N2PP1P1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4a5",
            "san": "Ba5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n51B2p31b2P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n51B2p34n35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n2n21B2p34P35N2PPPP1PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n21B2p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n51B2p1p14P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r1pp2pppp1n2n23pp3B3P35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r1pppbpppp1n54P3B3n32p2N2PP3PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2r1pppbpppp1n54P3B2pn32P2N2PP3PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 0
          }
        ]
      },
      "r1bqk2r1pppbpppp1n54P3B2pn35N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r1bqk2r1pppbpppp1n2n24P3B2p45N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 1
          }
        ]
      },
      "r1bqk2r1pppbpppp1n2n28B2pP35N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r1pppbpppp1n2n24p3B2PP35N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqk2r1pppbpppp1n2n24p3B3P35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r1pp2pppp1n53pp3B3n35N2PPPP1PPPRNBQR1K1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r1ppp1pppp1n54p3B3n35N2PPPP1PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1r1ppp1pppp1n54p3B3n35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r1ppp1pppp1n2n24p3B3P35N2PPPP1PPPRNBQ1RK1bkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }, {
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }, {
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r1ppp1pppp1n2n24p3B3P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 3
          }
        ]
      },
      "r1bqkbnr1ppp1pppp1n54p3B3P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 3
          }
        ]
      },
      "r2qkbnr1pp2pp1p1p54p2p4P1b15N1PPPPP1PP1RNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkbnr1pp2pppp1p54p34P1b15N1PPPPP1PP1RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h5",
            "san": "h5",
            "nr": 0
          }
        ]
      },
      "r2qkbnr1pp2pppp1p54p34P1b15N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h3",
            "san": "h3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr1pp2pppp1p54p34P35N2PPPP1PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr1pp2pppp1p54p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr1ppp1pppp1B54p34P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7c6",
            "san": "dxc6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr1ppp1pppp1n51B2p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "b5a4",
            "san": "Ba4",
            "nr": 3
          }, {
            "uci": "b5c6",
            "san": "Bxc6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp2pp2n51Bb1pp24P32P2N2PP1P1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrppp2ppp2n51Bbpp34P32P2N2PP1P1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n51Bb1p34P32P2N2PP1P1PPPRNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n51Bb1p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1ppp1npbp2n3p11B1p43NP32N1B3PPPQ1PPPR3K2RwKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1ppppnpbp2n3p11B63NP32N1B3PPPQ1PPPR3K2RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1ppppnpbp2n3p11B63NP32N1B3PPP2PPPR2QK2RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d1d2",
            "san": "Qd2",
            "nr": 1
          }
        ]
      },
      "r1bqk2rppppnpbp2n3p11B63NP32N1B3PPP2PPPR2QK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqk2rppppnpbp2n3p11B63NP32N5PPP2PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppppnp1p2n3p11B63NP32N5PPP2PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppppnp1p2n3p11B63NP38PPP2PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppppnppp2n51B63NP38PPP2PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppppnppp2n51B63pP35N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppppnppp2n51B2p33PP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppppnppp2n51B2p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrp1pp1ppp1pn51B2p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2n51B1pp34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp3p2n3p11B2pp24P32P2N2PP1P1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1p1p2n3p11B2p34P32P2N2PP1P1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n3p11B2p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n51B2p34P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }, {
            "uci": "a7a6",
            "san": "a6",
            "nr": 4
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 2
          }, {
            "uci": "g8e7",
            "san": "Nge7",
            "nr": 1
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 56,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 6
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 28
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 3
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 6
          }, {
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 13
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1N34P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp82b1N34P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b1p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppp1q1pp5p23p44P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppppq1pp5p284P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrppppq1pp5p24N34P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp5p24N34P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp5p24p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppppq1pp84pp22B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppppqppp84p32B1P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrppppqppp84p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp2p54p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1Nppp1q1pp5n23p42B1p38PPPP1PPPRNBQK2RwKQq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1Nppppq1pp5n282B1p38PPPP1PPPRNBQK2RbKQq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnb1kb1rppppqNpp5n282B1p38PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7h8",
            "san": "Nxh8",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1Npp5n282B1p38PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp2pp5n24N32B1p38PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f7",
            "san": "Nf7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp2pp5n24Np22B1P38PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp2pp5n24Np24P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp2pp2n54Np24P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppppq1pp84Np24P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp84Np24P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp2pp5n24pp22B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp2pp84N32BPp38PPP2PqPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp2pp84N1q12BPp38PPP2PPPRNBQK2RbKQkqd3": {
        "total": 1,
        "moves": [{
            "uci": "g5g2",
            "san": "Qxg2",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrpppp2pp84N1q12B1p38PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp3pp83pN32B1p38PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp84N32B1p38PPPP1PPPRNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d8g5",
            "san": "Qg5",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp84p32B1p35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrp1pp2pp81p2pp22B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp84pp22B1P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 2
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp24P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 3
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 4
          }
        ]
      },
      "r2qkbnrpppn1ppp3p44P34P1b15N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrppp2ppp3p44P34P1b15N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nd7",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrppp2ppp3p44p33PP1b15N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp3pp3p44pp23PP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpppb1ppp3p44p33PP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp3p44p33PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "c8d7",
            "san": "Bd7",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp3pp3p44pp22B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp3p44p32B1P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp3p44p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rn1q1rk1pp3ppp2pb43p42PPn1b13B1N2PP3PPPRNBQR1K1w--": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1pp3ppp2pb43p42PPn33B1N2PP3PPPRNBQR1K1b--": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1pp3ppp2pb43p42PPn33B1N2PP3PPPRNBQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp2ppp3b43p42PPn33B1N2PP3PPPRNBQ1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp2ppp3b43p43Pn33B1N2PPP2PPPRNBQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2ppp3b43p43Pn33B1N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2ppp3b43p43Pn33B1N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp83p43Pn33B1N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8d6",
            "san": "Bd6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp83p43Pn35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp3p483Pn35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d6d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp3p484n35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp3p1n284P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp3p1n24N34P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rppppqppp84N34n38PPPPQPPPRNB1KB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp84N34n38PPPPQPPPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp84N34n38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24N34P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n24N34P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }, {
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p34P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 77,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 3
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 56
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }, {
            "uci": "f7f6",
            "san": "f6",
            "nr": 1
          }, {
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 1
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 7
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 4
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp32P1P38PP1P1PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84p32P1P38PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp24P33P4PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rpppp1ppp5n22b1p34PP23P4PPP3PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n24p34PP23P4PPP3PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p34P33P4PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2n54p383P4PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp2P54p383P4PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nxc6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp2p53Pp383P4PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c6",
            "san": "dxc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83Pp383P4PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp34P33P4PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p34P33P4PPP2PPPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp24P32P5PP1P1PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp3b43pp2Q4P32P5PP1P1PPPRNB1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83pp2Q4P32P5PP1P1PPPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8d6",
            "san": "Bd6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp34P32P5PP1P1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1h5",
            "san": "Qh5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p34P32P5PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p2Q4P38PPPP1PPPRNB1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppp4p2n2ppn3pp32B1P33P1Q2PPP1NPPPRNB1K2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp3p2n2ppn4p32B1P33P1Q2PPP1NPPPRNB1K2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp3p2n2ppn4p32B1P33P1Q2PPP2PPPRNB1K1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1e2",
            "san": "Ne2",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1p1p2n3pn4p32B1P33P1Q2PPP2PPPRNB1K1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f6",
            "san": "f6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1p1p2n3pn4p2Q2B1P33P4PPP2PPPRNB1K1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h5f3",
            "san": "Qf3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n4n4p2Q2B1P33P4PPP2PPPRNB1K1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n4n4p2Q2B1P38PPPP1PPPRNB1K1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p2Q2B1P38PPPP1PPPRNB1K1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8h6",
            "san": "Nh6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p2Q4P38PPPP1PPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p2Q4P38PPPP1PPPRNB1KBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp5n22b53nP35N2PP2QPPPRNB1KB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n22b53PP35N2PP2QPPPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6d4",
            "san": "Nxd4",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b53pP32P2N2PP2QPPPRNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1p33PP32P2N2PP2QPPPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1p34P32P2N2PP1PQPPPRNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p34P32P2N2PP1PQPPPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p34P32P5PP1PQPPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P32P5PP1PQPPPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P38PPPPQPPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p34P38PPPPQPPPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp4ppp2p53n42B2p25N2PPPP2PPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp4ppp2p2n282B2p25N2PPPP2PPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d5",
            "san": "Nd5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rp4ppp2p2n21B65p25N2PPPP2PPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp2P2n21B65p25N2PPPP2PPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7c6",
            "san": "bxc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp2p2n21B1P45p25N2PPPP2PPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c6",
            "san": "dxc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp5n21B1P45p25N2PPPP2PPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23P45p25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83P45p25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83p44Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1pp17p84Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1p1p2n56p12B1Pp25N2PPPP2PPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb2bnrpppp1k1p5q284P32N1pQ2PPP3PPR4RK1w--": {
        "total": 0,
        "moves": []
      },
      "rnb2bnrpppp1k1p5q284Pp22N1BQ2PPP3PPR4RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "f4e3",
            "san": "fxe3",
            "nr": 0
          }
        ]
      },
      "rnb2bnrpppp1k1p5q284Pp24BQ2PPP3PPRN3RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnb2bnrpppp1k1p883qPp24BQ2PPP3PPRN3RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "d4f6",
            "san": "Qf6",
            "nr": 1
          }
        ]
      },
      "rnb2bnrpppp1k1p883qPp25Q2PPP3PPRNB2RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 1
          }
        ]
      },
      "rnb2bnrpppp1k1p5q283PPp25Q2PPP3PPRNB2RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "f6d4",
            "san": "Qxd4+",
            "nr": 1
          }
        ]
      },
      "rnb2bnrpppp1k1p5q284Pp25Q2PPPP2PPRNB2RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1B1p5q284Pp25Q2PPPP2PPRNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8f7",
            "san": "Kxf7",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1p1p5q282B1Pp25Q2PPPP2PPRNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4f7",
            "san": "Bxf7+",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppppqp1p882B1Pp25Q2PPPP2PPRNB2RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p882B1Pp25Q2PPPP2PPRNB2RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 1
          }, {
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1p1p882B1Pp25p2PPPP2PPRNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "d1f3",
            "san": "Qxf3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp2p1p83p42B1Ppp15N2PPPP2PPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p882B1Ppp15N2PPPP2PPRNBQ1RK1bkq-": {
        "total": 3,
        "moves": [{
            "uci": "g4f3",
            "san": "gxf3",
            "nr": 2
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrpppp1p1p84N32B1P1pq5p2PPPP2PPRNBQ1K1Rwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1rpppp1p1p5n24N32B1Pppq8PPPP2PPRNBQ1K1Rwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1rpppp1p1p7n4N32B1Pppq8PPPP2PPRNBQ1K1Rwkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpppp1p1p2n54N32B1Pppq8PPPP2PPRNBQ1K1Rwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1p1p84N32B1Pppq8PPPP2PPRNBQ1K1Rbkq-": {
        "total": 4,
        "moves": [{
            "uci": "f4f3",
            "san": "f3",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "g8h6",
            "san": "Nh6",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrpppp1p1p84N32B1Pppq8PPPP2PPRNBQK2RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e1f1",
            "san": "Kf1",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrpppp1p1p84N32B1Ppp18PPPP2PPRNBQK2RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrpppp1p1p882B1Ppp15N2PPPP2PPRNBQK2RwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 3
          }, {
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 4
          }
        ]
      },
      "rnbqk1nrppp2pb13p3p6p12BPPp1P5N2PPP3P1RNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1pb17p6p12BPPp1P5N2PPP3P1RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1pb17p6p12B1Pp1P5N2PPPP2P1RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1pbp86p12B1Pp1P5N2PPPP2P1RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1pbp86p12B1Pp25N2PPPP2PPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp2p23p46p12B1Ppp15N2PPPP2P1RNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrppp2p23p46pp2B1PpP15N2PPPP2P1RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "h5g4",
            "san": "hxg4",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrppp2p23p46pp2B1Ppb15N1PPPPP2P1RNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "h3g4",
            "san": "hxg4",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp2p1p3p46p12B1Ppb15N1PPPPP2P1RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h5",
            "san": "h5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp2p1p3p46p12B1Ppb15N2PPPP2PPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h3",
            "san": "h3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2p1p3p46p12B1Pp25N2PPPP2PPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2p1p3p46p12B1Pp25N2PPPP2PPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1p1p86p12B1Pp25N2PPPP2PPRNBQK2RbKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "g5g4",
            "san": "g4",
            "nr": 7
          }, {
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2p1p3b43PN32BP1npP8PPP3P1RN1QK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp2p1p3b43PN2n2BP1BpP8PPP3P1RN1QK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h5f4",
            "san": "Nxf4",
            "nr": 0
          }
        ]
      },
      "rnbqk2rppp2p1p3b43PN2n2BP1ppP8PPP3P1RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1f4",
            "san": "Bxf4",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2p1p3b1n23PN32BP1ppP8PPP3P1RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6h5",
            "san": "Nh5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2p1p5n23Pb32B2ppP8PPPP2P1RNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp2p1p3b1n23PN32B2ppP8PPPP2P1RNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d6e5",
            "san": "Bxe5",
            "nr": 0
          }
        ]
      },
      "rnbqk2rppp2p1p3b1n23PN32B2ppP8PPPP2P1RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }, {
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2pbp5n23PN32B2ppP8PPPP2P1RNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2p1p5n23PN32B2ppP8PPPP2P1RNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f8d6",
            "san": "Bd6",
            "nr": 2
          }, {
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp2p1p5n23pN32B1PppP8PPPP2P1RNBQK2RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rpppp1p1p5n24N32B1PppP8PPPP2P1RNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rpppp1p1p5n24N34PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrppp2p1p83pN34PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2p1p3p44N34PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p284N2p4PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1p1p2n54N34PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1pbp84N34PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppppqp1p84N34PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p84N34PppP8PPPP2P1RNBQKB1RbKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 3
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }, {
            "uci": "h7h5",
            "san": "h5",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 0
          }, {
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1p1p884PppP5N2PPPP2P1RNBQKB1RwKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 9
          }
        ]
      },
      "rnbqkbnrpppp1p1p86p14Pp1P5N2PPPP2P1RNBQKB1RbKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 9
          }
        ]
      },
      "rnbqkbnrpppp1p1p86p14Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 19,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 10
          }, {
            "uci": "h2h4",
            "san": "h4",
            "nr": 9
          }
        ]
      },
      "rnbqkb1rppppnppp884Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppppbppp5n282B1Pp25N2PPPP2PPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppppbppp882B1Pp25N2PPPP2PPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppppbppp884Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp3p484Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp85p24Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n584Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n284Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 27,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "h7h6",
            "san": "h6",
            "nr": 0
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 19
          }, {
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 0
          }, {
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1p1p86p12B1Pp28PPPP2PPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n23B44Pp28PPPP2PPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83B44Pp28PPPP2PPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83p42B1Pp28PPPP2PPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "Bxd5",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrpppp1ppp2n582B1Pp1q8PPPP2PPRNBQ1KNRwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrp1pp1ppp81p62B1Pp1q8PPPP2PPRNBQ1KNRwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp2ppp3p482B1Pp1q8PPPP2PPRNBQ1KNRwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1rpppp1ppp5n282B1Pp1q8PPPP2PPRNBQ1KNRwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k1nrpppp1ppp82b52B1Pp1q8PPPP2PPRNBQ1KNRwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1p1p86p12B1Pp1q8PPPP2PPRNBQ1KNRwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1ppp5q282B1Pp28PPPP2PPRNBQ1KNRwkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1ppp882B1Pp1q8PPPP2PPRNBQ1KNRbkq-": {
        "total": 7,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }, {
            "uci": "h4f6",
            "san": "Qf6",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrpppp1ppp882B1Pp1q8PPPP2PPRNBQK1NRwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "e1f1",
            "san": "Kf1",
            "nr": 7
          }
        ]
      },
      "rnbqkb1rpp1p1ppp2p2n282B1Pp22N5PPPP2PPR1BQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n282B1Pp22N5PPPP2PPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n282B1Pp28PPPP2PPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp85p22B1Pp28PPPP2PPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp1pp1ppp81p62B1Pp28PPPP2PPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1ppp2p582B1Pp28PPPP2PPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n582B1Pp28PPPP2PPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp882B1Pp28PPPP2PPRNBQK1NRbKQkq-": {
        "total": 14,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 7
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp3pp3p45P25p28PPPPB1PPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp85P25p28PPPPB1PPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp85p24Pp28PPPPB1PPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp884Pp28PPPPB1PPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp884Pp28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 42,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 27
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 14
          }, {
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp3pp3p42b1pp24PP22P2N2PP1P2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp3p42b1p34PP22P2N2PP1P2PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp2ppp3p42b1p34PP25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1p1p82b1p1p14PP25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp82b1p34PP25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b1p34PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrpppp1p22n4p4p1P14P35N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1p1p2n54p1P14P35N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n54p1p14PP25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f4g5",
            "san": "fxg5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp2pp2n54pp24PP25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n54p34PP25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }
        ]
      },
      "rnb1kbnrppppqppp84p34PP26P1PPPP3PRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1ppp84p34PP1q6P1PPPP3PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h4e7",
            "san": "Qe7",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrpppp1ppp84p34PP1q8PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp82p1p34PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1ppp5q24p34PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n24p34PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp2pp2n2p24P34P38PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp5p24P34P38PPPP2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp5p24p34PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f4e5",
            "san": "fxe5",
            "nr": 1
          }
        ]
      },
      "rn1qk2rppp2ppp82bP1b24nP25N2PPP1Q1PPRNB1KB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp2ppp82bP44nP25N2PPP1Q1PPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 0
          }
        ]
      },
      "rnbqk2rppp2ppp82bP44nP25N2PPP3PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp83P44nP25N2PPP3PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp83P44nP28PPP3PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23P44PP28PPP3PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2ppp5n23P41b3P22NPp3PPPB2PPR2QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp2ppp5n23P41b2pP22NP4PPPB2PPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e3",
            "san": "e3",
            "nr": 0
          }
        ]
      },
      "rnbqk2rppp2ppp5n23P41b2pP22NP4PPP3PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23P44pP22NP4PPP3PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23P44pP23P4PPP3PPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d3e4",
            "san": "dxe4",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83P44pP23P4PPP3PPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp2ppp83P44pP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 2
          }
        ]
      },
      "rnbqk1nrppp2ppp82bPp35P28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83P45p28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpp3ppp2P52b1p35P28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp2P54p35P28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp2p53Pp35P28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c6",
            "san": "dxc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83Pp35P28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 2
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }, {
            "uci": "e5f4",
            "san": "exf4",
            "nr": 0
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp34PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 5
          }
        ]
      },
      "rnb1kbnrpppp2pp84pP25P1q8PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp2pp82b1pP25P28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbq1bnrppppk1pp85P1Q5p28PPPP2PPRNB1KBNRwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp85P1Q5p28PPPP2PPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8e7",
            "san": "Ke7",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp85P25p28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1h5",
            "san": "Qh5+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp84pP25P28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 0
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }, {
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp24PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpppp1p1p84p1p14PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84p34PP28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 60,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 42
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 2
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 2
          }, {
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 1
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }, {
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "f7f6",
            "san": "f6",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 5
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 3
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp2p2n23Pp382N3P1PPPP1P1PR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n23Pp382N3P1PPPP1P1PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23pp34P32N3P1PPPP1P1PR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p34P32N3P1PPPP1P1PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rp1pp1ppp5n21pb1p32B1P32N5PPPPNPPPR1BQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rpppp1ppp5n22b1p32B1P32N5PPPPNPPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqk2rpppp1ppp5n22b1p32B1P32N5PPPP1PPPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1e2",
            "san": "Nge2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp3pp83pPp24n32N2Q2PPPP2PPR1B1KBNRwKQkqf6": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp83pP34n32N2Q2PPPP2PPR1B1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "rnbqk2rppp1bppp83pP34n32N2N2PPPP2PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp83pP34n32N2N2PPPP2PPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp2ppp83pP34n32N5PPPP2PPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d1f3",
            "san": "Qf3",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23pP34P32N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23pp34PP22N5PPPP2PPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f4e5",
            "san": "fxe5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p34PP22N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p34P32N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }, {
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 2
          }
        ]
      },
      "r1bqk1nrpppp1pp12n52b1p34P2p2N2NP1PPPP1PBPR1BQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1pp12n52b1p2p4P32N2NP1PPPP1PBPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h5h4",
            "san": "h4",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1pp12n52b1p2p4P32N3P1PPPP1PBPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p34P32N3P1PPPP1PBPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h5",
            "san": "h5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p34P32N3P1PPPP1P1PR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 1
          }
        ]
      },
      "r1bqk2rppp2ppp2n2n22bpp34P32N3P1PPPPNPBPR1BQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n22b1p34P32N3P1PPPPNPBPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1p34P32N3P1PPPP1PBPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1e2",
            "san": "Nge2",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p34P32N3P1PPPP1PBPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p34P32N3P1PPPP1P1PR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P32N3P1PPPP1P1PR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp2pp2n54pp23PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n54p33PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrppppbppp2n584Pp22N2N2PPPP2PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1p1p2n582B1Pp22N2p2PPPP2PPR1BQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1p1p2n582B1Ppp12N2N2PPPP2PPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4f3",
            "san": "gxf3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n582B1Ppp12N2N2PPPP2PPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n56p12B1Pp22N2N2PPPP2PPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n56p14Pp22N2N2PPPP2PPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n584Pp22N2N2PPPP2PPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 0
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrp1pp1ppp1pn583PPp1q2N5PPP1K1PPR1BQ1BNRwkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrppp2ppp2np483PPp1q2N5PPP1K1PPR1BQ1BNRwkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpppp1p1p2n56p13PPp1q2N5PPP1K1PPR1BQ1BNRwkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrppp2ppp2n53p43PPp1q2N5PPP1K1PPR1BQ1BNRwkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpppp1ppp2n583PPp1q2N5PPP1K1PPR1BQ1BNRbkq-": {
        "total": 4,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 0
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1b1kbnrpppp1ppp2n583PPp1q2N5PPP3PPR1BQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e1e2",
            "san": "Ke2",
            "nr": 4
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n583PPp22N5PPP3PPR1BQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 4
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n584Pp22N5PPPP2PPR1BQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 4
          }
        ]
      },
      "r1bqk1nrppp2ppp2np42b1P34P32N5PPPP2PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n52b1P34P32N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p34PP22N5PPPP2PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f4e5",
            "san": "fxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34PP22N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 6
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P32N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 2
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 7
          }
        ]
      },
      "rnbqk2rpppp1ppp5n24p31b2P1Q12N5PPPP1PPPR1B1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp84p31b2P1Q12N5PPPP1PPPR1B1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1ppp84p31b2P32N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1g4",
            "san": "Qg4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p34P32N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 15,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 4
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 10
          }, {
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p34P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 176,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 7
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 8
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 77
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }, {
            "uci": "d2d3",
            "san": "d3",
            "nr": 3
          }, {
            "uci": "c2c3",
            "san": "c3",
            "nr": 2
          }, {
            "uci": "d1h5",
            "san": "Qh5",
            "nr": 2
          }, {
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 60
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 15
          }
        ]
      },
      "rnbqk1nrppppppbp86p13PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp2p1p1p1p2p32P3p14P32P5PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1p1p4p32P3p14P32P5PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1p1p1p4p32p3p13PP32P5PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1p1p4p36p13PP32P5PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1p1p4p36p13PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppp27p83PP1pP8PPP2PP1RNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppppp27p6p13PP2P8PPP2PP1RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppppp27p6p13PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1p1p84p1p13PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppppp1p86p13PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 0
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }, {
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppppp1p86p14P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 4
          }
        ]
      },
      "rnbqk2rpp2ppbp5np13P43P42N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pp1p5np13P43P42N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp2pp1p5np13p42PP42N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp5n23p42PP42N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp5n23p42PP48PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp83p42PP48PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp83p43P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53P43P48PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p43PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp2p583PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp2p584P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1pp17p4p33PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppppp17p83PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppppp17p84P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnb1k2rpppn1ppp4p33pP1q13P42N5PPP2PP1R2QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rpppn1ppp4p33pP1P13P42N5PPP2PP1R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8g5",
            "san": "Qxg5",
            "nr": 0
          }
        ]
      },
      "rnbqk2rpppn1ppp4p33pP1b13P3P2N5PPP2PP1R2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h4g5",
            "san": "hxg5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppnbppp4p33pP1B13P3P2N5PPP2PP1R2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7g5",
            "san": "Bxg5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppnbppp4p33pP1B13P42N5PPP2PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23pP1B13P42N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d7",
            "san": "Nfd7",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23p2B13PP32N5PPP2PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn23p2B13PP32N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn23p43PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp84p33PN38PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p383PN38PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp4p383Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppp2ppp2n1p383Pp3P1N51PP2PPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp4p383Pp3P1N51PP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp2ppp4p383Pp3P1b51PP1NPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2ppp4p381b1Pp3P1N51PP1NPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4c3",
            "san": "Bxc3+",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2ppp4p381b1Pp32N5PPP1NPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2ppp4p33p41b1PP32N5PPP1NPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnb1k1nrppp2ppp4p381b1qp1Q12N5PPPB1PPPR3KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp4p381b1Pp1Q12N5PPPB1PPPR3KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d4",
            "san": "Qxd4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp2ppp4p381b1Pp32N5PPPB1PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1g4",
            "san": "Qg4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2ppp4p33p41b1PP32N5PPPB1PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2ppp4p33p41b1PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1e2",
            "san": "Ne2",
            "nr": 1
          }, {
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p43PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }, {
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp2ppp4p382PPp38PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p33p42PPP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83p43PPp28PPP1Q1PPRNB1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83pp33PPP28PPP1Q1PPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp33PP38PPP1QPPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p43PP38PPP1QPPPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22pP43P48PPPN1PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp4p32pP43P48PPPN1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32pp43PP38PPPN1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p43PP38PPPN1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p43PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 4
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }, {
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }, {
            "uci": "b1d2",
            "san": "Nd2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pp1ppp4p31p63PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp2pp4pn25P23P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp4p35P23P48PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp4p35p23PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p383PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 7
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp4p35p24P33P4PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp4p384P33P4PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp4p35p24P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp4p384P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp4p384pP25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p33p44PP25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p44PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p384PP28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p384P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 12,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 9
          }, {
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp1n1ppp2p2n23p42BQPP22N2N2PPP3PPR1B1K2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpp1n1ppp2pp1n282BQPP22N2N2PPP3PPR1B1K2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d6d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpp1n1ppp2pp1n283QPP22N2N2PPP3PPR1B1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppn1ppp3p1n283QPP22N2N2PPP3PPR1B1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppn1ppp3p1n283pPP22N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d4",
            "san": "Qxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppn1ppp3p1n24p33PPP22N2N2PPP3PPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppn1ppp3p1n24p33PPP22N5PPP3PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppnpppp3p1n283PPP22N5PPP3PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppnpppp3p1n283PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p1n283PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p1n283PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp3p483PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23P45P28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83P45P28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp83p44PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp3p484PP28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d6d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp3p484P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrp1ppppbp6p11p62BPP38PPP2PPPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppppppbp6p182BPP38PPP2PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp1ppbp6p13p43PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k1nrpp2ppbp2pp2p16B13PP32N2N2PqPQ1PPPR3KB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k1nrpp2ppbp1qpp2p16B13PP32N2N2PPPQ1PPPR3KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b6b2",
            "san": "Qxb2",
            "nr": 0
          }
        ]
      },
      "rnb1k1nrpp2ppbp1qpp2p16B13PP32N2N2PPP2PPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d2",
            "san": "Qd2",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpp2ppbp2pp2p16B13PP32N2N2PPP2PPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8b6",
            "san": "Qb6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpp2ppbp2pp2p183PP32N2N2PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp1ppbp3p2p183PP32N2N2PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp1ppbp3p2p183PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppppppbp6p183PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnb1k1nrpp2ppbp3p2p1q1P52P1P32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpp2ppbp3p2p12P52P1P32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpp2ppbp3p2p12p52PPP32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpp1pppbp6p12p52PPP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpp1pppbp6p12p52PPP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppppppbp6p182PPP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppppppbp6p183PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp2p6p15p23PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1ppppp2p6pb5P23P42N5PPP2PPPR2QKBNRwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppppp2p6pb5P23P42N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "rnbqk2rppppp2p6pb5p23PP32N5PPP2PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppppp2p6pB5p23PP32N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8h6",
            "san": "Bxh6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppppp2p6pn5p23PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1h6",
            "san": "Bxh6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppp1p6pn83PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppp1p6pn83PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pp1p3p2p14P2n3P48PPP1BPPPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppp1p6p14P2n3P48PPP1BPPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppppp1p6p14P2n3P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppp1p5np14P33P48PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6h5",
            "san": "Nh5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppp1p5np183PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppp1p6p183PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 4
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "g8h6",
            "san": "Nh6",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppp1p6p184P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 7
          }
        ]
      },
      "r1bqkb1rpppp2pp2n1pn25P23P45N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp2pp2n1p35P23P45N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp2pp2n1p35p23PP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n1p383PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp2pp2n1pn25P23P42N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp2pp2n1p35P23P42N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp2pp2n1p35p23PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n1p383PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n1p383PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1P34P38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2np44P34P38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp2pp2n2p24P34P38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpppp1ppp2n54P34P2q8PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n54P34P38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }, {
            "uci": "f7f6",
            "san": "f6",
            "nr": 0
          }, {
            "uci": "d8h4",
            "san": "Qh4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p33PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 4
          }
        ]
      },
      "r1bqkbnrppp1pppp83P41n1P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pppp2n53P43P48PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6b4",
            "san": "Nb4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr1pp1ppppp1n53p43PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pp1p2n3p13p43PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2n53pp33PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pppp83Pn34p32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pppp2n53P44p32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp1pppp2n583Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p43PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 0
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 0
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }, {
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p43PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 4
          }
        ]
      },
      "r1bqkbnrpppppppp2n583PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 11,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 2
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 4
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 5
          }
        ]
      },
      "r1bqkbnrpppppppp2n584P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 11,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 11
          }
        ]
      },
      "r1bqkbnrp2ppppp1pn52P54P38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp2ppppp1p62P54P38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrp2ppppp1p62p53PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrp1ppp2p1p4p15P1Q3P43B4PPP2PbPRNB1K1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrp1ppp1pp1p65P1Q3P43B4PPP2PbPRNB1K1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrp1ppp1pp1p65P23P43B4PPP2PbPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1h5",
            "san": "Qh5+",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbppp1pp1p65P23P43B4PPP2PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7g2",
            "san": "Bxg2",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbppp1pp1p65p23PP33B4PPP2PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpppppp1p683PP33B4PPP2PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpp1ppp1p64p33PP35P2PPP3PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpbpppppp1p683PP35P2PPP3PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrpbpppppp1p683PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }, {
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pppppp1p683PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrp1pppppp1p684P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }
        ]
      },
      "r1bqkbnrpp2pppp2n5888PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp2P54p388PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2P5888PPPP1PPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b8c6",
            "san": "Nxc6",
            "nr": 0
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53P488PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5c6",
            "san": "dxc6",
            "nr": 2
          }
        ]
      },
      "rn1qkbnrppp2ppp4b3888PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4P3888PPPP1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8e6",
            "san": "Bxe6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83Pp388PPPP1PPPRNBQKBNRwKQkqe6": {
        "total": 1,
        "moves": [{
            "uci": "d5e6",
            "san": "dxe6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn23P42P58PP1P1PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n23P42P58PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp2P2n24p33P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp2P2n283P48PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n23P43P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c6",
            "san": "dxc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp1p1pp1p5np11p1P42PP48PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pp1p5np13P42PP48PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pp1p5np13P43P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "r2qkb1rpppnpppp5n21B1P1b23P45P2PPP3PPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp5n21B1P1b23P45P2PPP3PPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 0
          }
        ]
      },
      "rn1qkb1rppp1pppp5n23P1b23P45P2PPP3PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5+",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rppp1pppp5n23P43P2b15P2PPP3PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rppp1pppp5n23P43P2b18PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23P43P48PPP2PPPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }, {
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23P488PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrppp1pppp83P488PPPP1PPPRNBQKBNRbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 2
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrppp1pppp83p44P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 7
          }
        ]
      },
      "rnbqkbnr2pp1pppp3p31p62PPP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4b5",
            "san": "cxb5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1ppp1pppp3p382PPP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr1ppp1pppp3p383PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1ppp1pppp74p33PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1pppppppp783PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr1pppppppp784P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppppppp884P38PPPP1PPPRNBQKBNRbKQkq-": {
        "total": 255,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 27
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 176
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 4
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }, {
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 12
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 7
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 11
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 3
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 7
          }, {
            "uci": "a7a6",
            "san": "a6",
            "nr": 2
          }
        ]
      },
      "rnbqkb1r3pppppp4n21PpP488PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2ppppp5n21PpP488PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rp2ppppp5n21ppP42P58PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4b5",
            "san": "cxb5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1ppppp5n22pP42P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1ppppp5n22p52PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp5pp4pn21Ppp485N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2p2pp4pn21Pp585N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rp2p2pp4pn21pp52P55N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4b5",
            "san": "cxb5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp2p1ppp4Pn21pp52P55N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7e6",
            "san": "fxe6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp2p1pp15n1p1ppP2B185N2PP2PPPPRN1QKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2p1ppp5n21ppP2B185N2PP2PPPPRN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rp2p1ppp5n21ppp2B12P55N2PP2PPPPRN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp2p1ppp4pn21ppP2B12P55N2PP2PPPPRN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp2p1ppp4pn21ppP42P55N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5e6",
            "san": "dxe6",
            "nr": 1
          }, {
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1p1ppp4pn22pP42P55N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpp1p1ppp4pn22p52PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn282PP45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32PP46P1PP2PP1PRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp4pn282PP46P1PP2PP1PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnb1k2rppp2ppp5n24pq21b1P42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k2rppp2ppp4pn25q21b1P42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnb1k2rppp2ppp4pn25q21b1P42N2N2PPQ1PPPPR1B1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2d1",
            "san": "Qd1",
            "nr": 1
          }
        ]
      },
      "rnb1k2rppp2ppp4pn23q41b1P42N2N2PPQ1PPPPR1B1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5f5",
            "san": "Qf5",
            "nr": 1
          }
        ]
      },
      "rnb1k2rppp2ppp4pn23q41b1P42N5PPQ1PPPPR1B1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2ppp4pn23P41b1P42N5PPQ1PPPPR1B1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2ppp4pn23p41bPP42N5PPQ1PPPPR1B1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1pp1p1ppp4pn22P51bP52N5PPQ1PPPPR1B1KBNRwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rpp1p1ppp4pn22P51bP52N5PPQ1PPPPR1B1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "rnbqk2rpp1p1ppp4pn22p51bPP42N5PPQ1PPPPR1B1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1p1pp1ppp4pn21p62PP4P1Q51P2PPPPR1B1KBNRwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1pppp1ppp4pn282PP4P1Q51P2PPPPR1B1KBNRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1pppp1ppp4pn282PP4P1b51PQ1PPPPR1B1KBNRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "Qxc3",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1pppp1ppp4pn281bPP4P1N51PQ1PPPPR1B1KBNRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "b4c3",
            "san": "Bxc3+",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1pppp1ppp4pn281bPP42N5PPQ1PPPPR1B1KBNRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppp1ppp4pn281bPP42N5PPQ1PPPPR1B1KBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2rp2p1pp14pn1p1ppP41bP4B2N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rpp1p1pp14pn1p2pP41bP4B2N5PP2PPPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqk2rpp1p1pp14pn1p2p51bPP3B2N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppp1pp14pn1p81bPP3B2N5PP2PPPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppp1pp14pn1p6B11bPP42N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5h4",
            "san": "Bh4",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppp1ppp4pn26B11bPP42N5PP2PPPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpp1p1ppp2n1pn22P51bP51QN5PP2PPPPR1B1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rpp1p1ppp4pn22P51bP51QN5PP2PPPPR1B1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqk2rpp1p1ppp4pn22p51bPP41QN5PP2PPPPR1B1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppp1ppp4pn281bPP41QN5PP2PPPPR1B1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rp2p1ppp4pn21ppP41bP52N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rpp1p1ppp4pn22pP41bP52N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqk2rpp1p1ppp4pn22p51bPP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppp1ppp4pn281bPP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppp1ppp4pn281bPP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 3
          }, {
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }, {
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn282PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 6
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn282PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 6
          }
        ]
      },
      "rn1q1rk1pp2ppbp4bnp12Pp42P2B22N1P3PP3PPP2RQKBNRwK-": {
        "total": 0,
        "moves": []
      },
      "rnb2rk1pp2ppbp5np1q1Pp42P2B22N1P3PP3PPP2RQKBNRwK-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1pp2ppbp5np12Pp42P2B22N1P3PP3PPP2RQKBNRbK-": {
        "total": 2,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 0
          }, {
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1pp2ppbp5np12pp42PP1B22N1P3PP3PPP2RQKBNRwK-": {
        "total": 2,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1ppp1ppbp5np13p42PP1B22N1P3PP3PPP2RQKBNRbK-": {
        "total": 2,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1ppp1ppbp5np13p42PP1B22N1P3PP3PPPR2QKBNRwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 2
          }
        ]
      },
      "rnbqk2rppp1ppbp5np13p42PP1B22N1P3PP3PPPR2QKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "rnbqk2rppp1ppbp5np13p42PP1B22N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rppp1pp1p5np13p42PP1B22N5PP2PPPPR2QKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rppp1pp1p5np13p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppppp1p5np182PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1p1p5np14p32PP45P2PP2P1PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppp1p5np182PP45P2PP2P1PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rp1pppp1p5np11p1P42P58PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppp1p5np13P42P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppppp1p5np182PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }, {
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }, {
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppp1p5n26p12PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp1pppppp5n21p62PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2ppppp2p2n21p62PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp1ppppp2p2n282PP45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp1ppppp2p2n282PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n282PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 17,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 9
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 4
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp883P2n18PPP1PP1PRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n24p33P2P18PPP1PP1PRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp5n283P2P18PPP1PP1PRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6g4",
            "san": "Nxg4",
            "nr": 0
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p33P48PPPNPPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp5n283P48PPPNPPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p33P42N5PPP1PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp83p43Pn32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n23p43PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p43P42N5PPP1PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n283P42N5PPP1PPPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp1pp1ppp1p3n24p33P42P2N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp1pppppp1p3n283P42P2N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rp1pppppp1p3n283P45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n283P45N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp84p1P13P48PPP1PPP1RN1QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp86P13P48PPP1PPP1RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppppppp86n13P3P8PPP1PPP1RN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h4g5",
            "san": "hxg5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp86B13Pn2P8PPP1PPP1RN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4g5",
            "san": "Nxg5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp86B13Pn38PPP1PPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n26B13P48PPP1PPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n283P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 24,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 17
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 2
          }, {
            "uci": "b1d2",
            "san": "Nd2",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1pppppn72P588PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp2ppppp1p62P588PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp82P588PPP1PPPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b8a6",
            "san": "Na6",
            "nr": 0
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1p1ppp84p31P1p45N2P1P1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp881P1p45N2P1P1PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp883p45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p53P45N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p53P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 2
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pp1p5np183P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp4pn283P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp5n22p53P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppp1pppp2n2n283P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp1p1pppp1p3n283P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1ppp15n27p3P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppnpppp5n283P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp5n25b23P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp5n283P2b12N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp2p2n283P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n283P42N2N2PPP3PPR1BQKB1RbKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 0
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 0
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 0
          }, {
            "uci": "h7h5",
            "san": "h5",
            "nr": 0
          }, {
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 0
          }, {
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 0
          }, {
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 0
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n283P42N2p2PPP3PPR1BQKBNRwKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "g1f3",
            "san": "Nxf3",
            "nr": 10
          }
        ]
      },
      "rnbqkb1rpp2pppp5n22p53Pp32N2P2PPP3PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n24p33Pp32N2P2PPP3PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppp1pppp2n2n283Pp32N2P2PPP3PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n283P42N1pP2PPP3PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp2p2n283Pp32N2P2PPP3PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp4pn283Pp32N2P2PPP3PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp5n25b23Pp32N2P2PPP3PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n283Pp32N2P2PPP3PPR1BQKBNRbKQkq-": {
        "total": 17,
        "moves": [{
            "uci": "e4f3",
            "san": "exf3",
            "nr": 10
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "e4e3",
            "san": "e3",
            "nr": 0
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 0
          }, {
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n283Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 17,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 17
          }
        ]
      },
      "rn1qkbnrpppbpppp883Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1p1pp85p23Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrppp1pppp85b23Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp883Pp32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 20,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 17
          }, {
            "uci": "c8d7",
            "san": "Bd7",
            "nr": 0
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }, {
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp883Pp38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 20,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 20
          }
        ]
      },
      "rnbqkbnrppp1pppp83p43PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 20,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 20
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp43P1B28PPP1PPPPRN1QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83p43P1B28PPP1PPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp33P42N5PPP1PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82pp43P42N5PPP1PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83p43P42N5PPP1PPPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rp1p1pppp5n21p1p42PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n282pP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 7
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p42PP45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p43P45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp43P45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83p43P45N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr2p1ppppp71p62pP44PN2PP3PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1pp1ppppp782pP44PN2PP3PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr1pp1ppppp782pP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "r2qk2r1b1n1pppp2bpn21pp53P41BN1PN2PP2QPPPR1BR2K1wkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r1b1n1pppp3pn21pp53P41BN1PN2PP2QPPPR1BR2K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8d6",
            "san": "Bd6",
            "nr": 0
          }
        ]
      },
      "r2qkb1r1b1n1pppp3pn21pp53P41B2PN2PP2QPPPRNBR2K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r1b3pppp3pn21pp53P41B2PN2PP2QPPPRNBR2K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r1b3pppp3pn21pp53P41B2PN2PP2QPPPRNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d1",
            "san": "Rd1",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r5pppp3pn21pp53P41B2PN2PP2QPPPRNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r5pppp3pn21pp52BP44PN2PP2QPPPRNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4b3",
            "san": "Bb3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r1p3pppp3pn22p52BP44PN2PP2QPPPRNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqk2r1p3pppp3pn22b52B54PN2PP3PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r1p3pppp3pn22P52B54PN2PP3PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bxc5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r1p3pppp3pn22p52BP44PN2PP3PPPRNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }, {
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp3ppp2n1pn22p52BP44PN2PP3PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp3ppp4pn282Bp44PN2PP3PPPRNBQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp3ppp4pn22p52BP44PN2PP3PPPRNBQ1RK1bkq-": {
        "total": 4,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 2
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22p52BP44PN2PP3PPPRNBQK2RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 4
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn282BP44PN2PP3PPPRNBQK2RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 4
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn282pP44PN2PP3PPPRNBQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f1c4",
            "san": "Bxc4",
            "nr": 4
          }
        ]
      },
      "rn1qkb1rppp1pppp5n282pP2b14PN2PP3PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pp1p5np182pP44PN2PP3PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp4bn282pP44PN2PP3PPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n282pP44PN2PP3PPPRNBQKB1RbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 4
          }, {
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 0
          }, {
            "uci": "g7g6",
            "san": "g6",
            "nr": 0
          }, {
            "uci": "c8e6",
            "san": "Be6",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppnpppp882pP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82p52pP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p382pP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp1p1pppp81p62pP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp882pP45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 12,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 7
          }, {
            "uci": "b8d7",
            "san": "Nd7",
            "nr": 0
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n282pPP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp1p1pppp81p62pPP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p32pPP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pppp2n582pPP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp3pppp81ppP42p1P38PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp3pppp5n21ppP42p1P32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp5n22pP42p1P32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp2pppp5n22pP42p1P38PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82pP42p1P38PP3PPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82p52pPP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pppp882pPP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pppp882pP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 18,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 12
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 6
          }
        ]
      },
      "rnbqkbnrp1p2ppp1p2p33p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppn1ppp4pn23p42PP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1p1p1bppp1p2pn23p42PP1B22N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1pp3ppp4pn22bp42P2B22N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1pp2bppp4pn22Pp42P2B22N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e7c5",
            "san": "Bxc5",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1pp2bppp4pn22pp42PP1B22N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1pp2bppp2p1pn23p42PP1B22N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pppnbppp4pn23p42PP1B22N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1ppp1bppp4pn23p42PP1B22N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 4,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 0
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }, {
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1ppp1bppp4pn23p42PP1B22N2N2PP2PPPPR2QKB1RwKQ-": {
        "total": 4,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 4
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23p42PP1B22N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 4
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23p42PP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 4
          }
        ]
      },
      "rnbqk2rppp2ppp4pn26B11bpP42N2N2PP2PPPPR2QKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp2ppp4pn23p2B11bPP42N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 0
          }
        ]
      },
      "rnbqk2rppp2ppp4pn23p41bPP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pp3ppp2nbpn22pp42PP42NBPN2PP3PPPR1BQ1RK1w--": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpp3ppp2nbpn22pp42PP42NBPN2PP3PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpp3ppp2nbpn22pp42PP42NBPN2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp3ppp2n1pn22pp42PP42NBPN2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8d6",
            "san": "Bd6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp3ppp2n1pn22pp42PP42N1PN2PP3PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22pp42PP42N1PN2PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22pp42PP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn282pP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp4pn23p42PP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 0
          }, {
            "uci": "f8e7",
            "san": "Be7",
            "nr": 4
          }, {
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 0
          }
        ]
      },
      "rnb1kb1rpp3ppp1q2pn22pP2B13P42N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp3ppp4pn22pP2B13P42N5PP2PPPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8b6",
            "san": "Qb6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22pp2B12PP42N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "r1b1kb1rpp1n1ppp2p1pn2q2p2B12PP42N1PN2PP3PPPR2QKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpp1n1ppp2p1pn23p2B12PP42N1PN2PP3PPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpp1n1ppp2p1pn23p2B12PP42N2N2PP2PPPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppn1pp14pn1p82pP3B2N2N2PP2PPPPR2QKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppn1pp14pn1p3p42PP3B2N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppn1pp14pn1p3p2B12PP42N2N2PP2PPPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5h4",
            "san": "Bh4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppn1ppp4pn23p2B12PP42N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }, {
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpp1n1ppp4pn22pp2B11bPP42N1PN2PP3PPPR2QKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppn1ppp4pn23p2B11bPP42N1PN2PP3PPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpppn1ppp4pn23p2B11bPP42N1P3PP3PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp1n1ppp2p1pn23p2B12PP42N1P3PP3PPPR2QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppn1ppp4pn23p2B12PP42N1P3PP3PPPR2QKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppn1ppp4pn23p2B12PP42N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 2
          }
        ]
      },
      "rn1r2k1ppp1qpp14b2p3p42PP41Q2PN2P4PPPR3KB1RwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbr2k1ppp1qpp17p3p42PP41Q2PN2P4PPPR3KB1RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 0
          }
        ]
      },
      "rnbr2k1ppp1qpp17p3p43P41QP1PN2P4PPPR3KB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c3c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnb2rk1ppp2pp13q3p3p43P41QP1PN2P4PPPR3KB1RwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnb2rk1ppp1qpp17p3p43P41QP1PN2P4PPPR3KB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "f8d8",
            "san": "Rd8",
            "nr": 1
          }, {
            "uci": "e7d6",
            "san": "Qd6",
            "nr": 0
          }
        ]
      },
      "rnb2rk1ppp1qpp17p3p43P42P1PN2P4PPPR2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 2
          }
        ]
      },
      "rnb2rk1ppp1qpp14p2p3P43P42P1PN2P4PPPR2QKB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 2
          }
        ]
      },
      "rnb2rk1ppp1qpp14p2p3P43P42n1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "b2c3",
            "san": "bxc3",
            "nr": 2
          }
        ]
      },
      "rnb2rk1ppp1qpp14p2p3P43Pn32N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "e4c3",
            "san": "Nxc3",
            "nr": 2
          }
        ]
      },
      "rnb2rk1ppp1qpp14p2p3p42PPn32N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1ppp1Bpp14p2p3p42PPn32N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d8e7",
            "san": "Qxe7",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1ppp1bpp14p2p3p42PPn2B2N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "h4e7",
            "san": "Bxe7",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1p1p1bpp11p2p2p3n43P3B2N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1p1p1bpp11p3n1p3p43P3B2N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1p1p1bpp11p2pn1p3P43P3B2N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "f6d5",
            "san": "Nxd5",
            "nr": 0
          }, {
            "uci": "e6d5",
            "san": "exd5",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1p1p1bpp11p2pn1p3p42PP3B2N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1ppp1bpp14pn1p3p42PP3B2N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 4,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 2
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1ppp1bpp14pn1p3p2B12PP42N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 4,
        "moves": [{
            "uci": "g5h4",
            "san": "Bh4",
            "nr": 4
          }
        ]
      },
      "r1b2rk1pp1nqppp2p54p32BP42R1PN2PP3PPP3Q1RK1w--": {
        "total": 0,
        "moves": []
      },
      "r1b2rk1pp1nqppp2p1p382BP42R1PN2PP3PPP3Q1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "e6e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "r1b2rk1pp1nqppp2p1p382BP42n1PN2PP3PPP2RQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "c1c3",
            "san": "Rxc3",
            "nr": 1
          }
        ]
      },
      "r1b2rk1pp1nqppp2p1p33n42BP42N1PN2PP3PPP2RQ1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "d5c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "r1b2rk1pp1nqppp2p1p33n42BP42N1PN2PP3PPP2RQK2RwK-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pp1nBppp2p1p33n42BP42N1PN2PP3PPP2RQK2RbK-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qxe7",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pp1nbppp2p1p33n2B12BP42N1PN2PP3PPP2RQK2RwK-": {
        "total": 1,
        "moves": [{
            "uci": "g5e7",
            "san": "Bxe7",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1p2nbppp2p1pn21p4B12BP42N1PN2PP3PPP2RQK2RwK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pp1nbppp2p1pn26B12BP42N1PN2PP3PPP2RQK2RbK-": {
        "total": 2,
        "moves": [{
            "uci": "f6d5",
            "san": "Nd5",
            "nr": 1
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1pp1nbppp2p1pn26B12pP42NBPN2PP3PPP2RQK2RwK-": {
        "total": 2,
        "moves": [{
            "uci": "d3c4",
            "san": "Bxc4",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1pp1nbppp2p1pn23p2B12PP42NBPN2PP3PPP2RQK2RbK-": {
        "total": 2,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1pp1nbppp2p1pn23p2B12PP42N1PN2PP3PPP2RQKB1RwK-": {
        "total": 2,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 2
          }
        ]
      },
      "r1bq1rk11ppnbpppp3pn23p2B12PP42N1PN2PP3PPP2RQKB1RwK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pppnbppp4pn23p2B12PP42N1PN2PP3PPP2RQKB1RbK-": {
        "total": 3,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 2
          }, {
            "uci": "a7a6",
            "san": "a6",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1pppnbppp4pn23p2B12PP42N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 3,
        "moves": [{
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 3
          }
        ]
      },
      "rnbq1rk1ppp1bppp4pn23p2B12PP42N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 7,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 4
          }, {
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 3
          }
        ]
      },
      "rnbq1rk1ppp1bppp4pn23p2B12PP42N1P3PP3PPPR2QKBNRwKQ-": {
        "total": 7,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 7
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23p2B12PP42N1P3PP3PPPR2QKBNRbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 7
          }
        ]
      },
      "rnbq1rk1ppp1bpp14pn1p82pP3B2N2N2PP2PPPP2RQKB1RwK-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1ppp1bpp14pn1p3p42PP3B2N2N2PP2PPPP2RQKB1RbK-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1ppp1bpp14pn1p3p42PP3B2N2N2PP2PPPPR2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1bpp14pn1p3p42PP3B2N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1bpp14pn1p3p2B12PP42N2N2PP2PPPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5h4",
            "san": "Bh4",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23p2B12PP42N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23p2B12PP42N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 7
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn23p2B12PP42N5PP2PPPPR2QKBNRbKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 4
          }, {
            "uci": "f8e7",
            "san": "Be7",
            "nr": 8
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn23p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 21,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 8
          }, {
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 13
          }
        ]
      },
      "rnbqk1nrppp1bppp4p33p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1pp2pppp3p33p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k1nrpp3ppp4p32B52P58PP2BPqPR2QK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k1nrpp3ppp4p32B52P1q38PP2BPPPR2QK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4g2",
            "san": "Qxg2",
            "nr": 0
          }
        ]
      },
      "rnb1k1nrpp3ppp4p32p51BP1q38PP2BPPPR2QK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4c5",
            "san": "Bxc5",
            "nr": 1
          }
        ]
      },
      "rnb1k1nrpp3ppp2p1p381BP1q38PP2BPPPR2QK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnb1k1nrpp3ppp2p1p381BP1q38PP3PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnb1k1nrpp3ppp2p1p381BPqN38PP3PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4e4",
            "san": "Qxe4+",
            "nr": 1
          }
        ]
      },
      "rnb1k1nrpp3ppp2p1p381bPqN38PP1B1PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2b4",
            "san": "Bxb4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpp3ppp2p1p381bPPN38PP1B1PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d4",
            "san": "Qxd4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpp3ppp2p1p381bPPN38PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p382PPN38PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p382PPp32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p33p42PPP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p33p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pp2bppp2n2n22P53p42N2NP1PP2PPBPR1BQ1RK1w--": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pp2bppp2n2n22Pp482N2NP1PP2PPBPR1BQ1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1pp2bppp2n2n22pp43P42N2NP1PP2PPBPR1BQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpp2bppp2n2n22pp43P42N2NP1PP2PPBPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpp2bppp2n2n22pp43P42N2NP1PP2PPBPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp3ppp2n2n22pp43P42N2NP1PP2PPBPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp3ppp2n2n22pp43P42N2NP1PP2PP1PR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2n52pp43P42N2NP1PP2PP1PR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrp4ppp2n51pP5N2p45N2PP2PPPPR1BQKB1RwKQkqb6": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpp3ppp2n52P5N2p45N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpp3ppp2n52P53p42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3a4",
            "san": "Na4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2n52Pp482N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2n52pp43P42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }, {
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp82pp43P42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrp4ppp81pP5N2p48PP2PPPPR1BQKBNRwKQkqb6": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp82P5N2p48PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp82P53p42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3a4",
            "san": "Na4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp82Pp482N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp82pp43P42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp3ppp2n1b33Q482N5PP2PPPPR1B1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpp3ppp2n53Q482N5PP2PPPPR1B1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpp3ppp2n53p482N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2n1p33P482N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2n1p33P43Q42N5PP2PPPPR1B1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d1",
            "san": "Qd1",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p33P43Q42N5PP2PPPPR1B1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p33P43p42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d4",
            "san": "Qxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32pP43P42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 3
          }, {
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32pp42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p42PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 29,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 21
          }, {
            "uci": "f8e7",
            "san": "Be7",
            "nr": 0
          }, {
            "uci": "a7a6",
            "san": "a6",
            "nr": 0
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 4
          }
        ]
      },
      "rnbqkb1rppp2pp14pn1p3p2B12PP45N2PP2PPPPRN1QKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp4pn23p2B12PP45N2PP2PPPPRN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpp1n1ppp4pn22pp42PP43BPN2PP1N1PPPR1BQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpp1n1ppp2p1pn23p42PP43BPN2PP1N1PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpp1n1ppp2p1pn23p42PP44PN2PP1N1PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp2p1pn23p42PP44PN2PP1N1PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp2p1pn23p42PP44PN2PP3PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1d2",
            "san": "Nbd2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn23p42PP44PN2PP3PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn23p42PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32pp42PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p33p42PP45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p42PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 32,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 29
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 3
          }
        ]
      },
      "r2qkbnrppp2ppp2n1b34P32Pp45NP1PP2PP1PRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkbnrppp2ppp2n54Pb22Pp45NP1PP2PP1PRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkbnrppp2ppp2n54P32Pp2b15NP1PP2PP1PRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2n54P32Pp45NP1PP2PP1PRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 0
          }, {
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 0
          }, {
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp2ppp2n54P32Pp45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpp3ppp82p1P32Pp45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84P32Pp45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 3
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp2ppp84P31bP54p3PP1B1PPPRN1QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp84P31bPp44P3PP1B1PPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4e3",
            "san": "dxe3",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp2ppp84P31bPp44P3PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp84P32Pp44P3PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp84P32Pp48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 4
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pP32P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 5
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp32PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 5
          }
        ]
      },
      "rnbqkbnrpp2pppp82P52Pp48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82Pp42P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnb1kb1rpp2pppp8q1PP44n38PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp82PP44n38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5+",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp2pppp82pP43Pn38PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp5n22pP43PP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp5n22pP43P48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82pP43P48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp42PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 1
          }, {
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp2pppp2n58Q2P48PP2PPPPRbB1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpp2pppp2P58Q2P48PP2PPPPRbB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nxc6",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrpp2pppp2p53P4Q2P48PP2PPPPRbB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c6",
            "san": "dxc6",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp1pppp83P4Q2P48PP2PPPPRbB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp1pppp83P43P48PP2PPPPRbBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4+",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp1pppp83P1b23P48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5b1",
            "san": "Bxb1",
            "nr": 1
          }
        ]
      },
      "r2qkbnrppp2ppp2n1p33p1b22PP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpp3ppp2p1p33p1b22PP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrppp2ppp4p33p1b22PP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrppp2ppp4p33p1b22PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }
        ]
      },
      "rn1qkbnrppp1pppp83p1b22PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 2
          }
        ]
      },
      "rn1qkbnrppp1pppp83p1b22PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "r1b1kbnrppp1pppp2n53q43P48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pppp2n53P43P48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp2ppp2n53pp32PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkbnrppp1pppp2n53p42PP2b15N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pppp2n53p42PP45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }, {
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rppp1pppp2n2n282pP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppp1pppp2n2n23p42PP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rppp1pppp2n2n23p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp2ppp2n53pp32PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pppp2n53p42PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p42PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n23P43P48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n23P43P48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p42PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1p1pppp81p1p42PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp2p53pp32PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p53p42PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p42PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p42PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 68,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 18
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 32
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 5
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }, {
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 3
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 5
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p43P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 94,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 20
          }, {
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 3
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 68
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp23P2P18PPP1PP1PRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp85p23P2P18PPP1PP1PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp23P45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp85p23P45N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp1pp1pp2p2n26B13Pp32N5PPP2PPPR2QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppppp1pp5n26B13Pp32N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppppp1pp5n283Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp883Pp32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp883Pp38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1p1pp3p45p23PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp85p23PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p23P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrp2p2pp4p31PpP1p24P38PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp2p1ppp4p31PpP44P38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrp2p1ppp4p31ppP42P1P38PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4b5",
            "san": "cxb5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp2p1ppp1p2p32pP42P1P38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b6b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp2p1ppp1p2p32pP42P58PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp2ppppp1p62pP42P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp2ppppp1p62p52PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpp1ppp1p64p32PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpbpppppp1p682PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrpbpppppp1p682PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pppppp1p682PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }, {
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pppppp1p683P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 2
          }
        ]
      },
      "rn1qkbnrppp2ppp3pb34P32P58PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2np44P32P58PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp3p44P32P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp3p44p32PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pppp3p482PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pppp3p483P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 2
          }
        ]
      },
      "rnb1k1nrpppp1ppp82bPp34P2q8PPP2PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp82bPp34P38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1ppp82bPp388PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp83Pp388PPP1PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrppppqppp2n54P385N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n52b1P385N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp2pp2n2p24P385N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1pp12n4p4P385N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppppnppp2n54P385N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n54P385N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 0
          }, {
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }, {
            "uci": "f7f6",
            "san": "f6",
            "nr": 0
          }, {
            "uci": "h7h6",
            "san": "h6",
            "nr": 0
          }, {
            "uci": "g8e7",
            "san": "Nge7",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54P388PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 5
          }
        ]
      },
      "rnbqkbnrppp2ppp3p44P388PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1ppp84P37q8PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp5p24P388PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84P388PPP1PPPPRNBQKBNRbKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 5
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 0
          }, {
            "uci": "d8h4",
            "san": "Qh4",
            "nr": 0
          }, {
            "uci": "f7f6",
            "san": "f6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp883Pp35N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84p33P45N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p33P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 8
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp882n52N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp84n32P52N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5c4",
            "san": "Nxc4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp84n32P58PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54P32P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p32PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppppppp2n582PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppppppp2n583P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr2pp1ppp4p31p63PP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr2pp1pppp3p31P63PP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a6b5",
            "san": "axb5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr2ppppppp71p62PPP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr2ppppppp71p62PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1pppppppp782PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1pppppppp783P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp883P48PPP1PPPPRNBQKBNRbKQkq-": {
        "total": 141,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 24
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 3
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 94
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 4
          }, {
            "uci": "b7b6",
            "san": "b6",
            "nr": 2
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 10
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }, {
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82p54pP25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82pp44PP25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp45P25N2PPPPP1PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p45P25N2PPPPP1PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p45P28PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp3P1n2888PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2p1p3b46p185N2PPPPP1PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp3b4885N2PPPPP1PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp2ppp3b4888PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp3P4888PPPPP1PPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }, {
            "uci": "f8d6",
            "san": "Bxd6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp3p44P388PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5d6",
            "san": "exd6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp2pp5p24P388PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppppnppp84P388PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n54P388PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84P388PPPPP1PPRNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }, {
            "uci": "f7f6",
            "san": "f6",
            "nr": 0
          }, {
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 0
          }, {
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p35P28PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "f4e5",
            "san": "fxe5",
            "nr": 5
          }
        ]
      },
      "rnbqkbnrpppppp27p6p15P25N2PPPPP1PPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppppp17p85P25N2PPPPP1PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppppp17p85P28PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp885P28PPPPP1PPRNBQKBNRbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 5
          }, {
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rpbpp2pp1p2pn25P22PP42N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpbpp2pp1p2p35P22PP42N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrpbpp2pp1p2p35p22PPP32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpp1ppp1p2p382PPP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpp1ppp1p2p382PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pp1ppp1p2p382PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rpbpp2pp1p2p2n5P22PP45P2PP4PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpbpp2pp1p2p35P22PP45P2PP4PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8h6",
            "san": "Nh6",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrpbpp2pp1p2p35p22PPP35P2PP4PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpp1ppp1p2p382PPP35P2PP4PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpp1ppp1p2p382PPP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pp1ppp1p2p382PPP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pp1ppp1p2p382PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p32PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp4p382PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 2
          }, {
            "uci": "e6e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p382P58PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpp1p1ppp4p32p1P32P52N5PP1P1PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp1p1ppp4pn22p1P32P52N5PP1P1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g8",
            "san": "Ng8",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp1p1ppp4pn22p52P1P32N5PP1P1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn282P1P32N5PP1P1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn282P52N5PP1PPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n282P52N5PP1PPPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r2pp1pppp3pn21p62P55NP1PP1PPPBPRNBQK2RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r1ppp1pppp3pn282P55NP1PP1PPPBPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r1ppp1pppp3pn282P55NP1PP1PPP1PRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn282P55NP1PP1PPP1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn282P55N2PP1PPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n282P55N2PP1PPPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n282P58PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33P488PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n23P488PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83P488PP1PPPPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp83p42P58PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp86N12P1p1n12N5PP1PPPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp1pp1ppp5n21p4N12P1p32N5PP1PPPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n26N12P1p32N5PP1PPPPPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6g4",
            "san": "Ng4",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n282P1p32N2N2PP1PPPPPR1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32P52N2N2PP1PPPPPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32P52N5PP1PPPPPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p32P52N5PP1PPPPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p32P58PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp1p1p84p1p12PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppppp1p86p12PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppppp1p86p12P58PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp882P58PP1PPPPPRNBQKBNRbKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 3
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 2
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p46P18PPPPPPBPRNBQK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "q3kbnrp1pnpppp882Pp2b18PP1PPP1PRNBQK1NRwKQk-": {
        "total": 0,
        "moves": []
      },
      "B2qkbnrp1pnpppp882Pp2b18PP1PPP1PRNBQK1NRbKQk-": {
        "total": 1,
        "moves": [{
            "uci": "d8a8",
            "san": "Qxa8",
            "nr": 0
          }
        ]
      },
      "r2qkbnrpBpnpppp882Pp2b18PP1PPP1PRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7a8",
            "san": "Bxa8",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpBp1pppp882Pp2b18PP1PPP1PRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nd7",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp1pppp882Pp2b18PP1PPPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2b7",
            "san": "Bxb7",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp1pppp83p42P3b18PP1PPPBPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp1pppp83p46b18PPPPPPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p46P18PPPPPPBPRNBQK1NRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 0
          }, {
            "uci": "c8g4",
            "san": "Bxg4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1ppp187p4p1P12N5PPPP1P1PR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp884p1P12N5PPPP1P1PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h5",
            "san": "h5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp884p1P18PPPP1P1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p44P1P18PPPP1P1PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p46P18PPPPPP1PRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 2
          }, {
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp886P18PPPPPP1PRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 3
          }
        ]
      },
      "r1bqkbnrppp3pp2n54Pp23pN36P1PPP1PP1PR1BQKBNRwKQkqf6": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2n54P33pN36P1PPP1PP1PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp2ppp2n54P33p42N3P1PPP1PP1PR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3e4",
            "san": "Ne4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp2ppp2n53pP382N3P1PPP1PP1PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp2ppp2n53pp33P42N3P1PPP1PP1PR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p43P42N3P1PPP1PP1PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p482N3P1PPPPPP1PR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppppppp2n5882N3P1PPPPPP1PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppppppp2n5886P1PPPPPP1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp2p6p17Q4p36P1PPPP1P1PRNB1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp87Q4p36P1PPPP1P1PRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp884p36P1PPPP1P1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1h5",
            "san": "Qh5+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp85p24P36P1PPPP1P1PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp85p286P1PPPPPP1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppppp1887p5NP1PPPPPP1PRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppppp187p85NP1PPPPPP1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h5h4",
            "san": "h4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppppp187p86P1PPPPPP1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pp1p83p2p185NP1PPPPPP1PRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83p485NP1PPPPPP1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp83p486P1PPPPPP1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8886P1PPPPPP1PRNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }, {
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }, {
            "uci": "h7h5",
            "san": "h5",
            "nr": 1
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp385NP1PPPPPP1PRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82p51PPp45N2P2PPPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp881PPp45N2P2PPPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp882Pp45N2PP1PPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp882p55N2PP1PPPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp1p1pppp81p1p42P55N2PP1PPPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83p42P55N2PP1PPPPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }, {
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 0
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp83p485N2PPPPPPPPRNBQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnr3p1pppp3p31pp52P52N2NP1PP1PPP1PR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1p1p1pppp3p32p52P52N2NP1PP1PPP1PR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr1p1p1pppp3p32p52P52N2N2PP1PPPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1ppp1pppp3p382P52N2N2PP1PPPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1ppp1pppp3p382P55N2PP1PPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p382P55N2PP1PPPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p3885N2PPPPPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp3p44p33P45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp3p483P45N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp3p4885N2PPPPPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8885N2PPPPPPPPRNBQKB1RbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 4
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1b1k1nrppppq2p2n2pp14pP21bB1P38PBPP2PPRN1QK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k1nrppppq1pp2n2p24pP21bB1P38PBPP2PPRN1QK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 0
          }
        ]
      },
      "r1b1k1nrppppq1pp2n2p24p31bB1PP28PBPP2PPRN1QK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f4f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp2pp2n2p24p31bB1PP28PBPP2PPRN1QK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp2pp2n2p24p31bB1P38PBPP1PPPRN1QK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp2pp5p24p31bB1P38PBPP1PPPRN1QK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp2pp5p24p31b2P38PBPP1PPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp5p24p31P2P38PBPP1PPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bxb4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp5p24p31P68PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp82p1p31P68PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84p31P68PBPPPPPPRN1QKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f7f6",
            "san": "f6",
            "nr": 1
          }, {
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p31P68P1PPPPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppppppp881P68P1PPPPPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrpppp2pp2n54pp22N1P38PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n54p32N1P38PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p32N58PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p32N58PPPPPPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p38N7PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a3c4",
            "san": "Nc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp888N7PPPPPPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b1p382N2N2PPPPPPPPR1BQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84p382N2N2PPPPPPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrppp2ppp4b33pp2Q82N1P3PPPP1PPPR1B1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n23pp2Q82N1P3PPPP1PPPR1B1KBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83pp2Q82N1P3PPPP1PPPR1B1KBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 0
          }, {
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp382N1P3PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p382N1P3PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p382N5PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp35P22N5PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82p53pNP28PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p33pNP28PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp883pNP28PPPPP1PPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 0
          }, {
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp883p1P22N5PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c3e4",
            "san": "Ne4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pp1p83p2p15P22N5PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83p45P22N5PPPPP1PPR1BQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 0
          }, {
            "uci": "d5d4",
            "san": "d4",
            "nr": 2
          }, {
            "uci": "g7g5",
            "san": "g5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp2ppp83pp31b1P42N1P3PPP2PPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83pp33P42N1P3PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp83p482N1P3PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p482N5PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 4
          }, {
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp2ppp2np44P382N5PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp3p44P382N5PPPPP1PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp3p44p35P22N5PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f4e5",
            "san": "fxe5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp3p485P22N5PPPPP1PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp3p4882N5PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8882N5PPPPPPPPR1BQKBNRbKQkq-": {
        "total": 9,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 3
          }, {
            "uci": "d7d5",
            "san": "d5",
            "nr": 5
          }, {
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrp1pnpppp1p63p4P2P42N51PP1PPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp1p1pppp1p63p4P2P42N51PP1PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nd7",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrp1p1pppp1p63p4P2P481PP1PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pppppp1p68P2P481PP1PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pppppp1p68P781PPPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpppppp81P6881PPPPPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrp1pppppp81P6881PPPPPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrp1pppppp81p6P781PPPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a4b5",
            "san": "axb5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp88P781PPPPPPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 1
          }, {
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8888PPPPPPPPRNBQKBNRwKQkq-": {
        "total": 440,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 255
          }, {
            "uci": "d2d4",
            "san": "d4",
            "nr": 141
          }, {
            "uci": "f2f4",
            "san": "f4",
            "nr": 7
          }, {
            "uci": "c2c4",
            "san": "c4",
            "nr": 10
          }, {
            "uci": "g2g4",
            "san": "g4",
            "nr": 3
          }, {
            "uci": "g2g3",
            "san": "g3",
            "nr": 4
          }, {
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 6
          }, {
            "uci": "b2b4",
            "san": "b4",
            "nr": 2
          }, {
            "uci": "b1a3",
            "san": "Na3",
            "nr": 1
          }, {
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 9
          }, {
            "uci": "a2a4",
            "san": "a4",
            "nr": 2
          }
        ]
      }
    }
  };
  LiChessTools.prototype.gambit_dict = {
    white: new Map(Object.keys(gambits.white).map(k => [k, gambits.white[k]])),
    black: new Map(Object.keys(gambits.black).map(k => [k, gambits.black[k]]))
  };

})();