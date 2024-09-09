(() => {
  class EmitEsmLoadedTool extends LiChessTools.Tools.ToolBase {

    firstEvents = [];
    async wrapEsmLoaded() {
      const parent = this.lichessTools;
      while (!parent.lichess?.asset?.loadEsm) {
        await parent.timeout(1);
      }
      const lichess = parent.lichess;
      if (parent.isWrappedFunction(lichess.asset.loadEsm, 'emitEsmLoaded')) return;
      const loadEsm = parent.wrapFunction(lichess.asset.loadEsm, {
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
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      parent.global.setTimeout(() => {
        for (const ev of events) {
          lichess.pubsub.emit('lichessTools.esmLoaded', ev);
        }
      }, 50);
    }
  }
  LiChessTools.Tools.EmitEsmLoaded = EmitEsmLoadedTool;
})();
