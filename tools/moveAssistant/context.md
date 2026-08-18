# Move Assistant Tool — Context Summary

## Overview

The **MoveAssistantTool** is a LiChess browser extension tool that provides visual chess analysis assistance on the lichess.org analysis board. It qualifies moves, position attributes, and piece activity using both algorithmic heuristics and Stockfish engine evaluation.

## Architecture

### Base Class
- Extends `LiChessTools.Tools.ToolBase` (standard LiChess tool pattern)
- **dependencies**: ['EmitRedraw', 'Stockfish'] — requires redraw events and Stockfish engine availability

### Preferences
Single preference array with one item:
- **name**: `'moveAssistant'`
- **category**: `'analysis'`
- **type**: `'multiple'` (checkbox-style, can enable/disable each sub-feature independently)
- **possibleValues**: `['dests', 'squares', 'pawns', 'moves', 'pieces']`
- **defaultValue**: `'dests,squares,pawns,moves,pieces'` (all enabled by default)

Each value corresponds to a distinct visual analysis feature:
| Value | Feature | Description |
|-------|---------|-------------|
| `dests` | Move destinations | Stockfish evaluation of possible moves from selected piece |
| `squares` | Weak squares | Highlight squares vulnerable to pawn attacks |
| `pawns` | Pawn structure | Tag pawns as backward, isolated, or hanging |
| `moves` | Pawn breaks | Draw arrows showing pawn advance break opportunities |
| `pieces` | Piece activity | Highlight most/least active non-pawn pieces |

### Internationalization (intl)
- **en-US**: English translations for all labels and button titles
- **ro-RO**: Romanian translations

## Core Evaluation System

The tool runs a periodic evaluation loop (`setInterval(this.evaluate, 1000)` — every 1 second) when enabled. The `evaluate()` method calls five sub-evaluations in sequence:

```
evaluate() → evaluateDests() → evaluatePawns() → evaluateSquares() → evaluateMoves() → evaluatePieces()
```

### Guard Conditions (all evaluations share these checks)
Each evaluation only runs when:
- Tool is enabled (`this.isEnabled`)
- The specific sub-option is set (`this.options.<feature>`)
- NOT in interactive/practice mode (`analysis.study?.gamebookPlay || analysis.practice?.running() || analysis.study?.practice`)
- Cloud eval allowed (`analysis.isCevalAllowed()`)
- NOT a live game playing (`lt.isGamePlaying()`)

### DOM Manipulation Helpers

| Method | Purpose |
|--------|---------|
| `addArrow(x1,y1,x2,y2, options)` | Adds a drawable arrow to Chessground board with specified brush, modifiers, source tag |
| `clearArrows(source)` | Removes all arrows tagged with a given source |
| `highlight(x,y, className)` | Sets custom highlight class on a square via Chessground's `highlight.custom` Map |
| `clearHighlight(className)` | Removes all squares with a given highlight class |
| `getCgKey(x,y)` | Converts board coordinates to chess notation key (e.g., x=0,y=7 → "a8") using `String.fromCharCode(97+x) + String.fromCharCode(56-y)` |
| `processHighlightsDirect()` | Checks if squares/shapes changed vs last cached state, triggers `cg.redrawAll()` if needed |
| `processHighlights` | Debounced version of `processHighlightsDirect` (50ms debounce) to avoid flicker |

### Pawn Analysis Algorithms

#### `getWeakSquares(board, isWhite)`
Identifies weak squares for a given color. A square is "weak" when:
- It's empty
- There's a friendly pawn adjacent in the forward direction (dy = -1 for white, +1 for black)
- OR there's an opponent pawn diagonally adjacent in the forward direction
- BUT no friendly pawns on adjacent files at supporting ranks can defend it

Returns array of `{x, y}` coordinates. Used to highlight squares with classes `lichessTools-weakSquare` and `lichessTools-weakSquareOpponent`.

#### `getPawns(board, isWhite)`
Analyzes own pawns for structural defects:
- **isolated**: A pawn in a file that has no adjacent files with any own pawns
- **hanging**: A pawn with exactly one friendly pawn on an adjacent file at the same rank, and that neighbor is on ranks 2-5 (not advanced/retreated) — meaning it's unprotected by only one pawn
- **backward**: A pawn that cannot advance forward (square ahead occupied), AND no friendly pawns diagonally adjacent at supporting ranks, AND there's an opponent pawn two squares ahead diagonally

Returns array of `{x, y}` with boolean flags `isolated`, `hanging`, `backward`. Used to toggle classes on pawn DOM elements:
- Own: `lichessTools-backwardPawn`, `lichessTools-isolatedPawn`, `lichessTools-hangingPawn`
- Opponent: same names + `Opponent` suffix

#### `getPawnBreaks(board, isWhite)`
Identifies pawns that can create pawn breaks (advancing to disrupt opponent pawn structure):
- A pawn can advance forward (square ahead empty)
- At the destination square, there's both a friendly pawn diagonally AND an opponent pawn diagonally at the same rank + forward direction

Returns array of pawns with `breaks` sub-array containing destination coordinates. Used to draw purple arrows from pawn position to break destination:
```
brush: 'purple', modifiers: { lineWidth:5, hilite: '#ffff00' }, below: true, source: 'moveAssistant'
```

## Move Destinations Evaluation (Stockfish)

### `evaluateDests()` — The most complex feature

When a piece is selected on the board and destination squares are available, this feature uses **Stockfish** to evaluate ALL possible moves.

#### Stockfish Setup
- Loads Stockfish via `lt.stockfish.load()`
- Sets **256 multi-PV** (256 principal variations) — evaluates every possible move
- Sets **90 seconds** time (`sf.setTime(90000)`) for deep analysis
- Registers `sf.on('info', this.getInfo)` callback

#### Evaluation Flow
1. When activated: Stockfish is positioned with current FEN and starts running
2. On FEN change: resets `_eval` and `_wdl`, repositions Stockfish
3. Continuously refreshes destination squares with results

#### `getInfo(info)` — Stockfish info callback
Extracts from each Stockfish info line:
- **uci**: first PV move (`info.pv?.at(0)`)
- **cp** (centipawns): via `lt.getCentipawns(info)`
- **wdl** (win/draw/loss): if `info.wdl` has 3 values → `{w, d, l}` with total sum

Stores in `_eval[uci] = cp` and `_wdl[uci] = wdl`.

#### `refreshSquares()` — Visual rendering of Stockfish results
For each destination square (`square.move-dest`):
1. Gets chess key via `getSquare(e, side, isBlack)` — uses CSS transform matrix to decode position (regex: `/(?<x>\d+(\.\d+)?), (?<y>\d+(\.\d+)?)\)/`)
2. Lookup centipawn score in `_eval[uci]`
3. Computes quality percentage: `(cp - minCp) / (maxCp - minCp)` where min/max are extremes across all evaluated moves
4. **Border color**: gradient based on delta from max (`lt.getGradientColor(delta, [{q:0,#00FF00},{q:100,#FFFF00},{q:200,#FF8000},{q:300,#FF0000}])`) — green for best, yellow for good, orange for mediocre, red for bad
5. **Background**: radial-gradient combining quality color (red→yellow→green) with 40% dark overlay at 66% blend
6. **WDL bar**: if win/draw/loss data exists → creates/updates `<div class="lichessTools-wdl"` with CSS variables `--deg` (orientation flip), `--w`, `--d`, `--l` showing percentages

#### Deactivation
When not active: stops Stockfish, clears all visual elements via `clearAll(true)` (only Stockfish cleanup).

## Piece Activity Evaluation

### `evaluatePieces()` — ChessActivityEvaluator

Uses a custom **ChessActivityEvaluator** class to evaluate non-pawn piece activity/mobility.

#### ChessActivityEvaluator Class
```javascript
class ChessActivityEvaluator {
  constructor(board) // takes 8x8 board matrix
}
```

Key properties:
- **directions**: move patterns per piece type (p=[], n=8 directions, b=4 diagonal, r=4 straight, q=all, k=all)
- **pieceBaseMobility**: expected max mobility per type (p:3, n:8, b:13, r:14, q:27, k:8) — used for score normalization

Scoring constants:
- `SECONDARY = 0.2` — secondary-level mobility bonus
- `CONTROLLED_BY_OPPONENT = 0.1` — score when move target is opponent-controlled
- `FREE = 1` — score when move target is free (not controlled by opponent)

#### Methods

| Method | Purpose |
|--------|---------|
| `inBounds(x,y)` | Checks coordinate within 8x8 board |
| `getColor(piece)` | Returns +1 for white (A-Z), -1 for black (a-z), 0 for empty |
| `getPieceType(piece)` | Lowercase piece character |
| `generateMoves(x,y)` | Generates all legal moves from position per piece type rules |
| `computeControlMap()` | Builds 8x8 map where each square value = sum of color contributions from all pieces controlling it (+1 for white control, -1 for black) |
| `evaluatePieceActivity(x,y,controlMap)` | Scores a piece's mobility: free moves get +1, opponent-controlled get +0.1; includes secondary-level (simulates moving to target then checking further mobility) |
| `cloneBoard()` | Deep copy of board matrix |
| `evaluateAll()` | Evaluates all pieces → returns `{white: sorted[], black: sorted[]}` arrays with `{piece, x, y, score}` |

#### Visual Rendering
After evaluation:
1. **getHappiness(arr)** — finds min (least active) and max (most active) scores among non-pawn/non-king pieces
2. Returns `{happy: [], unhappy: []}` arrays of chess keys
3. White happiness + black happiness combined → toggle `lichessTools-happy` class on squares matching any happy key
4. Toggle `lichessTools-unhappy` class on squares matching any unhappy key
5. **mostAdvanced**: finds the most advanced opponent piece (highest rank in advancing direction, must be above minimum rank threshold) → toggle `lichessTools-mostAdvanced`

## UI Controls

### `setControls()` — Button and popup setup

Creates UI elements in the analysis panel:
1. **Main button** (`button.lichessTools-moveAssistant`) with WhiteChessKing icon, title text
   - Click toggles global enable/disable (`this.isEnabled`)
   - Enabled state stored in localStorage via `lt.storage.set('LichessTools.moveAssistant')`
   - Disabled → clears all visuals + destroys Stockfish
2. **Popup** (`lichessTools-moveAssistant-popup`) opened on right-click (contextmenu)
   - Contains 5 toggle buttons for each sub-feature: dests, squares, pawns, moves, pieces
   - Each button toggles via `toggleSetting(key)` which updates `lt.currentOptions` and applies them
   - Popup closes when click outside it (capture event listener)

Button placement: inserted before settings-gear button in `div.ceval`, or in header if no ceval exists.

## Enable/Disable Storage

- `isEnabled getter`: reads from `lt.storage.get('LichessTools.moveAssistant')`
- `isEnabled setter`: writes to storage, sets internal flag, destroys Stockfish if disabled

## Start Method (`async start()`)

1. Reads preference value → parses individual option flags
2. Clears all visuals
3. Sets controls (buttons/popup)
4. If no preference value: removes popup, returns
5. Otherwise: starts 1-second evaluation interval, binds to `lichessTools.redraw` pubsub event for control updates

## Clear All (`clearAll(onlyStockfish)`)

Full cleanup of all visual elements:
- Removes `lichessTools-moveAssistant` class from board wrap
- Clears destination square backgrounds/borders
- Removes WDL bars
- Clears arrows, highlights, piece classes (backward/isolated/hanging/weakSquare/happy/unhappy/mostAdvanced)
- Resets cached JSON/FEN/Size state variables

## Key State Variables

| Variable | Purpose |
|----------|---------|
| `this.inEvaluate` | Lock to prevent re-entry during evaluation |
| `this._sf` | Stockfish instance reference |
| `this._evaluating` | Flag indicating Stockfish is running |
| `this._fen` | Current FEN being evaluated by Stockfish |
| `this._eval` | Map of uci → centipawn scores |
| `this._wdl` | Map of uci → win/draw/loss data |
| `this._squares` | Cache of CSS transform matrix → chess key mappings |
| `this._lastJson`, `_lastSize`, `_lastFen` | Cached state for square highlight comparison |
| `this._lastShapeJson`, `_lastShapeSize`, `_lastShapeFen` | Cached state for arrow shape comparison |
| `this.interval` | 1-second evaluation interval ID |
