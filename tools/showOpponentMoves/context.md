# Show Opponent Moves Tool

## Purpose

When clicking on a piece that is NOT the side currently to move, shows legal destination squares for that opponent piece (as if it were their turn). Helps visualize what the opponent could play.

## Functionality

- Depends on `EmitRedraw` and `ChessOps`.
- **clearDestinations()**: Removes all `<square>` elements with class `move-opdest` from the board.
- **showDestinations(squareKey, turnColor)**: Shows legal moves for a piece at squareKey as if it were turnColor's turn:
  - Parses current FEN via ChessOps, creates chess position, sets turn to specified color
  - Gets all destinations for the specified from-square
  - For each destination, creates a `<square>` element with class `move-opdest` (or `move-opdest oc` if capture)
  - Calculates CSS transform based on squareSize and orientation (adjusts file/rank for black orientation)
  - Appends to board DOM elements
- **onBoardClick(ev)**: Handles board click:
  - Calculates clicked square from client coordinates relative to board bounds
  - If clicked piece exists and is NOT the current turn color → shows opponent destinations for that piece (switches turn to opposite color)
  - Otherwise → clears all destinations

## Preference

- **name**: `showOpponentMoves`
- **category**: analysis2 (Analysis - minor)
- **type**: single (on/off)
- **defaultValue**: false
- **advanced**: true

## Dependencies

`EmitRedraw`, `ChessOps`
