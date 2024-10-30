(() => {
  class EmitEsmLoadedTool extends LiChessTools.Tools.ToolBase {

    firstEvents = [];
    async wrapEsmLoaded() {
      const lt = this.lichessTools;
      while (!lt.lichess?.asset?.loadEsm) {
        await lt.timeout(1);
      }
      const lichess = lt.lichess;
      if (lt.isWrappedFunction(lichess.asset.loadEsm, 'emitEsmLoaded')) return;
      const loadEsm = lt.wrapFunction(lichess.asset.loadEsm, {
        id: 'emitEsmLoaded',
        after: ($this, result, ...args) => {
          result?.then(m => {
            if (this.firstEvents) {
              this.firstEvents.push(m);
            } else {
              lichess.pubsub.emit('lichessTools.esmLoaded', m);
            }
          });
        }
      });
      lichess.asset = { ...lichess.asset, loadEsm };
    }

    async init() {
      // execute async, don't block init
      this.wrapEsmLoaded();
    }

    async start() {
      const events = this.firstEvents;
      this.firstEvents = null;
      if (!events?.length) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      lt.global.setTimeout(() => {
        for (const ev of events) {
          lichess.pubsub.emit('lichessTools.esmLoaded', ev);
        }
      }, 50);
    }
  }
  LiChessTools.Tools.EmitEsmLoaded = EmitEsmLoadedTool;
})();
