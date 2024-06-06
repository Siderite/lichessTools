(()=>{
  class RemoveChatLinkWarningTool extends LiChessTools.Tools.ToolBase {

    dependencies=[ 'InterceptEventHandlers' ];

    preferences=[
      {
        name:'removeChatLinkWarning',
        category: 'general',
        type:'singe',
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

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('removeChatLinkWarning');
      this.logOption('Remove link warning', value);
      if (!value) return;
      $('div.link-popup-ready').each((i,e)=>parent.removeEventHandlers(e,'click'));
    }

  }
  LiChessTools.Tools.RemoveChatLinkWarning=RemoveChatLinkWarningTool;
})();
