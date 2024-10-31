(() => {
  class EmitChapterChangeTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess) return;
      const console = lt.global.console;
      if (!lichess?.analysis?.study) return;
      let previousChapterId = null;
      lt.pubsub.on('lichessTools.redraw', () => {
        const currChapterId = lichess.analysis.study.currentChapter()?.id;
        if (previousChapterId != currChapterId) {
          previousChapterId = currChapterId;
          lt.pubsub.emit('lichessTools.chapterChange', currChapterId);
        }
      });
    }
  }
  LiChessTools.Tools.EmitChapterChange = EmitChapterChangeTool;
})();
