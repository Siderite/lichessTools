# CevalCache Tool

## Purpose

Caches local computer evaluation (Stockfish) results in IndexedDB, so that when navigating to a position that was previously evaluated locally, the cached result is restored instead of waiting for cloud-eval or re-running Stockfish.

## How It Works

### Cache Storage Key

Key format: `activeEngineId|variantKey|positionFromFen` → stored as `lichessTools/evalCache/[key]` in IndexedDB with raw JSON.

### On Ply Event (Navigation)

When user navigates to a new position (`lt.uiApi.events.on('ply')`):
- Checks if cached value exists for current key
- If cache depth >= node.ceval depth, restores cached data into `node.ceval`:
  - Adds time, cp, mate, pvs from cache
  - Triggers analysisRedraw()

### On Ceval Event (Evaluation Received)

When cloud eval or local eval receives new data (`lichessTools.ceval`):
- Only stores if depth > 20 AND depth > existing cached depth
- Stores `{ time: Date.now(), ...data }` in IndexedDB
- If QuotaExceededError, removes entries older than 30 days

## Dependencies

- EmitCeval

## Preferences

- `cevalCache` — single type (false/true), default false, advanced/true, category: analysis2

## Key Methods

- `handlePly(ply)` — restores cached eval on position navigation
- `handleCeval(args)` — stores new eval data in IndexedDB
- `async start()` — sets up event bindings
