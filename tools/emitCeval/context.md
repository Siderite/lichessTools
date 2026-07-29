# EmitCeval Tool

## Purpose

Broadcasts `lichessTools.ceval` pubsub events whenever cloud evaluation data is received or updated. This allows other tools (like ExtraChart, ExplorerEval, MoveAssistant) to react to new evaluation data without polling.

## How It Works

### Two Modes

1. **Lichess Event Mode** (default): Wraps `lt.uiApi.events.on('analysis.eval')` handler to emit `lichessTools.ceval` with `[data, meta]` whenever Lichess fires an analysis eval event.

2. **Engine Worker Mode**: If not using the Lichess event, wraps:
   - `ceval.engines.makeEngine` — after creating a new engine worker, wraps that worker's `emit()` function to broadcast `lichessTools.ceval`
   - `ceval.worker` — directly wraps the existing worker's emit

## Dependencies

None explicitly listed. Depends on `lichess.analysis.ceval` existing.

## Event Broadcasted

- `lichessTools.ceval` — payload: `[evaluation data, metadata]`

## Key Methods

- `wrapWorker(worker)` — wraps a Stockfish worker's `start()` and `emit()` functions
- `wrapLichessEvent(data,meta)` — emits pubsub event from Lichess UI API eval event handler
