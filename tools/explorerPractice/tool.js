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
      },
      {
        name:'explorerPracticeOptions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['showSmileys'],
        defaultValue: 'showSmileys',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.explorerPractice': 'Practice against moves from Opening Explorer',
        'options.explorerPracticeOptions': 'Explorer Practice options',
        'explorerPracticeTitle': 'LiChess Tools - practice against Explorer moves',
        'outOfMoves':'Out of Explorer moves',
        'explorerPracticeOptions.showSmileys': 'Show emojis when out of moves'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.explorerPractice': 'Practic\u0103 contra mut\u0103ri din Explorator',
        'options.explorerPracticeOptions': 'Op\u0163iuni pentru Practic\u0103 cu Exploratorul',
        'explorerPracticeTitle': 'LiChess Tools - practic\u0103 contra mut\u0103ri din Explorator',
        'outOfMoves':'Numai sunt mut\u0103ri \u00een Explorator',
        'explorerPracticeOptions.showSmileys': 'Arat\u0103 emoji c\u00E2nd nu mai sunt mut\u0103ri'
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
      const moves=[...current.moves];
      const total=moves.map(m=>m.total=m.black+m.draws+m.white).reduce((acc,val)=>acc+val,0);
      const index=Math.random()*total;
      let acc=0;
      for (const move of moves) {
        acc+=move.total;
        if (index<=acc) {
          this.inPlayMove=true;
          analysis.playUci(move.uci);
          return;
        }
      }
      if (!this.isRunning) return;
      parent.announce(trans.noarg('outOfMoves'));
      if (!this.options.showSmileys) return;
      const ceval=analysis.node.ceval;
      if (!ceval && !analysis.ceval.enabled()) {
        analysis.toggleCeval();
        this.stopCeval=true;
      }
      if (ceval) {
        if (!analysis.node.glyphs?.length) {
          const boardSign=analysis.getOrientation()=='black'?-1:1;
          const winValue=(ceval.cp||Math.sign(ceval.mate)*1000)*boardSign;
          let symbol='\uD83D\uDE10';
          if (winValue<-200) symbol='\uD83D\uDE22';
          else if (winValue<0) symbol='\uD83D\uDE1E';
          else if (winValue<200) symbol='\uD83D\uDE0C';
          else if (winValue>=200) symbol='\uD83D\uDE01';
          analysis.node.glyphs=[{
            "symbol": symbol,
            "name": "Final evaluation"
          }];
          parent.emitRedraw();
        }
        if (this.stopCeval && ceval.depth>12 && analysis.ceval.enabled()) {
          analysis.toggleCeval();
          this.stopCeval=false;
        }
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
      explorerContainer.toggleClass('lichessTools-explorerPracticeInAnalysis',!!this.isRunning && !analysis.study);
      if (analysis.turnColor()===analysis.getOrientation()) {
        this.inPlayMove=false;
        this.stopCeval=false;
      }
      if (this.isRunning) parent.global.setTimeout(this.playMove,500);
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('explorerPractice');
      const options=parent.currentOptions.getValue('explorerPracticeOptions');
      this.options={
        showSmileys:parent.isOptionSet(options,'showSmileys')
      };
      this.logOption('Explorer practice', value);
      this.logOption(' ... options', options);
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
