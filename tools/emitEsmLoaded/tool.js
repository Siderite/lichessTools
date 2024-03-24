(()=>{
  class EmitEsmLoadedTool extends LiChessTools.Tools.ToolBase {

    firstEvents=[];
    async init() {
      const parent=this.lichessTools;
      while (!parent.lichess?.asset?.loadEsm) {
        await parent.timeout(1);
      }
      const lichess=parent.lichess;
      if (parent.isWrappedFunction(lichess.asset.loadEsm,'emitEsmLoaded')) return;
      const loadEsm=parent.wrapFunction(lichess.asset.loadEsm,{
        id:'emitEsmLoaded',
        after: ($this,result,...args)=>{
          result?.then(m=>{
            lichess.pubsub.emit('esmLoaded',m);
            this.firstEvents?.push(m);
          });
        }
      });
      lichess.asset={...lichess.asset,loadEsm};
    }

    async start() {
      const events=this.firstEvents;
      this.firstEvents=null;
      if (!events.length) return;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      parent.global.setTimeout(()=>{
        for(const ev of events) {
          lichess.pubsub.emit('esmLoaded',ev);
        }
      },50);
    }
  }
  LiChessTools.Tools.EmitEsmLoaded=EmitEsmLoadedTool;
})();
