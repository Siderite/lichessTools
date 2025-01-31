(() => {
  class PlayWheelTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'playWheel',
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
        'options.playWheel': 'Mouse wheel during game play'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.playWheel': 'Roti\u0163\u0103 mouse \u00een timpul jocului'
      }
    };

    scrollTotal = 0;
    wheel = (ev)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.options.enabled || !$.cached('body').is('.playing')) return;
      this.scrollTotal += ev.deltaY * (ev.deltaMode ? 40 : 1);
      if (Math.abs(this.scrollTotal) >= 4) {
        const icon = ev.deltaY > 0
          ? lt.icon.JumpNext
          : lt.icon.JumpPrev;
        const button = $.cached('.round__app .buttons button.fbt[data-icon="'+icon+'"], .round__app rb1 button.fbt[data-icon="'+icon+'"]');
        if (!button.prop('disabled')) {
          button
            .trigger('mousedown')
            .prop('disabled',true);
        }
        this.scrollTotal = 0;
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('playWheel');
      this.logOption('Play mouse wheel', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      this.options = {
        enabled: value
      };
      const isRound = !!$('main.round,main.puzzle').length;
      if (!isRound) return;
      $('body').off('wheel',this.wheel);
      if (this.options.enabled) {
        $('body').on('wheel',this.wheel);
      }
    }

  }
  LiChessTools.Tools.PlayWheel = PlayWheelTool;
})();
