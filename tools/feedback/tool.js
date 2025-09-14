(() => {

  class FeedbackTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'feedback',
        category: 'general',
        type: 'multiple',
        possibleValues: ['piecePick','pieceDrop','opponentMove','gameStart','gameEnd'],
        defaultValue: '',
        advanced: true
      }
    ];


    intl = {
      'en-US': {
        'options.general': 'General',
        'options.feedback': 'Feedback',
        'feedback.piecePick': 'Piece pick or select',
        'feedback.pieceDrop': 'Piece move',
        'feedback.opponentMove': 'Opponent move',
        'feedback.gameStart': 'Start of game',
        'feedback.gameEnd': 'End of game'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.feedback': 'Feedback',
        'feedback.piecePick': 'Apucare sau selectare pies\u0103',
        'feedback.pieceDrop': 'Mutare pies\u0103',
        'feedback.opponentMove': 'Mutare adversar',
        'feedback.gameStart': 'Start de joc',
        'feedback.gameEnd': 'Final de joc'
      },
    }

    retries = 0;
    checkGameEnd = (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!$('body').is('.playing')) {
        this.retries = 0;
        return;
      }
      if (!$('.result-wrap .result').length && !$('a.fbt.analysis').attr('href')) {
        if (this.retries < 8) {
          lt.global.setTimeout(this.checkGameEnd, 500);
          this.retries++;
        }
        return;
      }
      let outcome = 'draw';
      if (ev.winner) {
        const winnerHref = $('.game__meta__players .player.'+ev.winner+' a.user-link').attr('href');
        const m = /\/@\/(?<userId>[^\/\?#]+)/.exec(winnerHref);
        outcome = m?.groups?.userId?.toLowerCase() == lt.getUserId()?.toLowerCase()
          ? 'win'
          : 'loss';
      }
      this.retries = 0;
      this.onGameEnd(outcome);
    };

    onGameEnd = (outcome)=>{
      const lt = this.lichessTools;
      if (!this.options.gameEnd) return;
      lt.feedback.onGameEvent(outcome);
    };

    checkMove = (mutations)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      let event = null;
      for (const m of mutations) {
        const board = $(m.target);
        if (board.is('cg-board')) {
          if (this.options.piecePick && [...m.addedNodes].find(n=>$(n).is('.selected'))) {
            event = 'piecePick';
            break;
          }
          if (this.options.pieceDrop && [...m.removedNodes].find(n=>$(n).is('.selected'))) {
            event = 'pieceDrop';
            break;
          }
        } else
        if (this.options.opponentMove && board.is('.last-move') && m.attributeName=='style') {
          const opponentPieceClass = $('.main-board .cg-wrap').is('.orientation-black') ? '.white' : '.black';
          for (const lastMove of $('.main-board .last-move').get()) {
            const cgKey = lastMove.cgKey;
            if (!cgKey) continue;
            let piece = $('.main-board piece.anim').filter((i,e)=>e.cgKey==cgKey);
            if (!piece.length) {
               switch(cgKey) {
                 case 'a1': piece = $('.main-board piece.anim').filter((i,e)=>e.cgKey=='d1'); break;
                 case 'a8': piece = $('.main-board piece.anim').filter((i,e)=>e.cgKey=='d8'); break;
                 case 'h1': piece = $('.main-board piece.anim').filter((i,e)=>e.cgKey=='f1'); break;
                 case 'h8': piece = $('.main-board piece.anim').filter((i,e)=>e.cgKey=='f8'); break;
               }
            }
            if (piece.is(opponentPieceClass)) {
              event = 'opponentMove';
              break;
            }
          }
        }
      }
      switch(event) {
        case 'piecePick':
          lt.feedback.onGrabPiece();
          break;
        case 'pieceDrop':
          lt.feedback.onDropPiece();
          break;
        case 'opponentMove':
          lt.feedback.onOpponentMove();
          break;
      }
    };

    async init() {
      const lt = this.lichessTools;
      lt.feedback = new FeedbackProvider(lt);
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const value = lt.currentOptions.getValue('feedback');
      this.logOption('Feedback', value);
      this.options = {
        piecePick: lt.isOptionSet(value, 'piecePick'),
        pieceDrop: lt.isOptionSet(value, 'pieceDrop'),
        opponentMove: lt.isOptionSet(value, 'opponentMove'),
        gameStart: lt.isOptionSet(value, 'gameStart'),
        gameEnd: lt.isOptionSet(value, 'gameEnd'),
        get isSet() { return this.piecePick || this.pieceDrop || this.opponentMove || this.gameEnd || this.gameStart }
      };
      $('body').observer()
        .off('.selected,.last-move',this.checkMove, { attributes: true, attributeFilter: ['style'] });
      lt.uiApi.socket.events.off('endData', this.checkGameEnd);

      if (!this.options.isSet) return;

      if (this.options.piecePick || this.options.pieceDrop || this.options.opponentMove) {
        $('body').observer()
          .on('.selected,.last-move',this.checkMove, { attributes: true, attributeFilter: ['style'] });
      }
      if (this.options.gameStart) {
        if ($('body').is('.playing') && $('.main-board').length) {
          lt.feedback.onGameEvent('start');
        }
      }
      if (this.options.gameEnd) {
        lt.uiApi.socket.events.on('endData', this.checkGameEnd);
      }
    }
  }

  class FeedbackProvider {
    constructor(lt) {
      this.lichessTools = lt;
      this.navigator = lt.global.navigator;
      this.hasVibration = 'vibrate' in navigator;
    }

    give(pattern, element) {
      if (!pattern) return;
      if (this.disabled) return;

      const lt = this.lichessTools
      const $ = lt.$;

      if (this.hasVibration && this.navigator.userActivation?.hasBeenActive) {
        try {
          this.navigator.vibrate(0);
          this.navigator.vibrate(pattern);
        } catch(e) {
          lt.debug && console.debug('Vibrate failed');
        }
      }

      /*if (!element) element = $('.main-board')[0];
      if (!element) return;
      if (typeof pattern === 'number') {
        pattern = [pattern];
      }
      let delay = 0;
      const timeouts = [];
      pattern.forEach((duration, index) => {
        if (index % 2 === 0) { // "On" durations (0, 2, 4, ...)
          const timeout = setTimeout(() => {
            element.style.animationDuration = `${duration}ms`;
            element.classList.add('lichessTools-flash');
            setTimeout(() => element.classList.remove('lichessTools-flash'), duration);
          }, delay);
          timeouts.push(timeout);
        }
        delay += duration; // Add "on" or "off" duration to total delay
      });
      return ()=>{
        timeouts.forEach(t=>clearTimeout(t));
        element.classList.remove('lichessTools-flash');
      };*/
    }

    onGrabPiece() {
      const pattern = 50;
      return this.give(pattern);
    }

    onDropPiece() {
      const pattern = 100;
      return this.give(pattern);
    }

    onOpponentMove() {
      const pattern = 75;
      return this.give(pattern);
    }

    onGameEvent(eventType) {
      let pattern = null;
      switch (eventType) {
        case 'start':
          pattern = [50, 50, 50];
          break;
        case 'win':
          pattern = [100, 50, 100, 50, 100];
          break;
        case 'draw':
          pattern = [100, 25, 75];
          break;
        case 'loss':
          pattern = [100, 100, 50];
          break;
      }
      return this.give(pattern);
    }
  }

  LiChessTools.Tools.Feedback = FeedbackTool;
})();