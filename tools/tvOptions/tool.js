(() => {
  class TvOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitContentLoaded'];

    preferences = [
      {
        name: 'tvOptions',
        category: 'TV',
        type: 'multiple',
        possibleValues: ['link', 'bookmark', 'streamerTv', 'friendsTv',/*'teamTv',*/'userTvHistory','stickyCategory'],
        defaultValue: 'link,bookmark,streamerTv,friendsTv,userTvHistory',
        advanced: false
      }
    ];

    upgrades = [
      { name:'tvOptions', value:'wakeLock', version: '2.4.0', type: 'obsolete' }
    ];

    intl = {
      'en-US': {
        'options.TV': 'TV',
        'options.tvOptions': 'Various TV options',
        'tvOptions.link': 'Link for current TV game',
        'tvOptions.bookmark': 'Bookmark for current TV game',
        'tvOptions.streamerTv': 'Streamers current games',
        'tvOptions.friendsTv': 'Friends current games',
        'tvOptions.teamTv': 'Team current games',
        'tvOptions.userTvHistory': 'Previous two games in player TV',
        'tvOptions.stickyCategory': 'Persistent TV channel',
        'friendsButtonTitle': 'LiChess Tools - games of your friends',
        'streamersButtonTitle': 'LiChess Tools - games of live streamers',
        'teamButtonTitle': 'LiChess Tools - games of your team',
        'streamers': 'Streamers',
        'friends': 'Friends',
        'noGames': 'No available games',
        'streamerLink': 'Watch the stream',
        'bookmarkGame': 'LiChess Tools - Bookmark this game',
        'fromLiChessTools': 'from LiChess Tools',
        'previouslyOnTV': 'Previously on %s TV'
      },
      'ro-RO': {
        'options.TV': 'TV',
        'options.tvOptions': 'Diverse op\u0163iuni pentru TV',
        'tvOptions.link': 'Link pentru jocul TV curent',
        'tvOptions.bookmark': 'Marcaj pentru jocul TV curent',
        'tvOptions.streamerTv': 'Jocurile streamerilor live',
        'tvOptions.friendsTv': 'Jocurile prietenilor t\u0103i',
        'tvOptions.teamTv': 'Jocurile \u00een echipa ta',
        'tvOptions.userTvHistory': 'Dou\u0103 partide precedente \u00een TVul juc\u0103torilor',
        'tvOptions.stickyCategory': 'Canal TV persistent',
        'friendsButtonTitle': 'LiChess Tools - jocurile prietenilor t\u0103i',
        'streamersButtonTitle': 'LiChess Tools - jocurile streamerilor live',
        'teamButtonTitle': 'LiChess Tools - jocurile echipei tale',
        'streamers': 'Streameri',
        'friends': 'Prieteni',
        'noGames': 'Nu sunt jocuri disponibile',
        'streamerLink': 'Urm\u0103re\u015Fte stream-ul',
        'bookmarkGame': 'LiChess Tools - Marca\u0163i aceast\u0103 partid\u0103',
        'fromLiChessTools': 'de la LiChess Tools',
        'previouslyOnTV': 'Anterior la %s TV'

      }
    };

    isTvPage = () => {
      const lt = this.lichessTools;
      return /\/tv\b/i.test(lt.global.location.pathname);
    };

    isGamesPage = () => {
      const lt = this.lichessTools;
      return /^\/games(\/|$)?/i.test(lt.global.location.pathname);
    };

    isBestTvPage = () => {
      const lt = this.lichessTools;
      return /^\/games(\/best)?\/?$/i.test(lt.global.location.pathname) && !location.hash;
    };

    isStreamerTvPage = () => {
      if (!this.options.streamerTv) return false;
      const lt = this.lichessTools;
      return /^\/games\/?$/i.test(lt.global.location.pathname) && location.hash == '#streamers';
    };

    isFriendsTvPage = () => {
      if (!this.options.friendsTv) return false;
      const lt = this.lichessTools;
      return /^\/games\/?$/i.test(lt.global.location.pathname) && location.hash == '#friends';
    };

    isTeamTvPage = () => {
      const lt = this.lichessTools;
      return /^\/games\/?$/i.test(lt.global.location.pathname) && location.hash == '#team';
    };

    updateTvOptionsButton = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;

      if (!this.isGamesPage()) return;

      if (this.options.streamerTv || this.options.friendsTv || this.options.teamTv) {
        if (lt.uiApi.overrides?.tvGamesOnFinish) {
          lt.uiApi.overrides.tvGamesOnFinish = lt.unwrapFunction(lt.uiApi.overrides.tvGamesOnFinish, 'tvOptions');
          lt.uiApi.overrides.tvGamesOnFinish = lt.wrapFunction(lt.uiApi.overrides.tvGamesOnFinish, {
            id: 'tvOptions',
            before: ($this, gameId) => {
              if (!this.isStreamerTvPage() && !this.isFriendsTvPage() && !this.isTeamTvPage()) return;
              $('main.tv-games div.page-menu__content.now-playing a[data-live="' + gameId + '"]').remove();
              this.updateTvOptionsPage();
              return false;
            }
          });
        }
      }

      const container = $('main.tv-games div.tv-channels');

      if (this.options.streamerTv) {
        const elem = $('a.lichessTools-streamers', container);
        if (this.isStreamerTvPage()) {
          lt.global.document.title = lt.global.document.title?.replace(new RegExp('^.*?'+lt.icon.BulletPoint), trans.noarg('streamers') + ' ' + lt.icon.BulletPoint);

          $('a.active:not(.lichessTools-streamers)', container).removeClass('active');
        }
        if (elem.length) {
          elem.toggleClass('active', this.isStreamerTvPage());
        } else {
          $(`<a href="/games#streamers" class="tv-channel lichessTools-streamers"><span data-icon="${lt.icon.toEntity(lt.icon.AnalogTv)}"><span><strong></strong></span></span></a>`)
            .attr('title', trans.noarg('streamersButtonTitle'))
            .insertAfter($('a.lichessTools-friends', container)[0] || $('a.best', container)[0])
            .toggleClass('active', this.isStreamerTvPage())
            .find('strong').text(trans.noarg('streamers'));
        }
      } else {
        $('a.lichessTools-streamers', container).remove();
      }

      if (this.options.friendsTv && lt.getUserId()) {
        const elem = $('a.lichessTools-friends', container);
        if (this.isFriendsTvPage()) {
          lt.global.document.title = lt.global.document.title?.replace(new RegExp('^.*?'+lt.icon.BulletPoint), trans.noarg('friends') + ' ' + lt.icon.BulletPoint);

          $('a.active:not(.lichessTools-friends)', container).removeClass('active');
        }
        if (elem.length) {
          elem.toggleClass('active', this.isFriendsTvPage());
        } else {
          $(`<a href="/games#friends" class="tv-channel lichessTools-friends"><span data-icon="${lt.icon.toEntity(lt.icon.User)}"><span><strong></strong></span></span></a>`)
            .attr('title', trans.noarg('friendsButtonTitle'))
            .insertAfter($('a.best', container))
            .toggleClass('active', this.isFriendsTvPage())
            .find('strong').text(trans.noarg('friends'));
        }
      } else {
        $('a.lichessTools-friends', container).remove();
      }

      if (this.options.teamTv && lt.getUserId()) {
        const elem = $('a.lichessTools-team', container);
        if (this.isTeamTvPage()) {
          lt.global.document.title = lt.global.document.title?.replace(new RegExp('^.*?' + lt.icon.BulletPoint), trans.noarg('team') + ' ' + lt.icon.BulletPoint);

          $('a.active:not(.lichessTools-team)', container).removeClass('active');
        }
        if (elem.length) {
          elem.toggleClass('active', this.isTeamTvPage());
        } else {
          $(`<a href="/games#team" class="tv-channel lichessTools-team"><span data-icon="${lt.icon.toEntity(lt.icon.Group)}"><span><strong></strong></span></span></a>`)
            .attr('title', trans.noarg('teamButtonTitle'))
            .insertAfter($('a.best', container))
            .toggleClass('active', this.isTeamTvPage())
            .find('strong').text(trans.noarg('team'));
        }
      } else {
        $('a.lichessTools-team', container).remove();
      }
    };

    getUserId = (user) => user?.toLowerCase().replace(/^\w+\s/, '');

    getUsers = (el) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      return $('span.mini-game__user', el).get()
        .map(e => {
          const cl = $(e).clone();
          cl.find('span:not(.lichessTools-userText),img').remove();
          return this.getUserId(cl.text().trim());
        });
    };

    refreshTimeControlsDirect = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('a.mini-game[data-tc]').each((i, e) => {
        const timeControl = lt.getGameTime($(e).attr('data-tc'));
        if (timeControl) {
          $(e).addClass(timeControl);
        }
      });
    };
    refreshTimeControls = this.lichessTools.debounce(this.refreshTimeControlsDirect, 100);

    _maxGamesCount = 30;
    refreshGames = async (playerIds, className, container, streamers) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;

      if (!playerIds?.length) return;
      const notFound = [...playerIds];
      let gamesCount = $('a.mini-game', container).length;
      $('a.mini-game', container).each((i, e) => {
        const users = this.getUsers(e);
        const players = users.filter(u => playerIds.includes(u));
        if (players.length) {
          lt.arrayRemoveAll(notFound, u => players.includes(u));
        } else {
          $(e).remove()
        }
      });
      if (notFound.length) {
        let p = 0;
        while (p < notFound.length) {
          if (p > 0) await lt.timeout(500);
          const arr = await lt.api.user.getUserStatus(notFound.slice(p, p + 100), { withGameMetas: true });
          p += 100;
          for (const data of arr.filter(i => i.playing)) {
            try {
              const text = await lt.api.user.getMini(data.id);
              if (!text) continue;
              const html = $('<x>' + text + '</x>').find('a.mini-game');
              if (!html.length) continue;

              const timeControl = lt.getGameTime(data.playing.clock, true);
              if (timeControl) {
                html.addClass(timeControl);
              }
              const variant = data.playing.variant || 'standard';
              html.addClass(variant);
              if (streamers) {
                $('<span>')
                  .addClass(className)
                  .append($('<a rel="noopener nofollow" target="_blank">')
                    .attr('href', '/streamer/' + data.id + '/redirect')
                    .text(trans.noarg('streamerLink')))
                  .appendTo(html);
              }
              $('label.lichessTools-noGames', container).remove();
              if (!$('a.mini-game[data-userId="' + data.id + '"]', container).length) {
                $(html).attr('data-userId', data.id).appendTo(container);
                gamesCount++;
                await lt.timeout(250);
                lt.uiApi.initializeDom(container[0]);
                if (gamesCount > this._maxGamesCount) return;
              }
            } catch (e) {
              console.warn('Error getting TV game for ', data.id, e);
            }
          }
        }
      }
    };

    get teamId() {
      const lt = this.lichessTools;
      if (this._teamId === undefined) {
        const teamId = lt.storage.get('LichessTools.teamId');
        this._teamId = teamId;
      }
      return this._teamId;
    }
    set teamId(value) {
      const lt = this.lichessTools;
      lt.storage.set('LichessTools.teamId', value);
      this._teamId = value;
    }

    getTeamPlayerIds = async () => {
      const lt = this.lichessTools;
      let teamId = this.teamId;
      if (!teamId) {
        const teams = await await lt.api.team.getUserTeams(lt.getUserId());
        teamId = teams[0]?.id;
      }
      if (!teamId) return [];
      const teamPlayers = (await lt.api.team.getTeamPlayers(teamId))?.map(u => u.id);
      return teamPlayers;
    };

    updateTvOptionsPageDirect = async () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const trans = lt.translator;
      if (lt.global.document.hidden) return;
      const userId = lt.getUserId();
      const container = $('main.tv-games div.page-menu__content.now-playing');
      if (!container.length) return;
      if (this.isBestTvPage()) {
        container.toggleClass('lichessTools-bestTv', this.options.streamerTv || this.options.friendsTv || this.options.teamTv);
      } else {
        container.removeClass('lichessTools-bestTv');
      }
      if (this.isStreamerTvPage()) {
        container.toggleClass('lichessTools-streamerTv', this.options.streamerTv);
        const playerIds = (await lt.api.streamer.getLiveStreamers())?.map(s => s.id);
        await this.refreshGames(playerIds, 'lichessTools-streamerTv', container, true);
      } else {
        container.removeClass('lichessTools-streamerTv');
      }
      if (userId && this.isFriendsTvPage()) {
        container.toggleClass('lichessTools-friendsTv', this.options.friendsTv);
        const playerIds = this.users_playing;
        await this.refreshGames(playerIds, 'lichessTools-friendsTv', container, false);
      } else {
        container.removeClass('lichessTools-friendsTv');
      }
      if (userId && this.isTeamTvPage()) {
        container.toggleClass('lichessTools-teamTv', this.options.teamTv);
        if (!$('select.lichessTools-teams', container).length) {
          const select = $('<select class="lichessTools-teams">')
            .on('change', ev => {
              this.teamId = select.val();
              this.updateTvOptionsPage();
            })
            .prependTo(container);
          const teams = await lt.api.team.getUserTeams(userId);
          for (const team of teams) {
            $('<option>')
              .attr('value', team.id)
              .text(team.name)
              .prop('selected', this.teamId == team.id)
              .appendTo(select);
          }
        }
        if (!$('div.spinner', container).length) {
          container.prepend(lt.spinnerHtml);
        }
        const playerIds = await this.getTeamPlayerIds();
        await this.refreshGames(playerIds, 'lichessTools-teamTv', container, false);
      } else {
        container.removeClass('lichessTools-teamTv');
      }
      if ($('a.mini-game', container).length) {
        $('label.lichessTools-noGames', container).remove();
      } else if (!$('label.lichessTools-noGames', container).length) {
        $('<label class="lichessTools-noGames">')
          .text(trans.noarg('noGames'))
          .appendTo(container);
      }
      lt.global.clearTimeout(this.updateTvTimeout);
      this.updateTvTimeout = lt.global.setTimeout(this.updateTvOptionsPage, 10000);
      this.refreshTimeControls();
    };
    updateTvOptionsPage = this.lichessTools.debounce(this.updateTvOptionsPageDirect, 1000);

    users_playing = [];

    following_onlines = (friends, data) => {
      if (this.onlinesInterval) {
        clearInterval(this.onlinesInterval);
        this.onlinesInterval = 0;
      }
      const lt = this.lichessTools;
      const $ = lt.$;
      this.users_playing = data?.playing?.map(this.getUserId) || [];
      this.updateTvOptionsPage();
    };
    enters = (userName, data) => {
      const lt = this.lichessTools;
      const userId = this.getUserId(userName);
      const isPlaying = data?.playing;
      if (isPlaying) {
        this.users_playing.push(userId);
        this.updateTvOptionsPage();
      }
    };
    leaves = (user) => {
      const lt = this.lichessTools;
      const userId = this.getUserId(user);
      lt.arrayRemoveAll(this.users_playing, u => u === userId);
      this.updateTvOptionsPage();
    };
    playing = (user) => {
      const userId = this.getUserId(user);
      this.users_playing.push(userId);
      this.updateTvOptionsPage();
    };
    stopped_playing = (user) => {
      const lt = this.lichessTools;
      const userId = this.getUserId(user);
      lt.arrayRemoveAll(this.users_playing, u => u === userId);
      this.updateTvOptionsPage();
    };

    requestOnlines = this.lichessTools.debounce(() => {
      const lt = this.lichessTools;
      if (lt.global.document.hidden) return;
      lt.uiApi.onlineFriends.request();
    }, 250);

    hashChange = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (this.isStreamerTvPage() || this.isFriendsTvPage() || this.isTeamTvPage()) {
        const container = $('main.tv-games div.page-menu__content.now-playing');
        container.empty();
        this.updateTvOptionsButton();
        this.updateTvOptionsPage();
      }
    };

    followingOnlinesRequests = 0;
    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('tvOptions');
      this.logOption('TV Options', value);
      this.options = {
        link: lt.isOptionSet(value, 'link'),
        bookmark: lt.isOptionSet(value, 'bookmark'),
        streamerTv: lt.isOptionSet(value, 'streamerTv'),
        friendsTv: lt.isOptionSet(value, 'friendsTv'),
        teamTv: lt.isOptionSet(value, 'teamTv'),
        userTvHistory: lt.isOptionSet(value, 'userTvHistory'),
        stickyCategory: lt.isOptionSet(value, 'stickyCategory'),
      };
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      $(lt.global).off('hashchange', this.hashChange);
      lt.uiApi.socket.events.off('close', this.hashChange);
      lt.pubsub.off('content-loaded', this.refreshTimeControls);
      if (this.options.friendsTv || this.options.streamerTv) {
        $(lt.global).on('hashchange', this.hashChange);
        lt.uiApi.socket.events.on('close', this.hashChange);
        lt.pubsub.on('content-loaded', this.refreshTimeControls);
        lt.global.setTimeout(this.hashChange, 100);
      }

      if (lt.getUserId()) {
        lt.uiApi.onlineFriends.events.off('onlines', this.following_onlines);
        lt.uiApi.onlineFriends.events.off('enters', this.enters);
        lt.uiApi.onlineFriends.events.off('leaves', this.leaves);
        lt.uiApi.onlineFriends.events.off('playing', this.playing);
        lt.uiApi.onlineFriends.events.off('stopped_playing', this.stopped_playing);
        if (this.options.friendsTv) {
          lt.uiApi.onlineFriends.events.on('onlines', this.following_onlines);
          lt.uiApi.onlineFriends.events.on('enters', this.enters);
          lt.uiApi.onlineFriends.events.on('leaves', this.leaves);
          lt.uiApi.onlineFriends.events.on('playing', this.playing);
          lt.uiApi.onlineFriends.events.on('stopped_playing', this.stopped_playing);

          this.followingOnlinesRequests = 0;
          clearInterval(this.onlinesInterval);
          this.onlinesInterval = setInterval(() => {
            if (!this.onlinesInterval) return;
            if (lt.global.document.visibilityState == 'hidden') return;
            this.requestOnlines();
            this.followingOnlinesRequests++;
            if (this.followingOnlinesRequests > 5) {
              clearInterval(this.onlinesInterval);
              lt.global.console.debug('Sent following-onlines too many times. Giving up.');
            }
          }, 5000);
        }
      }

      this.updateTvOptionsButton();
      this.updateTvOptionsPage();

      const tvOptions = this.options.link || this.options.bookmark || this.options.userTvHistory
        ? lt.getTvOptions()
        : null;

      const metaSection = $('div.game__meta section').eq(0);
      const header = $('div.header', metaSection);
      if (this.options.link || this.options.bookmark) {
        const gameId = tvOptions.gameId || lichess.analysis?.data.game?.id;
        if (gameId && gameId !== 'synthetic' && gameId !== 'broadcast') {
          if (this.options.link && !header.parent().is('a')) {
            const url = '/' + gameId + (tvOptions.isBlack ? '/black' : '/white');
            header.wrap($('<a>').attr('href', url).attr('title', 'LiChess Tools - ' + url));
          }
          if (this.options.bookmark && !header.has('a.bookmark').length) {
            const title = trans.noarg('bookmarkGame');
            $('div.setup', header)
              .prepend(
                $(`<a class="bookmark lichessTools-bookmark" href="/bookmark/${gameId}"><i data-icon="${lt.icon.toEntity(lt.icon.Star)}" class="on is3"></i><i data-icon="${lt.icon.toEntity(lt.icon.StarOutline)}" class="off is3"></i><span></span></a>`)
                  .attr('title', title)
              );
          }
        }
      } else {
        if (header.parent().is('a')) {
          header.unwrap();
        }
        $('a.bookmark.lichessTools', header).remove();
      }

      if (this.options.userTvHistory && tvOptions.isTv && tvOptions.user) {
        if (!$('div.tv-history').length) {
          let text = await lt.api.game.getUserPgns(tvOptions.user, {
            max: 2,
            tags: true,
            ongoing: false,
            finished: true
          });
          if (text) {
            const matches = [...text.matchAll(new RegExp('\\[Site.*?\\/([^"\\/]+)"\\][\\s\\S]*?\\[(Black|White)\\s+"' + lt.escapeRegex(tvOptions.user) + '"\\]', 'gi'))];
            if (matches.length) {
              const container = $('<div/>').addClass('now-playing');
              const translationText = trans.plural('previouslyOnTV', 1, tvOptions.user);
              const translationTitle = trans.noarg('fromLiChessTools');
              $('.round__underboard')
                .append($('<div class="tv-history"></div>')
                  .addClass('lichessTools-userHistory')
                  .append($('<h2/>')
                    .text(translationText)
                    .attr('title', translationTitle))
                  .append(container));
              for (const m of matches) {
                const gameId = m[1];
                const color = m[2];
                await lt.timeout(500);
                text = await lt.api.game.getMini(gameId, color);
                if (!text) continue;
                container.append(text);
              }
              lt.uiApi.initializeDom(container[0]);
            }
          }
        }
      } else {
        $('div.tv-history.lichessTools-userHistory').remove();
      }

      if (this.options.stickyCategory && this.isTvPage()) {
        const m = /^\/tv\b(?:\/(?<channel>[^\/]+))?/i.exec(lt.global.location.pathname);
        if (m) {
          let channel = m.groups?.channel;
          if (channel) {
            lt.storage.set('LiChessTools.TvChannel',channel);
          } else {
            channel = lt.storage.get('LiChessTools.TvChannel',channel);
            if (channel) {
              lt.global.location='/tv/'+channel;
            }
          }
        }
      }
    }
  }
  LiChessTools.Tools.TvOptions = TvOptionsTool;
})();
