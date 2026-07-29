# Additional Glyphs Tool — Context

## Overview

The **AdditionalGlyphsTool** adds extra annotation glyphs (symbols) on the chess board during analysis/study mode beyond the standard Lichess glyphs (good move, mistake, blunder, dubious, etc.). These glyphs are drawn as drawable shapes on the chessground and also added to the node's glyphs array for display in the move list.

## Dependencies

- `EmitRedraw` — needed for board redraw events.

## Preferences

- **name**: `additionalGlyphs`
- **category**: `analysis`
- **type**: `multiple` (checkboxes)
- **possibleValues**: `[enabled, mate, book, miss, slow, novelty]`
- **defaultValue**: `enabled,mate,book,miss,slow` (novelty is off by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Upgrade History

- `miss` glyph added in version 2.4.44
- `slow` glyph added in version 2.4.202

## Glyph Types

### Mate (`mate`)
- Displays when the current position is **checkmate**.
- Detection: uses `lichessTools.isMate(node)` to determine if checkmate exists, then finds the checked king square via `$('square.check')` filter (excluding hidden/none display squares).
- Symbol: `lt.icon.Mate` (standard mate icon)
- Fill color: `#557766B0`
- Shape origin: the square of the checked king. For castling moves (`O-O`), adjusts origin square (a1→c1, h1→g1, a8→c8, h8→g8).

### Book (`book`)
- Displays when the current position matches an entry in Lichess's **opening database**.
- Detection: checks `node.opening` property.
- Symbol: `lt.icon.OpenBook`
- Fill color: `#999900BB`
- Shape origin: the last move's square (uci slice 2,4).

### Miss (`miss`)
- Displays when a move was a significant **evaluation miss** — a move that caused an unexpected evaluation swing compared to what would have been expected.
- Detection logic:
  - Takes the last 3 nodes from `analysis.nodeList` and extracts centipawn evaluations (cp, cp1 = previous node, cp2 = node before cp1).
  - Calculates deltas: d1 = cp - cp1, d2 = cp2 - cp1.
  - Computes quality ratio q = |d1-d2| / |d1|. If q < 0.2 (the swing is unexpected/unsmooth), proceed.
  - Converts centipawns to win percentage via `lt.winPerc(cp)`.
  - Determines if it's a bad move: `(w - w1) * side < -20` where side = +1 for black, -1 for white (based on ply parity).
- Symbol: `'X'`
- Fill color: `#df5353`
- Shape origin: the last move's square.

### Slow (`slow`)
- Displays when a player took **unusually long** to make a move (outlier in move times).
- Detection logic:
  - Only applies to non-correspondence games (correspondence is excluded).
  - Uses `analysis.data.game.moveCentis` array of move time durations.
  - Calculates quartiles (Q1=25th percentile, Q3=75th percentile), computes IQR = Q3-Q1.
  - Upper fence = Q3 + 1.5 * IQR (standard outlier detection).
  - Moves exceeding the upper fence are flagged as "slow".
  - Stored in a Map keyed by move index → time value.
- Symbol: `lt.icon.Hourglass`
- Fill color: `#AA882099`
- Shape origin: the last move's square.

### Novelty (`novelty`)
- Displays when the current move is a **rare/novel** move based on Explorer statistics.
- Detection logic (complex scoring formula):
  - Requires position to have >10 games in Explorer cache.
  - Requires the specific move to have ≤100 games (not too common).
  - Calculates multiple factors:
    - **rarity**: 1 - moveTotal / explorerTotal (how rare relative to all games at this position)
    - **divergence**: 1 - moveTotal / topTotal (how divergent from the most popular move)
    - **depthDiscount**: Math.min(1, 1.5 - ply/20) (deeper positions get less novelty credit)
    - **viability_WDL**: sigmoid((moveScore - explorerScore) * 10 * side) — based on win/draw/loss ratio compared to Explorer average
    - **viability_cp**: weighted combination of sigmoid functions on centipawn evaluations (abs(cp2)/50, abs(cp1)/75, abs(cp1-cp2)/50) with weights 0.50, 0.35, 0.15
    - Final viability = 0.7 * viability_cp + 0.3 * viability_WDL (or just viability_WDL if no centipawn eval available)
  - **noveltyScore** = rarity × divergence × depthDiscount × viability
- Symbol: `lt.icon.CyrillicCapitalLetterI` ( Cyrillic "И" character )
- Fill color: `#90c290`
- Shape origin: the last move's square.

## Drawing Mechanism

### `drawGlyphsDirect()`
1. Checks if static analysis is enabled; toggles body class `lichessTools-compOff`.
2. Gets chessground, current node glyphs list.
3. For each enabled glyph type, checks if already present in symbols list; if not, creates new glyph entry with symbol, fill color, and optional name.
4. Determines shape origin square for each glyph.
5. Creates drawable shapes of type `glyph` with origin and label (fill + text).
6. If `analyse.show-move-annotation` storage is false, only sets shapes without adding to node glyphs.
7. Otherwise: adds new glyphs to node.glyphs array as `nonStandard` type entries, pushes shapes into chessground autoShapes, triggers redraw via `lt.analysisRedraw()`.

### `drawGlyphs()` — debounced version (50ms debounce).

### `updateGlyphs()`
- Updates existing glyph shape labels' fill colors to match current node glyph fills. Triggers redraw if changes detected.

## Event Handling & Wrapping

When enabled:
- **Wraps** `analysis.setAutoShapes` function with `wrapFunction`:
  - `before`: calls `drawGlyphsDirect()` before original execution (can alter params, return false to block).
  - `after`: calls `drawGlyphsDirect()` + `updateGlyphs()` after original execution.
- Listens to `lichessTools.redraw` pubsub event → triggers `drawGlyphs`.
- Runs an interval every **250ms** checking if drawable autoShapes changed (length comparison, element-by-element comparison, JSON stringify comparison). If changed: calls `drawGlyphs()` + `restackGlyphs()`.

### `restackGlyphs()`
- Repositions SVG glyph elements on the board by shifting their transform x-coordinate by +0.3 to avoid overlap with other glyphs. Uses `processElements` which detects overlapping rectangles (>80% overlap) and adjusts position up to 50 attempts.

## Cleanup on Disable

When preference is off (`enabled` not set):
- Removes all glyph shapes from autoShapes (keeps only non-glyph shapes).
- Clears interval.
- Unwraps `analysis.setAutoShapes`.
- Off pubsub listener for `lichessTools.redraw`.