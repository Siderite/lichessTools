(() => {

  // Euwe & Kramer pawn-formation taxonomy classifier.
  // Based on "The Middlegame, Book I: Static Features" (Euwe & Kramer), Part Two
  // "Center Formations" (ch. 6-8) and Part Three "Various Formations" (ch. 9-11).
  // Given a chessops board it classifies the pawn skeleton into the A.1-F.8 codes.
  //
  // The classification is structural (pawns only, like the rest of the chessmetrics
  // library). Distinctions that in the book depend on move availability or piece
  // placement (B/C "mobile" vs "latent", some E/F boundaries) are approximated and
  // flagged with a "best-effort" note.
  class EuweKramer {

    static get co() {
      return LiChessTools.chessopsModule || null;
    }

    static TAXONOMY = {
      'A.1': { name: 'Vanished centre', category: 'Symmetrical Centre Formations' },
      'A.2': { name: 'The QP centre', category: 'Symmetrical Centre Formations' },
      'A.3': { name: 'The KP centre', category: 'Symmetrical Centre Formations' },
      'A.4': { name: 'Symmetrical four-pawns centre (KPs forward)', category: 'Symmetrical Centre Formations' },
      'A.5': { name: 'Symmetrical four-pawns centre (QPs forward)', category: 'Symmetrical Centre Formations' },
      'B.1': { name: 'Advanced fixed single-pawn (KP forward)', category: 'Positional advantage in the centre' },
      'B.2': { name: 'Advanced fixed single-pawn (QP forward)', category: 'Positional advantage in the centre' },
      'B.3': { name: 'Partially fixed centre (tension form)', category: 'Positional advantage in the centre' },
      'B.4': { name: 'Partially fixed centre (incomplete QP)', category: 'Positional advantage in the centre' },
      'B.5': { name: 'Partially fixed centre (French, White d-pawn backward)', category: 'Positional advantage in the centre' },
      'B.6': { name: 'Partially fixed centre (French, Black d-pawn backward)', category: 'Positional advantage in the centre' },
      'B.7': { name: 'Mobile centre (KP)', category: 'Positional advantage in the centre' },
      'B.8': { name: 'Mobile centre (QP)', category: 'Positional advantage in the centre' },
      'C.1': { name: 'Absolute centre', category: 'Extra central pawns' },
      'C.2': { name: 'Hanging centre', category: 'Extra central pawns' },
      'C.3': { name: 'Classic centre', category: 'Extra central pawns' },
      'C.4': { name: 'Neo-Classic centre', category: 'Extra central pawns' },
      'C.5': { name: 'Neo-Classic centre (with open file)', category: 'Extra central pawns' },
      'C.6': { name: 'Unbalanced tension form', category: 'Extra central pawns' },
      'C.7': { name: 'Latent central majority (QP in reserve)', category: 'Extra central pawns' },
      'C.8': { name: 'Latent central majority (KP in reserve)', category: 'Extra central pawns' },
      'D.1': { name: 'Blocked oblique (QP forward)', category: 'Closed formations' },
      'D.2': { name: 'Blocked oblique (KP forward)', category: 'Closed formations' },
      'D.3': { name: 'Stonewall', category: 'Closed formations' },
      'D.4': { name: 'Anti-Stonewall', category: 'Closed formations' },
      'D.5': { name: 'Pseudo-Stonewall', category: 'Closed formations' },
      'D.6': { name: 'Wyvill formation', category: 'Closed formations' },
      'D.8': { name: 'Winawer formation', category: 'Closed formations' },
      'E.1': { name: 'Ruy Lopez formation', category: 'Open formations' },
      'E.2': { name: 'French/Caro formation', category: 'Open formations' },
      'E.3': { name: 'Sicilian formation', category: 'Open formations' },
      'E.4': { name: 'Rival majorities (open file between)', category: 'Open formations' },
      'E.5': { name: 'Rival majorities (no open file between)', category: 'Open formations' },
      'F.1': { name: 'Half-open, symmetrical', category: 'Half-open formations' },
      'F.2': { name: 'Half-open, focus formation', category: 'Half-open formations' },
      'F.3': { name: 'Half-open, blocked oblique', category: 'Half-open formations' },
      'F.4': { name: 'Half-open, French', category: 'Half-open formations' },
      'F.5': { name: 'Caro-Kann / QGD Exchange', category: 'Half-open formations' },
      'F.6': { name: 'Passed pawn, protected but blockaded', category: 'Half-open formations' },
      'F.7': { name: 'Isolated queen\'s pawn', category: 'Half-open formations' },
      'F.8': { name: 'Hanging pawns', category: 'Half-open formations' },
    };

    // Pawn ranks per file (0=rank1 .. 7=rank8, or -1) plus doubled flags, derived from
    // the centralized PawnStructure.getPawnSkeleton (single source of truth for pawn layout).
    static _ranks(board) {
      const s = LiChessTools.PawnStructure.getPawnSkeleton(board);
      if (!s) return null;
      const w = new Array(8).fill(-1);
      const b = new Array(8).fill(-1);
      for (let f = 0; f < 8; f++) {
        if (s.pawns.w[f] > -1) w[f] = s.pawns.w[f] + 1;   // advance -> rank
        if (s.pawns.b[f] > -1) b[f] = 6 - s.pawns.b[f];
      }
      return { w, b, wDoubled: s.led.w, bDoubled: s.led.b };
    }

    // Mirrors the key (swap the White/Black segments and flip each rank) for the
    // "Black has the advantage" pass.
    static _mirrorKey(key) {
      const flip = ch => ch === 'x' ? 'x' : String(7 - (+ch));
      const seg = s => [...s].map(flip).join('');
      return seg(key.slice(8, 16)) + seg(key.slice(0, 8));
    }

    static _result(code, note) {
      const info = EuweKramer.TAXONOMY[code];
      if (!info) return null;
      return { code, name: info.name, category: info.category, note: note || null };
    }

    // Serialize the White + Black rank arrays into a single 16-char key so each
    // formation can be matched by a regular expression.
    //   positions 0-7  = White a-h, positions 8-15 = Black a-h
    //   'x' = no pawn, '0'-'7' = rank (0 = rank 1 .. 7 = rank 8)
    //   '.' = any, '\d' = any pawn present, '[34]' = rank 3 or 4 (d4/d5, e4/e5)
    static _key(w, b) {
      let s = '';
      for (let f = 0; f < 8; f++) s += w[f] === -1 ? 'x' : String(w[f]);
      for (let f = 0; f < 8; f++) s += b[f] === -1 ? 'x' : String(b[f]);
      return s;
    }

    // Central pawn count (c, d, e, f files) for each side.
    static _centrality(key) {
      const isPawn = ch => ch !== 'x';
      return {
        white: [key[2], key[3], key[4], key[5]].filter(isPawn).length,
        black: [key[10], key[11], key[12], key[13]].filter(isPawn).length
      };
    }

    // Whether the d-file is open for both sides (the "open file between" rival majorities).
    static _isOpenCentre(key) {
      return key[3] === 'x' && key[11] === 'x';
    }

    // Queenside / kingside pawn counts per side (for rival majorities).
    static _flankPawns(key) {
      const isPawn = ch => ch !== 'x';
      const count = (from, to) => key.slice(from, to).split('').filter(isPawn).length;
      return {
        white: { queen: count(0, 4), king: count(4, 8) },
        black: { queen: count(8, 12), king: count(12, 16) }
      };
    }

    // D.6 Wyvill / D.8 Winawer: doubled c-pawns with a locked centre (needs the doubled flag).
    static _doubledFormation(key, wDoubled) {
      if (!wDoubled[2]) return null;
      if (key[3] === '4') return EuweKramer._result('D.6', 'best-effort');                 // Wyvill: d5
      if (key[4] === '4' && key[11] === '4' && key[12] === '5') return EuweKramer._result('D.8', 'best-effort'); // Winawer: e5 vs d5+e6
      return null;
    }

    // Shape formations matched directly against the key (no pawn counting needed).
    static SHAPE_RULES = [
      // A. Symmetrical centre formations
      ['A.1', /^...xx......xx...$/],              // vanished centre
      ['A.2', /^...3x......4x...$/],              // QP centre (d4 vs d5, e-pawns gone)
      ['A.3', /^..1x3.....6x4...$/],              // KP centre (e4 vs e5, d-pawns gone, c-pawns home)
      ['A.4', /^..[^3]23......54...$/],           // four pawns, KPs forward (d3+e4 vs d6+e5, no c4)
      ['A.5', /^..132[^3].....45...$/],          // four pawns, QPs forward (d4+e3 vs d5+e6, c-pawn home, no f4)
      // D. Closed formations
      ['D.1', /^..143.....654...$/],              // blocked oblique, QP forward (c2+d5+e4 vs c7+d6+e5)
      ['D.2', /^..\d34.....\d45...$/],            // blocked oblique, KP forward (d4+e5 vs d5+e6, c-pawns present)
      ['D.3', /^..332[^3]....5454..$/],           // stonewall (c4+d4+e3 vs c6+d5+e6+f5)
      ['D.4', /^..3323....5454..$/],              // anti-stonewall (c4+d4+e3+f4 vs c6+d5+e6+f5)
      ['D.5', /^..323.....666...$/],              // pseudo-stonewall, Botvinnik (c4+d3+e4 vs ...c7/d7/e7)
      // E. Open formations
      ['E.1', /^...x3......5x...$/],              // Ruy Lopez (e4 vs d6, open d-file)
      ['E.2', /^..13x.....6x5...$/],              // French/Caro (d4 vs e6, open d-file, c-pawns home)
      ['E.3', /^...x3.....x66...$/],              // Sicilian (e4 vs d7+e7, open c-file)
      // F. Half-open formations
      ['F.1', /^..x32.....x45...$/],              // half-open symmetrical (d4+e3 vs d5+e6, open c-file)
      ['F.2', /^..2x3.....4x4...$/],              // half-open focus formation (c3+e4 vs c5+e5, open d-file)
      ['F.3', /^..x34.....x45...$/],              // half-open blocked oblique (d4+e5 vs d5+e6, open c-file)
      ['F.4', /^..1x4.....x45...$/],              // half-open French (e5 vs d5+e6, open c-file)
      ['F.5', /^..23x.....x46...$/],              // Caro-Kann / QGD Exchange (c3+d4 vs d5, open c-file)
      ['F.6', /^..x43.....4x4...$/],              // passed pawn protected but blockaded (d5+e4 vs c5+e5, knight blockades d6)
      ['F.7', /^..x3x......x....$/],              // isolated queen's pawn (d4)
      ['F.8', /^.x33x.....xx....$/],              // hanging pawns (c4+d4)
    ];

    // Positional (B) and material (C) preponderance, matched directly against the key.
    static ADVANTAGE_RULES = [
      ['B.1', /^...x4......x5...$/],              // advanced fixed single-pawn, KP forward (e5 vs e6)
      ['B.2', /^...4x......5x...$/],              // advanced fixed single-pawn, QP forward (d5 vs d6)
      ['B.3', /^...33......54...$/],              // partially fixed centre, tension form (d4+e4 vs d6+e5)
      ['B.4', /^...43......56...$/],              // partially fixed centre, Benoni (d5+e4 vs d6+e7)
      ['B.5', /^...24......45...$/],              // partially fixed centre, French (d3+e5 vs d5+e6)
      ['B.6', /^...34......65...$/],              // partially fixed centre, French (d4+e5 vs d7+e6)
      ['B.7', /^...x3......x5...$/],              // mobile centre, KP (e4 vs e6, d open)
      ['B.8', /^...3x......5x...$/],              // mobile centre, QP (d4 vs d6, e open)
      ['C.1', /^...\d\d......xx...$/],            // absolute centre (two central pawns vs none)
      ['C.2', /^...xx......45...$/],              // hanging centre (d5+e6 vs none)
      ['C.3', /^...33......5x...$/],              // classic centre (d4+e4 vs d6)
      ['C.4', /^...33.....5x5...$/],              // neo-classic centre (d4+e4 vs c6+e6)
      ['C.5', /^...33.....xx5...$/],              // neo-classic centre with open file (d4+e4 vs e6)
      ['C.6', /^...33.....5x4...$/],              // unbalanced tension (d4+e4 vs c6+e5)
      ['C.7', /^...23......x4...$/],              // latent central majority, QP in reserve (d3+e4 vs e5)
      ['C.8', /^...32......4x...$/],              // latent central majority, KP in reserve (d4+e3 vs d5)
    ];

    // Classify assuming "me" = the White segment of the key (the book's White POV).
    // Collects the matching formation (and its specific sub-formations) in priority order.
    static _classifyPov(key, wDoubled, bDoubled) {
      const matches = [];
      let symmetric = false;

      const doubled = EuweKramer._doubledFormation(key, wDoubled);
      if (doubled) matches.push(doubled);

      for (const [code, re] of EuweKramer.SHAPE_RULES) {
        if (doubled && (code === 'D.1' || code === 'D.2')) continue; // D.6/D.8 are doubled-c refinements of D.1/D.2
        if (re.test(key)) {
          matches.push(EuweKramer._result(code));
          if (code.startsWith('A.')) symmetric = true;
        }
      }

      // B vs C preponderance applies to non-symmetric centres.
      if (!symmetric) {
        for (const [code, re] of EuweKramer.ADVANTAGE_RULES) {
          if (re.test(key)) {
            matches.push(EuweKramer._result(code, 'best-effort'));
            break;
          }
        }
      }

      // Rival majorities is a fallback: only when no specific formation matched.
      if (!matches.length) {
        const { white: central, black: oppCentral } = EuweKramer._centrality(key);
        if (central === oppCentral && EuweKramer._hasRivalMajorities(key)) {
          matches.push(EuweKramer._result(EuweKramer._isOpenCentre(key) ? 'E.4' : 'E.5', 'best-effort'));
        }
      }

      return matches;
    }

    static _hasRivalMajorities(key) {
      const { white, black } = EuweKramer._flankPawns(key);
      // White has more on one wing, Black more on the other.
      return (white.queen > black.queen && white.king < black.king) ||
             (white.queen < black.queen && white.king > black.king);
    }

    // Public: classify a chessops board from White's point of view, falling back to
    // the mirrored (Black's) point of view for the "advantage" categories (B/C/D/E).
    // Returns the winning formation plus an array of every formation that matches.
    static classify(board) {
      if (!board) return null;
      const p = EuweKramer._ranks(board);
      if (!p) return null;
      const key = EuweKramer._key(p.w, p.b);

      let matches = EuweKramer._classifyPov(key, p.wDoubled, p.bDoubled)
        .map(m => ({ ...m, side: 'white' }));
      if (!matches.length) {
        matches = EuweKramer._classifyPov(EuweKramer._mirrorKey(key), p.bDoubled, p.wDoubled)
          .map(m => ({ ...m, side: 'black' }));
      }
      if (!matches.length) return null;

      return { ...matches[0], matches };
    }

    // Convenience: classify directly from a FEN string.
    static classifyFen(fen) {
      const board = LiChessTools.MoveGen.boardFromFen(fen);
      if (!board) return null;
      return EuweKramer.classify(board);
    }
  }

  LiChessTools.EuweKramer = EuweKramer;
})();


