(()=>{
  class EmitPuzzleChangeTool extends LiChessTools.Tools.ToolBase {

    getPuzzleId=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const puzzleUrl=$('main.puzzle div.infos.puzzle a[href^="/training"]').attr('href');
      if (!puzzleUrl) return;
      const m=/\/training\/([^\/]+)$/.exec(puzzleUrl);
      if (!m) return;
      return m[1];
    };

    checkPuzzle=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const puzzleId=this.getPuzzleId();
      if (this.puzzleId!=puzzleId) {
        this.puzzleId=puzzleId;
        lichess.pubsub.emit('puzzleChange',puzzleId);
      };
    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const puzzleId=this.getPuzzleId();
      if (!puzzleId) return;
      this.puzzleId=puzzleId;
      parent.global.clearInterval(this.interval);
      this.interval=parent.global.setInterval(this.checkPuzzle,1000);
    }
  }
  LiChessTools.Tools.EmitPuzzleChange=EmitPuzzleChangeTool;
})();
