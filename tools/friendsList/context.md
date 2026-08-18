# FriendsList Tool — Context Summary

## Purpose

The **FriendsListTool** displays online friends (users you follow) in various UI locations: friend box, menu section, site-buttons button dropdown. It also enhances the friends page (/@/user/following), followers page (#followers), blocked players page, and favorite opponents page with live status updates, TV links, mute/unmute alerts, crosstable scores, filters, and pagination.

## Dependencies

- **DetectThirdParties**, **InterceptEventHandlers**, **EmitContentLoaded**, **LobbyCrosstable** (described as "ugly hack dependency")

## Preferences

### openFriends
- **name**: `openFriends`
- **category**: `friends`
- **type**: single (radio)
- **possibleValues**: [`default`, `open`, `menu`, `button`, `hidden`]
- **defaultValue**: `menu`
- **offValue**: `default`
- **needsLogin**: true

### liveFriendsPage
- **name**: `liveFriendsPage`
- **category**: `friends`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `true`
- **needsLogin**: true

## Modes for openFriends:

- **default**/true: lichess friend box displayed normally, no lt additions
- **open**: friend box displayed + triggers click if content_wrap is .none
- **menu**: friend box hidden (`display:none`), adds `section.lichessTools-onlineFriends` to `#topnav` menu parent with count link and cloned user links from friend_box
- **button**: friend box hidden, adds `div.lichessTools-onlineFriends` to `.site-buttons` before dasher — toggle button with dropdown pager containing user links, hideNotPlaying toggle, notifications area
- **hidden**: friend box content_wrap gets .none class + display:none, removes all lt additions

## Live Friends Page Enhancement

When `liveFriendsPage=true` and on friends/favorite opponents/blocked players/followers page:

### Header (`lichessTools-livePageHeader`)
Inserted after `main.box div.box__top`:
- Links to followers page (/@/user/following#followers) and opponents page (/player/opponents)
- Live buttons group: friendFilter input (text filter, debounce 200ms), icons for hideInactive (Antichess icon), hideOffline (DiscOutline), hideNotPlaying (AnalogTv), hideMuted (BellOutline — only on non-favorites/blocks/followers pages)

### Table Enhancement
Each row in `table.slist`:
- TV link (`a.lichessTools-tv` with AnalogTv icon, href /@/user/tv — only on non-blocks page)
- Mute link (`a.lichessTools-mute` with BellOutline icon, emits `lichessTools.mutePlayer` pubsub event — only on non-favorites/blocks/followers + hasAlerts)
- Unblock link (`a.lichessTools-unblock` with NotAllowed icon, calls `lt.api.relation.unblockPlayer` — only on blocks page)
- Inactive class toggle based on lastAt datetime > 100 years ago
- Online/playing classes toggled from user_data

### Paginated Rows
For non-favorites/blocks/followers pages without existing pager rows: adds `<tr class="paginated"` rows for each online user with TV link actions.

### Crosstable Bulk API
On favorite opponents page: calls `lt.api.user.getCrosstableBulk` for all row users vs current user. Winrate displayed as `(wins/total)` span after player.b link, bad if winrate<34+nbGames>1, good if winrate>66+nbGames>1.

### Followers Page (#followers)
Hash == '#followers': table gets `_followersPage` flag. tbody emptied. API `lt.api.relation.getFollowersNew(1,1)` fetches followers. Each follower: `<tr class="paginated"` with user link + time text (Date.now()-follower.time). Pager row if nextPage exists with href /@/TotalNoob69/followers?page=nextPage. h1 replacedText with followers count plural. document title set to "LiChess Tools - Followers".

## User Data Management

`user_data` object: `names`, `online`, `playing`, `timeControls`. Updated via UIApi onlineFriends events:
- **onlines**: full data update — names from d[], online from d[].map getUserId, playing from playing[].map getUserId, timeControls from arr.filter(i=>i.playing) with gameTime
- **enters**: userId added to online (if not present), playing if data.playing=true
- **leaves**: removed from online/playing, timeControls undefined
- **playing**: added to online/playing
- **stopped_playing**: removed from playing, timeControls undefined

### getUserId
Lowercase user string, removes leading whitespace+first char pattern (`^\w+\s`).

## Friends Menu (`updateFriendsMenu`)
For `openFriends='menu`: adds section to menuParent (`#topnav`): count link with title "LiChess Tools - friends you follow", div role="group". Touch device: adds lichessTools-touchFriendsLink. Clones friend_box user links into group, playing users get /@/user/tv href + timeControl class. If followingOnlinesRequests > 5 or no friends: adds temp links for all online users with manualUser powertip onmouseover. Removes leftover items.

## Friends Button (`updateFriendsButton`)
For `openFriends='menu'/'button`: creates div in `.site-buttons` before dasher: toggle button (Group icon, title "LiChess Tools - friends you follow", mouseover/click triggers requestOnlines), span data-count with online count, dropdown links with pager prev/upTriangle, friendsLink href /@/user/following, hideNotPlaying button (AnalogTv), notifications area, pager next/downTriangle. Pager buttons decrement/increment `buttonStartIndex` by `buttonPageSize=7`. hideNotPlaying toggles between playing vs online data. Displayed items sliced from startIndex+pageSize. Playing users get timeControl class + /@/user/tv href. Non-playing: /@/user href.

## RequestOnlines
Triggers `lt.uiApi.onlineFriends.request()` + `requestOnlinesApi`: if user_data.playing.length, fetches `lt.api.user.getUserStatus` with gameMetas for playing users, extracts timeControls from clock. Updates menu/button. Interval runs every 5000ms — after >5 requests gives up and calls getFollowingOnlinesByApi (TODO placeholder).

## Hashchange
On hash change: if followers page — reloads or initializes followers table; else — removes _followersPage flag + reloads. Calls updateFriendsPageDirect.

## Scroll Handler
Pager in viewport → triggers pager a click. filterFriends called.

## Crosstable Parsing (`parseCrosstable`)
On `div.crosstable`: extracts users from crosstable__users a.user-link (regex /@/user), scores from crosstable__score spans (replace ½→.5). Total = sum scores. Cache sets getCrosstable["user1","user2"] and reverse with local persist, interval 86400000ms. Delayed via setTimeout 500ms on uiApi socket endData event.

## Initialization (`init()`)
If followers page: `history.scrollRestoration = "manual"`.

### Start (`start()`)
Reads openFriends + liveFriendsPage values. Low width (<1020) forces button mode if not hidden. Options include friendsPlaying + mutedPlayers from other prefs. Not logged in → disabled. Refreshes followers via relation API regardless of options. Unbinds onlineFriends events, binds if menu/button/liveFriendsPage+isFriendsPage. Unbinds hashchange/scroll, binds if isLivePage. Interval 5000ms for checkOnlineFriends (after >5 requests gives up). Switch openFriends mode: triggers friend_box click or hides it. Removes lt additions per mode. Updates menu + button. Binds socket endData for crosstable parsing if liveFriendsPage or LobbyCrosstable enabled.