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
        'lichessLaddersPageMenuText': 'Summary',
        'goToSummaryTitle': 'go to Lichess Ladders summary',
        'goToGameTitle': 'open game',
        'challengeNowText': 'Challenge now',
        'challengeNowTitle': 'challenge the defender to a game now'
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
        'lichessLaddersPageMenuText': 'Sumar',
        'goToSummaryTitle': 'vezi sumarul Lichess Ladders',
        'goToGameTitle': 'vezi jocul',
        'challengeNowText': 'Provoac\u0103 acum',
        'challengeNowTitle': 'provoac\u0103 ap\u0103r\u0103torul la un joc acum'
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

    createChallengeElem = (challenge) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const userId = lt.getUserId();

      let game = null;
      if (challenge?.challenge) {
        game = challenge.gameStatus;
        challenge = challenge.challenge;
      }

      const encodeURIComponent = lt.global.encodeURIComponent;
      let html = `<article>
        <div class="header">$ladder$</div>
        <div class="matchup">
          <div class="player">
            <span><a href="$challengerUrl$" class="ulpt">$challengerName$</a> $challengerColor$</span>
            <div class="meta">$challengerMeta$</div>
          </div>
          <div class="vs">
          </div>
          <div class="player">
            <span><a href="$defenderUrl$" class="ulpt">$defenderName$</a> $defenderColor$</span>
            <div class="meta">$defenderMeta$</div>
          </div>
        </div>
        <div class="footer">
          <a data-live="$gameId$" data-orientation="$challengerOrientation$" class="mini-game" data-state="$gameState$">$gameTime$</a>
        </div>
      </div>`;
      let key = challenge.ladder?.type+'Rating';
      if (!challenge.fromUser?.[key]) key = 'classicalRating';
      const challengerName = challenge.fromUser?.lichessName;
      const challengerColor = challenge.challengerIsWhite ? lt.icon.WhiteChessKing : lt.icon.BlackChessKing;
      const challengerMeta = (challenge.fromUser?.[key] || '')+(challenge.fromUser?.[key+'IsProvisional']?'?':'');
      const challengerOrientation = challenge.challengerIsWhite ? 'white' : 'black';
      key = challenge.ladder?.type+'Rating';
      if (!challenge.toUser?.[key]) key = 'classicalRating';
      const defenderName = challenge.toUser?.lichessName;
      const defenderColor = !challenge.challengerIsWhite ? lt.icon.WhiteChessKing : lt.icon.BlackChessKing;
      const defenderMeta = (challenge.toUser?.[key] || '')+(challenge.toUser?.[key+'IsProvisional']?'?':'');
      const data = {
        ladder: challenge.ladder?.name,
        challengerUrl: challenge.fromUser?.lichessURL,
        challengerName: challengerName,
        challengerColor: challengerColor,
        challengerMeta: challengerMeta,
        challengerOrientation: challengerOrientation,
        defenderUrl: challenge.toUser?.lichessURL,
        defenderName: defenderName,
        defenderColor: defenderColor,
        defenderMeta: defenderMeta,
        gameId: challenge.gameId ? encodeURIComponent(challenge.gameId) : '',
        gameTime: challenge.dateScheduled ? this.toDateTimeString(challenge.dateScheduled) : '',
        gameState: game ? [game?.fen?.split(' ')?.slice(0,2)?.join(' ')||'',challengerOrientation,game?.lastMove].join(',') : ''
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
           .append('<span class="cg-wrap"><cg-container><cg-board></cg-board></cg-container></span>');
        });
      lichess.powertip?.manualUserIn(result[0]);
      if (!challenge.gameId && userId?.toLowerCase()==challenge.fromUser?.lichessId?.toLowerCase()) {
        let challengeUrl = '/?user='+encodeURIComponent(challenge.toUser?.lichessId)+'&variant=standard&gameMode=rated';
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

      const laddersId = await lt.api.lichessladders.getLaddersId(lt.getUserId());
      const userChallenges = laddersId
        ? await lt.api.lichessladders.getUserChallenges(laddersId)
        : [];

      let upcomingChallenges = await lt.api.lichessladders.getUpcomingChallenges();
      const ids = new Set(userChallenges.map(ch => ch.id));
      upcomingChallenges = upcomingChallenges.filter(ch => !ids.has(ch.id));
      const liveChallenges = await lt.api.lichessladders.getLiveChallenges();

      const main = $('#main-wrap main')
        .empty()
        .attr('class','lichessTools-lichessLadders')
        .append($('<h2>')
                  .append($('<span>').text(trans.noarg('lichessLaddersPageHeader')))
                  .append($('<a>')
                            .attr('href','https://lichessladders.com')
                            .attr('title',trans.noarg('lichessLaddersTitle'))
                            .attr('data-icon',lt.icon.GreaterThan)
                  )
        );

      if (userChallenges?.length) {
        const section = $('<div class="lichessTools-lichessLadders-userChallenges">')
          .append($('<h3>').text(trans.noarg('userChallengesText')))
          .appendTo(main);
        const container = $('<div>')
          .appendTo(section); 
        for (const challenge of userChallenges) {
          const elem = this.createChallengeElem(challenge)
            .appendTo(container);
        }
      }
      if (upcomingChallenges?.length) {
        const section = $('<div class="lichessTools-lichessLadders-upcomingChallenges">')
          .append($('<h3>').text(trans.noarg('upcomingChallengesText')))
          .appendTo(main);
        const container = $('<div>')
          .appendTo(section); 
        for (const challenge of upcomingChallenges) {
          const elem = this.createChallengeElem(challenge)
            .appendTo(container);
        }
      }
      if (liveChallenges?.length) {
        const section = $('<div class="lichessTools-lichessLadders-liveChallenges">')
          .append($('<h3>').text(trans.noarg('liveChallengesText')))
          .appendTo(main);
        const container = $('<div>')
          .appendTo(section); 
        for (const challenge of liveChallenges) {
          const elem = this.createChallengeElem(challenge)
            .appendTo(container);
        }
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
        menuItem: lt.isOptionSet(lichessLadders, 'enabled'),
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
        const elem = $('<a target="_blank">')
          .addClass('lichessTools-lichessLadders')
          .text(trans.noarg('lichessLaddersText'))
          .attr('title', trans.noarg('lichessLaddersTitle'))
          .attr('href','https://lichessladders.com/')
          .appendTo(container);
        const group = $('<div role="group"></div>')
          .appendTo(elem);
        if (this.options.page) {
          $('<a class="lichessTools-lichessLaddersPage">')
            .attr('href', '/page/lichessLadders')
            .attr('title', trans.noarg('lichessLaddersPageTitle'))
            .text(trans.noarg('lichessLaddersPageMenuText'))
            .appendTo(group);
        }
        const populateUserChallenges = async ()=>{
          const laddersId = await lt.api.lichessladders.getLaddersId(userId);
          const userChallenges = laddersId
            ? await lt.api.lichessladders.getUserChallenges(laddersId)
            : [];
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
