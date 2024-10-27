(() => {
  class ChapterNameFromTagsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties', 'ChessOps'];

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
      let pgn = await parent.api.study.getChapterPgn(studyId, chapterId);
      if (!pgn) return;
      const trans = parent.translator;
      const event = parent.getPgnTag(pgn, 'Event');
      const white = parent.getPgnTag(pgn, 'White');
      const black = parent.getPgnTag(pgn, 'Black');
      const target = $('#chapter-name').closest('.form-group');
      $('.lichessTools-changeNameButton', target).remove();
      const chapterName = $('#chapter-name').val();
      const names = [];
      if (event?.trim()) {
        let text = event;
        const studyName = lichess.analysis.study.data.name;
        if (studyName && text.startsWith(studyName + ':')) {
          text = text.slice(studyName.length + 1).trim();
        }
        names.push(text);
      }
      if (white?.trim() && black?.trim()) {
        const text = white + ' - ' + black;
        names.push(text);
      }
      const co = parent.chessops;
      const { parsePgn } = co.pgn;
      const { parseFen } = co.fen;
      const game = parsePgn(pgn)[0];
      const fenText = game.headers.get('FEN');
      let ply = 1;
      if (fenText) {
        const fen = parseFen(fenText).unwrap();
        ply = fen.fullmoves*2;
        if (fen.turn == 'white') ply--;
      }   
      let node = game.moves;
      pgn = '';
      while (node.children.length==1 && ply<13) {
        node = node.children[0];
        if (ply%2==1) {
          pgn+=' '+Math.ceil(ply/2)+'.';
        } else {
          pgn+=' ';
        }
        pgn+=node.data.san;
        ply++;
      }
      names.push(pgn);
      if (node.children.length && ply<13) {
        let child = node.children[0];
        if (ply%2==1) {
          pgn+=' '+Math.ceil(ply/2)+'.';
        } else {
          pgn+=pgn?' ':(' '+Math.ceil(ply/2)+'... ');
        }
        pgn+=child.data.san;
        for (let i=1; i<node.children.length && i<10; i++) {
          child = node.children[i];
          pgn+=' (';
          if (ply%2==1) {
            pgn+=' '+Math.ceil(ply/2)+'.';
          } else {
            pgn+=' '+Math.ceil(ply/2)+'... ';
          }
          pgn+=child.data.san;
          pgn+=')';
        }
      }
      names.push(pgn);
      for (const text of new Set(names)) {
        if (!text || text == chapterName) continue;
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
