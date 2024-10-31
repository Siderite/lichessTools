(() => {
  class EmitContentLoadedTool extends LiChessTools.Tools.ToolBase {

    emit = (el) => {
      const lt = this.lichessTools;
      if (lt.global.document.hidden) {
        lt.global.setTimeout(()=>this.emit(el),250);
        return;
      }
      lt.debug && lt.global.console.debug('content-loaded',el);
      lt.pubsub.emit('content-loaded',el);
    };

    detectNew = (records)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const selector = '#powerTip .infinite-scroll, .paginated, .dropdown, .notifications, .challenge-page, .upt__info, .game__meta, .timeline, .lobby__tv, .announce, .simul-list__content, .angle-content';
      const found = records.find(r=>$(r.target).is(selector) || [...r.addedNodes].find(n=>$(n).is(selector)));
      if (found) {
        this.emit(found.target);
        const children = [...found.addedNodes].filter(n=>$(n).is(selector));
        children.forEach(n=>this.emit(n));
        return;
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (lichess.pubsub) { //TODO legacy: remove when removed from Lichess
        lichess.pubsub.off('content-loaded',this.emit);
        lichess.pubsub.on('content-loaded',this.emit);
      } else {
        const observer = $('body').observer();
        observer.clear();
        observer.on('*',this.detectNew);
      }
    }

  }
  LiChessTools.Tools.EmitContentLoaded = EmitContentLoadedTool;
})();
