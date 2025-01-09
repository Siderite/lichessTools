(() => {
  class FixChessgroundResizeTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixChessgroundResize',
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
        'options.fixChessgroundResize': 'Fix Chessground resize'
      },
      'ro-RO': {
        'options.fixChessgroundResize': 'Resolv\u0103 redimensionarea Chessground'
      }
    }

    checkBoardPosition = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      let offset = this.board?.offset();
      if (!offset || !this.board[0]?.offsetParent) {
        this.board = $('.main-board cg-board');
        offset = this.board.offset();
      }
      if (!offset) return;
      offset.width = this.board.width();
      offset.height = this.board.height();
      if (JSON.stringify(offset) != JSON.stringify(this.offset)) {
        this.offset = offset;
        lt.debug && lt.global.console.debug('Firing board resize event');
        const boardSize = $('cg-container').css('width') || $('cg-container').width()+'px';
        lt.global.document.documentElement.style.setProperty('--board-size', boardSize);
        $('body').trigger('resize');
      }
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('fixChessgroundResize');
      this.logOption('Fix Chessground resize', value);
      lt.global.clearInterval(this.interval);
      if (!value) return;
      this.interval = lt.global.setInterval(this.checkBoardPosition, 500);
    }
  }
  LiChessTools.Tools.FixChessgroundResize = FixChessgroundResizeTool;
})();
