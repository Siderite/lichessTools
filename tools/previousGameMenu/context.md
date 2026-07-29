# Previous Game Menu Tool

## Purpose

Adds a menu item in the TV/Broadcast dropdown that links to the last viewed game, allowing quick re-opening of previously watched broadcasts.

## Functionality

- Maintains a history of up to 10 previously viewed games stored in `prevGames` preference (each entry has `id` and `orientation`).
- When viewing a TV broadcast, automatically stores the current game ID and orientation into the history.
- Adds an `<a>` element with class `lichessTools-previousGame` inside the TV/Broadcast dropdown container (`#topnav section a[href="/tv"]+div[role="group"]`).
- The item displays "Last viewed game" text (translated) with title "LiChess Tools - Open last viewed TV game".
- Links to the most recently viewed game (the one before the current game if you're still on it, otherwise the last in history).
- On hover triggers `lichess.powertip?.manualGame()` to show a powertip with game details.

## Preference

- **name**: `previousGameMenu`
- **category**: TV
- **type**: single (on/off)
- **defaultValue**: true

## Dependencies

None.
