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
          for (const lastMove of $('.main-board .last-move:not([style*="hidden"])').get()) {
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
      lt.feedback = new FeedbackProvider(lt, false);
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
        .off('.selected,.last-move',this.checkMove);
      lt.uiApi.socket.events.off('endData', this.checkGameEnd);

      if (!this.options.isSet) return;

      if (this.options.piecePick || this.options.pieceDrop || this.options.opponentMove) {
        $('body').observer()
          .on('.selected,.last-move',this.checkMove, {
          attributes: true,
          attributeFilter: ['style'],
          executeDirect: true
        });
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
    constructor(lt,useBeeps) {
      this.lichessTools = lt;
      this.navigator = lt.global.navigator;
      this.hasVibration = 'vibrate' in navigator;
      if (useBeeps) {
        this.audioContext = new lt.global.AudioContext();
      }
    }

    async give(pattern, element) {
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
      if (this.audioContext && this.navigator.userActivation?.hasBeenActive) {
        try {
          clearTimeout(this.beepTimeout);
          await this.stopBeeps();
          this.playBeepPattern(pattern);
        } catch(e) {
          lt.debug && console.debug('Play beeps failed');
        }
      }
    }

    playBeep(frequency = 440, duration = 100, volume = 0.1, type = 'sine') {
      const ctx = this.audioContext;
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      oscillator.type = type; // Wave type: 'sine', 'square', 'sawtooth', or 'triangle'
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime); // Frequency in Hz (A4 note is 440 Hz)

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000); // Convert ms to seconds
    }

    playBeepPattern(pattern) {
      if (!pattern) return;
      if (typeof pattern == 'number') pattern = [pattern];
      if (this.disabled) return;

      const ctx = this.audioContext;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          this.playBeepPattern(pattern);
        });
        return;
      }

      let currentTime = 0;

      const playNext = (index) => {
        if (index >= pattern.length) return;

        const beepDuration = pattern[index];
        const pauseDuration = +(pattern[index+1])||0;

        this.playBeep(25, beepDuration, 1, 'square');

        this.beepTimeout = setTimeout(() => {
          playNext(index + 2);
        }, beepDuration + pauseDuration);
      };

      playNext(0);
    }

    async stopBeeps() {
      if (!this.audioContext) return;
      const lt = this.lichessTools;
      await this.audioContext.close()
      this.audioContext = new lt.global.AudioContext();
    }

    async onGrabPiece() {
      const pattern = 50;
      await this.give(pattern);
    }

    async onDropPiece() {
      const pattern = 100;
      await this.give(pattern);
    }

    async onOpponentMove() {
      const pattern = 75;
      await this.give(pattern);
    }

    async onGameEvent(eventType) {
      let pattern = null;
      switch (eventType) {
        case 'start':
          pattern = [100, 50, 100];
          break;
        case 'win':
          pattern = [50, 50, 50, 50, 150];
          break;
        case 'draw':
          pattern = [100, 100, 100];
          break;
        case 'loss':
          pattern = [150, 100, 350];
          break;
      }
      await this.give(pattern);
    }
  }

  LiChessTools.Tools.Feedback = FeedbackTool;
})();