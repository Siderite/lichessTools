# EmitEsmLoaded Tool

## Purpose

Broadcasts `lichessTools.esmLoaded` pubsub events whenever Lichess ES modules (ESM JavaScript modules) are loaded. This allows tools that depend on bundled ESM assets (like ChessOps, D3) to react when their dependencies become available.

## How It Works

### Function Wrapping

Wraps `lichess.asset.loadEsm()` function:
- After the original call, the module promise resolves → emits `lichessTools.esmLoaded` with the loaded module as payload

### First Events Buffer

During init(), before loadEsm is wrapped, any ESM loads are captured in `firstEvents` array. In start(), these buffered events are emitted after a 50ms delay.

## Dependencies

None explicitly listed. Depends on `lichess.asset.loadEsm` existing.

## Event Broadcasted

- `lichessTools.esmLoaded` — payload: loaded ES module object

## Key Methods

- `wrapEsmLoaded()` — wraps lichess.asset.loadEsm (called in init())
- `async start()` — emits buffered first events
