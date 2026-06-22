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
        'goToGameTitle': 'open game'
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
        'goToGameTitle': 'vezi jocul'
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
          // TODO get all upcoming challenges and create an entry for each
          // TODO add dismiss button for challenge notifications
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
      const userChallenges = await lt.api.lichessladders.getUserChallenges(laddersId);
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
          const userChallenges = JSON.parse(`[{"id":4833,"ladder":{"id":5,"name":"3 day correspondence ladder","description":"A correspondence ladder. You need to have played at least 5 Lichess correspondence games, and link your Discord account. The time control is 3 days per move","timeControlBase":3,"timeControlIncrement":0,"status":"open","users":null,"hoursToOrganize":72,"daysToPlay":14,"tag":"correspondence-3","type":"correspondence","level":"individual","sequence":60},"fromUser":{"lichessId":"pavonine","lichessName":"pavonine","lichessURL":"https://lichess.org/@/pavonine","classicalRating":2142,"classicalRatingIsProvisional":false,"correspondenceRating":2490,"correspondenceRatingIsProvisional":false,"chess960Rating":2010,"chess960RatingIsProvisional":true,"correspondenceGameCount":137,"classicalGameCount":292,"lichessPatron":true,"email":"","id":9941,"isAdmin":false,"timezone":"Europe/Amsterdam","notes":null,"discordId":"1448762103438643230","discordName":"pavo","firstDayOfWeek":1,"totalPlayingTime":3686320,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1773207532000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"toUser":{"lichessId":"mattchessic","lichessName":"mattchessic","lichessURL":"https://lichess.org/@/mattchessic","classicalRating":2257,"classicalRatingIsProvisional":false,"correspondenceRating":2262,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":23,"classicalGameCount":192,"lichessPatron":true,"email":"","id":64,"isAdmin":false,"timezone":"America/Los_Angeles","notes":"Weekends preferable\\nWeeknights possible","discordId":"506191573512486936","discordName":"mattchess","firstDayOfWeek":1,"totalPlayingTime":2058211,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1750747022000,"dojoMember":true,"badges":[],"team":{"id":1,"name":"Jesse's Coconuts","description":"A team for members of the Chess Dojo","members":null,"discordRoleId":1397978598950048000,"discordChannelId":1397977689729532000,"discordGameThreadId":1460196503376367900,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1397977689729531985","isPrivate":false,"badgeColour":"#eb9f07","captainId":41,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"status":"playing","dateCreated":1777447779000,"dateAccepted":1777447865000,"datePlayed":1777447865000,"dateScheduled":1777447779000,"dateForfeitRequested":null,"dateFinalized":null,"dateDisputed":null,"forfeitRequestedBy":null,"forfeitInFavourOf":null,"open":true,"canRequestForfeit":false,"canCancel":false,"canDispute":false,"canSchedule":false,"result":"none","gameId":"gfCUV0R9","canSubmitGame":true,"notes":"","fromUserRankings":null,"toUserRankings":null,"fromTeam":null,"toTeam":null,"seasonId":0,"includedInTouament":false,"defenderHasReplied":false,"dateFirstReply":null,"challengerIsWhite":false,"white":{"lichessId":"mattchessic","lichessName":"mattchessic","lichessURL":"https://lichess.org/@/mattchessic","classicalRating":2257,"classicalRatingIsProvisional":false,"correspondenceRating":2262,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":23,"classicalGameCount":192,"lichessPatron":true,"email":"","id":64,"isAdmin":false,"timezone":"America/Los_Angeles","notes":"Weekends preferable\\nWeeknights possible","discordId":"506191573512486936","discordName":"mattchess","firstDayOfWeek":1,"totalPlayingTime":2058211,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1750747022000,"dojoMember":true,"badges":[],"team":{"id":1,"name":"Jesse's Coconuts","description":"A team for members of the Chess Dojo","members":null,"discordRoleId":1397978598950048000,"discordChannelId":1397977689729532000,"discordGameThreadId":1460196503376367900,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1397977689729531985","isPrivate":false,"badgeColour":"#eb9f07","captainId":41,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"black":{"lichessId":"pavonine","lichessName":"pavonine","lichessURL":"https://lichess.org/@/pavonine","classicalRating":2142,"classicalRatingIsProvisional":false,"correspondenceRating":2490,"correspondenceRatingIsProvisional":false,"chess960Rating":2010,"chess960RatingIsProvisional":true,"correspondenceGameCount":137,"classicalGameCount":292,"lichessPatron":true,"email":"","id":9941,"isAdmin":false,"timezone":"Europe/Amsterdam","notes":null,"discordId":"1448762103438643230","discordName":"pavo","firstDayOfWeek":1,"totalPlayingTime":3686320,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1773207532000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null}},{"id":4854,"ladder":{"id":5,"name":"3 day correspondence ladder","description":"A correspondence ladder. You need to have played at least 5 Lichess correspondence games, and link your Discord account. The time control is 3 days per move","timeControlBase":3,"timeControlIncrement":0,"status":"open","users":null,"hoursToOrganize":72,"daysToPlay":14,"tag":"correspondence-3","type":"correspondence","level":"individual","sequence":60},"fromUser":{"lichessId":"egglu","lichessName":"EggLu","lichessURL":"https://lichess.org/@/EggLu","classicalRating":1798,"classicalRatingIsProvisional":true,"correspondenceRating":2163,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":43,"classicalGameCount":18,"lichessPatron":true,"email":"","id":1484,"isAdmin":false,"timezone":"America/New_York","notes":null,"discordId":"463856080079028234","discordName":"Eggie","firstDayOfWeek":0,"totalPlayingTime":98623,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1755452469000,"dojoMember":true,"badges":[],"team":{"id":8,"name":"Chickmates","description":"For women in the Chess Dojo and elsewhere who want to connect. Contact petteia for the code to join","members":null,"discordRoleId":1464539857186721800,"discordChannelId":1464540647854702800,"discordGameThreadId":1464540809411170600,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1464540647854702769","isPrivate":true,"badgeColour":"#d96464","captainId":53,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"toUser":{"lichessId":"confusedghoul","lichessName":"ConfusedGhoul","lichessURL":"https://lichess.org/@/ConfusedGhoul","classicalRating":2173,"classicalRatingIsProvisional":true,"correspondenceRating":2141,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":179,"classicalGameCount":30,"lichessPatron":false,"email":"","id":369,"isAdmin":false,"timezone":"Europe/Rome","notes":null,"discordId":"543790352650207253","discordName":"ConfusedGhoul","firstDayOfWeek":1,"totalPlayingTime":402039,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1752585760000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"status":"playing","dateCreated":1777571782000,"dateAccepted":1777585924000,"datePlayed":1777585924000,"dateScheduled":1777571782000,"dateForfeitRequested":null,"dateFinalized":null,"dateDisputed":null,"forfeitRequestedBy":null,"forfeitInFavourOf":null,"open":true,"canRequestForfeit":false,"canCancel":false,"canDispute":false,"canSchedule":false,"result":"none","gameId":"","canSubmitGame":true,"notes":"","fromUserRankings":null,"toUserRankings":null,"fromTeam":null,"toTeam":null,"seasonId":0,"includedInTouament":false,"defenderHasReplied":false,"dateFirstReply":null,"challengerIsWhite":true,"white":{"lichessId":"egglu","lichessName":"EggLu","lichessURL":"https://lichess.org/@/EggLu","classicalRating":1798,"classicalRatingIsProvisional":true,"correspondenceRating":2163,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":43,"classicalGameCount":18,"lichessPatron":true,"email":"","id":1484,"isAdmin":false,"timezone":"America/New_York","notes":null,"discordId":"463856080079028234","discordName":"Eggie","firstDayOfWeek":0,"totalPlayingTime":98623,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1755452469000,"dojoMember":true,"badges":[],"team":{"id":8,"name":"Chickmates","description":"For women in the Chess Dojo and elsewhere who want to connect. Contact petteia for the code to join","members":null,"discordRoleId":1464539857186721800,"discordChannelId":1464540647854702800,"discordGameThreadId":1464540809411170600,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1464540647854702769","isPrivate":true,"badgeColour":"#d96464","captainId":53,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"black":{"lichessId":"confusedghoul","lichessName":"ConfusedGhoul","lichessURL":"https://lichess.org/@/ConfusedGhoul","classicalRating":2173,"classicalRatingIsProvisional":true,"correspondenceRating":2141,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":179,"classicalGameCount":30,"lichessPatron":false,"email":"","id":369,"isAdmin":false,"timezone":"Europe/Rome","notes":null,"discordId":"543790352650207253","discordName":"ConfusedGhoul","firstDayOfWeek":1,"totalPlayingTime":402039,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1752585760000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null}},{"id":4964,"ladder":{"id":5,"name":"3 day correspondence ladder","description":"A correspondence ladder. You need to have played at least 5 Lichess correspondence games, and link your Discord account. The time control is 3 days per move","timeControlBase":3,"timeControlIncrement":0,"status":"open","users":null,"hoursToOrganize":72,"daysToPlay":14,"tag":"correspondence-3","type":"correspondence","level":"individual","sequence":60},"fromUser":{"lichessId":"mattchessic","lichessName":"mattchessic","lichessURL":"https://lichess.org/@/mattchessic","classicalRating":2257,"classicalRatingIsProvisional":false,"correspondenceRating":2262,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":23,"classicalGameCount":192,"lichessPatron":true,"email":"","id":64,"isAdmin":false,"timezone":"America/Los_Angeles","notes":"Weekends preferable\\nWeeknights possible","discordId":"506191573512486936","discordName":"mattchess","firstDayOfWeek":1,"totalPlayingTime":2058211,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1750747022000,"dojoMember":true,"badges":[],"team":{"id":1,"name":"Jesse's Coconuts","description":"A team for members of the Chess Dojo","members":null,"discordRoleId":1397978598950048000,"discordChannelId":1397977689729532000,"discordGameThreadId":1460196503376367900,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1397977689729531985","isPrivate":false,"badgeColour":"#eb9f07","captainId":41,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"toUser":{"lichessId":"lordpuffington","lichessName":"LordPuffington","lichessURL":"https://lichess.org/@/LordPuffington","classicalRating":2379,"classicalRatingIsProvisional":true,"correspondenceRating":2604,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":37,"classicalGameCount":63,"lichessPatron":true,"email":"","id":882,"isAdmin":false,"timezone":"Europe/London","notes":"Weekends","discordId":"1009872394904674404","discordName":"LordPUffington","firstDayOfWeek":1,"totalPlayingTime":312127,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1753839547000,"dojoMember":true,"badges":[],"team":{"id":9,"name":"The Analog Kids","description":"For chess players aged aged 50+","members":null,"discordRoleId":1468290162588123400,"discordChannelId":1468290314782511000,"discordGameThreadId":1468291039566631000,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1468290314782511215","isPrivate":false,"badgeColour":"#aaaaaa","captainId":1639,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"status":"playing","dateCreated":1778129236000,"dateAccepted":1778131384000,"datePlayed":1778131384000,"dateScheduled":1778129236000,"dateForfeitRequested":null,"dateFinalized":null,"dateDisputed":null,"forfeitRequestedBy":null,"forfeitInFavourOf":null,"open":true,"canRequestForfeit":false,"canCancel":false,"canDispute":false,"canSchedule":false,"result":"none","gameId":"OLeIYwkz","canSubmitGame":true,"notes":"","fromUserRankings":null,"toUserRankings":null,"fromTeam":null,"toTeam":null,"seasonId":0,"includedInTouament":false,"defenderHasReplied":false,"dateFirstReply":null,"challengerIsWhite":true,"white":{"lichessId":"mattchessic","lichessName":"mattchessic","lichessURL":"https://lichess.org/@/mattchessic","classicalRating":2257,"classicalRatingIsProvisional":false,"correspondenceRating":2262,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":23,"classicalGameCount":192,"lichessPatron":true,"email":"","id":64,"isAdmin":false,"timezone":"America/Los_Angeles","notes":"Weekends preferable\\nWeeknights possible","discordId":"506191573512486936","discordName":"mattchess","firstDayOfWeek":1,"totalPlayingTime":2058211,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1750747022000,"dojoMember":true,"badges":[],"team":{"id":1,"name":"Jesse's Coconuts","description":"A team for members of the Chess Dojo","members":null,"discordRoleId":1397978598950048000,"discordChannelId":1397977689729532000,"discordGameThreadId":1460196503376367900,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1397977689729531985","isPrivate":false,"badgeColour":"#eb9f07","captainId":41,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"black":{"lichessId":"lordpuffington","lichessName":"LordPuffington","lichessURL":"https://lichess.org/@/LordPuffington","classicalRating":2379,"classicalRatingIsProvisional":true,"correspondenceRating":2604,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":37,"classicalGameCount":63,"lichessPatron":true,"email":"","id":882,"isAdmin":false,"timezone":"Europe/London","notes":"Weekends","discordId":"1009872394904674404","discordName":"LordPUffington","firstDayOfWeek":1,"totalPlayingTime":312127,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1753839547000,"dojoMember":true,"badges":[],"team":{"id":9,"name":"The Analog Kids","description":"For chess players aged aged 50+","members":null,"discordRoleId":1468290162588123400,"discordChannelId":1468290314782511000,"discordGameThreadId":1468291039566631000,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1468290314782511215","isPrivate":false,"badgeColour":"#aaaaaa","captainId":1639,"status":"active"},"lichessMessagingIsDisabled":false,"title":null}},{"id":5064,"ladder":{"id":5,"name":"3 day correspondence ladder","description":"A correspondence ladder. You need to have played at least 5 Lichess correspondence games, and link your Discord account. The time control is 3 days per move","timeControlBase":3,"timeControlIncrement":0,"status":"open","users":null,"hoursToOrganize":72,"daysToPlay":14,"tag":"correspondence-3","type":"correspondence","level":"individual","sequence":60},"fromUser":{"lichessId":"seiberdo","lichessName":"seiberdo","lichessURL":"https://lichess.org/@/seiberdo","classicalRating":1856,"classicalRatingIsProvisional":false,"correspondenceRating":2349,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":70,"classicalGameCount":196,"lichessPatron":true,"email":"","id":8012,"isAdmin":false,"timezone":"Europe/Berlin","notes":null,"discordId":"1372575882597896243","discordName":"Dominic","firstDayOfWeek":1,"totalPlayingTime":1273045,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1770221833000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"toUser":{"lichessId":"billy_sprinkle","lichessName":"Billy_Sprinkle","lichessURL":"https://lichess.org/@/Billy_Sprinkle","classicalRating":2006,"classicalRatingIsProvisional":false,"correspondenceRating":2140,"correspondenceRatingIsProvisional":false,"chess960Rating":1792,"chess960RatingIsProvisional":true,"correspondenceGameCount":225,"classicalGameCount":262,"lichessPatron":false,"email":"","id":443,"isAdmin":false,"timezone":"Europe/London","notes":null,"discordId":"910307603156967474","discordName":"Matt Brownsand","firstDayOfWeek":1,"totalPlayingTime":3772465,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":1,"dateJoined":1752631763000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"status":"playing","dateCreated":1778687410000,"dateAccepted":1778695805000,"datePlayed":1778695805000,"dateScheduled":1778687410000,"dateForfeitRequested":null,"dateFinalized":null,"dateDisputed":null,"forfeitRequestedBy":null,"forfeitInFavourOf":null,"open":true,"canRequestForfeit":false,"canCancel":false,"canDispute":false,"canSchedule":false,"result":"none","gameId":"ATvuzOxB","canSubmitGame":true,"notes":"","fromUserRankings":null,"toUserRankings":null,"fromTeam":null,"toTeam":null,"seasonId":0,"includedInTouament":false,"defenderHasReplied":false,"dateFirstReply":null,"challengerIsWhite":false,"white":{"lichessId":"billy_sprinkle","lichessName":"Billy_Sprinkle","lichessURL":"https://lichess.org/@/Billy_Sprinkle","classicalRating":2006,"classicalRatingIsProvisional":false,"correspondenceRating":2140,"correspondenceRatingIsProvisional":false,"chess960Rating":1792,"chess960RatingIsProvisional":true,"correspondenceGameCount":225,"classicalGameCount":262,"lichessPatron":false,"email":"","id":443,"isAdmin":false,"timezone":"Europe/London","notes":null,"discordId":"910307603156967474","discordName":"Matt Brownsand","firstDayOfWeek":1,"totalPlayingTime":3772465,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":1,"dateJoined":1752631763000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"black":{"lichessId":"seiberdo","lichessName":"seiberdo","lichessURL":"https://lichess.org/@/seiberdo","classicalRating":1856,"classicalRatingIsProvisional":false,"correspondenceRating":2349,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":70,"classicalGameCount":196,"lichessPatron":true,"email":"","id":8012,"isAdmin":false,"timezone":"Europe/Berlin","notes":null,"discordId":"1372575882597896243","discordName":"Dominic","firstDayOfWeek":1,"totalPlayingTime":1273045,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1770221833000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null}},{"id":5135,"ladder":{"id":5,"name":"3 day correspondence ladder","description":"A correspondence ladder. You need to have played at least 5 Lichess correspondence games, and link your Discord account. The time control is 3 days per move","timeControlBase":3,"timeControlIncrement":0,"status":"open","users":null,"hoursToOrganize":72,"daysToPlay":14,"tag":"correspondence-3","type":"correspondence","level":"individual","sequence":60},"fromUser":{"lichessId":"montanaknighthawk","lichessName":"MontanaKnightHawk","lichessURL":"https://lichess.org/@/MontanaKnightHawk","classicalRating":2065,"classicalRatingIsProvisional":false,"correspondenceRating":2088,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":28,"classicalGameCount":30,"lichessPatron":false,"email":"","id":2609,"isAdmin":false,"timezone":"Europe/Berlin","notes":null,"discordId":"1488108313760628928","discordName":"MontanaKnightHawk","firstDayOfWeek":1,"totalPlayingTime":356407,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1757936496000,"dojoMember":false,"badges":[],"team":{"id":15,"name":"Preußische Pferde","description":"Some Germans conquering the team ladder","members":null,"discordRoleId":1475757537369395500,"discordChannelId":1475757538824814600,"discordGameThreadId":1475757540133310500,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1475757538824814683","isPrivate":false,"badgeColour":"#D57E5E","captainId":9125,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"toUser":{"lichessId":"allanftoledo","lichessName":"allanftoledo","lichessURL":"https://lichess.org/@/allanftoledo","classicalRating":1125,"classicalRatingIsProvisional":true,"correspondenceRating":1538,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":42,"classicalGameCount":35,"lichessPatron":false,"email":"","id":962,"isAdmin":false,"timezone":"America/Sao_Paulo","notes":null,"discordId":"623106265396281344","discordName":"Allan Toledo","firstDayOfWeek":1,"totalPlayingTime":256796,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1754066751000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"status":"playing","dateCreated":1779124100000,"dateAccepted":1779124144000,"datePlayed":1779124144000,"dateScheduled":1779124100000,"dateForfeitRequested":null,"dateFinalized":null,"dateDisputed":null,"forfeitRequestedBy":null,"forfeitInFavourOf":null,"open":true,"canRequestForfeit":false,"canCancel":false,"canDispute":false,"canSchedule":false,"result":"none","gameId":"4zkzfEGY","canSubmitGame":true,"notes":"","fromUserRankings":null,"toUserRankings":null,"fromTeam":null,"toTeam":null,"seasonId":0,"includedInTouament":false,"defenderHasReplied":false,"dateFirstReply":null,"challengerIsWhite":true,"white":{"lichessId":"montanaknighthawk","lichessName":"MontanaKnightHawk","lichessURL":"https://lichess.org/@/MontanaKnightHawk","classicalRating":2065,"classicalRatingIsProvisional":false,"correspondenceRating":2088,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":28,"classicalGameCount":30,"lichessPatron":false,"email":"","id":2609,"isAdmin":false,"timezone":"Europe/Berlin","notes":null,"discordId":"1488108313760628928","discordName":"MontanaKnightHawk","firstDayOfWeek":1,"totalPlayingTime":356407,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1757936496000,"dojoMember":false,"badges":[],"team":{"id":15,"name":"Preußische Pferde","description":"Some Germans conquering the team ladder","members":null,"discordRoleId":1475757537369395500,"discordChannelId":1475757538824814600,"discordGameThreadId":1475757540133310500,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1475757538824814683","isPrivate":false,"badgeColour":"#D57E5E","captainId":9125,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"black":{"lichessId":"allanftoledo","lichessName":"allanftoledo","lichessURL":"https://lichess.org/@/allanftoledo","classicalRating":1125,"classicalRatingIsProvisional":true,"correspondenceRating":1538,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":42,"classicalGameCount":35,"lichessPatron":false,"email":"","id":962,"isAdmin":false,"timezone":"America/Sao_Paulo","notes":null,"discordId":"623106265396281344","discordName":"Allan Toledo","firstDayOfWeek":1,"totalPlayingTime":256796,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1754066751000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null}},{"id":5169,"ladder":{"id":5,"name":"3 day correspondence ladder","description":"A correspondence ladder. You need to have played at least 5 Lichess correspondence games, and link your Discord account. The time control is 3 days per move","timeControlBase":3,"timeControlIncrement":0,"status":"open","users":null,"hoursToOrganize":72,"daysToPlay":14,"tag":"correspondence-3","type":"correspondence","level":"individual","sequence":60},"fromUser":{"lichessId":"mongreltiger","lichessName":"mongreltiger","lichessURL":"https://lichess.org/@/mongreltiger","classicalRating":1504,"classicalRatingIsProvisional":false,"correspondenceRating":1846,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":91,"classicalGameCount":422,"lichessPatron":true,"email":"","id":246,"isAdmin":false,"timezone":"America/Chicago","notes":"With advance notice I am usually available weekdays from 1400-1700 UTC, and occasionally Sunday from 1300-1500 UTC.","discordId":"694191135286886481","discordName":"monGrelTiger","firstDayOfWeek":0,"totalPlayingTime":2265143,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1751792622000,"dojoMember":true,"badges":[],"team":{"id":14,"name":"Old And In The Way","description":"A little older and a little slower than those Analog whippersnappers. Just try us. And while you're at it, GET OFF MY LAWN! For chess players 50+","members":null,"discordRoleId":1474484135253770500,"discordChannelId":1474484138022015200,"discordGameThreadId":1474484140178014200,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1474484138022015148","isPrivate":false,"badgeColour":"#520655","captainId":246,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"toUser":{"lichessId":"ibiwisi","lichessName":"ibiwisi","lichessURL":"https://lichess.org/@/ibiwisi","classicalRating":1635,"classicalRatingIsProvisional":false,"correspondenceRating":1911,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":301,"classicalGameCount":365,"lichessPatron":true,"email":"","id":5968,"isAdmin":false,"timezone":"America/Los_Angeles","notes":null,"discordId":"799706961335418890","discordName":"ibiwisi","firstDayOfWeek":1,"totalPlayingTime":1684247,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1765761894000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"status":"playing","dateCreated":1779323005000,"dateAccepted":1779325266000,"datePlayed":1779325266000,"dateScheduled":1779323005000,"dateForfeitRequested":null,"dateFinalized":null,"dateDisputed":null,"forfeitRequestedBy":null,"forfeitInFavourOf":null,"open":true,"canRequestForfeit":false,"canCancel":false,"canDispute":false,"canSchedule":false,"result":"none","gameId":"jzx5Lgcu","canSubmitGame":true,"notes":"","fromUserRankings":null,"toUserRankings":null,"fromTeam":null,"toTeam":null,"seasonId":0,"includedInTouament":false,"defenderHasReplied":false,"dateFirstReply":null,"challengerIsWhite":false,"white":{"lichessId":"ibiwisi","lichessName":"ibiwisi","lichessURL":"https://lichess.org/@/ibiwisi","classicalRating":1635,"classicalRatingIsProvisional":false,"correspondenceRating":1911,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":301,"classicalGameCount":365,"lichessPatron":true,"email":"","id":5968,"isAdmin":false,"timezone":"America/Los_Angeles","notes":null,"discordId":"799706961335418890","discordName":"ibiwisi","firstDayOfWeek":1,"totalPlayingTime":1684247,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1765761894000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"black":{"lichessId":"mongreltiger","lichessName":"mongreltiger","lichessURL":"https://lichess.org/@/mongreltiger","classicalRating":1504,"classicalRatingIsProvisional":false,"correspondenceRating":1846,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":91,"classicalGameCount":422,"lichessPatron":true,"email":"","id":246,"isAdmin":false,"timezone":"America/Chicago","notes":"With advance notice I am usually available weekdays from 1400-1700 UTC, and occasionally Sunday from 1300-1500 UTC.","discordId":"694191135286886481","discordName":"monGrelTiger","firstDayOfWeek":0,"totalPlayingTime":2265143,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1751792622000,"dojoMember":true,"badges":[],"team":{"id":14,"name":"Old And In The Way","description":"A little older and a little slower than those Analog whippersnappers. Just try us. And while you're at it, GET OFF MY LAWN! For chess players 50+","members":null,"discordRoleId":1474484135253770500,"discordChannelId":1474484138022015200,"discordGameThreadId":1474484140178014200,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1474484138022015148","isPrivate":false,"badgeColour":"#520655","captainId":246,"status":"active"},"lichessMessagingIsDisabled":false,"title":null}},{"id":5223,"ladder":{"id":5,"name":"3 day correspondence ladder","description":"A correspondence ladder. You need to have played at least 5 Lichess correspondence games, and link your Discord account. The time control is 3 days per move","timeControlBase":3,"timeControlIncrement":0,"status":"open","users":null,"hoursToOrganize":72,"daysToPlay":14,"tag":"correspondence-3","type":"correspondence","level":"individual","sequence":60},"fromUser":{"lichessId":"franconianchess","lichessName":"FranconianChess","lichessURL":"https://lichess.org/@/FranconianChess","classicalRating":1456,"classicalRatingIsProvisional":false,"correspondenceRating":1966,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":23,"classicalGameCount":239,"lichessPatron":true,"email":"","id":8847,"isAdmin":false,"timezone":"Europe/Berlin","notes":null,"discordId":"1473090629431988336","discordName":"FranconianChess","firstDayOfWeek":1,"totalPlayingTime":667527,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1771281904000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"toUser":{"lichessId":"montanaknighthawk","lichessName":"MontanaKnightHawk","lichessURL":"https://lichess.org/@/MontanaKnightHawk","classicalRating":2065,"classicalRatingIsProvisional":false,"correspondenceRating":2088,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":28,"classicalGameCount":30,"lichessPatron":false,"email":"","id":2609,"isAdmin":false,"timezone":"Europe/Berlin","notes":null,"discordId":"1488108313760628928","discordName":"MontanaKnightHawk","firstDayOfWeek":1,"totalPlayingTime":356407,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1757936496000,"dojoMember":false,"badges":[],"team":{"id":15,"name":"Preußische Pferde","description":"Some Germans conquering the team ladder","members":null,"discordRoleId":1475757537369395500,"discordChannelId":1475757538824814600,"discordGameThreadId":1475757540133310500,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1475757538824814683","isPrivate":false,"badgeColour":"#D57E5E","captainId":9125,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"status":"playing","dateCreated":1779740043000,"dateAccepted":1779742504000,"datePlayed":1779742504000,"dateScheduled":1779740043000,"dateForfeitRequested":null,"dateFinalized":null,"dateDisputed":null,"forfeitRequestedBy":null,"forfeitInFavourOf":null,"open":true,"canRequestForfeit":false,"canCancel":false,"canDispute":false,"canSchedule":false,"result":"none","gameId":"8LOHerz4","canSubmitGame":true,"notes":"","fromUserRankings":null,"toUserRankings":null,"fromTeam":null,"toTeam":null,"seasonId":0,"includedInTouament":false,"defenderHasReplied":false,"dateFirstReply":null,"challengerIsWhite":true,"white":{"lichessId":"franconianchess","lichessName":"FranconianChess","lichessURL":"https://lichess.org/@/FranconianChess","classicalRating":1456,"classicalRatingIsProvisional":false,"correspondenceRating":1966,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":23,"classicalGameCount":239,"lichessPatron":true,"email":"","id":8847,"isAdmin":false,"timezone":"Europe/Berlin","notes":null,"discordId":"1473090629431988336","discordName":"FranconianChess","firstDayOfWeek":1,"totalPlayingTime":667527,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1771281904000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"black":{"lichessId":"montanaknighthawk","lichessName":"MontanaKnightHawk","lichessURL":"https://lichess.org/@/MontanaKnightHawk","classicalRating":2065,"classicalRatingIsProvisional":false,"correspondenceRating":2088,"correspondenceRatingIsProvisional":false,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":28,"classicalGameCount":30,"lichessPatron":false,"email":"","id":2609,"isAdmin":false,"timezone":"Europe/Berlin","notes":null,"discordId":"1488108313760628928","discordName":"MontanaKnightHawk","firstDayOfWeek":1,"totalPlayingTime":356407,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1757936496000,"dojoMember":false,"badges":[],"team":{"id":15,"name":"Preußische Pferde","description":"Some Germans conquering the team ladder","members":null,"discordRoleId":1475757537369395500,"discordChannelId":1475757538824814600,"discordGameThreadId":1475757540133310500,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1475757538824814683","isPrivate":false,"badgeColour":"#D57E5E","captainId":9125,"status":"active"},"lichessMessagingIsDisabled":false,"title":null}},{"id":5267,"ladder":{"id":8,"name":"1 day correspondence ladder","description":"A correspondence ladder. You need to have played at least 5 Lichess correspondence games, and link your Discord account. The time control is 1 day per move","timeControlBase":1,"timeControlIncrement":0,"status":"open","users":null,"hoursToOrganize":72,"daysToPlay":14,"tag":"correspondence-1","type":"correspondence","level":"individual","sequence":50},"fromUser":{"lichessId":"redandrea","lichessName":"redAndrea","lichessURL":"https://lichess.org/@/redAndrea","classicalRating":1788,"classicalRatingIsProvisional":true,"correspondenceRating":2233,"correspondenceRatingIsProvisional":false,"chess960Rating":1660,"chess960RatingIsProvisional":true,"correspondenceGameCount":515,"classicalGameCount":164,"lichessPatron":true,"email":"","id":4267,"isAdmin":false,"timezone":"Europe/Rome","notes":"best between <t:1761577200:t> and <t:1761584400:t>, no weekends","discordId":"285074665020456961","discordName":"redAndrea","firstDayOfWeek":1,"totalPlayingTime":4592306,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1761576134000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"toUser":{"lichessId":"pavonine","lichessName":"pavonine","lichessURL":"https://lichess.org/@/pavonine","classicalRating":2142,"classicalRatingIsProvisional":false,"correspondenceRating":2490,"correspondenceRatingIsProvisional":false,"chess960Rating":2010,"chess960RatingIsProvisional":true,"correspondenceGameCount":137,"classicalGameCount":292,"lichessPatron":true,"email":"","id":9941,"isAdmin":false,"timezone":"Europe/Amsterdam","notes":null,"discordId":"1448762103438643230","discordName":"pavo","firstDayOfWeek":1,"totalPlayingTime":3686320,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1773207532000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"status":"playing","dateCreated":1779962845000,"dateAccepted":1779997744000,"datePlayed":1779997744000,"dateScheduled":1779962845000,"dateForfeitRequested":null,"dateFinalized":null,"dateDisputed":null,"forfeitRequestedBy":null,"forfeitInFavourOf":null,"open":true,"canRequestForfeit":false,"canCancel":false,"canDispute":false,"canSchedule":false,"result":"none","gameId":"U7s40t5r","canSubmitGame":true,"notes":"","fromUserRankings":null,"toUserRankings":null,"fromTeam":null,"toTeam":null,"seasonId":0,"includedInTouament":false,"defenderHasReplied":false,"dateFirstReply":null,"challengerIsWhite":true,"white":{"lichessId":"redandrea","lichessName":"redAndrea","lichessURL":"https://lichess.org/@/redAndrea","classicalRating":1788,"classicalRatingIsProvisional":true,"correspondenceRating":2233,"correspondenceRatingIsProvisional":false,"chess960Rating":1660,"chess960RatingIsProvisional":true,"correspondenceGameCount":515,"classicalGameCount":164,"lichessPatron":true,"email":"","id":4267,"isAdmin":false,"timezone":"Europe/Rome","notes":"best between <t:1761577200:t> and <t:1761584400:t>, no weekends","discordId":"285074665020456961","discordName":"redAndrea","firstDayOfWeek":1,"totalPlayingTime":4592306,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1761576134000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"black":{"lichessId":"pavonine","lichessName":"pavonine","lichessURL":"https://lichess.org/@/pavonine","classicalRating":2142,"classicalRatingIsProvisional":false,"correspondenceRating":2490,"correspondenceRatingIsProvisional":false,"chess960Rating":2010,"chess960RatingIsProvisional":true,"correspondenceGameCount":137,"classicalGameCount":292,"lichessPatron":true,"email":"","id":9941,"isAdmin":false,"timezone":"Europe/Amsterdam","notes":null,"discordId":"1448762103438643230","discordName":"pavo","firstDayOfWeek":1,"totalPlayingTime":3686320,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1773207532000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null}},{"id":5309,"ladder":{"id":5,"name":"3 day correspondence ladder","description":"A correspondence ladder. You need to have played at least 5 Lichess correspondence games, and link your Discord account. The time control is 3 days per move","timeControlBase":3,"timeControlIncrement":0,"status":"open","users":null,"hoursToOrganize":72,"daysToPlay":14,"tag":"correspondence-3","type":"correspondence","level":"individual","sequence":60},"fromUser":{"lichessId":"botw26","lichessName":"BOTW26","lichessURL":"https://lichess.org/@/BOTW26","classicalRating":1895,"classicalRatingIsProvisional":true,"correspondenceRating":1642,"correspondenceRatingIsProvisional":true,"chess960Rating":1552,"chess960RatingIsProvisional":true,"correspondenceGameCount":6,"classicalGameCount":26,"lichessPatron":false,"email":"","id":6525,"isAdmin":false,"timezone":"America/New_York","notes":null,"discordId":"1178697470021214260","discordName":"THE_BOT","firstDayOfWeek":1,"totalPlayingTime":246859,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1767040211000,"dojoMember":false,"badges":[],"team":{"id":5,"name":"Hanging Pawns","description":"For followers of Stjepan, aka Hanging Pawns, on YouTube","members":null,"discordRoleId":1429809823226007600,"discordChannelId":1429809442748108800,"discordGameThreadId":1460189776270594000,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1429809442748108861","isPrivate":false,"badgeColour":"#5f6fed","captainId":713,"status":"active"},"lichessMessagingIsDisabled":false,"title":null},"toUser":{"lichessId":"danut0nline","lichessName":"danut0nline","lichessURL":"https://lichess.org/@/danut0nline","classicalRating":1418,"classicalRatingIsProvisional":true,"correspondenceRating":1627,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":12,"classicalGameCount":5,"lichessPatron":false,"email":"","id":8037,"isAdmin":false,"timezone":"Europe/Bucharest","notes":null,"discordId":"1179062392764760125","discordName":"danut0nline","firstDayOfWeek":1,"totalPlayingTime":1227435,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1770267481000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"status":"playing","dateCreated":1780172325000,"dateAccepted":1780196465000,"datePlayed":1780196465000,"dateScheduled":1780172325000,"dateForfeitRequested":null,"dateFinalized":null,"dateDisputed":null,"forfeitRequestedBy":null,"forfeitInFavourOf":null,"open":true,"canRequestForfeit":false,"canCancel":false,"canDispute":false,"canSchedule":false,"result":"none","gameId":"tVuCT2ls","canSubmitGame":true,"notes":"","fromUserRankings":null,"toUserRankings":null,"fromTeam":null,"toTeam":null,"seasonId":0,"includedInTouament":false,"defenderHasReplied":false,"dateFirstReply":null,"challengerIsWhite":false,"white":{"lichessId":"danut0nline","lichessName":"danut0nline","lichessURL":"https://lichess.org/@/danut0nline","classicalRating":1418,"classicalRatingIsProvisional":true,"correspondenceRating":1627,"correspondenceRatingIsProvisional":true,"chess960Rating":0,"chess960RatingIsProvisional":false,"correspondenceGameCount":12,"classicalGameCount":5,"lichessPatron":false,"email":"","id":8037,"isAdmin":false,"timezone":"Europe/Bucharest","notes":null,"discordId":"1179062392764760125","discordName":"danut0nline","firstDayOfWeek":1,"totalPlayingTime":1227435,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1770267481000,"dojoMember":false,"badges":[],"team":null,"lichessMessagingIsDisabled":false,"title":null},"black":{"lichessId":"botw26","lichessName":"BOTW26","lichessURL":"https://lichess.org/@/BOTW26","classicalRating":1895,"classicalRatingIsProvisional":true,"correspondenceRating":1642,"correspondenceRatingIsProvisional":true,"chess960Rating":1552,"chess960RatingIsProvisional":true,"correspondenceGameCount":6,"classicalGameCount":26,"lichessPatron":false,"email":"","id":6525,"isAdmin":false,"timezone":"America/New_York","notes":null,"discordId":"1178697470021214260","discordName":"THE_BOT","firstDayOfWeek":1,"totalPlayingTime":246859,"wildcard":false,"ghosted":false,"banned":false,"dateBanned":null,"currentStrikes":0,"dateJoined":1767040211000,"dojoMember":false,"badges":[],"team":{"id":5,"name":"Hanging Pawns","description":"For followers of Stjepan, aka Hanging Pawns, on YouTube","members":null,"discordRoleId":1429809823226007600,"discordChannelId":1429809442748108800,"discordGameThreadId":1460189776270594000,"discordChannelURL":"https://discord.com/channels/1382383537952657558/1429809442748108861","isPrivate":false,"badgeColour":"#5f6fed","captainId":713,"status":"active"},"lichessMessagingIsDisabled":false,"title":null}}]`);
//await lt.api.lichessladders.getUserChallenges(laddersId);
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
