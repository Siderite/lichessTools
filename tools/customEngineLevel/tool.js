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
        name: 'customEngineOptions',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['noCloud', 'noCloudExternal', 'practice', 'fix503'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.customEngineLevel': 'Custom analysis engine depth',
        'options.customEngineOptions': 'Custom analysis engine options',
        'customEngineOptions.noCloud': 'Ignore cloud data for evaluation',
        'customEngineOptions.noCloudExternal': 'Ignore cloud data for external engines',
        'customEngineOptions.practice': 'Apply in Practice mode',
        'customEngineOptions.fix503': 'Fix external engine 503 errors',
        'applyInPractice': 'Custom engine settings in Practice mode'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.customEngineLevel': 'Nivel personalizat pentru motorul de analiz\u0103',
        'options.customEngineOptions': 'Op\u0163iuni motor analiz\u0103 personalizat',
        'customEngineOptions.noCloud': 'Ignor\u0103 cloud pentru evalu\u0103ri',
        'customEngineOptions.noCloudExternal': 'Ignor\u0103 cloud pentru motoare externe',
        'customEngineOptions.practice': 'Aplic\u0103 \u00een mod Practic\u0103',
        'customEngineOptions.fix503': 'Repar\u0103 erori 503 la motoare analiz\u0103 externe',
        'applyInPractice': 'Set\u0103ri motor personalizat \u00een mod Practic\u0103'
      }
    }

    analysisControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;

      if (!analysis.practice) {
        const customDepth = analysis.ceval?.isInfinite || (analysis.ceval?.isDeeper() && !analysis.node.autoDeeper)
          ? 99
          : this.options.depth;
        if (customDepth && analysis.ceval.enabled() && !analysis.ceval.showingCloud) {
          const elem = $('div.ceval div.engine span.info');
          // lichess keeps a reference to the actual node
          elem.replaceText(text=>text.replace(/(\d+)(?:\/\d+)?/, '$1/' + customDepth))
        }
      }

      const isExternal = /external/i.test(analysis.ceval?.engines?.active?.tech);

      $('.tview2').toggleClass('lichessTools-noCloud', this.options.noCloud || (isExternal && this.options.noCloudExternal));
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
        $(html).insertAfter($('div.abset-gauge', container).eq(0));
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
      $('div.abset-noCloudExternal').toggle(isExternal);


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
        $(html).insertAfter($('div.abset-noCloudExternal', container).eq(0));
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

    };


    determineCevalState = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;

      if ((analysis.practice?.running() || analysis.study?.practice) && !this.options.practice) return;
      if (!analysis.ceval.enabled()) return;

      const node = analysis.ceval.lastStarted?.steps?.at(-1);
      if (!node) return;
      const curDepth = analysis.threatMode()
        ? analysis.ceval.curEval.depth
        : node.ceval?.depth;
      const state = analysis.ceval.state;
      const isIdle = state == 0 || state == 2;
      const isExternal = /external/i.test(analysis.ceval?.engines?.active?.tech);
      const noCloud = this.options.noCloud || (isExternal && this.options.noCloudExternal);
      if (analysis.ceval.canGoDeeper && isIdle) {
        if ((analysis.ceval.showingCloud && noCloud) || (this.options.depth && curDepth < (node.autoDeeper || this.options.depth))) {
          node.autoDeeper = this.options.depth;
          analysis.ceval.goDeeper();
          analysis.redraw();
          return;
        }
      }
      if (!analysis.ceval.showingCloud && (node.autoDeeper || !analysis.ceval.isDeeper())
        && this.options.depth && curDepth >= this.options.depth) {
        node.autoDeeper = undefined;
        if (analysis.ceval.state == 3) {
          analysis.ceval.stop();
          analysis.redraw();
          if (analysis.node.ceval && analysis.practice?.running()) {
            const depth = analysis.node.ceval.depth;
            analysis.node.ceval.depth = 100;
            analysis.practice.onCeval();
            analysis.node.ceval.depth = depth;
          }
        }
      }
    };

    wrapEval = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;

      if (this.options.depth || this.options.noCloud || this.options.noCloudExternal) {
        if (!lt.isWrappedFunction(analysis.evalCache.onLocalCeval, 'customEngineOptions')) {
          analysis.evalCache.onLocalCeval = lt.wrapFunction(analysis.evalCache.onLocalCeval, {
            id: 'customEngineOptions',
            before: ($this, ...args) => {
              this.determineCevalState();
            }
          });
        }
      } else {
        analysis.evalCache.onLocalCeval = lt.unwrapFunction(analysis.evalCache.onLocalCeval, 'customEngineOptions');
      }

      if (this.options.noCloud || this.options.noCloudExternal) {
        if (!lt.isWrappedFunction(analysis.evalCache.fetch, 'customEngineOptions')) {
          analysis.evalCache.fetch = lt.wrapFunction(analysis.evalCache.fetch, {
            id: 'customEngineOptions',
            before: ($this, ...args) => {
              const isExternal = /external/i.test(analysis.ceval?.engines?.active?.tech);
              const noCloud = this.options.noCloud || (isExternal && this.options.noCloudExternal);
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
              const isExternal = /external/i.test(analysis.ceval?.engines?.active?.tech);
              const noCloud = this.options.noCloud || (isExternal && this.options.noCloudExternal);
              if (!noCloud) return;
              if ((analysis.practice?.running() || analysis.study?.practice) && !this.options.practice) return;
              return false;
            },
            after: ($this, result, ...args) => {
              const isExternal = /external/i.test(analysis.ceval?.engines?.active?.tech);
              const noCloud = this.options.noCloud || (isExternal && this.options.noCloudExternal);
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
                  if (analysis.ceval.enabled()) {
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

    async start() {
      const lt = this.lichessTools;
      const value = +(lt.currentOptions.getValue('customEngineLevel'));
      const customEngineOptions = lt.currentOptions.getValue('customEngineOptions');
      this.logOption('Custom engine level', value || 'Not set');
      this.logOption('Custom engine options', customEngineOptions || 'Not set');
      this.options = {
        depth: value,
        noCloud: lt.isOptionSet(customEngineOptions, 'noCloud'),
        noCloudExternal: lt.isOptionSet(customEngineOptions, 'noCloudExternal'),
        practice: lt.isOptionSet(customEngineOptions, 'practice'),
        fix503: lt.isOptionSet(customEngineOptions, 'fix503'),
        get isSet() { return this.depth || this.noCloud || this.noCloudExternal || this.practice || this.fix503; }
      };
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;

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
