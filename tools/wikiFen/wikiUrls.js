(function () {
  LiChessTools.prototype.wikiUrls_dict = {
  "rnbqkbnrpppppppp8888PPPPPPPPRNBQKBNRw": [
    "Chess Opening Theory"
  ],
  "rnbqkbnrpppppppp888P71PPPPPPPRNBQKBNRb": [
    "Chess Opening Theory/1. a3"
  ],
  "rnbqkbnrpppppppp88P781PPPPPPPRNBQKBNRb": [
    "Chess Opening Theory/1. a4"
  ],
  "rnbqkbnr1ppppppp8p7P781PPPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. a4/1...a5"
  ],
  "1nbqkbn11pppppp1r6rp6pP6PR6R1PPPPPP11NBQKBN1w": [
    "Chess Opening Theory/1. a4/1...a5/2. h4/2...h5/3. Ra3/3...Ra6/4. Rhh3/4...Rhh6"
  ],
  "rnbqkbnrp1pppppp81p6P781PPPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. a4/1...b5"
  ],
  "rnbqkbnrppp1pppp83p4P781PPPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. a4/1...d5"
  ],
  "rnbqkbnrppp1pppp8P2p4881PPPPPPPRNBQKBNRb": [
    "Chess Opening Theory/1. a4/1...d5/2. a5"
  ],
  "rn1qkbnrpppbpppp8P2p4881PPPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. a4/1...d5/2. a5/2...Bd7"
  ],
  "rnbqkbnrppp1pppp83p4P3P381PPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. a4/1...d5/2. e4"
  ],
  "rnbqkbnrpppp1ppp84p3P781PPPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. a4/1...e5"
  ],
  "rnbqkbnrpppp1ppp84p3P6P81PPPPPP1RNBQKBNRb": [
    "Chess Opening Theory/1. a4/1...e5/2. h4"
  ],
  "rnbqkbnrpppp1ppp84p3P7R71PPPPPPP1NBQKBNRb": [
    "Chess Opening Theory/1. a4/1...e5/2. Ra3"
  ],
  "rnbqk1nrpppp1ppp84p3P7b71PPPPPPP1NBQKBNRw": [
    "Chess Opening Theory/1. a4/1...e5/2. Ra3/2...Bxa3"
  ],
  "rnbqkbnrpppppppp8881P6P1PPPPPPRNBQKBNRb": [
    "Chess Opening Theory/1. b3"
  ],
  "rnbqkbnrppp1pppp83p481P6P1PPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. b3/1...d5"
  ],
  "rnbqkbnrpppp1ppp84p381P6P1PPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. b3/1...e5"
  ],
  "r1bqkbnrpppp1ppp2n54p33P41P6PBP1PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. b3/1...e5/2. Bb2/2...Nc6/3. d4"
  ],
  "rnbqkb1rpppppppp5n2881P6P1PPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. b3/1...Nf6"
  ],
  "rnbqkbnrpppppppp881P68P1PPPPPPRNBQKBNRb": [
    "Chess Opening Theory/1. b4"
  ],
  "rnbqkbnrpp1ppppp2p581P68P1PPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. b4/1...c6"
  ],
  "rnbqkbnrpppp1ppp84p31P68P1PPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. b4/1...e5"
  ],
  "rnbqkbnrpppp1ppp84p31P68PBPPPPPPRN1QKBNRb": [
    "Chess Opening Theory/1. b4/1...e5/2. Bb2"
  ],
  "rnbqk1nrpppp1ppp84p31b68PBPPPPPPRN1QKBNRw": [
    "Chess Opening Theory/1. b4/1...e5/2. Bb2/2...Bxb4"
  ],
  "rnbqkbnrpppp1ppp4p381P68P1PPPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. b4/1...e6"
  ],
  "rnbqkbnrpppp1ppp4p381P68PBPPPPPPRN1QKBNRb": [
    "Chess Opening Theory/1. b4/1...e6/2. Bb2"
  ],
  "rnbqk1nrpppp1ppp4p381b68PBPPPPPPRN1QKBNRw": [
    "Chess Opening Theory/1. b4/1...e6/2. Bb2/2...Bxb4"
  ],
  "rnbqk1nrpppp1pBp4p381b68P1PPPPPPRN1QKBNRb": [
    "Chess Opening Theory/1. b4/1...e6/2. Bb2/2...Bxb4/3. Bxg7"
  ],
  "rnbqkbnrpppppppp8882P5PP1PPPPPRNBQKBNRb": [
    "Chess Opening Theory/1. c3"
  ],
  "rnbqkbnrpp1ppppp82p582P5PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c3/1...c5"
  ],
  "rnbqkbnrpppppppp882P58PP1PPPPPRNBQKBNRb": [
    "Chess Opening Theory/1. c4"
  ],
  "rnbqkbnrp1pppppp81p62P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...b5"
  ],
  "rnbqkbnrp1pppppp1p682P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...b6"
  ],
  "rnbqkbnrpp1ppppp82p52P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...c5"
  ],
  "rnbqkbnrpp1ppppp82p52P52N5PP1PPPPPR1BQKBNRb": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3"
  ],
  "r1bqkbnrpp1ppppp2n52p52P52N5PP1PPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6"
  ],
  "r1bqkbnrpp1ppppp2n52p52P52N3P1PP1PPP1PR1BQKBNRb": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3"
  ],
  "r1bqkbnrpp1ppp1p2n3p12p52P52N3P1PP1PPP1PR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6"
  ],
  "r1bqkbnrpp1ppp1p2n3p12p52P52N3P1PP1PPPBPR1BQK1NRb": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6/4. Bg2"
  ],
  "r1bqk1nrpp1pppbp2n3p12p52P52N3P1PP1PPPBPR1BQK1NRw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6/4. Bg2/4...Bg7"
  ],
  "r1bqk1nrpp1pppbp2n3p12p52P52N2NP1PP1PPPBPR1BQK2Rb": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6/4. Bg2/4...Bg7/5. Nf3"
  ],
  "r1bqk1nrpp1p1pbp2n3p12p1p32P52N2NP1PP1PPPBPR1BQK2Rw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6/4. Bg2/4...Bg7/5. Nf3/5...e5"
  ],
  "r1bqk2rpp1pppbp2n2np12p52P52N2NP1PP1PPPBPR1BQK2Rw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6/4. Bg2/4...Bg7/5. Nf3/5...Nf6"
  ],
  "r1bqk2rpp1pppbp2n2np12p52P52N2NP1PP1PPPBPR1BQ1RK1b": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6/4. Bg2/4...Bg7/5. Nf3/5...Nf6/6. O-O"
  ],
  "r1bq1rk1pp1pppbp2n2np12p52P52N2NP1PP1PPPBPR1BQ1RK1w": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6/4. Bg2/4...Bg7/5. Nf3/5...Nf6/6. O-O/6...O-O"
  ],
  "r1bq1rk1pp1pppbp2n2np12p52PP42N2NP1PP2PPBPR1BQ1RK1b": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6/4. Bg2/4...Bg7/5. Nf3/5...Nf6/6. O-O/6...O-O/7. d4"
  ],
  "r1bqkb1rpp1ppppp2n2n22p52P52N3P1PP1PPP1PR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nc3/2...Nc6/3. g3/3...Nf6"
  ],
  "rnbqkbnrpp1ppppp82p52P55N2PP1PPPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. c4/1...c5/2. Nf3"
  ],
  "r1bqkbnrpp1ppppp2n52p52P55N2PP1PPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nf3/2...Nc6"
  ],
  "r1bqkbnrpp1ppppp2n52p52P55NP1PP1PPP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. c4/1...c5/2. Nf3/2...Nc6/3. g3"
  ],
  "r1bqkbnrpp1ppp1p2n3p12p52P55NP1PP1PPP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nf3/2...Nc6/3. g3/3...g6"
  ],
  "r1bqkbnrpp1ppp1p2n3p12p52P55NP1PP1PPPBPRNBQK2Rb": [
    "Chess Opening Theory/1. c4/1...c5/2. Nf3/2...Nc6/3. g3/3...g6/4. Bg2"
  ],
  "r1bqk1nrpp1pppbp2n3p12p52P55NP1PP1PPPBPRNBQK2Rw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nf3/2...Nc6/3. g3/3...g6/4. Bg2/4...Bg7"
  ],
  "rnbqkb1rpp1ppppp5n22p52P55N2PP1PPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. c4/1...c5/2. Nf3/2...Nf6"
  ],
  "rnbqkbnrpp1ppppp2p582P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...c6"
  ],
  "rnbqkbnrpp1ppppp2p582P55N2PP1PPPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. c4/1...c6/2. Nf3"
  ],
  "rnbqkbnrpp2pppp2p53p42P55N2PP1PPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. c4/1...c6/2. Nf3/2...d5"
  ],
  "rnbqkbnrpp2pppp2p53p42P51P3N2P2PPPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. c4/1...c6/2. Nf3/2...d5/3. b3"
  ],
  "rnbqkbnrppp1pppp83p42P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...d5"
  ],
  "rnbqkbnrppp1pppp83P488PP1PPPPPRNBQKBNRb": [
    "Chess Opening Theory/1. c4/1...d5/2. cxd5"
  ],
  "rnbqkbnrppp2ppp4p33P488PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...d5/2. cxd5/2...e6"
  ],
  "rnbqkb1rppp1pppp5n23P488PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...d5/2. cxd5/2...Nf6"
  ],
  "rnbqkbnrpppp1ppp84p32P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...e5"
  ],
  "rnbqkbnrpppp1ppp84p32P56P1PP1PPP1PRNBQKBNRb": [
    "Chess Opening Theory/1. c4/1...e5/2. g3"
  ],
  "rnbqkbnrpppp1pp184p2p2P56P1PP1PPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...e5/2. g3/2...h5"
  ],
  "r1bqkbnrpppp1ppp2n54p32P56P1PP1PPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...e5/2. g3/2...Nc6"
  ],
  "rnbqkb1rpppp1ppp5n24p32P56P1PP1PPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...e5/2. g3/2...Nf6"
  ],
  "rnbqkbnrpppp1ppp84p32P52N5PP1PPPPPR1BQKBNRb": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3"
  ],
  "r1bqkbnrpppp1ppp2n54p32P52N5PP1PPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3/2...Nc6"
  ],
  "r1bqkbnrpppp1ppp2n54p32P52N3P1PP1PPP1PR1BQKBNRb": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3/2...Nc6/3. g3"
  ],
  "r1bqkbnrpppp1ppp2n54p32P52N2N2PP1PPPPPR1BQKB1Rb": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3/2...Nc6/3. Nf3"
  ],
  "r1bqkb1rpppp1ppp2n2n24p32P52N2N2PP1PPPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3/2...Nc6/3. Nf3/3...Nf6"
  ],
  "rnbqkb1rpppp1ppp5n24p32P52N5PP1PPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3/2...Nf6"
  ],
  "rnbqkb1rpppp1ppp5n24p32P52N3P1PP1PPP1PR1BQKBNRb": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3/2...Nf6/3. g3"
  ],
  "rnbqkb1rpp1p1ppp2p2n24p32P52N3P1PP1PPP1PR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3/2...Nf6/3. g3/3...c6"
  ],
  "rnbqkb1rpppp1p1p5np14p32P52N3P1PP1PPP1PR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3/2...Nf6/3. g3/3...g6"
  ],
  "rnbqkb1rpp1p1ppp2p2n26N12P1p32N5PP1PPPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. c4/1...e5/2. Nc3/2...Nf6/3. Nf3/3...e4/4. Ng5/4...c6"
  ],
  "rnbqkbnrpppp1ppp4p382P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...e6"
  ],
  "rnbqkbnrpppp1ppp4p382P52N5PP1PPPPPR1BQKBNRb": [
    "Chess Opening Theory/1. c4/1...e6/2. Nc3"
  ],
  "rnbqkbnrppp2ppp4p33p42P52N5PP1PPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...e6/2. Nc3/2...d5"
  ],
  "rnbqkbnrpppp1ppp4p382P55N2PP1PPPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. c4/1...e6/2. Nf3"
  ],
  "rnbqkbnrppp2ppp4p33p42P55N2PP1PPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. c4/1...e6/2. Nf3/2...d5"
  ],
  "rnbqkbnrppp2ppp4p33p42P55NP1PP1PPP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. c4/1...e6/2. Nf3/2...d5/3. g3"
  ],
  "rnbqkb1rppp2ppp4pn23p42P55NP1PP1PPP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. c4/1...e6/2. Nf3/2...d5/3. g3/3...Nf6"
  ],
  "rnbqkb1rppp2ppp4pn23p42P55NP1PP1PPPBPRNBQK2Rb": [
    "Chess Opening Theory/1. c4/1...e6/2. Nf3/2...d5/3. g3/3...Nf6/4. Bg2"
  ],
  "rnbqk2rppp1bppp4pn23p42P55NP1PP1PPPBPRNBQK2Rw": [
    "Chess Opening Theory/1. c4/1...e6/2. Nf3/2...d5/3. g3/3...Nf6/4. Bg2/4...Be7"
  ],
  "rnbqk2rppp1bppp4pn23p42P55NP1PP1PPPBPRNBQ1RK1b": [
    "Chess Opening Theory/1. c4/1...e6/2. Nf3/2...d5/3. g3/3...Nf6/4. Bg2/4...Be7/5. O-O"
  ],
  "rnbqkbnrppppp1pp85p22P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...f5"
  ],
  "rnbqkbnrpppppp1p86p12P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...g5"
  ],
  "rnbqkbnrpppppp1p6p182P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...g6"
  ],
  "rnbqkb1rpppppppp5n282P58PP1PPPPPRNBQKBNRw": [
    "Chess Opening Theory/1. c4/1...Nf6"
  ],
  "rnbqkb1rpppppppp5n282P52N5PP1PPPPPR1BQKBNRb": [
    "Chess Opening Theory/1. c4/1...Nf6/2. Nc3"
  ],
  "rnbqkb1rpp1ppppp5n22p52P52N5PP1PPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...Nf6/2. Nc3/2...c5"
  ],
  "rnbqkb1rpppp1ppp4pn282P52N5PP1PPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...Nf6/2. Nc3/2...e6"
  ],
  "rnbqkb1rpppp1ppp4pn282P1P32N5PP1P1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. c4/1...Nf6/2. Nc3/2...e6/3. e4"
  ],
  "rnbqkb1rpp1p1ppp4pn22p52P1P32N5PP1P1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...Nf6/2. Nc3/2...e6/3. e4/3...c5"
  ],
  "rnbqkb1rpppppp1p5np182P52N5PP1PPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. c4/1...Nf6/2. Nc3/2...g6"
  ],
  "rnbqkbnrpppppppp8883P4PPP1PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d3"
  ],
  "rnbqkbnrpppppppp883P48PPP1PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4"
  ],
  "rnbqkbnrp1pppppp81p63P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...b5"
  ],
  "rnbqkbnrp1pppppp1p683P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...b6"
  ],
  "rnbqkbnrpp1ppppp82p53P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...c5"
  ],
  "rnbqkbnrpp1ppppp82pP488PPP1PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...c5/2. d5"
  ],
  "rnbqkbnrpp1p1ppp82pPp388PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...c5/2. d5/2...e5"
  ],
  "rnbqkbnrpp1ppppp2p583P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...c6"
  ],
  "rnbqkbnrpp1ppppp2p582PP48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...c6/2. c4"
  ],
  "rnbqkbnrppp1pppp83p43P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5"
  ],
  "rnbqkbnrppp1pppp83p43P1B28PPP1PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. Bf4"
  ],
  "rnbqkbnrpp2pppp82pp43P1B28PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. Bf4/2...c5"
  ],
  "rnbqkbnrppp1pppp83p2B13P48PPP1PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. Bg5"
  ],
  "rnbqkbnrppp2ppp4p33p2B13P48PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. Bg5/2...e6"
  ],
  "rnbqkbnrppp1ppp17p3p2B13P48PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. Bg5/2...h6"
  ],
  "rnbqkbnrppp1pppp83p42PP48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4"
  ],
  "rn1qkbnrppp1pppp83p1b22PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...Bf5"
  ],
  "rnbqkbnrpp2pppp82pp42PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c5"
  ],
  "rnbqkbnrpp2pppp82pP43P48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c5/3. cxd5"
  ],
  "rnbqkb1rpp2pppp5n22pP43P48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c5/3. cxd5/3... Nf6",
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c5/3. cxd5/3...Nf6"
  ],
  "rnbqkbnrpp2pppp2p53p42PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6"
  ],
  "rnbqkbnrpp2pppp2p53P43P48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. cxd5"
  ],
  "rnbqkbnrpp2pppp2p53p42PP42N5PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3"
  ],
  "rnbqkbnrpp2pppp2p582pP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4"
  ],
  "rnbqkbnrpp2pppp2p582pP42N1P3PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3"
  ],
  "rnbqkbnrp3pppp2p51p62pP42N1P3PP3PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5"
  ],
  "rnbqkbnrp3pppp2p51p6P1pP42N1P31P3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. a4"
  ],
  "rnbqkbnrp3pppp2p51N62pP44P3PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5"
  ],
  "rnbqkbnrp3pppp81p62pP44P3PP3PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5"
  ],
  "rnbqkbnrp3pppp81p62pP44PQ2PP3PPPR1B1KBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3"
  ],
  "r1bqkbnrp3pppp2n51p62pP44PQ2PP3PPPR1B1KBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Nc6"
  ],
  "r1bqkbnrp3pppp2Q51p62pP44P3PP3PPPR1B1KBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Nc6/7. Qxc6"
  ],
  "r2qkbnrp2bpppp2Q51p62pP44P3PP3PPPR1B1KBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Nc6/7. Qxc6/7...Bd7"
  ],
  "r2qkbnrp2bpppp81p62pP44PQ2PP3PPPR1B1KBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Nc6/7. Qxc6/7...Bd7/8. Qf3"
  ],
  "r2qkbnrp2b1ppp81p2p32pP44PQ2PP3PPPR1B1KBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Nc6/7. Qxc6/7...Bd7/8. Qf3/8...e5"
  ],
  "r2qkbnrp2b1ppp81p2P32p54PQ2PP3PPPR1B1KBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Nc6/7. Qxc6/7...Bd7/8. Qf3/8...e5/9. dxe5"
  ],
  "r2qk1nrp2b1ppp81p2P31bp54PQ2PP3PPPR1B1KBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Nc6/7. Qxc6/7...Bd7/8. Qf3/8...e5/9. dxe5/9...Bb4"
  ],
  "r2qk1nrp2b1ppp81p2P31bp54PQ2PP2KPPPR1B2BNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Nc6/7. Qxc6/7...Bd7/8. Qf3/8...e5/9. dxe5/9...Bb4/10. Ke2"
  ],
  "r2qk2rp2b1ppp7n1p2P31bp54PQ2PP2KPPPR1B2BNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Nc6/7. Qxc6/7...Bd7/8. Qf3/8...e5/9. dxe5/9...Bb4/10. Ke2/10...Nh6"
  ],
  "rnb1kbnrp1q1pppp81p62pP44PQ2PP3PPPR1B1KBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Qc7"
  ],
  "Qnb1kbnrp1q1pppp81p62pP44P3PP3PPPR1B1KBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Qc7/7. Qxa8"
  ],
  "Qn2kbnrpbq1pppp81p62pP44P3PP3PPPR1B1KBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Qc7/7. Qxa8/7...Bb7"
  ],
  "1n2kbnrQbq1pppp81p62pP44P3PP3PPPR1B1KBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Qc7/7. Qxa8/7...Bb7/8. Qxa7"
  ],
  "1n2kbnrQbq2ppp81p2p32pP44P3PP3PPPR1B1KBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Qc7/7. Qxa8/7...Bb7/8. Qxa7/8...e5"
  ],
  "1n2kbnrQbq2ppp4p31p62pP44P3PP3PPPR1B1KBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...dxc4/4. e3/4...b5/5. Nxb5/5...cxb5/6. Qf3/6...Qc7/7. Qxa8/7...Bb7/8. Qxa7/8...e6"
  ],
  "rnbqkbnrpp3ppp2p53pp32PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...e5"
  ],
  "rnbqkb1rpp2pppp2p2n23p42PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nc3/3...Nf6"
  ],
  "rnbqkbnrpp2pppp2p53p42PP45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3"
  ],
  "rnbqkbnrpp3ppp2p1p33p42PP45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...e6"
  ],
  "rnbqkb1rpp2pppp2p2n23p42PP45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...Nf6"
  ],
  "rnbqkb1rpp2pppp2p2n23P43P45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...Nf6/4. cxd5"
  ],
  "rnbqkb1rpp2pppp2p2n23p42PP44PN2PP3PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...Nf6/4. e3"
  ],
  "rnbqkb1rpp2pppp2p2n23p42PP42N2N2PP2PPPPR1BQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...Nf6/4. Nc3"
  ],
  "rnbqkb1r1p2ppppp1p2n23p42PP42N2N2PP2PPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...Nf6/4. Nc3/4...a6"
  ],
  "rnbqkb1r1p2ppppp1p2n22Pp43P42N2N2PP2PPPPR1BQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...Nf6/4. Nc3/4...a6/5. c5"
  ],
  "rn1qkb1rpp2pppp2p2n23p1b22PP42N2N2PP2PPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...Nf6/4. Nc3/4...Bf5"
  ],
  "rnbqkb1rpp2pppp2p2n282pP42N2N2PP2PPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...Nf6/4. Nc3/4...dxc4"
  ],
  "rnbqkb1rpp2pppp2p2n28P1pP42N2N21P2PPPPR1BQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...c6/3. Nf3/3...Nf6/4. Nc3/4...dxc4/5. a4"
  ],
  "rnbqkbnrppp1pppp882pP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...dxc4"
  ],
  "rnbqkbnrppp1pppp882pP44P3PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...dxc4/3. e3"
  ],
  "rnbqkbnrppp1pppp882pPP38PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...dxc4/3. e4"
  ],
  "rnbqkbnrppp1pppp882pP42N5PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...dxc4/3. Nc3"
  ],
  "rnbqkbnrppp1p1pp85p22pP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...dxc4/3. Nc3/3...f5"
  ],
  "rnbqkbnrppp1pppp882pP45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...dxc4/3. Nf3"
  ],
  "rnbqkb1rppp1pppp5n282pP45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...dxc4/3. Nf3/3...Nf6"
  ],
  "rnbqkb1rppp1pppp5n282pP44PN2PP3PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...dxc4/3. Nf3/3...Nf6/4. e3"
  ],
  "rnbqkb1rppp2ppp4pn282pP44PN2PP3PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...dxc4/3. Nf3/3...Nf6/4. e3/4...e6"
  ],
  "rnbqkbnrppp2ppp83pp32PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e5"
  ],
  "rnbqkbnrppp2ppp4p33p42PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6"
  ],
  "rnbqkbnrppp2ppp4p33p42PP42N5PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3"
  ],
  "rnbqkbnrpp3ppp4p32pp42PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...c5"
  ],
  "rnbqkbnrpp3ppp2p1p33p42PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...c6"
  ],
  "rnbqkbnrpp3ppp2p1p33p42PPP32N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...c6/4. e4"
  ],
  "rnbqkbnrpp3ppp2p1p382PPp32N5PP3PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...c6/4. e4/4...dxe4"
  ],
  "rnbqkbnrppp3pp4p33p1p22PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...f5"
  ],
  "rnbqkb1rppp2ppp4pn23p42PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6"
  ],
  "rnbqkb1rppp2ppp4pn23p2B12PP42N5PP2PPPPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Bg5"
  ],
  "r1bqkb1rpppn1ppp4pn23p2B12PP42N5PP2PPPPR2QKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Bg5/4...Nbd7"
  ],
  "rnbqkb1rppp2ppp4pn23p42PP42N2N2PP2PPPPR1BQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3"
  ],
  "rnbqk2rppp2ppp4pn23p41bPP42N2N2PP2PPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...Bb4"
  ],
  "rnbqk2rppp1bppp4pn23p42PP42N2N2PP2PPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...Be7"
  ],
  "rnbqkb1rpp3ppp4pn22pp42PP42N2N2PP2PPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...c5"
  ],
  "rnbqkb1rpp3ppp2p1pn23p42PP42N2N2PP2PPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...c6"
  ],
  "rnbqkb1rpp3ppp2p1pn23p2B12PP42N2N2PP2PPPPR2QKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...c6/5. Bg5"
  ],
  "rnbqkb1rpp3ppp2p1pn26B12pP42N2N2PP2PPPPR2QKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...c6/5. Bg5/5...dxc4"
  ],
  "rnbqkb1rpp3ppp2p1pn26B12pPP32N2N2PP3PPPR2QKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...c6/5. Bg5/5...dxc4/6. e4"
  ],
  "rnbqkb1rpp3ppp2p1pn23p42PP42N1PN2PP3PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...c6/5. e3"
  ],
  "r1bqkb1rpp1n1ppp2p1pn23p42PP42N1PN2PP3PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...c6/5. e3/5...Nbd7"
  ],
  "r1bqkb1rpp1n1ppp2p1pn23p42PP42N1PN2PPQ2PPPR1B1KB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...c6/5. e3/5...Nbd7/6. Qc2"
  ],
  "r1bqk2rpp1n1ppp2pbpn23p42PP42N1PN2PPQ2PPPR1B1KB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nc3/3...Nf6/4. Nf3/4...c6/5. e3/5...Nbd7/6. Qc2/6...Bd6"
  ],
  "rnbqkbnrppp2ppp4p33p42PP45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nf3"
  ],
  "rnbqkb1rppp2ppp4pn23p42PP45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nf3/3...Nf6"
  ],
  "rnbqkb1rppp2ppp4pn23p42PP45NP1PP2PP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...e6/3. Nf3/3...Nf6/4. g3"
  ],
  "r1bqkbnrppp1pppp2n53p42PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...Nc6"
  ],
  "rnbqkb1rppp1pppp5n23p42PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...Nf6"
  ],
  "rnbqkb1rppp1pppp5n23P43P48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. c4/2...Nf6/3. cxd5"
  ],
  "rnbqkbnrppp1pppp83p43P44P3PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. e3"
  ],
  "rnbqkbnrppp2ppp4p33p43P44P3PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. e3/2...e6"
  ],
  "rnbqkb1rppp1pppp5n23p43P44P3PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. e3/2...Nf6"
  ],
  "rnbqkbnrppp1pppp83p43PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. e4"
  ],
  "rnbqkbnrpp2pppp82pp43PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. e4/2...c5",
    "Chess Opening Theory/1. e4/1...c5/2. d4/2...d5"
  ],
  "rnbqkbnrppp1pppp883Pp38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. e4/2...dxe4"
  ],
  "rnbqkbnrppp1pppp882BPp38PPP2PPPRNBQK1NRb": [
    "Chess Opening Theory/1. d4/1...d5/2. e4/2...dxe4/3. Bc4"
  ],
  "r1bqkbnrppp1pppp2n582BPp38PPP2PPPRNBQK1NRw": [
    "Chess Opening Theory/1. d4/1...d5/2. e4/2...dxe4/3. Bc4/3...Nc6"
  ],
  "r1bqkbnrppp1pppp2n57Q2BPp38PPP2PPPRNB1K1NRb": [
    "Chess Opening Theory/1. d4/1...d5/2. e4/2...dxe4/3. Bc4/3...Nc6/4. Qh5"
  ],
  "rnbqkbnrppp1pppp883Pp32N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. e4/2...dxe4/3. Nc3"
  ],
  "rn1qkbnrppp1pppp85b23Pp32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. e4/2...dxe4/3. Nc3/3...Bf5"
  ],
  "rnbqkbnrppp2ppp84p33Pp32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. e4/2...dxe4/3. Nc3/3...e5"
  ],
  "rnbqkb1rppp1pppp5n283Pp32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. e4/2...dxe4/3. Nc3/3...Nf6"
  ],
  "rnbqkbnrppp1pppp83p43P48PPPKPPPPRNBQ1BNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. Kd2"
  ],
  "rnbqkbnrppp1pppp83p43P42N5PPP1PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. Nc3"
  ],
  "rn1qkbnrppp1pppp83p1b23P42N5PPP1PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...d5/2. Nc3/2...Bf5"
  ],
  "rnbqkb1rppp1pppp5n1B3p43P42N5PPP1PPPPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. Nc3/2...Nf6/3. Bh6",
    "Chess Opening Theory/1. d4/1...Nf6/2. Nc3/2...d5/3. Bh6"
  ],
  "rnbqkbnrppp1pppp83p43P45N2PPP1PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. Nf3"
  ],
  "rnbqkbnrpp2pppp82pp43P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. Nf3/2...c5"
  ],
  "rnbqkbnrpp2pppp82pp43P45NP1PPP1PP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. Nf3/2...c5/3. g3"
  ],
  "r1bqkbnrpp2pppp2n52pp43P45NP1PPP1PP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. Nf3/2...c5/3. g3/3...Nc6"
  ],
  "rnbqkbnrpp2pppp2p53p43P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. Nf3/2...c6"
  ],
  "rnbqkbnrppp2ppp4p33p43P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...d5/2. Nf3/2...e6"
  ],
  "rnbqkbnrppp2ppp4p33p43P44PN2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. Nf3/2...e6/3. e3"
  ],
  "rnbqkb1rppp1pppp5n23p43P1B25N2PPP1PPPPRN1QKB1Rb": [
    "Chess Opening Theory/1. d4/1...d5/2. Nf3/2...Nf6/3. Bf4"
  ],
  "rnbqkbnrppp1pppp83p43P43Q4PPP1PPPPRNB1KBNRb": [
    "Chess Opening Theory/1. d4/1...d5/2. Qd3"
  ],
  "rnbqkbnrppp1pppp3p483P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d6"
  ],
  "rnbqkbnrppp1pppp3p482PP48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d6/2. c4"
  ],
  "rnbqkbnrppp2ppp3p44p32PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d6/2. c4/2. e5",
    "Chess Opening Theory/1. d4/1...d6/2. c4/2...e5"
  ],
  "rnbqkbnrppp2ppp3p44P32P58PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...d6/2. c4/2...e5/3. dxe5"
  ],
  "r1bqkbnrppp2ppp2np44P32P58PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...d6/2. c4/2...e5/3. dxe5/3...Nc6"
  ],
  "rnbqkbnrppp1pppp3p483P45N2PPP1PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...d6/2. Nf3"
  ],
  "rnbqkbnrpppp1ppp84p33P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...e5"
  ],
  "rnbqkbnrpppp1ppp84P388PPP1PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...e5/2. dxe5"
  ],
  "rnbqkbnrpppp1ppp4p383P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...e6"
  ],
  "rnbqkbnrpppp1ppp4p382PP48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...e6/2. c4"
  ],
  "rnbqkbnrp1pp1ppp1p2p382PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...e6/2. c4/2...b6"
  ],
  "rnbqk1nrpppp1ppp4p381bPP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...e6/2. c4/2...Bb4"
  ],
  "rnbqkbnrpppp2pp4p35p23P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...e6/2. Nf3/2...f5"
  ],
  "rnbqkbnrppppp1pp85p23P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...f5"
  ],
  "rnbqkbnrppppp1pp85pB13P48PPP1PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...f5/2. Bg5"
  ],
  "rnbqkbnrppppp1p17p5pB13P48PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...f5/2. Bg5/2...h6"
  ],
  "rnbqkbnrppppp1p17p5p23P3B8PPP1PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...f5/2. Bg5/2...h6/3. Bh4"
  ],
  "rnbqkbnrppppp1pp85p22PP48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...f5/2. c4"
  ],
  "rnbqkbnrppppp2p6p15p22PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...f5/2. c4/2...g6"
  ],
  "rnbqkb1rppppp2p6pn5p22PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...f5/2. c4/2...g6/3. Nc3/3...Nh6"
  ],
  "rnbqkb1rppppp2p6pn5p22PPP32N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...f5/2. c4/2...g6/3. Nc3/3...Nh6/4. e4"
  ],
  "rnbqk2rppppp1bp6pn82PPN35N2PP3PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. d4/1...f5/2. c4/2...g6/3. Nc3/3...Nh6/4. e4/4...fxe4/5. Nxe4/5...Bg7/6. Nf3"
  ],
  "r1bqk2rp3p1bp2p3pn2Np43P45N2PP3PPPR1BQK2Rb": [
    "Chess Opening Theory/1. d4/1...f5/2. c4/2...g6/3. Nc3/3...Nh6/4. e4/4...fxe4/5. Nxe4/5...Bg7/6. Nf3/6...c6/7. Bd3/7...d5/8. cxd5/8...cxd5/9. Bb5/9...Nc6/10. Bxc6/10...bxc6/11. Nc5",
    "Chess Opening Theory/1. d4/1...f5/2. c4/2...g6/3. Nc3/3...Nh6/4. e4/4...fxe4/5. Nxe4/5...Bg7/6. Nf3/6...c6/7. Bd3/7...d5/8. cxd5/8...cxd5/9. Bb5/9...Nc6/10. Bxc6/10...bxc6/11.Nc5"
  ],
  "rnbqkbnrppppp1pp85p23PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...f5/2. e4"
  ],
  "rnbqkbnrppppp1pp85p23P46P1PPP1PP1PRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...f5/2. g3"
  ],
  "rnbqkbnrppppp2p6p15p23P46P1PPP1PP1PRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...f5/2. g3/2...g6"
  ],
  "rnbqkb1rppppp1pp5n25p23P46P1PPP1PP1PRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...f5/2. g3/2...Nf6"
  ],
  "rnbqkbnrppppp1pp85p23P47PPPP1PPP1RNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...f5/2. h3"
  ],
  "rnbqkbnrppppp1pp85p23P45N2PPP1PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...f5/2. Nf3"
  ],
  "rnbqkb1rppppp1pp5n25p23P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...f5/2. Nf3/2...Nf6"
  ],
  "rnbqkbnrppppp1pp85p23P3P8PPP1PPP1RNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...f5/2.h4"
  ],
  "rnbqkb1rppppp1p15n1p5p1P3P48PPP1PPP1RNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...f5/2.h4/2...Nf6/3.h5/3...h6"
  ],
  "rnbqkbnrpppppp1p86p13P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...g5"
  ],
  "rnbqkbnrpppppp1p86B13P48PPP1PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...g5/2. Bxg5"
  ],
  "rnbqkbnrppppp2p5p26B13P48PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...g5/2. Bxg5/2...f6"
  ],
  "rnbqkbnrpppppp1p6p183P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...g6"
  ],
  "rnbqkbnrpppppp1p6p182PP48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...g6/2. c4"
  ],
  "r1bqkbnrppppppppn783P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Na6"
  ],
  "r1bqkbnrpppppppp2n583P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nc6"
  ],
  "r1bqkbnrpppppppp2n53P488PPP1PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nc6/2. d5"
  ],
  "r1bqkbnrpppppppp83Pn388PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nc6/2. d5/2...Ne5"
  ],
  "r1bqkbnrpppppppp83Pn35P28PPP1P1PPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nc6/2. d5/2...Ne5/3. f4",
    "Chess Opening Theory/1. d4/1...Nc6/2. d5/2...Ne5/3.f4"
  ],
  "r1bqkbnrpppppppp6n13P45P28PPP1P1PPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nc6/2. d5/2...Ne5/3. f4/3...Ng6"
  ],
  "r1bqkbnrpppppppp6n13P44PP28PPP3PPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nc6/2. d5/2...Ne5/3. f4/3...Ng6/4. e4"
  ],
  "r1bqkbnrpppp1ppp6n13Pp34PP28PPP3PPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nc6/2. d5/2...Ne5/3. f4/3...Ng6/4. e4/4...e5"
  ],
  "r1bqkbnrpppp1ppp6n13PpP24P38PPP3PPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nc6/2. d5/2...Ne5/3. f4/3...Ng6/4. e4/4...e5/5. f5"
  ],
  "r1bqkbnrpppp1ppp6n13PP34P38PPP3PPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nc6/2. d5/2...Ne5/3. f4/3...Ng6/4. e4/4...e5/5. fxe5"
  ],
  "rnbqkb1rpppppppp5n283P48PPP1PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6"
  ],
  "rnbqkb1rpppppppp5n283P1B28PPP1PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4"
  ],
  "rnbqkb1rppp1pppp5n23p43P1B28PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...d5"
  ],
  "rnbqkb1rppp1pppp5n23p43P1B24P3PPP2PPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...d5/3. e3"
  ],
  "rnbqkb1rppp2ppp4pn23p43P1B24PN2PPP2PPPRN1QKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...d5/3. e3/3...e6/4. Nf3"
  ],
  "rnbqkb1rpppp1ppp4pn283P1B28PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...e6"
  ],
  "rnbqkb1rpppp1ppp4pn283P1B24P3PPP2PPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...e6/3. e3"
  ],
  "rnbqkb1rp1pp1ppp1p2pn283P1B24P3PPP2PPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...e6/3. e3/3...b6"
  ],
  "rnbqkb1rppp2ppp4pn23p43P1B24P3PPP2PPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...e6/3. e3/3...d5"
  ],
  "rnbqkb1rppp2ppp4pn23p43P1B24P3PPPN1PPPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...e6/3. e3/3...d5/4. Nd2"
  ],
  "rnbqkb1rpp3ppp4pn22pp43P1B24P3PPPN1PPPR2QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...e6/3. e3/3...d5/4. Nd2/4...c5"
  ],
  "rnbqkb1rpp3ppp4pn22pp43P1B22P1P3PP1N1PPPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...e6/3. e3/3...d5/4. Nd2/4...c5/5. c3"
  ],
  "r1bqkb1rpp3ppp2n1pn22pp43P1B22P1P3PP1N1PPPR2QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...e6/3. e3/3...d5/4. Nd2/4...c5/5. c3/5...Nc6"
  ],
  "r1bqkb1rpp3ppp2n1pn22pp43P1B22P1PN2PP1N1PPPR2QKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bf4/2...e6/3. e3/3...d5/4. Nd2/4...c5/5. c3/5...Nc6/6. Ngf3"
  ],
  "rnbqkb1rpppppppp5n26B13P48PPP1PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bg5"
  ],
  "rnbqkb1rppp1pppp5n23p2B13P48PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bg5/2...d5"
  ],
  "rnbqkb1rpppp1ppp4pn26B13P48PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bg5/2...e6"
  ],
  "rnbqkb1rpppppppp86B13Pn38PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bg5/2...Ne4"
  ],
  "rnbqkb1rpppppppp883Pn38PPP1PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bg5/2...Ne4/3. Bc1"
  ],
  "rnbqkb1rpppppppp883PnB28PPP1PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bg5/2...Ne4/3. Bf4"
  ],
  "rnbqkb1rpppppp1p86p13PnB28PPP1PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Bg5/2...Ne4/3. Bf4/3...g5"
  ],
  "rnbqkb1rpppppppp5n282PP48PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4"
  ],
  "rnbqkb1rpp1ppppp5n22p52PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5"
  ],
  "rnbqkb1rpp1ppppp5n22pP42P58PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. d5"
  ],
  "rnbqkb1rp2ppppp5n21ppP42P58PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. d5/3...b5"
  ],
  "rnbqkb1rp2ppppp5n21PpP488PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. d5/3...b5/4. cxb5"
  ],
  "rnbqkb1r3pppppp4n21PpP488PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. d5/3...b5/4. cxb5/4...a6"
  ],
  "rnbqkb1r3pppppP4n22pP488PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. d5/3...b5/4. cxb5/4...a6/5. bxa6"
  ],
  "rn1qkb1r3pppppb4n22pP488PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. d5/3...b5/4. cxb5/4...a6/5. bxa6/5...Bxa6"
  ],
  "rnbqkb1rpp1p1ppp4pn22pP42P58PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. d5/3...e6"
  ],
  "rnbqkb1rpp1p1ppp4pn22pP42P52N5PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. d5/3...e6/4. Nc3"
  ],
  "rnbqkb1rpp1ppppp5n22p52PP45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. Nf3"
  ],
  "rnbqkb1rpp1ppppp5n282Pp45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. Nf3/3...cxd4"
  ],
  "rnbqkb1rpp1ppppp5n282PN48PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...c5/3. Nf3/3...cxd4/4. Nxd4"
  ],
  "rnbqkb1rppp1pppp3p1n282PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...d6"
  ],
  "rnbqkb1rppp1pppp3p1n282PP42N5PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...d6/3. Nc3"
  ],
  "rnbqkb1rppp1pppp3p1n282PP45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...d6/3. Nf3"
  ],
  "rnbqkb1rpppp1ppp5n24p32PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5"
  ],
  "rnbqkb1rpppp1ppp5n24p32PP48PP1BPPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. Bd2"
  ],
  "rnbqkb1rpppp1ppp5n24P32P58PP2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5"
  ],
  "rnbqkb1rpppp1ppp84P32P1n38PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ne4"
  ],
  "rnbqkb1rpppp1ppp84P32P1n3P71P2PPPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ne4/4. a3"
  ],
  "rnbqkb1rpppp1ppp84P32P1n35N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ne4/4. Nf3"
  ],
  "rnbqkb1rpppp1ppp84P32P1n38PPQ1PPPPRNB1KBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ne4/4. Qc2"
  ],
  "rnbqkb1rpppp1ppp84P32P3n18PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4"
  ],
  "rnbqkb1rpppp1ppp84P32P2Bn18PP2PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. Bf4"
  ],
  "rnbqkb1rpppp1p1p84P1p12P2Bn18PP2PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. Bf4/4...g5"
  ],
  "r1bqk2rpppp1ppp2n54P31bP2Bn15N2PP1NPPPPR2QKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. Bf4/4...Nc6/5. Nf3/5...Bb4/6. Nbd2"
  ],
  "r1b1k2rppp1qppp3p44n32P2B2P3P31P1Q1PPPR3KB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. Bf4/4...Nc6/5. Nf3/5...Bb4/6. Nbd2/6...Qe7/7. a3/7...Ngxe5/8. Nxe5/8...Nxe5/9. e3/9...Bxd2/10. Qxd2/10...d6"
  ],
  "r1b1k2rppppqppp84n31bP2B24P3PP1NBPPPR2QK2Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. Bf4/4...Nc6/5. Nf3/5...Bb4/6. Nbd2/6...Qe7/7. e3/7...Ngxe5/8. Nxe5/8...Nxe5/9. Be2"
  ],
  "r1bqk2rpppp1ppp2n54P31bP2Bn12N2N2PP2PPPPR2QKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. Bf4/4...Nc6/5. Nf3/5...Bb4/6. Nc3"
  ],
  "rnb1kb1rppppqppp84P32P2Bn18PP2PPPPRN1QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. Bf4/4...Qe7"
  ],
  "rnbqkb1rpppp1ppp84P32P3n14P3PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. e3"
  ],
  "rnbqkb1rpppp1ppp84n32P54P3PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. e3/4...Nxe5"
  ],
  "rnbqkb1rpppp1ppp84n32P54P2NPP3PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. e3/4...Nxe5/5. Nh3"
  ],
  "rnbqkb1rpppp1ppp84P32P1P1n18PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. e4"
  ],
  "rnbqkb1rpppp1ppp84P32P3n15N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. Nf3"
  ],
  "r1bqkb1rpppp1ppp2n54P32P3n15N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e5/3. dxe5/3...Ng4/4. Nf3/4...Nc6"
  ],
  "rnbqkb1rpppp1ppp4pn282PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6"
  ],
  "rnbqkb1rpppp1ppp4pn26B12PP48PP2PPPPRN1QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Bg5"
  ],
  "rnbqkb1rpppp1ppp4pn282PP46P1PP2PP1PRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. g3"
  ],
  "rnbqkb1rppp2ppp4pn23p42PP46P1PP2PP1PRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. g3/3...d5"
  ],
  "rnbqkb1rpppp1ppp4pn282PP42N5PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3"
  ],
  "rnbqk2rpppp1ppp4pn281bPP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4"
  ],
  "rnbqk2rpppp1ppp4pn281bPP4P1N51P2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. a3"
  ],
  "rnbqk2rpppp1ppp4pn2b72PP4P1N51P2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. a3/4...Ba5"
  ],
  "rnbqk2rpppp1ppp4pn2b71PPP4P1N54PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. a3/4...Ba5/5. b4"
  ],
  "rnbqk2rpppp1ppp1b2pn281PPP4P1N54PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. a3/4...Ba5/5. b4/5...Bb6"
  ],
  "rnbqk2rpppp1ppp1b2pn22P51P1P4P1N54PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. a3/4...Ba5/5. b4/5...Bb6/6. c5"
  ],
  "rnbqk2rpppp1ppp4pn282PP4P1b51P2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. a3/4...Bxc3"
  ],
  "rnbqk2rpppp1ppp4pn26B11bPP42N5PP2PPPPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. Bg5"
  ],
  "rnbqk2rpppp1pp14pn1p6B11bPP42N5PP2PPPPR2QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. Bg5/4...h6"
  ],
  "rnbqk2rpppp1pp14pn1p81bPP3B2N5PP2PPPPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. Bg5/4...h6/5. Bh4"
  ],
  "rnbqk2rpp1p1pp14pn1p2p51bPP3B2N5PP2PPPPR2QKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. Bg5/4...h6/5. Bh4/5...c5"
  ],
  "rnbqk2rpp1p1pp14pn1p2pP41bP4B2N5PP2PPPPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. Bg5/4...h6/5. Bh4/5...c5/6. d5"
  ],
  "rnbqk2rpppp1ppp4pn281bPP42N1P3PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. e3"
  ],
  "rnbqk2rpppp1ppp4pn281bPP41QN5PP2PPPPR1B1KBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. Qb3"
  ],
  "rnbqk2rpppp1ppp4pn281bPP42N5PPQ1PPPPR1B1KBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nc3/3...Bb4/4. Qc2"
  ],
  "rnbqkb1rpppp1ppp4pn282PP45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nf3"
  ],
  "rnbqkb1rp1pp1ppp1p2pn282PP45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nf3/3...b6"
  ],
  "rnbqkb1rp1pp1ppp1p2pn282PP1B25N2PP2PPPPRN1QKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nf3/3...b6/4. Bf4"
  ],
  "rnbqkb1rp1pp1ppp1p2pn282PP45NP1PP2PP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nf3/3...b6/4. g3"
  ],
  "rnbqk2rpppp1ppp4pn281bPP45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...e6/3. Nf3/3...Bb4"
  ],
  "rnbqkb1rpppppp1p5np182PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6"
  ],
  "rnbqkb1rpppppp1p5np182PP45P2PP2P1PPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. f3"
  ],
  "rnbqkb1rpppppp1p5np182PP42N5PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3"
  ],
  "rnbqk2rppppppbp5np182PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7"
  ],
  "rnbqk2rppppppbp5np182PPP32N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4"
  ],
  "rnbqk2rppp1ppbp3p1np182PPP32N5PP3PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...d6"
  ],
  "rnbqk2rppp1ppbp3p1np182PPP32N2P2PP4PPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...d6/5. f3"
  ],
  "rnbq1rk1ppp1ppbp3p1np182PPP32N2P2PP4PPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...d6/5. f3/5...O-O"
  ],
  "rnbq1rk1ppp1ppbp3p1np182PPP32N1BP2PP4PPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...d6/5. f3/5...O-O/6. Be3"
  ],
  "rnbqk2rppp1ppbp3p1np182PPPP22N5PP4PPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...d6/5. f4"
  ],
  "rnbqk2rppp1ppbp3p1np182PPP32N2N2PP3PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...d6/5. Nf3"
  ],
  "rnbq1rk1ppp1ppbp3p1np182PPP32N2N2PP3PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...d6/5. Nf3/5...O-O"
  ],
  "rnbq1rk1ppp1ppbp3p1np182PPP32N2N2PP2BPPPR1BQK2Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...d6/5. Nf3/5...O-O/6. Be2"
  ],
  "rnbq1rk1ppp2pbp3p1np14p32PPP32N2N2PP2BPPPR1BQK2Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...d6/5. Nf3/5...O-O/6. Be2/6...e5"
  ],
  "rnbq1rk1ppppppbp5np182PPP32N5PP3PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. e4/4...O-O"
  ],
  "rnbqk2rppppppbp5np182PP42N2N2PP2PPPPR1BQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...Bg7/4. Nf3"
  ],
  "rnbqkb1rppp1pp1p5np13p42PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5"
  ],
  "rnbqkb1rppp1pp1p5np13P43P42N5PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5"
  ],
  "rnbqkb1rppp1pp1p6p13n43P42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5"
  ],
  "rnbqkb1rppp1pp1p6p13n43PP32N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. e4"
  ],
  "rnbqkb1rppp1pp1p6p183PP32n5PP3PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. e4/5...Nxc3"
  ],
  "rnbqkb1rppp1pp1p6p183PP32P5P4PPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. e4/5...Nxc3/6. bxc3"
  ],
  "rnbqk2rppp1ppbp6p183PP32P5P4PPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. e4/5...Nxc3/6. bxc3/6...Bg7"
  ],
  "rnbqk2rppp1ppbp6p182BPP32P5P4PPPR1BQK1NRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. e4/5...Nxc3/6. bxc3/6...Bg7/7. Bc4"
  ],
  "rnbqk2rpp2ppbp6p12p52BPP32P5P4PPPR1BQK1NRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. e4/5...Nxc3/6. bxc3/6...Bg7/7. Bc4/7...c5"
  ],
  "rnbqk2rppp1ppbp6p183PP32P2N2P4PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. e4/5...Nxc3/6. bxc3/6...Bg7/7. Nf3"
  ],
  "rnbqk2rpp2ppbp6p12p53PP32P2N2P4PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. e4/5...Nxc3/6. bxc3/6...Bg7/7. Nf3/7...c5"
  ],
  "rnbqk2rpp2ppbp6p11Bp53PP32P2N2P4PPPR1BQK2Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. e4/5...Nxc3/6. bxc3/6...Bg7/7. Nf3/7...c5/8. Bb5"
  ],
  "rnbqkb1rppp1pp1p6p13n4N2P48PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nc3/3...d5/4. cxd5/4...Nxd5/5. Na4"
  ],
  "rnbqkb1rpppppp1p5np182PP45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nf3"
  ],
  "rnbqk2rppppppbp5np182PP45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nf3/3...Bg7"
  ],
  "rnbqkb1rppp1pp1p3p1np182PP45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...g6/3. Nf3/3...d6"
  ],
  "r1bqkb1rpppppppp2n2n282PP48PP2PPPPRNBQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...Nc6"
  ],
  "r1bqkb1rpppppppp2n2n282PP42N5PP2PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...Nc6/3. Nc3"
  ],
  "r1bqkb1rpppp1ppp2n1pn282PP42N5PP2PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...Nc6/3. Nc3/3...e6"
  ],
  "r1bqkb1rpppppppp2n2n282PP45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...Nc6/3. Nf3"
  ],
  "r1bqkb1rpppp1ppp2n1pn282PP45N2PP2PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. c4/2...Nc6/3. Nf3/3...e6"
  ],
  "rnbqkb1rpppppppp5n283PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. e4"
  ],
  "rnbqkb1rpppppppp5n283P45P2PPP1P1PPRNBQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. f3"
  ],
  "rnbqkb1rpppppppp5n283P42N5PPP1PPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nc3"
  ],
  "rnbqkb1rppp1pppp5n23p43P42N5PPP1PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nc3/2...d5"
  ],
  "rnbqkb1rppp1pppp5n23p43P1B22N5PPP1PPPPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nc3/2...d5/3. Bf4"
  ],
  "rnbqkb1rppp1pppp5n23p2B13P42N5PPP1PPPPR2QKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nc3/2...d5/3. Bg5"
  ],
  "rnbqkb1rpppppp1p5np183P42N5PPP1PPPPR1BQKBNRw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nc3/2...g6"
  ],
  "rnbqkb1rpppppppp5n283P48PPPNPPPPR1BQKBNRb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nd2"
  ],
  "rnbqkb1rpppppppp5n283P45N2PPP1PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3"
  ],
  "rnbqkb1rp1pppppp5n21p63P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...b5"
  ],
  "rnbqkb1rpp1ppppp5n22p53P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...c5"
  ],
  "rnbqkb1rppp1pppp5n23p43P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...d5"
  ],
  "rnbqkb1rppp1pppp5n23p2B13P45N2PPP1PPPPRN1QKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...d5/3. Bg5"
  ],
  "rnbqkb1rpp2pppp5n22pp2B13P45N2PPP1PPPPRN1QKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...d5/3. Bg5/3...c5"
  ],
  "rnbqkb1rppp2ppp4pn23p2B13P45N2PPP1PPPPRN1QKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...d5/3. Bg5/3...e6"
  ],
  "rnbqkb1rppp2ppp4pn23p2B13P44PN2PPP2PPPRN1QKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...d5/3. Bg5/3...e6/4. e3"
  ],
  "rnbqk2rppp1bppp4pn23p2B13P44PN2PPP2PPPRN1QKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...d5/3. Bg5/3...e6/4. e3/4...Be7"
  ],
  "rnbqkb1rppp1pppp5n23p42PP45N2PP2PPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...d5/3. c4"
  ],
  "rnbqkb1rppp1pppp5n23p43P44PN2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...d5/3. e3"
  ],
  "rnbqkb1rpp2pppp5n22pp43P44PN2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...d5/3. e3/3...c5"
  ],
  "rnbqkb1rpppp1ppp4pn283P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...e6"
  ],
  "rnbqkb1rpppp1ppp4pn283P1B25N2PPP1PPPPRN1QKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...e6/3. Bf4"
  ],
  "rnbqkb1rpppp1ppp4pn26B13P45N2PPP1PPPPRN1QKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...e6/3. Bg5"
  ],
  "rnbqkb1rppp2ppp4pn23p43P44PN2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...e6/3. e3/3...d5"
  ],
  "rnbqkb1rpppppp1p5np183P45N2PPP1PPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...g6"
  ],
  "rnbqkb1rpppppp1p5np183P45NP1PPP1PP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. d4/1...Nf6/2. Nf3/2...g6/3. g3"
  ],
  "rnbqkbnrpppppppp8884P3PPPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e3"
  ],
  "rnbqkbnrppp1pppp83p484P3PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e3/1...d5"
  ],
  "rnbqkbnrpppp1ppp84p384P3PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e3/1...e5"
  ],
  "rnbqkbnrpppp1ppp84p34P38PPPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e3/1...e5/2. e4"
  ],
  "rnbqkbnrpppppppp884P38PPPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4"
  ],
  "rnbqkbnr1ppppppp8p74P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...a5"
  ],
  "rnbqkbnr1pppppppp784P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...a6"
  ],
  "rnbqkbnr1pppppppp782B1P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...a6/2. Bc4"
  ],
  "rnbqkbnr2ppppppp71p62B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...a6/2. Bc4/2...b5"
  ],
  "rnbqkbnr2pppBppp71p64P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...a6/2. Bc4/2...b5/3. Bxf7"
  ],
  "rnbq1bnr2pppkppp71p64P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...a6/2. Bc4/2...b5/3. Bxf7/3...Kxf7"
  ],
  "rnbq1bnr2pppkppp71p5Q4P38PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...a6/2. Bc4/2...b5/3. Bxf7/3...Kxf7/4. Qh5"
  ],
  "rnbq1bnr2pppk1pp5p11p5Q4P38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...a6/2. Bc4/2...b5/3. Bxf7/3...Kxf7/4. Qh5/4...g6"
  ],
  "rnbq1bnr2pppk1pp5p11p1Q44P38PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...a6/2. Bc4/2...b5/3. Bxf7/3...Kxf7/4. Qh5/4...g6/5. Qd5"
  ],
  "rnbqkbnr1ppp1pppp3p382B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...a6/2. Bc4/2...e6"
  ],
  "rnbqkbnr1pppppppp782P1P38PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...a6/2. c4"
  ],
  "rnbqkbnr1pppppppp783PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...a6/2. d4"
  ],
  "rnbqkbnr2ppppppp71p63PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...a6/2. d4/2...b5"
  ],
  "rnbqkbnr2ppppppp71p62PPP38PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...a6/2. d4/2...b5/3. c4"
  ],
  "rn1qkbnr1bppppppp71p62PPP38PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...a6/2. d4/2...b5/3. c4/3...Bb7"
  ],
  "rn1qkbnr1bppppppp71p62PPP32N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...a6/2. d4/2...b5/3. c4/3...Bb7/4. Nc3"
  ],
  "rn1qkbnr1bppppppp781pPPP32N5PP3PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...a6/2. d4/2...b5/3. c4/3...Bb7/4. Nc3/4...b4"
  ],
  "rn1qkbnr1bppppppp781pPPP31QN5PP3PPPR1B1KBNRb": [
    "Chess Opening Theory/1. e4/1...a6/2. d4/2...b5/3. c4/3...Bb7/4. Nc3/4...b4/5. Qb3"
  ],
  "rnbqkbnr2ppppppp71p63PP35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...a6/2. d4/2...b5/3. Nf3"
  ],
  "rn1qkbnr1bppppppp71p63PP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...a6/2. d4/2...b5/3. Nf3/3...Bb7"
  ],
  "rn1qkbnr1bppppppp71p63PP33B1N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...a6/2. d4/2...b5/3. Nf3/3...Bb7/4. Bd3"
  ],
  "rnbqkbnrp1pppppp81p64P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...b5"
  ],
  "rnbqkbnrp1pppppp81B64P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...b5/2. Bxb5"
  ],
  "rn1qkbnrpbpppppp81B64P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...b5/2. Bxb5/2...Bb7"
  ],
  "rn1qkbnrpbpppppp81B64P32N5PPPP1PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...b5/2. Bxb5/2...Bb7/3. Nc3"
  ],
  "rn1qkbnrpbppp1pp81B3p24P32N5PPPP1PPPR1BQK1NRw": [
    "Chess Opening Theory/1. e4/1...b5/2. Bxb5/2...Bb7/3. Nc3/3...f5"
  ],
  "rnbqkbnrp1pppppp1p684P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...b6"
  ],
  "rnbqkbnrp1pppppp1p683PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...b6/2. d4"
  ],
  "rn1qkbnrpbpppppp1p683PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7"
  ],
  "rn1qkbnrpbpppppp1p683PP33B4PPP2PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7/3. Bd3"
  ],
  "rn1qkbnrpbppp1pp1p65p23PP33B4PPP2PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7/3. Bd3/3...f5"
  ],
  "rn1qkbnrpbppp1pp1p65P23P43B4PPP2PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7/3. Bd3/3...f5/4. exf5"
  ],
  "rn1qkbnrp1ppp1pp1p65P23P43B4PPP2PbPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7/3. Bd3/3...f5/4. exf5/4...Bxg2"
  ],
  "rn1qkbnrp1ppp1pp1p65P1Q3P43B4PPP2PbPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7/3. Bd3/3...f5/4. exf5/4...Bxg2/5. Qh5"
  ],
  "rn1qkbnrp1ppp2p1p4p15P1Q3P43B4PPP2PbPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7/3. Bd3/3...f5/4. exf5/4...Bxg2/5. Qh5/5...g6"
  ],
  "rn1qkbnrp1ppp2p1p4P17Q3P43B4PPP2PbPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7/3. Bd3/3...f5/4. exf5/4...Bxg2/5. Qh5/5...g6/6. fxg6"
  ],
  "rn1qkb1rp1ppp2p1p3nP17Q3P43B4PPP2PbPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7/3. Bd3/3...f5/4. exf5/4...Bxg2/5. Qh5/5...g6/6. fxg6/6...Nf6"
  ],
  "rn1qkb1rpbpppppp1p3n283PP33B4PPP2PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...b6/2. d4/2...Bb7/3. Bd3/3...Nf6"
  ],
  "rnbqkbnrpp1ppppp82p54P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5"
  ],
  "rnbqkbnrpp1ppppp82p54P3P71PPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. a3"
  ],
  "r1bqkbnrpp1ppppp2n52p54P3P71PPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. a3/2...Nc6"
  ],
  "r1bqkbnrpp1ppppp2n52p51P2P3P72PP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. a3/2...Nc6/3. b4"
  ],
  "rnbqkbnrpp1ppppp82p54P31P6P1PP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. b3"
  ],
  "rnbqkbnrpp1ppppp82p51P2P38P1PP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. b4"
  ],
  "rnbqkbnrpp1ppppp881p2P38P1PP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. b4/2...cxb4"
  ],
  "rnbqkbnrpp1ppppp881p2P3P72PP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. b4/2...cxb4/3. a3"
  ],
  "rnbqkbnrpp2pppp83p41p2P3P72PP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. b4/2...cxb4/3. a3/3...d5"
  ],
  "rnbqkbnrpp1ppppp82p52B1P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...c5/2. Bc4"
  ],
  "r1bqkbnrpp2pppp2np42p52B1P32P5PP1P1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...c5/2. Bc4/2...d6/3. c3/3...Nc6"
  ],
  "rnbqkbnrpp1ppppp82p54P32P5PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. c3"
  ],
  "rnbqkbnrpp2pppp82pp44P32P5PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. c3/2...d5"
  ],
  "rnbqkbnrpp2pppp82pP482P5PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. c3/2...d5/3. exd5"
  ],
  "rnbqkbnrpp1p1ppp4p32p54P32P5PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. c3/2...e6"
  ],
  "rnbqkb1rpp1ppppp5n22p54P32P5PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. c3/2...Nf6"
  ],
  "rnbqkb1rpp1ppppp5n22p1P382P5PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. c3/2...Nf6/3. e5"
  ],
  "rnbqkb1rpp1ppppp82pnP382P5PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. c3/2...Nf6/3. e5/3...Nd5"
  ],
  "rnbqkb1rpp1ppppp82pnP33P42P5PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. c3/2...Nf6/3. e5/3...Nd5/4. d4"
  ],
  "rnbqkb1rpp1ppppp82p1P34n32P5PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. c3/2...Nf6/3. e5/3...Ne4"
  ],
  "rnbqkbnrpp1ppppp82p1P382P5PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. c3/2...Nf6/3. e5/3...Ng8"
  ],
  "rnbqkbnrpp1ppppp82p52P1P38PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. c4"
  ],
  "rnbqkbnrpp1ppppp82p53PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. d4"
  ],
  "rnbqkbnrpp1ppppp883pP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. d4/2...cxd4"
  ],
  "rnbqkbnrpp1ppppp883pP32P5PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. d4/2...cxd4/3. c3"
  ],
  "rnbqkbnrpp1ppppp884P32Pp4PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. d4/2...cxd4/3. c3/3...d3"
  ],
  "rnbqkbnrpp1ppppp884P32p5PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. d4/2...cxd4/3. c3/3...dxc3"
  ],
  "rnbqkbnrpp1ppppp884P32N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. d4/2...cxd4/3. c3/3...dxc3/4. Nxc3"
  ],
  "r1bqkbnrpp1ppppp2n584P32N5PP3PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. d4/2...cxd4/3. c3/3...dxc3/4. Nxc3/4...Nc6"
  ],
  "rnbqkbnrpp1ppppp883pP35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. d4/2...cxd4/3. Nf3"
  ],
  "rnbqkbnrpp1ppppp883QP38PPP2PPPRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. d4/2...cxd4/3. Qxd4"
  ],
  "rnbqkbnrpp1ppppp82p1P388PPPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. e5"
  ],
  "rnbqkbnrpp1ppppp82p54PP28PPPP2PPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. f4"
  ],
  "rnbqkbnrpp2pppp82pp44PP28PPPP2PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. f4/2...d5"
  ],
  "rnbqkbnrpp1ppppp82p54P38PPPPKPPPRNBQ1BNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. Ke2"
  ],
  "rnbqkbnrpp1ppppp82p54P32N5PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3"
  ],
  "rnbqkbnr1p1pppppp72p54P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...a6"
  ],
  "rnbqkbnrpp2pppp3p42p54P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...d6"
  ],
  "rnbqkbnrpp1p1ppp4p32p54P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...e6"
  ],
  "rnbqkbnrpp1p1ppp4p32p54P32N3P1PPPP1P1PR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...e6/3. g3"
  ],
  "rnbqkbnrpp3ppp4p32pp44P32N3P1PPPP1P1PR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...e6/3. g3/3...d5"
  ],
  "r1bqkbnrpp1ppppp2n52p54P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...Nc6"
  ],
  "r1bqkbnrpp1ppppp2n52p54P32N3P1PPPP1P1PR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...Nc6/3. g3"
  ],
  "r1bqkbnrpp2pppp2np42p54P32N3P1PPPP1P1PR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...Nc6/3. g3/3...d6"
  ],
  "r1bqkbnrpp1p1ppp2n1p32p54P32N3P1PPPP1P1PR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...Nc6/3. g3/3...e6"
  ],
  "r1bqkbnrpp1ppp1p2n3p12p54P32N3P1PPPP1P1PR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nc3/2...Nc6/3. g3/3...g6"
  ],
  "rnbqkbnrpp1ppppp82p54P35N2PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3"
  ],
  "rnbqkbnr1p1pppppp72p54P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...a6"
  ],
  "rnbqkbnr1p1pppppp72p54P32P2N2PP1P1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...a6/3. c3"
  ],
  "rnbqkbnrp2ppppp1p62p54P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...b6"
  ],
  "rnbqkbnrpp2pppp3p42p54P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6"
  ],
  "rnbqkbnrpp2pppp3p41Bp54P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. Bb5"
  ],
  "rn1qkbnrpp1bpppp3p41Bp54P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. Bb5/3...Bd7"
  ],
  "r1bqkbnrpp2pppp2np41Bp54P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. Bb5/3...Nc6"
  ],
  "r1bqkbnrpp1npppp3p41Bp54P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. Bb5/3...Nd7"
  ],
  "rnbqkbnrpp2pppp3p42p54P32P2N2PP1P1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. c3"
  ],
  "rnbqkbnrpp2pppp3p42p53PP35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4"
  ],
  "rnbqkbnrpp2pppp3p483pP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4"
  ],
  "rnbqkbnrpp2pppp3p483pP32P2N2PP3PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. c3"
  ],
  "rnbqkbnrpp2pppp3p483NP38PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4"
  ],
  "rnbqkb1rpp2pppp3p1n283NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6"
  ],
  "rnbqkb1rpp2pppp3p1n283NP32N5PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3"
  ],
  "rnbqkb1r1p2ppppp2p1n283NP32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6"
  ],
  "rnbqkb1r1p2ppppp2p1n283NP32N5PPP1BPPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Be2"
  ],
  "rnbqkb1r1p2ppppp2p1n283NP32N1B3PPP2PPPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Be3"
  ],
  "rnbqkb1r1p3pppp2p1n24p33NP32N1B3PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Be3/6...e5"
  ],
  "rnbqkb1r1p3pppp2p1n24p34P31NN1B3PPP2PPPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Be3/6...e5/7. Nb3"
  ],
  "rn1qkb1r1p3pppp2pbn24p34P31NN1B3PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Be3/6...e5/7. Nb3/7...Be6"
  ],
  "rnbqkb1r1p3pppp2ppn283NP32N1B3PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Be3/6...e6"
  ],
  "rnbqkb1r1p3pppp2ppn283NP1P12N1B3PPP2P1PR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Be3/6...e6/7. g4"
  ],
  "rnbqkb1r1p2ppppp2p483NP1n12N1B3PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Be3/6...Ng4"
  ],
  "rnbqkb1r1p2ppppp2p1n26B13NP32N5PPP2PPPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5"
  ],
  "rnbqkb1r1p3pppp2ppn26B13NP32N5PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6"
  ],
  "rnbqkb1r1p3pppp2ppn26B13NPP22N5PPP3PPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4"
  ],
  "rnbqkb1r5pppp2ppn21p4B13NPP22N5PPP3PPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5"
  ],
  "rnbqkb1r5pppp2ppn21p2P1B13N1P22N5PPP3PPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5"
  ],
  "rnbqkb1r5pppp3pn21p2p1B13N1P22N5PPP3PPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5"
  ],
  "rnbqkb1r5pppp3pn21p2P1B13N42N5PPP3PPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5/9. fxe5"
  ],
  "rnb1kb1r2q2pppp3pn21p2P1B13N42N5PPP3PPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5/9. fxe5/9...Qc7"
  ],
  "rnb1kb1r2q2pppp3pP21p4B13N42N5PPP3PPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5/9. fxe5/9...Qc7/10. exf6"
  ],
  "rnb1kb1r5pppp3pP21p2q1B13N42N5PPP3PPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5/9. fxe5/9...Qc7/10. exf6/10...Qe5"
  ],
  "rnb1kb1r5pppp3pP21p2q1B13N42N5PPP1B1PPR2QK2Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5/9. fxe5/9...Qc7/10. exf6/10...Qe5/11. Be2"
  ],
  "rnb1kb1r5pppp3pP21p4q13N42N5PPP1B1PPR2QK2Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5/9. fxe5/9...Qc7/10. exf6/10...Qe5/11. Be2/11...Qxg5"
  ],
  "rnb1kb1r5pppp3pP21p4q13N42N5PPP1B1PPR2Q1RK1b": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5/9. fxe5/9...Qc7/10. exf6/10...Qe5/11. Be2/11...Qxg5/12. O-O"
  ],
  "rnb1kb1r5pppp3pP21p2q33N42N5PPP1B1PPR2Q1RK1w": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5/9. fxe5/9...Qc7/10. exf6/10...Qe5/11. Be2/11...Qxg5/12. O-O/12...Qe5"
  ],
  "rnb1kb1r5pppp3pP21p2q33N42N5PPP1B1PPR2Q1R1Kb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...b5/8. e5/8...dxe5/9. fxe5/9...Qc7/10. exf6/10...Qe5/11. Be2/11...Qxg5/12. O-O/12...Qe5/13. Kh1"
  ],
  "rnbqk2r1p2bpppp2ppn26B13NPP22N5PPP3PPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...Be7"
  ],
  "rnb1kb1r1p3ppppq1ppn26B13NPP22N5PPP3PPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...Qb6"
  ],
  "rnb1kb1r1p3ppppq1ppn26B13NPP22N5PPPQ2PPR3KB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...Qb6/8. Qd2"
  ],
  "rnb1kb1r1p3pppp2ppn26B13NPP22N5PqPQ2PPR3KB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...Qb6/8. Qd2/8...Qxb2"
  ],
  "rnb1kb1r1p3pppp2ppn26B13NPP22N5PqPQ2PP1R2KB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...Qb6/8. Qd2/8...Qxb2/9. Rb1"
  ],
  "rnb1kb1r1p3pppp2ppn26B13NPP2q1N5P1PQ2PP1R2KB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...e6/7. f4/7...Qb6/8. Qd2/8...Qxb2/9. Rb1/9...Qa3"
  ],
  "r1bqkb1r1p1nppppp2p1n26B13NP32N5PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6/6. Bg5/6...Nbd7"
  ],
  "rnbqkb1rpp3ppp3p1n24p33NP32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e5"
  ],
  "rnbqkb1rpp3ppp3p1n21B2p33NP32N5PPP2PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e5/6. Bb5"
  ],
  "r1bqkb1rpp1n1ppp3p1n21B2p33NP32N5PPP2PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e5/6. Bb5/6...Nbd7"
  ],
  "rnbqkb1rpp3ppp3ppn283NP32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e6"
  ],
  "rnbqkb1rpp3ppp3ppn283NP32N1B3PPP2PPPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e6/6. Be3"
  ],
  "rnbqkb1rpp3ppp3ppn283NP1P12N5PPP2P1PR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e6/6. g4"
  ],
  "rnbqkb1rpp3pp13ppn1p83NP1P12N5PPP2P1PR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e6/6. g4/6...h6"
  ],
  "rnbqkb1rpp2pp1p3p1np183NP32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6"
  ],
  "rnbqkb1rpp2pp1p3p1np183NP32N5PPP1BPPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be2"
  ],
  "rnbqkb1rpp2pp1p3p1np183NP32N1B3PPP2PPPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3"
  ],
  "rnbqk2rpp2ppbp3p1np183NP32N1B3PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7"
  ],
  "rnbqk2rpp2ppbp3p1np183NP32N1BP2PPP3PPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7/7. f3"
  ],
  "rnbq1rk1pp2ppbp3p1np183NP32N1BP2PPP3PPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7/7. f3/7...O-O"
  ],
  "rnbq1rk1pp2ppbp3p1np183NP32N1BP2PPPQ2PPR3KB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7/7. f3/7...O-O/8. Qd2"
  ],
  "r1bq1rk1pp2ppbp2np1np183NP32N1BP2PPPQ2PPR3KB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7/7. f3/7...O-O/8. Qd2/8...Nc6"
  ],
  "r1bq1rk1pp2ppbp2np1np182BNP32N1BP2PPPQ2PPR3K2Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7/7. f3/7...O-O/8. Qd2/8...Nc6/9. Bc4"
  ],
  "r2q1rk1pp1bppbp2np1np182BNP32N1BP2PPPQ2PPR3K2Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7/7. f3/7...O-O/8. Qd2/8...Nc6/9. Bc4/9...Bd7"
  ],
  "r2q1rk1pp1bppbp2np1np182BNP32N1BP2PPPQ2PP2KR3Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7/7. f3/7...O-O/8. Qd2/8...Nc6/9. Bc4/9...Bd7/10. O-O-O"
  ],
  "2rq1rk1pp1bppbp2np1np182BNP32N1BP2PPPQ2PP2KR3Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7/7. f3/7...O-O/8. Qd2/8...Nc6/9. Bc4/9...Bd7/10. O-O-O/10...Rc8"
  ],
  "2rq1rk1pp1bppbp2np1np183NP31BN1BP2PPPQ2PP2KR3Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Bg7/7. f3/7...O-O/8. Qd2/8...Nc6/9. Bc4/9...Bd7/10. O-O-O/10...Rc8/11. Bb3"
  ],
  "rnbqkb1rpp2pp1p3p2p183NP1n12N1B3PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Ng4"
  ],
  "rnbqkb1rpp2pp1p3p2p11B63NP1n12N1B3PPP2PPPR2QK2Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. Be3/6...Ng4/7. Bb5"
  ],
  "rnbqkb1rpp2pp1p3p1np183NPP22N5PPP3PPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. f4"
  ],
  "rnbqk2rpp2ppbp3p1np183NPP22N5PPP3PPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. f4/6...Bg7"
  ],
  "rnbqk2rpp2ppbp3p1np14P33N1P22N5PPP3PPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...g6/6. f4/6...Bg7/7. e5"
  ],
  "rnbqkbnrpp2pppp3p483QP35N2PPP2PPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...cxd4/4. Qxd4"
  ],
  "rnbqkb1rpp2pppp3p1n22p53PP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...Nf6"
  ],
  "rnbqkb1rpp2pppp3p1n22P54P35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. d4/3...Nf6/4. dxc5"
  ],
  "rnbqkbnrpp2pppp3p42p54P32N2N2PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...d6/3. Nc3"
  ],
  "rnbqkbnrpp1p1ppp4p32p54P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6"
  ],
  "rnbqkbnrpp1p1ppp4p32p54P31P3N2P1PP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. b3"
  ],
  "rnbqkbnrpp1p1ppp4p32p53PP35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4"
  ],
  "rnbqkbnrpp1p1ppp4p383pP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4"
  ],
  "rnbqkbnrpp1p1ppp4p383NP38PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4"
  ],
  "rnbqkbnr1p1p1pppp3p383NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4/4...a6"
  ],
  "rnbqkbnr1p1p1pppp3p383NP32N5PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4/4...a6/5. Nc3"
  ],
  "r1bqkbnrpp1p1ppp2n1p383NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4/4...Nc6"
  ],
  "r1bqkbnrpp1p1ppp2n1p383NP32N5PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4/4...Nc6/5. Nc3"
  ],
  "r1bqkb1rpp1p1ppp2n1pn283NP32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4/4...Nc6/5. Nc3/5...Nf6"
  ],
  "rnbqkb1rpp1p1ppp4pn283NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4/4...Nf6"
  ],
  "rnbqkb1rpp1p1ppp4pn283NP32N5PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3"
  ],
  "rnbqkb1r1p1p1pppp3pn283NP32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...a6"
  ],
  "rnb1kbnrpp1p1ppp1q2p383NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. d4/3...cxd4/4. Nxd4/4...Qb6"
  ],
  "rnbqkbnrpp1p1ppp4p32p54P32N2N2PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. Nc3"
  ],
  "rnbqkbnr1p1p1pppp3p32p54P32N2N2PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...e6/3. Nc3/3...a6"
  ],
  "rnbqkbnrpp1ppp1p6p12p54P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...g6"
  ],
  "r1bqkbnrpp1ppppp2n52p54P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6"
  ],
  "r1bqkbnrpp1ppppp2n52p51P2P35N2P1PP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. b4"
  ],
  "r1bqkbnrpp1ppppp2n581p2P35N2P1PP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. b4/3...cxb4"
  ],
  "r1bqkbnrpp1ppppp2n51Bp54P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. Bb5"
  ],
  "r1bqkbnr1p1pppppp1n51Bp54P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. Bb5/3...a6"
  ],
  "r1bqkbnrpp1ppp1p2n3p11Bp54P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. Bb5/3...g6"
  ],
  "r1bqkbnrpp1ppppp2n52p54P32P2N2PP1P1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. c3"
  ],
  "r1bqkbnrpp1ppppp2n52p53PP35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4"
  ],
  "r1bqkbnrpp1ppppp2n583pP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4"
  ],
  "r1bqkbnrpp1ppppp2n583NP38PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4"
  ],
  "r1bqkbnrpp2pppp2n53p43NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...d5"
  ],
  "r1bqkbnrpp1p1ppp2n54p33NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...e5"
  ],
  "r1bqkbnrpp1p1ppp2n51N2p34P38PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...e5/5. Nb5"
  ],
  "r1bqkbnrpp3ppp2np41N2p34P38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...e5/5. Nb5/5...d6"
  ],
  "r1bqkbnrpp1ppp1p2n3p183NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6"
  ],
  "r1bqkbnrpp1ppp1p2n3p182PNP38PP3PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. c4"
  ],
  "r1bqk1nrpp1pppbp2n3p182PNP38PP3PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. c4/5...Bg7"
  ],
  "r1bqk1nrpp1pppbp2n3p182PNP34B3PP3PPPRN1QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. c4/5...Bg7/6. Be3"
  ],
  "r1bqk2rpp1pppbp2n2np182PNP34B3PP3PPPRN1QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. c4/5...Bg7/6. Be3/6...Nf6"
  ],
  "r1bqk2rpp1pppbp2n2np182PNP32N1B3PP3PPPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. c4/5...Bg7/6. Be3/6...Nf6/7. Nc3"
  ],
  "r1bqk2rpp1pppbp2n3p182PNP1n12N1B3PP3PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. c4/5...Bg7/6. Be3/6...Nf6/7. Nc3/7...Ng4"
  ],
  "r1bqkbnrpp1ppp1p2n3p183NP32N5PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. Nc3"
  ],
  "r1bqk1nrpp1pppbp2n3p183NP32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. Nc3/5...Bg7"
  ],
  "r1bqk1nrpp1pppbp2n3p183NP32N1B3PPP2PPPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. Nc3/5...Bg7/6. Be3"
  ],
  "r1bqk2rpp1pppbp2n2np183NP32N1B3PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...g6/5. Nc3/5...Bg7/6. Be3/6...Nf6"
  ],
  "r1bqkb1rpp1ppppp2n2n283NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6"
  ],
  "r1bqkb1rpp1ppppp2n2n283NP32N5PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3"
  ],
  "r1bqkb1rpp2pppp2np1n283NP32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...d6"
  ],
  "r1bqkb1rpp2pppp2np1n282BNP32N5PPP2PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...d6/6. Bc4"
  ],
  "r1bqkb1rpp2pppp2np1n26B13NP32N5PPP2PPPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...d6/6. Bg5"
  ],
  "r1bqkb1rpp3ppp2nppn26B13NP32N5PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...d6/6. Bg5/6...e6"
  ],
  "r1bqkb1rpp3ppp2nppn26B13NP32N5PPPQ1PPPR3KB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...d6/6. Bg5/6...e6/7. Qd2"
  ],
  "r1bqkb1r1p3pppp1nppn26B13NP32N5PPPQ1PPPR3KB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...d6/6. Bg5/6...e6/7. Qd2/7...a6"
  ],
  "r1bqkb1r1p3pppp1nppn26B13NP32N5PPPQ1PPP2KR1B1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...d6/6. Bg5/6...e6/7. Qd2/7...a6/8. O-O-O"
  ],
  "r1bqkb1rpp1p1ppp2n2n24p33NP32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e5"
  ],
  "r1bqkb1rpp1p1ppp2n2n21N2p34P32N5PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e5/6. Ndb5"
  ],
  "r1bqkb1rpp3ppp2np1n21N2p34P32N5PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e5/6. Ndb5/6...d6"
  ],
  "r1bqkb1rpp3ppp2np1n21N2p1B14P32N5PPP2PPPR2QKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e5/6. Ndb5/6...d6/7. Bg5"
  ],
  "r1bqkb1r1p3pppp1np1n21N2p1B14P32N5PPP2PPPR2QKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...cxd4/4. Nxd4/4...Nf6/5. Nc3/5...e5/6. Ndb5/6...d6/7. Bg5/7...a6"
  ],
  "r1bqkbnrpp1p1ppp2n1p32p53PP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. d4/3...e6"
  ],
  "r1bqkbnrpp1ppppp2n52p54P32N2N2PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. Nc3"
  ],
  "r1bqkbnrpp2pppp2np42p54P32N2N2PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. Nc3/3...d6"
  ],
  "r1bqkbnrpp1p1ppp2n1p32p54P32N2N2PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nc6/3. Nc3/3...e6"
  ],
  "rnbqkb1rpp1ppppp5n22p54P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c5/2. Nf3/2...Nf6"
  ],
  "rnbqkbnrpp1ppppp2p584P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6"
  ],
  "rnbqkbnrpp1ppppp2p584P31P6P1PP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. b3"
  ],
  "rnbqkbnrpp1ppppp2p582B1P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. Bc4"
  ],
  "rnbqkbnrpp2pppp2p53p42B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. Bc4/2...d5"
  ],
  "rnbqkbnrpp2pppp2p53p44P31B6PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. Bc4/2...d5/3. Bb3"
  ],
  "rnbqkbnrpp1ppppp2p582P1P38PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. c4"
  ],
  "rnbqkbnrpp2pppp2p53p42P1P38PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. c4/2...d5"
  ],
  "rnbqkbnrpp2pppp2p53P44P38PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. c4/2...d5/3. cxd5"
  ],
  "rnbqkbnrpp2pppp2p53P42P58PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. c4/2...d5/3. exd5"
  ],
  "rnbqkbnrpp2pppp83p42P58PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. c4/2...d5/3. exd5/3...cxd5"
  ],
  "rnbqkbnrpp2pppp83P488PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. c4/2...d5/3. exd5/3...cxd5/4. cxd5"
  ],
  "rnbqkb1rpp2pppp5n23P488PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. c4/2...d5/3. exd5/3...cxd5/4. cxd5/4...Nf6"
  ],
  "rnbqkbnrpp1p1ppp2p54p32P1P38PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. c4/2...e5"
  ],
  "rnbqkbnrpp1ppppp2p584P33P4PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d3"
  ],
  "rnbqkbnrpp2pppp2p53p44P33P4PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d3/2...d5"
  ],
  "rnbqkbnrpp1ppppp2p583PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4"
  ],
  "rnbqkbnrpp2pppp2p53p43PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5"
  ],
  "rnbqkbnrpp2pppp2p53pP33P48PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5"
  ],
  "rn1qkbnrpp2pppp2p53pPb23P48PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5"
  ],
  "rn1qkbnrpp2pppp2p53pPb23P43B4PPP2PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Bd3"
  ],
  "rn1qkbnrpp2pppp2p3b13pP33P43B4PPP2PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Bd3/4...Bg6"
  ],
  "rn1qkbnrpp2pppp2p53pP33P43b4PPP2PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Bd3/4...Bxd3"
  ],
  "rn1qkbnrpp2pppp2p53pP33P43Q4PPP2PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Bd3/4...Bxd3/5. Qxd3"
  ],
  "rn1qkbnrpp3ppp2p1p33pP33P43Q4PPP2PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Bd3/4...Bxd3/5. Qxd3/5...e6"
  ],
  "rn1qkbnrpp3ppp2p1p33pP33P43QB3PPP2PPPRN2K1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Bd3/4...Bxd3/5. Qxd3/5...e6/6. Be3"
  ],
  "r2qkbnrpp1npppp2p53pP33P43Q4PPP2PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Bd3/4...Bxd3/5. Qxd3/5...Nd7"
  ],
  "rn1qkbnrpp3ppp2p1p33pPb23P43B4PPP2PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Bd3/4...e6"
  ],
  "rn1qkbnrpp2pppp2p53pPb23P2P18PPP2P1PRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. g4"
  ],
  "rn1qkbnrpp2pppp2p53pPb23P3P8PPP2PP1RNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. h4"
  ],
  "rn1qkbnrpp2pppp2p53pPb23P42N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nc3"
  ],
  "rn1qkbnrpp3ppp2p1p33pPb23P42N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nc3/4...e6"
  ],
  "rn1qkbnrpp2pppp2p53pPb23P45N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3"
  ],
  "rn1qkbnrpp3ppp2p1p33pPb23P45N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6"
  ],
  "rn1qkbnrpp3ppp2p1p33pPb23P45N2PPP1BPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2"
  ],
  "rn1qkbnr1p3pppp1p1p33pPb23P45N2PPP1BPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...a6"
  ],
  "rn1qk1nrpp3ppp2p1p33pPb21b1P45N2PPP1BPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Bb4"
  ],
  "rn1qkbnrpp3ppp2p1p33pP33P2b15N2PPP1BPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Bg4"
  ],
  "r2qkbnrpp1n1ppp2p1p33pPb23P45N2PPP1BPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Nd7"
  ],
  "r2qkbnrpp1n1ppp2p1p33pPb23P45N2PPP1BPPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Nd7/6. O-O"
  ],
  "r2qkb1rpp1nnppp2p1p33pPb23P45N2PPP1BPPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Nd7/6. O-O/6...Ne7"
  ],
  "r2qkb1rpp1nnppp2p1p33pPb23P3N8PPP1BPPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Nd7/6. O-O/6...Ne7/7. Nh4"
  ],
  "r2qkb1rpp1nnppp2p1p1b13pP33P3N8PPP1BPPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Nd7/6. O-O/6...Ne7/7. Nh4/7...Bg6"
  ],
  "r2qkb1rpp1nnppp2p1p1b13pP33P3N8PPPNBPPPR1BQ1RK1b": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Nd7/6. O-O/6...Ne7/7. Nh4/7...Bg6/8. Nd2"
  ],
  "r2qkb1rpp1nnppp4p1b12ppP33P3N8PPPNBPPPR1BQ1RK1w": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Nd7/6. O-O/6...Ne7/7. Nh4/7...Bg6/8. Nd2/8...c5"
  ],
  "r2qkb1rpp1nnppp4p1b12ppP33P3N2P5PP1NBPPPR1BQ1RK1b": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Nd7/6. O-O/6...Ne7/7. Nh4/7...Bg6/8. Nd2/8...c5/9. c3"
  ],
  "r2qkb1rpp1n1ppp2n1p1b12ppP33P3N2P5PP1NBPPPR1BQ1RK1w": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...Bf5/4. Nf3/4...e6/5. Be2/5...Nd7/6. O-O/6...Ne7/7. Nh4/7...Bg6/8. Nd2/8...c5/9. c3/9...Nc6"
  ],
  "rnbqkbnrpp2pppp82ppP33P48PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...c5"
  ],
  "rnbqkbnrpp2pppp82ppP33P42P5PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...c5/4. c3"
  ],
  "rnbqkbnrpp2pppp83pP33p42P5PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...c5/4. c3/4...cxd4"
  ],
  "r1bqkbnrpp2pppp2n52ppP33P42P5PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6"
  ],
  "rnbqkbnrpp2pppp2p53P43P48PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5"
  ],
  "rnbqkbnrpp2pppp83p43P48PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5"
  ],
  "rnbqkbnrpp2pppp83p43P43B4PPP2PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3"
  ],
  "r1bqkbnrpp2pppp2n53p43P43B4PPP2PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6"
  ],
  "r1bqkbnrpp2pppp2n53p43P42PB4PP3PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3"
  ],
  "r1bqkb1rpp2pppp2n2n23p43P42PB4PP3PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6"
  ],
  "r1bqkb1rpp2pppp2n2n23p43P1B22PB4PP3PPPRN1QK1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4"
  ],
  "r2qkb1rpp2pppp2n2n23p43P1Bb12PB4PP3PPPRN1QK1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4"
  ],
  "r2qkb1rpp2pppp2n2n23p43P1Bb11QPB4PP3PPPRN2K1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3"
  ],
  "r3kb1rpp1qpppp2n2n23p43P1Bb11QPB4PP3PPPRN2K1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7"
  ],
  "r3kb1rpp1qpppp2n2n23p43P1Bb11QPB4PP1N1PPPR3K1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2"
  ],
  "r3kb1rpp1q1ppp2n1pn23p43P1Bb11QPB4PP1N1PPPR3K1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2/8...e6"
  ],
  "r3kb1rpp1q1ppp2n1pn23p43P1Bb11QPB1N2PP1N1PPPR3K2Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2/8...e6/9. Ngf3"
  ],
  "r3k2rpp1q1ppp2nbpn23p43P1Bb11QPB1N2PP1N1PPPR3K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2/8...e6/9. Ngf3/9...Bd6"
  ],
  "r3k2rpp1q1ppp2nBpn23p43P2b11QPB1N2PP1N1PPPR3K2Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2/8...e6/9. Ngf3/9...Bd6/10. Bxd6"
  ],
  "r3k2rpp3ppp2nqpn23p43P2b11QPB1N2PP1N1PPPR3K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2/8...e6/9. Ngf3/9...Bd6/10. Bxd6/10...Qxd6"
  ],
  "r3k2rpQ3ppp2nqpn23p43P2b12PB1N2PP1N1PPPR3K2Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2/8...e6/9. Ngf3/9...Bd6/10. Bxd6/10...Qxd6/11. Qxb7"
  ],
  "r3kb1rpp1q1ppp2n1pn23p43P1B21QPB1b2PP1N1PPPR3K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2/8...e6/9. Ngf3/9...Bxf3"
  ],
  "r3kb1rpp1q1ppp2n1pn23p43P1B21QPB1N2PP3PPPR3K2Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2/8...e6/9. Ngf3/9...Bxf3/10. Nxf3"
  ],
  "r3k2rpp1q1ppp2nbpn23p43P1B21QPB1N2PP3PPPR3K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. Bd3/4...Nc6/5. c3/5...Nf6/6. Bf4/6...Bg4/7. Qb3/7...Qd7/8. Nd2/8...e6/9. Ngf3/9...Bxf3/10. Nxf3/10...Bd6"
  ],
  "rnbqkbnrpp2pppp83p42PP48PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. exd5/3...cxd5/4. c4"
  ],
  "rnbqkbnrpp2pppp2p53p43PP35P2PPP3PPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. f3"
  ],
  "rnbqkbnrpp2pppp2p53p43PP32N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3"
  ],
  "rnbqkbnrpp2pppp2p583Pp32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4"
  ],
  "rnbqkbnrpp2pppp2p582BPp32N5PPP2PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Bc4"
  ],
  "rnbqkbnrpp2pppp2p583PN38PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4"
  ],
  "rn1qkbnrpp2pppp2p55b23PN38PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5"
  ],
  "rn1qkbnrpp2pppp2p55b23PN33B4PPP2PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Bd3"
  ],
  "rn2kbnrpp2pppp2p55b23qN33B4PPP2PPPR1BQK1NRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Bd3/5...Qxd4"
  ],
  "rn1qkb1rpp2pppp2p2n25b24N33B1N2PPP1QPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Bd3/5...Qxd4/6. Nf3/6...Qd8/7. Qe2/7...Nf6"
  ],
  "rn1qkbnrpp2pppp2p55b23P46N1PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3"
  ],
  "rn1qkbnrpp2pppp2p3b183P46N1PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6"
  ],
  "rn1qkbnrpp2pppp2p3b183P3P6N1PPP2PP1R1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4"
  ],
  "rn1qkbnrpp2ppp12p3b17p3P3P6N1PPP2PP1R1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h5"
  ],
  "rn1qkbnrpp2ppp12p3bp83P3P6N1PPP2PP1R1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6"
  ],
  "rn1qkbnrpp2ppp12p3bp7P3P46N1PPP2PP1R1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. h5"
  ],
  "rn1qkbnrpp2ppp12p3bp83P3P5NN1PPP2PP1R1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3"
  ],
  "rn1qkbnrpp3pp12p1p1bp83P3P5NN1PPP2PP1R1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...e6"
  ],
  "r2qkbnrpp1nppp12p3bp83P3P5NN1PPP2PP1R1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7"
  ],
  "r2qkbnrpp1nppp12p3bp7P3P45NN1PPP2PP1R1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5"
  ],
  "r2qkbnrpp1npppb2p4p7P3P45NN1PPP2PP1R1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7"
  ],
  "r2qkbnrpp1npppb2p4p7P3P43B1NN1PPP2PP1R1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3"
  ],
  "r2qkbnrpp1nppp12p4p7P3P43b1NN1PPP2PP1R1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3"
  ],
  "r2qkbnrpp1nppp12p4p7P3P43Q1NN1PPP2PP1R1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3"
  ],
  "r2qkbnrpp1n1pp12p1p2p7P3P43Q1NN1PPP2PP1R1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3/10...e6"
  ],
  "r2qkbnrpp1n1pp12p1p2p7P3P43Q1NN1PPPB1PP1R3K2Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3/10...e6/11. Bd2"
  ],
  "r2qkb1rpp1n1pp12p1pn1p7P3P43Q1NN1PPPB1PP1R3K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3/10...e6/11. Bd2/11...Ngf6"
  ],
  "r2qkb1rpp1n1pp12p1pn1p7P3P43Q1NN1PPPB1PP12KR3Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3/10...e6/11. Bd2/11...Ngf6/12. O-O-O"
  ],
  "r2qk2rpp1nbpp12p1pn1p7P3P43Q1NN1PPPB1PP12KR3Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3/10...e6/11. Bd2/11...Ngf6/12. O-O-O/12...Be7"
  ],
  "r3kbnrppqn1pp12p1p2p7P3P43Q1NN1PPPB1PP1R3K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3/10...e6/11. Bd2/11...Qc7"
  ],
  "r2qkbnrpp1n1pp12p1p2p7P3P1B23Q1NN1PPP2PP1R3K2Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3/10...e6/11. Bf4"
  ],
  "r3kbnrpp1n1pp12p1p2pq6P3P1B23Q1NN1PPP2PP1R3K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3/10...e6/11. Bf4/11...Qa5"
  ],
  "r3kbnrppqnppp12p4p7P3P43Q1NN1PPP2PP1R1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...h6/7. Nf3/7...Nd7/8. h5/8...Bh7/9. Bd3/9...Bxd3/10. Qxd3/10...Qc7"
  ],
  "r2qkbnrpp1npppp2p3b183P3P6N1PPP2PP1R1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. h4/6...Nd7"
  ],
  "rn1qkbnrpp2pppp2p3b183P45NN1PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Bf5/5. Ng3/5...Bg6/6. Nf3"
  ],
  "rnbqkbnrpp2p1pp2p2p283PN38PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...f6"
  ],
  "rnbqkbnrpp2p1pp2p2p283P46N1PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...f6/5. Ng3"
  ],
  "rnbqkbnrpp2ppp12p4p83PN38PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...h6"
  ],
  "r1bqkbnrpp1npppp2p583PN38PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nd7"
  ],
  "r1bqkbnrpp1npppp2p56N13P48PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nd7/5. Ng5"
  ],
  "r1bqkbnrpp1nppp12p4p6N13P48PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nd7/5. Ng5/5...h6"
  ],
  "r1bqkbnrpp1nppp12p1N2p83P48PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nd7/5. Ng5/5...h6/6. Ne6"
  ],
  "r1bqkbnrpp1npppp2p583PN38PPP1QPPPR1B1KBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nd7/5. Qe2"
  ],
  "r1bqkb1rpp1npppp2p2n283PN38PPP1QPPPR1B1KBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nd7/5. Qe2/5...Ngf6"
  ],
  "rnbqkb1rpp2pppp2p2n283PN38PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nf6"
  ],
  "rnbqkb1rpp2pppp2p2N283P48PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nf6/5. Nxf6"
  ],
  "rnbqkb1rpp3ppp2p2p283P48PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nf6/5. Nxf6/5...exf6"
  ],
  "rnbqkb1rpp2pp1p2p2p283P48PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nf6/5. Nxf6/5...gxf6"
  ],
  "rnbqkb1rpp2pppp2p2n283PN33Q4PPP2PPPR1B1KBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nf6/5. Qd3"
  ],
  "rnbqkb1rpp3ppp2p2n24p33PN33Q4PPP2PPPR1B1KBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Nf6/5. Qd3/5...e5"
  ],
  "rnb1kbnrpp2pppp2p53q43PN38PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nc3/3...dxe4/4. Nxe4/4...Qd5"
  ],
  "rnbqkbnrpp2pppp2p53p43PP38PPPN1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nd2"
  ],
  "rnbqkbnrpp2pppp2p583Pp38PPPN1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...d5/3. Nd2/3...dxe4"
  ],
  "rnbqkbnrpp1ppp1p2p3p183PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...c6/2. d4/2...g6"
  ],
  "rnbqkbnrpp1ppppp2p584P32N5PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...c6/2. Nc3"
  ],
  "rnbqkbnrpp2pppp2p53p44P32N2N2PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. Nc3/2...d5/3. Nf3"
  ],
  "r1bqkb1rpp1npppp2p583PQ35N2PPP2PPPR1B1KB1Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. Nc3/2...d5/3. Nf3/3...dxe4/4. Nxe4/4...Nf6/5. Qe2/5...Nxe4/6. Qxe4/6...Nd7/7. d4"
  ],
  "rnbqkbnrpp1ppppp2p584P38PPPPNPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. Ne2"
  ],
  "rnbqkbnrpp1ppppp2p584P35N2PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...c6/2. Nf3"
  ],
  "rnbqkbnrppp1pppp83p44P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...d5"
  ],
  "rnbqkbnrppp1pppp83p44P33P4PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...d5/2. d3"
  ],
  "rnbqkbnrppp1pppp83pP388PPPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...d5/2. e5"
  ],
  "rnbqkbnrppp1pppp83P488PPPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5"
  ],
  "rnbqkbnrpp2pppp2p53P488PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...c6"
  ],
  "rnbqkb1rppp1pppp5n23P488PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Nf6"
  ],
  "rnbqkb1rppp1pppp5n23P42P58PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Nf6/3. c4"
  ],
  "rnbqkb1rppp1pppp5n23P43P48PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Nf6/3. d4"
  ],
  "rnb1kbnrppp1pppp83q488PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Qxd5"
  ],
  "rnb1kbnrppp1pppp83q488PPPPKPPPRNBQ1BNRb": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Qxd5/3. Ke2"
  ],
  "rnb1kbnrppp1pppp884q38PPPPKPPPRNBQ1BNRw": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Qxd5/3. Ke2/3...Qe4"
  ],
  "rnb1kbnrppp1pppp83q482N5PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Qxd5/3. Nc3"
  ],
  "rnb1kbnrppp1pppp8q782N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Qxd5/3. Nc3/3...Qa5"
  ],
  "rnb1kbnrppp1pppp3q4882N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Qxd5/3. Nc3/3...Qd6"
  ],
  "rnbqkbnrppp1pppp8882N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...d5/2. exd5/2...Qxd5/3. Nc3/3...Qd8"
  ],
  "rnbqkbnrppp1pppp83p44P32N5PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...d5/2. Nc3"
  ],
  "rnbqkbnrppp1pppp83p44P35N2PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...d5/2. Nf3"
  ],
  "rnbqkbnrppp1pppp884p35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...d5/2. Nf3/2...dxe4"
  ],
  "rnbqkbnrppp1pppp3p484P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...d6"
  ],
  "rnbqkbnrppp1pppp3p41B64P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...d6/2. Bb5"
  ],
  "rnbqkbnrppp1pppp3p483PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...d6/2. d4"
  ],
  "rnbqkbnrppp1p1pp3p45p23PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...f5"
  ],
  "rnbqkbnrppp1pp1p3p2p183PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...g6"
  ],
  "rnbqkb1rppp1pppp3p1n283PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6"
  ],
  "rnbqkb1rppp1pppp3p1n283PP32N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3"
  ],
  "rnbqkb1rppp1pp1p3p1np183PP32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3/3...g6"
  ],
  "rnbqkb1rppp1pp1p3p1np183PP32N5PPP1BPPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3/3...g6/4. Be2"
  ],
  "rnbqkb1rppp1pp1p3p1np183PPP22N5PPP3PPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3/3...g6/4. f4"
  ],
  "rnbqk2rppp1ppbp3p1np183PPP22N5PPP3PPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3/3...g6/4. f4/4...Bg7"
  ],
  "rnbqk2rppp1ppbp3p1np183PPP22N2N2PPP3PPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3/3...g6/4. f4/4...Bg7/5. Nf3"
  ],
  "rnbqk2rpp2ppbp3p1np12p53PPP22N2N2PPP3PPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3/3...g6/4. f4/4...Bg7/5. Nf3/5...c5"
  ],
  "rnbqk2rpp2ppbp3p1np12P54PP22N2N2PPP3PPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3/3...g6/4. f4/4...Bg7/5. Nf3/5...c5/6. dxc5"
  ],
  "rnb1k2rpp2ppbp3p1np1q1P54PP22N2N2PPP3PPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3/3...g6/4. f4/4...Bg7/5. Nf3/5...c5/6. dxc5/6...Qa5"
  ],
  "rnbq1rk1ppp1ppbp3p1np183PPP22N2N2PPP3PPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...d6/2. d4/2...Nf6/3. Nc3/3...g6/4. f4/4...Bg7/5. Nf3/5...O-O"
  ],
  "rnbqkbnrppp1pppp3p484P35N2PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...d6/2. Nf3"
  ],
  "rnbqkbnrppp1pppp3p484P1Q18PPPP1PPPRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...d6/2. Qg4"
  ],
  "rnbqkbnrpppp1ppp84p34P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5"
  ],
  "rnbqkbnrpppp1ppp84p34P31P6P1PP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. b3"
  ],
  "rnbqkbnrpppp1ppp81B2p34P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bb5"
  ],
  "rnbqk1nrpppp1ppp81Bb1p34P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bb5/2...Bc5"
  ],
  "rnbqk1nrpppp1ppp81Bb1p31P2P38P1PP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bb5/2...Bc5/3. b4"
  ],
  "rnbqkbnrpp1p1ppp2p54p3B3P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bb5/2...c6/3. Ba4"
  ],
  "rnbqkbnrp2p1ppp2p51p2p3B3P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bb5/2...c6/3. Ba4/3...b5"
  ],
  "rnbqkbnrpppp1ppp84p32B1P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4"
  ],
  "rnbqkbnr1ppp1pppp74p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...a6"
  ],
  "rnbqkbnrp1pp1ppp81p2p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...b5"
  ],
  "rnbqkbnrp1pp1ppp1p64p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...b6"
  ],
  "rnbqk1nrpppp1ppp82b1p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Bc5"
  ],
  "rnbqk1nrpppp1ppp82b1p32B1P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Bc5/3. Nf3"
  ],
  "rnbqk1nrpppp1ppp82b1p2Q2B1P38PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Bc5/3. Qh5"
  ],
  "r1bqk1nrpppp1ppp2n52b1p2Q2B1P38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Bc5/3. Qh5/3...Nc6"
  ],
  "r1bqk1nrpppp1Qpp2n52b1p32B1P38PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Bc5/3. Qh5/3...Nc6/4. Qxf7"
  ],
  "rnbqk2rpppp1ppp5n22b1p2Q2B1P38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Bc5/3. Qh5/3...Nf6"
  ],
  "rnb1k1nrppppqppp82b1p2Q2B1P38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Bc5/3. Qh5/3...Qe7"
  ],
  "rnbqk1nrppppbppp84p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Be7"
  ],
  "rnbqkbnrpp1p1ppp82p1p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...c5"
  ],
  "rnbqkbnrppp2ppp83pp32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...d5"
  ],
  "rnbqkbnrppp2ppp3p44p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...d6"
  ],
  "rnbqkbnrpppp2pp84pp22B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...f5"
  ],
  "rnbqkbnrpppp1p1p6p14p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...g6"
  ],
  "r1bqkbnrpppp1ppp2n54p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nc6"
  ],
  "rnbqkb1rppppnppp84p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Ne7"
  ],
  "rnbqkb1rpppp1ppp5n24p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nf6"
  ],
  "rnbqkb1rpppp1ppp5n24p32B1P33P4PPP2PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nf6/3. d3"
  ],
  "rnbqkb1rpppp1ppp5n24p32BPP38PPP2PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nf6/3. d4"
  ],
  "rnbqkb1rpppp1ppp5n282BpP38PPP2PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nf6/3. d4/3...exd4"
  ],
  "rnbqkb1rpppp1ppp5n282BpP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nf6/3. d4/3...exd4/4. Nf3"
  ],
  "rnbqkb1rpppp1ppp5n24p32B1P35P2PPPP2PPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nf6/3. f3"
  ],
  "rnbqkb1rppp2ppp5n23pp32B1P35P2PPPP2PPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nf6/3. f3/3...d5"
  ],
  "rnbqkb1rppp2ppp5n23Pp32B55P2PPPP2PPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nf6/3. f3/3...d5/4. exd5"
  ],
  "rnb1kb1rppp2ppp5n23qp32B55P2PPPP2PPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Nf6/3. f3/3...d5/4. exd5/4...Qxd5"
  ],
  "rnb1kbnrppppqppp84p32B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Qe7"
  ],
  "rnb1kbnrpppp1ppp84p1q12B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Qg5"
  ],
  "rnb1kbnrpppp1ppp84p32B1P2q8PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Bc4/2...Qh4"
  ],
  "rnbqkbnrpppp1ppp84p34P33B4PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Bd3"
  ],
  "rnbqkbnrpppp1ppp84p34P32P5PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. c3"
  ],
  "rnbqkbnrpppp1ppp84p34P33P4PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d3"
  ],
  "rnbqkbnrpppp1ppp84p33PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4"
  ],
  "rnbqkbnrppp2ppp3p44p33PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...d6"
  ],
  "rnbqkbnrpppp1ppp883pP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4"
  ],
  "rnbqkbnrpppp1ppp883pP32P5PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3"
  ],
  "rnbqkbnrpppp1ppp884P32Pp4PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...d3"
  ],
  "rnbqkbnrppp2ppp83p43pP32P5PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...d5"
  ],
  "rnbqkbnrpppp1ppp884P32p5PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3"
  ],
  "rnbqkbnrpppp1ppp882B1P32p5PP3PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4"
  ],
  "rnbqkbnrpppp1ppp882B1P38Pp3PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2"
  ],
  "rnbqkbnrpppp1ppp882B1P38PB3PPPRN1QK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2"
  ],
  "rnbqkbnrppp2ppp83p42B1P38PB3PPPRN1QK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...d5"
  ],
  "rnbqkb1rpppp1ppp5n282B1P38PB3PPPRN1QK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6"
  ],
  "rnbqkb1rpppp1ppp5n24P32B58PB3PPPRN1QK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5"
  ],
  "rnbqkb1rppp2ppp5n23pP32B58PB3PPPRN1QK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5/6...d5"
  ],
  "rnbqkb1rppp2ppp5P23p42B58PB3PPPRN1QK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5/6...d5/7. exf6"
  ],
  "rnbqk2rppp2ppp5P23p41bB58PB3PPPRN1QK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5/6...d5/7. exf6/7...Bb4"
  ],
  "rnbqk2rppp2ppp5P23p41bB52B5P4PPPRN1QK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5/6...d5/7. exf6/7...Bb4/8. Bc3"
  ],
  "rnbqk2rppp2ppp5P23p42B52b5P4PPPRN1QK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5/6...d5/7. exf6/7...Bb4/8. Bc3/8...Bxc3"
  ],
  "rnbqk2rppp2ppp5P23p42B52N5P4PPPR2QK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5/6...d5/7. exf6/7...Bb4/8. Bc3/8...Bxc3/9. Nxc3"
  ],
  "rnbqk2rppp2ppp5P282p52N5P4PPPR2QK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5/6...d5/7. exf6/7...Bb4/8. Bc3/8...Bxc3/9. Nxc3/9...dxc4"
  ],
  "rnbqk2rppp2pPp882p52N5P4PPPR2QK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5/6...d5/7. exf6/7...Bb4/8. Bc3/8...Bxc3/9. Nxc3/9...dxc4/10. fxg7"
  ],
  "rnbqk1r1ppp2pPp882p52N5P4PPPR2QK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. e5/6...d5/7. exf6/7...Bb4/8. Bc3/8...Bxc3/9. Nxc3/9...dxc4/10. fxg7/10...Rg8"
  ],
  "rnbqkb1rpppp1ppp5n282B1P35N2PB3PPPRN1QK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...cxb2/5. Bxb2/5...Nf6/6. Nf3"
  ],
  "r1bqkbnrpppp1ppp2n582B1P32p5PP3PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Bc4/4...Nc6"
  ],
  "rnbqkbnrpppp1ppp884P32N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. c3/3...dxc3/4. Nxc3"
  ],
  "rnbqkbnrpppp1ppp883QP38PPP2PPPRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. Qxd4"
  ],
  "r1bqkbnrpppp1ppp2n583QP38PPP2PPPRNB1KBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. d4/2...exd4/3. Qxd4/3...Nc6"
  ],
  "rnbqkbnrpppp1ppp84p34PP28PPPP2PPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4"
  ],
  "rnbqk1nrpppp1ppp82b1p34PP28PPPP2PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...Bc5"
  ],
  "rnbqk1nrpppp1ppp82b1P34P38PPPP2PPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...Bc5/3. fxe5"
  ],
  "rnb1k1nrpppp1ppp82b1P34P2q8PPPP2PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...Bc5/3. fxe5/3...Qh4"
  ],
  "rnb1k1nrpppp1ppp82b1P34P2q6P1PPPP3PRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...Bc5/3. fxe5/3...Qh4/4. g3"
  ],
  "rnb1k1nrpppp1ppp82b1P34P2q8PPPPK1PPRNBQ1BNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...Bc5/3. fxe5/3...Qh4/4. Ke2"
  ],
  "rnbqkbnrppp2ppp83pp34PP28PPPP2PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...d5"
  ],
  "rnbqkbnrppp2ppp83Pp35P28PPPP2PPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...d5/3. exd5"
  ],
  "rnbqkbnrpp3ppp2p53Pp35P28PPPP2PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...d5/3. exd5/3...c6"
  ],
  "rnbqkbnrppp2ppp83P44pP28PPPP2PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...d5/3. exd5/3...e4"
  ],
  "rnbqkbnrppp2ppp83pp34PP25N2PPPP2PPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...d5/3. Nf3"
  ],
  "rnbqkbnrppp2ppp3p44p34PP28PPPP2PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...d6"
  ],
  "rnbqkbnrpppp1ppp884Pp28PPPP2PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4"
  ],
  "rnbqkbnrpppp1ppp882B1Pp28PPPP2PPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Bc4"
  ],
  "rnbqkbnrppp2ppp83p42B1Pp28PPPP2PPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Bc4/3...d5"
  ],
  "rnbqkb1rpppp1ppp5n282B1Pp28PPPP2PPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Bc4/3...Nf6"
  ],
  "rnb1kbnrpppp1ppp882B1Pp1q8PPPP2PPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Bc4/3...Qh4"
  ],
  "rnb1kbnrpppp1ppp882B1Pp1q8PPPPK1PPRNBQ2NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Bc4/3...Qh4/4. Ke2"
  ],
  "rnb1kbnrpppp1ppp882B1Pp1q8PPPP2PPRNBQ1KNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Bc4/3...Qh4/4. Kf1"
  ],
  "rnbqkbnrpppp1ppp883PPp28PPP3PPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. d4"
  ],
  "rnbqkbnrpppp1ppp884Pp28PPPP1KPPRNBQ1BNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Kf2"
  ],
  "rnbqkbnrpppp1ppp884Pp25N2PPPP2PPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3"
  ],
  "rnbqk1nrppppbppp884Pp25N2PPPP2PPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...Be7"
  ],
  "rnbqk1nrppppbppp882B1Pp25N2PPPP2PPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...Be7/4. Bc4"
  ],
  "rnbqkbnrppp2ppp83p44Pp25N2PPPP2PPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...d5"
  ],
  "rnbqkbnrppp2ppp3p484Pp25N2PPPP2PPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...d6"
  ],
  "rnbqkbnrppp2ppp3p483PPp25N2PPP3PPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...d6/4. d4"
  ],
  "rnbqkbnrppp2p1p3p46p13PPp25N2PPP3PPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...d6/4. d4/4...g5"
  ],
  "rnbqkbnrpppp1p1p86p14Pp25N2PPPP2PPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5"
  ],
  "rnbqkbnrpppp1p1p86p12B1Pp25N2PPPP2PPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. Bc4"
  ],
  "rnbqkbnrpppp1p1p882B1Ppp15N2PPPP2PPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. Bc4/4...g4"
  ],
  "rnbqkbnrpppp1p1p84N32B1Ppp18PPPP2PPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. Bc4/4...g4/5. Ne5"
  ],
  "rnb1kbnrpppp1p1p84N32B1Pppq8PPPP2PPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. Bc4/4...g4/5. Ne5/5...Qh4"
  ],
  "rnb1kbnrpppp1p1p84N32B1Pppq8PPPP2PPRNBQ1K1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. Bc4/4...g4/5. Ne5/5...Qh4/6. Kf1"
  ],
  "rnbqkbnrpppp1p1p882B1Ppp15N2PPPP2PPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. Bc4/4...g4/5. O-O"
  ],
  "rnbqkbnrpppp1p1p882B1Pp25p2PPPP2PPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. Bc4/4...g4/5. O-O/5...gxf3"
  ],
  "rnbqkbnrpppp1p1p86p14Pp1P5N2PPPP2P1RNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4"
  ],
  "rnbqkbnrpppp1p1p884PppP5N2PPPP2P1RNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4/4...g4"
  ],
  "rnbqkbnrpppp1p1p84N34PppP8PPPP2P1RNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4/4...g4/5. Ne5"
  ],
  "rnbqkbnrppp2p1p3p44N34PppP8PPPP2P1RNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4/4...g4/5. Ne5/5...d6"
  ],
  "rnbqkbnrppp2p1p3p484PpNP8PPPP2P1RNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4/4...g4/5. Ne5/5...d6/6. Nxg4"
  ],
  "rnbqk1nrppp1bp1p3p484PpNP8PPPP2P1RNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4/4...g4/5. Ne5/5...d6/6. Nxg4/6...Be7"
  ],
  "rnbqkb1rpppp1p1p5n24N34PppP8PPPP2P1RNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4/4...g4/5. Ne5/5...Nf6"
  ],
  "rnbqkb1rpppp1p1p5n24N32B1PppP8PPPP2P1RNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4/4...g4/5. Ne5/5...Nf6/6. Bc4"
  ],
  "rnbqkb1rppp2p1p5n23pN32B1PppP8PPPP2P1RNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4/4...g4/5. Ne5/5...Nf6/6. Bc4/6...d5"
  ],
  "rnbqkbnrpppp1p1p86N14PppP8PPPP2P1RNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...g5/4. h4/4...g4/5. Ng5"
  ],
  "rnbqkbnrpppp1pp17p84Pp25N2PPPP2PPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Nf3/3...h6"
  ],
  "rnbqkbnrpppp1ppp884Pp25Q2PPPP2PPRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Qf3"
  ],
  "rnb1kbnrpppp1ppp884Pp1q5Q2PPPP2PPRNB1KBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Qf3/3...Qh4"
  ],
  "rnb1kbnrpppp1ppp884Pp1q5QP1PPPP3PRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...exf4/3. Qf3/3...Qh4/4. g3"
  ],
  "rnbqkbnrpppp2pp84pp24PP28PPPP2PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. f4/2...f5"
  ],
  "rnbqkbnrpppp1ppp84p34P38PPPPKPPPRNBQ1BNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Ke2"
  ],
  "rnbq1bnrppppkppp84p34P38PPPPKPPPRNBQ1BNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Ke2/2...Ke7"
  ],
  "rnbqkbnrpppp1ppp84p34P32N5PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3"
  ],
  "rnbqk1nrpppp1ppp84p31b2P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Bb4"
  ],
  "rnbqk1nrpppp1ppp82b1p34P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Bc5"
  ],
  "rnbqk1nrpppp1ppp82b1p3N3P38PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Bc5/3. Na4"
  ],
  "rnbqkbnrppp2ppp3p44p34P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...d6"
  ],
  "rnbqkbnrppp2ppp3p44p34PP22N5PPPP2PPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...d6/3. f4"
  ],
  "r1bqkbnrpppp1ppp2n54p34P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nc6",
    "Chess Opening Theory/1. e4/1...Nc6/2. Nc3/2...e5"
  ],
  "r1bqkbnrpppp1ppp2n54p32B1P32N5PPPP1PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nc6/3. Bc4"
  ],
  "r1bqkbnrpppp1ppp2n54p34PP22N5PPPP2PPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nc6/3. f4"
  ],
  "r1bqkbnrpppp1ppp2n584Pp22N5PPPP2PPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nc6/3. f4/3...exf4"
  ],
  "rnbqkb1rpppp1ppp5n24p34P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6"
  ],
  "rnbqkb1rpppp1ppp5n24p32B1P32N5PPPP1PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4"
  ],
  "r1bqkb1rpppp1ppp2n2n24p32B1P32N5PPPP1PPPR1BQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nc6"
  ],
  "rnbqkb1rpppp1ppp84p32B1n32N5PPPP1PPPR1BQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4"
  ],
  "rnbqkb1rpppp1Bpp84p34n32N5PPPP1PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Bxf7"
  ],
  "rnbqkb1rpppp1ppp84p32B1N38PPPP1PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Nxe4"
  ],
  "rnbqkb1rpppp1ppp84p2Q2B1n32N5PPPP1PPPR1B1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Qh5"
  ],
  "rnbqkb1rpppp1ppp3n44p2Q2B52N5PPPP1PPPR1B1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Qh5/4...Nd6"
  ],
  "rnbqkb1rpppp1ppp3n44p2Q81BN5PPPP1PPPR1B1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Qh5/4...Nd6/5. Bb3"
  ],
  "rnbqk2rppppbppp3n44p2Q81BN5PPPP1PPPR1B1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Qh5/4...Nd6/5. Bb3/5...Be7"
  ],
  "r1bqkb1rpppp1ppp2nn44p2Q81BN5PPPP1PPPR1B1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Qh5/4...Nd6/5. Bb3/5...Nc6"
  ],
  "r1bqkb1rpppp1ppp2nn41N2p2Q81B6PPPP1PPPR1B1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Qh5/4...Nd6/5. Bb3/5...Nc6/6. Nb5"
  ],
  "N1bk1b1rp2pq2p1pnn2p13Qpp281B6PPPP1PPPR1B1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Qh5/4...Nd6/5. Bb3/5...Nc6/6. Nb5/6...g6/7. Qf3/7...f5/8. Qd5/8...Qe7/9. Nxc7/9...Kd8/10. Nxa8/10...b6"
  ],
  "rnbqkb1rpppp1ppp3n44Q32B52N5PPPP1PPPR1B1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. Bc4/3...Nxe4/4. Qh5/4...Nd6/5. Qxe5"
  ],
  "rnbqkb1rpppp1ppp5n24p34PP22N5PPPP2PPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. f4"
  ],
  "rnbqkb1rppp2ppp5n23pp34PP22N5PPPP2PPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. f4/3...d5"
  ],
  "rnbqkb1rppp2ppp5n23pP34P32N5PPPP2PPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. f4/3...d5/4. fxe5"
  ],
  "rnbqkb1rppp2ppp83pP34n32N5PPPP2PPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. f4/3...d5/4. fxe5/4...Nxe4"
  ],
  "rnbqkb1rppp2ppp83pP34n32NP4PPP3PPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. f4/3...d5/4. fxe5/4...Nxe4/5. d3"
  ],
  "rnb1kb1rppp2ppp83pP34n2q2NP4PPP3PPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. f4/3...d5/4. fxe5/4...Nxe4/5. d3/5...Qh4"
  ],
  "rnbqkb1rpppp1ppp5n284Pp22N5PPPP2PPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. f4/3...exf4"
  ],
  "r1bqkb1rpppp1ppp2n2n24p34PP22N5PPPP2PPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nc3/2...Nf6/3. f4/3...Nc6"
  ],
  "rnbqkbnrpppp1ppp84p34P38PPPPNPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Ne2"
  ],
  "rnbqkbnrpppp1ppp84p34P35N2PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3"
  ],
  "rnbqk1nrpppp1ppp84p31b2P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Bb4"
  ],
  "rnbqk1nrpppp1ppp82b1p34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Bc5"
  ],
  "rnbqk1nrpppp1ppp82b1N34P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Bc5/3. Nxe5"
  ],
  "rnbqk1nrpppp1ppp84N34P38PPPP1bPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Bc5/3. Nxe5/3...Bxf2"
  ],
  "rnbqk1nrpppp2pp5p22b1N34P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Bc5/3. Nxe5/3...f6"
  ],
  "r1bqk1nrpppp1ppp2n52b1N34P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Bc5/3. Nxe5/3...Nc6"
  ],
  "rnbqkbnrpp1p1ppp82p1p34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5"
  ],
  "rnbqkbnrpp1p1ppp82p1N34P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5"
  ],
  "rnbqkbnrpp1p2pp5p22p1N34P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...f6"
  ],
  "rnbqkbnrpp1p2pp5p22p1N2Q4P38PPPP1PPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...f6/4. Qh5"
  ],
  "rnbqkbnrpp1p3p5pp12p1N2Q4P38PPPP1PPPRNB1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...f6/4. Qh5/4...g6"
  ],
  "rnbqkbnrpp1p3p5pN12p4Q4P38PPPP1PPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...f6/4. Qh5/4...g6/5. Nxg6"
  ],
  "rnbqkbnrpp1p45pp12p4Q4P38PPPP1PPPRNB1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...f6/4. Qh5/4...g6/5. Nxg6/5...hxg6"
  ],
  "rnbqkbnQpp1p45pp12p54P38PPPP1PPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...f6/4. Qh5/4...g6/5. Nxg6/5...hxg6/6. Qxh8"
  ],
  "rnbq1bnrpp1pk1pp5p22p1N2Q4P38PPPP1PPPRNB1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...f6/4. Qh5/4...Ke7"
  ],
  "rnbq1bnrpp1pkNpp5p22p4Q4P38PPPP1PPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...f6/4. Qh5/4...Ke7/5. Nf7"
  ],
  "rnb1qbnrpp1pkNpp5p22p4Q4P38PPPP1PPPRNB1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...f6/4. Qh5/4...Ke7/5. Nf7/5...Qe8"
  ],
  "rnb1kbnrpp1pqppp82p1N34P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c5/3. Nxe5/3...Qe7"
  ],
  "rnbqkbnrpp1p1ppp2p54p34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6"
  ],
  "rnbqkbnrpp1p1ppp2p54p34P35NP1PPPP1P1PRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. g3"
  ],
  "rnbqkbnrpp1p1ppp2p54N34P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5"
  ],
  "rnbqkb1rpp1p1ppp2p2n24N34P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6"
  ],
  "rnbqkb1rpp1p1ppp2p2n24N34P33P4PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6/4. d3"
  ],
  "rnb1kb1rpp1p1ppp2p2n2q3N34P33P4PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6/4. d3/4...Qa5"
  ],
  "rnb1kb1rpp1p1ppp2p2n2q3N34P32NP4PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6/4. d3/4...Qa5/5. Nc3"
  ],
  "rnb1kb1rpp1p1ppp2p2n24q34P32NP4PPP2PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6/4. d3/4...Qa5/5. Nc3/5...Qxe5"
  ],
  "rnb1kb1rpp1p1ppp2p2n24q34P32NP4PPP1BPPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6/4. d3/4...Qa5/5. Nc3/5...Qxe5/6. Be2"
  ],
  "rnb1k2rpp1p1ppp2p2n24q31b2P32NP4PPP1BPPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6/4. d3/4...Qa5/5. Nc3/5...Qxe5/6. Be2/6...Bb4"
  ],
  "rnb1k2rpp1p1ppp2p2n24q31b2P32NP4PPP1BPPPR1BQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6/4. d3/4...Qa5/5. Nc3/5...Qxe5/6. Be2/6...Bb4/7. O-O"
  ],
  "rnb1k2rpp1p1ppp2p2n24q34P32bP4PPP1BPPPR1BQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6/4. d3/4...Qa5/5. Nc3/5...Qxe5/6. Be2/6...Bb4/7. O-O/7...Bxc3"
  ],
  "rnb1k2rpp1p1ppp2p2n24q34P32PP4P1P1BPPPR1BQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...c6/3. Nxe5/3...Nf6/4. d3/4...Qa5/5. Nc3/5...Qxe5/6. Be2/6...Bb4/7. O-O/7...Bxc3/8. bxc3"
  ],
  "rnbqkbnrppp2ppp83pp34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d5"
  ],
  "rnbqkbnrppp2ppp83Pp385N2PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d5/3. exd5"
  ],
  "rnb1kbnrppp2ppp83qp385N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d5/3. exd5/3...Qxd5"
  ],
  "rnbqkbnrppp2ppp3p44p34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6"
  ],
  "rnbqkbnrppp2ppp3p44p32B1P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. Bc4"
  ],
  "rn1qkbnrppp2ppp3p44p32B1P1b15N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. Bc4/3...Bg4"
  ],
  "rnbqkbnrppp2ppp3p44p33PP35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4"
  ],
  "rnbqkbnrppp2ppp3p483pP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...exd4"
  ],
  "rnbqkbnrppp2ppp3p483NP38PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...exd4/4. Nxd4"
  ],
  "rnbqkbnrppp3pp3p44pp23PP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...f5"
  ],
  "rnbqkbnrppp3pp3p44Pp24P35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...f5/4. dxe5"
  ],
  "r1bqkbnrppp2ppp2np44p33PP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nc6"
  ],
  "r1bqkbnrpppn1ppp3p44p33PP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7"
  ],
  "r1bqkbnrpppn1ppp3p44p32BPP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4"
  ],
  "r1bqk1nrpppnbppp3p44p32BPP35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Be7"
  ],
  "r1bqk1nrpppnbppp3p44P32B1P35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Be7/5. dxe5"
  ],
  "r1bqk1nrpppnbppp84p32B1P35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Be7/5. dxe5/5...dxe5"
  ],
  "r1bqk1nrpppnbppp83Qp32B1P35N2PPP2PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Be7/5. dxe5/5...dxe5/6. Qd5"
  ],
  "r1bqk1nrppp1bppp3p44n32B1P35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Be7/5. dxe5/5...Nxe5"
  ],
  "r1bqk1nrppp1bppp3p44N32B1P38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Be7/5. dxe5/5...Nxe5/6. Nxe5"
  ],
  "r1bqk1nrppp1bppp84p32B1P38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Be7/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5"
  ],
  "r1bqk1nrppp1bppp84p2Q2B1P38PPP2PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Be7/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5/7. Qh5"
  ],
  "r1bqkbnrpppn1ppp3p482BpP35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4"
  ],
  "r1bqkbnrpppn1ppp3p482BNP38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4"
  ],
  "r1bqk1nrpppnbppp3p482BNP38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7"
  ],
  "r1bqk1nrpppnbBpp3p483NP38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7"
  ],
  "r1bq1knrpppnbBpp3p483NP38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kf8"
  ],
  "r1bq1knrpppnbBpp3pN384P38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kf8/7. Ne6"
  ],
  "r1bq2nrpppnbkpp3pN384P38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kf8/7. Ne6/7...Kxf7"
  ],
  "r1bN2nrpppnbkpp3p484P38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kf8/7. Ne6/7...Kxf7/8. Nxd8"
  ],
  "r1bq2nrpppnbkpp3p483NP38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kxf7"
  ],
  "r1bq2nrpppnbkpp3pN384P38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kxf7/7. Ne6"
  ],
  "r1bq2nrpppnb1pp3pk384P38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kxf7/7. Ne6/7...Kxe6"
  ],
  "r1bq2nrpppnb1pp3pk33Q44P38PPP2PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kxf7/7. Ne6/7...Kxe6/8. Qd5"
  ],
  "r1bq2nrpppnb1pp3p1k23Q44P38PPP2PPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kxf7/7. Ne6/7...Kxe6/8. Qd5/8...Kf6"
  ],
  "r1bq2nrpppnb1pp3p1k25Q24P38PPP2PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kxf7/7. Ne6/7...Kxe6/8. Qd5/8...Kf6/9. Qf5"
  ],
  "r1bq3rpppnbkpp3pNn284P38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...exd4/5. Nxd4/5...Be7/6. Bxf7/6...Kxf7/7. Ne6/7...Ngf6"
  ],
  "r1bqkb1rpppnnppp3p44p32BPP35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ne7"
  ],
  "r1bqkb1rpppn1ppp3p1n24p32BPP35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6"
  ],
  "r1bqkb1rpppn1ppp3p1n24P32B1P35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5"
  ],
  "r1bqkb1rpppn1ppp5n24p32B1P35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...dxe5"
  ],
  "r1bqkb1rpppn1ppp5n24p1N12B1P38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...dxe5/6. Ng5"
  ],
  "r1bqkb1rppp2ppp3p1n24n32B1P35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5"
  ],
  "r1bqkb1rppp2ppp3p1n24N32B1P38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5/6. Nxe5"
  ],
  "r1bqkb1rppp2ppp5n24p32B1P38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5"
  ],
  "r1bqkb1rppp2Bpp5n24p34P38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5/7. Bxf7"
  ],
  "r1bq1b1rppp2kpp5n24p34P38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5/7. Bxf7/7...Kxf7"
  ],
  "r1bQ1b1rppp2kpp5n24p34P38PPP2PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5/7. Bxf7/7...Kxf7/8. Qxd8"
  ],
  "r1bQ3rppp2kpp5n24p31b2P38PPP2PPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5/7. Bxf7/7...Kxf7/8. Qxd8/8...Bb4"
  ],
  "r1b4rppp2kpp5n24p31b2P38PPPQ1PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5/7. Bxf7/7...Kxf7/8. Qxd8/8...Bb4/9. Qd2"
  ],
  "r1b4rppp2kpp5n24p34P38PPPb1PPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5/7. Bxf7/7...Kxf7/8. Qxd8/8...Bb4/9. Qd2/9...Bxd2"
  ],
  "r1b4rppp2kpp5n24p34P38PPPN1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nd7/4. Bc4/4...Ngf6/5. dxe5/5...Nxe5/6. Nxe5/6...dxe5/7. Bxf7/7...Kxf7/8. Qxd8/8...Bb4/9. Qd2/9...Bxd2/10. Nxd2"
  ],
  "rnbqkb1rppp2ppp3p1n24p33PP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...d6/3. d4/3...Nf6"
  ],
  "rnbqkbnrpppp2pp84pp24P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f5"
  ],
  "rnbqkbnrpppp2pp84Np24P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f5/3. Nxe5"
  ],
  "rnb1kbnrpppp2pp5q24Np24P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f5/3. Nxe5/3...Qf6"
  ],
  "rnb1kbnrpppp2pp5q25p22N1P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f5/3. Nxe5/3...Qf6/4. Nc4"
  ],
  "rnb1kbnrpppp2pp5q282N1p38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f5/3. Nxe5/3...Qf6/4. Nc4/4...fxe4"
  ],
  "rnb1kbnrpppp2pp5q282N1p32N5PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f5/3. Nxe5/3...Qf6/4. Nc4/4...fxe4/5. Nc3"
  ],
  "rnb1kbnrpppp1qpp882N1p32N5PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f5/3. Nxe5/3...Qf6/4. Nc4/4...fxe4/5. Nc3/5...Qf7"
  ],
  "rnb1kbnrpppp1qpp884p32N1N3PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f5/3. Nxe5/3...Qf6/4. Nc4/4...fxe4/5. Nc3/5...Qf7/6. Ne3"
  ],
  "rnbqkbnrpppp2pp5p24p34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f6"
  ],
  "rnbqkbnrpppp2pp5p24N34P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f6/3. Nxe5"
  ],
  "rnbqkbnrpppp2pp84p34P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...f6/3. Nxe5/3...fxe5"
  ],
  "r1bqkbnrpppp1ppp2n54p34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6"
  ],
  "r1bqkbnrpppp1ppp2n54p31P2P35N2P1PP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. b4"
  ],
  "r1bqkbnrpppp1pppB1n54p34P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Ba6"
  ],
  "r1bqkbnrpppp1ppp2n51B2p34P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5"
  ],
  "r1bqkbnr1ppp1pppp1n51B2p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6"
  ],
  "r1bqkbnr1ppp1pppp1n54p3B3P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4"
  ],
  "r1bqkbnr2pp1pppp1n51p2p3B3P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...b5"
  ],
  "r1bqkbnr2pp1pppp1n51p2p34P31B3N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...b5/5. Bb3"
  ],
  "r1bqkbnr2pp1pppp7np2p34P31B3N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...b5/5. Bb3/5...Na5"
  ],
  "r1bqk1nr1ppp1pppp1n52b1p3B3P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Bc5"
  ],
  "r1bqk1nr1ppp1pppp1n52b1N3B3P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Bc5/5. Nxe5"
  ],
  "r1b1k1nr1ppp1pppp1n52b1N1q1B3P38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Bc5/5. Nxe5/5...Qg5"
  ],
  "r1b1k1nr1ppp1pppp1n52b1N3B3P2q8PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Bc5/5. Nxe5/5...Qh4"
  ],
  "r1bqkbnr1pp2pppp1np44p3B3P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...d6"
  ],
  "r1bqkbnr1pp2pppp1np44p3B2PP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...d6/5. d4"
  ],
  "r1bqkbnr1ppp2ppp1n54pp2B3P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...f5"
  ],
  "r1bqkb1r1ppp1pppp1n2n24p3B3P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6"
  ],
  "r1bqkb1r1ppp1pppp1n2n24p3B3P33P1N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. d3"
  ],
  "r1bqkb1r2pp1pppp1n2n21p2p34P31B1P1N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. d3/5...b5/6. Bb3"
  ],
  "r1bqkb1r1ppp1pppp1n2n24p3B3P35N2PPPP1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O"
  ],
  "r1bqkb1r2pp1pppp1n2n21p2p3B3P35N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...b5"
  ],
  "r1bqkb1r2pp1pppp1n2n21p2p34P31B3N2PPPP1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...b5/6. Bb3"
  ],
  "r2qkb1r1bpp1pppp1n2n21p2p34P31B3N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...b5/6. Bb3/6...Bb7"
  ],
  "r1bqk2r2pp1pppp1n2n21pb1p34P31B3N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...b5/6. Bb3/6...Bc5"
  ],
  "r1bqk2r1ppp1pppp1n2n22b1p3B3P35N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Bc5"
  ],
  "r1bqk2r1pppbpppp1n2n24p3B3P35N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7"
  ],
  "r1bqk2r1pppbpppp1B2n24p34P35N2PPPP1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Bxc6"
  ],
  "r1bqk2r1pppbpppp1n2n24p3B3P35N2PPPPQPPPRNB2RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Qe2"
  ],
  "r1bqk2r1pppbpppp1n2n24p3B3P35N2PPPP1PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1"
  ],
  "r1bqk2r2ppbpppp1n2n21p2p3B3P35N2PPPP1PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5"
  ],
  "r1bqk2r2ppbpppp1n2n21p2p34P31B3N2PPPP1PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3"
  ],
  "r1bqk2r2p1bpppp1np1n21p2p34P31B3N2PPPP1PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...d6"
  ],
  "r1bqk2r2p1bpppp1np1n21p2p34P31BP2N2PP1P1PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...d6/8. c3"
  ],
  "r1bq1rk12p1bpppp1np1n21p2p34P31BP2N2PP1P1PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...d6/8. c3/8...O-O"
  ],
  "r1bq1rk12p1bpppp1np1n21p2p34P31BP2N1PPP1P1PP1RNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...d6/8. c3/8...O-O/9. h3"
  ],
  "r2q1rk11bp1bpppp1np1n21p2p34P31BP2N1PPP1P1PP1RNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...d6/8. c3/8...O-O/9. h3/9...Bb7"
  ],
  "r2qr1k11bp1bpppp1np1n21p2p3P2PP31BP2N1P1P3PP1RNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...d6/8. c3/8...O-O/9. h3/9...Bb7/10. d4/10...Re8/11. a4"
  ],
  "r1bq1rk12p1bpppp2p1n2np2p34P31BP2N1PPP1P1PP1RNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...d6/8. c3/8...O-O/9. h3/9...Na5"
  ],
  "r1bqk2r2p1bpppp1np1n21p2p33PP31B3N2PPP2PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...d6/8. d4"
  ],
  "r1bq1rk12ppbpppp1n2n21p2p34P31B3N2PPPP1PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O"
  ],
  "r1bq1rk12ppbpppp1n2n21p2p3P3P31B3N21PPP1PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. a4"
  ],
  "r1bq1rk12ppbpppp1n2n21p2p34P31BP2N2PP1P1PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3"
  ],
  "r1bq1rk12p1bpppp1n2n21p1pp34P31BP2N2PP1P1PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5"
  ],
  "r1bq1rk12p1bpppp1n2n21p1Pp381BP2N2PP1P1PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5"
  ],
  "r1bq1rk12p1bpppp1n51p1np381BP2N2PP1P1PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5"
  ],
  "r1bq1rk12p1bpppp1n51p1nN381BP5PP1P1PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5"
  ],
  "r1bq1rk12p1bpppp71p1nn381BP5PP1P1PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5"
  ],
  "r1bq1rk12p1bpppp71p1nR381BP5PP1P1PPPRNBQ2K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5"
  ],
  "r1bq1rk14bpppp1p51p1nR381BP5PP1P1PPPRNBQ2K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5/11...c6"
  ],
  "r1bq1rk14bpppp1p51p1nR33P41BP5PP3PPPRNBQ2K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5/11...c6/12. d4"
  ],
  "r1bq1rk15pppp1pb41p1nR33P41BP5PP3PPPRNBQ2K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5/11...c6/12. d4/12...Bd6"
  ],
  "r1bq1rk15pppp1pb41p1n43P41BP5PP3PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5/11...c6/12. d4/12...Bd6/13. Re1"
  ],
  "r1b2rk15pppp1pb41p1n43P3q1BP5PP3PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5/11...c6/12. d4/12...Bd6/13. Re1/13...Qh4"
  ],
  "r1b2rk15pppp1pb41p1n43P3q1BP3P1PP3P1PRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5/11...c6/12. d4/12...Bd6/13. Re1/13...Qh4/14. g3"
  ],
  "r1b2rk15pppp1pb41p1n43P41BP3PqPP3P1PRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5/11...c6/12. d4/12...Bd6/13. Re1/13...Qh4/14. g3/14...Qh3"
  ],
  "r1b2rk15pppp1pb41p1n43PR31BP3PqPP3P1PRNBQ2K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5/11...c6/12. d4/12...Bd6/13. Re1/13...Qh4/14. g3/14...Qh3/15. Re4"
  ],
  "r1b2rk15p1pp1pb41p1n2p13PR31BP3PqPP3P1PRNBQ2K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. c3/8...d5/9. exd5/9...Nxd5/10. Nxe5/10...Nxe5/11. Rxe5/11...c6/12. d4/12...Bd6/13. Re1/13...Qh4/14. g3/14...Qh3/15. Re4/15...g5"
  ],
  "r1bq1rk12ppbpppp1n2n21p2p34P31B3N1PPPPP1PP1RNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Be7/6. Re1/6...b5/7. Bb3/7...O-O/8. h3"
  ],
  "r1bqkb1r1ppp1pppp1n54p3B3n35N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4"
  ],
  "r1bqkb1r1ppp1pppp1n54p3B2Pn35N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4"
  ],
  "r1bqkb1r2pp1pppp1n51p2p3B2Pn35N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...b5"
  ],
  "r1bqkb1r2pp1pppp1n51p2p33Pn31B3N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...b5/7. Bb3"
  ],
  "r1bqkb1r2p2pppp1n51p1pp33Pn31B3N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...b5/7. Bb3/7...d5"
  ],
  "r1bqkb1r2p2pppp1n51p1pP34n31B3N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...b5/7. Bb3/7...d5/8. dxe5"
  ],
  "r2qkb1r2p2pppp1n1b31p1pP34n31B3N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...b5/7. Bb3/7...d5/8. dxe5/8...Be6"
  ],
  "r2qkb1r2p2pppp1n1b31p1pP34n31BP2N2PP3PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...b5/7. Bb3/7...d5/8. dxe5/8...Be6/9. c3"
  ],
  "r2qkb1r2p2pppp1n1b31p1pP34n31B3N2PPPN1PPPR1BQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...b5/7. Bb3/7...d5/8. dxe5/8...Be6/9. Nbd2"
  ],
  "r1bqkb1r2pp1pppp1n51p1Pp3B3n35N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...b5/7. d5"
  ],
  "r1bqkb1r1ppp1pppp1n58B2pn35N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4"
  ],
  "r1bqkb1r1ppp1pppp1n58B2pn35N2PPP2PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1"
  ],
  "r1bqkb1r1pp2pppp1n53p4B2pn35N2PPP2PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5"
  ],
  "r1bqkb1r1pp2pppp1n53p2B1B2pn35N2PPP2PPPRN1QR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Bg5"
  ],
  "r1bqk2r1pp1bpppp1n53p2B1B2pn35N2PPP2PPPRN1QR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Bg5/8...Be7"
  ],
  "r1bqkb1r1pp2pppp1n53p4B1Ppn35N2PP3PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. c4"
  ],
  "r1bqkb1r1pp2pppp1n53p4B2Nn38PPP2PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4"
  ],
  "r1bqk2r1pp2pppp1nb43p4B2Nn38PPP2PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6"
  ],
  "r1bqk2r1pp2pppp1nb43p4B2Nn35P2PPP3PPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. f3"
  ],
  "r1bqk2r1pp2pppp1Nb43p4B3n38PPP2PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6"
  ],
  "r1bqk2r1pp2pppp1N53p4B3n38PPP2PPbRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2"
  ],
  "r1bqk2r1pp2pppp1N53p4B3n38PPP2PPbRNBQR2Kb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1"
  ],
  "r1b1k2r1pp2pppp1N53p4B3n2q8PPP2PPbRNBQR2Kw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1/10...Qh4"
  ],
  "r1b1k2r1pp2pppp1N53p4B3R2q8PPP2PPbRNBQ3Kb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1/10...Qh4/11. Rxe4"
  ],
  "r1b1k2r1pp2pppp1N58B3p2q8PPP2PPbRNBQ3Kw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1/10...Qh4/11. Rxe4/11...dxe4"
  ],
  "r1bQk2r1pp2pppp1N58B3p2q8PPP2PPbRNB4Kb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1/10...Qh4/11. Rxe4/11...dxe4/12. Qd8"
  ],
  "r1bqk2r1pp2pppp1N58B3p38PPP2PPbRNB4Kw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1/10...Qh4/11. Rxe4/11...dxe4/12. Qd8/12...Qxd8"
  ],
  "r1bNk2r1pp2pppp78B3p38PPP2PPbRNB4Kb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1/10...Qh4/11. Rxe4/11...dxe4/12. Qd8/12...Qxd8/13. Nxd8"
  ],
  "r1bk3r1pp2pppp78B3p38PPP2PPbRNB4Kw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1/10...Qh4/11. Rxe4/11...dxe4/12. Qd8/12...Qxd8/13. Nxd8/13...Kxd8"
  ],
  "r1bk3r1pp2pppp78B3p38PPP2PPKRNB5b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1/10...Qh4/11. Rxe4/11...dxe4/12. Qd8/12...Qxd8/13. Nxd8/13...Kxd8/14. Kxh2"
  ],
  "r2k3r1pp2pppp3b38B3p38PPP2PPKRNB5w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. d4/6...exd4/7. Re1/7...d5/8. Nxd4/8...Bd6/9. Nxc6/9...Bxh2/10. Kh1/10...Qh4/11. Rxe4/11...dxe4/12. Qd8/12...Qxd8/13. Nxd8/13...Kxd8/14. Kxh2/14...Be6"
  ],
  "r1bqkb1r1ppp1pppp1n54p3B3n35N2PPPP1PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Ba4/4...Nf6/5. O-O/5...Nxe4/6. Re1"
  ],
  "r1bqkbnr1ppp1pppp1B54p34P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Bxc6"
  ],
  "r1bqkbnr1pp2pppp1p54p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Bxc6/4...dxc6"
  ],
  "r1bqkbnr1pp2pppp1p54p33PP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Bxc6/4...dxc6/5. d4"
  ],
  "r1bqkbnr1pp2pppp1p583pP35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Bxc6/4...dxc6/5. d4/5...exd4"
  ],
  "r1bqkbnr1pp2pppp1p54N34P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Bxc6/4...dxc6/5. Nxe5"
  ],
  "r1bqkbnr1pp2pppp1p54p34P35N2PPPP1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Bxc6/4...dxc6/5. O-O"
  ],
  "r2qkbnr1pp2pppp1p54p34P1b15N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Bxc6/4...dxc6/5. O-O/5...Bg4"
  ],
  "r2qkbnr1pp2pppp1p54p34P1b15N1PPPPP1PP1RNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Bxc6/4...dxc6/5. O-O/5...Bg4/6. h3"
  ],
  "r2qkbnr1pp2pp1p1p54p2p4P1b15N1PPPPP1PP1RNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Bxc6/4...dxc6/5. O-O/5...Bg4/6. h3/6...h5"
  ],
  "r1bqkbnr1ppp1pppp1n51B2N34P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...a6/4. Nxe5"
  ],
  "r1bqk1nrpppp1ppp2n51B2p31b2P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Bb4"
  ],
  "r1bqk1nrpppp1ppp2n51Bb1p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Bc5"
  ],
  "r1bqk1nrpppp1ppp2n51Bb1p34P32P2N2PP1P1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Bc5/4. c3"
  ],
  "r1bqk1nrpppp2pp2n51Bb1pp24P32P2N2PP1P1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Bc5/4. c3/4...f5"
  ],
  "r1bqkbnrppp2ppp2n51B1pp34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...d5"
  ],
  "r1bqkbnrppp2ppp2np41B2p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...d6"
  ],
  "r1bqkbnrppp2ppp2np41B2p33PP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...d6/4. d4"
  ],
  "r1bqkbnrpppp2pp2n51B2pp24P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5"
  ],
  "r1bqkbnrpppp2pp2n51B2pp24P33P1N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. d3"
  ],
  "r1bqkbnrpppp2pp2n51B2p34p33P1N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. d3/4...fxe4"
  ],
  "r1bqkbnrpppp2pp2n51B2p34P35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. d3/4...fxe4/5. dxe4"
  ],
  "r1bqkb1rpppp2pp2n2n21B2p34P35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. d3/4...fxe4/5. dxe4/5...Nf6"
  ],
  "r1bqkb1rpppp2pp2n2n21B2p34P35N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. d3/4...fxe4/5. dxe4/5...Nf6/6. O-O"
  ],
  "r1bqkb1rppp3pp2np1n21B2p34P35N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. d3/4...fxe4/5. dxe4/5...Nf6/6. O-O/6...d6"
  ],
  "r1bqkb1rppp3pp2np1n21B2p34P32N2N2PPP2PPPR1BQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. d3/4...fxe4/5. dxe4/5...Nf6/6. O-O/6...d6/7. Nc3"
  ],
  "r1bqkbnrpppp2pp2n51B2pp23PP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. d4"
  ],
  "r1bqkbnrpppp2pp2n51B2pP285N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. exf5"
  ],
  "r1bqkbnrpppp2pp2n51B3P24p35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. exf5/4...e4"
  ],
  "r1bqkbnrpppp2pp2n51B3P24p38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. exf5/4...e4/5. Ng1"
  ],
  "r1b1kbnrpppp2pp2n51B3Pq14p38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. exf5/4...e4/5. Ng1/5...Qg5"
  ],
  "r1bqkbnrpppp2pp2n51B2pp24P32N2N2PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3"
  ],
  "r1bqkbnrpppp2pp2n51B2p34p32N2N2PPPP1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4"
  ],
  "r1bqkbnrpppp2pp2n51B2p34N35N2PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4"
  ],
  "r1bqkbnrppp3pp2n51B1pp34N35N2PPPP1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5"
  ],
  "r1bqkbnrppp3pp2n51B1pN34N38PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5"
  ],
  "r1bqkbnrppp3pp2n51B2N34p38PPPP1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4"
  ],
  "r1bqkbnrppp3pp2N51B64p38PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6"
  ],
  "r1b1kbnrppp3pp2N51B1q44p38PPPP1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5"
  ],
  "r1b1kbnrppp3pp2N51B1q42P1p38PP1P1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4"
  ],
  "r1b1kbnrppp3pp2Nq41B62P1p38PP1P1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6"
  ],
  "r1b1kbnrNpp3pp3q41B62P1p38PP1P1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7"
  ],
  "r3kbnrNppb2pp3q41B62P1p38PP1P1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7"
  ],
  "r3kbnrNppB2pp3q482P1p38PP1P1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Bxd7"
  ],
  "r3kbnrNppq2pp882P1p38PP1P1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Bxd7/10...Qxd7"
  ],
  "r3kbnrNppq2pp87Q2P1p38PP1P1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Bxd7/10...Qxd7/11. Qh5"
  ],
  "r3kbnrNppq3p6p17Q2P1p38PP1P1PPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Bxd7/10...Qxd7/11. Qh5/11...g6"
  ],
  "r3kbnrNppq3p6p14Q32P1p38PP1P1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Bxd7/10...Qxd7/11. Qh5/11...g6/12. Qe5"
  ],
  "r4bnrNppq1k1p6p14Q32P1p38PP1P1PPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Bxd7/10...Qxd7/11. Qh5/11...g6/12. Qe5/12...Kf7"
  ],
  "r4bnr1ppq1k1p6p11N2Q32P1p38PP1P1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Bxd7/10...Qxd7/11. Qh5/11...g6/12. Qe5/12...Kf7/13. Nb5"
  ],
  "r4bnr1p1q1k1p2p3p11N2Q32P1p38PP1P1PPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Bxd7/10...Qxd7/11. Qh5/11...g6/12. Qe5/12...Kf7/13. Nb5/13...c6"
  ],
  "r4bnr1p1q1k1p2p3p11N62PQp38PP1P1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Bxd7/10...Qxd7/11. Qh5/11...g6/12. Qe5/12...Kf7/13. Nb5/13...c6/14. Qd4"
  ],
  "r3kbnrNppb2pp3q41B5Q2P1p38PP1P1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Qh5"
  ],
  "r3kbnrNppb3p3q2p11B5Q2P1p38PP1P1PPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Qh5/10...g6"
  ],
  "r3kbnrNppB3p3q2p17Q2P1p38PP1P1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Nxa7/9...Bd7/10. Qh5/10...g6/11. Bxd7"
  ],
  "r1b1kbnrppp3pp2Nq41B5Q2P1p38PP1P1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Qh5"
  ],
  "r1b1kbnrppp4p2Nq2p11B5Q2P1p38PP1P1PPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qd5/8. c4/8...Qd6/9. Qh5/9...g6"
  ],
  "r1b1kbnrppp3pp2N51B4q14p38PPPP1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5"
  ],
  "r1b1kbnrppp3pp2N51B4q14p38PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2"
  ],
  "r1b1kb1rppp3pp2N2n21B4q14p38PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6"
  ],
  "r1b1kb1rppp3pp2N2n21B4q14pP28PPPPQ1PPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4"
  ],
  "r1b1kb1rppp3pp2N2n21B64pq28PPPPQ1PPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4/9...Qxf4"
  ],
  "r1b1kb1rppp3pp5n21B2N34pq28PPPPQ1PPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4/9...Qxf4/10. Ne5"
  ],
  "r1b1kb1rpp4pp2p2n21B2N34pq28PPPPQ1PPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4/9...Qxf4/10. Ne5/10...c6"
  ],
  "r1b1kb1rpp4pp2p2n21B2N33Ppq28PPP1Q1PPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4/9...Qxf4/10. Ne5/10...c6/11. d4"
  ],
  "r1b1kb1rpp4pp2p2n21B2N33Pp2q8PPP1Q1PPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4/9...Qxf4/10. Ne5/10...c6/11. d4/11...Qh4"
  ],
  "r1b1kb1rpp4pp2p2n21B2N33Pp2q6P1PPP1Q2PR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4/9...Qxf4/10. Ne5/10...c6/11. d4/11...Qh4/12. g3"
  ],
  "r1b1kb1rpp4pp2p2n21B2N33Pp36PqPPP1Q2PR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4/9...Qxf4/10. Ne5/10...c6/11. d4/11...Qh4/12. g3/12...Qh3"
  ],
  "r1b1kb1rpp4pp2p2n24N32BPp36PqPPP1Q2PR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4/9...Qxf4/10. Ne5/10...c6/11. d4/11...Qh4/12. g3/12...Qh3/13. Bc4"
  ],
  "r3kb1rpp4pp2p1bn24N32BPp36PqPPP1Q2PR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. f4/9...Qxf4/10. Ne5/10...c6/11. d4/11...Qh4/12. g3/12...Qh3/13. Bc4/13...Be6"
  ],
  "r1b1kb1rNpp3pp5n21B4q14p38PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. Nxa7"
  ],
  "r3kb1rNppb2pp5n21B4q14p38PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. Nxa7/9...Bd7"
  ],
  "r3kb1rNppB2pp5n26q14p38PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. Nxa7/9...Bd7/10. Bxd7"
  ],
  "r3kb1rNppn2pp86q14p38PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. Nxa7/9...Bd7/10. Bxd7/10...Nxd7"
  ],
  "r3kb1rNppn2pp86q14pP28PPPPQ1PPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. Nxa7/9...Bd7/10. Bxd7/10...Nxd7/11. f4"
  ],
  "r1bk1b1rNpp3pp5n21B4q14p38PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. Nxa7/9...Kd8"
  ],
  "r1Nk1b1r1pp3pp5n21B4q14p38PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. Nxa7/9...Kd8/10. Nxc8"
  ],
  "r1Nk1b1r1pp3pp5n21B64p38PPPPQPqPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...d5/6. Nxe5/6...dxe4/7. Nxc6/7...Qg5/8. Qe2/8...Nf6/9. Nxa7/9...Kd8/10. Nxc8/10...Qxg2"
  ],
  "r1bqkb1rpppp2pp2n2n21B2p34N35N2PPPP1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6"
  ],
  "r1bqkb1rpppp2pp2n2N21B2p385N2PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6"
  ],
  "r1b1kb1rpppp2pp2n2q21B2p385N2PPPP1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6/6...Qxf6"
  ],
  "r1b1kb1rpppp2pp2n2q21B2p385N2PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6/6...Qxf6/7. Qe2"
  ],
  "r1b1k2rppppb1pp2n2q21B2p385N2PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6/6...Qxf6/7. Qe2/7...Be7"
  ],
  "r1b1k2rppppb1pp2B2q24p385N2PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6/6...Qxf6/7. Qe2/7...Be7/8. Bxc6"
  ],
  "r1b1k2rp1ppb1pp2p2q24p385N2PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6/6...Qxf6/7. Qe2/7...Be7/8. Bxc6/8...bxc6"
  ],
  "r1b1k2rp1ppb1pp2p2q24N388PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6/6...Qxf6/7. Qe2/7...Be7/8. Bxc6/8...bxc6/9. Nxe5"
  ],
  "r1b1k2rppp1b1pp2p2q24p385N2PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6/6...Qxf6/7. Qe2/7...Be7/8. Bxc6/8...dxc6"
  ],
  "r1b1k2rppp1b1pp2p2q24N388PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6/6...Qxf6/7. Qe2/7...Be7/8. Bxc6/8...dxc6/9. Nxe5"
  ],
  "r3k2rppp1b1pp2p2q24Nb288PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Nxf6/6...Qxf6/7. Qe2/7...Be7/8. Bxc6/8...dxc6/9. Nxe5/9...Bf5"
  ],
  "r1bqkb1rpppp2pp2n2n21B2p34N35N2PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Qe2"
  ],
  "r1bqkb1rppp3pp2n2n21B1pp34N35N2PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Qe2/6...d5"
  ],
  "r1bqkb1rppp3pp2n2N21B1pp385N2PPPPQPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Qe2/6...d5/7. Nxf6"
  ],
  "r1bqkb1rppp4p2n2p21B1pp385N2PPPPQPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Qe2/6...d5/7. Nxf6/7...gxf6"
  ],
  "r1bqkb1rppp4p2n2p21B1pp33P45N2PPP1QPPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Qe2/6...d5/7. Nxf6/7...gxf6/8. d4"
  ],
  "r1bqk2rppp3bp2n2p21B1pp33P45N2PPP1QPPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f5/4. Nc3/4...fxe4/5. Nxe4/5...Nf6/6. Qe2/6...d5/7. Nxf6/7...gxf6/8. d4/8...Bg7"
  ],
  "r1bqkbnrpppp2pp2n2p21B2p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f6"
  ],
  "r1bqk1nrpppp2pp2n2p21Bb1p34P32P2N2PP1P1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...f6/4. O-O/4...Bc5/5. c3"
  ],
  "r1bqkbnrpppp1p1p2n51B2p1p14P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...g5"
  ],
  "r1bqkbnrpppp1pp12n4p1B2p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...h6"
  ],
  "r1bqkbnrpppp1ppp81B2p33nP35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nd4"
  ],
  "r1bqkbnrpppp1ppp84p32BnP35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nd4/4. Bc4"
  ],
  "r1bqkb1rpppp1ppp2n2n21B2p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6"
  ],
  "r1bqkb1rpppp1ppp2n2n21B2p34P35N2PPPP1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O"
  ],
  "r1bqkb1rpppp1ppp2n51B2p34P1n15N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Ng4"
  ],
  "r1bqkb1rpppp1ppp2n51B2p34n35N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4"
  ],
  "r1bqkb1rpppp1ppp2n51B2p33Pn35N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. d4"
  ],
  "r1bqkb1r1ppp1pppp1n51B2p33Pn35N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. d4/5...a6"
  ],
  "r1bqkb1rpppp1ppp2nn41B2p33P45N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. d4/5...Nd6"
  ],
  "r1bqkb1rpppp1ppp2Bn44p33P45N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. d4/5...Nd6/6. Bxc6"
  ],
  "r1bqkb1rppp2ppp2pn44p33P45N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. d4/5...Nd6/6. Bxc6/6...dxc6"
  ],
  "r1bqkb1rppp2ppp2pn44P385N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. d4/5...Nd6/6. Bxc6/6...dxc6/7. dxe5"
  ],
  "r1bqkb1rppp2ppp2p54Pn285N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. d4/5...Nd6/6. Bxc6/6...dxc6/7. dxe5/7...Nf5"
  ],
  "r1bQkb1rppp2ppp2p54Pn285N2PPP2PPPRNB2RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. d4/5...Nd6/6. Bxc6/6...dxc6/7. dxe5/7...Nf5/8. Qxd8"
  ],
  "r1bk1b1rppp2ppp2p54Pn285N2PPP2PPPRNB2RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. d4/5...Nd6/6. Bxc6/6...dxc6/7. dxe5/7...Nf5/8. Qxd8/8...Kxd8"
  ],
  "r1bqkb1rpppp1ppp2n51B2p34n35N2PPPP1PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nf6/4. O-O/4...Nxe4/5. Re1"
  ],
  "r1bqkb1rppppnppp2n51B2p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Nge7"
  ],
  "r1b1kbnrpppp1ppp2n2q21B2p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Qf6"
  ],
  "r1b1kbnrpppp1ppp2n2q21B2p33PP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bb5/3...Qf6/4. d4"
  ],
  "r1bqkbnrpppp1ppp2n54p32B1P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4"
  ],
  "r1bqkbnr1ppp1pppp1n54p32B1P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...a6"
  ],
  "r1bqk1nrpppp1ppp2n52b1p32B1P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5"
  ],
  "r1bqk1nrpppp1ppp2n52b1p31PB1P35N2P1PP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. b4"
  ],
  "r1bqk1nrpppp1ppp1bn54p31PB1P35N2P1PP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. b4/4...Bb6"
  ],
  "r1bqk1nrpppp1ppp2n54p31bB1P35N2P1PP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. b4/4...Bxb4"
  ],
  "r1bqk1nrpppp1ppp2n54p31bB1P32P2N2P2P1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. b4/4...Bxb4/5. c3"
  ],
  "r1bqk1nrpppp1ppp2n5b3p32B1P32P2N2P2P1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. b4/4...Bxb4/5. c3/5...Ba5"
  ],
  "r1bqk1nrppp2ppp2n52bpp31PB1P35N2P1PP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. b4/4...d5"
  ],
  "r1bqk1nrpppp1Bpp2n52b1p34P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. Bxf7"
  ],
  "r1bq2nrpppp1kpp2n52b1p34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. Bxf7/4...Kxf7"
  ],
  "r1bq2nrpppp1kpp2n52b1N34P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. Bxf7/4...Kxf7/5. Nxe5"
  ],
  "r1bq2nrpppp1kpp82b1n34P38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. Bxf7/4...Kxf7/5. Nxe5/5...Nxe5"
  ],
  "r1bq2nrpppp1kpp82b1n2Q4P38PPPP1PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. Bxf7/4...Kxf7/5. Nxe5/5...Nxe5/6. Qh5"
  ],
  "r1bqk1nrpppp1ppp2n52b1p32B1P32P2N2PP1P1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3"
  ],
  "r1bqk2rpppp1ppp2n2n22b1p32B1P32P2N2PP1P1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3/4...Nf6"
  ],
  "r1bqk2rpppp1ppp2n2n22b1p32B1P32PP1N2PP3PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3/4...Nf6/5. d3"
  ],
  "r1bqk2rpppp1ppp2n2n22b1p32BPP32P2N2PP3PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3/4...Nf6/5. d4"
  ],
  "r1bqk2rpppp1ppp2n2n22b52BpP32P2N2PP3PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3/4...Nf6/5. d4/5...exd4"
  ],
  "r1bqk2rpppp1ppp2n2n22b51PBpP32P2N2P4PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3/4...Nf6/5. d4/5...exd4/6. b4"
  ],
  "r1bqk2rpppp1ppp1bn2n281PBpP32P2N2P4PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3/4...Nf6/5. d4/5...exd4/6. b4/6...Bb6"
  ],
  "r1bqk2rppppbppp2n2n281PBpP32P2N2P4PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3/4...Nf6/5. d4/5...exd4/6. b4/6...Be7"
  ],
  "r1bqk2rpppp1ppp2n2n22b52BPP35N2PP3PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3/4...Nf6/5. d4/5...exd4/6. cxd4"
  ],
  "r1bqk2rpppp1ppp2n2n281bBPP35N2PP3PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. c3/4...Nf6/5. d4/5...exd4/6. cxd4/6...Bb4"
  ],
  "r1bqk1nrpppp1ppp2n52b1p32B1P33P1N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. d3"
  ],
  "r1bqk2rpppp1ppp2n2n22b1p32B1P33P1N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. d3/4...Nf6"
  ],
  "r1bqk1nrpppp1ppp2n52b1p32BPP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. d4"
  ],
  "r1bqk1nrpppp1ppp2n52b1p32B1P35N2PPPP1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O"
  ],
  "r1bqk2rpppp1ppp2n2n22b1p32B1P35N2PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O/4...Nf6"
  ],
  "r1bqk2rpppp1ppp2n2n22b1p32B1P32P2N2PP1P1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O/4...Nf6/5. c3"
  ],
  "r1bq1rk1pppp1ppp2n2n22b1p32B1P32P2N2PP1P1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O/4...Nf6/5. c3/5...O-O"
  ],
  "r1bq1rk1pppp1ppp2n2n22b1p32BPP32P2N2PP3PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O/4...Nf6/5. c3/5...O-O/6. d4"
  ],
  "r1bq1rk1pppp1ppp2n2n22b52BpP32P2N2PP3PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O/4...Nf6/5. c3/5...O-O/6. d4/6...exd4"
  ],
  "r1bq1rk1pppp1ppp2n2n22b52BPP35N2PP3PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O/4...Nf6/5. c3/5...O-O/6. d4/6...exd4/7. cxd4"
  ],
  "r1bq1rk1pppp1ppp1bn2n282BPP35N2PP3PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O/4...Nf6/5. c3/5...O-O/6. d4/6...exd4/7. cxd4/7...Bb6"
  ],
  "r1bqk2rpppp1ppp2n2n22b1p32BPP35N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O/4...Nf6/5. d4"
  ],
  "r1bqk2rpppp1ppp2n2n22b52BpP35N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Bc5/4. O-O/4...Nf6/5. d4/5...exd4",
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Bc5"
  ],
  "r1bqk1nrppppbppp2n54p32B1P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Be7"
  ],
  "r1bqk1nrppppbppp2n54p32BPP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Be7/4. d4"
  ],
  "r1bqk1nrppppbppp2n54p32B1P35N2PPPP1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Be7/4. O-O"
  ],
  "r1bqkbnrppp2ppp2n53Bp34P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...d5/4. Bxd5"
  ],
  "r1bqkb1rppp1nppp2n53Bp34P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...d5/4. Bxd5/4...Nge7"
  ],
  "r1bqkbnrppp2ppp2np44p32B1P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...d6"
  ],
  "r1bqkbnrppp2ppp2np44p32B1P32N2N2PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...d6/4. Nc3"
  ],
  "r2qkbnrppp2ppp2np44p32B1P1b12N2N2PPPP1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...d6/4. Nc3/4...Bg4"
  ],
  "r1bqkbnrpppp2pp2n54pp22B1P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...f5"
  ],
  "r1bqkbnrpppp2pp2n54pp22B1P33P1N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...f5/4. d3"
  ],
  "r1bqkbnrpppp2pp2n54pP22B55N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...f5/4. exf5"
  ],
  "r1bqkbnrpppp1pp12n4p4p32B1P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...h6"
  ],
  "r1bqkbnrpppp1ppp84p32BnP35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4"
  ],
  "r1bqkbnrpppp1ppp84p32BNP38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4/4. Nxd4"
  ],
  "r1bqkbnrpppp1ppp84N32BnP38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4/4. Nxe5"
  ],
  "r1b1kbnrpppp1ppp84N1q12BnP38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4/4. Nxe5/4...Qg5"
  ],
  "r1b1kbnrpppp1Npp86q12BnP38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4/4. Nxe5/4...Qg5/5. Nxf7"
  ],
  "r1b1kbnrpppp1Npp882BnP38PPPP1PqPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4/4. Nxe5/4...Qg5/5. Nxf7/5...Qxg2"
  ],
  "r1b1kbnrpppp1Npp882BnP38PPPP1PqPRNBQKR2b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4/4. Nxe5/4...Qg5/5. Nxf7/5...Qxg2/6. Rf1"
  ],
  "r1b1kbnrpppp1Npp882Bnq38PPPP1P1PRNBQKR2w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4/4. Nxe5/4...Qg5/5. Nxf7/5...Qxg2/6. Rf1/6...Qxe4"
  ],
  "r1b1kbnrpppp1Npp883nq38PPPPBP1PRNBQKR2b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4/4. Nxe5/4...Qg5/5. Nxf7/5...Qxg2/6. Rf1/6...Qxe4/7. Be2"
  ],
  "r1b1kbnrpppp1Npp884q35n2PPPPBP1PRNBQKR2w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nd4/4. Nxe5/4...Qg5/5. Nxf7/5...Qxg2/6. Rf1/6...Qxe4/7. Be2/7...Nf3"
  ],
  "r1bqkb1rpppp1ppp2n2n24p32B1P35N2PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6"
  ],
  "r1bqkb1rpppp1ppp2n2n24p32B1P33P1N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d3"
  ],
  "r1bqkb1rpppp1ppp2n2n24p32BPP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4"
  ],
  "r1bqkb1rpppp1ppp2n2n282BpP35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4"
  ],
  "r1bqkb1rpppp1ppp2n2n24P32Bp45N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. e5"
  ],
  "r1bqkb1rpppp1ppp2n2n282BpP35N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O"
  ],
  "r1bqk2rpppp1ppp2n2n22b1P32Bp45N2PPP2PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Bc5/6. e5"
  ],
  "r1bqkb1rpppp1ppp2n582Bpn35N2PPP2PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4"
  ],
  "r1bqkb1rpppp1ppp2n582Bpn32N2N2PPP2PPPR1BQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3"
  ],
  "r1bqkb1rpppp1ppp2n582B1n32p2N2PPP2PPPR1BQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3"
  ],
  "r1bqkb1rpppp1Bpp2n584n32p2N2PPP2PPPR1BQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7"
  ],
  "r1bq1b1rpppp1kpp2n584n32p2N2PPP2PPPR1BQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7"
  ],
  "r1bq1b1rpppp1kpp2n53Q44n32p2N2PPP2PPPR1B2RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5"
  ],
  "r1bqkb1rpppp2pp2n53Q44n32p2N2PPP2PPPR1B2RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Ke8"
  ],
  "r1bqkb1rpppp2pp2n53Q44n32p2N2PPP2PPPR1B1R1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Ke8/9. Re1"
  ],
  "r1bqk2rppppb1pp2n53Q44n32p2N2PPP2PPPR1B1R1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Ke8/9. Re1/9...Be7"
  ],
  "r1bqk2rppppb1pp2n53Q44R32p2N2PPP2PPPR1B3K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Ke8/9. Re1/9...Be7/10. Rxe4"
  ],
  "r1bqk2rppp1b1pp2np43Q44R32p2N2PPP2PPPR1B3K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Ke8/9. Re1/9...Be7/10. Rxe4/10...d6"
  ],
  "r1bq1b1rpppp2pp2n2k23Q44n32p2N2PPP2PPPR1B2RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6"
  ],
  "r1bq1b1rpppp2pp2n2k284Q32p2N2PPP2PPPR1B2RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Qxe4"
  ],
  "r1bq3rppppb1pp2n2k284Q32p2N2PPP2PPPR1B2RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Qxe4/9...Be7"
  ],
  "r1bq1b1rpppp2pp2n2k23Q44n32p2N2PPP2PPPR1B1R1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Re1"
  ],
  "r1bq1b1rppppn1pp5k23Q44n32p2N2PPP2PPPR1B1R1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Re1/9...Ne7"
  ],
  "r1bq1b1rppppn1pp5k284Q32p2N2PPP2PPPR1B1R1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Re1/9...Ne7/10. Qxe4"
  ],
  "r1bq1b1rppppnkpp884Q32p2N2PPP2PPPR1B1R1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Re1/9...Ne7/10. Qxe4/10...Kf7"
  ],
  "r1bq1b1rppppnkpp86B14Q32p2N2PPP2PPPR3R1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Re1/9...Ne7/10. Qxe4/10...Kf7/11. Bg5"
  ],
  "r1bq1b1rppp1nkpp83p2B14Q32p2N2PPP2PPPR3R1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Re1/9...Ne7/10. Qxe4/10...Kf7/11. Bg5/11...d5"
  ],
  "r1bq1b1rppp1nkpp83p2B15Q22p2N2PPP2PPPR3R1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Re1/9...Ne7/10. Qxe4/10...Kf7/11. Bg5/11...d5/12. Qf4"
  ],
  "r1bq1bkrppp1n1pp83p2B15Q22p2N2PPP2PPPR3R1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Nc3/6...dxc3/7. Bxf7/7...Kxf7/8. Qd5/8...Kf6/9. Re1/9...Ne7/10. Qxe4/10...Kf7/11. Bg5/11...d5/12. Qf4/12...Kg8"
  ],
  "r1bqkb1rpppp1ppp2n582Bpn35N2PPP2PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Re1"
  ],
  "r1bqkb1rppp2ppp2n53p42Bpn35N2PPP2PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Re1/6...d5"
  ],
  "r1bqkb1rppp2ppp2n53B43pn35N2PPP2PPPRNBQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Re1/6...d5/7. Bxd5"
  ],
  "r1b1kb1rppp2ppp2n53q43pn35N2PPP2PPPRNBQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Re1/6...d5/7. Bxd5/7...Qxd5"
  ],
  "r1b1kb1rppp2ppp2n53q43pn32N2N2PPP2PPPR1BQR1K1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Re1/6...d5/7. Bxd5/7...Qxd5/8. Nc3"
  ],
  "r1b1kb1rppp2ppp2n5q73pn32N2N2PPP2PPPR1BQR1K1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. d4/4...exd4/5. O-O/5...Nxe4/6. Re1/6...d5/7. Bxd5/7...Qxd5/8. Nc3/8...Qa5"
  ],
  "r1bqkb1rpppp1ppp2n2n24p1N12B1P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5"
  ],
  "r1bqk2rpppp1ppp2n2n22b1p1N12B1P38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5"
  ],
  "r1bqk2rpppp1Bpp2n2n22b1p1N14P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7"
  ],
  "r1bq3rppppkBpp2n2n22b1p1N14P38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7"
  ],
  "r1bq3rppppk1pp2n2n22bBp1N14P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5"
  ],
  "r1bq1r2ppppk1pp2n2n22bBp1N14P38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8"
  ],
  "r1bq1r2ppppk1pp2B2n22b1p1N14P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. Bxc6"
  ],
  "r1bq1r2ppp1k1pp2p2n22b1p1N14P38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. Bxc6/7...dxc6"
  ],
  "r1bq1r2ppp1k1pp2p2n22b1p1N14P33P4PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. Bxc6/7...dxc6/8. d3"
  ],
  "r1bq1r2ppp1k1pp2p52b1p1N14P1n13P4PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. Bxc6/7...dxc6/8. d3/8...Ng4"
  ],
  "r1bq1r2ppp1k1pp2p52b1p34P1n13P3NPPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. Bxc6/7...dxc6/8. d3/8...Ng4/9. Nh3"
  ],
  "r1bq1r2ppp1k1pp2p52b1p34P33P3NPPP2nPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. Bxc6/7...dxc6/8. d3/8...Ng4/9. Nh3/9...Nxf2"
  ],
  "r1bq1r2ppp1k1pp2p52b1p1B14P33P3NPPP2nPPRN1QK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. Bxc6/7...dxc6/8. d3/8...Ng4/9. Nh3/9...Nxf2/10. Bg5"
  ],
  "r1bq1r2pppk2pp2p52b1p1B14P33P3NPPP2nPPRN1QK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. Bxc6/7...dxc6/8. d3/8...Ng4/9. Nh3/9...Nxf2/10. Bg5/10...Kd7"
  ],
  "r1bqkr2ppp3pp2p52b1p1B14P33P3NPPP2nPPRN1QK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. Bxc6/7...dxc6/8. d3/8...Ng4/9. Nh3/9...Nxf2/10. Bg5/10...Ke8"
  ],
  "r1bq1r2ppppk1pp2n2n22bBp1N14P38PPPP1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. O-O"
  ],
  "r1bq1r2ppp1k1pp2np1n22bBp1N14P38PPPP1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. O-O/7...d6"
  ],
  "r1bq1r2ppp1k1pp2np1n22bBp1N14P32P5PP1P1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. O-O/7...d6/8. c3"
  ],
  "r2q1r2ppp1k1pp2np1n22bBp1N14P1b12P5PP1P1PPPRNBQ1RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. O-O/7...d6/8. c3/8...Bg4"
  ],
  "r2q1r2ppp1k1pp2np1n22bBp1N14P1b11QP5PP1P1PPPRNB2RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. O-O/7...d6/8. c3/8...Bg4/9. Qb3"
  ],
  "r2q1r2ppp1k1pp1bnp1n23Bp1N14P1b11QP5PP1P1PPPRNB2RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. O-O/7...d6/8. c3/8...Bg4/9. Qb3/9...Bb6"
  ],
  "r2q1r2ppp1k1pp1bBp1n24p1N14P1b11QP5PP1P1PPPRNB2RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. O-O/7...d6/8. c3/8...Bg4/9. Qb3/9...Bb6/10. Bxc6"
  ],
  "r2q1r2p1p1k1pp1bpp1n24p1N14P1b11QP5PP1P1PPPRNB2RK1w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. O-O/7...d6/8. c3/8...Bg4/9. Qb3/9...Bb6/10. Bxc6/10...bxc6"
  ],
  "r2q1r2p1p1k1pp1bpp1n24p1N14P1b11QP4PPP1P1PP1RNB2RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Bxf7/5...Ke7/6. Bd5/6...Rf8/7. O-O/7...d6/8. c3/8...Bg4/9. Qb3/9...Bb6/10. Bxc6/10...bxc6/11. h3"
  ],
  "r1bqk2rpppp1ppp2n2n22b1p1N12BPP38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. d4"
  ],
  "r1bqk2rppp2ppp2n2n22bpp1N12BPP38PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. d4/5...d5"
  ],
  "r1bqk2rppp2ppp2n2n22bBp1N13PP38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. d4/5...d5/6. Bxd5"
  ],
  "r1bqk2rpppp1Npp2n2n22b1p32B1P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7"
  ],
  "r1bqk2rpppp1Npp2n2n24p32B1P38PPPP1bPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2"
  ],
  "r1bqk2rpppp1Npp2n2n24p32B1P38PPPP1bPPRNBQ1K1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kf1"
  ],
  "r1b1k2rppppqNpp2n2n24p32B1P38PPPP1bPPRNBQ1K1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kf1/6...Qe7"
  ],
  "r1b1k2Nppppq1pp2n2n24p32B1P38PPPP1bPPRNBQ1K1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kf1/6...Qe7/7. Nxh8"
  ],
  "r1b1k2Nppp1q1pp2n2n23pp32B1P38PPPP1bPPRNBQ1K1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kf1/6...Qe7/7. Nxh8/7...d5"
  ],
  "r1b1k2Nppp1q1pp2n2n23Pp32B58PPPP1bPPRNBQ1K1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kf1/6...Qe7/7. Nxh8/7...d5/8. exd5"
  ],
  "r1b1k2Nppp1q1pp5n23Pp32Bn48PPPP1bPPRNBQ1K1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kf1/6...Qe7/7. Nxh8/7...d5/8. exd5/8...Nd4"
  ],
  "r1b1k2Nppp1q1pp3P1n24p32Bn48PPPP1bPPRNBQ1K1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kf1/6...Qe7/7. Nxh8/7...d5/8. exd5/8...Nd4/9. d6"
  ],
  "r1b1k2Nppp3pp3q1n24p32Bn48PPPP1bPPRNBQ1K1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kf1/6...Qe7/7. Nxh8/7...d5/8. exd5/8...Nd4/9. d6/9...Qxd6"
  ],
  "r1b1k2Nppp1q1pp2n2n23pp32B1P38PPPP1KPPRNBQ3Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kf1/6...Qe7/7. Nxh8/7...d5/8. Kxf2"
  ],
  "r1bqk2rpppp1Npp2n2n24p32B1P38PPPP1KPPRNBQ3Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2"
  ],
  "r1bqk2rpppp1Npp2n54p32B1n38PPPP1KPPRNBQ3Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4"
  ],
  "r1bqk2rpppp1Npp2n54p32B1n34K3PPPP2PPRNBQ3Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3"
  ],
  "r1b1k2rpppp1Npp2n54p32B1n2q4K3PPPP2PPRNBQ3Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3/7...Qh4"
  ],
  "r1b1k2rpppp1Npp2n54p32B1n2q4K1P1PPPP3PRNBQ3Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3/7...Qh4/8. g3"
  ],
  "r1b1k2rpppp1Npp2n54p32B4q4K1n1PPPP3PRNBQ3Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3/7...Qh4/8. g3/8...Nxg3"
  ],
  "r1b1k2rpppp1Npp2n54p32B4q4K1P1PPPP4RNBQ3Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3/7...Qh4/8. g3/8...Nxg3/9. hxg3"
  ],
  "r1b1k2rpppp1Npp2n54p32Bq44K1P1PPPP4RNBQ3Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3/7...Qh4/8. g3/8...Nxg3/9. hxg3/9...Qd4"
  ],
  "r1b1k2rpppp1Npp2n54p32Bq45KP1PPPP4RNBQ3Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3/7...Qh4/8. g3/8...Nxg3/9. hxg3/9...Qd4/10. Kf3"
  ],
  "r1b2rk1pppp1Npp2n54p32Bq45KP1PPPP4RNBQ3Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3/7...Qh4/8. g3/8...Nxg3/9. hxg3/9...Qd4/10. Kf3/10...O-O"
  ],
  "r1b2rk1pppp1Npp2n54p32Bq3R5KP1PPPP4RNBQ4b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3/7...Qh4/8. g3/8...Nxg3/9. hxg3/9...Qd4/10. Kf3/10...O-O/11. Rh4"
  ],
  "r1b2rk1pppp1Npp2n582Bqp2R5KP1PPPP4RNBQ4w": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Ke3/7...Qh4/8. g3/8...Nxg3/9. hxg3/9...Qd4/10. Kf3/10...O-O/11. Rh4/11...e4"
  ],
  "r1bqk2rpppp1Npp2n54p32B1n38PPPP2PPRNBQ2KRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Kg1"
  ],
  "r1b1k2rpppp1Npp2n54p32B1n2q8PPPP2PPRNBQ2KRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Bc5/5. Nxf7/5...Bxf2/6. Kxf2/6...Nxe4/7. Kg1/7...Qh4"
  ],
  "r1bqkb1rppp2ppp2n2n23pp1N12B1P38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5"
  ],
  "r1bqkb1rppp2ppp2n2n23Pp1N12B58PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5"
  ],
  "r1bqkb1rp1p2ppp2n2n21p1Pp1N12B58PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...b5"
  ],
  "r1bqkb1rp1p2ppp2n2n21p1Pp1N188PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...b5/6. Bf1"
  ],
  "r1bqkb1rp1p2ppp5n21p1Pp1N13n48PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...b5/6. Bf1/6...Nd4"
  ],
  "r1bqkb1rp1p2ppp2n2n21B1Pp1N188PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...b5/6. Bxb5"
  ],
  "r1b1kb1rp1p2ppp2n2n21B1qp1N188PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...b5/6. Bxb5/6...Qxd5"
  ],
  "r1b1kb1rp1p2ppp2B2n23qp1N188PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...b5/6. Bxb5/6...Qxd5/7. Bxc6"
  ],
  "r1b1kb1rp1p2ppp2q2n24p1N188PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...b5/6. Bxb5/6...Qxd5/7. Bxc6/7...Qxc6"
  ],
  "r1b1kb1rp1p2ppp2n2n21B1qp1N182N5PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...b5/6. Bxb5/6...Qxd5/7. Nc3"
  ],
  "r1b1kb1rp1p2ppp2n2n21B2p1N182N5PPPP1PqPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...b5/6. Bxb5/6...Qxd5/7. Nc3/7...Qxg2"
  ],
  "r1bqkb1rppp2ppp5n2n2Pp1N12B58PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5"
  ],
  "r1bqkb1rppp2ppp5n2nB1Pp1N188PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5"
  ],
  "r2qkb1rpppb1ppp5n2nB1Pp1N188PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...Bd7"
  ],
  "r2qkb1rpppb1ppp5n2nB1Pp1N188PPPPQPPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...Bd7/7. Qe2"
  ],
  "r1bqkb1rpp3ppp2p2n2nB1Pp1N188PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6"
  ],
  "r1bqkb1rpp3ppp2P2n2nB2p1N188PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6"
  ],
  "r1bqkb1rp4ppp2p2n2nB2p1N188PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6"
  ],
  "r1bqkb1rp4ppp2p2n2n3p1N1B78PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Ba4"
  ],
  "r1bqkb1rp4ppp2p2n2n3p1N183B4PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Bd3"
  ],
  "r1bqkb1rp4ppp2p2n2n3p1N188PPPPBPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2"
  ],
  "r1bqkb1rp4pp12p2n1pn3p1N188PPPPBPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6"
  ],
  "r1bqkb1rp4pp12p2n1pn3p385N2PPPPBPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3"
  ],
  "r1bqkb1rp4pp12p2n1pn74p35N2PPPPBPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4"
  ],
  "r1bqkb1rp4pp12p2n1pn3N34p38PPPPBPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5"
  ],
  "r1bqk2rp4pp12p2n1pn1b1N34p38PPPPBPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5/10...Bc5"
  ],
  "r1bqk2rp4pp12pb1n1pn3N34p38PPPPBPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5/10...Bd6"
  ],
  "r1bqk2rp4pp12pb1n1pn3N33Pp38PPP1BPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5/10...Bd6/11. d4"
  ],
  "r1bqk2rp4pp12pb1n1pn3N383p4PPP1BPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5/10...Bd6/11. d4/11...exd3"
  ],
  "r1bqk2rp4pp12pb1n1pn783N4PPP1BPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5/10...Bd6/11. d4/11...exd3/12. Nxd3"
  ],
  "r1b1k2rp1q2pp12pb1n1pn783N4PPP1BPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5/10...Bd6/11. d4/11...exd3/12. Nxd3/12...Qc7"
  ],
  "r1bqk2rp4pp12pb1n1pn3N34pP28PPPPB1PPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5/10...Bd6/11. f4"
  ],
  "r1b1kb1rp1q2pp12p2n1pn3N34p38PPPPBPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5/10...Qc7"
  ],
  "r1b1kb1rp4pp12p2n1pn3N33qp38PPPPBPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nf3/9...e4/10. Ne5/10...Qd4"
  ],
  "r1bqkb1rp4pp12p2n1pn3p387NPPPPBPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nh3"
  ],
  "r1bqk2rp4pp12p2n1pn1b1p387NPPPPBPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nh3/9...Bc5"
  ],
  "r1bqk2rp4pp12pb1n1pn3p387NPPPPBPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nh3/9...Bd6"
  ],
  "r1bqk2rp4pp12pb1n1pn3p383P3NPPP1BPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nh3/9...Bd6/10. d3"
  ],
  "r1bq1rk1p4pp12pb1n1pn3p383P3NPPP1BPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nh3/9...Bd6/10. d3/10...O-O"
  ],
  "r1bq1rk1p4pp12pb1n1pn3p383P3NPPP1BPPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nh3/9...Bd6/10. d3/10...O-O/11. O-O"
  ],
  "r1bqkb1rp4p22p2n1pn3p1p187NPPPPBPPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nh3/9...g5"
  ],
  "r1bqkb1rp4p22p2n1pn3p1p183P3NPPP1BPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Be2/8...h6/9. Nh3/9...g5/10. d3"
  ],
  "r1bqkb1rp4ppp2p2n2nB2p1N185Q2PPPP1PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Qf3"
  ],
  "1rbqkb1rp4ppp2p2n2nB2p1N185Q2PPPP1PPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Qf3/8...Rb8"
  ],
  "1rbqkb1rp4ppp2p2n2n3p1N183B1Q2PPPP1PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Qf3/8...Rb8/9. Bd3"
  ],
  "1rbqkb1rp4pp12p2n1pn3p1N183B1Q2PPPP1PPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Qf3/8...Rb8/9. Bd3/9...h6"
  ],
  "1rbqkb1rp4pp12p2n1pn3p34N33B1Q2PPPP1PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Qf3/8...Rb8/9. Bd3/9...h6/10. Ne4"
  ],
  "1rbqkb1rp4pp12p4pn2np34N33B1Q2PPPP1PPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. Bb5/6...c6/7. dxc6/7...bxc6/8. Qf3/8...Rb8/9. Bd3/9...h6/10. Ne4/10...Nd5"
  ],
  "r1bqkb1rppp2ppp5n2n2Pp1N12B53P4PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3"
  ],
  "r1bqkb1rppp2pp15n1pn2Pp1N12B53P4PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3/6...h6"
  ],
  "r1bqkb1rppp2pp15n1pn2Pp32B53P1N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3/6...h6/7. Nf3"
  ],
  "r1bqkb1rppp2pp15n1pn2P42B1p33P1N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3/6...h6/7. Nf3/7...e4"
  ],
  "r1bqkb1rppp2pp15n1pn2P42B1p33P1N2PPP1QPPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3/6...h6/7. Nf3/7...e4/8. Qe2"
  ],
  "r1bqkb1rppp2pp15n1p3P42n1p33P1N2PPP1QPPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3/6...h6/7. Nf3/7...e4/8. Qe2/8...Nxc4"
  ],
  "r1bqkb1rppp2pp15n1p3P42P1p35N2PPP1QPPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3/6...h6/7. Nf3/7...e4/8. Qe2/8...Nxc4/9. dxc4"
  ],
  "r1bqk2rppp2pp15n1p2bP42P1p35N2PPP1QPPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3/6...h6/7. Nf3/7...e4/8. Qe2/8...Nxc4/9. dxc4/9...Bc5"
  ],
  "r1bqk2rppp2pp15n1p2bP42P1p38PPPNQPPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3/6...h6/7. Nf3/7...e4/8. Qe2/8...Nxc4/9. dxc4/9...Bc5/10. Nfd2"
  ],
  "r1bq1rk1ppp2pp15n1p2bP42P1p38PPPNQPPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Na5/6. d3/6...h6/7. Nf3/7...e4/8. Qe2/8...Nxc4/9. dxc4/9...Bc5/10. Nfd2/10...O-O"
  ],
  "r1bqkb1rppp2ppp5n23Pp1N11nB58PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nb4"
  ],
  "r1bqkb1rppp2ppp5n23Pp1N12Bn48PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4"
  ],
  "r1bqkb1rppp2ppp5n23Pp1N12Bn42P5PP1P1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3"
  ],
  "r1bqkb1rp1p2ppp5n21p1Pp1N12Bn42P5PP1P1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5"
  ],
  "r1bqkb1rp1p2ppp5n21p1Pp1N13n42P5PP1P1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1"
  ],
  "r1bqkb1rp1p2ppp81p1np1N13n42P5PP1P1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5"
  ],
  "r1bqkb1rp1p2ppp81p1np1N13P48PP1P1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5/8. cxd4"
  ],
  "r1b1kb1rp1p2ppp81p1np1q13P48PP1P1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5/8. cxd4/8...Qxg5"
  ],
  "r1bqkb1rp1p2ppp81p1np33nN32P5PP1P1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5/8. Ne4"
  ],
  "r1b1kb1rp1p2ppp81p1np33nN2q2P5PP1P1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5/8. Ne4/8...Qh4"
  ],
  "r1b1kb1rp1p2ppp81p1np33n3q2P3N1PP1P1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5/8. Ne4/8...Qh4/9. Ng3"
  ],
  "r3kb1rp1p2ppp81p1np33n2bq2P3N1PP1P1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5/8. Ne4/8...Qh4/9. Ng3/9...Bg4"
  ],
  "r3kb1rp1p2ppp81p1np33n2bq2P2PN1PP1P2PPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5/8. Ne4/8...Qh4/9. Ng3/9...Bg4/10. f3"
  ],
  "r3kb1rp1p2ppp81p1n43np1bq2P2PN1PP1P2PPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5/8. Ne4/8...Qh4/9. Ng3/9...Bg4/10. f3/10...e4"
  ],
  "r3kb1rp1p2ppp81p1n43Pp1bq5PN1PP1P2PPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. c3/6...b5/7. Bf1/7...Nxd5/8. Ne4/8...Qh4/9. Ng3/9...Bg4/10. f3/10...e4/11. cxd4"
  ],
  "r1bqkb1rppp2ppp3P1n24p1N12Bn48PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nd4/6. d6"
  ],
  "r1bqkb1rppp2ppp2n53np1N12B58PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5"
  ],
  "r1bqkb1rppp2ppp2n53np1N12BP48PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4"
  ],
  "r1bqk2rppp2ppp2n53np1N11bBP48PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4/6...Bb4"
  ],
  "r1bqk2rppp2ppp2n53np1N11bBP42P5PP3PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4/6...Bb4/7. c3"
  ],
  "r1bqk2rppp1bppp2n53np1N12BP42P5PP3PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4/6...Bb4/7. c3/7...Be7"
  ],
  "r1bqk2rppp1bNpp2n53np32BP42P5PP3PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4/6...Bb4/7. c3/7...Be7/8. Nxf7"
  ],
  "r1bq3rppp1bkpp2n53np32BP42P5PP3PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4/6...Bb4/7. c3/7...Be7/8. Nxf7/8...Kxf7"
  ],
  "r1bq3rppp1bkpp2n53np32BP42P2Q2PP3PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4/6...Bb4/7. c3/7...Be7/8. Nxf7/8...Kxf7/9. Qf3"
  ],
  "r1bq3rppp1b1pp2n1k33np32BP42P2Q2PP3PPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4/6...Bb4/7. c3/7...Be7/8. Nxf7/8...Kxf7/9. Qf3/9...Ke6"
  ],
  "r1bq3rppp1b1pp2n1k33np32BPQ32P5PP3PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4/6...Bb4/7. c3/7...Be7/8. Nxf7/8...Kxf7/9. Qf3/9...Ke6/10. Qe4"
  ],
  "r1bq1r2ppp1b1pp2n1k33np32BPQ32P5PP3PPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. d4/6...Bb4/7. c3/7...Be7/8. Nxf7/8...Kxf7/9. Qf3/9...Ke6/10. Qe4/10...Rf8"
  ],
  "r1bqkb1rppp2Npp2n53np32B58PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7"
  ],
  "r1bq1b1rppp2kpp2n53np32B58PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7/6...Kxf7"
  ],
  "r1bq1b1rppp2kpp2n53np32B55Q2PPPP1PPPRNB1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7/6...Kxf7/7. Qf3"
  ],
  "r1bq1b1rppp3pp2n1k33np32B55Q2PPPP1PPPRNB1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7/6...Kxf7/7. Qf3/7...Ke6"
  ],
  "r1bq1b1rppp3pp2n1k33np32B52N2Q2PPPP1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7/6...Kxf7/7. Qf3/7...Ke6/8. Nc3"
  ],
  "r1bq1b1rppp3pp4k33np31nB52N2Q2PPPP1PPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7/6...Kxf7/7. Qf3/7...Ke6/8. Nc3/8...Nb4"
  ],
  "r1bq1b1rppp3pp4k33np31nB5P1N2Q21PPP1PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7/6...Kxf7/7. Qf3/7...Ke6/8. Nc3/8...Nb4/9. a3"
  ],
  "r1bq1b1rppp3pp4k33np32B5P1N2Q21PnP1PPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7/6...Kxf7/7. Qf3/7...Ke6/8. Nc3/8...Nb4/9. a3/9...Nxc2"
  ],
  "r1bq1b1rppp3pp4k33np32B5P1N2Q21PnP1PPPR1BK3Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7/6...Kxf7/7. Qf3/7...Ke6/8. Nc3/8...Nb4/9. a3/9...Nxc2/10. Kd1"
  ],
  "r1bq1b1rppp3pp4k33np32B5P1N2Q21P1P1PPPn1BK3Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...d5/5. exd5/5...Nxd5/6. Nxf7/6...Kxf7/7. Qf3/7...Ke6/8. Nc3/8...Nb4/9. a3/9...Nxc2/10. Kd1/10...Nxa1"
  ],
  "r1bqkb1rpppp1ppp2n53np1N12B1P38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Nd5"
  ],
  "r1bqkb1rpppp1ppp2n53np1N12BPP38PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Nd5/5. d4"
  ],
  "r1bqkb1rpppp1Npp2n53np32B1P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Nd5/5. Nxf7"
  ],
  "r1bqkb1rpppp1ppp2n54p1N12B1n38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Nxe4"
  ],
  "r1bqkb1rpppp1Bpp2n54p1N14n38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Nxe4/5. Bxf7"
  ],
  "r1bq1b1rppppkBpp2n54p1N14n38PPPP1PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Nxe4/5. Bxf7/5...Ke7"
  ],
  "r1bqkb1rpppp1Npp2n54p32B1n38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. Ng5/4...Nxe4/5. Nxf7"
  ],
  "r1bqkb1rpppp1ppp2n2n24p32B1P35N2PPPP1PPPRNBQ1RK1b": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Bc4/3...Nf6/4. O-O"
  ],
  "r1bqkbnrpppp1ppp2n54p34P35N2PPPPBPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Be2"
  ],
  "r1bqkbnrpppp1ppp2n54p34P32P2N2PP1P1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. c3"
  ],
  "r1bqkbnrppp2ppp2n53pp34P32P2N2PP1P1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. c3/3...d5"
  ],
  "r1bqkbnrpppp2pp2n54pp24P32P2N2PP1P1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. c3/3...f5"
  ],
  "r1bqkb1rpppp1ppp2n2n24p34P32P2N2PP1P1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. c3/3...Nf6"
  ],
  "r1bqkb1rpppp1ppp2n2n24p33PP32P2N2PP3PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. c3/3...Nf6/4.d4"
  ],
  "r1bqkbnrpppp1ppp2n54p33PP35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. d4"
  ],
  "r1bqkbnrpppp1ppp2n583pP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. d4/3...exd4"
  ],
  "r1bqkbnrpppp1ppp2n582BpP35N2PPP2PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. d4/3...exd4/4. Bc4"
  ],
  "r1bqk1nrpppp1ppp2n52b52BpP35N2PPP2PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. d4/3...exd4/4. Bc4/4...Bc5"
  ],
  "r1bqkbnrpppp1ppp2n583pP32P2N2PP3PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. d4/3...exd4/4. c3"
  ],
  "r1bqkbnrpppp1ppp2n583NP38PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. d4/3...exd4/4. Nxd4"
  ],
  "r1bqk1nrpppp1ppp2n52b53NP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. d4/3...exd4/4. Nxd4/4...Bc5"
  ],
  "r1bqk1nrpppp1ppp2N52b54P38PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. d4/3...exd4/4. Nxd4/4...Bc5/5. Nxc6"
  ],
  "r1b1kbnrpppp1ppp2n583NP2q8PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. d4/3...exd4/4. Nxd4/4...Qh4"
  ],
  "r1bqkbnrpppp1ppp2n54p34P35NP1PPPP1P1PRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. g3"
  ],
  "r1bqkbnrpppp1ppp2n54p34P32N2N2PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3"
  ],
  "r1bqkbnrpppp2pp2n54pp24P32N2N2PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3/3...f5"
  ],
  "r1bqkbnrpppp1p1p2n3p14p34P32N2N2PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3/3...g6"
  ],
  "r1bqkbnrpppp1p1p2n3p13N43pP35N2PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3/3...g6/4. d4/4...exd4/5. Nd5"
  ],
  "r1bqkb1rpppp1ppp2n2n24p34P32N2N2PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3/3...Nf6"
  ],
  "r1bqkb1rpppp1ppp2n2n21B2p34P32N2N2PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3/3...Nf6/4. Bb5"
  ],
  "r1bqkb1rpppp1ppp2n2n24p32B1P32N2N2PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3/3...Nf6/4. Bc4"
  ],
  "r1bqkb1rpppp1ppp2n54p32B1n32N2N2PPPP1PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3/3...Nf6/4. Bc4/4...Nxe4"
  ],
  "r1bqkb1rpppp1ppp2n2n24N34P32N5PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3/3...Nf6/4. Nxe5"
  ],
  "r1bqkb1rpppp1ppp5n24n34P32N5PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nc3/3...Nf6/4. Nxe5/4...Nxe5"
  ],
  "r1bqkbnrpppp1ppp2n54N34P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nxe5"
  ],
  "r1bqkbnrpppp1ppp84n34P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nc6/3. Nxe5/3...Nxe5"
  ],
  "rnbqkb1rpppp1ppp5n24p34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6"
  ],
  "rnbqkb1rpppp1ppp5n24p32B1P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Bc4"
  ],
  "rnbqkb1rpppp1Bpp84p34n35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Bc4/3...Nxe4/4. Bxf7"
  ],
  "rnbqkb1rpppp1ppp5n24p33PP35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. d4"
  ],
  "rnbqkb1rpppp1ppp84p33Pn35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. d4/3...Nxe4"
  ],
  "rnbqkb1rpppp1ppp5n24p34P32N2N2PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nc3"
  ],
  "rnbqk2rpppp1ppp5n24p31b2P32N2N2PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nc3/3...Bb4"
  ],
  "rnbqk2rpppp1ppp5n24p31bB1P32N2N2PPPP1PPPR1BQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nc3/3...Bb4/4. Bc4"
  ],
  "rnbqkb1rpppp1ppp84p34P1n12N2N2PPPP1PPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nc3/3...Ng4"
  ],
  "rnbqkb1rpppp1ppp5n24N34P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5"
  ],
  "rnbqkb1rppp2ppp3p1n24N34P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6"
  ],
  "rnbqkb1rppp2ppp3p1n284P35N2PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nf3"
  ],
  "rnbqkb1rppp2ppp3p484n35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nf3/4...Nxe4"
  ],
  "rnbqkb1rppp2ppp3p483Pn35N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nf3/4...Nxe4/5. d4"
  ],
  "rnbqkb1rppp2ppp3p484n32N2N2PPPP1PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nf3/4...Nxe4/5. Nc3"
  ],
  "rnbqkb1rppp2Npp3p1n284P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nxf7"
  ],
  "rnbq1b1rppp2kpp3p1n284P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nxf7/4...Kxf7"
  ],
  "rnbq1b1rppp2kpp3p1n282B1P38PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nxf7/4...Kxf7/5. Bc4"
  ],
  "rnbq1b1rppp2kpp3p1n283PP38PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nxf7/4...Kxf7/5. d4"
  ],
  "rnbq1b1rpp3kpp3p1n22p53PP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nxf7/4...Kxf7/5. d4/5...c5"
  ],
  "rnbq1b1rppp2k1p3p1np183PP38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nxf7/4...Kxf7/5. d4/5...g6"
  ],
  "rnbq1b1rppp2kpp3p483Pn38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...d6/4. Nxf7/4...Kxf7/5. d4/5...Nxe4"
  ],
  "r1bqkb1rpppp1ppp2n2n24N34P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6"
  ],
  "r1bqkb1rpppp1ppp2N2n284P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6"
  ],
  "r1bqkb1rppp2ppp2p2n284P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6"
  ],
  "r1bqkb1rppp2ppp2p2n284P33P4PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. d3"
  ],
  "r1bqk2rppp2ppp2p2n22b54P33P4PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. d3/5...Bc5"
  ],
  "r1bqk2rppp2ppp2p2n22b54P33P4PPP1BPPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. d3/5...Bc5/6. Be2"
  ],
  "r1bqk2rppp2ppp2p2n22b3B14P33P4PPP2PPPRN1QKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. d3/5...Bc5/6. Bg5"
  ],
  "r1bqk2rppp2ppp2p52b3B14n33P4PPP2PPPRN1QKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. d3/5...Bc5/6. Bg5/6...Nxe4"
  ],
  "r1bBk2rppp2ppp2p52b54n33P4PPP2PPPRN1QKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. d3/5...Bc5/6. Bg5/6...Nxe4/7. Bxd8"
  ],
  "r1bqk2rppp2ppp2p2n22b54P32NP4PPP2PPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. d3/5...Bc5/6. Nc3"
  ],
  "r1bqkb1rppp2ppp2p2n24P388PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. e5"
  ],
  "r1bqkb1rppp2ppp2p54P34n38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. e5/5...Ne4"
  ],
  "r1bqkb1rppp2ppp2p54P34n33P4PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. e5/5...Ne4/6. d3"
  ],
  "r1bqkb1rppp2ppp2p54P34n35P2PPPP2PPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxc6/4...dxc6/5. e5/5...Ne4/6. f3"
  ],
  "r1bqkb1rpppp1Npp2n2n284P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxf7"
  ],
  "r1bq1b1rpppp1kpp2n2n284P38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxf7/4...Kxf7"
  ],
  "r1bq1b1rpppp1kpp2n2n283PP38PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxf7/4...Kxf7/5. d4"
  ],
  "r1bq1b1rpppp1kpp2n583Pn38PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxf7/4...Kxf7/5. d4/5...Nxe4"
  ],
  "r1bq1b1rpppp1kpp2n57Q3Pn38PPP2PPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxf7/4...Kxf7/5. d4/5...Nxe4/6. Qh5"
  ],
  "r1bq1bkrpppp2pp2n57Q3Pn38PPP2PPPRNB1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxf7/4...Kxf7/5. d4/5...Nxe4/6. Qh5/6...Kg8"
  ],
  "r1bq1bkrpppp2pp2n53Q43Pn38PPP2PPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nc6/4. Nxf7/4...Kxf7/5. d4/5...Nxe4/6. Qh5/6...Kg8/7. Qd5"
  ],
  "rnbqkb1rpppp1ppp84N34n38PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nxe4"
  ],
  "rnbqkb1rpppp1ppp84N34n38PPPPQPPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nxe4/4. Qe2"
  ],
  "rnbqkb1rpppp1ppp5n24N388PPPPQPPPRNB1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nxe4/4. Qe2/4...Nf6"
  ],
  "rnb1kb1rppppqppp84N34n38PPPPQPPPRNB1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nxe4/4. Qe2/4...Qe7"
  ],
  "rnb1kb1rppppqppp84N34Q38PPPP1PPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nxe4/4. Qe2/4...Qe7/5. Qxe4"
  ],
  "rnb1kb1rppp1qppp3p44N34Q38PPPP1PPPRNB1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Nf6/3. Nxe5/3...Nxe4/4. Qe2/4...Qe7/5. Qxe4/5...d6"
  ],
  "rnb1kbnrppppqppp84p34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Qe7"
  ],
  "rnb1kbnrppp1qppp3p44p33PP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Qe7/3. d4/3...d6"
  ],
  "rnb1kbnrppppqppp84N34P38PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Qe7/3. Nxe5"
  ],
  "rnb1kbnrpppp1ppp5q24p34P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Qf6"
  ],
  "rnb1kbnrpppp1ppp5q24p32B1P35N2PPPP1PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nf3/2...Qf6/3. Bc4"
  ],
  "rnbqkbnrpppp1ppp84p34P37NPPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e5/2. Nh3"
  ],
  "rnbqkbnrpppp1ppp84p34P35Q2PPPP1PPPRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Qf3"
  ],
  "rnbqkbnrpppp1ppp84p2Q4P38PPPP1PPPRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5"
  ],
  "rnbqkbnrpppp1p1p6p14p2Q4P38PPPP1PPPRNB1KBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...g6"
  ],
  "rnbq1bnrppppkppp84p2Q4P38PPPP1PPPRNB1KBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Ke7"
  ],
  "rnbq1bnrppppkppp84Q34P38PPPP1PPPRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Ke7/3. Qxe5"
  ],
  "r1bqkbnrpppp1ppp2n54p2Q4P38PPPP1PPPRNB1KBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6"
  ],
  "r1bqkbnrpppp1ppp2n54p2Q2B1P38PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6/3. Bc4"
  ],
  "r1bqkbnrpppp1p1p2n3p14p2Q2B1P38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6/3. Bc4/3...g6"
  ],
  "r1bqkbnrpppp1p1p2n3p14p32B1P35Q2PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6/3. Bc4/3...g6/4. Qf3"
  ],
  "r1bqkbnrpppp3p2n3p14pp22B1P35Q2PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6/3. Bc4/3...g6/4. Qf3/4...f5"
  ],
  "r1bqkb1rpppp1p1p2n2np14p32B1P35Q2PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6/3. Bc4/3...g6/4. Qf3/4...Nf6"
  ],
  "r1bqkb1rpppp1p1p2n2np14p32B1P32N2Q2PPPP1PPPR1B1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6/3. Bc4/3...g6/4. Qf3/4...Nf6/5. Nc3"
  ],
  "r1bqkb1rpppp1p1p5np14p32BnP32N2Q2PPPP1PPPR1B1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6/3. Bc4/3...g6/4. Qf3/4...Nf6/5. Nc3/5...Nd4"
  ],
  "r1bqkb1rpppp1ppp2n2n24p2Q2B1P38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6/3. Bc4/3...Nf6"
  ],
  "r1bqkb1rpppp1Qpp2n2n24p32B1P38PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nc6/3. Bc4/3...Nf6/4. Qxf7"
  ],
  "rnbqkb1rpppp1ppp5n24p2Q4P38PPPP1PPPRNB1KBNRw": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nf6"
  ],
  "rnbqkb1rpppp1ppp5n24Q34P38PPPP1PPPRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...e5/2. Qh5/2...Nf6/3. Qxe5"
  ],
  "rnbqkbnrpppp1ppp4p384P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6"
  ],
  "rnbqkbnrpppp1ppp4p382B1P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e6/2. Bc4"
  ],
  "rnbqkbnrppp2ppp4p33p42B1P38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...e6/2. Bc4/2...d5"
  ],
  "rnbqkbnrpppp1ppp4p382P1P38PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. c4"
  ],
  "rnbqkbnrpppp1ppp4p384P33P4PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d3"
  ],
  "rnbqkbnrpp1p1ppp4p32p54P33P4PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d3/2...c5"
  ],
  "rnbqkbnrppp2ppp4p33p44P33P4PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d3/2...d5"
  ],
  "rnbqkbnrpppp1ppp4p383PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4"
  ],
  "rn1qkbnrpbpp1ppp1p2p383PP35N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...b6/3. Nf3/3...Bb7"
  ],
  "rn1qk2rpbppnppp1p2p381b1PP32NB1N2PPP2PPPR1BQK2Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...b6/3. Nf3/3...Bb7/4. Nc3/4...Bb4/5. Bd3/5...Ne7"
  ],
  "rnbqkbnrpp1p1ppp4p32p53PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...c5"
  ],
  "rnbqkbnrppp2ppp4p33p43PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5"
  ],
  "rnbqkbnrppp2ppp4p33pP33P48PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5"
  ],
  "rnbqkbnrpp3ppp4p32ppP33P48PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5"
  ],
  "rnbqkbnrpp3ppp4p32ppP33P42P5PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3"
  ],
  "r1bqkbnrpp3ppp2n1p32ppP33P42P5PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6"
  ],
  "r1bqkbnrpp3ppp2n1p32ppP33P42P2N2PP3PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3"
  ],
  "r2qkbnrpp1b1ppp2n1p32ppP33P42P2N2PP3PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Bd7"
  ],
  "r1b1kbnrpp3ppp1qn1p32ppP33P42P2N2PP3PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6"
  ],
  "r1b1kbnrpp3ppp1qn1p32ppP33P4P1P2N21P3PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6/6. a3"
  ],
  "r1b1kbnrpp3ppp1qn1p33pP32pP4P1P2N21P3PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6/6. a3/6...c4"
  ],
  "r1b1kbnrpp3ppp1qn1p32ppP33P42PB1N2PP3PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6/6. Bd3"
  ],
  "r1b1kbnrpp3ppp1qn1p33pP33p42PB1N2PP3PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6/6. Bd3/6...cxd4"
  ],
  "r1b1kbnrpp3ppp1qn1p33pP33P43B1N2PP3PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6/6. Bd3/6...cxd4/7. cxd4"
  ],
  "r1b1kbnrpp3ppp1q2p33pP33n43B1N2PP3PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6/6. Bd3/6...cxd4/7. cxd4/7...Nxd4"
  ],
  "r1b1kbnrpp3ppp1q2p33pP33N43B4PP3PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6/6. Bd3/6...cxd4/7. cxd4/7...Nxd4/8. Nxd4"
  ],
  "r1b1kbnrpp3ppp4p33pP33q43B4PP3PPPRNBQK2Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6/6. Bd3/6...cxd4/7. cxd4/7...Nxd4/8. Nxd4/8...Qxd4"
  ],
  "r1b1kbnrpp3ppp4p31B1pP33q48PP3PPPRNBQK2Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. e5/3...c5/4. c3/4...Nc6/5. Nf3/5...Qb6/6. Bd3/6...cxd4/7. cxd4/7...Nxd4/8. Nxd4/8...Qxd4/9. Bb5"
  ],
  "rnbqkbnrppp2ppp4p33P43P48PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. exd5"
  ],
  "rnbqkbnrppp2ppp83p43P48PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. exd5/3...exd5"
  ],
  "rnbqkbnrppp2ppp83p43P43B4PPP2PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. exd5/3...exd5/4. Bd3"
  ],
  "rnbqkbnrppp2ppp83p43P44B3PPP2PPPRN1QKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. exd5/3...exd5/4. Be3"
  ],
  "rnbqkbnrppp2ppp83p42PP48PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. exd5/3...exd5/4. c4"
  ],
  "rnbqkb1rppp2ppp5n23p42PP48PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. exd5/3...exd5/4. c4/4...Nf6"
  ],
  "rnbqkb1rppp2ppp5n23p42PP42N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. exd5/3...exd5/4. c4/4...Nf6/5. Nc3"
  ],
  "rnbqk2rppp1bppp5n23p42PP42N5PP3PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. exd5/3...exd5/4. c4/4...Nf6/5. Nc3/5...Be7"
  ],
  "rnbqkbnrppp2ppp83p43P45N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. exd5/3...exd5/4. Nf3"
  ],
  "rnbqkbnrppp2ppp4p33p43PP32N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3"
  ],
  "rnbqk1nrppp2ppp4p33p41b1PP32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4"
  ],
  "rnbqk1nrppp2ppp4p383Pp3P1P2P22P3PPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. a3/4...Bxc3/5. bxc3/5...dxe4/6. f3"
  ],
  "rnbqk1nrppp2ppp4p33pP31b1P42N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5"
  ],
  "rnbqk1nrpp3ppp4p32ppP31b1P42N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5"
  ],
  "rnbqk1nrpp3ppp4p32ppP31b1P4P1N51PP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3"
  ],
  "rnbqk1nrpp3ppp4p32ppP33P4P1b51PP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3"
  ],
  "rnbqk1nrpp3ppp4p32ppP33P4P1P52P2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3/6. bxc3"
  ],
  "rnbqk2rpp2nppp4p32ppP33P4P1P52P2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3/6. bxc3/6...Ne7"
  ],
  "rnbqk2rpp2nppp4p32ppP33P2Q1P1P52P2PPPR1B1KBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3/6. bxc3/6...Ne7/7. Qg4"
  ],
  "rnbq1rk1pp2nppp4p32ppP33P2Q1P1P52P2PPPR1B1KBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3/6. bxc3/6...Ne7/7. Qg4/7...O-O"
  ],
  "rnbq1rk1pp2nppp4p32ppP33P2Q1P1P2N22P2PPPR1B1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3/6. bxc3/6...Ne7/7. Qg4/7...O-O/8. Nf3"
  ],
  "r1bq1rk1pp2nppp2n1p32ppP33P2Q1P1P2N22P2PPPR1B1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3/6. bxc3/6...Ne7/7. Qg4/7...O-O/8. Nf3/8...Nbc6"
  ],
  "r1bq1rk1pp2nppp2n1p32ppP33P2Q1P1PB1N22P2PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3/6. bxc3/6...Ne7/7. Qg4/7...O-O/8. Nf3/8...Nbc6/9. Bd3"
  ],
  "r1bq1rk1pp2n1pp2n1p32ppPp23P2Q1P1PB1N22P2PPPR1B1K2Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3/6. bxc3/6...Ne7/7. Qg4/7...O-O/8. Nf3/8...Nbc6/9. Bd3/9...f5"
  ],
  "r1bq1rk1pp2n1pp2n1pP22pp43P2Q1P1PB1N22P2PPPR1B1K2Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. e5/4...c5/5. a3/5...Bxc3/6. bxc3/6...Ne7/7. Qg4/7...O-O/8. Nf3/8...Nbc6/9. Bd3/9...f5/10. exf6"
  ],
  "rnbqk1nrppp2ppp4p33P41b1P42N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. exd5"
  ],
  "rnbqk1nrppp2ppp4p33p41b1PP32N5PPP1NPPPR1BQKB1Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. Nge2"
  ],
  "rnbqk1nrppp2ppp4p381b1Pp32N5PPP1NPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Bb4/4. Nge2/4...dxe4"
  ],
  "rnbqkbnrppp2ppp4p383Pp32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...dxe4"
  ],
  "rnbqkb1rppp2ppp4pn23p43PP32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Nf6"
  ],
  "rnbqkb1rppp2ppp4pn23p2B13PP32N5PPP2PPPR2QKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Nf6/4. Bg5"
  ],
  "rnbqk2rppp2ppp4pn23p2B11b1PP32N5PPP2PPPR2QKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Nf6/4. Bg5/4...Bb4"
  ],
  "rnbqk2rppp1bppp4pn23p2B13PP32N5PPP2PPPR2QKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Nf6/4. Bg5/4...Be7"
  ],
  "rnbqkb1rppp2ppp4pn23pP33P42N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nc3/3...Nf6/4. e5"
  ],
  "rnbqkbnrppp2ppp4p33p43PP38PPPN1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nd2"
  ],
  "rnbqk1nrppp1bppp4p33p43PP38PPPN1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nd2/3...Be7"
  ],
  "rnbqkbnrpp3ppp4p32pp43PP38PPPN1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nd2/3...c5"
  ],
  "rnbqkb1rppp2ppp4pn23p43PP38PPPN1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nd2/3...Nf6"
  ],
  "rnbqkb1rppp2ppp4pn23pP33P48PPPN1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nd2/3...Nf6/4. e5"
  ],
  "rnbqkb1rpppn1ppp4p33pP33P48PPPN1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nd2/3...Nf6/4. e5/4...Nfd7"
  ],
  "rnbqkb1rpppn1ppp4p33pP33P43B4PPPN1PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nd2/3...Nf6/4. e5/4...Nfd7/5. Bd3"
  ],
  "rnbqkb1rpp1n1ppp4p32ppP33P43B4PPPN1PPPR1BQK1NRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nd2/3...Nf6/4. e5/4...Nfd7/5. Bd3/5...c5"
  ],
  "rnbqkb1rpp1n1ppp4p32ppP33P42PB4PP1N1PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...d5/3. Nd2/3...Nf6/4. e5/4...Nfd7/5. Bd3/5...c5/6. c3"
  ],
  "rnbqkbnrpppp2pp4p35p23PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. d4/2...f5"
  ],
  "rnbqkbnrpppp1ppp4p384P38PPPPQPPPRNB1KBNRb": [
    "Chess Opening Theory/1. e4/1...e6/2. Qe2"
  ],
  "rnbqkbnrpp1p1ppp4p32p54P38PPPPQPPPRNB1KBNRw": [
    "Chess Opening Theory/1. e4/1...e6/2. Qe2/2...c5"
  ],
  "rnbqkbnrpp1p1ppp4p32p54P35N2PPPPQPPPRNB1KB1Rb": [
    "Chess Opening Theory/1. e4/1...e6/2. Qe2/2...c5/3. Nf3"
  ],
  "r1bqkbnrpp1p1ppp2n1p32p54P35N2PPPPQPPPRNB1KB1Rw": [
    "Chess Opening Theory/1. e4/1...e6/2. Qe2/2...c5/3. Nf3/3...Nc6"
  ],
  "rnbqkbnrppppp1pp85p24P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...f5"
  ],
  "rnbqkbnrppppp1pp85P288PPPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...f5/2. exf5"
  ],
  "rnbqkbnrppppp1pp5p284P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...f6"
  ],
  "rnbqkbnrpppppp1p86p14P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...g5"
  ],
  "rnbqkbnrpppppp1p86p14P1P18PPPP1P1PRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...g5/2. g4"
  ],
  "rnbqkbnrpppppp1p6p184P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...g6"
  ],
  "rnbqkbnrpppppp1p6p183PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...g6/2. d4"
  ],
  "rnbqk1nrppppppbp6p183PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...g6/2. d4/2...Bg7"
  ],
  "rnbqk1nrppppppbp6p183PP32N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...g6/2. d4/2...Bg7/3. Nc3"
  ],
  "rnbqkbnrppppppp187p4P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...h5"
  ],
  "rnbqkbnrppppppp17p84P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...h6"
  ],
  "r1bqkbnrppppppppn784P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Na6"
  ],
  "r1bqkbnrpppppppp2n584P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nc6"
  ],
  "r1bqkbnrpppppppp2n51B64P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...Nc6/2. Bb5"
  ],
  "r1bqkbnrpppppppp81B63nP38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. Bb5/2...Nd4"
  ],
  "r1bqkbnrpppppppp882BnP38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...Nc6/2. Bb5/2...Nd4/3. Bc4"
  ],
  "r1bqkbnrpppppppp2n583PP38PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4"
  ],
  "r1bqkbnrppp1pppp2n53p43PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5"
  ],
  "r1bqkbnrppp1pppp2n53p43PP32N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3"
  ],
  "r1bqkbnr1pp1ppppp1n53p43PP32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3/3...a6"
  ],
  "r1bqkbnr1pp1ppppp1n53P43P42N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3/3...a6/4. exd5"
  ],
  "r1bqkbnr1pp1ppppp73P41n1P42N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3/3...a6/4. exd5/4... Nb4",
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3/3...a6/4. exd5/4...Nb4"
  ],
  "r1bqkbnr1pp1ppppp73P41nBP42N5PPP2PPPR1BQK1NRb": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3/3...a6/4. exd5/4...Nb4/5. Bc4"
  ],
  "r1bqkb1r1pp1ppppp4n23P41nBP42N5PPP2PPPR1BQK1NRw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3/3...a6/4. exd5/4...Nb4/5. Bc4/5...Nf6"
  ],
  "r1bqkbnrppp1pppp2n583Pp32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3/3...dxe4"
  ],
  "r1bqkbnrppp1pppp2n53P44p32N5PPP2PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3/3...dxe4/4. d5"
  ],
  "r1bqkbnrppp1pppp83Pn34p32N5PPP2PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...d5/3. Nc3/3...dxe4/4. d5/4...Ne5"
  ],
  "r1bqkbnrpppp1ppp2n54p33PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...e5"
  ],
  "r1bqkbnrpppp1ppp2n1p383PP38PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. d4/2...e6"
  ],
  "r1bqkbnrpppppppp2n584P32N5PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nc6/2. Nc3"
  ],
  "r1bqkbnrpppppppp2n584P35N2PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...Nc6/2. Nf3"
  ],
  "r1bqkbnrppp1pppp2np484P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. Nf3/2...d6"
  ],
  "r1bqkbnrppppp1pp2n55p24P35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...Nc6/2. Nf3/2...f5"
  ],
  "rnbqkb1rpppppppp5n284P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6"
  ],
  "rnbqkb1rpppppppp5n282B1P38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4"
  ],
  "rnbqkb1rpppppppp882B1n38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4"
  ],
  "rnbqkb1rpppppBpp884n38PPPP1PPPRNBQK1NRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7"
  ],
  "rnbq1b1rpppppkpp884n38PPPP1PPPRNBQK1NRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7"
  ],
  "rnbq1b1rpppppkpp87Q4n38PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5"
  ],
  "rnbq1b1rpppppk1p6p17Q4n38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5/4...g6"
  ],
  "rnbq1b1rpppppk1p6p13Q44n38PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5/4...g6/5. Qd5"
  ],
  "rnbq1b1rppppp1pp4k37Q4n38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5/4...Ke6"
  ],
  "rnbq1b1rppppp1pp4k384n1Q18PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5/4...Ke6/5. Qg4"
  ],
  "rnbq1b1rppppp1pp5k27Q4n38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5/4...Kf6"
  ],
  "rnbq1b1rppppp1pp5k284n35Q2PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5/4...Kf6/5. Qf3"
  ],
  "rnbq1bkrppppp1pp87Q4n38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5/4...Kg8"
  ],
  "rnbq1bkrppppp1pp83Q44n38PPPP1PPPRNB1K1NRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5/4...Kg8/5. Qd5"
  ],
  "rnbq1bkrpppp2pp4p33Q44n38PPPP1PPPRNB1K1NRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Bc4/2...Nxe4/3. Bxf7/3...Kxf7/4. Qh5/4...Kg8/5. Qd5/5...e6"
  ],
  "rnbqkb1rpppppppp5n284P33P4PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. d3"
  ],
  "rnbqkb1rpppppppp5n24P388PPPP1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5"
  ],
  "rnbqkb1rpppppppp83nP388PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5"
  ],
  "rnbqkb1rpppppppp83nP32P58PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. c4"
  ],
  "rnbqkb1rpppppppp1n64P32P58PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. c4/3...Nb6"
  ],
  "rnbqkb1rpppppppp1n62P1P388PP1P1PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. c4/3...Nb6/4. c5"
  ],
  "rnbqkb1rpppppppp82PnP388PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. c4/3...Nb6/4. c5/4...Nd5"
  ],
  "rnbqkb1rpppppppp1n64P32PP48PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. c4/3...Nb6/4. d4"
  ],
  "rnbqkb1rpppppppp84P32P2n28PP1P1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. c4/3...Nf4"
  ],
  "rnbqkb1rpppppppp83nP33P48PPP2PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4"
  ],
  "rnbqkb1rppp1pppp3p43nP33P48PPP2PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6"
  ],
  "rnbqkb1rppp1pppp3p43nP32PP48PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4"
  ],
  "rnbqkb1rppp1pppp1n1p44P32PP48PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6"
  ],
  "rnbqkb1rppp1pppp1n1P482PP48PP3PPPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. exd6"
  ],
  "rnbqkb1rpp2pppp1n1p482PP48PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. exd6/5...cxd6"
  ],
  "rnbqkb1rpp2pppp1n1p482PP42N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. exd6/5...cxd6/6. Nc3"
  ],
  "rnbqkb1rppp2ppp1n1p482PP48PP3PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. exd6/5...exd6"
  ],
  "rnbqkb1rppp2ppp1n1p482PP42N5PP3PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. exd6/5...exd6/6. Nc3"
  ],
  "rnbqkb1rppp1pppp1n1p44P32PP1P28PP4PPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. f4"
  ],
  "rnbqkb1rppp1pppp1n64p32PP1P28PP4PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. f4/5...dxe5"
  ],
  "rnbqkb1rppp1pppp1n64P32PP48PP4PPRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. f4/5...dxe5/6. fxe5"
  ],
  "r1bqkb1rppp1pppp1nn54P32PP48PP4PPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. f4/5...dxe5/6. fxe5/6...Nc6"
  ],
  "r1bqkb1rppp1pppp1nn54P32PP44B3PP4PPRN1QKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. c4/4...Nb6/5. f4/5...dxe5/6. fxe5/6...Nc6/7. Be3"
  ],
  "rnbqkb1rppp1pppp3p43nP33P45N2PPP2PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. Nf3"
  ],
  "rn1qkb1rppp1pppp3p43nP33P2b15N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. Nf3/4...Bg4"
  ],
  "rnbqkb1rppp1pp1p3p2p13nP33P45N2PPP2PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. d4/3...d6/4. Nf3/4...g6"
  ],
  "rnbqkb1rpppppppp83nP386P1PPPP1P1PRNBQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. e5/2...Nd5/3. g3"
  ],
  "rnbqkb1rpppppppp5n284P32N5PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Nc3"
  ],
  "rnbqkb1rppp1pppp5n23p44P32N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Nc3/2...d5"
  ],
  "rnbqkb1rppp1pppp5n23pP382N5PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Nc3/2...d5/3. e5"
  ],
  "rnbqkb1rpppnpppp83pP382N5PPPP1PPPR1BQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Nc3/2...d5/3. e5/3...Nfd7"
  ],
  "rnbqkb1rpppnpppp4P33p482N5PPPP1PPPR1BQKBNRb": [
    "Chess Opening Theory/1. e4/1...Nf6/2. Nc3/2...d5/3. e5/3...Nfd7/4. e6"
  ],
  "rnbqkb1rpppppppp7n84P38PPPP1PPPRNBQKBNRw": [
    "Chess Opening Theory/1. e4/1...Nh6"
  ],
  "rnbqkbnrpppppppp8885P2PPPPP1PPRNBQKBNRb": [
    "Chess Opening Theory/1. f3"
  ],
  "rnbqkbnrpppp1ppp84p385P2PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f3/1...e5"
  ],
  "rnbqkbnrpppp1ppp84p36P15P2PPPPP2PRNBQKBNRb": [
    "Chess Opening Theory/1. f3/1...e5/2. g4"
  ],
  "rnb1kbnrpppp1ppp84p36Pq5P2PPPPP2PRNBQKBNRw": [
    "Chess Opening Theory/1. f3/1...e5/2. g4/2...Qh4",
    "Chess Opening Theory/1. g4/1...e5/2. f3/2...Qh4"
  ],
  "rnbqkbnrpppp1ppp84p385P2PPPPPKPPRNBQ1BNRb": [
    "Chess Opening Theory/1. f3/1...e5/2. Kf2"
  ],
  "rnbqkbnrpppppppp885P28PPPPP1PPRNBQKBNRb": [
    "Chess Opening Theory/1. f4"
  ],
  "rnbqkbnrppp1pppp83p45P28PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...d5"
  ],
  "rnbqkbnrppp1pppp83p45PP18PPPPP2PRNBQKBNRb": [
    "Chess Opening Theory/1. f4/1...d5/2. g4"
  ],
  "rnbqkbnrpppp1ppp84p35P28PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...e5"
  ],
  "rnbqkbnrpppp1ppp84P388PPPPP1PPRNBQKBNRb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5"
  ],
  "rnbqkbnrppp2ppp3p44P388PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6"
  ],
  "rnbqkbnrppp2ppp3P4888PPPPP1PPRNBQKBNRb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6"
  ],
  "rnbqk1nrppp2ppp3b4888PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6/3...Bxd6"
  ],
  "rnbqk1nrppp2ppp3b487P8PPPPP1P1RNBQKBNRb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6/3...Bxd6/4. h4"
  ],
  "rnbqk1nrppp2ppp887P6b1PPPPP1P1RNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6/3...Bxd6/4. h4/4...Bg3"
  ],
  "rnbqk1nrppp2ppp3b4885N2PPPPP1PPRNBQKB1Rb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6/3...Bxd6/4. Nf3"
  ],
  "rnbqk1nrppp2p1p3b46p185N2PPPPP1PPRNBQKB1Rw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6/3...Bxd6/4. Nf3/4...g5"
  ],
  "rnbqk1nrppp2p1p3b46p185NP1PPPPP2PRNBQKB1Rb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6/3...Bxd6/4. Nf3/4...g5/5. g3"
  ],
  "rnbqk1nrppp2p1p3b46p185N1PPPPPP1P1RNBQKB1Rb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6/3...Bxd6/4. Nf3/4...g5/5. h3"
  ],
  "rnbqk1nrppp2p1p86p185NbPPPPPP1P1RNBQKB1Rw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6/3...Bxd6/4. Nf3/4...g5/5. h3/5...Bg3"
  ],
  "rnbqkb1rppp2ppp3P1n2888PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. exd6/3...Nf6"
  ],
  "rnbqkbnrppp2ppp3p44P385N2PPPPP1PPRNBQKB1Rb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. Nf3"
  ],
  "rnbqkbnrppp2ppp84p385N2PPPPP1PPRNBQKB1Rw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. Nf3/3...dxe5"
  ],
  "rnbqkbnrppp2ppp84N388PPPPP1PPRNBQKB1Rb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. Nf3/3...dxe5/4. Nxe5"
  ],
  "rnbqk1nrppp2ppp3b44N388PPPPP1PPRNBQKB1Rw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...d6/3. Nf3/3...dxe5/4. Nxe5/4...Bd6"
  ],
  "r1bqkbnrpppp1ppp2n54P388PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...Nc6"
  ],
  "r1bqkbnrpppp1ppp2n54P33P48PPP1P1PPRNBQKBNRb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...Nc6/3. d4"
  ],
  "r1b1kbnrpppp1ppp2n54P33P3q8PPP1P1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...Nc6/3. d4/3...Qh4"
  ],
  "r1b1kbnrpppp1ppp2n54P33P3q6P1PPP1P2PRNBQKBNRb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...Nc6/3. d4/3...Qh4/4. g3"
  ],
  "r1bqkbnrpppp1ppp2n54P385N2PPPPP1PPRNBQKB1Rb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...Nc6/3. Nf3"
  ],
  "r1bqkbnrpppp1p1p2n54P1p185N2PPPPP1PPRNBQKB1Rw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...Nc6/3. Nf3/3...g5"
  ],
  "r1bqkbnrpppp1p1p2n54P1p13P45N2PPP1P1PPRNBQKB1Rb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...Nc6/3. Nf3/3...g5/4. d4"
  ],
  "r1bqkbnrpppp1p1p2n54P33P2p15N2PPP1P1PPRNBQKB1Rw": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...Nc6/3. Nf3/3...g5/4. d4/4...g4"
  ],
  "r1bqkbnrpppp1p1p2n54P1N13P2p18PPP1P1PPRNBQKB1Rb": [
    "Chess Opening Theory/1. f4/1...e5/2. fxe5/2...Nc6/3. Nf3/3...g5/4. d4/4...g4/5. Ng5"
  ],
  "rnbqkbnrpppp1ppp84p35PP18PPPPP2PRNBQKBNRb": [
    "Chess Opening Theory/1. f4/1...e5/2. g4"
  ],
  "rnb1kbnrpppp1ppp84p35PPq8PPPPP2PRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...e5/2. g4/2...Qh4"
  ],
  "rnbqkbnrpppp1ppp4p385P28PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...e6"
  ],
  "rnbqkbnrppppp1pp85p25P28PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...f5"
  ],
  "rnbqkb1rpppppppp7n85P28PPPPP1PPRNBQKBNRw": [
    "Chess Opening Theory/1. f4/1...Nh6"
  ],
  "rnbqkbnrpppppppp8886P1PPPPPP1PRNBQKBNRb": [
    "Chess Opening Theory/1. g3"
  ],
  "rnbqkbnrp1pppppp1p6886P1PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g3/1...b6"
  ],
  "rnbqkbnrp1pppppp1p6886P1PPPPPPBPRNBQK1NRb": [
    "Chess Opening Theory/1. g3/1...b6/2. Bg2"
  ],
  "rnbqkbnrppp1pppp83p486P1PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g3/1...d5"
  ],
  "rnbqkbnrpppp1ppp84p386P1PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g3/1...e5"
  ],
  "rnbqkbnrpppp1ppp84p386P1PPPPPPBPRNBQK1NRb": [
    "Chess Opening Theory/1. g3/1...e5/2. Bg2"
  ],
  "rnbqkbnrpppppp1p6p1886P1PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g3/1...g6"
  ],
  "rnbqkbnrppppppp187p86P1PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g3/1...h5"
  ],
  "rnbqkbnrppppppp187p85NP1PPPPPP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. g3/1...h5/2. Nf3"
  ],
  "rnbqkbnrppppppp1887p5NP1PPPPPP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. g3/1...h5/2. Nf3/2...h4"
  ],
  "rnbqkbnrppppppp1887N6P1PPPPPP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. g3/1...h5/2. Nf3/2...h4/3. Nxh4"
  ],
  "rnbqkbn1ppppppp1887r6P1PPPPPP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. g3/1...h5/2. Nf3/2...h4/3. Nxh4/3...Rxh4"
  ],
  "rnbqkb1rpppppppp5n2886P1PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g3/1...Nf6"
  ],
  "rnbqkbnrpppppppp886P18PPPPPP1PRNBQKBNRb": [
    "Chess Opening Theory/1. g4"
  ],
  "rnbqkbnrp1pppppp81p66P18PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...b5"
  ],
  "rnbqkbnrppp1pppp83p46P18PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...d5"
  ],
  "rnbqkbnrppp1pppp3p486P18PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...d6"
  ],
  "rnbqkbnrpppp1ppp84p36P18PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...e5"
  ],
  "rnbqkbnrpppp1ppp84p36P13P4PPP1PP1PRNBQKBNRb": [
    "Chess Opening Theory/1. g4/1...e5/2. d3"
  ],
  "rnbqkbnrppppp1pp85p26P18PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...f5"
  ],
  "rnbqkbnrpppppp1p86p16P18PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...g5"
  ],
  "rnbqkbnrpppppp1p86p15PP18PPPPP2PRNBQKBNRb": [
    "Chess Opening Theory/1. g4/1...g5/2. f4"
  ],
  "rnbqkbnrppppp2p85pp15PP18PPPPP2PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...g5/2. f4/2...f5"
  ],
  "rnbqkbnrppppp2p85pp14PPP18PPPP3PRNBQKBNRb": [
    "Chess Opening Theory/1. g4/1...g5/2. f4/2...f5/3. e4"
  ],
  "rnbqkbnrpppp3p84ppp14PPP18PPPP3PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...g5/2. f4/2...f5/3. e4/3...e5"
  ],
  "r1bqkbnrppppppppn786P18PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...Na6"
  ],
  "rnbqkb1rpppppppp5n286P18PPPPPP1PRNBQKBNRw": [
    "Chess Opening Theory/1. g4/1...Nf6"
  ],
  "rnbqkbnrpppppppp8887PPPPPPPP1RNBQKBNRb": [
    "Chess Opening Theory/1. h3"
  ],
  "rnbqkbnrpppp1ppp84p387PPPPPPPP1RNBQKBNRw": [
    "Chess Opening Theory/1. h3/1...e5"
  ],
  "rnbqkbnrppppppp187p87PPPPPPPP1RNBQKBNRw": [
    "Chess Opening Theory/1. h3/1...h5"
  ],
  "rnbqkbnrpppppppp887P8PPPPPPP1RNBQKBNRb": [
    "Chess Opening Theory/1. h4"
  ],
  "rnbqkbnr1ppppppp8p77P8PPPPPPP1RNBQKBNRw": [
    "Chess Opening Theory/1. h4/1...a5"
  ],
  "rnbqkbnrppp1pppp83p47P8PPPPPPP1RNBQKBNRw": [
    "Chess Opening Theory/1. h4/1...d5"
  ],
  "rnbqkbnrppp1pppp83p3P88PPPPPPP1RNBQKBNRb": [
    "Chess Opening Theory/1. h4/1...d5/2. h5"
  ],
  "rnbqkbnrppp2ppp83pp2P88PPPPPPP1RNBQKBNRw": [
    "Chess Opening Theory/1. h4/1...d5/2. h5/2...e5"
  ],
  "rnbqkbnrppp2ppp7P3pp388PPPPPPP1RNBQKBNRb": [
    "Chess Opening Theory/1. h4/1...d5/2. h5/2...e5/3. h6"
  ],
  "rnbqkbnrpppppppp888N7PPPPPPPPR1BQKBNRb": [
    "Chess Opening Theory/1. Na3"
  ],
  "rnbqkbnrpppppppp8882N5PPPPPPPPR1BQKBNRb": [
    "Chess Opening Theory/1. Nc3"
  ],
  "rnbqkbnrpp1ppppp82p582N5PPPPPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. Nc3/1...c5"
  ],
  "rnbqkbnrppp1pppp83p482N5PPPPPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. Nc3/1...d5"
  ],
  "rnbqkbnrpppp1ppp84p382N5PPPPPPPPR1BQKBNRw": [
    "Chess Opening Theory/1. Nc3/1...e5"
  ],
  "rnbqkbnrpppppppp8885N2PPPPPPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. Nf3"
  ],
  "rnbqkbnrpp1ppppp82p585N2PPPPPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...c5"
  ],
  "rnbqkbnrpp1ppppp82p585NP1PPPPPP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...c5/2. g3"
  ],
  "r1bqkbnrpp1ppppp2n52p585NP1PPPPPP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...c5/2. g3/2...Nc6"
  ],
  "r1bqkbnrpp1ppppp2n52p585NP1PPPPPPBPRNBQK2Rb": [
    "Chess Opening Theory/1. Nf3/1...c5/2. g3/2...Nc6/3. Bg2"
  ],
  "rnbqkbnrppp1pppp83p485N2PPPPPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...d5"
  ],
  "rnbqkbnrppp1pppp83p42P55N2PP1PPPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...d5/2. c4"
  ],
  "rnbqkbnrppp1pppp83p485NP1PPPPPP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...d5/2. g3"
  ],
  "rnbqkbnrpp2pppp82pp485NP1PPPPPP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...d5/2. g3/2...c5"
  ],
  "rnbqkbnrpp2pppp82pp485NP1PPPPPPBPRNBQK2Rb": [
    "Chess Opening Theory/1. Nf3/1...d5/2. g3/2...c5/3. Bg2"
  ],
  "r1bqkbnrpp2pppp2n52pp485NP1PPPPPPBPRNBQK2Rw": [
    "Chess Opening Theory/1. Nf3/1...d5/2. g3/2...c5/3. Bg2/3...Nc6"
  ],
  "r1bqkbnrpp2pppp2n52pp43P45NP1PPP1PPBPRNBQK2Rb": [
    "Chess Opening Theory/1. Nf3/1...d5/2. g3/2...c5/3. Bg2/3...Nc6/4. d4"
  ],
  "rnbqkbnrpp2pppp2p53p485NP1PPPPPP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...d5/2. g3/2...c6"
  ],
  "rnbqkbnrpppp1ppp84p385N2PPPPPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...e5"
  ],
  "rnbqkbnrppppp1pp85p285N2PPPPPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...f5"
  ],
  "rnbqkbnrppppp1pp85p24P35N2PPPP1PPPRNBQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...f5/2. e4"
  ],
  "rnbqkbnrppppp1pp884p35N2PPPP1PPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...f5/2. e4/2...fxe4"
  ],
  "rnbqkbnrppppp1pp85p285NP1PPPPPP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...f5/2. g3"
  ],
  "rnbqkbnrpppppp1p6p1885N2PPPPPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...g6"
  ],
  "rnbqkb1rpppppppp5n2885N2PPPPPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...Nf6"
  ],
  "rnbqkb1rpppppppp5n282P55N2PP1PPPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. c4"
  ],
  "rnbqkb1rp1pppppp1p3n282P55N2PP1PPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. c4/2...b6"
  ],
  "rnbqkb1rpp1p1ppp4pn22p52P52N2N2PP1PPPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. c4/2...c5/3. Nc3/3...e6"
  ],
  "rnbqkb1rpppp1ppp4pn282P55N2PP1PPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. c4/2...e6"
  ],
  "rnbqkb1rpppp1ppp4pn282P55NP1PP1PPP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. c4/2...e6/3. g3"
  ],
  "rnbqkb1rpppp1ppp4pn282P52N2N2PP1PPPPPR1BQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. c4/2...e6/3. Nc3"
  ],
  "rnbqkb1rppp2ppp4pn23p42P52N2N2PP1PPPPPR1BQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. c4/2...e6/3. Nc3/3...d5"
  ],
  "rnbqkb1rpppppp1p5np182P55N2PP1PPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. c4/2...g6"
  ],
  "rnbqkb1rpppppp1p5np182P52N2N2PP1PPPPPR1BQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. c4/2...g6/3. Nc3"
  ],
  "rnbqkb1rpppppppp5n2885NP1PPPPPP1PRNBQKB1Rb": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. g3"
  ],
  "rnbqkb1rppp1pppp5n23p485NP1PPPPPP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. g3/2...d5"
  ],
  "rnbqkb1rpppppp1p5np1885NP1PPPPPP1PRNBQKB1Rw": [
    "Chess Opening Theory/1. Nf3/1...Nf6/2. g3/2...g6"
  ],
  "rnbqkbnrpppppppp8887NPPPPPPPPRNBQKB1Rb": [
    "Chess Opening Theory/1. Nh3"
  ],
  "rnbqkbnrppp1pppp83p487NPPPPPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nh3/1...d5"
  ],
  "rnbqkbnrpppp1ppp84p387NPPPPPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nh3/1...e5"
  ],
  "rnbqkb1rpppppppp7n887NPPPPPPPPRNBQKB1Rw": [
    "Chess Opening Theory/1. Nh3/1...Nh6"
  ]
};
})();