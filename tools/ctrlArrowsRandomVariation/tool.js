(() => {
  class CtrlArrowsRandomVariationTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['RandomVariation'];

    preferences = [
      {
        name: 'ctrlArrows',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.ctrlArrows': 'Ctrl-right to play random next move from list'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.ctrlArrows': 'Ctrl-dreapta pentru a alege la \u00eent\u00E2mplare o urm\u0103toare mutare'
      }
    }

    prevPositions = [];
    playRandomVariation = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess.analysis) return;
      const node = lichess.analysis.node;
      const path = lichess.analysis.path;
      const child = lt.getRandomVariation(node);
      if (child) {
        this.prevPositions.push({
          path: path,
          position: lt.getNodePosition(node)
        });
        lichess.analysis.userJump(child.path || (path + child.id));
        lichess.analysis.redraw();
      }
    };

    backOneMove = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess.analysis) return;
      const path = lichess.analysis.path;
      if (!path) return;
      const prevPath = path.slice(0, -2);
      const pos = this.prevPositions.at(-1);
      if (pos && pos.path != prevPath) {
        const prevNode = lichess.analysis.tree.nodeAtPath(prevPath);
        if (lt.getNodePosition(prevNode) == pos.position) {
          this.prevPositions.splice(-1, 1);
          lichess.analysis.userJump(pos.path);
          lichess.analysis.redraw();
          return;
        }
        this.prevPositions = [];
      }
      lichess.analysis.userJumpIfCan(prevPath);
      lichess.analysis.redraw();
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('ctrlArrows');
      this.logOption('Ctrl-arrows for random variation', value);
      const handler = lt.getKeyHandler('ctrl+right');
      lt.unbindKeyHandler('ctrl+right', true);
      lt.unbindKeyHandler('ctrl+left', true);
      if (value) {
        lt.bindKeyHandler('ctrl+right', this.playRandomVariation);
        lt.bindKeyHandler('ctrl+left', this.backOneMove);
      }
    }
  }
  LiChessTools.Tools.CtrlArrowsRandomVariation = CtrlArrowsRandomVariationTool;
})();
