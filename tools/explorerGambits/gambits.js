(function () {

  const gambits = {
    "white": {
      "rnbqkbnrppp1pppp83p44P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp1pppp8q71P62N5P1PP1PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp1pppp8q782N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrppp1pppp83q482N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5a5",
            "san": "Qa5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppp1pppp83q488PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83P488PPPP1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p44P31P6P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83p41P2P38P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83p44P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }, {
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
      "rnbqkbnrpp2pppp2p53p44P33P1N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p53p44P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp2p584P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n283PN33B4PPP2PPPR1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp2p2n283PN38PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp2p583PN38PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p583Pp32N2P2PPP3PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p582BPp32N5PPP2PPPR1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p583Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrpp2pppp2p53p43PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpp3ppp2p582BpP35N2PPP3PPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp2p583pP35N2PPP3PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp2p54p33PP35N2PPP3PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp2p54p33PP38PPP3PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p583PP38PPP3PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p583Pp35P2PPP3PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p43PP35P2PPP3PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1npppp2p1P33p43P43B4PPP2PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp1npppp2p53pP33P43B4PPP2PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e6",
            "san": "e6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n23pP33P43B4PPP2PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d7",
            "san": "Nfd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n23p43PP33B4PPP2PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p43PP33B4PPP2PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p43PP34B3PPP2PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p56N13Pp38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p583Pp35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p43PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p43PP38PPP2PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpp1ppppp2p583PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 7,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 7
          }
        ]
      },
      "rnbqkbnrpp2pppp2p56N14p32N5PPPP1PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p584p32N2N2PPPP1PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p44P32N2N2PPPP1PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p56B14p32NP4PPP2PPPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p584p32NP4PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p44P32NP4PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p44P32N5PPPP1PPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrpp1ppppp2p584P32N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp2pppp2p57Q4p31B6PPPP1PPPRNB1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p584p31B6PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1h5",
            "san": "Qh5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p44P31B6PPPP1PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p42B1P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4b3",
            "san": "Bb3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp2p582B1P38PPPP1PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p51P1p44P38P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p53p41P2P38P1PP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4b5",
            "san": "b5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp2p581P2P38P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53pP32P58PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p53p42P1P38PP1P1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp2p582P1P38PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp2p584P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }, {
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
      "rnbqkbnrppp2ppp4p36N14p33P4PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p384p33P1N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p44P33P1N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32ppP31P65N2P1PP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp4p32ppP385N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33pP385N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p44P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }, {
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p384P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32ppP31P1P48P1P2PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpp3ppp1qn1p32ppP33P42PB1N2PP3PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpp3ppp1qn1p32ppP33P42P2N2PP3PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpp3ppp2n1p32ppP33P42P2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8b6",
            "san": "Qb6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp3ppp2n1p32ppP33P42P5PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32ppP33P42P5PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p33pP33p2Q15N2PPP2PPPRNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp4p33pP33p2Q18PPP2PPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32ppP33P2Q18PPP2PPPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p33pP33p43B1N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp4p33pP33p45N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32ppP33P45N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32ppP33P48PPP2PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrppp2ppp4p33pP33P48PPP2PPPRNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p43PP34B3PPP2PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p34N33Pp38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p383Pp35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p43PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp2ppp4pn23p2B11b1PP32N5PPP1NPPPR2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp2ppp4pn23p2B11b1PP32N5PPP2PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1e2",
            "san": "Ne2",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn23p2B13PP32N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
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
      "rnbqk1nrppp2ppp4p33p41b1PP32N5PPP1NPPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp4p33p41b1PP3P1N51PP2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp4p33p41b1PP32N5PPP2PPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrppp2ppp4p33p43PP32N5PPP2PPPR1BQKBNRbKQkq-": {
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
      "rnbqkbnrppp2ppp4p33p43PP37NPPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p33p43PP38PPP2PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppp1ppp4p383PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 10,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 10
          }
        ]
      },
      "rnbqk1nrpppp1ppp4p34P31b68P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp4p381b2P38P1PP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p381P2P38P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bxb4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p44P31P6PBPP1PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp4p33p44P31P6P1PP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p384P31P6P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83p44P31Q6PP1P1PPPRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83p44P38PP1P1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33P44P38PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p42P1P38PP1P1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p382P1P38PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p384P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 15,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }, {
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
          }
        ]
      },
      "r1bqkbnrpp1ppppp2n52p51P2P35N2P1PP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpp1p1pbp2n3p11Bp1p33PP32P2N2PP3PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpp1p1pbp2n3p11Bp1p34P32P2N2PP1P1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpp1pppbp2n2np11Bp53PP32P2N2PP3PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpp1pppbp2n2np11Bp54P32P2N2PP1P1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpp1pppbp2n3p11Bp54P32P2N2PP1P1PPPRNBQ1RK1bkq-": {
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
      "r1bqk1nrpp1pppbp2n3p11Bp54P35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrpp1ppp1p2n3p11Bp54P35N2PPPP1PPPRNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrpp1ppp1p2n3p11Bp54P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrpp1ppppp8nBp51P2P35N2P1PP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpp1ppppp8nBp54P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpp1ppppp2n51Bp54P35N2PPPP1PPPRNBQK2RbKQkq-": {
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
      "r1bqkbnrpp1ppppp2n52p54P35N2PPPP1PPPRNBQKB1RwKQkq-": {
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
      "r2qkbnrpp1bpp1p2np2p11Bp1P385N2PPPPQPPPRNB2RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkbnrpp1bpp1p2np2p11Bp54P35N2PPPPQPPPRNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "r2qkbnrpp1bpppp2np41Bp54P35N2PPPPQPPPRNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "r2qkb1r1p2ppppp2p1n22p3B13Pb32P2N2PP3PPPRN1QR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r1p2ppppp2p1n22p53Pb32P2N2PP3PPPRNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "r2qkb1r1p2ppppp1bp1n22p53PP32P2N2PP3PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e4",
            "san": "Bxe4",
            "nr": 1
          }
        ]
      },
      "r2qkb1r1p2ppppp1bp1n22p54P32P2N2PP1P1PPPRNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r2qkbnr1p2ppppp1bp42p54P32P2N2PP1P1PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r2qkbnr1p2ppppp1bp42p54P32P2N2PP1P1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1",
            "nr": 1
          }
        ]
      },
      "r2qkbnr1p1bppppp1Bp42p54P32P2N2PP1P1PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7c6",
            "san": "Bxc6",
            "nr": 1
          }
        ]
      },
      "r2qkbnr1p1bppppp1np41Bp54P32P2N2PP1P1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5c6",
            "san": "Bxc6",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp1bpppp2np41Bp54P32P2N2PP1P1PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "r2qkbnrpp1bpppp2np41Bp54P35N2PPPP1PPPRNBQ1RK1wkq-": {
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
      "r1bqkbnrpp2pppp2np41Bp54P35N2PPPP1PPPRNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8d7",
            "san": "Bd7",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrpp2pppp2np41Bp54P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "r3kb1rpp1qpppp2np1n22p53PP32P2N2PP3PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r3kb1rpp1qpppp2np1n22p54P32P2N2PP1P1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r3kbnrpp1qpppp2np42p54P32P2N2PP1P1PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r3kbnrpp1qpppp2np42p54P35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rn2kbnrpp1qpppp3p42p54P35N2PPPP1PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rn2kbnrpp1qpppp3p42p54P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpp1Bpppp3p42p54P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d7",
            "san": "Qxd7",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpp1bpppp3p41Bp54P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5d7",
            "san": "Bxd7+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp3p41Bp54P35N2PPPP1PPPRNBQK2RbKQkq-": {
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
      "r1b1kb1rpp2pppp2np4q2P482P2N2P3BPPPR1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kb1rpp2pppp2np4q2P482n2N2PP2BPPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2c3",
            "san": "bxc3",
            "nr": 0
          }
        ]
      },
      "r1b1kb1rpp2pppp2np4q2P44n32N2N2PP2BPPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "r1b1kb1rpp2pppp2np4q2P44n35N2PP2BPPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp2pppp2np43P44n35N2PP2BPPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5+",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp2pppp2np483Pn35N2PP2BPPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp2pppp2np1n283PP35N2PP2BPPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
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
      "rnbqkb1r1p2ppppp2p1n283NP1P12N5PPP2P1PR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r1p2ppppp2p1n283NP32N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r1p3p1pp2p1np14pNP14P32N1B3PPP2P1PR2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r1p3p1pp2p1np14pN24P1P12N1B3PPP2P1PR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4g5",
            "san": "g5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r1p3pppp2p1n24pN24P1P12N1B3PPP2P1PR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r1p3pppp2p1n24p33NP1P12N1B3PPP2P1PR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4f5",
            "san": "Nf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r1p3pppp2ppn283NP1P12N1B3PPP2P1PR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r1p3pppp2ppn283NP32N1B3PPP2PPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp3ppn283NP32N1B3PPP2PPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp3ppn283NP32N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp3p1n283NP32N5PPP2PPPR1BQKB1RbKQkq-": {
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
      "rnbqkb1rpp2pppp3p1n283NP38PPP2PPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp2pppp3p483NP38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp2pppp3p483pP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp2pppp3p42p53PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp2pppp3p42p51P2P35N2P1PP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp3p42p54P35N2PPPP1PPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnr1p1pppppp782BpP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1p1pppppp783pP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr1p1pppppp72p53PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1p1pppppp72p51P2P35N2P1PP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1p1pppppp72p54P35N2PPPP1PPPRNBQKB1RwKQkq-": {
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
      "rqb1kbnr1p1p1ppppBn1p31N64P32N5PPP2PPPR2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rqb1kbnr1p1p1pppp1n1p31N64P32N1B3PPP2PPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e3b6",
            "san": "Bb6",
            "nr": 0
          }
        ]
      },
      "rqb1kbnrpp1p1ppp2n1p31N64P32N1B3PPP2PPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rqb1kbnrpp1p1ppp2n1p31N64P32N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrppqp1ppp2n1p31N64P32N5PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7b8",
            "san": "Qb8",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrppqp1ppp2n1p383NP32N5PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4b5",
            "san": "Ndb5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1p1ppp2n1p383NP32N5PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8c7",
            "san": "Qc7",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1p1ppp2n1p383NP38PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
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
      "rnbqkbnrpp1p1ppp4p383pP32P2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1ppp4p383pP35N2PPP2PPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpp1p1ppp4p32p53PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp1p1ppp4p32p51P2P35N2P1PP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1ppp4p32p54P35N2PPPP1PPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpp1ppppp82p54P35N2PPPP1PPPRNBQKB1RbKQkq-": {
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
      "r1bqkb1rpp1ppppp2n2n282B1P38PPP2PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpp1ppppp2n2n284P38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpp1ppppp2n584P38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1ppppp2n583QP38PPP2PPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d1",
            "san": "Qd1",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp883QP38PPP2PPPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp883pPP28PPP3PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1ppp84p33pP32P2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1ppp84p33pP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp883pP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp884P32p2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp884P32p5PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp882P1P33p4PP3PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp884P32Pp4PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3c4",
            "san": "c4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp883pP32P5PP3PPPRNBQKBNRbKQkq-": {
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
      "rnbqkbnrpp1ppppp883pP38PPP2PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpp1ppppp82p53PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 5
          }
        ]
      },
      "r1bqkbnrpp1ppppp2n582BpP3N7PPP2PPPR1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpp1ppppp2n583pP3N7PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpp1ppppp2n52p53PP3N7PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpp1ppppp2n52p54P3N7PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p54P3N7PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp881p2P38PBPP1PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpp3ppp4q34p31pP5P2B1N23P1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpp3ppp4q34p31pP5P4N23P1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrpp3ppp83qp31pP5P4N23P1PPPRNBQKB1RbKQkqc3": {
        "total": 1,
        "moves": [{
            "uci": "d5e6",
            "san": "Qe6",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpp3ppp83qp31p6P4N22PP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
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
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp881p2P38P1PP1PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpp1ppppp82p51P2P38P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5b4",
            "san": "cxb4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p54P38PPPP1PPPRNBQKBNRwKQkq-": {
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
      "rnbqkb1rpppp1ppp4p32PnP32B52N5PP1P1PPPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp4p32PnP382N5PP1P1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp3p42P1P1B182P5PP3PPPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp3p42P1P382P5PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppppppp82P1P382P5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp82P1P382n5PP1P1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp82PnP382N5PP1P1PPPR1BQKBNRbKQkq-": {
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
      "rnbqkb1rppp2ppp3p42PBP388PP1P1PPPR1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp3p42PpP32B58PP1P1PPPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "Bxd5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp2ppp3pp32PNP32B58PP1P1PPPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp3pp32PnP32B52N5PP1P1PPPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp4p32PnP32B58PP1P1PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp82PnP32B58PP1P1PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp82PnP388PP1P1PPPRNBQKBNRwKQkq-": {
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
      "rnbqkb1rpppppppp1n62P1P388PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "b6d5",
            "san": "Nd5",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rpppppppp1n64P32P58PP1P1PPPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c4c5",
            "san": "c5",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rpppppppp83nP32P58PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d5b6",
            "san": "Nb6",
            "nr": 3
          }
        ]
      },
      "rn1qkb1rppp1pppp1n1p44P32PP2b15N2PP2BPPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp1n1p44P32PP2b15N2PP3PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 0
          }
        ]
      },
      "rn1qkb1rppp1pppp3p43nP32PP2b15N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5b6",
            "san": "Nb6",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rppp1pppp3p43nP33P2b15N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p43nP33P45N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p43nP33P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
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
      "rnbqkb1rpppppppp5n24P388PPPP1PPPRNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f6d5",
            "san": "Nd5",
            "nr": 4
          }
        ]
      },
      "rnbqkb1rpppppppp5n284P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppBpp884n38PPPP1PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp882B1n38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4f7",
            "san": "Bxf7+",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppppppp5n282B1P38PPPP1PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n26B14p32NP4PPP2PPPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n284p32NP4PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p44P32NP4PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppnpppp4P33p482N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppnpppp83pP382N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e6",
            "san": "e6",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23pP382N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d7",
            "san": "Nfd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p44P32N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n284P32N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppppppp5n284P38PPPP1PPPRNBQKBNRwKQkq-": {
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
      "rnbqkb1rpppp1ppp5n24p32B1PP28PPPP2PPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp84p32B1n32N5PPPP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp84p32B1n38PPPPNPPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2c3",
            "san": "Nec3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32B1P38PPPPNPPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp882BQn35N2PPP2PPPRNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp882Bpn35N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d4",
            "san": "Qxd4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n282BpP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n282BpP32P5PP3PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n282BpP38PPP2PPPRNBQK1NRwKQkq-": {
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
      "rnbqkb1rpppp1ppp5n24p32BPP38PPP2PPPRNBQK1NRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32B1P38PPPP1PPPRNBQK1NRwKQkq-": {
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
      "rnbqk2rppp2ppp5n22bBp33PP32P5PP3PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp2ppp5n22bBp34P32P5PP1P1PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp2ppp82bBp34P32P5PP1P1PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
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
      "rnbqk1nrpppp1ppp82b1p32BPP38PPP2PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rpppp1ppp5n22b1p32B1PP28PPPPQ1PPRNB1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rpppp1ppp5n22b1p32B1P38PPPPQPPPRNB1K1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b1p32B1P38PPPPQPPPRNB1K1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp84p31bB1P32P5P2P1PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp84p31bB1PP28P1PP2PPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp84p31bB1P38P1PP1PPPRNBQK1NRwKQkq-": {
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
      "rnbqk1nrpppp1ppp82b1p31PB1P38P1PP1PPPRNBQK1NRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5b4",
            "san": "Bxb4",
            "nr": 2
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b1p32B1PP28PPPP2PPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp82b1p32B1P38PPPP1PPPRNBQK1NRwKQkq-": {
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
      "rnbqkbnrpppp1ppp84p32B1P38PPPP1PPPRNBQK1NRbKQkq-": {
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
      "rnbqkb1rpppp1ppp84p32B1n32N2N2PPPP1PPPR1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp84p32B1n32N5PPPP1PPPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32B1P32N5PPPP1PPPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rppp2ppp2n2n22bPp382N3P1PPPPNPBPR1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rppp2ppp2n2n22bpp34P32N3P1PPPPNPBPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d5",
            "san": "exd5",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1p34P32N3P1PPPPNPBPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
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
      "rnbqk2rpppp1ppp5n22b1p34P32N3P1PPPP1PBPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqk2rpppp1ppp5n22b1p34P32N3P1PPPP1P1PR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p34P32N3P1PPPP1P1PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rppp2ppp83pP34n1b12N2N2PPPPQ1PPR1B1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp2ppp83pP34n1b12N2N2PPPP2PPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp2ppp83pP34n32N2N2PPPP2PPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rppp2ppp83NP2q83P1Nn1PPP4PR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1rppp2ppp83pP2q82NP1Nn1PPP4PR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nxd5",
            "nr": 0
          }
        ]
      },
      "rnb1kb1rppp2ppp83pP37q2NP1Nn1PPP4PR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h4h5",
            "san": "Qh5",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rppp2ppp83pP37q2NP2n1PPP4PR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rppp2ppp83pP34n2q2NP2P1PPP4PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4g3",
            "san": "Nxg3",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rppp2ppp83pP34n2q2NP4PPP3PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp83pP34n32NP4PPP3PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp83pP34n32N2Q2PPPP2PPR1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp83pP34n32N5PPPP2PPR1BQKBNRwKQkq-": {
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
      "rnbqkb1rppp2ppp5n23pP34P32N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23pp34PP22NP4PPP3PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n23pp34PP22N5PPPP2PPR1BQKBNRwKQkq-": {
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
      "rnbqkb1rpppp1ppp5n24p34PP22N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 4
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p34P32N5PPPP1PPPR1BQKBNRwKQkq-": {
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
      "r1bqkbnrpppp1ppp2n54p33PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n54p32B1nP22N2N2PPPP2PPR1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n54p32B1nP22N5PPPP2PPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p32B1PP22N5PPPP2PPR1BQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p32B1P32N5PPPP1PPPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "r1b1k1nrpppp1ppp2n2q22bNp32B1P1Q18PPPP1PPPR1B1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k1nrpppp1ppp2n2q22b1p32B1P1Q12N5PPPP1PPPR1B1K1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nd5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p32B1P1Q12N5PPPP1PPPR1B1K1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p32B1P32N5PPPP1PPPR1BQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1g4",
            "san": "Qg4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p32B1P32N5PPPP1PPPR1BQK1NRbKQkq-": {
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
      "r1bq1bnrpppp1k22n4p83PPppP2N5PPP3P1R1BQKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1bnrpppp1k22n4p84PppP2N5PPPP2P1R1BQKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1N22n4p84PppP2N5PPPP2P1R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8f7",
            "san": "Kxf7",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1p22n4p6N14PppP2N5PPPP2P1R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f7",
            "san": "Nxf7",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n56N14PppP2N5PPPP2P1R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n584PppP2N2N2PPPP2P1R1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n56p14Pp1P2N2N2PPPP2P1R1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1p1p2n56p13PPp22N2N2PPP3PPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1p1p2n56p14Pp22N2N2PPPP2PPR1BQKB1RwKQkq-": {
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
      "r1bqkbnrpppp1ppp2n584Pp22N2N2PPPP2PPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 2
          }
        ]
      },
      "r1b1kbnrpppp1ppp2n583PPp1q2N5PPP1K1PPR1BQ1BNRbkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrpppp1ppp2n583PPp1q2N5PPP3PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1e2",
            "san": "Ke2",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n583PPp22N5PPP3PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n584Pp22N5PPPP2PPR1BQKBNRwKQkq-": {
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
      "r1bqkbnrpppp1ppp2n54p34PP22N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 3
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P32N5PPPP1PPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrppp2ppp3p44p34PP22N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp3p44p34P32N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p34P32N5PPPP1PPPR1BQKBNRbKQkq-": {
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
      "r1bqk1nrpppp1ppp2n52b53pPP22P2N2PP4PPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n52b53pPP25N2PPP3PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b53pPP25N2PPP3PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b53pPP28PPP3PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp883pPP28PPP3PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b52B1P32p2N2PP3PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp82b54P32p2N2PP3PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b53pP32P2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp82b53pP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp883pP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8c5",
            "san": "Bc5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp883pP33B4PPP2PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp882BpP38PPP2PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp882B1P38PB3PPPRN1QK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp882B1P38Pp3PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bxb2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp882B1P32p5PP3PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3b2",
            "san": "cxb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp884P32p5PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp883pP32P5PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp883pP38PPP2PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppp1ppp84p33PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 5
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24N34P32N5PPPP1PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1Bpp2n54p34n32N2N2PPPP1PPPR1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n54p32B1n32N2N2PPPP1PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4f7",
            "san": "Bxf7+",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p32B1P32N2N2PPPP1PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n23N43pP35N2PPP2PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n2n283pP32N2N2PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nd5",
            "nr": 0
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n24N31b1PP32N5PPP2PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n24p31b1PP32N2N2PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p33PP32N2N2PPP2PPPR1BQKB1RbKQkq-": {
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
      "r1bqkb1rpppp1ppp2n2n24p34P32N2N2PPPP1PPPR1BQKB1RwKQkq-": {
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
      "r1bqkbnrpppp1ppp2n54p34P32N2N2PPPP1PPPR1BQKB1RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 4
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1p32B1P32P2N2PP1P1PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n581bBP42n2N2PP3PPPR1BQ1RK1wkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rppp1nppp3p1b23P42B1R1P15N2PP3P1PR1BQ2K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rppp1nppp3p1b23P42B1R35N2PP3PPPR1BQ2K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "r1bqk2rppppnppp5b23P42B1R35N2PP3PPPR1BQ2K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk2rppppnppp5b23P42B1n35N2PP3PPPR1BQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1e4",
            "san": "Rxe4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2b23P42B1n35N2PP3PPPR1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e7",
            "san": "Ne7",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2b23P42B1n35N2PP3PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n53P42B1n32b2N2PP3PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3f6",
            "san": "Bf6",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n582BPn32b2N2PP3PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqk2rpppp1ppp2n581bBPn32N2N2PP3PPPR1BQ1RK1bkq-": {
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
      "r1bqk2rpppp1ppp2n581bBPn32N2N2PP3PPPR1BQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n281bBPP32N2N2PP3PPPR1BQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 2
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n281bBPP35N2PP3PPPRNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b52BPP35N2PP3PPPRNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c5b4",
            "san": "Bb4+",
            "nr": 2
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b52BpP32P2N2PP3PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n22b52BpP32P2N2PP3PPPRNBQK2RwKQkq-": {
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
      "r1bqk2rpppp1ppp2n2n22b1p32BPP32P2N2PP3PPPRNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 3
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1p32B1P32P2N2PP1P1PPPRNBQK2RwKQkq-": {
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
      "r1bqk1nrpppp1ppp2n52b1p32B1P32P2N2PP1P1PPPRNBQK2RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 4
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1p32BPP35N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n22b1p32B1P35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p32B1P35N2PPPP1PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1b1k2rppppnppp2n3q1b3P32B5BQN2N2P4PPPR4RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k2rppppnppp2n3q1b3P32B51QN2N2P4PPPR1B2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1a3",
            "san": "Ba3",
            "nr": 0
          }
        ]
      },
      "r1b1k1nrpppp1ppp2n3q1b3P32B51QN2N2P4PPPR1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8e7",
            "san": "Nge7",
            "nr": 1
          }
        ]
      },
      "r1b1k1nrpppp1ppp2n3q1b3P32B51Qp2N2P4PPPRNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "r1b1k1nrpppp1ppp2n2q2b3P32B51Qp2N2P4PPPRNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g6",
            "san": "Qg6",
            "nr": 1
          }
        ]
      },
      "r1b1k1nrpppp1ppp2n2q2b72B1P31Qp2N2P4PPPRNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n5b72B1P31Qp2N2P4PPPRNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n5b72B1P32p2N2P4PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n5b72BpP32P2N2P4PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n5b72BpP32P2N2P4PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppp2ppp2np4b3p32BPP31QP2N2P4PPPRNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrppp2ppp2np4b3p32BPP32P2N2P4PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n5b3p32BPP32P2N2P4PPPRNBQK2RbKQkq-": {
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
      "r1bqk1nrppp2ppp2np4b72BpP31QP2N2P4PPPRNB2RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrppp2ppp2np4b72BpP32P2N2P4PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrppp2ppp2np4b3p32BPP32P2N2P4PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
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
      "r1bqk1nrppp2ppp1b1p4n5B12BPP32N2N2P4PPPR2Q1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrppp2ppp1b1p4n72BPP32N2N2P4PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrppp2ppp1bnp482BPP32N2N2P4PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6a5",
            "san": "Na5",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppp2ppp1bnp482BPP35N2P4PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppp2ppp2np42b52BPP35N2P4PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5b6",
            "san": "Bb6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrppp2ppp2np42b52BpP32P2N2P4PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b52BpP32P2N2P4PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n581bBPP35N2P2B1PPPRN1QK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n581bBPP35N2P4PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b52BPP35N2P4PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5b4",
            "san": "Bb4+",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b52BpP32P2N2P4PPPRNBQK2RwKQkq-": {
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
      "r1bqk1nrpppp1ppp2n54p31bB1P32P2N2P2P1PPPRNBQK2RbKQkq-": {
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
      "r1bqk1nrpppp1ppp2n54p31bB1P35N2P1PP1PPPRNBQK2RwKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 5
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n52b1p31PB1P35N2P1PP1PPPRNBQK2RbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "c5b4",
            "san": "Bxb4",
            "nr": 5
          }
        ]
      },
      "r1bqk1nrpppp1Bpp2n52b1p34P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n52b1p32BPP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n52b1p32B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
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
      "r3kb1rppp2ppp2n1b33q2B13pN35N2PPP2PPPR2QR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r3kb1rppp2ppp2n1b33q43pN35N2PPPB1PPPR2QR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "r3kb1rppp2ppp2n1b3q73pN35N2PPPB1PPPR2QR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "a5d5",
            "san": "Qd5",
            "nr": 1
          }
        ]
      },
      "r3kb1rppp2ppp2n1b3q73pN35N2PPP2PPPR1BQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "r1b1kb1rppp2ppp2n5q73pN35N2PPP2PPPR1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 1
          }
        ]
      },
      "r1b1kb1rppp2ppp2n5q73pn32N2N2PPP2PPPR1BQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "r1b1kb1rppp2ppp2n53q43pn32N2N2PPP2PPPR1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5a5",
            "san": "Qa5",
            "nr": 1
          }
        ]
      },
      "r1b1kb1rppp2ppp2n53q43pn35N2PPP2PPPRNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppp2ppp2n53B43pn35N2PPP2PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppp2ppp2n53p42Bpn32N2N2PPP2PPPR1BQR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppp2ppp2n53p42Bpn35N2PPP2PPPRNBQR1K1wkq-": {
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
      "r1bqkb1rpppp1ppp2n582Bpn35N2PPP2PPPRNBQR1K1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n582Bpn32N2N2PPP2PPPR1BQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n582Bpn35N2PPP2PPPRNBQ1RK1wkq-": {
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
      "r2qk2rppp2pPp2n1b32b52pp45N2PPP2PPPRNBQR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r3k2rppp2ppp2n1bP22b2qN12ppN38PPP2PPPR1BQR1K1bkq-": {
        "total": 0,
        "moves": []
      },
      "r3k2rppp2ppp2n1bP22b2qN12pp42N5PPP2PPPR1BQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3e4",
            "san": "Nce4",
            "nr": 0
          }
        ]
      },
      "r3k2rppp2ppp2n1bP22bq2N12pp42N5PPP2PPPR1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5f5",
            "san": "Qf5",
            "nr": 1
          }
        ]
      },
      "r3k2rppp2ppp2n1bP22bq2N12pp48PPP2PPPRNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r2qk2rppp2ppp2n1bP22b3N12pp48PPP2PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qd5",
            "nr": 1
          }
        ]
      },
      "r2qk2rppp2ppp2n1bP22b52pp45N2PPP2PPPRNBQR1K1wkq-": {
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
      "r1bqk2rppp2ppp2n2P22b52pp45N2PPP2PPPRNBQR1K1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 2
          }
        ]
      },
      "r1bqk2rppp2ppp2n2P22b52pp45N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1+",
            "nr": 2
          }
        ]
      },
      "r1bqk2rppp2ppp2n2P22bp42Bp45N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 2
          }
        ]
      },
      "r1bqk2rppp2ppp2n2n22bpP32Bp45N2PPP2PPPRNBQ1RK1wkqd6": {
        "total": 2,
        "moves": [{
            "uci": "e5f6",
            "san": "exf6",
            "nr": 2
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b1P32Bp45N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "r1bqk2rpppp1ppp2n2n22b52BpP35N2PPP2PPPRNBQ1RK1wkq-": {
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
      "r1bqkb1rpppp1ppp2n2n282BpP35N2PPP2PPPRNBQ1RK1bkq-": {
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
      "r1bqkb1rpppp1ppp2n2n282BpP35N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p32BPP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 6
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p32B1P32P2N2PP1P1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rp1p2Np12n2n1p1p1Pp388PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rp1p2pp12n2n1p1p1Pp1N188PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f7",
            "san": "Nxf7",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rp1p2ppp2n2n21p1Pp1N188PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rp1p2ppp2n2n21p1Pp1N12B58PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4f1",
            "san": "Bf1",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppp2ppp2n2n23Pp1N12B58PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
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
      "r1bqkb1rpppp1ppp2n2n24p1N12B1P38PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p32B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
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
      "r1bqkbnrpppp1ppp2n54p32B1P35N2PPPP1PPPRNBQK2RbKQkq-": {
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
      "r1bqkbnrpppp1ppp2n54p31P2P35N2P1PP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp84n33PP38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp84n34P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54N34P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24P33p45N2PPP1BPPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n2n283pP35N2PPP1BPPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p33PP35N2PPP1BPPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p34P35N2PPPPBPPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P35N2PPPPBPPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p34P32P2N2PP1P1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1b1kbnrppp2ppp2n51B1qN3Q3p32P5PP1P1PPPRNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrppp2ppp2n51B1qN34p32P5PP1P1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp2ppp2n51B2N34p32P5PP1P1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qd5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp2ppp2n51B2p34p32P2N2PP1P1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp2ppp2n51B1pp34P32P2N2PP1P1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp2ppp2n53pp34P32P2N2PP1P1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p34P32P2N2PP1P1PPPRNBQKB1RbKQkq-": {
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
      "r1bqkb1rpppp1ppp2n2n24P33N48PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n2n283NP38PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
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
      "r1bqkbnrpppp1ppp2n582B1P32p2N2PP3PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n584P32p2N2PP3PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n583pP32P2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c3",
            "san": "dxc3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n51B63pP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n2n24P32Bp45N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n52b3N12BpP38PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk1nrpppp1ppp2n52b52BpP35N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n582BpP35N2PPP2PPPRNBQK2RbKQkq-": {
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
      "r1bqkbnrpppp1ppp2n583pP35N2PPP2PPPRNBQKB1RwKQkq-": {
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
      "r1bqkbnrpppp1ppp882BpP38PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp883pP38PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp84p33NP38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp84p33nP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
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
            "nr": 5
          }, {
            "uci": "c6d4",
            "san": "Nxd4",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n51Bb1p31P2P35N2P1PP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n21Bb1p34P32P2N2PP1P1PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rpppp1ppp2n2n21Bb1p34P35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n51Bb1p34P35N2PPPP1PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqk1nrpppp1ppp2n51Bb1p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
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
      "r4rk12q1bpppp2p1n2npp1p33PP32P1NQ2PPB2PPPR1B1R1K1b--": {
        "total": 0,
        "moves": []
      },
      "r4rk12q1bpppp2p1n2npp1p33PP32P1Nb2PPB2PPPR1BQR1K1w--": {
        "total": 1,
        "moves": [{
            "uci": "d1f3",
            "san": "Qxf3",
            "nr": 0
          }
        ]
      },
      "r4rk12q1bpppp2p1n2npp1p33PP1b12P1NN2PPB2PPPR1BQR1K1b--": {
        "total": 1,
        "moves": [{
            "uci": "g4f3",
            "san": "Bxf3",
            "nr": 1
          }
        ]
      },
      "r4rk12q1bpppp2p1n2npp1p33PP1b12P2N2PPB2PPPR1BQRNK1w--": {
        "total": 1,
        "moves": [{
            "uci": "f1e3",
            "san": "Ne3",
            "nr": 1
          }
        ]
      },
      "r1b2rk12q1bpppp2p1n2npp1p33PP32P2N2PPB2PPPR1BQRNK1b--": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "r1b2rk12q1bpppp2p1n2npp1p33PP32P2N2PPBN1PPPR1BQR1K1w--": {
        "total": 1,
        "moves": [{
            "uci": "d2f1",
            "san": "Nf1",
            "nr": 1
          }
        ]
      },
      "r1b1k2r2q1bpppp2p1n2npp1p33PP32P2N2PPBN1PPPR1BQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1b1k2r2q1bpppp2p1n2npp1p33PP32P2N2PPB2PPPRNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1d2",
            "san": "Nbd2",
            "nr": 1
          }
        ]
      },
      "r1bqk2r4bpppp2p1n2npp1p33PP32P2N2PPB2PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8c7",
            "san": "Qc7",
            "nr": 1
          }
        ]
      },
      "r1bqk2r4bpppp2p1n2npp1p34P32P2N2PPBP1PPPRNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqk2r2p1bpppp2p1n2np2p34P32P2N2PPBP1PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r2p1bpppp2p1n2np2p34P31BP2N2PP1P1PPPRNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b3c2",
            "san": "Bc2",
            "nr": 1
          }
        ]
      },
      "r1bqk2r2p1bpppp1np1n21p2p34P31BP2N2PP1P1PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6a5",
            "san": "Na5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r2p1bpppp1np1n21p2p34P31B3N2PPPP1PPPRNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r1bqk2r2ppbpppp1n2n21p2p34P31B3N2PPPP1PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqk2r2ppbpppp1n2n21p2p3B3P35N2PPPP1PPPRNBQR1K1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "a4b3",
            "san": "Bb3",
            "nr": 1
          }
        ]
      },
      "r1bqk2r1pppbpppp1n2n24p3B3P35N2PPPP1PPPRNBQR1K1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "r1bqk2r1pppbpppp1n2n24p3B3P35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e1",
            "san": "Re1",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r2p2pppp1n51p1pp32PPn31B3N2PP3PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r2p2pppp1n1b31pn1P1N13p41BP5PP1N1PPPR1BQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1r2p2pppp1n1b31pn1P33p41BP2N2PP1N1PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g5",
            "san": "Ng5",
            "nr": 0
          }
        ]
      },
      "r2qkb1r2p2pppp1n1b31pnpP381BP2N2PP1N1PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r2qkb1r2p2pppp1n1b31pnpP381B3N2PPPN1PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "r2qkb1r2p2pppp1n1b31p1pP34n31B3N2PPPN1PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4c5",
            "san": "Nc5",
            "nr": 1
          }
        ]
      },
      "r2qkb1r2p2pppp1n1b31p1pP34n31B3N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1d2",
            "san": "Nbd2",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r2p2pppp1n51p1pP34n31B3N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8e6",
            "san": "Be6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1r2p2pppp1n51p1pp33Pn31B3N2PPP2PPPRNBQ1RK1wkq-": {
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
      "r1bqkb1r2pp1pppp1n51p2p33Pn31B3N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r2pp1pppp1n51p2p3B2Pn35N2PPP2PPPRNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "a4b3",
            "san": "Bb3",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r1ppp1pppp1n54p3B2Pn35N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r1ppp1pppp1n54p3B3n35N2PPPP1PPPRNBQ1RK1wkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "r1bqkb1r1ppp1pppp1n2n24p3B3P35N2PPPP1PPPRNBQ1RK1bkq-": {
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
      "r1bqkb1r1ppp1pppp1n2n24p3B3P32P2N2PP1P1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1r1ppp1pppp1n2n24p3B3P35N2PPPP1PPPRNBQK2RwKQkq-": {
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
      "r1bqkbnr2pp1Bppp7np2p34P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr2pp1pppp7np2p34P31B3N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b3f7",
            "san": "Bxf7+",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr2pp1pppp1n51p2p34P31B3N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6a5",
            "san": "Na5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr2pp1pppp1n51p2p3B3P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a4b3",
            "san": "Bb3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnr1ppp2ppp1n54pP2B75N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnr1ppp2ppp1n54pp2B3P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnr1ppp1pppp1n54p3B3P35N2PPPP1PPPRNBQK2RbKQkq-": {
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
      "r1bqkbnr1ppp1pppp1n51B2p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "b5a4",
            "san": "Ba4",
            "nr": 6
          }
        ]
      },
      "r1bqkbnrpppp2pp2n51B2pP285N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp2pp2n51B2pp24P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 0
          }
        ]
      },
      "r1b1kbnrppp2ppp2n51B1pN1q14P38PPPP1PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrppp2ppp2N51B1p2q14P38PPPP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrppp2ppp2n51B1pN1q14P38PPPP1PPPRNBQK2RwKQkq-": {
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
      "r1bqkbnrppp2ppp2n51B1pN34P38PPPP1PPPRNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d8g5",
            "san": "Qg5",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrppp2ppp2n51B1pp34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f3e5",
            "san": "Nxe5",
            "nr": 2
          }
        ]
      },
      "r1bqkbnrppp2ppp2np41B63pP35N2PPP2PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2np41B63pP35N2PPP2PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp2ppp2np41B2p33PP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp2ppp2np41B2p34P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n51B2p34P35N2PPPP1PPPRNBQK2RbKQkq-": {
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
      "r1bqkbnrpppp1ppp2n54p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
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
      "rnb1kbnQppppq2p6p184P38PPPP1PPPRNB1KB1RbKQq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppppq2p6p14Q34P38PPPP1PPPRNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5h8",
            "san": "Qxh8",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp3p6p14Q34P38PPPP1PPPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp3p6p14p2Q4P38PPPP1PPPRNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h5e5",
            "san": "Qxe5+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp84p2Q4P38PPPP1PPPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp84p34P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1h5",
            "san": "Qh5+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp5p24N34P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e5",
            "san": "fxe5",
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
      "rnb1kbnrpppp1ppp6q14p32B1P35N2PPPP1PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1ppp6q14p32B1P35N2PPPP1PPPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrpppp1ppp5q24p32B1P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g6",
            "san": "Qg6",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1ppp5q24p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppp3pp3p1q282NPp38PPP1BPPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp4p3p1qp182NPp38PPP1QPPPRNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp4p3p1qp17Q2NPp38PPP2PPPRNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h5e2",
            "san": "Qe2",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrppp3pp3p1q27Q2NPp38PPP2PPPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppp3pp3p1q283Pp34N3PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp3pp3p1q282NPp38PPP2PPPRNBQKB1RwKQkq-": {
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
      "rnb1kbnrppp3pp3p1q25p22NPP38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 3
          }
        ]
      },
      "rnb1kbnrppp3pp3p1q24Np23PP38PPP2PPPRNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e5c4",
            "san": "Nc4",
            "nr": 3
          }
        ]
      },
      "rnb1kbnrpppp2pp5q24Np23PP38PPP2PPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 3
          }
        ]
      },
      "rnb1kbnrpppp2pp5q282N1p33P4PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp2pp5q282N1p32N5PPPP1PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp2pp5q282N1p38PPPP1PPPRNBQKB1RwKQkq-": {
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
      "rnb1kbnrpppp2pp5q25p22N1P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 2
          }
        ]
      },
      "rnb1kbnrpppp2pp5q24Np24P38PPPP1PPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpppp2pp84Np24P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 5,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 5
          }
        ]
      },
      "rnbqkbnrpppp2pp84pP285N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp2pp2n54pP283P1N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp2pp2n54pp24P33P1N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp24P33P1N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp22P1P35N2PP1P1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp84pp24P1P15N2PPPP1P1PRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp84pp23PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp84pp22B1P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp84pp24P32N2N2PPPP1PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp84pp21P2P35N2P1PP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp84pp24P35N2PPPP1PPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrppp2ppp3p483pP32P2N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp3p482BpP35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp3p483pP35N2PPP2PPPRNBQKB1RwKQkq-": {
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
      "r1bqkb1rpppn1ppp3p1n24p33PP1P12N2N2PPP2P1PR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppn1ppp3p1n24p33PP32N2N2PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppn1ppp3p44p33PP32N2N2PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Ngf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppn1ppp3p44p33PP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp3pp3p44pp23PP32N2N2PPP2PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp3pp3p44pp23PP35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp3p44p33PP35N2PPP2PPPRNBQKB1RbKQkq-": {
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
      "rnbqkbnrppp2ppp3p44p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 4
          }
        ]
      },
      "rnbq1b1rppp2kpp3p1n282B1P38PPPP1PPPRNBQK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1b1rppp2kpp3p1n283PP38PPP2PPPRNBQKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1b1rppp2kpp3p1n284P38PPPP1PPPRNBQKB1RwKQ-": {
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
      "rnbqkb1rppp2Npp3p1n284P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e8f7",
            "san": "Kxf7",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rppp2ppp3p1n24N34P38PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5f7",
            "san": "Nxf7",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24N34P38PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp81B2P33pn35N2PPP2PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp84P33pn35N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24P33p45N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n283pP35N2PPP2PPPRNBQKB1RwKQkq-": {
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
      "rnbqkb1rpppp1ppp5n24p33PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 2
          }
        ]
      },
      "r1bqkb1rpppp1ppp2n2n24p33PP35N2PPP1QPPPRNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppp1ppp2n2n24p34P35N2PPPPQPPPRNB1KB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p34P35N2PPPPQPPPRNB1KB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32B1P35N2PPPP1PPPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n24p34P35N2PPPP1PPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpppp1ppp84p34P35N2PPPP1PPPRNBQKB1RbKQkq-": {
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
      "rnbq1bnrpppp1k27p83PPppP8PPP3P1RNBQKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1bnrpppp1k27p82B1PppP8PPPP2P1RNBQK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1bnrpppp1k27p84PppP8PPPP2P1RNBQKB1RwKQ-": {
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
      "rnbqkbnrpppp1N27p84PppP8PPPP2P1RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p27p6N14PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g5f7",
            "san": "Nxf7",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp1p1p86N14PppP8PPPP2P1RNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp1p27p4N34PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f7",
            "san": "Nxf7",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1p1p5n24N33PPppP8PPP3P1RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1p1p5n24N34PppP8PPPP2P1RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1p1p84N34PppP8PPPP2P1RNBQKB1RbKQkq-": {
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
      "rnbqkbnrpppp1p1p884PppP5N2PPPP2P1RNBQKB1RwKQkq-": {
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
      "rnbqkbnrpppp1p1p86p14Pp1P5N2PPPP2P1RNBQKB1RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrpppp1p1p882B1PppP5N2PPPP2P1RNBQK2RbKQkqh3": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1p1p83N42q1Pp25Q2PPPP2PPR1B2R1Kbkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1p1p882q1Pp22N2Q2PPPP2PPR1B2R1Kwkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nd5",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrpppp1p1p882BqPp22N2Q2PPPP2PPR1B2R1Kbkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4c4",
            "san": "Qxc4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1p1p882BqPp22N2Q2PPPP2PPR1B2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1h1",
            "san": "Kh1",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1p1p5q282B1Pp22N2Q2PPPP2PPR1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d4",
            "san": "Qd4+",
            "nr": 1
          }
        ]
      },
      "r1b1k2rppppnp1p2n4b4q32B2p22NP1Q2PPPB2PP4RRK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k2rppppnp1p2n4b4q32B2p22NP1Q2PPPB2PPR4RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "a1e1",
            "san": "Rae1",
            "nr": 0
          }
        ]
      },
      "rnb1k2rppppnp1p7b4q32B2p22NP1Q2PPPB2PPR4RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nbc6",
            "nr": 1
          }
        ]
      },
      "rnb1k2rppppnp1p7b4q32B2p22NP1Q2PPP3PPR1B2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "rnb1k1nrpppp1p1p7b4q32B2p22NP1Q2PPP3PPR1B2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 1
          }
        ]
      },
      "rnb1k1nrpppp1p1p7b4q32B2p23P1Q2PPP3PPRNB2RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1p1p84q32B2p23P1Q2PPP3PPRNB2RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8h6",
            "san": "Bh6",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1B1p84q35p25Q2PPPP2PPRNB2RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1p1p84q32B2p25Q2PPPP2PPRNB2RK1wkq-": {
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
      "rnb1kbnrpppp1p1p5q24P32B2p25Q2PPPP2PPRNB2RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6e5",
            "san": "Qxe5",
            "nr": 2
          }
        ]
      },
      "rnb1kbnrpppp1p1p5q282B1Pp25Q2PPPP2PPRNB2RK1wkq-": {
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
      "rnbqkbnrpppp1p1p882B1Pp25Q2PPPP2PPRNB2RK1bkq-": {
        "total": 3,
        "moves": [{
            "uci": "d8f6",
            "san": "Qf6",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpppp1p1p882B1Pp25p2PPPP2PPRNBQ1RK1wkq-": {
        "total": 3,
        "moves": [{
            "uci": "d1f3",
            "san": "Qxf3",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpppp1p1p882B1Ppp15N2PPPP2PPRNBQ1RK1bkq-": {
        "total": 3,
        "moves": [{
            "uci": "g4f3",
            "san": "gxf3",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpppp1p1p882BPPp25Q2PPP3PPRNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p882BPPB25p2PPP3PPRN1QK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p882BPPp25p2PPP3PPRNBQK2RwKQkq-": {
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
      "rnbqkbnrpppp1p1p882BPPpp15N2PPP3PPRNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g4f3",
            "san": "gxf3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp1B1p884Ppp15N2PPPP2PPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p882B1Ppp12N2N2PPPP2PPR1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p84N32B1Ppp18PPPP2PPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p882B1Ppp15N2PPPP2PPRNBQK2RwKQkq-": {
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
      "rnbqk1nbpp3p22pp44N1p12BPPp22N5PPP3P1R1BQK3bQq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nbpp3p22pp46p12BPPp22N2N2PPP3P1R1BQK3wQq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nbppp2p23p46p12BPPp22N2N2PPP3P1R1BQK3bQq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nbppp2p23p46p12BPPp25N2PPP3P1RNBQK3wQq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nRppp2pb13p46p12BPPp25N2PPP3P1RNBQK3bQq-": {
        "total": 1,
        "moves": [{
            "uci": "g7h8",
            "san": "Bxh8",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2pb13p46p12BPPp25N2PPP3P1RNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h1h8",
            "san": "Rxh8",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2pb13p3p6P12BPPp25N2PPP3P1RNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h6g5",
            "san": "hxg5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2pb13p3p6p12BPPp1P3Q1N2PPP3P1RNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2pb13p3p6p12BPPp1P5N2PPP3P1RNBQK2RwKQkq-": {
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
      "rnbqk1nrpppp1pb17p6p12BPPp1P5N2PPP3P1RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "rnbqk1nrpppp1pb17p6p12B1Pp1P5N2PPPP2P1RNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqk1nrpppp1pbp86p12B1Pp1P5N2PPPP2P1RNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 2
          }
        ]
      },
      "rnbqk1nrpppp1pbp86p12B1Pp25N2PPPP2PPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2pbp3p46p12BPPp22P2N2PP4PPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2pbp3p46p12BPPp25N2PPP3PPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1pbp86p12BPPp25N2PPP3PPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1pbp86p12B1Pp25N2PPPP2PPRNBQK2RwKQkq-": {
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
      "rnbqkbnrpppp1p1p86p12B1Pp25N2PPPP2PPRNBQK2RbKQkq-": {
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
      "rnbqkbnrpppp1p1p86p14Pp22N2N2PPPP2PPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1p1p84N33PPppq6P1PPP4PRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1p1p84N33PPppq8PPP3PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1p1p84N33PPpp18PPP3PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8h4",
            "san": "Qh4+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1p1p883PPpp12N2N2PPP3PPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p883PPBp15N2PPP3PPRN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1p1p883PPpp15N2PPP3PPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpppp1p1p86p13PPp25N2PPP3PPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g5g4",
            "san": "g4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpppp1p1p86p14Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
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
      "rnbqk1nrpppp1ppp882B1P2b5N2PPPP3pRNBQ1R1Kbkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp882B1P2b5N2PPPP3pRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1h1",
            "san": "Kh1",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpppp1ppp882B1P2b5Np1PPPP3PRNBQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "g3h2",
            "san": "gxh2+",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp882B1P2b5Np1PPPP3PRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp882B1Pp1b5NP1PPPP3PRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f4g3",
            "san": "fxg3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpppp1ppp882B1Pp1b5N2PPPP2PPRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppppbppp882B1Pp25N2PPPP2PPRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7h4",
            "san": "Bh4+",
            "nr": 1
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
      "rnbqkbnrppp2ppp3p481P2Pp25N2P1PP2PPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp3p1n283PPp23B1N2PPP3PPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp3p1n283PPp25N2PPP3PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp3p483PPp25N2PPP3PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp3p484Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
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
      "rnbqkb1rpppp1ppp84P2n5pP15N2PPPP3PRNBQKB1RbKQkqg3": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp84P2n5p25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24P35p25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6h5",
            "san": "Nh5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n284Pp25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp884Pp25N2PPPP2PPRNBQKB1RbKQkq-": {
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
      "rnbqkbnrpppp1ppp884Pp28PPPPQ1PPRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n282B1Pp22N5PPPP2PPR1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n282B1Pp28PPPP2PPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnb1k2rppppnpbp86p12BPPp1q2N3P1PPP4PR1BQ1KNRbkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k2rppppnpbp86p12BPPp1q2N5PPP3PPR1BQ1KNRwkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 0
          }
        ]
      },
      "rnb1k1nrpppp1pbp86p12BPPp1q2N5PPP3PPR1BQ1KNRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 1
          }
        ]
      },
      "rnb1k1nrpppp1pbp86p12B1Pp1q2N5PPPP2PPR1BQ1KNRwkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1p1p86p12B1Pp1q2N5PPPP2PPR1BQ1KNRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1p1p86p12B1Pp1q8PPPP2PPRNBQ1KNRwkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1ppp882B1Pp1q8PPPP2PPRNBQ1KNRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g5",
            "san": "g5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1ppp882B1Pp1q8PPPP2PPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1f1",
            "san": "Kf1",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp882B1Pp28PPPP2PPRNBQK1NRbKQkq-": {
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
      "rnbqkbnrpppp1ppp884Pp25Q2PPPP2PPRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp87Q4Pp28PPPP2PPRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884PpQ18PPPP2PPRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp27NPPPP2PPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp26P1PPPP3PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp22N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp21P6P1PP2PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp28PPPPN1PPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp883PPp28PPP3PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp81B64Pp28PPPP2PPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp1P8PPPP2P1RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp28PPPPB1PPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp28PPPP1KPPRNBQ1BNRbkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp884Pp28PPPP2PPRNBQKBNRwKQkq-": {
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
      "rn1qk1nrppp2ppp82b1p3Q3P1b12P2N2PP1P2PPRNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qk1nrppp2ppp82b1p34P1b12P2N2PP1P2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4+",
            "nr": 0
          }
        ]
      },
      "rn1qk1nrppp2ppp3p42b1P34P1b12P2N2PP1P2PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d6e5",
            "san": "dxe5",
            "nr": 1
          }
        ]
      },
      "rn1qk1nrppp2ppp3p42b1p34PPb12P2N2PP1P2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f4e5",
            "san": "fxe5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2ppp3p42b1p34PP22P2N2PP1P2PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp2ppp3p42b1p31P2PP25N2P1PP2PPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp2ppp3p42b1p34PP25N2PPPP2PPRNBQKB1RwKQkq-": {
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
      "rnbqk1nrpppp1ppp82b1p34PP25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
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
      "rnb1kbnrpppp1ppp84p33PPq22N5PPP3PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrpppp1ppp84p34Pq22N5PPPP2PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrpppp1ppp5q24p34PP22N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6f4",
            "san": "Qxf4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrpppp1ppp5q24p34PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp81B1P44pP28PPPP2PPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n23P44PP28PPP3PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n23P44pP23P4PPPN2PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n23P44pP23P4PPP1Q1PPRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n23P44pP23P4PPP3PPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrppp2ppp83P44pP23P4PPP3PPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrppp2ppp83P44pP28PPPP2PPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrppp2ppp83Pp35P28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp34PP25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83pp33PPP28PPP3PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83pp34PP28PPPP2PPRNBQKBNRwKQkq-": {
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
      "rnb1kbnrppppq2p6P17Q5p28PPPP2PPRNBK1BNRbkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppppq2p6P17Q5p28PPPP2PPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1d1",
            "san": "Kd1",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp3p6P17Q5p28PPPP2PPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7+",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp3p6p15P1Q5p28PPPP2PPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5g6",
            "san": "fxg6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp85P1Q5p28PPPP2PPRNB1KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp3pp3b43p1P23P1p23B1N2PPP3PPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp3pp3b43p1P23P1p25N2PPP3PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp3pp83p1P23P1p25N2PPP3PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8d6",
            "san": "Bd6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp3pp83p1P25p25N2PPPP2PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp85P25p25N2PPPP2PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp85P25p28PPPP2PPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppp2pp84pP25P28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp2pp84pp24PP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e4f5",
            "san": "exf5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p34PP28PPPP2PPRNBQKBNRbKQkq-": {
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
      "rnbqk1nrpppp1ppp81Bb1p31P2P38P1PP1PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpppp1ppp81Bb1p34P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n21B2p33PP38PPP2PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n21B2p34P38PPPP1PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp81B2p34P38PPPP1PPPRNBQK1NRbKQkq-": {
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
      "rnbqkbnrpppp1ppp84p34P38PPPP1PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrppppp1pp85p24P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppppppbp6p183PP38PPPB1PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppppppbp6p183PP33B4PPP2PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k1nrpp1pppbp6p1q1pP44P32N2N2PPP2PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1k1nrpp1pppbp6p1q1p53PP32N2N2PPP2PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrpp1pppbp6p12p53PP32N2N2PPP2PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrpp1pppbp6p12p53PP32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppppppbp6p183PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppppppbp6p183PP38PPP2PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppppp1p6p183PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpppppp1p6p184P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 3
          }
        ]
      },
      "r1bqkb1rppp1pppp2npP2n83P45N1PPPP2PP1RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rppp1pppp2np3n4P33P45N1PPPP2PP1RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e6",
            "san": "e6",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rppp1pppp2np44P33P2n15N1PPPP2PP1RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4h6",
            "san": "Nh6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rppp1pppp2np44P33P2n15N2PPP2PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h3",
            "san": "h3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppppppp2n54P33P2n15N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppppppp2n54P36n15N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppppppp2n2n24P385N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6g4",
            "san": "Ng4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppppppp2n2n284P35N2PPPP1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppppppp2n584P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p43PP34B3PPP2PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83P44p32N2P2PPP3PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83P44p32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53P44p32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pppp2n583Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p43PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrppp1pppp2n53q43P42N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrppp1pppp2n53q43P48PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53P43P48PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p43PP38PPP2PPPRNBQKBNRwKQkq-": {
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
      "r1bqkbnrpppppppp2n583PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 3
          }
        ]
      },
      "r1bqkbnrpppppppp2n581P2P38P1PP1PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppppppp2n584P38PPPP1PPPRNBQKBNRwKQkq-": {
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
      "rn1qkbnrpbpppppp1p66B13PP38PPP2PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpbpppppp1p683PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpbpppppp1p683PP38PPP2PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrp1pppppp1p683PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrp1pppppp1p684P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rppp1pppp3p1n283PP35N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp3p1n283PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
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
      "rnbqkbnrppp1pppp3p484P38PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp884P38PPPP1PPPRNBQKBNRbKQkq-": {
        "total": 230,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 4
          }, {
            "uci": "c7c6",
            "san": "c6",
            "nr": 13
          }, {
            "uci": "e7e6",
            "san": "e6",
            "nr": 15
          }, {
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
            "uci": "f7f5",
            "san": "f5",
            "nr": 0
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
          }
        ]
      },
      "rn1qkbnrppp2ppp83p486PBPPPPP3RNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrppp2ppp83p486pBPPPPP2PRNBQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2g3",
            "san": "hxg3",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrppp2ppp83p45p26PBPPPPP2PRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrppp2ppp83p45p26PBPPPPP2PRNBQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrppp2ppp83pp35P26PBPPPPP2PRNBQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp2ppp83pp35P26PbPPPPP2PRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1h3",
            "san": "Bxh3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp35P26PNPPPPP2PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8h3",
            "san": "Bxh3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp386PNPPPPPP1PRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p486PNPPPPPP1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p487NPPPPPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8887NPPPPPPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1ppppppp8p71P6P72PPPPPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1ppppppp8p78P71PPPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppppppp888P71PPPPPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a5",
            "san": "a5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pp1p6p183Pp32P2P2PP4PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pp1p6p183Pp35P2PPP3PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pp1p6p13p43PP35P2PPP3PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pp1p6p13p44P35P2PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p44P35P2PPPP2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p485P2PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp884p32N2P2PPPP2PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp884p35P2PPPP2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p24P35P2PPPP2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp85p285P2PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8885P2PPPPP1PPRNBQKBNRbKQkq-": {
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
      "rn1qkb1r3ppp1pb4np12pP45P22N5PP2P1PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r3ppp1pb4np12pP482N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r3ppp1pP4np12pP482N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8a6",
            "san": "Bxa6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r3ppp1pP4np12pP488PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rn1qk2r4ppbpb2p1np12pP482N2NP1PP2PPBPR1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qk2r4ppbpb2p1np12pP482N2NP1PP2PP1PR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 0
          }
        ]
      },
      "rn1qkb1r4pp1pb2p1np12pP482N2NP1PP2PP1PR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r4pp1pb2p1np12pP482N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r3ppp1pb4np12pP482N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rn1q1rk14ppbp3p1np12pP44P32N2NP1PP3PKPR1BQ3Rb--": {
        "total": 0,
        "moves": []
      },
      "rn1q1rk14ppbp3p1np12pP44P32N3P1PP3PKPR1BQ2NRw--": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rn1qk2r4ppbp3p1np12pP44P32N3P1PP3PKPR1BQ2NRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rn1qk2r4ppbp3p1np12pP44P32N3P1PP3P1PR1BQ1KNRwkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Kg2",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r4pp1p3p1np12pP44P32N3P1PP3P1PR1BQ1KNRbkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 1
          }
        ]
      },
      "rn1qkb1r4pp1p3p1np12pP44P32N5PP2NPPPR1BQ1K1Rbkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1r4pp1p3p1np12pP44P32N5PP3PPPR1BQ1KNRwkq-": {
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
      "rn1qkb1r4pppp3p1n22pP44P32N5PP3PPPR1BQ1KNRbkq-": {
        "total": 2,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r4pppp3p1n22pP44P32N5PP3PPPR1BQKbNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1f1",
            "san": "Kxf1",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r4ppppb2p1n22pP44P32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "a6f1",
            "san": "Bxf1",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r4ppppb2p1n22pP482N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 2
          }
        ]
      },
      "rn1qkb1r3pppppb4n22pP482N5PP2PPPPR1BQKBNRbKQkq-": {
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
      "rn1qkb1r3pppppb4n22pP488PP2PPPPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 3
          }
        ]
      },
      "rnbqkb1r3pppppP4n22pP488PP2PPPPRNBQKBNRbKQkq-": {
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
      "rnbqkb1r3pppppp4n21PpP485P2PP2P1PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r3pppppp4n21PpP484P3PP3PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r3ppppppP3n22pP488PP2PPPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r3ppppp5n21NpP41p2P38PP3PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r3ppppp5n22pP41p2P32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3b5",
            "san": "Nb5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r3ppppp5n21ppP44P32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5b4",
            "san": "b4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r3ppppp5n21ppP482N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r3pppppp4n21PpP482N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a6b5",
            "san": "axb5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r3pppppp4n21PpP488PP2PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkb1rp2ppppp5n21PpP488PP2PPPPRNBQKBNRbKQkq-": {
        "total": 8,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 8
          }
        ]
      },
      "rnbqkb1rp2ppppp5n21ppP2B12P58PP2PPPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2ppppp5n21ppP42P1P38PP3PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2ppppp5n21ppP42P55N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2ppppp5n21ppP42P55P2PP2P1PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2ppppp5n21ppP42P58PP1NPPPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2ppppp5n21ppP4P1P581P2PPPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2ppppp5n21ppP42P3P18PP2PP1PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2ppppp5n21ppP42P58PP2PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkb1rpp1ppppp5n22pP42P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 15,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 15
          }
        ]
      },
      "rnbqkb1rpp1ppppp5n22p52PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 15,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 15
          }
        ]
      },
      "rnbqkb1rp2p1ppp4pn21ppP2B12P55N2PP2PPPPRN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2p1ppp4pn21ppP42P55N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp1p1ppp4pn22pP42P55N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1p1ppp4pn22p52PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rn1q1rk1pbppbppp1p3n23p42P4N6P1PP2PPBPRNBQ1RK1b--": {
        "total": 0,
        "moves": []
      },
      "rn1q1rk1pbppbppp1p3n23p42PN46P1PP2PPBPRNBQ1RK1b--": {
        "total": 0,
        "moves": []
      },
      "rn1q1rk1pbppbppp1p3n23p42P55NP1PP2PPBPRNBQ1RK1w--": {
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
      "rn1q1rk1pbppbppp1p2pn23P42P55NP1PP2PPBPRNBQ1RK1b--": {
        "total": 2,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 2
          }
        ]
      },
      "rn1q1rk1pbppbppp1p2pn282PP45NP1PP2PPBPRNBQ1RK1w--": {
        "total": 2,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 2
          }
        ]
      },
      "rn1qk2rpbppbppp1p2pn282PP45NP1PP2PPBPRNBQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "rn1qk2rpbppbppp1p2pn282PP45NP1PP2PPBPRNBQK2RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "rn1qkb1rpbpp1ppp1p2pn282PP45NP1PP2PPBPRNBQK2RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 2
          }
        ]
      },
      "rn1qkb1rpbpp1ppp1p2pn282PP45NP1PP2PP1PRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rp1pp1ppp1p2pn282PP45NP1PP2PP1PRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 2
          }
        ]
      },
      "rn1qkb1rpbp2ppp1p2p33n43PP3P1N2N21P3PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rpbp2ppp1p2p33n43P4P1N2N21P2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rn1qkb1rpbp2ppp1p2pn23P43P4P1N2N21P2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d5",
            "san": "Nxd5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rpbp2ppp1p2pn23p42PP4P1N2N21P2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rpbpp1ppp1p2pn282PP4P1N2N21P2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rpbpp1ppp1p2pn282PP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp1pp1ppp1p2pn282PP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp1pp1ppp1p2pn282PP45N2PP2PPPPRNBQKB1RwKQkq-": {
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
      "rnbqkb1rpppp1ppp4pn282PP45N2PP2PPPPRNBQKB1RbKQkq-": {
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
      "rnbqkb1rpppp1ppp4pn282PP2P18PP2PP1PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp4pn282PP48PP2PPPPRNBQKBNRwKQkq-": {
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
      "rnb2rk1ppB1ppbp6p13q43P44P3PP3PPPR2QKBNRbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnb2rk1ppp1ppbp6p13q43P1B24P3PP3PPPR2QKBNRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f4c7",
            "san": "Bxc7",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1ppp1ppbp6p13N43P1B24P3PP3PPPR2QKBNRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp1ppbp6p13n43P1B22N1P3PP3PPPR2QKBNRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c3d5",
            "san": "Nxd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp1ppbp5np13P43P1B22N1P3PP3PPPR2QKBNRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f6d5",
            "san": "Nxd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp1ppbp5np13p42PP1B22N1P3PP3PPP2RQKBNRbK-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1ppp1ppbp5np13p42PP1B22N1P3PP3PPPR2QKBNRwKQ-": {
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
      "rnbqkb1rppp1pp1p5np13p42PP2P12N5PP2PP1PR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pp1p5np13p42PP3P2N5PP2PPP1R1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pp1p5np13p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
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
      "rnbq1rk1pp3pbp3p1np12ppP32P2P22N2N2PP2B1PPR1BQK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1pp3pbp3p1np12pp42P1PP22N2N2PP2B1PPR1BQK2RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1pp3pbp3ppnp12pP42P1PP22N2N2PP2B1PPR1BQK2RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1pp3pbp3ppnp12pP42P1PP22N5PP2B1PPR1BQK1NRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1pp2ppbp3p1np12pP42P1PP22N5PP2B1PPR1BQK1NRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1pp2ppbp3p1np12p52PPPP22N5PP2B1PPR1BQK1NRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp1ppbp3p1np182PPPP22N5PP2B1PPR1BQK1NRbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp1ppbp3p1np182PPPP22N5PP4PPR1BQKBNRwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1ppbp3p1np182PPPP22N5PP4PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppn2bp3p2n12PPp1p14Pp22N2P2PP2BBPP2RQNRK1b--": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pppn2bp3p2n13Pp1p12P1Pp22N2P2PP2BBPP2RQNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "c4c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1pppnn1bp3p43Pp1p12P1Pp22N2P2PP2BBPP2RQNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "e7g6",
            "san": "Ng6",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppnn1bp3p43Pp1p12P1Pp22N2P2PP2BBPPR2QNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppnn1bp3p2p13Pp32P1Pp22N2P2PP2BBPPR2QNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "g6g5",
            "san": "g5",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppnn1bp3p2p13Pp32P1Pp22N1BP2PP2B1PPR2QNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "e3f2",
            "san": "Bf2",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppnn1bp3p2p13Ppp22P1P32N1BP2PP2B1PPR2QNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "f5f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppnn1bp3p2p13Ppp22P1P32N1B3PP2BPPPR2QNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppnnpbp3p2p13Pp32P1P32N1B3PP2BPPPR2QNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppnnpbp3p2p13Pp32P1P32N5PP2BPPPR1BQNRK1w--": {
        "total": 1,
        "moves": [{
            "uci": "c1e3",
            "san": "Be3",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1ppp1npbp3p1np13Pp32P1P32N5PP2BPPPR1BQNRK1b--": {
        "total": 1,
        "moves": [{
            "uci": "f6d7",
            "san": "Nd7",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1ppp1npbp3p1np13Pp32P1P32N2N2PP2BPPPR1BQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "f3e1",
            "san": "Ne1",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1ppp2pbp2np1np13Pp32P1P32N2N2PP2BPPPR1BQ1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "c6e7",
            "san": "Ne7",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1ppp2pbp2np1np14p32PPP32N2N2PP2BPPPR1BQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp2pbp3p1np14p32PPP32N2N2PP2BPPPR1BQ1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp2pbp3p1np14p32PPP32N2N2PP2BPPPR1BQK2RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp1ppbp3p1np182PPP32N2N2PP2BPPPR1BQK2RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp1ppbp3p1np182PPP32N2N2PP3PPPR1BQKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1ppbp3p1np182PPP32N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1ppbp3p1np182PPP32N5PP3PPPR1BQKBNRwKQkq-": {
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
      "rnbqk2rppppppbp5np182PPP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 2
          }
        ]
      },
      "rnbqk2rppppppbp5np182PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppppp1p5np182PP42N5PP2PPPPR1BQKBNRbKQkq-": {
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
      "rnbqkb1rpppppp1p5np182PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 6
          }
        ]
      },
      "r1bqkb1rpppppppp5n23Pn32P2P28PP2P1PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppppppp5n23Pn32P58PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppppppp2n2n23P42P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6e5",
            "san": "Ne5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppppppp2n2n282PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p1n282PP2P18PP2PP1PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp3p1n25b22PPP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp3p1n25b22PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp3p1n282PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p1n282PP48PP2PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkb1rpppppppp5n282PP48PP2PPPPRNBQKBNRbKQkq-": {
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
      "rnbqkb1rpppppppp5n283PP35P2PPP4PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp5n283P45P2PPP1P2PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppppppp883P2n15P2PPP1P2PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p1n283PP32N5PPP1BP1PR1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp3p1n283PP38PPP1BP1PRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp3p483PP1n18PPP1BP1PRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp3p483PP1n18PPP2P1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1e2",
            "san": "Be2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp883PP1n18PPP2P1PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp883P2n18PPP1PP1PRNBQKBNRwKQkq-": {
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
      "rnbqkb1rpppppppp5n283P2P18PPP1PP1PRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6g4",
            "san": "Nxg4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppppppp5n26B13P43B4PPP2PPPRN1QK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp5n283P43B4PPP2PPPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppppppp883Pn33B4PPP2PPPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp883Pn38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n283PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6e4",
            "san": "Nxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p43PP35P2PPP3PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n23p43P45P2PPP1P1PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppppppp5n283P45P2PPP1P1PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp2p1ppp1p2pn22pP2B184PN2PPP2PPPRN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp2p1ppp1p2pn22p3B13P44PN2PPP2PPPRN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp1p1ppp4pn22p3B13P44PN2PPP2PPPRN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1p1ppp4pn22p3B13PP35N2PPP2PPPRN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp1p1ppp4pn22p3B13P45N2PPP1PPPPRN1QKB1RwKQkq-": {
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
      "rnbqkb1rpppp1ppp4pn26B13P45N2PPP1PPPPRN1QKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn283P45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppppppp5n283P45N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 2
          }
        ]
      },
      "rn1qkb1rppp1pppp5n23p1b23PP2B2N2P2PPP3PPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp5n23p1b23P3B2N2P2PPP1P1PPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p43P3B2N2P2PPP1P1PPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p43P3B5P2PPP1P1PPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp83p43Pn2B5P2PPP1P1PPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp83p43Pn2B8PPP1PPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rpp2pppp2p5q2p43PP2B2P5PP1Q1PPPR3KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1rpp2pppp2p5q2p43P3B2P5PP1QPPPPR3KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnb1kb1rpp1ppppp2p5q73P3B2P5PP1QPPPPR3KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rpp1ppppp2p5q73P3B2P5PP1nPPPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d2",
            "san": "Qxd2",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rpp1ppppp2p5q73Pn2B2P5PP1NPPPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4d2",
            "san": "Nxd2",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rpp1ppppp2p5q73Pn2B8PPPNPPPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1ppppp2p583Pn2B8PPPNPPPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1ppppp2p583Pn2B8PPP1PPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1d2",
            "san": "Nd2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp883Pn2B8PPP1PPPPRN1QKBNRbKQkq-": {
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
      "rnbqkb1rpppppppp86B13Pn38PPP1PPPPRN1QKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g5h4",
            "san": "Bh4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpppppppp5n26B13P48PPP1PPPPRN1QKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpp2pp1p5p22pP44p32N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pp1p5p22p53Pp32N5PPP2PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp2pp1p5p22pp43PP32N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pp1p5p22pp43P42N5PPP1PPPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp5B22pp43P42N5PPP1PPPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7f6",
            "san": "gxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp5n22pp2B13P42N5PPP1PPPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f6",
            "san": "Bxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p2B13P42N5PPP1PPPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p43P42N5PPP1PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n283P42N5PPP1PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n283P48PPP1PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpp1ppppp82P588PPP1PPPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1pp1pp82pP1p24P38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1pp1pp82pP1p288PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp82pP488PPP1PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p51P1P48P1P1PPPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp881P1p45N2P1P1PPPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp883p45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
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
      "rnbqkbnrpp1ppppp882Pp44P3PP3PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp882Pp48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p52PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p53P48PPP1PPPPRNBQKBNRwKQkq-": {
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
      "rnbqk2rppp1ppbp5np182BP3P2N2N2PPP3P1R1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1ppp1ppbp5np182BP42N2N2PPP3PPR1BQ1R1Kb--": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1ppp1ppbp5np182BP42N2N2PPP3PPR1B1QRK1b--": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1ppp1ppbp5np182BP42N2N2PPP3PPR1BQ1RK1w--": {
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
      "rnbqk2rppp1ppbp5np182BP42N2N2PPP3PPR1BQ1RK1bkq-": {
        "total": 2,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 2
          }
        ]
      },
      "rnbqk2rppp1ppbp5np14N32BP42N5PPP3PPR1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp1ppbp5np182BP42N2N2PPP3PPR1BQK2RwKQkq-": {
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
      "rnbqkb1rppp1pp1p5np182BP42N2N2PPP3PPR1BQK2RbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f8g7",
            "san": "Bg7",
            "nr": 4
          }
        ]
      },
      "rnbqkb1rppp1pp1p5np183P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 4
          }
        ]
      },
      "r1bqk2rppp1bppp4pn26B13n42NB1N2PPP3PPR2Q1R1Kbkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqk2rppp1bppp4pn26B13n42NB1N2PPP3PPR2Q1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1h1",
            "san": "Kh1",
            "nr": 0
          }
        ]
      },
      "r1bqk2rppp1bppp2n1pn26B13P42NB1N2PPP3PPR2Q1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6d4",
            "san": "Nxd4",
            "nr": 1
          }
        ]
      },
      "r1bqk2rppp1bppp2n1pn26B13P42NB1N2PPP3PPR2QK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1bppp4pn26B13P42NB1N2PPP3PPR2QK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1bppp4pn26B13P42N2N2PPP3PPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn26B13P42N2N2PPP3PPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn283P42N2N2PPP3PPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n283P42N2N2PPP3PPR1BQKB1RbKQkq-": {
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
      "rnbqkb1rppp1pppp5n283P42N2Q2PPP3PPR1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n283P42N2p2PPP3PPR1BQKBNRwKQkq-": {
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
      "rnbqkb1rppp1pppp5n283Pp32N2P2PPP3PPR1BQKBNRbKQkq-": {
        "total": 6,
        "moves": [{
            "uci": "e4f3",
            "san": "exf3",
            "nr": 6
          }
        ]
      },
      "rnbqkb1rppp1pppp5n283Pp32N1B3PPP2PPPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qk2rppp2ppp5pb11Q61b1Pp1P12N5PPP2P1PR3KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qk2rppp2ppp5pb181b1Pp1P12N5PPP1QP1PR3KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2b5",
            "san": "Qb5+",
            "nr": 0
          }
        ]
      },
      "rn1qkb1rppp2ppp5pb183Pp1P12N5PPP1QP1PR3KBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rppp2ppp5pb183Pp1P12N5PPP2P1PR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1e2",
            "san": "Qe2",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rppp2ppp5p25b23Pp1P12N5PPP2P1PR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5g6",
            "san": "Bg6",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rppp2ppp5p25b23Pp32N5PPP2PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rppp1pppp5B25b23Pp32N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7f6",
            "san": "exf6",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rppp1pppp5n25bB13Pp32N5PPP2PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f6",
            "san": "Bxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n26B13Pp32N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n283Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrppp2ppp84p33Pp32N1B3PPP2PPPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84P34p32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p33Pp32N5PPP1NPPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p33PN38PPP2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p2Q3Pp32N5PPP2PPPR1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p33Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
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
      "rn1qkb1rppp1pppp5n25b22BPp32N2P2PPP3PPR1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkb1rppp1pppp5n25b23Pp32N2P2PPP3PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bc4",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrppp1pppp85b23Pp32N2P2PPP3PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp1pppp85b23Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp883Pp32N5PPP2PPPR1BQKBNRbKQkq-": {
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
      "rnbqkbnrppp1pppp883Pp34B3PPP2PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp882BPp38PPP2PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp883Pp35P2PPP3PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp883Pp38PPP2PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrppp1pppp83p43PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 17,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 17
          }
        ]
      },
      "rnbqkbnrpp2pppp83p43p45NP1PPP1PPBPRNBQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp83p43p45NP1PPP1PP1PRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp43P45NP1PPP1PP1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp43P45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p382pP42N2NP1PP2PP1PR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp2p1p382pP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g3",
            "san": "g3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p33p42PP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p33p42PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p42PP45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p43P45N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p43P45N2PPP1PPPPRNBQKB1RbKQkq-": {
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
      "rnbqkbnrpp2pppp82pp43PPB28PPP2PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82pp43P1B28PPP1PPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp83p43P1B28PPP1PPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p43P2P18PPP1PP1PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp88Q1pP48PP2PPPPRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1pp1ppppp782pPP35N2PP3PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1pp1ppppp782pP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r1pp1ppppp4n282pPP32N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r1pp1ppppp4n282pP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n282pP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r1p3pppp3pn22p52BP44PN2PP2QPPPRNB2RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r1p3pppp3pn22p5P1BP44PN21P3PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r1p3pppp3pn22p52BPP35N2PP3PPPRNBQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r1p3pppp3pn22p52BP44PN2PP3PPPRNBQ1RK1wkq-": {
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
      "rnbqkb1rpp3ppp4pn22p52BP44PN2PP3PPPRNBQ1RK1bkq-": {
        "total": 3,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22p52BP44PN2PP3PPPRNBQK2RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn282BP44PN2PP3PPPRNBQK2RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn282pP44PN2PP3PPPRNBQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "f1c4",
            "san": "Bxc4",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rppp1pppp5n282pP44PN2PP3PPPRNBQKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rppp1pppp5n28Q1pP45N2PP2PPPPRNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n282pP45N2PP2PPPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrppp1pppp882pP45N2PP2PPPPRNBQKB1RbKQkq-": {
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
      "rnbqkbnrppp2ppp84p32BPP38PP3PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p32pPP38PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1c4",
            "san": "Bxc4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp882pPP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp5n22ppP32p52N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp3ppp5n22pp42p1P32N2N2PP3PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22pP42p1P32N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22pP42p52N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp5n22pP42p52N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp5n22pP42p52N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82pP42p52N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82p52pP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp882pP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppp1qppp882Bp4PQ2P31P3PPPRNB1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp1qppp882Bp41Q2PN2PP3PPPRNB1K2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp1qppp882Bp41Q2P3PP3PPPRNB2KNRbkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp1qppp882Bp41Q2P3PP1N1PPPR1B1K1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp1qppp882Bp41Q2P3PP3PPPRNB1K1NRwKQkq-": {
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
      "rnbqkbnrppp2ppp882Bp41Q2P3PP3PPPRNB1K1NRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrppp2ppp882Bp44P3PP3PPPRNBQK1NRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrppp2ppp84p32BP44P3PP3PPPRNBQK1NRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrppp2ppp84p32pP44P3PP3PPPRNBQKBNRwKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f1c4",
            "san": "Bxc4",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrppp1pppp882pP44P3PP3PPPRNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 4
          }
        ]
      },
      "rnbqkbnrppp1pppp882pP48PP2PPPPRNBQKBNRwKQkq-": {
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
      "r1bqkb1rpp1n1ppp2p1pn23p2B12PPP32N2N2PP3PPPR2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpp1n1ppp2p1pn23p2B12PP42N2N2PP2PPPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppn1ppp4pn23p2B12PP42N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppn1ppp4pn23p2B12PP42N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pp1n1pp12p1pb1p82BP42N1PN2PP3PPP2RQ1RK1b--": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pp1n1pp12p1pb1p82pP42NBPN2PP3PPP2RQ1RK1w--": {
        "total": 1,
        "moves": [{
            "uci": "d3c4",
            "san": "Bxc4",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1pp1n1pp12p1pb1p3p42PP42NBPN2PP3PPP2RQ1RK1b--": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pp1n1pp12p1pb1p3p42PP42NBPN2PP3PPP2RQK2RwK-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1pp3pp12p1pb1p3p42PP42NBPN2PP3PPP2RQK2RbK-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nd7",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1pp3pp12p1pb1p3p42PP42N1PN2PP3PPP2RQKB1RwK-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp2pp14pb1p3p42PP42N1PN2PP3PPP2RQKB1RbK-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp2pp14pb1p3p42PP42N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "a1c1",
            "san": "Rc1",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp1bpp14pB1p3p42PP42N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e7f6",
            "san": "Bxf6",
            "nr": 1
          }
        ]
      },
      "rnb2rk1ppp1qpp14p2p3P43P42P1PN2P4PPPR2QKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnb2rk1ppp1qpp14p2p3P43P42n1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "b2c3",
            "san": "bxc3",
            "nr": 0
          }
        ]
      },
      "rnb2rk1ppp1qpp14p2p3P43Pn32N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e4c3",
            "san": "Nxc3",
            "nr": 1
          }
        ]
      },
      "rnb2rk1ppp1qpp14p2p3p42PPn32N1PN2PPQ2PPPR3KB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnb2rk1ppp1qpp14p2p3p42PPn32N1PN2PP3PPPR2QKB1RwKQ-": {
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
      "rnbq1rk1ppp1bpp14pn1p3p42PP3B2N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "f6e4",
            "san": "Ne4",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1ppp1bpp14pn1p3p2B12PP42N1PN2PP3PPPR2QKB1RwKQ-": {
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
      "r1b2rk1pp1nqppp2p1p33n42BPN34PN2PP3PPP2RQK2RbK-": {
        "total": 0,
        "moves": []
      },
      "r1b2rk1pp1nqppp2p1p33n42BP42N1PN2PP3PPP2RQK2RwK-": {
        "total": 1,
        "moves": [{
            "uci": "c3e4",
            "san": "Ne4",
            "nr": 0
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
      "r1bq1rk1pp1nbppp2p1p33n2B12BP3P2N1PN2PP3PP12RQK2RbK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pp1nbppp2p1p33n2B12BP42N1PN2PP3PPP2RQK2RwK-": {
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
      "r1bq1rk1pp1nbppp2p1pn26B12BP42N1PN2PP3PPP2RQK2RbK-": {
        "total": 2,
        "moves": [{
            "uci": "f6d5",
            "san": "Nd5",
            "nr": 2
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
      "r1bq1rk11p1nbpppp1p1pn23p2B12PP4P1N1PN21PQ2PPP2R1KB1RbK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk11p1nbpppp1p1pn23p2B12PP42N1PN2PPQ2PPP2R1KB1RwK-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1pp1nbppp2p1pn23p2B12PP42N1PN2PPQ2PPP2R1KB1RbK-": {
        "total": 1,
        "moves": [{
            "uci": "a7a6",
            "san": "a6",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pp1nbppp2p1pn23p2B12PP42N1PN2PP3PPP2RQKB1RwK-": {
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
      "r1bq1rk1p1pnbppp1p3n21B1p2B13P42N1PN2PP3PPP2RQK2RbK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1p1pnbppp1p3n23p2B13P42NBPN2PP3PPP2RQK2RbK-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1p1pnbppp1p3n23p2B13P42N1PN2PP3PPP2RQKB1RwK-": {
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
      "r1bq1rk1p1pnbppp1p2pn23P2B13P42N1PN2PP3PPP2RQKB1RbK-": {
        "total": 2,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1p1pnbppp1p2pn23p2B12PP42N1PN2PP3PPP2RQKB1RwK-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1pppnbppp4pn23p2B12PP42N1PN2PP3PPP2RQKB1RbK-": {
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
      "r1bq1rk1pppnbppp4pn23p2B12PP42NBPN2PP3PPPR2QK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pppnbppp4pn23p2B12PP41QN1PN2PP3PPPR3KB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pp1nbppp4pn22pP2B13P42N1PN2PPQ2PPPR3KB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pp1nbppp4pn22pp2B12PP42N1PN2PPQ2PPPR3KB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 0
          }
        ]
      },
      "r1bq1rk1pppnbppp4pn23p2B12PP42N1PN2PPQ2PPPR3KB1RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "r1bq1rk1pppnbppp4pn23p2B12PP42N1PN2PP3PPPR2QKB1RwKQ-": {
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
      "rn1q1rk1pbp1bppp1p3n23pN1B13P42NBP3PP3PPPR2QK2RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rn1q1rk1pbp1bppp1p3n23p2B13P42NBPN2PP3PPPR2QK2RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 0
          }
        ]
      },
      "rn1q1rk1pbp1bppp1p2pn23P2B13P42NBPN2PP3PPPR2QK2RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rn1q1rk1pbp1bppp1p2pn23p2B12PP42NBPN2PP3PPPR2QK2RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1p1p1bppp1p2pn23p2B12PP42NBPN2PP3PPPR2QK2RbKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1p1p1bppp1p2pn23p2B12PP42N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbq1rk1ppp1bppp4pn23p2B12PP42N1PN2PP3PPPR2QKB1RbKQ-": {
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
      "rnbq1rk1ppp1bppp4pn23p2B12PP42N1P3PP3PPP2RQKBNRbK-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1ppp1bppp4pn23p2B12PP42N1P3PP3PPPR2QKBNRwKQ-": {
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
      "rnbqk2rppp1bppp4pn23p2B12PP42N1P3PP3PPPR2QKBNRbKQkq-": {
        "total": 13,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 13
          }
        ]
      },
      "rnbq1rk1ppp1bppp4pn23p2B12PP42N2N2PPQ1PPPPR3KB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "rnbq1rk1ppp1bppp4pn23p2B12PP42N2N2PP2PPPPR2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 0
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23p2B12PP42N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "rnbqk2rppp1bppp4pB23p42PP42N5PP2PPPPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp1bppp4pn23p2B12PP42N5PP2PPPPR2QKBNRwKQkq-": {
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
      "rnbqkb1rpp3ppp4pn22pP2B13P42N5PP2PPPPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp3ppp4pn23p2B12PQ42N2N2PP2PPPPR3KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp3ppp4pn23p2B12Pp42N2N2PP2PPPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d4",
            "san": "Qxd4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22pp2B12PP42N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22pp2B12PP42N5PP2PPPPR2QKBNRwKQkq-": {
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
      "rnbqkb1rppp2ppp4pn23p2B12PP42N5PP2PPPPR2QKBNRbKQkq-": {
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
      "rnbqkb1rpp3ppp2p2n23p2B13P42N5PPQ1PPPPR3KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp3ppp2p2n23p2B13P42N5PP2PPPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23p2B13P42N5PP2PPPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppn1ppp5n23p43P1B22N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpppn1ppp5n23p43P42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23p43P42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23p43P42N5PP2PPPPR1BQKBNRwKQkq-": {
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
      "rnbqkb1rppp2ppp4pn23P43P42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 2
          }
        ]
      },
      "r1b2rk1pp3ppp2n1pn2q1bp42P2B2P1N1PN21PQ2PPP2KR1B1Rb--": {
        "total": 0,
        "moves": []
      },
      "r1b2rk1pp3ppp2n1pn2q1bp42P2B2P1N1PN21PQ2PPP3RKB1RbK-": {
        "total": 0,
        "moves": []
      },
      "r1b2rk1pp3ppp2n1pn2q1bp42P2B2P1N1PN21PQ2PPPR3KB1RwKQ-": {
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
      "r1bq1rk1pp3ppp2n1pn22bp42P2B2P1N1PN21PQ2PPPR3KB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d8a5",
            "san": "Qa5",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1pp3ppp2n1pn22bp42P2B22N1PN2PPQ2PPPR3KB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1pp3ppp4pn22bp42P2B22N1PN2PPQ2PPPR3KB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1pp3ppp4pn22bp42P2B22N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d1c2",
            "san": "Qc2",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1pp2bppp4pn22Pp42P2B22N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 2,
        "moves": [{
            "uci": "e7c5",
            "san": "Bxc5",
            "nr": 2
          }
        ]
      },
      "rnbq1rk1pp2bppp4pn22pp42PP1B22N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 2,
        "moves": [{
            "uci": "d4c5",
            "san": "dxc5",
            "nr": 2
          }
        ]
      },
      "r1bq1rk1pppnbppp4pn22Pp43P1B22N1PN2PP3PPPR2QKB1RbKQ-": {
        "total": 0,
        "moves": []
      },
      "r1bq1rk1pppnbppp4pn23p42PP1B22N1PN2PP3PPPR2QKB1RwKQ-": {
        "total": 1,
        "moves": [{
            "uci": "c4c5",
            "san": "c5",
            "nr": 0
          }
        ]
      },
      "rnbq1rk1ppp1bppp4pn23p42PP1B22N1PN2PP3PPPR2QKB1RbKQ-": {
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
      "rnbq1rk1ppp1bppp4pn23p42PP1B22N2N2PP2PPPPR2QKB1RwKQ-": {
        "total": 3,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 3
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23p42PP1B22N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "e8h8",
            "san": "O-O",
            "nr": 3
          }
        ]
      },
      "rnbqk2rppp1bppp4pn23p42PP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "c1f4",
            "san": "Bf4",
            "nr": 3
          }
        ]
      },
      "rnbqk2rppp2ppp4pn23p4QbPP42N2N2PP2PPPPR1B1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk2rppp2ppp4pn23p41bPP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4+",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp4p32pn43PP32N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpp3ppp2n1p32pn43P42NBPN2PP3PPPR1BQK2RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpp3ppp2n1p32pn43P42N1PN2PP3PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp4p32pn43P42N1PN2PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp4p32pn43P42N2N2PP2PPPPR1BQKB1RwKQkq-": {
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
      "rnbqkb1rpp3ppp4pn22pP43P42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f6d5",
            "san": "Nxd5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpp3ppp4pn22pp42PP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn282pP42N1PN2PP3PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp4pn282pP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3pp12p1pn1p3p42PP3B2N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp3pp12p1pn1p3p2B12PP42N2N2PP2PPPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5h4",
            "san": "Bh4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp3ppp2p1pn23p2B12PP42N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h6",
            "san": "h6",
            "nr": 1
          }
        ]
      },
      "r2qkb1rpb1n1ppp4p33nP3Np1N43B4PP3PPPR1BQ1RK1bkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1rpb1n1ppp4p33nP3Np1p43B1N2PP3PPPR1BQ1RK1wkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3d4",
            "san": "Nxd4",
            "nr": 0
          }
        ]
      },
      "r2qkb1rpb1n1ppp4p32pnP3Np1P43B1N2PP3PPPR1BQ1RK1bkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "r2qkb1rpb1n1ppp4p32pnP3Np1P43B1N2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e1h1",
            "san": "O-O",
            "nr": 1
          }
        ]
      },
      "r2qkb1rpb1n1ppp4pn22p1P3Np1P43B1N2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f6d5",
            "san": "Nd5",
            "nr": 1
          }
        ]
      },
      "r2qkb1rpb1n1ppp4pn22p5Np1PP33B1N2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r2qkb1rpb1n1ppp2p1pn28Np1PP33B1N2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "r2qkb1rpb1n1ppp2p1pn281p1PP32NB1N2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c3a4",
            "san": "Na4",
            "nr": 1
          }
        ]
      },
      "r2qkb1rpb1n1ppp2p1pn21p63PP32NB1N2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b5b4",
            "san": "b4",
            "nr": 1
          }
        ]
      },
      "r2qkb1rpb1n1ppp2p1pn21p63P42NBPN2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e3e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rp2n1ppp2p1pn21p63P42NBPN2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rp2n1ppp2p1pn21p62BP42N1PN2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp1n1ppp2p1pn282BP42N1PN2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp1n1ppp2p1pn282pP42NBPN2PP3PPPR1BQK2RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d3c4",
            "san": "Bxc4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp1n1ppp2p1pn23p42PP42NBPN2PP3PPPR1BQK2RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpp1n1ppp2p1pn23p42PP42N1PN2PP3PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1d3",
            "san": "Bd3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp2p1pn23p42PP42N1PN2PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8d7",
            "san": "Nbd7",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp3ppp2p1pn23p42PP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
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
      "rnbqkb1rppp2ppp4pn23p42PP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
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
      "rnbqkb1rppp2ppp4pn23p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
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
      "rnbqk1nrppp1bppp4p382PPp32N2P2PP4PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp1bppp4p382PPp32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }
        ]
      },
      "rnbqk1nrppp1bppp4p33p42PPP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp1bppp4p33p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp4pp2p1p33p1p22PP2P12N1P3PP3P1PR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp4pp2p1p33p1p22PP42N1P3PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p33p42PP42N1P3PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p382PPp32N2P2PP4PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpp3ppp2p1p381bPP42N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpp3ppp2p1p381bPPN38PP1B1PPPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrpp3ppp2p1p381bPPN38PP3PPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrpp3ppp2p1p382PPN38PP3PPPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4+",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p382PPp32N5PP3PPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrpp3ppp2p1p33p42PPP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrpp3ppp2p1p33p42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrpp3ppp82pp43PP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp82pp43P42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32pP43P42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32pp42PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p42PP42N5PP2PPPPR1BQKBNRbKQkq-": {
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
      "r1bqkb1rpp1n1ppp2p1pn23p2B12PP44PN2PP1N1PPPR2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkb1rpp1n1ppp2p1pn23p2B12PP44PN2PP3PPPRN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1d2",
            "san": "Nbd2",
            "nr": 0
          }
        ]
      },
      "r1bqkb1rpppn1ppp4pn23p2B12PP44PN2PP3PPPRN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "r1bqkb1rpppn1ppp4pn23p2B12PP45N2PP2PPPPRN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rpp3pp12p1pq1p3p42PP41QN2N2PP2PPPPR3KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kb1rpp3pp12p1pq1p3p42PP42N2N2PP2PPPPR2QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "rnb1kb1rppp2pp14pq1p3p42PP42N2N2PP2PPPPR2QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnb1kb1rppp2pp14pq1p3p42PP45N2PP2PPPPRN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2pp14pB1p3p42PP45N2PP2PPPPRN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8f6",
            "san": "Qxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2pp14pn1p3p2B12PP45N2PP2PPPPRN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g5f6",
            "san": "Bxf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp4pn23p2B12PP45N2PP2PPPPRN1QKB1RbKQkq-": {
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
      "rnbqkb1rppp2ppp4pn23p42PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp3ppp82pp2B13P45N2PP2PPPPRN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp82pp43P45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1g5",
            "san": "Bg5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32pP43P45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e6d5",
            "san": "exd5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp3ppp4p32pp42PP45N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c4d5",
            "san": "cxd5",
            "nr": 1
          }
        ]
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
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp4p33p42PP48PP2PPPPRNBQKBNRwKQkq-": {
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
      "r1bqkbnrppp2ppp2n54P32Pp45NP1PP2PP1PRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2n54P32Pp45N2PP1NPPPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2n54P32Pp45N2PP2PPPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrppp2ppp84P32Pp45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp2ppp84P32Pp48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp2ppp83pP32P58PP2PPPPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp32PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d4e5",
            "san": "dxe5",
            "nr": 2
          }
        ]
      },
      "rn1qkbnrppp2ppp4p33p1b22PP41QN5PP2PPPPR1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrppp2ppp4p33p1b22PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1b3",
            "san": "Qb3",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrppp1pppp83p1b22PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrppp1pppp83p1b22PP41Q6PP2PPPPRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrppp1pppp83p1b22PP48PP2PPPPRNBQKBNRwKQkq-": {
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
      "r1b1k1nrppp2ppp2n53q43p42B1P3PP2NPPPR2QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1k1nrppp2ppp2n53q43p42B1P3PP3PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1e2",
            "san": "Ne2",
            "nr": 0
          }
        ]
      },
      "r1b1k1nrppp2ppp2n53qp33P42B1P3PP3PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "r1b1k1nrppp2ppp2n53qp33P42b1P3PP1B1PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2c3",
            "san": "Bxc3",
            "nr": 1
          }
        ]
      },
      "r1b1k1nrppp2ppp2n53qp31b1P42N1P3PP1B1PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4c3",
            "san": "Bxc3",
            "nr": 1
          }
        ]
      },
      "r1b1k1nrppp2ppp2n53qp31b1P42N1P3PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1d2",
            "san": "Bd2",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrppp2ppp2n53qp33P42N1P3PP3PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8b4",
            "san": "Bb4",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrppp2ppp2n53qp33P44P3PP3PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrppp1pppp2n53q43P44P3PP3PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "r1b1kbnrppp1pppp2n53q43P48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53P43P48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d5",
            "san": "Qxd5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp1pppp2n582pP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp1pppp2n582pP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p42PP42N5PP2PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "r2qkbnrppp1pppp2n53p4Q1PP2b15N2PP2PPPPRNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkbnrppp1pppp2n53p42PP2b15N2PP2PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1a4",
            "san": "Qa4",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p42PP45N2PP2PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8g4",
            "san": "Bg4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrppp1pppp2n53p42PP48PP2PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkb1rpp2pppp2p2n23p2B12PP45N2PP2PPPPRN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1rpp2ppppn1p2n24Nb2P1pPP32N51P3PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r2qkb1rpp2ppppn1p2n24Nb2P1pP42N51P2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rn1qkb1rpp2pppp2p2n24Nb2P1pP42N51P2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8a6",
            "san": "Na6",
            "nr": 1
          }
        ]
      },
      "rn1qkb1rpp2pppp2p2n25b2P1pP42N2N21P2PPPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3e5",
            "san": "Ne5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n28P1pP42N2N21P2PPPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8f5",
            "san": "Bf5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rp3pppp2p2n21p2P32pP42N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rp3pppp2p2n21p62pPP32N2N2PP3PPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4e5",
            "san": "e5",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n282pPP32N2N2PP3PPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n282pP42N2N2PP2PPPPR1BQKB1RwKQkq-": {
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
      "rnbqkb1rpp2pppp2p2n23p42PP42N2N2PP2PPPPR1BQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 2
          }
        ]
      },
      "rnbqkb1rpp2pppp2p2n23p42PP45N2PP2PPPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpp2pppp2p53p42PPP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p582pPP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p582pP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp3ppp2p53pp32PPP32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp3ppp2p53pp32PP42N5PP2PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p42PP42N5PP2PPPPR1BQKBNRbKQkq-": {
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
      "rnbqkbnrpp2pppp2p53p42PP48PP2PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrppp1pppp83p42PP48PP2PPPPRNBQKBNRbKQkq-": {
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
      "rnbqkbnrppp1pppp83p43P48PPP1PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppp2pp4p35p22PPP38PP3PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp4p35p22PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p22PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppppp1pp5n283Pp32N2P2PPP3PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppppp2p5np16B13Pp32N2P2PPP3PPR2QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppppp2p5np16B13Pp32N5PPP2PPPR2QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppppp1pp5n26B13Pp32N5PPP2PPPR2QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g7g6",
            "san": "g6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppppp1pp5n283Pp1P12N5PPP2P1PR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppppp1pp5n283Pp32N5PPP2PPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrppppp1pp883Pp32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 3
          }
        ]
      },
      "rnbqkbnrppppp1pp883Pp38PPPN1PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp883Pp38PPP2PPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrppppp1pp85p23PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 4,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 4
          }
        ]
      },
      "rnbqkb1rppppp1pp5n25p23P2P17PPPP1PP2RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppppp1pp5n25p23P47PPPP1PPP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p23P47PPPP1PPP1RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1p1pp83p1p23PP32N5PPP2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1p1pp83p1p23P42N5PPP1PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppppp1pp5n25p23P2P12N5PPP1PP1PR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppppp1pp5n25p23P42N5PPP1PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p23P42N5PPP1PPPPR1BQKBNRbKQkq-": {
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
      "rnbqkbnrppp1p1pp83p43PP1p12N5PPP2P1PR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1p1pp83p43PP1p18PPP2P1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp883PP1p18PPP2P1PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp883P2p18PPP1PP1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp85p23P2P18PPP1PP1PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5g4",
            "san": "fxg4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp4p35p23P2P13Q4PPP1PP1PRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp4p35p23P43Q4PPP1PPPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp2p6p15p23P2P13Q4PPP1PP1PRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp2p6p15p23P43Q4PPP1PPPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1p1pp3p45p23P2P13Q4PPP1PP1PRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1p1pp3p45p23P43Q4PPP1PPPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1p1pp83p1p23P2P13Q4PPP1PP1PRNB1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1p1pp83p1p23P43Q4PPP1PPPPRNB1KBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p23P43Q4PPP1PPPPRNB1KBNRbKQkq-": {
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
      "rnbqkbnrppppp1pp85p23P48PPP1PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppp2pp4p35p23P1BP18PPP1PP1PRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp4p35p23P1B28PPP1PPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p383P1B28PPP1PPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p382PP48PP2PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b7b6",
            "san": "b6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p383P48PPP1PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppp1ppp83Pp388PPP1PPPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrppppqppp2n53QP385N2PPP1PPPPRNB1KB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1b1kbnrppppqppp2n54P385N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d1d5",
            "san": "Qd5",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54P385N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8e7",
            "san": "Qe7",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54P388PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84P388PPP1PPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp883Pp38PPP1PPPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84N33Pp38PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp883Pp35N2PPP1PPPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpppp1ppp84p33P45N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p33P44P3PPP2PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84p33P48PPP1PPPPRNBQKBNRwKQkq-": {
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
      "rnbqkb1rpppppp1p5np17P3P48PPP1PPP1RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppp1p5np183P3P8PPP1PPP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h4h5",
            "san": "h5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppppp1p6p183P3P8PPP1PPP1RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppp1p6p183P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h2h4",
            "san": "h4",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpppppp81B63PP38PPP2PPPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpbpppppp81p63PP38PPP2PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bxb5",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrp1pppppp81p63PP38PPP2PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c8b7",
            "san": "Bb7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pppppp81p63P48PPP1PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp883P48PPP1PPPPRNBQKBNRbKQkq-": {
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
      "rnbqkbnrppp1pppp83p45PP18PPPPP2PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp83p42P2P28PP1PP1PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp5n22p53p1P21P2PN2PBPP2PPRN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp5n22p53p1P21P3N2PBPPP1PPRN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n283p1P21P3N2PBPPP1PPRN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n283p1P21P6PBPPP1PPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p45P21P6PBPPP1PPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p45P21P6P1PPP1PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p45P21P6P1PPP1PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n284pP22N5PPPPQ1PPR1B1KBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n284pP22N5PPPPN1PPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp1pppp5n284pP22N5PPPP2PPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrppp1pppp884pP22N5PPPP2PPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pppp884pP28PPPP2PPRNBQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pppp83p44PP28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pppp83p45P28PPPPP1PPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppp1ppp84p35P22N5PPPPP1PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1p1ppp82p53p1P22P2N2PP2P1PPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1p1ppp82p53p1P25N2PPP1P1PPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp883p1P25N2PPP1P1PPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp883p1P28PPP1P1PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p33P1P28PPP1P1PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p35P28PPPPP1PPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppppp1p86p15P28PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp85p24PP28PPPP2PPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp85p25P28PPPPP1PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppppppp885P28PPPPP1PPRNBQKBNRbKQkq-": {
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
      "rnbqkbnrppppppp187p6P17PPPPPPP2RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppppp187p87PPPPPPPP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppppppp8887PPPPPPPP1RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "h7h5",
            "san": "h5",
            "nr": 1
          }
        ]
      },
      "rn1qkbnrpbpp2pp1p2p33P1p22P1P32N5PP3PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrpbpp2pp1p2p35p22PPP32N5PP3PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d4d5",
            "san": "d5",
            "nr": 0
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
      "rnbqkbnrp1pp1ppp1p2p382PP48PP2PPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p382P58PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n282P1P38PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp5n282P3P18PP1PPP1PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp5n282P58PP1PPPPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrppppp1pp85p22P1P38PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1p1pp3p45p22P1P35N2PP1P1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1p1pp3p45p22P55N2PP1PPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p22P55N2PP1PPPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d6",
            "san": "d6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppppp1pp5n25p22P1P32N5PP1P1PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppppp1pp5n25p22P52N5PP1PPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p22P52N5PP1PPPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp85p22P3P18PP1PPP1PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp85p22P58PP1PPPPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrp1pppppp81p62P58PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n282P2p24PN2PP1P2PPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n282P2p24P3PP1P2PPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32P2P24P3PP1P2PPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p32P54P3PP1P1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p32P54P3PP1P1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p32P58PP1PPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1ppppp5n22p51PP55N2P2PPPPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp1ppppp5n22p52P55N2PP1PPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p52P55N2PP1PPPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp82p51PP58P2PPPPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp82p52P58PP1PPPPPRNBQKBNRwKQkq-": {
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
      "rnbqkbnrpppppppp882P58PP1PPPPPRNBQKBNRbKQkq-": {
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
      "rnbqkbnrppppp1pp85p26P18PPPPPP1PRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppppp1p86p15PP18PPPPP2PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppppp1p86p16P18PPPPPP1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1ppp183p3P88PPPPPPBPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1ppp183p3p6P18PPPPPPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g4h5",
            "san": "gxh5",
            "nr": 0
          }
        ]
      },
      "rn1qkbnrppp1pppp83p42P3b18PP1PPPBPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rn1qkbnrppp1pppp83p46b18PPPPPPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83p43p2P12P5PP2PPBPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83p43p2P18PPP1PPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp33P2P18PPP1PPBPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp36P18PPPPPPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p582p3P11P6P2PPPBPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp2p582p3P18PP1PPPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b3",
            "san": "b3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p42P3P18PP1PPPBPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp2p53p46P18PPPPPPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p46P18PPPPPPBPRNBQK1NRbKQkq-": {
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
      "rnbqkbnrppp2ppp84p34p1P12NP4PPP2P1PR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p34p1P12N5PPPP1P1PR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp884p1P12N5PPPP1P1PR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
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
      "rnbqkbnrpppppppp886P18PPPPPP1PRNBQKBNRbKQkq-": {
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
      "rnbqkbnrppp2ppp83pp31P66P1P1PPPPBPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83pp386P1PPPPPPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c4",
            "san": "c4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p386P1PPPPPPBPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqk1nrppp1bppp83p44p2NP2P2P11PP1PP1PRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqk1nrppp1bppp83p44p2NP5P11PPPPP1PRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83p44p2NP5P11PPPPP1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f8e7",
            "san": "Be7",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83p44p3P4NP11PPPPP1PRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3h4",
            "san": "Nh4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp38P4NP11PPPPP1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp38P5P11PPPPP1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p38P5P11PPPPP1PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p386PNPPPPPP1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n281P2p36P1P1PPPP1PRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n284p36P1PPPPPP1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp884p36P1PPPPPP1PRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp884p35NP1PPPPPP1PRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f3g1",
            "san": "Ng1",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p385NP1PPPPPP1PRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p386P1PPPPPP1PRNBQKBNRwKQkq-": {
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
      "rnbqkbnrppp2ppp84p32p51P4P1P2PPPBPRNBQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p32p56P1PP1PPPBPRNBQK1NRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b3",
            "san": "b3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp32P56P1PP1PPPBPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p486P1PPPPPPBPRNBQK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p486P1PPPPPP1PRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1g2",
            "san": "Bg2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8886P1PPPPPP1PRNBQKBNRbKQkq-": {
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
      "rnbqkbnrpp1ppppp82p51P5P8P1PPPPP1RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp82p57P8PPPPPPP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp83p43p3P2P2N2PP2PPP1RNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp83p43p3P5N2PPP1PPP1RNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp43P3P5N2PPP1PPP1RNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c5d4",
            "san": "cxd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp43P3P8PPP1PPP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p43P3P8PPP1PPP1RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p47P8PPPPPPP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp883p3P2P5PP2PPP1RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp883p3P8PPP1PPP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c2c3",
            "san": "c3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p33P3P8PPP1PPP1RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5d4",
            "san": "exd4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p37P8PPPPPPP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppp1p86p17P8PPPPPPP1RNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp884p2P3P4PPP2PP1RNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp884p2P8PPPP1PP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p24P2P8PPPP1PP1RNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp85p27P8PPPPPPP1RNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp887P8PPPPPPP1RNBQKBNRbKQkq-": {
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
      "rnbqkb1rpp2pppp5n22pp44P31P3N2PBPP1PPPRN1QKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2pppp5n22pp481P3N2PBPPPPPPRN1QKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p481P3N2PBPPPPPPRN1QKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p481P3N2P1PPPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp44P31P3N2P1PP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82p52p51P2PN2P2P1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82p52p51PN2N2P2PPPPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82p52p51P3N2P2PPPPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpp2pppp82pp42P51P3N2P2PPPPPRNBQKB1RbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5c4",
            "san": "dxc4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrpp2pppp82pp481P3N2P1PPPPPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrppp1pppp83p481P3N2P1PPPPPPRNBQKB1RbKQkq-": {
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
      "rnbqkbnrpp2pppp82p51PPp44PN2P2P1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp2pppp82p52Pp44PN2PP1P1PPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp882Pp44PN2PP1P1PPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp882Pp45N2PP1PPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p42P55N2PP1PPPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p485N2PPPPPPPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpppppp1p86p185N2PPPPPPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp5n2885N2PPPPPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppppp1pp5n25p24P33P1N2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppppp1pp5n25p283P1N2PPP1PPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p283P1N2PPP1PPPPRNBQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp85p24P35N2PPPP1PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp85p285N2PPPPPPPPRNBQKB1RwKQkq-": {
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
      "rnbqkbnrpppp1ppp4p3885N2PPPPPPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp84p385N2PPPPPPPPRNBQKB1RwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp883p44PN2PPP2PPPRNBQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp82p585N2PPPPPPPPRNBQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8885N2PPPPPPPPRNBQKB1RbKQkq-": {
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
      "r1bqkbnrpppp1ppp2n54p35P21P6PBPPP1PPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n54p381P6PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p381P6PBPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p381P6P1PPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp4p35p24P31P6PBPP1PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp4p35p281P6PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p3881P6PBPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp4p3881P6P1PPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8881P6P1PPPPPPRNBQKBNRbKQkq-": {
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
      "rnbqkbnrpp1ppppp82p51P68P1PPPPPPRNBQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp2ppp3q44p31P2p3P4P21BPP2PPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnb1kbnrppp2ppp3q44p31P2p3P71BPP1PPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f3",
            "san": "f3",
            "nr": 0
          }
        ]
      },
      "rnb1kbnrppp2ppp3q43pp31P2P3P71BPP1PPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppp2ppp3q43pp31P6P71BPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppp1pppp3q43p41P6P71BPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnb1kbnrppp1pppp3q43p41P68PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p41P68PBPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d8d6",
            "san": "Qd6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p41P68P1PPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r1p3ppp2p1pn2P2p44P3P2P41BP2PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1r1p3ppp2p1pn2P2p48P2P41BP1PPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1r1p1p1ppp2p1pn2P78P2P41BP1PPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1r1p1p1ppp2p1pn2p71P6P2P41BP1PPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4a5",
            "san": "bxa5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1p1ppp2p1pn281P6P2P41BP1PPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a5",
            "san": "a5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpp1p1ppp2p1pn281P6P71BPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn281P6P71BPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c6",
            "san": "c6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp4pn281P68PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n281P68PBPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e6",
            "san": "e6",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppppppp5n281P68P1PPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1p1ppppp8pp64P38PBPP1PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnr1p1ppppp8pp688PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnr1p1ppppp2p5pP688PBPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c6b5",
            "san": "cxb5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnr1p1ppppp2p5p71P68PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b4b5",
            "san": "b5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp2p581P68PBPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a7a5",
            "san": "a5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpp1ppppp2p581P68P1PPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp2pp5p24p31P2P38PBPP1PPPRN1QKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp2pp5p24p31P68PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p31P68PBPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f6",
            "san": "f6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p31P68P1PPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp881P68P1PPPPPPRNBQKBNRbKQkq-": {
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
      "r1bqkbnrppp1pppp2n53p43P42N5PPP1PPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppppppp2n583P42N5PPP1PPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppppppp2n5882N5PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d4",
            "san": "d4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp884p32N2P2PPPP2PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp884p32NP4PPP2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p34NP28PPPP2PPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p34N38PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp884N38PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp882B1p32N5PPPP1PPPR1BQK1NRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp1pppp884p32N5PPPP1PPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrppp1pppp83p44P32N5PPPP1PPPR1BQKBNRbKQkq-": {
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
      "rnbqkb1rpp2p1pp5n22p2p21P1p1P25N2P1PPPNPPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpp2p1pp5n22p2p23p1P25N2PPPPPNPPR1BQKB1RwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp1p1pp5n25p23p1P25N2PPPPPNPPR1BQKB1RbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c7c5",
            "san": "c5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1p1pp5n25p23p1P28PPPPPNPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1p1pp85p23p1P28PPPPPNPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1p1pp85p23pNP28PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e4f2",
            "san": "Nf2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp84p33pNP25N2PPPPP1PPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p33pNP28PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp1pppp883pNP28PPPPP1PPR1BQKBNRbKQkq-": {
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
      "rnbqkbnrppp1pppp883p1P22N5PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "c3e4",
            "san": "Ne4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pppp83p45P22N5PPPPP1PPR1BQKBNRbKQkq-": {
        "total": 2,
        "moves": [{
            "uci": "d5d4",
            "san": "d4",
            "nr": 2
          }
        ]
      },
      "rnbqkbnrppp1pppp83p482N5PPPPPPPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrpp1ppppp82p51P62N5P1PPPPPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpp1ppppp82p582N5PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b2b4",
            "san": "b4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp84p34p31PNP4P1P2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp84p34p31PN5P1PP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp34P31PN5P1PP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d5e4",
            "san": "dxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp381PN5P1PPPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p381PN5P1PPPPPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp884Pp22N5PPPP2PPR1BQKBNRbKQkqe3": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrpppp1ppp885p22N5PPPPP1PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p382N5PPPPPPPPR1BQKBNRwKQkq-": {
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
      "rnbqkbnrppppp1pp884p32NP4PPP2PPPR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppppp1pp884p32N5PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d2d3",
            "san": "d3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppppp1pp85p24P32N5PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f5e4",
            "san": "fxe4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppppp1pp85p282N5PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrp1pppppp81p682N5PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp5n286P12N5PPPPPP1PR1BQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppppppp5n2882N5PPPPPPPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g2g4",
            "san": "g4",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrpppppppp8882N5PPPPPPPPR1BQKBNRbKQkq-": {
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
      "rnbqkb1rpppp1ppp5n285p22N1PN2PPPP2PPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rpppp1ppp5n285p22N1P3PPPP2PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p35P22N1P3PPPP2PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rpppp1ppp5n24p382N1P3PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n585p22N1PN2PPPP2PPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrpppp1ppp2n585p22N1P3PPPP2PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p35P22N1P3PPPP2PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p382N1P3PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83p45p22N1PN2PPPP2PPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp2ppp83p45p22N1P3PPPP2PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp35P22N1P3PPPP2PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp83pp382N1P3PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p382N1P3PPPP1PPPR1BQKBNRbKQkq-": {
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
      "rnbqkbnrpppp1ppp84p384P3PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 3,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 3
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23p45p2P1N1PN21PPP2PPR1BQKB1RbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkb1rppp2ppp5n23p45p2P1N1P31PPP2PPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g1f3",
            "san": "Nf3",
            "nr": 0
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23pp35P2P1N1P31PPP2PPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e5f4",
            "san": "exf4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp2ppp5n23pp38P1N1P31PPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f2f4",
            "san": "f4",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p48P1N1P31PPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkb1rppp1pppp5n23p482N1P3PPPP1PPPR1BQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a2a3",
            "san": "a3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p482N1P3PPPP1PPPR1BQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8f6",
            "san": "Nf6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp1pppp83p484P3PPPP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b1c3",
            "san": "Nc3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8884P3PPPP1PPPRNBQKBNRbKQkq-": {
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
      "rnbqkbnrppp3ppP73ppp284P31PPP1PPPRNBQKBNRbKQkq-": {
        "total": 0,
        "moves": []
      },
      "rnbqkbnrppp3pp8P2ppp284P31PPP1PPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a5a6",
            "san": "a6",
            "nr": 0
          }
        ]
      },
      "rnbqkbnrppp2ppp8P2pp384P31PPP1PPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f7f5",
            "san": "f5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrppp2ppp8P2pp3881PPPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp8P3p3881PPPPPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p3P781PPPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "a4a5",
            "san": "a5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp88P781PPPPPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8888PPPPPPPPRNBQKBNRwKQkq-": {
        "total": 461,
        "moves": [{
            "uci": "e2e4",
            "san": "e4",
            "nr": 230
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
      "r1bqkb1rppp1nppp2n51B1pp381P2P3PBPP1PPPRN1QK1NRwKQkq-": {
        "total": 0,
        "moves": []
      },
      "r1bqkbnrppp2ppp2n51B1pp381P2P3PBPP1PPPRN1QK1NRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "g8e7",
            "san": "Ne7",
            "nr": 0
          }
        ]
      },
      "r1bqkbnrppp2ppp2n53pp381P2P3PBPP1PPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "f1b5",
            "san": "Bb5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p381P2P3PBPP1PPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "d7d5",
            "san": "d5",
            "nr": 1
          }
        ]
      },
      "r1bqkbnrpppp1ppp2n54p381P6PBPPPPPPRN1QKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e2e3",
            "san": "e3",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p381P6PBPPPPPPRN1QKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "b8c6",
            "san": "Nc6",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppp1ppp84p381P6P1PPPPPPRNBQKBNRwKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "c1b2",
            "san": "Bb2",
            "nr": 1
          }
        ]
      },
      "rnbqkbnrpppppppp8881P6P1PPPPPPRNBQKBNRbKQkq-": {
        "total": 1,
        "moves": [{
            "uci": "e7e5",
            "san": "e5",
            "nr": 1
          }
        ]
      },
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
        "total": 441,
        "moves": [{
            "uci": "b2b3",
            "san": "b3",
            "nr": 1
          }, {
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