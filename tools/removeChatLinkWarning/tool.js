(()=>{
  class RemoveChatLinkWarningTool extends LiChessTools.Tools.ToolBase {

    dependencies=[ 'InterceptEventHandlers' ];

    preferences=[
      {
        name:'removeChatLinkWarning',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.removeChatLinkWarning': 'Remove chat link warning'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.removeChatLinkWarning': 'F\u0103r\u0103 alerte la linkuri din chat'
      }
    }

    initControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      $('div.link-popup-ready').each((i,e)=>{
        if (e.removeChatLinkWarningInit) return;
        parent.removeEventHandlers(e,'click');
        e.removeChatLinkWarningInit=true;
      });
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('removeChatLinkWarning');
      this.logOption('Remove link warning', value);
      parent.global.clearInterval(this.interval);
      if (!value) return;
      this.interval=parent.global.setInterval(this.initControls,1000);
      this.initControls();
    }

  }
  LiChessTools.Tools.RemoveChatLinkWarning=RemoveChatLinkWarningTool;
})();
