(()=>{
  class ExtraChartTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'extraChart',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['material','principled','tension','smooth'],
        defaultValue: 'material,principled,tension,smooth',
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
        'extraChart.smooth': 'Chart smoothing',
        'chartInfoTitle':'LiChess Tools - extra charting',
        'tensionLineTitle': 'Max tension'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.extraChart': 'Grafice de analiz\u0103 \u00een plus',
        'extraChart.material': 'Material',
        'extraChart.principled': 'Principial',
        'extraChart.tension': 'Tensiune maxim\u0103',
        'extraChart.smooth': 'Netezire grafice',
        'chartInfoTitle':'LiChess Tools - grafice \u00een plus',
        'tensionLineTitle': 'Tensiune maxim\u0103'
      }
    }

    type='line';

    simple_material=(node,isTotal)=>{
      const points={
        'k':0,
        'q':900,
        'r':500,
        'b':310,
        'n':300,
        'p':100
      };
      let result=0;
      if (!node.fen) return result;
      const board=node.fen.split(' ')[0];
      for (const ch of board) {
        const p=points[ch.toLowerCase()];
        if (p) {
          const m=ch===ch.toUpperCase()?1:-1;
          result+=isTotal
            ? p
            : m*p;
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
      fen=fen.split(' ')[0];
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

    pieceTension=(ch,x,y,board,control)=>{
      const m=ch===ch.toUpperCase()?1:-1;
      let underAttack=[];
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
                underAttack.push({x:x+dx,y:y+dy,pc:pc});
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
                  underAttack.push({x:x+dx*i,y:y+dy*i,pc:pc});
                } else {
                  if (pc.toLowerCase()==='q') continue;
                  if (isDiagonal&&pc.toLowerCase()==='b') continue;
                  if (!isDiagonal&&pc.toLowerCase()==='r') continue;
                  if ((isForward&&pc.toLowerCase()==='p')||pc.toLowerCase()==='k') {
                    const ppc=this.onBoard(x+dx*(i+1),y+dy*(i+1)) && board[y+dy*(i+1)][x+dx*(i+1)];
                    if (ppc) {
                      const ppm=ppc===ppc.toUpperCase()?1:-1;
                      if (m!=ppm) {
                        underAttack.push({x:x+dx*(i+1),y:y+dy*(i+1),pc:pc});
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
                  underAttack.push({x:x+dx*i,y:y+dy*i,pc:pc});
                } else {
                  if (pc.toLowerCase()==='q') continue;
                  if (pc.toLowerCase()==='r') continue;
                  if (pc.toLowerCase()==='k') {
                    const ppc=this.onBoard(x+dx*(i+1),y+dy*(i+1)) && board[y+dy*(i+1)][x+dx*(i+1)];
                    if (ppc) {
                      const ppm=ppc===ppc.toUpperCase()?1:-1;
                      if (m!=ppm) {
                        underAttack.push({x:x+dx*(i+1),y:y+dy*(i+1),pc:pc});
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
                  underAttack.push({x:x+dx*i,y:y+dy*i,pc:pc});
                } else {
                  if (pc.toLowerCase()==='q') continue;
                  if (pc.toLowerCase()==='b') continue;
                  if ((isForward&&pc.toLowerCase()==='p')||pc.toLowerCase()==='k') {
                    const ppc=this.onBoard(x+dx*(i+1),y+dy*(i+1)) && board[y+dy*(i+1)][x+dx*(i+1)];
                    if (ppc) {
                      const ppm=ppc===ppc.toUpperCase()?1:-1;
                      if (m!=ppm) {
                        underAttack.push({x:x+dx*(i+1),y:y+dy*(i+1),pc:pc});
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
                    underAttack.push({x:x+dx*1,y:y+dy*2,pc:pc});
                  }
                }
              }
              if (this.onBoard(x+dx*2,y+dy*1)) {
                const pc=board[y+dy*1][x+dx*2];
                if (pc) {
                  const pm=pc===pc.toUpperCase()?1:-1;
                  if (m!=pm) {
                    underAttack.push({x:x+dx*2,y:y+dy*1,pc:pc});
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
                underAttack.push({x:x-1,y:y-m,pc:pc});
              }
            }
          }
          if (this.onBoard(x+1,y-m)) {
            const pc=board[y-m][x+1];
            if (pc) {
              const pm=pc===pc.toUpperCase()?1:-1;
              if (m!=pm) {
                underAttack.push({x:x+1,y:y-m,pc:pc});
              }
            }
          }
          break;
      }
      return underAttack;
    };

    tension=node=>{
      const points={
        'k':0,
        'q':900,
        'r':500,
        'b':310,
        'n':300,
        'p':100
      };
      const board=this.getBoard(node.fen);
      let underAttack=[];
      for (let y=0; y<8; y++) {
        for (let x=0; x<8; x++) {
          const ch=board[y][x];
          if (!ch) continue;
          const ua=this.pieceTension(ch,x,y,board);
          underAttack.push.apply(underAttack,ua);
        }
      }
      const result=[...new Set(underAttack.map(i=>i.x+','+i.y+'='+i.pc))].map(i=>i.split('=')[1].toLowerCase()).reduce((acc,val)=>points[val]+acc,0);
      return result;
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
          let val=evl-mat-89;
          const cp=val*3;
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
            x: x
          };
        })
        .filter(r=>r);
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
            style: { color: '#707070' }
          }
        });
      }

      this.prevType=this.type;
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('extraChart');
      this.logOption('Extra charting', value);
      this.options={
        material:parent.isOptionSet(value,'material'),
        principled:parent.isOptionSet(value,'principled'),
        tension:parent.isOptionSet(value,'tension'),
        smooth:parent.isOptionSet(value,'smooth')
      };
      this.type=this.options.smooth?'spline':'line';
      const lichess=parent.lichess;
      const $=parent.$;
      parent.global.clearInterval(this.interval);
      this.generateCharts();
      if (!value) return;
      this.interval=parent.global.setInterval(this.generateCharts,1000);
    }

  }
  LiChessTools.Tools.ExtraChart=ExtraChartTool;
})();
