(()=>{
  class ChapterNavigationTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange'];

    preferences=[
      {
        name:'chapterNavigation',
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
        'options.chapterNavigation': 'Study chapter navigation controls',
        'chapterControlsTitle': 'LiChess Tools - chapter navigation'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.chapterNavigation': 'Butoane navigare pentru capitole de studiu',
        'chapterControlsTitle': 'LiChess Tools - navigare capitole'
      }
    }

    refreshChapterControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const study=parent.lichess.analysis?.study;
      if (!study) return;
      const trans=parent.translator;
      const list=study.chapters.list();
      let container=$('div.study__side div[role="footer"]');
      if (!container.length&&list.length>1) {
        container=$(`<div role="footer">
          <button class="fbt" data-act="first" data-icon="&#x219E;"/>
          <button class="fbt" data-act="prev" data-icon="&#x2190;"/>
          <button class="fbt" data-act="random" data-icon="&#x21AF;"/>
          <button class="fbt" data-act="next" data-icon="&#x2192;"/>
          <button class="fbt" data-act="last" data-icon="&#x21A0;"/>
        </div>`)
          .on('click',this.actionChapterControls)
          .attr('title',trans.noarg('chapterControlsTitle'))
          .insertAfter('div.study__side .study__chapters');
        $('div.study__side').addClass('lichessTools-chapterControls');
      }
      const chapter=study.currentChapter();
      const index=chapter
        ? list.findIndex(c=>c.id==chapter.id)
        : 0;
      $('button[data-act="first"]',container).toggleClass('disabled',index==0); 
      $('button[data-act="prev"]',container).toggleClass('disabled',index==0); 
      $('button[data-act="random"]',container).toggleClass('disabled',list.length==1); 
      $('button[data-act="next"]',container).toggleClass('disabled',index==list.length-1); 
      $('button[data-act="last"]',container).toggleClass('disabled',index==list.length-1); 
    };

    actionChapterControls=(ev)=>{
      ev.preventDefault();
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      const $=parent.$;
      const study=parent.lichess.analysis?.study;
      if (!study) return;
      const chapterId=study.currentChapter().id;
      const list=study.chapters.list();
      let index=list.findIndex(c=>c.id==chapterId);
      const act=$(ev.target).attr('data-act');
      switch(act) {
        case 'first': index=0; break;
        case 'prev': index--; break;
        case 'random':
          let newIndex=0;
          do {
            newIndex=Math.floor(Math.random()*list.length);
          } while(newIndex==index);
          index=newIndex;
        break;
        case 'next': index++; break;
        case 'last': index=list.length-1; break;
      }
      const chapter=list[index];
      if (chapter) study.setChapter(chapter.id);
    };

    debouncedRefreshChapterControls=this.lichessTools.debounce(this.refreshChapterControls,100);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('chapterNavigation');
      this.logOption('Study chapter navigation', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const study=lichess?.analysis?.study;
      if (!study) return;
      lichess.pubsub.off('chapterChange',this.debouncedRefreshChapterControls);
      lichess.pubsub.off('redraw',this.debouncedRefreshChapterControls);
      lichess.pubsub.off('chat.resize',this.debouncedRefreshChapterControls);
      $('div.study__side.lichessTools-chapterControls').removeClass('lichessTools-chapterControls').find('div[role="footer"]').remove();
      if (!value) return;
      lichess.pubsub.on('chapterChange',this.debouncedRefreshChapterControls);
      lichess.pubsub.on('redraw',this.debouncedRefreshChapterControls);
      lichess.pubsub.on('chat.resize',this.debouncedRefreshChapterControls);
      this.refreshChapterControls();
    }

  }
  LiChessTools.Tools.ChapterNavigation=ChapterNavigationTool;
})();
