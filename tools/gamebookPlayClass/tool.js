(() => {
  class GamebookPlayClassTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitChapterChange'];

    preferences = [
      {
        name: 'gamebookPlayClass',
        category: 'study',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.gamebookPlayClass': 'Add CSS class with playing interactive'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.gamebookPlayClass': 'Clas\u0103 CSS c\u00e2nd joci interactiv'
      }
    }

    setCssClass = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const study = lichess.analysis?.study;
      const $ = lt.$;
      if (!study) return;
      if (study.relay) return;
      const override = study.vm.gamebookOverride;
      const cls = 'lichessTools-gamebook-' + override;
      const all = ['lichessTools-gamebook-play', 'lichessTools-gamebook-analyse']
      $.cached('body').removeClass(all.filter(c => c != cls).join(' '));
      if (override) {
        $.cached('body').addClass(cls);
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('gamebookPlayClass');
      this.logOption('Gamebook CSS class', value);
      const lichess = lt.lichess;
      const study = lichess?.analysis?.study;
      if (!study) return;
      lt.pubsub.off('lichessTools.chapterChange', this.setCssClass);
      study.setGamebookOverride = lt.unwrapFunction(study.setGamebookOverride, 'gamebookPlayClass');
      if (value) {
        study.setGamebookOverride = lt.wrapFunction(study.setGamebookOverride, {
          id: 'gamebookPlayClass',
          after: this.setCssClass
        })
        lt.pubsub.on('lichessTools.chapterChange', this.setCssClass);
        this.setCssClass();
      }
    }

  }
  LiChessTools.Tools.GamebookPlayClass = GamebookPlayClassTool;
})();
