(() => {
  class PuzzleOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw','EmitPuzzleChange']

    preferences = [
      {
        name: 'puzzleOptions',
        category: 'puzzles',
        type: 'multiple',
        possibleValues: ['endTimer', 'showSessionTotal'],
        defaultValue: 'showSessionTotal'
      }
    ];

    intl = {
      'en-US': {
        'options.puzzles': 'Puzzles',
        'options.puzzleOptions': 'Options for puzzles',
        'puzzleOptions.endTimer': 'Show completion time',
        'puzzleOptions.showSessionTotal': 'Show session total',
        'elapsedText': '(%s s)',
        'puzzleSessionTotalTitle': 'LiChess Tools - total'
      },
      'ro-RO': {
        'options.puzzles': 'Probleme de \u015Fah',
        'options.puzzleOptions': 'Op\u0163iuni pentru probleme de \u015fah',
        'puzzleOptions.endTimer': 'Arat\u0103 durata complet\u0103rii',
        'puzzleOptions.showSessionTotal': 'Arat\u0103 totalul per sesiune',
        'elapsedText': '(%s s)',
        'puzzleSessionTotalTitle': 'LiChess Tools - total'
      }
    }

    isPlaying = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      return $.cached('body').is('.playing') && !$('.puzzle__feedback').is('.after');
    };

    isTrainingPage = ()=>{
      const lt = this.lichessTools;
      return /^\/training/i.test(lt.global.location.pathname) && !/^\/training\/(?:dashboard|themes)/.test(lt.global.location.pathname);
    };

    showTotal = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      let total = null;
      $('.puzzle__session a').each((i,e)=>{
        const text = $(e).text();
        if (text && !$(e).is('.lichessTools-puzzleTotal')) {
          const points = +text;
          if (points) {
            total = total ? total+points : points;
          }
        } else 
          if (total !== null) {
            const totalText = (total>0 ? '+' : '') + total;
            $(e)
              .addClass('lichessTools-puzzleTotal')
              .attr('title',trans.noarg('puzzleSessionTotalTitle'))
              .text(totalText);
          }
        });
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

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('puzzleOptions');
      this.logOption('Puzzle options', value);
      this.options = {
        endTimer: lt.isOptionSet(value, 'endTimer'),
        showSessionTotal: lt.isOptionSet(value, 'showSessionTotal')
      };
      lt.pubsub.off('lichessTools.puzzleStart',this.startTimer);
      lt.pubsub.off('lichessTools.puzzleEnd',this.endTimer);
      if (this.options.endTimer && this.isTrainingPage()) {
        lt.pubsub.on('lichessTools.puzzleStart',this.startTimer);
        lt.pubsub.on('lichessTools.puzzleEnd',this.endTimer);
      }
      if (this.isTrainingPage()) {
        const session = $('.puzzle__session');
        session
          .observer()
          .off('.puzzle__session a',this.showTotal);
        if (this.options.showSessionTotal) {
          if (session.length) {
            session
              .observer()
              .on('.puzzle__session a',this.showTotal, {
                childList: true,
                subtree: false,
                attributes: true
              });
            this.showTotal();
          }
        }
      }
    }

  }
  LiChessTools.Tools.PuzzleOptions = PuzzleOptionsTool;
})();
