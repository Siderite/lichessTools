# ExtraChart Tool - Context for LLM

## Purpose

The `extraChart` tool (folder `tools/extraChart/`) extends the Lichess computer analysis chart (ACPL / eval graph) and related UI on Analysis Board and Study pages. It overlays additional metric lines, vertical markers, move-quality glyphs, accuracy tooltips, and optional ticks on the eval gauge. Category: Analysis (Advanced preference).

It does not replace the native Lichess server-eval chart. It adds datasets to the existing Chart.js instance (or creates a local-only chart when only local engine data is available).

## Files

| File | Role |
|------|------|
| `tool.js` | Main tool class `ExtraChartTool`, all metric computation, chart generation, glyph logic, accuracy-plus UI, legend, Christmas easter egg |
| `tool.css` | Styling for chart container height, legend bar, gauge ticks, good-moves symbols, accuracy tooltip, Christmas text |
| `raccoon.js` | Third-party chess engine (Raccoon by Michael Edegware). Bundled for positional evaluation used by the "Principled" metric via `LiChessTools.Evaluator` (if present); otherwise heuristic returns 0 |

## Dependencies

- `EmitEsmLoaded` - to intercept the ACPL Chart.js module load and wrap `acpl()` so the tool receives the chart instance
- `EmitChapterChange` - force chart refresh when study chapter changes (mainly for brilliant-move glyphs)

## Preferences

Single multi-select preference `extraChart` (category `analysis`, advanced):

| Value | Default (logged in) | Meaning |
|-------|---------------------|---------|
| `material` | yes | Green dashed material-difference line |
| `principled` | yes | Blue dashed positional-quality line (heuristic minus material) |
| `tension` | yes | Red vertical dotted line at ply of maximum tension |
| `potential` | no | Green vertical dotted line at ply of maximum potential |
| `brilliant` | yes | Detect/show interesting moves; temporary `!?` glyphs; summary link |
| `moreBrilliant` | no (yes when not logged in) | Full good/best/brilliant classification using server + local eval |
| `local` | no (yes when not logged in) | Yellow local-engine eval line (current branch); can create chart when no server eval |
| `accuracy` | yes | Magenta accuracy line for the board-orientation side |
| `sharpness` | no | Pink sharpness line (requires Explorer cache data) |
| `coord` | no | Light-cyan piece-coordination line |
| `critical` | no | Thin red critical-move score line |
| `smooth` | yes | Chart smoothing flag (implementation currently a no-op; points returned unchanged) |
| `gauge` | yes | Green/blue ticks on the eval gauge for material/principled |
| `accuracyPlus` | yes | Hover tooltip on accuracy stats: glyph breakdown, estimated rating, phase accuracies |
| `hideLegend` | no | Hide the interactive legend under the chart |

Hidden preference `christmas` (default true): on 25 December shows animated "Merry Christmas" lights on the chart.

Default string (logged in): `material,principled,tension,brilliant,accuracy,smooth,gauge,accuracyPlus`  
Default when not logged in also includes `local,moreBrilliant`.

Upgrade note: `accuracyPlus` was added as a new option in v2.4.5.

## Architecture Overview

1. On `start()`, parse preference string into `this.options` object with boolean flags and a computed `needsChart`.
2. Subscribe to `lichessTools.esmLoaded` to wrap the ACPL module's `acpl` function; when a chart is created, store it and call `generateCharts()`.
3. Poll every 1 s: `generateCharts()` + `generateTicks()` (gauge).
4. On chapter change (if brilliant enabled) force-regenerate.
5. `generateCharts()`:
   - Locate chart container (`div.study__server-eval.ready` or `#acpl-chart-container`).
   - Obtain Chart.js instance (server chart or local-created canvas).
   - Compute data series for each enabled metric from `analysis.mainline` (or current branch for local).
   - Add/update Chart.js datasets (line or vertical annotation style).
   - Build/update interactive legend buttons under the chart.
   - Optionally run `setBrilliant` / `showGoodMoves`.
   - Optionally play Christmas animation.

All y-values for continuous lines are mapped into roughly [-1, +1] (Chart.js scale used by Lichess ACPL) via logistic or tanh transforms so they share the same vertical space as the native eval curve.

## Metric Computations

### Material (`getMaterialData`)
- Centipawn-style material from FEN using fixed piece values: Q=900, R=500, B=310, N=300, P=100, K=0.
- Difference (White positive) scaled: `y = 2/(1+exp(-0.004*cp)) - 1`.

### Principled (`getPrincipledData`)
- `heuristic(node)` = `LiChessTools.Evaluator.evaluate(fen)` (Raccoon-based positional score) minus raw material.
- Same logistic scaling. Represents non-material positional quality (mobility, centralization, etc.).

### Max tension / Max potential
- Tension (`tension(node)`): sum of material values of all pieces that are under attack (supports included). Cached by FEN in `MaxSizedMap`.
- Potential: similar but follows capture chains (`materialWon` / `maxMaterialWon` recursive capture simulation).
- Vertical lines drawn at the ply where the maximum value occurs on the mainline.

### Local eval (`getLocalData` / `getLocalAverageData`)
- Uses `node.ceval` or comment of form `eval: 2.3` / `eval #-1`.
- Yellow line follows the **current variation branch**, not mainline.
- Secondary thinner line = average of non-principal PVs when multipv > 1.
- When no server chart exists, the tool creates `#acpl-chart-container.lichessTools-extraChart` and also draws middle-game / end-game delimiters and (with moreBrilliant) inaccuracy/mistake/blunder markers.

### Accuracy (`getAccuracyData`)
- Only for the side matching board orientation.
- Uses Lichess win-percentage conversion and accuracy formula (`lt.winPerc`, `lt.accuracy`).
- Previous win% kept across plies; y scaled to [-1,1].

### Sharpness (`getSharpnessData`)
- Requires `analysis.explorer.cache[fen]`.
- Formula based on white/draw/black counts: higher when games are decisive and sample size is adequate.
- Only appears for positions the user has visited with Explorer open.

### Coordination (`getCoordData`)
- Internal class `CoordinationCalculator`:
  - Parses FEN to board.
  - For every non-pawn piece computes how many moves are needed for friendly pieces to defend it (BFS-like, capped at `MOVE_CAP=3`).
  - Isolated pieces receive `ISOLATED_PENALTY=5`.
  - Aggregate score transformed with `tanh(score/15)`.

### Critical (`getCriticalData`)
- Change-point style score on the evaluation series.
- Prefix sums of cp and cp^2.
- For each index tau, compares log-likelihood of one segment vs two segments split at tau (window M=16, min segment length 3).
- Peaks indicate moves that most change the evaluation regime.

## Brilliant / Interesting Moves (`setBrilliant`, `computeBrilliant`, `computeGood`)

- Walks mainline with previous two nodes.
- `computeGood`: change in win% relative to side to move.
- `computeBrilliant`:
  - Requires non-worsening (or only mild worsening) evaluation.
  - Rejects moves when in check, Crazyhouse drops, most queen promotions.
  - Detects tactical motifs: fork, pin, discovered attack (`hasTacticalMotif`).
  - Computes material sacrificed vs material that can be won back (`materialWon` / `maxMaterialWon`).
  - `computeSpectacle` scores the "spectacle" of a hanging piece (value * number of capturers * inverse-attacker-value ratio), log-scaled.
  - Thresholds: brilliant if score >= 3 (or >= 5 when `moreBrilliant`).
- Results stored on nodes; temporary glyphs (`!?`, good, best star, etc.) applied when not already annotated.
- Summary link in analysis panel cycles through them (keyboard G / Alt-G also used by key-shortcuts tool).
- With `moreBrilliant` every non-bad move is marked good; best = eval equal to previous; local engine updates glyphs live.

## Accuracy Plus

- Observes `.advice-summary__accuracy` (and related underboard elements).
- On hover shows tooltip with:
  - Counts / percentages of brilliant, best, good, neutral, inaccuracy, mistake, blunder in **current branch**.
  - Estimated Lichess rating from overall accuracy (statistical, not personal).
  - Accuracy split by game phase (opening / middlegame / endgame) on **mainline**.
- Forces the accuracy chart line on if not already enabled.

## Gauge Ticks

- When `gauge` is on, two `tick` elements (`.lichessTools-material`, `.lichessTools-principled`) are positioned on `div.eval-gauge` according to current-position material and principled values (percentage from top).

## Chart Legend

- Horizontal scrollable bar of buttons under the chart.
- Each button toggles the corresponding option, updates `lt.currentOptions`, and re-applies.
- Special handling for Local (confirmation dialog if disabling would remove the only chart) and for Moves (cycles brilliant / moreBrilliant states with visual glow).
- Drag-to-scroll supported.

## Colors (thematic for dark/light)

- Material: `#258F0B`
- Principled: `#250B8F`
- Local: yellow with alpha
- Accuracy: magenta
- Sharpness: pink
- Coordination: `#60A0A0`
- Critical: `#A00000`
- Max tension: `#FF0000`
- Max potential: `#008000`
- Interesting moves: green

## Caching

Heavy geometric/attack calculations use `LiChessTools.MaxSizedMap` (size limits 1000-10000) keyed by FEN or FEN+side+coords to keep interactive performance acceptable.

## Integration Points

- Wraps Chart.js ACPL factory via `lt.wrapFunction` on the ESM module.
- Uses analysis mainline / path, `node.ceval` / `node.eval`, Explorer cache, board orientation, FEN parsing helpers from core LiChessTools.
- Publishes no custom events; listens to `esmLoaded` and `chapterChange`.
- Christmas animation temporarily manipulates chart active elements and hover colors.

## Important Implementation Notes for Future Changes

- All continuous series must stay in the same y-scale as Lichess ACPL (roughly -1..1).
- Local chart is branch-specific; other lines are mainline-only.
- Brilliant glyphs are deliberately temporary (client-side only).
- Smoothing preference exists but the `smooth()` method currently returns points unchanged (previous spike-removal logic is commented out).
- Disabling Local on a page that only has the local chart removes the chart; re-enable only from Preferences.
- Raccoon is GPL-licensed; keep attribution if the Evaluator path is used.