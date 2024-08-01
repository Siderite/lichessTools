(()=>{
  class AnalysisWheelTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'analysisWheel',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.analysisWheel': 'Mouse wheel to go through moves'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.analysisWheel': 'Roti\u0163\u0103 mouse merge prin mut\u0103ri'
      }
    }

    bindBoard=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      $('div.main-board').each((i,e)=>{
        if (e.lichessToolsWheel) return;
        $(e).on('wheel',this.mousewheel);
        e.lichessToolsWheel=true;
      });
    };

    deltaY=0;
    mousewheel=(ev)=>{
      ev.preventDefault();
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      const q=$('div.main-board').width()/16;
      this.deltaY+=(ev.deltaY-this.deltaY)*0.2;
      const nr=Math.floor(Math.abs(this.deltaY)/q);
      let path=analysis.path;
      if (this.deltaY<0) {
        const index=Math.max(0,analysis.path.length-nr*2);
        path=analysis.path.slice(0,index);
      } else {
        let node=analysis.node;
        for (let i=0; i<nr; i++) {
          node=node.children?.at(0);
          if (!node) break;
          path+=node.id;
        }
      }
      if (path!=analysis.path) {
        analysis.jump(path);
        this.deltaY=0;
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('analysisWheel');
      this.logOption('Analysis wheel', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      $('div.main-board').off('wheel',this.mousewheel);
      lichess.pubsub.off('lichessTools.redraw',this.bindBoard);
      if (!value) return;
      lichess.pubsub.on('lichessTools.redraw',this.bindBoard);
      this.bindBoard();
    }

  }
  LiChessTools.Tools.AnalysisWheel=AnalysisWheelTool;
})();
