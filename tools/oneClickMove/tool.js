(() => {
  class OneClickMoveTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['ExtendedInteractiveLesson'];

    preferences = [
      {
        name: 'oneClickMove',
        category: 'analysis',
        type: 'multiple',
        possibleValues: [/*'play',*/'analysis', 'onlyOrientation', 'moveFromPgn'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.oneClickMove': 'One click move',
        'oneClickMove.analysis': 'Analysis/Study',
        'oneClickMove.play': 'Play/Puzzles',
        'oneClickMove.onlyOrientation': 'Only orientation side',
        'oneClickMove.moveFromPgn': 'Move from PGN'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.oneClickMove': 'Mutare cu un singur click',
        'oneClickMove.analysis': 'Analiz\u0103/Studiu',
        'oneClickMove.play': 'Joc/Puzzle-uri',
        'oneClickMove.onlyOrientation': 'Doar juc\u0103torul orient\u0103rii',
        'oneClickMove.moveFromPgn': 'Mi\u015Fc\u0103ri din PGN'
      }
    }

    _cache = new Map();
    getDests = async (board, fen, variant) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess.analysis;
      const key = fen + '/' + variant;
      let destMan = analysis?.chessground.state?.movable?.dests || this._cache.get(key);
      if (!destMan) {
        lichess.socket.send('anaDests', { variant: variant, fen: fen, path: key });
        while (!destMan) {
          await lt.timeout(10);
          destMan = this._cache.get(key);
        }
      }
      return destMan;
    };

    flash = async (sources) => {
      const lt = this.lichessTools;
      sources.addClass('lichessTools-flash');
      await lt.timeout(500);
      sources.removeClass('lichessTools-flash');
    };

    getVariant = (main) => {
      const variants = [//'standard',
        'chess960',
        'antichess',
        //'fromPosition'
        'kingOfTheHill',
        'threeCheck',
        'atomic',
        'horde',
        'racingKings',
        'crazyhouse'];
      for (const variant of variants) {
        if (main.is('.variant-' + variant)) return variant;
      }
      return 'standard';
    };

    boardClick = async (ev) => {
      if (ev.which > 1 || ev.shiftKey) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess.analysis;
      if (!(this.options.analysis && analysis) && !(this.options.play && !analysis)) return; //TODO better play detection
      if (!ev.x && !ev.y) return;
      const board = $('div.main-board cg-board');
      if (!board.length) return;
      if ($('square.selected', board).length) return;
      const rect = board[0].getBoundingClientRect();
      const [x, y] = [ev.x - rect.x, ev.y - rect.y];
      const variant = this.getVariant(board.closest('div.round__app, main'));
      const orientation = board.closest('.cg-wrap').is('.orientation-black') ? 'black' : 'white';
      const fen = lt.getPositionFromBoard(board.closest('cg-container'), true);
      const turn = / b\b/.test(fen) ? 'black' : 'white';
      if (this.options.onlyOrientation && orientation != turn) return;
      const getSquare = orientation == 'white'
        ? res => String.fromCharCode(97 + res.x) + (8 - res.y)
        : res => String.fromCharCode(104 - res.x) + (res.y + 1);
      const width = board.width() / 8;
      const res = {
        x: Math.floor(x / width),
        y: Math.floor(y / width)
      };
      const square = getSquare(res);
      const destMan = await this.getDests(board, fen, variant);
      if (!destMan) return;
      let pieceExists = false;
      const sources = $('piece.' + turn, board)
        .filter((i, e) => {
          const sq = e.cgKey;
          if (!sq) return false;
          if (sq == square) {
            pieceExists = true;
          }
          const dests = destMan.get(sq);
          return dests?.includes(square);
        });
      if (pieceExists) return;
      let uci = '';
      if (sources.length == 1) {
        uci = sources[0].cgKey + square;
      } else {
        this.flash(sources);
        if (analysis && this.options.moveFromPgn) {
          if (lt.isGamePlaying()) return false;
          const gp = analysis.gamebookPlay();
          if (gp && !analysis.study?.members?.canContribute()) return false;
          const nextMoves = lt.getNextMoves(analysis.node, gp?.threeFoldRepetition)
            .filter(c => !lt.isPermanentNode || lt.isPermanentNode(c))
            .map(c => {
              if (c.san?.startsWith('O-O')) {
                switch (c.uci?.slice(-2)) {
                  case 'h1': return c.uci.slice(0, 2) + 'g1';
                  case 'a1': return c.uci.slice(0, 2) + 'c1';
                  case 'h8': return c.uci.slice(0, 2) + 'g8';
                  case 'a8': return c.uci.slice(0, 2) + 'c8';
                }
              }
              return c.uci;
            })
            .filter(u => u.endsWith(square));
          if (nextMoves.length != 1) return;
          uci = nextMoves[0];
        }
      }
      if (uci) {
        ev.preventDefault();
        if (analysis) {
          lt.global.setTimeout(() => analysis.playUci(uci), 50);
        } else {
          this.playUci(uci, board, orientation);
        }
      }
    };

    getCoords = (square, board, orientation) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const coords = orientation == 'white'
        ? { x: square.charCodeAt(0) - 97, y: 8 - (+square[1]) }
        : { x: 104 - square.charCodeAt(0), y: (+square[1]) - 1 };
      const q = board.width() / 8;
      const offset = board.offset();
      const win = lt.global;
      return { x: offset.left - win.scrollX + coords.x * q + q / 2, y: offset.top - win.scrollY + coords.y * q + q / 2 };
    };

    playUci = async (uci, board, orientation) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const mousedown = lt.getEventHandlers(board[0], 'mousedown')[0];
      if (!mousedown) return;
      let coords = this.getCoords(uci.slice(0, 2), board, orientation);
      const fauxEv = { isTrusted: true, button: 0, clientX: coords.x, clientY: coords.y, preventDefault: () => { } };
      mousedown(fauxEv);
      board.trigger('mouseup');
      await lt.timeout(50);
      if ($('square.selected', board).length) {
        coords = this.getCoords(uci.slice(-2), board, orientation);
        fauxEv.clientX = coords.x;
        fauxEv.clientY = coords.y;
        mousedown(fauxEv);
      }
    };

    unpackDests = (lines) => {

      const uciValue = (ch) => {
        if (ch == '!') return 62;
        if (ch == '?') return 63;
        if (ch >= 'a' && ch <= 'z') {
          return ch.charCodeAt(0) - 97;
        }
        if (ch >= 'A' && ch <= 'Z') {
          return ch.charCodeAt(0) - 39;
        }
        if (ch >= '0' && ch <= '9') {
          return ch.charCodeAt(0) + 4;
        }
        throw new Error('Could not decode uci value ' + ch);
      };

      const uciChar = (ch) => {
        const x = uciValue(ch);
        return String.fromCharCode(97 + x % 8) + String.fromCharCode(49 + x / 8);
      };

      const dests = new Map();
      if (lines) {
        for (const line of lines.split(' ')) {
          dests.set(
            uciChar(line[0]),
            line
              .slice(1)
              .split('')
              .map(c => uciChar(c)),
          );
        }
      }
      return dests;
    };

    handleBoard = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const board = $('div.main-board cg-board')[0];
      if (!board) return;
      if (!board.lichessTools_oneClickMove) {
        board.addEventListener('mousedown', this.boardClick, { capture: true });
        board.lichessTools_oneClickMove = true;
      }
      if (lichess.socket?.handle && !lt.isWrappedFunction(lichess.socket.handle, 'oneClickMove')) {
        lichess.socket.handle = lt.wrapFunction(lichess.socket.handle, {
          id: 'oneClickMove',
          before: ($this, e) => {
            if (e.t == 'dests') {
              const dests = this.unpackDests(e.d.dests);
              const fen = e.d.path;
              this._cache.set(fen, dests);
            }
          }
        });
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('oneClickMove');
      this.logOption('One click move', value || 'no');
      const analysis = lichess.analysis;
      this.options = {
        analysis: lt.isOptionSet(value, 'analysis'),
        play: lt.isOptionSet(value, 'play'),
        onlyOrientation: lt.isOptionSet(value, 'onlyOrientation'),
        moveFromPgn: lt.isOptionSet(value, 'moveFromPgn')
      };
      const board = $('div.main-board cg-board')[0];
      if (board) {
        board.removeEventListener('mousedown', this.boardClick, { capture: true });
        board.lichessTools_oneClickMove = false;
      }
      lt.global.clearInterval(this.interval);
      if (lichess.socket?.handle) {
        lichess.socket.handle = lt.unwrapFunction(lichess.socket.handle, 'oneClickMove');
      }
      if ((analysis && this.options.analysis) || ($('main.round,main.puzzle').length && this.options.play)) {
        this.interval = lt.global.setInterval(this.handleBoard, 1000);
        this.handleBoard();
      }
    }

  }
  LiChessTools.Tools.OneClickMove = OneClickMoveTool;
})();
