(() => {
  class BotsMenuItemTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'botsMenuItem',
        category: 'play',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.botsMenuItem': 'Bots in menu',
        'botsMenuItemText': 'Online bots',
        'botsMenuItemTitle': 'Lichess Tools - play against bots'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.botsMenuItem': 'Bo\u0163i \u00een meniu',
        'botsMenuItemText': 'Bo\u0163i online',
        'botsMenuItemTitle': 'Lichess Tools - joac\u0103 contra unor bo\u0163i'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const botsMenuItem = lt.currentOptions.getValue('botsMenuItem');
      this.options = { 
        enabled: !!botsMenuItem
      };
      this.logOption('Bots menu item', botsMenuItem);
      const container = $('#topnav section a[href="/"]+div[role="group"]');
      container.find('.lichessTools-botsMenuItem').remove();
      if (this.options.enabled) {
        $('<a>')
          .addClass('lichessTools-botsMenuItem')
          .text(trans.noarg('botsMenuItemText'))
          .attr('title', trans.noarg('botsMenuItemTitle'))
          .attr('href','/player/bots')
          .appendTo(container);
      }

    }

  }
  LiChessTools.Tools.BotsMenuItem = BotsMenuItemTool;
})();
