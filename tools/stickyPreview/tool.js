(() => {
  class StickyPreviewTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange'];

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
      return lt.storage.get('LichessTools.previousOverride', { raw: true }) || 'analyse';
    }

    set previousOverride(value) {
      const lt = this.lichessTools;
      lt.storage.set('LichessTools.previousOverride', value, { raw: true });
    }

    previewHandler = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const study = lichess.analysis?.study;
      this.previousOverride = study?.vm?.gamebookOverride;
    };

    keepPreviewOn = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const study = lichess.analysis?.study;
      const $ = lt.$;
      if (!study) return;
      const override = study.vm.gamebookOverride;
      if (this.previousOverride == 'play' && override != this.previousOverride) {
        lt.global.setTimeout(() => {
          study.setGamebookOverride('play');
          study.redraw();
        }, 100);
      }
    };

    bindButtons = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const study = lichess.analysis?.study;
      if (!study) return;
      const previewButton = $('button.preview');
      previewButton.off('click', this.previewHandler);
      previewButton.on('click', this.previewHandler);
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('stickyPreview');
      this.logOption('Sticky study Preview when switching chapters', value);
      const lichess = lt.lichess;
      const study = lichess?.analysis?.study;
      if (!study) return;
      lt.pubsub.off('lichessTools.redraw', this.bindButtons);
      lt.pubsub.off('lichessTools.chapterChange', this.keepPreviewOn);
      if (value) {
        lt.pubsub.on('lichessTools.redraw', this.bindButtons);
        lt.pubsub.on('lichessTools.chapterChange', this.keepPreviewOn);
        this.keepPreviewOn();
      }
    }

  }
  LiChessTools.Tools.StickyPreview = StickyPreviewTool;
})();
