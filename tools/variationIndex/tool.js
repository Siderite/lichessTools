(() => {
  class VariationIndexTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange'];

    preferences = [
      {
        name: 'variationIndex',
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
        'options.variationIndex': 'Show current variation',
        'variationIndexText': 'Variation %1$s of %2$s',
        'variationIndexTitle': 'Click to cycle between variations'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.variationIndex': 'Arat\u0103 varia\u0163ia curent\u0103',
        'variationIndexText': 'Varia\u0163ia %1$s din %2$s',
        'variationIndexTitle': 'Clic pentru a parcurge varia\u0163iile'
      }
    };

    getVariationData = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      const root = analysis?.tree?.root;
      if (this._variationData && this._variationData.root === root) return this._variationData;
      const data = {
        root: root,
        total: 0,
        variations: [],
        indexByPath: new Map()
      };
      if (root) {
        const firstChild = root.children?.find(c => !c.comp);
        const traverse = (node, nodePath, start) => {
          const children = (node.children || []).filter(c => !c.comp);
          let firstLeaf;
          if (!children.length) {
            firstLeaf = ++data.total;
            data.variations.push(start || firstChild?.id || '');
          } else {
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              const childFirst = traverse(child, nodePath + child.id, start || (i > 0 ? nodePath + child.id : ''));
              if (firstLeaf === undefined) firstLeaf = childFirst;
            }
          }
          data.indexByPath.set(nodePath, firstLeaf);
          return firstLeaf;
        };
        traverse(root, '', '');
      }
      this._variationData = data;
      return data;
    };

    getVariationInfo = (path) => {
      if (!path) return null;
      const data = this.getVariationData();
      if (data.total < 2) return null;
      const index = data.indexByPath.get(path);
      if (!index) return null;
      return { index, total: data.total, variations: data.variations };
    };

    handleMoveListChange = () => {
      this._variationData = null;
      this.showVariationIndex();
    };

    cycleVariation = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      if (!analysis) return;
      const info = this.getVariationInfo(analysis.path);
      if (!info) return;
      const nextPath = info.variations[info.index % info.total];
      if (!nextPath) return;
      analysis.userJumpIfCan(nextPath);
      lt.analysisRedraw();
    };

    showVariationIndex = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lt.lichess?.analysis;
      if (!analysis) return;
      const tools = $('div.analyse__tools');
      let label = $('div.lichessTools-variationIndex', tools);
      const info = this.getVariationInfo(analysis.path);
      if (!info) {
        label.remove();
        return;
      }
      if (!label.length) {
        label = $('<div class="lichessTools-variationIndex">')
          .on('click', this.cycleVariation)
          .appendTo(tools);
      }
      const text = trans.noarg('variationIndexText')
        .replace('%1$s', info.index)
        .replace('%2$s', info.total);
      label.text(text).attr('title', trans.noarg('variationIndexTitle'));
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('variationIndex');
      this.logOption('Variation index', value);
      const lichess = lt.lichess;
      if (!lichess) return;
      const $ = lt.$;
      lt.pubsub.off('lichessTools.redraw', this.showVariationIndex);
      lt.pubsub.off('lichessTools.chapterChange', this.showVariationIndex);
      $('body').observer()
        .off('div.analyse__moves,div.analyse__moves *', this.handleMoveListChange);
      if (value) {
        lt.pubsub.on('lichessTools.redraw', this.showVariationIndex);
        lt.pubsub.on('lichessTools.chapterChange', this.showVariationIndex);
        $('body').observer()
          .on('div.analyse__moves,div.analyse__moves *', this.handleMoveListChange, {
            characterData: false
          });
        this.showVariationIndex();
      } else {
        $('div.lichessTools-variationIndex').remove();
      }
    }
  }
  LiChessTools.Tools.VariationIndex = VariationIndexTool;
})();
