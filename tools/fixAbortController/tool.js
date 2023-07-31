(()=>{
  class FixAbortControllerTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'fixAbortController',
        category: 'general',
        type:'single',
        possibleValues: [true,false],
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
