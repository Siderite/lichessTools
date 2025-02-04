(() => {
  class RemoveChatLinkWarningTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['InterceptEventHandlers'];

    preferences = [
      {
        name: 'removeChatLinkWarning',
        category: 'comm',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.comm': 'Chat, forums, blogs',
        'options.removeChatLinkWarning': 'Remove chat link warning'
      },
      'ro-RO': {
        'options.comm': 'Chat, forum-uri, blog-uri',
        'options.removeChatLinkWarning': 'F\u0103r\u0103 alerte la linkuri din chat'
      }
    }

    initControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('div.link-popup-ready').each((i, e) => {
        if (e.removeChatLinkWarningInit) return;
        lt.removeEventHandlers(e, 'click');
        e.removeChatLinkWarningInit = true;
      });
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('removeChatLinkWarning');
      this.logOption('Remove link warning', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      lt.global.clearInterval(this.interval);
      if (!value) return;
      this.interval = lt.global.setInterval(this.initControls, 1000);
      this.initControls();
    }

  }
  LiChessTools.Tools.RemoveChatLinkWarning = RemoveChatLinkWarningTool;
})();
