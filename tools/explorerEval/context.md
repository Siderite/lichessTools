# ExplorerEval Tool

## Purpose

Shows evaluation of explorer moves in the analysis explorer table. Multiple options: computer eval (ceval), ChessDb stats, Lichess cloud eval, winning stats from WDL bars, eval rows for missing moves, highlight list moves, bar precision display, Stronger Player Outcome Average (SPOA) on game tables, hidden mode.

## How It Works

### Evaluation Sources

1. **Computer Eval** (ceval): Uses analysis.ceval.pvs → depth, cp, mate, rank=null
2. **ChessDb** (db): Fetches via `lt.api.evaluation.getChessDb(fen)` → moves with depth=50, uci, cp from winrate score, rank from ChessDb rank
3. **Lichess Cloud** (lichess): Fetches via `lt.api.evaluation.getLichess(fen, 5/10)` → pvs mapped to moves with depth, cp, mate, rank=5
4. **Stats** (stats): Uses WDL bar data → cp from log(1/wr-1)*330 formula

### Evaluation Display

On `section.explorer-box table.moves`:
- Creates th/td columns for evaluation display
- Each move row gets text: mate "M[mate]" or cp with decimals (2 if cevalDecimals enabled, 1 otherwise)
- Title based on rank: null → fromCevalTitle(depth), 0→fromChessDbTitle, 1→fromChessDbTitle, 2→fromChessDbTitle, 5→fromLichessTitle(depth)
- Classes: lichessTools-stat (rank=-1), lichessTools-bad (rank=0), lichessTools-good (rank=1), lichessTools-best (rank=2), lichessTools-cloud (rank=5)

### Bar Precision (bardp)

On `td:has(div.bar)` → replaces white/draws/black element text with rounded percentage values.

### Sharpness/Win Margin Titles

Calculates sharpness from min(w,l)/50*333/d*1/(1+exp(-(w+l)/1000)) and winMarginInterval via Wilson interval formula — adds to tdBar title as "sharpness / winMargin" format.

### Warning Classes

- diff > 200 centipawns → lichessTools-warning-red/green based on signVal with evalWarning title
- sharpness >= 100 → lichessTools-warning-blue with evalWarning title

### Eval Rows (evalRows)

Creates new `<tr>` rows for moves not in existing table:
- Uses ChessOps parseUci/san to create move text
- Adds colspan="100" td class "lichessTools-evalRow" with title text

### Highlight List (highlightList)

Toggles `lichessTools-explorerEval-inList` class on moves that are in analysis.visibleChildren list.

### SPOA (spoa)

On game tables (`section.explorer-box .data table.games`) → calculates Stronger Player Outcome Average from topGames/recentGames:
- For each game, key = black rating > white rating ? 'black' : 'white'
- Winner == key → +1, no winner → +0.5
- Result as percentage with title "LiChess Tools - Stronger Player Outcome Average"

### Brilliancy Column (`brilliancy`)

Adds a `th`/`td` column with class `lichessTools-showBrilliancy` to `table.moves` (GemStone icon in the header, title `brilliancyHeaderTitle`). Like the Gambits column, the whole column stays away while nothing is to show: the `th` is appended only once at least one row has a value, and when a finished pass produced no value at all every `.lichessTools-showBrilliancy` cell inside the table is removed. The cell value is `BrilliantMoveAnalyzer.computeUberBrilliance().score` (0-100, one decimal) rendered through `brilliancyText`; the cell title is `brilliancyTitle` followed by one line per entry of `byType` whose `fit` is above 0 (`label: fit.toFixed(1)`, label from `analyser.types[name].label`), sorted by fit descending. A zero score leaves the cell blank.

Partial credit below a type's interval comes from `_fit()`, and `_fit()` collapses to 0 when an essential principle of the type (see `necessaryPrinciples()`) is a hard 0 in `values` — `1.e4` gives up nothing so `sacrifice` is 0 and every sacrifice type scores 0, and a capture is not a quiet move so the quiet type scores 0. An essential principle at 0 also means the weighted average cannot reach the interval, so this never hides a type that actually applies; the gradient stays for moves whose sacrifice is real but incomplete (Explorer counts for a clearly inferior move also give `bestMove` = 0, which zeroes those types the same way). `multiPv` is never passed to the analyzer, so `onlyMove` and `regainsMaterial` stay null and the `combination` type never applies.

The san for the analyzer comes from ChessOps (`co.san.makeSan` over the node FEN position). Moves are computed inside a `brilliancyBudget` ms time budget per pass (50 ms); rows left over continue on the next animation frame through `lt.requestAF`. Results are cached in `brilliancyCache` (MaxSizedMap 500) keyed by fen + san + the two evals, so redraws stay cheap. `lichessTools-brilliancy-brilliant` is toggled on the cell when the score is brilliant.

### Cache System

`cache[fen]` Map stores result moves per FEN. `cache404` nested Map caches 404 paths for quick rejection.

## Dependencies

- EmitRedraw, ChessOps, BrilliantMoveAnalyzer (core script), MoveGen, Material, Scoring, MaxSizedMap

## Preferences

- `explorerEval` — multiple type: ['ceval', 'db', 'lichess', 'stats', 'evalRows', 'highlightList', 'bardp', 'spoa', 'sharpness', 'brilliancy', 'hidden'], default: 'ceval,db,highlightList'

## Key Methods

- `prepareEvaluations()` → creates th/td columns in explorer table
- `showEvaluations(result)` → displays evaluation text/classes/titles on moves
- `showSPOA()` → calculates and displays SPOA on game tables
- `wdlToEval(item)` → Explorer counts to `{ cp }`
- `computeBrilliancy(fen, san, evalBefore, evalAfter, co)` → cached UberBrilliance score + the types whose interval holds
- `showBrilliancy()` → adds the GemStone column with the brilliancy score per explorer move
- `doEvaluation()` → fetches ChessDb/Lichess/ceval data, caches results
- `rebind()` → wraps explorer.setNode/onNewCeval functions
- `async start()` → sets up redraw listener, wraps functions
