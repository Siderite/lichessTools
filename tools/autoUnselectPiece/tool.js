(() => {
  class AutoUnselectPieceTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties'];

    preferences = [
      {
        name: 'autoUnselectPiece',
        category: 'play',
        type: 'number',
        defaultValue: undefined,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.autoUnselectPiece': 'Unselect piece after specified seconds'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.autoUnselectPiece': 'Deselecteaz\u0103 pies\u0103 dup\u0103 un num\u0103r de secunde'
      }
    }

    select = square => {
      if (!square) {
        this._selected = null;
        return;
      }
      if (square != this._selected?.square) {
        this._selected = {
          square: square,
          time: Date.now()
        };
        return;
      }
      if (Date.now() - this._selected.time < this.options.seconds * 1000) return;
      this.unselectPiece();
      this.select(null);
    };

    checkPieceSelection = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.options.seconds) return;
      if (!$.cached('body').is('.playing')) return;
      const selectedSquare = $('square.selected:not([style*="hidden"])')[0]?.cgKey;
      this.select(selectedSquare);
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('autoUnselectPiece');
      this.logOption('Auto unselect piece', value || 'no');
      lt.global.clearInterval(this.checkPieceSelection);
      this.options = { seconds: +value };
      if (!this.options.seconds) return;
      const bindings = lichess.mousetrap?.bindings;
      if (!bindings) return;
      if (!$('main').is('.round,.puzzle')) return;
      this.unselectPiece = () => {
        const isLastMove = $('div.tview2 move:last-child').is('.active') || $('div.ruser-top + * div.buttons + *>:last-child')[0]?.className;
        if (isLastMove) bindings.down?.find(b => b.combination == 'down')?.callback();
      };
      this.discoverChatInterval = lt.global.setInterval(this.checkPieceSelection, 500);
    }

  }
  LiChessTools.Tools.AutoUnselectPiece = AutoUnselectPieceTool;
})();
