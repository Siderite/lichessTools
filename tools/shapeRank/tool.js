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
      const analysis=parent.lichess.analysis;
      this.chessground=analysis?.chessground || $('div.cg-wrap.lichessTools-boardOverlay')[0]?.chessground;
      const drawable=this.chessground?.state.drawable;
      if (!drawable) return;

      const reshape=($this,result,shapes)=>{
        this.clearRankShapes(shapes);
        if (!this.options.enabled) return;
        const dict={}
        const drawnShapes = [];
        let rank=0;
        for (const shape of shapes) {
          if (dict[shape.orig]) continue;
          rank++;
          const rankShape={
            type: 'rank',
            orig: shape.orig,
            dest: false, // fix lichess bug where this is found as the shape to erase
            customSvg:parent.makeSvg('<text x="10%" y="50%" font-size="200%" fill="black" stroke="'+shape.brush+'">'+rank+'</text>',this.chessground)
          };
          dict[rankShape.orig]=true;
          drawnShapes.push(rankShape);
        }
        if (rank) {
          drawable.shapes=drawnShapes.concat(shapes);
          if (!this.chessground.state.draggable.current) this.chessground.redrawAll();
        }
      };

      if (this.options.enabled) {
        if (!parent.isWrappedFunction(drawable.onChange,'shapeRank')) {
          drawable.onChange=parent.wrapFunction(drawable.onChange,{
            id:'shapeRank',
            before:($this,shapes)=>this.clearRankShapes(shapes),
            after:reshape
          });
        } 
        reshape(null,null,[...drawable.shapes]);
      } else {
        drawable.onChange=parent.unwrapFunction(drawable.onChange,'shapeRank');
      } 
    };

    waitForChessground=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      this.chessground=analysis?.chessground || $('div.cg-wrap.lichessTools-boardOverlay')[0]?.chessground;
      if (!this.chessground) {
        parent.global.setTimeout(this.waitForChessground,500);
        return;
      }
      lichess.pubsub.off('shapeRank',this.ensureShapeRank);
      lichess.pubsub.off('redraw',this.ensureShapeRank);
      if (this.options.enabled) {
        lichess.pubsub.on('shapeRank',this.ensureShapeRank);
        lichess.pubsub.on('redraw',this.ensureShapeRank);
        parent.global.setTimeout(this.ensureShapeRank,500); //TODO without the timeout something clears the shapes in about 250ms at first page load (probably a web socket event)
      } else {
        this.clearRankShapes(this.chessground.state.drawable.shapes);
      }
      this.chessground.redrawAll();
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('shapeRank');
      this.options={ enabled: value };
      this.logOption('Show the order of arrows and circles', value);
      await this.waitForChessground(value);
    }

  }
  LiChessTools.Tools.ShapeRank=ShapeRankTool;
})();
