# TranspositionArrows Tool — Context

## Overview

The **TranspositionArrowsTool** shows variation arrows on the chess board for moves that come from transposing positions (identical positions appearing in different PGN lines). When enabled, it modifies Lichess's auto-shape generation to include next moves from all transpositions rather than just the current node's direct children.

## Dependencies

- **EmitRedraw** — Required for redraw events
- **RandomVariation** — Required (dependency listed)

## Preferences

| name | category | type | possibleValues | defaultValue | advanced |
|------|----------|------|----------------|--------------|----------|
| `transpositionArrows` | analysis2 | single (radio) | [false, true] | true | yes |

When enabled: variation arrows from transpositions are shown on board. When disabled: only standard arrows from current node children.

## Function Wrapping — AutoShapes Override

The tool wraps Lichess's `analysis.setAutoShapes` function via `wrapFunction`:

### Before Phase
- Stores original `analysis.node.children` into `this.childrenNodes`
- Replaces `analysis.node.children` with `lt.getNextMoves(analysis.node)` — which includes next moves from transposing positions (computed by the getNextMoves utility)

### After Phase
- Restores `analysis.node.children` back to `this.childrenNodes` (original values)

This temporarily expands the node's children set to include transposition-derived moves for auto-shape generation, then restores original state afterward. The auto-shapes (arrows drawn on board) are generated based on the expanded children during the before phase.

## Effect

When enabled: arrows on the board show not only direct next moves from the current node but also next moves from identical positions found elsewhere in the PGN (transpositions). This provides a more comprehensive view of available moves at the position.

When disabled: `analysis.setAutoShapes` is unwrapped — standard Lichess behavior, arrows only from current node's children.
