(() => {
  class FixMoveListLoadTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixMoveListLoad',
        category: 'general',
        type: 'single',
        possibleValues: [true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.fixMoveListLoad': 'Fix move list load'
      },
      'ro-RO': {
        'options.fixMoveListLoad': 'Resolv\u0103 \u00eenc\u0103rcarea listei de mut\u0103ri'
      }
    }

    showTree = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      $('.analyse__tools .tview2')
        .toggleClassSafe('redrawn',true);
    };

    async start() {
      const lt = this.lichessTools;
      const value = $('body').css('display')=='none';
      this.logOption('Fix move list load', value);
      this.showTree();
      const analysis = lt.lichess.analysis;
      if (!analysis) return;
      if (!lt.isWrappedFunction(analysis.redraw,'fixMoveListLoad')) {
        analysis.redraw = lt.wrapFunction(analysis.redraw, {
          id: 'fixMoveListLoad',
          after: this.showTree
        });
      }
    }
  }
  LiChessTools.Tools.FixMoveListLoad = FixMoveListLoadTool;
})();
