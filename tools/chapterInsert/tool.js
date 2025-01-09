(() => {
  class ChapterInsertTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitChapterChange'];

    preferences = [
      {
        name: 'chapterInsert',
        category: 'study',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.chapterInsert': 'Insert new chapter after current one',
        'chapterInsertText': 'Create after current',
        'chapterInsertTitle': 'LiChess Tools - create chapter after current chapter'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.chapterInsert': 'Insereaz\u0103 capitole noi dup\u0103 cel curent',
        'chapterInsertText': 'Creeaz\u0103 dup\u0103 capitolul curent',
        'chapterInsertTitle': 'LiChess Tools - creeaz\u0103 capitol dup\u0103 cel curent'
      }
    }

    setupButtons = async (studyId) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('div.dialog-content div.form-actions');
      if (!container.length) return;
      const study = lichess.analysis.study;
      const allChapters = study.chapters.list.all();
      const currentChapter = study.currentChapter();
      const isLast = (currentChapter === allChapters.at(-1));
      const button = $('button.lichessTools-chapterInsert', container);
      if (button.length) {
        if (isLast) {
          container.addClass('single');
          button.remove();
        }
        return;
      } else {
        if (isLast) {
          return;
        }
      }
      container.removeClass('single');
      $('<button type="submit" class="button lichessTools-chapterInsert">')
        .on('click', (ev) => {
          this.chapterData = {
            chapters: allChapters,
            current: currentChapter
          };
        })
        .text(trans.noarg('chapterInsertText'))
        .attr('title', trans.noarg('chapterInsertTitle'))
        .prependTo(container);
    };

    onChapterAdd = (newChapterId) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const study = lichess.analysis.study;
      const chapters = study.chapters.list.all();
      if (!chapters || !this.chapterData) return;
      const newOrder = chapters.map(c => c.id).filter(id => id != newChapterId);
      const index = newOrder.findIndex(id => id == this.chapterData.current.id);
      if (index < 0 || index == chapters.length - 1) return;
      newOrder.splice(index + 1, 0, newChapterId);
      const chapterEl = $('div.study__chapters button.draggable[data-id="' + newChapterId + '"]');
      if (!chapterEl.length) return;
      chapterEl
        .insertAfter('div.study__chapters button.draggable[data-id="' + this.chapterData.current.id + '"]');
      lt.scrollIntoViewIfNeeded(chapterEl);
      setTimeout(()=>{
        study.chapters.sort(newOrder);
      },1000);

      this.chapterData = null;
    };

    onChapterChange = (chapterId)=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const study = lichess.analysis.study;
      if (this._prevChapters.includes(chapterId)) return;
      this._prevChapters = study.chapters.list.all().map(c=>c.id);
      this.onChapterAdd(chapterId);
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('chapterInsert');
      this.logOption('Chapter insert', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const lichess = lt.lichess;
      const $ = lt.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      study.chapters.newForm.toggle = lt.unwrapFunction(study.chapters.newForm.toggle, 'chapterInsert');
      $('div.dialog-content div.form-actions button.lichessTools-chapterInsert').remove();
      $('div.dialog-content div.form-actions').addClass('single');
      lt.pubsub.off('lichessTools.chapterChange',this.onChapterChange);
      if (!value) return;

      this._prevChapters = study.chapters.list.all().map(c=>c.id);
      lt.pubsub.on('lichessTools.chapterChange',this.onChapterChange);

      study.chapters.newForm.toggle = lt.wrapFunction(study.chapters.newForm.toggle, {
        id: 'chapterInsert',
        after: ($this, result, data) => {
          const interval = lt.global.setInterval(() => {
            const input = $('#chapter-name');
            if (!input.length) return;
            lt.global.clearInterval(interval);
            this.setupButtons(study.data.id);
          }, 100);
        }
      });
    }

  }
  LiChessTools.Tools.ChapterInsert = ChapterInsertTool;
})();
