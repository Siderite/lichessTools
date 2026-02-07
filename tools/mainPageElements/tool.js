(() => {
  class MainPageElementsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties','ChessOps'];

    preferences = [
      {
        name: 'mainPageElements',
        category: 'appearance',
        type: 'multiple',
        possibleValues: [
          'side', 'side_streams', 'side_spotlights', 'side_timeline', 
          'app','app_bullet','app_blitz','app_rapid','app_classical',
          'table', 'tv', 'blog', 'puzzle', 'support', 'feed', 'tours', 
          'about', 'extraCounters', 'recentGames'],
        defaultValue: 'side, side_streams, side_spotlights, side_timeline,'+ 
          'app, app_bullet, app_blitz, app_rapid, app_classical,'+
          'table, tv, blog, puzzle, support, feed, tours,'+ 
          'about, extraCounters',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.mainPageElements': 'Lobby page elements',
        'mainPageElements.side': 'Side',
        'mainPageElements.app': 'Play grid',
        'mainPageElements.table': 'Play buttons',
        'mainPageElements.tv': 'TV',
        'mainPageElements.blog': 'Blog',
        'mainPageElements.puzzle': 'Daily puzzle',
        'mainPageElements.support': 'Support',
        'mainPageElements.feed': 'Feed',
        'mainPageElements.tours': 'Tournaments',
        'mainPageElements.about': 'About',
        'mainPageElements.side_streams': 'Side:streams',
        'mainPageElements.side_spotlights': 'Side:spotlights',
        'mainPageElements.side_timeline': 'Side:timeline',
        'mainPageElements.app_bullet': 'Play:bullet',
        'mainPageElements.app_blitz': 'Play:blitz',
        'mainPageElements.app_rapid': 'Play:rapid',
        'mainPageElements.app_classical': 'Play:classical',
        'mainPageElements.extraCounters': 'Extra counters',
        'mainPageElements.recentGames': 'Recent games',
        'totalGamesPlayed': 'Total games: %s',
        'yearGamesPlayed': 'Games this year: %s',
        'monthGamesPlayed': 'Games this month: %s',
        'dayGamesPlayed': 'Games today: %s',
        'recentGamesHeaderText': 'Recent games',
        'moreGamesText': 'More >'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.mainPageElements': 'Elemente pagin\u0103 principal\u0103',
        'mainPageElements.side': 'Lateral',
        'mainPageElements.app': 'Gril\u0103 jocuri',
        'mainPageElements.table': 'Butoane joc',
        'mainPageElements.tv': 'TV',
        'mainPageElements.blog': 'Blog',
        'mainPageElements.puzzle': 'Puzzle zilnic',
        'mainPageElements.support': 'Suport',
        'mainPageElements.feed': 'Nout\u0103\u0163i',
        'mainPageElements.tours': 'Turnee',
        'mainPageElements.about': 'Despre',
        'mainPageElements.side_streams': 'Lateral:stream-uri',
        'mainPageElements.side_spotlights': 'Lateral:prim-plan',
        'mainPageElements.side_timeline': 'Lateral:activitate recent\u0103',
        'mainPageElements.app_bullet': 'Joc:bullet',
        'mainPageElements.app_blitz': 'Joc:blitz',
        'mainPageElements.app_rapid': 'Joc:rapid',
        'mainPageElements.app_classical': 'Joc:clasic',
        'mainPageElements.extraCounters': 'Contoare \u00een plus',
        'mainPageElements.recentGames': 'Jocuri recente',
        'totalGamesPlayed': 'Total jocuri: %s',
        'yearGamesPlayed': 'Jocuri anul acesta: %s',
        'monthGamesPlayed': 'Jocuri luna aceasta: %s',
        'dayGamesPlayed': 'Jocuri azi: %s',
        'recentGamesHeaderText': 'Jocuri recente',
        'moreGamesText': 'Mai mult >'
      }
    }

    hashChange = () => {
      const lt = this.lichessTools;
      lt.global.location.reload();
    }

    applyLobbyElements = async ()=>{
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      if (!this.initialGrid) {
        this.initialGrid = $('main').css('grid-template-areas');
      }
      $('main')
        .toggleClass('lichessTools-lobbyPlay', this.isPlay);
      if (this.isPlay) {
        lt.global.document.title = $('#topnav > section:first-child span.play').text() + ' ' + lt.icon.BulletPoint + ' ' + lt.global.location.hostname;
      } else {
        const grid = this.initialGrid.replace(/[a-z]+/g, t => {
          const ft = t === 'timeline' ? 'side' : t;
          const res = this.options[ft] || (ft == 'side' && $('.lichessTools-pins *,.lichessTools-dailyQuote.side').length)
            ? t
            : '.'.padEnd(t.length, ' ');
          return res;
        });
        $('main').css('grid-template-areas', grid);
        $('main .lobby__side').toggleClassSafe('lichessTools-hideElement', !this.options.side);
        $('main .lobby__streams').toggleClassSafe('lichessTools-hideElement', !this.options.side || !this.options.side_streams);
        $('main .lobby__spotlights').toggleClassSafe('lichessTools-hideElement', !this.options.side || !this.options.side_spotlights);
        $('main .lobby__timeline').toggleClassSafe('lichessTools-hideElement', !this.options.side || !this.options.side_timeline);
        $('main .lobby__app').toggleClassSafe('lichessTools-hideElement', !this.options.app);
        $('main .lobby__app').find('div[data-id="1+0"],div[data-id="2+1"]')
          .toggleClassSafe('lichessTools-hideElement', !this.options.app || !this.options.app_bullet);
        $('main .lobby__app').find('div[data-id="3+0"],div[data-id="3+2"],div[data-id="5+0"],div[data-id="5+3"]')
          .toggleClassSafe('lichessTools-hideElement', !this.options.app || !this.options.app_blitz);
        $('main .lobby__app').find('div[data-id="10+0"],div[data-id="10+5"],div[data-id="15+10"]')
          .toggleClassSafe('lichessTools-hideElement', !this.options.app || !this.options.app_rapid);
        $('main .lobby__app').find('div[data-id="30+0"],div[data-id="30+20"]')
          .toggleClassSafe('lichessTools-hideElement', !this.options.app || !this.options.app_classical);
        $('main .lobby__table').toggleClassSafe('lichessTools-hideElement', !this.options.table);
        $('main .lobby__tv').toggleClassSafe('lichessTools-hideElement', !this.options.tv);
        $('main .lobby__blog').toggleClassSafe('lichessTools-hideElement', !this.options.blog);
        $('main .lobby__puzzle').toggleClassSafe('lichessTools-hideElement', !this.options.puzzle);
        $('main .lobby__support').toggleClassSafe('lichessTools-hideElement', !this.options.support);
        $('main .lobby__feed').toggleClassSafe('lichessTools-hideElement', !this.options.feed);
        $('main .lobby__tournaments-simuls').toggleClassSafe('lichessTools-hideElement', !this.options.tours);
        $('main .lobby__about').toggleClassSafe('lichessTools-hideElement', !this.options.about);

        if (this.options.side && !this.options.side_timeline && this.options.feed) {
          if (!$('.lobby__side').parent().is('.lobby__feed')) {
            $('.lobby__feed').appendTo('.lobby__side');
          }
        } else {
          if (!$('.lobby__side .lobby__feed').parent().is('main.lobby')) {
            $('.lobby__side .lobby__feed').appendTo('main.lobby');
          }
        }

        $('.lichessTools-recentGames').remove();
        const userId = lt.getUserId();
        if (userId && this.options.recentGames) {
          const playAgainstComputerTitle = lt.global.i18n?.site?.playAgainstComputer || null;
          $('button.lobby__start__button--ai').attr('title',playAgainstComputerTitle);
          const container = $('<div class="lichessTools-recentGames">')
            .append($('<div class="header">').text(trans.noarg('recentGamesHeaderText')))
            .insertAfter('.lobby__start');
          const text = await lt.api.game.getUserPgns(userId,{ moves: false, max: 8 });
          const co = lt.chessops;
          if (!co) {
            lt.global.setTimeout(this.applyLobbyElements,100);
            return;
          }
          const { parsePgn } = co.pgn;
          const results = [];
          const games = parsePgn(text);
          for (const game of games) {
            const site = game.headers.get('Site');
            const variant = game.headers.get('Variant');
            const variantClass = variant
              ? variant.toLowerCase()
              : 'standard';
            const timeControl = game.headers.get('TimeControl');
            let timeControlClass =  lt.getGameTime(timeControl);
            if (timeControlClass == '-') timeControlClass = 'correspondence';
            const white = game.headers.get('White');
            const black = game.headers.get('Black');
            const userWhite = white?.toLowerCase() == userId;
            const opponentId = userWhite ? black : white;
            const opponentRating = userWhite ? +game.headers.get('BlackElo') : game.headers.get('WhiteElo');
            const href = site + (userWhite?'':'/black');
            const result = game.headers.get('Result') || '*';
            let resultClass = '';
            if (result === '1-0') resultClass = userWhite?'win':'loss';
            if (result === '0-1') resultClass = userWhite?'loss':'win';
            results.push({
             href,
             variantClass,
             timeControlClass,
             opponentId,
             opponentRating,
             resultClass,
             userWhite
            });
          }
          const users = await lt.api.user.getUsers([...new Set(results.map(r=>r.opponentId).filter(id=>id))]);
          for (const result of results) {
            const user = users.find(u=>u.id == result.opponentId);
            if (user) {
              result.opponentName = (user.title?user.title+' ':'') + user.username;
            }
            const name = result.opponentName || result.opponentId;
            $('<a class="game">')
              .addClass(result.variantClass)
              .addClass(result.resultClass)
              .addClass(result.timeControlClass)
              .toggleClass('white',result.userWhite)
              .attr('href',result.href)
              .append($('<span>').text(name+' '+result.opponentRating))
              .appendTo(container);
          }
          $('<a class="moreGames">')
            .attr('href',`https://lichess.org/@/${userId}/search#games`)
            .text(trans.noarg('moreGamesText'))
            .appendTo(container);
        }
      }
    };

    updateCounters = async ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const countersElem = $('.lobby__counters');
      if (!countersElem.length) return;
      let container = countersElem.find('.lichessTools-extraCounters');
      if (!container.length) {
        container = $('<span class="lichessTools-extraCounters">')
          .append('<span class="total">')
          .append('<span class="year">')
          .append('<span class="month">')
          .append('<span class="day">')
          .appendTo(countersElem);
      }
      const gamesInPlay = +(countersElem.find('a[href="/games"] strong').text().replaceAll(/,/g,'')) || 0;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      if (!this.explorerInfo) {
        const startFen = encodeURIComponent('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        let data = await lt.net.json(`https://explorer.lichess.ovh/lichess?fen=${startFen}`,{ noUserAgent:true });
        if (!data) return;
        const explorerInfo = {};
        explorerInfo.totalGames = (+data.white || 0)+(+data.draws || 0)+(+data.black || 0);
        const monthText = data.recentGames?.[0]?.month;
        if (monthText) {
          const m = /^(?<year>\d+)-(?<month>\d+)$/.exec(monthText)
          explorerInfo.dbYear = +m.groups.year;
          explorerInfo.dbMonth = +m.groups.month;
          explorerInfo.monthText = monthText;
        } else {
          const date = new Date();
          date.setMonth(date.getMonth() - 1);
          const month = date.getMonth() + 1;
          explorerInfo.dbYear = year;
          explorerInfo.dbMonth = month;
          explorerInfo.monthText = `${year}-${month.padStart(2, '0')}`;
        }
        data = await lt.net.json(`https://explorer.lichess.ovh/lichess?fen=${startFen}&since=${explorerInfo.monthText}&until=${explorerInfo.monthText}`,{ noUserAgent:true });
        if (!data) return;
        explorerInfo.monthGames = (+data.white || 0)+(+data.draws || 0)+(+data.black || 0);
        this.explorerInfo=explorerInfo;
      }
      const millisecondsPerMonth = 365.25*86400*1000/12;

      const lastDateInDb = new Date(this.explorerInfo.dbYear,this.explorerInfo.dbMonth,1);
      const qMonth = (currentDate-lastDateInDb) / millisecondsPerMonth;
      const totalGames = Math.round(this.explorerInfo.totalGames+this.explorerInfo.monthGames*qMonth+gamesInPlay);

      const startOfYear = new Date(year, 0, 1, 0, 0, 0);
      const startOfNextYear = new Date(year + 1, 0, 1, 0, 0, 0);
      const qYear = (currentDate - startOfYear) / (startOfNextYear - startOfYear);
      const yearGames = Math.round(this.explorerInfo.monthGames*12*qYear)+gamesInPlay;

      const startOfMonth = new Date(year, month-1, 1);
      const startOfNextMonth = new Date(year, month, 1);
      const monthGames = Math.round((currentDate - startOfMonth) / (startOfNextMonth - startOfMonth) * this.explorerInfo.monthGames + gamesInPlay) ;
      const daysPerMonth = (startOfNextMonth-startOfMonth)/86400000;
      
      const startOfDay = new Date(year, month-1, currentDate.getDate());
      const startOfNextDay = new Date(year, month-1, currentDate.getDate()+1);
      const dayGames = Math.round((currentDate - startOfDay) / (startOfNextDay - startOfDay) * this.explorerInfo.monthGames/daysPerMonth + gamesInPlay) ;

      const formatter = new Intl.NumberFormat('en-US');
      container.find('.total').text(trans.pluralSame('totalGamesPlayed',formatter.format(totalGames)));
      container.find('.year').text(trans.pluralSame('yearGamesPlayed',formatter.format(yearGames)));
      container.find('.month').text(trans.pluralSame('monthGamesPlayed',formatter.format(monthGames)));
      container.find('.day').text(trans.pluralSame('dayGamesPlayed',formatter.format(dayGames)));
      this.extraCountersTimeout = lt.global.setTimeout(this.updateCounters,lt.random()*1500);
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('mainPageElements');
      this.logOption('Lobby page elements', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const userId = lt.getUserId();
      this.options = {
        get side() {
          return lt.isOptionSet(value, 'side')
                   ? this.side_streams || this.side_spotlights || this.side_timeline
                   : false;
        },
        get app_all() {
          return this.app_bullet && this.app_blitz && this.app_rapid && this.app_classical;
        },
        side_streams: lt.isOptionSet(value, 'side_streams'),
        side_spotlights: lt.isOptionSet(value, 'side_spotlights'),
        side_timeline: userId && lt.isOptionSet(value, 'side_timeline'),
        app: lt.isOptionSet(value, 'app'),
        app_bullet: lt.isOptionSet(value, 'app_bullet'),
        app_blitz: lt.isOptionSet(value, 'app_blitz'),
        app_rapid: lt.isOptionSet(value, 'app_rapid'),
        app_classical: lt.isOptionSet(value, 'app_classical'),
        table: lt.isOptionSet(value, 'table'),
        tv: lt.isOptionSet(value, 'tv'),
        blog: lt.isOptionSet(value, 'blog'),
        puzzle: lt.isOptionSet(value, 'puzzle'),
        support: lt.isOptionSet(value, 'support'),
        feed: lt.isOptionSet(value, 'feed'),
        tours: lt.isOptionSet(value, 'tours'),
        about: lt.isOptionSet(value, 'about'),
        extraCounters: lt.isOptionSet(value, 'extraCounters'),
        recentGames: lt.isOptionSet(value, 'recentGames'),
        get allSet() {
          return this.side && this.app && this.app_all && this.table && this.tv && this.blog &&
            this.puzzle && this.support && this.feed && this.tours && this.about;
        },
        get noneSet() {
          return !this.side && !this.app && !this.table && !this.tv && !this.blog &&
            !this.puzzle && !this.support && !this.feed && !this.tours && !this.about;
        }
      };
      if (!this.options.side_streams && !this.options.side_spotlights && !this.options.side_timeline) {
        this.options.side_streams = true;
        this.options.side_spotlights = true;
        this.options.side_timeline = true;
      }
      if (!this.options.app_bullet && !this.options.app_blitz && !this.options.app_rapid && !this.options.app_classical) {
        this.options.app_bullet = true;
        this.options.app_blitz = true;
        this.options.app_rapid = true;
        this.options.app_classical = true;
      }
      $('main.lobby').observer()
        .off('.lobby__app-pools',this.applyLobbyElements);
      if (this.options.allSet || this.options.noneSet) {
        if (this.initialGrid) {
          $('main')
            .removeClass('lichessTools-lobbyPlay')
            .css('grid-template-areas', '');
          $('main.lobby .lichessTools-hideElement')
            .removeClass('lichessTools-hideElement');
        }
        return;
      }
      this.isPlay = false;
      if (!this.options.app) {
        if (!lt.isMobile()) {
          $('#topnav > section:first-child > a').attr('href', '/#play');
        }
        this.isPlay = lt.global.location.hash == '#play';
      } else {
        $('#topnav > section:first-child > a').attr('href', '/');
      }
      if (!$('main').is('.lobby')) return;
      $('.lichessTools-extraCounters').remove();
      lt.global.clearTimeout(this.extraCountersTimeout);
      if (this.options.extraCounters) {
        this.extraCountersTimeout = lt.global.setTimeout(this.updateCounters,1000);
      }
      if (!this.options.app) {
        $(lt.global).off('hashchange', this.hashChange);
        $(lt.global).on('hashchange', this.hashChange);
      }
      this.applyLobbyElements();
      $('main.lobby').observer()
        .on('.lobby__app-pools',this.applyLobbyElements);
    }
  }
  LiChessTools.Tools.MainPageElements = MainPageElementsTool;
})();
