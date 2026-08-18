# InterceptEventHandlers Tool

## Purpose

Intercepts all `addEventListener` and `removeEventListener` calls on EventTarget objects, maintaining a registry of all event handlers attached to DOM elements. This allows other tools to query and remove specific handlers later.

## How It Works

### Function Wrapping (in init())

Wraps both `EventTarget.prototype.addEventListener` and `EventTarget.prototype.removeEventListener`:
- **addEventListener**: Before the original call, records `{ target, type, listener, useCapture }` into `eventHandlers` array
- **removeEventListener**: Before the original call, removes matching entry from `eventHandlers` array

### Registry Access

Exposes two functions on `lt`:
- `lt.removeEventHandlers(target, type)` — removes all handlers for a target+type pair, returns list of listener functions
- `lt.getEventHandlers(target, type)` — returns list of listener functions for a target+type pair

## Dependencies

None explicitly listed. Depends on `lt.wrapFunction` existing.

## Event Handlers Registry

`eventHandlers` array stores: `{ target, type, listener, useCapture }` entries for every event attachment/removal.

## Key Methods

- `removeEventHandlers(target, type)` — bulk removal of handlers
- `getEventHandlers(target, type)` — query handlers
- `async init()` — wraps EventTarget prototype methods
