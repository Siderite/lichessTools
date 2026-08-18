# FixChessgroundResize Tool

## Purpose

Detects and reports chessboard resize events when the board size or position changes. Lichess's Chessground may not always report resize events properly; this tool monitors the board element directly via ResizeObserver and MutationObserver.

## How It Works

### Monitoring Setup

1. **ResizeObserver**: Observes the `.main-board cg-board` element for width/height changes
2. **MutationObserver**: Observes all parent elements of the board for `style` and `class` attribute changes

### Event Detection

When size or position changes are detected:
- Updates CSS custom property `--board-size` on `<html>`
- Toggles body class `lichessTools-hasBoardSize`
- Triggers a `resize` event on `.main-board cg-container` if a previous value existed (indicating an actual change)

### Periodic Check

A 500ms interval checks whether the board element has changed (e.g., after page reload), and re-establishes monitoring observers.

## Dependencies

None explicitly listed. Depends on `lt.debounce`, `lt.$`.

## Preferences

- `fixChessgroundResize` — single type (false/true), default true, advanced/hidden

## Key Methods

- `monitorElement(element, callback)` — sets up ResizeObserver + MutationObserver for an element and its parents
- `fireResizeDirect(ev)` — detects changes and triggers resize event
- `fireResize()` — debounced version of fireResizeDirect
- `checkBoardPosition()` — periodic check to re-establish monitoring

## Event Triggered

- `resize` event on `.main-board cg-container` DOM element
