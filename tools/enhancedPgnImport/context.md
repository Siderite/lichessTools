# Enhanced PGN Import Tool — Context

## Overview

The **EnhancedPgnImportTool** (preference name `enhancedImport`) enhances the PGN import functionality in analysis mode. It splits multiple PGNs from a single textarea input, merges them by FEN (grouping PGNs with same starting position), and handles errors gracefully. It also adds Escape key blur behavior on PGN textarea inputs.

## Dependencies

- `EmitRedraw` — dependency

## Preferences

- **name**: `enhancedImport`
- **category**: `analysis`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)

## Behavior

### PGN Splitting (`splitPgn`)

Splits a raw PGN input string into individual PGN items:
1. Regex pattern `regPgn`: matches either tag blocks `(tags)` or move sequences `(moves)` globally.
2. Trims input, returns empty array if no input.
3. Executes regex to find all tag/move boundaries in input.
4. Creates item list with type (1=tags-only, 2=moves) and index position.
5. Substrings between positions assigned as values to items.

### PGN Import Logic

For each split item:
- **Type 1 (tags only)**: imports via `importPgn(item.value, false)` — if not empty → pushes to pgns list; if empty with setup FEN (non-standard start) → pushes result; otherwise ignored/warned.
- **Type 2 (moves)**: combines with previous item if exists → imports combined; if empty → tries combining with previous PGN in list; if still empty → warns; if valid → pushes to pgns list.

### ImportPgn Wrapper

- Wraps native `analysis.changePgn` function:
  - Checks for Orientation="Black" or StartFlipped="1" tags → sets result orientation to "black".
  - Adds pgn text to result.

### Empty Check (`isEmpty`)

- Returns true if data has no treeParts OR only one empty-id treePart.

### Merge Logic (when `andReload=true`)

1. Groups PGNs by FEN via Map: counts per FEN.
2. Finds max-count FEN group.
3. If multiple FEN groups exist (>1): error "cannot merge PGNs with different starting positions" — filters to only max-count FEN group.
4. Iterates from last to first PGN:
   - For i>0: calls `$this.initialize(pgn, merge)`.
   - For i=0: calls `$this.reloadData(pgn, merge)` + jump('').
   - merge = andReload after first.
5. Counts successfulPGNs, tracks lastError.
6. Announcement via `lt.announce`: success count OR error with count.
7. Reloads explorer, triggers redraw via `lt.analysisRedraw()`.

### Non-Merge Logic (when `andReload=false`)

- Takes only first PGN from split list as data.

### WrapFunction on changePgn

When enabled:
- **Wraps** `analysis.changePgn` function:
  - `before`: returns false (blocks original execution).
  - `after`: performs enhanced import logic — splits input, merges if reload requested, returns processed data.
  - If error caught in after: fallback to native changePgn via `oldChangePgn(input, andReload)`.

### Blur on Escape (`setupBlurOnEscape`)

- PGN textarea (`div.pgn textarea`) AND pair input (`div.pair input`).
- When enabled: listens to `keyup` → if key == 'Escape' → blurs target element.

## Event Handling

When enabled:
- Listens to `lichessTools.redraw` pubsub → triggers `setupBlurOnEscape`.

## Cleanup on Disable

When preference is off:
- Off blur listener for Escape key.
- Unwraps `analysis.changePgn`.