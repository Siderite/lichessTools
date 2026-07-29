# ChessOps Tool

## Purpose

Provides access to the ChessOps ES module bundle. ChessOps is a bundled JavaScript library (from LiChessToolsAdjacent project) that provides chess operations functionality for studies and analysis.

## How It Works

### Module Loading

When enabled:
- Creates `lt.chessops` as a Promise function that loads the bundle via comm getChromeUrl from `tools/chessops/chessops.bundle.mjs`
- Uses dynamic import to load the module
- Caches loaded result for subsequent calls

### Disabled Behavior

When disabled (`chessOps=false`): sets `lt.chessops = null`.

## Dependencies

None explicitly listed. Depends on `lt.comm.getChromeUrl`, dynamic import support.

## Preferences

- `chessOps` — single type (false/true), default true, advanced/hidden, category: study

## Key Methods

- `async start()` — creates or disables lt.chessops function
