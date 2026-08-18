# Pawn Structure Tool — Context Summary

## Purpose

Identifies and displays pawn structure names on lichess game/analysis pages, mini-game elements, and study multi-board views. Shows a text label with the identified structure name (and similarity percentage for fuzzy matches).

## Dependencies

`EmitRedraw`, `EmitContentLoaded`

## Preferences

| Name | Category | Type | Default | Advanced |
|------|----------|------|---------|----------|
| `showPawnStructure` | general | multiple (checkboxes) | 'onlyNamed,fuzzy' | no |

Possible values: **enabled** (general activation), **onlyNamed** (only show named structures from database, not fuzzy approximations), **fuzzy** (allow fuzzy matching with threshold 90% instead of exact 100%).

## Architecture

The tool extends `LiChessTools.Tools.ToolBase`. It processes pawn structures from board FEN positions.

### Pawn Structure Extraction (`getStructure(board, blackOrientation)`)

Extracts a structured text representation from the board array (8×8):
- **pawns**: arrays for white ('w') and black ('b'), each 8 columns filled with -1 initially. White pawn position = `6-y`, Black pawn position = `y-1` (if y ≤ 4).
- **led** (leading): arrays indicating whether a pawn is leading on its column (if previous column already has a pawn at same or higher rank).
- **islands**: contiguous pawn blocks per color (start/end indices).
- **qSide** / **kSide**: queen-side and king-side pawn count for each color.

Structure text format: 38-character string composed of primitives mapped to characters:
```
PM3,PM4,PM2,PT3,PT4,PT2,Q,K, ,
PM5,PM1,PM6,PT5,PT1,PT6, ,
PM0,PM7,PT0,PT7, ,
LM3,LM4,LM2,LT3,LT4,LT2, ,
LM5,LM1,LM6,LT5,LT1,LT6, ,
LM0,LM7,LT0,LT7
```

Primitives mapping (`toChar(s)`):
- `Q`: compares qSide of "me" vs "they" → 'M' (more), 'T' (less), 'X' (equal)
- `K`: same for kSide
- `PM<rank>`: pawn rank on column — 'X' if no pawn, numeric value otherwise. 'M' = me color, default = they color
- `LM<rank>`: leading pawn indicator — 'L' or 'X'

[me, they] determined by blackOrientation: blackOrientation → ['b','w'], else → ['w','b'].

### Opposing Structure (`getOpposingStructure(structure)`)

Rearranges the structure string to show the opposing color's perspective: swaps sections, converts M→x/T→M/x→T.

### Pawn Structures Database

Loaded via `lt.comm.getData('pawnStructures.json')`. Stored in `this.pawnStructures` as a dict keyed by structure key strings → value objects (name, url).

### Structure Name Matching (`getStructureName(structure, onlyNamed)`)

Threshold = 90 if fuzzy enabled, 100 otherwise.
1. Gets all pawn structures from database, computes similarity via `keySimilarity`, sorts descending.
2. If exact match (similarity=100) → returns value.
3. Also checks opposing structure for exact match → returns with "(R)" suffix.
4. Picks best of primary vs opposing based on similarity.
5. If similarity ≥ threshold → returns that value.
6. If `onlyNamed` enabled and no exact/fuzzy match → returns null.
7. Otherwise → returns `{ name: structure.split(' ')[0], best: arrItem }` (approximation with best reference).

### Key Similarity (`keySimilarity(kSearch, kNamed)`)

Cached in `keyCache`. Direct computation:
- Removes spaces from both keys.
- Compares character-by-character up to min length.
- Exact match adds 1 (or 0.8 if prefix already mismatched).
- Mismatch where search pawn rank < named pawn rank adds 0.2.
- Result = `Math.round(sim * 100 / l)` percentage.

### Structure Anchor Rendering (`addStructureAnchor(el, structureName, structure)`)

Creates or updates `.lichessTools-structure` element on target:
- If no name → removes existing element.
- Switches element type (a vs span) based on whether structureName has url (link).
- Finds visible element in viewport to append.
- Title = translator pluralSame('structureNameTitle', structure) + optional best reference line (`best.value.name + similarity%`).
- ReplaceText with structureName name. Sets href if link.

### miniGameStructure — Mini-game elements

Processes `a[href].mini-game`, `div.boards>a[href]`, `.study__multiboard a.mini-game`, `div.mini-game` elements:
- Checks document not hidden, body not .playing, showStaticAnalysis not false + cevalEnabled.
- If eval checkbox exists and unchecked → skip.
- Gets FEN from `data-state` or `lt.getPositionFromBoard`.
- Extracts board → structure → structureName → adds anchor.
- Debounced (500ms). If elements not in viewport → re-debounces.

### refreshStructure — Main game/analysis page

On main board: gets FEN from `analysis.node.fen` or `lt.getPositionFromBoard($('main')`. Extracts board → structure → structureName. Targets metaSection cached query:
```
div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables
```

Adds anchor to metaSection. Also triggers miniGameStructure if no ply parameter. Debounced (500ms).

### isGamesPage

Checks pathname `/games(\/|$)?` for games page detection. On games page: toggles `body lichessTools-structureMiniGames` class when enabled.

## Event Bindings

When **enabled**:
- `lt.uiApi.socket.events.on('endData', refreshStructureDebounced)`
- `lt.uiApi.socket.events.on('fen', miniGameStructure)`
- `lt.uiApi.events.on('ply', refreshStructureDebounced)`
- `lichessTools.redraw pubsub → refreshStructureDebounced`
- `lichessTools.contentLoaded pubsub → miniGameStructureDebounced`
- setTimeout(1000) for initial refreshStructureDebounced.
- If `main#board-editor`: interval 1000ms for refreshStructureDebounced.
- `body observer on input[type=checkbox] → miniGameStructure` (attributes: true)
- `body observer on input[type=checkbox] → refreshStructureDebounced` (attributes: true)

When **disabled**: removes `.lichessTools-structure` from metaSection, unbinds all events.