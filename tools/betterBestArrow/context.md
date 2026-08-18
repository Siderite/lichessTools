# Better Best Arrow Tool — Context

## Overview

The **BetterBestArrowTool** improves the best move arrow displayed on the chess board during analysis mode. It uses local computer evaluation (PVS - principal variation) to determine the best move instead of relying solely on cloud/lichess evaluation, especially when cloud eval depth is shallow (<15). It also optionally filters arrows based on orientation side.

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
2. Checks if current move has negative glyphs (`?!`, `?`, `??`) — if bad move AND `allMoves` not enabled, returns (only show arrow on good moves when allMoves is off).
3. Gets previous node from `analysis.nodeList.at(-2)`.
4. Extracts best move candidates:
   - **Cloud eval best**: `node.eval?.best`
   - **Local eval best**: `newCeval?.moves?.at(0)` from previous node's PVS (principal variation first move), only if `localEval` enabled
5. Determines final best move:
   - If both cloud best AND local best exist AND node.ceval depth < 15 → uses **cloud best** (`ebest`) (cloud is deeper/more reliable)
   - Otherwise → uses **local best OR cloud best** (`cbest || ebest`)
6. If `justOrientation` not enabled OR orientation matches turn color:
   - If best differs from node.eval.best AND new local eval centipawns ≥ existing cloud centipawns AND new depth ≥ existing depth → updates `node.eval.best = best`.
   - If no node.eval exists (dangerous fallback): creates a synthetic eval object with `_originator: 'lichessTools'`, cp, mate, and best from local eval.
7. Stores `currBest` for use in after hook.

### Orientation Filtering (`after` hook)

When `justOrientation` enabled AND orientation ≠ turn color (user is viewing opposite side):
- Removes all paleGreen arrows from autoShapes that match `currBest` (orig+dest == currBest). This prevents showing best move arrow when the user is not playing that side.

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