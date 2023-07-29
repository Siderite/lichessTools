(()=>{
  class ExtraChartTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'extraChart',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['material','principled','smooth'],
        defaultValue: 'material,principled',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.extraChart': 'Extra analysis charting',
        'extraChart.material': 'Material',
        'extraChart.principled': 'Principled',
        'extraChart.smooth': 'Chart smoothing',
        'chartInfoTitle':'LiChess Tools - extra charting'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.extraChart': 'Grafice de analiz\u0103 \u00een plus',
        'extraChart.material': 'Material',
        'extraChart.principled': 'Principial',
        'extraChart.smooth': 'Netezire grafice',
        'chartInfoTitle':'LiChess Tools - grafice \u00een plus'
      }
    }

    type='line';

    simple_material=node=>{
      const points={
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
          result+=m*p;
        }
      }
      return result;
    };

    evaluator=new LiChessTools.Evaluator();
    material=node=>{
      return this.evaluator.evaluate(node.fen);//*(node.ply%2?-1:1);
    }

    smooth = (points)=>{
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
      return mainline
        .slice(1)
        .map((node,x) => {
          const evl=this.material(node);
          const mat=this.simple_material(node)
          let val=evl-mat;
          const cp=val*5;
          return {
            y: 2 / (1 + Math.exp(-0.004 * cp)) - 1,
            x: x
          };
        })
        .filter(r=>r);
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

      this.prevType=this.type;
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('extraChart');
      this.logOption('Extra charting', value);
      this.options={
        material:parent.isOptionSet(value,'material'),
        principled:parent.isOptionSet(value,'principled'),
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
