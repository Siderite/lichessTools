# ExplorerEval Tool

## Purpose

Shows evaluation of explorer moves in the analysis explorer table. Multiple options: computer eval (ceval), ChessDb stats, Lichess cloud eval, winning stats from WDL bars, eval rows for missing moves, highlight list moves, bar precision display, Stronger Player Outcome Average (SPOA) on game tables, hidden mode.

## How It Works

### Evaluation Sources

1. **Computer Eval** (ceval): Uses analysis.ceval.pvs → depth, cp, mate, rank=null
2. **ChessDb** (db): Fetches via `lt.api.evaluation.getChessDb(fen)` → moves with depth=50, uci, cp from winrate score, rank from ChessDb rank
3. **Lichess Cloud** (lichess): Fetches via `lt.api.evaluation.getLichess(fen, 5/10)` → pvs mapped to moves with depth, cp, mate, rank=5
4. **Stats** (stats): Uses WDL bar data → cp from log(1/wr-1)*330 formula
5. **LT engine** (localEngine, "Auto eval"): Runs `lt.stockfish.evaluate(fen, { pv, depth, moves, cancelRequested })` with `searchmoves` set to the Explorer rows that still need a better number — no entry at all, a Stats-only value, or a Computer Eval value shallower than the engine's target depth (`customEngineLevel` or `engineDepth`) — with every row that still needs a better number in one pass (a 500-row Explorer list sends all 500 as `searchmoves`, one pv line each), then maps each `info.pv[0]` back to its uci → moves with depth, cp, mate, rank=`engineRank`. A row is only overwritten by the engine when the engine line is at least as deep, so CloudMove (rank 0-3) and Lichess cloud (rank 5) rows stay authoritative, a deeper computer eval keeps its own value, and an engine value is only replaced by a deeper engine value. The engine also reports its search as it goes: `options.onProgress` fires every `engineProgressMs` with the values collected so far, so the row shows the score at the depth reached — 6, then 7, then 18 — repainting through `enginePaintDebounced` (once per `enginePaintMs`, 1200) while it searches and once more immediately when the search answers. The run is not awaited: `doEvaluation()` paints the table first (Stats or the shallow computer-eval value shows immediately), and the fill asks for one more `showEvaluations` pass through `lt.requestAF` when it stores values, so the row switches to the purple engine value once the search answers. `engineActive`/`engineOptions` track the run in flight so a position change or turning the option off cancels it through `cancelRequested`; closing the Explorer cancels it the same way — `stopEngineIfPositionMoved()` runs from the redraw, from the wrapped `explorer.setNode` and at the top of `doEvaluation()` (it also queues another evaluation), `stopEngineIfExplorerClosed()` runs on every redraw and from the wrapped `explorer.config.toggleOpen`, and a run that was cancelled or found the Explorer closed when it answered drops its values, leaves those rows untried, and repaints nothing, so they get searched again once the Explorer reopens. Values only ever render for the position on screen: progress lines are merged only while `analysis.node.fen` still matches the searched fen, and both paints (`paintEngineValues` and the one in `doEvaluation()`) return early when it does not.

### Evaluation Display

On `section.explorer-box table.moves`:
- Creates th/td columns for evaluation display
- Each move row gets text: mate "M[mate]" or cp with decimals (2 if cevalDecimals enabled, 1 otherwise)
- Title based on rank: null → fromCevalTitle(depth), 0→fromChessDbTitle, 1→fromChessDbTitle, 2→fromChessDbTitle, 5→fromLichessTitle(depth), engineRank→fromEngineTitle(depth)
- Classes: lichessTools-stat (rank=-1), lichessTools-bad (rank=0), lichessTools-good (rank=1), lichessTools-best (rank=2), lichessTools-cloud (rank=5), lichessTools-engine (rank=engineRank)

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

`cache[fen]` Map stores result moves per FEN. `cache404` nested Map caches 404 paths for quick rejection — a 404 only resets the cloud sources, the rows already asked of the engine stay. The result also carries `dbLoaded`, `lichessLoaded` and `engineTried` (the ucis already asked of the engine), so each source runs at most once per FEN and a later Explorer update only searches the new moves; rows the engine returns nothing for stay marked as tried so they are not searched again on every redraw. Engine values are stored in the same per-FEN entry, so going back to a position reuses them: the engine runs again only for a row whose engine value is shallower than the configured depth (`customEngineLevel`), and the new values merge over the cached ones only when deeper.

## Dependencies

- EmitRedraw, ChessOps, Stockfish, BrilliantMoveAnalyzer (core script), MoveGen, Material, Scoring, MaxSizedMap

## Preferences

- `explorerEval` — multiple type: ['ceval', 'db', 'lichess', 'localEngine', 'stats', 'evalRows', 'highlightList', 'bardp', 'spoa', 'sharpness', 'brilliancy', 'hidden'], default: 'ceval,db,highlightList'

## Key Methods

- `prepareEvaluations()` → creates th/td columns in explorer table
- `showEvaluations(result)` → displays evaluation text/classes/titles on moves
- `showSPOA()` → calculates and displays SPOA on game tables
- `wdlToEval(item)` → Explorer counts to `{ cp }`
- `computeBrilliancy(fen, san, evalBefore, evalAfter, co)` → cached UberBrilliance score + the types whose interval holds
- `showBrilliancy()` → adds the GemStone column with the brilliancy score per explorer move
- `doEvaluation()` → fetches ChessDb/Lichess/ceval data, caches results
- `fillMissingWithEngine(fen, result)` → runs Stockfish over Explorer moves with no engine evaluation (Stats-only and shallower computer-eval rows count as missing), stores the values and requests a repaint; returns `{ retry, updated }` and stores nothing for a cancelled or Explorer-closed run
- `cancelEngineRun()` → aborts an in-flight engine run through `cancelRequested`; the fill also watches the Explorer itself: it starts nothing while the Explorer is closed, its progress callback cancels the run when the Explorer goes away or the node moves, and a watchdog polling every 500ms during the await cancels it the same way, so closing the Explorer stops the engine within half a second even with no redraw hook to lean on
- `engineMissingMoves(fen, result)` → one source for what still needs an engine value: no rows at all, an entry with no number, or a Computer Eval / engine entry shallower than the target depth; it returns nothing when the Auto eval sub-option is off or the Explorer is closed, so every guard below shares that rule
- `stopEngineIfRunUnneeded()` → cancels a live run when `engineMissingMoves` says there is nothing left to search (all rows evaluated, no Explorer rows, the option turned off, or the search already reached depth for every row through its progress reports); called on each redraw and at the top of `doEvaluation()`, and the fill's own watchdog calls it with the live result every 500ms
- `stopEngineIfExplorerClosed()` → cancels the run when `analysis.explorer.enabled()` goes false
- `stopEngineIfPositionMoved()` → cancels a run whose fen no longer matches `analysis.node.fen` and queues another evaluation
- `paintEngineValues(result, fen)` → repaints the evaluation column only while `fen` is the position on screen
- `enginePaintDebounced` → throttled engine repaint (`enginePaintMs`) for progress updates
- `mergeEngineLines` (inside `fillMissingWithEngine`) → stores engine values for a row only when deeper
- `rebind()` → wraps explorer.setNode/explorer.config.toggleOpen/onNewCeval functions
- `async start()` → sets up redraw listener, wraps functions
