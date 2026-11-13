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

## The unified item tree

The tree no longer draws a line between folders and items: every node is an item, and any
item may be a parent of any other. Folders keep their empty `kind` marker and a `name`;
leaves carry `{kind,id,label,meta?}`. `sortTree` sorts folders first and leaves by label
inside every node, so a study holding its chapters and study positions reads like a folder
holding the same.

The row caret follows that rule: any node with a `children` array (a folder or a leaf-parent)
wears a `button.bookmark-toggle` with the same triangle icon. Folders and leaf-parents
answer that caret with opposite defaults: a folder starts closed and its caret opens it
(`expanded` set), a leaf-parent starts open so a filed study shows its filed chapters without
a click and its caret hides them (`collapsed` set). `parentNodes()` walks both kinds; the
fold-all chip and `toggleAllExpanded()` use it. The row's `data-expanded` attr carries the
**visual** state - true when the subtree is showing, false when hidden - so the caret's
rotate-the-triangle CSS does not need to know the kind. `shapeChains`/`frozenView` persist
both `expanded` and `collapsed` chain lists into the window blob, and `restoreView` splits
the read-back by kind so a leaf-parent stays open or closed the way the user left it.

Rename rides any single selected item. `editName` writes `name` on a folder and `label` on
a leaf; `leafLabel` lets an explicit `label` outrank the mirror record's own name so a
user rename shows. A leaf rename on a study keeps the study's lichess id untouched - only
the row's title changes.

`canAttach` returns true for any pair. `canDrop` still refuses a branch inside itself so a
move never eats a subtree. `mergeTrees` re-hangs by `meta.parentId`, with `meta.studyId`
and `meta.blogId` still honoured so a harvest's chapter or blogPost keeps finding its
parent across pages. `splitBranches` keeps a leaf of another branch as a bare path marker
when it leads to something in this branch, so a position under a study splits to the
position branch and merges back into the study.

A study position is a new kind: `{kind:'studyPosition', id: chapterId+'|'+nodePath, meta:
{studyId, chapterId, nodePath}}`. It rides the study branch (no blob of its own). Opening it
loads the chapter, then resolves `nodePath` to a node with `lt.lichess.analysis.tree.nodeAtPath`
and walks the analysis across with `lt.lichess.analysis.userJump(node.path)`; a path the tree
does not know (chapter rewritten since the harvest) leaves the chapter open at its root.

There are two position kinds. A **FEN position** is the direct lichess URL for a FEN:
`{kind:'position', id: fen, meta: {variant}}` and its row opens `/analysis/{variant}/{fen}` with
spaces replaced by underscores. A **study position** is a node inside a study chapter and takes
the chapter + node jump path above.

The Add button grew a caret dropdown (`btn-add-caret`). It cycles `addChoice` through the
kinds the current page can name - study, chapter, FEN position, study position - and Add
files the current choice. The caret only paints when the page names more than one kind, so
a bare analysis page still gets a bare Add button.

The window is anchored to body rather than the viewport: `position: absolute` in the tool
css, and a matching `html:has(body.lichessTools > dialog.lichessTools-recordsDbUi) { overflow:
auto }` override so the page keeps its scroll while this window is open. Other tools that
open a dialog keep the factory's `overflow: hidden` default and their fixed-position box.

Two notes on the Add flow after the fact. A leaf parent starts without a `children` array,
so `(parent?.children ?? this.entries)` reads the root rather than the leaf; addLeaf and
drop now open `parent.children = []` before the first push so study-under-study nests
where it should. A leaf that is already the current page item refuses to nest inside itself
via `recordsDbAddSelfParent`.

The file shape grew with the leaf parent, so it is now `formatVersion: 3`: a node is a folder
only while it names no kind, and a leaf may carry a `children` array. `normalizeEntries` used to
test the children array first, which wrote a filed study holding filed chapters as a nameless
folder and lost that study from the restore; a v2 reader still misreads a leaf that has children,
which is what the bump says. A childless kind-less node in a branch blob is still a v1 row that
takes the branch's kind.

A chapter row prints its own name: `resolvePageLeaves` fills the label from the study record's
`chapters` when the chapter only came from the URL, and `leafLabel` reads the chapter's entry off
the record it inherits. Chapter leaves ride on their study's record (that is what stamps them
gone), so an empty label used to print the study name and paint a study inside the study.



The Add caret is now a real split dropdown, not a cycle: `btn-add` says "Add", `btn-add-caret`
says "▾" and pressing it toggles the menu open. The pair lives inside a `div.add-caret-wrap`
that is `position: relative`, so the menu can hang from the caret. While the menu is open, the
wrapper grows a `div.btn-add-menu-box` pinned to the caret with `position: absolute; top: 100%;
left: 50%; transform: translateX(-50%)` and a small `::before` pointer; inside it, one
`button.btn-add-menu` per kind the page names (Study, Chapter, Position, Study position) stacks
as a vertical flex column. Closing the menu takes the box off the page, not just the chips.
Clicking a chip sets `addChoice` and files that kind, then closes the menu. Pressing the caret
with the menu already open closes it. `resolvePageLeaves` reads the chapter from
`analysis.study.currentChapter()` (not `analysis.currentChapter()` - the pattern every other
tool in the project uses), so a bare analysis page names all four kinds and the caret has
real options to offer.

`insertionTarget` treats a row's lower half the same for folders and leaves: it returns
`position: 'inside'` in both cases, so a drag hands the payload to any item as a parent,
not only to a folder. `canDrop` now refuses cycles for `payload.nodes` as well as for
`payload.paths`, so dragging a branch (folder or leaf) onto one of its own descendants
leaves the tree untouched.

## Growth that remains

- The racks and chips keep ~9 `click` listeners per repaint. They are the
  elements cash's `remove()` prunes, so that array stays flat.
- Select mode hangs a `change` listener on every checkbox
  (`check.on('change')` in `rowOf`). It is the only per-row registration
  left. Delegating it needs `change` to bubble from the input, so it
  waits; browse mode - the mode the scroll crash happened in - is clean.
- The restore picker's `change` grows the array once per restore press.

## The resize moved to the dialog tool

The five edge strips, the gesture gate, the pointer capture and the box apply are the dialog
factory's (`tools/dialog/tool.js`: `DialogResize`), not this tool's - every resizable dialog gets the
same machine and the same signals: the `resizing` class while a grab moves, the debounced
`lichessTools.setDialogPlacement` emit on release, and the click the browser fires under the strip
when a press ends. What stays here is the window's own policy, handed over as `resizable: {begin,
resize}`: `begin` lifts the window forward so its strips stay hit-testable, and `resize(proposed,
edge, dx, dy, base)` runs `moveWindow`/`fitWindow` against the viewport and stores the size on the
blob before the machine puts it on the page. Escape is not the machine's: `escapeKey` closes the
window, and `noEscClose` is what keeps the browser's own Escape close from doing it first.

## Where the window is remembered

The blob keeps the box the user left twice: as absolute numbers, and as the screen corner it was
nearest to with the two gaps to that corner (`anchorBox` writes it at `freeze`, `rememberedBox` reads
it at `load`). A page whose viewport has since changed size puts the window back the same distance
from the corner the user had put it against, so a window parked against a corner survives a screen
change instead of sliding to coordinates of a screen that is no longer there. A remembered box that
no longer fits is clamped back in by `fitWindow`, which resizes and repositions it; a page too small
to hold the window at its own minimum at all (`windowCanHold`) drops the row and the page's own
placement answers. A row an older version wrote carries no anchor and is taken where it was written.

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
- A double click is read from its two presses, not only from `dblclick`.
  The first press repaints the row, and a browser keys its double click
  on the element under the pointer, so a row handed over mid-gesture
  fires nothing at all. `rowClick` records each press
  and, within `pressWindowMs` (500ms, the browser's own window), runs
  `openGesture` on the press that closes the pair and leaves no press
  behind, so a third press starts fresh. The native `dblclick` handler
  stays for rows that never repaint, and `openedPress` keeps the gesture
  from running twice inside the window. Outside the window a press is
  ordinary: `select` clears and re-adds, so the row simply stays
  selected and nothing opens.
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

tool.js 2,809 lines (2,838 before the pass that wrote the six tree walks and the eight rack
button heads once, with no harness line moved) - the resize machine left for `tools/dialog/tool.js`
while the delegation,
the caret climb and the double-click pair grew it; a drag now moves the window without touching its
size, `moveWindow` takes the content floor the machine measured, the remembered box carries the
screen corner it was nearest to, and the window's box is written the factory's way (a centre and a
size with `left`/`top`, the opposite edges at `unset`, the page min/max at their initial values) so a
tool that re-applies a placement onto the dialog can take either edge without the box going over
constrained. The window harness 2,024 lines (it evaluates the dialog factory, so the moved machine
is exercised rather than stubbed, and it runs a header drag, a grab that hits the content floor, a
reopen on another screen that keeps the corner gaps, reads the written box back, and checks the machine
gave the content its own size too); the harvest
harness 548; tool.css 470, the five resize bands live in
`tools/dialog/tool.css`. Neither harness reports a missing intl key.