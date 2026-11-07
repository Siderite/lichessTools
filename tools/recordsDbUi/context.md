# RecordsDbUi - the tree view and the floating window

Two harnesses drive this tool:
  test/recordsDbHarvest.check.js  - the tree model, the store, the harvest
  test/recordsDbUiWindow.check.js - the shell, the gestures, the repaints
Run both after any change; the last line of each report prints
`passed: n   failed: n`. Both model cash's `on`/`off` on their own node
stub, so the listener shape below is exercised, not only read.

## The listener shape

One handler per event family lives on the tree host (`viewHost`), which
the frame keeps for a window's life - twelve registrations per window.
It answers through `content.rowIndex`, a WeakMap the paint fills: the row
node maps to `{row, entry, folder, dead, node, preview, cold}`, the caret
and the open chip copy that entry with a `chip` marker, and the tree-end
marker and the error retry button enter as index entries of their own.
Rows, chips and the tooltip's chapter links carry no listener. The
tooltip itself keeps four (click, mouseover, mousemove, mouseout) on the
one element that is created the first time a tooltip is needed.

Why it is shaped this way: a repaint replaces every row, and per-row
listeners leave their entries behind in any page-wide listener table
(the intercept tool's `eventHandlers`, cash's `_handlers`), and each
entry pins the element it sat on. The measured cost was about eleven
registrations per row per repaint, so a 500-row tree added ~5,520
entries every repaint and reached V8's spread-argument limit in about
24 repaints - and scrolling supplies the repaints, because a `mouseover`
on a cold row spends a hover read, which harvests, which publishes,
which repaints.

That limit is what threw. `LiChessTools.arrayRemoveAll` rebuilds with
`arr.push(...kept)`, and past ~130k kept entries the spread overflows the
stack. The crash path was harvest -> hoverRead -> a cash `remove()`/`off`
-> the wrapped `removeEventListener` -> the intercept tool's `before`
handler -> that spread. It is a call-argument cliff, not recursion: the
same body survives 64k and 120k entries and throws at 150k. Only the
handlers that sit on rows were ever in that array, which is why the
crash needs a big tree, not a long session.

After the change the host holds twelve registrations per window life and
the tooltip four per popup element; a repaint over a thousand rows
registers nothing on them. The tree-end marker, the retry button and the
tooltip links grew that array before and now grow nothing.

## Growth that remains

- The racks and chips keep ~9 `click` listeners per repaint. They are the
  elements cash's `remove()` prunes, so that array stays flat.
- Select mode hangs a `change` listener on every checkbox
  (`check.on('change')` in `rowOf`). It is the only per-row registration
  left. Delegating it needs `change` to bubble from the input, so it
  waits; browse mode - the mode the scroll crash happened in - is clean.
- The restore picker's `change` grows the array once per restore press.

## Gesture notes the harnesses encode

- `fireEvent` walks ancestors and rewrites `currentTarget` per hop, so a hit
  reaches the host handler with the hit element as `ev.target`. Handlers
  that used `currentTarget` (the drop rect, the drop marker, the tooltip
  anchor) now take the row node from the index instead, which is what
  kept the drop halves and the tooltip anchor where they were.
- `rowTarget` climbs: hit node, then the nearest `button`, then the
  nearest `li`. The button rung is what makes the caret work at all -
  the caret appends an `<svg>`, so a browser press always lands on the
  icon and the chip's own listener no longer exists to catch it. A
  missing rung is the silent kind: the click reads as a row click, the
  `closest('button')` guard hands it over, and the folder just does not
  move. The window harness now drives the caret as a gesture twice, on
  the button and on its icon child.
- Every gesture is its own event object. The drag handlers stop
  propagation, so reusing the dragover object for `dragleave` skips the
  host handler; the leave test now builds its own event.
- `kept` in the window harness gained `rowIndex`, `rowTarget`,
  `insertionTarget`, `carriedPayload`. A new check asserts rows carry no
  listeners, and the host count moved 3 -> 12.

## Drag across pages (tier C, one row per page)

The drag machine is not page-bound: `dragstart` posts only the moved
subtree (paths in this tree), and a page that receives it places it
before the row under the pointer, inside the folder under the pointer
(lower half), or at the root - all of which address nodes, not paints, so
`insertionTarget` works on any page. The drop marker is a paint node, so
carry it as `{parentEntry, beforeEntry, position}` and let a receiving
window re-aim it through its own `rowIndex`. Cross-page needs one extra
`dragstart` listener on the study side: the tree host's handler answers a
drag of another page's row, and a leaf's open chip is that page's own
jump target, so nothing extra is needed when no tree is open.

## Open question to answer before tier C ships

Whether a study page opened from a bookmarks tab keeps that tab open,
because a closed tab leaves one window per page and `saveWindows`
dedupes by tab id. `fitWindow` has no `else` branch today, so giving an
unclosed tab a second window takes a decision about which window holds
the tree.

## Reading the harnesses

A MISS is usually a needle the change moved, not a broken tool. The
window harness pins source strings through the `kept` list, so moving a
handler out of `rowOf` needs the needle moved with it - that is how
`content.hoverRead(entry)` became `this.hoverRead(info.entry)`. The
harvest harness pins `bookmarkView(content, host, box)` and the store
needles; both stayed put.

## Shape counts

tool.js 2,813 lines - the delegation and the caret climb add about 70
lines over the previous shape, so this work is a correctness and repaint
cost fix, not a shrink. The window harness 1,770 lines; the harvest
harness 549; tool.css 537. Neither harness reports a missing intl key.