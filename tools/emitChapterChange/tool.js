(()=>{
  class EmitChapterChangeTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!lichess) return;
      const console=parent.global.console;
      if (!lichess?.analysis?.study) return;
      let previousChapterId=null;
      lichess.pubsub.on('lichessTools.redraw', () => {
        const currChapterId=lichess.analysis.study.currentChapter()?.id;
        if (previousChapterId!=currChapterId) {
          previousChapterId=currChapterId;
          lichess.pubsub.emit('lichessTools.chapterChange',currChapterId);
        }
      });
    }
  }
  LiChessTools.Tools.EmitChapterChange=EmitChapterChangeTool;
})();
