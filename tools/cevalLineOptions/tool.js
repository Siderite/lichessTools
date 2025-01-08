(() => {
  class CevalLineOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'cevalLineOptions',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['highlight'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.cevalLineOptions': 'Computer evaluation line options',
        'cevalLineOptions.highlight': 'Highlight same moves'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.cevalLineOptions': 'Op\u0163iuni linii \u00een evaluarea computerului',
        'cevalLineOptions.highlight': 'Eviden\u0163iaza acelea\u015Fi mut\u0103ri'
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

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('cevalLineOptions');
      this.logOption('Ceval line options', value || 'no');
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      this.options = {
        highlight: lt.isOptionSet(value, 'highlight')
      }
      const analysisTools = $('main .analyse__tools');
      if (analysisTools.length) {
        analysisTools.removeObserver('cevalLineOptions');
        if (this.options.highlight) {
          analysisTools.observer('cevalLineOptions')
            .on('div.ceval.enabled ~ div.pv_box .pv',this.handlePvs,{
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['class']
            });
        }
        this.handlePvs();
      }
    }

  }
  LiChessTools.Tools.CevalLineOptions = CevalLineOptionsTool;
})();
