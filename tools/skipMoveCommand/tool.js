(()=>{
  class SkipMoveCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies=['CliCommands'];

    preferences=[
      {
        name:'skipMoveCommand',
        category: 'command',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        'options.skipMoveCommand': 'Command: move to switch playing side',
        'skipMoveCommand.helpText': '/skipmove\r\nMove for both players to "skip" the move',
        'cannotSkipMove': 'Cannot skip move from this position!'
      },
      'ro-RO':{
        'options.skipMoveCommand': 'Comand\u0103: mut\u0103 pentru a schimba cine e la r\u00e2nd',
        'skipMoveCommand.helpText': '/skipmove\r\nMut\u0103 pentru a schimba cine e la r\u00e2nd',
        'cannotSkipMove': 'Nu pot schimba cine e la r\u00e2nd din aceasta pozi\u0163ie!'
      }
    };

    isSkippedMove=(fen1,fen2)=>{
      const s1=fen1.split(' ');
      const s2=fen2.split(' ');
      if (s1[0]!=s2[0]) return false;
      if (s1[1]==s2[1]) return false;
      return true;
    };

    skipMoveIfPossible=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;

      const co=parent.chessops;
      const fen=co.fen.parseFen(analysis.node.fen).unwrap();
      let ch=co.Chess.fromSetup(fen).unwrap();

      const result={
        moves:[],
        good:false,
        white:null,
        black:null
      };

      const findNextMove=()=>{
        const turn=ch.turn;
        const lastPiece=result[turn]?.at(-1);
        const moves=Array.from(ch.board.rook).concat(Array.from(ch.board.bishop)).concat(Array.from(ch.board.queen)).concat(Array.from(ch.board.king))
                       .filter(p=>!lastPiece || p==lastPiece)
                       .flatMap(p=>Array.from(ch.dests(p)).map(d=>{ return {from:p,to:d}; }))
                       .filter(m=>result.moves.length<4||result[turn][0]==m.to);
        for (const move of moves) {
          result.moves.push(co.makeUci(move));
          if (result[turn]) {
            result[turn].push(move.to);
          } else {
            result[turn]=[move.from,move.to];
          }
          const pch=ch.clone();
          ch.play(move);
          if (result.moves.length==5) {
            const newFen = co.fen.makeFen(ch.toSetup());
            if (this.isSkippedMove(analysis.node.fen,newFen)) {
              result.good=true;
              return;
            }
          } else {
            findNextMove();
            if (result.good) break;
          }
          result.moves.pop();
          result[turn].pop();
          ch=pch;
        }
      }
      
      findNextMove();
      if (!result.good) {
        parent.announce(trans.noarg('cannotSkipMove'));
        return;
      }
      analysis.playUciList(result.moves);
    }

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const value=parent.currentOptions.getValue('skipMoveCommand');
      this.options={ enabled:value };
      this.logOption('Command - skip move', value);
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      parent.unregisterCommand('skipMoveCommand');
      if (value && analysis) {
        parent.registerCommand('skipMoveCommand',{
          handle:(val)=>{
            if (val=='skipmove') {
              this.skipMoveIfPossible();
              return true;
            }
          },
          getHelp:()=>trans.noarg('skipMoveCommand.helpText')
        });
      }
    }
  }
  LiChessTools.Tools.SkipMoveCommand=SkipMoveCommandTool;
})();
