# Show FPS Tool

## Purpose

Displays a real-time FPS counter on the lichess.org page, measuring how many frames per second the browser renders.

## Preference

- **name**: `showFps`
- **category**: `general`
- **type**: `single` (boolean toggle)
- **possibleValues**: `[false, true]`
- **defaultValue**: false
- **advanced**: true (only visible in Advanced Preferences)

## Behavior

When enabled:
1. Creates a `<div class="lichessTools-showFps">` appended to `<body>`
2. Starts an `requestAnimationFrame` loop (`tick`) that counts frames and computes FPS every 1000ms
3. The div displays the rounded FPS value (updates only when FPS changes)

When disabled: removes any existing `lichessTools-showFps` element from DOM.

## Technical Details

- Uses `lt.global.requestAnimationFrame` for the tick loop
- Tracks `frames`, `last` timestamp, and current `fps` values
- FPS calculation: `(frames * 1000) / elapsed_time` between last measurement and now