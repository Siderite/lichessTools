# StudyStats Tool

## Purpose

Adds a "Study stats" button to the Share section of a study. Clicking it opens a dialog with study statistics gathered from `analysis.study.data` and the chapter move/variation counts parsed from the study PGN.

## How It Works

### Button (`addButtonDirect`)

On `main.analyse .study__share .downloads`:
- Creates `<a class="button text lichessTools-studyStats">` with text "Study stats" and title "LiChess Tools - show study statistics".
- Click opens `showStudyStats`.

### Dialog (`showStudyStats`)

Reads `analysis.study.data` and opens a `lt.dialog` (class `lichessTools-studyStats`) with rows for:
- Name
- Description (if present)
- Chapters (count)
- Owner (from `members[ownerId]`, falls back to `ownerId`)
- Members (names with role)
- Updated (age in days via `daysText`)
- Topics (if present)
- Settings (key: value list)
- Moves / variations (spinner while loading)

The moves/variations row loads asynchronously from `lt.api.study.getStudyPgn`, replaces the spinner with `1. moves/variations | 2. ...` per chapter.

### PGN Counting (`countChapterMoves`)

Uses ChessOps `co.pgn.parsePgn` to build the move tree per game. For each game counts:
- `moves`: total number of SAN nodes across the whole tree
- `variations`: number of distinct lines (leaf nodes that end in a move)

Falls back to a regex tokenizer when ChessOps is unavailable.

## Dependencies

- EmitRedraw, Dialog, ChessOps

## Preferences

- `studyStats` — single type (false/true), default true, advanced/true, category: study

## Key Methods

- `showStudyStats(ev)` — builds and opens the dialog, loads counts async
- `countChapterMoves(pgn)` — parses PGN and returns `{ moves, variations }` per game
- `addButtonDirect()` / `addButton` (debounced) — inserts the button
- `async start()` — binds button rendering to study tool tab and redraw events
