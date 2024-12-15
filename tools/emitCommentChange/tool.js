(() => {
  class EmitCommentChangeTool extends LiChessTools.Tools.ToolBase {

    emit = (data) => {
      const lt = this.lichessTools;
      lt.debug && lt.global.console.debug('commentChange',data);
      lt.pubsub.emit('lichessTools.commentChange',data);
    };

    detectNew = (records)=>{
      this.emit(records.map(r=>r.target));
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess.analysis) return;
      const $ = lt.$;
      const observer = $('body').observer();
      observer.clear();
      observer.on('comment',this.detectNew,{ 
        subtree: true,
        childList: true, 
        attributes: false, 
        characterData: true
      });
    }

  }
  LiChessTools.Tools.EmitCommentChange = EmitCommentChangeTool;
})();
