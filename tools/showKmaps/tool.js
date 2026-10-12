(() => {
  class ShowKmapsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitContentLoaded'];

    preferences = [
      {
        name: 'showKmaps',
        category: 'general',
        type: 'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.showKmaps': 'Show K-MAPS',
        'kmapsTitle': `LiChess Tools - K-MAPS
  King safety: $K
  Material: $M
  Activity: $A
  Pawn structure: $P
  Space: $S`
      },
      'ro-RO': {
        'options.general': 'General',
        'options.showKmaps': 'Arat\u0103 K-MAPS',
        'kmapsTitle': `LiChess Tools - K-MAPS
  Siguran\u0163\u0103 rege: $K
  Material: $M
  Activitate: $A
  Structur\u0103 pioni: $P
  Spa\u0163iu: $S`
      }
    }

    getKmaps = async (fen, isBlack) => {
      const lt = this.lichessTools;
      const evaluator = new LiChessTools.ChessKmapsEvaluator(fen, lt.chessopsModule);
      const kmaps = await evaluator.evaluate();
      const q = isBlack ? -1 : 1;
      return { 
        K:q*kmaps.K,
        M:q*kmaps.M,
        A:q*kmaps.A,
        P:q*kmaps.P,
        S:q*kmaps.S,
      };
    };

    toggleView = (ev)=>{
      ev.preventDefault();
      const lt = this.lichessTools;
      const $ = lt.$;
      const radarChart = !!lt.storage.get('LiChessTools.showKmaps.radar');
      lt.storage.set('LiChessTools.showKmaps.radar',!radarChart);
      $('.lichessTools-kmaps').remove();
      this.refreshKmaps();
    };

    addKmapsAnchor = (el, kmaps) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!el.length) el = $(el);
      let kmapsElem = el.find('.lichessTools-kmaps');
      if (kmapsElem.length) {
        const kmapsJson = lt.global.JSON.stringify(kmaps);
        if (kmapsElem.prop('kmapsJson') == kmapsJson) return;
        kmapsElem.prop('kmapsJson',kmapsJson);
      } else {
        const visibleEl = el.filter((i, e) => !!lt.inViewport(e)).eq(0);
        kmapsElem = $('<span>')
          .addClass('lichessTools-kmaps')
          .on('click',this.toggleView)
          .appendTo(visibleEl);
      }
      const getColor = (val)=>{
        const q = 0.6;
        let color;
        if (lt.isDark()) {
          color = val>0
            ? lt.getGradientColor(Math.pow(val, q), [{ q: 0, color: '#FFFFFF' }, { q: 1, color: '#00FF00' }])
            : lt.getGradientColor(Math.pow(-val, q), [{ q: 0, color: '#FFFFFF' }, { q: 1, color: '#FF0000' }]);
        } else {
          color = val>0
            ? lt.getGradientColor(Math.pow(val, q), [{ q: 0, color: '#404040' }, { q: 1, color: '#00FF00' }])
            : lt.getGradientColor(Math.pow(-val, q), [{ q: 0, color: '#404040' }, { q: 1, color: '#FF0000' }]);
        }
        return color;
      }
      kmapsElem.empty()
        .attr('title',trans.noarg('kmapsTitle')
                        .replace('$K',Math.round(kmaps.K*100))
                        .replace('$M',Math.round(kmaps.M*100))
                        .replace('$A',Math.round(kmaps.A*100))
                        .replace('$P',Math.round(kmaps.P*100))
                        .replace('$S',Math.round(kmaps.S*100)));
      const radarChart = !!lt.storage.get('LiChessTools.showKmaps.radar');
      if (radarChart) {
         // Get canvas and context
         const canvas = document.createElement('canvas');
         canvas.width = 400;
         canvas.height = 400;
         const ctx = canvas.getContext('2d');
         
         // Canvas properties
         const centerX = canvas.width / 2;
         const centerY = canvas.height / 2;
         const maxRadius = 170; // Maximum radius for value = 1

         const labels = ['K', 'M', 'A', 'P', 'S'];
         const numAxes = labels.length;
         const angleStep = (2 * Math.PI) / numAxes; // Angle between axes

         const minVal = -1;
         const maxVal = Math.max(0,Math.max(...labels.map(l=>kmaps[l])));
         const valueToRadius = (value)=>{
           return ((value - minVal) / (maxVal - minVal)) * maxRadius;
         };

         const xy = (radius, i)=>{
           const angle = i * angleStep - Math.PI/2;
           const x = centerX + radius * Math.cos(angle);
           const y = centerY + radius * Math.sin(angle);
           return [x,y];
         };

         // Draw zero-value circle
         ctx.beginPath();
         ctx.strokeStyle = '#80808080';
         ctx.lineWidth = 2;
         ctx.arc(centerX, centerY, valueToRadius(0), 0, 2 * Math.PI);
         ctx.stroke();
         
         // Draw data polygon
         ctx.beginPath();
         ctx.fillStyle = 'rgba(0, 128, 255, 0.3)';
         ctx.strokeStyle = 'blue';
         ctx.lineWidth = 2;

         // Draw labels
         labels.forEach((label, i) => {
           const value = kmaps[label];
           const radius = valueToRadius(value);
           const [x, y] = xy(radius, i);
           if (i === 0) {
             ctx.moveTo(x, y);
           } else {
             ctx.lineTo(x, y);
           }
         });
         ctx.closePath();
         ctx.fill();
         ctx.stroke();
         
         // Draw labels
         ctx.font = 'bold 3em Arial';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         labels.forEach((label, i) => {
           const value = kmaps[label];
           ctx.fillStyle = getColor(value);
           const radius = valueToRadius(value);
           const [x, y] = xy(radius+10, i);
           ctx.fillText(label, x, y);
         });

        kmapsElem
          .append(canvas);
      } else {
        kmapsElem
          .append($('<span>')
                    .css('--kmaps-color',getColor(kmaps.K))
                    .text('K'))
          .append($('<span>').text('-'))
          .append($('<span>')
                    .css('--kmaps-color',getColor(kmaps.M))
                    .text('M'))
          .append($('<span>')
                    .css('--kmaps-color',getColor(kmaps.A))
                    .text('A'))
          .append($('<span>')
                    .css('--kmaps-color',getColor(kmaps.P))
                    .text('P'))
          .append($('<span>')
                    .css('--kmaps-color',getColor(kmaps.S))
                    .text('S'));
      }
    };

    miniGameKmaps = async (el) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
      if ($.cached('body').is('.playing')) return;
      const evalCheckbox = $.cached('body').find('.study__multiboard__options label.eval input');
      if (evalCheckbox.length && !evalCheckbox.is(':checked')) return;

      const withParameter = !!el;
      let fen = '';
      if (el?.id && el?.fen) {
        fen = el.fen;
        el = $('.mini-game-' + el.id);
        if (!el.length) return;
      };
      if (!$(el).length) el = $.cached('body');
      const elems = $(el).find('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game').get();
      if ($(el).is('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game')) elems.push(el[0]);
      if (withParameter && !elems.length) {
        this.miniGameKmaps();
        return;
      }
      let notInViewport = false;
      for (const el of elems) {
        if (!lt.inViewport(el)) {
          notInViewport = true;
          continue;
        }
        if ($(el).closest('.lichessTools-lichessLadders-userChallenges').length) continue;

        fen = fen || $(el).attr('data-state') || lt.getPositionFromBoard(el, true);
        if (!fen) {
          //lt.global.console.warn('Could not get fen for element', el);
          continue;
        }
        const kmaps = await this.getKmaps(fen, $(el).attr('data-state')?.includes('black'));
        this.addKmapsAnchor(el, kmaps);
        fen = '';
      }
      if (notInViewport) this.miniGameKmapsDebounced();
    };
    miniGameKmapsDebounced = this.lichessTools.debounce(this.miniGameKmaps, 500);

    refreshKmaps = async (ply) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
      const showStaticAnalysis = analysis?.settings?.showStaticAnalysis;
      if ($.cached('body').is('.playing') || (showStaticAnalysis === false && !analysis?.cevalEnabled())) return;

      const metaSection = $.cached('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables', 10000);
      const fen = analysis?.node?.fen || lt.getPositionFromBoard($('main'), true);
      if (!fen) return;
      const analysisOrientation = analysis?.getOrientation();
      const isBlackOrientation = (analysisOrientation && analysisOrientation == 'black') || $('.cg-wrap').eq(0).is('.orientation-black');
      const kmaps = await this.getKmaps(fen, isBlackOrientation);
      if (!kmaps) {
        metaSection.find('.lichessTools-kmaps').remove();
        return;
      }
      this.addKmapsAnchor(metaSection, kmaps);
      if (!ply) {
        await this.miniGameKmaps();
      }
    };
    refreshKmapsDebounced = this.lichessTools.debounce(this.refreshKmaps, 500);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('showKmaps');
      this.logOption('Show K-MAPS', value);
      this.options = {
        enabled: !!value
      };
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      lt.uiApi.socket.events.off('endData', this.refreshKmapsDebounced);
      lt.uiApi.socket.events.off('fen', this.miniGameKmaps);
      lt.uiApi.events.off('ply', this.refreshKmapsDebounced);
      lt.pubsub.off('lichessTools.redraw', this.refreshKmapsDebounced);
      lt.pubsub.off('lichessTools.contentLoaded', this.miniGameKmapsDebounced);
      lt.global.clearInterval(this.interval);
      $('body').observer()
        .off('input[type=checkbox]',this.miniGameKmapsDebounced);
      $('body').observer()
        .off('input[type=checkbox]',this.refreshKmapsDebounced);
      if (this.options.enabled) {
        lt.uiApi.socket.events.on('endData', this.refreshKmapsDebounced);
        lt.uiApi.socket.events.on('fen', this.miniGameKmaps);
        lt.uiApi.events.on('ply', this.refreshKmapsDebounced);
        lt.pubsub.on('lichessTools.redraw', this.refreshKmapsDebounced);
        lt.pubsub.on('lichessTools.contentLoaded', this.miniGameKmapsDebounced);
        lt.global.setTimeout(this.refreshKmapsDebounced,1000); // this is not essential to loading
        if ($('main').is('#board-editor')) {
          this.interval = lt.global.setInterval(this.refreshKmapsDebounced, 1000);
        }
        $('body').observer()
          .on('input[type=checkbox]',this.miniGameKmapsDebounced,{ attributes: true });
        $('body').observer()
          .on('input[type=checkbox]',this.refreshKmapsDebounced,{ attributes: true });
      } else {
        const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables');
        metaSection.find('.lichessTools-kmaps').remove();
      }
      if (lt.location.isGamesPage()) {
        $.cached('body').toggleClass('lichessTools-kmapsMiniGames', this.options.enabled);
      }
    }

  }

  LiChessTools.Tools.ShowKmaps = ShowKmapsTool;
})();
