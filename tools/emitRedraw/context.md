# EmitRedraw Tool

## Purpose

Broadcasts `lichessTools.redraw` pubsub events whenever the chess board needs to be redrawn. This is a central notification mechanism that many tools depend on for reacting to board state changes.

## How It Works

### Core Mechanism

1. Defines `lt.emitRedraw` as a debounced function (10ms debounce) that dispatches `lichessTools.redraw` pubsub event
2. Also defines `lt.analysisRedraw` as a debounced wrapper of `analysis.redraw()` (100ms debounce)

### Function Wrapping

Wraps Lichess native redraw functions:
- `analysis.redraw` — after call, emits redraw
- `analysis.reloadData` — after call, emits redraw
- `gamebookPlay().redraw` — if exists, wraps similarly
- `study.relay.redraw` — if exists, wraps similarly

### Event Bindings

Listens to Lichess UI API events:
- `analysis.change` → emit redraw
- `ply` (move played) → emit redraw
- `chat.resize` → emit redraw

### DOM Observer

Also sets a 1000ms interval that checks if the main board's class attribute changed — if it did, emits redraw. This catches visual changes not reported by Lichess events.

## Dependencies

None explicitly listed. Depends on `lichess.analysis` and optionally `lt.uiApi`.

## Event Broadcasted

- `lichessTools.redraw` — no payload

## Key Methods

- `analysisStart()` — wraps all redraw functions in the analysis system
- `emitDirect()` — raw emit (skipped if document is hidden)
- `emit()` — debounced version of emitDirect
