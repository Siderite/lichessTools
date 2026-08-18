# FriendsPlaying Tool — Context Summary

## Purpose

The **FriendsPlayingTool** plays sound + voice alerts when friends (users you follow) start playing a game. It filters by time control type, respects mute list, quiet mode, audio permission requirements, and cooldown timing.

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

## Sound/Voice Alert Logic (`playFriendSound`)

### Silent Conditions (if any applies, no alert):
1. **enabled=false**: options disabled
2. **isMuted**: username in `mutedPlayers` list from currentOptions
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
User lowercase: checks `mutedPlayers` list from currentOptions. If included → removes; else → pushes. Sets `lt.currentOptions.mutedPlayers`, saves options, fires reloadOptions(true).

### Audio Not Allowed Warning (`showAudioNotAllowed`)
Checks `lt.isAudioAllowed()`. Toggles `#warn-no-autoplay` class 'shown' if !isAudioAllowed. Adds/removes title "LiChess Tools - Audio allowed only after user action". If isAudioAllowed: clears interval; removes title. If not allowed: adds title, sets interval 1000ms to re-check.

### Initialization (`start()`)
Checks lichess + uiApi exist. Reads friendsPlaying value. Options = {enabled: !!value}. Logs mutedPlayers if length > 0. Not logged in → disabled. Unbinds onlineFriends 'playing' event + mutePlayer pubsub. Clears audioCheckTimeout. If value !== false and value.toString without standard: binds onlineFriends playing event + mutePlayer pubsub.