# FriendsPlaying Tool — Context Summary

## Purpose

The **FriendsPlayingTool** plays sound + voice alerts when friends (users you follow) start playing a game. It filters by time control type, and it only alerts players whose effective alerts state is `unmuted` - new friends default to the `muteFriendsNotifications` preference (default: `muted`) and each player can override that default with a stored state. It also respects quiet mode, audio permission requirements and cooldown timing.

## Dependencies

- **FriendsList**

## Preferences

- **name**: `friendsPlaying`
- **category**: `friends`
- **type**: multiple (checkboxes)
- **possibleValues**: [`ultrabullet`, `bullet`, `blitz`, `rapid`, `classical`, `standard`]
- **valuePrefix**: `gameType-`
- **defaultValue**: `false`
- **needsLogin**: true

Each checkbox enables alerts for that time control type. When set to `false`, no alerts. When includes `standard`: only alerts standard games (no variant).

- **name**: `muteFriendsNotifications`
- **category**: `friends`
- **type**: single (radio)
- **possibleValues**: [`muted`, `unmuted`]
- **defaultValue**: `muted` (notifications are muted out of the box)
- **offValue**: `muted` ("turn all off" keeps them muted)
- **needsLogin**: true

Global default for players that have no alerts state of their own (that is, for new friends): when `muted` (the default), a friend with no stored state makes no sound or voice; when `unmuted`, new friends alert by default. A player that was toggled explicitly always follows its stored state instead.

## Alert status - single place (`alertStatus`)

Per-player alerts state is a tri-state saved in local storage, key `LiChessTools.friendsAlertStatus`, a map `username -> 'muted' | 'unmuted'`:
- **missing entry** - no state of its own; the `muteFriendsNotifications` default applies (so a new friend follows whatever the user configured).
- **`muted`** - alerts muted for that player, even when the default is `unmuted`.
- **`unmuted`** - alerts on for that player, even when the default is `muted`.

Every query of a player's alert status goes through these methods - `friendsList` calls them through `lt.tools.FriendsPlayingTool` and never re-derives the state:
- `defaultAlertStatus()` - the `muteFriendsNotifications` preference value, fallback `'muted'`.
- `alertStatusMap()` - the storage map, fallback `{}`.
- `alertStatus(user, statusMap)` - `statusMap[user.toLowerCase()]` or the default; `statusMap` is optional and fetched from storage when omitted.
- `alertMuted(user, statusMap)` - `alertStatus(...) == 'muted'`, the boolean the callers use.

## Sound/Voice Alert Logic (`playFriendSound`)

### Silent Conditions (if any applies, no alert):
1. **enabled=false**: options disabled
2. **muted**: `alertStatus(username)` resolves to `muted` - the stored state, or the default when there is none; read live from storage/options, and it short-circuits before the API fetch below
3. **quietMode**: lichess.quietMode active (game playing on other tab silences alerts)
4. **audioNotAllowed**: await `lt.isAudioAllowed()` returns false — shows "Audio allowed only after user action" warning on `#warn-no-autoplay` element
5. **tooSoon**: previous friendSound storage time < 1000ms from now (cooldown)
6. **wrongGameType**: game type not in enabled options list
7. **notStandard**: variant is non-standard when `standard` option is set
8. **lostBid**: storage bid ID mismatch after timeout

### Alert Execution Flow:
1. Checks silent conditions above
2. If no silent + !lt.net.slowMode: fetches `lt.api.user.getUserStatus([username], withGameMetas=true)` — extracts gameType from clock (`lt.getGameTime`), variant, hasInfo=true
3. Generates random bid ID `(lt.random()+1).toString(36).substring(8)`
4. Fires storage event `LiChessTools.friendSound` with time:now + id
5. Timeout 200ms — checks storedId matches generatedId (if mismatch → lostBid silent)
6. Timeout 500ms
7. Plays audio: `lt.play('piano/GenericNotify.mp3')`
8. Speaks translation: `lt.translator.plural('playing',1,username.replace(/[_\-]/g,' ')) + ', + lt.translator.noarg('gameType-'+gameType)` — adds variant if non-standard

### Debug Logging
Console debug username playing → silent conditions breakdown → eventType/gameType/variant/silent.

## Mute Player (`mutePlayer`)
Lowercases the user, takes the storage map once with `alertStatusMap()`, resolves the effective state with `alertStatus(user, statusMap)` and flips it. If the flipped state equals `defaultAlertStatus()`, the entry is deleted - the friend stops having a state of its own and follows the default for new friends; otherwise the explicit `muted`/`unmuted` value is written with `lt.storage.set('LiChessTools.friendsAlertStatus', statusMap)`. It is synchronous and does not touch `currentOptions`, so no `saveOptions`/`fireReloadOptions` is needed: `friendsList` re-renders its rows right after emitting `lichessTools.mutePlayer`.

### Audio Not Allowed Warning (`showAudioNotAllowed`)
Checks `lt.isAudioAllowed()`. Toggles `#warn-no-autoplay` class 'shown' if !isAudioAllowed. Adds/removes title "LiChess Tools - Audio allowed only after user action". If isAudioAllowed: clears interval; removes title. If not allowed: adds title, sets interval 1000ms to re-check.

### Initialization (`start()`)
Checks lichess + uiApi exist. Reads `friendsPlaying`, then migrates the legacy `mutedPlayers` value (a list of usernames in the options blob) into the storage map as explicit `muted` entries for players that have no entry yet, saves options once and deletes that legacy key. Logs the alert value, ` ... default for new friends` and the explicit overrides split as ` ... muted` / ` ... unmuted`. Options = {enabled: !!value, defaultAlertStatus}. Not logged in → disabled. Unbinds onlineFriends 'playing' event + mutePlayer pubsub. Clears audioCheckTimeout. If value !== false and value.toString without standard: binds onlineFriends playing event + mutePlayer pubsub (events stay bound while a player is muted; the suppression happens in `playFriendSound` through `alertStatus`, so changing the default or a per-player state needs no page reload).