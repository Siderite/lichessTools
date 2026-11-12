# Mute Own Moves Tool

## Purpose

Mutes the speech synthesis (the Lichess "Speech" sound theme) for the moves you play yourself, so only the opponent's moves are read aloud.

## How It Works

Wraps `lichess.sound.saySan`:

- Before call: determines whose move is being read. The position shown on the board is the position *after* the move, so the side to move in that position is the opponent of whoever just moved. If the side to move is the opponent (meaning the last move was yours), the tool returns `false` to skip speaking.

The current position's turn is read from:

- `analysis.node.fen` on analysis pages (board, game and study)
- `lt.getPositionFromBoard($('div.main-board'), true)` on play pages (puzzles and game play)

Your side (orientation) is read from:

- `analysis.getOrientation()` on analysis pages
- the board's `.orientation-black` class on play pages

## Dependencies

None explicitly declared. Depends on `lichess.sound`, `lt.getPositionFromBoard`.

## Preferences

- `muteOwnMoves` — single type: [false, true], default: false (advanced)
