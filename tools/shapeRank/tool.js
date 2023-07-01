(()=>{
  class ShapeRankTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'shapeRank',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false
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
      const cg=lichess.analysis?.chessground;
      const drawable=cg?.state.drawable;
      if (!drawable) return;

      const reshape=($this,result,shapes)=>{
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
          cg.redrawAll();
        }
      };

      if (shapeRankEnabled) {
        if (!parent.isWrappedFunction(drawable.onChange)) {
          drawable.onChange=parent.wrapFunction(drawable.onChange,{
            before:($this,shapes)=>this.clearRankShapes(shapes),
            after:reshape
          });
        } 
        //drawable.onChange(drawable.shapes);
        reshape(null,null,drawable.shapes);
        cg.redrawAll();
      } else {
        drawable.onChange=parent.unwrapFunction(drawable.onChange);
      } 
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('shapeRank');
      this.logOption('Show the order of arrows and circles', value);
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      lichess.pubsub.off('redraw',this.ensureShapeRank);
      const cg=analysis?.chessground;
      if (!cg) return;
      if (value) {
        lichess.pubsub.on('redraw',this.ensureShapeRank);
        parent.global.setTimeout(this.ensureShapeRank,500); //TODO without the timeout something clears the shapes in about 250ms at first page load (probably a web socket event)
      } else {
        this.clearRankShapes(cg.state.drawable.shapes);
        cg.redrawAll();
      }
    }

  }
  LiChessTools.Tools.ShapeRank=ShapeRankTool;
})();
