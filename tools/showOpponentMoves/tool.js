(() => {
  class ShowOpponentMovesTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'ChessOps'];

    preferences = [
      {
        name: 'showOpponentMoves',
        category: 'analysis2',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.showOpponentMoves': 'Show legal moves of pieces out of turn'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.showOpponentMoves': 'Arat\u0103 mut\u0103rile legale ale pieselor care nu sunt la mutare'
      }
    };

    clearDestinations = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('cg-board square.move-opdest').remove();
    };

    showDestinations = async (squareKey, turnColor) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const analysis = lt.lichess.analysis;
      const cg = analysis?.chessground;
      if (!cg) return;

      const fen = cg.state.fen;
      if (!fen) return;
      const co = await lt.chessops();

      const setup = co.fen.parseFen(fen).unwrap();
      const pos = co.Chess.fromSetup(setup).unwrap();
      pos.turn = turnColor;
      const ctx = pos.ctx();
      const allDests = pos.allDests(ctx);
      const from = co.parseSquare(squareKey);
      const dests = allDests.get(from);
      if (!dests) return;

      const board = $(cg.state.dom.elements.board);
      const squareSize = board.width() / 8;

      for (const dest of dests) {
        const toKey = co.makeSquare(dest);
        const isCapture = pos.board.has(dest);

        let [file,rank] = [ dest & 7, dest >>3 ];
        if (cg.state.orientation == 'black') {
          file = 7 - file;
          rank = 7 - rank;
        }
        const left = file * squareSize;
        const top = (7 - rank) * squareSize;

        $('<square>')
          .addClass('move-opdest' + (isCapture ? ' oc' : ''))
          .prop('cgKey', toKey)
          .css('transform', `translate(${left}px, ${top}px)`)
          .appendTo(board);
      };
    };

    onBoardClick = (ev) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const cg = analysis?.chessground;
      if (!cg) return;

      const board = $(cg.state.dom.elements.board);
      
      // Find clicked square
      const rect = cg.state.dom.bounds();
      const x = ev.clientX - rect.x;
      const y = ev.clientY - rect.y;
      
      const squareSize = rect.width / 8;
      const file = Math.floor(x / squareSize);
      const rank = 7 - Math.floor(y / squareSize);   // chessground inverted Y
      
      const wo = cg.state.orientation == 'white';
      const squareKey = 'abcdefgh'.charAt(wo ? file : 7-file) + (wo ? rank + 1 : 8-rank);

      const piece = cg.state.pieces.get(squareKey);
      if (piece) {
        const turnColor = cg.state.turnColor;
        const isOpponentPiece = piece.color !== turnColor;

        if (isOpponentPiece) {
          this.showDestinations(squareKey, turnColor == 'white' ? 'black' : 'white');
          return;
        }
      }
      this.clearDestinations();
    };

    bindBoardClick = (ev) => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const cg = analysis?.chessground;
      if (!cg) return;

      const board = $(cg.state.dom.elements.board);
      $('cg-board').off('click', this.onBoardClick);
      if (!this.options.enabled) return;
      $('cg-board').on('click', this.onBoardClick);
      this.clearDestinations();
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('showOpponentMoves');
      this.logOption('Show opponent moves on click', value);
      this.options = { enabled: !!value };

      const $ = lt.$;
      const analysis = lt.lichess?.analysis;

      lt.pubsub.off('lichessTools.redraw', this.bindBoardClick);
      this.clearDestinations();

      if (!value || !analysis?.chessground) {
        return;
      }

      lt.pubsub.on('lichessTools.redraw', this.bindBoardClick);
      this.bindBoardClick();
    }
  }

  LiChessTools.Tools.ShowOpponentMoves = ShowOpponentMovesTool;
})();