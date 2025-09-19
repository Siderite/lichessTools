(() => {
  class RandomVariationTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['TranspositionBehavior'];

    preferences = [
      {
        name: 'randomVariationDepth',
        category: 'analysis2',
        type: 'single',
        possibleValues: [0, 2, 4, 6, 8, 10],
        defaultValue: 8,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.randomVariationDepth': 'Next move probability depth',
        'randomVariationDepth.0': 'equal',
        'randomVariationDepth.2': 'one move',
        'randomVariationDepth.4': 'two moves',
        'randomVariationDepth.6': 'three moves',
        'randomVariationDepth.8': 'four moves',
        'randomVariationDepth.10': 'five moves'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.randomVariationDepth': 'Ad\u00E2ncimea probabilit\u0103\u0163ii mut\u0103rii urm\u0103toare',
        'randomVariationDepth.0': 'egal',
        'randomVariationDepth.2': 'o mutare',
        'randomVariationDepth.4': 'dou\u0103 mut\u0103ri',
        'randomVariationDepth.6': 'trei mut\u0103ri',
        'randomVariationDepth.8': 'patru mut\u0103ri',
        'randomVariationDepth.10': 'cinci mut\u0103ri'
      }
    }

    populatePercent = (nodes, isInteractive, depth) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const getGamebookDescendants = (node, depth, currentDepth, isInteractive) => {
        if (!depth) depth = 0;
        if (!currentDepth) currentDepth = 1;
        const arr = [];
        if (currentDepth <= depth && node?.children) {
          for (const child of analysis.visibleChildren(node)) {
            if (isInteractive && !child.gamebook) continue;
            arr.push(child);
            arr.push.apply(arr, getGamebookDescendants(child, depth, currentDepth + 1, isInteractive));
          }
        }
        return arr;
      };

      const console = lt.global.console;
      let total = 0;
      const defaultPrc = [];
      for (const node of nodes) {
        if (isInteractive && !node.gamebook) {
          node.prc = 0;
          continue;
        }
        let prcSet = false;
        if (node.comments) {
          for (const comment of node.comments) {
            const match = /prc:\s*(\d+(\.\d+)?)/i.exec(comment.text);
            if (match) {
              node.prc = +match[1]
              total += node.prc;
              prcSet = true;
            }
          }
        }
        if (!prcSet) {
          defaultPrc.push(node);
        }
      }
      if (total > 100) {
        console.warn('Variations are marked with values of prc which total more than 100');
      }
      if (defaultPrc.length) {
        const list = [];
        let weightTotal = 0;
        for (const node of defaultPrc) {
          const descendants = getGamebookDescendants(node, depth, 1, isInteractive);
          const weight = 1 + descendants.filter(n => analysis.visibleChildren(n)?.length > 1).length;
          list.push({ node: node, weight: weight });
          weightTotal += weight;
        }
        const q = Math.max(0, 100 - total) / weightTotal;
        for (const item of list) {
          const prc = q * item.weight;
          item.node.prc = prc;
          total += prc;
        }
      }
      return total;
    };


    getNextMoves = (node, noTranspositions, noMoves) => {
      const lt = this.lichessTools;
      const arr = noMoves ? [] : [...lt.analysis.visibleChildren(node)];
      arr.transpositionStartIndex = arr.length;
      if (noTranspositions || !lt.transpositionBehavior?.consideredVariations || !node.transposition) return arr;
      let transpositions = node.transposition.filter(n => n !== node);
      if (lt.transpositionBehavior?.excludeSameLine && node.path !== undefined) {
        transpositions = transpositions?.filter(n => n.path && !n.path.startsWith(node.path) && !node.path.startsWith(n.path));
      }
      for (const child of transpositions) {
        const grandchildren = lt.analysis.visibleChildren(child);
        if (!grandchildren?.length) continue;
        for (const grandchild of grandchildren) {
          arr.push(grandchild);
        }
      }
      return arr;
    };

    getRandomVariation = (node, noTranspositions, depth) => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      depth = +depth || this.depth;
      const lichess = lt.lichess;
      const arr = this.getNextMoves(node, noTranspositions);
      if (!arr.length) return;
      const isInteractive = !!lichess.analysis.gamebookPlay();
      const total = lt.populatePercent(arr, isInteractive, depth);
      const index = lt.random() * total;
      let acc = 0;
      for (const child of arr) {
        acc += child.prc;
        if (index <= acc) {
          return child;
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('randomVariationDepth');
      this.logOption('Random variation depth', value);
      this.depth = +(value);
      if (Number.isNaN(this.depth)) this.depth = this.preferences.filter(p => p.name == 'randomVariationDepth')[0].defaultValue;
      lt.populatePercent = this.populatePercent;
      lt.getNextMoves = this.getNextMoves;
      lt.getRandomVariation = this.getRandomVariation;
    }

  }
  LiChessTools.Tools.RandomVariation = RandomVariationTool;
})();
