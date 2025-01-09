(() => {
  class FriendsListTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties', 'InterceptEventHandlers', 'EmitContentLoaded'];

    preferences = [
      {
        name: 'openFriends',
        category: 'friends',
        type: 'single',
        possibleValues: ['default', 'open', 'menu', 'button', 'hidden'],
        defaultValue: 'menu',
        needsLogin: true
      },
      {
        name: 'liveFriendsPage',
        category: 'friends',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'onlineFriends': '%s online friends',
        'onlineFriends:one': '%s online friend',
        'onlineFriends:zero': 'Friends',
        'friendsMenu': 'LiChess Tools - friends you follow',
        'options.friends': 'Friends',
        'options.openFriends': 'Friends box',
        'openFriends.default': 'Default',
        'openFriends.open': 'Open',
        'openFriends.hidden': 'Hidden',
        'openFriends.menu': 'Menu',
        'openFriends.button': 'Button',
        'watchGames': 'Watch games',
        'enablePlayAlert': 'Unmute playing alert',
        'mutePlayAlert': 'Mute playing alert',
        'options.liveFriendsPage': 'Live friends page',
        'hideOfflineTitle': 'Online players',
        'hideNotPlayingTitle': 'Playing players',
        'hideMutedTitle': 'Not muted players',
        'hideInactiveTitle': 'Active players',
        'daysText:one': 'a day',
        'hoursText:one': 'an hr',
        'minutesText:one': 'a min',
        'daysText': '%s days',
        'hoursText': '%s hrs',
        'minutesText': '%s mins',
        'timeText': '%s ago',
        'blockedPlayersText': 'Blocked players',
        'blockedPlayersTitle': 'LiChess Tools - players you have blocked',
        'followersText': 'Followers',
        'followersTitle': 'LiChess Tools - players following you',
        'followersNumberTitle': '%s followers'
      },
      'ro-RO': {
        'onlineFriends': '%s prieteni online',
        'onlineFriends:one': 'un prieten online',
        'onlineFriends:zero': 'Prieteni',
        'friendsMenu': 'LiChess Tools - prieteni pe care \u00eei urm\u0103re\u015Fti',
        'options.friends': 'Prieteni',
        'options.openFriends': 'Sec\u0163iunea prieteni',
        'openFriends.default': 'Normal',
        'openFriends.open': 'Deschis\u0103',
        'openFriends.hidden': 'Ascuns\u0103',
        'openFriends.menu': 'Meniu',
        'openFriends.button': 'Buton',
        'watchGames': 'Vezi partide',
        'enablePlayAlert': 'Permite alerte c\u00E2nd joac\u0103',
        'mutePlayAlert': 'Nu permite alerte c\u00E2nd joac\u0103',
        'options.liveFriendsPage': 'Pagin\u0103 prieteni live',
        'hideOfflineTitle': 'Juc\u0103tori online',
        'hideNotPlayingTitle': 'Juc\u0103tori care joac\u0103',
        'hideMutedTitle': 'Juc\u0103tori cu alert\u0103 de joc permis\u0103',
        'hideInactiveTitle': 'Juc\u0103tori activi',
        'daysText:one': 'o zi',
        'hoursText:one': 'o or\u0103',
        'minutesText:one': 'un minut',
        'daysText': '%s zile',
        'hoursText': '%s ore',
        'minutesText': '%s minute',
        'timeText': 'acum %s',
        'blockedPlayersText': 'Juc\u0103tori bloca\u0163i',
        'blockedPlayersTitle': 'LiChess Tools - juc\u0103tori pe care i-ai blocat',
        'followersText': 'Urm\u0103ritori',
        'followersTitle': 'LiChess Tools - juc\u0103tori care te urm\u0103resc',
        'followersNumberTitle': '%s urm\u0103ritori'
      }
    }

    buttonStartIndex = 0;
    hideNotPlaying = false;
    buttonPageSize = 7;
    updateFriendsButton = () => {
      const lt = this.lichessTools;
      const value = this.options.openFriends;
      if (value !== 'menu' && value !== 'button') return;
      if (lt.global.document.hidden) {
        lt.global.requestAnimationFrame(lt.debounce(this.updateFriendsButton, 500));
        return;
      }
      const $ = lt.$;
      const trans = lt.translator;
      const myName = lt.getUserId();
      if (!myName) return;
      let container = $('div.lichessTools-onlineFriends', $('.site-buttons'));
      if (!container.length) {
        const title = trans.noarg('friendsMenu');
        container = $('<div class="lichessTools-onlineFriends"/>')
          .append($('<button class="toggle link">')
            .attr('title', title)
            .on('mouseover click', () => {
              this.requestOnlines();
            })
            .append($('<span class="data-count">')
              .attr('data-icon', lt.icon.Group))
          )
          .append($(`<div class="links dropdown">
                         <div class="pager prev" data-icon="${lt.icon.toEntity(lt.icon.UpTriangle)}"></div>
                         <button class="hideNotPlaying button button-empty" data-icon="${lt.icon.toEntity(lt.icon.AnalogTv)}"></button>
                         <div class="notifications"></div>
                         <div class="pager next" data-icon="${lt.icon.toEntity(lt.icon.DownTriangle)}"></div>
                       </div>`)
          )
          .insertBefore('.site-buttons div.dasher');
        const prev = $('div.pager.prev', container)
          .on('click', ev => {
            ev.preventDefault();
            if (prev.is('disabled')) return;
            this.buttonStartIndex -= this.buttonPageSize;
            this.updateFriendsButton();
          });
        const next = $('div.pager.next', container)
          .on('click', ev => {
            ev.preventDefault();
            if (next.is('disabled')) return;
            this.buttonStartIndex += this.buttonPageSize;
            this.updateFriendsButton();
          });
        $('button.hideNotPlaying', container)
          .attr('title', trans.noarg('hideNotPlayingTitle'))
          .on('click', ev => {
            ev.preventDefault();
            this.hideNotPlaying = !this.hideNotPlaying;
            this.updateFriendsButton();
          });
      }
      const items = this.hideNotPlaying
        ? this.user_data.playing
        : this.user_data.online;
      let atEnd = false;
      if (this.buttonStartIndex + this.buttonPageSize >= items.length) {
        this.buttonStartIndex = items.length - this.buttonPageSize;
        atEnd = true;
      }
      let atStart = false;
      if (this.buttonStartIndex <= 0) {
        this.buttonStartIndex = 0;
        atStart = true;
      }
      container
        .toggleClass('lichessTools-on', value === 'button')
        .toggleClass('lichessTools-somePlaying', !!this.user_data.playing.length);
      const span = $('button.toggle > span.data-count', container)
        .attr('data-count', this.user_data.online.length);
      $('div.pager.prev', container)
        .toggleClass('disabled', atStart);
      $('div.pager.next', container)
        .toggleClass('disabled', atEnd);
      const notifs = $('div.notifications', container).empty();
      const displayedItems = items.slice(this.buttonStartIndex, this.buttonStartIndex + this.buttonPageSize);
      for (const userId of displayedItems) {
        const isPlaying = this.user_data.playing.includes(userId);
        const timeControl = this.user_data.timeControls[userId];
        const playingClass = timeControl ? 'lichessTools-playing-' + timeControl : 'lichessTools-playing';
        const elem = $('<a class="user-link ulpt">')
          .attr('data-pt-pos', 'w')
          .toggleClass(playingClass, isPlaying)
          .toggleClass('lichessTools-playing', isPlaying)
          .attr('href', '/@/' + userId + (isPlaying ? '/tv' : ''))
          .append('<i>')
          .append($('<span class="content">')
            .text(this.user_data.names[userId] || userId))
          .appendTo(notifs);
        elem[0].dataset.href = '/@/' + userId;
      }
    };

    updateFriendsMenu = () => {
      const lt = this.lichessTools;
      const value = this.options.openFriends;
      if (value !== 'menu') return;
      if (lt.global.document.hidden) {
        lt.global.requestAnimationFrame(lt.debounce(this.updateFriendsMenu, 500));
        return;
      }
      const $ = lt.$;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const myName = lt.getUserId();
      if (!myName) return;
      if (!$('section.lichessTools-onlineFriends', $(this.menuParent)).length) {
        const friendsUrl = '/@/' + myName + '/following';
        const title = trans.noarg('friendsMenu');
        $(this.menuParent)
          .append($('<section class="lichessTools-onlineFriends"/>')
            .append($('<a/>').attr('href', friendsUrl)
              .attr('title', title)
              .attr('class', 'data-count')
              .on('mouseover', () => {
                if (!$.cached('body').is('.mobile')) {
                  this.requestOnlines();
                }
              })
              .on('click', ev => {
                if ($.cached('body').is('.mobile')) {
                  this.requestOnlines();
                  ev.preventDefault();
                }
              }))
            .append('<div role="group"/>')
          );
      }
      const section = $('section.lichessTools-onlineFriends', $(this.menuParent));
      const group = section.children('div').eq(0);
      const menu = section.children('a').eq(0);
      const friends = $('#friend_box a.user-link');
      const text = trans.pluralSame('onlineFriends', this.user_data.online.length);
      menu.text(text);
      menu.toggleClass('lichessTools-somePlaying', !!this.user_data.playing.length);
      $('section.lichessTools-onlineFriends > a')
        .attr('data-count', this.user_data.playing.length);
      const items = new Set($('a.user-link', group).get());

      const sameUser = (url1, url2) => {
        let m = /\/@\/([^\/\?#]+)/.exec(url1 || '');
        const user1 = this.getUserId(m && m[1]);
        m = /\/@\/([^\/\?#]+)/.exec(url2 || '');
        const user2 = this.getUserId(m && m[1])
        return user1 == user2;
      };

      friends.each((i, e) => {
        const href = $(e).attr('href');
        const m = /\/@\/([^\/\?#]+)/.exec(href);
        const user = this.getUserId(m && m[1]);
        const isPlaying = this.user_data.playing.includes(user);
        let friendMenu = group.find('a').filter((i, e2) => sameUser($(e2).attr('href'), href));
        if (friendMenu.is('.temp')) {
          friendMenu.remove();
          friendMenu = null;
        }
        if (!friendMenu?.length) {
          friendMenu = $(e).clone()
            .attr('data-pt-pos', 'e');
          group.append(friendMenu);
        }
        friendMenu[0].dataset.href = href;
        if (isPlaying) {
          const timeControl = this.user_data.timeControls[user];
          friendMenu
            .addClass('lichessTools-playing')
            .attr('href', '/@/' + user + '/tv');
          if (timeControl) friendMenu.addClass('lichessTools-playing-' + timeControl);
        } else {
          friendMenu
            .removeClass('lichessTools-playing')
            .attr('href', '/@/' + user);
        }
        items.delete(friendMenu[0]);
      });
      if (this.followingOnlinesRequests > 5 || !friends.length) {
        this.user_data.online.forEach(user => {
          const isPlaying = this.user_data.playing.includes(user);
          let friendMenu = group.find('a').filter((i, e2) => sameUser($(e2).attr('href'), '/@/' + user));
          if (!friendMenu.length) {
            const userName = this.user_data.names[user] || user;
            friendMenu = $('<a class="user-link temp">')
              .append('<i class="line"></i>' + userName)
              .attr('data-pt-pos', 'e')
              .appendTo(group);
            lichess.powertip?.manualUser(friendMenu[0]);
          }
          friendMenu[0].dataset.href = '/@/' + user;
          if (isPlaying) {
            const timeControl = this.user_data.timeControls[user];
            friendMenu
              .addClass('lichessTools-playing')
              .attr('href', '/@/' + user + '/tv');
            if (timeControl) friendMenu.addClass('lichessTools-playing-' + timeControl);
          } else {
            friendMenu
              .removeClass('lichessTools-playing')
              .attr('href', '/@/' + user);
          }
          items.delete(friendMenu[0]);
        });
      }
      items.forEach(e => {
        $(e).remove();
      });
    };

    scrollIfNeeded = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const needsScroll = !!$('.pager').filter((i, e) => {
        return !!lt.inViewport(e);
      }).length;
      if (needsScroll) {
        $('html').trigger('scroll');
        lt.global.setTimeout(this.scrollIfNeeded, 250);
      }
    };

    isFollowersPage = ()=>{
      const lt = this.lichessTools;
      return lt.global.location.hash == '#followers';
    };

    rows = {};
    friends = {};
    updateFriendsPageDirect = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const myName = lt.getUserId();
      if (!myName) return;
      if (!this.options.liveFriendsPage) return;
      if (!this.isLivePage) return;
      const isFavoritesOrBlocksOrFollowers = !this.isFriendsPage;
      if (lt.global.document.hidden) {
        lt.global.requestAnimationFrame(this.updateFriendsPage);
        return;
      }
      let header = $('.lichessTools-livePageHeader');
      if (!header.length) {
        header = $('<div class="lichessTools-livePageHeader">')
          .insertAfter('main.box div.box__top');
      }
      if (!isFavoritesOrBlocksOrFollowers && !$('.lichessTools-blockedPlayers',header).length) {
        $('<a class="lichessTools-blockedPlayers">')
          .attr('href','/@/'+myName+'/following#followers')
          .attr('title',trans.noarg('followersTitle'))
          .text(trans.noarg('followersText'))
          .prependTo(header);
      }
      if (!isFavoritesOrBlocksOrFollowers && !$('.lichessTools-followers',header).length) {
        $('<a class="lichessTools-followers">')
          .attr('href','/rel/blocks')
          .attr('title',trans.noarg('blockedPlayersTitle'))
          .text(trans.noarg('blockedPlayersText'))
          .prependTo(header);
      }
      if (!$('.lichessTools-liveButtons',header).length) {
        const liveButtons = $('<div>')
          .addClass('lichessTools-liveButtons')
          .append($(`<i data-icon="${lt.icon.toEntity(lt.icon.Antichess)}" data-role="hideInactive">`)
            .attr('title', trans.noarg('hideInactiveTitle'))
            .on('click', () => {
              $('main').toggleClass('lichessTools-hideInactive');
              this.scrollIfNeeded();
            }))
          .append($(`<i data-icon="${lt.icon.toEntity(lt.icon.DiscOutline)}" data-role="hideOffline">`)
            .attr('title', trans.noarg('hideOfflineTitle'))
            .on('click', () => {
              $('main').toggleClass('lichessTools-hideOffline');
              this.scrollIfNeeded();
            }))
          .append($(`<i data-icon="${lt.icon.toEntity(lt.icon.AnalogTv)}" data-role="hideNotPlaying">`)
            .attr('title', trans.noarg('hideNotPlayingTitle'))
            .on('click', () => {
              $('main').toggleClass('lichessTools-hideNotPlaying');
              this.scrollIfNeeded();
            }));
        if (!isFavoritesOrBlocksOrFollowers) {
          liveButtons
            .append($(`<i data-icon="${lt.icon.toEntity(lt.icon.BellOutline)}" data-role="hideMuted">`)
              .attr('title', trans.noarg('hideMutedTitle'))
              .on('click', () => {
                $('main').toggleClass('lichessTools-hideMuted');
                this.scrollIfNeeded();
              }))
          .appendTo(header);
        }
      }
      const watchGamesTitle = trans.noarg('watchGames');
      const enablePlayingAlertTitle = trans.noarg('enablePlayAlert');
      const mutePlayingAlertTitle = trans.noarg('mutePlayAlert');
      const hasAlerts = this.options.friendsPlaying;
      $('main').addClass('lichessTools-friendsPage');
      $('main').toggleClass('lichessTools-alerts', hasAlerts);
      this.rows = {};
      const table = $('table.slist div.relation-actions').closest('table');
      $('tr', table).each((i, tr) => {
        const row = $(tr);
        let actions = $('div.relation-actions', tr);
        if (!actions.length && !row.is('.pager')) {
          actions = $('<div class="relation-actions">');
          $('<td>')
            .append(actions)
            .appendTo(tr);
        }
        const userLink = $('td:first-child a[href]', row).attr('href');
        if (!userLink) return;
        const m = /\/@\/([^\/\?#]+)/.exec(userLink);
        const user = this.getUserId(m && m[1]);
        if (!user) return;
        this.rows[user] = row;
        if (!this.isFollowersPage() && !actions.find('a.lichessTools-tv')[0]) {
          $(`<a class="text lichessTools-tv" data-icon="${lt.icon.toEntity(lt.icon.AnalogTv)}"></a>`)
            .attr('href', '/@/' + user + '/tv')
            .attr('title', watchGamesTitle)
            .prependTo(actions);
        }
        if (!isFavoritesOrBlocksOrFollowers && hasAlerts && !actions.find('a.lichessTools-mute')[0]) {
          $(`<a class="text lichessTools-mute" data-icon="${lt.icon.toEntity(lt.icon.BellOutline)}"></a>`)
            .attr('title', mutePlayingAlertTitle)
            .on('click', ev => {
              ev.preventDefault();
              lt.pubsub.emit('lichessTools.mutePlayer', user);
              this.updateFriendsPage();
            })
            .appendTo(actions);
        }
        const lastAt = $('time.set',row).attr('datetime');
        if (lastAt) {
          const time = Date.now()-Date.parse(lastAt);
          const inactive = time>1*86400*365.25*1000;
          row.toggleClass('lichessTools-inactive',inactive);
        }
      });
      let secondUpdate = false;
      const hasPages = !!$('tr.pager', table).length;
      if (!isFavoritesOrBlocksOrFollowers && !hasPages) {
        for (const user of this.user_data.online) {
          let row = this.rows[user];
          if (row) continue;
          row = $(`<tr class="paginated">
      <td><a class="user-link ulpt" href="/@/`+ user + `"><i class="line"></i>` + user + `</a></td>
      <td>?</td>
      <td>?</td>
      <td><div class="relation-actions btn-rack"></div></td>
  </tr>`);
          $('tbody', table).append(row);
          this.rows[user] = row;
          secondUpdate = true;
        }
      }
      if (secondUpdate) {
        this.updateFriendsPage();
        return;
      }
      const mutedPlayers = this.options.mutedPlayers || [];
      for (const user in this.rows) {
        let friend = this.friends[user];
        if (!friend) {
          friend = { userId: user };
          this.friends[user] = friend;
        }
      }
      for (const user in this.rows) {
        const row = this.rows[user];
        if (!row) continue;
        const isMuted = mutedPlayers.includes(user);
        row.toggleClass('lichessTools-muted', isMuted);
        $('a.lichessTools-mute', row)
          .attr('title', isMuted ? enablePlayingAlertTitle : mutePlayingAlertTitle);
        const isOnline = this.user_data.online.includes(user);
        const isPlaying = this.user_data.playing.includes(user);
        row.toggleClass('lichessTools-online', isOnline)
          .toggleClass('lichessTools-playing', isPlaying);
        $('td:first-child>a', row)
          .toggleClass('online', isOnline)
          .toggleClass('offline', !isOnline);
      }
    };
    updateFriendsPage=this.lichessTools.debounce(this.updateFriendsPageDirect,100);

    getTimeText = (value) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      let result;
      const days = Math.round(value / 86400000);
      if (days) {
        result = trans.plural('daysText', days, days);
      } else {
        const hours = Math.round(value / 3600000);
        if (hours) {
          result = trans.plural('hoursText', hours, hours);
        } else {
          const minutes = Math.round(value / 60000);
          result = trans.plural('minutesText', minutes, minutes)
        }
      }
      result = trans.pluralSame('timeText', result);
      return result;
    };

    getUserId = (user) => user?.toLowerCase().replace(/^\w+\s/, '');

    user_data = {
      names: {},
      online: [],
      playing: [],
      timeControls: {}
    };
    following_onlines = (friends, data) => {
      if (this.onlinesInterval) {
        clearInterval(this.onlinesInterval);
        this.onlinesInterval = 0;
        this.onFirstFollowingOnlines();
      }
      const lt = this.lichessTools;
      const $ = lt.$;
      this.user_data.names = {};
      data?.d?.forEach(name => {
        const userId = this.getUserId(name);
        this.user_data.names[userId] = name;
        let friend = this.friends[userId];
        if (!friend) {
          friend = { userId: userId };
          this.friends[userId] = friend;
        }
      });
      this.user_data.online = data?.d?.map(this.getUserId) || [];
      this.user_data.playing = data?.playing?.map(this.getUserId) || [];
      this.user_data.timeControls = {};
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };
    enters = (userName, data) => {
      const lt = this.lichessTools;
      const userId = this.getUserId(userName);
      this.user_data.names[userId] = userName;
      if (!this.user_data.online.includes(userId)) this.user_data.online.push(userId);
      const isPlaying = data?.playing;
      if (isPlaying) {
        if (!this.user_data.playing.includes(userId)) this.user_data.playing.push(userId);
      } else {
        lt.arrayRemoveAll(this.user_data.playing, u => u === userId);
        this.user_data.timeControls[userId] = undefined;
      }
      let friend = this.friends[userId];
      if (!friend) {
        friend = { userId: userId };
        this.friends[userId] = friend;
      }
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };
    leaves = (user) => {
      const lt = this.lichessTools;
      user = this.getUserId(user);
      //this.user_data.names[user]=undefined;
      lt.arrayRemoveAll(this.user_data.online, u => u === user);
      lt.arrayRemoveAll(this.user_data.playing, u => u === user);
      this.user_data.timeControls[user] = undefined;
      let friend = this.friends[user];
      if (!friend) {
        friend = { userId: user };
        this.friends[user] = friend;
      }
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };
    playing = (user) => {
      user = this.getUserId(user);
      if (!this.user_data.online.includes(user)) this.user_data.online.push(user);
      if (!this.user_data.playing.includes(user)) this.user_data.playing.push(user);
      let friend = this.friends[user];
      if (!friend) {
        friend = { userId: user };
        this.friends[user] = friend;
      }
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };
    stopped_playing = (user) => {
      const lt = this.lichessTools;
      user = this.getUserId(user);
      lt.arrayRemoveAll(this.user_data.playing, u => u === user);
      this.user_data.timeControls[user] = undefined;
      let friend = this.friends[user];
      if (!friend) {
        friend = { userId: user };
        this.friends[user] = friend;
      }
      this.updateFriendsPage();
      this.updateFriendsMenu();
      this.updateFriendsButton();
    };

    onFirstFollowingOnlines = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const friendsBoxMode = this.options.openFriends;

      switch (friendsBoxMode) {
        case true:
        case 'true':
        case 'open':
        case 'button':
        case 'menu': {
          if ($('#friend_box .content_wrap').is('.none')) {
            const elem = $('.friend_box_title')[0];
            const handler = lt.getEventHandlers(elem, 'click')[0];
            if (handler) {
              handler.apply(elem);
            } else {
              if (!$('dialog[open]').length) {
                $('.friend_box_title').trigger('click');
              }
            }
          }
        }
          break;
        case 'hidden':
        default: {
        }
          break;
      }
    };

    getFollowingOnlinesByApi = async () => {
      const lt = this.lichessTools;
      //const json=await lt.net.json('/api/rel/following');
      // TODO use this if made to work with logged in user https://github.com/lichess-org/lila/issues/14906
      lt.global.console.debug('Sent following-onlines too many times. Giving up.');
    };

    requestOnlines = () => {
      const lt = this.lichessTools;
      if (lt.global.document.hidden) return;
      lt.uiApi.onlineFriends.request();
      this.requestOnlinesApi();
    };
    requestOnlinesApi = async () => {
      const lt = this.lichessTools;
      if (this.user_data.playing.length) {
        const arr = await lt.api.user.getUserStatus(this.user_data.playing, { withGameMetas: true });
        for (const data of arr.filter(i => i.playing)) {
          const timeControl = lt.getGameTime(data.playing.clock, true);
          this.user_data.timeControls[data.id] = timeControl;
        }
        this.updateFriendsMenu();
        this.updateFriendsButton();
      }
    };

    hashchange = async (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const table = $('table.slist');
      if (!table.length) return;
      const userId = lt.getUserId();
      if (this.isFollowersPage()) {
        if (!table[0]._followersPage) {
          if (ev) {
            lt.global.location.reload();
            return;
          }
          table[0]._followersPage = 1;
          const tbody = table.find('tbody').empty();
          const f = (followers)=>{
            if (followers.length) {
              for (const follower of followers) {
                $(`<tr class="paginated"><td><a class="user-link ulpt" href="/@/${follower.user.id}"><i class="line"></i>${follower.user.name}</a></td></tr>`)
                  .appendTo(tbody);
              }
              if (followers.nextPage) {
                table[0]._followersPage = followers.nextPage;
                $('<tr class="lichessTools-pager"><th><a>&#x2398;</a></th></tr>')
                  .appendTo(tbody)
                  .find('a')
                  .attr('href','/@/TotalNoob69/followers?page='+followers.nextPage)
                  .on('click',async (ev)=>{
                    ev.preventDefault();
                    $('.lichessTools-pager',tbody).remove();
                    followers = await lt.api.relations.getFollowers(followers.nextPage,1);
                    await f(followers);
                  });
              };
            }
          };
          const followers = await lt.api.relations.getFollowers(1,1);
          $('.box__top h1').replaceText(trans.pluralSame('followersNumberTitle',followers?.nbResults || 0));
          f(followers);
        }
      } else {
        if (table[0]._followersPage) {
          lt.global.location.reload();
          return;
        }
      }
      this.updateFriendsPageDirect();
    };

    onScroll = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const pager = $('.lichessTools-pager');
      if (lt.inViewport(pager)) {
        pager.find('a').trigger('click');
      }
    }

    menuParent = '#topnav';

    followingOnlinesRequests = 0;
    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const friendsBoxMode = lt.currentOptions.getValue('openFriends');
      const liveFriendsPage = lt.currentOptions.getValue('liveFriendsPage');
      this.logOption('Online friend list', friendsBoxMode);
      this.logOption('Live friends page', liveFriendsPage);
      this.options = {
        openFriends: friendsBoxMode,
        liveFriendsPage: liveFriendsPage,
        friendsPlaying: lt.currentOptions.getValue('friendsPlaying'),
        mutedPlayers: lt.currentOptions.getValue('mutedPlayers')
      };
      const lichess = lt.lichess;
      if (!lichess) return;
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const setInterval = lt.global.setInterval;
      const clearInterval = lt.global.clearInterval;
      this.isFriendsPage = lt.isFriendsPage() && !this.isFollowersPage();
      this.isLivePage = lt.isFriendsPage() || lt.isFavoriteOpponentsPage() || lt.isBlockedPlayersPage() || this.isFollowersPage();

      lt.uiApi.onlineFriends.events.off('onlines', this.following_onlines);
      lt.uiApi.onlineFriends.events.off('enters', this.enters);
      lt.uiApi.onlineFriends.events.off('leaves', this.leaves);
      lt.uiApi.onlineFriends.events.off('playing', this.playing);
      lt.uiApi.onlineFriends.events.off('stopped_playing', this.stopped_playing);
      if (friendsBoxMode == 'menu' || friendsBoxMode == 'button' || (this.options.liveFriendPage && this.isFriendsPage)) {
        lt.uiApi.onlineFriends.events.on('onlines', this.following_onlines);
        lt.uiApi.onlineFriends.events.on('enters', this.enters);
        lt.uiApi.onlineFriends.events.on('leaves', this.leaves);
        lt.uiApi.onlineFriends.events.on('playing', this.playing);
        lt.uiApi.onlineFriends.events.on('stopped_playing', this.stopped_playing);
      }
      
      $(lt.global).off('hashchange', this.hashchange);
      $(lt.global).off('scroll',this.onScroll);
      if (this.isLivePage) {
        lt.pubsub.off('content-loaded', this.updateFriendsPage);
        if (liveFriendsPage) {
          lt.pubsub.on('content-loaded', this.updateFriendsPage);
        } else {
          $('.lichessTools-online').removeClass('lichessTools-online');
          $('.lichessTools-playing').removeClass('lichessTools-playing');
          $('.lichessTools-mute').remove();
          $('.lichessTools-tv').remove();
        }
        $(lt.global).on('hashchange', this.hashchange);
        this.hashchange();
        $(lt.global).on('scroll',this.onScroll);
      }

      this.followingOnlinesRequests = 0;
      clearInterval(this.onlinesInterval);
      if (this.options.friendsBoxMode || (this.options.liveFriendsPage && this.isFriendsPage) || this.options.friendsPlaying) {
        this.onlinesInterval = setInterval(() => {
          if (!this.onlinesInterval) return;
          if (lt.global.document.visibilityState == 'hidden') return;
          this.requestOnlines();
          this.followingOnlinesRequests++;
          if (this.followingOnlinesRequests > 5) {
            clearInterval(this.onlinesInterval);
            this.getFollowingOnlinesByApi();
          }
        }, 5000);
      }

      switch (friendsBoxMode) {
        case true:
        case 'true':
        case 'open': {
          $('#friend_box').css('display', 'block');
          $('section.lichessTools-onlineFriends', $(this.menuParent)).remove();
          $('.site-buttons .lichessTools-onlineFriends').remove();
        }
          break;
        case 'menu':
          {
            $('#friend_box').css('display', 'none');
          }
          break;
        case 'button':
          {
            $('#friend_box').css('display', 'none');
            $('section.lichessTools-onlineFriends', $(this.menuParent)).remove();
          }
          break;
        case 'hidden': {
          $('#friend_box .content_wrap').addClass('none');
          $('#friend_box').css('display', 'none');
          $('section.lichessTools-onlineFriends', $(this.menuParent)).remove();
          $('.site-buttons .lichessTools-onlineFriends').remove();
        }
          break;
        default: {
          $('#friend_box').css('display', 'block')
          $('section.lichessTools-onlineFriends', $(this.menuParent)).remove();
          $('.site-buttons .lichessTools-onlineFriends').remove();
        }
          break;
      }
      this.updateFriendsMenu();
      this.updateFriendsButton();
    }
  }
  LiChessTools.Tools.FriendsList = FriendsListTool;
})();
