# Main Page Elements Tool — Context Summary

## Purpose

Customizes the lichess lobby/main page layout by showing/hiding various sections (side panel, play grid, buttons, TV, blog, puzzle, support, feed, tournaments, about) and adding extra counters and recent games display.

## Dependencies

`DetectThirdParties`, `ChessOps`

## Preferences

| Name | Category | Type | Default | Advanced |
|------|----------|------|---------|----------|
| `mainPageElements` | appearance | multiple (checkboxes) | comprehensive default set | yes |

Possible values: **side**, **side_streams**, **side_spotlights**, **side_timeline**, **app**, **app_bullet**, **app_blitz**, **app_rapid**, **app_classical**, **table**, **tv**, **blog**, **puzzle**, **support**, **feed**, **tours**, **about**, **extraCounters**, **recentGames**.

## Architecture

The tool extends `LiChessTools.Tools.ToolBase`. It modifies CSS grid layout and DOM elements on the lobby page.

### Grid Template Areas (`initialGrid`)

Captures `$('main').css('grid-template-areas')` as initial state. When not "Play" mode, replaces all lowercase area names with:
- If option enabled → keep original name (timeline→side fallback).
- If option disabled → `'.'` padded to same length (tv→side fallback if tv disabled).
- If side has pins/dailyQuote → keep 'side'.

When **Play** mode (`isPlay=true`): removes grid replacement, toggles `.lichessTools-lobbyPlay` class. Title = play span text + bullet point icon + hostname.

### isPlay Detection

If `app` disabled: topnav first section a href set to `/#play`. `isPlay` = hash == '#play'. If `app` enabled: href set to `/`.

### Hash Change

When `app` disabled: binds global hashchange → reloads page.

### applyLobbyElements — Layout modification

Toggle `.lichessTools-hideElement` class on each lobby section based on options:
- `main .lobby__side`: side option (also requires at least one of streams/spotlights/timeline)
- `main .lobby__streams`: side + side_streams
- `main .lobby__spotlights`: side + side_spotlights
- `main .lobby__timeline`: side + side_timeline (requires userId)
- `main .lobby__app`: app option
- App sub-divs by data-id:
  - `1+0,2+1` → app_bullet
  - `3+0,3+2,5+0,5+3` → app_blitz
  - `10+0,10+5,15+10` → app_rapid
  - `30+0,30+20` → app_classical
- `main .lobby__table`: table
- `main .lobby__tv`: tv
- `main .lobby__blog`: blog
- `main .lobby__puzzle`: puzzle
- `main .lobby__support`: support
- `main .lobby__feed`: feed
- `main .lobby__tournaments-simuls`: tours
- `main .lobby__about`: about

Feed relocation: if side enabled + timeline disabled + feed enabled → move feed into side. Otherwise → move feed back to main.

### recentGames — User recent games display

Requires userId and `recentGames` option enabled:
1. Fetches `lt.api.game.getUserGamesJson(userId, { moves: false, max: 8 })`. Sorts by lastMoveAt/createdAt descending.
2. For each game extracts: id, variant (→variantClass), perf (→timeControlClass), white/black names, userWhite flag, opponentId, ratings (opponentRating, yourRating, deltaRating), href (`/id` or `/id/black`). Winner → resultClass (win/loss).
3. Fetches `lt.api.user.getUsers` for unique opponent IDs → adds opponentName (title + username).
4. Creates `<div class="lichessTools-recentGames>` with header text "recentGamesHeaderText". InsertAfter `.lobby__start`.
5. For each result: creates `<a class="game>` with variant/result/timeControl classes, white toggle, href, title (yourRating + deltaRating if applicable), span text (opponentName + opponentRating). `lichess.powertip.manualGame` on each.
6. Adds `<a class="moreGames>` href to `/@/<userId>/search#games`, text "More >".

### extraCounters — Game statistics counters

Requires `extraCounters` option enabled: targets `.lobby__counters`.
1. Fetches `lt.api.game.getLichessGameData()` → `explorerInfo` (totalGames, dbYear, dbMonth, monthGames).
2. Gets gamesInPlay from `/games` anchor strong text (comma removed).
3. Computes projections based on current date:
  - **millisecondsPerMonth** = 365.25*86400*1000/12
  - **qMonth** = (currentDate - lastDateInDb) / millisecondsPerMonth → totalGames = round(totalGames + monthGames*qMonth + gamesInPlay)
  - **qYear** = (currentDate - startOfYear) / (startOfNextYear - startOfYear) → yearGames = round(monthGames*12*qYear + gamesInPlay)
  - **daysPerMonth** = (startOfNextMonth - startOfMonth) / 86400000 → dayGames = round((currentDate-startOfDay)/(startOfNextDay-startOfDay)*monthGames/daysPerMonth + gamesInPlay)
4. Uses `Intl.NumberFormat('en-US')` formatter. Text with pluralSame translations: totalGamesPlayed, yearGamesPlayed, monthGamesPlayed, dayGamesPlayed.
5. Re-scheduled via `lt.random()*1500` timeout for next update.

### Options Computed Properties

- **side**: true if side_streams/spotlights/timeline set (otherwise false).
- **app_all**: true if all four time controls set.
- **allSet**: all major sections enabled.
- **noneSet**: all major sections disabled.

When **allSet** or **noneSet**: resets grid, removes hideElement classes, returns early.

### side_timeline

Requires userId (only shown for logged-in users).

## Event Bindings

`$('main.lobby').observer on '.lobby__app-pools' → applyLobbyElements`.
Initial setTimeout(1000) for updateCounters if extraCounters enabled.