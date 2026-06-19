(() => {
  class EmitCevalTool extends LiChessTools.Tools.ToolBase {

    wrapWorker = (worker)=>{
      const lt = this.lichessTools;
      worker.start = lt.wrapFunction(worker.start,{
        id: 'emitCeval',
        before: ($this,work)=>{
          if (!work?.emit) lt.global.console.warn('Work object emit function not found!');
          work.emit = lt.wrapFunction(work.emit,{
            id: 'emitCeval',
            before: ($this,...args)=>{
              lt.pubsub.emit('lichessTools.ceval', args);
            }
          });
        }
      });
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const ceval = lichess?.analysis?.ceval;
      if (!ceval) return;
      const engines = ceval.engines;
      if (!engines) throw new Error('ceval.engines does not exist!');
      engines.makeEngine = lt.unwrapFunction(engines.makeEngine,'emitCeval');
      engines.makeEngine = lt.wrapFunction(engines.makeEngine,{
        id: 'emitCeval',
        after: ($this,result,...args)=>{
          this.wrapWorker(result);
        }
      });
      const worker = ceval?.worker;
      if (worker) {
        this.wrapWorker(worker);
      }
    }

  }
  LiChessTools.Tools.EmitCeval = EmitCevalTool;
})();
