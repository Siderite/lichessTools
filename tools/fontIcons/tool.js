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

    loadLtFont = async ()=> {
      const lt = this.lichessTools;
      const $ = lt.$;
      const fontUrl = await lt.comm.getChromeUrl("tools/fontIcons/lichessTools.woff2");
      const face = new FontFace("lichessTools", `url(${fontUrl})`,{ display: 'block' });

      const loaded = await face.load();
      if (loaded) {
        lt.global.document.fonts.add(loaded);
        $('body').toggleClassSafe('lichessTools-fontIcons',true);
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('fontIcons');
      this.logOption('Font icons', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      $('body').toggleClassSafe('lichessTools-fontIcons',false);
      if (value) {
        const fontExists = [...lt.global.document.fonts].find(f=>['lichess','lichessTools'].includes(f.family));
        if (!fontExists) {
          await this.loadLtFont();
        }
      }
    }

  }
  LiChessTools.Tools.FontIcons = FontIconsTool;
})();
