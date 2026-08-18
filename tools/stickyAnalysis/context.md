# Sticky Analysis Tool

## Purpose

Autosaves analysis PGN to localStorage so it persists across page reloads. When an empty analysis page is loaded, retrieves the saved PGN and fills the textarea.

## Preference

- **name**: `stickyAnalysis`
- **category**: `analysis`
- **type**: `single` (boolean toggle)
- **possibleValues**: `[false, true]`
- **defaultValue**: true
- **advanced**: true

## Dependencies

Requires `EmitRedraw` tool.

## Behavior

Only works on standalone analysis pages (not within a study — `analysis.study` must be absent).

When enabled:
1. Subscribes to `lichessTools.redraw` pubsub event with a debounced handler (`saveAnalysisPgnLong`, debounce 10000ms) — saves PGN on board redraws
2. Adds `beforeunload` listener on global — saves PGN before page unload
3. When analysis tree has no children (empty analysis), retrieves saved PGN from storage and fills the PGN textarea

The `saveAnalysisPgn` method:
- Reads PGN from `.analyse__underboard .pgn textarea`
- If orientation is "black" and PGN lacks `[Orientation]`/`[StartFlipped]` tags, prepends them
- If root FEN is not a standard start position and PGN lacks `[FEN]` tag, prepends it
- Cleans existing Orientation/FEN/StartFlipped tags from PGN before adding new ones
- Stores PGN in localStorage as `LiChessTools.stickyAnalysis.pgn` with zip compression
- Only saves when PGN differs from previous saved value (`prevPgn`)

The `retrievePgn` method:
- Reads saved PGN from storage (zip decompressed)
- Checks current FEN matches the saved PGN's FEN tag position (if different start positions, doesn't replace)
- Sets textarea value and `lichess.analysis.pgnInput` to saved PGN

When disabled: unsubscribes from redraw event, removes beforeunload listener.

## Effect

Analysis PGN content persists across reloads — users don't lose their analysis work when refreshing the page.