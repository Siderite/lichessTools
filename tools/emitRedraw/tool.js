(()=>{
  class EmitRedrawTool extends LiChessTools.Tools.ToolBase {

    analysisStart = async ()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const console=parent.global.console;
      const emit=parent.emitRedraw;
      if (!lichess?.analysis) {
        parent.global.setTimeout(this.analysisStart,100);
        return;
      }
      lichess.analysis.redraw=parent.unwrapFunction(lichess.analysis.redraw,'redraw'); 
      lichess.analysis.redraw=parent.wrapFunction(lichess.analysis.redraw,{ 
        id:'redraw',
        after: emit
      });
      lichess.analysis.reloadData=parent.unwrapFunction(lichess.analysis.reloadData,'redraw'); 
      lichess.analysis.reloadData=parent.wrapFunction(lichess.analysis.reloadData,{ 
        id:'redraw',
        after: emit
      });
      if (lichess.analysis.gamebookPlay()?.redraw) {
        lichess.analysis.gamebookPlay().redraw=parent.unwrapFunction(lichess.analysis.gamebookPlay().redraw,'redraw'); 
        lichess.analysis.gamebookPlay().redraw=parent.wrapFunction(lichess.analysis.gamebookPlay().redraw,{ 
          id:'redraw',
          after: emit
        });
      }
      if (lichess.analysis.study?.relay?.redraw) {
        lichess.analysis.study.relay.redraw=parent.unwrapFunction(lichess.analysis.study.relay.redraw,'redraw'); 
        lichess.analysis.study.relay.redraw=parent.wrapFunction(lichess.analysis.study.relay.redraw,{ 
          id:'redraw',
          after: emit
        });
      }
      lichess.pubsub.off('analysis.change',emit);
      lichess.pubsub.on('analysis.change',emit);
    }

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const console=parent.global.console;
      const emit = parent.debounce(() => {
        if (parent.global.document.hidden) return;
        parent.debug && parent.global.console.debug('redraw');
        lichess.pubsub.emit('redraw');
      }, 250);
      parent.emitRedraw=emit;
      this.analysisStart();
      lichess.pubsub.off('ply',emit);
      lichess.pubsub.on('ply',emit);
      lichess.pubsub.off('chat.resize',emit);
      lichess.pubsub.on('chat.resize',emit);
      parent.global.clearInterval(this._interval);
      const board=$('div.main-board div.cg-wrap');
      this._interval=parent.global.setInterval(()=>{
        const cls=board.attr('class');
        if (this._cls && this._cls!=cls) {
          emit();
        }
        this._cls=cls;
      },1000);
    }

  }
  LiChessTools.Tools.EmitRedraw=EmitRedrawTool;
})();
