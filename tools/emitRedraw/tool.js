(() => {
  class EmitRedrawTool extends LiChessTools.Tools.ToolBase {

    analysisStart = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const emit = lt.emitRedraw;
      const analysis = lichess?.analysis;
      if (!analysis) {
        return;
      }
      analysis.redraw = lt.unwrapFunction(analysis.redraw, 'redraw');
      analysis.redraw = lt.wrapFunction(analysis.redraw, {
        id: 'redraw',
        after: emit
      });
      analysis.reloadData = lt.unwrapFunction(analysis.reloadData, 'redraw');
      analysis.reloadData = lt.wrapFunction(analysis.reloadData, {
        id: 'redraw',
        after: emit
      });
      const gp = analysis.gamebookPlay();
      if (gp?.redraw) {
        gp.redraw = lt.unwrapFunction(gp.redraw, 'redraw');
        gp.redraw = lt.wrapFunction(gp.redraw, {
          id: 'redraw',
          after: emit
        });
      }
      const relay = analysis.study?.relay;
      if (relay?.redraw) {
        relay.redraw = lt.unwrapFunction(relay.redraw, 'redraw');
        relay.redraw = lt.wrapFunction(relay.redraw, {
          id: 'redraw',
          after: emit
        });
      }
      lt.uiApi.events.off('analysis.change', emit);
      lt.uiApi.events.on('analysis.change', emit);
    }

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      let emit = null;
      emit = lt.debounce(() => {
        if (lt.global.document.hidden) {
          emit();
          return;
        }
        lt.debug && lt.global.console.debug('redraw');
        lt.pubsub.emit('lichessTools.redraw');
      }, 250);
      lt.emitRedraw = emit;
      this.analysisStart();
      lt.uiApi.events.off('ply', emit);
      lt.uiApi.events.on('ply', emit);
      lt.uiApi.events.off('chat.resize', emit);
      lt.uiApi.events.on('chat.resize', emit);
      lt.global.clearInterval(this._interval);
      this._interval = lt.global.setInterval(() => {
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
