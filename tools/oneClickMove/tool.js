(()=>{
  class OneClickMoveTool extends LiChessTools.Tools.ToolBase {

    dependencies=['ExtendedInteractiveLesson'];

    preferences=[
      {
        name:'oneClickMove',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['analysis','onlyOrientation','moveFromPgn'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.oneClickMove': 'One click move',
        'oneClickMove.analysis': 'Analysis/Study',
        'oneClickMove.play': 'Play/Puzzles',
        'oneClickMove.onlyOrientation': 'Only orientation side',
        'oneClickMove.moveFromPgn': 'Move from PGN'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.oneClickMove': 'Mutare cu un singur click',
        'oneClickMove.analysis': 'Analiz\u0103/Studiu',
        'oneClickMove.play': 'Joc/Puzzle-uri',
        'oneClickMove.onlyOrientation': 'Doar juc\u0103torul orient\u0103rii',
        'oneClickMove.moveFromPgn': 'Mi\u015Fc\u0103ri din PGN'
      }
    }

    boardClick=(ev)=>{
      if (ev.which>1 || ev.shiftKey) return;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess.analysis;
      if (!analysis) return; //TODO only analysis supported so far
      if (!(this.options.analysis && analysis)&&!(this.options.play && !analysis)) return; //TODO better play detection and implement play code
      if (!ev.x && !ev.y) return;
      const board=$('main cg-board');
      if (!board.length) return;
      const rect=board[0].getBoundingClientRect();
      const [x,y]=[ev.x-rect.x,ev.y-rect.y];
      const isStandard=board.closest('div.round__app, main').is('.variant-standard,.variant-fromPosition'); //TODO fromPosition?
      //if (!isStandard) return; //TODO only add this if we decide to hack the play mechanism
      const orientation=board.closest('.cg-wrap').is('.orientation-black')?'black':'white';
      const fen=parent.getPositionFromBoard(board.closest('cg-container'),true); 
      const turn=/ b\b/.test(fen) ?'black':'white';
      if (this.options.onlyOrientation && orientation!=turn) return;
      const getSquare=orientation=='white'
        ? res=>String.fromCharCode(97+res.x)+(8-res.y)
        : res=>String.fromCharCode(104-res.x)+(res.y+1);
      const width=board.width()/8;
      const res={
                x:Math.floor(x/width),
                y:Math.floor(y/width)
              };
      const square=getSquare(res);
      const destMan=analysis.chessground?.state?.movable?.dests;
      if (!destMan) return;
      const sources=$('piece.'+turn).get()
        .map(e=>e.cgKey)
        .filter(sq=>{
          if (!sq) return false;
          const dests=destMan.get(sq);
          return dests?.includes(square);
        });
      let uci='';
      if (sources.length==1) {
        uci=sources[0]+square;
      } else {
        if (parent.isGamePlaying()) return false;
        const gp=analysis.gamebookPlay();
        if (gp && !analysis.study?.vm?.mode?.write) return false;
        const nextMoves=parent.getNextMoves(analysis.node,gp?.threeFoldRepetition)
                              .filter(c=>!parent.isPermanentNode || parent.isPermanentNode(c))
                              .filter(c=>c.uci.endsWith(square));
        if (nextMoves.length!=1) return;
        uci=nextMoves[0].uci;
      }
      if (uci) {
        ev.preventDefault();
        analysis.playUci(uci);
      }
    };

    handleBoard=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const board=$('main cg-board')[0];
      if (!board || board.lichessTools_oneClickMove) return;
      board.addEventListener('mousedown',this.boardClick,{ capture: true });
      board.lichessTools_oneClickMove=true;
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('oneClickMove');
      this.logOption('One click move', value);
      const analysis=lichess.analysis;
      if (!analysis) return; //TODO only analysis supported so far
      this.options={ 
        analysis: parent.isOptionSet(value,'analysis'),
        play: parent.isOptionSet(value,'play'),
        onlyOrientation: parent.isOptionSet(value,'onlyOrientation'),
        moveFromPgn: parent.isOptionSet(value,'moveFromPgn')
      };
      const board=$('main cg-board')[0];
      if (board) {
        board.removeEventListener('mousedown',this.boardClick,{ capture: true });
        board.lichessTools_oneClickMove=false;
      }
      parent.global.clearInterval(this.interval);
      if (!value) return;
      this.interval=parent.global.setInterval(this.handleBoard,1000);
      this.handleBoard();
    }

  }
  LiChessTools.Tools.OneClickMove=OneClickMoveTool;
})();
