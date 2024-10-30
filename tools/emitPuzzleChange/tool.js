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

    checkPuzzle = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const puzzleId = this.getPuzzleId();
      if (this.puzzleId != puzzleId) {
        this.puzzleId = puzzleId;
        lt.pubsub.emit('lichessTools.puzzleChange', puzzleId);
      };
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const puzzleId = this.getPuzzleId();
      if (!puzzleId) return;
      this.puzzleId = puzzleId;
      lt.global.clearInterval(this.interval);
      this.interval = lt.global.setInterval(this.checkPuzzle, 1000);
    }
  }
  LiChessTools.Tools.EmitPuzzleChange = EmitPuzzleChangeTool;
})();
