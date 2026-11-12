(() => {
  class StickyPreviewTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitChapterChange'];

    preferences = [
      {
        name: 'stickyPreview',
        category: 'study',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.stickyPreview': 'Sticky study Preview mode'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.stickyPreview': 'Mod Preview persistent'
      }
    }

    get previousOverride() {
      const lt = this.lichessTools;
      return lt.storage.get('LiChessTools.previousOverride', { raw: true }) || 'analyse';
    }

    set previousOverride(value) {
      const lt = this.lichessTools;
      lt.storage.set('LiChessTools.previousOverride', value, { raw: true });
    }

    keepPreviewOn = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const study = lichess.analysis?.study;
      if (!study) return;
      const override = study.vm.gamebookOverride;
      if (this.previousOverride == 'play' && override != this.previousOverride) {
        lt.global.setTimeout(() => {
          study.setGamebookOverride('play');
          lt.analysisRedraw();
        }, 100);
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('stickyPreview');
      this.logOption('Sticky study Preview when switching chapters', value);
      const lichess = lt.lichess;
      const study = lichess?.analysis?.study;
      if (!study) return;
      study.setGamebookOverride = lt.unwrapFunction(study.setGamebookOverride,'stickyPreview');
      lt.pubsub.off('lichessTools.chapterChange', this.keepPreviewOn);
      if (value) {
        study.setGamebookOverride = lt.wrapFunction(study.setGamebookOverride,{
          id: 'stickyPreview',
          after: ($this, result, ...args)=>{
            this.previousOverride = study?.vm?.gamebookOverride;
          }
        });
        lt.pubsub.on('lichessTools.chapterChange', this.keepPreviewOn);
        this.keepPreviewOn();
      }
    }

  }
  LiChessTools.Tools.StickyPreview = StickyPreviewTool;
})();
