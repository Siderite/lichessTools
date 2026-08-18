(() => {
  class RepertoireTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['ChessOps', 'EmitRedraw'];

    preferences = [
      {
        name: 'repertoireWhite',
        category: 'analysis',
        type: 'file',
        fileDescription: 'PGN files',
        fileExtension: '.pgn',
        defaultValue: '',
        advanced: true,
        offValue: '',
        author: 'sahinakkaya'
      },
      {
        name: 'repertoireBlack',
        category: 'analysis',
        type: 'file',
        fileDescription: 'PGN files',
        fileExtension: '.pgn',
        defaultValue: '',
        advanced: true,
        offValue: '',
        author: 'sahinakkaya'
      },
      {
        name: 'repertoireDisplay',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['matches', 'deviations', 'arrows'],
        defaultValue: 'matches',
        offValue: false,
        advanced: true,
        author: 'sahinakkaya'
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.repertoireWhite': 'White repertoire PGN',
        'options.repertoireBlack': 'Black repertoire PGN',
        'options.repertoireDisplay': 'Repertoire display',
        'repertoireDisplay.matches': 'Mark moves in repertoire',
        'repertoireDisplay.deviations': 'Mark deviations from repertoire',
        'repertoireDisplay.arrows': 'Show repertoire arrows after deviation',
        'repertoireMoveTitle': 'LiChess Tools - move in your %s repertoire',
        'repertoireOwnDeviationTitle': 'LiChess Tools - you left your repertoire. Prepared: %s',
        'repertoireOpponentDeviationTitle': 'LiChess Tools - opponent left your repertoire. Prepared replies: %s',
        'repertoireEndTitle': 'LiChess Tools - end of your %s repertoire',
        'repertoireReadError': 'Could not read the %s repertoire PGN',
        'repertoireParseError': 'Could not parse the %s repertoire PGN',
        'repertoireColor.white': 'White',
        'repertoireColor.black': 'Black'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.repertoireWhite': 'Repertoriu PGN cu albele',
        'options.repertoireBlack': 'Repertoriu PGN cu negrele',
        'options.repertoireDisplay': 'Afi\u015fare repertoriu',
        'repertoireDisplay.matches': 'Marcare mut\u0103ri din repertoriu',
        'repertoireDisplay.deviations': 'Marcare deviat\u0163i de la repertoriu',
        'repertoireDisplay.arrows': 'Afi\u15feaz\u0103 s\u0103ge\u0163i din repertoriu dup\u0103 abatere',
        'repertoireMoveTitle': 'LiChess Tools - mutare din repertoriul t\u0103u cu %s',
        'repertoireOwnDeviationTitle': 'LiChess Tools - ai ie\u015fit din repertoriu. Mut\u0103ri preg\u0103tite: %s',
        'repertoireOpponentDeviationTitle': 'LiChess Tools - adversarul a ie\u015fit din repertoriu. R\u0103spunsuri preg\u0103tite: %s',
        'repertoireEndTitle': 'LiChess Tools - sf\u00e2r\u015fitul repertoriului t\u0103u cu %s',
        'repertoireReadError': 'Nu am putut citi PGN-ul repertoriului cu %s',
        'repertoireParseError': 'Nu am putut interpreta PGN-ul repertoriului cu %s',
        'repertoireColor.white': 'albele',
        'repertoireColor.black': 'negrele'
      }
    };

    storageKey = color => `lichessTools/LT/repertoire${color == 'white' ? 'White' : 'Black'}-file`;

    getFile = async color => {
      const lt = this.lichessTools;
      const storedFile = await lt.storage.get(this.storageKey(color), { db: true, raw: true });
      if (!storedFile) return null;
      // The fallback input picker stores a File instead of a FileSystemFileHandle.
      if (!storedFile.getFile) return storedFile;
      const fileHandle = storedFile;
      if (fileHandle.queryPermission) {
        let permission = await fileHandle.queryPermission({ mode: 'read' });
        if (permission != 'granted' && lt.global.navigator?.userActivation?.hasBeenActive && fileHandle.requestPermission) {
          permission = await fileHandle.requestPermission({ mode: 'read' });
        }
        if (permission != 'granted') return null;
      }
      return await fileHandle.getFile();
    };

    buildRepertoire = async text => {
      const lt = this.lichessTools;
      const co = await lt.chessops();
      const { parsePgn, startingPosition } = co.pgn;
      const { makeFen } = co.fen;
      const { parseSan, makeSanAndPlay } = co.san;
      const games = parsePgn(text);
      const positions = new Set();
      const moves = new Map();

      const traverse = (position, node) => {
        const fen = lt.getPositionFromFen(makeFen(position.toSetup()), true);
        for (const child of node.children || []) {
          const next = position.clone();
          const move = parseSan(next, child.data.san);
          if (!move) {
            lt.global.console.warn('Invalid repertoire move', child.data.san);
            continue;
          }
          let uci = co.makeUci(move);
          if (child.data.san.startsWith('O-O')) {
            const rank = uci[1];
            uci = uci.slice(0, 2) + (child.data.san.startsWith('O-O-O') ? 'c' : 'g') + rank;
          }
          let repertoireMoves = moves.get(fen);
          if (!repertoireMoves) {
            repertoireMoves = new Map();
            moves.set(fen, repertoireMoves);
          }
          if (!repertoireMoves.has(uci)) {
            repertoireMoves.set(uci, { uci: uci, san: child.data.san });
          }
          makeSanAndPlay(next, move);
          positions.add(lt.getPositionFromFen(makeFen(next.toSetup()), true));
          traverse(next, child);
        }
      };

      for (const game of games) {
        if (!game.headers.get('FEN') && !game.moves?.children?.length) continue;
        try {
          const position = startingPosition(game.headers).unwrap();
          positions.add(lt.getPositionFromFen(makeFen(position.toSetup()), true));
          traverse(position, game.moves);
        } catch (e) {
          lt.global.console.warn('Invalid repertoire game', e);
        }
      }
      if (!positions.size) throw new Error('No valid repertoire positions found');
      return { positions: positions, moves: moves };
    };

    loadRepertoire = async color => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const selected = lt.currentOptions.getValue(color == 'white' ? 'repertoireWhite' : 'repertoireBlack');
      if (!selected) return null;
      let file;
      try {
        file = await this.getFile(color);
        if (!file) return null;
        return await this.buildRepertoire(await file.text());
      } catch (e) {
        lt.global.console.warn(`Could not load ${color} repertoire`, e);
        const key = file ? 'repertoireParseError' : 'repertoireReadError';
        lt.announce(trans.pluralSame(key, trans.noarg('repertoireColor.' + color)));
        return null;
      }
    };

    getPlayerColor = analysis => {
      const color = analysis.study
        ? analysis.study.data?.chapter?.setup?.orientation || analysis.getOrientation?.()
        : analysis.data?.player?.color || analysis.data?.orientation || analysis.getOrientation?.();
      return color == 'black' ? 'black' : 'white';
    };

    clearMarkers = () => {
      const $ = this.lichessTools.$;
      $('glyph.lichessTools-repertoire').remove();
      $('move.lichessTools-inRepertoire,move.lichessTools-repertoireOwnDeviation,move.lichessTools-repertoireOpponentDeviation,move.lichessTools-repertoireEnd')
        .removeClass('lichessTools-inRepertoire lichessTools-repertoireOwnDeviation lichessTools-repertoireOpponentDeviation lichessTools-repertoireEnd');
    };

    addMarker = (node, className, icon, title) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      // Use the freshly rebuilt map directly. getElementForNode can suppress
      // elements in inactive/collapsed lines based on an older visibility
      // calculation even though Lichess has rendered the move.
      const move = lt.elementCache.get(node.path) || lt.getElementForNode(node);
      if (!move) return;
      $(move)
        .addClass(className)
        .append($('<glyph class="lichessTools-repertoire">')
          .addClass(className)
          .attr('title', title)
          .text(icon));
    };

    getMoverColor = node => node.ply % 2 ? 'white' : 'black';

    getPreparedText = repertoireMoves => [...repertoireMoves.values()].map(move => move.san).join(', ');

    isOwnMutationNode = node => node?.nodeType == 1
      && node.matches?.('glyph.lichessTools-repertoire');

    handleMoveListMutation = mutations => {
      const hasExternalMutation = mutations.some(mutation =>
        [...mutation.addedNodes, ...mutation.removedNodes]
          .some(node => !this.isOwnMutationNode(node))
      );
      if (hasExternalMutation) this.markMovesDebounced();
    };

    clearArrows = () => {
      const lt = this.lichessTools;
      const chessground = lt.getChessground();
      const autoShapes = chessground?.state?.drawable?.autoShapes || [];
      const shapes = autoShapes.filter(shape => shape.source!='repertoire');
      if (shapes.length != autoShapes.length) chessground.setAutoShapes(shapes);
    };

    updateArrows = repertoire => {
      const lt = this.lichessTools;
      const analysis = lt.lichess?.analysis;
      const chessground = lt.getChessground();
      const autoShapes = chessground?.state?.drawable?.autoShapes || [];
      if (!analysis || !chessground) return;
      const shapes = autoShapes.filter(shape => shape.source!='repertoire');
      const node = analysis.node;
      const repertoireMoves = repertoire?.moves.get(lt.getPositionFromFen(node?.fen, true));
      const deviation = repertoire && node?.children?.find(child =>
        !repertoire.positions.has(lt.getPositionFromFen(child.fen, true))
        && !repertoireMoves?.has(child.uci)
      );
      if (deviation && repertoireMoves?.size) {
        for (const move of repertoireMoves.values()) {
          if (move.uci.includes('@')) continue;
          shapes.push({
            orig: move.uci.slice(0, 2),
            dest: move.uci.slice(2, 4),
            brush: 'blue',
            modifiers: { lineWidth: 8, hilite: '#ffff00' },
            source: 'repertoire'
          });
        }
      }
      if (lt.global.JSON.stringify(autoShapes) != lt.global.JSON.stringify(shapes)) {
        chessground.setAutoShapes(shapes);
      }
    };

    markMoves = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess?.analysis;
      if (!analysis) return;
      const color = this.getPlayerColor(analysis);
      const repertoire = this.repertoires?.[color];
      this.clearMarkers();
      if (!repertoire?.positions?.size) {
        this.clearArrows();
        return;
      }

      lt.traverse();
      // Lichess can reuse connected <move> elements for different paths when a
      // variation is promoted. Rebuild the path-to-element cache before adding
      // markers so an icon never follows the recycled DOM element.
      lt.resetCache();
      const colorText = lt.translator.noarg('repertoireColor.' + color);
      const inRepertoireTitle = lt.translator.pluralSame('repertoireMoveTitle', colorText);
      const nodes = [...(analysis.tree.root?.children || [])].map(node => ({
        node: node,
        parentFen: lt.getPositionFromFen(analysis.tree.root.fen, true)
      }));
      while (nodes.length) {
        const { node, parentFen } = nodes.shift();
        nodes.push(...(node.children || []).map(child => ({
          node: child,
          parentFen: lt.getPositionFromFen(node.fen, true)
        })));
        if (repertoire.positions.has(lt.getPositionFromFen(node.fen, true))) {
          if (this.options.matches) {
            this.addMarker(node, 'lichessTools-inRepertoire', lt.icon.Book, inRepertoireTitle);
          }
          continue;
        }
        if (!this.options.deviations) continue;
        if (!repertoire.positions.has(parentFen)) continue;
        const repertoireMoves = repertoire.moves.get(parentFen);
        const moverColor = this.getMoverColor(node);
        if (moverColor == color) {
          if (repertoireMoves?.size) {
            const title = lt.translator.pluralSame('repertoireOwnDeviationTitle', this.getPreparedText(repertoireMoves));
            this.addMarker(node, 'lichessTools-repertoireOwnDeviation', lt.icon.Target, title);
          } else {
            const title = lt.translator.pluralSame('repertoireEndTitle', colorText);
            this.addMarker(node, 'lichessTools-repertoireEnd', lt.icon.FlagOutline, title);
          }
        } else if (repertoireMoves?.size) {
          const title = lt.translator.pluralSame('repertoireOpponentDeviationTitle', this.getPreparedText(repertoireMoves));
          this.addMarker(node, 'lichessTools-repertoireOpponentDeviation', lt.icon.ChasingArrows, title);
        } else {
          const title = lt.translator.pluralSame('repertoireEndTitle', colorText);
          this.addMarker(node, 'lichessTools-repertoireEnd', lt.icon.FlagOutline, title);
        }
      }
      if (this.options.arrows) {
        this.updateArrows(repertoire);
      } else {
        this.clearArrows();
      }
    };

    markMovesDebounced = this.lichessTools.debounce(this.markMoves, 100);

    retryLoad = async () => {
      if (this.loading) return;
      const lt = this.lichessTools;
      try {
        this.loading = true;
        const colors = ['white', 'black'].filter(color => {
          const option = color == 'white' ? 'repertoireWhite' : 'repertoireBlack';
          return lt.currentOptions.getValue(option) && !this.repertoires?.[color];
        });
        const loaded = await Promise.all(colors.map(color => this.loadRepertoire(color)));
        colors.forEach((color, i) => this.repertoires[color] = loaded[i]);
        this.markMoves();
      } finally {
        this.loading = false;
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const white = lt.currentOptions.getValue('repertoireWhite');
      const black = lt.currentOptions.getValue('repertoireBlack');
      const display = lt.currentOptions.getValue('repertoireDisplay');
      this.logOption('White repertoire PGN', white);
      this.logOption('Black repertoire PGN', black);
      this.logOption('Repertoire display', display);
      this.options = {
        matches: lt.isOptionSet(display, 'matches'),
        deviations: lt.isOptionSet(display, 'deviations'),
        arrows: lt.isOptionSet(display, 'arrows')
      };
      lt.pubsub.off('lichessTools.redraw', this.markMovesDebounced);
      $.cached('body').off('click', this.retryLoad);
      $('body').observer()
        .off('div.analyse__moves,div.analyse__moves *', this.handleMoveListMutation);
      this.clearMarkers();
      this.clearArrows();
      this.repertoires = null;
      if (!lt.lichess?.analysis || (!white && !black)) return;

      const [whitePositions, blackPositions] = await Promise.all([
        white ? this.loadRepertoire('white') : null,
        black ? this.loadRepertoire('black') : null
      ]);
      this.repertoires = { white: whitePositions, black: blackPositions };
      lt.pubsub.on('lichessTools.redraw', this.markMovesDebounced);
      $('body').observer()
        .on('div.analyse__moves,div.analyse__moves *', this.handleMoveListMutation, {
          characterData: false,
          executeDirect: true
        });
      if ((white && !whitePositions) || (black && !blackPositions)) {
        $.cached('body').one('click', this.retryLoad);
      }
      this.markMoves();
    }
  }

  LiChessTools.Tools.Repertoire = RepertoireTool;
})();
