(() => {
  class TranspositionArrowsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'RandomVariation'];

    preferences = [
      {
        name: 'transpositionArrows',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.transpositionArrows': 'Variation arrows from transpositions'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.transpositionArrows': 'S\u0103ge\u0163i varia\u0163iuni din transpozi\u0163ii'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('transpositionArrows');
      this.logOption('Transposition arrows', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      analysis.setAutoShapes = lt.unwrapFunction(analysis.setAutoShapes, 'transpositionArrows');
      if (!value) return;
      analysis.setAutoShapes = lt.wrapFunction(analysis.setAutoShapes, {
        id: 'transpositionArrows',
        before: ($this, ...args) => {
          this.childrenNodes = analysis.node.children;
          analysis.node.children = lt.getNextMoves(analysis.node);
        },
        after: ($this, result, ...args) => {
          analysis.node.children = this.childrenNodes;
        }
      });
    }

  }
  LiChessTools.Tools.TranspositionArrows = TranspositionArrowsTool;
})();
