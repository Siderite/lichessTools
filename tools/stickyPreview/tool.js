(()=>{
  class StickyPreviewTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'stickyPreview',
        category: 'study',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.stickyPreview': 'Sticky study Preview mode'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.stickyPreview': 'Mod Preview persistent'
      }
    }

    get previousOverride() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      return lichess?.storage?.get('LichessTools.previousOverride')||'analyse';
    }

    set previousOverride(value) {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!lichess) return;
      lichess.storage.set('LichessTools.previousOverride',value);
    }

    previewHandler=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const study=lichess.analysis?.study;
      this.previousOverride=study?.vm?.gamebookOverride;
    };

    keepPreviewOn=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const study=lichess.analysis?.study;
      const $=parent.$;
      if (!study) return;
      const override=study.vm.gamebookOverride;
      if (this.previousOverride=='play' && override!=this.previousOverride) {
        study.setGamebookOverride('play');
        study.redraw();
      }
      const previewButton=$('button.preview');
      previewButton.off('click',this.previewHandler);
      previewButton.on('click',this.previewHandler);
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('stickyPreview');
      this.logOption('Sticky study Preview when switching chapters', value);
      const lichess=parent.lichess;
      const study=lichess?.analysis?.study;
      if (!study) return;
      lichess.pubsub.off('chapterChange', this.keepPreviewOn);
      if (value) {
        lichess.pubsub.on('chapterChange', this.keepPreviewOn);
        this.keepPreviewOn();
      }
    }

  }
  LiChessTools.Tools.StickyPreview=StickyPreviewTool;
})();
