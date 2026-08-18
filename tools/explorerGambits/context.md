# ExplorerGambits Tool

## Purpose

Shows number of possible gambits for each explorer move. Gambit detection uses ChessOps to compute post-move FEN, then checks against gambits.json data (white/black position maps with total counts).

## How It Works

### Gambit Dictionary

Fetches `gambits.json` via comm getData → creates white/black Maps from Object keys/values. Stored in `_gambits`.

### Position Computation

ChessOps parseFen/makeFen + Chess.fromSetup/play(parseUci) → computes FEN after move played.

### Gambit Detection

On `section.explorer-box table.moves`:
- Creates th/td columns for gambit display (ExclamationQuestionMark icon initially, Comet icon if result exists)
- Each move row: computeFen(fen, uci) → getPositionFromFen(moveFen) → checks gambits[side].get(pos) → returns nr (total or 1)
- Sum row: displays total sum of all gambit counts

### Title Format

`gambitRowTitle` pluralSame format with count number.

## Dependencies

- EmitRedraw, ChessOps

## Preferences

- `explorerGambits` — single type (false/true), default false, advanced/true

## Key Methods

- `gambit_dict()` → fetches gambits.json data
- `computeFen(fen, uci)` → computes FEN after move via ChessOps
- `prepareGambits()` → creates th/td columns in explorer table
- `showGambits(result)` → displays gambit counts/titles on moves
- `findGambits()` → fetches gambit data for current position, displays results
- `checkGambits()` → wraps explorer.setNode function
