(()=>{
  class EmitRedrawTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!lichess?.analysis) return;
      const console=parent.global.console;
      const emit = parent.debounce(() => {
        parent.redrawData={};
        console.debug('redraw');
        lichess.pubsub.emit('redraw');
      }, 50);
      parent.emitRedraw=emit;
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
    }
  }
  LiChessTools.Tools.EmitRedraw=EmitRedrawTool;
})();
