(() => {
  class EmitContentLoadedTool extends LiChessTools.Tools.ToolBase {

    emitDirect = (el) => {
      const lt = this.lichessTools;
      if (lt.global.document.hidden) {
        lt.global.setTimeout(()=>this.emit(el),250);
        return;
      }
      lt.debug && lt.global.console.debug('content-loaded',el);
      lt.pubsub.emit('content-loaded',el);
    };
    emit = lichessTools.debounce(this.emitDirect,250,{ defer: true });

    detectNew = (records)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const selector = '#powerTip .infinite-scroll, .paginated, .dropdown, .notifications, #notify-toggle > span, .challenge-page, .upt__info, .game__meta, .timeline, .lobby__tv, .announce, .simul-list__content, .angle-content';
      const found = records.find(r=>$(r.target).is(selector) || [...r.addedNodes].find(n=>$(n).is(selector)));
      if (found) {
        this.emit(found.target);
        const children = [...found.addedNodes].filter(n=>$(n).is(selector));
        children.forEach(n=>this.emit(n));
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      $('body')
         .observer()
         .on('*',this.detectNew,{ 
           subtree: true,
           childList: true, 
           attributes: false, 
           characterData: true,
           executeDirect: true
         });
    }

  }
  LiChessTools.Tools.EmitContentLoaded = EmitContentLoadedTool;
})();
