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

    checkEngineLevel=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      if (!this.options.practice && analysis.practice) return;
      let customEngineDepth=this.options.depth;
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
          if (!ceval.isDeeper() && ceval.canGoDeeper()) {
            node.autoDeeper=customEngineDepth;
            node.startDepth=step.ceval.depth;
            setTimeout(()=>{
              if (ceval.isDeeper() || !ceval.canGoDeeper()) return;
              ceval.goDeeper();
              analysis.redraw();
            },50);
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

    analysisControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;

      if (analysis.practice) {
        if (this.options.practice) {
          if (!parent.isWrappedFunction(analysis.explorer.fetchTablebaseHit,'customEngineLevel')) {
            analysis.explorer.fetchTablebaseHit=parent.wrapFunction(analysis.explorer.fetchTablebaseHit,{
              id:'customEngineLevel',
              after:($this,result,...args)=>{
                if (analysis.practice?.running() && this.options.practice && this.options.noCloud) {
                  return Promise.reject('not in tablebase');
                }
              }
            });
          }

          if (!parent.isWrappedFunction(analysis.practice.onCeval,'customEngineLevel')) {
            analysis.practice.onCeval=parent.wrapFunction(analysis.practice.onCeval,{
              id:'customEngineLevel',
              before:($this,...args)=>{
                if (this._inOnCeval||analysis.practice.isMyTurn()||!analysis.practice.running()) return;
                this._inOnCeval=true;
                this._ceval=null;
                this._node=analysis.ceval.lastStarted?.steps?.at(-1);//analysis.node
                const ceval=this._node?.ceval;
                if (!ceval) return;
                if (this.options.noCloud && ceval.cloud) {
                  this._ceval={ ...ceval };
                  ceval.depth=1;
                } else
                if (this.options.depth) {
                  if (ceval.depth>1 && ceval.depth<this.options.depth) {
                    this._ceval={ ...ceval };
                    ceval.depth=1;
                  } else {
                    const playableDepth=analysis.practice.playableDepth();
                    if (ceval.depth>=this.options.depth && ceval.depth<playableDepth) {
                      this._ceval={ ...ceval };
                      ceval.depth=playableDepth;
                    }
                  }
                }
              },
              after:($this,result,...args)=>{
                if (this._ceval) {
                  const ceval=this._node.ceval;
                  ceval.depth=this._ceval.depth;
                }
                this._inOnCeval=false;
              }
            });
          }
        } else {
          analysis.practice.onCeval=parent.unwrapFunction(analysis.practice.onCeval,'customEngineLevel');
          analysis.explorer.fetchTablebaseHit=parent.unwrapFunction(analysis.explorer.fetchTablebaseHit,'customEngineLevel');
        }
      } else {
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
      parent.global.clearInterval(this.engineCheckInterval);
      const ceval=analysis.ceval;
      if (this.options.isSet) {
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
