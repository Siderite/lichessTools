# Explorer More Games Tool — Context

## Overview

The **ExplorerMoreGamesTool** adds more games to the Opening Explorer display by extracting game IDs from move entries that are not already in recent/top games lists. It marks these extra games with a special class and title in the Explorer games table.

## Preferences

- **name**: `explorerMoreGames`
- **category**: `analysis`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Add Games From Moves (`addGamesFromMoves`)

1. Checks if enabled AND explorer enabled — if not, returns.
2. Gets current Explorer data (`explorer.current()`).
3. If no current → returns.
4. Creates Set of existing game IDs from recentGames + topGames concatenated.
5. Extracts games from move entries: for each move with game property → creates `{...m.game, uci:m.uci}`.
6. Filters to games that exist AND not in existingGameIds set (new/unseen games).
7. If new games found: marks each as `source='lichessTools'`, concatenates into current.recentGames.

### Style Games From Moves (`styleGamesFromMoves`)

1. Checks if enabled AND explorer enabled AND recentGames present — if not, returns.
2. Creates Set of extra game IDs from recentGames filtered by source='lichessTools'.
3. If no extra games → returns.
4. For each Explorer games table row `tr[data-id]`:
   - If data-id in extraGameIds set: toggles class `lichessTools-explorerMoreGames` on row.
   - Sets title to "LiChess Tools - more Explorer games" if not already set.

## Wrapping Mechanism

When enabled:
- **Wraps** `analysis.redraw` function with `wrapFunction`:
  - Note: wrap uses id `'explorerSnaps'` (likely a copy-paste error in code, should be `'explorerMoreGames'`).
  - `before`: calls `addGamesFromMoves()` before original execution.
  - `after`: calls `styleGamesFromMoves()` after original execution.

## Cleanup on Disable

When preference is off:
- Unwraps `analysis.redraw`.

## Login Requirement

- Requires logged-in user (`lt.getUserId()` must exist). If not logged in, disabled with console debug message.