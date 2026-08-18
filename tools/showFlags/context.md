# Show Flags Tool

## Purpose

Displays player country flags (webp images) next to usernames on user-link elements and mini-game__user spans across Lichess pages. Excludes friend list, chat, nav, crosstable, dasher_app, challengeOptions, advice-summary, simul-list, bots__list areas. Cache expires 10 hours, persisted in localStorage. Country names cached from countries.json fetched via Comm.

## Functionality

- Depends on `EmitPuzzleChange` and `EmitContentLoaded`.
- **showFlags preference**: single type with values [false, true]. Default: true.

## Element Collection (getElementsForFlag)

- Finds `.user-link` and `a[href^="/@/"]` elements (cached 2000): skips if closest to excluded areas (#friend_box, lichessTools-onlineFriends, div.complete-list, crosstable__users, div.chat__members, #dasher_app, lichessTools-challengeOptions, #topnav, advice-summary__player, simul-list__content, bots__list). Finds textEl (`.text` within link or the link itself); skips if already lichessTools-noflag/flag; skips if next/next.next is img.flag OR next has img.flag; skips if data-icon/data-tab exists; skips if no URL. skips if not in viewport. Extracts userId from `/@/userId` regex, lowercase → dict[userId] list.push(textEl).
- Finds `span.mini-game__user` (cached 2000): skips if already lichessTools-noflag/flag. userNodeIndex=childNodes.findIndex(nodeType==3); if <0→skip; not in viewport→skip. userNode=childNodes[userNodeIndex]; userId=userNode.textContent.trim(); creates `<span class="lichessTools-userText"` with ' + userId, inserts before node, removes node. userId.toLowerCase() → dict[userId] list.push(textEl). Returns dict Map of userId→textEl lists.

## Cache Management

- **cacheExpiration**: 10*3600*1000 (10 hours).
- **flagCache getter**: Lazy loads from localStorage key `LiChessTools.flagCache` (raw:true) → jsonParse to Map; if error → new Map(). Returns _flagCache.
- **getCountryCache()**: Lazy loads from localStorage key `LiChessTools.countryCache` (raw:true) → jsonParse countries array; if no data → fetches lt.comm.getData('countries.json'); countries=data.countries||[]; warns if not loaded; _countryCache=new Map(countries). Returns countryMap.
- **saveCache()**: Prunes flagCache expired entries (Date.now()-new Date(time) > cacheExpiration→delete); sets storage key `LiChessTools.countryCache` with [...countryCache]; sets `LiChessTools.flagCache` with [...flagCache]. debouncedSaveCache = debounce(saveCache, 100).

## Process Flags (processFlags)

- Only if enabled AND document not hidden. dict=getElementsForFlag(). data=Object.keys(dict.map(userId): cache.get(userId→time=Date.now return item; else {id:userId}.
- userIds=data.filter(i→!i.countryName).map(i→id).slice(0,200). If length>0 → fetches lt.api.user.getUsers(userIds). For each user: item=data.find(i→id==user.id); if exists → item.country=user.profile.country||user.profile.flag||'noflag'.
- countryCache=getCountryCache(). firstToProcess=null. For each item: if no country → userIds.includes(item.id) AND users.find(u→id==item.id) not exists → country='noflag'; else continue; if country=='noflag' → countryName='noflag', time=Date.now, cache.set(item.id,item), toSaveCache=true, continue; if countryName=countryCache.get(item.country) → time=Date.now, cache.set(item.id,item), toSaveCache=true; if no countryName AND !firstToProcess → firstToProcess=item.
- If firstToProcess exists: html=lt.api.user.getMini(firstToProcess.id); regex `<span class="upt__info__top__country|upt__info__top__flag".*?>(.*?)</span>` match m; el=$(m[0]); countryName=el.text||el.attr('title'); if countryName → countryCache.set(item.country,firstToProcess.countryName), time=Date.now, cache.set(item.id,item), toSaveCache=true.
- If toSaveCache → debouncedSaveCache(). operations=[]: for each item with countryName defined: elems=dict[item.id].filter(e→parentNode exists AND isConnected). next/next.next is img.flag OR next has img.flag → skip; if countryName=='noflag' → push {elem,cls:'lichessTools-noflag',afterElem:null}; else → flagUrl=lt.assetUrl('flags/'+item.country+'.webp'); push {elem,cls:'lichessTools-flag',afterElem=$('<img class="flag"` loading lazy, title countryName, src flagUrl, data-ref elem href; lt.net.logNetwork(flagUrl,1000,0).
- requestAF → for each op: elem.addClass(cls); afterElem insertAfter(elem).

## Reset/Refresh/Clear

- **resetFlags()**: Removes lichessTools-flag+img.flag; removes lichessTools-flag/noflag classes; processFlags().
- **refreshFlags(m)**: body observer mutations filtered type='attributes', attributeName='href', target is .user-link → map to targets. For each elem: href=elem.attr('href'); if href AND elem is lichessTools-noflag → remove class, updated=true; img=siblings(img.flag)+children(img.flag); if img.length AND img.data-ref!=href → elem.removeClass lichessTools-flag, img remove, updated=true; if updated → processFlags().
- **clearCache()**: _flagCache undefined; _countryCache undefined; storage.remove flagCache/countryCache.

## Events

- On `lichessTools.contentLoaded`: debouncedProcessFlags (500ms debounce)
- On `lichessTools.puzzleStart`: resetFlags
- Body observer on `.user-link` with attributes:true, attributeFilter:['href']: refreshFlags
- #form3-flag change → clearCache

## Preference

- **name**: `showFlags`
- **category**: general
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true

## Dependencies

`EmitPuzzleChange`, `EmitContentLoaded`
