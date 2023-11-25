(()=>{
  class ShowPawnStructureTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'showPawnStructure',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.showPawnStructure': 'Show pawn structures',
        'structureNameTitle': 'LiChess Tools - pawn structure - %s'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.showPawnStructure': 'Arat\u0103 structura de pioni \u00een partide',
        'structureNameTitle': 'LiChess Tools - structura de pioni - %s'
      }
    }

    isGamesPage=()=>{
       return /^\/games(\/|$)?/i.test(this.lichessTools.global.location.pathname);
    };

    getStructure=(board,blackOrientation)=>{
      if (!board) return null;
      const parent=this.lichessTools;
      const result={
        pawns:{
         'w':[-1,-1,-1,-1,-1,-1,-1,-1],
         'b':[-1,-1,-1,-1,-1,-1,-1,-1]
        },
        led:{
         'w':[false,false,false,false,false,false,false,false],
         'b':[false,false,false,false,false,false,false,false]
        },
        qSide:{ 'w': 0, 'b': 0 },
        kSide:{ 'w': 0, 'b': 0 }
      };
      for (let x=0; x<8; x++) {
        for (let y=0; y<8; y++) {
          const ch=board[y][x];
          switch(ch) {
            case 'p':
              if (y<=4) {
                if (result.pawns.b[x]>-1) result.led.b[x]=true;
                result.pawns.b[x]=y-1;
              }
              break;
            case 'P':
              if (y>=3) {
                if (result.pawns.w[x]>-1) result.led.w[x]=true;
                result.pawns.w[x]=6-y;
              }
              break;
          }
        }
      }
      let w=false;
      let b=false;
      for (let x=0; x<8; x++) {
        if (result.pawns.w[x]>-1) {
           if (!w && (result.qSide.w>0 || x<=3)) result.qSide.w++;
        } else {
           w=true;
        }
        if (result.pawns.b[x]>-1) {
           if (!b && (result.qSide.b>0 || x<=3)) result.qSide.b++;
        } else {
           b=true;
        }
      }
      w=false;
      b=false;
      for (let x=7; x>=0; x--) {
        if (result.pawns.w[x]>-1) {
           if (!w && (result.kSide.w>0 || x<=4)) result.kSide.w++;
        } else {
           w=true;
        }
        if (result.pawns.b[x]>-1) {
           if (!b && (result.kSide.b>0 || x<=4)) result.kSide.b++;
        } else {
           b=true;
        }
      }
      const me=blackOrientation?'b':'w';
      const they=blackOrientation?'w':'b';
      let structureText='';
      structureText+=result.pawns[me][3]<0?'X':result.pawns[me][3];
      structureText+=result.pawns[they][3]<0?'X':result.pawns[they][3];
      structureText+=result.pawns[me][4]<0?'X':result.pawns[me][4];
      structureText+=result.pawns[they][4]<0?'X':result.pawns[they][4];
      structureText+=result.pawns[me][2]<0?'X':result.pawns[me][2];
      structureText+=result.pawns[they][2]<0?'X':result.pawns[they][2];
      structureText+=result.qSide[me]>result.qSide[they]?'M':result.qSide[me]<result.qSide[they]?'T':'X';
      structureText+=result.kSide[me]>result.kSide[they]?'M':result.kSide[me]<result.kSide[they]?'T':'X';
      structureText+=' ';
      structureText+=result.pawns[me][5]<0?'X':result.pawns[me][5];
      structureText+=result.pawns[they][5]<0?'X':result.pawns[they][5];
      structureText+=result.pawns[me][1]<0?'X':result.pawns[me][1];
      structureText+=result.pawns[they][1]<0?'X':result.pawns[they][1];
      structureText+=result.pawns[me][6]<0?'X':result.pawns[me][6];
      structureText+=result.pawns[they][6]<0?'X':result.pawns[they][6];
      structureText+=result.pawns[me][0]<0?'X':result.pawns[me][0];
      structureText+=result.pawns[they][0]<0?'X':result.pawns[they][0];
      structureText+=result.pawns[me][7]<0?'X':result.pawns[me][7];
      structureText+=result.pawns[they][7]<0?'X':result.pawns[they][7];
      structureText+=' ';
      structureText+=result.led[me][3]?'L':'X';
      structureText+=result.led[they][3]?'L':'X';
      structureText+=result.led[me][4]?'L':'X';
      structureText+=result.led[they][4]?'L':'X';
      structureText+=result.led[me][2]?'L':'X';
      structureText+=result.led[they][2]?'L':'X';
      structureText+=result.led[me][5]?'L':'X';
      structureText+=result.led[they][5]?'L':'X';
      structureText+=result.led[me][1]?'L':'X';
      structureText+=result.led[they][1]?'L':'X';
      structureText+=result.led[me][6]?'L':'X';
      structureText+=result.led[they][6]?'L':'X';
      structureText+=result.led[me][0]?'L':'X';
      structureText+=result.led[they][0]?'L':'X';
      structureText+=result.led[me][7]?'L':'X';
      structureText+=result.led[they][7]?'L':'X';
      return structureText;
    };

    miniGameStructure=async (el)=>{
      //if (this.isGamesPage()) return;
      const parent=this.lichessTools;
      const $=parent.$;
      if (parent.global.document.hidden) return;
      const trans=parent.translator;
      let fen='';
      if (el?.id && el?.fen) {
        fen=el.fen;
        el=$('.mini-game-'+el.id);
        if (!el.length) return;
      };
      if (!$(el).length) el=$('body');
      const elems=$('a[href].mini-game,div.boards>a[href]',el).get();
      if ($(el).is('a[href].mini-game,div.boards>a[href]')) elems.push(el);
      for (const el of elems) {
        fen=fen || $(el).attr('data-state');
        const board=parent.getBoardFromFen(fen);
        const structure=this.getStructure(board,$(el).attr('data-state').includes('black'));
        const simplified=structure.split(' ')[0];
        let span=$('.lichessTools-structure',el);
        if (!span.length) {
          span=$('<span class="lichessTools-structure"/>').appendTo(el);
        }
        span.text(simplified).attr('title',trans.pluralSame('structureNameTitle',structure));
        fen='';
      }
    };
    miniGameStructureDebounced=this.lichessTools.debounce(this.miniGameStructure,500);

    refreshStructure=async (ply)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      if (parent.global.document.hidden) return;
      if ($('body').is('.playing')) return;
      const trans=parent.translator;
      const metaSection = $('div.game__meta section, div.analyse__wiki.empty').eq(0);
      const fen=parent.getPositionFromBoard($('main'),true);
      const board=parent.getBoardFromFen(fen);
      const structure=this.getStructure(board,$('.cg-wrap').is('.orientation-black'));
      if (!structure) {
        $('.lichessTools-structure',metaSection).remove();
        return;
      }
      const simplified=structure.split(' ')[0];
      if (!$('span.lichessTools-structure',metaSection).length) {
        metaSection.append($('<span/>').addClass('lichessTools-structure').attr('title',trans.pluralSame('structureNameTitle',structure)));
      }
      $('span.lichessTools-structure',metaSection).text(simplified);
      if (!ply) {
        await this.miniGameStructure();
      }
    };
    refreshStructureDebounced=this.lichessTools.debounce(this.refreshStructure,500);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('showPawnStructure');
      this.logOption('Show pawn structures', value);
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      lichess.pubsub.off('socket.in.fen',this.miniGameStructure);
      lichess.pubsub.off('ply',this.refreshStructureDebounced);
      lichess.pubsub.off('redraw',this.refreshStructureDebounced);
      lichess.pubsub.off('content-loaded',this.miniGameStructure);
      if (lichess.socket?.settings?.events?.endData) {
        lichess.socket.settings.events.endData=parent.unwrapFunction(lichess.socket.settings.events.endData,'showPawnStructure');
      }
      if (value) {
        if (lichess.socket?.settings?.events?.endData) {
          lichess.socket.settings.events.endData=parent.wrapFunction(lichess.socket.settings.events.endData,{
            id:'showPawnStructure',
            after: ($this,result,...args)=>{
              this.refreshStructureDebounced();
            }
          });
        }
        lichess.pubsub.on('socket.in.fen',this.miniGameStructure);
        lichess.pubsub.on('ply',this.refreshStructureDebounced);
        lichess.pubsub.on('redraw',this.refreshStructureDebounced);
        lichess.pubsub.on('content-loaded',this.miniGameStructure);
        parent.global.requestAnimationFrame(this.refreshStructureDebounced);
      } else {
        const metaSection = $('div.game__meta section').eq(0);
        $('.lichessTools-structure',metaSection).remove();
      }
    }

  }
  LiChessTools.Tools.ShowPawnStructure=ShowPawnStructureTool;
})();
