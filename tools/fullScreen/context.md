# FullScreen Tool — Context Summary

## Purpose

The **FullScreenTool** adds a full-screen button to lichess's site-buttons area and detects/flags fullscreen state via header class toggle. It enables easy access to browser fullscreen mode.

## Preferences

- **name**: `fullScreen`
- **category**: `general`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `false`
- **advanced**: true

When set to `true`, adds button and resize handler. When `false`, removes everything.

## How It Works

### Full Screen Detection (`handleResize`)
Checks fullscreen state: `lt.global.screen.height == lt.global.innerHeight && !lt.isTouchDevice()`. Toggles `header#top` class `lichessTools-fullScreen` accordingly. Listens to `resize` event on global document.

### Button Addition (`addButton`)
Creates `div.lichessTools-fullScreen` in `.site-buttons` before dasher element: button link with span containing SquareFourCorners icon, title "LiChess Tools - full screen". Click → `lt.global.document.documentElement.requestFullscreen()`. Prevents default on click event.

### Initialization (`start()`)
Reads preference value from `lt.currentOptions`. Removes existing lt elements (div, header class). Unbinds resize handler. Removes body class `lichessTools-fullScreen-enabled`. If !value or lt.isMobile(): returns. Otherwise: adds body class, binds resize event + handleResize, calls addButton.