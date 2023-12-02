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
        name:'customEngineOptions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['noCloud','practice'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.customEngineLevel': 'Custom analysis engine depth',
        'options.customEngineOptions': 'Custom analysis engine options',
        'customEngineOptions.noCloud': 'Always use local engine for evaluation',
        'customEngineOptions.practice': 'Apply in Practice mode',
        'applyInPractice': 'Custom engine settings in Practice mode'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.customEngineLevel': 'Nivel personalizat pentru motorul de analiz\u0103',
        'options.customEngineOptions': 'Op\u0163iuni motor analiz\u0103 personalizat',
        'customEngineOptions.noCloud': 'Folose\u015fte numai motorul local pentru evalu\u0103ri',
        'customEngineOptions.practice': 'Aplic\u0103 \u00een mod Practic\u0103',
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
        const customDepth=analysis.ceval?.infinite() || (analysis.ceval?.isDeeper() && !analysis.node.autoDeeper)
          ? 99
          : this.options.depth;
        if (customDepth && analysis.ceval.enabled() && !analysis.ceval.showingCloud()) {
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

      if (analysis.practice?.running() && !this.options.practice) return;
      if (!analysis.ceval.enabled()) return;

      const node=analysis.ceval.lastStarted?.steps?.at(-1);
      const curDepth=node?.ceval?.depth;
      if (analysis.ceval.canGoDeeper() && analysis.ceval.getState()==2) {
        if ((analysis.ceval.showingCloud() && this.options.noCloud) || (this.options.depth && curDepth<(node.autoDeeper || this.options.depth) ))
        {
          node.autoDeeper=this.options.depth;
          analysis.ceval.goDeeper();
          analysis.redraw();
          return;
        }
      }
      if (!analysis.ceval.showingCloud() && (node.autoDeeper || !analysis.ceval.isDeeper())
          && this.options.depth && curDepth>=this.options.depth)
      {
        node.autoDeeper=undefined;
        analysis.ceval.stop();
        analysis.redraw();
      }
    };

    wrapEval=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;

      if (this.options.depth||this.options.noCloud) {
        if (!parent.isWrappedFunction(analysis.evalCache.onCeval,'customEngineOptions')) {
          analysis.evalCache.onCeval=parent.wrapFunction(analysis.evalCache.onCeval,{
            id:'customEngineOptions',
            before:($this,...args)=>{
              this.determineCevalState();
            }
          });
        }
      } else {
          analysis.evalCache.onCeval=parent.unwrapFunction(analysis.evalCache.onCeval,'customEngineOptions');
      }

      if (this.options.noCloud) {
        if (!parent.isWrappedFunction(analysis.evalCache.fetch,'customEngineOptions')) {
          analysis.evalCache.fetch=parent.wrapFunction(analysis.evalCache.fetch,{
            id:'customEngineOptions',
            before:($this,...args)=>{
               if (!this.options.noCloud) return;
               if (analysis.practice?.running() && !this.options.practice) return;
               return false;
            }
          });
        }
        if (!parent.isWrappedFunction(analysis.explorer.fetchTablebaseHit,'customEngineOptions')) {
          analysis.explorer.fetchTablebaseHit=parent.wrapFunction(analysis.explorer.fetchTablebaseHit,{
            id:'customEngineOptions',
            before:($this,...args)=>{
               if (!this.options.noCloud) return;
               if (analysis.practice?.running() && !this.options.practice) return;
               return false;
            },
            after:($this,result,...args)=>{
               if (!this.options.noCloud) return;
               if (analysis.practice?.running() && !this.options.practice) return;
               return Promise.reject('Cloud disabled');
            }
          });
        }
      } else {
        analysis.evalCache.fetch=parent.unwrapFunction(analysis.evalCache.fetch,'customEngineOptions');
        analysis.explorer.fetchTablebaseHit=parent.unwrapFunction(analysis.explorer.fetchTablebaseHit,'customEngineOptions');
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
        get isSet() { return this.depth || this.noCloud || this.practice; }
      };
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;

      lichess.pubsub.off('redraw',this.analysisControls);
      lichess.pubsub.off('redraw',this.determineCevalState);
      analysis.actionMenu.toggle=lichessTools.unwrapFunction(analysis.actionMenu.toggle,'customEngineOptions');
      lichess.pubsub.on('redraw',this.analysisControls);
      lichess.pubsub.on('redraw',this.determineCevalState);
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
