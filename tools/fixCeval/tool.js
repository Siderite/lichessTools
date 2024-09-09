(() => {
  class FixCevalTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixCeval',
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
        'options.fixCeval': 'Fix computer eval freezes'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.fixCeval': 'Rezolv\u0103 \u00eenghe\u0163area evalu\u0103rii computerului'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('fixCeval');
      this.logOption('Fix ceval', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      analysis.toggleCeval = parent.unwrapFunction(analysis.toggleCeval, 'fixCeval');
      if (!value) return;
      analysis.toggleCeval = parent.wrapFunction(analysis.toggleCeval, {
        id: 'fixCeval',
        after: ($this, result, ...args) => {
          if (!analysis.ceval.enabled()) {
            analysis.ceval.destroy();
          }
        }
      });
    }

  }
  LiChessTools.Tools.FixCeval = FixCevalTool;
})();
