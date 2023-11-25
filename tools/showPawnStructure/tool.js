(()=>{
  class ShowPawnStructureTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'showPawnStructure',
        category: 'general',
        type:'multiple',
        possibleValues: ['enabled','onlyNamed','fuzzy'],
        defaultValue: 'onlyNamed,fuzzy'
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.showPawnStructure': 'Show pawn structures',
        'showPawnStructure.enabled': 'Enabled',
        'showPawnStructure.onlyNamed': 'Only named structures',
        'showPawnStructure.fuzzy': 'Fuzzy search',
        'structureNameTitle': 'LiChess Tools - pawn structure - %s'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.showPawnStructure': 'Arat\u0103 structura de pioni \u00een partide',
        'showPawnStructure.enabled': 'Activat',
        'showPawnStructure.onlyNamed': 'Doar structuri cu nume',
        'showPawnStructure.fuzzy': 'C\u0103utare aproximativ\u0103',
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
      structureText+=' ';
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

    names = {
      '2XX1XXXT': {
        name: 'Isolani',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Queen\'s_Gambit_%E2%80%93_Isolani_formation'
      },
      '2XXXX0TX': {
        name: 'Isolani',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Giuoco_Piano_%E2%80%93_Isolani_formation'
      },
      '2XX12XTT': {
        name: 'Hanging Pawns',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Hanging_pawns'
      },
      '221XX1TM': {
        name: 'Orthodox Exchange',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Carlsbad_formation'
      },
      'XX2221XX': {
        name: 'Rauzer Formation',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Rauzer_formation'
      },
      'X12X21TM': {
        name: 'Boleslavsky Wall',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Boleslavsky_Wall'
      },
      'X1210XMT': {
        name: 'Scheveningen',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Sicilian_%E2%80%93_Scheveningen'
      },
      'X1200XMT': {
        name: 'Dragon',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Sicilian_%E2%80%93_Dragon'
      },
      'X1202XMT': {
        name: 'Maroczi Bind',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Mar%C3%B3czy_Bind'
      },
      'X0212XMT': {
        name: 'Maroczi Bind',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Mar%C3%B3czy_Bind'
      },
      'X1212XMT': {
        name: 'Hedgehog',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Hedgehog'
      },
      'X1220XMT': {
        name: 'Boleslavsky Hole',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Boleslavsky_hole'
      },
      '312220XX': {
        name: 'd5 Chain',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#d5-chain'
      },
      '223100XX': {
        name: 'e5 Chain',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#e5-chain'
      },
      '22X13XMT': {
        name: 'Panov',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Panov_formation'
      },
      '220100XX': {
        name: 'Stonewall',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Stonewall_formation'
      },
      '221100XX': {
        name: 'Botvinnik',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Botvinnik_system'
      },
      '2X11X1TM': {
        name: 'Slav',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Slav_formation'
      },
      '2XX111MT': {
        name: 'Caro',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Caro_formation'
      },
      '312XX2TM': {
        name: 'Modern Benoni',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Modern_Benoni_formation'
      },
      '112002XX': {
        name: 'Closed Sicilian',
        url: 'https://en.wikipedia.org/wiki/Pawn_structure#Closed_Sicilian_formation'
      }
    };

    keySimilarity=(k1,k2)=>{
      let diff=0;
      let p=1;
      const l=k1.length;
      for (let i=0; i<l; i++) {
        if (k1[i]==k2[i]) continue;
        const v='0123'.includes(k1[i]) && '0123'.includes(k2[i])
          ? 0.5
          : 1;
        diff+=v*p;
        p-=0.06;
      }
      return parseInt((l-diff)*100/l);
    };

    getStructureName=(structure)=>{
      const parent=this.lichessTools;
      const threshold=90;
      const key=structure.split(' ')[0];
      const name=this.names[key];
      if (name) return name;
      if (this.options.fuzzy) {
        const arr=Object.keys(this.names).map(k=>{
          return {
            key:k, 
            name:this.names[k],
            similarity: this.keySimilarity(k,key)
          };
        });
        arr.sort((o1,o2)=>o2.similarity-o1.similarity);
        if (arr[0].similarity>threshold&&arr[0].similarity!=arr[1].similarity) {
          return arr[0].name;
        }
      }
      if (this.options.onlyNamed) return null;
      return { name: key };
    };

    addStructureAnchor=(el,structureName,structure)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      let structureElem=$('.lichessTools-structure',el);
      if (!structureName) {
        structureElem.remove();
        return;
      }
      const isLink=!!structureName.url;
      if ((isLink && structureElem.is('span'))||(!isLink && structureElem.is('a'))) {
        structureElem.remove();
        structureElem=$('.lichessTools-structure',el);
      }
      if (!structureElem.length) {
        structureElem=$('<'+(isLink?'a':'span')+'>')
          .addClass('lichessTools-structure')
          .appendTo(el);
        if (isLink) {
          structureElem.attr('target','_blank');
        }
      }
      structureElem
        .text(structureName.name)
        .attr('title',trans.pluralSame('structureNameTitle',structure));
      if (isLink) {
        structureElem.attr('href',structureName.url);
      }
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
        const structureName=this.getStructureName(structure);
        this.addStructureAnchor(el,structureName,structure);
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
      const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members').eq(0);
      const fen=parent.getPositionFromBoard($('main'),true);
      const board=parent.getBoardFromFen(fen);
      const structure=this.getStructure(board,$('.cg-wrap').is('.orientation-black'));
      if (!structure) {
        $('.lichessTools-structure',metaSection).remove();
        return;
      }
      const structureName=this.getStructureName(structure);
      this.addStructureAnchor(metaSection,structureName,structure);
      if (!ply) {
        await this.miniGameStructure();
      }
    };
    refreshStructureDebounced=this.lichessTools.debounce(this.refreshStructure,500);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('showPawnStructure');
      this.logOption('Show pawn structures', value);
      this.options={
        enabled:parent.isOptionSet(value,'enabled'),
        onlyNamed:parent.isOptionSet(value,'onlyNamed'),
        fuzzy:parent.isOptionSet(value,'fuzzy')
      };
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      lichess.pubsub.off('socket.in.fen',this.miniGameStructure);
      lichess.pubsub.off('ply',this.refreshStructureDebounced);
      lichess.pubsub.off('redraw',this.refreshStructureDebounced);
      lichess.pubsub.off('content-loaded',this.miniGameStructureDebounced);
      if (lichess.socket?.settings?.events?.endData) {
        lichess.socket.settings.events.endData=parent.unwrapFunction(lichess.socket.settings.events.endData,'showPawnStructure');
      }
      if (this.options.enabled) {
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
        lichess.pubsub.on('content-loaded',this.miniGameStructureDebounced);
        parent.global.requestAnimationFrame(this.refreshStructureDebounced);
      } else {
      const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members');
        $('.lichessTools-structure',metaSection).remove();
      }
      if (this.isGamesPage()) {
        $('body').toggleClass('lichessTools-structureMiniGames',this.options.enabled);
      }
    }

  }
  LiChessTools.Tools.ShowPawnStructure=ShowPawnStructureTool;
})();
