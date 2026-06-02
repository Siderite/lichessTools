(() => {
  class AdditionalGlyphsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'additionalGlyphs',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['enabled', 'mate', 'book', 'miss', 'slow', 'novelty'],
        defaultValue: 'enabled,mate,book,miss,slow',
        advanced: true
      }
    ];

    upgrades = [
      { name:'additionalGlyphs', value:'miss', version: '2.4.44', type: 'new' },
      { name:'additionalGlyphs', value:'slow', version: '2.4.202', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.additionalGlyphs': 'Additional glyphs',
        'additionalGlyphs.enabled': 'Enabled',
        'additionalGlyphs.mate': 'Mate',
        'additionalGlyphs.book': 'Book',
        'additionalGlyphs.miss': 'Miss',
        'additionalGlyphs.slow': 'Slow',
        'additionalGlyphs.novelty': 'Novelty'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.additionalGlyphs': 'Simboluri \u00een plus',
        'additionalGlyphs.enabled': 'Activate',
        'additionalGlyphs.mate': 'Mat',
        'additionalGlyphs.book': 'Deschidere',
        'additionalGlyphs.miss': 'Rateu',
        'additionalGlyphs.slow': 'Lent',
        'additionalGlyphs.novelty': 'Noutate'
      }
    }

    isStandardGlyph = (glyph) => {
      const lt = this.lichessTools;
      return ![
        lt.icon.Mate, lt.icon.OpenBook, lt.icon.Hourglass, lt.icon.CyrillicCapitalLetterI,
        lt.icon.CryingFace, lt.icon.SlightlyFrowningFace, lt.icon.NeutralFace, lt.icon.SlightlySmilyingFace, lt.icon.GrinningFaceWithSmilingEyes
      ].includes(glyph);
    }

    updateGlyphs = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const chessground = lt.getChessground();
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const firstGlyph = analysis.node.glyphs?.at(0);
      let orig = analysis.node.uci?.slice(2, 4);
      let redraw = false;
      if (firstGlyph?.type && orig) {
        const existing = $('svg.cg-custom-svgs g').filter((i,g)=>$(g).attr('cgHash')?.includes(','+orig));
        lt.global.requestAnimationFrame(()=>{
          existing.toggleClassSafe('lichessTools-glyphType-'+firstGlyph.type, true);
        });
      }
      let glyph = firstGlyph?.symbol;
      if (this.options.miss && glyph == '??' && analysis.nodeList.length>2) {
        const [cp2,cp1,cp]=analysis.nodeList.slice(-3).map(n=>lt.getCentipawns(n.ceval || n.eval));
        const d1=cp-cp1;
        const d2=cp2-cp1;
        const q = Math.abs(d1-d2)/Math.abs(d1);
        if (q<0.2) {
          const customSvg = chessground?.state?.drawable?.autoShapes?.at(0)?.customSvg;
          let html = customSvg?.html;
          if (html) {
            // keep in sync with https://github.com/lichess-org/lila/blob/1cce0f57a5c91182dba3a8808da081277d6c9c2c/ui/lib/src/game/glyphs.ts#L119
            const missPath = 'M79.4 68q0 1.8-1.4 3.2l-6.7 6.7q-1.4 1.4-3.5 1.4-1.9 0-3.3-1.4L50 63.4 35.5 78q-1.4 1.4-3.3 1.4-2 0-3.5-1.4L22 71.2q-1.4-1.4-1.4-3.3 0-1.7 1.4-3.5L36.5 50 22 35.4Q20.6 34 20.6 32q0-1.7 1.4-3.5l6.7-6.5q1.2-1.4 3.5-1.4 2 0 3.3 1.4L50 36.6 64.5 22q1.2-1.4 3.3-1.4 2.3 0 3.5 1.4l6.7 6.5q1.4 1.8 1.4 3.5 0 2-1.4 3.3L63.5 49.9 78 64.4q1.4 1.8 1.4 3.5z';
            html = html.replace(/\bd="[^"]+"/,'d="'+missPath+'"');
            customSvg.html = html;
            firstGlyph.name='miss';
            redraw = true;
          }
        }
      }
      // fix overlapping glyphs/motifs
      const autoShapes = chessground?.state?.drawable?.autoShapes || [];
      const groups = [...new Set(autoShapes.map(s=>s.orig))].map(k=>autoShapes.filter(s=>s.orig==k)).filter(g=>g.length>1);
      for (const group of groups) {
        for (let i=0; i<group.length; i++) {
          const shape = group[i];
          const m = /matrix\(.4 0 0 .4 (?<x>\d+) -12\)/.exec(shape.customSvg?.html);
          const expected = 71-28*i;
          if (m && +m.groups.x != expected) {
            shape.customSvg.html = shape.customSvg.html.replace(
              m[0],
              `matrix(.4 0 0 .4 ${expected} -12)`
            );
            redraw = true;
          }
        }
      }
      if (redraw) {
        chessground?.state?.dom?.redrawNow();
        analysis.redraw();
      }
    };

    findLongMoves = (times) => {
      if (!times?.length) return [];

      // Copy and sort to calculate quartiles
      const sorted = [...times].sort((a, b) => a - b);
      const n = sorted.length;

      // Q1 (25th percentile) and Q3 (75th percentile)
      const q1Index = Math.floor(n * 0.25);
      const q3Index = Math.floor(n * 0.75);
      const q1 = sorted[q1Index];
      const q3 = sorted[q3Index];

      const iqr = q3 - q1;
      if (iqr === 0) {
        // All values nearly identical, no outliers
        return [];
      }

      // Upper fence for outliers
      const upperFence = q3 + 1.5 * iqr;

      // Find moves above the upper fence
      const longMoves = [];
      for (let i = 0; i < times.length; i++) {
        if (times[i] > upperFence) {
          longMoves.push({
            index: i,
            time: times[i],
            player: i % 2 === 0 ? "white" : "black"
          });
        }
      }

      return longMoves;
    };

    drawGlyphsDirect = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const node = analysis?.node;
      if (!node) return;

      $('body').toggleClassSafe('lichessTools-compOff',!analysis?.showFishnetAnalysis() && !analysis?.cevalEnabled());
      const chessground = lt.getChessground();
      if (!chessground) return;
      const glyphs = node.glyphs || (node.glyphs = []);
      const firstGlyph = glyphs[0];
      let glyph = firstGlyph?.symbol;
      let fill = firstGlyph?.fill || '#557766B0';
      const isMate = lt.isMate(node);
      let name = undefined;
      if (!glyph && this.options.mate && isMate) {
          glyph = lt.icon.Mate;
          //name='mate';
          fill = '#557766B0';
      }
      if (!glyph && this.options.book && node.opening) {
        glyph = lt.icon.OpenBook;
        name='book';
        fill = '#999900BB';
      }
      if (!glyph) {
        this.processSlow(node);
        if (node.isSlow) {
          glyph = lt.icon.Hourglass;
          name='slow';
          fill = '#AA882099';
        }
      }
      if (!glyph) {
        this.processNovelty(node);
        if (node.novelty>0.2) {
          glyph = lt.icon.CyrillicCapitalLetterI;
          name='novelty';
          fill = '#90c290';
        }
      }
      if (!glyph) return;

      const setShape = (shape) => {
        const autoShapes = chessground.state?.drawable?.autoShapes;
        const shapes = autoShapes?.filter(s => s.type !== 'glyph') || [];
        if (shape) shapes.push(shape);
        if (lt.global.JSON.stringify(autoShapes)!=lt.global.JSON.stringify(shapes)) {
          chessground.setAutoShapes(shapes);
          chessground.state.dom.redrawNow();
        }
      };

      if (this.isStandardGlyph(glyph) || lt.storage.get('analyse.show-move-annotation') === false) {
        setShape();
        return;
      }
      let orig = isMate
                   ? this.getSquareOfCheckedKing()
                   : node.uci?.slice(2, 4);
      if (!orig) return;
      if (node.san?.startsWith('O-O')) {
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
      // mate is a special one, no ceval running and already on the move list
      if (name && !glyphs.find(g=>g.symbol==glyph)) {
        glyphs.push({
          symbol: glyph,
          name: name,
          fill: fill,
          type: 'nonStandard'
        });
        analysis.redraw();
      }
    };
    drawGlyphs = this.lichessTools.debounce(this.drawGlyphsDirect, 50);

    processSlow = (node)=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      if (!this.options.slow) return;
      const centi = analysis.data?.game?.moveCentis;
      if (!this.slowMoves && centi) {
        const longMoves = this.findLongMoves(centi);
        this.slowMoves = new Map(longMoves.map(m=>[m.index,m.time]));
      }
      if (node.isSlow === undefined) {
        node.isSlow = analysis.mainline.includes(node) && this.slowMoves?.get(node.ply-1);
      }      
    };

    processNovelty = (node)=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      if (!this.options.novelty) return;

      const index = analysis.nodeList.findIndex(n=>n==node);
      if (index<=0) return;
      const prevNode = analysis.nodeList[index-1];

      const total = item => (item.white||0) + (item.draws||0) + (item.black||0);

      const ply = node.ply;
      const explorerItem = analysis.explorer?.cache[prevNode.fen];
      if (!explorerItem) return;
      const explorerTotal = total(explorerItem);
      if (explorerTotal <= 10) return; // the position has to have more than 10 games

      const moveItem = explorerItem.moves.find(m=>m.uci==node.uci);
      const topItem = explorerItem.moves[0];
      if (!moveItem || !topItem) return;
      const moveTotal = total(moveItem);
      if (moveTotal > 1000) return; // if there are more than 1000 games this is pretty common

      const sigmoid = x => 1 / (1 + Math.exp(-x));
      const getSide = n => (n.fen ? n.fen.includes(' w') : n.ply%2 == 0) ? 1 : -1;
      const getCp = (evl,side) => lt.getCentipawns(evl) * side;

      const topTotal = total(topItem);
      const rarity = 1 - moveTotal/explorerTotal;
      const divergence = 1 - moveTotal/topTotal;
      const depthDiscount = Math.min(1, 1.5-ply/20);
      const moveScore = ((moveItem.white||0) + (moveItem.draws/2||0))/moveTotal;
      const explorerScore = ((explorerItem.white||0) + (explorerItem.draws/2||0))/explorerTotal;

      const side = getSide(node);
      const viability_WDL = sigmoid((moveScore - explorerScore) * 10 * side);
      const cp1 = getCp(lt.getNodeCeval(node),side);
      const cp2 = getCp(lt.getNodeCeval(prevNode),-side);

      let viability;
      if ([cp1,cp2].findIndex(cp=>!cp && cp!==0)>=0) {
        viability = viability_WDL;
      } else {
        const viability_cp = 0.50 * sigmoid(-Math.abs(cp2) / 50)
                           + 0.35 * sigmoid(-Math.abs(cp1) / 75)
                           + 0.15 * sigmoid(-Math.abs(cp1-cp2) / 50);
        viability = 0.7 * viability_cp + 0.3 * viability_WDL;
      }
      const noveltyScore = rarity * divergence * depthDiscount * viability;
      node.novelty = noveltyScore;
    };

    getSquareOfCheckedKing = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const turnColor = analysis.turnColor();
      const square = $('square.check').prop('cgKey') || $('square.king.'+turnColor).prop('cgKey');
      return square;
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('additionalGlyphs');
      this.logOption('Additional glyphs', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      this.options = {
        enabled: lt.isOptionSet(value, 'enabled'),
        mate: lt.isOptionSet(value, 'mate'),
        book: lt.isOptionSet(value, 'book'),
        miss: lt.isOptionSet(value, 'miss'),
        slow: lt.isOptionSet(value, 'slow'),
        novelty: lt.isOptionSet(value, 'novelty')
      };
      const study = analysis.study;
      lt.pubsub.off('lichessTools.redraw', this.drawGlyphs);
      lt.global.clearInterval(this.interval);
      analysis.setAutoShapes = lt.unwrapFunction(analysis.setAutoShapes,'additionalGlyphs');

      const clearShapes = ()=>{
        const chessground = lt.getChessground();
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
          this.drawGlyphsDirect();
          this.updateGlyphs();
        }
      });

      lt.pubsub.on('lichessTools.redraw', this.drawGlyphs);
      if (lt.getChessground()?.state.drawable) {
        this.interval = lt.global.setInterval(() => {
          const chessground = lt.getChessground();
          const drawable = chessground?.state.drawable;
          let same = drawable.autoShapes?.length === this.prevAutoShapes?.length;
          if (same && this.prevAutoShapes?.length) {
            for (let i=0; i<this.prevAutoShapes?.length; i++) {
              if (this.prevAutoShapes[i] !== drawable.autoShapes[i]) {
                same = false;
                break;
              }
            }
            if (!same) {
              same = lt.global.JSON.stringify(drawable.autoShapes) == lt.global.JSON.stringify(this.prevAutoShapes);
            }
          }
          if (!same) {
            this.prevAutoShapes = [ ...drawable.autoShapes ];
            this.drawGlyphs();
          }
        }, 250);
      }
    }

  }
  LiChessTools.Tools.AdditionalGlyphs = AdditionalGlyphsTool;
})();
