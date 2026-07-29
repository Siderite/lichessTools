# Board Image Tool — Context

## Overview

The **BoardImageTool** provides a better exported board image (screenshot) functionality. Instead of using Lichess's basic FEN GIF export, it creates a high-quality canvas-based screenshot of the chess board with pieces, arrows, circles, coordinates, highlights, and background images rendered at 800x800 resolution in a modal dialog.

## Dependencies

- `EmitRedraw` — dependency

## Preferences

- **name**: `boardImage`
- **category**: `analysis`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Get Board Image (`getBoardImage`)

Creates a canvas screenshot of the board when clicking on a board image link:

1. If Ctrl or Shift key pressed → returns (modifier keys bypass this feature).
2. Creates 800x800 canvas (or 800+fontSize if coordinates outside enabled) with 2D context.
3. Determines settings:
   - **Coordinate setting**: from body classes `.coords-in` (1), `.coords-out` (2), `.coords-all` (3).
   - **Orientation**: from analysis orientation or board `.orientation-black` class.
   - **Turn color**: from analysis turnColor or select value in `div.color`.
4. Loads background image:
   - Extracts CSS backgroundImage from board `:before` pseudo-element via regex matching URLs.
   - If no URL found → defaults to `lt.assetUrl('images/board/maple.jpg')`.
   - Also tries assets URL and maple fallback if primary fails.
5. Draws background image onto canvas (0,0,800,800).
6. Scales factor = 800 / board.width().

### Square Highlights

- Draws selected squares (`square.selected`) and last-move squares (`square.last-move`):
  - Excludes hidden/none display squares (Lichess issue #19260 workaround).
  - Extracts CSS background-color and translate coordinates from style attribute.
  - Scales coordinates by factor q.
  - Fills rectangle at scaled position with board's background color.

### Move Dest Highlights

- Draws move destination squares (`square.move-dest`):
  - Excludes hidden/none display squares.
  - Creates radial gradient: solid `#14551e80` from center to 14.9%, transparent from 15% to edge.
  - Fills rectangle with gradient at scaled position.
  - Draws roundRect border with CSS border-color and border-radius (2px lineWidth).

### Coordinates

- If not Shift key pressed: draws rank/file coordinates:
  - Font size = 20px Arial.
  - Offset = (100-fontSize)/2 if coordsOutside, else 0.
  - For each of 8 ranks/files:
    - Digit color: alternating `#dddddd` or `#222222` (even ranks light, odd dark; all light if outside).
    - Digit value: reversed for black orientation (i+1 for black, 8-i for white).
    - Letter value: String.fromCharCode(97 + reversed index).
    - Positioned at scaled coordinates.

### Turn Arrow

- Draws a small arrow indicating whose turn it is:
  - Color: `#808080`.
  - Position depends on orientation and turn color:
    - White turn, white orientation → arrow at (393,797) to (393,777).
    - White turn, black orientation → arrow at (407,3) to (407,23).
    - Black turn, black orientation → arrow at (393,797) to (393,777).
    - Black turn, white orientation → arrow at (407,3) to (407,23).

### Pieces

- For each piece element on board:
  - Extracts CSS background-image URL.
  - If no URL → uses default piece URL via `defaultPieceUrl` (cburnett set: wP/bP/wR/bR etc.).
  - Loads piece image asynchronously.
  - Extracts translate coordinates from style, scales by q.
  - Draws piece image at scaled position (100x100).

### SVG Elements (Arrows/Circles/Glyphs)

- For each SVG child of board parent:
  - Clones SVG with opacity=0.6, overflow=visible.
  - Sets text font-family to "Noto Sans", sans-serif.
  - Serializes to SVG URL via XMLSerializer → data:image/svg+xml URI.
  - Loads as image asynchronously.
  - Draws scaled onto canvas.

### Dialog Display

- Removes any existing `dialog.lichessTools-boardImage`.
- Loads Lichess dialog CSS path (`bits.dialog`).
- Creates modal dialog with:
  - Close button (X icon, formmethod=dialog).
  - Help link to user manual (#boardImage section).
  - Scrollable content area.
- Appends canvas to dialog content.
- Shows modal via `dialog[0].showModal()`.

### Close Dialog (`closeDialog`)

- When Escape key (keyCode 27) pressed → removes board image dialog.

### Default Piece URL (`defaultPieceUrl`)

- Determines piece type from element classes (.black/.white/.pawn/.rook/.knight/.bishop/.queen/.king).
- Constructs key: b/w + P/R/N/B/Q/K.
- Returns `lt.assetUrl('piece/cburnett/[key].svg')`.

### Draw Arrow (`drawArrow`)

- Draws arrow on canvas from (fromX,fromY) to (toX,toY) with headLength=10:
  - Calculates angle via Math.atan2(dy,dx).
  - Draws line from start to end.
  - Draws arrowhead triangle at end point using angle ± π/6 offsets.

### Draw SVG (`drawSvg`)

- Clones SVG element, sets opacity=0.6 and overflow=visible.
- Sets text font-family to "Noto Sans".
- Serializes via XMLSerializer → data:image/svg+xml URI.
- Loads image asynchronously via `getImage`.

### Image Loading (`getImage`)

- Returns Promise that loads an image from URL:
  - Creates new Image with crossOrigin="anonymous".
  - 5000ms timeout fallback (resolve null).
  - onload → clearTimeout, resolve img.
  - onerror → clearTimeout, resolve null.

### Enhance Button (`enhanceButtonDirect`)

- Adds/removes board image links to existing export buttons:
  - In analysis PGN area (`main.analyse .copyables div.pgn`): creates new link with text "SCREENSHOT" and title, inserts after PGN div. Sets href to `/export/fen.gif?fen=[FEN]&color=[orientation]`.
  - In study share area (`div.study__share`), board editor copyables, position-gif: adds class `lichessTools-boardImage`, title, click handler to existing fen.gif links (skips already-enhanced ones).

### Enhance Button — debounced version (500ms debounce).

## Wrapping Mechanism

When enabled AND in study:
- **Wraps** `study.vm.toolTab` function with `after` hook: calls `enhanceButton` via setTimeout(100) after original execution.
- On disable: unwraps `study.vm.toolTab`.

## Event Handling

When enabled:
- Listens to `lichessTools.redraw` pubsub → triggers `enhanceButton`.
- Immediately calls `enhanceButton()`.

## Cleanup on Disable

When preference is off:
- Removes `.lichessTools-boardImage` links from analysis PGN area.
- Removes class and click handler from study share/board editor fen.gif links.
- Off pubsub listener for redraw.