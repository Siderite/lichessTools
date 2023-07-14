(()=>{
  class FixAbortControllerTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('fixAbortController');
      this.logOption('Fix AbortController in debug mode', value);
      parent.global.AbortController.prototype.abort=parent.wrapFunction(AbortController.prototype.abort,{ 
        id:'fixAbortController',
        before: ($this,...args) => $this.signal?.aborted
      });
    }
  }
  LiChessTools.Tools.FixAbortController=FixAbortControllerTool;
})();
