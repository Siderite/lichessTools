(() => {
  class FontIconsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fontIcons',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.fontIcons': 'Restore font icons'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.fontIcons': 'Restaurare iconi\u0163e font'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('fontIcons');
      this.logOption('Font icons', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      if (value) {
        const fontExists = [...lt.global.document.fonts].find(f=>f.family=='lichess');
        if (!fontExists) {
          const url = lichess.asset.url('font/lichess.woff2');
          $('<style id="fontIcons">').text(`
              @font-face {
                  font-family: 'lichessTools';
                  font-display: block;
                  src: url('${url}') format('woff2');
              }
              @font-face {
                  font-family: 'lichess';
                  font-display: block;
                  src: url('${url}') format('woff2');
              }
          `).appendTo('head');
        }
      } else {
        $('#fontIcons').remove();
      }
      $('body').toggleClass('lichessTools-fontIcons',!!$('#fontIcons').length);
    }

  }
  LiChessTools.Tools.FontIcons = FontIconsTool;
})();
