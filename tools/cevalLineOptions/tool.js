(() => {
  class CevalLineOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'cevalLineOptions',
        category: 'analysis2',
        type: 'multiple',
        possibleValues: ['highlight', 'highlightOnlyMe', 'moreLines', 'colorEvaluation', 'depthChart'],
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
        'moreLinesTitle': 'LiChess Tools - more lines'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.cevalLineOptions': 'Op\u0163iuni linii \u00een evaluarea computerului',
        'cevalLineOptions.highlight': 'Eviden\u0163iaza acelea\u015Fi mut\u0103ri',
        'cevalLineOptions.highlightOnlyMe': '...doar orientarea curent\u0103',
        'cevalLineOptions.moreLines': 'Mai multe linii',
        'cevalLineOptions.colorEvaluation': 'Coloreaz\u0103 evaluarea',
        'cevalLineOptions.depthChart': 'Grafic ad\u00e2ncime',
        'moreLinesTitle': 'LiChess Tools - mai multe linii'
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
    handlePvs = () => {
      if (this._inHandlePvs) return;
      try {
        this._inHandlePvs=true;
        const lt = this.lichessTools;
        const $ = lt.$;
        const lichess = lt.lichess;
        const analysisTools = $('main .analyse__tools, main .puzzle__tools');
        if (!analysisTools.length) return;
        this.dict = new Map([...this.dict.entries()].filter(e => e[1].cls));
        [...this.dict.values()].forEach(v => v.count = 0);
        const fen = lt.getPositionFromBoard($('.main-board')[0],true);
        if (!fen) return;
        const side = $('.main-board .cg-wrap').is('.orientation-black') ? 1 : 0;
        const turn = fen.endsWith(' b') ? 1 : 0;
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
        let first = null;
        $('div.pv_box div.pv > strong')
          .each((i, e) => {
            if (e.className) e.className='';
            if (!this.options.colorEvaluation) return;
            const text = $(e).text();
            const info = text.startsWith('#')
              ? { mate: +text.slice(1) }
              : { cp: (+text) * 100 };
            const val = lt.winPerc(lt.getCentipawns(info));
            if (first === null) {
              first = val;
              $(e).addClass('best');
              return;
            }
            const diff = Math.abs(val - first);
            if (diff<1) $(e).addClass('good');
            else if (diff>20) $(e).addClass('blunder');
            else if (diff>10) $(e).addClass('mistake');
          });
      } finally {
        this._inHandlePvs=false;
      }
    };

    updateMoreLinesText = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const input = $('div.setting #analyse-multipv');
      if (!input.length) return;
      $('div.setting:has(#analyse-multipv) .range_value')
        .text(input.val()+' / '+input.attr('max'));
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
      const maxValue = +lt.storage.get('LiChessTools.cevalLineOptions-moreLines') || 5;
      const input = $('div.setting #analyse-multipv')
        .attr('max',maxValue)
        .off('input',this.updateMoreLinesText)
        .on('input',this.updateMoreLinesText);
      const ceval = analysis?.ceval;
      const value = ceval?.storedPv();
      if (value) {
        input.val(value);
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

    setupHighlightSameMoves = ()=>{
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
      const analysis = lt.lichess.analysis;
      if (!analysis) return;
      const $ = lt.$;
      const db = this.db.get(analysis.path);
      if (!db) return;
      const pearl = $('.ceval pearl');
      if (!pearl.length) return;

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
      for (let i of depths) {
        const cp = lt.getCentipawns(db.get(i));
        const v = lt.sigmoidClamp(-cp,0,20,2000);
        ctx.lineTo(i, v);
      }
      ctx.stroke();
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
        depthChart: lt.isOptionSet(value, 'depthChart')
      }
      const main = $('main.analyse, main.puzzle');
      main
        .observer()
        .off('div.ceval.enabled ~ div.pv_box .pv',this.handlePvs);
      main
        .observer()
        .off('#ceval-settings-anchor',this.handleMoreLines);
      lt.pubsub.off('lichessTools.redraw',this.setupHighlightSameMoves);
      if (this.options.highlight || this.options.colorEvaluation) {
        lt.pubsub.on('lichessTools.redraw',this.setupHighlightSameMoves);
        this.setupHighlightSameMoves();
      }
      if (this.options.moreLines) {
        main
          .observer()
          .on('#ceval-settings-anchor',this.handleMoreLines);
      }
      this.handleMoreLines();
      lt.uiApi.events.off('analysis.change',this.drawChart);
      const analysis = lichess.analysis;
      const ctrl = analysis?.ceval?.engines?.ctrl;
      if (ctrl) {
        ctrl.onEmit = lt.unwrapFunction(ctrl.onEmit,'cevalLineOptions');
        if (this.options.depthChart) {
          ctrl.onEmit = lt.wrapFunction(ctrl.onEmit,{
            id: 'cevalLineOptions',
            after: ($this, result, data, meta)=>{
              if (!data?.depth || meta?.path != analysis.path) return;
              let db = this.db.get(meta.path);
              if (!db) {
                db = new Map();
                this.db.set(meta.path,db);
              }
              db.set(data.depth,data);
              this.drawChart();
            }
          });
          lt.uiApi.events.on('analysis.change',this.drawChart);
        }
      }
    }

  }
  LiChessTools.Tools.CevalLineOptions = CevalLineOptionsTool;
})();
