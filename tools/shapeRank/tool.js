(()=>{
  class ShapeRankTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'shapeRank',
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
        'options.shapeRank': 'Show the order of arrows and circles'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.shapeRank': 'Arat\u0103 ordinea s\u0103ge\u0163ilor \u015Fi cercurilor'
      }
    }


    clearRankShapes=(shapes)=>{
      const parent=this.lichessTools;
      parent.arrayRemoveAll(shapes,s=>s.type==='rank');
    };

    ensureShapeRank=()=>{
      const parent=this.lichessTools;
      const shapeRankEnabled=parent.currentOptions.getValue('shapeRank');
      const drawable=this.chessground?.state.drawable;
      if (!drawable) return;

      const reshape=($this,result,shapes)=>{
        this.clearRankShapes(shapes);
        const dict={}
        for (const shape of shapes) {
          const rankShape={
            type: 'rank',
            brush: shape.brush,
            orig: shape.orig,
            customSvg:'<text x="10%" y="50%" font-size="200%" fill="black" stroke="'+shape.brush+'">(RANK)</text>'
          };
          dict[rankShape.orig]=rankShape;
        }
        const drawnShapes = [];
        let rank=0;
        for (const key in dict) {
          rank++;
          const rankShape=dict[key];
          rankShape.customSvg=rankShape.customSvg.replaceAll('(RANK)',rank);
          drawnShapes.push(rankShape);
        }
        if (rank) {
          drawable.shapes=drawnShapes.concat(shapes);
          if (!this.chessground.state.draggable.current) this.chessground.redrawAll();
        }
      };

      if (shapeRankEnabled) {
        if (!parent.isWrappedFunction(drawable.onChange,'shapeRank')) {
          drawable.onChange=parent.wrapFunction(drawable.onChange,{
            id:'shapeRank',
            before:($this,shapes)=>this.clearRankShapes(shapes),
            after:reshape
          });
        } 
        reshape(null,null,drawable.shapes);
      } else {
        drawable.onChange=parent.unwrapFunction(drawable.onChange,'shapeRank');
      } 
    };

    waitForChessground=(value)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      this.chessground=analysis?.chessground || $('div.cg-wrap.lichessTools-boardOverlay')[0]?.chessground;
      if (!this.chessground) {
        parent.global.setTimeout(this.waitForChessground.bind(this),1000);
        return;
      }
      lichess.pubsub.off('shapeRank',this.ensureShapeRank);
      lichess.pubsub.off('redraw',this.ensureShapeRank);
      lichess.pubsub.off('ply',this.ensureShapeRank);
      if (value) {
        lichess.pubsub.on('shapeRank',this.ensureShapeRank);
        lichess.pubsub.on('redraw',this.ensureShapeRank);
        lichess.pubsub.on('ply',this.ensureShapeRank);
        parent.global.setTimeout(this.ensureShapeRank,500); //TODO without the timeout something clears the shapes in about 250ms at first page load (probably a web socket event)
      } else {
        this.clearRankShapes(this.chessground.state.drawable.shapes);
      }
      this.chessground.redrawAll();
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('shapeRank');
      this.logOption('Show the order of arrows and circles', value);
      await this.waitForChessground(value);
    }

  }
  LiChessTools.Tools.ShapeRank=ShapeRankTool;
})();
