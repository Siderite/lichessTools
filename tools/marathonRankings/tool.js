(() => {
  class MarathonRankingsTool extends LiChessTools.Tools.ToolBase {

    // Where the page lives: the community /player with a hash. The tool takes
    // the player page over and leaves its subnav in place.
    marathonRankingsPageUrl = '/player';
    marathonRankingsHash = '#marathon';

    // The numbers the board spends, edited here rather than carried as preferences:
    // a season field is 21k players wide and its standing answers ten rows a page.
    // The year count spans whole seasons, so three years back index twelve season
    // slugs; the ones that have not started yet read 404 and are skipped.
    marathonRankingsYears = 3;
    marathonRankingsRows = 25;
    marathonRankingsPageMs = 400;
    marathonRankingsSeasonMs = 800;
    // A finished season event answers the same rows forever; an ongoing one moves.
    marathonRankingsStaleMs = 6 * 60 * 60 * 1000;
    marathonRankingsLiveMs = 5 * 60 * 1000;

    preferences = [
      {
        name: 'marathonRankings',
        category: 'community',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.community': 'Community',
        'options.marathonRankings': 'Marathon rankings page',
        'marathonRankingsPageTitle': 'Marathon rankings - LiChess Tools',
        'marathonRankingsPageMenuText': 'Marathon rankings',
        'marathonRankingsPageHeader': 'Marathon rankings',
        'marathonRankingsPointsColumn': 'points',
        'marathonRankingsBoardText': 'Stamina board',
        'marathonRankingsPlayerColumn': 'player',
        'marathonRankingsGamesColumn': 'games',
        'marathonRankingsSeasonsColumn': 'seasons',
        'marathonRankingsTopBulletText': 'top bullet',
        'marathonRankingsTopBlitzText': 'top blitz',
        'marathonRankingsError': 'Error reading the marathon standings',
        'marathonRankingsOpenTitle': 'details'
      },
      'ro-RO': {
        'options.community': 'Comunitate',
        'options.marathonRankings': 'Pagin\u0103 clasament maratoane',
        'marathonRankingsPageTitle': 'Clasament maratoane - LiChess Tools',
        'marathonRankingsPageMenuText': 'Clasament maratoane',
        'marathonRankingsPageHeader': 'Clasament maratoane',
        'marathonRankingsPointsColumn': 'puncte',
        'marathonRankingsBoardText': 'Tabel rezisten\u0163\u0103',
        'marathonRankingsPlayerColumn': 'juc\u0103tor',
        'marathonRankingsGamesColumn': 'partide',
        'marathonRankingsSeasonsColumn': 'sezoane',
        'marathonRankingsTopBulletText': 'top bullet',
        'marathonRankingsTopBlitzText': 'top blitz',
        'marathonRankingsError': 'Eroare la citirea situa\u0163iei maratoanelor',
        'marathonRankingsOpenTitle': 'detalii'
      }
    };


    // The slug of a season event is the id Lichess answers on, so indexing the
    // runs of a marathon means spelling every season slug of each year back -
    // only the two-digit year moves.
    seasonSlugs(years, year) {
      const result = [];
      for (let back = 0; back < years; back++) {
        const suffix = String((year - back + 100) % 100).padStart(2, '0');
        for (const season of ['spring', 'summer', 'autumn', 'winter']) {
          result.push(season + suffix);
        }
      }
      return result;
    }

    // One standing row, as the board keeps it. The sheet of a player holds one
    // character per game they played, which is the stamina figure Lichess publishes
    // for a player that is not on the podium.
    standingRow(player) {
      return {
        id: (player.name || '').toLowerCase(),
        name: player.name,
        title: player.title,
        rank: +player.rank,
        rating: +player.rating,
        points: +player.score,
        games: player.sheet && player.sheet.scores ? player.sheet.scores.length : 0
      };
    }

    // Games first, then points, then name, so the order is stable across reads.
    boardOrder(a, b) {
      return b.games - a.games
        || b.points - a.points
        || (a.name || '').localeCompare(b.name || '')
        || b.rating - a.rating;
    }

    // What one player did over the indexed seasons: one row per player, whatever
    // number of seasons they showed up in.
    aggregateSeasons(rowsBySeason) {
      const byId = {};
      for (const slug in rowsBySeason) {
        for (const row of rowsBySeason[slug]) {
          const entry = byId[row.id] || (byId[row.id] = {
            id: row.id,
            name: row.name,
            title: row.title,
            games: 0,
            points: 0,
            rating: 0,
            seasons: []
          });
          entry.games += row.games;
          entry.points += row.points;
          if (row.rating > entry.rating) entry.rating = row.rating;
          entry.seasons.push(slug);
        }
      }
      return Object.values(byId);
    }

    // A board row that holds one of Lichess's own rating places says which one.
    markRatingPlaces(board, placesByPerf) {
      for (const perf in placesByPerf) {
        const places = placesByPerf[perf];
        for (const entry of board) {
          if (places[entry.id]) {
            entry['top' + perf.charAt(0).toUpperCase() + perf.slice(1)] = places[entry.id];
          }
        }
      }
    }

    // One season event read through: its metadata plus the rows the board spends.
    // A slug the season has not run under answers 404, which reads as null.
    async fetchSeason(slug, rows) {
      const lt = this.lichessTools;
      const key = 'LiChessTools.marathonRankings-' + slug;
      const now = lt.global.Date.now();
      const cached = lt.storage.get(key);
      const freshMs = cached?.finished ? this.marathonRankingsStaleMs : this.marathonRankingsLiveMs;
      if (cached && cached.rows.length >= rows && cached.at > now - freshMs) return cached;

      const read = await lt.api.tournament.getStandings(slug, 1, { ignoreStatuses: [404] });
      if (!read) return null;

      const kept = [];
      const pages = Math.ceil(rows / 10);
      for (let page = 1; page <= pages; page++) {
        const data = page == 1 ? read : await lt.api.tournament.getStandings(slug, page, { ignoreStatuses: [404] });
        const players = data?.standing?.players;
        if (!players?.length) break;
        players.forEach(player => kept.push(this.standingRow(player)));
        if (page < pages) await lt.timeout(this.marathonRankingsPageMs);
      }
      if (kept.length > rows) kept.length = rows;

      const meta = {
        slug: slug,
        fullName: read.fullName,
        perfKey: read.perf?.key,
        startsAt: read.startsAt,
        finished: !!read.isFinished,
        nbPlayers: read.nbPlayers,
        totalGames: read.stats?.games,
        at: lt.global.Date.now(),
        rows: kept
      };
      try {
        lt.storage.set(key, meta);
      } catch (e) {
        lt.global.console.debug('marathonRankings cache skipped:', e);
      }
      return meta;
    }

    // Lichess's own top 100 rating lists, kept as id to place.
    async fetchRatingPlaces(perfKey) {
      const lt = this.lichessTools;
      const key = 'LiChessTools.marathonRankings-top-' + perfKey;
      const now = lt.global.Date.now();
      const cached = lt.storage.get(key);
      if (cached && cached.at > now - this.marathonRankingsLiveMs) return cached.places;
      const users = await lt.api.user.getTopPlayers(perfKey, 100);
      const places = {};
      users.forEach((user, i) => places[user.id] = i + 1);
      try {
        lt.storage.set(key, { at: lt.global.Date.now(), places: places });
      } catch (e) {
        lt.global.console.debug('marathonRankings top cache skipped:', e);
      }
      return places;
    }

    // Adds the marathon link to the subnav of the community pages. We detect the
    // "Tournament shields" anchor rather than the URLs because the subnav with
    // that entry shows only on the community pages that carry it.
    addSubnavLink = () => {
      if (!this.options.enabled) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const pageHref = this.marathonRankingsPageUrl + this.marathonRankingsHash;
      $('nav.subnav__inner a.lichessTools-marathonRankings').remove();
      const shields = $('nav.subnav__inner a[href="/tournament/shields"]');
      if (!shields.length) return;
      const link = $('<a>')
        .addClass('lichessTools-marathonRankings')
        .text(trans.noarg('marathonRankingsPageMenuText'))
        .attr('title', trans.noarg('marathonRankingsPageTitle'))
        .attr('href', pageHref);
      shields.after(link);
    };

    // Takes the community /player page over for the marathon: keeps the subnav
    // of the page in place, replaces the rest with a community__leaders layout.
    processPage = async () => {
      if (!this.options.enabled) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('div.page-menu__content');
      if (!container.length) return;
      this._isMarathon = true;

      container.empty();
      container.addClass('lichessTools-marathonRankings');
      lt.global.document.title = trans.noarg('marathonRankingsPageTitle');

      $(`<a class="help-button" data-icon="${lt.icon.toEntity(lt.icon.InfoCircle)}" target="_blank">`)
        .attr('href','https://siderite.dev/blog/lichess-tools---user-manual#marathonRankings')
        .appendTo(container);
      const community = $('<div class="community__leaders">').appendTo(container);
      $('<h1>')
        .append($('<span>').text(trans.noarg('marathonRankingsPageHeader')))
        .appendTo(community);

      const leaderboards = $('<div class="leaderboards">')
        .appendTo(community);

      $('nav.subnav__inner a.active').removeClass('active');
      $('nav.subnav__inner a.lichessTools-marathonRankings').addClass('active');


      const spinner = $(lt.spinnerHtml).appendTo(leaderboards);

      const year = new Date().getFullYear();
      const seasons = [];
      let board = [];
      let shown = 0;
      try {
        for (const slug of this.seasonSlugs(this.marathonRankingsYears, year)) {
          const season = await this.fetchSeason(slug, this.marathonRankingsRows);
          if (!season) continue;
          if (new Date(season.startsAt).getTime() > lt.global.Date.now()) continue;
          seasons.push(season);
          await lt.timeout(this.marathonRankingsSeasonMs);
        }

        const rowsBySeason = {};
        seasons.forEach(season => rowsBySeason[season.slug] = season.rows);
        board = this.aggregateSeasons(rowsBySeason);
        const placesByPerf = {};
        for (const perf of ['bullet', 'blitz']) {
          placesByPerf[perf] = await this.fetchRatingPlaces(perf);
        }
        this.markRatingPlaces(board, placesByPerf);
        board.sort(this.boardOrder);
        shown = board.length < this.marathonRankingsRows ? board.length : this.marathonRankingsRows;
      } finally {
        spinner.remove();
      }

      for (const season of seasons) {
        const section = $('<section class="lichessTools-marathonRankings-season user-top">').appendTo(leaderboards);
        $('<h2>')
          .append($('<span>').text(season.fullName))
          .append($('<a>')
            .attr('href', '/tournament/' + season.slug)
            .attr('title', trans.noarg('marathonRankingsOpenTitle'))
            .attr('data-icon', lt.icon.GreaterThan)
          )
          .appendTo(section);
        const rows = $('<div class="rows">').appendTo(section);
        this.headRow({
          rank: '#',
          player: trans.noarg('marathonRankingsPlayerColumn'),
          games: trans.noarg('marathonRankingsGamesColumn'),
          points: trans.noarg('marathonRankingsPointsColumn')
        }).appendTo(rows);
        for (let i = 0; i < season.rows.length; i++) {
          const row = season.rows[i];
          this.rowElem(row,i+1).appendTo(rows);
        }
      }

      const boardSection = $('<section class="lichessTools-marathonRankings-board user-top">').appendTo(leaderboards);
      $('<h2>').text(trans.noarg('marathonRankingsBoardText')).appendTo(boardSection);
      const boardRows = $('<ol>').appendTo(boardSection);
      this.headRow({
        rank: '#',
        player: trans.noarg('marathonRankingsPlayerColumn'),
        games: trans.noarg('marathonRankingsGamesColumn'),
        points: trans.noarg('marathonRankingsPointsColumn'),
        seasons: trans.noarg('marathonRankingsSeasonsColumn')
      }).appendTo(boardRows);
      for (let i = 0; i < shown; i++) {
        this.rowElem(board[i], i + 1).appendTo(boardRows);
      }
    };

    rowElem(entry, rank) {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const row = $('<li>');
      if (rank) {
        const rankChar = entry.topBullet || entry.topBlitz
          ? lt.icon.Trophy
          : '#';
        $('<span class="rank">')
          .append($('<span class="char">').text(rankChar))
          .append($('<span>').text(rank))
          .appendTo(row);
      }
      const userLink = $('<a class="ulpt">')
                         .attr('href', '/@/' + entry.id)
                         .text(entry.name);
      if (entry.title) {
        userLink.prepend($('<span class="utitle">').text(entry.title));
      }
      $('<div class="player">')
        .append(userLink)
        .appendTo(row);
      $('<span class="games">')
        .text(''+entry.games)
        .appendTo(row);
      $('<span class="points">')
        .text(''+(entry.points || 0))
        .appendTo(row);
      if (entry.seasons?.length) {
        $('<span class="seasons">')
          .text(''+entry.seasons.length)
          .appendTo(row);
      }
      const places = $('<span class="places">')
        .appendTo(row);
      if (entry.topBullet || entry.topBlitz) {
        if (entry.topBullet) {
          places.append($('<span class="top topBullet">').text(trans.noarg('marathonRankingsTopBulletText')+' #'+entry.topBullet));
        }
        if (entry.topBlitz) {                 	
          places.append($('<span class="top topBlitz">').text(trans.noarg('marathonRankingsTopBlitzText')+' #'+entry.topBlitz));
        }
      }
      return row;
    }

    // The head of a table: a label per column, in the order the columns go.
    headRow(columns) {
      const $ = this.lichessTools.$;
      const head = $('<li class="head">');
      for (const column in columns) {
        head.append($('<span>').addClass(column).text(columns[column]));
      }
      return head;
    }


    hashchange = async () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      
      if (lt.location.hash == this.marathonRankingsHash) {
        await this.processPage()
         .catch(e => {
           lt.announce(trans.noarg('marathonRankingsError'));
           lt.global.console.warn('Error processing marathon rankings page',e);
         });
      } else
      if (this._isMarathon) {
        lt.location.reload();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('marathonRankings');
      this.logOption('Marathon Rankings', value);
      this.options = { enabled: !!value };
      this.addSubnavLink();
      if (lt.location.pathname !== this.marathonRankingsPageUrl) return;
      $(lt.global).off('hashchange', this.hashchange);
      if (value) {
        $(lt.global).on('hashchange', this.hashchange);
      }
      this.hashchange();
    }
  }

  LiChessTools.Tools.MarathonRankings = MarathonRankingsTool;
})();
