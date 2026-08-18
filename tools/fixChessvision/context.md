# FixChessvision Tool

## Purpose

Fixes Chessvision integration in Lichess studies. Chessvision is a third-party chess visualization tool that uses share buttons to get FEN data. This tool patches the share button's `dispatchEvent()` method to inject the current FEN into the input field, and disables other study buttons' dispatch events.

## How It Works

### Periodic Patching (200ms interval)

1. Checks if `#chessvision-videos-root` exists (Chessvision is present on page)
2. Patches `.study__buttons button.share`:
   - Overrides `dispatchEvent()` to set the FEN input value to current analysis node's FEN
   - If no FEN input element exists, creates a hidden one and finds it
3. Patches other study buttons (`.left-buttons > button:not(.share)`):
   - Overrides `dispatchEvent()` to be a no-op

### Patch Marking

Each patched element gets `__dispatchPatch = true` flag to avoid re-patching.

## Dependencies

None explicitly listed. Depends on `lichess.analysis.node.fen` and `lt.$`.

## Preferences

- `fixChessvision` — single type (false/true), default true, advanced/hidden, category: general

## Key Methods

- `async start()` — sets up periodic patching interval
