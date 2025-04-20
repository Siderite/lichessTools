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
      return ![lt.icon.Mate, lt.icon.OpenBook, lt.icon.CryingFace, lt.icon.SlightlyFrowningFace, lt.icon.NeutralFace, lt.icon.SlightlySmilyingFace, lt.icon.GrinningFaceWithSmilingEyes].includes(glyph);
    }

    drawGlyphsDirect = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis?.chessground) return;
      const firstGlyph = analysis.node.glyphs?.at(0);
      let glyph = firstGlyph?.symbol;
      let fill = firstGlyph?.fill || '#557766B0';
      if (!glyph) {
        if (this.options.mate && lt.isMate(analysis.node)) {
          glyph = lt.icon.Mate;
          fill = '#557766B0';
        } else
        if (this.options.book && analysis.node.opening) {
          glyph = lt.icon.OpenBook;
          fill = '#999900BB';
        }
      }
      if (!glyph) return;
      if (this.isStandardGlyph(glyph) || lt.storage.get('analyse.show-move-annotation') === false) {
        const autoShapes = analysis.chessground.state.drawable.autoShapes;
        const shapes = autoShapes?.filter(s => s.type !== 'glyph') || [];
        if (shapes?.length !== autoShapes?.length) {
          analysis.chessground.setAutoShapes(shapes);
        }
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
      const drawable = analysis.chessground?.state.drawable;
      if (drawable) {
        this.interval = lt.global.setInterval(() => {
          let same = drawable.autoShapes?.length === this.prevAutoShapes?.length;
          if (same && this.prevAutoShapes?.length) {
            for (let i=0; i<this.prevAutoShapes?.length; i++) {
              if (this.prevAutoShapes[i] !== drawable.autoShapes[i]) {
                same = false;
                break;
              }
            }
          }
          if (!same) {
            this.prevAutoShapes = [ ...drawable.autoShapes ];
            this.drawGlyphsDirect();
          }
        }, 250);
      }
    }

  }
  LiChessTools.Tools.AdditionalGlyphs = AdditionalGlyphsTool;
})();
