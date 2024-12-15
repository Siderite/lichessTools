(() => {
  class EmitPuzzleChangeTool extends LiChessTools.Tools.ToolBase {

    getPuzzleId = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const puzzleUrl = $('main.puzzle div.infos.puzzle a[href^="/training"]').attr('href');
      if (!puzzleUrl) return;
      const m = /\/training\/([^\/]+)$/.exec(puzzleUrl);
      if (!m) return;
      return m[1];
    };

    processPuzzle = (records)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const puzzleId = this.getPuzzleId();
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

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const puzzleId = this.getPuzzleId();
      if (!puzzleId) return;
      const obs = $('body').observer();
      obs.off('.puzzle__tools',this.processPuzzle);
      obs.on('.puzzle__tools',this.processPuzzle);
      lt.global.setTimeout(this.processPuzzle,100);
    }
  }
  LiChessTools.Tools.EmitPuzzleChange = EmitPuzzleChangeTool;
})();
