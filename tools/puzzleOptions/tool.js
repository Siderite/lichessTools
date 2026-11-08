(() => {
  class PuzzleOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitPuzzleChange']

    preferences = [
      {
        name: 'puzzleOptions',
        category: 'puzzles',
        type: 'multiple',
        possibleValues: ['endTimer', 'showSessionTotal', 'material'],
        defaultValue: 'showSessionTotal'
      }
    ];

    upgrades = [
      { name:'puzzleOptions', value:'wakeLock', version: '2.4.0', type: 'obsolete' }
    ];

    intl = {
      'en-US': {
        'options.puzzles': 'Puzzles',
        'options.puzzleOptions': 'Options for puzzles',
        'puzzleOptions.endTimer': 'Show completion time',
        'puzzleOptions.showSessionTotal': 'Show session total',
        'puzzleOptions.material': 'Show material difference',
        'elapsedText': '(%s s)',
        'puzzleSessionTotalTitle': 'LiChess Tools - total'
      },
      'ro-RO': {
        'options.puzzles': 'Probleme de \u015Fah',
        'options.puzzleOptions': 'Op\u0163iuni pentru probleme de \u015fah',
        'puzzleOptions.endTimer': 'Arat\u0103 durata complet\u0103rii',
        'puzzleOptions.showSessionTotal': 'Arat\u0103 totalul per sesiune',
        'puzzleOptions.material': 'Arat\u0103 diferen\u0163\u0103 material',
        'elapsedText': '(%s s)',
        'puzzleSessionTotalTitle': 'LiChess Tools - total'
      }
    }

    isPlaying = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      return $.cached('body').is('.playing') && !$('.puzzle__feedback').is('.after');
    };

    showTotal = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      let total = null;
      let count = 0;
      let good = 0;
      $('.puzzle__session a:not(.result-cursor)').each((i,e)=>{
        if ($(e).is('.result-false')) {
          count++;
        } else 
        if ($(e).is('.result-true')) {
          count++;
          good++;
        }
        if (!$(e).is('.result-empty')) {
          const text = $(e).text();
          if (text && !$(e).is('.lichessTools-puzzleTotal')) {
            const points = +text;
            if (points) {
              total = total ? total+points : points;
            }
          }
        }
      });
      if (count) {
        let text = good+'/'+count;
        if (total) text += ' ('+(total>0 ? '+' : '') + total + ')';
        $('.puzzle__session a.result-cursor, .puzzle__session a.session-new')
          .addClass('lichessTools-puzzleTotal')
          .attr('title',trans.noarg('puzzleSessionTotalTitle'))
          .text(text);
      }
    };

    startTimer = (puzzleId)=>{
      this.startTime = Date.now();
    };

    endTimer = (puzzleId)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const elapsed = (Date.now() - this.startTime)/1000;
      if (Number.isNaN(elapsed)) {
        console.warn('Could not calculate puzzle completion time');
        return;
      }
      const elapsedText = trans.pluralSame('elapsedText',elapsed.toFixed(2));
      const elem = $('.puzzle__feedback .complete');
      if (!elem.prop('__puzzleOptions')) {
        elem
          .prop('__puzzleOptions', true)
          .replaceText(t=>t+' '+elapsedText);
      }
    };

    materialRoles = ['queen', 'rook', 'bishop', 'knight', 'pawn'];

    // Per role the side with more pieces keeps the surplus, which is what Lichess renders.
    materialStats = (fen)=>{
      const Material = LiChessTools.Material;
      const counts = {};
      for (const role of this.materialRoles) counts[role] = [0, 0];
      for (const ch of String(fen || '').split(' ')[0]) {
        const role = Material.LETTER_TO_ROLE[ch.toLowerCase()];
        if (role && role != 'king') counts[role][ch == ch.toLowerCase() ? 1 : 0]++;
      }
      const surplus = { white: {}, black: {} };
      const value = { white: 0, black: 0 };
      for (const role of this.materialRoles) {
        const w = counts[role][0];
        const b = counts[role][1];
        surplus.white[role] = w > b ? w - b : 0;
        surplus.black[role] = b > w ? b - w : 0;
        value.white += surplus.white[role] * Material.VALUE[role];
        value.black += surplus.black[role] * Material.VALUE[role];
      }
      return { surplus: surplus, value: value };
    };

    // A side shows the pieces it has more of than its opponent plus its material advantage.
    renderMaterialSide = (container, pos, color, stats)=>{
      const $ = this.lichessTools.$;
      const other = color == 'white' ? 'black' : 'white';
      const elem = $('<div class="material material-' + pos + '">');
      let filled = false;
      for (const role of this.materialRoles) {
        for (let i = 0; i < stats.surplus[color][role]; i++) {
          const cell = $('<div>').appendTo(elem);
          $('<mpiece class="' + role + '">').appendTo(cell);
          filled = true;
        }
      }
      const diff = stats.value[color] - stats.value[other];
      if (diff > 0) {
        $('<score>').text('+' + diff).appendTo(elem);
        filled = true;
      }
      if (!filled) return;
      if (pos == 'top') elem.prependTo(container);
      else elem.appendTo(container);
    };

    // Below 800px the strips hang off the board, otherwise they hang off the moves area.
    materialNarrow = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      return $('.puzzle__board').length > 0 && (lt.global.window?.innerWidth || 0) < 800;
    };

    removeMaterial = (container)=>{
      const $ = this.lichessTools.$;
      if (!container?.length) return;
      $('div.material.material-top,div.material.material-bottom', container).remove();
    };

    // The strips follow the same board that provides the FEN, never a variation board.
    materialFlipped = ()=>{
      const $ = this.lichessTools.$;
      const board = $('main').find('cg-container')[0];
      if (!board) return false;
      const wrap = $(board).closest('.cg-wrap');
      return wrap.length > 0 && wrap.is('.orientation-black');
    };

    renderMaterial = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const narrow = this.materialNarrow();
      const container = narrow ? $('.puzzle__board') : $('.puzzle__tools');
      if (!container.length) return;
      const fen = lt.getPositionFromBoard($('main'), true);
      if (!fen) return;
      const flipped = this.materialFlipped();
      const samePosition = fen == this.prevMaterialFen && flipped == this.prevMaterialFlipped;
      if (samePosition && narrow == this.prevMaterialNarrow) return;
      this.prevMaterialFen = fen;
      this.prevMaterialFlipped = flipped;
      this.prevMaterialNarrow = narrow;
      this.removeMaterial($('.puzzle__tools'));
      this.removeMaterial($('.puzzle__board'));
      const stats = this.materialStats(fen);
      const topColor = flipped ? 'white' : 'black';
      this.renderMaterialSide(container, 'top', topColor, stats);
      this.renderMaterialSide(container, 'bottom', topColor == 'white' ? 'black' : 'white', stats);
    };

    clearMaterial = ()=>{
      const $ = this.lichessTools.$;
      this.removeMaterial($('.puzzle__tools'));
      this.removeMaterial($('.puzzle__board'));
      this.prevMaterialFen = null;
      this.prevMaterialFlipped = null;
      this.prevMaterialNarrow = null;
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('puzzleOptions');
      this.logOption('Puzzle options', value);
      this.options = {
        endTimer: lt.isOptionSet(value, 'endTimer'),
        showSessionTotal: lt.isOptionSet(value, 'showSessionTotal'),
        material: lt.isOptionSet(value, 'material')
      };
      const isTrainingPage = lt.location.isPuzzleTrainingPage();
      lt.pubsub.off('lichessTools.redraw', this.renderMaterial);
      this.clearMaterial();
      if (isTrainingPage && this.options.material) {
        lt.pubsub.on('lichessTools.redraw', this.renderMaterial);
        this.renderMaterial();
      }
      lt.pubsub.off('lichessTools.puzzleStart',this.startTimer);
      lt.pubsub.off('lichessTools.puzzleEnd',this.endTimer);
      if (this.options.endTimer && isTrainingPage) {
        lt.pubsub.on('lichessTools.puzzleStart',this.startTimer);
        lt.pubsub.on('lichessTools.puzzleEnd',this.endTimer);
      }
      if (isTrainingPage) {
        $('body')
          .observer()
          .off('.puzzle__session',this.showTotal);
        if (this.options.showSessionTotal) {
          $('body')
            .observer()
            .on('.puzzle__session',this.showTotal, {
              childList: true,
              subtree: true,
              attributes: true
            });
          this.showTotal();
        }
      }
    }

  }
  LiChessTools.Tools.PuzzleOptions = PuzzleOptionsTool;
})();
