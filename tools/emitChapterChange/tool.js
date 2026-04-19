(() => {
  class EmitChapterChangeTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess) return;
      const study = lichess?.analysis?.study;
      if (!study) return;
      let previousChapterId = null;
      if (!lt.isWrappedFunction(study.onReload, 'chapterChange')) {
        study.onReload = lt.wrapFunction(study.onReload, {
          id: 'chapterChange',
          after:($this,result,...args) => {
            const currChapterId = lichess.analysis.study.currentChapter()?.id;
            if (previousChapterId != currChapterId) {
              previousChapterId = currChapterId;
              lt.pubsub.emit('lichessTools.chapterChange', currChapterId);
            }
          }
        });
      }
    }
  }
  LiChessTools.Tools.EmitChapterChange = EmitChapterChangeTool;
})();
