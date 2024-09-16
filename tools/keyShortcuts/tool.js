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
        'options.keyShortcuts': 'Extra key shortcuts'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.keyShortcuts': 'Combina\u0163ii de taste \u00een plus'
      }
    }

    clearMoveMode = () => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const g = this.lichessTools.global;
      g.clearTimeout(this.makeMoveTimeout);
      this.makeMoveMode = null;
      $.cached('body').removeClass('lichessTools-keyMode-pgn lichessTools-keyMode-ceval lichessTools-keyMode-explorer lichessTools-keyMode-general');
    };

    prepareMove = (mode) => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const g = this.lichessTools.global;
      this.clearMoveMode();
      switch (mode) {
        case 'pgn': {
          const moves = $('div.analyse__tools div.analyse__fork move');
          if (!moves.length) return;
        }
          break;
        case 'ceval': {
          const analysis = this.lichessTools.lichess.analysis;
          if (!analysis?.ceval || !analysis?.ceval.enabled()) return;
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
      const parent = this.lichessTools;
      const $ = parent.$;
      const g = this.lichessTools.global;
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
          const analysis = this.lichessTools.lichess.analysis;
          if (!analysis?.ceval || !analysis?.ceval.enabled()) return;
          const pvs = analysis?.node?.ceval?.pvs;
          if (!pvs || !pvs[index]) return;
          const uci = pvs[index].moves[0];
          if (uci) analysis.playUci(uci);
        }
          break;
        case 'explorer': {
          const analysis = this.lichessTools.lichess.analysis;
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

    freezeBoard = () => {
      if (this.makeMoveMode != 'general') {
        this.oldHandlers['f']();
        return;
      }
      this.clearMoveMode();
      const parent = this.lichessTools;
      const $ = parent.$;
      const board = $('cg-container.lichessTools-freezeBoard');
      if (board.length) {
        board.remove();
        return;
      };
      $('cg-container')
        .clone()
        .addClass('lichessTools-freezeBoard')
        .appendTo('div.cg-wrap');
    };

    toggleSiteHeader = () => {
      if (this.makeMoveMode != 'general') {
        return;
      }
      this.clearMoveMode();
      const parent = this.lichessTools;
      const $ = parent.$;
      $('body')
        .toggleClass('lichessTools-hideSiteHeader');
    };

    randomChapter = () => {
      if (this.makeMoveMode != 'general') {
        this.oldHandlers['r']();
        return;
      }
      this.clearMoveMode();
      const parent = this.lichessTools;
      const $ = parent.$;
      const button = $('div.lichessTools-chapterControls button[data-act="random"]');
      button.trigger('click');
    };

    jumpToCurrentMove = () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const analysis = lichess.analysis;
      if (!analysis?.ongoing || !(analysis.data.game.turns > 0)) return false;
      analysis.jumpToIndex(analysis.data.game.turns - 1);
      analysis.redraw();
    };

    bindKeysForAnalysis = () => {
      const parent = this.lichessTools;
      const analysis = parent.lichess.analysis;
      if (!this.oldHandlers) {
        this.oldHandlers = {
          i: parent.getKeyHandler('i'),
          m: parent.getKeyHandler('m'),
          b: parent.getKeyHandler('b'),
          f: parent.getKeyHandler('f'),
          r: parent.getKeyHandler('r')
        };
      }
      parent.unbindKeyHandler('i');
      parent.unbindKeyHandler('m');
      parent.unbindKeyHandler('b');
      parent.unbindKeyHandler('g');
      parent.unbindKeyHandler('alt+i', true);
      parent.unbindKeyHandler('alt+m', true);
      parent.unbindKeyHandler('alt+b', true);
      parent.unbindKeyHandler('alt+g', true);

      parent.unbindKeyHandler('.', true);
      parent.unbindKeyHandler('ctrl+.', true);
      parent.unbindKeyHandler('shift+.', true);
      parent.unbindKeyHandler('`', true);
      parent.unbindKeyHandler('f');
      parent.unbindKeyHandler('h', true);
      parent.unbindKeyHandler('r');
      parent.unbindKeyHandler('backspace', true);

      for (let i = 1; i <= 9; i++) {
        const combo = i.toString();
        if (!this.oldHandlers[combo]) this.oldHandlers[combo] = parent.getKeyHandler(combo);
        parent.unbindKeyHandler(combo);
      }

      if (this.options.enabled) {
        parent.bindKeyHandler('i', () => parent.jumpToGlyphSymbols('?!'));
        parent.bindKeyHandler('m', () => parent.jumpToGlyphSymbols('?'));
        parent.bindKeyHandler('b', () => parent.jumpToGlyphSymbols('??'));
        parent.bindKeyHandler('g', () => parent.jumpToGlyphSymbols(['!', '!?', '!!', '\u2606']));
        parent.bindKeyHandler('alt+i', () => parent.jumpToGlyphSymbols('?!', true));
        parent.bindKeyHandler('alt+m', () => parent.jumpToGlyphSymbols('?', true));
        parent.bindKeyHandler('alt+b', () => parent.jumpToGlyphSymbols('??', true));
        parent.bindKeyHandler('alt+g', () => parent.jumpToGlyphSymbols(['!', '!?', '!!', '\u2606'], true));

        parent.bindKeyHandler('.', () => this.prepareMove('pgn'));
        parent.bindKeyHandler('ctrl+.', () => this.prepareMove('ceval'));
        parent.bindKeyHandler('shift+.', () => this.prepareMove('explorer'));
        for (let i = 1; i <= 9; i++) {
          const combo = i.toString();
          parent.bindKeyHandler(combo, () => this.handleDigitKey(combo));
        }
        parent.bindKeyHandler('`', () => this.prepareMove('general'));
        parent.bindKeyHandler('h', this.toggleSiteHeader);
        parent.bindKeyHandler('f', this.freezeBoard);
        parent.bindKeyHandler('r', this.randomChapter);
        if (analysis.ongoing) {
          parent.bindKeyHandler('backspace', this.jumpToCurrentMove);
        }
      } else {
        if (this.oldHandlers) {
          parent.bindKeyHandler('i', this.oldHandlers['i'], true);
          parent.bindKeyHandler('m', this.oldHandlers['m'], true);
          parent.bindKeyHandler('b', this.oldHandlers['b'], true);
          parent.bindKeyHandler('f', this.oldHandlers['f'], true);
          parent.bindKeyHandler('r', this.oldHandlers['r'], true);
          for (let i = 1; i <= 9; i++) {
            const combo = i.toString();
            if (this.oldHandlers[combo]) parent.bindKeyHandler(combo, this.oldHandlers[combo], true);
          }
        }
      }
    };

    handleEditorAction = (index) => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const container = $('div.board-editor__tools .actions');
      container.children().eq(index).trigger('click');
    }

    handleEditorDigit = (index, mySide) => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const container = mySide ? $('div.spare-bottom') : $('div.spare-top');
      const doc = parent.global.document;
      const event = doc.createEvent('Event');
      event.clientX = -100;
      event.clientY = -100;
      event.initEvent('mousedown', true, true);
      $('.no-square', container).eq(index - 1)?.trigger(event);
      $('.no-square', container).eq(index - 1)?.trigger('mouseup');
    }

    bindKeysForEditor = () => {
      const parent = this.lichessTools;
      for (let i = 1; i <= 8; i++) {
        const combo = i.toString();
        parent.unbindKeyHandler(combo);
        parent.unbindKeyHandler('shift+' + combo);
      }
      parent.unbindKeyHandler('c');
      parent.unbindKeyHandler('p');
      if (this.options.enabled) {
        for (let i = 1; i <= 8; i++) {
          const combo = i.toString();
          parent.bindKeyHandler(combo, () => this.handleEditorDigit(i, true));
          parent.bindKeyHandler('shift+' + combo, () => this.handleEditorDigit(i, false));
        }
        parent.bindKeyHandler('p', () => this.handleEditorAction(0));
        parent.bindKeyHandler('c', () => this.handleEditorAction(1));
      }
    }

    bindKeysForGeneral = () => {
      const parent = this.lichessTools;
      parent.unbindKeyHandler('`', true);
      parent.unbindKeyHandler('h', true);
      if (this.options.enabled) {
        parent.bindKeyHandler('`', () => this.prepareMove('general'));
        parent.bindKeyHandler('h', this.toggleSiteHeader);
      }
    };

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const value = parent.currentOptions.getValue('keyShortcuts');
      this.logOption('Extra analysis key shortcuts', value);
      this.options = { enabled: !!value };
      if (!value && !this.loaded) return;
      this.loaded = true;
      const lichess = parent.lichess;
      const analysis = lichess.analysis;
      const isEditorBoard = $('main').is('#board-editor');
      if (analysis) {
        this.bindKeysForAnalysis();
      } else if (isEditorBoard) {
        this.bindKeysForEditor();
        this.bindKeysForGeneral();
      } else {
        this.bindKeysForGeneral();
      }
      if (!value) this.clearMoveMode();
    }
  }

  LiChessTools.Tools.KeyShortcuts = KeyShortcutsTool;
})();
