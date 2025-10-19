(() => {
  class QuietModeAllTabsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'quietModeAllTabs',
        category: 'play',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.quietModeAllTabs': 'Quiet mode on all tabs',
        'quietModeDisableText': 'Disable quiet mode',
        'quietModeEnableText': 'Enable quiet mode',
        'quietModeDisableTitle': 'LiChess Tools - disable quiet mode',
        'quietModeEnableTitle': 'LiChess Tools - enable quiet mode'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.quietModeAllTabs': 'Mod silen\u0163ios \u00een toate taburile',
        'quietModeDisableText': 'Opre\u015Fte mod silen\u0163ios',
        'quietModeEnableText': 'Porne\u015Fte mod silen\u0163ios',
        'quietModeDisableTitle': 'LiChess Tools - opre\u015Fte mod silen\u0163ios',
        'quietModeEnableTitle': 'LiChess Tools - porne\u015Fte mod silen\u0163ios'
      }
    }

    addQuietModeMenu = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('div.site-buttons div.dasher #dasher_app div.links');
      if (this.options.enabled) {
        if (!container.children().length) {
          return;
        }
        let elem = $('a.lichessTools-quietMode', container);
        if (!elem.length) {
          elem = $('<a class="text lichessTools-quietMode">')
            .attr('data-icon', lt.icon.BellOutline)
            .on('click', ev => {
              ev.preventDefault();
              lichess.forcedQuietMode = !lichess.quietMode;
              if (lichess.quietMode && !lichess.forcedQuietMode) lichess.quietMode = false;
              this.addQuietModeMenu();
            })
            .appendTo(container);
        }
        const text = lichess.quietMode
          ? trans.noarg('quietModeDisableText')
          : trans.noarg('quietModeEnableText');
        const title = lichess.quietMode
          ? trans.noarg('quietModeDisableTitle')
          : trans.noarg('quietModeEnableTitle');
        elem
          .textSafe(text)
          .attrSafe('title', title)
          .toggleClassSafe('lichessTools-forcedQuietMode', !!lichess.quietMode);
      } else {
        $('a.lichessTools-quietMode', container).remove();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('quietModeAllTabs');
      this.logOption('Quiet mode all tabs', value);
      this.options = {
        enabled: value
      };
      const lichess = lt.lichess;
      const descriptor = Object.getOwnPropertyDescriptor(lichess, 'quietMode');
      const isProperty = descriptor?.get && descriptor?.set;
      lt.global.clearInterval(this.interval);
      if (!value) {
        if (isProperty) {
          delete lichess.quietMode;
          delete lichess.forcedQuietMode;
          lichess.quietMode = false;
        }
        return;
      }
      this.interval = lt.global.setInterval(this.addQuietModeMenu,500);

      if (!isProperty) {
        const quietMode = lichess.quietMode;
        const storage = lt.storage;
        Object.defineProperty(lichess, 'forcedQuietMode', {
          configurable: true,
          get: function () {
            return !!storage.get('LichessTools.forcedQuietMode');
          },
          set: function (val) {
            storage.set('LichessTools.forcedQuietMode', !!val);
          }
        });
        Object.defineProperty(lichess, 'quietMode', {
          configurable: true,
          get: function () {
            if (this.forcedQuietMode) return true;
            return !!storage.get('LichessTools.quietMode');
          },
          set: function (val) {
            storage.set('LichessTools.quietMode', !!val);
          }
        });
        if (quietMode) lichess.quietMode = true;
      }
    }
  }
  LiChessTools.Tools.QuietModeAllTabs = QuietModeAllTabsTool;
})();
