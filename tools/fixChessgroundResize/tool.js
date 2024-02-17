(()=>{
  class FixChessgroundResizeTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'fixChessgroundResize',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        'options.fixChessgroundResize': 'Fix Chessground resize'
      },
      'ro-RO':{
        'options.fixChessgroundResize': 'Resolv\u0103 redimensionarea Chessground'
      }
    }

    checkBoardPosition=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const offset=$('.cg-wrap cg-board').offset();
      if (offset?.top!=this.offset?.top || offset?.left!=this.offset?.left) {
        this.offset=offset;
        $('body').trigger('resize');
      }
    }

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const value=parent.currentOptions.getValue('fixChessgroundResize');
      this.logOption('Fix Chessground resize', value);
      parent.global.clearInterval(this.interval);
      if (!value || !$('.cg-wrap cg-board').length) return;
      this.interval=parent.global.setInterval(this.checkBoardPosition,500);
    }
  }
  LiChessTools.Tools.FixChessgroundResize=FixChessgroundResizeTool;
})();
