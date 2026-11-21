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
leaves carry `{kind,id,label,meta?}` with the halves of their address **beside** the id -
`system` (tournament), `studyId` (chapter), `chapterId` + `nodePath` (study position), `userId`
+ `slug` (blog post), `board` (thread), `slug` + `round` + `roundId` (relay board), `variant`
(FEN position), `url` (a dragged link), and `parentId` (the leaf that filed it). `meta` holds
only what a row paints or waits with (title markers, mirror facts, standfirsts, ratings, the
proof that a read found nothing), so deleting `meta` never loses the item or its route: the
registry's `openUrl(id, leaf)` rebuilds the address from those siblings alone. `sortTree` sorts
folders first and leaves by label inside every node, so a study holding its chapters and study
positions reads like a folder holding the same.

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
is what carries a nesting that crossed two branches - and a stamp (`parentId`, beside the id)
answers only for a link no blob carried, so a harvest's chapter or
blog post still finds its parent when the blob lost the way to it. A marker never joins the
merged tree, so the split cannot double a row, and the merged leaves are fresh objects: a page
load rebuilds the tree, so selection, open folders and folds are restored by path, never by
node identity.

A study position is a new kind: `{kind:'studyPosition', id: chapterId+'|'+nodePath, studyId,
chapterId, nodePath}` - the address halves sit beside the id, so the leaf still opens on its
chapter with no `meta` at all. It rides the study branch (no blob of its own). Opening it
loads the chapter, then resolves `nodePath` to a node with `lt.lichess.analysis.tree.nodeAtPath`
and walks the analysis across with `lt.lichess.analysis.userJump(node.path)`; a path the tree
does not know (chapter rewritten since the harvest) leaves the chapter open at its root.

There are two position kinds. A **FEN position** is the direct lichess URL for a FEN:
`{kind:'position', id: fen, variant}` and its row opens `/analysis/{variant}/{fen}` with
spaces replaced by underscores. A **study position** is a node inside a study chapter and takes
the chapter + node jump path above.

The Add button grew a caret dropdown (`btn-add-caret`). It cycles `addChoice` through the
kinds the current page can name - study, chapter, FEN position, study position - and Add
files the current choice. The caret only paints when the page names more than one kind, so
a bare analysis page still gets a bare Add button.

The window is anchored to the viewport: `position: fixed` in the tool css, so the viewport
numbers the blob keeps (`windowViewport` reads `innerWidth`/`innerHeight`) are the numbers a
write takes, and the box stays under the pointer whatever the page does. The sheet keeps
`html { overflow: auto }` for this dialog, because browsing the page under a held window is
the point of carrying it around - other dialogs keep the factory's hidden default. The sheet
used to anchor to body as well, which is what put those writes scroll pixels too high.

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

`insertionTarget` splits the lower half of a row on the pointer's x, the way tool.css draws
the two markers: a pointer in the indent gutter (left of where a child of that row would
paint - `4px + depth * 12px` plus one 12px step) keeps the row's own parent and names the
row's next sibling, so the drop lands beside it, and a pointer over the row body nests it.
Any item may still parent any other, so a body drop under a leaf stays legal. `canDrop`
refuses cycles for `payload.nodes` as well as for `payload.paths`, so dragging a branch
(folder or leaf) onto one of its own descendants leaves the tree untouched.

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
factory's (`tools/dialog/tool.js`: `DialogResize`), not this tool's - every resizable dialog gets
the same machine and the same signals: the `resizing` class while a grab moves, the debounced
`lichessTools.setDialogPlacement` emit on release, and the click the browser fires under the strip
when a press ends. What stays here is the window's own policy, handed over as `resizable: {begin,
resize}`: `begin` lifts the window forward so its strips stay hit-testable, and `resize(proposed,
edge, dx, dy, base)` runs `moveWindow`/`fitWindow` against the viewport and stores the size on the
blob before the machine puts it on the page. Escape is not the machine's: `escapeKey` closes the
window, and `noEscClose` is what keeps the browser's own Escape close from doing it first.

## Where the window is remembered

The blob keeps the box the user left twice: as absolute numbers, and as the screen corner it was
nearest to with the two gaps to that corner (`anchorBox` writes it at `freeze`, `rememberedBox`
reads it at `load`). A page whose viewport has since changed size puts the window back the same
distance from the corner the user had put it against, so a window parked against a corner survives a
screen change instead of sliding to coordinates of a screen that is no longer there. A remembered
box that no longer fits is clamped back in by `fitWindow`, which resizes and repositions it; a page
too small to hold the window at its own minimum at all (`windowCanHold`) drops the row and the
page's own placement answers. A row an older version wrote carries no anchor and is taken where it
was written.

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
before the row under the pointer, beside it when the pointer sits in
the indent gutter, inside it when the pointer sits over the row body,
or at the root - all of which address nodes, not paints, so
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

Counted after the comment pass, which took 1,024 lines out of the script and 70 out of the
sheet and moved the notes they carried into the last section of this doc: tool.js 4,335 lines
(172,283 bytes) - it ran 5,165 before the cut - tool.css 594 (15,136) after the row layout
fix, the window harness 3,997 (313,576) (five identity needles added with the repaint fix),
the store harness 461, the harvest harness 553. All three harnesses report `failed: 0`, at
1,246 / 109 / 72 passed, and no missing intl key. The five resize bands live in
`tools/dialog/tool.css`, not here.

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
`offset()` answers in page coordinates, which drift on a page that has scrolled, while the
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
so the study cannot key them - each board keys on its own chapter and the study rides beside the id
as `roundId`, which is the half the open route rebuilds from. A board row wears the **chapter** it
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
mid-chain stops propagation or owns the element's own drag hooks. A press without travel is a
click; a release outside the tree spends nothing. We never `preventDefault` a dragstart: lichess's
own rides (chapter reordering inside its list) keep working beside ours.

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
`variant`, `nbPlayers`), which ride in `meta` beside the `system` the route settled earlier; a
dragged tournament link waits with `nameTemp:
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
## Notes the tool carried as comments

Every note that used to sit on a name in `tool.js` or `tool.css` lives here now. The audit
found no marker note and no note short enough to stay in the file, so the file carries none and
this carries all of them. The key is the lookup you search for in the code: `Class.method` for a
member, a bare name for a module constant, `intl."key"` for a string table entry, and a body
keyed to the member it sits in, named with the line it was attached to - a long key takes its own
line and the note starts under it. Entries stay in file order inside the unit they sat in. Line
numbers are left out on purpose - they move with every edit, while the names above do not. The
sections above carry the design narrative; this one is what the file used to say on each name, so
a note the narrative already states can read twice. Identical notes are merged under both of their
names.

### tool.js - module scope

- `recordsDbMaxResults`
  How many records the filter scores at most - the product owns this number, so it is edited here
  rather than carried as a preference.

- `treeHandoffKey`
  A leaf that opens something leaves this key behind for the page it lands on. It lives in
  `sessionStorage`, so only the trip inside the same tab carries it, and only a trip younger than
  `treeHandoffMs` is spent - see `openLeaf` and `RecordsDbCtrl.handoff`.

- `treeReturnKey`
  The back button carries no mark of its own, and the study hash already means a bookmark and a
  ply, so it cannot spell "the window was open here". The pages that had the window open are kept
  as a short url trail in `sessionStorage` instead: the next page whose url is in the trail is a
  page the user came back to, and the window comes with it.

- `treePageKey`
  Which page ran last: reloading the page you are on is not a way back, so the trail is only read
  as a return when the page that ran had a different url.

- `windowOpenKey`
  Whether the user left the window open. The window lives in one page's dom, so every page load
  has to decide again: this session key says the user never closed it, so the next page lifts it
  back. Only a manual close - the toggle press, or the dialog's own close - takes the key away.

- `windowStateSaveMs`
  The shape and the wheel are state only this page can see, so they are written as the tree
  changes - at most once every `windowStateSaveMs`, so dragging through a big tree cannot rewrite
  the blob on every step. A page being left without another call gets one flush from `pagehide`
  and `beforeunload`, the same channel `puzzleHistory` and `moveListOptions` flush on.

- `recordsDbHoverReadLimit`
  A row the mirror has never seen spends one read on hover, so its tooltip answers from the next
  hover on. The reads are spaced like the harvested pages and capped per page, so resting the
  pointer on a 496-row tree cannot spend 496 requests.

- `camel` - Intl keys are flat camelCase, so a state or a kind spells its own capital.

- `variantIcons / `gameIconName``
  The mark a game row wears: variant chess takes the variant icon, standard games the time-control
  icon - the same map the recent-games list dresses from its css - and an unknown control answers
  Crown. Module scope so the paint and the class read one map.

- `speedWords`
  The word a popup spells for a control: the site's own vocabulary, kept as it prints it.

- `containedCarrier`
  The key each contained kind uses to name the item that carries it: a chapter names its study, a
  study position names its study, a blog post its blog, a forum post its board, a relay game its
  broadcast. The registry's `containment` names the kind that carries it.

- `gameKeyId`
  A game url carries the 8-char game id or the 12-char full id, whose tail names the player whose
  page it is. The records key on the game alone, so no leaf ever holds the tail, and every game
  shape below reads its id through this.

- `gameSpeedOf`
  The control and the variant a page names for a game, in the two spellings the blobs come with:
  the plain game page spells speed and perf as words and keys the variant object, the replay page
  words the speed and keys the variant, and the api read words both.

- `boardStateFor`
  The hover board's state in the shape lila's miniBoard.ts splits: "fen,orientation,lastMoveUci".
  A bare position names its fen as its id; a study position and a puzzle read it from `meta.fen` -
  the puzzle's arrives from one api read after the file - and a leaf filed before those fields
  existed has no board to show.

- `hoverBoardPx`
  The board square in page pixels: the sheet keeps the marker at 15em of the popup's own reading
  size (13px), and a tooltip that carries a board reserves the same square for it.

- `recordsDbInstance`
  The one tool instance the helpers below reach for their engine, their dialog and their window
  handler - set in `init`, and the same instance every page keeps.

### tool.js - RecordsDbUiTool

- `intl.filtersAccess`
  The tree view: the header, the three chips, the actions and the backup ask for these. Every one
  lives in this table - a string the view asks for but the table lacks would render blank.

- `RecordsDbUiTool.init (at `if (!recordsDbInstance) {`)`
  The engines live on the tool itself: the classes below are not tools, so they reach their search
  engine and their navigation through this one instance.

- `RecordsDbUiTool.start (at `if (ctrl) {`)`
  Take whatever the last page left open off this page's dom before deciding again. A page being
  left is not a user closing the window, so the "left open" flag stays untouched.

- `RecordsDbUiTool.start (at `const arrived = ctrl ? await ctrl.handoff() ...`)`
  The hand-off is spent on every page load, before anything else decides: a flag nobody spends
  would otherwise reopen the window on the next visit of that study. The url trail is spent the
  same way, for the same reason - it is the back button's only signal.

- `RecordsDbUiTool.start (at `this.logOption('Records database', 'cannot o...`)`
  The route the db never speaks for (broadcast, practice, learn) or no user behind the page -
  nothing to place and nothing to enrich.

- `RecordsDbUiTool.start (at `await ctrl.load();`)`
  The button belongs on every page the db knows, not only where a study is open: the tree travels
  with the user, and opening a game or a replay enriches its row on that page.

- `RecordsDbUiTool.start (at `if ((arrived || returned || stayed) && ctrl....`)`
  Once the user opened the window it travels with them: a trip from a row or a way back lift it
  too, but they no longer gate it - the flag does, and only a manual close takes it away.

- `RecordsDbUiTool.start (at `await ctrl.content.init();`)`
  The page kept its window short, so the visit reads alone: what the page names still dresses any
  filed leaf it finds - a game's players and control, a profile's panel - and that reaches the
  tree the next time the window loads, pressed or not.

### tool.js - BookmarkTabContent

- `BookmarkTabContent`
  The tree content reads the store's tree and owns the shape the window shows. It replaces the tab
  base and its module holder: the page has exactly one content, and the engines it needs are the
  tool's own fields.

- `BookmarkTabContent`
  The tree is one content, so it owns the read lifetime, the repaint hook and the shape write that
  the tab base used to hand out to several.

- `BookmarkTabContent.constructor (at `this.entries = [];`)`
  The tree is curated - empty is the normal first state, and the header makes it legible.

- `BookmarkTabContent.constructor (at `this.branches = new Map();`)`
  The last snapshot of each branch: what the blobs held, so a load can merge it and a save can
  split from the same shape.

- `BookmarkTabContent.constructor (at `this.collapsed = new Set();`)`
  Leaf-parents the user has collapsed - a study holding filed chapters, a filed game that grew its
  own children. A leaf-parent is open by default; the caret adds it here.

- `BookmarkTabContent.constructor (at `this.undoStack = [];`)`
  The gestures this window has done to the tree, newest last; the Undo chip walks them back. A
  snapshot copies the shape: edits re-hang and rewrite nodes in place, so only a copy lets an
  older state survive them.

- `BookmarkTabContent.constructor (at `this.filters = { access: 'all', visibility: ...`)`
  The two state chips plus the kind chip; string states so the blob reads without a mapping.

- `BookmarkTabContent.constructor (at `this.addChoice = 'study';`)`
  What the next Add press files. 'study' is the default; the dropdown caret opens the menu (and a
  later press closes it). Opening the menu shows one chip per kind the page can name; clicking a
  chip sets `addChoice` and files that kind.

- `BookmarkTabContent.constructor (at `this.confirmBar;`)`
  The "press again" fallback for a page that offers no `dialog` service.

- `BookmarkTabContent.constructor (at `this.goneNodes = new Set();`)`
  Leaves a read proved gone - the proof lives on the leaf, never on a missing record.

- `BookmarkTabContent.constructor (at `this.hoverReads = new Set();`)`
  Studies this page already spent a hover read on, so one gesture cannot ask twice.

- `BookmarkTabContent.constructor (at `this.rowIndex = new WeakMap();`)`
  The nodes the current paint put on the page: the tree host answers a pointer or a key by looking
  the hit element up here, so the row handlers live on the host and a repaint over a thousand rows
  registers nothing that could outlive the rows it replaces.

- `BookmarkTabContent.constructor (at `this.popupNodes = new WeakSet();`)`
  The nodes a reading waits on: the content box of a row that has facts, with every node under it.
  A pointer over a row's padding or one of its chips lands on none of them and asks for nothing.

- `BookmarkTabContent.init`
  One lifetime per load: the abort signal it hands `load()` so a page that leaves mid-read cannot
  finish a stale read and paint over the state the leaving page had saved.

- `BookmarkTabContent.init (at `if (!signal.aborted) this.armPageDrag();`)`
  Chrome refuses to drag an element the page marked `draggable="false"`, and it fires no drag
  event at all for such a press - so a gesture meant for one of lichess's own links never reaches
  the tree. The links this table can name have the flag taken back.

- `BookmarkTabContent.destroy`
  The window is going away: the read that may still be running is stopped, and the repaint hook is
  taken off the sync watch's hand so a late idb write cannot repaint a dead window.

- `BookmarkTabContent.logState`
  The tree engine is not a tool, so it has no `logOption` of its own; the page's own console line
  is what a live page is checked with, printed in the same colour the tools use.

- `BookmarkTabContent.registry`
  The registry is the store's, so the tree never hardcodes what a kind means.

- `BookmarkTabContent.moveText`
  The move label lichess itself paints: the full-move number, '.' before White's SAN and '...'
  before Black's. The root has no move, so it answers empty.

- `BookmarkTabContent.leafLabel`
  A leaf is `{kind,id,label,meta?}`. The mirror record's own name is what a cold row shows, but a
  rename writes a `label` with `meta.renamed`, and a title whose `meta.nameTemp` says where it
  came from (link text, a slug, an id) waits for its data name: then the record name wins and the
  text is only the fallback.

- `BookmarkTabContent.leafLabel (at `if (node?.kind == 'chapter') {`)`
  A chapter inherits its study's record - that is what dims or stamps it gone - so the study's own
  name must not stand in for the chapter's. The chapter's entry under that record answers first; a
  card that lists chapters without ids leaves the study name.

- `BookmarkTabContent.leafLabel (at `if (node?.kind == 'studyPosition') {`)`
  A node path is not readable, so a cold study position says where it is: the chapter it lives in
  and the move that reaches it. A renamed one keeps its own text above.

- `BookmarkTabContent.studyRecordFor`
  The record of the study a position sits in: the cache keys a record by row id, and a position id
  spells its chapter and path - only the leaf's own meta names the study to look up.

- `BookmarkTabContent.threadPoster`
  The writer a thread names on its own page: lila spells each post's author as a profile link, and
  the first one under the posts is the thread's own writer - a slug says nothing about who wrote
  it.

- `BookmarkTabContent.armPageDrag`
  The links a page carries that this table can name, and that the page marked `draggable="false"`:
  Chrome shows a no-drop cursor and fires no drag event for such an element, so the tree would
  never hear a gesture meant for one. Taking the flag back is what lets the press arm a carry and
  land in `externalDrop`; a link the table cannot name keeps the page's own refusal.

- `BookmarkTabContent.lichessRoute`
  A lichess route as the path the registry opens: a root-relative path, or the path of an absolute
  lichess url. A bare fragment, an off-site link and the main page name no item - the extension
  controls no other page, so it never files one.

- `BookmarkTabContent.pageTitle`
  The page's own title, as the tab spells it - with the site's own name cut off the tail, which
  every lichess page hangs on its title.

- `BookmarkTabContent.humaniseSlug`
  A name generated from the item's own data: slugs read as words, and a puzzle answers with its
  own theme (humanised) since the read carries no title of its own.

- `BookmarkTabContent.puzzleName`
  The row says which puzzle it is and how hard it rates: the id the url carries and the rating the
  page blob or the read brings. Themes never stand in for a name - they describe the collection a
  puzzle sits in, so the same puzzle would answer with a different title.

- `BookmarkTabContent.eachNode`
  Every walk that only counts or collects rides here: one predicate for every node, in paint
  order, and a folder is walked into whatever it holds. The walks that need a parent's record or a
  row's path keep their own.

- `BookmarkTabContent.presentKinds`
  Which kinds are on the tree - the kind chip walks these, so a study tree never offers a games
  state.

- `BookmarkTabContent.chipScope`
  The scope a chip would answer for - the selected kind, or every kind on the tree.

- `BookmarkTabContent.chipApplicable`
  "dim, never inert": a chip is live only if some kind in scope has an answer for it. The chip
  names map onto the registry's row fields - the access chip is answered by `canWrite`, the
  visibility chip by `visibility`, and the kind chip is live when the tree holds more than one
  kind.

- `BookmarkTabContent.cycleFilter`
  A click cycles `(state + 1) % states.length`, `all` first and drawn dim.

- `BookmarkTabContent.load (at `this.refreshCaches();`)`
  The mirror facts a row shows belong to the leaves that were just built, so a reload re-reads
  them - an old cache would call a live leaf dead.

- `BookmarkTabContent.load (at `await this.sync.setTreeIds(this.treeStudyIds...`)`
  The tree now names its studies, so the local db keeps a capture for each of them; a prune
  failure only leaves an old capture, it does not break the load.

- `BookmarkTabContent.load (at `this.restoreView(await this.store.idbStudy.l...`)`
  The shape a user left comes back the same way the chips do: the window blob carries it, and a
  row the tree no longer has simply stays where it is.

- `BookmarkTabContent.splitBranches`
  The split: a folder owns an entry in **every** branch it stands in, and a leaf travels with the
  branch its kind belongs to.

- `BookmarkTabContent.refreshCaches`
  Mirror facts are read at render time, so a cold store still draws the row and a chip with no
  record stays dim; chapter leaves inherit their study's record. Gone is proof, not absence:
  `goneNodes` mirrors the leaf stamps a read left behind.

- `BookmarkTabContent.refreshCaches (at `this.hayRevision = this.sync.publishRevision...`)`
  What revision of the mirror these caches answer for. The mirror lands off the critical path, so
  a view built before it does refreshes itself - see `bookmarkView`.

- `BookmarkTabContent.haystackFor`
  The haystack: name + topics + description + owner + members + chapter names + chapter tag
  values, spelled by the registry row so each kind owns its own fields.

- `BookmarkTabContent.haystackFor (at `return [node.label, node.meta?.title, node.m...`)`
  A leaf the mirror has no record for: the label and whatever `meta` captured at add time are all
  the tree may claim to know.

- `BookmarkTabContent.searchQuery`
  Reuse `RecordsSearchEngine.run` rather than writing a matcher - the weights and
  `matchingChapterFields` already exist, so the textbox is the old Search tab minus its form.
  Cached per query + mirror revision.

- `BookmarkTabContent.passes`
  Chips and textbox are one filter model - a study a chip hides is not searched either.

- `BookmarkTabContent.passes (at `if (this.filters.access != 'all' && row?.can...`)`
  Every writeable study is already readable, so the pair the chip offers is `Writable` vs
  `Readonly` (a leaf that can be opened but not written - "no write"), not readable-vs-writable.

- `BookmarkTabContent.matchesQuery (at `if (node.kind == 'chapter' && this.hits?.has...`)`
  A chapter leaf hits when its study hit and the engine named that chapter, or when its own label
  does.

- `BookmarkTabContent.matchesQuery (at `const label = String(node.label ?? '') + ' '...`)`
  A leaf whose record never arrived still answers by its label - the tree never depends on a fresh
  harvest, and the fail-soft keeps an unknown kind renderable at all.

- `BookmarkTabContent.rows.visit (at `if (!isFolder && !children.length) return [{...`)`
  A leaf that grew a `children` array (the tree lets any item parent any other) is a parent too:
  its subtree is visible by default and the caret hides it, so the shape reads naturally without a
  click. A folder keeps the old default - hidden until opened - and the caret brings the branch
  out.

- `BookmarkTabContent.results`
  The whole tree paints: a tree taller than the dialog only grows its scrollbar, so opening a
  folder can never move rows out of reach below the fold.

- `BookmarkTabContent.kindCounts`
  The header prints one line per kind present, plus `shown / total` and the filed/database counts.

- `BookmarkTabContent.isGone`
  Gone means a read proved it: the leaf carries the stamp, or the mirror record says so. An
  unknown kind stays fail-soft gone - the tree keeps the row and marks it, nothing is dropped.

- `BookmarkTabContent (at `treeStudyIds(nodes = this.entries, ids = new...`)`
  The studies the tree holds. The local db keeps a capture only for what this names, so opening a
  study you do not own costs a record for a row that needs one, not an unbounded file - and a leaf
  that leaves the tree loses its capture with it.

- `BookmarkTabContent.hoverRead`
  A row the mirror has never seen gets its facts on hover: one read per study per page, capped and
  spaced like the harvested pages, and the read is persisted, so the tooltip that follows answers
  on every later page as well. A row that stays uncaptured keeps its row.

- `BookmarkTabContent.hoverRead.harvest (at `this.hoverReads.delete(node.id);`)`
  The row stays uncaptured, and a later hover is allowed to ask again.

- `BookmarkTabContent.folderNodes`
  Every folder the tree holds, in paint order - what the fold-all chip counts and acts on.

- `BookmarkTabContent.parentNodes`
  Every node that can be opened - a folder or a leaf that grew a `children` array - in paint
  order. A leaf with children is a parent for the caret, so expand-all and the fold-all chip have
  to walk it the same way they walk a folder.

- `BookmarkTabContent.newFilterBox`
  The textbox a window types into: the frame builds it once and keeps it, because a paint that
  replaced it would take it off the page for a moment - and an input that leaves the page loses
  the keyboard on it, so the next letter lands at the wrong end of the word.

- `BookmarkTabContent.viewHost`
  The tree host a window paints into, carrying the listeners that belong to the tree itself. One
  listener per event lives here and answers through `rowIndex`, so a repaint replaces a thousand
  rows without registering anything on them: per-row listeners would leave their entries behind in
  any page-wide listener table and pin the rows they sat on.

- `BookmarkTabContent.viewHost (at `this.undoStack = [];`)`
  A fresh window opens with a fresh gesture chain - undo is scoped to the dialog, not to the tab's
  whole life.

- `BookmarkTabContent.viewHost (at `this.pendingDrag = undefined;`)`
  Press-move-release page drags (see `dragArm`): the pending source element and how long the press
  has been travelling.

- `BookmarkTabContent.viewHost (at `const pressWindowMs = 500;`)`
  Two presses of the same row inside the double-click window are one open gesture. The browser's
  own `dblclick` cannot be the only answer: the first press repaints the row, and a browser keys a
  double click on the element under the pointer, so a press that hands over a new row never fires
  the event. The pair is read here as well, and the gesture runs on the press that closes it - a
  plain press only selects, so the pair is what opens the row.

- `BookmarkTabContent.viewHost (at `const closePress = (entry, at = Date.now()) ...`)`
  True when this press closes a pair; a closed pair leaves no press behind, so a third press is a
  fresh single press rather than another pair.

- `BookmarkTabContent.viewHost (at `const openedPress = (entry, at = Date.now())...`)`
  A gesture a pair already ran: a browser that does fire `dblclick` must not run it twice.

- `BookmarkTabContent.viewHost (at `const rowClick = async (ev) => {`)`
  A row click selects; the chips a row wears answer first, and a click that hits a link, a control
  or the textbox belongs to whatever owns it.

- `BookmarkTabContent.viewHost (at `const hoverBoards = new Map();`)`
  The hover board cannot live inside the window: lichess styles boards and their pieces from a
  sheet scoped under the page's `main`, and no rule in it can cross into a dialog - inside the
  window a chessground would always come up blank. So the chessground hangs off `main` itself,
  wearing lila's own mini-board contract (`mini-board mini-board--init` + `data-state`
  "fen,orientation,lastMoveUci"), which makes it look exactly like the page's boards with the
  current themes. Ours is only the fixed container it sits in (`records-db-mini-board`): the row's
  first hover births one under `main` and hands it to `initializeDom` - lila builds the
  chessground inside and strips the marker class - and every enter re-pins the container inside
  the row's tooltip when that reading carries a board slot, or over the hovered row when it does
  not; the hover-out hides it. One chessground per hovered row persists on the page, ready for the
  next enter.

- `BookmarkTabContent.viewHost.hoverShow (at `const rowEl = lt.$(node);`)`
  The fixed slot wants viewport numbers, and cash's `offset()` answers in page coordinates - which
  drift under a scrolled dialog - so the pin reads the raw rect of the slot it parks in and of the
  container, the same source `showStudyPopup` places from, and stays clamped inside the viewport.

- `BookmarkTabContent.viewHost.hoverShow (at `const popupWrap = lt.$('#' + popupId);`)`
  A reading that carries a board reserves the square for it (the `popup-board` item), so the board
  lands inside the tooltip; a row with no reading floats the square over its own right end.

- `BookmarkTabContent.viewHost.rowMouseOver (at `if (info.preview && info.itemHover) {`)`
  The profile card is not asked for here: the paint hands every profile row's box to
  `powertip.manualUser` as the row lands on the page (see `bookmarkView`), so the card is already
  up before a pointer arrives and a repaint keeps it fresh. Only a pointer over the item raises a
  reading: `popupNodes` holds the content box with everything under it, so a hover over a row's
  padding or its chips asks for nothing.

- `BookmarkTabContent.viewHost.rowMouseOver (at `cancelPopupHide();`)`
  A row arriving spends a hide the pointer left on a nearby tooltip, then shows this row's facts -
  one gesture, one tooltip.

- `BookmarkTabContent.viewHost.rowMouseOver (at `hoverShow(info.entry, info.node);`)`
  The board pins after the tooltip so it can park inside the reading rather than float over the
  row as a second box (see `hoverShow`).

- `BookmarkTabContent.viewHost.rowMouseOver (at `if (info.profile) this.requestUserRead(info....`)`
  A profile row that carries none of its own facts grows them from one read; the row repaints once
  the read lands.

- `BookmarkTabContent.viewHost (at `if (!this.pageDragAttached) {`)`
  The tree host can never see a page drag's drag events (they bubble up the dragged element's
  ancestors, not the drop point's), and Chrome may refuse the drag outright - so the
  press-and-hold path listens on mouse events. This cash shim's `.on` attaches to the wrapped
  element only, so a body handler never sees a press whose target lives in the rest of the page:
  on the real page the listeners go on `document` in the **capture** phase - fired top-down before
  any in-page handler, for every element. (The harness mock has no real document; there the cash
  attach on the body stands.)

- `BookmarkTabContent.viewHost (at `doc.addEventListener('dragstart', (e) => thi...`)`
  Chrome promotes some page presses into real drags (their chapter list handler allows it) and
  then swallows the mousemoves - so the same gesture reads the drag family too, at the document
  where capture listeners answer rides no matter which ancestors the dragged element lives under.

- `BookmarkTabContent.viewHost (at `this.enrichFromPage();`)`
  The page this window opens on may already know fresher facts than the tree kept - a visit
  re-names a filed study from the mirror, a profile re-reads a filed player.

- `BookmarkTabContent.select`
  The selection model stays: identity of the entry object is the key, a folder selects with its
  branch.

- `BookmarkTabContent.toggle`
  Flip the caret for a node that can be opened. Folders remember the open side; leaf-parents
  remember the closed side, because a filed study that grew filed chapters reads more naturally
  when it starts visible.

- `BookmarkTabContent.toggleAllExpanded`
  One press for every openable row, kept in the caret's reading: anything still closed means the
  press opens the tree, everything open means the press folds it back. Leaf-parents are walked
  with folders so the "all" gesture sees every row that carries a caret.

- `BookmarkTabContent.shapeChains`
  The shape the user left, written into the window blob at `freeze`: each row is the chain of
  names and ids that leads to it, so the next page finds the same row whatever the tree did to its
  order in the meantime - a drag or a rename re-sorts with the record names the previous page had
  never seen, and a position would land the folder on the row that took its slot. A row that names
  nothing falls back to its slot in its parent, so a chain always exists.

- `BookmarkTabContent.frozenView`
  Only a tree that has been read has a shape to hand over. A page that opens the window before its
  content is read has no opinion, so it must not answer with an empty shape - that would spend the
  shape the page before left in the blob.

- `BookmarkTabContent.frozenView (at `const missing = [...this.expanded, ...this.c...`)`
  A row of the shape that is not in the tree any more is dropped from the write: the next page
  cannot name it, and a shape made only of such rows writes nothing at all. The line spells the
  rows that went, so a live page can see whether its own state drifted or the write did.

- `BookmarkTabContent.restoreView`
  The other half of the round trip: the walk names the rows the rebuilt tree has by the same
  chains, and only the ones the blob still carries come back - a chain the tree no longer has
  simply leaves that folder collapsed. The count goes to the log because a page can only be
  checked where it ran: a short number here says the shape is being lost in the page, not in this
  tool.

- `BookmarkTabContent.restoreView (at `if (rows.length && !view)`)`
  A row for this tab with no shape in it means the page that wrote it had no tree read yet, so the
  shape it carried was never put down - the carry in `saveWindows` is what answers for that page,
  and this line says when it did not.

- `BookmarkTabContent.rowTarget`
  The row a hit element falls on: the row itself, one of its children, or one of the chips a row
  wears. A press lands on the icon inside a chip rather than on the chip, so the answer climbs to
  the nearest button before it looks for the row. The answer also says whether the pointer sat on
  the item itself, which is the only place a reading answers.

- `BookmarkTabContent.insertionTarget`
  The drop half of a drag: the upper half of a row inserts before it, the lower half of a folder
  drops inside it, otherwise after the row next sibling. The node is the element the marker sits
  on - the row the pointer fell on, or the marker at the end of the tree.

- `BookmarkTabContent.insertionTarget (at `return { parent: entry, before: entry.childr...`)`
  The tool's own split: any item may parent any other, so the row kind answers neither way, and
  the lower half reads the pointer's x instead - a pointer left of the child line (`4px + depth
  * 12px` plus one 12px step, the two numbers tool.css marks with) keeps the row's parent and
  names the row's next sibling, and a pointer over the row body hangs the payload under the row.
  An empty leaf has no children yet; `drop` opens the array on the first push.

- `BookmarkTabContent.dragOver (at `if (!(transfer.types || []).includes(records...`)`
  A ride another source started - the study tool's draggable chapter buttons, a default-draggable
  link - carries their payload type, never ours. Accepting it here is what makes Chrome fire the
  `drop` over the tree; the commit reads the dragged element, so we accept without ever reading
  their payload.

- `BookmarkTabContent.pageLeaf`
  The shapes a page hands the tree, one flow for every kind: a study-page chapter button carries
  its own `data-id` and wears its `<h3>` as the name; anchors carry the URL the registry opens -
  study `/study/ID`, game `/game/ID`, a bare id, or the 12-char full id whose tail names the
  player and keys the same game by its first 8, player `@/Name` (the modern shape; the quoted
  `/'Name'` is the same leaf) with the power-tip fields, puzzle `/training/theme/n`. A shape the
  table does not know names nothing: a tournament page has no kind of its own, but its player
  links name players.

- `BookmarkTabContent.pageLeaf (at `const study = /^\/study\/([a-zA-Z0-9]{8})$/....`)`
  Names come from the item's data. Where the drag had only the link text (study, game, puzzle),
  the text waits as `meta.nameTemp = 'page'` and the data name replaces it when a read or an open
  lands. Slugs and handles are item data already, so those rows name themselves from the url.

- `BookmarkTabContent.pageLeaf (at `const forumPost = /^\/forum\/([a-z0-9][a-z0-...`)`
  A name read off the url waits for the item's own data, so it carries the `slug` marker.

- `BookmarkTabContent.pageLeaf (at `const broadcastGame = /^\/broadcast\/([a-z0-...`)`
  Broadcast links: reaching the underlying study (or a round named) files the game of the relay,
  otherwise the relay itself. Both carry the RadioTower mark and open on the broadcast route. A
  round builds all of its boards from one study, so the board's own chapter is what tells them
  apart: the leaf keys on the chapter when the link names one and the round's study rides under
  `roundId`, which is the half the route rebuilds - two boards of one round then file as two
  leaves. The link's own text names the board (the chapter is usually the two players); the relay
  it belongs to answers in the tooltip.

- `BookmarkTabContent.pageLeaf (at `const onPage = this.pageInitBlob();`)`
  A drag off the board's own page may record the game that page plays - the same fact a visit
  records - so a later visit to that game page dresses the row. Another board's link on the page
  names a different chapter, and its game is not this row's to keep.

- `BookmarkTabContent.pageLeaf (at `const coach = /^\/coach\/([a-zA-Z0-9_.-]+)$/...`)`
  The routes that hang off a page of their own: a coach and a streamer are user handles under
  their route, a team is a free-text name, a tournament an id. `/team/me` is the list of the
  current user's teams, so it names no team.

- `BookmarkTabContent.pageLeaf (at `const tournament = /^\/(tournament|swiss)\/(...`)`
  A ladder is an id under its own route, and the route says which kind of ladder it is:
  `/tournament/` runs an arena, `/swiss/` runs a Swiss - the pages answer the same way.

- `BookmarkTabContent.pageLeaf (at `const route = this.lichessRoute(href);`)`
  A lichess route the table has no kind for is still an item: the leaf **is** the url, the link
  text is the name that waits, and the page gives the row its title when it opens. Off-site links
  file nothing - the extension controls no other page.

- `BookmarkTabContent.pageLeaf (at `label: label() || route,`)`
  The link text names the row until the page it opens names the row itself, so the title of the
  page - not the route - is what the row spells.

- `BookmarkTabContent.externalDrop`
  Drags that start on the page rather than on a row still land here: the source is any element
  `pageLeaf` can name, and the tree answers by opening a fresh leaf under the pointer. `dragend`
  fires with the dragged element in `target`, so the landing row is read from `currentTarget`
  instead, and a leaf the tree already holds re-lands only when the release is over a row - a bare
  re-drop (no row under the pointer) keeps it where it is.

- `BookmarkTabContent.externalDrop (at `if (this.siblings(held) === (target.parent?....`)`
  A carry of a row the tree already holds lands as a move when it stays among the siblings it has
  now - a twin beside its own copy would say nothing. Let go over a **different** parent, the
  gesture files a copy there and leaves the original in place: the same item can hang in two
  folders, and every visit later dresses each copy.

- `BookmarkTabContent.stampParentOf`
  A page drag read the parent its url names - a round knows the relay it came from, a chapter the
  study - and a pointer that landed where no parent answers would otherwise drop the leaf at the
  root and lose that stamp. When the tree already holds that parent the fresh leaf hangs under it,
  so a second board of a relay rides the board already filed there rather than the row the press
  happened to hover on; a parent the tree does not hold stays as the pointer said, since inventing
  a row for a link the user never meant to file would surprise the tree.

- `BookmarkTabContent.parentStamp`
  The stamp a leaf carries for the leaf-parent it belongs to: `parentId` is the current spelling,
  `studyId`/`blogId` the older ones the store still reads.

- `BookmarkTabContent.dragArm`
  A drag from the page is our own gesture, read from whatever events survive - never the browser's
  drop. The page splits in two: lichess parks most sources inside containers it marked
  `draggable="false"`, and Chrome answers those presses with its no-drop cursor and **no drag
  event ever fires**; the study chapter list is the opposite - its own handler lets the press
  start a real drag, and Chrome then swallows the mousemoves and ends the ride with a `dragend`
  that bubbles only up the dragged element's own ancestors. So the tree listens once, on
  `document` in the capture phase, for **both** event families: any press outside the tree arms a
  pending carry of the element under the finger (nothing is pre-selected from a list of page kinds
  - the tree decides at the drop), travel counts from mousemove or dragover, and the commit
  happens on `mouseup` for pure mouse gestures and on `dragend` for the ones Chrome promoted. Drag
  events name the dragged element in `target` and say the point under the finger only as
  `clientX`/`clientY`, so those landings come from `rowAtPoint`. We never call preventDefault on
  dragstart: lichess's own rides (chapter reordering inside its list) keep working, and a ride
  that means our tree still commits because we own the drop. A press without travel is a click; a
  release outside the tree and a source the table cannot name spend nothing.

- `BookmarkTabContent.dragEv`
  A raw DOM event is not cash-wrapped, and the gesture reads only these fields.

- `BookmarkTabContent.dragMove (at `if (ev.buttons !== undefined && !(ev.buttons...`)`
  Only travel while the left button holds the source - `buttons` is the DOM bitmask.

- `BookmarkTabContent.dragMove (at `const dbgLanded = this.rowTarget(ev);`)`
  The marker answers the pointer while the travel rides over the tree, so the release point is
  visible before the release happens.

- `BookmarkTabContent.showDropMark`
  The gesture's feedback: the half-row under the pointer wears the drop mark the paint already
  draws for in-tree moves. Every move re-marks, so leaving the tree clears it.

- `BookmarkTabContent.rowAtPoint`
  A drag event names the dragged element, never the place under the finger - the landing row for a
  promoted ride has to come from the pointer's own coordinates.

- `BookmarkTabContent.treePointHit`
  An empty tree has no row to land on, yet the drop belongs to it: the tree list stretches to fill
  the window body, so a point inside that box is a root drop - the same answer the end marker
  gives. A point on the page outside the window names no tree.

- `BookmarkTabContent.dragStartGlobal (at `const dragged = this.lichessTools.$(ev.targe...`)`
  Chrome's handler picks its own draggable to ride; trust it only when the tree would name that
  element too.

- `BookmarkTabContent.dragEndGlobal`
  Chrome's own ride ends on the page - its drop never happens over our tree. The commit is ours:
  landing from the pointer's point, source from the held element.

- `BookmarkTabContent.dragRelease`
  The release lands in the tree only after real travel - a press without movement is a click, and
  a release outside the tree spends the gesture with nothing to do. The source is named here, not
  at the press: the tree decides what the held element means, and anything the table cannot name
  files nothing.

- `BookmarkTabContent.dragRelease (at `if (!pending || pending.moves < (pending.nat...`)`
  The ride Chrome promoted had its `dragend` turn already; a carry still alive at the release
  answers the mouse instead, and one event of travel is enough there.

- `BookmarkTabContent.playerEntry (at `const title = src?.attr('title') ?? '';`)`
  The page may carry no tip at all, and an attribute cash has not found answers nothing - the empty
  string is what the reads below expect, so a missing attribute never spells "null" into a match.

- `BookmarkTabContent.playerEntry`
  A player leaf made from a user link: the link names it, and the power tip the page parks next to
  it fills the meta - flag, flair, ratings, game count, joined. Whatever the tip does not show
  stays absent rather than guessed.

- `BookmarkTabContent.canAttach`
  Any item may sit inside any other item, so the tree holds a study over its chapters and
  positions, a game over a puzzle, and folders over anything. Only the containment loop refuses -
  a parent that already lives under the branch being moved, which would eat rows. `canDrop` checks
  that loop before asking, so a folder is never the answer.

- `BookmarkTabContent.stampParent`
  The only outright rejection (a folder nested inside one of its own descendants) plus the two
  containment checks above. A leaf that sits under a leaf parent names that parent in meta: the
  blob of the child's own branch cannot keep a parent that belongs to a different branch, so the
  name is what rebuilds the nesting on the next page. A folder parent needs nothing - folders join
  by name in every branch - and moving a leaf to a folder or to the root takes the stamp away.

- `BookmarkTabContent.stampParent (at `if (this.registry[node.kind]?.containment) r...`)`
  A contained kind (a chapter, a study position, a blog post, a forum thread, a relay game)
  already names its real parent, and that name is what rides its blob - a drag inside the tree may
  sit it somewhere else for now, but it must not rewrite that name.

- `BookmarkTabContent.drop (at `if (incoming.includes(before)) return;`)`
  A page drag carries the leaf itself rather than a path, so the same two rules the path drop
  applies have to hold here too: a leaf the tree already holds leaves the slot it leaves, and a
  drop that names the slot it already occupies spends nothing. Without the first one a filed leaf
  re-filed from a page link lands in the tree twice.

- `BookmarkTabContent.drop (at `for (const entry of incoming) this.stampPare...`)`
  Every payload root re-names its new parent, so the next page's merge hangs it back.

- `BookmarkTabContent.drop (at `if (parent) {`)`
  Opening the parent keeps the drop visible on the page that made it. For a folder that means
  putting it in `expanded`; for a leaf-parent the default is already open, so the only thing to do
  is clear any collapse the user left on it.

- `BookmarkTabContent.drop (at `for (const entry of incoming) {`)`
  The page only ever named the puzzle or the game - its board, its players and a team's real name
  with flair are one read away, so the leaf grows its meta right after joining.

- `BookmarkTabContent.requestPuzzleRead`
  One read per id fills the leaf's meta with the fen the hover board paints from, the side to move
  stored straight as the orientation - the board is shown from the side that moves, so the solver
  sits closest - and the puzzle's own last move. The answer arrives async: a hover before it shows
  no board, and the merge repaints once it lands. A read that does not answer stays uncaptured, so
  the next open asks again.

- `BookmarkTabContent.requestGameName`
  The game sibling: one read per id names the leaf from the players and parks the control and
  variant for the row's icon. A read that does not answer stays uncaptured, so the next open asks
  again; a hand-renamed row keeps its title because the rename cleared the waiting marker.

- `BookmarkTabContent.requestUserRead`
  A profile the tree holds but no page named (a dragged user link, a coach or a streamer route)
  asks the api for its own facts: the title the site puts on the handle, the flair it wears, the
  ratings it holds and the day it joined. The row paints the title and the flair; the ratings and
  the join date answer the tooltip, while the **card** the site itself shows is asked for as the
  row renders (see `powertip.manualUser`). The blog of such a user asks the same read for its
  author - the page spells the author as "CM HandKnit", a title before the handle - and takes only
  the two facts a blog can wear, since a blog holds no ratings of its own.

- `BookmarkTabContent.requestUserRead (at `const ownerOnly = copies[0].kind == 'blog';`)`
  The six controls the site lists first, in the order it lists them, and only the ones it really
  has a rating for - unless the row is a blog, which wears no ratings of its own.

- `BookmarkTabContent.save`
  One save per mutation, and it writes **each branch** through the store so filing a study
  rewrites the study branch only - the lock the store holds is that branch's key, never the whole
  tree.

- `BookmarkTabContent.save (at `if (this.entries?.length) this.sync.setTreeI...`)`
  A save with nothing loaded yet would prune everything, so only name the tree when there is a
  tree to name - every successful load prunes on its own anyway.

- `BookmarkTabContent.pageInitBlob`
  The blob the page carries: the `PageInitData` tool exposes it as the lazy `lt.pageInitData` once
  the page has dropped the script, and a page that has not dropped it yet still holds it in the
  DOM - either way no request. The DOM half is read once per page and kept for the calls that page
  makes, so a repaint does not re-parse it.

- `BookmarkTabContent.resolvePageLeaves`
  Add is one flow - file the page object, harvest it so the new row is searchable, save once - and
  it widens to "add whatever this page is". The page can name up to four rows at once: the study,
  its current chapter, a bare FEN position, and a study position (chapter + node path). The list
  is the dropdown's menu and `addChoice` is what Add actually files.

- `BookmarkTabContent.resolvePageLeaves (at `const initChapter = init?.chapter ?? initStu...`)`
  The blob nests the chapter the page shows inside the study it belongs to, so a top-level
  `chapter` is the older spelling kept for pages that still spell it there.

- `BookmarkTabContent.resolvePageLeaves (at `const broadcastMatch = /^\/broadcast\/([a-z0...`)`
  A relay page analyses a study under the hood - `study.relay` is the flag that says broadcast,
  not study - but the url is what names the page, so the relay pair owns these leaves and the
  study shapes below must not lean on the relay analysis.

- `BookmarkTabContent.resolvePageLeaves (at `meta: {`)`
  The study page names its own flair and owner; both ride in meta for the popup and the flair
  image, and a blob that shows neither leaves the row undressed.

- `BookmarkTabContent.resolvePageLeaves (at `if (!chapterId && analysis && !broadcastMatc...`)`
  The chapter the analysis is on lives on `analysis.study`, not on `analysis` itself - the pattern
  every other tool in the project reaches for (`analysis.study.currentChapter()`).

- `BookmarkTabContent.resolvePageLeaves (at `if (chapterId && !chapterLabel && studyId) {`)`
  A chapter read off the URL names no label, so the mirror of the study the page is on supplies
  the chapter's own name - an empty label would make the row print its parent.

- `BookmarkTabContent.resolvePageLeaves (at `const route = lt.location?.pathname || '';`)`
  A page that is not a study still names its own object, so Add on any page files what the page is
  about: a profile page names the player (`@/Name` is the modern shape and the quoted `/'Name'`
  the legacy one), a training page names the puzzle, a game page names the game. The shapes are
  the registry's own openUrl forms. The page's own object also comes from the url where the blob
  misses it: blogs live under the author (`@/Name/blog` now, the quoted `/'Name/blog'` the same
  route), forum boards and threads under `/forum`, and a coach, a streamer, a team and a
  tournament under their own routes. `/team/me` is the list of the current user's teams, so it
  names no team - and a profile shape never swallows the routes that hang off a user.

- `BookmarkTabContent.resolvePageLeaves (at `const foundHeading = lt.$('h1.ublog-post__ti...`)`
  The post names itself on its own page: the heading is the title, the standfirst under it is the
  subtitle, and the picture the post opened with is its image - the classes lila names on those
  three, with the older block shapes kept as fallbacks.

- `BookmarkTabContent.resolvePageLeaves (at `const subject = this.pageTitle();`)`
  A thread names itself with its subject on its own page - the route's slug is only a truncated
  echo of it - and the first profile link under the posts is the writer the page shows, which no
  slug carries.

- `BookmarkTabContent.resolvePageLeaves (at `const teamId = decodeURIComponent(team[1]);`)`
  A team page carries the name and the flair a route can only spell: the title block
  (`div.box__top h1.text`, the flair img inside it) names the team and says how many members it
  has. The name it spells is the item's own, so it clears the waiting `slug` marker.

- `BookmarkTabContent.resolvePageLeaves (at `const tourneyTitle = this.pageTitle();`)`
  The two routes spell the same item differently: an arena names its ladder `fullName` and opens
  it at a `createdAt` epoch, a swiss names it `name`, opens it at an ISO `startsAt` and says how
  it ended under `status`. Both spellings are read, and a page whose blob names no ladder at all
  falls back to the title its own tab spells - the site's own words are never a name.

- `BookmarkTabContent.resolvePageLeaves (at `const tourneyStarts = Number(tourneyData?.cr...`)`
  A swiss start is an ISO date, an arena start an epoch; either way the row prints the day the
  ladder opened.

- `BookmarkTabContent.resolvePageLeaves (at `const standing = [...(tourneyData?.standing?...`)`
  The standing the page showed is the ladder's own one-page window; keeping it as the page spelled
  it (name, flair, rating) is what the tooltip reads back. A swiss hangs the three under the
  player's own `user`, an arena spells them on the card.

- `BookmarkTabContent.resolvePageLeaves (at `system: tournament[1] == 'swiss' ? 'swiss' :...`)`
  The route says how the ladder runs; the blob says nothing about it.

- `BookmarkTabContent.resolvePageLeaves (at `...(tourneyData?.isFinished === true ||`)`
  A ladder that has already finished has no start left to show - the row keeps only its name and
  its mark. A swiss says so under `status`, an arena with a flag.

- `BookmarkTabContent.resolvePageLeaves (at `const boardOrientation = analysis?.getOrient...`)`
  The hover board redraws the page's own view: the orientation it showed the board in and the UCI
  of the move that reached the node ride `meta`, so a restored leaf highlights the move its label
  already names. The path is an array of UCI moves, so its tail is that move.

- `BookmarkTabContent.resolvePageLeaves (at `if (chapterId && studyId && analysisPath) {`)`
  A node path is not readable, so a study position files where it is: the chapter it lives in and
  the move that reaches it, in lichess's own move label. `ply`/`san` ride in `meta` so a leaf that
  loads from a blob with no label can still say it, and `nodePath` stays the path the open jump
  needs.

- `BookmarkTabContent.resolvePageLeaves (at `orientation: analysis?.study?.data?.chapter?...`)`
  The chapter says how its own board is set, and that outranks the view this import happened to
  watch - importing from a flipped board must not flip the leaf.

- `BookmarkTabContent.resolvePageLeaves (at `const pageGame = init?.mode == 'replay' ? in...`)`
  What the page is about also arrives in `pageInitData`, where the url does not name it: a replay
  page names its game under `cfg` and a plain game page names it under `data`, the players feeding
  the row's title and the speed and variant its icon; the training page names its puzzle in
  `data.puzzle`, the themes giving the type name straight away - the same wording the api read
  uses when it answers. These are data names, so they also clear a waiting page-text marker on the
  rows they rename. A 12-char game url carries only the full id, so the blob's own 8-char one is
  what keys the leaf.

- `BookmarkTabContent.resolvePageLeaves (at `if (broadcastMatch) {`)`
  A relay page names its pair instead: the relay itself comes from the slug, and the url reaching
  the underlying study (or the relay analysis saying which study is on) names the game of this
  round. The route rides in `meta` so the open stays on the broadcast page. A relay's rounds all
  name themselves "Round <n>", and every board of a round is one game of that round, so the row
  wears the chapter the round's study plays - usually the two players - while the relay and the
  round answer in the tooltip.

- `BookmarkTabContent.resolvePageLeaves (at `const pageBoard = broadcastMatch[4] ||`)`
  A round builds every board of one round from a single study, so the study alone cannot key the
  rows - it would fold the boards into one. The board's own chapter keys its leaf (the route names
  it, or the page is reading it when the route stops short), and the study the route opens with
  rides under `roundId` so the open jump spells the round's address. A round page that names no
  board at all - the relay's own model game - keeps the study.

- `BookmarkTabContent.resolvePageLeaves (at `const boardChapterName = pageBoard && pageBo...`)`
  The chapter the page is reading is the board this page is about, so its name is the row's; a
  page that names no board has no chapter name to spend on the row.

- `BookmarkTabContent.resolvePageLeaves (at `const relayWord = String(`)`
  The relay's own title answers in words; the slug humanised is what the route spells when the
  page shows no title of its own. The flag saying "this study is a relay" rides beside the study
  data, and so does the relay's own name.

- `BookmarkTabContent.resolvePageLeaves (at `label: boardChapterName || relayWord || unde...`)`
  A board is one game of the round, and the study chapter it plays names it - usually the two
  players. The relay's own name would repeat on every board of every round, so it answers in the
  tooltip instead (see `popupFacts`).

- `BookmarkTabContent.resolvePageLeaves (at `...(gameKeyId(init?.data?.game?.id) ? { game...`)`
  The game this board plays rides in meta: the row's key is the chapter, so a visit to that game
  page reaches the row through this (see `enrichFromPage`). A playable chapter the page made up
  itself spells "synthetic", which is no game id.

- `BookmarkTabContent.resolvePageLeaves (at `...(broadcastMatch[2] ? { roundLabel: this.h...`)`
  A named round reads as words in the popup; the route's own slug stays the relay.

- `BookmarkTabContent.resolvePageLeaves (at `...(Number(analysisStudy?.data?.createdAt) >...`)`
  The relay builds each game from an underlying study, and that study says when it opened - the
  round's own date.

- `BookmarkTabContent.resolvePageLeaves (at `const clock = pageGame.game?.clock;`)`
  The control the page shows is the PGN's own spelling: initial plus increment, the way the export
  writes the TimeControl tag; a clock with a missing half has nothing to spell.

- `BookmarkTabContent.resolvePageLeaves (at `const statusName = typeof pageGame.game?.sta...`)`
  The page names the ending in its own words; a bare status id says nothing to a row.

- `BookmarkTabContent.resolvePageLeaves (at `...(String(pageGame.game?.fen ?? boardFen ??...`)`
  The position the game ended on rides along so the hover can paint the mini-board the row's facts
  are read from: the blob spells it when the page does, and while the game sits under the
  analysis, the view names the node the board stopped on.

- `BookmarkTabContent.resolvePageLeaves (at `const byShape = new Map();`)`
  One leaf per kind and id: the same object can be named by url and by page data alike, and the
  later page-data leaf replaces the earlier url one, so Add offers each row once.

- `BookmarkTabContent.resolvePageLeaves (at `if (!byShape.size) {`)`
  A page whose route the table knows nothing about is still a page the user can file: the url leaf
  is named by the page's own title, and the row follows that title on every visit. A route the
  table deliberately calls nameless (a list of the user's own teams) stays nameless.

- `BookmarkTabContent.resolvePageLeaves (at `label: title || route,`)`
  The row wears the title its own page gave - a route is not a name. A page that spells no title
  leaves the route standing, and every visit re-titles the row.

- `BookmarkTabContent.pageAddKinds` - The dropdown's menu: the kinds the page can name right now.

- `BookmarkTabContent.pageMainKind`
  The object the page itself is about, from its route: what Add files when the dropdown has not
  picked another kind, so a blog page files the blog, a blog post page the post, a forum board the
  board and a forum thread the thread. A page that names no route of its own (an open study, an
  analysis board) answers undefined and the first candidate stands in.

- `BookmarkTabContent.hydrateLeaf`
  The one writer every source goes through. A title is temporary until the user chose one: a name
  the item answered for itself replaces a page text or a slug, and a hand rename outranks every
  pass - only the data keys grow there. A source that names nothing about a row leaves it alone,
  and meta merges key by key, so a key the source does not show stays as it was.

- `BookmarkTabContent.hydrateLeaf (at `if (incoming.dataName === true && existing.m...`)`
  A name the item answered for itself is no longer a title that waits.

- `BookmarkTabContent.hydrateLeaf (at `const sameFact = (left, right) =>`)`
  A fact that spells as a list (a standings block, a ratings set) is worth keeping whole, so it is
  worth writing only when its **content** differs - comparing objects by identity would rewrite
  the same block on every visit and make each visit look like a change.

- `BookmarkTabContent.teamFacts`
  What a team element spells: its own text with the list marker (`<em>leader</em>`) taken off, and
  the flair img it carries. The name and the flair a team page title or a list row shows.

- `BookmarkTabContent.teamFacts (at `const kept = lt.$(el).clone();`)`
  The clone is what gets read: the marker is taken off the copy, so the row's own text keeps
  whatever the page put around it.

- `BookmarkTabContent.pageTeamRows`
  What the page says about teams, in the shapes that carry a name no url can guess: the page's own
  title block (`div.box__top h1.text`, member count under it) and every list row (`td.subject
  a.team-name` on the leader and all lists, `div.teams a` on a profile). Each row is keyed by its
  route so it can be matched to a leaf the tree already holds; these are data names, so they may
  clear a waiting marker.

- `BookmarkTabContent.pageTeamRows.idOf (at `return id && id.toLowerCase() !== 'me' ? id ...`)`
  `/team/me` is the list of the current user's teams, never a team called `me`.

- `BookmarkTabContent.enrichFromPage`
  What the page shows about a leaf the tree already holds rides into that leaf, so visits enrich
  instead of merely re-offering: a study visit renames the row from the mirror, a profile visit
  re-reads the panel fields, a training visit names the puzzle, a team page or a teams list brings
  the name and the flair the url never carried. Only fields the page actually names overwrite;
  anything it does not show stays as it was.

- `BookmarkTabContent.enrichFromPage (at `const gameLeaf = pageLeaves.find((leaf) => l...`)`
  A relay board keys on the chapter it plays, so a visit to the game it plays finds it through the
  game id its board page recorded. The facts that game shows are the board's own; the row keeps
  the chapter name, since that is what tells the boards of a round apart.

- `BookmarkTabContent.enrichFromPage (at `for (const row of this.pageTeamRows())`)`
  A list page names rows without offering them to Add: a team on the list that the tree holds gets
  its real name and flair, and a row the tree does not hold is left out - browsing a list of teams
  files nothing.

- `BookmarkTabContent.enrichFromPage (at `const lt = this.lichessTools;`)`
  A url row **is** a route, so the page it opens names it again on every visit: whatever the page
  turns out to be, its title is the name the row wears and the fact the row keeps fresh.

- `BookmarkTabContent.requestTeamName`
  A team leaf that arrives with no page to name it (a drag of a team link) asks the item for its
  own facts: the team page carries the name, the flair and the member count, and the api read
  answers the name and the count when the page does not. A read that answers nothing leaves the
  leaf waiting, so a later visit or open asks again.

- `BookmarkTabContent.leavesWith`
  Every copy the tree holds for one kind and id. A filing of an item the tree already has, landed
  under a **different** parent, leaves that item in more than one place (the same game in two
  folders), so a pass that reads the item itself - a visit, a list row, an api read the row asked
  for - answers each copy rather than the first one the walk happens to meet.

- `BookmarkTabContent.leavesCarrying`
  A leaf can name another item inside its own meta - a relay board keys on the chapter it plays
  and keeps the game it plays under `gameId` - so a page about that other item finds the leaf by
  the meta it carries rather than by its key. Every copy answers, like every other read.

- `BookmarkTabContent.cycleAddChoice`
  The dropdown's cycle: the kinds the page can name right now, in order. The caret walks the list,
  so a page that lost its chapter next press loses that option and the cycle shrinks.

- `BookmarkTabContent.addCurrentChoice`
  Add files the current choice. If the page no names it, the first kind that is available is used
  rather than refusing, so a page that lost a chapter mid-gesture still files something.

- `BookmarkTabContent.addLeaf`
  The one flow: file the leaf, harvest it so the new row is searchable, save once. `addLeaf` also
  moves the leaf when the tree already holds it, so a re-Add never duplicates.

- `BookmarkTabContent.addLeaf (at `if (leaf) delete leaf.dataName;`)`
  `dataName` is a flag the page read carries to say the name came from the item's own data; it is
  spent on the way in and never belongs to the tree.

- `BookmarkTabContent.addLeaf (at `const parentIsLeafSelf =`)`
  Refuse a self-parent before the move: putting the study the page names inside itself would leave
  a cycle the tree walk could never come out of.

- `BookmarkTabContent.addLeaf (at `const carriedBy = this.registry[leaf.kind]?....`)`
  A contained kind names the item that carries it, so filing one while a **different** row is
  selected lands it beside its carrier rather than inside that row: two boards of the same relay
  then join as siblings of the relay, instead of one hiding under the other.

- `BookmarkTabContent.addLeaf (at `const existing = this.findLeaf(leaf.kind, le...`)`
  A filing that would seat an item inside its own branch would eat the rows under it, so a copy of
  something the tree already holds may not hang under a parent that lives inside it.

- `BookmarkTabContent.addLeaf (at `if (existing &&`)`
  A leaf that names a leaf parent carries `parentId` so a split and merge re-hang it under that
  parent on the next page - `stampParent` writes it for both the moved leaf and the new one. A
  folder parent needs nothing: folders join by name in every branch. An item the tree already
  holds moves when the filing lands among the siblings it has now - a twin beside its own copy
  would say nothing - and when nothing was selected at all, which names no new home. Filed under
  an **explicit** parent that is not its current one it joins as a copy there and leaves the
  original in place: the same game can sit in two folders, and every visit later dresses each copy
  the tree holds.

- `BookmarkTabContent.addLeaf (at `if (parent && !parent.children) parent.child...`)`
  A leaf parent starts without a `children` array, so open one before the first push - otherwise
  `parent?.children ?? this.entries` reads as the root and the leaf lands at the top of the tree
  instead of under its parent.

- `BookmarkTabContent.addLeaf (at `if (parent) {`)`
  Opening the parent keeps the new leaf visible on the page that filed it. For a folder that means
  putting it in `expanded`; a leaf-parent is open by default, so the only state worth clearing is
  a collapse the user left on it.

- `BookmarkTabContent.addLeaf (at `this.save();`)`
  The save names the leaf in the tree first, only then is the read worth persisting - a capture
  the tree does not name yet would be pruned straight away.

- `BookmarkTabContent.folderName`
  New folder asks the page for the name - `lt.uiApi.dialog.prompt` is the precedent other tools
  use. A page with no dialog service (or a cancelled prompt) keeps the default name, so the folder
  is still created rather than the gesture ending half-done. Append passes its own prompt key so
  its text can name where the folder lands.

- `BookmarkTabContent.createFolder (at `if (parent) this.expanded.add(parent);`)`
  Opening the parent keeps the new folder visible; parent is always a folder here.

- `BookmarkTabContent.removeSelected`
  One leaf drops that leaf; one folder drops the folder and its whole subtree. A **leaf that owns
  children** (a study over its chapters, a game over a puzzle) is pruned into as well - only
  `folder` tells a kind-less node apart, so walking folders alone would leave a selected child
  sitting inside its leaf parent.

- `BookmarkTabContent.pushUndo`
  The snapshot records paths (index chains) rather than handles: restoring puts fresh objects
  back, so the three Sets have to name the restored ones again. The entries copy is JSON because a
  drop re-hangs and a rename rewrites nodes in place - a handle would follow the edit and show the
  newer state, not the older one.

- `BookmarkTabContent.pushUndo (at `if (this.undoStack.length > 40) this.undoSta...`)`
  A window that performed a hundred gestures does not keep a hundred trees.

- `BookmarkTabContent.undo`
  The walk back: the newest snapshot becomes the tree, and the Sets point at the restored objects.
  Undo is not itself recorded - undoing an undo is another gesture, not a way back; pressing Undo
  with an empty chain answers nothing.

- `BookmarkTabContent.countSelected`
  The number handed to the confirm is every item the press takes away: a folder carries its
  branch, and a leaf that owns children carries them too. A node inside another selected node is
  counted once, with that node.

- `BookmarkTabContent.confirmCount`
  `dialog.confirm` is the mechanism other option tools use, and its reachability from a study-page
  click handler is unverified - so when the page offers no dialog service the fallback is "press
  again": the first press arms a one-shot 5s bar, the second commits.

- `BookmarkTabContent.previewRestore`
  Restore replaces **per branch** after one confirm that quotes the incoming counts. The counts
  come from the same parse that writes the branches, so what the user saw is what landed.

- `BookmarkTabContent.restoreFromText`
  One flow feeds the entry path the backup rack offers - the `<input type="file">` picker - so the
  IDB blob and the downloaded file read through one parser.

- `BookmarkTabContent.openLeaf`
  The gesture, the open chip and Enter all go through the row `openUrl`. Before it navigates, a
  study leaf leaves the one-shot hand-off naming the study it will land on;
  `RecordsDbCtrl.handoff` spends it. A kind that is not a study has no study to name, so it leaves
  nothing.

- `BookmarkTabContent.openLeaf (at `if (node.kind == 'puzzle' && (String(node.me...`)`
  Opening is a second chance at the data: a waiting name gets its read, and so does a row whose
  board facts are still missing - a renamed game still wants control and variant for its icon, a
  renamed puzzle still wants the fen for its hover board. The awaits run before the page moves, so
  the merge lands where the tree is saved.

- `BookmarkTabContent.openLeaf (at `const navigation = recordsDbInstance?.naviga...`)`
  The honest degradation stays: same study switches chapter in place, another study navigates. A
  study position rides to its chapter and then jumps the analysis to the lichess node the leaf
  names.

- `BookmarkTabContent.openLeaf (at `if (analysis && nodePath && analysis.path !=...`)`
  The page is on the chapter now, not on the node the leaf names. The tree resolves that path into
  a node, and the user jump walks the analysis across to it. A path the tree does not know
  (chapter rewritten, tree not yet rebuilt) leaves the chapter open at its root; the caller still
  sees a successful open because the study moved.

- `BookmarkTabContent.openLeaf (at `node.meta = { ...node.meta ?? {}, nodeMissin...`)`
  The chapter is on the page but the move the leaf names is not in it any more: the stamp is what
  the tooltip reads, so the row says where the landing differs from what it promised instead of
  landing silently at the chapter root.

- `BookmarkTabContent.appendToFolder`
  The one file flow that keeps what is already there: the parse is checked, the name is checked
  against the root folders, and only then does a folder go in - a bad file or a taken name ends
  the press with nothing written. The folder rides at the end of the root array, unsorted, and the
  new folder is left expanded and selected so the rows it brought are on screen straight away.

- `BookmarkTabContent.fileChildren`
  The file's own nesting and its own order come through as they stand. Only a repeat under the
  same parent drops: the same item in two folders stays two rows, and a file that names one item
  twice in one folder keeps its first copy.

- `BookmarkTabContent.appendFolderName`
  The name is asked before the file is picked, through the same prompt New folder uses, so the
  text can say where the folder lands. A page with no dialog service gets the same default name
  New folder answers with, and a default that clashes with a root folder stops the press.

- `BookmarkTabContent.editName`
  Rename is a chip, not an inline edit - the name comes from the same dialog prompt New folder
  asks through, defaulted to the name the folder already carries, so an accepted prompt is the
  only thing that changes and a mis-click cannot eat a name.

- `BookmarkTabContent.editName (at `if (!this.folder(node)) {`)`
  A hand-written name is remembered, not just un-marked: `meta.renamed` outranks every hydration
  pass, so a later read can only grow the row's data - the chosen title stands.

- `BookmarkTabContent.editName (at `delete node.meta.nameTemp;`)`
  A renamed title waits for nothing, and `renamed` is what keeps it through hydration.

- `BookmarkTabContent.renameFolder`
  Rename any item. A folder renames its `name`; a leaf renames its `label` and the next paint
  reads its name back from the mirror record. With no dialog to ask, the current name is kept.

### tool.js - RecordsSearchEngine

- `RecordsSearchEngine.hit`
  10 000 studies score well inside the 250 ms budget - one lowercased substring test per field,
  and the chapter scan only runs when the query can reach a chapter at all.

- `RecordsSearchEngine.chapterFields`
  The fields a chapter matched, spelled the way `studyMatchView` looks chips up by: `name`,
  `description`, `tags.<tagName>` - `tags.white`/`tags.black` carry the player that actually
  matched, so the chip lands under the colour the chapter plays that player in.

- `RecordsSearchEngine.matchStudy` - Weights: name 8, topics 4, description 2, each chapter 1.

### tool.js - module scope

- `popupLeaveMs`
  The pointer leaves a side for one pointer move before it enters the other, so a hide is
  scheduled and cancelled rather than run. See `schedulePopupHide` below.

- `popupShown`
  The anchor whose tooltip is visible right now, and the hide a `mouseout` scheduled

- `treePaint` - The tree revision that owns a row tooltip - see the row anchor below

- `popupData (at `return { items, title, attrs: { 'data-popup'...`)`
  Only the mark rides on the content box: the row already wears its own tab stop, so a keyboard
  walk still steps row to row instead of stopping twice inside each one.

- `popupTargets`
  Every node under an element, itself included: the hover checks a content box as one target, so a
  pointer over the name, a flair or a date counts as the item it sits on.

- `popupNode (at `fresh`)`
  The tooltip is a reading surface, not a decoration - while the pointer sits inside it the
  tooltip stays up, so a pointer can cross from the row into the reading without losing it, and
  leaving the tooltip hides the tooltip the pointer just left.

- `popupNode (at `cancelPopupHide();`)`
  The row's `mouseout` fired first and scheduled the hide; arriving here spends it.

- `showStudyPopup (at `const boardItem = (items ?? []).some((data) ...`)`
  The box is a body child, so these are viewport coordinates: it hangs under the row and is
  clamped to the page. A floor of 8rem is what gives the wheel something to scroll - a box as tall
  as the gap under a low row is a scrollbar over three lines. A reading that carries a board needs
  the square plus the lines under it, so its floor is raised to fit the square and the row can sit
  near the page bottom without cutting the board in half.

- `showStudyPopup (at `item.attr('class', 'popup-board');`)`
  The slot a hover board parks in: the item holds the square, and `hoverShow` pins the container
  over it, so the reading and the board come up as one box.

- `showStudyPopup (at `if (data.dim) item.addClass('popup-dim');`)`
  One line of a list can be dimmed - the entry a chapter row stands on inside the list of its
  study's chapters.

- `showStudyPopup (at `const flair = data.flair ? lt.$('<img class=...`)`
  A fact may wear a picture the item itself named: `flair` is the small mark a standings card
  shows beside a rating, `image` the picture an item opened with.

- `schedulePopupHide`
  A tooltip does not hide on the first `mouseout`: the pointer crossing from a row into the
  tooltip fires the row's `mouseout` and the tooltip's own `mouseover` in the same gesture, and a
  hide that lands between them is what buries the reading before the pointer can reach it. Either
  side schedules a hide instead, and a `mouseover` on either side spends it. The window left is
  one pointer move, never a readable one.

- `hideStudyPopup (at `const node = lt.$(anchor).eq(0)?.[0];`)`
  Only the anchor that owns the tooltip may take it away - a second row's focusout must not hide
  the tooltip another row is still reading.

- `factLine`
  The facts a row prints on one line: what the page named, joined where it named something.

- `localTime`
  A stored epoch prints in the page's own language, the same reading a visit card gives a date; a
  zero or a junk epoch has nothing to print.

- `flairImage` - A page parks the flair value its own data named, and the image url comes from
  `lt.lichess.asset.flairSrc(flair)` of that value; a drag may have parked the url the page
  already spelled, and a lone private-use glyph is the mark a card rendered, not an image.

- `userPageKind`
  The kinds whose page is a profile: a player, and the same page behind the coach and the streamer
  route. The row of such a leaf wears its own mark but dresses and answers like the profile did -
  the power tip the page shows over a user link is the card the row asks for.

- `profilePending`
  A profile row (or the blog of one) that carries none of the facts its page shows is still
  waiting: the one api read brings the title the site puts on the handle, the flair it wears, the
  ratings it holds and the day it joined. Both the hover and the open spend that read.

- `localDate`
  A stored epoch prints the day alone in the page's own language: a row has room for the day a
  ladder opens on, not for the hour it opens at.

- `perfIcon`
  A ladder wears the mark the site gives its run: the perf key the blob spells names the same icon
  the game rows wear for a control, and a run the map has no mark for dresses nothing.

- `interactiveChapter`
  Whether the mirror's record says a chapter is one the reader plays inside: the flag the study
  page names, kept as the blob spelled it. A record with no chapters, or a chapter it never names,
  answers false - the row then wears nothing rather than a guessed mark.

- `roundWords`
  A named round reads as words in meta ("round 2" humanised), but a popup line already carries the
  label, so only the number the round wears is worth printing. A round named by anything else
  keeps its own words.

- `chapterLines`
  The chapter list a study or a chapter answers with: one line per chapter the record names, in
  the order the study holds them. A chapter row dims its own entry so the reading says where the
  row stands inside the list.

- `popupFacts`
  The facts a tooltip answers with are the item's own: every line says something about this leaf -
  never the branch it sits in, never its siblings, never the item that holds it. The row's own
  name is the popup's title, so a line repeats nothing the row already prints, and a kind that
  knows nothing about itself gets no tooltip at all - its mark and its open jump carry it.

- `popupFacts (at `const variantWord = meta.variant && String(m...`)`
  The row's one-line read of a game: control, rated, speed, variant (only when the game is variant
  chess) and the ending, then the day it was played on its own line. The board the game left
  behind rides the hover, not the tooltip - a dialog can never wear the page's board sheet.

- `popupFacts (at `const relayTitle = String(meta.relay ?? '') ...`)`
  A board is one game of a relay round: the tooltip says the relay it belongs to, the round it
  played in, and the chapter it plays. The relay and the chapter are bare lines - they name
  things, they are not a fact with a label - and the row prints the chapter in a row that can cut
  it, so the reading repeats it in full.

- `popupFacts (at `if (String(meta.system ?? '').toLowerCase() ...`)`
  The route says how the ladder runs, and the name of the run is the one thing a row cannot show
  beside its own title.

- `popupFacts (at `if ((meta.standing ?? []).length) facts.push...`)`
  The standings the page showed is the ladder's own fact: one line per player it names, wearing
  the flair that page showed beside the rating. A ladder whose page showed none prints no empty
  block.

- `popupFacts (at `if (meta.subtitle?.length) facts.push({ name...`)`
  The post names itself on its own page: the standfirst under its heading, the author whose blog
  it sits in, and the picture it opened with are the post's own facts.

- `popupFacts (at `if (meta.author?.length) facts.push({ name: ...`)`
  A thread page shows the writer beside the subject; the subject is the row's own name.

- `popupFacts (at `const studyOwner = String(record?.ownerId ??...`)`
  The page blob names the owner and the mirror carries the same fact; the line reads `by <handle>`
  under the title rather than labelling a row the row never prints. The chapters the study holds
  answer as a list - the row wears only their number.

- `popupFacts (at `{`)`
  A chapter answers with the study it belongs to and the list that study shows, with its own entry
  dimmed so the reading says where the row stands in the list.

- `popupFacts (at `const studyName = String(record?.studyName ?...`)`
  A position spells its study only as an id, so the study's own title is the one readable fact it
  carries - it rides above the hover board. The chapter it was reached in leaving the record, or
  an open proving the node it names is gone, is what makes the landing differ from the row.

- `popupFacts (at `if (boardStateFor(entry)) facts.unshift({ bo...`)`
  A row that has a board to show opens its reading with the square that board parks in, so the
  words and the board come up as one tooltip instead of a box over the row and a box of words
  under it.

- `popupFacts (at `const title = String(entry.kind == 'blogPost...`)`
  A post names itself on its own page, so the heading outranks the slug the row fell back to;
  every other kind keeps the name its row already answers with.

- `clearDrop`
  A drop marker is a claim one row makes for the moment it is dragged over; only one row may hold
  it, so every marker on the page is cleared before a new one is set.

- `bookmarkView (at `if (content.hayRevision !== content.sync.pub...`)`
  The local db feeds the mirror off the critical path - the member blob first, then the captures
  the tree filed - so a row can be painted before the study it names has a record. The view
  rebuilds on every publish, and this is what makes that rebuild answer the mirror it now sees
  rather than the cache the first paint left behind.

- `bookmarkView (at `content.armPageDrag();`)`
  The page locks its own links (`draggable="false"`) - a relay's game list among them - and Chrome
  answers such an element with its no-drop cursor and fires no drag event at all, so the tree
  never hears a gesture meant for one. Boot takes the lock back once, but a relay drops its boards
  onto the page after that pass (and re-drops them as its rounds arrive), so every paint takes the
  flag back for the links this table can name. Only links still locked are touched, so a page that
  carries none costs a walk of its anchors and nothing more.

- `bookmarkView (at `access: ['all', 'writable', 'readonly'],`)`
  Every writeable study is already readable, so the access pair is `Writable` vs `Readonly` ("no
  write"), and the registry keeps `unlisted` apart from `public`.

- `bookmarkView (at `const keptRack = host.find('.rack-filters');`)`
  Rack 1: the filters rack - the three chips. A repaint reuses the rack the window keeps and swaps
  only its chips: the textbox that sits in it is never taken off the page, which is what keeps the
  keyboard on it while a user is still typing.

- `bookmarkView (at `const putChip = (chip) => { if (boxSlot.leng...`)`
  The box stays the rack's last child, so the chips go in ahead of it.

- `bookmarkView (at `const actionsRack = $('<div class="rack-acti...`)`
  Rack 2 / the flow: Add (hidden while Select is on or nothing on the page can be filed), Select
  (the mode that grows the checkboxes), Delete (count + confirm), New folder.

- `bookmarkView (at `const addButton = rackButton('btn-add', 'rec...`)`
  Add is one press; it files `addChoice`. The caret next to it opens a menu of the kinds the page
  can name; clicking a menu chip files that kind and closes the menu. A caret press while the menu
  is open closes it without filing anything.

- `bookmarkView (at `if (!content.canAdd()) addButton.attr('hidde...`)`
  Add hides while Select is on, and when the page has nothing to file.

- `bookmarkView (at `const addWrap = $('<div class="add-caret-wra...`)`
  The caret and its dropdown share a `position: relative` wrapper so the menu box hangs under the
  caret and reads as one control, not as a widening rack. Opening the menu is a paint of one
  container; closing it takes that container off the page.

- `bookmarkView (at `if (!content.selected.size && !content.confi...`)`
  The first press of the fallback arms the bar, so the chip stays live while a bar is armed.

- `bookmarkView (at `newFolderButton.on('click', async (ev) => {`)`
  The name is asked by `createFolder` through the page's dialog prompt.

- `bookmarkView (at `const selectedItems = [...content.selected];`)`
  Rename sits beside New folder and is live only when exactly one item - folder or leaf - is
  selected, so the gesture cannot guess which item the user meant.

- `bookmarkView (at `const foldTargets = content.parentNodes();`)`
  One chip folds or unfolds every openable row at once - folder or leaf-parent - so a deep tree is
  one gesture instead of one caret each. It says which way it is going, the same reading the caret
  on a row carries.

- `bookmarkView (at `const undoButton = rackButton('btn-undo', 'r...`)`
  Undo walks the window's gestures back, newest first; the chip lives while anything the window
  recorded is left to undo.

- `bookmarkView.rowOf (at `const dead = !folder && content.isGone(entry...`)`
  A leaf wears red only when a read proved it gone; an unknown kind stays fail-soft gone.

- `bookmarkView.rowOf (at `const hasChildren = (entry?.children || [])....`)`
  Any node with a `children` array carries the expand/collapse caret, folder or leaf. Folders are
  open when in `expanded`; leaf-parents are open when NOT in `collapsed`.

- `bookmarkView.rowOf (at `if (folder && shown === 0) li.addClass('fold...`)`
  A folder is never dropped - it stays and goes dim when nothing in it is shown.

- `bookmarkView.rowOf (at `const indexed = { row, entry, folder, dead, ...`)`
  The node this paint put on the page, keyed for the tree host's one listener per event. The chips
  a row wears copy this answer with a chip marker, so a click on a caret or an open link stays the
  row's own rather than a handler the row would have to carry.

- `bookmarkView.rowOf (at `if (content.selectMode) {`)`
  Select grows a plain `<input type="checkbox">` - a native control costs no markup budget and
  takes no extra row width, which is what the styled `form-check` span did badly. Its `change`
  feeds the same `select` the row click uses, so the selection keeps exactly one owner.

- `bookmarkView.rowOf (at `check.on('change', () => content.select(entr...`)`
  A box belongs to the set: toggling joins or leaves without erasing the other rows, the additive
  path a ctrl-click takes - a bare select would replace the whole set.

- `bookmarkView.rowOf (at `const parentFlair = entry?.kind == 'chapter'...`)`
  A leaf wears the page's own mark - the study's flair when the mirror has one, else the kind icon
  - so a mixed tree reads at a glance without a second label. A containment kind keeps its own
  mark: its record is the parent study's, so a filed chapter or study position would otherwise
  dress up as the study it sits under.

- `bookmarkView.rowOf (at `const gameMark = entry?.kind == 'game'`)`
  A player has no page record to wear a flair from, so it wears the site's own User mark and its
  row is never bare. A game answers from its own data instead: control or variant icon, Crown when
  the leaf knows neither.

- `bookmarkView.rowOf (at `if (userPageKind(entry?.kind)) box.attr('dat...`)`
  A row whose page is a profile wears the site's own hook for the profile card: `data-href` names
  the handle in the form the page spells on a user link (`@/<handle>`, the same route the row
  opens), and the paint hands this box to `powertip.manualUser` once the row is on the page, so
  the card it paints is the card the page paints - pinned to this box, the item, and never waiting
  on a pointer.

- `bookmarkView.rowOf (at `const ownFlair = flairImage(lt, entry?.meta?...`)`
  The value parked in meta is what the page had: the blob's own flair key, or the url the page's
  `img.uflair` already gave. The image url is `lt.lichess.asset.flairSrc(flair)` of that value, so
  a key spells through the site's asset map and a url rides through whole.

- `bookmarkView.rowOf (at `const titleMark =`)`
  A profile row, a team row and the blog of an author keep the title the site puts on the handle,
  and the page spells that title **before** the handle - an author reads as "CM HandKnit". The
  span rides on the box, ahead of the name it belongs to.

- `bookmarkView.rowOf (at `else if (ownFlair !== undefined && !parentFl...`)`
  Any other kind that named a flair on its page prints it the same way: a study, a blog post, a
  thread or a board carries the image in meta, and a row the mirror already dressed from its own
  record keeps that mark rather than wearing the flair twice.

- `bookmarkView.rowOf (at `if (entry?.kind == 'chapter' && (entry?.meta...`)`
  An interactive chapter - a lesson the reader plays inside the chapter - wears the site's own Eye
  after its name. Only a page blob or a mirror record that names the flag says so; a chapter
  nothing names wears nothing.

- `bookmarkView.rowOf (at `if (entry?.kind == 'tournament') {`)`
  A ladder dresses beside its name: the mark the site gives its run - the control's own icon, or
  the variant's when the control map has none - and the day it opens, separated from that mark by
  a dash. A ladder that already finished has no start left to print.

- `bookmarkView.rowOf (at `const popupRecord = entry?.kind == 'studyPos...`)`
  A position row wears no marker: lichess styles a board and its pieces from a sheet scoped under
  the page's `main`, and no rule in it can cross into a dialog - a chessground inside the window
  could never wear it. The hover board hangs off `main` itself and floats over the row instead, on
  `hoverShow`. The reading belongs to the **item**, not to the row: `data-popup` rides on the
  content box and the hover checks that box with everything under it, so the words stay up over
  the name, a flair or a date, and never answer over a row's padding or one of its chips. A study
  position answers with the record of the study its own meta names: the row cache keys a record by
  row id, and a position id spells the chapter and the path, never the study - so without that
  lookup the one fact a position owns would never be checked.

- `bookmarkView.rowOf (at `if (ownCount && entry?.kind != 'chapter' && ...`)`
  The chapter count belongs to the study row alone: a chapter or a position row wears its own
  name, and a count on it would read as if the row itself held chapters.

- `bookmarkView.rowOf (at `indexed.cold = true;`)`
  The mirror has never seen this row, so hover spends the read that fills the picture in; the
  facts that read brings back answers on this row and on every later page.

- `bookmarkView.rowOf (at `const built = popupFacts(content, trans, ent...`)`
  The tooltip answers from the item alone: its own facts, nothing about the branch it sits in and
  nothing about its siblings. Nothing is asked of the page, so the hover costs no request - and a
  row that knows nothing about itself carries no tooltip at all.

- `bookmarkView.rowOf (at `if (!folder && !dead && profilePending(entry...`)`
  A profile row that carries none of the facts its page shows spends the same read `openLeaf`
  takes, so a resting pointer grows the title and the flair onto the row - the read saves and
  repaints, and a row that has them already spends nothing.

- `bookmarkView.rowOf (at `let actions;`)`
  Row-end actions ride one container grown the first time a row wears one, so a row with none
  carries no empty box. It trails the item box and the marks the row wears, claims whatever width
  the row has left over and justifies its children to the inline end, which leaves every action
  over its own box only: the strip beside it answers as the row, the way the row's padding always
  did. The container is not a chip, so a press on it climbs to the row through rowTarget, and it
  wears no tabindex, so the row keeps its one tab stop.

- `bookmarkView.rowOf (at `if (jumpHref !== undefined) {`)`
  The row's own jump affordance sits at its right end as a link icon, labelled with the plain word
  "Open" (`recordsDbOpenButton`) so no kind is misnamed by it. Enter and double click keep the
  keyboard path into openLeaf.

- `bookmarkView (at `const countsLine = $('<span class="tree-coun...`)`
  One count label for the whole tree: the total is the only number that always fits, and the
  per-kind breakdown waits in its title, one kind per line, so eight kinds cannot push the header
  open. The words carry the plural, so a big count reads `Studies: 496`.

- `bookmarkView (at `if (!treeTotal) {`)`
  What stays in the header is only what the tree cannot show by itself: an empty tree, a leaf a
  read proved gone, a restore waiting, a confirm armed. The capture state is not the user's
  decision - the tooltip answers as soon as the mirror lands.

- `bookmarkView (at `const bar = $('<div class="confirm-bar">');`)`
  The fallback bar: the first press armed it, this line says what the second press will do.

- `bookmarkView (at `if (userPageKind(row?.entry?.kind)) {`)`
  A profile row asks the site for its own user card the moment its row is on the page: the box
  carries the `data-href` the card reads, so a painted profile row wears its card right away, and
  every repaint hands it the title and flair a read grew onto the row. The card never waits for a
  pointer, and a kind whose page is not a profile asks for nothing.

- `bookmarkView (at `const end = $('<div class="bookmark-end">');`)`
  Nothing states an overflow: the tree paints every row it holds, so a tree taller than the dialog
  only grows its scrollbar. The marker at the end of the tree: a drop there is a root drop, so it
  carries the answer the host dispatches with no row behind it.

- `bookmarkView (at `const backupRack = $('<div class="rack-backu...`)`
  The backup rack, pinned to the bottom of the dialog. The file is one tree, so "Backup" writes
  the tree the user sees and "Restore" replaces the whole tree with it - there is no per-branch
  half-action left to explain. "Append" is the safe third: it asks the folder name first, then the
  file, and files what the file holds inside one new root folder pushed last, so a row the tree
  already has stays where it was - nothing needs a warning before the press.

- `bookmarkView (at `if (keptRack.length) {`)`
  The read order: header, filters rack, actions rack, the tree (header above it), backup rack.
  Under a host that has been painted before, the pieces that carry no textbox are dropped and the
  fresh ones take their place around the rack that stays - the header ahead of it, the rest behind
  it.

- `minWindowWidth`
  The window geometry: min width and the clamp ---------------------------------------------------

- `windowViewport`
  The box the window may sit in: the viewport, with the site header taken off its top. The sheet
  anchors the window to the viewport, so these are the numbers a box write takes.

- `anchorBox`
  What the user left, kept by the screen corner it was nearest to: the two gaps to that corner are
  what the page remembers, so a page whose viewport has since changed size puts the window back
  the same distance from the corner the user was working to rather than at absolute coordinates of
  a screen that is no longer there. The corner is named by its edge first: `br` is bottom right,
  and `dx` is the gap to the left or right edge, `dy` the gap to top or bottom.

- `rememberedBox`
  The remembered box put back where its anchor says it is on this page. A row an older version
  wrote carries no anchor and is taken where it was written.

- `windowCanHold`
  Whether a page can hold the window at its own minimum at all. Below this there is nothing of the
  user's size to put back, and the page's own placement is the honest answer.

### tool.js - WindowCtrl

- `WindowCtrl.constructor (at `this.redraw = async () => {`)`
  A repaint means the tree changed, so the state is offered to the blob as it happens - the
  throttle keeps a drag through a big tree from writing a branch-sized blob on every step.

- `WindowCtrl.saveState`
  The state goes to the blob at most every `windowStateSaveMs`; a page being left flushes once
  through the unload listeners instead, and `close` writes it whatever the clock says.

- `WindowCtrl.show`
  The window is the one the owner holds, so showing it is only building its frame once.

- `WindowCtrl.dispose (at `this.scrollOffset = windowFrame?.scrolled() ...`)`
  The offset is read before the frame is taken off the page - after the close there is nothing
  left to read it from, and the next page would restore the top of the tree.

- `WindowCtrl.freeze`
  The fail-soft shape: the blob keeps its `{kind, active, geometry, view, scroll}` rows, so an
  older blob still parses and a newer one that names a kind this tool no longer has simply fails
  the kind test in `load`. `view` is the shape the user left - the open folders and the selected
  rows - and only a content that owns a shape fills it. `scroll` is where the wheel had stopped. A
  part a page cannot see is left out of the row rather than written empty: `saveWindows` carries
  the part the page before left, so a write that knows less never erases it. The corner the box
  was nearest to is written alongside it, which is what lets a page whose viewport has since
  changed size put the window back at the same gaps from that corner.

### tool.js - WindowFrame

- `WindowFrame.constructor (at `this.inner;`)`
  The hosts a paint keeps for the whole life of the window: `div.inner-content` carries the
  gesture listeners, `div.content-frame` is the scroll host, the tree host under it carries the
  tree's own listeners, and the filters rack under that carries the textbox. A repaint may not
  take any of them off the page - an input that leaves the page loses the keyboard that was on it,
  so the next letter lands at the wrong end of the word.

- `WindowFrame.constructor (at `this.scrollerSelectors = ['.content-frame', ...`)`
  The scrollers a paint rebuilds, and the offset a window comes back with from another page. A
  fresh scroller starts at the top, so both have to be carried: the live offset across a repaint,
  and the blob's offset onto the first paint.

- `WindowFrame.constructor (at `this.resizeHandler = () => this.fit();`)`
  What the page calls when the viewport changes. The event hands the callback a receiver of its
  own - the browser and cash's `trigger` both call it detached - so a class method forwarded as
  `this.fit` would read `undefined.geometry` and throw on every resize. This closure captures the
  frame instead, and one identity feeds add and remove.

- `WindowFrame.show (at `const dialog = await lt.dialog({`)`
  The window is resizable through the dialog factory's own machine: the viewport it sits in, its
  minimum and where the size is remembered are this window's decisions, so they go over as the
  machine's policy - `begin` lifts the window forward for the gesture, `resize` gets the box the
  grabbed edge proposes and answers with the box that lands on the page.

- `WindowFrame.show (at `this.apply({`)`
  A drag moves the window - it never resizes it. The box the drag left is taken by its centre, so
  the size the window keeps is the size that stays on the page, and a measured border box never
  feeds back into the written content box.

- `WindowFrame.render (at `const scrolled = this.scrollRestore ?? this....`)`
  The tree host, its filters rack and its textbox belong to the window, not to the paint: a paint
  fills the host with the fresh header, racks, tree and backup rack, and the rack that already
  carries the textbox keeps it. A rebuilt textbox is taken off the page for a moment, and a moment
  off the page is enough to lose the keyboard on it - typing "Par" one keystroke at a time then
  answered "raP". The scroll offsets are read before the swap for the same reason: the fresh
  scrollers that come back under the host have no memory of where the wheel had stopped, so a row
  click - which repaints before it navigates - would jump the whole tree back to the top.

- `WindowFrame.scrolled`
  Where the wheel had stopped inside the window. Only the scrollers this tool owns are read, and
  the raw node is taken with `[0]` because the offset lives on the element.

- `WindowFrame.restoreScroll`
  The offsets go back on the scrollers that replaced them, clamped to what the fresh subtree can
  actually show - a row the tree lost since leaves the wheel near the bottom rather than throwing
  the window off the page.

- `WindowFrame.innerHost`
  The hosts the window keeps for its whole life: `div.inner-content` sits under the page's own
  scroll host and `div.content-frame` under it is the scroll host. The gesture listeners and the
  resize strips belong to the dialog the factory built, so a paint never carries them.

- `WindowFrame.apply (at `set('left', rect.left + rect.width / 2 + 'px...`)`
  The centre plus the size, written the way the dialog factory writes a box (`left`/`top` name the
  centre, the opposite edges go to `unset`, the page's min/max go to their initial values) - tools
  that re-apply a placement write the same way, and a priority write or a lone edge would hold
  against their `unset` and leave the dialog over constrained. The sheet anchors the window to the
  viewport, so the viewport numbers the geometry is kept in are the numbers the write takes, and
  the page may scroll on underneath a held window.

- `WindowFrame.resizeTo`
  The size policy the dialog machine hands over for an edge grab: the grabbed edge moves, the
  window keeps its minimum and stays inside the page, and the size the user left is remembered on
  the blob so a reload restores it. The box the machine grew to the content's floor comes in as
  the window's own minimum, so the remembered size is the size that lands on the page.

- `WindowFrame.escapeKey`
  Escape closes the window. The dialog itself is kept from the Escape by `noEscClose`, so this is
  the window's own decision, and the memo keeps one key press to one action.

### tool.js - RecordsDbCtrl

- `RecordsDbCtrl.constructor (at `this.content = new BookmarkTabContent(liches...`)`
  The page has one content, and it holds the one window the toggle opens.

- `RecordsDbCtrl.canOpen`
  A phone is not excluded: the store captured the study there too, and the window answers a touch
  layout (one column, a thumb-high header, tap-wide strips). What has to hold is a user, the
  database, and a route the db speaks for - no study has to be open behind the page. The frame is
  a dialog the factory hangs off the viewport, and `initialGeometry` answers a page that lost its
  panels with an honest box, so a press on a game, a replay or a training page lifts the same tree
  the study page shows.

- `RecordsDbCtrl.canPlace`
  The page test both halves answer to: the db speaks for this route and a user is behind the page.
  The button and the window keep separate names because they act separately - the toggle is placed
  on every page this passes, the window opens there only on a trip or a return - but the page rule
  they need is this one.

- `RecordsDbCtrl.pageStudyId`
  The study this page carries - the open analysis first, the url as the fallback the store already
  uses (plan 13).

- `RecordsDbCtrl.storedScroll`
  The scroll offsets the blob carries for the row this tool still has.

- `RecordsDbCtrl.returned`
  The back half of `rememberPage`: a page whose url is in the trail is a page the user came back
  to. The page key spells which page ran last, so reloading the page you are on is not a way back
  - only arriving from a different url is. The entry is spent, so a further visit of that study is
  a manual call again.

- `RecordsDbCtrl.handoff`
  The one-shot hand-off `openLeaf` leaves before it navigates: it is read and dropped in the same
  breath, so a flag nobody spent cannot reopen the window on a later visit of that study. Only a
  trip younger than `treeHandoffMs` that names the study this page carries is spent - a study the
  user opens by hand, in another tab or from a bookmark stays a manual call.

- `RecordsDbCtrl.mount`
  The window's frame is up, so the content reads its tree and the window takes focus. The frame's
  order is stamped here: the css keeps the single window under the analysis panels.

- `RecordsDbCtrl.open (at `await this.setStayOpen(true);`)`
  The user left the window open, so the next page has to lift it again: a back button, a tab
  switch or a reload never calls the tool, and only a manual close takes the flag away.

- `RecordsDbCtrl.rememberPage`
  The page that now carries an open window hands its url to the trail: the back button brings a
  page change, and the study hash is already spent on bookmark + ply, so the whole url (hash
  included) is what gets compared later - nothing is spelled into it.

- `RecordsDbCtrl.listenLeave`
  The page that now carries an open window starts watching for its own end: a back button, a tab
  switch or a reload never calls the tool again, so the shape and the wheel have to reach the blob
  from the unload channel - the one channel that runs on the page being left.

- `RecordsDbCtrl.stayOpen`
  Whether the user left the window open. The window lives in one page's dom, so a page load reads
  this key to decide again, and a page that cannot place the window leaves the key alone - walking
  through a route the db never speaks for does not close the window for the user.

- `RecordsDbCtrl.setStayOpen`
  Writing the flag: on when the window was lifted, away when a manual close said otherwise. An
  `undefined` value is what the storage api takes as a removal.

- `RecordsDbCtrl.teardown`
  A page being left is not a user closing the window: the frame goes off this page's dom and the
  flag that keeps the window coming back stays untouched.

- `RecordsDbCtrl.close`
  A manual close - the toggle press, the dialog's own close - is the user's decision, so it takes
  the flag away and the next page keeps its window short.

- `RecordsDbCtrl.storedGeometry`
  The fail-soft rule for the geometry blob: every number finite and positive, and a row naming a
  kind this tool no longer renders is ignored - a blob an older version wrote with four tabs then
  simply loads the default box rather than throwing on page load. The remembered box is put back
  at the corner gaps it was saved with, so a page whose viewport has changed size keeps the window
  the same distance from the corner the user had put it against; only a page that cannot hold the
  window at its own minimum at all falls back to the page's own placement, and a box that no
  longer fits is clamped back in by `fitWindow`.

- `RecordsDbCtrl.initialGeometry (at `if (columns < 2 || !panel.length || !board.l...`)`
  A phone has one column and no side panel to lean on, so the box takes the width the viewport has
  and hangs under the header - `fitWindow` then never has to shrink it. A desktop page that lost
  its study panel gets the same honest box rather than a fixed one.

- `RecordsDbCtrl.installToggle (at `const button = $('<button class="link record...`)`
  `records-db-button` is the button's own hook: the toggle is the only affordance the tool adds to
  the page's sidebar, so it spells itself rather than leaning on the site's `link`.

### tool.css

- `html:has(body.lichessTools > dialog.lichessTools-recordsDbUi) {`
  The window is fixed to the viewport, so a page scroll never moves its box: the numbers
  `fitWindow`, `moveWindow` and `apply` write are viewport numbers, and a viewport-anchored write
  takes them whatever the page does underneath. The header drag is measured the same way, so a
  held window keeps its place while the page scrolls on. Unlike the other dialogs, which keep the
  factory's hidden default, this one lets html scroll while it is open - browsing the page under a
  held window is the point of carrying it around.

- `body.lichessTools.mobile .lichessTools-recordsDbUi {`
  A phone keeps the window and gives the header a thumb grab; the five resize bands widen into tap
  bands in the dialog sheet, which styles them for every resizable dialog.

- `body.lichessTools .lichessTools-recordsDbUi .record-content {`
  The item box is sized by the item it carries, never by the row's free space: `flex: 0 1 auto` lets
  it grow only to its own content, and `min-width: 0` lets the name inside shrink into an ellipsis
  when the row itself runs out. A share of the row width instead buries a study title half way
  through long before the row is tight.

- `body.lichessTools .lichessTools-recordsDbUi .bookmark-name {`
  The words stop at themselves: `min-width: 0` is what lets the flex line take a long name back down
  to the row, and `overflow: hidden` with the ellipsis marks only a name the row cannot hold. The
  box used to carry a `max-width: 18rem` cap, which cut long study names on a wide window while the
  leftover strip next to them stayed empty.


- `body.lichessTools .lichessTools-recordsDbUi .bookmark-end {`
  The end marker is a fixed-size drop zone: a grown end marker would eat the body's free space and
  cut the list in half - the list itself grows, not the marker.

- `body.lichessTools .lichessTools-recordsDbUi .record-content[data-popup] {`
  A reading answers the item alone: `data-popup` rides on the content box, and the hover listener
  raises the reading only over that box. The help cursor and the brighter words say "this item has
  more to read" - a pointer over a row's padding or its chips says nothing.

- `overscroll-behavior: contain;`
  Scrolling inside the tooltip stops at the tooltip - it does not chain into the tree or the page
  behind it, which is the whole point of reading a chapter list here

- `body.lichessTools #lichessTools-recordsContentPreview li.popup-header {`
  A header row names a block inside a popup - the ladder's standings block - and it reads bolder
  than the fact lines under it.

- `body.lichessTools #lichessTools-recordsContentPreview img.popup-flair {`
  A fact can wear a picture the item named. A **flair** is the mark a standings card showed beside
  a rating, so it stays the size of a line of text; an **image** is the picture an item opened
  with - a blog post's heading image - so it grows, but never into a gallery.

- `body.lichessTools #lichessTools-recordsContentPreview li.popup-board {`
  A reading that owns a board reserves the square the board parks in: `popupFacts` puts one
  `popup-board` item at the head of the list and `hoverShow` pins the container over its slot, so
  the board and the words come up as a single tooltip. The square is 15em of the tooltip's own
  size, which is the size the sheet gives the board container.

- `body.lichessTools #lichessTools-recordsContentPreview li.popup-dim {`
  A list line can be dimmed - the entry a chapter row stands on inside the list of its study's
  chapters, so the reading says where the row sits without repeating it.

- `body.lichessTools.mobile button.lichessTools-recordsDb {`
  The toggle on a phone is a touch target: it grows to a thumb-sized box rather than hiding.

- `body.lichessTools .lichessTools-recordsDbUi .tree-header {`
  The header: one line per fact the view counts, each dim when it has nothing to say

- `body.lichessTools .lichessTools-recordsDbUi .rack-filters,`
  The three chips live in the filters rack; a chip with nothing to choose stays dim

- `body.lichessTools .lichessTools-recordsDbUi input.tree-select {`
  Select grows a native `<input type="checkbox">`, so the row only gives it size and colour - the
  control's own box is the browser's, which is what keeps the row narrow.

- `body.lichessTools .lichessTools-recordsDbUi .confirm-bar {`
  The confirmation bars, armed only while a press waits for its twin

- `body.lichessTools .lichessTools-recordsDbUi li.record-row.record-missing {`
  A dead leaf gets its own mark, and a folder whose leaves are all hidden goes dim instead of away
  - a folder is never dropped.

- `body.lichessTools .lichessTools-recordsDbUi .record-actions {`
  The row's actions ride one container that takes whatever width the row has left over and
  justifies its children to the inline end, so an action answers only over its own box. The
  container claims the leftover strip and never grows a hit area of its own: the space beside the
  icon keeps answering as the row, and a second action can join the line without eating the row.

- `body.lichessTools .lichessTools-recordsDbUi button.btn-row-open {`
  The row's jump affordance is a link icon at its right end, so it reads as a target of its own
  and not as the title; the icon is the row's only nav widget. It keeps its own size - the
  container above claims the space - and takes the pointer back for its own box.

- `body.lichessTools .lichessTools-recordsDbUi .tree-restore-count {`
  While a restore waits to be confirmed, the header shows what the file holds

- `body.lichessTools .lichessTools-recordsDbUi button.btn-add,`
  The action chips share the state chips box; Rename and Backup join them

- `body.lichessTools .lichessTools-recordsDbUi button.btn-add-caret {`
  The caret reads as a small split off Add: no text, just the down triangle, and it hugs the Add
  chip so the pair looks like one button split in two. The dropdown box hangs from the caret via
  the wrapper, so the caret and its box read as one control.

- `body.lichessTools .lichessTools-recordsDbUi div.add-caret-wrap {`
  The wrapper is position:relative so the menu box below can be pinned to the caret and the pair
  stays one visual unit; the wrapper itself has no chrome.

- `body.lichessTools .lichessTools-recordsDbUi div.btn-add-menu-box {`
  The menu is a real dropdown: one box hanging under the caret, one kind per row inside, a small
  pointer joining the box to the caret so the two read as one control.

- `body.lichessTools .lichessTools-recordsDbUi button.btn-add-menu {`
  Inside the box, each kind is a full-width row: no border of its own, and a hover so the cursor
  shows which row a click would file.

- `body.lichessTools main .records-db-mini-board {`
  The position hover board hangs off the page's `main`, not off the window: lichess styles boards
  and pieces from a sheet scoped under `main`, and no rule can cross into a dialog - under `main`
  lila's own mini-board contract comes styled as a regular board wearing the current themes.
  `hoverShow` births the container under `main` and pins its left/top inline - inside the row's
  tooltip when that reading carries a `popup-board` slot, otherwise over the hovered row - so the
  board and its words come up as one box. The container's font-size matches the tooltip's own
  (13px), which is what makes the 15em square and the slot it parks in the same size. The dialog
  sits at z-index 900+ (see the dialog tool) and the tooltip at 900+100, so the container floats
  above both. Only opacity toggles with the hover - chessground measures the marker at init, so
  the sheet keeps it a 15em border-box square at all times, and our scoped selectors outrank the
  plain lila rules: nothing here needs an !important.

- `body.lichessTools:has(dialog.lichessTools-recordsDbUi) #powerTip {`
  A profile row asks the page for its own user card (`powertip.manualUser` paints `#powerTip`),
  and that card is a fixed box of the page while the window is a dialog at z-index 900+. Without
  this rule the card buries itself in the window; with it the card floats over the rendered row.

- `body.lichessTools .lichessTools-recordsDbUi .record-perf {`
  A row's own marks: the ladder's perf icon and start date sit after the name in one line, the
  ladder's date being a small stamp rather than a second label.

- `body.lichessTools .lichessTools-recordsDbUi .record-playable {`
  The Eye an interactive chapter wears after its name, and the dash that keeps a ladder's mark and
  its start date one readable line.

## The paint cost of a reorder (this pass)

A browser trace of the shipped tool named what one drag costs, and the fixes below take it out
without changing a painted row. The trace was a DevTools performance export read through
`traceEvents`: the renderer's process/thread pair, `ParseHTML` chunks as the proxy for DOM
writing (one per row written), `Layout.beginData.dirtyObjects` and `UpdateLayoutTree.elementCount`
for the style/layout cost, and `stackTrace` frames inner-to-outer with `call-site:line` as the
attribution. One gesture burned ~1.9 s of scripting over four rebuild chains, ~2.4 s of ParseHTML,
12.9 s of Layout over 6,188 dirty objects and 2.7 s of HitTest from per-move scans.

- One repaint per drag, not four. `rowDragStart` asks `drag(entry, false)`; the drag start
  selects the row it pressed and leaves that paint in `paintHeld`, which the first move handler
  (`dragOver`, `dropInto`, `showDropMark`, the page-drag move/end/release handlers) releases with
  `releasePaint()`. `select(entry, event, false)` is the general "change the model, do not paint
  yet" form for that. `save()`'s post-write `onChange()` now paints only when the write failed -
  the failure block is the only thing a write adds by itself - and `deleteSelected` paints the
  note it writes, since that was the only caller leaning on the write chain to show it.
- Rows lift instead of being rewritten. `content.rowPaint` maps each entry to the nodes the last
  paint built for it and the stamp of what those nodes showed. `bookmarkView` answers `rowState`
  once per row per paint and derives `rowStamp` from it: place, depth, the empty-folder mark, the
  open state, selection, `selectMode`, whether a rename owns the row, the label, the entry's own
  scalars and address fields, and `content.recordVersion`. A matching stamp moves the cached
  `<li>` - its caret, its checkbox, its jump button and its popup anchor - into the new `<ul>`,
  writing only the row's new `data-path`. The tree header, the racks and the box still rebuild
  each paint; they are a few dozen elements against a thousand rows.
- `content.recordVersion` bumps only inside `refreshCaches()`, which runs when the mirror moved
  (`hayRevision !== publishRevision`). Rows decorated from record facts rebuild with those facts,
  and a repaint that only moves rows never reads them again.
- The per-move handlers stopped asking the page. `aimDrop` writes the drop mark at the two places
  a drag aims and remembers the row that wears it in `dropMarked`; `clearDrop()` clears exactly
  those rows. `rowAtPoint` guesses the row under the pointer from the first row's box - rows paint
  as one list of equal lines - and walks back to the first row that really holds the point, which
  is the answer a full scan gives; the full scan stays the fallback for trees whose rows are not
  equal lines.
- `.content-frame` carries `contain: layout` in tool.css, so a repaint dirties the window's own
  layout objects rather than the page's ~6,200. `paint` containment is deliberately not set: the
  drop mark's `::after`, the add-menu dropdown and the popup reach outside the frame's box. The
  hover mini-board hangs off `main` outside the window, and the `position: fixed` rules in the
  sheet are the window root and that board - both above the contained frame - so no fixed box
  inside it changes its containing block.
- `paintFacts()` answers the header counts, the filed total, the missing total and the kinds on
  the tree in one walk, and the chips read the same answer instead of walking the entries again.

The window harness pins the new invariant with two identity checks: clearing one selection
rebuilds exactly the row that wore it, and a drop rebuilds only the moved branch and the rows it
exposes. Row identity is now stable across paints, so the per-paint `rowIndex` registration lives
in the row loop (`registerRow`) rather than inside the builder: every row and every chip it wears
is written into the map on each paint, from the current state.

## What a pointer under a drag costs (this pass)

Two further traces of the shipped tool (89 s and 55 s of page) were read the same way, kept to the
renderer's main thread and attributed through `beginData.stackTrace`, whose inner frames name the
handler that asked for the work. Both name the same two hot spots, and neither is DOM writing:

- `Layout` and `LocalFrameView::performLayout` slices attributed to
  `insertionTarget:1220 < dragOver:1258`: 1,659 calls costing 15.4 s, ~9.3 ms each. The aim writes
  an attribute, the sheet's `[data-bookmark-drop]::after` rule builds a box only for the rows that
  wear it, and a built-or-destroyed box dirties the frame's layout tree (the biggest `dirtyObjects`
  counts are ~6,200 and the style recalcs 3,900+ elements), so a pointer that crosses a row costs
  a layout of the whole tree.
- `UpdateLayoutTree` slices from `showStudyPopup:2953 < :2934`, the popup's own `mouseover
  mousemove` handler: 18 refreshes restyling 51,255 elements (~19 ms each). The `HitTest` slices
  agree on what the pointer is hitting - `endData.nodeName` names
  `DIV id='lichessTools-recordsContentPreview' class='record-popup-show'` - so the card the hover
  paints sits over the tree for the whole gesture, and answers under the dragged pointer.

What was done:

- A gesture owns the pointer. `dragAidOpen` is set by `dragBegin` at the two gesture starts (the
  row's own `dragstart` and the page path's `dragArm`) and cleared by `dragEnd` at every gesture
  end (the window's `dragend`/`dragleave`, `dragEndGlobal`, `dragRelease`). While it is set,
  `showStudyPopup`, the popup's own hover handler and `rowMouseOver`/`rowMouseOut` answer nothing,
  the reading card is pulled in with `hideStudyPopup()`, the hover boards under `main` fade, and
  `#powerTip` - the card the site paints for a profile row - stops taking the pointer.
- The marker line lives on every row already: the sheet's base rule paints it for
  `li.bookmark-row::after` and `.bookmark-end::after` at `opacity: 0`, and the attribute rule only
  lights it. An aim changes the paint of a box that was laid out with the row, so a drag repaints
  instead of re-laying out.
- An aim takes its turn. `aimDrop` skips an aim that lands where the last one did - a pointer that
  hovers inside one row's half used to rewrite the same mark on every move - and the page path's
  `showDropMark`, which fires on every mousemove, writes only every other aim. The drop itself
  reads the event again, so a skipped aim never moves where the payload lands.
- `bookmarkView` hands the rows it laid down to `content.rowNodes`, in page order, and `rowAtPoint`
  reads that list: the list only changes when the tree is painted, so a drag that paints nothing
  also stops re-querying the page for the rows.

The harness grew to 1,263 checks and pins the new ones: a hover under a drag answers no reading,
the drag start pulls the card in and fades the boards, `#powerTip` takes the pointer off until the
gesture ends, the row list the hit-test reads is the paint's own, and the sheet keeps the marker
box alive on every row.


