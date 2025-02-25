(() => {
  class KonamiTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'konami',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true,
        offValue: false
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.konami': 'Cheat code',
        '30lives': '30 more lives!'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.konami': 'Cod tri\u015fare',
        '30lives': '\u00CEnc\u0103 30 de vie\u0163i!'
      }
    }

    enableCheat = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      const egg = $('<div class="konami">')
        .attr('data-text', trans.noarg('30lives'))
        .appendTo('body');
      lt.global.setTimeout(() => egg.addClass('flash'), 1);
      lt.global.setTimeout(() => egg.remove(), 5000);
    };

    index = 0;
    code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    keyCheck = (ev) => {
      const lt = this.lichessTools;
      if (ev.code == this.code[this.index]) {
        this.index++;
        if (this.index > 7) ev.preventDefault();
      } else
        if (ev.code == this.code[0]) {
          this.index = 1;
        } else {
          this.index = 0;
        }
      if (this.index == 10) {
        this.index = 0;
        this.enableCheat();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('konami');
      lt.global.document.removeEventListener('keydown', this.keyCheck, { capture: true });
      if (!value) return;
      lt.global.document.addEventListener('keydown', this.keyCheck, { capture: true });
    }

  }
  LiChessTools.Tools.Konami = KonamiTool;
})();
