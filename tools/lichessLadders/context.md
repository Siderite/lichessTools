# LichessLadders Tool — Context Summary

## Purpose

The **LichessLaddersTool** integrates with [lichessladders.com](https://lichessladders.com) — a challenge ladder system. It adds menu items in topnav, a summary page at `/page/lichessLadders`, challenge notifications (upcoming games), message notifications (unread messages). Displays ladders, user challenges, upcoming challenges, live challenges with matchup info and game links/challenge buttons.

## Dependencies

- **AddNotifications**

## Preferences

### lichessLadders
- **name**: `lichessLadders`
- **category**: `integration`
- **type**: multiple (checkboxes)
- **possibleValues**: [`menuItem`, `page`, `challengeNotifications`, `messageNotifications`]
- **defaultValue**: `true`
- **needsLogin**: true

### lichessLaddersSubmenu
- **name**: `lichessLaddersSubmenu`
- **category**: `integration`
- **type**: single (radio)
- **possibleValues**: [`0`, `1`, `2`, `3`, `4`, `5`]
- **defaultValue**: `5`
- **offValue**: `0`
- **advanced**: true
- **needsLogin**: true

Controls max number of challenge items in submenu (0=none, 1-5 = count).

## How It Works

### Notifications (`notifyUnread`, `notifyUpcoming`)
Creates notification objects with getEntries async function:
- **notifyUnread** (messageNotifications active): fetches `lt.api.lichessladders.getSummary()` → if unreadMessageCount > 0 → entry id='lichessLadders', icon=Ladder, href=https://lichessladders.com/challenges target=_blank, content span text pluralSame("You have %s unread Lichess Ladders messages",count), title "LiChess Tools - go to Lichess Ladders challenges" → lt.notifications.add
- **notifyUpcoming** (challengeNotifications active): fetches summary → if nextChallengeId + nextChallengeTime exist → time = Math.floor((challengeTime-Date.now())/60/1000) > 60 → returns []; entry id='lichessLaddersChallenge'+challengeId, icon=Ladder, href=https://lichessladders.com/challenges target=_blank, content span text pluralSame("You have a Lichess Ladders game starting in %s minutes",time), title "LiChess Tools - go to Lichess Ladders challenges" → lt.notifications.add

### DateTime String (`toDateTimeString(ts)`)
Date ts → toLocaleDateString (day numeric, month short, year numeric) + toLocaleTimeString (hour 2-digit, minute 2-digit, hour12=false). Returns `${dateStr} ${timeStr}`.

### Challenge Element Creation (`createChallengeElem(challenge, elems)`)
If challenge.challenge exists → uses challenge.challenge. Template HTML with $placeholders: ladder/ladderId/challengerUrl/challengerName/challengerColor/challengerMeta/defenderUrl/defenderName/defenderColor/defenderMeta. key = challenge.ladder.type+Rating (fallback classicalRating). challengerName from fromUser.lichessName, color from challengerIsWhite. meta from rating + IsProvisional '?'. defender similarly. data object → html replace $key$ with data[key] or trans.noarg(key). lt.htmlEncode names/meta. result = $(html). vs div gets Swords icon. If gameId: gameElem from elems (if not exists: `<a href=/id` data-live=data-state color, mini-game class + cg-wrap span) → appended to footer. If !gameId + userId==fromUserlichessId: variant chess960/standard, challengeUrl /?user=encodeURIComponent(toUserlichessId)&variant=&gameMode=rated + time=correspondence(minutesPerSide+increment) or time=realTime(days) + color=white/black + #friend → footer append `<a class="challengePlayer" text "Challenge now" title "challenge the defender to a game now" href challengeUrl`.

### Page Processing (`processPage`)
If !options.page: returns. If pathname != "/page/lichessLadders": returns. document.title = "Lichess Ladders Summary - LiChess Tools". main(#main-wrap main) empty → class lichessTools-lichessLadders + spinnerHtml. laddersId via API getLaddersId(userId) catch announce "Error connecting to Lichess Ladders". userChallenges from getUserChallenges(laddersId). ids Set from userChallenges.map(ch→ch.id). upcomingChallenges via getUpcomingChallenges → remove those with ids.has. liveChallenges via getLiveChallenges → remove those with ch.challenge.id in ids. ladders via getLadders → userLadders if laddersId → joinedIds Set → ladders.forEach(l→l.joined=joinedIds.has(l.id) → sort (joined?-10000000:0)+id. gameData from all challenges.map(ch→ch.challenge/ch→gameId,color) filter d→d.id → api.game.getMinis(gameData). main empty + help-button InfoCircle href user manual blog + h2 span "Lichess Ladders summary" + a href lichessladders.com title "more on Lichess Ladders" GreaterThan icon. If ladders.length: section lichessTools-lichessLadders-ladders h3 "Ladders" + a href lichessladders.com/ladders → container div ladders. Each ladder: text correspondence=timeControlBase D or timeControlBase+increment, icon correspondence=PaperAirplane classical=Turtle chess960=DieSix team=Group → a class ladder data-type-icon title name\r\ndescription href https://lichessladders.com/ladders/id span text joined toggle. If joined: getUserLadder(laddersId,ladder.id) then → elem attr data-count openChallengeCount class data-count + ranking span + delta previousChallenge.previousRanking-newRanking if exists → delta span data-icon UpwardsWhiteArrow/DownwardsWhiteArrow green/red. displayChallenges async(challenges,container): laddersInOrder from ladders or challenges.map(c→c.challenge.ladder/c.ladder sort by id → each ladder h4 name + div → ladderChallenges filter c→ladder.id==challenge.ladder.id → createChallengeElem per challenge append to ladderElem. userChallenges section if length: h3 "Your challenges" + a href challenges → displayChallenges. upcomingChallenges section if length: h3 "Challenges coming up soon" + a href challenges/scheduled → displayChallenges. liveChallenges section if length: h3 "Challenges playing now" + a href challenges/live → displayChallenges. uiApi.initializeDom(main[0]).

### Menu Item (`start()`)
Container `#topnav section a[href="/"]+div[role="group"]`. Removes existing lichessLadders elements. If menuItem: elem `<a class lichessTools-lichessLadders` appended to container. If page: text "Lichess Ladders summary" title "Lichess Ladders Summary - LiChess Tools" href /page/lichessLadders; else: target=_blank text "Lichess Ladders" title "LiChess Tools - go to Lichess Ladders" href https://lichessladders.com/. populateUserChallenges async: laddersId via API → userChallenges if laddersId → if !length: returns. group `<div role="group"` appended to elem. challenges.slice(0,maxItemCount): getUserText(user) = lichessName+space + rating(key=ladder.type+Rating fallback classicalRating)+IsProvisional '?'. text=getUserText(challenge.white)-+getUserText(challenge.black). orientation userId==whitelichessId?white:black. If gameId: `<a class glpt href /challenge.gameId/orientation` text title "open game" → group. Else if page: `<a class upcoming target="_blank" href /page/lichessLadders` text title "go to Lichess Ladders summary" → group. Else: `<a class upcoming target="_blank" href https://lichessladders.com/challenges` text title "LiChess Tools - go to Lichess Ladders" → group. If maxItemCount+userChallenges.length>maxItemCount: `<a class upcoming target="_blank" href https://lichessladders.com/challenges` text "..." → group. lichess.powertip.manualGameIn(group[0). processPage + notifyUnread + notifyUpcoming.

### Initialization (`start()`)
Reads lichessLadders + lichessLaddersSubmenu values from `lt.currentOptions`. Options: menuItem/page/challengeNotifications/messageNotifications/maxItemCount=+lichessLaddersSubmenu. userId check → not logged in disabled. Removes existing elements from topnav container. If menuItem: creates elem with page/else href + populateUserChallenges async. processPage + notifyUnread + notifyUpcoming.