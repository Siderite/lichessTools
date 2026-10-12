# FixCoords Tool

## Purpose

Fixes chessboard coordinate display behavior. Controls three aspects:
1. **fix** — respects Lichess user preference for coordinate position (in/out/all)
2. **larger** — larger font size for coordinates via CSS class
3. **square** — adds coordinates on each individual square of the board

## How It Works

### Body Class Toggle

Sets body classes based on options:
- `lichessTools-fixCoords-fix` — when fix option enabled
- `lichessTools-fixCoords-larger` — when larger option enabled
- `lichessTools-fixCoords-square` — when square option enabled

### Coordinate Preference Handling

- Reads Lichess user preference `analysis.data.pref.coords` (1=in, 2=out, 3=all); if the body already has the `.coords-out` class, sets pref to 2.
- Toggles body class `lichessTools-fixCoords-fix` when the `fix` option is enabled AND the preference is `2` (coordinates outside).
- Toggles body classes `lichessTools-fixCoords-larger` and `lichessTools-fixCoords-square` based on their respective options.

### Square Coordinates

When `square` option enabled:
- 500ms interval creates `<coords>` container inside `.main-board > div.cg-wrap > cg-container`
- Adds 64 `<coord>` elements (one per square) with text like "a1", "b2" etc.
- Each coord has CSS `--rank`, `--file` properties and light/dark class based on parity

## Dependencies

None explicitly listed. Depends on `lichess.analysis`, `lt.isOptionSet`.

## Preferences

- `fixCoords` — multiple type, possibleValues: ['fix', 'larger', 'square'], default: 'fix'

## Key Methods

- `squareCoords()` — creates coordinate elements on each square
- `async start()` — sets body classes and optionally starts square coords interval
