# Dialog Tool

## Purpose

Provides a custom dialog creation system (`lt.dialog`) that can create styled dialogs with drag, resize, header, and placement features. Used by other tools for confirmation prompts, info displays, etc.

## How It Works

### Two Modes

1. **Lichess Mode** (`useLT=false`): Uses `lt.uiApi.dialog.domDialog()` to get Lichess's native dialog wrapper, then adds `lichessTools-dialog` class
2. **LiChess Tools Mode** (`useLT=true`): Creates a custom `<dialog>` element with full styling

### Custom Dialog Features (useLT=true)

- **Close button**: Optional close button with X icon
- **Header**: Optional header text or DOM element, insertBefore scrollable area
- **Draggable header**: If `noDrag=false`, header supports pointer-down/move/up drag with shift tracking
- **Resizable**: If `resizable=true`, resize handle allows width/height adjustment via pointer events
- **Touch-scroll**: Toggles class based on touch device detection
- **Scrollable/not-scrollable wrapper** around content

### Placement Event

Debounced (50ms) emit of `lichessTools.setDialogPlacement` with:
- height, width of content
- left/right/bottom/top distances from window center

### Firefox Fix

Interval (100ms) on dialog toggle open event adjusts view height to scrollHeight if diff > 5px (fixes Firefox fit-content issue).

### Close Behavior

On dialog close event, removes dialog after 100ms delay.

## Dependencies

None explicitly listed. Depends on `lt.uiApi.dialog`, `lt.debounce`, `lichess.asset.loadCssPath`.

## Key Methods

- `async createDialog(options)` — creates dialog with all features
- `async init()` — binds `lt.dialog = this.createDialog.bind(this)`

### Options Parameters

- `useLT` — use LiChess Tools custom dialog vs Lichess native
- `parent` — parent element to append to
- `header` — header text or DOM element
- `noCloseButton` — omit close button
- `noDrag` — disable draggable header
- `resizable` — enable resize handle
- `class` — CSS classes for content div (split by . and space)
- `htmlText` — HTML text for content
- `noScrollable` — disable scroll wrapper
