# EmitContentLoaded Tool

## Purpose

Broadcasts `lichessTools.contentLoaded` pubsub events whenever new DOM content appears on the page. Uses a MutationObserver to detect newly added elements that match specific selectors.

## How It Works

### MutationObserver

Sets up a body-level MutationObserver with:
- subtree: true
- childList: true
- characterData: true
- executeDirect: true (fires immediately, not debounced)

### Target Selectors

Monitors these Lichess DOM elements for new appearance:
- `#powerTip` (tooltip)
- `.infinite-scroll` (pagination)
- `.paginated` (paginated rows)
- `.dropdown` (dropdown menus)
- `.notifications` (notification areas)
- `#notify-toggle > span`
- `.challenge-page`
- `.upt__info`
- `.game__meta`
- `.timeline`
- `.lobby__tv`
- `.announce`
- `.simul-list__content`
- `.angle-content`

### Emit Logic

When a mutation record matches any selector (either on the target node or in addedNodes), emits `lichessTools.contentLoaded` with the element as payload. Also emits for each newly added matching child node.

## Dependencies

None explicitly listed.

## Event Broadcasted

- `lichessTools.contentLoaded` — payload: DOM element that triggered detection

## Key Methods

- `emitDirect(el)` — raw emit (skipped if document hidden)
- `emit()` — debounced version (250ms debounce)
- `detectNew(records)` — MutationObserver callback
