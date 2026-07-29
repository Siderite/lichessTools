# Opening Explorer Users Tool

## Purpose

Adds a "Me" button in the opening explorer title area to quickly switch the player view to your own username, or back to a previously viewed user.

## Functionality

- Requires logged-in user (`needsLogin: true`). Advanced preference (`advanced: true`).
- Depends on `EmitRedraw` tool ( listens to `lichessTools.redraw` event).
- Maintains a list of previous explorer player names in storage key `explorer.player.name.previous`.
- When the explorer redraws, checks if there are previous users stored. If none, removes the button; if exists, adds it.
- The "Me" button (`lichessTools-switchWithMe`) on click:
  - If current player is NOT your username → switches to your username
  - If current player IS your username → switches to the first previously viewed user
  - Calls `explorer.config.selectPlayer(user)` and `explorer.reload()`
- Button appears in `div.explorer-title`.

## Preference

- **name**: `openingExplorerUsers`
- **category**: analysis2 (Analysis - minor)
- **type**: multiple (checkboxes) — only value: `switchWithMe`
- **defaultValue**: false
- **advanced**: true
- **needsLogin**: true

## Dependencies

`EmitRedraw`
