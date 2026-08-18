# Explorer Settings Tool — Context Summary

## Overview

The **ExplorerSettingsTool** adds a UI section inside the Lichess chess explorer config panel (`section.explorer-box div.config >div:has(section.date)`) that provides toggle buttons for controlling various other explorer-related tools. It acts as a consolidated control hub for explorer preferences, allowing users to toggle settings directly from the explorer interface rather than going to the preferences page.

## Dependencies

- **EmitRedraw** — Needed for redraw events

## Preferences

| Preference | Type | Category | Description |
|------------|------|----------|-------------|
| `explorerSettings` | single (true/false) | analysis | Enable/disable this tool's UI section in the explorer. Hidden from debug mode, advanced preference. Default: true |

## Functionality

### UI Section Creation
When the explorer config is open and the user is logged-in, the tool creates a `<section class="lichessTools-explorerSettings"` inside the config panel with:
- A label "LiChess Tools"
- Toggle buttons for each dependent explorer tool (buttons appear only if that tool exists)

### Toggle Buttons
Each button toggles the corresponding tool's preference via `setOption()`:
- **lichessTools-moveEvaluation**: Toggles `explorerEval` — adds/removes 'hidden' option to show/hide move evaluation column
- **lichessTools-gambits**: Toggles `explorerGambits` — enables/disables gambits column
- **lichessTools-explorerPractice**: Toggles `explorerPractice` — enables/disables practice button against explorer moves
- **lichessTools-moreGames**: Toggles `explorerMoreGames` — enables/disables showing more games in Recent Games
- **lichessTools-meButton**: Toggles `openingExplorerUsers` — adds/removes 'switchWithMe' option to switch player with user's own identity

### Chessagine Engine/Rating Controls
When the ExplorerChessagineTool is enabled and the explorer database type is 'player':
- Creates a `<div class="lichessTools-engines choices"` section with buttons for chessagine engines: empty (None), leela, elite-leela, maia3
- Creates a `<div class="lichessTools-ratings choices"` section with rating buttons from 600 to 2600 in increments of 100

Engine/rating selection logic:
- Engine buttons set the explorer player name to `!lt_<engine>` (or `!lt_<engine>_<rating>` for maia3)
- Rating buttons only work when maia3 engine is selected; they store rating in localStorage (`LiChessTools.chessagineRating`) and update player name accordingly
- Active buttons get `active` class toggle and `aria-pressed` attribute

### Class Toggles on Explorer Box
The tool toggles classes on `.explorer-box`:
- **lichessTools-chessagineEnabled**: When chessagine is enabled and db type is 'player'
- **lichessTools-chessagineActive**: When chessagine active with a `!lt_` player name pattern

### Function Wrapping
The tool wraps `explorer.config.toggleOpen` with id `'explorerSettings'`:
- After function calls `showSettings()` (debounced version of `showSettingsDirect`) to refresh the UI section after each config toggle

## Key Conditions

- Requires logged-in user (`lt.getUserId()`) — disabled if not logged in
- Only shows when `explorerSettings` preference is true
- Buttons are disabled during game playing (`lt.isGamePlaying()`) for moveEvaluation, gambits, and explorerPractice buttons

## Debounce

`showSettings` is a 100ms debounce of `showSettingsDirect`.