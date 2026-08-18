# Analysis Context Actions Tool — Context

## Overview

The **AnalysisContextActionsTool** adds extra options to the analysis/study tree view (move list) context menu. These additional menu items provide various utilities for working with PGN branches, evaluations, transpositions, and variation ordering.

## Dependencies

- `EmitRedraw` — needed for redraw events
- `CustomEngineLevel` — required for evaluation features (custom engine depth must be set)
- `ExportPGN` — used to export/copy branch as PGN
- `DetectThirdParties` — dependency
- `Dialog` — used for position info dialog display

## Preferences

### Primary Preference
- **name**: `analysisContextActions`
- **category**: `analysis`
- **type**: `multiple` (checkboxes)
- **possibleValues**: `[copyPgn, moveEval, lineEval, showTranspos, removeSuperfluous, showOnEmpty, reorderVariations, positionInfo]`
- **defaultValue**: `copyPgn,moveEval,removeSuperfluous,showOnEmpty,reorderVariations`

### Secondary Preference (Advanced)
- **name**: `analysisContextActionsCoverage`
- **category**: `analysis`
- **type**: `single` (radio)
- **possibleValues**: `[0, 1, 2, 3, 4, 5]`
- **defaultValue**: `0` (disabled)
- **advanced**: `true`

## Menu Items Added

### Copy Branch as PGN (`copyPgn`)
- Adds a menu item "Copy branch as PGN" to the analysis context menu.
- When clicked, exports the current branch path as PGN and copies it to clipboard via `lt.exportPgn`.
- **Modifier keys alter behavior** (Shift/Ctrl/Alt-click):
  - **Shift**: copy from position (FEN only) — suffix `_f`
  - **Ctrl**: separate lines — suffix `_s`
  - **Alt**: copy to current position — suffix `_t`
  - Combinations: `fs`, `ft`, `st`, `fst`
- The menu item text dynamically changes based on modifier keys held during context menu invocation (via `keydown keyup` listener on body).

### Engine Evaluation for Last Moves (`moveEval`)
- Adds a menu item "Evaluate terminating moves" to the analysis context menu.
- **Only available in writable studies** and when cloud eval is allowed.
- Requires custom engine depth to be set; otherwise shows an announcement warning.
- When clicked, starts batch evaluation of all branch terminating (last) moves:
  - Uses local custom engine analysis via `analysis.ceval`.
  - Traverses the tree to find un-evaluated nodes at branch ends.
  - For each node, asserts path set, user jumps to it, redraws board.
  - When engine reaches sufficient depth (≥ customEngineDepth), adds an evaluation comment to the node: `"eval: +X.X"` or `"eval: #N"` for mate.
  - Decimal count based on `cevalDecimals` preference (2 or 1).
  - Shows progress status in a liveStatus div: "Evaluation commenting started: X/Y".
- Can be toggled off by clicking the same menu item again.

### Engine Evaluation for Previous Moves (`lineEval`)
- Adds a menu item "Evaluate previous moves" to the analysis context menu.
- **Only available when cloud eval is allowed** (not restricted to writable studies).
- Requires custom engine depth; otherwise shows warning announcement.
- When clicked, starts batch evaluation of all previous moves along a selected path:
  - The path is taken from `analysis.contextMenuPath` at invocation time.
  - Traverses the tree to find un-evaluated nodes along that path.
  - Same evaluation comment mechanism as moveEval (adds `"eval:"` text).
- Can be toggled off by clicking again.

### Highlight All Transpositions (`showTranspos`)
- Adds a menu item "Highlight all transpositions" to the analysis context menu.
- When clicked, traverses the tree and identifies all positions that appear multiple times (transpositions).
- If `transpositionBehavior.excludeSameLine` is enabled, filters out transpositions within the same line (one came before the other in path order).
- Adds class `lichessTools-transpositionAll` to each transposition node's move list element.
- Clicking again toggles off the highlighting (removes the class).

### Remove Superfluous Entries (`removeSuperfluous`)
- Toggles the context menu class `lichessTools-removeSuperfluous`.
- When enabled: removes bubble speech icon glyphs and glyph-icon items from the context menu.
- If `copyPgn` is also enabled, additionally removes clipboard icon copy PGN item (to avoid redundancy).

### Show Context Menu When No Moves (`showOnEmpty`)
- Hack to show the context menu even when a node has no available moves.
- Adds class `lichessTools-showOnEmpty` to `div.tview2`.
- Sets attribute `p="*"` on `div.tview2` (Lichess checks this against empty, so adding something prevents it from being considered empty).
- Wraps `analysis.jump` function: if path is `"*"`, returns false (prevents the hack from actually jumping anywhere).
- When disabled: removes class and attribute.

### Reorder Variations (`reorderVariations`)
- Adds "Bump up" and "Bump down" menu items when right-clicking on a variation node in a study.
- **Only available in studies** (and writable studies for bumpUp).
- When there are multiple children (>1) at the parent node:
  - **Bump up**: promotes the selected variation to higher position in the child order. Promotes from index to index-1, then cascades down to all preceding indices. Also handles forceVariation flags (unsets on bumped path, sets on forceVariation paths).
  - **Bump down**: promotes a subsequent variation (index+1) upward, pushing the current one down. Promotes from index-2 through index and index+1.
- Both operations restore the original analysis path after completion via `analysis.userJump`.

### Position Info (`positionInfo`)
- Adds a menu item "Position info" to the analysis context menu.
- When clicked, shows a dialog with information about the selected position:
  - **Ply**: half-move number
  - **Moves so far**: full move count (ply/2)
  - **Following main moves**: count of mainline children recursively
  - **Following total moves**: count of all children recursively
  - **Following branches**: count of sideline branches recursively
- If `positionInfoCoverageDepth` preference is set (>0) and in a study with Explorer enabled: additionally shows tree coverage percentage computed via `computeTreeCoverage`.

## Tree Coverage Computation (`computeTreeCoverage`)

- Recursively computes how much of the position's possible moves are covered by the PGN tree vs. what Explorer shows.
- For each node at given depth:
  - Fetches Explorer cache for the node's FEN (may need to traverse/setPath if not cached).
  - Counts total games from Explorer moves matching the player's side and not already in PGN children.
  - For each PGN child, computes coverage ratio = games/total × childCoverage (recursive with depth-1).
  - Returns weighted coverage value (0.0 to 1.0).
- Restores original analysis path after computation.

## Live Status Display

When evaluation features are active (`moveEval` or `lineEval`):
- Creates a div `lichessTools-liveStatus analyse__controls` after the analysis controls section.
- Shows progress label: "Evaluation commenting started: X/Y" (remaining nodes / total nodes).

## Engine Level Check Interval

- Runs every **1000ms** via `checkEngineLevel`:
  - Checks if custom engine depth is set and ceval is running (not idle, not showing cloud).
  - If evaluation started and current node matches the analysed node: when engine reaches sufficient depth, adds eval comment and continues to next node.
  - Stops evaluation if ceval disabled/threatMode active or node changed.

## Ceval Wrapping

- When `moveEval` in study OR `lineEval` is enabled: wraps `analysis.ceval.available` function with `after` hook that returns `$this.analysable` when evaluation started (overrides the original availability check).
- On disable: unwraps `analysis.ceval.available`.

## Event Handling

- Listens to `lichessTools.redraw` pubsub → triggers `analysisContextMenu` (adds/removes menu items).
- Listens to `contextmenu` on `.tview2` → triggers `analysisContextMenu`.
- Listens to `keydown keyup` on body → triggers `alterModifierText` (changes copyPgn menu text based on modifiers).
- When disabled: clears all listeners and intervals, stops evaluations.

## Upgrade History

- `reorderVariations` added in version 2.4.5