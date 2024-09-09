(() => {
  class ChapterNameFromTagsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties'];

    preferences = [
      {
        name: 'chapterNameFromTags',
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
        'options.chapterNameFromTags': 'Change chapter name from PGN tags',
        'changeNameToText': ' "%s"',
        'changeNameToTitle': 'LiChess Tools - Easy change name'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.chapterNameFromTags': 'Schimb\u0103 numele capitolului din taguri PGN',
        'changeNameToText': ' "%s"',
        'changeNameToTitle': 'LiChess Tools - Schimb\u0103 u\u015For numele'
      }
    }

    setupButtons = async (studyId, chapterId) => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const pgn = await parent.api.study.getChapterPgn(studyId, chapterId);
      if (!pgn) return;
      const trans = parent.translator;
      const event = parent.getPgnTag(pgn, 'Event');
      const white = parent.getPgnTag(pgn, 'White');
      const black = parent.getPgnTag(pgn, 'Black');
      const target = $('#chapter-name').closest('.form-group');
      $('.lichessTools-changeNameButton', target).remove();
      const chapterName = $('#chapter-name').val();
      if (event?.trim()) {
        let text = event;
        const studyName = lichess.analysis.study.data.name;
        if (studyName && text.startsWith(studyName + ':')) {
          text = text.slice(studyName.length + 1).trim();
        }
        if (text != chapterName) {
          const eventButton = $('<button type="button" class="button button-empty">')
            .addClass('lichessTools-changeNameButton')
            .text(trans.pluralSame('changeNameToText', text))
            .attr('title', trans.noarg('changeNameToTitle'))
            .attr('data-icon', '\uE041')
            .on('click', ev => {
              ev.preventDefault();
              $('#chapter-name').val(text)[0].select();
            });
          target.append(eventButton);
        }
      }
      if (white?.trim() && black?.trim()) {
        const text = white + ' - ' + black;
        if (text != chapterName) {
          const namesButton = $('<button type="button" class="button button-empty">')
            .addClass('lichessTools-changeNameButton')
            .text(trans.pluralSame('changeNameToText', text))
            .attr('title', trans.noarg('changeNameToTitle'))
            .attr('data-icon', '\uE041')
            .on('click', ev => {
              ev.preventDefault();
              $('#chapter-name').val(text)[0].select();
            });
          target.append(namesButton);
        }
      }
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('chapterNameFromTags');
      this.logOption('Chapter name from tags', value);
      if (!parent.getUserId()) {
        parent.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const lichess = parent.lichess;
      const $ = parent.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      study.chapters.editForm.toggle = parent.unwrapFunction(study.chapters.editForm.toggle, 'chapterNameFromTags');
      if (!value) return;
      study.chapters.editForm.toggle = parent.wrapFunction(study.chapters.editForm.toggle, {
        id: 'chapterNameFromTags',
        after: ($this, result, data) => {
          const interval = parent.global.setInterval(() => {
            const input = $('#chapter-name');
            if (!input.length) return;
            parent.global.clearInterval(interval);
            this.setupButtons(study.data.id, data.id);
          }, 100);
        }
      });
    }

  }
  LiChessTools.Tools.ChapterNameFromTags = ChapterNameFromTagsTool;
})();
