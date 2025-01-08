(() => {
  class PuzzleOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw','EmitPuzzleChange']

    preferences = [
      {
        name: 'puzzleOptions',
        category: 'puzzles',
        type: 'multiple',
        possibleValues: ['wakeLock','endTimer', 'showSessionTotal'],
        defaultValue: 'wakeLock,showSessionTotal',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.puzzles': 'Puzzles',
        'options.puzzleOptions': 'Options for puzzles',
        'puzzleOptions.wakeLock': 'Prevent screen lock playing puzzles',
        'puzzleOptions.endTimer': 'Show completion time',
        'puzzleOptions.showSessionTotal': 'Show session total',
        'elapsedText': '(%s s)',
        'puzzleSessionTotalTitle': 'LiChess Tools - total'
      },
      'ro-RO': {
        'options.puzzles': 'Probleme de \u015Fah',
        'options.puzzleOptions': 'Op\u0163iuni pentru probleme de \u015fah',
        'puzzleOptions.wakeLock': 'Previne blocarea ecranului \u00een probleme de \u015fah',
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
      return /^\/training/i.test(lt.global.location.pathname);
    };

    handleWakeLock = async () => {
      const lt = this.lichessTools;
      if (this.isPlaying()) {
        if (!this.wakelock) {
          await this.requestWakeLock();
        }
      } else {
        lt.global.clearTimeout(this.wakeLockTimeout);
        this.wakelock?.release();
        this.wakelock=null;
      }
    };

    requestWakeLock = async () => {
      const lt = this.lichessTools;
      try {
        if (document.visibilityState === 'visible') {
          this.wakelock?.release();
          this.wakelock = await lt.global.navigator.wakeLock.request("screen");
          if (this.wakelock) return;
        }
      } catch (err) {
        console.debug('Wakelock failed:', err);
      }
      lt.global.clearTimeout(this.wakeLockTimeout);
      this.wakeLockTimeout = lt.global.setTimeout(this.requestWakeLock, 1000);
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
      $('.puzzle__feedback .complete')
        .replaceText(t=>t+' '+elapsedText);
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('puzzleOptions');
      this.logOption('Puzzle options', value);
      this.options = {
        wakeLock: lt.isOptionSet(value, 'wakeLock'),
        endTimer: lt.isOptionSet(value, 'endTimer'),
        showSessionTotal: lt.isOptionSet(value, 'showSessionTotal')
      };
      lt.pubsub.off('lichessTools.redraw',this.handleWakeLock);
      lt.pubsub.off('lichessTools.puzzleStart',this.handleWakeLock);
      if (this.options.wakeLock && this.isTrainingPage()) {
        lt.pubsub.on('lichessTools.redraw',this.handleWakeLock);
        lt.pubsub.on('lichessTools.puzzleStart',this.handleWakeLock);
        await this.handleWakeLock();
      } else {
        lt.global.clearTimeout(this.wakeLockTimeout);
        this.wakelock?.release();
        this.wakelock=null;
      }
      lt.pubsub.off('lichessTools.puzzleStart',this.startTimer);
      lt.pubsub.off('lichessTools.puzzleEnd',this.endTimer);
      if (this.options.endTimer && this.isTrainingPage()) {
        lt.pubsub.on('lichessTools.puzzleStart',this.startTimer);
        lt.pubsub.on('lichessTools.puzzleEnd',this.endTimer);
      }
      if (this.isTrainingPage()) {
        const session = $('.puzzle__session');
        if (this.options.showSessionTotal) {
          if (session.length && !session.hasObserver('puzzleOptions')) {
            session
              .observer()
              .on('*',this.showTotal);
            this.showTotal();
          }
        } else {
          session.removeObserver('puzzleOptions');
        }
      }
    }

  }
  LiChessTools.Tools.PuzzleOptions = PuzzleOptionsTool;
})();
