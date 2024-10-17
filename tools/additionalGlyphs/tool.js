(() => {
  class AdditionalGlyphsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'additionalGlyphs',
        category: 'study',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.additionalGlyphs': 'Additional glyphs'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.additionalGlyphs': 'Simboluri \u00een plus'
      }
    }

    isStandardGlyph = (glyph) => {
      return !['#', '\uD83D\uDE10', '\uD83D\uDE22', '\uD83D\uDE41', '\uD83D\uDE10', '\uD83D\uDE42', '\uD83D\uDE01'].includes(glyph);
    }

    drawGlyphsDirect = () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis?.chessground) return;
      let glyph = analysis.node.glyphs?.at(0)?.symbol;
      const fill = analysis.node.glyphs?.at(0)?.fill || '#557766';
      if (!glyph && parent.isMate(analysis.node)) glyph = '#';
      if (!glyph) return;
      if (this.isStandardGlyph(glyph) || parent.storage.get('analyse.show-move-annotation') === false) {
        const shapes = analysis.chessground.state.drawable.autoShapes?.filter(s => s.type !== 'glyph') || [];
        analysis.chessground.setAutoShapes(shapes);
        return;
      }
      const orig = analysis.node.uci.slice(2, 4);
      const shapes = analysis.chessground.state.drawable.autoShapes?.filter(s => s.type !== 'glyph') || [];
      shapes.push({
        type: 'glyph',
        orig: orig,
        label: {
          fill: fill,
          text: glyph
        }
      });
      analysis.chessground.setAutoShapes(shapes);
      const existing = $('svg.cg-custom-svgs g').filter(g=>$(g).attr('cgHash')?.includes(','+orig));
      $('circle',existing).attr('fill',fill);
    };
    drawGlyphs = this.lichessTools.debounce(this.drawGlyphsDirect, 50);

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('additionalGlyphs');
      this.logOption('Aditional glyphs', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const study = analysis.study;
      lichess.pubsub.off('lichessTools.redraw', this.drawGlyphs);
      parent.global.clearInterval(this.interval);
      if (study) {
        if (lichess.socket) {
          lichess.socket.handle = parent.unwrapFunction(lichess.socket.handle, 'additionalGlyphs');
        }
      }
      if (!value) {
        if (analysis.chessground) {
          const shapes = analysis.chessground.state.drawable.autoShapes?.filter(s => s.type !== 'glyph') || [];
          analysis.chessground.setAutoShapes(shapes);
        }
        return;
      }
      lichess.pubsub.on('lichessTools.redraw', this.drawGlyphs);
      if (study) {
        if (lichess.socket) {
          lichess.socket.handle = parent.wrapFunction(lichess.socket.handle, {
            id: 'additionalGlyphs',
            after: ($this, result, m) => {
              if (m.t == 'glyphs') this.drawGlyphs();
            }
          });
        }
      }
      this.interval = parent.global.setInterval(() => {
        const autoShapes = parent.global.JSON.stringify(analysis.chessground?.state.drawable.autoShapes);
        if (autoShapes != this.prevAutoShapes) {
          this.prevAutoShapes = autoShapes;
          this.drawGlyphsDirect();
        }
      }, 100);
    }

  }
  LiChessTools.Tools.AdditionalGlyphs = AdditionalGlyphsTool;
})();
