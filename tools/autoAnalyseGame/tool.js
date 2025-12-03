(() => {
  class AutoAnalyseGameTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'autoAnalyseGame',
        category: 'play',
        type: 'multiple',
        possibleValues: ['loss', 'draw', 'win', 'showRequestAnalysis'],
        defaultValue: false,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.autoAnalyseGame': 'Go to Analysis on game end',
        'autoAnalyseGame.loss': 'Loss',
        'autoAnalyseGame.draw': 'Draw',
        'autoAnalyseGame.win': 'Win',
        'autoAnalyseGame.showRequestAnalysis': 'Request analysis button',
        'requestAComputerAnalysis': 'Request a computer analysis'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.autoAnalyseGame': 'Intr\u0103 \u00een Analiz\u0103 c\u00e2nd se termin\u0103 jocul',
        'autoAnalyseGame.loss': 'Pierdere',
        'autoAnalyseGame.draw': 'Egal',
        'autoAnalyseGame.win': 'C\u00e2\u015ftig',
        'autoAnalyseGame.showRequestAnalysis': 'Buton analiz\u0103 calculator',
        'requestAComputerAnalysis': 'Cere o analiz\u0103 f\u0103cut\u0103 de calculator'
      }
    }

    retries = 0;
    checkEndGame = (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!$('body').is('.playing')) {
        this.retries = 0;
        return;
      }
      if (!$('.result-wrap .result').length && !$('a.fbt.analysis').attr('href')) {
        if (this.retries < 8) {
          lt.global.setTimeout(this.checkEndGame, 500);
          this.retries++;
        }
        return;
      }
      const userId = lt.getUserId();
      let outcome = 'draw';
      if (ev.winner) {
        const winnerHref = $('.game__meta__players .player.'+ev.winner+' a.user-link').attr('href');
        const m = /\/@\/(?<userId>[^\/\?#]+)/.exec(winnerHref);
        outcome = m?.groups?.userId?.toLowerCase() == userId?.toLowerCase()
          ? 'win'
          : 'loss';
      }
      this.retries = 0;
      if (this.options[outcome]) {
        const href = $('a.fbt.analysis').attr('href');
        if (href) {
          lt.global.location.href = href;
        }
      } else {
        const button = $('.lichessTools-requestAnalysis');
        if (userId && this.options.showRequestAnalysis) {
          if (!button.length) {
            $('<button type="button" class="button text lichessTools-requestAnalysis">')
              .append($('<span class="is3 text">')
                        .attr('data-icon',lt.icon.BarChart)
                        .text(trans.noarg('requestAComputerAnalysis'))
              )
              .on('click',async (ev)=>{
                const href = $('a.fbt.analysis').attr('href');
                if (!href) return;
                const m = /^\/(?<id>[^\/?#\s]+)/.exec(href);
                if (m) {
                  await lt.net.fetch(`/${m.groups.id}/request-analysis`,{ method: 'POST' });
                }
                lt.storage.set('analysis.panel','computer-analysis', { raw: true });
                lt.global.location.href = href;
              })
              .appendTo('.round__side');
          }
        } else {
          button.remove();
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('autoAnalyseGame');
      this.logOption('Auto analyse game', value);
      lt.uiApi.socket.events.off('endData', this.checkEndGame);
      this.retries = 0;
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      if (!$('main').is('.round')) return;
      this.options = {
        loss: lt.isOptionSet(value, 'loss'),
        draw: lt.isOptionSet(value, 'draw'),
        win: lt.isOptionSet(value, 'win'),
        showRequestAnalysis: lt.isOptionSet(value, 'showRequestAnalysis'),
        get isSet() { return this.loss || this.draw || this.win || this.showRequestAnalysis }
      };
      if (!this.options.isSet) return;
      lt.uiApi.socket.events.on('endData', this.checkEndGame);
    }

  }
  LiChessTools.Tools.AutoAnalyseGame = AutoAnalyseGameTool;
})();
