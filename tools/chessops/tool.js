(() => {
  class ChessOpsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [{
      name: 'chessOps',
      category: 'study',
      type: 'single',
      possibleValues: [false, true],
      defaultValue: true,
      advanced: true,
      hidden: true
    }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.chessOps': 'Chessops support'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.chessOps': 'Suport pentru chessops'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('chessOps');
      if (!value) {
        lt.chessops = null;
        return;
      }
      if (!lt.chessops) {
        const url = await lt.comm.getChromeUrl('tools/chessops/index.js');
        const chessops = await import(url);
        lt.chessops = chessops;
      }
    }

  }
  LiChessTools.Tools.ChessOps = ChessOpsTool;
})();
