(()=>{
  class EmitEsmLoadedTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!lichess) return;
      // TODO remove old lichess.loadEsm when the code stabilizes
      let loadEsm=parent.unwrapFunction(lichess.asset?.loadEsm || lichess.loadEsm,'emitEsmLoaded');
      loadEsm=parent.wrapFunction(loadEsm,{
        id:'emitEsmLoaded',
        after: ($this,result,...args)=>{
          result?.then(m=>{
            lichess.pubsub.emit('esmLoaded',m);
          });
        }
      });
      if (lichess.asset?.loadEsm) {
        lichess.asset={...lichess.asset,loadEsm};
      } else {
        lichess.loadEsm=loadEsm;
      }
    }
  }
  LiChessTools.Tools.EmitEsmLoaded=EmitEsmLoadedTool;
})();
