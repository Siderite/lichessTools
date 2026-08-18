# FixMoveListLoad Tool

## Purpose

Fixes the move list (tree view) not being visible when the page is initially hidden/display:none. Ensures the tree view (`tview2`) is marked as redrawn so it appears properly.

## How It Works

### Function Wrapping

Wraps `analysis.redraw`:
- After the original call, calls `showTree()` which toggles `.analyse__tools .tview2` class `redrawn` to true

### Initial Check

In start(), checks if body CSS display is 'none' (page hidden) and logs this value. Calls showTree() immediately.

## Dependencies

None explicitly listed. Depends on `lt.wrapFunction`, `lichess.analysis`.

## Preferences

- `fixMoveListLoad` — single type (true only), default true, advanced/hidden

## Key Methods

- `showTree()` — toggles tview2 redrawn class
- `async start()` — wraps analysis.redraw and shows tree
