# EmitCommentChange Tool

## Purpose

Broadcasts `lichessTools.commentChange` pubsub events whenever study comments are modified in the DOM.

## How It Works

### MutationObserver

Sets up a body-level MutationObserver targeting `.comment` elements:
- subtree: true
- childList: true
- characterData: true
- executeDirect: true

### Emit Logic

When any mutation record targets a comment element, emits `lichessTools.commentChange` with the list of target elements as payload.

## Dependencies

None explicitly listed. Depends on `lichess.analysis` existing.

## Event Broadcasted

- `lichessTools.commentChange` — payload: array of DOM comment elements that changed

## Key Methods

- `emit(data)` — pubsub emit
- `detectNew(records)` — MutationObserver callback
