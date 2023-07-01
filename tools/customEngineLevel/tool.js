(()=>{
  class CustomEngineLevelTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'customEngineLevel',
        category: 'analysis',
        type:'number',
        defaultValue: undefined
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.customEngineLevel': 'Minimum analysis engine depth'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.customEngineLevel': 'Nivel minim pentru motorul de analiz\u0103'
      }
    }

    checkEngineLevel=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      if (analysis.practice) return;
      const customEngineDepth=+(parent.currentOptions.getValue('customEngineLevel'));
      const ceval = analysis.ceval;
      const state=ceval.getState();
      const cloud=ceval.showingCloud();
      const isIdle = state===2 || cloud;
      const isRunning = state===3 && !cloud;
      const node = analysis.node;
      if (!ceval.lastStarted) {
         return;
      }
      const step = ceval.lastStarted.steps.at(-1);
      if (!step?.ceval) return;
      const depth = step.ceval.depth;
      if (isIdle) {
	    if (depth<customEngineDepth && ceval.canGoDeeper()) {
          node.autoDeeper=customEngineDepth;
          node.startDepth=step.ceval.depth;
          ceval.goDeeper();
        } else {
          if (ceval.isDeeper()) {
            ceval.isDeeper(false);
            analysis.redraw();
          }
        }
      }
      if (node.autoDeeper && depth>=customEngineDepth) {
        node.autoDeeper=null;
        node.startDepth=null;
        ceval.stop();
        ceval.isDeeper(false);
        analysis.redraw();
      }
      if (node.autoDeeper && node.autoDeeper!=customEngineDepth && ceval.enabled()) {
        ceval.enabled(false);
        ceval.enabled(true);
        analysis.redraw();
      }
    };


    injectCeval=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      const ceval=analysis.ceval;
      ceval.effectiveMaxDepth=parent.wrapFunction(ceval.effectiveMaxDepth,{
        after:($this,oldMaxLevel)=>{
          const node=analysis.node;
          if (node.autoDeeper>(node.startDepth||oldMaxLevel)) {
            return node.autoDeeper;
          }
          const customEngineDepth=+(parent.currentOptions.getValue('customEngineLevel'));
          if (customEngineDepth && oldMaxLevel<customEngineDepth) {
            return customEngineDepth;
          } else {
            return oldMaxLevel;
          }
        }
      });
    };


    async start() {
      const parent=this.lichessTools;
      const value=+(parent.currentOptions.getValue('customEngineLevel'));
      this.logOption('Custom engine level', value || 'Not set');
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      parent.global.clearInterval(this.engineCheckInterval);
      const ceval=analysis.ceval;
      ceval.effectiveMaxDepth=parent.unwrapFunction(ceval.effectiveMaxDepth);
      if (value) {
        this.injectCeval();
        this.engineCheckInterval=parent.global.setInterval(this.checkEngineLevel,1000);
      } else {
        if (ceval.enabled()) {
          ceval.enabled(false);
          ceval.enabled(true);
          analysis.redraw();
        }
      }
    }

  }
  LiChessTools.Tools.CustomEngineLevel=CustomEngineLevelTool;
})();
