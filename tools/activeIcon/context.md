# Active Icon Tool — Context

## Overview

The **ActiveIconTool** changes the browser tab favicon (title icon) dynamically based on whether the user is actively playing a chess game and which color they are playing.

## Preferences

- **name**: `activeIcon`
- **category**: `appearance`
- **type**: `single` (radio button)
- **possibleValues**: `[false, 'pawn', 'knight', 'king', 'circle']`
- **defaultValue**: `false` (disabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

When the preference value is set to one of the icon types (`pawn`, `knight`, `king`, or `circle`):

1. The tool creates a new `<link rel="icon" source="lichessTools">` element in the HTML `<head>`.
2. It moves any existing native Lichess favicon link from `rel=icon` to `rel=xicon`.
3. The favicon is updated dynamically:
   - **When playing**: Shows an icon representing the user's color (white or black). The icon type depends on the preference value:
     - `pawn`: uses lichess asset cursor files (`cursors/white-pawn.cur` or `cursors/black-pawn.cur`)
     - `knight`: uses lichess asset cursor files (`cursors/white-knight.cur` or `cursors/black-knight.cur`)
     - `king`: uses lichess asset cursor files (`cursors/white-king.cur` or `cursors/black-king.cur`)
     - `circle`: uses lichess flair sources (`symbols.white-circle` or `symbols.black-circle`)
   - **When not playing**: Shows the generic Lichess activity icon (`activity.lichess`).
4. The favicon is determined by:
   - Checking if a main board exists (`div.main-board`). If no board, defaults to white/not-playing.
   - Determining color from FEN string (presence of ` b\b` indicates black).
   - Determining playing status from the absence of result/status elements in `.result-wrap`, `.study__player`, or `.game__meta`.

## Update Mechanism

- The favicon is updated via a **debounced** function (`setIconDirect` debounced by 300ms called `setIcon`).
- An interval runs every **1000ms** calling `setIcon`.
- Additionally, the tool listens to the `lichessTools.uiApi.events.ply` event: when a ply (half-move) occurs, it calls `setIcon` with the parity of the ply (odd = black, even = white) and playing=true.

## Cleanup on Disable

When the preference is turned off (`false`):
- The interval is cleared.
- The `ply` event listener is removed.
- The `<link rel="icon" source="lichessTools">` element is removed from head.
- The `rel=xicon` link is restored to `rel=icon`.

## Internationalization (intl)

Translations provided for en-US and ro-RO:
- "Active title icon", "Pawn", "Knight", "King", "Circle" labels.