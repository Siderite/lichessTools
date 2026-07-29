# D3 Tool

## Purpose

Provides access to the d3 ES module bundle. D3 is a bundled JavaScript library (from LiChessToolsAdjacent project) that provides 3D visualization functionality for chess analysis and studies.

## How It Works

### Module Loading

When enabled:
- Creates `lt.d3` as a Promise function that loads the bundle via comm getChromeUrl from `tools/d3/d3.bundle.mjs`
- Uses dynamic import to load the module
- Caches loaded result for subsequent calls

### Disabled Behavior

When disabled (`d3=false`): sets `lt.d3 = null`.

## Dependencies

None explicitly listed. Depends on `lt.comm.getChromeUrl`, dynamic import support.

## Preferences

- `d3` — single type (false/true), default true, advanced/hidden, category: appearance

## Key Methods

- `async start()` → creates or disables lt.d3 function
