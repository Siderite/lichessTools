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
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis?.chessground) return;
      let glyph = analysis.node.glyphs?.at(0)?.symbol;
      const fill = analysis.node.glyphs?.at(0)?.fill || '#557766';
      if (!glyph && lt.isMate(analysis.node)) glyph = '#';
      if (!glyph) return;
      if (this.isStandardGlyph(glyph) || lt.storage.get('analyse.show-move-annotation') === false) {
        const shapes = analysis.chessground.state.drawable.autoShapes?.filter(s => s.type !== 'glyph') || [];
        analysis.chessground.setAutoShapes(shapes);
        return;
      }
      let orig = analysis.node.uci.slice(2, 4);
      if (analysis.node.san?.startsWith('O-O')) {
        switch (orig) {
          case 'a1': orig='c1'; break;
          case 'h1': orig='g1'; break;
          case 'a8': orig='c8'; break;
          case 'h8': orig='g8'; break;
        }
      }
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
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('additionalGlyphs');
      this.logOption('Aditional glyphs', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const study = analysis.study;
      lt.pubsub.off('lichessTools.redraw', this.drawGlyphs);
      lt.global.clearInterval(this.interval);
      if (study) {
        if (lichess.socket) {
          lichess.socket.handle = lt.unwrapFunction(lichess.socket.handle, 'additionalGlyphs');
        }
      }
      if (!value) {
        if (analysis.chessground) {
          const shapes = analysis.chessground.state.drawable.autoShapes?.filter(s => s.type !== 'glyph') || [];
          analysis.chessground.setAutoShapes(shapes);
        }
        return;
      }
      lt.pubsub.on('lichessTools.redraw', this.drawGlyphs);
      if (study) {
        if (lichess.socket) {
          lichess.socket.handle = lt.wrapFunction(lichess.socket.handle, {
            id: 'additionalGlyphs',
            after: ($this, result, m) => {
              if (m.t == 'glyphs') this.drawGlyphs();
            }
          });
        }
      }
      this.interval = lt.global.setInterval(() => {
        const autoShapes = lt.global.JSON.stringify(analysis.chessground?.state.drawable.autoShapes);
        if (autoShapes != this.prevAutoShapes) {
          this.prevAutoShapes = autoShapes;
          this.drawGlyphsDirect();
        }
      }, 100);
    }

  }
  LiChessTools.Tools.AdditionalGlyphs = AdditionalGlyphsTool;
})();
