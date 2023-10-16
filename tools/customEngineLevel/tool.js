(()=>{
  class CustomEngineLevelTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'customEngineLevel',
        category: 'analysis',
        type:'number',
        defaultValue: undefined,
        advanced: true
      },
      {
        name:'noCloud',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.customEngineLevel': 'Minimum analysis engine depth',
        'options.noCloud': 'No cloud computer evaluations'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.customEngineLevel': 'Nivel minim pentru motorul de analiz\u0103',
        'options.noCloud': 'F\u0103r\u0103 evalu\u0103ri computer din cloud'
      }
    }

    checkEngineLevel=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      if (analysis.practice) return;
      let customEngineDepth=+(parent.currentOptions.getValue('customEngineLevel'));
      if (!customEngineDepth && this.options.noCloud) customEngineDepth=99;
      const ceval = analysis.ceval;
      if (!ceval.enabled()) return;
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
	    if (((cloud && this.options.noCloud) || depth<customEngineDepth)) {
          if (ceval.canGoDeeper()) {
            node.autoDeeper=customEngineDepth;
            node.startDepth=step.ceval.depth;
            ceval.goDeeper();
          }
        } else {
          if (ceval.isDeeper()) {
            ceval.isDeeper(false);
            analysis.redraw();
          }
        }
      }
      if (node.autoDeeper && depth>=customEngineDepth && (!cloud || !this.options.noCloud)) {
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
        id:'customEngineLevel',
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

    analysisControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      $('.tview2').toggleClass('lichessTools-noCloud',this.options.indentedVariations);
      const container=$('div.analyse__tools div.action-menu');
      if (!container.length) return;
      if (!$('.abset-noCloud',container).length) {
        const html=`<div class="setting abset-noCloud" title="LiChess Tools - $trans(options.noCloud)">
      <div class="switch">
        <input id="abset-noCloud" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-noCloud"></label>
      </div>
      <label for="abset-noCloud">$trans(options.noCloud)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g,m=>{
          return parent.htmlEncode(trans.noarg(m.slice(7,-1)));
        });
        $(html).insertAfter($('div.abset-enable-nnue',container).eq(0));
        $('#abset-noCloud')
          .on('change',async ()=>{
            const options=parent.currentOptions;
            options.noCloud=$('#abset-noCloud').is(':checked');
            await parent.applyOptions(options);
            parent.fireReloadOptions();
          });
      }
      $('#abset-noCloud')
        .prop('checked',this.options.noCloud);
    };

    async start() {
      const parent=this.lichessTools;
      const value=+(parent.currentOptions.getValue('customEngineLevel'));
      this.logOption('Custom engine level', value || 'Not set');
      this.options={
        enabled: value,
        noCloud: parent.currentOptions.getValue('noCloud'),
        get isSet() { return this.enabled || this.noCloud; }
      };
      this.logOption('Do not show cloud', this.options.noCloud);
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      parent.global.clearInterval(this.engineCheckInterval);
      const ceval=analysis.ceval;
      ceval.effectiveMaxDepth=parent.unwrapFunction(ceval.effectiveMaxDepth,'customEngineLevel');
      if (this.options.isSet) {
        this.injectCeval();
        this.engineCheckInterval=parent.global.setInterval(this.checkEngineLevel,500);
      } else {
        if (ceval.enabled()) {
          ceval.enabled(false);
          ceval.enabled(true);
          analysis.redraw();
        }
      }
      lichess.pubsub.off('redraw',this.analysisControls);
      lichess.analysis.actionMenu.toggle=lichessTools.unwrapFunction(lichess.analysis.actionMenu.toggle,'noCloud');
      lichess.pubsub.on('redraw',this.analysisControls);
      lichess.analysis.actionMenu.toggle=lichessTools.wrapFunction(lichess.analysis.actionMenu.toggle,{
        id:'noCloud',
        after: ($this, result, ...args)=>{
          parent.global.setTimeout(this.analysisControls,100);
        }
      });
      this.analysisControls();
    }

  }
  LiChessTools.Tools.CustomEngineLevel=CustomEngineLevelTool;
})();
