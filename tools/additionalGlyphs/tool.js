(() => {
  class AdditionalGlyphsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'additionalGlyphs',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['enabled','mate', 'book', 'miss'],
        defaultValue: 'enabled,mate,book,miss',
        advanced: true
      }
    ];

    upgrades = [
      { name:'additionalGlyphs', value:'miss', version: '2.4.44', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.additionalGlyphs': 'Additional glyphs',
        'additionalGlyphs.enabled': 'Enabled',
        'additionalGlyphs.mate': 'Mate',
        'additionalGlyphs.book': 'Book',
        'additionalGlyphs.miss': 'Miss'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.additionalGlyphs': 'Simboluri \u00een plus',
        'additionalGlyphs.enabled': 'Activate',
        'additionalGlyphs.mate': 'Mat',
        'additionalGlyphs.book': 'Deschidere',
        'additionalGlyphs.miss': 'Rateu'
      }
    }

    isStandardGlyph = (glyph) => {
      const lt = this.lichessTools;
      return ![lt.icon.Mate, lt.icon.OpenBook, lt.icon.CryingFace, lt.icon.SlightlyFrowningFace, lt.icon.NeutralFace, lt.icon.SlightlySmilyingFace, lt.icon.GrinningFaceWithSmilingEyes].includes(glyph);
    }

    updateGlyphs = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      const firstGlyph = analysis.node.glyphs?.at(0);
      let glyph = firstGlyph?.symbol;
      if (glyph == '??' && this.options.miss && analysis.nodeList.length>2) {
        const [cp2,cp1,cp]=analysis.nodeList.slice(-3).map(n=>lt.getCentipawns(n.ceval || n.eval));
        const d1=cp-cp1;
        const d2=cp2-cp1;
        const q = Math.abs(d1-d2)/Math.abs(d1);
        if (q<0.2) {
          const customSvg = analysis.chessground?.state?.drawable?.autoShapes?.at(0)?.customSvg;
          let html = customSvg?.html;
          if (html) {
            // keep in sync with https://github.com/lichess-org/lila/blob/270b724f02f78cdd0a1908c9359b294503d2899e/ui/lib/src/game/glyphs.ts#L80C27-L80C372
            const missPath = 'M79.4 68q0 1.8-1.4 3.2l-6.7 6.7q-1.4 1.4-3.5 1.4-1.9 0-3.3-1.4L50 63.4 35.5 78q-1.4 1.4-3.3 1.4-2 0-3.5-1.4L22 71.2q-1.4-1.4-1.4-3.3 0-1.7 1.4-3.5L36.5 50 22 35.4Q20.6 34 20.6 32q0-1.7 1.4-3.5l6.7-6.5q1.2-1.4 3.5-1.4 2 0 3.3 1.4L50 36.6 64.5 22q1.2-1.4 3.3-1.4 2.3 0 3.5 1.4l6.7 6.5q1.4 1.8 1.4 3.5 0 2-1.4 3.3L63.5 49.9 78 64.4q1.4 1.8 1.4 3.5z';
            html = html.replace(/\bd="[^"]+"/,'d="'+missPath+'"');
            customSvg.html = html;
          }
        }
      }
    };

    drawGlyphsDirect = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const chessground = analysis?.chessground;
      if (!chessground) return;
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

      const setShape = (shape) => {
        const autoShapes = chessground.state?.drawable?.autoShapes;
        const shapes = autoShapes?.filter(s => s.type !== 'glyph') || [];
        if (shape) shapes.push(shape);
        if (lt.global.JSON.stringify(autoShapes)!=lt.global.JSON.stringify(shapes)) {
          chessground.setAutoShapes(shapes);
        }
      };

      if (this.isStandardGlyph(glyph) || lt.storage.get('analyse.show-move-annotation') === false) {
        setShape();
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
      setShape({
        type: 'glyph',
        orig: orig,
        label: {
          fill: fill,
          text: glyph
        }
      });
      const existing = $('svg.cg-custom-svgs g').filter(g=>$(g).attr('cgHash')?.includes(','+orig));
      $('circle',existing).attrSafe('fill',fill);
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
        book: lt.isOptionSet(value, 'book'),
        miss: lt.isOptionSet(value, 'miss')
      };
      const study = analysis.study;
      lt.pubsub.off('lichessTools.redraw', this.drawGlyphs);
      lt.global.clearInterval(this.interval);
      analysis.setAutoShapes = lt.unwrapFunction(analysis.setAutoShapes,'additionalGlyphs');

      const clearShapes = ()=>{
        const chessground = analysis.chessground;
        if (!chessground) return;
        const autoShapes = chessground.state?.drawable?.autoShapes;
        const shapes = autoShapes?.filter(s => s.type !== 'glyph') || [];
        if (lt.global.JSON.stringify(autoShapes)!=lt.global.JSON.stringify(shapes)) {
          chessground.setAutoShapes(shapes);
        }
      };

      if (!this.options.enabled) {
        clearShapes();
        return;
      }

      analysis.setAutoShapes = lt.wrapFunction(analysis.setAutoShapes,{
        id: 'additionalGlyphs',
        before: ($this,...args)=>{
          this.drawGlyphsDirect();
        },
        after: ($this, result, ...args)=>{
          this.updateGlyphs();
        }
      });

      lt.pubsub.on('lichessTools.redraw', this.drawGlyphs);
      if (analysis.chessground?.state.drawable) {
        this.interval = lt.global.setInterval(() => {
          const drawable = analysis.chessground?.state.drawable;
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
