(()=>{
  class OneClickMoveTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'oneClickMove',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['analysis'],
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
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.oneClickMove': 'Mutare cu un singur click',
        'oneClickMove.analysis': 'Analiz\u0103/Studiu',
        'oneClickMove.play': 'Joc/Puzzle-uri',
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
      const board=$('main cg-board');
      if (!board.length) return;
      if (!ev.offsetX && !ev.offsetY) return;
      const isStandard=board.closest('div.round__app, main').is('.variant-standard,.variant-fromPosition'); //TODO fromPosition?
      //if (!isStandard) return; //TODO only add this if we decide to hack the play mechanism
      const orientation=board.closest('.cg-wrap').is('.orientation-black')?'black':'white';
      const fen=parent.getPositionFromBoard(board.closest('cg-container'),true); 
      const turn=/ b\b/.test(fen) ?'black':'white';
      const getSquare=orientation=='white'
        ? res=>String.fromCharCode(97+res.x)+(8-res.y)
        : res=>String.fromCharCode(104-res.x)+(res.y+1);
      const width=board.width()/8;
      const res={
                x:Math.floor(ev.offsetX/width),
                y:Math.floor(ev.offsetY/width)
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
      if (sources.length!=1) return;
      ev.preventDefault();
      const uci=sources[0]+square;
      analysis.playUci(uci);
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
        play: parent.isOptionSet(value,'play')
      };
      const board=$('main cg-board')[0];
      if (board) {
        board.removeEventListener('mousedown',this.boardClick,{ capture: true });
      }
      parent.global.clearInterval(this.interval);
      if (!value) return;
      this.interval=parent.global.setInterval(this.handleBoard,1000);
      this.handleBoard();
    }

  }
  LiChessTools.Tools.OneClickMove=OneClickMoveTool;
})();
