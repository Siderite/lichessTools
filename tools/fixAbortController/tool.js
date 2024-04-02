(()=>{
  class FixAbortControllerTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'fixAbortController',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        'options.fixAbortController': 'Fix AbortController'
      },
      'ro-RO':{
        'options.fixAbortController': 'Resolv\u0103 AbortController'
      }
    }

    async init() {
      const parent=this.lichessTools;
      if (!parent.global.AbortController) return;
      parent.global.AbortController.prototype.abort=parent.wrapFunction(parent.global.AbortController.prototype.abort,{ 
        id:'fixAbortController',
        before: ($this,...args) => $this.signal?.aborted
      });
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('fixAbortController');
      this.logOption('Fix AbortController in debug mode', value);
      parent.global.AbortController.prototype.abort=parent.unwrapFunction(parent.global.AbortController.prototype.abort,'fixAbortController');
      if (!value) return;
      parent.global.AbortController.prototype.abort=parent.wrapFunction(parent.global.AbortController.prototype.abort,{ 
        id:'fixAbortController',
        before: ($this,...args) => $this.signal?.aborted
      });
    }
  }
  LiChessTools.Tools.FixAbortController=FixAbortControllerTool;
})();
