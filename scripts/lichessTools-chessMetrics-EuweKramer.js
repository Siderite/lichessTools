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

    // Whether the d- and e-files are open for both sides.
    static _isOpenCentre(key) {
      return key[3] === 'x' && key[4] === 'x' && key[11] === 'x' && key[12] === 'x';
    }

    // Whether "me" (the White segment) still has a d- or e-pawn.
    static _hasCentrePawn(key) {
      return key[3] !== 'x' || key[4] !== 'x';
    }

    // Queenside / kingside pawn counts per side (for rival majorities).
    static _flankPawns(key) {
      const isPawn = ch => ch !== 'x';
      const count = (from, to) => key.slice(from, to).split('').filter(isPawn).length;
      return {
        white: { queen: count(0, 3), king: count(5, 8) },
        black: { queen: count(8, 11), king: count(13, 16) }
      };
    }

    // D.6 Wyvill / D.8 Winawer: doubled c-pawns with a locked centre (needs the doubled flag).
    static _doubledFormation(key, wDoubled) {
      if (!wDoubled[2]) return null;
      if (key[3] === '4') return EuweKramer._result('D.6', 'best-effort');
      if (key[4] === '4' && key[11] === '4' && key[12] === '5' && key[10] === '4') return EuweKramer._result('D.8', 'best-effort');
      return null;
    }

    // Shape formations matched directly against the key (no pawn counting needed).
    static SHAPE_RULES = [
      ['A.1', /^...xx......xx...$/],              // vanished centre
      ['A.2', /^...[34]x......[34]x...$/],        // QP centre (d4/d5, e-pawns gone)
      ['A.3', /^...x[34]......x[34]...$/],        // KP centre (e4/e5, d-pawns gone)
      ['A.4', /^..1[25][34]1....6[25][34]6..$/],  // four pawns, KPs forward
      ['A.5', /^..1[34][25]1....6[34][25]6..$/],  // four pawns, QPs forward
      ['D.1', /^...43......54...$/],              // blocked oblique, QP forward (d5 lock)
      ['D.2', /^...34......45...$/],              // blocked oblique, KP forward (French)
      ['D.5', /^..323.....454...$/],              // pseudo-stonewall (c4+d3+e4)
      ['D.3', /^...323.....4.[^4]..$/],           // stonewall (d4+e3+f4)
      ['D.4', /^...323.....4.4..$/],              // anti-stonewall (f4 vs f5)
      ['F.7', /^..x3x......x....$/],              // isolated queen's pawn (d4)
      ['F.8', /^.x33x.....xx....$/],              // hanging pawns (c4+d4)
      ['E.3', /^...x3.....45x...$/],              // Sicilian formation
      ['E.1', /^...x3.....65x...$/],              // Ruy Lopez formation
      ['E.2', /^...3x......x5...$/],              // French/Caro formation
      ['F.5', /^...3[12]......4x...$/],           // Caro-Kann / QGD Exchange
    ];

    // Positional preponderance (B) — only when central pawn counts are equal.
    static B_RULES = [
      ['B.1', /^...x4......xx...$/],              // advanced fixed single-pawn, KP forward
      ['B.2', /^...4x......xx...$/],              // advanced fixed single-pawn, QP forward
      ['B.3', /^...33......54...$/],              // partially fixed centre (tension form)
      ['B.4', /^..33x......5x...$/],              // partially fixed centre (incomplete QP)
    ];

    // Material preponderance (C) — only when "me" has MORE central pawns.
    static C_RULES = [
      ['C.1', /^...\d\d......xx...$/],            // absolute centre (two vs none)
      ['C.2', /^...34......x....$/],              // hanging centre (d4+e5)
      ['C.3', /^...33......5x...$/],              // classic centre (d4+e4 vs d6)
      ['C.8', /^...32...........$/],              // latent central majority, KP in reserve
      ['C.7', /^...23...........$/],              // latent central majority, QP in reserve
    ];

    // Classify assuming "me" = the White segment of the key (the book's White POV).
    // Collects every formation that matches, in priority order.
    static _classifyPov(key, wDoubled, bDoubled) {
      const matches = [];
      let symmetric = false;

      for (const [code, re] of EuweKramer.SHAPE_RULES) {
        if (re.test(key)) {
          matches.push(EuweKramer._result(code));
          if (code.startsWith('A.')) symmetric = true;
        }
      }

      const doubled = EuweKramer._doubledFormation(key, wDoubled);
      if (doubled) matches.push(doubled);

      // B vs C preponderance applies to non-symmetric centres (a pawn-count split).
      if (!symmetric) {
        const { white: central, black: oppCentral } = EuweKramer._centrality(key);
        const preponderance = EuweKramer._preponderance(key, central, oppCentral);
        if (preponderance) matches.push(preponderance);

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

    // The B/C preponderance category: the specific sub-code when recognised, otherwise
    // the coarse category. Returns null when the centre is symmetric or unbalanced toward
    // the opponent (the mirror pass then handles it).
    static _preponderance(key, central, oppCentral) {
      if (central > oppCentral) {
        for (const [code, re] of EuweKramer.C_RULES) {
          if (re.test(key)) return EuweKramer._result(code, 'best-effort');
        }
        return { code: 'C', name: 'Extra central pawns (unspecified)', category: 'Extra central pawns', note: 'best-effort' };
      }
      if (central === oppCentral && EuweKramer._hasCentrePawn(key)) {
        for (const [code, re] of EuweKramer.B_RULES) {
          if (re.test(key)) return EuweKramer._result(code);
        }
        return { code: 'B', name: 'Positional advantage in the centre (unspecified)', category: 'Positional advantage in the centre', note: 'best-effort' };
      }
      return null;
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


