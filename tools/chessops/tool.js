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
        LiChessTools.chessopsModule = null;
        return;
      }
      if (!lt.chessops) {
        let chessops = null;
        let pending = null;
        lt.chessops=()=>{
          if (chessops) {
            return Promise.resolve(chessops);
          }
          if (pending) {
            return pending;
          }
          pending=new Promise((resolve)=>{
            // generate this with the BundleJsLibraries project from LiChessToolsAdjacent
            lt.comm.getChromeUrl('tools/chessops/chessops.bundle.mjs').then(async (url)=>{
              chessops = await import(url);
              LiChessTools.chessopsModule = chessops;
              resolve(chessops);
            }).catch((e)=>{
              lt.global.console.warn('chessops load failed',e);
              pending=null;
              resolve(null);
            });
          });
          return pending;
        };
      }
      // eagerly load chessops so synchronous code (e.g. the board adapter) can use it
      lt.chessops();
    }

  }
  LiChessTools.Tools.ChessOps = ChessOpsTool;
})();
