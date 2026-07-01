(() => {
  class LichessLaddersTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['AddNotifications'];

    preferences = [
      {
        name: 'lichessLadders',
        category: 'integration',
        type: 'multiple',
        possibleValues: ['menuItem','page','challengeNotifications','messageNotifications'],
        defaultValue: true,
        needsLogin: true
      },
      {
        name: 'lichessLaddersSubmenu',
        category: 'integration',
        type: 'single',
        possibleValues: [0,1,2,3,4,5],
        defaultValue: 5,
        offValue: 0,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.integration': 'Integration',
        'options.lichessLadders': 'Lichess Ladders integration',
        'options.lichessLaddersSubmenu': 'Lichess Ladders menu challenge items',
        'lichessLadders.menuItem': 'Menu item',
        'lichessLadders.page': 'Summary page',
        'lichessLadders.challengeNotifications': 'Challenge notifications',
        'lichessLadders.messageNotifications': 'Message notifications',
        'lichessLaddersText': 'Lichess Ladders',
        'lichessLaddersTitle': 'LiChess Tools - go to Lichess Ladders',
        'lichessLaddersSubmenu.0': 'None',
        'lichessLaddersSubmenu.1': 'One',
        'lichessLaddersSubmenu.2': 'Two',
        'lichessLaddersSubmenu.3': 'Three',
        'lichessLaddersSubmenu.4': 'Four',
        'lichessLaddersSubmenu.5': 'Five',
        'unreadLaddersMessagesNotificationText': 'You have %s unread Lichess Ladders messages',
        'unreadLaddersMessagesNotificationText:one': 'You have one unread Lichess Ladders message',
        'unreadLaddersMessagesNotificationTitle': 'LiChess Tools - go to Lichess Ladders challenges',
        'laddersChallengeTimeText': 'You have a Lichess Ladders game starting in %s minutes',
        'laddersChallengeTimeText:one': 'You have a Lichess Ladders game starting in one minute',
        'laddersChallengeTimeTitle': 'LiChess Tools - go to Lichess Ladders challenges',
        'lichessLaddersPageTitle': 'Lichess Ladders Summary - LiChess Tools',
        'lichessLaddersPageHeader': 'Lichess Ladders summary',
        'userChallengesText': 'Your challenges',
        'upcomingChallengesText': 'Challenges coming up soon',
        'liveChallengesText': 'Challenges playing now',
        'lichessLaddersPageMenuText': 'Lichess Ladders summary',
        'goToSummaryTitle': 'go to Lichess Ladders summary',
        'goToGameTitle': 'open game',
        'challengeNowText': 'Challenge now',
        'challengeNowTitle': 'challenge the defender to a game now',
        'laddersError': 'Error connecting to Lichess Ladders',
        'gotoLichessLaddersTitle': 'more on Lichess Ladders',
        'laddersLaddersText': 'Ladders'
      },
      'ro-RO': {
        'options.integration': 'Integrare',
        'options.lichessLadders': 'Integrare Lichess Ladders',
        'options.lichessLaddersSubmenu': 'Provoc\u0103ri \u00een meniul Lichess Ladders',
        'lichessLadders.menuItem': 'Intrare meniu',
        'lichessLadders.page': 'Pagin\u0103 sumar',
        'lichessLadders.challengeNotifications': 'Notific\u0103ri provoc\u0103ri',
        'lichessLadders.messageNotifications': 'Notific\u0103ri mesaje',
        'lichessLaddersSubmenu.0': 'Nici una',
        'lichessLaddersSubmenu.1': 'Una',
        'lichessLaddersSubmenu.2': 'Dou\u0103',
        'lichessLaddersSubmenu.3': 'Trei',
        'lichessLaddersSubmenu.4': 'Patru',
        'lichessLaddersSubmenu.5': 'Cinci',
        'lichessLaddersText': 'Lichess Ladders',
        'lichessLaddersTitle': 'LiChess Tools - intr\u0103 pe Lichess Ladders',
        'unreadLaddersMessagesNotificationText': 'Ai %s mesaje noi \u00een Lichess Ladders',
        'unreadLaddersMessagesNotificationText:one': 'Ai un mesaj nou \u00een Lichess Ladders',
        'unreadLaddersMessagesNotificationTitle': 'LiChess Tools - vezi provoc\u0103rile Lichess Ladders',
        'laddersChallengeTimeText': 'Ai un joc Lichess Ladders care \uee00ncepe \uee00n %s minute',
        'laddersChallengeTimeText:one': 'Ai un joc Lichess Ladders care \uee00ncepe \uee00ntr-un minut',
        'laddersChallengeTimeTitle': 'LiChess Tools - vezi provoc\u0103rile Lichess Ladders',
        'lichessLaddersPageTitle': 'Sumar Lichess Ladders - LiChess Tools',
        'lichessLaddersPageHeader': 'Sumar Lichess Ladders',
        'userChallengesText': 'Provoc\u0103rile tale',
        'upcomingChallengesText': 'Provoc\u0103ri care vor veni \u00een cur\u00e2nd',
        'liveChallengesText': 'Provoc\u0103ri \u00een joc acum',
        'lichessLaddersPageMenuText': 'Sumar Lichess Ladders',
        'goToSummaryTitle': 'vezi sumarul Lichess Ladders',
        'goToGameTitle': 'vezi jocul',
        'challengeNowText': 'Provoac\u0103 acum',
        'challengeNowTitle': 'provoac\u0103 ap\u0103r\u0103torul la un joc acum',
        'laddersError': 'Eroare de conectare la Lichess Ladders',
        'gotoLichessLaddersTitle': 'mai multe pe Lichess Ladders',
        'laddersLaddersText': 'Sc\u0103ri'
      }
    }

    notifyUnread = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      if (!this.options.messageNotifications) return;
      const notification = {
        getEntries: async () => {
          const data = await lt.api.lichessladders.getSummary();
          if (!data?.unreadMessageCount) return [];
          const entry = {
            id: 'lichessLadders',
            isNew: true,
            icon: lt.icon.Ladder,
            href: 'https://lichessladders.com/challenges',
            target: '_blank',
            content: $('<div>')
              .append($('<span>').text(trans.pluralSame('unreadLaddersMessagesNotificationText',data.unreadMessageCount)))
              .html(),
            title: trans.noarg('unreadLaddersMessagesNotificationTitle')
          };
          return [entry];
        }
      };
      lt.notifications.add(notification);
    };

    notifyUpcoming = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      if (!this.options.challengeNotifications) return;

      const notification = {
        getEntries: async () => {
          const data = await lt.api.lichessladders.getSummary();
          const challengeId = data?.nextChallengeId;
          const challengeTime = data?.nextChallengeTime;
          if (!challengeId || !challengeTime) return [];

          const time = Math.floor((challengeTime - Date.now())/60/1000);
          if (time>60) return [];
          const entry = {
            id: 'lichessLaddersChallenge'+challengeId,
            isNew: true,
            icon: lt.icon.Ladder,
            href: 'https://lichessladders.com/challenges',
            target: '_blank',
            content: $('<div>')
              .append($('<span>').text(trans.pluralSame('laddersChallengeTimeText',time)))
              .html(),
            title: trans.noarg('laddersChallengeTimeTitle')
          };
          return [entry];
        }
      };
      lt.notifications.add(notification);
    };

    toDateTimeString = (ts)=>{
      const d = new Date(ts);
      const dateStr = d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      const timeStr = d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      return `${dateStr} ${timeStr}`;
    };

    createChallengeElem = async (challenge, elems) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const userId = lt.getUserId();

      if (challenge?.challenge) {
        challenge = challenge.challenge;
      }

      const encodeURIComponent = lt.global.encodeURIComponent;
      let html = `<article>
        <div class="header">
          <a class="ladder" href="https://lichessladders.com/ladders/$ladderId$">$ladder$</a>
        </div>
        <div class="matchup">
          <div class="player">
            <span><a href="$challengerUrl$" class="ulpt">$challengerName$</a> <span class="color-$challengerColor$"></span></span>
            <div class="meta">$challengerMeta$</div>
          </div>
          <div class="vs">
          </div>
          <div class="player">
            <span><a href="$defenderUrl$" class="ulpt">$defenderName$</a> <span class="color-$defenderColor$"></span></span>
            <div class="meta">$defenderMeta$</div>
          </div>
        </div>
        <div class="footer">
        </div>
      </div>`;
      let key = challenge.ladder?.type+'Rating';
      if (!challenge.fromUser?.[key]) key = 'classicalRating';
      const challengerName = challenge.fromUser?.lichessName;
      const challengerColor = challenge.challengerIsWhite ? 'white' : 'black';
      const challengerMeta = (challenge.fromUser?.[key] || '')+(challenge.fromUser?.[key+'IsProvisional']?'?':'');
      key = challenge.ladder?.type+'Rating';
      if (!challenge.toUser?.[key]) key = 'classicalRating';
      const defenderName = challenge.toUser?.lichessName;
      const defenderColor = !challenge.challengerIsWhite ? 'white' : 'black';
      const defenderMeta = (challenge.toUser?.[key] || '')+(challenge.toUser?.[key+'IsProvisional']?'?':'');
      const data = {
        ladder: challenge.ladder?.name,
        ladderId: challenge.ladder?.id,
        challengerUrl: challenge.fromUser?.lichessURL,
        challengerName: lt.htmlEncode(challengerName),
        challengerColor: challengerColor,
        challengerMeta: lt.htmlEncode(challengerMeta),
        defenderUrl: challenge.toUser?.lichessURL,
        defenderName: lt.htmlEncode(defenderName),
        defenderColor: defenderColor,
        defenderMeta: lt.htmlEncode(defenderMeta)
      };
      html = html.replace(/\$(.*?)\$/g, function (m, key) {
        const value = data.hasOwnProperty(key)
          ? data[key]
          : trans.noarg(key);
        return value;
      });
      const result = $(html);
      result.find('.vs')
        .attr('data-icon',lt.icon.Swords);
      result.find('a[data-live=""]')
        .removeAttr('data-live')
        .addClass('nolink');
      result.find('a[data-live]')
        .each((i,e)=>{
          e=$(e);
          const id = e.attr('data-live');
          const orientation = e.attr('data-orientation');
          e.attr('href','/'+id+'/'+orientation)
           .addClass('mini-game mini-game--init mini-game-'+id)
           .append('<span class="cg-wrap"></span>');
        });
      lichess.powertip?.manualUserIn(result[0]);

      if (challenge.gameId) {
        const gameElem = elems.find(e=>e.gameId == challenge.gameId);
        if (gameElem) {
          result.find('.footer').append(gameElem);
        }
      }
      if (!challenge.gameId && userId?.toLowerCase()==challenge.fromUser?.lichessId?.toLowerCase()) {
        const variant = challenge.ladder?.type == 'chess960' ? 'chess960' : 'standard';
        let challengeUrl = '/?user='+encodeURIComponent(challenge.toUser?.lichessId)+'&variant='+variant+'&gameMode=rated';
        if (challenge.ladder?.type=='correspondence') {
          challengeUrl += '&time=correspondence'
            +'&minutesPerSide='+challenge.ladder?.timeControlBase
            +'&increment='+challenge.ladder?.timeControlIncrement;
        } else {
          challengeUrl += '&time=realTime'
            +'&days='+challenge.ladder?.timeControlBase;
        }
        challengeUrl += '&color='+(challenge.challengerIsWhite ? 'white' : 'black');
        challengeUrl += '#friend';
        result.find('.footer')
          .append($('<a class="challengePlayer">')
                    .text(trans.noarg('challengeNowText'))
                    .attr('title',trans.noarg('challengeNowTitle'))
                    .attr('href', challengeUrl)
          );
      }
      return result;
    };

    processPage = async ()=>{
      if (!this.options.page) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (lt.global.location.pathname!="/page/lichessLadders") return;

      lt.global.document.title = trans.noarg('lichessLaddersPageTitle');

      const laddersId = await lt.api.lichessladders.getLaddersId(lt.getUserId())
        .catch(e=>lt.announce(trans.noarg('laddersError')));
      const userChallenges = laddersId
        ? await lt.api.lichessladders.getUserChallenges(laddersId)
        : [];

      const ids = new Set(userChallenges.map(ch => ch.id));
      const upcomingChallenges = await lt.api.lichessladders.getUpcomingChallenges();
      lt.arrayRemoveAll(upcomingChallenges, ch => ids.has(ch.id));

      const liveChallenges = await lt.api.lichessladders.getLiveChallenges();
      lt.arrayRemoveAll(liveChallenges, ch => ids.has(ch.challenge.id));

      const ladders = await lt.api.lichessladders.getLadders();
      const userLadders = laddersId
        ? await lt.api.lichessladders.getUserLadders(laddersId)
        : [];
      const joinedIds = new Set(userLadders.map(l=>l.id));
      ladders.forEach(l=>l.joined = joinedIds.has(l.id));
      ladders.sort((l1,l2)=>{
        const v1 = (l1.joined ? -10000000 : 0)+l1.id;
        const v2 = (l2.joined ? -10000000 : 0)+l2.id;
        return v1-v2;
      });

      const gameData = [...userChallenges,...upcomingChallenges,...liveChallenges]
                         .map(c=>c.challenge ? c.challenge : c)
                         .map(c=>({ id: c.gameId, color: c.challengerIsWhite ? 'white' : 'black' }))
                         .filter(d=>d.id);
      const gameElems = await lt.api.game.getMinis(gameData);


      const main = $('#main-wrap main')
        .empty()
        .attr('class','lichessTools-lichessLadders')
        .append($('<h2>')
                  .append($('<span>').text(trans.noarg('lichessLaddersPageHeader')))
                  .append($('<a>')
                            .attr('href','https://lichessladders.com')
                            .attr('title',trans.noarg('gotoLichessLaddersTitle'))
                            .attr('data-icon',lt.icon.GreaterThan)
                  )
        );

      if (ladders?.length) {
        const section = $('<div class="lichessTools-lichessLadders-ladders">')
          .append($('<h3>')
                    .append($('<span>').text(trans.noarg('laddersLaddersText')))
                    .append($('<a>')
                              .attr('href','https://lichessladders.com/ladders')
                              .attr('title',trans.noarg('gotoLichessLaddersTitle'))
                              .attr('data-icon',lt.icon.GreaterThan)
                    )
          )
          .appendTo(main);
        const container = $('<div class="ladders">')
          .appendTo(section);
        for (const ladder of ladders) {
          const text = ladder.type=='correspondence'
            ? ladder.timeControlBase+' D'
            : ladder.timeControlBase+'+'+ladder.timeControlIncrement;
          let icon = '';
          switch (ladder.type) {
            case 'correspondence':
              icon = lt.icon.PaperAirplane;
              break;
            case 'classical':
              icon = lt.icon.Turtle;
              break;
            case 'chess960':
              icon = lt.icon.DieSix;
              break;
          }
          if (ladder.level=='team') {
            icon = lt.icon.Group;
          }
          const elem = $('<a class="ladder">')
            .attr('data-type-icon',icon)
            .attr('title',ladder.name+'\r\n'+ladder.description)
            .attr('href', 'https://lichessladders.com/ladders/'+ladder.id)
            .append($('<span>').text(text))
            .toggleClass('joined',!!ladder.joined)
            .appendTo(container);
          if (ladder.joined) {
            lt.api.lichessladders.getUserLadder(laddersId, ladder.id).then(data=>{
              elem
                .attr('data-count',data?.openChallengeCount)
                .addClass('data-count')
                .append(
                  $('<span class="ranking">').text(data?.ranking)
                );
              const delta = data?.previousChallenge?.previousRanking - data?.previousChallenge?.newRanking;
              if (delta) {
                elem.append(
                  $('<span class="delta">')
                    .attr('data-icon',delta>0 ? lt.icon.UpwardsWhiteArrow : lt.icon.DownwardsWhiteArrow)
                    .addClass(delta>0 ? 'green' : 'red')
                );
              }
            });
          }
        }
      }

      const displayChallenges = async (challenges, container)=>{
        let laddersInOrder = ladders;
        if (!ladders?.length) {
          laddersInOrder = challenges.map(c=>c.challenge?.ladder || c.ladder);
          laddersInOrder.sort((l1,l2)=>l1.id-l2.id);
        }
        for (const ladder of laddersInOrder) {
          const ladderChallenges = challenges.filter(c=>c.ladder?.id==ladder.id || c.challenge?.ladder?.id==ladder.id);
          if (!ladderChallenges.length) continue;
          $('<h4>')
            .text(ladder.name)
            .appendTo(container);
          const ladderElem = $('<div>').appendTo(container);
          for (const challenge of ladderChallenges) {
            const elem = await this.createChallengeElem(challenge,gameElems);
            elem.appendTo(ladderElem);
          }
        }
      };

      if (userChallenges?.length) {
        const section = $('<div class="lichessTools-lichessLadders-userChallenges">')
          .append($('<h3>')
                    .append($('<span>').text(trans.noarg('userChallengesText')))
                    .append($('<a>')
                              .attr('href','https://lichessladders.com/challenges')
                              .attr('title',trans.noarg('gotoLichessLaddersTitle'))
                              .attr('data-icon',lt.icon.GreaterThan)
                    )
          )
          .appendTo(main);
        await displayChallenges(userChallenges,section);
      }
      if (upcomingChallenges?.length) {
        const section = $('<div class="lichessTools-lichessLadders-upcomingChallenges">')
          .append($('<h3>')
                    .append($('<span>').text(trans.noarg('upcomingChallengesText')))
                    .append($('<a>')
                              .attr('href','https://lichessladders.com/challenges/scheduled')
                              .attr('title',trans.noarg('gotoLichessLaddersTitle'))
                              .attr('data-icon',lt.icon.GreaterThan)
                    )
          )
          .appendTo(main);
        await displayChallenges(upcomingChallenges,section);
      }
      if (liveChallenges?.length) {
        const section = $('<div class="lichessTools-lichessLadders-liveChallenges">')
          .append($('<h3>')
                    .append($('<span>').text(trans.noarg('liveChallengesText')))
                    .append($('<a>')
                              .attr('href','https://lichessladders.com/challenges/live')
                              .attr('title',trans.noarg('gotoLichessLaddersTitle'))
                              .attr('data-icon',lt.icon.GreaterThan)
                    )
          )
          .appendTo(main);
        await displayChallenges(liveChallenges,section);
      }
      lt.uiApi.initializeDom(main[0]);
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const lichessLadders = lt.currentOptions.getValue('lichessLadders');
      const lichessLaddersSubmenu = lt.currentOptions.getValue('lichessLaddersSubmenu');
      this.logOption('Lichess Ladders', lichessLadders);
      this.options = {
        menuItem: lt.isOptionSet(lichessLadders, 'menuItem'),
        page: lt.isOptionSet(lichessLadders, 'page'),
        challengeNotifications: lt.isOptionSet(lichessLadders, 'challengeNotifications'),
        messageNotifications: lt.isOptionSet(lichessLadders, 'messageNotifications'),
        maxItemCount: +lichessLaddersSubmenu
      };
      const userId = lt.getUserId();
      if (!userId) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const container = $('#topnav section a[href="/"]+div[role="group"]');
      container.find('.lichessTools-lichessLadders').remove();
      if (this.options.menuItem) {
        const elem = $('<a>')
          .addClass('lichessTools-lichessLadders')
          .appendTo(container);
        if (this.options.page) {
          elem
            .text(trans.noarg('lichessLaddersPageMenuText'))
            .attr('title', trans.noarg('lichessLaddersPageTitle'))
            .attr('href','/page/lichessLadders')
        } else {
          elem
            .attr('target','_blank')
            .text(trans.noarg('lichessLaddersText'))
            .attr('title', trans.noarg('lichessLaddersTitle'))
            .attr('href','https://lichessladders.com/')
        }
        const populateUserChallenges = async ()=>{
          const laddersId = await lt.api.lichessladders.getLaddersId(userId)
            .catch(e=>lt.announce(trans.noarg('laddersError')));
          const userChallenges = laddersId
            ? await lt.api.lichessladders.getUserChallenges(laddersId)
            : [];
          if (!userChallenges?.length) return;

          const group = $('<div role="group"></div>')
            .appendTo(elem);
          for (const challenge of userChallenges.slice(0,this.options.maxItemCount)) {
            const getUserText = (user)=>{
              if (!user) return '';
              let result = (user.lichessName || '')+' ';
              let key = challenge.ladder?.type+'Rating';
              if (!user?.[key]) key = 'classicalRating';
              result += (user[key] || '')+(user[key+'IsProvisional']?'?':'');
              return result;
            };
            const text=getUserText(challenge?.white)+' - '+getUserText(challenge?.black);
            const orientation = userId?.toLowerCase()==challenge?.white?.lichessId?.toLowerCase() ? 'white' : 'black';
            if (challenge.gameId) {
              $('<a class="glpt">')
                .attr('href', '/'+challenge.gameId+'/'+orientation)
                .text(text)
                .attr('title',trans.noarg('goToGameTitle'))
                .appendTo(group);
            } else
            if (this.options.page) {
              $('<a class="upcoming" target="_blank">')
                .attr('href', '/page/lichessLadders')
                .text(text)
                .attr('title',trans.noarg('goToSummaryTitle'))
                .appendTo(group);
            } else {
              $('<a class="upcoming" target="_blank">')
                .attr('href', 'https://lichessladders.com/challenges')
                .text(text)
                .attr('title',trans.noarg('lichessLaddersTitle'))
                .appendTo(group);
            }
          }
          if (this.options.maxItemCount && userChallenges.length>this.options.maxItemCount) {
            $('<a class="upcoming" target="_blank">')
              .attr('href', 'https://lichessladders.com/challenges')
              .text('...')
              .appendTo(group);
          }
          lichess.powertip?.manualGameIn(group[0]);
        };
        populateUserChallenges();
      }
      this.processPage();
      this.notifyUnread();
      this.notifyUpcoming();
    }

  }
  LiChessTools.Tools.LichessLadders = LichessLaddersTool;
})();
