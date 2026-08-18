# Skip Move Command Tool

## Purpose

Provides a CLI command `/skipmove` that attempts to skip the current turn by playing a sequence of moves (up to 5) that results in the same position but with the opposite side to move.

## Functionality

- Depends on `CliCommands` and `ChessOps`.
- **isSkippedMove(fen1, fen2)**: Checks if two FENs have the same board setup (`s1[0] == s2[0]`) but different turn (`s1[1] != s2[1]`). Returns true if it's a skip move.
- **skipMoveIfPossible()**: Uses ChessOps to parse current node FEN, creates chess object from setup. Searches for a sequence of up to 5 moves that results in the same board position but flipped turn:
  - Finds rook/bishop/queen/king moves (filtered by last piece if already used)
  - Iteratively tries move sequences, cloning chess state back on backtrack
  - When 5 moves are tried, checks if resulting FEN is a skipped move (same board, opposite turn)
  - If found: announces success and plays the UCI list via `analysis.playUciList(result.moves)`
  - If not found: announces "Cannot skip move from this position!"
- Registers CLI command `skipMoveCommand` with handle that responds to `/skipmove` input. Provides help text: "/skipmove — Move for both players to 'skip' the move".

## Preference

- **name**: `skipMoveCommand`
- **category**: command
- **type**: single (on/off)
- **defaultValue**: true
- **advanced**: true
- **hidden**: true
- **offValue**: false

## Dependencies

`CliCommands`, `ChessOps`
