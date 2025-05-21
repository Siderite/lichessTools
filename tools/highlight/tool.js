(() => {
  class HighlightTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'DetectThirdParties', 'TranspositionBehavior'];

    preferences = [
      {
        name: 'highlight',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['lastMove', 'notCommented', 'transposition', 'mainLine', 'mainLinePieces', 'variationDepth', 'checks'],
        defaultValue: 'lastMove,notCommented,transposition',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.highlight': 'Highlight moves in analysis',
        'highlight.lastMove': 'Last move in each variation',
        'highlight.notCommented': 'Not commented last moves',
        'highlight.transposition': 'Transpositions to current move',
        'highlight.mainLine': 'Highlight board when out of main line',
        'highlight.mainLinePieces': 'Highlight pieces when out of main line',
        'highlight.variationDepth': 'Highlight variation depth',
        'highlight.checks': 'Highlight checks to kings',
      },
      'ro-RO': {
        'options.highlight': 'Eviden\u0163iaz\u0103 mut\u0103ri \u00een analiz\u0103',
        'highlight.lastMove': 'Ultima mutare din fiecare varia\u0163iune',
        'highlight.notCommented': 'Ultime mut\u0103ri necomentate',
        'highlight.transposition': 'Transpozi\u0163iile la mutarea curent\u0103',
        'highlight.mainLine': 'Eviden\u0163iaz\u0103 tabla c\u00e2nd nu pe linia principal\u0103',
        'highlight.mainLinePieces': 'Eviden\u0163iaz\u0103 piese c\u00e2nd nu pe linia principal\u0103',
        'highlight.variationDepth': 'Eviden\u0163iaz\u0103 ad\u00e2ncimea varia\u0163iunii',
        'highlight.checks': 'Eviden\u0163iaz\u0103 regi \u00een \u015fah',
      }
    }

    highlightLastMoves = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const analysis = lt.lichess.analysis;
      const toHighlight = [];
      if (this.options.lastMove && this.state?.lastMoves?.length) {
        const orientation = analysis.getOrientation() == 'white' ? 0 : 1;
        for (const node of this.state.lastMoves) {
          const elem = lt.getElementForNode(node);
          if (!elem) continue;
          const inverted = (node.ply%2 == 0) != orientation;
          toHighlight.push([elem,inverted]);
        }
      }
      $('div.analyse__moves move.lichessTools-lastInLine').filter((i, e) => !toHighlight.includes(e)).removeClass('lichessTools-lastInLine');
      for (const [elem,inverted] of toHighlight) {
        $(elem).toggleClassSafe('lichessTools-lastInLine',true);
        $(elem).toggleClassSafe('inverted',inverted);
      }
    };

    highlightChecks = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const toHighlight = [];
      if (this.options.checks && this.state?.checks?.length) {
        for (const node of this.state.checks) {
          const elem = lt.getElementForNode(node);
          if (!elem) continue;
          toHighlight.push(elem);
        }
      }
      $('div.analyse__moves move.lichessTools-inCheck').filter((i, e) => !toHighlight.includes(e)).removeClass('lichessTools-inCheck');
      for (const elem of toHighlight) {
        $(elem).toggleClassSafe('lichessTools-inCheck',true);
      }
    };

    highlightUncommented = () => {
      const lt = this.lichessTools;
      if (!lt.lichess?.analysis?.study) return;
      const $ = lt.$;
      const toHighlight = [];
      if (this.options.notCommented && this.state?.lastMoves?.length) {
        for (const node of this.state.lastMoves) {
          if (node.isCommentedOrMate) continue;
          const elem = lt.getElementForNode(node);
          if (!elem) continue;
          toHighlight.push(elem);
        }
      }
      $('div.analyse__moves move.lichessTools-uncommented').filter((i, e) => !toHighlight.includes(e)).removeClass('lichessTools-uncommented');
      for (const elem of toHighlight) {
        $(elem).toggleClassSafe('lichessTools-uncommented',true);
      }
    };

    highlightTranspositions = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const toHighlight = [];
      if (this.options.transposition) {
        const currentNode = lichess.analysis.node;
        if (currentNode.path === undefined) return;
        let transpositions = currentNode.transposition;
        if (lt.transpositionBehavior?.excludeSameLine) {
          transpositions = transpositions?.filter(n => n === currentNode || (n.path && !n.path.startsWith(currentNode.path) && !currentNode.path.startsWith(n.path)));
        }
        if (transpositions?.length > 1) {
          for (const node of transpositions) {
            if (!node.path) continue;
            const elem = lt.getElementForNode(node);
            if (elem) {
              toHighlight.push(elem);
            }
          }
        }
      }
      $('div.analyse__moves move.lichessTools-transposition').filter((i, e) => !toHighlight.includes(e)).removeClass('lichessTools-transposition');
      for (const elem of toHighlight) {
        $(elem).toggleClassSafe('lichessTools-transposition',true);
      }
    };

    highlightMainLine = () => {
      if (!this.options.mainLine) return;
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      if (!analysis) return;
      const onMainline = analysis.node == analysis.mainline[analysis.node.ply];
      const $ = lt.$;
      $.cached('body').toggleClass('lichessTools-notOnMainline', !onMainline);
    };

    highlightMainLinePieces = () => {
      if (!this.options.mainLinePieces) return;
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      if (!analysis) return;
      const onMainline = analysis.node == analysis.mainline[analysis.node.ply];
      const $ = lt.$;
      if (onMainline) {
        $('div.main-board cg-board piece.lichessTools-notOnMainline').removeClass('lichessTools-notOnMainline');
      } else {
        const board = lt.getBoardFromFen(analysis.node.fen);
        const mainNode = analysis.nodeList.findLast((n, i) => n == analysis.mainline[i]);
        const mainBoard = lt.getBoardFromFen(mainNode.fen);
        const squares = [];
        for (let x = 0; x < 8; x++) {
          for (let y = 0; y < 8; y++) {
            if (board[y][x] != mainBoard[y][x]) {
              const sq = String.fromCharCode('a'.charCodeAt(0) + x) + (8 - y);
              squares.push(sq);
            }
          }
        }
        if (squares.length) {
          $('div.main-board cg-board piece').each((i, e) => {
            const notOnMainline = squares.includes(e.cgKey);
            $(e).toggleClass('lichessTools-notOnMainline', notOnMainline);
          });
        }
      }
    };

    highlightVariationDepth = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      if (!this.options.variationDepth || !lt.isTreeviewVisible()) {
        return;
      }

      const nodes = [lichess?.analysis?.tree.root];
      const dict = {};
      nodes[0].variationDepth = 0;
      while (nodes.length) {
        const node = nodes.shift();
        if (!lt.isTreeviewVisible()) break;
        if (!node || node?.comp) {
          continue;
        }
        if (node.path) {
          dict[node.path] = 'vd' + (Math.min(7, node.variationDepth + 1)) + ' vdm' + (node.variationDepth % 7 + 1);
        }
        let depth = 0;
        for (const child of node.children) {
          child.variationDepth = node.variationDepth + depth;
          nodes.push(child);
          depth++;
        }
      }
      $('div.tview2 move').each((i, e) => {
        e = $(e);
        const path = e.attr('p');
        if (!path) return;
        const cls = dict[path];
        if (!cls) {
          //lt.global.console.warn('Could not find variation depth for node with path:',path);
        } else {
          ['vdm1', 'vdm2', 'vdm3', 'vdm4', 'vdm5', 'vdm6', 'vdm7', 'vd1', 'vd2', 'vd3', 'vd4', 'vd5', 'vd6', 'vd7']
            .forEach(c => {
              if (cls.includes(c)) {
                if (!e.is('.' + c)) e.addClass(c);
              } else {
                if (e.is('.' + c)) e.removeClass(c);
              }
            });
        }
      });
    };

    traverseTree = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess.analysis || !lt.isTreeviewVisible()) return;
      this.state = lt.traverse();
      this.highlightLastMoves();
      this.highlightUncommented();
      this.highlightTranspositions();
      this.highlightVariationDepth();
      this.highlightChecks();
    };

    debouncedTraverseTree = this.lichessTools.debounce(this.traverseTree, 800, { defer:true });
    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('highlight');
      this.logOption('Highlighting', value);
      const lichess = lt.lichess;
      if (!lichess) return;
      const $ = lt.$;
      this.options = {
        lastMove: lt.isOptionSet(value, 'lastMove'),
        notCommented: lt.isOptionSet(value, 'notCommented'),
        transposition: lt.isOptionSet(value, 'transposition'),
        mainLine: lt.isOptionSet(value, 'mainLine'),
        variationDepth: lt.isOptionSet(value, 'variationDepth'),
        checks: lt.isOptionSet(value, 'checks'),
        mainLinePieces: lt.isOptionSet(value, 'mainLinePieces'),
        get isSet() { return this.lastMove || this.notCommented || this.transposition || this.mainLine || this.variationDepth || this.checks || this.mainLinePieces; }
      };
      lt.pubsub.off('lichessTools.redraw', this.highlightMainLine);
      lt.pubsub.off('lichessTools.redraw', this.highlightMainLinePieces);
      lt.pubsub.off('lichessTools.redraw', this.debouncedTraverseTree);
      if (this.options.mainLine) {
        lt.pubsub.on('lichessTools.redraw', this.highlightMainLine);
      }
      if (this.options.mainLinePieces) {
        lt.pubsub.on('lichessTools.redraw', this.highlightMainLinePieces);
      }
      if (this.options.isSet) {
        lt.pubsub.on('lichessTools.redraw', this.debouncedTraverseTree);
      }
      $.cached('body').toggleClass('lichessTools-variationDepth', this.options.variationDepth);
      this.debouncedTraverseTree();
    }
  }
  LiChessTools.Tools.Highlight = HighlightTool;
})();
