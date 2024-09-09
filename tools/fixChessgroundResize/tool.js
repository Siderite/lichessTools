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
      const parent = this.lichessTools;
      const $ = parent.$;
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
        parent.debug && parent.global.console.debug('Firing board resize event');
        $('body').trigger('resize');
      }
    }

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const value = parent.currentOptions.getValue('fixChessgroundResize');
      this.logOption('Fix Chessground resize', value);
      parent.global.clearInterval(this.interval);
      if (!value) return;
      this.interval = parent.global.setInterval(this.checkBoardPosition, 500);
    }
  }
  LiChessTools.Tools.FixChessgroundResize = FixChessgroundResizeTool;
})();
