# PGN Editor Tool - Context for LLM

## Purpose

The `pgnEditor` tool (folder `tools/pgnEditor/`) provides a full page (`/page/pgnEditor`) for bulk PGN manipulation: merge, normalize/denormalize transpositions, split variations, search/filter, cut metadata or branches, evaluate end positions with Stockfish, and import/export. It is the recommended place for multi-game PGN work (repertoires, player game collections, study preparation). Category: Analysis. Default: enabled.

Entry points:
- Tools menu item "PGN Editor"
- `/page/pgnEditor` — the page itself; the legacy `#pgnEditor` hash on any page redirects there (`pageAliases`)
- "PGN Editor" link in the Analysis action menu that exports the current analysis PGN and hands it to the page through `LichessTools.pgnEditor.pendingPgn`

## Files

| File | Role |
|------|------|
| `tool.js` | Class `PgnEditorTool` (extends `PageToolBase`): page render, history, all operations, search, evaluate, write-back |
| `tool.css` | Page layout (`main.lichessTools-pgnEditor`), button column, mobile two-tap activation, help link |

## Dependencies

- `ChessOps` - chessops library for `parsePgn` / `makePgn`, SAN play, FEN generation (`startingPosition`, `parseSan`, `makeSanAndPlay`, `makeFen`)
- `Stockfish` - local engine for Evaluate (end-position comments)
- `ExportPGN` - used by the Analysis action-menu "send to PGN Editor" link

The `Dialog` tool is no longer a dependency: the editor owns its page instead of a dialog.

Optional interaction with `ShowPawnStructureTool` for pawn-structure search keys.

## Preference

Single boolean `pgnEditor` (category `analysis`, not advanced, default true).

## UI Structure

- The tool owns the page: `preparePage()` clears the 404 shell's `main` and tags it `main.lichessTools-pgnEditor`; the css hides any other main content (`html[data-page-href*="/page/pgnEditor"] main:not(.lichessTools-pgnEditor)`)
- Page content: an `a.help-button`, an `<h2>` title and `div.input-wrapper` (textarea + `div.buttons` column)
- Large textarea (autofocus, no spellcheck)
- Vertical button column: Merge, Normalize, Denormalize, Split, Search, Result, Cut, Evaluate, Commands, Count, Cancel, Upload, Download, Copy, Undo, Redo, Clear
- Status label under buttons (game count, progress, errors)
- The dialog plumbing is gone: no `lt.dialog`, no `showModal`, no close button, no `history.pushState('#pgnEditor')`. Leaving the page is how the editor is closed; the document title is set while on the page and the next page restores its own.
- The Evaluate button is removed on the page (`lichess.analysis` is absent there), because evaluation needs the analysis engine.
- Mobile: first tap marks button active (expands label), second tap runs the action (`mobileFirstTap`)
- Body gets class `lichessTools-page` while on the page; html overflow locked

## History / Persistence

- In-memory stack `history[]` + `historyIndex`, max 10 entries
- Entries larger than 10_000_000 characters are skipped (console warning)
- Stored in sessionStorage (zipped): keys `LichessTools.pgnEditor.history`, `LichessTools.pgnEditor.historyIndex`
- Undo / Redo / Clear update both textarea and storage
- Clear wipes history entirely

## Operation Runner

- `runOperation(name, fn)` ensures only one long job at a time
- Sets `_runningOperation`, enables Cancel, disables other buttons
- `_cancelRequested` checked in loops; Cancel sets it and shows "Operation cancelled"
- Timing logged to console
- Status text via `writeNote(label)`

## Core Data Model

Games are chessops PGN trees:
- `game.headers` - Map of PGN tags
- `game.moves` - root node; each node has `data.san`, `data.comments`, `data.startingComments`, `data.nags`, `children[]`
- Enhancements added by this tool:
  - `node.data.fen` - full FEN after the move (`enhanceGameWithFens`)
  - `game.fenDict` - Map from position key (`lt.getFenPosition(fen)`) to array of nodes at that position
  - `game.pawnStructureDict` - Map from pawn-structure keys (via ShowPawnStructureTool) to nodes
  - `game.lastMoves` - leaf nodes
  - `node.lt` / parent links used during denormalize circular checks
  - `node.count` - merge multiplicity for optional sort-by-count

Illegal moves throw errors with `san` and `ply`; shown as "Illegal move in game N, ply P (SAN)".

## Operations

### Merge (`mergePgn` / `mergePgnText`)

1. Parse all games; enhance each with FENs.
2. First pass: merge games that share the exact same root FEN (children concatenated).
3. Build `fenDict` per game.
4. Second pass: if one game's root position appears inside another game's tree, graft the smaller tree onto that node.
5. `cleanGame`: collapse duplicate SANs at the same node (merge children/comments/nags), optionally sort children by `count` descending (default; hold Shift on Merge to preserve order - `options.sortByCount`).
6. Write back. If nothing merged, status "Cannot merge! (no common board positions)".

### Normalize (`normalizePgn`)

For each game: enhance FENs + fenDict. For every position that occurs more than once, move all alternative continuations onto the **first** occurrence of that position and leave later occurrences as leaves. Purpose: group all moves from a transposition into one place. Structure changes; not reversible to original by denormalize alone.

### Denormalize (`denormalizePgn`)

Opposite direction: for each position with multiple nodes, clone continuations from siblings onto each occurrence (skipping circular paths). Increases tree size. Then cleanGame.

### Split (`splitPgn`)

Walk every path from root to leaf; emit one linear game per path (copies headers). Reverse of Merge for variation trees.

### Search (`searchPgn`)

Prompt accepts several modes (mutually detected from the string):

| Pattern | Mode |
|---------|------|
| `Invalid` | Games that fail FEN enhancement (illegal moves / bad start) |
| `Tag=Value` or `Tag*=Value` | Exact or contains match on header (case-insensitive tag; whitespace ignored in value). Special tag `Index` = 1-based game index |
| `Ply=N` / `Ply>N` / `Ply<N` | Max ply of the game |
| `Eval=N` / `Eval>N` / `Eval<N` | Leaf comment matching `eval:` or `%eval` (mate or cp) |
| `Clock` | Any `%clk` / `%emt` in comments |
| `Shapes` | Any `%csl` / `%cal` in comments |
| Otherwise | Partial FEN / PGN / pawn structure; `*` and `?` wildcards. Tries: full PGN text, PGN without comments/annotations, PGN without move numbers, fenDict keys, pawnStructureDict keys |

Matching games get header `Found` set to the search string (previous Found tags cleared). Status shows how many found.

**Do not use full FEN with halfmove/fullmove clocks** - only board + turn + castling + en passant are supported for FEN-style search.

### Result (`keepFound`)

Keep only games with `Found` header, then delete the header. Warning: if nothing was searched, clears the textarea.

### Cut (`cutStuff`)

Single prompt; keywords can be combined:

| Token | Action |
|-------|--------|
| `tags` | Strip all headers (empty-tag games later get Event "exported by LiChess Tools" if needed) |
| `comments` | Remove comments / startingComments |
| `annotations` / `nags` | Remove NAGs |
| `result` | Remove games that have Found (opposite of Result) |
| `ply N` or bare `N` | Truncate every branch after ply N |
| `eval<op><val>` | Drop branches whose leaf eval matches operator |
| `eval` alone | Strip `%eval` markers from comments |
| `clock` | Strip `%clk` / `%emt` |
| `shapes` | Strip `%csl` / `%cal` |
| `junk` | Heuristic removal of non-PGN text |

### Evaluate (`evaluatePgn`)

- Requires analysis or study page (Stockfish availability); otherwise announces limitation and may redirect.
- For each leaf without an existing eval comment, run local Stockfish to preference depth (`customEngineLevel`) and precision (`cevalDecimals`).
- Appends comment `eval: <cp or #mate>`.
- Skips positions already commented.
- Progress notes for games and individual moves; cancellable.

### Commands (`runCommand`)

Prompt supports:
- `extractFen` - for each game, list unique FENs (game index + FEN list text)
- `splitForStudy` - recursively split games over ~3000 moves so each piece fits Lichess study import limit; sets FEN/SetUp on new games; marks split point with comment "Split here."
- `select <start> [count]` - select textarea range covering those 1-based games (regex over tag blocks)

### Count (`countPgn`)

Parses games (ignores empty no-tag no-move), counts games and total SAN nodes; updates status label. Auto-run after most operations.

### I/O

- **Copy** - clipboard write of textarea
- **Upload** - file picker (also drag-drop onto textarea)
- **Download** - file `pgnEditor_<timestamp>.pgn`
- **Clear** - empty textarea + wipe history

## Write Path (`writeGames` / `gamesToPgn`)

1. Filter games with no moves and no tags.
2. If multiple games and a game has moves but only empty/placeholder tags, set `Event` to "exported by LiChess Tools" so importers keep game boundaries.
3. `makePgn` each game, join with blank lines, strip empty tags.
4. Convert NAG `$1`..`$6` to traditional `!` `?` `!!` `??` `!?` `?!` on the move text.
5. `setText` -> textarea + history.

## Analysis Integration

- On analysis pages, injects link in `.action-menu__tools` that exports current PGN (clock, eval, tags) via `lt.exportPgn`, stores it under `LichessTools.pgnEditor.pendingPgn` and navigates to the page.
- Watches redraw / wraps action-menu toggle so the link stays present.
- `hashchange` redirects a legacy `#pgnEditor` hash to the page; on the page it does nothing.

## Error and Edge Handling

- Chessops must be loaded; otherwise operations no-op with console warning.
- Illegal moves stop the batch and announce which game/ply/SAN failed.
- Invalid start positions (e.g. no kings) fail during `startingPosition` / enhancement - known limitation of the parser.
- Long merges yield periodically so the UI stays responsive (`await lt.timeout(0)` + status refresh every ~1 s).
- Games with no moves and no tags are dropped on write; games with moves but stripped tags get a synthetic Event tag when writing multi-game files.

## Design Notes for Future Changes

- All structural ops assume valid chessops trees; enhance-with-FENs is the validation gate.
- Position identity uses `lt.getFenPosition` (board+side+castling+ep), not full FEN clocks.
- Merge sort-by-count is the only Shift-modified desktop behavior; mobile has no equivalent yet.
- Evaluate is the only operation that requires the analysis/study context and the Stockfish dependency.
- Search Found tag is the sole bridge between Search, Result, and Cut result.
- History is session-scoped and size-capped; very large PGNs may not enter undo history.