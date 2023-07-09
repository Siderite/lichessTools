(()=>{
  class CtrlArrowsRandomVariationTool extends LiChessTools.Tools.ToolBase {

    dependencies=['RandomVariation'];

    preferences=[
      {
        name:'ctrlArrows',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.ctrlArrows': 'Ctrl-right to play random next move from list'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.ctrlArrows': 'Ctrl-Dreapta pentru a alege o urm\u0103toare mutare la \u00eent\u00E2mplare'
      }
    }

    playRandomVariation=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const node = lichess.analysis.node;
      const child = parent.getRandomVariation(node);
      if (!lichess.analysis) return;
      if (child) {
        lichess.analysis.userJump(child.path||(node.path+child.id));
        lichess.analysis.redraw();
      }
    };

    backOneMove=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!lichess.analysis) return;
      const path = lichess.analysis.path;
      if (!path) return;
      lichess.analysis.userJumpIfCan(path.slice(0,-2));
      lichess.analysis.redraw();
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('ctrlArrows');
      this.logOption('Ctrl-arrows for random variation', value);
      const handler = parent.getKeyHandler('ctrl+right');
      parent.unbindKeyHandler('ctrl+right',true);
      parent.unbindKeyHandler('ctrl+left',true);
      if (value) {
        parent.bindKeyHandler('ctrl+right',this.playRandomVariation);
        parent.bindKeyHandler('ctrl+left',this.backOneMove);
      }
    }
  }
  LiChessTools.Tools.CtrlArrowsRandomVariation=CtrlArrowsRandomVariationTool;
})();
