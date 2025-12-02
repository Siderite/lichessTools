(() => {
  class ChallengeOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['ChessOps'];

    preferences = [
      {
        name: 'challengeOptions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['latestGames', 'randomChallenge', 'generateLink'],
        defaultValue: 'generateLink',
        advanced: true,
        needsLogin: true
      }
    ];

    upgrades = [
      { name:'challengeOptions', value:'generateLink', version: '2.4.129', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.challengeOptions': 'Challenge options',
        'challengeOptions.latestGames': 'Show latest games',
        'challengeOptions.randomChallenge': 'Random challenge button',
        'challengeOptions.generateLink': 'Generate link in popup',
        'randomChallengeButtonText': 'Accept random challenge',
        'randomChallengeButtonTitle': 'LiChess Tools - accept random challenge',
        'generateChallengeLinkText': 'Generate link',
        'generateChallengeLinkTitle': 'LiChess Tools - generate link to open this popup'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.challengeOptions': 'Op\u0163iuni provoc\u0103ri',
        'challengeOptions.latestGames': 'Arat\u0103 ultimele jocuri',
        'challengeOptions.randomChallenge': 'Buton provocare aleatorie',
        'challengeOptions.generateLink': 'Genereaz\u0103 link \u00een popup',
        'randomChallengeButtonText': 'Accept\u0103 o provocare aleatorie',
        'randomChallengeButtonTitle': 'LiChess Tools - accept\u0103 o provocare aleatorie',
        'generateChallengeLinkText': 'Genereaz\u0103 link',
        'generateChallengeLinkTitle': 'LiChess Tools - genereaz\u0103 link care deschide acest popup'
      }
    }

    processChallengeMenuDirect = async ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const $ = lt.$;
      const menuElem = $('#challenge-app');
      if (this.options.latestGames) {
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
        if (!co) return;
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
      }

      if (this.options.randomChallenge) {
        const challengesContainer = $('.challenges',menuElem);
        const challenges = challengesContainer.find('.challenge.in');
        let container = $('.lichessTools-randomChallenge',menuElem);
        if (challenges.length<=1) {
          container.remove();
        } else {
          if (!container.length) {
            container = $('<div class="lichessTools-randomChallenge">')
                          .append($('<button type="button">')
                                    .text(trans.noarg('randomChallengeButtonText'))
                                    .attr('title',trans.noarg('randomChallengeButtonTitle'))
                                    .on('click',this.pickRandomChallenge)
                          )
                          .prependTo(menuElem);
          }

        }
      }
    };
    processChallengeMenu = lichessTools.debounce(this.processChallengeMenuDirect,1000);

    sliderTimes = (val) => {
      const n = +val;
      if (val !==0 && !n) return 0;
      if (n >= 0 && n <= 4) {
        return 0.25 * n;
      }
      if (n === 5) {
        return 1.5;
      }
      if (n >= 6 && n <= 24) {
        return n - 4;
      }
      if (n >= 25 && n <= 29) {
        return 5 * n - 100;
      }
      if (n >= 30 && n <= 38) {
        return 15 * n - 390;
      }
    };

    extractUserId = (text) => {
      const lt = this.lichessTools;
      const challengeX = lt.global.i18n?.site?.challengeX;
      if (!challengeX) return;
      const pattern = lt.escapeRegex(challengeX('XXX')).replace('XXX','(?<userId>[^\\s]+)');
      const match = new RegExp(pattern).exec(text);
      return match?.groups?.userId;
    };

    processSetupPopup = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const gameSetup = $('dialog .game-setup');
      if (!gameSetup.length) return;
      let link = gameSetup.find('a.lichessTools-generateLink');
      if (!link.length) {
        link = $('<a class="lichessTools-generateLink">')
                 .attr('title',trans.noarg('generateChallengeLinkTitle'))
                 .text(trans.noarg('generateChallengeLinkText'))
                 .appendTo(gameSetup.find('.footer'));
      }
      const params = {
        user: this.extractUserId($('.lobby__start__button--friend-user').text()),
        variant: $('#sf_variant').val(),
        fen: $('#fen-input').val(),
        time: $('#sf_timeMode').val(),
        minutesPerSide: this.sliderTimes($('.time-choice input.range').val()),
        increment: $('.increment-choice input.range').val(),
        rated: $('#sf_mode_casual:checked,#sf_mode_rated:checked').val(),
        color: $('#color-picker-white:checked,#color-picker-random:checked,#color-picker-black:checked').val(),
        sfLevel: $('input[id^="sf_level_"]:checked').val(),
        ratingMin: $('input.rating-range__min').val(),
        ratingMax: $('input.rating-range__max').val(),
      };
      const hash = (()=>{
        if (params.user) return 'friend';
        if (params.sfLevel) return 'ai';
        if (params.ratingMin || params.ratingMax) return 'hook';
      })();
      const query = Object.entries(params)
        .filter(e=>e[1] !== undefined)
        .map(e=>`${e[0]}=${encodeURIComponent(e[1])}`)
        .join('&');
      let href='/';
      if (query) href+='?'+query;
      if (hash) href+='#'+hash;
      link.attr('href',href);
    };

    pickRandomChallenge = (ev)=>{
      ev.preventDefault();
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const challenges = $('#challenge-app .challenges .challenge.in');
      const index = Math.floor(lt.random() * challenges.length);
      challenges.eq(index).find('form')[0].requestSubmit();
    };

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
        latestGames: lt.isOptionSet(value, 'latestGames'),
        randomChallenge: lt.isOptionSet(value, 'randomChallenge'),
        generateLink: lt.isOptionSet(value, 'generateLink')
      };

      this.processChallengeMenu();
      $('body').observer()
        .off('#challenge-app',this.processChallengeMenu);
      $('body').observer()
        .off(':has(.game-setup)',this.processSetupPopup);
      $('body')
        .off('input',this.processSetupPopup);
      if (this.options.latestGames || this.options.randomChallenge) {
        $('body').observer()
          .on('#challenge-app',this.processChallengeMenu);
      }
      if (this.options.generateLink) {
        $('body').observer()
          .on(':has(.game-setup)',this.processSetupPopup,{
            subtree: true,
            attributes: true,
            attributeFilter: ["open"]
          });
        $('body')
          .on('input',this.processSetupPopup);
        this.processSetupPopup(true);
      } else {
        $('.lichessTools-generateLink').remove();
      }
    }

  }
  LiChessTools.Tools.ChallengeOptions = ChallengeOptionsTool;
})();
