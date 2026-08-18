# Explorer Chessagine Tool — Context

## Overview

The **ExplorerChessagineTool** integrates the Chessagine neural network analysis API into Lichess's Opening Explorer. When the Explorer player name is set to `!lt_[engine]_[rating]`, it replaces cloud explorer data with Chessagine engine evaluations for the current position. Chessagine provides WDL (win/draw/loss) probabilities and top moves from neural network engines like Leela, Elite Leela, and Maia.

## Dependencies

- `EmitRedraw` — dependency
- `ChessOps` — dependency (for FEN/SAN/UCI parsing and chess state operations)

## Preferences

- **name**: `explorerChessagine`
- **category**: `analysis`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `false` (disabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Chessagine Engines

Predefined engine list:
- `leela`: "Leela T1-256"
- `elite-leela`: "Elite Leela"
- `maia3`: "Maia 3"

## Behavior

### Populate Explorer Cache (`populateExplorerCache`)

Fetches Chessagine analysis for a FEN and populates Explorer cache:
1. Checks if explorer enabled — if not, returns.
2. Calls `lt.api.chessagine.analyseFen(fen, engine, rating)` API.
3. If result not successful → returns.
4. SCALE = 1000000 (scaling factor for game counts).
5. Creates explorerItem:
   - fen, isOpening=true, moves=[]
   - white/draws/black totals from rawWDL and turnColor (white FEN → white=win, black=loss; black FEN → reversed).
6. For each topMove in result data:
   - Parses SAN via ChessOps → converts to UCI.
   - Creates move item with san, uci, white/draws/black from probability × SCALE × WDL (reversed for black turnColor).
7. Sets `explorer.cache[fen] = explorerItem`.

### Refresh UI (`refreshUi`)

Updates Explorer title tab when Chessagine player is active:
1. Parses player name regex `/!lt_(?<engine>.*?)(?:_(?<rating>\d+))?$/.`
2. If no match → returns.
3. Finds engine label from ENGINES list.
4. Text = engineLabel + (rating ? ' ('+rating+')' : '').
5. RequestsAnimationFrame: updates `.explorer-title .player.active` tab with text and title "LiChess Tools - Chessagine API integration".

### Populate Explorer (`populateExplorer`)

Sets up async stream for Chessagine explorer data:
1. Parses player name regex to extract engine/rating.
2. Gets current node FEN.
3. Calls `populateExplorerCache(fen, engine, rating)`.
4. Creates lastStream with sync=false and Promise:
   - After completion: calls refreshUi, sets sync=true, clears explorer loading/failing/movesAway states.
5. Sets `explorer.lastStream = lastStream`.

### Refresh Explorer (`refreshExplorer`)

Checks if Chessagine should be active on explorer fetch:
1. If explorer not enabled → returns.
2. If db='player' AND player starts with `!lt_` → calls `populateExplorer(player)` and returns false (blocks native fetch).

### Setup Chessagine (`setupChessagine`)

Wraps multiple Explorer functions when enabled:

#### toggleOpen wrap (after hook)
- When explorer config open() → calls refreshUi().

#### enabled wrap (after hook)
- When value=true → calls refreshUi().

#### fetch wrap (before hook)
- Calls refreshExplorer before native fetch (blocks if Chessagine player active).

#### setNode wrap (before + after hooks)
- **Before**: when ply≥50 AND db='player' AND player starts with `!lt_`: sets `analysis.node.realPly = analysis.node.ply`, then `analysis.node.ply = 49` (reduces ply to avoid Chessagine API depth limits).
- **After**: restores `analysis.node.ply = analysis.node.realPly`, deletes realPly.

#### Refresh trigger
- If any new wraps added: calls refreshExplorer + setTimeout explorer reload(1000ms) + refreshUi().

## Player Name Pattern

- `!lt_[engine]_[rating]` — prefix indicates Chessagine integration.
- Engine = one of leela/elite-leela/maia3.
- Rating optional (numeric).

## Cleanup on Disable

When preference is off:
- Unwraps all Explorer functions (toggleOpen, enabled, fetch, setNode).
- If existing player name starts with `!lt_`: removes it via `explorer.config.removePlayer`.
- If logged-in user exists: selects user as player, disables explorer, reloads, re-enables, reloads.
- Off pubsub listener for redraw.

## API Integration

- Uses `lt.api.chessagine.analyseFen(fen, engine, rating)` to fetch Chessagine neural network analysis data.