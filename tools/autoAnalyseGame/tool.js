(() => {
  class AutoAnalyseGameTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'autoAnalyseGame',
        category: 'play',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.autoAnalyseGame': 'Go to Analysis on game end'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.autoAnalyseGame': 'Intr\u0103 \u00een Analiz\u0103 c\u00e2nd se termin\u0103 jocul'
      }
    }

    retries = 0;
    checkEndGame = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!$('body').is('.playing')) {
        this.retries = 0;
        return;
      }
      if (!$('.result-wrap .result').length) {
        if (this.retries < 8) {
          lt.global.setTimeout(this.checkEndGame, 500);
          this.retries++;
        }
        return;
      }
      this.retries = 0;
      const href = $('a.fbt.analysis').attr('href');
      if (!href) return;
      lt.global.location.href = href;
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('autoAnalyseGame');
      this.logOption('Auto analyse game', value);
      lt.uiApi.socket.events.off('endData', this.checkEndGame);
      this.retries = 0;
      if (!value) return;
      if (!$('main').is('.round')) return;
      lt.uiApi.socket.events.on('endData', this.checkEndGame);
    }

  }
  LiChessTools.Tools.AutoAnalyseGame = AutoAnalyseGameTool;
})();
