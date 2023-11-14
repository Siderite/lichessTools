(()=>{
  class EmitEsmLoadedTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!lichess) return;
      lichess.loadEsm=parent.unwrapFunction(lichess.loadEsm,'emitEsmLoaded');
      lichess.loadEsm=parent.wrapFunction(lichess.loadEsm,{
        id:'emitEsmLoaded',
        after: ($this,result,...args)=>{
          result?.then(m=>{
            lichess.pubsub.emit('esmLoaded',m);
          });
        }
      });
    }
  }
  LiChessTools.Tools.EmitEsmLoaded=EmitEsmLoadedTool;
})();
