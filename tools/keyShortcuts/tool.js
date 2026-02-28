(() => {
  class KeyShortcutsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'keyShortcuts',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.keyShortcuts': 'Extra key shortcuts',
        'FENCopiedToClipboard': 'FEN copied to clipboard',
        'ImageCopiedToClipboard': 'Image copied to clipboard',
        'clipboardDenied': 'Clipboard access denied'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.keyShortcuts': 'Combina\u0163ii de taste \u00een plus',
        'FENCopiedToClipboard': 'FEN copiat \u00een clipboard',
        'ImageCopiedToClipboard': 'Imagine copiat\u0103 \u00een clipboard',
        'clipboardDenied': 'Acces refuzat la clipboard'
      }
    }

    clearMoveMode = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const g = lt.global;
      g.clearTimeout(this.makeMoveTimeout);
      this.makeMoveMode = null;
      $.cached('body').removeClass('lichessTools-keyMode-pgn lichessTools-keyMode-ceval lichessTools-keyMode-explorer lichessTools-keyMode-general');
    };

    prepareMove = (mode) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const g = lt.global;
      this.clearMoveMode();
      switch (mode) {
        case 'pgn': {
          const moves = $('div.analyse__tools div.analyse__fork move');
          if (!moves.length) return;
        }
          break;
        case 'ceval': {
          const analysis = lt.lichess.analysis;
          if (!analysis?.ceval || !analysis?.cevalEnabled()) return;
        }
          break;
        case 'explorer': {
          const moves = $('.explorer-box:not(.loading) .moves tbody tr');
          if (!moves.length) return;
        }
          break;
        case 'general':
          break;
        default:
          g.console.warn('Unknown key move mode', mode);
          return;
      }
      this.makeMoveMode = mode;
      $.cached('body').addClass('lichessTools-keyMode-' + mode);
      this.makeMoveTimeout = g.setTimeout(this.clearMoveMode, 1500);
    };

    handleDigitKey = (combo) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const g = lt.global;
      let index = +combo;
      if (!index) return;
      index--;
      if (!this.makeMoveMode && this.oldHandlers[combo]) {
        this.oldHandlers[combo]();
        return;
      }
      switch (this.makeMoveMode) {
        case 'pgn': {
          const moves = $('div.analyse__tools div.analyse__fork move');
          const move = moves[index];
          move?.click();
        }
          break;
        case 'ceval': {
          const analysis = lt.lichess.analysis;
          if (!analysis?.ceval || !analysis?.cevalEnabled()) return;
          const pvs = analysis?.node?.ceval?.pvs;
          if (!pvs || !pvs[index]) return;
          const uci = pvs[index].moves[0];
          if (uci) analysis.playUci(uci);
        }
          break;
        case 'explorer': {
          const analysis = lt.lichess.analysis;
          if (!analysis) return;
          const moves = $('.explorer-box:not(.loading) .moves tbody tr');
          const uci = moves.eq(index).attr('data-uci');
          if (uci) analysis.playUci(uci);
        }
          break;
        default:
          if (this.makeMoveMode) {
            g.console.warn('Unknown key move mode', this.makeMoveMode);
          }
          return;
      }
      this.clearMoveMode();
    };

    boardFrozen = false;
    freezeBoard = () => {
      const lt = this.lichessTools;
      if (this.makeMoveMode != 'general') {
        this.oldHandlers['f']();
        return;
      }
      this.clearMoveMode();
      this.boardFrozen = !this.boardFrozen;
      lt.pubsub.off('lichessTools.redraw',this.renderFreeze);
      if (this.boardFrozen) {
        lt.pubsub.on('lichessTools.redraw',this.renderFreeze);
      }
      this.renderFreeze();
    };
    renderFreeze = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const board = $('cg-container.lichessTools-freezeBoard');
      if (!this.boardFrozen) {
        board.remove();
        return;
      };
      if (!board.length) {
        $('cg-container')
          .clone()
          .addClass('lichessTools-freezeBoard')
          .appendTo('div.cg-wrap');
      }
    };

    handleHKey = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (this.makeMoveMode != 'general') {
        if (lt.tools.ExplorerPracticeTool.isRunning) {
          $('.lichessTools-hideExplorerMovesButton').trigger('click');
        } else {
          this.oldHandlers['h']();
        }
        return;
      }
      this.clearMoveMode();
      $('body')
        .toggleClass('lichessTools-hideSiteHeader');
    };

    randomChapter = () => {
      if (this.makeMoveMode != 'general') {
        this.oldHandlers['r']();
        return;
      }
      this.clearMoveMode();
      const lt = this.lichessTools;
      const $ = lt.$;
      const button = $('div.lichessTools-chapterControls button[data-act="random"]');
      button.trigger('click');
    };

    jumpToCurrentMove = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis?.ongoing || !(analysis.data.game.turns > 0)) return false;
      analysis.jumpToIndex(analysis.data.game.turns - 1);
      lt.analysisRedraw();
    };

    switchExplorerTabs = () => {
      const lt = this.lichessTools;
      const explorer = lt.lichess?.analysis?.explorer;
      if (!explorer?.enabled()) return;
      switch (explorer.config?.data?.db()) {
        case 'masters':
          explorer.config.data.db('lichess');
          explorer.reload();
          break;
        case 'lichess':
          explorer.config.data.db('masters');
          explorer.reload();
          break;
      }
    };

    bindKeysForAnalysis = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      lt.unbindKeyHandler('i');
      lt.unbindKeyHandler('m');
      lt.unbindKeyHandler('b');
      lt.unbindKeyHandler('g');
      lt.unbindKeyHandler('alt+i', true);
      lt.unbindKeyHandler('alt+m', true);
      lt.unbindKeyHandler('alt+b', true);
      lt.unbindKeyHandler('alt+g', true);

      lt.unbindKeyHandler('.', true);
      lt.unbindKeyHandler('ctrl+.', true);
      lt.unbindKeyHandler('shift+.', true);
      lt.unbindKeyHandler('`', true);
      lt.unbindKeyHandler('f');
      lt.unbindKeyHandler('r');
      lt.unbindKeyHandler('backspace', true);
      lt.unbindKeyHandler('ctrl+f', true);

      for (let i = 1; i <= 9; i++) {
        const combo = i.toString();
        if (!this.oldHandlers[combo]) this.oldHandlers[combo] = lt.getKeyHandler(combo);
        lt.unbindKeyHandler(combo);
      }

      lt.unbindKeyHandler('shift+t', true);

      if (this.options.enabled) {
        lt.bindKeyHandler('i', () => lt.jumpToGlyphSymbols('?!'));
        lt.bindKeyHandler('m', () => {
          if (analysis.retro) {
            const oldHandler = this.oldHandlers.m;
            if (oldHandler) oldHandler();
            return;
          }
          lt.jumpToGlyphSymbols('?');
        });
        lt.bindKeyHandler('b', () => lt.jumpToGlyphSymbols('??'));
        lt.bindKeyHandler('g', () => lt.jumpToGlyphSymbols(['!', '!?', '!!', lt.icon.WhiteStar]));
        lt.bindKeyHandler('alt+i', () => lt.jumpToGlyphSymbols('?!', true));
        lt.bindKeyHandler('alt+m', () => lt.jumpToGlyphSymbols('?', true));
        lt.bindKeyHandler('alt+b', () => lt.jumpToGlyphSymbols('??', true));
        lt.bindKeyHandler('alt+g', () => lt.jumpToGlyphSymbols(['!', '!?', '!!', lt.icon.WhiteStar], true));

        lt.bindKeyHandler('.', () => this.prepareMove('pgn'));
        lt.bindKeyHandler('ctrl+.', () => this.prepareMove('ceval'));
        lt.bindKeyHandler('shift+.', () => this.prepareMove('explorer'));
        for (let i = 1; i <= 9; i++) {
          const combo = i.toString();
          lt.bindKeyHandler(combo, () => this.handleDigitKey(combo));
        }
        lt.bindKeyHandler('`', () => this.prepareMove('general'));
        lt.bindKeyHandler('f', this.freezeBoard);
        lt.bindKeyHandler('r', this.randomChapter);
        if (analysis.ongoing) {
          lt.bindKeyHandler('backspace', this.jumpToCurrentMove);
        }
        lt.bindKeyHandler('shift+t', this.switchExplorerTabs);
        lt.bindKeyHandler('ctrl+f',this.search);
      } else {
        if (this.oldHandlers) {
          lt.bindKeyHandler('i', this.oldHandlers['i'], true);
          lt.bindKeyHandler('m', this.oldHandlers['m'], true);
          lt.bindKeyHandler('b', this.oldHandlers['b'], true);
          lt.bindKeyHandler('f', this.oldHandlers['f'], true);
          lt.bindKeyHandler('r', this.oldHandlers['r'], true);
          for (let i = 1; i <= 9; i++) {
            const combo = i.toString();
            if (this.oldHandlers[combo]) lt.bindKeyHandler(combo, this.oldHandlers[combo], true);
          }
        }
      }
    };

    handleEditorAction = (index) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const container = $('div.board-editor__tools .actions');
      container.children().eq(index).trigger('click');
    }

    search = ()=>{
      const lt = this.lichessTools;
      const tool = lt.tools.SearchMovesCommandTool;
      if (!tool?.canSearch()) return;
      const bar = tool.showBar();
      if (bar.prop('_restrictCtrlF')) return;
      bar
        .prop('_restrictCtrlF', true)
        .find('input.search')
        .on('keydown',ev=>{
          if (ev.key==='f' && (ev.ctrlKey || ev.metaKey)) {
            ev.preventDefault();
            ev.currentTarget.select();
          }
        });
    };

    handleEditorDigit = (index, mySide) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const container = mySide ? $('div.spare-bottom') : $('div.spare-top');
      const doc = lt.global.document;
      const event = doc.createEvent('Event');
      event.clientX = -100;
      event.clientY = -100;
      event.initEvent('mousedown', true, true);
      $('.no-square', container).eq(index - 1)?.trigger(event);
      $('.no-square', container).eq(index - 1)?.trigger('mouseup');
    }

    copyFenOrImage = async (event) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const selection = lt.global.getSelection && lt.global.getSelection();
      const selectedText = selection.toString();
      if (selectedText) return;

      const canvas = $('dialog.lichessTools-boardImage canvas')[0];
      if (canvas) {
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, 'image/png');
        });

        await lt.global.navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);

        lt.announce(trans.noarg('ImageCopiedToClipboard'),undefined,undefined,'.lichessTools-boardImage');
        return;
      }

      const analysis = lt.lichess.analysis;
      const fen = analysis?.node?.fen || lt.getPositionFromBoard($('div.main-board'), true);
      if (!fen) return;

      event.clipboardData.setData('text/plain', fen);
      event.preventDefault();
      lt.announce(trans.noarg('FENCopiedToClipboard'));
    };

    bindKeysForEditor = () => {
      const lt = this.lichessTools;
      for (let i = 1; i <= 8; i++) {
        const combo = i.toString();
        lt.unbindKeyHandler(combo);
        lt.unbindKeyHandler('shift+' + combo);
      }
      lt.unbindKeyHandler('c');
      lt.unbindKeyHandler('p');
      if (this.options.enabled) {
        for (let i = 1; i <= 8; i++) {
          const combo = i.toString();
          lt.bindKeyHandler(combo, () => this.handleEditorDigit(i, true));
          lt.bindKeyHandler('shift+' + combo, () => this.handleEditorDigit(i, false));
        }
        lt.bindKeyHandler('p', () => this.handleEditorAction(0));
        lt.bindKeyHandler('c', () => this.handleEditorAction(1));
      }
    }

    bindKeysForGeneral = () => {
      const lt = this.lichessTools;
      lt.unbindKeyHandler('`', true);
      lt.unbindKeyHandler('h');
      const document = lt.global.document;
      $(document).off('copy', this.copyFenOrImage);
      if (this.options.enabled) {
        lt.bindKeyHandler('`', () => this.prepareMove('general'));
        lt.bindKeyHandler('h', this.handleHKey);
        $(document).on('copy', this.copyFenOrImage);
      } else {
      }
    };

    preserveOriginalHandlers = () => {
      const lt = this.lichessTools;
      if (!this.oldHandlers) {
        this.oldHandlers = {
          i: lt.getKeyHandler('i'),
          m: lt.getKeyHandler('m'),
          b: lt.getKeyHandler('b'),
          f: lt.getKeyHandler('f'),
          r: lt.getKeyHandler('r'),
          h: lt.getKeyHandler('h')
        };
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('keyShortcuts');
      this.logOption('Extra analysis key shortcuts', value);
      this.options = { enabled: !!value };
      if (!value && !this.loaded) return;
      this.loaded = true;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const isEditorBoard = $('main').is('#board-editor');
      this.preserveOriginalHandlers();
      if (analysis) {
        this.bindKeysForAnalysis();
      } else if (isEditorBoard) {
        this.bindKeysForEditor();
      }
      this.bindKeysForGeneral();
      if (!value) this.clearMoveMode();
    }
  }

  LiChessTools.Tools.KeyShortcuts = KeyShortcutsTool;
})();
