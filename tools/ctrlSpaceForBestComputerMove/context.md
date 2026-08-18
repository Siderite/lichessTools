# CtrlSpaceForBestComputerMove Tool

## Purpose

Maps keyboard shortcuts: Space plays gamebook move (for gamebook play mode), Ctrl+Space plays best computer move (original space handler). When disabled=false, restores original behavior where Space = best computer move.

## How It Works

### Handler Swap

- Captures oldSpaceHandler via `lt.getKeyHandler('space')`
- Unbinds both 'space' and 'ctrl+space' handlers
- If enabled: binds 'ctrl+space' to oldSpaceHandler (best computer move), binds 'space' to spaceForGamebookPlay (gamebook play)
- If disabled: binds 'space' to oldSpaceHandler directly

### Gamebook Play Space Handler

`spaceForGamebookPlay()`:
- Gets gamebook via `ctrl.gamebookPlay()`
- If exists → calls `gb.onSpace()` for gamebook move execution

## Dependencies

None explicitly listed. Depends on `lt.getKeyHandler`, `lichess.analysis`.

## Preferences

- `spaceDisabled` — single type (false/true), default true, advanced/true, category: analysis2

## Key Methods

- `async start()` → unbinds/rebinds space and ctrl+space handlers
- `spaceForGamebookPlay()` → executes gamebook play onSpace event
