(()=>{
  class ExtraChartTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'extraChart',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['material','principled','tension','potential','brilliant','smooth','gauge'],
        defaultValue: 'material,principled,tension,smooth,gauge',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.extraChart': 'Extra analysis charting',
        'extraChart.material': 'Material',
        'extraChart.principled': 'Principled',
        'extraChart.tension': 'Max tension',
        'extraChart.potential': 'Max potential',
        'extraChart.brilliant': 'Find interesting moves',
        'extraChart.smooth': 'Chart smoothing',
        'extraChart.gauge': 'on Eval gauge',
        'chartInfoTitle':'LiChess Tools - extra charting',
        'tensionLineTitle': 'Max tension',
        'potentialLineTitle': 'Max potential',
        'goodMovesText':'good/brilliant/interesting moves',
        'goodMovesTitle':'LiChess Tools - good/brilliant/interesting moves'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.extraChart': 'Grafice de analiz\u0103 \u00een plus',
        'extraChart.material': 'Material',
        'extraChart.principled': 'Principial',
        'extraChart.tension': 'Tensiune maxim\u0103',
        'extraChart.potential': 'Poten\u0163ial maxim',
        'extraChart.brilliant': 'G\u0103se\u015Fte mut\u0103ri interesante',
        'extraChart.smooth': 'Netezire grafice',
        'extraChart.gauge': 'pe bara de Eval',
        'chartInfoTitle':'LiChess Tools - grafice \u00een plus',
        'tensionLineTitle': 'Tensiune maxim\u0103',
        'potentialLineTitle': 'Poten\u0163ial maxim',
        'goodMovesText':'mut\u0103ri bune/briliante/interesante',
        'goodMovesTitle':'LiChess Tools - mut\u0103ri bune/briliante/interesante'
      }
    }

    type='line';

    pieceMaterial={
      'k':0,
      'q':900,
      'r':500,
      'b':310,
      'n':300,
      'p':100
    };


    simple_material=(node,isTotal,side)=>{
      let result=0;
      if (!node.fen) return result;
      const board=node.fen.split(' ')[0];
      for (const ch of board) {
        const p=this.pieceMaterial[ch.toLowerCase()];
        if (p) {
          const m=ch===ch.toUpperCase()?1:-1;
          if (!side || side==m) {
            result+=isTotal
              ? p
              : m*p;
          }
        }
      }
      return result;
    };

    evaluator=new LiChessTools.Evaluator();
    heuristic=node=>{
      return this.evaluator.evaluate(node.fen);
    }

    getBoard=fen=>{
      const result=[];
      for (let i=0; i<8; i++) result.push(Array(8));
      const splits=fen.split(' ');
      fen=splits[0];
      let enpassant=splits[3];
      if (enpassant!='-') {
        result.enpassant={ 
          x: enpassant.charCodeAt(0)-97, 
          y: enpassant.charCodeAt(1)-49
        };
      }
      let x=0;
      let y=0;
      for (let i=0; i<fen.length; i++) {
        const ch=fen[i];
        if ('kqrbnp'.indexOf(ch.toLowerCase())>=0) {
          result[y][x]=ch;
          x++;
          continue;
        }
        if (ch=='/') {
          x=0;
          y++;
          continue;
        }
        x+=(+ch);
      }
      return result;
    };

    onBoard=(x,y)=>x>=0&&x<8&&y>=0&&y<8;

    pieceTension=(x,y,board,withSupport)=>{
      const underAttack=[];
      var ch=board[y][x];
      if (!ch) return underAttack;
      const m=ch===ch.toUpperCase()?1:-1;
      switch(ch.toLowerCase()) {
        case 'k':
          for (let dx=-1; dx<=1; dx++) {
            for (let dy=-1; dy<=1; dy++) {
              if (!dx&&!dy) continue;
              if (!this.onBoard(x+dx,y+dy)) continue;
              const pc=board[y+dy][x+dx];
              if (!pc) continue;
              const pm=pc===pc.toUpperCase()?1:-1;
              if (m!=pm) {
                underAttack.push({
                  m:m,
                  sx:x,
                  sy:y,
                  spc:ch,
                  x:x+dx,
                  y:y+dy,
                  pc:pc
                });
              }
            }
          }
          break;
        case 'q':
          for (let dx=-1; dx<=1; dx++) {
            for (let dy=-1; dy<=1; dy++) {
              if (!dx&&!dy) continue;
              const isDiagonal=dx&&dy;
              const isForward=dy===-m;
              for (let i=1; i<8; i++) {
                if (!this.onBoard(x+dx*i,y+dy*i)) break;
                const pc=board[y+dy*i][x+dx*i];
                if (!pc) continue;
                const pm=pc===pc.toUpperCase()?1:-1;
                if (m!=pm) {
                  underAttack.push({
                    m:m,
                    sx:x,
                    sy:y,
                    spc:ch,
                    x:x+dx*i,
                    y:y+dy*i,
                    pc:pc
                  });
                } else if (withSupport) {
                  if (pc.toLowerCase()==='q') continue;
                  if (isDiagonal&&pc.toLowerCase()==='b') continue;
                  if (!isDiagonal&&pc.toLowerCase()==='r') continue;
                  if ((isForward&&pc.toLowerCase()==='p')||pc.toLowerCase()==='k') {
                    const ppc=this.onBoard(x+dx*(i+1),y+dy*(i+1)) && board[y+dy*(i+1)][x+dx*(i+1)];
                    if (ppc) {
                      const ppm=ppc===ppc.toUpperCase()?1:-1;
                      if (m!=ppm) {
                        underAttack.push({
                          m:m,
                          sx:x,
                          sy:y,
                          spc:ch,
                          x:x+dx*(i+1),
                          y:y+dy*(i+1),
                          pc:pc
                        });
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        case 'r':
          for (let dx=-1; dx<=1; dx++) {
            for (let dy=-1; dy<=1; dy++) {
              if ((dx&&dy)||(!dx&&!dy)) continue;
              for (let i=1; i<8; i++) {
                if (!this.onBoard(x+dx*i,y+dy*i)) break;
                const pc=board[y+dy*i][x+dx*i];
                if (!pc) continue;
                const pm=pc===pc.toUpperCase()?1:-1;
                if (m!=pm) {
                  underAttack.push({
                    m:m,
                    sx:x,
                    sy:y,
                    spc:ch,
                    x:x+dx*i,
                    y:y+dy*i,
                    pc:pc
                  });
                } else if (withSupport) {
                  if (pc.toLowerCase()==='q') continue;
                  if (pc.toLowerCase()==='r') continue;
                  if (pc.toLowerCase()==='k') {
                    const ppc=this.onBoard(x+dx*(i+1),y+dy*(i+1)) && board[y+dy*(i+1)][x+dx*(i+1)];
                    if (ppc) {
                      const ppm=ppc===ppc.toUpperCase()?1:-1;
                      if (m!=ppm) {
                        underAttack.push({
                          m:m,
                          sx:x,
                          sy:y,
                          spc:ch,
                          x:x+dx*(i+1),
                          y:y+dy*(i+1),
                          pc:pc
                        });
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        case 'b':
          for (let dx=-1; dx<=1; dx++) {
            for (let dy=-1; dy<=1; dy++) {
              if (!dx||!dy) continue;
              const isForward=dy===-m;
              for (let i=1; i<8; i++) {
                if (!this.onBoard(x+dx*i,y+dy*i)) break;;
                const pc=board[y+dy*i][x+dx*i];
                if (!pc) continue;
                const pm=pc===pc.toUpperCase()?1:-1;
                if (m!=pm) {
                  underAttack.push({
                    m:m,
                    sx:x,
                    sy:y,
                    spc:ch,
                    x:x+dx*i,
                    y:y+dy*i,
                    pc:pc
                  });
                } else if (withSupport) {
                  if (pc.toLowerCase()==='q') continue;
                  if (pc.toLowerCase()==='b') continue;
                  if ((isForward&&pc.toLowerCase()==='p')||pc.toLowerCase()==='k') {
                    const ppc=this.onBoard(x+dx*(i+1),y+dy*(i+1)) && board[y+dy*(i+1)][x+dx*(i+1)];
                    if (ppc) {
                      const ppm=ppc===ppc.toUpperCase()?1:-1;
                      if (m!=ppm) {
                        underAttack.push({
                          m:m,
                          sx:x,
                          sy:y,
                          spc:ch,
                          x:x+dx*(i+1),
                          y:y+dy*(i+1),
                          pc:pc
                        });
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        case 'n':
          for (let dx=-1; dx<=1; dx++) {
            for (let dy=-1; dy<=1; dy++) {
              if (!dx||!dy) continue;
              if (this.onBoard(x+dx*1,y+dy*2)) {
                const pc=board[y+dy*2][x+dx*1];
                if (pc) {
                  const pm=pc===pc.toUpperCase()?1:-1;
                  if (m!=pm) {
                    underAttack.push({
                      m:m,
                      sx:x,
                      sy:y,
                      spc:ch,
                      x:x+dx*1,
                      y:y+dy*2,
                      pc:pc
                    });
                  }
                }
              }
              if (this.onBoard(x+dx*2,y+dy*1)) {
                const pc=board[y+dy*1][x+dx*2];
                if (pc) {
                  const pm=pc===pc.toUpperCase()?1:-1;
                  if (m!=pm) {
                    underAttack.push({
                      m:m,
                      sx:x,
                      sy:y,
                      spc:ch,
                      x:x+dx*2,
                      y:y+dy*1,
                      pc:pc
                    });
                  }
                }
              }
            }
          }
          break;
        case 'p':
          if (this.onBoard(x-1,y-m)) {
            const pc=board[y-m][x-1];
            if (pc) {
              const pm=pc===pc.toUpperCase()?1:-1;
              if (m!=pm) {
                underAttack.push({
                  m:m,
                  sx:x,
                  sy:y,
                  spc:ch,
                  x:x-1,
                  y:y-m,
                  pc:pc
                });
              }
            } else if (board.enpassant && board.enpassant.x==x-1 && board.enpassant.y==y-m) {
              const pm=-m;
              underAttack.push({
                m:m,
                sx:x,
                sy:y,
                spc:ch,
                x:x-1,
                y:y-m,
                pc:pm==1?'P':'p'
              });
            }
          }
          if (this.onBoard(x+1,y-m)) {
            const pc=board[y-m][x+1];
            if (pc) {
              const pm=pc===pc.toUpperCase()?1:-1;
              if (m!=pm) {
                underAttack.push({
                  m:m,
                  sx:x,
                  sy:y,
                  spc:ch,
                  x:x+1,
                  y:y-m,
                  pc:pc
                });
              }
            } else if (board.enpassant && board.enpassant.x==x+1 && board.enpassant.y==y-m) {
              const pm=-m;
              underAttack.push({
                m:m,
                sx:x,
                sy:y,
                spc:ch,
                x:x+1,
                y:y-m,
                pc:pm==1?'P':'p'
              });
            }
          }
          break;
      }
      return underAttack;
    };

    tension=node=>{
      const board=this.getBoard(node.fen);
      const underAttack=[];
      for (let y=0; y<8; y++) {
        for (let x=0; x<8; x++) {
          const ua=this.pieceTension(x,y,board,true);
          underAttack.push.apply(underAttack,ua);
        }
      }
      const result=[...new Set(underAttack.map(i=>i.x+','+i.y+'='+i.pc))].map(i=>i.split('=')[1].toLowerCase()).reduce((acc,val)=>this.pieceMaterial[val]+acc,0);
      return result;
    };

    getAllCapturingMoves=(board)=>{
      const underAttack=[];
      for (let y=0; y<8; y++) {
        for (let x=0; x<8; x++) {
          const ua=this.pieceTension(x,y,board,false);
          underAttack.push.apply(underAttack,ua);
        }
      }
      return underAttack;
    };

    findPieces=(board,piece)=>{
      const result=[];
      for (let y=0; y<8; y++) {
        for (let x=0; x<8; x++) {
          if (board[y][x]==piece) result.push({x:x,y:y});
        }
      }
      return result;
    };

    isPromotion=(node)=>{
      return node.san?.includes('=');
    };

    inCheck=(fen)=>{
      const side=fen.split(' ')[1]=='w'?1:-1;
      const board=this.getBoard(fen);
      const king=this.findPieces(board,side==1?'K':'k')[0];
      const moves=this.getAllCapturingMoves(board)
        .filter(m=>m.m!=side && m.x==king.x && m.y==king.y);
      return !!moves.length;
    };

    materialWon=(board,x,y)=>{
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      board=JSON.parse(JSON.stringify(board));
      const ch=board[y][x];
      if (!ch) return 0;
      const side=ch===ch.toUpperCase()?-1:1;
      const moves=this.getAllCapturingMoves(board)
        .filter(m=>m.x==x&&m.y==y&&m.m==side)
        .sort((m1,m2)=>this.pieceMaterial[m1.spc.toLowerCase()]-this.pieceMaterial[m2.spc.toLowerCase()]);
      const move=moves[0];
      if (!move) return 0;
      let result=this.pieceMaterial[ch.toLowerCase()]*side; //capture piece
      board[y][x]=move.spc;
      board[move.sy][move.sx]=null;
      result+=this.materialWon(board,x,y);
      return Math.sign(result)!=side?0:result;
    };

    maxMaterialWon=(board,m)=>{
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      let mx=0;
      for (let y=0; y<8; y++) {
        for (let x=0; x<8; x++) {
          const ch=board[y][x];
          if (!ch) continue; // no piece
          const pm=ch===ch.toUpperCase()?1:-1;
          if (pm==m) continue; // wrong turn
          const mw=this.materialWon(board,x,y);
          if (Math.sign(mw)==m && Math.abs(mw)>mx) {
            mx=Math.abs(mw);
          }
        }
      }
      return mx*m;
    };

    smooth = (points)=>{
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      if (!this.options.smooth) return points;
      const threshold=0.3;
      const toRemove=[];;
      for (let i=0;i<points.length-2;i++) {
        const avg=(points[i].y+points[i+2].y)/2;
        if (Math.abs(points[i].y-avg)>threshold) continue;
        if (Math.abs(points[i+2].y-avg)>threshold) continue;

        if (Math.abs(points[i+1].y-avg)<=threshold) continue;
        toRemove.push(i+1);
      }
      for (let i=toRemove.length-1; i>=0; i--) {
        points.splice(toRemove[i],1);
      }
      return toRemove.length?this.smooth(points):points;
    }

    getMaterialData = (mainline) => {
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      return mainline
        .slice(1)
        .map((node,x) => {
          const cp=this.simple_material(node);
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
            x: x
          };
        });
    };

    getPrincipledData = (mainline) => {
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      return mainline
        .slice(1)
        .map((node,x) => {
          const evl=this.heuristic(node);
          const mat=this.simple_material(node)
          let val=evl-mat;
          const cp=val*2;
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
            x: x
          };
        })
        .filter(r=>!!r);
    };

    setBrilliant = (mainline) => {
      if (mainline.brilliantInit) return;
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      let refreshSerie=false;
      const serie=parent.global.Highcharts?.charts?.at(0)?.series?.at(0);
      const result=mainline
        .slice(1)
        .map((node,x) => {
          if (node.ply<3) return 0;
          const m=node.ply%2?1:-1;
          const p1=node;
          const p2=mainline[node.ply-1];
          const p3=mainline[node.ply-2];
          const cp1=p1.eval?.cp;
          const cp2=p2.eval?.cp;
          if ((cp1-cp2)*m<-25) return 0;
          if (Math.abs(cp1)>75 && Math.sign(m)!=Math.sign(cp1)) return 0;
          if (this.inCheck(p2.fen)) return 0;
          if (this.isPromotion(p1)) return 0;
          const move={
            sx: p1.uci.charCodeAt(0)-97, 
            sy: p1.uci.charCodeAt(1)-49,
            x: p1.uci.charCodeAt(2)-97, 
            y: p1.uci.charCodeAt(3)-49
          };
          let board=this.getBoard(p2.fen);
          const mwStartUci=this.materialWon(board,move.sx,move.sy)/100;
          board=this.getBoard(p1.fen);
          const mwEndUci=this.materialWon(board,move.x,move.y)/100;
          const mat3=this.simple_material(p3,true,m)/100;
          const mat1=this.simple_material(p1,true,m)/100;
          const delta=(mat3-mat1);
          if (mwStartUci*m+1+delta<mwEndUci*m) {
            return 1;
          }
          board=this.getBoard(p3.fen);
          const mmw3=this.maxMaterialWon(board,m)/100;
          board=this.getBoard(p1.fen);
          const mmw1=this.maxMaterialWon(board,m)/100;
          const bril=mmw1*m-mmw3*m-delta;
          if (bril>4) {
            return bril;
          }
          return 0;
        })
        .map((v,x)=>{
          if (v) {
            const symbol='!?';
            const glyphs=mainline[x+1].glyphs||[];
            if (!glyphs.length) { //find(g=>g.symbol==symbol)
              glyphs.push({
                symbol: symbol,
                name: 'Brilliant',
                type: 'nonStandard'
              });
              mainline[x+1].glyphs=glyphs;
            }
            if (serie?.data[x]) {
              serie.data[x].marker={enabled:true,radius:5,fillColor:'#ea45d8'};
              refreshSerie=true;
            }
          }
          return {
            x:x,
            y:v
          };
        })
        .filter(r=>!!r);
      if (refreshSerie) {
        serie.setData(serie.data);
      }
      mainline.brilliantInit=true;
      return result;
    };

    getMaxTension = (mainline) => {
      let maxT=-1000;
      let maxM=-1000;
      let maxX=0;
      mainline
        .slice(1)
        .forEach((node,x) => {
          const tension=this.tension(node);
          const totalMaterial=this.simple_material(node,true);
          if (maxT<tension || (maxT==tension && maxM<totalMaterial)) {
            maxT=tension;
            maxX=x;
            maxM=totalMaterial;
          }
        });
      return maxX;
    };

    getMaxPotential = (mainline) => {
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      let maxM=-1000;
      let maxX=0;
      mainline
        .slice(1)
        .forEach((node,x) => {
          const board=this.getBoard(node.fen);
          const m=node.ply%2?-1:1;
          const maxMaterial=Math.abs(this.maxMaterialWon(board,m));
          if (maxM<maxMaterial) {
            maxM=maxMaterial;
            maxX=x;
          }
        });
      return maxX;
    };

    showGoodMoves=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const $=parent.$;
      const hcElem=$('div.highcharts-container')[0];
      let state=hcElem?.traverseState;
      if (!state) {
        state=parent.traverse();
        if (hcElem) hcElem.traverseState=state;
      }
      const arr=[].concat.apply([],['!','!?','!!'].map(s=>state.glyphs[s]).filter(a=>!!a?.length));
      if (!arr.length) return;
      const fill=(container,count,color)=>{
        let elem=$('div.lichessTools-goodMoves',container);
        if (!elem.length) {
          elem=$('<div></div>')
               .addClass('lichessTools-goodMoves')
               .addClass('advice-summary__error')
               .text(' '+trans.noarg('goodMovesText'))
               .prepend($('<strong></strong>'))
               .attr('title',trans.noarg('goodMovesTitle'))
               .on('click',(ev)=>{
                 ev.preventDefault();
                  parent.jumpToGlyphSymbol(color,['!','!?','!!']);
               })
               .on('mouseenter',(ev)=>{
                 $(hcElem).addClass('lichessTools-showGood-'+color);
               })
               .on('mouseleave',(ev)=>{
                 $(hcElem).removeClass('lichessTools-showGood-'+color);
               })
               .insertAfter($('div.advice-summary__player',container));
        }
        elem.toggleClass('symbol',!!count);
        $('strong',elem).text(count||0);
      };
      let container=$('div.advice-summary__side').get(0);
      let count=arr.filter(n=>n.ply%2==1).length;
      fill(container,count,'white');
      container=$('div.advice-summary__side').get(1);
      count=arr.filter(n=>n.ply%2==0).length;
      fill(container,count,'black');

      const serie=parent.global.Highcharts?.charts?.at(0)?.series?.at(0);
      if (serie) {
        let refreshSerie=false;
        for (let i=0; i<serie.data.length; i++) {
          if (serie.data[i].marker) continue;
          const move=lichess.analysis.mainline[i+1];
          const glyph=move?.glyphs?.at(0);
          if (!glyph) continue;
          if (!['!','!!','!?'].includes(glyph.symbol)) continue;
          serie.data[i].marker={
            enabled:true,
            radius:5,
            fillColor:'#0099140'+(i%2)
          };
          refreshSerie=true;
        }
        if (refreshSerie) {
          serie.setData(serie.data);
        }
      }
    }

    generateCharts=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      if (!lichess.analysis) return;
      if (!lichess.analysis.tree.root.eval&&!lichess.analysis.tree.root.children.at(0)?.eval) return;
      const Highcharts=parent.global?.Highcharts;
      if (!Highcharts) return;

      const chart=Highcharts.charts.find(c=>$(c.renderTo).is('#acpl-chart,.study__server-eval') && parent.inViewport(c.renderTo)>0);
      if (!chart) return;
      if (!this.options.material&&!this.options.principled) {
        $('div.lichessTools-chartInfo',chart.renderTo).remove();
        return;
      }
      if (!$('div.lichessTools-chartInfo',chart.renderTo).length) {
        $('<div class="lichessTools-chartInfo">')
          .attr('title',trans.noarg('chartInfoTitle'))
          .append($('<a target="_blank">')
                    .attr('data-icon','\uE05D')
                    .attr('href','https://siderite.dev/blog/lichess-tools---user-manual#extraChart'))
          .appendTo($('.highcharts-container',chart.renderTo));
      }
      const existingMaterial = chart.series.find(s=>s.name==='Material');
      if (existingMaterial && (this.type!=this.prevType || !this.options.material)) existingMaterial.remove();
      if (!existingMaterial && this.options.material) {
        chart.addSeries({
          name: 'Material',
          styledMode: true,
          type: this.type,
          data: this.smooth(this.getMaterialData(lichess.analysis.mainline)),
          enableMouseTracking: false,
          marker: {
            enabled: false
          }
        });
      }

      const existingPrincipled = chart.series.find(s=>s.name==='Principled');
      if (existingPrincipled && (this.type!=this.prevType || !this.options.principled)) existingPrincipled.remove();
      if (!existingPrincipled && this.options.principled) {
        chart.addSeries({
          name: 'Principled',
          styledMode: true,
          type: this.type,
          data: this.smooth(this.getPrincipledData(lichess.analysis.mainline)),
          enableMouseTracking: false,
          marker: {
            enabled: false
          }
        });
      }

      const existingTension = chart.xAxis[0].plotLinesAndBands.find(l=>l.id==='Tension');
      if (existingTension && !this.options.tension) chart.xAxis[0].removePlotLine('Tension');
      if (!existingTension && this.options.tension) {
        const x=this.getMaxTension(lichess.analysis.mainline);
        chart.xAxis[0].addPlotLine({
          id: 'Tension',
          color: 'red',
          dashStyle: 'dot',
          zIndex: 3,
          width: 2,
          value: x,
          label: {
            text:trans.noarg('tensionLineTitle'),
            style: { color: '#A07070' }
          }
        });
      }

      const existingPotential = chart.xAxis[0].plotLinesAndBands.find(l=>l.id==='Potential');
      if (existingPotential && !this.options.potential) chart.xAxis[0].removePlotLine('Potential');
      if (!existingPotential && this.options.potential) {
        const x=this.getMaxPotential(lichess.analysis.mainline);
        chart.xAxis[0].addPlotLine({
          id: 'Potential',
          color: 'green',
          dashStyle: 'dot',
          zIndex: 3,
          width: 2,
          value: x,
          label: {
            text:trans.noarg('potentialLineTitle'),
            style: { color: '#70A070' }
          }
        });
      }

      if (this.options.brilliant) {
        this.setBrilliant(lichess.analysis.mainline);

        this.showGoodMoves();
      }

      this.prevType=this.type;
    };

    generateTicks=()=>{
      if (!this.options.gauge) return;
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      if (!analysis) return;
      const node=analysis.node;
      const container=$('div.eval-gauge');
      if (!parent.inViewport(container[0])) return;
      if (node.fen==this.prevFen) return;
      this.prevFen=node.fen;
      const mat=this.simple_material(node);
      const material = 2 / (1 + Math.exp(-0.004 * mat)) - 1;
      const evl=this.heuristic(node);
      const val=(evl-mat)*2;
      const principled = 2 / (1 + Math.exp(-0.004 * val)) - 1;
      let matElem=$('tick.lichessTools-material',container);
      if (!matElem.length) {
        matElem=$('<tick>')
          .addClass('lichessTools-material')
          .appendTo(container);
      }
      const matPerc=Math.round((1-material*0.95)*50)+'%';
      matElem.css('top',matPerc);
      let priElem=$('tick.lichessTools-principled',container);
      if (!priElem.length) {
        priElem=$('<tick>')
          .addClass('lichessTools-principled')
          .appendTo(container);
      }
      const priPerc=Math.round((1-principled*0.95)*50)+'%';
      priElem.css('top',priPerc);
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('extraChart');
      this.logOption('Extra charting', value);
      this.options={
        material:parent.isOptionSet(value,'material'),
        principled:parent.isOptionSet(value,'principled'),
        tension:parent.isOptionSet(value,'tension'),
        potential:parent.isOptionSet(value,'potential'),
        brilliant:parent.isOptionSet(value,'brilliant'),
        smooth:parent.isOptionSet(value,'smooth'),
        gauge:parent.isOptionSet(value,'gauge')
      };
      this.type=this.options.smooth?'spline':'line';
      const lichess=parent.lichess;
      const $=parent.$;
      parent.global.clearInterval(this.interval);
      this.generateCharts();
      if (!value) {
        return;
      }
      if (!this.options.gauge) {
        $('div.eval-gauge tick.lichessTools-material,div.eval-gauge tick.lichessTools-principled').remove();
        this.prevFen=null;
      }
      this.interval=parent.global.setInterval(()=>{
        this.generateCharts();
        this.generateTicks();
      },1000);
    }

  }
  LiChessTools.Tools.ExtraChart=ExtraChartTool;
})();
