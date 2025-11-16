(() => {
  class FixMoveListLoadTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixMoveListLoad',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
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

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = $('body').css('display')=='none';
      this.logOption('Fix move list load', value);
      const analysis = lt.lichess.analysis;
      if (!analysis) return;
      const tree = $('.analyse__tools .tview2');
      if (tree.css('display')=='none') {
        tree.css('display','flex');
      }
    }
  }
  LiChessTools.Tools.FixMoveListLoad = FixMoveListLoadTool;
})();
