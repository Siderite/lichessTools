(()=>{
  class StickyPreviewTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange'];

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
      return parent.storage.get('LichessTools.previousOverride',{ raw: true })||'analyse';
    }

    set previousOverride(value) {
      const parent=this.lichessTools;
      parent.storage.set('LichessTools.previousOverride',value,{ raw: true });
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
        parent.global.setTimeout(()=>{
          study.setGamebookOverride('play');
          study.redraw();
        },100);
      }
    };

    bindButtons=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const study=lichess.analysis?.study;
      if (!study) return;
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
      lichess.pubsub.off('lichessTools.redraw', this.bindButtons);
      lichess.pubsub.off('lichessTools.chapterChange', this.keepPreviewOn);
      if (value) {
        lichess.pubsub.on('lichessTools.redraw', this.bindButtons);
        lichess.pubsub.on('lichessTools.chapterChange', this.keepPreviewOn);
        this.keepPreviewOn();
      }
    }

  }
  LiChessTools.Tools.StickyPreview=StickyPreviewTool;
})();
