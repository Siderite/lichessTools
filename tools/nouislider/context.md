# NoUiSlider Tool

## Purpose

Provides access to the noUiSlider ES module bundle. NoUiSlider is a bundled JavaScript library (from LiChessToolsAdjacent project) that provides 3D visualization functionality for chess analysis and studies.

## How It Works

### Module Loading

When enabled:
- Creates `lt.noUiSlider` as a Promise function that loads the bundle via comm getChromeUrl from `tools/noUiSlider/noUiSlider.bundle.mjs`
- Uses dynamic import to load the module
- Caches loaded result for subsequent calls

### Disabled Behavior

When disabled (`noUiSlider=false`): sets `lt.noUiSlider = null`.

## Dependencies

None explicitly listed. Depends on `lt.comm.getChromeUrl`, dynamic import support.

## Preferences

- `noUiSlider` — single type (false/true), default true, advanced/hidden, category: appearance

## Key Methods

- `async start()` → creates or disables lt.noUiSlider function
