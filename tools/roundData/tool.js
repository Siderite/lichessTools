(() => {
  class RoundDataTool extends LiChessTools.Tools.ToolBase {

    async init() {
      const lt = this.lichessTools;

      const oldFunc=HTMLScriptElement.prototype.remove;
      if (oldFunc.__initErrorCatch) return;
      const newFunc = function() {
        if (lt.currentOptions?.enableLichessTools !== false && this.id === 'page-init-data') {
          try {
            lt.roundData = JSON.parse(this.innerHTML);
          } catch(e) {
            console.warn('Error parsing round data:',e);
          }
        }
        return oldFunc.apply(this,arguments);
      };
      newFunc.__initErrorCatch=true;
      HTMLScriptElement.prototype.remove = newFunc;
    }

  }
  LiChessTools.Tools.RoundData = RoundDataTool;
})();
