# PuzzleOptions Tool

## Purpose

Adds puzzle completion time display, session total score tracking and material strips in Lichess
puzzle training pages.

## How It Works

### Completion Timer

- `lichessTools.puzzleStart` event -> records startTime = Date.now()
- `lichessTools.puzzleEnd` event -> calculates elapsed seconds and appends "(elapsed s)" to
  the `.puzzle__feedback .complete` completion text

### Session Total

MutationObserver on `.puzzle__session`:
- Counts result-false and result-true entries and sums their points (excluding result-empty)
- Displays as "good/total (+/-points)" on `a.result-cursor` or `a.session-new` elements with the
  title "LiChess Tools - total"

### Material Strips

The render runs on the `lichessTools.redraw` event rather than on DOM observers: cash observers only
match the mutated element itself, so moves inside `.puzzle__moves` and an orientation class on
`div.cg-wrap` never reach a `.puzzle__tools` listener. EmitRedraw emits redraw from Lichess's redraw
and reloadData hooks, from its `ply` and `analysis.change` UI events, and from a 1s poll of the
`main-board` board class, so a flip can lag by up to about a second.
- Reads the position FEN through `lt.getPositionFromBoard($('main'), true)`
- Returns early when `prevMaterialFen`, `prevMaterialFlipped` and `prevMaterialNarrow` all match
- `materialStats(fen)` compares piece counts per role and keeps the surplus of the richer side
- The container is `.puzzle__board` under 800px viewport width and `.puzzle__tools` otherwise, so
  narrow screens draw the strips above and below the board; both containers are cleaned every pass
- A side is rendered as `div.material.material-top` as the first child of the container and the
  other as `div.material.material-bottom` as the last child, but only when it has surplus pieces
  or a material advantage
- Cells are `<div><mpiece class="role"></mpiece></div>`, roles ordered queen, rook, bishop, knight,
  pawn; a side lists each role it has more of than its opponent (two pawns vs one lists one pawn)
- A `<score>+N</score>` is appended to the leading side, in piece units (pawn 1, knight 3, bishop 3,
  rook 5, queen 9)
- `tool.css` draws every role from `--icon-BlackChess*` and places each strip outside its container
  by `--material-gap`, 2em for both containers; under 800px the board container also gets position
  and visible overflow so the strips can sit outside it, plus `z-index: 106` unless the page is
  masked or has site-buttons shown
- Board side follows the main board: the `cg-wrap` nearest the `cg-container` that supplied the FEN,
  so variation boards never decide it; `.orientation-black` puts white at the top of the board
- The flip is part of the render key, so flipping swaps the two strips without any move being played
- Removal runs before each render and when the option is off, so strips never duplicate

## Dependencies

- EmitPuzzleChange - provides the moves container the wide-layout strips hang off
- EmitRedraw - emits the `lichessTools.redraw` event the material render listens for

Core helpers used by the material feature: `LiChessTools.Material` (piece values, letter maps) and
`lt.getPositionFromBoard($('main'), true)` for the position FEN.

## Preferences

- `puzzleOptions` - multiple type: ['endTimer', 'showSessionTotal', 'material'],
  default: 'showSessionTotal', so `material` is off by default

## Key Methods

- `showTotal()` - calculates and displays session total
- `startTimer(puzzleId)` - records puzzle start time
- `endTimer(puzzleId)` - displays elapsed completion time
- `async start()` - sets up event bindings and observers
- `materialStats(fen)` - per-role piece surplus and its piece-unit value
- `materialNarrow()` - true when the window is under 800px and a board container exists
- `materialFlipped()` - true when the main board is oriented with black at the bottom
- `renderMaterial()` - renders both strips from the current board FEN
- `renderMaterialSide(container, pos, color, stats)` - builds one strip and inserts it
- `removeMaterial(container)` / `clearMaterial()` - strip removal helpers
