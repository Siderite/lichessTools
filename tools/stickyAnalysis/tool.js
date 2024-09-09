(() => {
  class StickyAnalysisTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'stickyAnalysis',
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
        'options.stickyAnalysis': 'Autosave analysis for reload'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.stickyAnalysis': 'Salveaz\u0103 automat analiza pentru re\u00eencarcare'
      }
    }

    saveAnalysisPgn = () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess.analysis;
      if (!analysis) return;
      let pgn = $('.analyse__underboard .pgn textarea').val();
      if (!pgn) return;
      if (analysis.getOrientation() != "white" && !/\[Orientation|\[StartFlipped/.test(pgn)) {
        pgn = '[Orientation "Black"]\r\n[StartFlipped "1"]\r\n' + pgn?.replace(/\[(Orientation|StartFlipped)\s+"[^"]*"\][\r\n]+/g, '');
      }
      if (!parent.isStartFen(analysis.tree.root.fen)) {
        pgn = '[FEN "' + analysis.tree.root.fen + '"]\r\n' + pgn?.replace(/\[FEN\s+"[^"]*"\][\r\n]+/g, '');
      }
      if (this.prevPgn === pgn) return;
      const savedPgn = parent.storage.get('LiChessTools.stickyAnalysis.pgn', { zip: true });
      if (savedPgn != pgn) {
        parent.storage.set('LiChessTools.stickyAnalysis.pgn', pgn, { zip: true });
      }
      this.prevPgn = pgn;
    }
    saveAnalysisPgnLong = this.lichessTools.debounce(this.saveAnalysisPgn, 10000);

    retrievePgn = () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const textarea = $('.analyse__underboard .pgn textarea');
      if (!textarea.length) return;
      const savedPgn = parent.storage.get('LiChessTools.stickyAnalysis.pgn', { zip: true });
      if (!savedPgn) return;
      textarea.val(savedPgn);
      lichess.analysis.pgnInput = savedPgn;
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('stickyAnalysis');
      this.logOption('Sticky analysis', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      if (analysis.study) return;
      const trans = parent.translator;
      lichess.pubsub.off('lichessTools.redraw', this.saveAnalysisPgnLong);
      parent.global.removeEventListener('beforeunload', this.saveAnalysisPgn);
      if (!value) return;
      lichess.pubsub.on('lichessTools.redraw', this.saveAnalysisPgnLong);
      parent.global.addEventListener('beforeunload', this.saveAnalysisPgn);

      if (analysis.tree.root.children?.length == 0) {
        this.retrievePgn();
      }
    }

  }
  LiChessTools.Tools.StickyAnalysis = StickyAnalysisTool;
})();
