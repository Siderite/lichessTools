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
Rows, chips and tooltip lines carry no listener. The tooltip itself keeps three
(mouseover, mousemove, mouseout) on the one element that is created the first time a
tooltip is needed.

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
the tooltip three per popup element; a repaint over a thousand rows
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
move never eats a subtree. The merge re-nests a leaf under the leaf its branch blob nested it
under - the split keeps a leaf of another branch as a bare path marker, and that marker chain
is what carries a nesting that crossed two branches - and a stamp (`meta.parentId`, or the older
`meta.studyId`/`meta.blogId`) answers only for a link no blob carried, so a harvest's chapter or
blog post still finds its parent when the blob lost the way to it. A marker never joins the
merged tree, so the split cannot double a row, and the merged leaves are fresh objects: a page
load rebuilds the tree, so selection, open folders and folds are restored by path, never by
node identity.

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

## Position hover boards

Any position row can show the position itself. The record carries the draw: `meta.orientation`
and `meta.lastMove` (the UCI that reached the node, the tail of the path array) join the fen the
row already names - the id for a bare position, `meta.fen` for a study position, captured when
the page added the leaf. `resolvePageLeaves` fills all of it; a leaf filed before it carries
none simply paints no board.

The board never lives inside the window: lichess styles a board and its pieces from a sheet
scoped under the page's `main`, and no rule in it can cross into a dialog - inside the window
a chessground would always come up blank. So the row's first hover births a fixed container
(class `records-db-mini-board`, see `hoverShow`) holding lila's own mini-board contract -
`mini-board mini-board--init` with `data-state` "fen,orientation,lastMoveUci" - as a child of
`main`, and hands the container to `lt.uiApi.initializeDom(container)`: lila builds the
chessground inside, and the board then wears the page's own themes exactly like any other
mini-board on the page. Every enter re-pins the container - inside the row's tooltip at its
board slot when that reading carries one, over the hovered row when it does not (left/top
inline, the sheet gives `position: fixed` and a z-index above the dialog's own 900+, the
tooltip sitting between at 900+100) - and
flips the inline opacity to 1; leaving the row flips it back to 0. One chessground per
hovered row persists under `main`, ready for the next enter, and only hovered rows pay for
one. The sheet re-sizes lila's tiny thumbnail marker to a 15em border-box square inside our
container - the scoped selectors outrank the plain lila rules, so nothing in these files
needs an !important.

The pin reads the slot's and the container's `getBoundingClientRect`, not cash's `offset()`:
`offset()` answers in page coordinates, which drift under a scrolled dialog, while the
viewport box `showStudyPopup` places from is exactly what a `position: fixed` slot wants. The
slot is the tooltip's own `li.popup-board`, so the pin follows the placed tooltip rather than
the row, and `showStudyPopup` raises the popup's floor to the 15em square (`hoverBoardPx`) so
a low row cannot cut the board in half. Every enter re-pins, so the board follows both the row
and the window's scroll, and the pin is clamped inside the viewport.

## A tooltip, anchored on the item

A row carries a reading only when the item itself has a fact to give, and every line is that
item's own - never the branch it sits in, never the item that holds it, never its siblings. The
row's own label is the reading's title, so nothing inside repeats what the row prints. A kind that
knows nothing about itself - a chapter, a puzzle, a broadcast, a coach, a streamer - carries no
reading at all: its mark and its row-end actions carry the row. The reading hangs off the item box
(`div.record-content`) rather than the row: `popupNodes` holds that box with every node under it,
so the hover raises it only over the name, a flair or a date - a pointer over a row's padding or
one of its chips asks for nothing. The mark (`data-popup`) rides on the same box, and the sheet
puts the help cursor there. An item that owns a board opens the reading with an empty
`li.popup-board` square and the hover board parks over it, so the words and the position come up
as one box; a row with no reading has no square to park in and its board floats over the row.

## Page drags open leaves

A drag that starts on the page rather than on a row still lands: `pageLeaf` names any element
by shape - a study-page chapter button (`class="draggable"`, `data-id`) opens a chapter leaf
wearing the `<h3>` inside as its label; a player anchor (`href="/@/Name"`, or the legacy
quoted `/'Name'`) opens a `player` leaf with the power-tip fields; a study anchor
(`/study/ID`), a game anchor (`/game/ID`, `/game/ID/white`, a bare id, or the 12-char full id
whose tail names the player - all of them keyed by the game's own 8 chars, so the tail never
splits a leaf in two) and a training anchor
(`/training/theme/n`) open study/game/puzzle leaves wearing the link text. The shapes are the
registry's own openUrl forms, so a filed leaf always opens back. One shape has no kind: a
tournament page - but its player links name players. The pointer row (read from
`currentTarget`) says where; anywhere else the leaf joins the root. A leaf the tree already
holds is never opened again: it moves when the filing lands among the siblings it has now, and it
leaves the slot it vacates, so re-filing a link beside its own row keeps one row rather than a twin.
Filed under a **different** parent the same item joins as a copy and the original stays
put - the same game can sit in two folders, and a copy is never hung inside the branch it already
owns; a filing with nothing selected names no new home and still only moves the row. Two
boards of one relay are never twins either: a round builds all of its boards from a single study,
so the study cannot key them - each board keys on its own chapter and the study rides as `roundId`,
which is the half the open route rebuilds from. A board row wears the **chapter** it plays - the
link's own text, or the chapter name the page blob shows - because every relay spells the same
`Round <n>` on all of its boards; the relay and the round answer in that row's tooltip instead
(the relay's own name as a bare line, `popupRound`, then the chapter name the row may have cut).
A board page also records the game that chapter plays (`meta.gameId` from the blob's own
`data.game`, and a playable chapter the page made up for itself spells `synthetic` - no game id);
a drag off that same page keeps the fact too, only while the link names the chapter the page is
reading, so a visit to that game page can dress the board row through `leavesCarrying`: the
game's facts are the board's own, while the row's name stays the chapter, which is what tells the
boards of a round apart. A pass that reads an item rather than a row - a visit, a list, an api
read - dresses every copy the tree holds, since none of those readings depends on where the row
sits.

The page's lock is taken back on every paint (`armPageDrag` in the paint pass): a relay drops its
boards onto the page after the window opened, and a link that still wears `draggable="false"`
answers no gesture at all, so a board that appears later would otherwise stay unreachable. Only
links still locked are touched, and a link this table cannot name keeps the page's refusal.

Chrome may also refuse the drag outright: lichess parks chapter buttons and user links inside
containers it marked `draggable="false"`, and then the browser shows its no-drop cursor and
**no drag event ever fires** - and even an allowed page drag ends its `dragend` up the dragged
element's own ancestors, which never include the tree host. So the gesture is read from mouse
and drag events alike: listeners attached once per tab with `document.addEventListener(...,
true)` in the **capture** phase - this cash shim's `.on` attaches to the wrapped element only,
so a body handler never sees a press whose target lives in the rest of the page, and capture
fires top-down for every element and every ride before any in-page handler can eat it
(`dragArm`/`dragMove`/`dragRelease` and `dragStartGlobal`/`dragOverGlobal`/`dragEndGlobal`
read the raw events through `dragEv`). **Any** press outside the tree arms a carry of the
element under the finger - nothing is pre-selected from a list of page kinds; the tree
**decides at the drop** (`pageLeaf` names the held element or files nothing). Travel counts
from mousemove or dragover; the commit is on mouseup for mouse gestures and on dragend for
the rides Chrome promoted - drag events name the dragged element, never the point, so those
landings come from `rowAtPoint` on the pointer's coordinates. A carry the browser promoted
needs only one event of travel to commit - and one that `dragend` leaves alive answers the
`mouseup` that follows instead. The gesture shows its landing
while it travels: the half-row under the pointer wears the same drop mark in-tree moves use
(`showDropMark`), and it re-marks on every move. Rides started by another source's wiring
(the study tool's draggable buttons, default-draggable links) carry foreign payload types; our
tree **accepts** them while our carry is pending - `preventDefault` on the passing `dragover`
is what makes Chrome fire the `drop` over the window, and both `drop` and a rowless `dragend`
fall through to `externalDrop`. The gestures stack with other tools' drag wiring instead of
fighting it: our payload type is ours alone, our two `dragstart` handlers only add (they never
stop or prevent), and the document-capture listeners answer a ride even when a page handler
mid-chain stops propagation or owns the element's own drag hooks. A press without travel is a click; a release
outside the tree spends nothing. We never `preventDefault` a dragstart: lichess's own rides
(chapter reordering inside its list) keep working beside ours.

## Add follows the page

`resolvePageLeaves` names what the page is about, and the Add chip plus its dropdown read
that list: a study page offers study/chapter/position/study-position, a profile page (`@/Name`
or the quoted legacy form) offers the **player** with the panel fields the page shows, a
training page offers the **puzzle**, a game page the **game**. A page spells the game it is about
in its own blob rather than in its url alone: a replay page puts it under `cfg.data` (no study
behind a `/pjYzEtaX/white` path), a plain game page under `data` - both name the players and the
speed and variant, which feed the row's title and its icon. `pageInitBlob` hands the blob over,
reading the lazy `lt.pageInitData` first and the `page-init-data` script still in the DOM
otherwise, so neither half costs a request. `addChoice` is what Add files;
the caret cycles the list and the menu chips set it. `canAdd` hides the chip when Select is on
or the page names nothing. A filed leaf then rides the store's own read pass where its row
services one. A study blob nests the chapter the page shows inside the study it belongs to
(`study.chapter`) rather than at the top, and a relay round is such a page: the chapter it is
reading is the board, `study.relay` is the flag saying the study is a relay round, and the relay's
own title rides beside that flag - which is how a board row gets its chapter name and its tooltip
relay without a request.

## The press opens the window where the button stands

`canPlace` is the whole page test - a user, the database, a route the db speaks for - and
`canOpen` answers through it, so the two names keep their two roles (put the button, show the
window) over one rule. Nothing about the window needs a study: the frame is a dialog the factory
hangs off the viewport, `initialGeometry` falls back to an honest box on a page that lost its
panels, and the content reads its tree from the blobs under one `kind` (`treeTab`). So a game
page, a replay page or a training page lifts the same tree a study page shows. `start()` opens
only on a trip or a return, which is what keeps an arrival short; pressing the button there is
what opens it, and a second press closes it again.

## Visits enrich filed leaves

Opening the window on a page re-reads the same list against the tree: `enrichFromPage` renames
a filed leaf and merges in meta fields the page actually names (study mirror name, profile
panel fields), leaving anything the page does not show untouched, and saves once when something
changed. Visiting is enrichment, not a second offering - `findLeaf` keeps one leaf per kind/id.
A game visit is the case the url cannot answer on its own: opening a game and coming back names
the row by its players and parks its control and variant, so the row paints the time-control or
variant mark the game wears instead of the Crown a dragged link is left with. The game's key is
its 8-char id alone - `gameKeyId` cuts the tail off a 12-char full id - so the game page, its
`/white` and `/black` analysis boards and a `/<12>` player page all reach that one leaf.

## The player kind

`player` lives in the store's kind registry next to the page kinds: icon `User`, opens the
profile at the quoted link `/'name'` (the site's user anchors carry it; the api path `/user/name`
is no page route), no read - what the page showed at drag time rides in `meta`. `playerEntry`
reads the power tip the page parked next to the link: flag src and country, flair src, the
game-count badge's title, the joined time and the rating spans (`type`, `games`, `value`; a
no-rating span stays blank). The row wears `lt.icon.User`. What the tip does not show is
left absent rather than guessed.

## Url-only kinds, and the page's own Add

Four kinds answer from a route alone and never from a harvest: `coach` `/coach/<user>`, `streamer`
`/streamer/<user>`, `team` `/team/<name>`, `tournament` `/tournament/<id>`. `pageLeaf` names them
for drags and `resolvePageLeaves` names them for visits and for Add, both spellings of a blog
route (`@/<user>/blog` now, the quoted legacy form) among them. `/team/me` names nothing anywhere:
that route is the list of the current user's teams, so a team called `me` would shadow it. A
tournament page carries a `pageInitData.data` that names the ladder and says how it runs (`perf`,
`variant`, `nbPlayers`), which rides in `meta`; a dragged tournament link waits with `nameTemp:
`'page'` until a visit names it. The two routes spell that item with different keys: an arena names
its ladder `fullName` and opens it at a `createdAt` epoch, a swiss names it `name`, opens it at an
ISO `startsAt`, says it ended with `status: finished`, and hangs each standing player's name, flair
and rating under the player's own `user`. The reading takes either spelling and, when the blob names
no run at all, the page's own tab title - a title that only says lichess names nothing, so the run
stays marked as waiting.

Add files what the page is about when its dropdown choice is not on the page. `pageMainKind()`
reads the route - a blog page files the blog, a blog post page the post, a forum board the board,
a forum thread the thread, a round page the game of that round, a bare relay the relay - and
`addCurrentChoice` falls back to that leaf before the first candidate. The caret keeps its own
cycle over `pageAddKinds()`, so widening the default never moved the menu.

Two rows name themselves from their own data now. A **puzzle** row prints `#<id>/<rating>`
(`puzzleName` stopped reading themes - those describe the collection a puzzle sits in, so the same
puzzle would answer with a different title under a different collection), and a **player** row
paints what the power tip parked: the link's `title` in a `bookmark-title` span and the flair in a
`record-flair` img after the handle, next to the `User` mark the row keeps. A `coach` and a
`streamer` row dress exactly the same way - the three are `userPageKind`, and only their marks
differ (`User`, `GraduateCap`, `Voice`). A row of those three (or a `blog`) that carries none of
the fields is marked by `profilePending` and its `mouseover` runs `requestUserRead`, so a row
restored from the blob grows its title and flair on the first hover; `openLeaf` asks the same
question before it navigates, and the read's own save repaints the row.

A row of those three kinds borrows the page's own user card instead of rebuilding one: its
`div.record-content` wears `data-href="/'handle"` in the spelling the site's user anchors give,
and the row's `mouseover` hands that box to `lt.lichess.powertip.manualUser`, which paints the
page's `#powerTip` with the title, handle, flair, flag and ratings of that user - the card the
page paints over a user link, pinned to the item rather than to the whole row. Nothing copies the
card, so a row cannot disagree with the profile it names. The card is a fixed box of the page and
the window is a dialog at z-index 900+, so the sheet lifts `#powerTip` to 1000 while a records-db
dialog is open; a kind whose page is not a profile asks for nothing.

## The undo chip walks the gestures back

Every tree edit the user can regret (`drop`, `addLeaf`, `createFolder`, `removeSelected`,
`editName`, restore) records a snapshot of the shape before it runs. A snapshot is a copy,
not a handle: edits re-hang and rewrite nodes in place, so only a copy lets an older state
survive them. The three state Sets (`selected`, `expanded`, `collapsed`) are recorded as
index chains (`shapeChains`) rather than node handles - restoring puts fresh objects back
and the Sets have to name the restored ones again. The Undo chip (last on the actions rack)
pops the newest snapshot and makes it the tree; press it again to walk further back through
the chain of gestures this window performed. The chain is scoped to the window - `viewHost`
opens it fresh - and Undo answers nothing when the chain is empty (the chip carries
`disabled` then). The stack caps at 40 gestures.
## Hydration, temp names and the kept window (this pass)

- `meta.nameTemp` says where a title came from - `page`, `slug` or `id` - and a rename writes
  `meta.renamed`, which outranks every hydration pass. The paint's precedence lives in `leafLabel`.
- One writer for every source: `hydrateLeaf(existing, incoming)` (label only on an unrenamed leaf,
  marker cleared only when the name came from data, meta merged key by key). `enrichFromPage` runs
  over `resolvePageLeaves()` and over `pageTeamRows()`; the drag reads (`requestPuzzleRead`,
  `requestGameName`, `requestTeamName`) route their writes through it too, so a visit cannot eat a
  hand title.
- `pageTeamRows()` reads the shapes no url carries: the page's title block (`div.box__top h1.text`
  plus `div.box__top div strong`) and list rows (`td.subject a.team-name`, `div.teams a`), keyed by
  their route, refusing `/team/me`. `teamFacts(el)` strips the `<em>` off a clone and takes the
  `img.uflair` src. `requestTeamName` fetches the team page, the api read being the fallback.
- The window keeps a session flag (`windowOpenKey`): `open()` writes it, and a manual `close()`
  clears it, while `teardown()` - what a page being left runs - leaves it alone. `start()` reopens
  when the flag answers and the route fits, so the trail and the hand-off still spend their keys but
  do not gate the open. `docs/recordsDbItems.md` maps the kinds, their data and their refresh rules.

## Row marks and the per-kind popups

- A team row paints `meta.flair` after the name like a player row; the mark stays `lt.icon.Group`.
- A chapter wears no playable mark: neither the page blob nor the mirror names a chapter the
  reader can play from, so nothing paints (see `docs/recordsDbItems.md`).

One machine feeds every popup: `popupData` takes `{name, header}` items, and the sheet styles the
`popup-header` block a popup opens (a ladder opens its standings block). Every line states one fact
the item owns; the row's own label is the popup's title, and a row whose item knows nothing about
itself carries no tooltip at all.

The row wears what its page named, after the name: an `img.record-flair` for any kind that
carries a `meta.flair` - player, coach, streamer, team, study, blog post, thread, board - unless
the row sits under the parent that filed that flair, in which case the filed mark stays. The parked
value is the page's own: a blob names a key and the row paints `lt.lichess.asset.flairSrc(flair)`
of it, while a page's `img.uflair` src is a url already and rides whole. A ladder row adds
the site's own perf mark (`span.record-perf`, the icon `speedIcons` names for the blob's perf
key) and the day the ladder opened (`span.record-date`, a `localDate` of `meta.startsAt`, which the
page visit parks from the blob's opening - a `createdAt` epoch on an arena, an ISO `startsAt` on a
swiss); a ladder that has already finished shows no date, and its popup closes with the standings
block.

A study popup names its owner (`popupOwner`) alone - the chapters it holds ride the row as
`span.record-chapter-count`, never as a list. A **study position** owns one fact about itself: when
the chapter it was reached in has left the record, the popup says so with `recordsDbNodeMissing`
rather than staying silent - the row still opens, the analysis just lands at the chapter root.

A profile row and its tooltip: a `player`, `coach` or `streamer` row (and a `blog`) whose meta
names no title, no flair and no ratings used to stay blank until the row was opened, which is how
a row restored from the blob looked - one that had been dragged on its own page already wore its
title and flair, so the players read as the bare ones. `profilePending` marks such a row in the
paint and `rowMouseOver` spends `requestUserRead`, so the first hover grows the title, the flair,
the ratings and the joined day; the read's own save repaints the row. The `#powerTip` card the
site paints stays the hover's own, pinned to the row's `div.record-content`.

One tooltip, not two: a row that owns a board (a game, a puzzle with a fen, a position, a study
position) showed a text box under the row and a board square over it. `popupFacts` now opens such
a reading with one `{board: true}` item, the sheet gives it the `li.popup-board` square, and
`hoverShow` pins the container to that square instead of the row, so the board lands inside
the tooltip. The container carries the tooltip's own 13px so its 15em and the slot's match,
and `showStudyPopup` raises the box floor to `hoverBoardPx` + 48 for a reading that carries one.
A row whose item owns no fact still has no tooltip, and its board keeps floating over the row.

## Row-end actions ride one container

A row's end buttons share one `div.record-actions`: the paint grows it the first time a row wears
an action and appends it after the item box and the marks the row wears, so the row reads the
checkbox and the caret chip first, then the kind mark, the item box, a chapter count, and the
container last. The container takes whatever width the row has left (`flex: 1 1 0`) and justifies
its children to the inline end, so an action sits at the row's right end over its own box and the
strip beside it answers as the row - the way the row's padding always did. A second action can
join the line without eating the row or pushing the ones already there.

The claim moves, the size does not: the container stretches and its children never do, so the
jump keeps the width of its icon and no row grows a line. The container answers no pointer of its
own (`pointer-events: none` in the sheet, taken back by the button with `pointer-events: auto`),
and it is no chip: it enters no `rowIndex`, so `rowTarget` climbs it to the row and a press on the
strip selects the row rather than opening the leaf. The jump keeps its own entry, so a press on
the icon still runs `openLeaf`, and Enter, the double click and the row itself keep one route to
that same action. The container wears no `tabindex`, so the row keeps exactly one tab stop.
