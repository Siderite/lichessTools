(()=>{
  class EmitRedrawTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const console=parent.global.console;
      const emit = parent.debounce(() => {
        parent.redrawData={};
        parent.debug && console.debug('redraw');
        lichess.pubsub.emit('redraw');
      }, 50);
      parent.emitRedraw=emit;
      if (!lichess?.analysis) return;
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
      lichess.pubsub.off('ply',emit);
      lichess.pubsub.on('ply',emit);
      lichess.pubsub.off('analysis.change',emit);
      lichess.pubsub.on('analysis.change',emit);
    }
  }
  LiChessTools.Tools.EmitRedraw=EmitRedrawTool;
})();
