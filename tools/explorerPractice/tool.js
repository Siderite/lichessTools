(()=>{
  class ExplorerPracticeTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'explorerPractice',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.explorerPractice': 'Practice against moves from Opening Explorer',
        'explorerPracticeTitle': 'LiChess Tools - practice against Explorer moves',
        'outOfMoves':'Out of Explorer moves'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.explorerPractice': 'Practic\u0103 contra mut\u0103ri din Explorator',
        'explorerPracticeTitle': 'LiChess Tools - practic\u0103 contra mut\u0103ri din Explorator',
        'outOfMoves':'Numai sunt mut\u0103ri \u00een Explorator'
      }
    }

    playMove=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (this.inPlayMove) return;
      if (analysis.turnColor()===analysis.getOrientation()) {
        return;
      }
      if (!analysis.explorer?.enabled()) return;
      if (analysis.explorer?.loading()) {
        parent.global.setTimeout(this.process,500);
        return;
      }
      const current=analysis.explorer?.current();
      if (!current) return;
      const total=current.white+current.draws+current.black;
      const index=Math.random()*total;
      let acc=0;
      for (const move of current.moves) {
        const moveTotal=move.white+move.draws+move.black;
        acc+=moveTotal;
        if (index<=acc) {
          this.inPlayMove=true;
          analysis.playUci(move.uci);
          return;
        }
      }
      if (this.isRunning) {
        parent.announce(trans.noarg('outOfMoves'));
        //this.isRunning=false;
        //this.process();
      }
    };

    process=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=lichess?.analysis;
      if (lichess.analysis.gamebookPlay()) {
        this.isRunning=false;
        return;
      };
      const explorerContainer=$('section.explorer-box').eq(0);
      if (!explorerContainer.length) {
        this.isRunning=false;
        return;
      }
      const container=$('div.explorer-title',explorerContainer);
      if (!container.length) {
        this.isRunning=false;
        return;
      };
      let button=$('span.lichessTools-explorerPractice',container);
      if (!button.length) {
        button=$('<span>')
          .addClass('lichessTools-explorerPractice')
          .attr('title',trans.noarg('explorerPracticeTitle'))
          .attr('data-icon','\uE021')
          .on('click',ev=>{
            ev.preventDefault();
            this.isRunning=!this.isRunning;
            this.process();
          })
          .prependTo(container);
      }
      if (!analysis.explorer?.enabled()) this.isRunning=false;
      button.toggleClass('active',!!this.isRunning);
      explorerContainer.toggleClass('lichessTools-explorerPracticeInAnalysis',this.isRunning && !analysis.study);
      if (analysis.turnColor()===analysis.getOrientation()) {
        this.inPlayMove=false;
      }
      if (this.isRunning) parent.global.setTimeout(this.playMove,500);
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('explorerPractice');
      this.logOption('Explorer practice', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      if (lichess.analysis.gamebookPlay()) return;
      lichess.pubsub.off('redraw',this.process);
      $('main.analyse div.analyse__controls').off('click touchend',this.process);
      parent.unbindKeyHandler('shift+l');
      if (!value) {
        $('section.explorer-box span.lichessTools-explorerPractice').remove();
        return;
      }
      parent.bindKeyHandler('shift+l',()=>{
        this.isRunning=!this.isRunning;
        this.process();
      });
      lichess.pubsub.on('redraw',this.process);
      $('main.analyse div.analyse__controls').on('click touchend',this.process);
      this.process();
    }

  }
  LiChessTools.Tools.ExplorerPractice=ExplorerPracticeTool;
})();
