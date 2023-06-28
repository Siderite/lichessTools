(()=>{
  class EmitChapterChangeTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!lichess) return;
      const console=parent.global.console;
      if (!lichess.analysis||!lichess.analysis.study) return;
      let previousChapterId=null;
      lichess.pubsub.on('redraw', () => {
        const currChapterId=lichess.analysis.study.currentChapter().id;
        if (previousChapterId!=currChapterId) {
          lichess.pubsub.emit('chapterChange');
        }
        previousChapterId=currChapterId;
      });
    }
  }
  LiChessTools.Tools.EmitChapterChange=EmitChapterChangeTool;
})();
