# TvOptions Tool

## Purpose

Adds TV-related features on Lichess: links/bookmarks for current TV games, streamer TV page with live streamers' games, friends TV page with friends' games, team TV page with team members' games, previous two games history in player TV pages, persistent TV channel storage.

## How It Works

### Game Page Channel Buttons

On `/games` page (`main.tv-games div.tv-channels`):
- **Streamers button**: `<a href="/games#streamers">` with AnalogTv icon — toggles active when hash is #streamers
- **Friends button**: `<a href="/games#friends">` with User icon — toggles active when hash is #friends (requires login)
- **Team button**: `<a href="/games#team">` with Group icon — toggles active when hash is #team (requires login)

### Streamer TV Page (`/games#streamers`)

Fetches live streamers via `lt.api.streamer.getLiveStreamers()`, refreshes games in `now-playing` container. Each mini-game includes a link to `/streamer/[user]`.

### Friends TV Page (`/games#friends`)

Uses friends playing list from onlineFriends events, refreshes games in now-playing container.

### Team TV Page (`/games#team`)

- Creates `<select class="lichessTools-teams">` for team selection (fetches user teams via API)
- Fetches team players via `lt.api.team.getTeamPlayers(teamId)`
- Refreshes games in now-playing container with spinner indicator

### Game End Override

Wraps `lt.uiApi.overrides.tvGamesOnFinish`:
- Before call: removes game from streamer/friends/team page if on those pages, updates page, returns false (prevents Lichess default behavior)

### TV Page Features

On `/tv` page (`div.game__meta section`):
- **Link**: wraps header in `<a>` with href to gameId (with color suffix if isBlack)
- **Bookmark**: adds star bookmark link to `/bookmark/[gameId]` inside setup div
- **User TV History**: fetches user's 2 finished games via API, displays as mini-games in `round__underboard` with "Previously on [user] TV" header

### Persistent TV Channel

On `/tv` page: stores current channel in `LiChessTools.TvChannel`. If no channel specified, redirects to stored channel.

### Time Control Refresh

MutationObserver on `div` elements — debounced (100ms) refresh of time control classes on mini-game links.

## Dependencies

- EmitContentLoaded

## Preferences

- `tvOptions` — multiple type: ['link', 'bookmark', 'streamerTv', 'friendsTv', 'teamTv', 'userTvHistory', 'stickyCategory'], default: 'link,bookmark,streamerTv,friendsTv,userTvHistory'

## Key Methods

- `updateTvOptionsButton()` — manages channel buttons in tv-channels container
- `refreshGames(playerIds, container, streamers)` — fetches and adds mini-games for player IDs
- `getTeamPlayerIds()` — fetches team players via API
- `updateTvOptionsPageDirect()` — manages now-playing page content per hash
- `following_onlines`, `enters`, `leaves`, `playing`, `stopped_playing` — react to onlineFriends events
- `hashChange()` — empties container and re-updates on hash change
