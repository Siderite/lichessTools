(() => {
  class MuteOwnMovesTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        category: 'general',
        name: 'muteOwnMoves',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.muteOwnMoves': 'Mute speech for your own moves'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.muteOwnMoves': 'Nu vorbi propriile mut\u0103ri'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const sound = lichess?.sound;
      if (!sound?.saySan) return;
      const value = lt.currentOptions.getValue('muteOwnMoves');
      this.logOption('Mute speech for own moves', value);
      sound.saySan = lt.unwrapFunction(sound.saySan, 'muteOwnMoves');
      if (!value) return;
      sound.saySan = lt.wrapFunction(sound.saySan, {
        id: 'muteOwnMoves',
        before: ($this, ...args) => {
          const fen = analysis?.node?.fen || lt.getPositionFromBoard($('div.main-board'), true);
          if (!fen) return;
          const isBlackTurn = / b\b/.test(fen);
          const isBlackOrientation = analysis?.getOrientation?.() == 'black' || $('.main-board .cg-wrap').is('.orientation-black');
          // after your own move it is the opponent's turn
          if (isBlackTurn != isBlackOrientation) return false;
        }
      });
    }

  }
  LiChessTools.Tools.MuteOwnMoves = MuteOwnMovesTool;
})();
