# VariationIndex Tool — Context

## Overview

The **VariationIndexTool** displays which variation of the current position the user is
viewing, in the form "Variation X of Y", as a small label at the bottom of the analysis tools
panel (`div.analyse__tools`).

## Dependencies

- `EmitRedraw` — re-evaluates the label when the board redraws
- `EmitChapterChange` — re-evaluates the label when the study chapter changes

## Preferences

| name | category | type | possibleValues | defaultValue | advanced |
|------|----------|------|----------------|--------------|----------|
| `variationIndex` | analysis | single | [false, true] | true | yes |

## Behavior

- `getVariationData()` — caches the whole variation scan. It does a single depth-first
  traversal of `analysis.tree.root` (skipping computer/engine nodes via `!c.comp`) and builds
  `{ root, total, variations, indexByPath }`:
  - `total` — number of leaf paths in the PGN.
  - `variations` — array (DFS order) of the "start" path of each variation (the first node
    after the branching point, or the first move for the main line).
  - `indexByPath` — a `Map` from every node path to the 1-based DFS position of the first leaf
    in that node's subtree (built with a post-order traversal).
  The result is cached and reused as long as `analysis.tree.root` is the same object reference;
  a full reload or chapter switch (which replaces the root) invalidates it automatically.
- `getVariationInfo(path)` — O(1). Reads the cached `getVariationData()` and looks up the
  current variation index via `indexByPath.get(path)`; returns `{ index, total, variations }`,
  or `null` when the path is empty, the PGN has fewer than two lines, or the path is unknown.
  Everything is derived from the live `analysis.tree` but no tree rescan happens per call.
- `cycleVariation()` — click handler on the label. Advances to the next variation (wrapping
  around after the last) and jumps the analysis to that variation's start node via
  `analysis.userJumpIfCan(nextPath)`. The jump targets come from the cached `variations`, so no
  rescan happens on click.
- `showVariationIndex()` — computes the variation info from `analysis.path` and renders it in a
  clickable `<div class="lichessTools-variationIndex">` (with a title tooltip) at the bottom of
  `div.analyse__tools`. The element is removed when there is no variation info. Because
  `div.analyse__tools` is a flex column, the label's CSS `order: 66` keeps it as the last child,
  while `position: sticky; bottom: 0` + `margin-top: auto` + `flex-shrink: 0` keep it pinned to
  the bottom of the visible area even when the panel content (engine, move list, interactive
  lesson, Explorer) overflows and scrolls. A solid background and top border make the pinned
  footer read cleanly over the scrolling content.

## Performance & correctness under dynamic changes

The expensive tree scan runs only when the tree actually changes, not on every redraw:

- `lichessTools.redraw` / `lichessTools.chapterChange` — re-render the label. On a chapter
  switch the root reference changes, so the cached scan is rebuilt automatically; ordinary
  board redraws (e.g. navigation) reuse the cache and only do an O(1) index lookup.
- A `MutationObserver` on `div.analyse__moves` (and its descendants, with `characterData` off)
  — `handleMoveListChange()` clears the cache and re-renders when the move-list DOM is rebuilt
  (moves added/removed/reordered, or a server refresh). This catches in-place tree mutations
  that do not replace the root object.

In every case the variation count, current index, and the click-to-cycle jump targets are
recomputed from the live `analysis.tree`, so newly added moves, reordered branches, and
server-refreshed move lists are reflected automatically — with a full rescan only on actual
structural changes.

## Effect

- Single-line PGN (no variations): no label is shown.
- Otherwise "Variation X of Y" is shown at the bottom of the analysis tools panel, where Y is
  the total number of lines (leaf paths) in the PGN and X is the global index of the line the
  current position is on (main line = 1).

