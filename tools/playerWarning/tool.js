(() => {
  class PlayerWarningTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'playerWarning',
        category: 'play',
        type: 'multiple',
        possibleValues: ['disconnect', 'timecontrol', 'sandbag'],
        defaultValue: false,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.playerWarning': 'Player warning alert',
        'playerWarning.disconnect': 'Disconnect rate',
        'playerWarning.timecontrol': 'Time control discrepancies',
        'playerWarning.sandbag': 'Highest rating',
        'percentageTitle': '- %s% disconnect rate',
        'timeControlSuspicionTitle': '- time control suspicion score: %s',
        'sandbagSuspicionTitle': '- used to be higher rated: %s'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.playerWarning': 'Alert\u0103 avertizare juc\u0103tori',
        'playerWarning.disconnect': 'Rat\u0103 deconectare',
        'playerWarning.timecontrol': 'Discrepan\u0163e control timp',
        'playerWarning.sandbag': 'Rating maxim',
        'percentageTitle': '- rat\u0103 de deconectare %s%',
        'timeControlSuspicionTitle': '- scorul suspiciunii pe controale de timp: %s',
        'sandbagSuspicionTitle': '- era cotat mai sus \u00een trecut: %s'
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

    timeControlSuspicion = (data, options = {}) => {
      const {
        minGames = 50,
        maxRD = 500,
        blitzWeight = 1.0,
        rapidWeight = 1.5,
        classicalWeight = 2.0
      } = options;

      const valid = {};

      ['blitz','rapid','classical'].forEach(tc=>{
        const values = data?.[tc] || {}
        if (
          (values.games || 0) >= minGames &&
          (values.rd || 999) <= maxRD &&
          !values.prov
        ) {
          valid[tc] = values.rating;
        }
      });

      if (!valid.blitz || (!valid.rapid && !valid.classical)) {
        return {
          score: 0,
          explanation: `Insufficient valid data.`
        };
      }

      let slowRating = 0;
      let totalWeight = 0;

      if (valid.rapid) {
        slowRating += valid.rapid * rapidWeight;
        totalWeight += rapidWeight;
      }
      if (valid.classical) {
        slowRating += valid.classical * classicalWeight;
        totalWeight += classicalWeight;
      }

      const avgSlowRating = totalWeight > 0 ? slowRating / totalWeight : 0;
      const score = avgSlowRating - valid.blitz;

      const lines = [
        `Valid: ${Object.keys(valid).join(', ')}`,
        `Blitz: ${valid.blitz}`,
        `Slow weighted: ${avgSlowRating.toFixed(1)}`,
        `Suspicion Score: ${score >= 0 ? '+' : ''}${score.toFixed(1)}`,
      ];

      return {
        score: parseFloat(score.toFixed(1)),
        explanation: lines.join('\n')
      };
    }

    refreshWarning = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      //if (!this.isPlayingGame()) return;
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

          const warnings = [];
          if (this.options.disconnect || this.options.sandbag) {
            let timeControl = this.getTimeControl();
            if (!timeControl || timeControl == 'ultrabullet') timeControl = 'blitz';
            const data = await lt.api.user.getUserPerfStats(hrefUserId, timeControl);

            const statCount = data?.stat?.count;
            if (statCount && this.options.disconnect) {
              const disconnectPercentage = +(statCount.disconnects) * 100 / +(statCount.all);
              if (disconnectPercentage >= 3) {
                warnings.push({
                  text: trans.pluralSame('percentageTitle', disconnectPercentage.toFixed(1)),
                  score: disconnectPercentage*15
                });
              }
            }

            const rating = data?.perf?.glicko?.rating;
            const highest = data?.stat?.highest?.int;
            if (highest && rating && this.options.sandbag) {
              if (highest-rating>200) {
                warnings.push({
                  text: trans.pluralSame('sandbagSuspicionTitle', highest),
                  score: (highest-rating)/4
                });
              }
            }
          }
          if (this.options.timecontrol) {
            const data = await lt.api.user.getUsers([hrefUserId]);
            if (data) {
              const tcs = this.timeControlSuspicion(data?.[0]?.perfs);
              if (tcs.score >= 200)  {
                warnings.push({
                  text: trans.pluralSame('timeControlSuspicionTitle', tcs.score.toFixed(1)),
                  score: tcs.score/2-50
                });
              }
            }
          }
          if (warnings.length) {
            const maxScore = Math.min(100,Math.max.apply(null,warnings.map(w=>w.score)));
            const color = lt.getGradientColor(maxScore, [
              { q: 0, color: '#808000' },
              { q: 50, color: '#CCCC00' }, 
              { q: 75, color: '#FFA500' },
              { q: 100, color: '#FF4040' }
            ]);
            $('<span class="lichessTools-playerWarning">')
              .attr('data-icon', lt.icon.WarningSign)
              .css('--lt-color', color)
              .attr('title', [trans.noarg('lichessTools'),...warnings.map(w=>w.text)].join('\r\n '))
              .appendTo(e);
          }
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
      if (!$('.round__app').length) return;

      this.options = {
        disconnect: lt.isOptionSet(value,'disconnect'),
        timecontrol: lt.isOptionSet(value,'timecontrol'),
        sandbag: lt.isOptionSet(value,'sandbag'),
      };

      if (this.options.disconnect || this.options.timecontrol || this.options.sandbag) {
        lt.pubsub.on('lichessTools.redraw', this.refreshWarning);
        this.refreshWarning();
      }
    }

  }
  LiChessTools.Tools.PlayerWarning = PlayerWarningTool;
})();
