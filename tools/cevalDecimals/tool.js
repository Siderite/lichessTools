(() => {
  class CevalDecimalsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'cevalDecimals',
        category: 'analysis2',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.cevalDecimals': 'More decimals for computer evaluation'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.cevalDecimals': 'Mai multe zecimale \u00een evaluare computer'
      }
    }

    decimals = 2;
    renderEval = (cp, mate) => {
      if (mate) return '#' + mate;
      if (cp !== 0 && !cp) return;
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
        if (!analysis?.showComputer()) return;
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
                $('strong', e).replaceText(this.renderEval(pv.cp, pv.mate));
              }
            });
        }
      } finally {
        this._inShowDecimals=false;
      }
    };

    showDecimalsMovesDirect = () => {
      try {
        if (this._inShowDecimalsMoves) return;
        this._inShowDecimalsMoves=true;
        const lt = this.lichessTools;
        const lichess = lt.lichess;
        const $ = lt.$;
        const analysis = lichess?.analysis;
        if (!analysis?.showComputer()) return;
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
              evalElem.replaceText(text);
            }
          }
          for (const child of node.children || []) {
            traverse(child, path + child.id);
          }
        };
        traverse(analysis.tree.root, '');
      } finally {
        this._inShowDecimalsMoves=false;
      }
    };
    showDecimalsMoves = lichessTools.debounce(this.showDecimalsMovesDirect,100);

    setupObserver = ()=>{
      if (!this.options.enabled) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const analyseTools = $('.analyse__tools, .puzzle__tools');
      if (!analyseTools.length) return;
      analyseTools
        .observer()
        .on('div.ceval pearl, div.ceval.enabled ~ div.pv_box .pv',this.showDecimals);
      analyseTools
        .observer()
        .on('move, eval',this.showDecimalsMoves);
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
      const analyseTools = $('.analyse__tools, .puzzle__tools');
      analyseTools
        .observer()
        .off('div.ceval pearl, div.ceval.enabled ~ div.pv_box .pv',this.showDecimals);
      analyseTools
        .observer()
        .off('move, eval',this.showDecimalsMoves);
      analysis.toggleComputer = lt.unwrapFunction(analysis.toggleComputer,'cevalDecimals');
      $('.lichessTools-cevalDecimals').remove();
      if (!value) return;
      analysis.toggleComputer = lt.wrapFunction(analysis.toggleComputer, {
        id: 'cevalDecimals',
        after: ($this,result,...args)=>{
          $('.lichessTools-cevalDecimals').remove();
          this.showDecimals();
          this.showDecimalsMoves();
        }
      });
      lt.pubsub.on('lichessTools.redraw', this.setupObserver);
      this.setupObserver();
      this.showDecimals();
      this.showDecimalsMoves();
    }

  }
  LiChessTools.Tools.CevalDecimals = CevalDecimalsTool;
})();
