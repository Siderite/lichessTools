(()=>{
  class CustomEngineLevelTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'customEngineLevel',
        category: 'analysis',
        type:'number',
        defaultValue: undefined,
        advanced: true
      },
      {
        name:'customEngineOptions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['noCloud','practice','fix503'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.customEngineLevel': 'Custom analysis engine depth',
        'options.customEngineOptions': 'Custom analysis engine options',
        'customEngineOptions.noCloud': 'Ignore cloud data for evaluation',
        'customEngineOptions.practice': 'Apply in Practice mode',
        'customEngineOptions.fix503': 'Fix external engine 503 errors',
        'applyInPractice': 'Custom engine settings in Practice mode'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.customEngineLevel': 'Nivel personalizat pentru motorul de analiz\u0103',
        'options.customEngineOptions': 'Op\u0163iuni motor analiz\u0103 personalizat',
        'customEngineOptions.noCloud': 'Ignor\u0103 datele din cloud pentru evalu\u0103ri',
        'customEngineOptions.practice': 'Aplic\u0103 \u00een mod Practic\u0103',
        'customEngineOptions.fix503': 'Repar\u0103 erori 503 la motoare analiz\u0103 externe',
        'applyInPractice': 'Set\u0103ri motor personalizat \u00een mod Practic\u0103'
      }
    }

    analysisControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;

      if (!analysis.practice) {
        const customDepth=analysis.ceval?.isInfinite || (analysis.ceval?.isDeeper() && !analysis.node.autoDeeper)
          ? 99
          : this.options.depth;
        if (customDepth && analysis.ceval.enabled() && !analysis.ceval.showingCloud) {
          const elem=$('div.ceval div.engine span.info')[0];
          if (elem) {
            // lichess keeps a reference to the actual node
            const textNode = Array.from(elem.childNodes).find(n=>n.nodeType==3);
            if (textNode) {
              const infoText=textNode.textContent;
              const newText=infoText.replace(/(\d+)(?:\/\d+)?/,'$1/'+customDepth);
              if (infoText!=newText) {
                textNode.textContent=newText;
              }
            }
          }
        }
      }

      $('.tview2').toggleClass('lichessTools-noCloud',this.options.noCloud);
      const container=$('div.analyse__tools div.action-menu');
      if (!container.length) return;

      if (!$('.abset-noCloud',container).length) {
        const html=`<div class="setting abset-noCloud" title="LiChess Tools - $trans(customEngineOptions.noCloud)">
      <div class="switch">
        <input id="abset-noCloud" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-noCloud"></label>
      </div>
      <label for="abset-noCloud">$trans(customEngineOptions.noCloud)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g,m=>{
          return parent.htmlEncode(trans.noarg(m.slice(7,-1)));
        });
        $(html).insertAfter($('div.abset-gauge',container).eq(0));
        $('#abset-noCloud')
          .on('change',async ()=>{
            const options=parent.currentOptions;
            options.customEngineOptions=[$('#abset-noCloud').is(':checked')?'noCloud':'',this.options.practice?'practice':''].filter(o=>o).join(',');
            await parent.applyOptions(options);
            parent.fireReloadOptions();
          });
      }
      $('#abset-noCloud')
        .prop('checked',this.options.noCloud);


      if (!$('.abset-practice',container).length) {
        const html=`<div class="setting abset-practice" title="LiChess Tools - $trans(applyInPractice)">
      <div class="switch">
        <input id="abset-practice" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-practice"></label>
      </div>
      <label for="abset-practice">$trans(applyInPractice)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g,m=>{
          return parent.htmlEncode(trans.noarg(m.slice(7,-1)));
        });
        $(html).insertAfter($('div.abset-noCloud',container).eq(0));
        $('#abset-practice')
          .on('change',async ()=>{
            const options=parent.currentOptions;
            options.customEngineOptions=[this.options.noCloud?'noCloud':'',$('#abset-practice').is(':checked')?'practice':''].filter(o=>o).join(',');
            await parent.applyOptions(options);
            parent.fireReloadOptions();
          });
      }
      $('#abset-practice')
        .prop('checked',this.options.practice);

    };


    determineCevalState=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;

      if ((analysis.practice?.running() || analysis.study?.practice) && !this.options.practice) return;
      if (!analysis.ceval.enabled()) return;

      const node=analysis.ceval.lastStarted?.steps?.at(-1);
      if (!node) return;
      const curDepth=analysis.threatMode()
        ? analysis.ceval.curEval.depth
        : node.ceval?.depth;
      const state=analysis.ceval.state;
      const isIdle = state==0 || state==2;
      if (analysis.ceval.canGoDeeper && isIdle) {
        if ((analysis.ceval.showingCloud && this.options.noCloud) || (this.options.depth && curDepth<(node.autoDeeper || this.options.depth) ))
        {
          node.autoDeeper=this.options.depth;
          analysis.ceval.goDeeper();
          analysis.redraw();
          return;
        }
      }
      if (!analysis.ceval.showingCloud && (node.autoDeeper || !analysis.ceval.isDeeper())
          && this.options.depth && curDepth>=this.options.depth)
      {
        node.autoDeeper=undefined;
        if (analysis.ceval.state==3) {
          analysis.ceval.stop();
          analysis.redraw();
          if (analysis.node.ceval && analysis.practice?.running()) {
            const depth=analysis.node.ceval.depth;
            analysis.node.ceval.depth=100;
            analysis.practice.onCeval();
            analysis.node.ceval.depth=depth;
          }
        }
      }
    };

    wrapEval=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;

      const cevalFunctionKey = analysis.evalCache.onLocalCeval
        ? 'onLocalCeval'
        : 'onCeval';
      if (this.options.depth||this.options.noCloud) {
        if (!parent.isWrappedFunction(analysis.evalCache[cevalFunctionKey],'customEngineOptions')) {
          analysis.evalCache[cevalFunctionKey]=parent.wrapFunction(analysis.evalCache[cevalFunctionKey],{
            id:'customEngineOptions',
            before:($this,...args)=>{
              this.determineCevalState();
            }
          });
        }
      } else {
          analysis.evalCache[cevalFunctionKey]=parent.unwrapFunction(analysis.evalCache[cevalFunctionKey],'customEngineOptions');
      }

      if (this.options.noCloud) {
        if (!parent.isWrappedFunction(analysis.evalCache.fetch,'customEngineOptions')) {
          analysis.evalCache.fetch=parent.wrapFunction(analysis.evalCache.fetch,{
            id:'customEngineOptions',
            before:($this,...args)=>{
               if (!this.options.noCloud) return;
               if ((analysis.practice?.running()||analysis.study?.practice) && !this.options.practice) return;
               return false;
            }
          });
        }
        if (!parent.isWrappedFunction(analysis.explorer.fetchTablebaseHit,'customEngineOptions')) {
          analysis.explorer.fetchTablebaseHit=parent.wrapFunction(analysis.explorer.fetchTablebaseHit,{
            id:'customEngineOptions',
            before:($this,...args)=>{
               if (!this.options.noCloud) return;
               if ((analysis.practice?.running() || analysis.study?.practice) && !this.options.practice) return;
               return false;
            },
            after:($this,result,...args)=>{
               if (!this.options.noCloud) return;
               if ((analysis.practice?.running() || analysis.study?.practice) && !this.options.practice) return;
               return Promise.reject('Cloud disabled');
            }
          });
        }
      } else {
        analysis.evalCache.fetch=parent.unwrapFunction(analysis.evalCache.fetch,'customEngineOptions');
        analysis.explorer.fetchTablebaseHit=parent.unwrapFunction(analysis.explorer.fetchTablebaseHit,'customEngineOptions');
      }

      if (this.options.fix503) {
        if (!parent.isWrappedFunction(analysis.ceval.engineFailed,'customEngineOptions')) {
          analysis.ceval.engineFailed=parent.wrapFunction(analysis.ceval.engineFailed,{
            id:'customEngineOptions',
            before:($this,errorMessage)=>{
               if (!this.options.fix503) return;
               if (errorMessage?.includes('Status 503')) {
                 if (!this.lastGoDeeper || Date.now()-this.lastGoDeeper>5000) {
                   if (analysis.ceval.enabled()) {
                     analysis.ceval.goDeeper();
                     parent.global.console.log('503 error. Trying to restart engine');
                     this.lastGoDeeper=Date.now();
                   }
                 } else {
                   parent.global.console.log('503 error. Waiting 5s before retrying.');
                 }
                 return false;
               }
            }
          });
        }
      } else {
        analysis.ceval.engineFailed=parent.unwrapFunction(analysis.ceval.engineFailed,'customEngineOptions');
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=+(parent.currentOptions.getValue('customEngineLevel'));
      const customEngineOptions=parent.currentOptions.getValue('customEngineOptions');
      this.logOption('Custom engine level', value || 'Not set');
      this.logOption('Custom engine options', customEngineOptions);
      this.options={
        depth: value,
        noCloud: parent.isOptionSet(customEngineOptions,'noCloud'),
        practice: parent.isOptionSet(customEngineOptions,'practice'),
        fix503: parent.isOptionSet(customEngineOptions,'fix503'),
        get isSet() { return this.depth || this.noCloud || this.practice || this.fix503; }
      };
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;

      lichess.pubsub.off('redraw',this.analysisControls);
      lichess.pubsub.off('redraw',this.determineCevalState);
      parent.global.clearInterval(this.interval);
      analysis.actionMenu.toggle=lichessTools.unwrapFunction(analysis.actionMenu.toggle,'customEngineOptions');
      lichess.pubsub.on('redraw',this.analysisControls);
      lichess.pubsub.on('redraw',this.determineCevalState);
      this.interval=parent.global.setInterval(this.determineCevalState,5000);
      analysis.actionMenu.toggle=lichessTools.wrapFunction(analysis.actionMenu.toggle,{
        id:'customEngineOptions',
        after: ($this, result, ...args)=>{
          parent.global.setTimeout(this.analysisControls,100);
        }
      });
      this.analysisControls();

      this.wrapEval();
      analysis.instanciateEvalCache=parent.wrapFunction(analysis.instanciateEvalCache,{
        id:'customEngineOptions',
        after:($this,result,...args)=>{
          this.wrapEval();
        }
      });

      this.determineCevalState();
    }

  }
  LiChessTools.Tools.CustomEngineLevel=CustomEngineLevelTool;
})();
