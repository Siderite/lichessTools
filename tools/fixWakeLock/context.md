# FixWakeLock Tool

## Purpose

Fixes the navigator.wakeLock API behavior to prevent screen lock when the browser tab is hidden (inactive). Also provides a fallback release function when wakeLock request fails.

## How It Works

### Function Wrapping

Wraps `navigator.wakeLock.request`:
- **before**: Returns false if `document.hidden` is true (prevents wakeLock from being requested on inactive tabs)
- **after**: If the original result is null/falsy, returns a Promise resolving to an object with a no-op `release()` function

### Toggle Behavior

In start(): unwraps first. If preference value is true, re-wraps via the wrapping logic. If false, leaves it unwrapped (native behavior).

## Dependencies

None explicitly listed. Depends on `lt.global.navigator.wakeLock` and `lt.wrapFunction`.

## Preferences

- `fixWakeLock` — single type (false/true), default true, advanced/hidden

## Key Methods

- `async start()` — toggles wrap/unwrap based on preference value
