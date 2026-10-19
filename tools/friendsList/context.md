# Friends List Tool — Context

## Overview

The **FriendsListTool** is the core of the friends system. It shows online friends in the top menu, on the friends box, and adds a "live" friends/followers/opponents/blocked players page with filters, watch-game (TV) links, mute-play-alert buttons, unblock buttons, and crosstable scores. It relies on the `friendsPlaying` tool's `friendsPlaying` preference for play alerts, and it asks the `friendsPlaying` tool (`lt.tools.FriendsPlayingTool.alertMuted`) for each player's effective alerts state, so the muted/unmuted decision is never duplicated here.

## Dependencies

- `DetectThirdParties`
- `InterceptEventHandlers`
- `EmitContentLoaded`
- `LobbyCrosstable` (hack dependency — the crosstable parsing lives here and is shared)

## Preferences

- **openFriends**:
  - name `openFriends`, category `friends`, type `single`, possibleValues `['default', 'menu', 'hidden']`, defaultValue `'menu'`, offValue `'default'`, needsLogin `true`
- **liveFriendsPage**:
  - name `liveFriendsPage`, category `friends`, type `single`, possibleValues `[false, true]`, defaultValue `true`, needsLogin `true`

Also reads (from the `friendsPlaying` tool): `friendsPlaying`. The effective per-player alerts state (muted / unmuted) is queried through `lt.tools.FriendsPlayingTool.alertMuted(user, alertStatusMap)` - friendsList never re-derives it from the `muteFriendsNotifications` default or from the `LiChessTools.friendsAlertStatus` storage map.

## Behavior

### State

- `menuParent = '#topnav'`.
- `user_data = { names, online, playing, timeControls }`.
- `friends`, `rows` maps keyed by lowercased user id.
- `buttonPageSize = 7`, `buttonStartIndex = 0`, `hideNotPlaying = false`.
- `isLivePage` = friends page, favorite-opponents page, blocked-players page, or followers page.

### Online Friends Events

Listens to `lt.uiApi.onlineFriends.events`: `onlines`, `enters`, `leaves`, `playing`, `stopped_playing`, updating `user_data` and calling `updateFriendsPage`, `updateFriendsMenu`, `updateFriendsButton`. `refreshTimeControls()` fetches user status (with game metas) for playing friends and stores their time-control class.

### Friends Box Button (`updateFriendsButton`)

- Wraps the friend box count with a link to `/@/me/following`.
- Sets `data-count` (online count) and marks playing friends with `lichessTools-playing` / `lichessTools-playing-<timeControl>` classes.

### Friends Menu (`updateFriendsMenu`)

- When `openFriends === 'menu'`, builds a `section.lichessTools-onlineFriends` inside `#topnav` with a link to the following page and a group of friend links.
- Playing friends link to `/@/<user>/tv`; non-playing link to `/@/<user>`.
- On touch devices, requests onlines on tap; on hover (non-touch) requests onlines.

### Live Friends Page (`updateFriendsPageDirect`)

On the live page it builds a `div.lichessTools-livePageHeader` with:
- **Friends/followers/opponents links** (only on the friends page): a followers link (`/@/<me>/following#followers`) and an opponents link (`/player/opponents`).
- **Filter input** (`input.lichessTools-friendFilter`) that filters rows by name (debounced 200ms via `filterFriends`).
- **Toggle buttons** (`icon` elements): hide-inactive (`Antichess` icon), hide-offline (`DiscOutline`), hide-not-playing (`AnalogTv`), and hide-muted (`BellOutline`, only on the friends page). Each toggles a class on `main`. There is no global alerts toggle in the page - the default state is a preference of the `friendsPlaying` tool, and per-player toggles live on each row.
- **Row actions**: watch-games TV link (`AnalogTv`), mute-play-alert link (`BellOutline`, only when `friendsPlaying` enabled), unblock link (`NotAllowed`, only on blocked page). Rows older than a year get `lichessTools-inactive`.
- Marks rows online/offline/playing/muted, where `lichessTools-muted` is the effective state from `lt.tools.FriendsPlayingTool.alertMuted(user, alertStatusMap)` (the map is fetched once per pass with `alertStatusMap()`), and `a.lichessTools-mute` title flips between `enablePlayAlert` / `mutePlayAlert` on that same effective state. On the favorite-opponents page fetches crosstable data (`lt.api.user.getCrosstableBulk`) to show win/loss scores with `good`/`bad` coloring.

### Followers Page (`hashchange`)

- On `#followers` navigation, fetches followers via `lt.api.relation.getFollowersNew`, replaces the page title/heading, and renders follower rows with a pager for infinite scroll.
- `onScroll` auto-clicks the pager when in view; `scrollIfNeeded` triggers scrolling when the pager becomes visible.

### Crosstable Caching (`parseCrosstable`)

- Parses `div.crosstable` (users + scores) and caches `getCrosstable[...]` for 1 day in local storage; triggered on the socket `endData` event (shared with `LobbyCrosstableTool`).

### Start

- Reads `openFriends`, `liveFriendsPage` and `friendsPlaying`. It keeps no alerts state of its own; the muted/unmuted status of a row is queried from `friendsPlaying`.
- If not logged in, returns.
- Refreshes followers in the background when the extension is enabled.
- Binds/unbinds online-friends events based on `openFriends`/`liveFriendsPage` settings.
- Applies the `openFriends` mode via body classes (`lichessTools-friends-hidden` / `lichessTools-friends-menu`).
- On live pages, binds `hashchange`/`scroll` and `contentLoaded` (when `liveFriendsPage`).
- Binds the socket `endData` event for crosstable parsing when `liveFriendsPage` or the lobby crosstable tool is enabled.

## Cleanup on Disable

Unbinds online-friends events, hashchange/scroll handlers, `contentLoaded` pubsub, and socket `endData`; removes the live-page header and `lichessTools-*` row/body classes.

## Internationalization (intl)

Translations provided for en-US and ro-RO for the online friends count, friends menu, friends section options, watch games, mute/enable play alert, live friends page, hide-offline/not-playing/muted/inactive toggles, followers/opponents labels, friends/followers count titles, name filter, and unblock. The `muteFriendsNotifications` option labels (and its `muted`/`unmuted` value labels) live in the `friendsPlaying` tool intl.
