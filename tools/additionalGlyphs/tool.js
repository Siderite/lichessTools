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

    drawGlyphsDirect=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis?.chessground) return;
      const glyph=analysis.node.glyphs?.at(0)?.symbol;
      if (!glyph) return;
      if (['!','?','!!','??','?!','!?'].includes(glyph) || lichess.storage.get('analyse.show-move-annotation')!=='true') {
        const shapes=analysis.chessground.state.drawable.autoShapes?.filter(s=>s.type!=='glyph')||[];
        analysis.chessground.setAutoShapes(shapes);
        return;
      }
      const orig=analysis.node.uci.slice(-2);
      const shapes=analysis.chessground.state.drawable.autoShapes?.filter(s=>s.type!=='glyph')||[];
      shapes.push({
        type:'glyph',
        orig:orig,
        customSvg:`<defs>
    <filter id="shadow">
        <feDropShadow dx="4" dy="7" stdDeviation="5" flood-opacity="0.5"/>
    </filter>
</defs>
<g transform="translate(77 -18) scale(0.4)">
    <circle style="fill:#576;filter:url(#shadow)" cx="50" cy="50" r="50"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="font-size: 6em;font-family: Noto Sans, sans-serif;" fill="#fff">${glyph}</text>
</g>`});
      analysis.chessground.setAutoShapes(shapes);
    };
    drawGlyphs=this.lichessTools.debounce(this.drawGlyphsDirect,250);

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
        study.glyphForm.toggleGlyph=parent.unwrapFunction(study.glyphForm?.toggleGlyph,'additionalGlyphs');
      }
      if (!value) {
        const shapes=analysis.chessground.state.drawable.autoShapes?.filter(s=>s.type!=='glyph')||[];
        analysis.chessground.setAutoShapes(shapes);
        return;
      }
      lichess.pubsub.on('redraw',this.drawGlyphs);
      if (study) {
        study.glyphForm.toggleGlyph=parent.wrapFunction(study.glyphForm.toggleGlyph,{
          id:'additionalGlyphs',
          after:this.drawGlyphs
        });
      }
      this.interval=parent.global.setInterval(()=>{
        const autoShapes=JSON.stringify(analysis.chessground.state.drawable.autoShapes);
        if (autoShapes!=this.prevAutoShapes) {
          this.prevAutoShapes=autoShapes;
          this.drawGlyphs();
        }
      },500);
    }

  }
  LiChessTools.Tools.AdditionalGlyphs=AdditionalGlyphsTool;
})();
