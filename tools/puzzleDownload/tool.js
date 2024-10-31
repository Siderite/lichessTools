(() => {
  class PuzzleDownloadTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['ChessOps', 'EmitRedraw', 'Dialog']

    preferences = [
      {
        name: 'puzzleDownload',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.puzzleDownload': 'Download PGN for puzzles',
        'puzzlePgnButtonTitle': 'Puzzle PGN',
        'PGNCopiedToClipboard': 'PGN copied to clipboard',
        'clipboardDenied': 'Clipboard access denied'

      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.puzzleDownload': 'Desc\u0103rcare PGN pentru probleme de \u015fah',
        'puzzlePgnButtonTitle': 'PGN-ul problemei de \u015fah',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'clipboardDenied': 'Acces refuzat la clipboard'
      }
    }

    showPuzzlePgn=async (puzzleId)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const co = lt.chessops;
      const { makePgn, parsePgn, startingPosition } = co.pgn;
      const { makeFen } = co.fen;
      const { parseSan, makeSanAndPlay } = co.san;
      const { parseUci } = co;
      const puzzle = await lt.api.puzzle.getPuzzle(puzzleId);
      const sans = puzzle.game.pgn.split(' ');
      const game = parsePgn('*')[0];
      let pos = startingPosition(game.headers).unwrap();
      for (let i=0; i<=puzzle.puzzle.initialPly; i++) {
        const move = parseSan(pos, sans[i]);
        pos.play(move);
      }
      const fen = makeFen(pos.toSetup());
      game.headers.set('FEN',fen);
      game.headers.set('SetUp','1');
      let node = game.moves;
      pos = startingPosition(game.headers).unwrap();
      for (const uci of puzzle.puzzle.solution) {
        const move = parseUci(uci);
        const san = makeSanAndPlay(pos, move);
        node.children.push({
          data: { san: san },
          children: []
        });
        node = node.children[0];
      }
      game.headers.set('Event','Puzzle #'+puzzleId);
      game.headers.set('Themes',puzzle.puzzle.themes.join(', '));
      game.headers.delete('Site');
      game.headers.delete('Date');
      game.headers.delete('Round');
      game.headers.delete('White');
      game.headers.delete('Black');
      game.headers.delete('Result');
      const pgn = makePgn(game);
      const content = $('<div class="lichessTools-puzzleDownload"><textarea readonly></textarea><button type="button" class="copyPgn"/></div>');
      const dlg=lt.dialog({
        html: content[0].outerHTML
      });
      const textarea = $('textarea',dlg);
      textarea.val(pgn);
      $('button.copyPgn',dlg)
        .attr('data-icon','\uE070')
        .on('click',async ev=>{
          ev.preventDefault();
          const { selectionStart, selectionEnd } = textarea[0];
          const result = selectionStart == selectionEnd ? textarea.val() : textarea.val().slice(selectionStart, selectionEnd);
          dlg.close();
          lt.writeToClipboard(result, trans.noarg('PGNCopiedToClipboard'), trans.noarg('clipboardDenied'));
        });
      dlg.showModal();
    };

    handlePuzzleLinks=()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const puzzleLinks = $('.infos.puzzle a[href^="/training/"]')
        .each((i,e)=>{
          if ($(e).next('.lichessTools-puzzleDownload').length) return;
          const href = $(e).attr('href');
          if (!href) return;
          const m = /^\/training\/(?<id>\w+)$/.exec(href);
          if (!m) return;
          const puzzleId = m.groups.id;
          if ('#'+puzzleId != $(e).text()) return;
          $('<button type="button" class="lichessTools-puzzleDownload">')
            .attr('data-icon','\uE024')
            .attr('title',trans.noarg('puzzlePgnButtonTitle'))
            .on('click',ev=>{
              ev.preventDefault();
              this.showPuzzlePgn(puzzleId);
            })
            .insertAfter(e);
        });
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('puzzleDownload');
      this.logOption('Puzzle download', value);
      const lichess = lt.lichess;
      $('button.lichessTools-puzzleDownload').remove();
      lt.pubsub.off('lichessTools.redraw', this.handlePuzzleLinks);
      if (!value) return;
      lt.pubsub.on('lichessTools.redraw', this.handlePuzzleLinks);
      this.handlePuzzleLinks();
    }

  }
  LiChessTools.Tools.PuzzleDownload = PuzzleDownloadTool;
})();
