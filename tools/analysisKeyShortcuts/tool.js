(()=>{
  class AnalysisKeyShortcutsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'keyShortcuts',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.keyShortcuts': 'Extra key shortcuts'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.keyShortcuts': 'Combina\u0163ii de taste \u00een plus'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.keyShortcuts;
      this.logOption('Extra analysis key shortcuts', value);
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      const currentPlayer=analysis.getOrientation();
      const otherPlayer=currentPlayer=='white'?'black':'white';
      if (!this.oldHandlers) {
        this.oldHandlers={
          i:parent.getKeyHandler('i'),
          m:parent.getKeyHandler('m'),
          b:parent.getKeyHandler('b')
        };
      }
      parent.unbindKeyHandler('i');
      parent.unbindKeyHandler('m');
      parent.unbindKeyHandler('b');
      parent.unbindKeyHandler('alt+i',true);
      parent.unbindKeyHandler('alt+m',true);
      parent.unbindKeyHandler('alt+b',true);

      if (value) {
        parent.bindKeyHandler('i',()=>parent.jumpToGlyphSymbol(currentPlayer,'?!'));
        parent.bindKeyHandler('m',()=>parent.jumpToGlyphSymbol(currentPlayer,'?'));
        parent.bindKeyHandler('b',()=>parent.jumpToGlyphSymbol(currentPlayer,'??'));
        parent.bindKeyHandler('alt+i',()=>parent.jumpToGlyphSymbol(otherPlayer,'?!'));
        parent.bindKeyHandler('alt+m',()=>parent.jumpToGlyphSymbol(otherPlayer,'?'));
        parent.bindKeyHandler('alt+b',()=>parent.jumpToGlyphSymbol(otherPlayer,'??'));
      } else {
        if (this.oldHandlers) {
          parent.bindKeyHandler('i',this.oldHandlers['i'],true);
          parent.bindKeyHandler('m',this.oldHandlers['m'],true);
          parent.bindKeyHandler('b',this.oldHandlers['b'],true);
        }
      }
    }

  }
  LiChessTools.Tools.AnalysisKeyShortcuts=AnalysisKeyShortcutsTool;
})();
