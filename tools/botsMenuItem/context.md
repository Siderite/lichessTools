# Bots Menu Item Tool — Context

## Overview

The **BotsMenuItemTool** adds a "Online bots" menu item to the Lichess top navigation. It provides a quick link to the bot list page (`/player/bots`) where users can play against computer bots.

## Preferences

- **name**: `botsMenuItem`
- **category**: `play`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)

## Behavior

### Menu Item Creation

When enabled:
- Creates an `<a>` element in the topnav menu group container (`#topnav section a[href="/"]+div[role="group"]`):
  - Class: `lichessTools-botsMenuItem`
  - Text: "Online bots"
  - Title: "Lichess Tools - play against bots"
  - href: `/player/bots`
- Appended to the container.

### Cleanup on Disable

When preference is off:
- Removes all `.lichessTools-botsMenuItem` elements from the topnav container.