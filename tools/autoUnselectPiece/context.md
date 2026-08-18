# Auto Unselect Piece Tool — Context

## Overview

The **AutoUnselectPieceTool** automatically deselects the currently selected piece on the chess board after a specified number of seconds during play (games and puzzles). This prevents the user from having a piece stuck-selected for too long.

## Dependencies

- `DetectThirdParties` — dependency

## Preferences

- **name**: `autoUnselectPiece`
- **category**: `play`
- **type**: `number`
- **defaultValue**: `undefined` (disabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Piece Selection Tracking (`select`)

Tracks the currently selected piece square:
1. If no square passed: clears `_selected` to null.
2. If new square different from previously tracked: records `{square, time: Date.now()}` in `_selected`.
3. If same square and elapsed time < `options.seconds * 1000`: does nothing (still within timeout).
4. If same square and elapsed time ≥ `options.seconds * 1000`: calls `unselectPiece()` then clears selection (`select(null)`).

### Unselect Piece Mechanism (`unselectPiece`)

- When the selected piece is on the **last move** in the move list (`.tview2 move:last-child` active OR last button child has className): triggers the "down" key handler via `lt.getKeyHandler('down')()` — this simulates pressing the down arrow key which deselects the piece.

### Check Piece Selection (`checkPieceSelection`)

- Runs every **500ms** interval:
  - Checks if seconds value is set and body class `.playing` exists (only during games/puzzles).
  - Finds selected square via `$('square.selected:not([style*="hidden"],[style*="display: none"])')[0]?.cgKey`.
  - Calls `select(selectedSquare)` to track/update.

## Activation Scope

- Only activates on pages with body class `.round` (games) or `.puzzle` (puzzles).
- Skipped on other page types.

## Event Handling

When enabled (seconds value set):
- Runs interval every **500ms** via `discoverChatInterval` → triggers `checkPieceSelection`.

## Cleanup on Disable

When preference is off (no seconds value):
- Clears the check piece selection interval.