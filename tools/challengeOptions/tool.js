(() => {
  class ChallengeOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['ChessOps'];

    preferences = [
      {
        name: 'challengeOptions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['latestGames'],
        defaultValue: '',
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.challengeOptions': 'Challenge options',
        'challengeOptions.latestGames': 'Show latest games'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.challengeOptions': 'Op\u0163iuni provoc\u0103ri',
        'challengeOptions.latestGames': 'Arat\u0103 ultimele jocuri'
      }
    }

    processChallengeMenuDirect = async ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const menuElem = $('#challenge-app');
      let container = $('.lichessTools-challengeOptions',menuElem);
      if (!container.length) {
        container = $('<div class="lichessTools-challengeOptions">')
          .appendTo(menuElem);
      }
      const userId = lt.getUserId();
      const userUrl = (other) => other?.toLowerCase() == userId
        ? '#'
        : '/@/'+lt.global.encodeURIComponent(other);
      const text = await lt.api.game.getUserPgns(userId,{ moves: false, max: 5 });
      const co = lt.chessops;
      const { parsePgn } = co.pgn;
      const games = parsePgn(text);
      container.empty();
      for (const game of games) {
        const white = game.headers.get('White');
        const black = game.headers.get('Black');
        const userWhite = white?.toLowerCase() == userId;
        const result = game.headers.get('Result') || '*';
        let resultClass = '';
        if (result === '1-0') resultClass = userWhite?'win':'loss';
        if (result === '0-1') resultClass = userWhite?'loss':'win';
        $('<div class="game">')
         .append($('<a class="white">')
                    .attr('href',userUrl(white))
                    .text(white))
         .append($('<a class="black">')
                    .attr('href',userUrl(black))
                    .text(black))
         .append($('<a class="result glpt">')
                    .attr('href',game.headers.get('Site'))
                    .addClass(resultClass)
                    .text(result))
         .appendTo(container);
      }
      if (games.length) {
        container
          .find('a.white,a.black')
          .filter((i,e)=>$(e).attr('href')!='#')
          .addClass('ulpt');

        lichess.powertip?.manualUserIn(container[0]);
        lichess.powertip?.manualGameIn(container[0]);
      }
    };
    processChallengeMenu = lichessTools.debounce(this.processChallengeMenuDirect,1000);

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('challengeOptions');
      this.logOption('Challenge options', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      this.options = {
        latestGames: lt.isOptionSet(value, 'latestGames')
      };

      this.processChallengeMenu();
      $('body').observer()
        .off('#challenge-app',this.processChallengeMenu);
      if (this.options.latestGames) {
        $('body').observer()
          .on('#challenge-app',this.processChallengeMenu);
      }
    }

  }
  LiChessTools.Tools.ChallengeOptions = ChallengeOptionsTool;
})();
