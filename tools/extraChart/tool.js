(()=>{
  class ExtraChartTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'extraChart',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['material','freedom','control','bril'],
        defaultValue: 'material,freedom,control,bril'
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.extraChart': 'Extra analysis charting',
        'extraChart.material': 'Material',
        'extraChart.freedom': 'Freedom',
        'extraChart.control': 'Control',
        'extraChart.bril': '?'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.extraChart': 'Grafice de analiz\u0103 \u00een plus',
        'extraChart.material': 'Material',
        'extraChart.freedom': 'Libertate',
        'extraChart.control': 'Control',
        'extraChart.bril': '?'
      }
    }

    type='line';

    material=node=>{
      const points={
        'q':9,
        'r':5,
        'b':3,
        'n':3,
        'p':1
      };
      let result=0;
      if (!node.fen) return result;
      const board=node.fen.split(' ')[0];
      for (const ch of board) {
        const p=points[ch.toLowerCase()];
        if (p) {
          const m=ch===ch.toUpperCase()?1:-1;
          result+=m*p;
        }
      }
      return result;
    };

    getControlBoard=()=>{
      const result=[];
      for (let i=0; i<8; i++) result.push(Array(8).fill(0));
      return result;
    };

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

    pieceFreedom=(ch,x,y,board,control)=>{
      const m=ch===ch.toUpperCase()?1:-1;
      let result=0;
      switch(ch.toLowerCase()) {
        case 'k':
          for (let dx=-1; dx<=1; dx++) {
            for (let dy=-1; dy<=1; dy++) {
              if (!dx&&!dy) continue;
              if (!this.onBoard(x+dx,y+dy)) continue;
              control[y+dy][x+dx]+=m;
              if (!board[y+dy][x+dx]) result++;
            }
          }
          break;
        case 'q':
          for (let dx=-1; dx<=1; dx++) {
            for (let dy=-1; dy<=1; dy++) {
              if (!dx&&!dy) continue;
              for (let i=1; i<8; i++) {
                if (!this.onBoard(x+dx*i,y+dy*i)) break;
                control[y+dy*i][x+dx*i]+=m;
                if (!board[y+dy*i][x+dx*i]) result++;
                  else break;
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
                control[y+dy*i][x+dx*i]+=m;
                if (!board[y+dy*i][x+dx*i]) result++;
                  else break;
              }
            }
          }
          break;
        case 'b':
          for (let dx=-1; dx<=1; dx++) {
            for (let dy=-1; dy<=1; dy++) {
              if (!dx||!dy) continue;
              for (let i=1; i<8; i++) {
                if (!this.onBoard(x+dx*i,y+dy*i)) break;;
                control[y+dy*i][x+dx*i]+=m;
                if (!board[y+dy*i][x+dx*i]) result++;
                  else break;
              }
            }
          }
          break;
        case 'n':
          for (let dx=-1; dx<=1; dx++) {
            for (let dy=-1; dy<=1; dy++) {
              if (!dx||!dy) continue;
              if (this.onBoard(x+dx*1,y+dy*2)&&!board[y+dy*2][x+dx*1]) {
                control[y+dy*2][x+dx*1]+=m;
                result++;
              }
              if (this.onBoard(x+dx*2,y+dy*1)&&!board[y+dy*1][x+dx*2]) {
                control[y+dy*1][x+dx*2]+=m;
                result++;
              }
            }
          }
          break;
        case 'p':
          if (this.onBoard(x,y-m)&&!board[y-m][x]) result++;
          if (this.onBoard(x-1,y-m)&&!board[y-m][x-1]) control[y-m][x-1]+=m;
          if (this.onBoard(x+1,y-m)&&!board[y-m][x+1]) control[y-m][x+1]+=m;
          break;
      }
      return m*result;
    };

    freedom=node=>{
      const board=this.getBoard(node.fen);
      const control=this.getControlBoard();
      let result=0;
      for (let y=0; y<8; y++) {
        for (let x=0; x<8; x++) {
          const ch=board[y][x];
          if (!ch) continue;
          result+=this.pieceFreedom(ch,x,y,board,control);
        }
      }
      let ctrl=0;
      for (let y=0; y<8; y++) {
        for (let x=0; x<8; x++) {
          ctrl+=Math.sign(control[y][x]);
        }
      }
      return { freedom: result, control: ctrl };
    };

    getMaterialData = (mainline) => {
      return mainline
        .slice(1)
        .map(node => {
          let cp=this.material(node)*100;
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
          };
        });
    };

    getFreedomData = (mainline) => {
      return mainline
        .slice(1)
        .map(node => {
          let cp=this.freedom(node).freedom*20;
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
          };
        });
    };

    getControlData = (mainline) => {
      return mainline
        .slice(1)
        .map(node => {
          let cp=this.freedom(node).control*30;
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
          };
        });
      };


    getBrilData = (mainline) => {
      let prev=0;
      return mainline
        .slice(1)
        .map((node,i) => {
          let val=this.freedom(node);
          let cp=(node.eval?.cp||0)-(val.control*30+val.freedom*20+this.material(node)*100)/3;
          if (!node.eval || node.eval.mate || (cp-prev>0 && node.ply%2==0) || (cp-prev<0 && node.ply%2==1)) {
            prev=cp;
            return;
          }
          prev=cp;
          return {
            x: i,
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
          };
        })
        .filter(p=>p);
      };


    generateCharts=()=>{

      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (!lichess.analysis) return;
      if (!lichess.analysis.tree.root.eval) return;
      const Highcharts=parent.global?.Highcharts;
      if (!Highcharts) return;

      const chart=Highcharts.charts.find(c=>$(c.renderTo).is('#acpl-chart,.study__server-eval')&&$(c.renderTo).offset().left);
      if (!chart) return;

      let existing = chart.series.find(s=>s.name==='Material');
      if (existing && !this.options.material) existing.remove();
      if (!existing && this.options.material) {
        chart.addSeries({
          name: 'Material',
          styledMode: true,
          type: this.type,
          data: this.getMaterialData(lichess.analysis.mainline),
          enableMouseTracking: false,
          marker: {
            enabled: false
          }
        });
      }

      existing = chart.series.find(s=>s.name==='Freedom');
      if (existing && !this.options.freedom) existing.remove();
      if (!existing && this.options.freedom) {
        chart.addSeries({
          name: 'Freedom',
          styledMode: true,
          type: this.type,
          data: this.getFreedomData(lichess.analysis.mainline),
          enableMouseTracking: false,
          marker: {
            enabled: false
          }
        });
      }

      existing = chart.series.find(s=>s.name==='Control');
      if (existing && !this.options.control) existing.remove();
      if (!existing && this.options.control) {
        chart.addSeries({
          name: 'Control',
          styledMode: true,
          type: this.type,
          data: this.getControlData(lichess.analysis.mainline),
          enableMouseTracking: false,
          marker: {
            enabled: false
          }
        });
      }

      existing = chart.series.find(s=>s.name==='Bril');
      if (existing && !this.options.bril) existing.remove();
      if (!existing && this.options.bril) {
        chart.addSeries({
          name: 'Bril',
          styledMode: true,
          type: this.type,
          data: this.getBrilData(lichess.analysis.mainline),
          enableMouseTracking: false,
          marker: {
            enabled: false
          }
        });
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('extraChart');
      this.logOption('Extra charting', value);
      this.options={
        material:parent.isOptionSet(value,'material'),
        freedom:parent.isOptionSet(value,'freedom'),
        control:parent.isOptionSet(value,'control'),
        bril:parent.isOptionSet(value,'bril'),
      };
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
