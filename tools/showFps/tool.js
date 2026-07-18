(() => {
  class ShowFpsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'showFps',
        category: 'general',
        type: 'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.showFps': 'Show FPS'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.showFps': 'Afi\u015feaz\u0103 FPS'
      }
    }

    tick = (now)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.options.enabled) return;
      this.frames++;
      const elapsed = now - this.last;
      if (!this.last || elapsed >= 1000) {
        const fps = (this.frames * 1000) / elapsed;
        if (fps != this.fps) {
          this.fps = fps || 0;
          this.elem?.textSafe(Math.round(this.fps)||'');
        }
        this.frames = 0;
        this.last = now;
      }
      lt.global.requestAnimationFrame(this.tick);
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('showFps');
      this.logOption('Show FPS', value);
      this.options = {
        enabled: !!value
      };
      this.elem = null;
      $('.lichessTools-showFps').remove();
      if (!value) return;
      this.elem = $('<div class="lichessTools-showFps">')
        .appendTo('body');
      requestAnimationFrame(this.tick);
    }
  }
  LiChessTools.Tools.ShowFps = ShowFpsTool;
})();
