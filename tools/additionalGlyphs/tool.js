(() => {
  class AdditionalGlyphsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'additionalGlyphs',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['enabled','mate', 'book'],
        defaultValue: 'enabled,mate,book',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.additionalGlyphs': 'Additional glyphs',
        'additionalGlyphs.enabled': 'Enabled',
        'additionalGlyphs.mate': 'Mate',
        'additionalGlyphs.book': 'Book'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.additionalGlyphs': 'Simboluri \u00een plus',
        'additionalGlyphs.enabled': 'Activate',
        'additionalGlyphs.mate': 'Mat',
        'additionalGlyphs.book': 'Deschidere'
      }
    }

    isStandardGlyph = (glyph) => {
      const lt = this.lichessTools;
      return ![lt.icon.Mate, lt.icon.Book, lt.icon.CryingFace, lt.icon.SlightlyFrowningFace, lt.icon.NeutralFace, lt.icon.SlightlySmilyingFace, lt.icon.GrinningFaceWithSmilingEyes].includes(glyph);
    }

    drawGlyphsDirect = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis?.chessground) return;
      let glyph = analysis.node.glyphs?.at(0)?.symbol;
      let fill = analysis.node.glyphs?.at(0)?.fill || '#557766B0';
      if (!glyph) {
        if (this.options.mate && lt.isMate(analysis.node)) {
          glyph = lt.icon.Mate;
          fill = '#557766B0';
        } else
        if (this.options.book && analysis.node.opening) {
          glyph = lt.icon.Book;
          fill = '#999933B0';
        }
      }
      if (!glyph) return;
      if (this.isStandardGlyph(glyph) || lt.storage.get('analyse.show-move-annotation') === false) {
        const shapes = analysis.chessground.state.drawable.autoShapes?.filter(s => s.type !== 'glyph') || [];
        analysis.chessground.setAutoShapes(shapes);
        return;
      }
      let orig = analysis.node.uci?.slice(2, 4);
      if (!orig) return;
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
      this.options = {
        enabled: lt.isOptionSet(value, 'enabled'),
        mate: lt.isOptionSet(value, 'mate'),
        book: lt.isOptionSet(value, 'book')
      };
      const study = analysis.study;
      lt.pubsub.off('lichessTools.redraw', this.drawGlyphs);
      lt.global.clearInterval(this.interval);
      if (!this.options.enabled) {
        if (analysis.chessground) {
          const shapes = analysis.chessground.state.drawable.autoShapes?.filter(s => s.type !== 'glyph') || [];
          analysis.chessground.setAutoShapes(shapes);
        }
        return;
      }
      // TODO confirm there is no need to handle the 'glyphs' socket message
      lt.pubsub.on('lichessTools.redraw', this.drawGlyphs);
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
