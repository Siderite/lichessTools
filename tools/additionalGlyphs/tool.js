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

    updateGlyphs = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const chessground = lt.getChessground();
      const $ = lt.$;
      const analysis = lichess?.analysis;
      let redraw = false;
      const glyphs = analysis.node.glyphs || [];
      const autoShapes = chessground?.state?.drawable?.autoShapes || [];
      for (const glyph of glyphs.filter(g=>g.fill)) {
        const shape = autoShapes.find(s=>s.label?.text==glyph.symbol);
        if (shape?.label && shape.label.fill != glyph.fill) {
          shape.label.fill = glyph.fill;
          redraw = true;
        }
      }
      if (redraw) {
        chessground?.state?.dom?.redrawNow();
        //analysis.redraw();
      }
    };

    restackGlyphs = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const glyphs = $('svg.cg-custom-svgs g[transform^="translate"]');
      this.processElements(glyphs.get(),(el)=>{
        let transform = el.getAttribute('transform');
        const m = /translate\((?<x>[-]?\d+(?:\.\d+)?),(?<y>[-]?\d+(?:\.\d+)?)\)/.exec(transform);
        if (!m) return false;
        const x = +m.groups.x + 0.3;
        transform = transform.slice(0,m.index)+'translate('+x+','+m.groups.y+')'+transform.slice(m.index+m[0].length);
        el.setAttribute('transform',transform);
      });
    };

    processElements = (elements, adjustFn) => {

      function rectsOverlapPercentage(rectA, rectB) {
        const interLeft = Math.max(rectA.left, rectB.left);
        const interTop = Math.max(rectA.top, rectB.top);
        const interRight = Math.min(rectA.right, rectB.right);
        const interBottom = Math.min(rectA.bottom, rectB.bottom);
      
        if (interLeft >= interRight || interTop >= interBottom) {
          return 0;
        }
      
        const interArea = (interRight - interLeft) * (interBottom - interTop);
        const areaB = rectB.width * rectB.height;
      
        return interArea / areaB;
      }

      const rects = [];

      for (const element of elements) {
        let attempts = 0;
        const maxAttempts = 50;
    
        while (attempts < maxAttempts) {
          const elementRect = element.getBoundingClientRect();
    
          const overlap = rects.find(r=>rectsOverlapPercentage(r, elementRect)>0.8);

          if (overlap) {
            const result = adjustFn(element);
            if (result === false) break;
            attempts++;
          } else {
            rects.push(elementRect);
            break;
          }
        }

        if (attempts >= maxAttempts) {
          console.warn("Max adjustment attempts reached for element");
        }
      }
    }

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

      const showStaticAnalysis = analysis?.settings?.showStaticAnalysis;
      $('body').toggleClassSafe('lichessTools-compOff',!showStaticAnalysis && !analysis?.cevalEnabled());
      const chessground = lt.getChessground();
      if (!chessground) return;
      const glyphs = node.glyphs || (node.glyphs = []);
      const symbols = glyphs.map(g=>g.symbol).filter(s=>!!s);
      const newGlyphs = [];
      const isMate = lt.isMate(node);
      let name = undefined;
      if (this.options.mate && isMate && !symbols.find(s=>s==lt.icon.Mate)) {
        newGlyphs.push({
          glyph: lt.icon.Mate,
          fill: '#557766B0'
        });
      }
      if (this.options.book && node.opening && !symbols.find(s=>s==lt.icon.OpenBook)) {
        newGlyphs.push({
          glyph: lt.icon.OpenBook,
          name: 'book',
          fill: '#999900BB'
        });
      }
      if (this.options.slow && !symbols.find(s=>s==lt.icon.Hourglass)) {
        this.processSlow(node);
        if (node.isSlow) {
          newGlyphs.push({
            glyph: lt.icon.Hourglass,
            name: 'slow',
            fill: '#AA882099'
          });
        }
      }
      if (this.options.novelty && !symbols.find(s=>s==lt.icon.CyrillicCapitalLetterI)) {
        this.processNovelty(node);
        if (node.novelty>0.25) {
          newGlyphs.push({
            glyph: lt.icon.CyrillicCapitalLetterI,
            name: 'novelty',
            fill: '#90c290'
          });
        }
      }
      if (this.options.miss && !symbols.find(s=>s=='X')) {
        const [cp2,cp1,cp]=analysis.nodeList.slice(-3).map(n=>lt.getCentipawns(n.ceval || n.eval));
        const d1=cp-cp1;
        const d2=cp2-cp1;
        const q = Math.abs(d1-d2)/Math.abs(d1);
        if (q<0.2) {
          const w = lt.winPerc(cp);
          const w1 = lt.winPerc(cp1);
          const side = node.ply % 2 == 0 ? -1 : 1;
          const badMove = (w - w1) * side < -20	;
          if (badMove) { 
            newGlyphs.push({
              glyph: 'X',
              name: 'miss',
              fill: '#df5353'
            });
          }
        }
      }
      if (!newGlyphs.length) return;

      const setShapes = (shapes) => {
        const autoShapes = chessground.state?.drawable?.autoShapes;
        const existing = autoShapes?.filter(s => s.type !== 'glyph') || [];
        if (shapes?.length) existing.push(...shapes);
        if (lt.global.JSON.stringify(autoShapes)!=lt.global.JSON.stringify(existing)) {
          chessground.setAutoShapes(existing);
          chessground.state.dom.redrawNow();
        }
      };

      if (lt.storage.get('analyse.show-move-annotation') === false) {
        setShapes();
        return;
      }
      const shapes = [];
      let redraw = false;
      for (const newGlyph of newGlyphs) {
        let orig = newGlyph.glyph == lt.icon.Mate
                   ? this.getSquareOfCheckedKing()
                   : node.uci?.slice(2, 4);
        if (!orig) continue;
        if (node.san?.startsWith('O-O')) {
          switch (orig) {
            case 'a1': orig='c1'; break;
            case 'h1': orig='g1'; break;
            case 'a8': orig='c8'; break;
            case 'h8': orig='g8'; break;
          }
        }
        shapes.push({
          type: 'glyph',
          orig: orig,
          label: {
            fill: newGlyph.fill,
            text: newGlyph.glyph
          }
        });
 
        // mate is a special one, no ceval running and already on the move list
        if (newGlyph.name) {
          glyphs.push({
            symbol: newGlyph.glyph,
            name: newGlyph.name,
            fill: newGlyph.fill,
            type: 'nonStandard'
          });
          redraw = true;
        }
      }
      setShapes(shapes);
      if (redraw) {
        lt.analysisRedraw();
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
      if (moveTotal > 100) return; // if there are more than 100 games this is pretty common

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
      const square = $('square.check').filter((i,e)=>e.getBoundingClientRect().width).prop('cgKey');
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
            this.restackGlyphs();
          }
        }, 250);
      }
    }

  }
  LiChessTools.Tools.AdditionalGlyphs = AdditionalGlyphsTool;
})();
