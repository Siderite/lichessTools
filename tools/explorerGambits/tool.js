(() => {
  class ExplorerGambitsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'ChessOps'];

    preferences = [
      {
        name: 'explorerGambits',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.explorerGambits': 'Show explorer moves leading to gambits',
        'gambitTitle': 'LiChessTools - Number of possible gambits',
        'gambitRowTitle': '%s gambits'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.explorerGambits': 'Arat\u0103 mut\u0103ri \u00een Explorator care duc la gambituri',
        'gambitTitle': 'LiChessTools - Num\u0103r de gambituri posibile',
        'gambitRowTitle': '%s gambituri'
      }
    }

    gambit_dict = async ()=> {
      if (!this._gambits) {
        const parent = this.lichessTools;
        const gambits = await parent.comm.getData('gambits.json');
        this._gambits = {
          white: new Map(Object.keys(gambits.white).map(k => [k, gambits.white[k]])),
          black: new Map(Object.keys(gambits.black).map(k => [k, gambits.black[k]]))
        };
      }
      return this._gambits;
    };

    computeFen = (fen, uci) => {
      const co = this.lichessTools.chessops;
      fen = co.fen.parseFen(fen).unwrap();
      const ch = co.Chess.fromSetup(fen).unwrap();
      ch.play(co.parseUci(uci));
      return co.fen.makeFen(ch.toSetup());
    };

    showGambits = async (result) => {
      const moves = result?.moves;
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const trans = parent.translator;
      const analysis = lichess?.analysis;
      const container = $('section.explorer-box table.moves');
      if (!container.length) return;
      if (parent.isGamePlaying()) return;
      const gambits = await this.gambit_dict();
      if (!result?.total) {
        $('.lichessTools-explorerGambits', container).remove();
        return;
      }
      if (!$('th.lichessTools-explorerGambits', container).length) {
        $('<th>')
          .addClass('lichessTools-explorerGambits')
          .text('\u2604')
          .attr('title', trans.noarg('gambitTitle'))
          .appendTo($('thead tr', container));
      }
      const side = analysis.getOrientation();
      const fen = analysis.node.fen;
      let sum = 0;
      $('tr[data-uci]', container).each((i, e) => {
        if ($('td:has(div.bar)', e).addClass('lichessTools-bar').length) {
          if (!$('td.lichessTools-explorerGambits', e).length) {
            $('<td>')
              .addClass('lichessTools-explorerGambits')
              .appendTo(e);
          }
        }
        const uci = $(e).attr('data-uci');
        let move = null;
        if (uci) {
          const moveFen = this.computeFen(fen, uci);
          const pos = parent.getPositionFromFen(moveFen);
          const moveResult = gambits[side].get(pos);
          move = moveResult
            ? {
              uci: uci,
              nr: moveResult.total || 1
            }
            : moves?.find(m => m.uci == uci);
        }
        const explorerItem = (analysis.explorer.current()?.moves || []).find(i => i.uci == uci);
        let text = '';
        let title = undefined;
        if (!explorerItem) return;
        if (move) {
          const nr = move.nr || 1;
          title = trans.pluralSame('gambitRowTitle', nr);
          text = nr;
          sum += nr;
        }
        $('td.lichessTools-explorerGambits', e)
          .text(text)
          .attr('title', title);
      });
      $('tr.sum', container).each((i, e) => {
        $('td:has(div.bar)', e).addClass('lichessTools-bar');
        if (!$('td.lichessTools-explorerGambits', e).length) {
          $('<td>')
            .addClass('lichessTools-explorerGambits')
            .appendTo(e);
        }
        const title = trans.pluralSame('gambitRowTitle', sum);
        const text = sum;
        $('td.lichessTools-explorerGambits', e)
          .text(text)
          .attr('title', title);
      });
    };

    findGambits = async () => {
      if (!this.options.enabled) return;
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis.explorer?.enabled()) return;
      if (parent.isGamePlaying()) return;
      const explorerMoves = analysis.explorer?.current()?.moves;
      if (!explorerMoves?.length) return;
      if (!parent.inViewport($('section.explorer-box table.moves'))) {
        this.findGambitsDebounced();
        return;
      }
      const fen = analysis.node.fen;
      const side = analysis.getOrientation();
      const pos = parent.getPositionFromFen(analysis.node.fen);
      const gambits = await this.gambit_dict();
      const result = gambits[side].get(pos);
      await this.showGambits(result);
    };
    findGambitsDebounced = this.lichessTools.debounce(this.findGambits, 100);

    checkGambits = () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const explorer = analysis.explorer;
      if (!this.options.enabled) {
        explorer.setNode = parent.unwrapFunction(explorer.setNode, 'explorerGambits');
      } else {
        if (!parent.isWrappedFunction(explorer.setNode, 'explorerGambits')) {
          explorer.setNode = parent.wrapFunction(explorer.setNode, {
            id: 'explorerGambits',
            after: async ($this, result, ...args) => {
              if (!explorer.lastStream) return;
              await explorer.lastStream.promise;
              this.findGambitsDebounced();
            }
          });
        }
        this.findGambitsDebounced();
      }
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('explorerGambits');
      this.logOption('Explorer gambits', value);
      this.options = { enabled: value };
      const lichess = parent.lichess;
      const $ = parent.$;
      const explorer = lichess?.analysis?.explorer;
      if (!explorer) return;
      lichess.pubsub.off('lichessTools.redraw', this.checkGambits);
      $('th.lichessTools-explorerGambits,td.lichessTools-explorerGambits').remove();
      explorer.setNode = parent.unwrapFunction(explorer.setNode, 'explorerGambits');
      if (!value) return;
      lichess.pubsub.on('lichessTools.redraw', this.checkGambits);
      this.checkGambits();
    }

  }
  LiChessTools.Tools.ExplorerGambits = ExplorerGambitsTool;
})();
