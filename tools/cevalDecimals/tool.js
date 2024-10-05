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
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const trans = parent.translator;
      const ceval = analysis.node.ceval;
      if (ceval) {
        const pearl = $('div.ceval.enabled pearl');
        if (pearl.length) {
          // lichess keeps a reference to the actual node
          const textNode = Array.from(pearl[0].childNodes).find(n => n.nodeType == 3);
          const text = this.renderEval(ceval.cp, ceval.mate);
          if (textNode && text) textNode.textContent = text;
        }
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
          const elem = parent.getElementForPath(path);
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
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('cevalDecimals');
      this.logOption('Ceval decimals', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const trans = parent.translator;
      lichess.pubsub.off('lichessTools.redraw', this.showDecimals);
      if (!value) return;
      lichess.pubsub.on('lichessTools.redraw', this.showDecimals);
      this.showDecimals();
    }

  }
  LiChessTools.Tools.CevalDecimals = CevalDecimalsTool;
})();
