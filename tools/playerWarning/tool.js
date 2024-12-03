(() => {
  class PlayerWarningTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'playerWarning',
        category: 'play',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.playerWarning': 'Player warning alert',
        'percentageTitle': 'LiChess Tools - %s% disconnect rate'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.playerWarning': 'Alert\u0103 avertizare juc\u0103tori',
        'percentageTitle': 'LiChess Tools - rat\u0103 de deconectare %s%'
      }
    }

    isPlayingGame = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      return $.cached('body').is('.playing');
    };

    getTimeControl = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const text = $('div.game__meta div.setup').text();
      const m = /(\d+)\+(\d+)/.exec(text);
      if (!m) return;
      return lt.getGameTime(m[0], true);
    };

    refreshWarning = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!this.isPlayingGame()) return;
      const userId = lt.getUserId();
      $('.round__app .ruser-top a.user-link,.round__app .ruser-bottom a.user-link')
        .each(async (i, e) => {
          if (e.checkedPlayerWarning) return;
          e.checkedPlayerWarning = true;
          const href = $(e).attr('href');
          if (!href) return;
          const hrefUserId = /\/([^\/\?]*?)$/.exec(href)[1]?.toLowerCase();
          if (!hrefUserId) return;
          const isPlayer = hrefUserId?.toLowerCase() == userId.toLowerCase();
          if (isPlayer) return;
          let timeControl = this.getTimeControl();
          if (!timeControl || timeControl == 'ultrabullet') timeControl = 'blitz';
          const data = await lt.api.user.getUserPerfStats(hrefUserId, timeControl);
          const statCount = data?.stat?.count;
          if (!statCount) return;
          const disconnectPercentage = +(statCount.disconnects) * 100 / +(statCount.all);
          if (!disconnectPercentage || disconnectPercentage < 3) return;
          $('<span class="lichessTools-playerWarning">')
            .attr('data-icon', lt.icon.WarningSign)
            .attr('title', trans.pluralSame('percentageTitle', disconnectPercentage.toFixed(1)))
            .appendTo(e);
        });
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('playerWarning');
      this.logOption('Player warning', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      lt.pubsub.off('lichessTools.redraw', this.refreshWarning);
      if (!value) return;
      if (!$('.round__app').length) return;
      lt.pubsub.on('lichessTools.redraw', this.refreshWarning);
      this.refreshWarning();
    }

  }
  LiChessTools.Tools.PlayerWarning = PlayerWarningTool;
})();
