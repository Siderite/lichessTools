(() => {
  class EmitPuzzleChangeTool extends LiChessTools.Tools.ToolBase {

    processPuzzle = (records)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const puzzleId = lt.getPuzzleId();
      if (puzzleId != this.puzzleId) {
        this.puzzleId = puzzleId;
        lt.pubsub.emit('lichessTools.puzzleStart', puzzleId);
      }
      if (records?.find(r=>r.addedNodes && Array.from(r.addedNodes).find(n=>$(n).is('.puzzle__feedback.after')))) {
        lt.pubsub.emit('lichessTools.puzzleEnd', puzzleId);
      }
      if (records?.find(r=>r.addedNodes && Array.from(r.addedNodes).find(n=>$(n).is('.puzzle__feedback.fail')))) {
        lt.pubsub.emit('lichessTools.puzzleFail', puzzleId);
      }
    };

    processGameInfoChange = (records)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const puzzleId = lt.getPuzzleId();
      if (puzzleId) return; // this is only for when we can't determine puzzle Id

      const playerData = $('.infos .players').get().map(e=>$(e).text()).join('\r\n');
      if (playerData != this.playerData && $('.infos.puzzle').length) {
        this.playerData = playerData;
        lt.pubsub.emit('lichessTools.puzzleStart', null);
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const puzzleId = lt.getPuzzleId();
      $('body')
        .observer()
        .off('.puzzle__tools',this.processPuzzle);
      if (puzzleId) {
        $('body')
          .observer()
          .on('.puzzle__tools',this.processPuzzle,{ executeDirect: true });
        lt.global.setTimeout(this.processPuzzle,100);
      }

      $('body')
       .observer()
       .off('.puzzle__tools',this.processGameInfoChange)
       .on('.puzzle__tools',this.processGameInfoChange);
    }
  }
  LiChessTools.Tools.EmitPuzzleChange = EmitPuzzleChangeTool;
})();
