# FixSnabdom Tool

## Purpose

Fixes errors in Snabdom (Lichess's snabbdom-like DOM library) by wrapping `Node.prototype.insertBefore` and `Node.prototype.removeChild` with error-catching wrappers. When these operations fail, the error is logged to console instead of crashing.

## How It Works

### Error-Catching Wrappers

For each function (`insertBefore`, `removeChild`):
- Creates a new wrapper function that:
  - If `enableLichessTools` or `fixSnabdom` preference is false, calls original directly
  - Otherwise, tries the original call in a try/catch block
  - On error, logs args and element descriptions to console.warn instead of throwing

### Element Description Format

Error log includes: `${a.tagName} #${a.id} .${a.className}` for each argument element.

## Dependencies

None explicitly listed. Depends on `lt.currentOptions`.

## Preferences

- `fixSnabdom` — single type (false/true), default true, advanced/hidden

## Key Methods

- `makeFunctionSafe(parent, key)` — wraps a function with error catching
- `async init()` — makes insertBefore and removeChild safe
- `async start()` — logs preference value (no active behavior change)
