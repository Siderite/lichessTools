(() => {
  class BetterBestArrowTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'betterBestArrow',
        category: 'analysis2',
        type: 'multiple',
        possibleValues: ['enabled','localEval','allMoves'],
        defaultValue: 'enabled,localEval,allMoves',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.betterBestArrow': 'Improved best move arrow',
        'betterBestArrow.enabled': 'Enabled',
        'betterBestArrow.localEval': 'Use local evaluation',
        'betterBestArrow.allMoves': 'On all moves'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.betterBestArrow': 'S\u0103geat\u0103 cu cea mai bun\u0103 mutare \u00eembun\u0103t\u0103\u0163it\u0103',
        'betterBestArrow.enabled': 'Activat',
        'betterBestArrow.localEval': 'Folose\u015fte evaluarea local\u0103',
        'betterBestArrow.allMoves': 'La toate mut\u0103rile'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('betterBestArrow');
      this.logOption('Better best arrow', value);
      this.options = {
        enabled: lt.isOptionSet(value, 'enabled'),
        localEval: lt.isOptionSet(value, 'localEval'),
        allMoves: lt.isOptionSet(value, 'allMoves')
      };

      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;

      $('body').toggleClassSafe('lichessTools-betterBestArrow',!!value);
      analysis.setAutoShapes = lt.unwrapFunction(analysis.setAutoShapes,'betterBestArrow');
      if (!this.options.enabled) return;
      analysis.setAutoShapes = lt.wrapFunction(analysis.setAutoShapes,{
        id: 'betterBestArrow',
        before: ($this, ...args) => {
          const node = analysis.node;
          const isBadMove = !!node.glyphs?.find(g=>['?!','?','??'].includes(g.symbol));
          if (!isBadMove && !this.options.allMoves) return;
          const prevNode = analysis.nodeList.at(-2);
          const ebest = node.eval?.best;
          const cbest = this.options.localEval
            ? prevNode?.ceval?.pvs?.at(0)?.moves?.at(0)
            : null;
          const best = ebest && cbest && node.ceval?.depth < 15
            ? ebest
            : cbest || ebest;
          if (best && node.eval?.best != best) {
            node.eval ||= {};
            node.eval.best = best;
          }
        }
      });
    }

  }
  LiChessTools.Tools.BetterBestArrow = BetterBestArrowTool;
})();
