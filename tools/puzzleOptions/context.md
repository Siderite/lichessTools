# PuzzleOptions Tool

## Purpose

Adds puzzle completion time display and session total score tracking in Lichess puzzles training page.

## How It Works

### Completion Timer

- `lichessTools.puzzleStart` event → records startTime = Date.now()
- `lichessTools.puzzleEnd` event → calculates elapsed seconds, replaces `.puzzle__feedback .complete` text with original + "(elapsed s)" format

### Session Total

MutationObserver on `.puzzle__session`:
- Counts result-false and result-true entries
- Sum of points from each entry (excluding result-empty)
- Displays as "good/total (+/-points)" on `a.result-cursor` or `a.session-new` elements with title "LiChess Tools - total"

## Dependencies

- EmitPuzzleChange

## Preferences

- `puzzleOptions` — multiple type: ['endTimer', 'showSessionTotal'], default: 'showSessionTotal'

## Key Methods

- `showTotal()` — calculates and displays session total
- `startTimer(puzzleId)` — records puzzle start time
- `endTimer(puzzleId)` — displays elapsed completion time
- `async start()` — sets up event bindings and observer
