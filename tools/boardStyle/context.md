# Board Style Tool — Context

## Overview

The **BoardStyleTool** enhances the visual styling of chess boards by adding custom CSS classes and SVG elements for better visual feedback. It highlights selected pieces, last-move squares with directional attributes, and draws a last-move arrow between origin and destination squares (especially for castling moves). It also sets board attributes for side-to-play, last-moved piece, and captured piece information.

## Dependencies

- None explicitly listed.

## Preferences

- **name**: `boardStyle`
- **category**: `appearance`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `false` (disabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Get Square Position (`getSquarePosition`)

Extracts square position from CSS transform style:
- Regex `/translate(\s*(?<x>\d+(?:\.\d+)?)px\s*,\s*(?<y>\d+(?:\.\d+)?)px\s*)/` matches transform string.
- Returns `{left: x, top: y}` as numeric values.

### Process Boards (`processBoardsDirect`)

For each `cg-container` element:

1. Calculates scale factor q = 800 / containerWidth.
2. Adds class `lichessTools-boardStyle` to container.

#### Selected Piece Highlighting

- Finds selected square key (excluding hidden/none display squares).
- For each piece in container: toggles class `selected` if piece cgKey matches selected key.

#### Last Move Arrow (when exactly 2 last-move squares present)

1. Marks first last-move square as `dest=true`, second as `orig=true`.
2. Finds moved pieces: toggles class `moved` if piece cgKey matches dest key.
3. Determines last moved piece from piece at dest key:
   - Parses cgPiece split (color + type): e.g., "white king" or "black queen".
   - Color determines black turn (`white` = isBlackTurn).
   - Type = lastMovedPiece.
4. Castle detection: king piece AND abs(destKey[0] charCode - origKey[0] charCode) > 1 (not adjacent files — TODO imperfect for Chess960).
5. If container uses arrow (`usesArrow !== false`):
   - Calculates halfSquare = containerWidth/16.
   - Gets square positions, filters valid ones, scales by q and adds halfSquare offset.
   - If 2 positions found:
     - Computes distance between orig and dest.
     - Shortener = (dist - 50/q) / dist (shortens arrow head to avoid overlapping piece).
     - Creates SVG if not existing: viewBox="0 0 800 800" with linearGradient defs, arrowhead marker, line element.
     - Sets line x1/y1/x2/y2 coordinates (x2 = shorterDest for shortened arrow).
     - Sets gradient x1/y1/x2/y2 coordinates.
     - Toggles class `castle` on SVG if castle detected.
6. If container usesArrow undefined: records usesArrow value based on SVG display; removes SVG if not used.

#### Board Attributes

- Sets attributes on container:
  - `sideToPlay`: black or white (based on last moved piece color).
  - `lastMovedPiece`: type of last moved piece.
  - `lastMoveSquare`: dest key.
  - `lastPieceCaptured`: previous captured piece if side changed AND previous piece matches current dest (otherwise removed).

#### Opening Data

- Gets opening data from closest `.lichessTools-withOpening` container.
- Sets `opening` attribute to openingData.opening or null.

#### When NOT exactly 2 last-move squares

- Removes arrow SVG.
- Resets attributes: sideToPlay=white, removes lastMovedPiece/lastMoveSquare/lastPieceCaptured.

### Process Boards — debounced version (100ms debounce).

## Event Handling

When enabled:
- Observer on `body` watching for `square.last-move` and `square.selected` changes (attributes=true) → triggers `processBoards`.
- Listens to `lichessTools.uiApi.events.ply` → triggers `processBoards`.
- Immediately calls `processBoards()`.

## Cleanup on Disable

When preference is off:
- Removes all `.lichessTools-lastMoveArrow` SVGs.
- Off class `lichessTools-boardStyle` from cg-container elements.
- Off observer for last-move/selected squares.
- Off ply event listener.