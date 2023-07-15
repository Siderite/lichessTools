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

    clearMoveMode=()=>{
      const g=this.lichessTools.global;
      g.clearTimeout(this.makeMoveTimeout);
      this.makeMoveMode=null;
      $('body').removeClass('lichessTools-keyMode-pgn');
      $('body').removeClass('lichessTools-keyMode-ceval');
      $('body').removeClass('lichessTools-keyMode-explorer');
    };

    prepareMove=(mode)=>{
      const g=this.lichessTools.global;
      this.clearMoveMode();
      switch(mode) {
        case 'pgn': {
          const moves=$('div.analyse__tools div.analyse__fork move');
          if (!moves.length) return;
        }
        break;
        case 'ceval': {
          const analysis=this.lichessTools.lichess.analysis;
          if (!analysis?.ceval || !analysis?.ceval.enabled()) return;	
        }
        break;
        case 'explorer': {
          const moves=$('.explorer-box:not(.loading) .moves tbody tr');
          if (!moves.length) return;
        }
        break;
        default:
          g.console.warn('Unknown key move mode',mode);
          return;
      }
      this.makeMoveMode=mode;
      $('body').addClass('lichessTools-keyMode-'+mode);
      this.makeMoveTimeout=g.setTimeout(this.clearMoveMode,1500);
    };

    handleDigitKey=(combo)=>{
      const g=this.lichessTools.global;
      let index=+combo;
      if (!index) return;
      index--;
      if (!this.makeMoveMode && this.oldHandlers[combo]) {
        this.oldHandlers[combo]();
        return;
      }
      switch(this.makeMoveMode) {
        case 'pgn': {
          const moves=$('div.analyse__tools div.analyse__fork move');
          const move=moves[index];
          move?.click();
        }
        break;
        case 'ceval': {
          const analysis=this.lichessTools.lichess.analysis;
          if (!analysis?.ceval || !analysis?.ceval.enabled()) return;	
          const pvs=analysis?.node?.ceval?.pvs;
          if (!pvs||!pvs[index]) return;
          const uci=pvs[index].moves[0];
          if (uci) analysis.playUci(uci);
        }
        break;
        case 'explorer': {
          const analysis=this.lichessTools.lichess.analysis;
          if (!analysis) return;
          const moves=$('.explorer-box:not(.loading) .moves tbody tr');
          const uci=moves.eq(index).attr('data-uci');
          if (uci) analysis.playUci(uci);
        }
        break;
        default:
          if (this.makeMoveMode) {
            g.console.warn('Unknown key move mode',this.makeMoveMode);
          }
          return;
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('keyShortcuts');
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

      parent.unbindKeyHandler('.',true);
      parent.unbindKeyHandler('ctrl+.',true);
      parent.unbindKeyHandler('shift+.',true);

      for (let i = 1; i <=9 ; i++) {
        const combo=i.toString();
        if (!this.oldHandlers[combo]) this.oldHandlers[combo]=parent.getKeyHandler(combo);
        parent.unbindKeyHandler(combo);
      }

      if (value) {
        parent.bindKeyHandler('i',()=>parent.jumpToGlyphSymbol(currentPlayer,'?!'));
        parent.bindKeyHandler('m',()=>parent.jumpToGlyphSymbol(currentPlayer,'?'));
        parent.bindKeyHandler('b',()=>parent.jumpToGlyphSymbol(currentPlayer,'??'));
        parent.bindKeyHandler('alt+i',()=>parent.jumpToGlyphSymbol(otherPlayer,'?!'));
        parent.bindKeyHandler('alt+m',()=>parent.jumpToGlyphSymbol(otherPlayer,'?'));
        parent.bindKeyHandler('alt+b',()=>parent.jumpToGlyphSymbol(otherPlayer,'??'));

        parent.bindKeyHandler('.',()=>this.prepareMove('pgn'));
        parent.bindKeyHandler('ctrl+.',()=>this.prepareMove('ceval'));
        parent.bindKeyHandler('shift+.',()=>this.prepareMove('explorer'));
        for (let i = 1; i <=9 ; i++) {
          const combo=i.toString();
          parent.bindKeyHandler(combo,()=>this.handleDigitKey(combo));
        }
      } else {
        if (this.oldHandlers) {
          parent.bindKeyHandler('i',this.oldHandlers['i'],true);
          parent.bindKeyHandler('m',this.oldHandlers['m'],true);
          parent.bindKeyHandler('b',this.oldHandlers['b'],true);
          for (let i = 1; i <=9 ; i++) {
            const combo=i.toString();
            if (this.oldHandlers[combo]) parent.bindKeyHandler(combo,this.oldHandlers[combo],true);
          }
        }
      }
    }

  }
  LiChessTools.Tools.AnalysisKeyShortcuts=AnalysisKeyShortcutsTool;
})();
