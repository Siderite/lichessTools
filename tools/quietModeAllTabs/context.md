# Quiet Mode All Tabs Tool

## Purpose

When a game is playing on any tab, silences all notifications/sound alerts on other tabs. Provides a toggle button in the site-buttons dasher area to enable/disable quiet mode manually.

## Functionality

- Advanced preference (`advanced: true`). Default enabled (`defaultValue: true`).
- **addQuietModeMenu()**: Adds/removes a menu item in `div.site-buttons div.dasher #dasher_app div.links`:
  - When enabled: creates `<a>` with class `lichessTools-quietMode`, BellOutline icon, click handler toggles `lichess.forcedQuietMode` (and resets `lichess.quietMode` if not forced)
  - Text shows "Disable quiet mode" or "Enable quiet mode" depending on current state
  - Title: "LiChess Tools - disable/enable quiet mode"
  - Toggles `lichessTools-forcedQuietMode` class based on forced state
  - When disabled: removes the element

- **start()**: If preference is enabled:
  - Generates a random tabId for this tab
  - Sets up setInterval (500ms) to addQuietModeMenu
  - If `lichess.quietMode` is not already a property, defines two new properties via Object.defineProperty:
    - `forcedQuietMode`: getter/setter backed by storage key `LichessTools.forcedQuietMode`
    - `quietMode`: getter returns true if forcedQuietMode, otherwise checks storage key `LichessTools.quietMode`; setter stores tabId (not false) to identify which tab activated it
  - On window beforeunload: if this tab's quietMode is active (storage value == tabId), resets it to false

## Preference

- **name**: `quietModeAllTabs`
- **category**: play
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true

## Dependencies

None.
