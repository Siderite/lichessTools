# FixAbortController Tool

## Purpose

Fixes a bug in AbortController where calling `abort()` on an already-aborted signal returns false instead of being a no-op. This prevents errors in fetch operations that check abort status.

## How It Works

### Function Wrapping

Wraps `AbortController.prototype.abort`:
- **before**: If `$this.signal.aborted` is already true, returns false (preventing the error)
- **ignoreErrors**: true — catches any errors from the original call

### Toggle Behavior

In start(): unwraps the function first. If preference value is true, re-wraps via init(). If false, leaves it unwrapped.

## Dependencies

None explicitly listed. Depends on `lt.global.AbortController` and `lt.wrapFunction`.

## Preferences

- `fixAbortController` — single type (false/true), default true, advanced/hidden

## Key Methods

- `async init()` — wraps AbortController.prototype.abort
- `async start()` — toggles wrap/unwrap based on preference value
