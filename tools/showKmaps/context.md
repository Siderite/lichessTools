# Show K-MAPS Tool - Context for LLM

## Purpose

The `showKmaps` tool (folder `tools/showKmaps/`) displays a heuristic positional summary labeled **K-MAPS** next to boards the user is watching or analyzing. Each letter is a static evaluation of one principle for the **current position only** (no engine, no history). Values are oriented to the board orientation (positive = good for the side at the bottom).

Category: General (Advanced in the user manual; preference itself is not marked advanced in code). Default: enabled.

## Files

| File | Role |
|------|------|
| `tool.js` | Class `ShowKmapsTool` (UI, placement, refresh) and embedded class `ChessPositionEvaluator` (metrics) |
| `tool.css` | Layout for text and radar views, hover scale on canvas, mini-game spacing, study multiboard eval-toggle hide |

## Dependencies

- `EmitRedraw` - refresh main-board K-MAPS on analysis redraw
- `EmitContentLoaded` - refresh mini-game overlays when content loads

## Preference

Single boolean `showKmaps` (category `general`, default `true`).

## What K-MAPS Means

| Letter | Name | Heuristic focus |
|--------|------|-----------------|
| **K** | King safety | Pawn shield, open files near king, nearby enemy material, holes (squares friendly pawns can never attack) |
| **M** | Material | Classic values P=1 N=3 B=3 R=5 Q=9; +0.3 bishop pair; small rook-vs-minors imbalance penalty |
| **A** | Piece activity | Mobility (pseudo-legal moves), open-file R/Q, knight outposts, central control, long diagonals, checks/captures/promotion threats |
| **P** | Pawn structure | Doubled, isolated, passed (scaled by advancement), islands, backward, chains |
| **S** | Space | Controlled squares in opponent half, central pawns, penalty for pieces with zero moves |

Each metric is computed as White-minus-Black, then `normalize(diff, min, max)` maps to roughly **[-1, +1]**. Tooltip values are shown as integers in **[-100, 100]** (`round(value * 100)`).

Sign is flipped when the viewed orientation is Black so green still means "good for you."

## Display Modes

- **Text** (default): colored letters `K-MAPS` using CSS variable `--kmaps-color` per letter.
- **Radar chart**: five-axis canvas polygon; zero radius marked; labels colored the same way.

Toggle: click the K-MAPS element. Preference stored in localStorage key `LiChessTools.showKmaps.radar` (boolean). Applies to all K-MAPS instances after refresh.

Color mapping (`getColor`):
- Dark theme: neutral `#FFFFFF` toward green (positive) or red (negative)
- Light theme: neutral `#404040` toward green or red
- Magnitude uses `pow(|val|, 0.6)` then gradient interpolation via `lt.getGradientColor`

Radar hover: CSS scales canvas up to 10x for readability.

## Where It Appears

### Main board (`refreshKmaps`)

Anchored into the first matching container among:

- `div.game__meta section`
- `div.analyse__wiki.empty`
- `div.chat__members`
- `div.analyse__underboard .copyables`
- `main#board-editor .copyables`

FEN source: `analysis.node.fen` or `lt.getPositionFromBoard(main)`. Orientation from `analysis.getOrientation()` or `.cg-wrap.orientation-black`.

### Mini-games (`miniGameKmaps`)

Selectors: `a.mini-game`, `div.boards>a`, study multiboard mini-games, `div.mini-game`.

FEN from `data-state`, socket payload, or board DOM. Skips Lichess Ladders challenge widgets. Only elements in viewport are updated; out-of-viewport schedules a debounced retry.

On `/games` pages, body class `lichessTools-kmapsMiniGames` reserves padding so layout does not jump when the label appears.

## Refresh Triggers

When enabled:

| Event | Handler |
|-------|---------|
| Socket `endData` | `refreshKmapsDebounced` (500 ms) |
| Socket `fen` | `miniGameKmaps` |
| UI `ply` | `refreshKmapsDebounced` |
| `lichessTools.redraw` | `refreshKmapsDebounced` |
| `lichessTools.contentLoaded` | `miniGameKmapsDebounced` |
| Board editor | 1 s interval |
| Checkbox attribute changes (body observer) | both debounced handlers (covers study multiboard "eval" toggle) |

Initial refresh after 1 s on start.

Skipped when:

- `document.hidden`
- Body has class `playing` (live play)
- Analysis static-analysis setting is off **and** local ceval is off
- Study multiboard eval checkbox is present and unchecked (CSS also hides `.lichessTools-kmaps` in that case)

## ChessPositionEvaluator (implementation summary)

Constructor: parse first FEN field into 64-length board (rank 8 first, a8=0). Piece values and center indices `d4,d5,e4,e5` (27,28,35,36). Move cache Map for pseudo-legal generation.

### King safety (`evaluateKingSafety`)

Per side scores, then `normalize(diff, -15, 15)`:

- Pawn shield: friendly pawns on three squares in front of king (+2 each count unit)
- Open files among king file and adjacent files (-1.5 each)
- Enemy non-king pieces within 5x5 around king, weighted by piece value / 10
- Holes: adjacent squares (not back ranks) that friendly pawns can never attack (-0.5 each)

Returns 0 if either king is missing.

### Material (`evaluateMaterial`)

Sum piece values; bishop pair +0.3; if one side has a rook and 2+ minors vs zero opposing rooks, -0.2. `normalize(diff, -10, 10)`.

### Activity (`evaluatePieceActivity`)

- 0.1 per pseudo-legal move
- +0.3 R/Q on fully open file
- Knight outposts on c4-f5 center band: +0.3 with pawn support / +0.15 without if enemy pawns cannot attack the square
- Center squares: +0.5 if more attackers than opponent
- Long diagonals a1-h8 / a8-h1: piece-on-diagonal +0.3, control counts +0.1
- Checks +0.3; captures +0.1 * value; near-promotion pawns +0.4

`normalize(diff, -15, 15)`.

Pseudo-legal moves: standard ray/knight/king/pawn rules; optional `control` mode continues through friendly pieces for attack maps. Cached by `piece+idx`.

### Pawn structure (`evaluatePawnStructure`)

Doubled -0.5 per extra; isolated -0.5 per file with pawns; passed +0.2 * ranks advanced; islands -(count-1)*0.5; backward -0.5 on open file / -0.3 otherwise; chain support +0.1 per supporting diagonal pawn. `normalize(diff, -7, 7)`.

### Space (`evaluateSpace`)

Unique controlled squares in opponent half * 0.1; central pawn +1; immobile non-king pieces penalty `value*0.1 + 0.2`. `normalize(diff, -7, 7)`.

### `evaluate()`

Returns `{ K, M, A, P, S }` each in [-1, 1] from White's perspective before orientation flip in `getKmaps`.

## Design Notes for Future Changes

- Heuristic only; not Stockfish. Tooltip explicitly documents -100..100 normalization so material can look more extreme than raw pawn counts.
- Orientation flip is the only side-awareness at display time; evaluator always works from White-minus-Black.
- Click toggles view mode globally via storage, then removes all `.lichessTools-kmaps` and recomputes.
- Element reuse compares `JSON.stringify(kmaps)` on a DOM property to avoid redundant redraws.
- Board editor relies on polling because there is no ply/socket stream.
- Missing kings yield neutral K; other metrics still run.
- Not related to digital-logic Karnaugh maps; name is an acronym for the five principles only.