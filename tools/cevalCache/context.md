# CevalCache Tool

## Purpose

Caches local computer evaluation (Stockfish) results in IndexedDB, so that when navigating to a position that was previously evaluated locally, the cached result is restored instead of waiting for cloud-eval or re-running Stockfish.

## How It Works

### Cache Storage Key

Key stored as `lichessTools/evalCache/[key]` in IndexedDB with raw JSON. Two related key formats are used:
- **Restore path** (`handlePly`): `activeEngineId|variantKey|positionFromFen`.
- **Store path** (`getCeval`): `storedPv|activeEngineId|variantKey|positionFromFen` (includes the current stored PV line).

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

### Clear Local Data Button

A delegated click handler on `body` watches for the analysis action menu's "clear local data" button (`.action-menu__tools` child with the Trash `data-icon`). When clicked, it clears the entire `evalCache` IndexedDB object store alongside Lichess's own local data.

## Dependencies

- EmitCeval

## Preferences

- `cevalCache` — single type (false/true), default false, advanced/true, category: analysis2

## Key Methods

- `handlePly(ply)` — restores cached eval on position navigation
- `handleCeval(args)` — stores new eval data in IndexedDB
- `clearCache()` — clears the `evalCache` IndexedDB object store
- `async start()` — sets up event bindings
