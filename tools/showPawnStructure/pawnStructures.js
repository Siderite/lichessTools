(function () {

  LiChessTools.prototype.pawnStructures = {
    '2XXX1XXT': {
      name: 'Queen\'s Isolani',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Queen\'s_Gambit_%E2%80%93_Isolani_formation'
    },
    '2XXXX0TX': {
      name: 'Italian Isolani',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Giuoco_Piano_%E2%80%93_Isolani_formation'
    },
    '2X2X1XTT': {
      name: 'Hanging Pawns',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Hanging_pawns'
    },
    '21X2X0TM': {
      name: 'Carlsbad',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Carlsbad_formation'
    },
    '21X2X1TM': {
      name: 'Orthodox Exchange',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Carlsbad_formation'
    },
    'X22X21XX': {
      name: 'Rauzer Formation',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Rauzer_formation'
    },
    'X221X1TM': {
      name: 'Boleslavsky Wall',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Boleslavsky_Wall'
    },
    'X2011XMX': {
      name: 'Scheveningen',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Sicilian_%E2%80%93_Scheveningen'
    },
    'X2010XMX 000001': {
      name: 'Dragon',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Sicilian_%E2%80%93_Dragon'
    },
    'X2210XMX': {
      name: 'Mar\u00f3czi Bind',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Mar%C3%B3czy_Bind'
    },
    'X2201XMX': {
      name: 'Mar\u00f3czi Bind',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Mar%C3%B3czy_Bind'
    },
    'X2211XMX 000010': {
      name: 'Hedgehog',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Hedgehog'
    },
    'X2012XMX': {
      name: 'Boleslavsky Hole',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Boleslavsky_hole'
    },
    '322120XX': {
      name: 'd5 Chain',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#d5-chain'
    },
    '230210XX': {
      name: 'e5 Chain',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#e5-chain'
    },
    '2X321XMT': {
      name: 'Panov',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Panov_formation'
    },
    '200210XX 000200': {
      name: 'Stonewall',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Stonewall_formation'
    },
    '210210XX 200200': {
      name: 'Botvinnik',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Botvinnik_system'
    },
    '21XX11TX': {
      name: 'Slav',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Slav_formation'
    },
    '2X1X11MT': {
      name: 'Caro',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Caro_formation'
    },
    '32X1X2TM': {
      name: 'Modern Benoni',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Modern_Benoni_formation'
    },
    '120102XX': {
      name: 'Closed Sicilian',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Closed_Sicilian_formation'
    },
    '221X02TX 0X0000': {
      name: 'Gr\u00FCnfeld Center',
      url: 'https://herculeschess.com/grunfeld-defense/'
    },
    '3X012XMT': {
      name: 'Najdorf',
      url: 'https://thechessworld.com/articles/openings/beating-the-najdorf-common-middlegame-structures/'
    },
    '3X21X2XX': {
      name: 'Symmetric Benoni',
      url: 'https://thechessworld.com/articles/openings/closed-center-in-kid-and-benoni/'
    },
    '2X320XMT': {
      name: 'Panov',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Panov_formation'
    },
    '32X12XXX': {
      name: 'KID I',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#d5-chain'
    },
    '322122XX': {
      name: 'KID II',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#d5-chain'
    },
    'X221X0TM': {
      name: 'Open KID',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#Boleslavsky_Wall'
    },
    '222121XX': {
      name: 'KID Complex',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#d5-chain'
    },
    '2X0210XM': {
      name: 'French',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#e5-chain'
    },
    'X3121XMX': {
      name: 'French',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#e5-chain'
    },
    'XX1X1XMT': {
      name: '3-3 vs 4-2',
      url: 'https://en.wikipedia.org/wiki/Pawn_structure#e5-chain'
    },
    '32X102MX 0000X1 00X0': {
      name: 'Benko',
      url: 'http://www.chesscorner.com/tutorial/Intermediate/openingrep/benko/benko.htm'
    },
    '321123XX': {
      name: 'Closed Ruy Lopez',
      url: 'https://chess-structures.com/2015/04/23/chess-structures-in-practice-the-closed-ruy-lopez/'
    },
    '221122XX': {
      name: 'Lopez',
      url: 'https://chess-structures.com/2015/04/23/chess-structures-in-practice-the-closed-ruy-lopez/'
    },
    'X20X22XX': {
      name: 'Najdorf',
      url: 'https://thechessworld.com/articles/openings/beating-the-najdorf-common-middlegame-structures/'
    },
    'X2022XMX': {
      name: 'Najdorf',
      url: 'https://thechessworld.com/articles/openings/beating-the-najdorf-common-middlegame-structures/'
    }
  };

})();