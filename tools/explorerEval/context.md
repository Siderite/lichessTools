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

### Cache System

`cache[fen]` Map stores result moves per FEN. `cache404` nested Map caches 404 paths for quick rejection.

## Dependencies

- EmitRedraw, ChessOps

## Preferences

- `explorerEval` — multiple type: ['ceval', 'db', 'lichess', 'stats', 'evalRows', 'highlightList', 'bardp', 'spoa', 'hidden'], default: 'ceval,db,highlightList'

## Key Methods

- `prepareEvaluations()` → creates th/td columns in explorer table
- `showEvaluations(result)` → displays evaluation text/classes/titles on moves
- `showSPOA()` → calculates and displays SPOA on game tables
- `doEvaluation()` → fetches ChessDb/Lichess/ceval data, caches results
- `rebind()` → wraps explorer.setNode/onNewCeval functions
- `async start()` → sets up redraw listener, wraps functions
