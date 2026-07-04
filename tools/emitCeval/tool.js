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

    wrapLichessEvent = (data,meta)=>{
      const lt = this.lichessTools;
      lt.pubsub.emit('lichessTools.ceval',[data,meta]);
    }

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const ceval = lichess?.analysis?.ceval;
      if (!ceval) return;

      const useLichessEvent = true;
      lt.uiApi.events.off('analysis.eval',this.wrapLichessEvent);
      if (useLichessEvent) {
        lt.uiApi.events.on('analysis.eval',this.wrapLichessEvent);
      } else {
        const engines = ceval.engines;
        if (!engines) throw new Error('ceval.engines does not exist!');
        if (!lt.isWrappedFunction(engines.makeEngine,'emitCeval')) {
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
    }

  }
  LiChessTools.Tools.EmitCeval = EmitCevalTool;
})();
