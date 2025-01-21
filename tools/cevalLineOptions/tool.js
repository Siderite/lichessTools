(() => {
  class CevalLineOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'cevalLineOptions',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['highlight','moreLines'],
        defaultValue: 'moreLines',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.cevalLineOptions': 'Computer evaluation line options',
        'cevalLineOptions.highlight': 'Highlight same moves',
        'cevalLineOptions.moreLines': 'More lines',
        'moreLinesTitle': 'LiChess Tools - more lines'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.cevalLineOptions': 'Op\u0163iuni linii \u00een evaluarea computerului',
        'cevalLineOptions.highlight': 'Eviden\u0163iaza acelea\u015Fi mut\u0103ri',
        'cevalLineOptions.moreLines': 'Mai multe linii',
        'moreLinesTitle': 'LiChess Tools - mai multe linii'
      }
    }

    getKey = (elem) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const e = $(elem);
      const san = e.text().replace(/[\+#\?!]/, '');
      const turn = +(e.attr('data-move-index')) % 2;
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
      this.dict = new Map([...this.dict.entries()].filter(e => e[1].cls));
      [...this.dict.values()].forEach(v => v.count = 0);
      $('div.pv_box span.pv-san').each((i, e) => {
        if (!lt.inViewport(e)) return;
        const key = this.getKey(e);
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
          const key = this.getKey(e);
          const val = this.dict.get(key);
          const cls = val?.count > 1 && this.options.highlight
            ? ('pv-san ' + val.cls).trim()
            : 'pv-san';
          if (e.className != cls) e.className = cls;
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
      const container = $('div.setting:has(#analyse-multipv)');
      if (!container.length) return;
      const maxValue = +lt.storage.get('LiChessTools.cevalLineOptions-moreLines') || 5;
      const input = $('div.setting #analyse-multipv')
        .attr('max',maxValue)
        .off('input',this.updateMoreLinesText)
        .on('input',this.updateMoreLinesText);
      const value = +lichessTools.storage.get('ceval.multipv');
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
            lichessTools.storage.set('ceval.multipv',input.val());
            this.updateMoreLinesText();
          })
          .insertAfter($('.range_value',container));
      };
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('cevalLineOptions');
      this.logOption('Ceval line options', value || 'no');
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      this.options = {
        highlight: lt.isOptionSet(value, 'highlight'),
        moreLines: lt.isOptionSet(value, 'moreLines')
      }
      const analysisTools = $('main .analyse__tools, main .puzzle__tools');
      if (!analysisTools.length) return;
      analysisTools
        .observer()
        .off('div.ceval.enabled ~ div.pv_box .pv',this.handlePvs);
      analysisTools
        .observer()
        .off('#ceval-settings-anchor',this.handleMoreLines);
      if (this.options.highlight) {
        analysisTools
          .observer()
          .on('div.ceval.enabled ~ div.pv_box .pv',this.handlePvs,{
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
          });
      }
      if (this.options.moreLines) {
        analysisTools
          .observer()
          .on('#ceval-settings-anchor',this.handleMoreLines);
      }
      this.handleMoreLines();
    }

  }
  LiChessTools.Tools.CevalLineOptions = CevalLineOptionsTool;
})();
