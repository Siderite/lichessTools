(()=>{
  class AdditionalGlyphsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'additionalGlyphs',
        category: 'study',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.additionalGlyphs': 'Additional glyphs'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.additionalGlyphs': 'Simboluri \u00een plus'
      }
    }

    isStandardGlyph=(glyph)=>{
      if (!this.standardGlyphs) return glyph!='#';
      for (const key in this.standardGlyphs) {
        if (this.standardGlyphs[key].find(g=>g.symbol==glyph)) return true;
      }
      return false;
    }

    drawGlyphsDirect=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis?.chessground) return;
      let glyph=analysis.node.glyphs?.at(0)?.symbol;
      if (!glyph && parent.isMate(analysis.node)) glyph='#';
      if (!glyph) return;
      if (this.isStandardGlyph(glyph) || lichess.storage.get('analyse.show-move-annotation')==='false') {
        const shapes=analysis.chessground.state.drawable.autoShapes?.filter(s=>s.type!=='glyph')||[];
        analysis.chessground.setAutoShapes(shapes);
        return;
      }
      const orig=analysis.node.uci.slice(2,4);
      const shapes=analysis.chessground.state.drawable.autoShapes?.filter(s=>s.type!=='glyph')||[];
      
      shapes.push({
        type:'glyph',
        orig:orig,
        label:{
          fill: '#557766',
          text: glyph
        }
      });
      analysis.chessground.setAutoShapes(shapes);
    };
    drawGlyphs=this.lichessTools.debounce(this.drawGlyphsDirect,50);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('additionalGlyphs');
      this.logOption('Aditional glyphs', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const study=analysis.study;
      lichess.pubsub.off('redraw',this.drawGlyphs);
      parent.global.clearInterval(this.interval);
      if (study) {
        if (lichess.socket) {
          lichess.socket.handle=parent.unwrapFunction(lichess.socket.handle,'additionalGlyphs');
        }
      }
      if (!value) {
        const shapes=analysis.chessground.state.drawable.autoShapes?.filter(s=>s.type!=='glyph')||[];
        analysis.chessground.setAutoShapes(shapes);
        return;
      }
      // TODO remove standardGlyphs logic after making sure lichess renders glyphs natively
      /*if (!this.standardGlyphs) {
        this.standardGlyphs=JSON.parse(await lichessTools.net.fetch(lichess.assetUrl('glyphs.json')));
      }*/
      lichess.pubsub.on('redraw',this.drawGlyphs);
      if (study) {
        if (lichess.socket) {
          lichess.socket.handle=parent.wrapFunction(lichess.socket.handle,{
            id:'additionalGlyphs',
            after:($this,result,m)=>{
              if (m.t=='glyphs') this.drawGlyphs();
            }
          });
        }
      }
      this.interval=parent.global.setInterval(()=>{
        const autoShapes=parent.global.JSON.stringify(analysis.chessground?.state.drawable.autoShapes);
        if (autoShapes!=this.prevAutoShapes) {
          this.prevAutoShapes=autoShapes;
          this.drawGlyphsDirect();
        }
      },100);
    }

  }
  LiChessTools.Tools.AdditionalGlyphs=AdditionalGlyphsTool;
})();
