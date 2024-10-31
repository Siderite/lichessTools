(() => {
  class EmitContentLoadedTool extends LiChessTools.Tools.ToolBase {

    emitDirect = (el) => {
      const lt = this.lichessTools;
      if (lt.global.document.hidden) {
        this.emit(el);
        return;
      }
      lt.debug && lt.global.console.debug('content-loaded',el);
      lt.pubsub.emit('content-loaded',el);
    };
    emit = this.lichessTools.debounce(this.emitDirect,250);

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (lichess.pubsub) {
        lichess.pubsub.off('content-loaded',this.emit);
        lichess.pubsub.on('content-loaded',this.emit);
      }
    }

  }
  LiChessTools.Tools.EmitContentLoaded = EmitContentLoadedTool;
})();
