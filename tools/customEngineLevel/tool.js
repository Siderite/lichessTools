(() => {
  class CustomEngineLevelTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'customEngineLevel',
        category: 'analysis',
        type: 'number',
        defaultValue: undefined,
        advanced: true
      },
      {
          name: 'customEnginePracticeLevel',
          category: 'analysis',
          type: 'number',
          defaultValue: undefined,
          advanced: true
      },
      {
        name: 'customEngineOptions',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['noCloud', 'noCloudExternal', 'infiniteExternal', 'practice', 'fix503', 'plus'],
        defaultValue: 'plus',
        advanced: true
      }
    ];

    upgrades = [
      { name:'customEngineOptions', value:'plus', version: '2.4.138', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.customEngineLevel': 'Custom analysis engine depth',
        'options.customEnginePracticeLevel': 'Custom practice engine depth',
        'options.customEngineOptions': 'Custom analysis engine options',
        'customEngineOptions.noCloud': 'Ignore cloud data for evaluation',
        'customEngineOptions.noCloudExternal': 'Ignore cloud data for external engines',
        'customEngineOptions.infiniteExternal': 'Infinite analysis for external engines',
        'customEngineOptions.practice': 'Apply in Practice mode',
        'customEngineOptions.fix503': 'Fix external engine 503 errors',
        'customEngineOptions.plus': '+ keyboard shortcut',
        'applyInPractice': 'Custom engine settings in Practice mode',
        'practiceDepthTitle': 'LiChess Tools - custom practice engine depth',
        'practiceDepthText': 'Practice engine depth: %s',
        'engineDepthTitle': 'LiChess Tools - custom engine depth',
        'engineDepthText': 'Custom engine depth: %s'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.customEngineLevel': 'Nivel personalizat pentru motorul de analiz\u0103',
        'options.customEnginePracticeLevel': 'Nivel pentru motorul de analiz\u0103 \u00een mod Practic\u0103',
        'options.customEngineOptions': 'Op\u0163iuni motor analiz\u0103 personalizat',
        'customEngineOptions.noCloud': 'Ignor\u0103 cloud pentru evalu\u0103ri',
        'customEngineOptions.noCloudExternal': 'Ignor\u0103 cloud pentru motoare externe',
        'customEngineOptions.infiniteExternal': 'Analiz\u0103 infinit\u0103 pentru motoare externe',
        'customEngineOptions.practice': 'Aplic\u0103 \u00een mod Practic\u0103',
        'customEngineOptions.fix503': 'Repar\u0103 erori 503 la motoare analiz\u0103 externe',
        'customEngineOptions.plus': 'Scurt\u0103tur\u0103 taste +',
        'applyInPractice': 'Set\u0103ri motor personalizat \u00een mod Practic\u0103',
        'practiceDepthTitle': 'LiChess Tools - nivel pentru motorul de analiz\u0103 \u00een mod Practic\u0103',
        'practiceDepthText': 'Nivel motor \u00een mod Practic\u0103: %s',
        'engineDepthTitle': 'LiChess Tools - nivel personalizat pentru motorul de analiz\u0103',
        'engineDepthText': 'Nivel motor analiz\u0103: %s'
      }
    }

    analysisControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;

      const isExternalEngine = /external/i.test(analysis.ceval?.engines?.active?.tech);

      const isPractice = analysis.practice?.running() || analysis.study?.practice;
      if (!isPractice || this.options.practice) {
        const targetDepth = isPractice
          ? this.options.practiceDepth || this.options.depth
          : this.options.depth;
        const customDepth = analysis.ceval?.isInfinite || (analysis.ceval?.isDeeper() && !analysis.node.autoDeeper) || (this.options.infiniteExternal && isExternalEngine)
          ? 99
          : (analysis.node.autoDeeper || targetDepth);
        if (customDepth && analysis.cevalEnabled() && !analysis.ceval.showingCloud) {
          const elem = $('div.ceval div.engine span.info');
          const pattern = lt.global.i18n?.site?.depthX('\\d+');
          if (!pattern) {
            lt.global.console.warn('Could not determine the pattern for depth regular expression');
            // lichess keeps a reference to the actual node
            elem.replaceText(text=>{
              return text
                       .replace(/(\d+)(?:\/\d+)+/, '$1/' + customDepth);
            }, true);
          } else {
            const reg = new RegExp('^('+pattern+')(?:\\/\\d+)?$');
            // lichess keeps a reference to the actual node
            elem.replaceText(text=>{
              return text
                       .replace(reg, '$1/' + customDepth);
            }, true);
          }
        }
      }
      

      $('.tview2').toggleClassSafe('lichessTools-noCloud', this.options.noCloud || (isExternalEngine && this.options.noCloudExternal));
      const container = $('div.analyse__tools div.action-menu');
      if (!container.length) return;

      if (!$('.abset-noCloud', container).length) {
        const html = `<div class="setting abset-noCloud" title="LiChess Tools - $trans(customEngineOptions.noCloud)">
      <div class="switch">
        <input id="abset-noCloud" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-noCloud"></label>
      </div>
      <label for="abset-noCloud">$trans(customEngineOptions.noCloud)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g, m => {
          return lt.htmlEncode(trans.noarg(m.slice(7, -1)));
        });
        $(html).insertAfter($('div.abset-gauge, .setting', container).last());
        $('#abset-noCloud')
          .on('change', async () => {
            const options = lt.currentOptions;
            options.customEngineOptions = [
              $('#abset-noCloud').is(':checked') ? 'noCloud' : '',
              this.options.noCloudExternal ? 'noCloudExternal' : '',
              this.options.practice ? 'practice' : ''
            ].filter(o => o).join(',');
            await lt.applyOptions(options);
            lt.fireReloadOptions();
          });
      }
      $('#abset-noCloud')
        .prop('checked', this.options.noCloud);


      if (!$('.abset-noCloudExternal', container).length) {
        const html = `<div class="setting abset-noCloudExternal" title="LiChess Tools - $trans(customEngineOptions.noCloudExternal)">
      <div class="switch">
        <input id="abset-noCloudExternal" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-noCloudExternal"></label>
      </div>
      <label for="abset-noCloudExternal">$trans(customEngineOptions.noCloudExternal)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g, m => {
          return lt.htmlEncode(trans.noarg(m.slice(7, -1)));
        });
        $(html).insertAfter($('div.abset-noCloud', container).eq(0));
        $('#abset-noCloudExternal')
          .on('change', async () => {
            const options = lt.currentOptions;
            options.customEngineOptions = [$('#abset-noCloudExternal').is(':checked') ? 'noCloudExternal' : '', this.options.practice ? 'practice' : ''].filter(o => o).join(',');
            options.customEngineOptions = [
              this.options.noCloud ? 'noCloud' : '',
              $('#abset-noCloudExternal').is(':checked') ? 'noCloudExternal' : '',
              this.options.practice ? 'practice' : ''
            ].filter(o => o).join(',');
            await lt.applyOptions(options);
            lt.fireReloadOptions();
          });
      }
      $('#abset-noCloudExternal')
        .prop('checked', this.options.noCloudExternal);
      $('div.abset-noCloudExternal').toggle(isExternalEngine);


      if (!$('.abset-engine-depth', container).length) {
        const html = `<div class="setting abset-engine-depth">
          <label for="abset-engine-depth"></label>
          <input id="abset-engine-depth" type="range" class="range" min="0" max="50">
        </div>`;
        $(html).insertAfter($('div.abset-noCloudExternal', container).eq(0));
        $('div.abset-engine-depth',container)
          .attr('title',trans.noarg('engineDepthTitle'));
        const input = $('#abset-engine-depth');
        const saveEngineDepth = lt.debounce(async ()=>{
            const options = lt.currentOptions;
            options.customEngineLevel = +input.val() || undefined;
            await lt.applyOptions(options);
            lt.fireReloadOptions();
          },1000);
        input
          .on('input',()=>{
            const depth = +input.val() || '';
            $('label[for="abset-engine-depth"]',container)
              .text(trans.pluralSame('engineDepthText',depth));
            saveEngineDepth();
          });
      }
      const engineDepth = this.options.depth || '';
      $('label[for="abset-engine-depth"]',container)
        .text(trans.pluralSame('engineDepthText',engineDepth));
      $('#abset-engine-depth')
        .val(this.options.depth || 0);


      if (!$('.abset-practice', container).length) {
        const html = `<div class="setting abset-practice" title="LiChess Tools - $trans(applyInPractice)">
      <div class="switch">
        <input id="abset-practice" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-practice"></label>
      </div>
      <label for="abset-practice">$trans(applyInPractice)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g, m => {
          return lt.htmlEncode(trans.noarg(m.slice(7, -1)));
        });
        $(html).insertAfter($('div.abset-engine-depth', container).eq(0));
        $('#abset-practice')
          .on('change', async () => {
            const options = lt.currentOptions;
            options.customEngineOptions = [
              this.options.noCloud ? 'noCloud' : '',
              this.options.noCloudExternal ? 'noCloudExternal' : '',
              $('#abset-practice').is(':checked') ? 'practice' : ''
            ].filter(o => o).join(',');
            await lt.applyOptions(options);
            lt.fireReloadOptions();
          });
      }
      $('#abset-practice')
        .prop('checked', this.options.practice);

      if (!$('.abset-practice-depth', container).length) {
        const html = `<div class="setting abset-practice-depth">
          <label for="abset-practice-depth"></label>
          <input id="abset-practice-depth" type="range" class="range" min="0" max="15"><!-- Lichess limitation -->
        </div>`;
        $(html).insertAfter($('div.abset-practice', container).eq(0));
        $('div.abset-practice-depth',container)
          .attr('title',trans.noarg('practiceDepthTitle'));
        const input = $('#abset-practice-depth');
        const savePracticeDepth = lt.debounce(async ()=>{
            const options = lt.currentOptions;
            options.customEnginePracticeLevel = +input.val() || undefined;
            await lt.applyOptions(options);
            lt.fireReloadOptions();
          },1000);
        input
          .on('input',()=>{
            let depth = +input.val() || this.options.depth || '';
            if (depth>15) depth = 15; // Lichess limitation
            $('label[for="abset-practice-depth"]',container)
              .text(trans.pluralSame('practiceDepthText',depth));
            savePracticeDepth();
          });
      }
      let practiceDepth = (this.options.practice && (this.options.practiceDepth || this.options.depth)) || '';
      if (practiceDepth>15) practiceDepth = 15; // Lichess limitation
      $('label[for="abset-practice-depth"]',container)
        .text(trans.pluralSame('practiceDepthText',practiceDepth));
      $('#abset-practice-depth')
        .val(this.options.practiceDepth || 0);
      $('div.abset-practice-depth',container)
        .find('input')
        .prop('disabled',!this.options.practice);
    };


    determineCevalState = (evl, work) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;

      const isPractice = analysis.practice?.running() || analysis.study?.practice;
      if (isPractice && !this.options.practice) return;
      if (!analysis.cevalEnabled()) return;

      const node = work
        ? analysis.tree.nodeAtPath(work.path)
        : analysis.ceval.lastStarted?.steps?.at(-1);
      if (!node) return;

      const targetDepth = isPractice 
        ? this.options.practiceDepth || this.options.depth
        : this.options.depth;
      const curDepth = (work?.threatMode || analysis.threatMode())
        ? analysis.ceval.curEval.depth
        : node.ceval?.depth || evl?.depth;
      const state = analysis.ceval.state;
      const isIdle = state == 0 || state == 2;
      const isExternalEngine = /external/i.test(analysis.ceval?.engines?.active?.tech);
      const noCloud = this.options.noCloud || (isExternalEngine && this.options.noCloudExternal);

      if (analysis.ceval.canGoDeeper && isIdle) {
        if ((analysis.ceval.showingCloud && noCloud) || (targetDepth && curDepth < (node.autoDeeper || targetDepth)) || (this.options.infiniteExternal && isExternalEngine)) {
          node.autoDeeper = targetDepth;
          analysis.ceval.goDeeper();
          lt.analysisRedraw();
          return;
        }
      }
      if (!analysis.ceval.showingCloud && (node.autoDeeper || !analysis.ceval.isDeeper())
        && targetDepth && curDepth >= (node.autoDeeper || targetDepth) && (!this.options.infiniteExternal || !isExternalEngine)) {
        node.autoDeeper = undefined;
        if (analysis.ceval.state == 3) {
          analysis.ceval.stop();
          if (analysis.node.ceval) {
            const depth = analysis.node.ceval.depth;
            if (analysis.practice?.running()) {
              analysis.node.ceval.depth = 100;
              analysis.practice.onCeval();
              analysis.node.ceval.depth = depth;
            } else {
              if (curDepth>depth) {
                analysis.node.ceval.depth = curDepth;
              }
            }
          }
          lt.global.setTimeout(()=>{
            if (!$('div.ceval a.deeper').length) {
              lt.analysisRedraw();
            }
          },100);
        }
        return false;
      }
    };

    wrapEval = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;

      if (this.options.depth || this.options.practiceDepth || this.options.noCloud || this.options.noCloudExternal || this.options.infiniteExternal) {
        if (!lt.isWrappedFunction(analysis.evalCache.onLocalCeval, 'customEngineOptions')) {
          analysis.evalCache.onLocalCeval = lt.wrapFunction(analysis.evalCache.onLocalCeval, {
            id: 'customEngineOptions',
            before: ($this, ...args) => {
              this.determineCevalState();
            }
          });
        }
        if (analysis.ceval?.onEmit && !lt.isWrappedFunction(analysis.ceval.onEmit, 'customEngineOptions')) {
          analysis.ceval.onEmit = lt.wrapFunction(analysis.ceval.onEmit, {
            id: 'customEngineOptions',
            before: ($this, evl, node, threatMode) => {
              return this.determineCevalState(evl, node, threatMode);
            }
          });
        }
      } else {
        analysis.evalCache.onLocalCeval = lt.unwrapFunction(analysis.evalCache.onLocalCeval, 'customEngineOptions');
        if (analysis.ceval?.onEmit) {
          analysis.ceval.onEmit = lt.unwrapFunction(analysis.ceval.onEmit, 'customEngineOptions');
        }
      }

      if (this.options.noCloud || this.options.noCloudExternal) {
        if (!lt.isWrappedFunction(analysis.evalCache.fetch, 'customEngineOptions')) {
          analysis.evalCache.fetch = lt.wrapFunction(analysis.evalCache.fetch, {
            id: 'customEngineOptions',
            before: ($this, ...args) => {
              const isExternalEngine = /external/i.test(analysis.ceval?.engines?.active?.tech);
              const noCloud = this.options.noCloud || (isExternalEngine && this.options.noCloudExternal);
              if (!noCloud) return;
              if ((analysis.practice?.running() || analysis.study?.practice) && !this.options.practice) return;
              return false;
            }
          });
        }
        if (!lt.isWrappedFunction(analysis.explorer.fetchTablebaseHit, 'customEngineOptions')) {
          analysis.explorer.fetchTablebaseHit = lt.wrapFunction(analysis.explorer.fetchTablebaseHit, {
            id: 'customEngineOptions',
            before: ($this, ...args) => {
              const isExternalEngine = /external/i.test(analysis.ceval?.engines?.active?.tech);
              const noCloud = this.options.noCloud || (isExternalEngine && this.options.noCloudExternal);
              if (!noCloud) return;
              if ((analysis.practice?.running() || analysis.study?.practice) && !this.options.practice) return;
              return false;
            },
            after: ($this, result, ...args) => {
              const isExternalEngine = /external/i.test(analysis.ceval?.engines?.active?.tech);
              const noCloud = this.options.noCloud || (isExternalEngine && this.options.noCloudExternal);
              if (!noCloud) return;
              if ((analysis.practice?.running() || analysis.study?.practice) && !this.options.practice) return;
              return Promise.reject('Cloud disabled');
            }
          });
        }
      } else {
        analysis.evalCache.fetch = lt.unwrapFunction(analysis.evalCache.fetch, 'customEngineOptions');
        analysis.explorer.fetchTablebaseHit = lt.unwrapFunction(analysis.explorer.fetchTablebaseHit, 'customEngineOptions');
      }

      if (this.options.fix503) {
        if (!lt.isWrappedFunction(analysis.ceval.engineFailed, 'customEngineOptions')) {
          analysis.ceval.engineFailed = lt.wrapFunction(analysis.ceval.engineFailed, {
            id: 'customEngineOptions',
            before: ($this, errorMessage) => {
              if (!this.options.fix503) return;
              if (errorMessage?.includes('Status 503')) {
                if (!this.lastGoDeeper || Date.now() - this.lastGoDeeper > 5000) {
                  if (analysis.cevalEnabled()) {
                    analysis.ceval.goDeeper();
                    lt.global.console.log('503 error. Trying to restart engine');
                    this.lastGoDeeper = Date.now();
                  }
                } else {
                  lt.global.console.log('503 error. Waiting 5s before retrying.');
                }
                return false;
              }
            }
          });
        }
      } else {
        analysis.ceval.engineFailed = lt.unwrapFunction(analysis.ceval.engineFailed, 'customEngineOptions');
      }
    };

    goDeeper = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const ceval = analysis?.ceval;
      if (!ceval?.lastStarted) return;
      ceval.isDeeper(true);
      analysis.node.autoDeeper = 99;
    };

    async start() {
      const lt = this.lichessTools;
      const value = +(lt.currentOptions.getValue('customEngineLevel')) || 0;
      const customEngineOptions = lt.currentOptions.getValue('customEngineOptions');
      const practiceValue = +(lt.currentOptions.getValue('customEnginePracticeLevel')) || 0;
      this.logOption('Custom engine level', value || 'Not set');
      this.logOption('Custom practice engine level', practiceValue || 'Not set');
      this.logOption('Custom engine options', customEngineOptions || 'Not set');
      if (lt.currentOptions?.enableLichessTools === false) return;
      this.options = {
        depth: value,
        practiceDepth: practiceValue,
        noCloud: lt.isOptionSet(customEngineOptions, 'noCloud'),
        noCloudExternal: lt.isOptionSet(customEngineOptions, 'noCloudExternal'),
        infiniteExternal: lt.isOptionSet(customEngineOptions, 'infiniteExternal'),
        practice: lt.isOptionSet(customEngineOptions, 'practice'),
        fix503: lt.isOptionSet(customEngineOptions, 'fix503'),
        plus: lt.isOptionSet(customEngineOptions, 'plus'),
        get isSet() { return this.depth || this.noCloud || this.noCloudExternal || this.practice || this.fix503 || this.plus; }
      };
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;

      lt.unbindKeyHandler('plus', true);
      if (this.options.plus) {
        lt.bindKeyHandler('plus', this.goDeeper);
      }
      lt.pubsub.off('lichessTools.redraw', this.analysisControls);
      lt.pubsub.off('lichessTools.redraw', this.determineCevalState);
      lt.global.clearInterval(this.interval);
      analysis.actionMenu.toggle = lt.unwrapFunction(analysis.actionMenu.toggle, 'customEngineOptions');
      lt.pubsub.on('lichessTools.redraw', this.analysisControls);
      lt.pubsub.on('lichessTools.redraw', this.determineCevalState);
      this.interval = lt.global.setInterval(this.determineCevalState, 5000);
      analysis.actionMenu.toggle = lt.wrapFunction(analysis.actionMenu.toggle, {
        id: 'customEngineOptions',
        after: ($this, result, ...args) => {
          lt.global.setTimeout(this.analysisControls, 100);
        }
      });
      this.analysisControls();

      this.wrapEval();
      analysis.instanciateEvalCache = lt.wrapFunction(analysis.instanciateEvalCache, {
        id: 'customEngineOptions',
        after: ($this, result, ...args) => {
          this.wrapEval();
        }
      });

      this.determineCevalState();
    }

  }
  LiChessTools.Tools.CustomEngineLevel = CustomEngineLevelTool;
})();
