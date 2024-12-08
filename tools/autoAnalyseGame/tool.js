(() => {
  class AutoAnalyseGameTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'autoAnalyseGame',
        category: 'play',
        type: 'multiple',
        possibleValues: ['loss', 'draw', 'win'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.autoAnalyseGame': 'Go to Analysis on game end',
        'autoAnalyseGame.loss': 'Loss',
        'autoAnalyseGame.draw': 'Draw',
        'autoAnalyseGame.win': 'Win'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.autoAnalyseGame': 'Intr\u0103 \u00een Analiz\u0103 c\u00e2nd se termin\u0103 jocul',
        'autoAnalyseGame.loss': 'Pierdere',
        'autoAnalyseGame.draw': 'Egal',
        'autoAnalyseGame.win': 'C\u00e2\u015ftig'
      }
    }

    retries = 0;
    checkEndGame = (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
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
      let outcome = 'draw';
      if (ev.winner) {
        const winnerHref = $('.game__meta__players .player.'+ev.winner+' a.user-link').attr('href');
        const m = /\/@\/(?<userId>[^\/\?#]+)/.exec(winnerHref);
        outcome = m?.groups?.userId?.toLowerCase() == lt.getUserId()?.toLowerCase()
          ? 'win'
          : 'loss';
      }
      this.retries = 0;
      if (this.options[outcome]) {
        const href = $('a.fbt.analysis').attr('href');
        if (!href) return;
        lt.global.location.href = href;
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
      if (!lt.getUserId()) return;
      if (!$('main').is('.round')) return;
      this.options = {
        loss: lt.isOptionSet(value, 'loss'),
        draw: lt.isOptionSet(value, 'draw'),
        win: lt.isOptionSet(value, 'win'),
        get isSet() { return this.loss || this.draw || this.win }
      };
      if (!this.options.isSet) return;
      lt.uiApi.socket.events.on('endData', this.checkEndGame);
    }

  }
  LiChessTools.Tools.AutoAnalyseGame = AutoAnalyseGameTool;
})();
