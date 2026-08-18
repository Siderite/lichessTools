# TranspositionBehavior Tool — Context

## Overview

The **TranspositionBehaviorTool** is a configuration tool that sets global parameters defining how transpositions (identical chess positions appearing in different lines of a PGN) are treated by other LiChess Tools features. It does not implement any behavior itself; it merely provides a shared configuration object (`lt.transpositionBehavior`) consumed by other tools like randomVariation, extendedInteractiveLesson, highlight, movesFromTranspositions, transpositionArrows, etc.

## Dependencies

- None explicitly listed

## Preferences

| name | category | type | possibleValues | defaultValue | advanced |
|------|----------|------|----------------|--------------|----------|
| `transpositionBehavior` | study | multiple (checkboxes) | ['excludeSameLine', 'groupSameMove', 'consideredVariations'] | false (none selected) | yes |

## Global Configuration Object (`lt.transpositionBehavior`)

The tool sets this object in the main LiChessTools singleton during `async start()`:
- **`excludeSameLine`**: boolean — true if option selected, false otherwise
- **`consideredVariations`**: boolean — true if option selected, false otherwise
- **`groupSameMove`**: boolean — true if option selected, false otherwise

Other tools read these values via `lt.transpositionBehavior` to determine their behavior regarding transpositions.

## Parameter Definitions

### `excludeSameLine`

When true: two identical positions in the same PGN line (where one position came before another) are NOT considered transpositions of each other. This affects:
- **Highlight tool** — transposition highlights on board
- **movesFromTranspositions tool** — next moves from transpositions in move list

When false: any two identical positions regardless of line relationship are considered transpositions.

### `groupSameMove`

When true: when showing next possible moves at the bottom of the move list, if adding them from transposing positions, don't add duplicate identical moves (only one instance per move). This affects **movesFromTranspositions tool**. Note: this only applies on default fork control; in "Force choice" scenario all transpositions are shown anyway.

When false: identical moves may appear multiple times if they come from different transpositions/lines.

### `consideredVariations`

When true: when picking a next move to play (for random variation or extended interactive lessons), transposing positions are used as additional sources for available moves. This affects:
- **randomVariation tool** — Ctrl-right arrow picks random next move
- **extendedInteractiveLesson tool** — plays all variations with computer picking moves

When false: extension does not pick next moves using transpositions (only current position's direct moves).
