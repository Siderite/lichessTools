(() => {
  class ChessOpsTool extends LiChessTools.Tools.ToolBase {

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
        let chessops = null;
        lt.chessops=()=>new Promise((resolve)=>{
          if (chessops) {
            resolve(chessops);
            return;
          }
          // generate this with the BundleJsLibraries project from LiChessToolsAdjacent
          lt.comm.getChromeUrl('tools/chessops/chessops.bundle.mjs').then(async (url)=>{
            chessops = await import(url);
            resolve(chessops);
          });
        });
      }
    }

  }
  LiChessTools.Tools.ChessOps = ChessOpsTool;
})();
