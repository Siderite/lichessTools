# Opening Name Tool — Context Summary

## Purpose

Displays opening names (from chess database) on lichess game/analysis pages, mini-game elements, and the Explorer section. Also optionally updates the page title with the opening name.

## Dependencies

`EmitContentLoaded`

## Preferences

| Name | Category | Type | Default | Advanced |
|------|----------|------|---------|----------|
| `showOpening` | general | multiple (checkboxes) | 'showInBoard,showInMinigames,showInExplorer' | no |

Possible values: **showInBoard** (large board/main analysis), **showInMinigames** (mini-game elements), **showInExplorer** (Explorer section title), **showInAnalysisTitle** (analysis page browser title).

## Architecture

The tool extends `LiChessTools.Tools.ToolBase`. It identifies openings from FEN positions and game PGN tags.

### Opening Dictionary (`opening_dict`)

Loaded via `lt.comm.getData('openings.json')` → stored as a Map keyed by position strings → opening name values. Position string format: concatenated board rows + color ('w').

### Position Extraction (`lt.getPositionFromFen(fen)`)

Converts FEN to position key string for dictionary lookup. Also supports `lt.reverseFen(fen)` for reversed orientation lookup (returns "(R)" suffix).

### Starting Board

`startBoard` = board from standard starting FEN: `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`. Used for ply estimation.

### minPlyEstimate(fen)

Counts changes between current board and starting board on rows [0, 1, 6, 7] (pawn ranks). Returns change count as estimated ply number.

### withOpening(gameId, el, ply, fen, isMini)

Core function that retrieves opening for an element:
- Checks viewport.
- If FEN matches current analysis node → uses node directly.
- Gets FEN from `data-state` or `lt.getPositionFromBoard`.
- Gets position string → lookup in `opening_dict`.
- Also checks reversed FEN position → if found and not '*', returns + "(R)".
- If opening found: sets `node.opening = { name: opening }`, triggers analysis redraw, stores `el.openingData = { time: Date.now(), opening, el }`, toggles `.lichessTools-withOpening` class.
- If no opening from FEN → fallback to API retrieval (if gameId exists and not 'synthetic'/'broadcast'):
  - Rate limit: not more often than 1 second (`openingTime`).
  - Study chapter PGN via `lt.api.study.getChapterPgn` (2 splits) or game PGN via `lt.api.game.getPgns`.
  - Extracts 'Opening' tag from PGN. If empty or '? → skip.
  - Stores `el.openingData` with time + 86400 if Termination = 'Unterminated'.
  - Estimates maxPly via minPlyEstimate.
  - Extracts UTCDate/UTCTime → parses gameTime → computes `el.gameTime = lt.getTimeText(time-gameTime)` (time display on mini-games).

### Opening Data Cache

`el.openingData` cached with time stamp. If `el.maxPly > 14` or cache age < 2000ms → returns cached opening without API fetch. For minigames (`isMini=true`) → never re-fetch from API once retrieved.

### miniGameOpening — Mini-game elements

Processes: `a[href].mini-game`, `div.boards>a[href]`, `.study__multiboard a.mini-game`, `div.mini-game`.
- Checks document hidden, body .playing, showStaticAnalysis false + cevalEnabled → skip.
- If eval checkbox unchecked on study multi-board → skip.
- Gets FEN from `data-state` or board position. Extracts gameId from href (special handling for 'broadcast').
- Calls `withOpening(gameId, el, undefined, fen, true)` (isMini=true).
- Creates `.lichessTools-opening` span appended to container. TextSafe with opening, title = opening.
- If `el.gameTime` and no `.lichessTools-time` element + closest('#miniGame') → adds time span.
- Debounced (500ms). If not in viewport → re-debounces.

### showOpeningInExplorer — Explorer section

When `showInExplorer` enabled: targets `section.explorer-box div.data div.title a`.
- Extracts existing text and href `/opening/<openingName>`.
- If match found → builds moveList from current nodeList (first 10 SAN moves joined with '_') → updates href to `/opening/<name>/<moveList>`.
- Compares opening text with existing text, extracts new words via regex `[\w\(\)\.\/]+`ig.
- Creates `.lichessTools-opening` span insertAfter if words exist. ReplaceText with suffix `' ' + words.join(' ')`. Title = 'openingNameTitle'.

### refreshOpening — Main board/analysis page

Targets: gameId from tvOptions or analysis data game id. FEN from analysis node or game data.
- If same prevFen → skip. Updates prevFen.
- MetaSection cached query: `div.game__meta section, div.analyse__wiki.empty, div.chat__members:not(.none), .analyse__underboard .copyables, main#board-editor .copyables`.
- Calls `withOpening(gameId, main element, ply, fen, false)` on `main.round, main.analyse, main#board-editor`.
- If no result: clears metaSection opening text, showsExplorer(null).
- If **showInBoard**: removes non-viewport opening spans, creates new span in visible element if none exists. TextSafe with opening. Title = 'openingNameTitle'.
- If **showInAnalysisTitle** or pathname `/analysis`: updates `lt.global.document.title` to opening (if not '*), fallback to last node with opening name, fallback to originalTitle (cached on first run).
- Calls showOpeningInExplorer(result.opening).
- If no ply → triggers miniGameOpening. Debounced (500ms).

## Event Bindings

When **showInBoard** or **showInAnalysisTitle**:
- `lt.uiApi.socket.events.on('endData', refreshOpeningDebounced)`
- `lt.uiApi.events.on('ply', refreshOpeningDebounced)`
- Interval: 1000ms if `main#board-editor`, else 3500ms.
- `body observer on input[type=checkbox] → miniGameOpening` (attributes: true)
- `body observer on input[type=checkbox] → refreshOpeningDebounced` (attributes: true)

When **showInMinigames**:
- `lt.uiApi.socket.events.on('fen', miniGameOpening)`
- `lichessTools.contentLoaded pubsub → miniGameOpening`
- `window scroll → miniGameOpeningDebounced`
- Initial debounced call.

When disabled: removes all `.lichessTools-opening` elements, unbinds events.