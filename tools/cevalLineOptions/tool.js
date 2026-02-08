(() => {
  class CevalLineOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'cevalLineOptions',
        category: 'analysis2',
        type: 'multiple',
        possibleValues: ['highlight', 'highlightOnlyMe', 'moreLines', 'colorEvaluation', 'depthChart', 'downloadCeval', 'pvs', 'cost'],
        defaultValue: 'moreLines',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.cevalLineOptions': 'Computer evaluation line options',
        'cevalLineOptions.highlight': 'Highlight same moves',
        'cevalLineOptions.highlightOnlyMe': '...only current orientation',
        'cevalLineOptions.moreLines': 'More lines',
        'cevalLineOptions.colorEvaluation': 'Color evaluation',
        'cevalLineOptions.depthChart': 'Depth chart',
        'cevalLineOptions.downloadCeval': 'Download engine analysis',
        'cevalLineOptions.pvs': 'Plot PVs',
        'cevalLineOptions.cost': 'Move cost',
        'moreLinesTitle': 'LiChess Tools - more lines',
        'downloadCevalButtonTitle': 'LiChess Tools - download analysis',
        'pearlDeviationTitle': 'LiChess Tools - evaluation deviates at $depth ($deviation)'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.cevalLineOptions': 'Op\u0163iuni linii \u00een evaluarea computerului',
        'cevalLineOptions.highlight': 'Eviden\u0163iaza acelea\u015Fi mut\u0103ri',
        'cevalLineOptions.highlightOnlyMe': '...doar orientarea curent\u0103',
        'cevalLineOptions.moreLines': 'Mai multe linii',
        'cevalLineOptions.colorEvaluation': 'Coloreaz\u0103 evaluarea',
        'cevalLineOptions.depthChart': 'Grafic ad\u00e2ncime',
        'cevalLineOptions.downloadCeval': 'Desc\u0103rcare analiz\u0103 computer',
        'cevalLineOptions.pvs': 'Deseneaz\u0103 PVurile',
        'cevalLineOptions.cost': 'Costul mut\u0103rii',
        'moreLinesTitle': 'LiChess Tools - mai multe linii',
        'downloadCevalButtonTitle': 'LiChess Tools - download analysis',
        'pearlDeviationTitle': 'LiChess Tools - evaluarea deviaz\u0103 la $depth ($deviation)'
      }
    }

    getKey = (elem, comp) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const e = $(elem);
      const idx = +($(e).attr('data-move-index')) % 2;
      if (this.options.highlightOnlyMe && idx != comp) return;
      const san = e.text().replace(/[\+#\?!]/, '');
      const turn = (idx + comp) % 2;
      return `${san}-${turn}`;
    };

    dict = new Map();
    clsIndex = 0;
    handlePvsDirect = () => {
      if (this._inHandlePvs) return;
      try {
        this._inHandlePvs=true;
        const lt = this.lichessTools;
        const $ = lt.$;
        const lichess = lt.lichess;
        const analysis = lichess.analysis;
        const analysisTools = $('main .analyse__tools, main .puzzle__tools');
        if (!analysisTools.length) return;
        this.dict = new Map([...this.dict.entries()].filter(e => e[1].cls));
        [...this.dict.values()].forEach(v => v.count = 0);
        const fen = analysis
          ? analysis.node.fen
          : lt.getPositionFromBoard($('.main-board')[0],true);
        if (!fen) return;
        const side = $('.main-board .cg-wrap').is('.orientation-black') ? 1 : 0;
        const turn = fen.includes(' b') ? 1 : 0;
        const comp = side ^ turn;
        $('div.pv_box span.pv-san').each((i, e) => {
          if (!lt.inViewport(e)) return;
          const key = this.getKey(e, comp);
          if (!key) return;
          const data = this.dict.get(key);
          if (data) {
            data.count++;
          } else {
            this.dict.set(key, { count: 1, cls: '' });
          }
        });
        const arr = [...this.dict];
        arr.sort((a, b) => b[1].count - a[1].count);
        const demotes = arr.map(entry => entry[1]).filter(val => val.count <= 1 && val.cls);
        arr.forEach((entry) => {
          const key = entry[0];
          const val = entry[1];
          if (val.count > 1 && !val.cls) {
            if (demotes.length) {
              const demote = demotes.shift();
              val.cls = demote.cls;
              demote.cls = '';
            } else {
              this.clsIndex++;
              if (this.clsIndex > 30) {
                lt.global.console.debug('Ceval highlight class index: ', this.clsIndex);
              }
              val.cls = 'lichessTools-cevalHighlight-' + this.clsIndex;
            }
          }
        });
        $('div.pv_box span.pv-san')
          .each((i, e) => {
            const key = this.getKey(e,comp);
            if (!key) return;
            const val = this.dict.get(key);
            const cls = val?.count > 1 && this.options.highlight
              ? ('pv-san ' + val.cls).trim()
              : 'pv-san';
            if (e.className != cls) e.className = cls;
          });
        let db = null;
        let first = null;
        $('div.pv_box div.pv')
          .each((i, pve) => {
            const e = $(pve).children('strong');
            if (this.options.colorEvaluation) {
              const text = $(e).text();
              const info = text.startsWith('#')
                ? { mate: +text.slice(1) }
                : { cp: (+text) * 100 };
              const val = lt.winPerc(lt.getCentipawns(info));
              if (first === null) {
                first = val;
                $(e).toggleClassSafe('best',true);
              } else {
                const diff = Math.abs(val - first);
                $(e).toggleClassSafe('good',diff<1)
                    .toggleClassSafe('blunder',diff>20)
                    .toggleClassSafe('mistake',diff>10 && diff<=20);
              }
            } else {
              if (e.className) e.className='';
            }
            let cost = null;
            if (this.options.cost) {
              if (db == null) {
                db = this.db.get(analysis.path);
              }
              if (db?.discoverDepth) {
                const uci = $(pve).attr('data-uci');
                cost = uci && db.discoverDepth.get(uci)?.depth;
              }
            }
            const color = lt.getGradientColor(cost, [{ q: 0, color: '#00FF00' }, { q: 5, color: '#FFFF00' }, { q: 10, color: '#FF8000' }, { q: 15, color: '#FF0000' }]);
            if (cost) {
              $(pve).attrSafe('data-cost',cost)
                    .css('--cost-color',color);
            } else {
              $(pve).removeAttr('data-cost')
                    .css('--cost-color',null);
            }
          });
      } finally {
        this._inHandlePvs=false;
      }
    };
    handlePvs = lichessTools.debounce(this.handlePvsDirect,100);

    updateMoreLinesText = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const input = $('div.setting #analyse-multipv');
      if (!input.length) return;
      $('div.setting:has(#analyse-multipv) .range_value')
        .text(input.val()+' / '+input.attr('max'));
    };

    //Lichess API limitation: https://github.com/lichess-org/lila/issues/17127
    handleExternalEngine = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const analysis = lt.lichess.analysis;
      const engine = analysis?.ceval?.engines?.activeEngine;
      const isExternalEngine = engine?.tech == 'EXTERNAL';
      $('div.analyse__tools').toggleClassSafe('lichessTools-externalEngine',isExternalEngine);
      if (isExternalEngine) {
        if (analysis.ceval.storedPv()>5) {
          analysis.ceval.storedPv(5);
        }
        const input = $('div.setting #analyse-multipv');
        input.attr('max',5);
      }
      return isExternalEngine;
    };

    handleMoreLines = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const container = $('div.setting:has(#analyse-multipv)');
      if (!container.length) return;
      let maxValue = +lt.storage.get('LiChessTools.cevalLineOptions-moreLines') || 5;
      const isExternalEngine = this.handleExternalEngine();
      if (isExternalEngine) {
        maxValue = 5;
      }
      const input = $('div.setting #analyse-multipv')
        .attr('max',maxValue)
        .off('input',this.updateMoreLinesText)
        .on('input',this.updateMoreLinesText);
      const ceval = analysis?.ceval;
      const value = ceval?.storedPv();
      if (value) {
        input.val(Math.min(maxValue,+value));
      }
      this.updateMoreLinesText();
      if (!$('.lichessTools-cevalMoreLines',container).length) {
        $('<switch class="lichessTools-cevalMoreLines">')
          .text('\u29DF')
          .attr('title',trans.noarg('moreLinesTitle'))
          .on('click',()=>{
            const maxValue = input.attr('max')==5 ? 10 : 5;
            lt.storage.set('LiChessTools.cevalLineOptions-moreLines',maxValue);
            input.attr('max',maxValue);
            const ceval = analysis?.ceval;
            if (ceval) {
              ceval.storedPv(+input.val());
            }
            this.updateMoreLinesText();
          })
          .insertAfter($('.range_value',container));
      };
    };

    setupPvProcessing = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const main = $('main.analyse, main.puzzle');
      main
        .observer()
        .on('div.ceval, div.ceval.enabled ~ div.pv_box .pv',this.handlePvs,{
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class']
        });
      this.handlePvs();
    };

    db = new Map();
    drawChart = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const analysis = lt.lichess.analysis;
      if (!analysis) return;
      const $ = lt.$;
      const pearl = $('.ceval pearl');
      if (!pearl.length) return;

      const db = this.db.get(analysis.path);
      if (!db) {
        pearl
          .removeAttr('data-deviation')
          .removeAttr('data-depth')
          .removeAttr('title')
          .css('--data-color', null);
        return;
      }

      const depths = [...db.keys()];
      depths.sort((a,b)=>a-b);
      const canvas = pearl.find('canvas')[0]
                     || $('<canvas class="lichessTools-cevalLineOptions">')
                          .appendTo(pearl)[0];
      canvas.width = depths.at(-1)+1;
      canvas.height = 20;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#FFFFFF80';
      ctx.beginPath();
      ctx.moveTo(0, 10);
      for (const i of depths) {
        const cp = lt.getCentipawns(db.get(i));
        const v = lt.sigmoidClamp(-cp,0,20,2000);
        ctx.lineTo(i, v);
      }
      ctx.stroke();

      const data = [...db.entries()
                     .filter(([k,v])=>k>2)
                     .map(([k,v])=>({ depth: k, cp: lt.getCentipawns(v) }))];

      let sumBefore = 0;
      let sumAfter = data.reduce((a,v)=>a+v.cp,0);
      const s = { depth: 0, deviation: 0, total: data.length };
      if (data.length) {
        let n=0;
        for (const v of data) {
          sumBefore+=v.cp;
          sumAfter-=v.cp;
          n++;
          if (n<3 || n>data.length-3) continue;
          const a = sumAfter/(data.length-n);
          const b = sumBefore/n;
          const deviation = a-b;
          if (Math.abs(deviation) > Math.abs(s.deviation)) {
            s.deviation = deviation;
            s.depth = v.depth;
          }
        }
      }
      const displayDeviation = Math.abs(s.deviation)>50;
      const side = analysis.getOrientation() != 'black' ? 1 : -1;
      const color = lt.getGradientColor(side * s.deviation, [{ q: -300, color: '#FF2020FF' }, { q: -50, color: '#FF202080' }, { q: 0, color: '#808080FF' }, { q: 50, color: '#20FF2080' }, { q: 300, color: '#20FF20FF' }]);
      pearl
        .attr('data-deviation',displayDeviation?s.deviation.toFixed(2):null)
        .attr('data-depth', displayDeviation?s.depth:null)
        .attr('title', trans.noarg('pearlDeviationTitle').replace('$deviation',(s.deviation/100).toFixed(2)).replace('$depth',s.depth))
        .css('--data-color', displayDeviation?color:null);
    };

    getCevalPanelText = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const container = $('.analyse__tools .pv_box');
      if (!container.length) return;
      const fen = container.attr('data-fen');
      const arr=[];
      container.find('div.pv').each((i,e)=>{
        const text = $(e).find('*:not(.pv-wrap-toggle)').get()
          .map(e2=>$(e2).text())
          .join(' ');
        arr.push(text);
      });
      return 'FEN: '+fen+'\r\n'+arr.join('\r\n');
    };

    downloadCevalData = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const db = this.db.get(analysis.path);
      if (!db) return;
      const fen = db.values().next()?.value?.fen;
      if (!fen) return;
      let text = lt.global.JSON.stringify([...db.values()],undefined,2);
      const cevalPanelText = this.getCevalPanelText();
      if (cevalPanelText) {
        text = '\/*\r\n'+cevalPanelText+'\r\n*\/\r\n'+text;
      }
      lt.download(text,'analysis (' + fen + ').json','application/json');
    };

    setupDownloadButtonDirect = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const $ = lt.$;
      const trans = lt.translator;
      let button = $('button.lichessTools-downloadCeval');
      if (!this.options.downloadCeval) {
        button.remove();
        return;
      }
      if (!button.length) {
        button = $('<button type="button" class="lichessTools-downloadCeval">')
                   .text(lt.icon.Download)
                   .attr('title',trans.noarg('downloadCevalButtonTitle'))
                   .on('click',ev=>{
                     ev.preventDefault();
                     this.downloadCevalData();
                   })
                   .prependTo('.ceval div.engine');
      }
      const hasAnalysis = this.db.has(analysis.path);
      button.toggleClassSafe('hasAnalysis',hasAnalysis);
    };
    setupDownloadButton = lichessTools.debounce(this.setupDownloadButtonDirect,500);

    drawPvs = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const $ = lt.$;
      const prevPath = analysis.path.slice(0,-2);
      const prevNode = analysis.tree.nodeAtPath(prevPath);
      const currCeval = analysis.node.ceval;
      const ceval = prevNode.ceval;
      let container = $('.lichessTools-drawPvs').empty();
      if (!ceval || !currCeval) {
        container.remove();
        return;
      }
      const side = analysis.turnColor()=='white'?-1:1;
      const maxCp = lt.getCentipawns(ceval.pvs[0])*side;
      const minCp = maxCp-300;
      if (!container.length) {
        container = $('<div class="lichessTools-drawPvs">')
          .appendTo($('.analyse__tools div.ceval,.analyse__controls').eq(0));
      }
      const data = new Map();
      const pvs = [ceval].concat(ceval.pvs?.slice(1));
      for (const cp of pvs.map(pv=>lt.getCentipawns(pv)*side)) {
        const rcp = lt.global.Math.min(maxCp,lt.global.Math.max(minCp,cp));
        let item = data.get(rcp);
        if (!item) {
          item = {
            count: 1
          };
          data.set(rcp,item);
        } else {
          item.count++;
        }
      }
      const currCp = lt.getCentipawns(currCeval)*side;
      if (currCp) {
        const rcp = lt.global.Math.min(maxCp,lt.global.Math.max(minCp,currCp));
        let item = data.get(rcp);
        if (!item) {
          item = {
            count: 1
          };
          data.set(rcp,item);
        } else {
          item.count++;
        }
        item.cls=currCp>=maxCp-50 ? 'good' : currCp>=maxCp-150 ? 'warn' : 'bad';
        for (const [k,v] of data) {
          $('<div>')
            .addClass(v.cls)
            .attr('data-count',v.count)
            .css('--x',100*(k-minCp)/300+'%')
            .appendTo(container);
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('cevalLineOptions');
      this.logOption('Ceval line options', value || 'no');
      const $ = lt.$;
      this.options = {
        highlight: lt.isOptionSet(value, 'highlight'),
        highlightOnlyMe: lt.isOptionSet(value, 'highlightOnlyMe'),
        moreLines: lt.isOptionSet(value, 'moreLines'),
        colorEvaluation: lt.isOptionSet(value, 'colorEvaluation'),
        depthChart: lt.isOptionSet(value, 'depthChart'),
        downloadCeval: lt.isOptionSet(value, 'downloadCeval'),
        pvs: lt.isOptionSet(value, 'pvs'),
        cost: lt.isOptionSet(value, 'cost')
      }
      const main = $('main.analyse, main.puzzle');
      main
        .observer()
        .off('div.ceval.enabled ~ div.pv_box .pv',this.handlePvs);
      main
        .observer()
        .off('#ceval-settings-anchor,#ceval-settings',this.handleMoreLines);
      $('div.pv[data-cost]').removeAttr('data-cost');
      lt.pubsub.off('lichessTools.redraw',this.setupPvProcessing);
      if (this.options.highlight || this.options.colorEvaluation || this.options.cost) {
        lt.pubsub.on('lichessTools.redraw',this.setupPvProcessing);
        this.setupPvProcessing();
      }
      const analysis = lichess.analysis;
      if (analysis?.ceval) {
        analysis.ceval.selectEngine = lt.unwrapFunction(analysis.ceval.selectEngine,'cevalLineOptions-moreLines');
        if (this.options.moreLines) {
          main
            .observer()
            .on('#ceval-settings-anchor,#ceval-settings',this.handleMoreLines);
          analysis.ceval.selectEngine = lt.wrapFunction(analysis.ceval.selectEngine,{
            id: 'cevalLineOptions-moreLines',
            after: ($this, result,...args)=> {
              this.handleExternalEngine();
            }
          });
          this.handleExternalEngine();
        }
        this.handleMoreLines();
        lt.uiApi.events.off('analysis.change',this.drawChart);
        const ctrl = analysis.ceval.engines?.ctrl;
        if (ctrl) {
          ctrl.onEmit = lt.unwrapFunction(ctrl.onEmit,'cevalLineOptions');
          if (this.options.depthChart||this.options.downloadCeval) {
            ctrl.onEmit = lt.wrapFunction(ctrl.onEmit,{
              id: 'cevalLineOptions',
              after: ($this, result, data, meta)=>{
                if (!data?.depth || meta?.path != analysis.path) return;
                let db = this.db.get(meta.path);
                if (!db) {
                  db = new Map();
                  db.discoverDepth = new Map();
                  this.db.set(meta.path,db);
                }
                if (data?.pvs?.length) {
                  const side = analysis.turnColor()=='white'?-1:1;
                  const cp = lt.getCentipawns(data)*side;
                  if (cp) {
                    const best = lt.winPerc(cp);
                    for (const pv of data.pvs) {
                      const wp = lt.winPerc(lt.getCentipawns(pv)*side);
                      const uci = pv?.moves?.[0];
                      if (!uci) continue;
                      const obj = db.discoverDepth.get(uci);
                      const isCandidate = Math.abs(best-wp)<3;
                      if (!obj || (isCandidate && !obj.candidate)) {
                        db.discoverDepth.set(uci,{ depth: data.depth, candidate: isCandidate });
                      }
                    }
                  }
                }
                db.set(data.depth,data);
                if (this.options.depthChart) {
                  this.drawChart();
                }
              }
            });
            lt.uiApi.events.on('analysis.change',this.drawChart);
          }
        }

        lt.pubsub.off('lichessTools.redraw',this.setupDownloadButton);
        if (this.options.downloadCeval) {
          lt.pubsub.on('lichessTools.redraw',this.setupDownloadButton);
        }
        this.setupDownloadButton();

        lt.pubsub.off('lichessTools.redraw',this.drawPvs);
        if (this.options.pvs) {
          lt.pubsub.on('lichessTools.redraw',this.drawPvs);
          this.drawPvs();
        }

      }
    }

  }
  LiChessTools.Tools.CevalLineOptions = CevalLineOptionsTool;
})();
