# EmitPuzzleChange Tool

## Purpose

Broadcasts pubsub events for puzzle state changes: start, end, and fail. Allows other tools (puzzle history, puzzle options) to react to puzzle lifecycle events.

## How It Works

### Two Detection Methods

1. **Puzzle ID Method** — When a puzzle ID is known (`lt.getPuzzleId()`):
   - MutationObserver on `.puzzle__tools` elements
   - Detects puzzle start when puzzle ID changes from previous value
   - Detects puzzle end when `.puzzle__feedback.after` nodes appear
   - Detects puzzle fail when `.puzzle__feedback.fail` nodes appear

2. **Player Data Method** — When no puzzle ID is known:
   - MutationObserver on `.puzzle__tools` elements
   - Detects puzzle start when player data text in `.infos .players` changes and `.infos.puzzle` exists

### Event Broadcasted

- `lichessTools.puzzleStart` — payload: puzzle ID (or null)
- `lichessTools.puzzleEnd` — payload: puzzle ID
- `lichessTools.puzzleFail` — payload: puzzle ID

## Dependencies

None explicitly listed. Depends on `lt.getPuzzleId()` function existing.

## Key Methods

- `processPuzzle(records)` — detects puzzle lifecycle events via DOM mutations
- `processGameInfoChange(records)` — fallback detection when puzzle ID unknown
