(() => {
  class EmitRedrawTool extends LiChessTools.Tools.ToolBase {

    analysisStart = async () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const emit = parent.emitRedraw;
      const analysis = lichess?.analysis;
      if (!analysis) {
        return;
      }
      analysis.redraw = parent.unwrapFunction(analysis.redraw, 'redraw');
      analysis.redraw = parent.wrapFunction(analysis.redraw, {
        id: 'redraw',
        after: emit
      });
      analysis.reloadData = parent.unwrapFunction(analysis.reloadData, 'redraw');
      analysis.reloadData = parent.wrapFunction(analysis.reloadData, {
        id: 'redraw',
        after: emit
      });
      const gp = analysis.gamebookPlay();
      if (gp?.redraw) {
        gp.redraw = parent.unwrapFunction(gp.redraw, 'redraw');
        gp.redraw = parent.wrapFunction(gp.redraw, {
          id: 'redraw',
          after: emit
        });
      }
      const relay = analysis.study?.relay;
      if (relay?.redraw) {
        relay.redraw = parent.unwrapFunction(relay.redraw, 'redraw');
        relay.redraw = parent.wrapFunction(relay.redraw, {
          id: 'redraw',
          after: emit
        });
      }
      lichess.pubsub.off('analysis.change', emit);
      lichess.pubsub.on('analysis.change', emit);
    }

    async start() {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      let emit = null;
      emit = parent.debounce(() => {
        if (parent.global.document.hidden) {
          emit();
          return;
        }
        parent.debug && parent.global.console.debug('redraw');
        lichess.pubsub.emit('lichessTools.redraw');
      }, 250);
      parent.emitRedraw = emit;
      this.analysisStart();
      lichess.pubsub.off('ply', emit);
      lichess.pubsub.on('ply', emit);
      lichess.pubsub.off('chat.resize', emit);
      lichess.pubsub.on('chat.resize', emit);
      parent.global.clearInterval(this._interval);
      this._interval = parent.global.setInterval(() => {
        const board = $('div.main-board div.cg-wrap');
        const cls = board.attr('class');
        if (this._cls != cls) {
          this._cls = cls;
          emit();
        }
      }, 1000);
    }

  }
  LiChessTools.Tools.EmitRedraw = EmitRedrawTool;
})();
