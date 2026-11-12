# Better Best Arrow Tool — Context

## Overview

The **BetterBestArrowTool** improves the best move arrow displayed on the chess board during analysis mode. It uses local computer evaluation (PVS - principal variation) to determine the best move instead of relying solely on cloud/lichess evaluation, especially when cloud eval depth is shallow (<15). With the `justOrientation` option it shows the best move the orientation side *could have made*, only right after that side has moved (i.e. when it is now the opponent's turn).

## Dependencies

- `EmitRedraw` — dependency

## Preferences

- **name**: `betterBestArrow`
- **category**: `analysis2` ("Analysis - minor")
- **type**: `multiple` (checkboxes)
- **possibleValues**: `[enabled, localEval, allMoves, justOrientation]`
- **defaultValue**: `enabled,localEval,allMoves` (justOrientation off by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Best Move Determination (`before` hook in wrapped setAutoShapes)

When `analysis.setAutoShapes` is called:

1. Checks if node has an outcome — if yes, returns (game ended/mate).
2. Checks if current move has negative glyphs (`?!`, `?`, `??`) — if it is NOT a bad move AND `allMoves` not enabled, returns (arrow only shown on bad moves unless `allMoves` is on).
3. Gets previous node from `analysis.nodeList.at(-2)`.
4. Extracts best move candidates:
   - **Cloud eval best**: `node.eval?.best`
   - **Local eval best**: `newCeval?.moves?.at(0)` from previous node's PVS (principal variation first move), only if `localEval` enabled
5. Determines final best move:
   - If both cloud best AND local best exist AND node.ceval depth < 15 → uses **cloud best** (`ebest`) (cloud is deeper/more reliable)
   - Otherwise → uses **local best OR cloud best** (`cbest || ebest`)
6. If `justOrientation` is not enabled, OR the orientation side has just moved (`orientation != turnColor`, i.e. it is now the opponent's turn):
   - If best differs from node.eval.best AND new local eval centipawns ≥ existing cloud centipawns AND new depth ≥ existing depth → updates `node.eval.best = best`.
   - If no node.eval exists (dangerous fallback): creates a synthetic eval object with `_originator: 'lichessTools'`, cp, mate, and best from local eval.

   (So with `justOrientation` the arrow is only re-pointed right after the orientation side has moved; on that side's own turn the default arrow is left alone and removed by the `after` hook — see below.)
7. Stores `currBest` for use in after hook.

### Orientation Filtering (`after` hook)

The `justOrientation` option ("Only moves for orientation side") means: **show the best move the orientation side could have made, only right after it has moved.**

- Right after the orientation side has moved (`orientation != turnColor`, the opponent is now to move): the `before` hook has already pointed the arrow at `best` — the move the orientation side *should* have played, derived from `prevNode`'s local PV — so the arrow stays visible.
- On the orientation side's own turn (`orientation == turnColor`): removes the paleGreen arrows matching `currBest` (orig+dest == currBest) so the best move isn't revealed before the user has a chance to think.

## Body Class Toggle

- Adds/removes body class `lichessTools-betterBestArrow` based on enabled state.

## Wrapping Mechanism

When enabled:
- **Wraps** `analysis.setAutoShapes` function with `wrapFunction`:
  - `before`: determines and potentially updates best move before original execution (can alter params, return false to block).
  - `after`: removes orientation-filtered arrows after original execution.

## Cleanup on Disable

When preference is off:
- Removes body class.
- Unwraps `analysis.setAutoShapes`.