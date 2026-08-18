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

When `fix` is enabled and analysis exists:
- Reads Lichess user preference `analysis.data.pref.coords` (1=in, 2=out, 3=all)
- Toggles body classes `coords-in`, `coords-out`, `coords-all` accordingly

When `fix` is disabled:
- Uses initial state captured at first run (`_init_in`, `_init_out`, `_init_all`) to set coordinate classes

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
