(()=>{
  class ChapterInsertTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitChapterChange'];

    preferences=[
      {
        name:'chapterInsert',
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
        'options.chapterInsert': 'Insert new chapter after current one',
        'chapterInsertText': 'Create after current',
        'chapterInsertTitle': 'LiChess Tools - create chapter after current chapter'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.chapterInsert': 'Insereaz\u0103 capitole noi dup\u0103 cel curent',
        'chapterInsertText': 'Creaz\u0103 dup\u0103 capitolul curent',
        'chapterInsertTitle': 'LiChess Tools - creaz\u0103 capitol dup\u0103 cel curent'
      }
    }

    setupButtons=async (studyId)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const container=$('div.dialog-content div.form-actions');
      if (!container.length) return;
      const button=$('button.lichessTools-chapterInsert',container);
      if (button.length) return;
      const study=lichess.analysis.study;
      container.removeClass('single');
      $('<button type="submit" class="button lichessTools-chapterInsert">')
        .on('click',(ev)=>{
          this.chapterData={
            chapters:study.chapters.list.all(),
            current:study.currentChapter()
          };
        })
        .text(trans.noarg('chapterInsertText'))
        .attr('title',trans.noarg('chapterInsertTitle'))
        .prependTo(container);
    };

    onChapterChange=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const study=lichess.analysis.study;
      const chapters=this.chapterData?.chapters;
      if (!chapters) return;
      const current=study.currentChapter();
      if (current && !chapters.find(c=>c.id && c.id==current?.id)) {
        const newOrder=chapters.map(c=>c.id);
        const index=newOrder.findIndex(id=>id==this.chapterData.current.id);
        if (index<0||index==chapters.length-1) return;
        newOrder.splice(index+1,0,current.id);
        study.makeChange('sortChapters',newOrder);
        setTimeout(()=>$('div.study__chapters div.draggable.active')[0]?.scrollIntoViewIfNeeded(),500);
      }
      this.chapterData=null;
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('chapterInsert');
      this.logOption('Chapter insert', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const study=lichess?.analysis?.study;
      if (!study) return;
      study.chapters.newForm.toggle=parent.unwrapFunction(study.chapters.newForm.toggle,'chapterInsert');
      $('div.dialog-content div.form-actions button.lichessTools-chapterInsert').remove();
      $('div.dialog-content div.form-actions').addClass('single');
      lichess.pubsub.off('chapterChange',this.onChapterChange);
      if (!value) return;
      lichess.pubsub.on('chapterChange',this.onChapterChange);
      study.chapters.newForm.toggle=parent.wrapFunction(study.chapters.newForm.toggle,{
        id:'chapterInsert',
        after:($this,result,data)=>{
          const interval=parent.global.setInterval(()=>{
            const input=$('#chapter-name');
            if (!input.length) return;
            parent.global.clearInterval(interval);
            this.setupButtons(study.data.id);
          },100);
        }
      });
    }

  }
  LiChessTools.Tools.ChapterInsert=ChapterInsertTool;
})();
