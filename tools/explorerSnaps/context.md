# Explorer Snaps Tool — Context Summary

## Overview

The **ExplorerSnapsTool** allows users to create and manage "snapshots" of Lichess chess explorer settings (time control, rating range, date since/until). These snaps can be saved in localStorage and quickly recalled. The tool also enables cycling through snaps by clicking the explorer title, and provides special Ctrl-click behavior on player/db buttons.

## Dependencies

- **EmitRedraw** — Needed for redraw events
- **DetectThirdParties** — Needed (dependency listed but not directly used in code)
- **InterceptEventHandlers** — Needed for event handler interception/removal

## Preferences

| Preference | Type | Category | Description |
|------------|------|----------|-------------|
| `explorerSnaps` | single (true/false) | analysis | Enable/disable this tool. Default: true, advanced preference |

## Functionality

### Snap Creation
A "snap" is an object with:
- **text**: a title/name for the snap (user-provided via dialog prompt)
- **settings**: current explorer config settings (timeControl, avgRating, since, until)

When clicking the "Snap!" button in the explorer config section:
1. Gets current settings via `getSettings()`
2. Checks if an identical snap already exists (`getSnapBySettings`) — if yes, highlights it and returns
3. If no existing snap, prompts user for a title via dialog
4. If a snap with that text already exists, asks confirmation to overwrite; if confirmed, removes the old one
5. Creates new snap and pushes to `options.snaps` array

### Snap Recall
Each saved snap appears as a button in the explorer config section. Clicking a "shot" button (`data-act="shot"`):
- Sets the explorer config to that snap's settings via `setSnap()` (speed, rating, since, until)
- Reloads the explorer
- Refreshes UI via `showSnapsDirect()`

### Snap Cycling
Clicking the `.explorer-title span.lichess` element cycles through snaps:
- Gets current settings, finds matching snap index
- Advances to next snap (index + 1 % length)
- Sets that snap's settings
- Fetches explorer if config is not open

### Special Button Handlers
The tool intercepts and replaces native click handlers on explorer buttons:

**Player button (`explorer-title button.player`)**:
- Normal click: executes original handler, then resets controls to current speed
- Ctrl-click: saves current speed as `_prevControls`, sets all time controls (`['ultraBullet', 'bullet', 'blitz', 'rapid', 'classical', 'correspondence']`)

**Lichess DB button (`explorer-title button.button-link`)** (second button):
- Normal click: executes original handler, then resets to `_prevControls` if saved
- Ctrl-click behavior handled via player button's `_prevControls`

### UI Elements

In the explorer config section (`section.explorer-box div.config >div:has(section.date)`):
- **Snap! button**: Green button (`data-act="snap"`), creates new snap
- **Shot buttons**: Each saved snap has a button (`data-act="shot"` with `data-act-title` = snap text) and a remove button (X icon)

### Title Modification
The `.explorer-title span.lichess` element:
- Text is replaced with snap text if current settings match a snap, otherwise original text preserved
- Title attribute shows formatted snap info: Rating range, Time controls, Since date, Until date

### Snap Title Formatting
`getTitle()` generates a formatted title string for each snap:
- **Rating**: Compressed from reference list [400, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500] — shows "all" if full range, or ranges like "1400-1600" or "1400+"
- **Time Controls**: Compressed from reference list ['ultraBullet', 'bullet', 'blitz', 'rapid', 'classical', 'correspondence'] — same format logic
- **Since/Until**: Date strings formatted as "Month Year"

### Highlight
When a snap is found matching current settings, it gets `lichessTools-highlight` class for 1000ms.

## Storage

Snaps are stored in localStorage via key `'LiChessTools.explorerSnaps'`. Saved via `saveSnaps()` which triggers redraw event.

## Function Wrapping

The tool wraps three Lichess explorer functions with id `'explorerSnaps'`:
- `explorer.config.toggleOpen` — after function calls `showSnaps()` when config is open
- `explorer.enabled` — after function calls `showSnaps()` when enabled value is true
- `explorer.fetch` — after function calls `showSnaps()`

## Key Conditions

- Requires logged-in user (`lt.getUserId()`) — disabled if not logged in
- UI section only appears when explorer config is open and db type is 'lichess'