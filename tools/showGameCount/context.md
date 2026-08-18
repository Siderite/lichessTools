# Show Game Count Tool

## Purpose

Displays total rated game count badges (e.g. "[1234]") next to player usernames across Lichess pages — on user-link elements, mini-game__user spans. Excludes friend list, chat, nav, crosstable, dasher_app, challengeOptions, advice-summary, simul-list areas. Cache expires 1 hour, persisted in localStorage.

## Functionality

- Depends on `EmitPuzzleChange` and `EmitContentLoaded`.
- **showGameCount preference**: single type with values [false, true]. Default: false. Advanced (`advanced: true`). author: 'Mitchellpkt'.

## Element Collection (getElementsForGameCount)

- Finds `.user-link` and `a[href^="/@/"]` elements (cached 2000): skips if closest to excluded areas (#friend_box, lichessTools-onlineFriends, div.complete-list, crosstable__users, div.chat__members, #dasher_app, lichessTools-challengeOptions, #topnav, ublog-post__meta, mchat__messages, ublog-post-card, advice-summary__player, simul-list__content). Finds textEl (`.text` within link or the link itself); skips if already lichessTools-nogamecount/gamecount or next/next.next is lichessTools-gameCountBadge; skips if data-icon/data-tab exists; skips if no URL or not in viewport. Extracts userId from `/@/userId` regex, lowercase → dict[userId] list.push(textEl).
- Finds `span.mini-game__user` (cached 2000): skips if already lichessTools-gamecount. Finds textEl via `.lichessTools-userText`; if not exists: userLink via `.ulink` → uses it; else: raw text node (nodeType==3) index → creates `<span class="lichessTools-userText"` with ' + username, inserts before node, removes node. skips if not in viewport. userId = textEl.text().trim().toLowerCase() → dict[userId] list.push(textEl). Returns dict Map of userId→textEl lists.

## Cache Management

- **cacheExpiration**: 3600*1000 (1 hour).
- **gameCountCache getter**: Lazy loads from localStorage key `LiChessTools.gameCountCache` (raw:true) → jsonParse to Map; if error → new Map(). Returns _gameCountCache.
- **saveCache()**: Prunes expired entries (Date.now()-new Date(time) > cacheExpiration → delete); sets storage key `LiChessTools.gameCountCache` with [...gameCountCache]. debouncedSaveCache = debounce(saveCache, 100).

## Format Game Count

- **formatGameCount(count)**: count undefined/null → null; else count.toLocaleString().

## Process Game Counts (processGameCounts)

- Only if enabled AND document not hidden. dict=getElementsForGameCount(). data=Object.keys(dict.map(userId): cache.get(userId)→time=Date.now, return item; else {id:userId}.
- userIds=data.filter(i→gameCount undefined).map(i→id).slice(0,200). If length > 0 → fetches lt.api.user.getUsers(userIds). For each user: totalGames=sum of all perfs.games (excluding puzzle); item.gameCount=totalGames. Update cache: if gameCount undefined → userIds.includes(item.id) AND users.find(u→id==item.id) not exists → gameCount=0; else continue; time=Date.now; cache.set(item.id,item); toSaveCache=true. If toSaveCache → debouncedSaveCache().
- Render badges: operations=[] for each item with gameCount defined: elems=dict[item.id].filter(e→parentNode exists AND isConnected). next/next.next is lichessTools-gameCountBadge → skip. formattedCount=formatGameCount(item.gameCount). operations.push({elem,cls:'lichessTools-gamecount',afterElem=formattedCount null ? null : `<span class="lichessTools-gameCountBadge"` title gamesPlayedTitle pluralSame(item.gameCount), data-ref elem href, text '[' + formattedCount + ']'}). requestAF → for each op: elem.addClass(cls); afterElem insertAfter(elem).

## Reset/Refresh/Clear

- **resetGameCounts()**: Removes lichessTools-gameCountBadge; removes lichessTools-gamecount class; processGameCounts().
- **refreshGameCounts(m)**: user-link elements get(); href=elem.attr('href'); span=siblings(span.lichessTools-gameCountBadge); if span.length AND span.data-ref!=href → elem.removeClass lichessTools-gamecount, span remove, updated=true; if updated → processGameCounts().
- **clearCache()**: _gameCountCache undefined; storage.remove LiChessTools.gameCountCache.

## Events

- On `lichessTools.contentLoaded`: debouncedProcessGameCounts (500ms debounce)
- On `lichessTools.puzzleStart`: resetGameCounts
- Body observer on `.user-link` with attributes:true, attributeFilter:['href']: refreshGameCounts

## Preference

- **name**: `showGameCount`
- **category**: general
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: false
- **advanced**: true

## Dependencies

`EmitPuzzleChange`, `EmitContentLoaded`
