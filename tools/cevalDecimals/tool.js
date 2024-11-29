(() => {
  class CevalDecimalsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'cevalDecimals',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.cevalDecimals': 'More decimals for computer evaluation'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.cevalDecimals': 'Mai multe zecimale \u00een evaluare computer'
      }
    }

    decimals = 2;
    renderEval = (cp, mate) => {
      if (mate) return '#' + mate;
      if (!cp) return;
      const e = Math.max(Math.min(cp / 100, 99), -99);
      return (e > 0 ? '+' : '') + e.toFixed(this.decimals);
    };

    showDecimals = () => {
      try {
      if (this._inShowDecimals) return;
      this._inShowDecimals=true;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const trans = lt.translator;
      const ceval = analysis.node.ceval;
      if (ceval) {
        const pearl = $('div.ceval pearl');
        // lichess keeps a reference to the actual node
        const text = this.renderEval(ceval.cp, ceval.mate);
        pearl.replaceText(text);
        $('div.ceval.enabled ~ div.pv_box')
          .find('div.pv[data-uci]')
          .each((i, e) => {
            const uci = $(e).attr('data-uci');
            const pv = ceval.pvs.find(p => p.moves?.at(0) === uci);
            if (pv) {
              $('strong', e).text(this.renderEval(pv.cp, pv.mate));
            }
          });
      }
      const traverse = (node, path) => {
        let evl = node.eval;
        const ceval = node.ceval;
        if (!evl || ceval?.depth >= 16) evl = ceval;
        if (evl) {
          const elem = lt.getElementForPath(path);
          if (elem) {
            let evalElem = $('eval', elem);
            if (!evalElem?.length) {
              evalElem = $('<eval class="lichessTools-cevalDecimals">').appendTo(elem);
            }
            const text = this.renderEval(evl.cp, evl.mate);
            if (evalElem.text() != text) {
              evalElem.text(text);
            }
          }
        }
        for (const child of node.children || []) {
          traverse(child, path + child.id);
        }
      };
      traverse(analysis.tree.root, '');
      } finally {
        this._inShowDecimals=false;
      }
    };

    setupObserver = ()=>{
      if (!this.options.enabled) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const analyseTools = $('.analyse__tools');
      if (!analyseTools.length) return;
      if (!analyseTools.hasObserver()) {
        const observer = analyseTools.observer();
        observer.on('div.ceval pearl, div.ceval.enabled ~ div.pv_box .pv',this.showDecimals);
      }
      this.showDecimals();
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('cevalDecimals');
      this.logOption('Ceval decimals', value);
      this.options = { enabled: !!value };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      lt.pubsub.off('lichessTools.redraw', this.setupObserver);
      $('.analyse__tools').removeObserver();
      if (!value) return;
      lt.pubsub.on('lichessTools.redraw', this.setupObserver);
      this.setupObserver();
    }

  }
  LiChessTools.Tools.CevalDecimals = CevalDecimalsTool;
})();
