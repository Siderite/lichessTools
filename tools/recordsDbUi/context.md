# Records Db Ui Tool — Context

## Overview

The **RecordsDbUiTool** is the UI half of lila PR #22258's study window: the list model (`tabContentCtrl.ts`,
`studyList.ts`, `memberTabContent.ts`, `historyTabContent.ts`) and its view builders (`studyListView.tsx`,
`memberView.tsx`, `historyView.tsx`) ported to Cash, plus P5's window shell (`windowBounds.ts`, `windowCtrl.ts`,
`windowFrame.tsx`, `studyDbCtrl.ts`, `windowEventHandler.ts`), on top of the IndexedDB database in
`tools/recordsDbStore` (`dependencies = ['RecordsDbStore']`, so `lt.recordsDbHarvest` is always live first).

Phase P5 rendered the tabs inside a floating `<dialog>` window built on `lt.dialog` (lila’s own `domDialog`, so
the modal toggle, Escape-close, scroll wrapper and base styling come for free), one window per saved `Rect`
restored from the `studyDb-windows` blob, opened by a `button.records-db-button` toggle in the sidebar tab strip.
P11 (§18/§19) keeps every bit of that shell and replaces what the window *holds* — one tree view, no strip.
Field and method names follow the PR so P6 (drag/resize/`transfer()`), P7 (search/results) and P8 (bookmarks)
drop in without renaming anything.

> **UI v2 shipped by P11 (rewritten 2026-11-03, §18/§19 of `studyDb-plan.md`): the four-tab window described on
> this page is superseded.** The shipped UI is one view — a filters rack (three tri-state chips: `all/writable/readonly`
> access, `all/public/unlisted/private` visibility, and a kind chip offering every kind present on the tree) plus one
> textbox over a name+topics+description+members+chapters haystack; an actions rack (Add / Select / Delete / New
> folder, plus Rename only while exactly one folder is selected, and one chip that folds or unfolds every folder
> at once); the folder tree; and a backup rack (Backup writes
> one file, Restore replaces every branch from it). `StudyDbStore` and P9's capture hooks stay
> exactly as documented here; P11 deleted `MemberTabContent`, `HistoryTabContent`, `SearchTabContent` and `ResultTabContent`,
> the tab strip and the `studyDbTabs`/`studyDbWindowCount` prefs, and with them the window's own `button.window-close`
> chip — a records-db window is a `<dialog>`, so it closes through `tools/dialog`'s `button.close-button`. Selection
> paints a native `input.tree-select` checkbox per row, whose native checked state replaces the PR's
> `aria-selected` bookkeeping. Read §18 before re-implementing
> re-implementing
> anything on this page, and do not resurrect the tabs. **§19 further generalizes the tree to any lichess object**
> (`{kind,id,label,meta?}` leaves, a kind chip, one merged tree whose blobs are per **branch** `studyDb-tree-<branch>` (a
> contained kind such as `chapter` rides inside its parent blob), one registry table in
> `tools/recordsDbStore`), so P11's **store must carry every kind** (parse, prune, save, restore, render as a dead link)
> while the **window services only `study` and `chapter`** — the other rows exist as data from day one.

## Preferences

- **name**: `recordsDbUi` — **category**: `general`, **type**: `single` `[false, true]`, default `true`, advanced
- ~~**name**: `recordsDbMaxResults` (was `studyDbMaxResults`)~~ — **dropped 2026-11-04**: the ceiling on records scored while filtering is the
  module constant `recordsDbMaxResults` (1000) at the top of the pair; the old strikethrough items below stay as history
- ~~**name**: `studyDbTabs`~~ — **deleted by the 2026-11-03 pass**: the tree view never read it, and `data/crowdin.json`
  never carried its keys, so both the option and its five labels are simply gone
- ~~**name**: `studyDbWindowCount`~~ — **dropped by P11**: one window holds one content, so there is nothing to count

`recordsDbCapture` is declared by the store tool (`tools/recordsDbStore`) and is **not** redeclared here; `studyDbSync` and
`studyDbHarvest` no longer exist - one switch covers both capture routes (§18.12).

The window renamed with the pair on 2026-11-04: the old `studyDb` option is now `recordsDbUi` in the `general`
category, and the store switch it reads is `recordsDbHarvest`. What the tool owns shed the word study too - the
CSS anchor `lichessTools-recordsDbUi`, the dialog class `records-db`, the rows/hosts `.record-*`, the drag payload
`application/x-lichess-records-db` and the window blob `recordsDb-windows`. What names an actual lichess study
kept it: `studyId`, `StudyData`, `idbStudy`, the `study` branch, `.study__side`, `/study/db` (§19.10).

## Behavior

### `init`
Builds the module singletons once (`recordsDbModule`, its `studyDbCtrl`, `windowEventHandler` and
`RecordsNavigation`) — the PR had the same shape as module-scope singletons (`import { syncCtrl } from './syncCtrl'`).
Idempotent: a page change never rebuilds them, so nothing captured is lost. The tool also keeps `this.module`
(the repo's singleton convention) so P7's `search()` and the harnesses reach the shell through the instance.

### `start`
1. `logOption('Study database', value)`, then **`await ctrl.close()` and `ctrl.removeToggle()` first** — the
   repo's unwrap-first pattern: every page load closes whatever the previous page left open and drops the
   toggle button before deciding again. Then `const arrived = await ctrl.handoff()` spends the row's one-shot
   session flag (§18.6) *before* the preference gate, so a flag nobody spends cannot reopen the window on a
   later visit of that study.
2. The module owns its scoring ceiling as a constant (§18.12) - nothing is read from the options here.
3. Off, or no shell → return; the IndexedDB stays because the store tool owns it.
4. `canOpen()` = user + `store.isRecordsDbAvailable(pathname)` **plus a study open on this page**
   (`lt.lichess?.analysis?.study`) — the last test is the port's addition: the PR opened its window from
   inside the study UI, the port opens one from a sidebar toggle. A phone passes the same test (§18.14
   dropped the `!lt.isMobile()` guard); false → log `cannot open here`, the database stays warm.
5. `await ctrl.load()` restores the saved windows (see below), then `await ctrl.installToggle()` puts the
   `button.records-db-button` in the sidebar strip — **nothing renders until the toggle is clicked**, matching
   the PR’s `StudyBits.scala`/`studyDb.ts` behaviour. §18.2 replaced `enabledTabs()` with the one tree content,
   so the toggle has exactly one window to open.
6. One exception: when `arrived` is true — the trip came from opening a row of the tree — `start()` calls
   `await ctrl.open()` right after, so the window is on the screen when the user lands on the study. The
   toggle is still installed, so a page reached by hand keeps the manual call.

### `RecordsDbCtrl` (module singleton, PR names kept)
- Owns the module singletons and the one window: `windowContents: Map<WindowCtrl, TabContent[]>` still has the
  PR’s shape, but §18.9 leaves it holding only the tree content (`kind = 'treeTab'`); `windows` is that map’s key
  order and `bringToFront(ctrl)` re-orders it so stacking follows the map (still there for the day another window
  is possible, and one entry makes it a no-op).
- `canOpen()` adds the port’s “a study is open on this page” test (`lt.lichess?.analysis?.study`) to the PR’s
  user + `isRecordsDbAvailable(pathname)` + desktop gate. `enabledTabs()` is gone — there is one content kind.
- `load()` reads the `studyDb-windows` blob (PR `storedJsonProp('study.db.state')`, hence `async`), drops malformed
  records (`geometry` finite and positive, `active` a real boolean, `kind` the tree kind), and with nothing stored
  creates the one default window through `createWindow`, whose geometry comes from `initialGeometry()` clamped by
  `fitWindow`. §18.2 killed the `Rect` regrouping, the `windowCount` truncation and the “top the first group up with
  tabs that were never stored” step.
- `createWindow(content, geometry, active)` rejects duplicate instances, foreign singletons and content that already
  has a window, wraps the content in a `WindowCtrl` and sets `content.onChange = ctrl.redraw` (PR `mount()`).
  `sortContents()` — which put `resultTab` last — died with the tab order (§18.9).
- `open()` = `load()` + `show()`; `close()` = `save()` + `dispose()`; `toggle()` tests the **frame** (`ctrl.windowFrame`),
  not the content map, because `load()` creates the window without showing it.
- `handoff()` spends the row's one-shot session flag (§18.6): it reads `treeHandoffKey` and removes it in the
  same breath, then only a `{studyId, at}` younger than `treeHandoffMs` whose study equals `pageStudyId()` (the
  open analysis first, the url as the fallback) counts. `openLeaf` writes that same key, and only a study or
  chapter leaf writes it — the other kinds land where the window cannot open.
- `closeWindow(ctrl)` disposes that one window; `closeContent()`, `attach()` and `transfer()` — the tab strip’s way of
  moving content between windows — have no user left and were deleted (§18.9).
- `save()` writes `freeze()` records (`{kind, active, geometry, view}` — `view` carries the tree's open
  folders and selected rows as `{path, key}` records and is empty for a content that owns no shape)
  through `idbStudy.saveWindows`.

### `WindowCtrl` (PR names kept)
`owner`, `content` (the single `BookmarkTabContent`), `geometry`, `windowFrame`, `redraw = () => windowFrame?.redraw()`,
`unwatch = owner.store.syncCtrl.watch(this.redraw)` (so `SyncCtrl.publish()` repaints are rAF-batched), `show()`,
`dispose()` (unwatches, then `windowFrame.close()`), `freeze()`, `setGeometry(rect)` (also `owner.save()`),
`get activeContentCtrl` (the PR read the selected tab; here it is the only content), `focusContent()` (focuses the
first `input` inside `.content-frame`, which is the one filter textbox - `mount` spends it once when the window
opens, and a repaint no longer repeats it: the caret survives a repaint because the box stays on the page,
§18.21). `tabCtrls`, `selectedTabId` and
`selectTab(id)` died with the strip (§18.9).
### `WindowFrame` (PR `windowFrame.tsx` → Cash + `lt.dialog`)
- `show()` = `await lt.dialog({ class:'records-db', modal:false, noTabCycle:true, focus:'.content-frame input',
  closedBy:'none', noEscClose:true, header:false })`. The dialog root carries `lichessTools-recordsDbUi` (the CSS
  anchor) and `records-db`; `frame.view` is lila's `.dialog-content` scroll wrapper. An outside close — the page
  or `tools/dialog` closing the `<dialog>`, Escape being swallowed by `noEscClose` — closes the window.
- The hosts are kept, not rebuilt (§18.21): `innerHost()` builds `div.inner-content` once per window - it
  carries the pointer/keyboard listeners - with `div.content-frame` under it and the five
  `span.resize[data-resize=e|se|s|sw|w]` strips closing the frame; `BookmarkTabContent.viewHost()` makes
  the `.record-list` tree host, which carries the tree's own listeners, and `bookmarkView(content, host, box)`
  fills that host with the fresh header, filters rack, actions rack, body of rows, note and backup rack
  (§18.9 moved the racks into the view). The filters rack is the one host a paint keeps whole, because it
  carries the textbox: an element that leaves the page loses the keyboard on it, and the next letter lands
  at the wrong end of the word.
  There is no `div.tabs [role=tablist]`, no `button[role=tab]`
  and no `.tab-close`; the window keeps the standard dialog close button (`button.close-button`, made by `tools/dialog`
  ’s `domDialog` inside `.close-button-anchor`), and `show()` passes
  `show()` passes no `attrs` - the dialog is named by its toggle button; `header:false` keeps it bare.
  `noTabCycle`, `closedBy:'none'` and `noEscClose:true` survive because the PR owns the close: Escape unwinds a
  gesture before it can reach the page’s own dialog handler. Cash delegates events over the dialog subtree, so
  the listeners hung on a host that is kept are hung once; `render()` takes off only the pieces under the
  hosts - the header, the actions rack, the body of rows, the note and the backup rack - and swaps only
  the buttons inside the filters rack, so the textbox and the caret in it never move (§18.21). `focusContent()`
  is spent once at `mount`, not per repaint - a repaint that refocused the box would send the caret to
  position 0.
- `apply(rect)` re-clamps the width through `fitWindow` (there is no tab strip left to measure) and writes `left/top/width/height` inline —
  `left`/`top` are the box's **centre**, because the dialog keeps lila's base centring (`top: 50%;
  inline-start: 50%; transform: translate(-50%,-50%)`) and that transform is what makes those two
  properties address the centre. It is the same contract `tools/dialog/tool.js`'s header drag writes and
  `emitPlacement()` reads back, so clearing the transform would break the drag; `fitWindow()` clamping the
  corner rect is what keeps the window on screen, and the internal `geometry`/`moveWindow` maths stays
  corner-based. `fit()` re-clamps on a page `resize`, which the frame registers through a captured
  `resizeHandler` closure — the event supplies its own receiver, so a class method handed over as
  `this.fit` would run detached and read `undefined.geometry` (§18.16); one closure identity feeds
  both `addEventListener` and `removeEventListener`, and `fit()` answers a disposed frame by doing
  nothing. `setOrder(order)` writes the PR's
  `---records-db-frame-order` custom property plus a `z-index` fallback. A `pointerup` listener on the
  factory's `div.dialog-header` re-fits from the live rect, so a LiChess Tools drag cannot park the
  window partly out of view and the moved rect is persisted into `geometry`.
  Direct-child lookups use Cash's `children(selector)`; a leading `>` in `find` reaches
  `querySelectorAll` and throws a DOMException, and the article's `:scope >` form is not this build's idiom.

### `windowEventHandler` (module singleton — P11 subset)
`start(source, event)` (a primary press begins a gesture — a finger counts, since a touch contact reports
no button (`-1`), while a right or middle click never opens the gate), `move(event)` (a 6px threshold then
`moveWindow` clamped to the viewport), `async end(event)` (a gesture that moved re-saves the geometry),
`pointerCancel(event)`, `cancel(ctrl)` and `clear()`. `keyDown(ctrl, event)` answers Escape once: a `_studyDbEscape`
memo keeps one keystroke one action, so it unwinds a resize and otherwise calls `owner.closeWindow`. The tab half — `tabButton`,
`click()`, `navKeyDown()` cycling Home/End/Arrows, the tab-preview clone and `transfer()` — died with the strip (§18.9);
the row click and keyboard guards live in `bookmarkView` instead.

### Geometry (`windowBounds.ts` names kept)
`minWindowWidth = 280`, `resizeEdges = ['e','se','s','sw','w']`, `clamp()`, `windowViewport()` (reads
`---site-header-height` through `lt.global`), `fitWindow()`, `moveWindow(rect,dx,dy,edge,viewport)` (P6's caller),
`displayColumns()` (the page's own 1019.3/1319.3 breakpoints, 1 column on a phone), `RecordsDbCtrl.initialGeometry()` (from
`aside.analyse__side` / `div.analyse__tools` / `.analyse__board` / `div.study__chapters` and `---block-gap`,
and - when the page is a phone or the panel hosts are missing - a viewport-derived box, one column wide and
under the site header, which replaced the PR's fixed `400×480` rect) and `offsetGeometry(ctrl)`.
`toggleHost()` picks the toggle's host: `.study__side .tabs-horiz` → `div.tabs-horiz` → `.study__side` →
`div.analyse__tools` → `body`.

### `StudyList` — deleted by P11, kept here as history
The flat list model lost its user when §18.9 removed the four tabs. The tree content owns what it used to own: selection
(`content.selected`, fed by the row click and the native `input.tree-select` checkbox), the haystack filter (`content.filters`
and `filterChanged()`, which bumps `revision` and repaints), the paint count (the header prints shown/total, and §18.11.5
keeps every folder “dim” rather than dropping it), and the `recordsDbMaxResults` ceiling where the engine scores
candidates. `infiniteScroll`, the boundary observers and `disposeObservers()` are gone — the tree paints what it holds. The
popup plumbing survives on its own: `popupPreviews` is a WeakMap keyed by the row element, `popupShown` names the
anchor whose tooltip is up, `hideTimeout` is the hide one side scheduled and the other has not cancelled yet
(§18.18), and `treePaint` marks the tree revision that owns it. `listData` still writes the row's
`data-key`, and `popupData` puts `data-popup` on the tooltip itself. The drag payload `application/x-lichess-records-db` is emitted
by the row handlers, and `dragOver`/`dropInto` with `canAttach`/`canDrop` consume it inside the same tree.

### Tabs — deleted by P11 (§18.9)
`MemberTabContent`, `HistoryTabContent`, `SearchTabContent` and `ResultTabContent` no longer exist. The rank map
{“member:0, contributor:1, owner:2”}, the `studyDbExcluded` skip and the “only studies carrying a role” rule
now live as the store’s branch rules (§19’s `branchOf`/`countKind`), and visit-order history stays mirror-side.
Nothing on this page is a live tab; do not resurrect them.

### Views (§18.9 deleted most of this list)
Alive in the shipped tree view: `bookmarkView` (which builds the header, the racks and its inner `rowOf`), `studyIcon`,
`studyLink`, `studyFilterInput`, `studyPublicIcon`, `studyNavigator` (kept only as the chapter tooltip, hung off the
whole row, carrying `tabindex`) and `highlightMatch`/`appendParts`/`matchRanges` (plain spans, no `<mark>`). Still
alive because Add and the tooltip need them: `listData` (writes the content’s `data-key`), `spinners()` (the Add
harvest spinner) and the popup set `popupData`/`popupNode`/`showStudyPopup`/`hideStudyPopup`, with `schedulePopupHide`
/`cancelPopupHide` deciding whether a `mouseout` may take the tooltip away - a row's `mouseout` and the tooltip's
own `mouseover` are one gesture, so the hide is scheduled and spent rather than run (§18.18); `popupShown` and
`treePaint` hold the state that decides which tooltip is up and which tree revision owns it.
Dead code, kept on this page as history only: `studyListView`, `studyRow`, `memberView`, `historyView`, `studyMatchView`
and the scroll machinery — the four tabs they served are gone, so no row list, scroll boundary or `.too-many` line
is reachable. Deviations recorded here: the powertip popup survives as §6’s `StudyPopup`, and the **chapter** tooltip
hangs off the whole row (`li`, carrying `tabindex`) rather than a button inside it, because §18.11.5
filters rows in and out and a child would be repainted with them, while `studyIcon` keeps its own members tooltip; `studyMatchView`
died with the results tab, so the engine’s `matchingChapterFields` feeds only that chapter tooltip — the one fact a row
cannot recompute from the record it is rendering. There is no `div.scroll-boundary` and no `IntersectionObserver`: the tree
paints what it holds, so the painted count moves with the filter, never with a click-to-load button.
Disclosure has two owners: a folder's caret calls `toggle()` for that row, and the actions rack's fold chip
calls `toggleAllExpanded()` over `folderNodes()` - the same reading as the caret, so one press opens the
whole tree while any folder is still closed and folds it once every one is open. Both are view state:
the shape is view state the window blob carries: `freeze()` writes the open folders and the selected
rows as `{path, key}` records, and `load()` re-adopts only the rows the blob still names by path and
key, so a folder the tree changed shape under just stays folded.
Gone is proof, not absence: `.record-missing` and the header's missing count follow `meta.deadAt`, the stamp Add
leaves after a 404 harvest, and `refreshCaches` carries a stamped study onto its chapter leaves through `goneNodes`
so `isGone` answers both the count and the paint. A leaf the mirror never saw is uncaptured - it keeps its row
button, its label fallback and its dim chips, and no line announces capture state: the header carries only what
header carries only what the tree cannot show by itself, so no line announces capture state (§18.17). What the
tree names stays put: `treeStudyIds()`
hands its study ids to `SyncCtrl.setTreeIds` on every load and save, so a study you do not own keeps its capture
(chapters, tags, chips) and its tooltip answers on the pages where you are not standing on the study, while a
leaf that leaves the tree drops its capture with it.
The capture reaches the mirror *late*, never absent: `SyncCtrl.load` reads the member blob first and the
captures blob after it, off the critical path, so a row can be painted before the study it names has a
record. `refreshCaches` stamps `hayRevision = sync.publishRevision` and `bookmarkView` refreshes whenever
that stamp trails the mirror, so the tooltip and the chips follow the publish rather than staying as cold as
the first paint (§18.15, with the header notes §18.17 removed).

### Navigation (§13)
`recordsDbModule.navigation.load(studyId, chapterId)` replaces `GET /study/db/load`: the same study stays in place and
switches chapter through `analysis.study.setChapter`; any other study sets `lt.location`. `studyLink(study, position)`
hands every row the `{href, navigate}` pair that calls it, so row `Enter` opens (and §18.6's open-and-return session hand-off
runs from there), while row `Space` and the native checkbox select.

## Cleanup on disable

`start()` closes whatever the previous page left open and removes the toggle button before deciding again, so
a page change can never leave a stale window behind. Preference off → return after that teardown: `close()`
saves the frozen window list to the `studyDb-windows` blob, then `dispose()`s every window — unwatching the
`SyncCtrl` repaint listener, closing its `<dialog>` and `destroy()`ing the one `BookmarkTabContent` it holds.
The tree view owns no observers, so there is nothing left to disconnect; `search()`, `transfer()`, `closeContent()`,
`attach()` and `sortContents()` died with the tab strip (§18.9), so a closing shell has no tab half to unwind. The
IndexedDB blobs stay untouched, so the database is warm for the next study page.

## Known risks

- The pointer machine is live, not a stub: `moveWindow` clamps every move through `fitWindow`, the five `.resize`
  strips drive it (`tools/dialog`'s header drag stops at the raw pointer, so `WindowFrame` re-fits on `pointerup`),
  and a row `dragstart` writes the `application/x-lichess-records-db` payload that `dragover`/`dropInto` consume
  through `canAttach`/`canDrop`. P8’s cross-window transfer of a row no longer exists — §18.9 deleted `transfer()`
  with the tab strip, and one window holds one tree — while `contentView()` answers only the tree:
  `content?.kind == 'treeTab' ? bookmarkView(content, host, box) : undefined`.
- The `toggleHost()` selector chain (`.study__side .tabs-horiz` → `div.tabs-horiz` → `.study__side` →
  `div.analyse__tools` → `body`) is unverified against a logged-in study page — the saved probes are curl HTML
  shells where the ESM builds the study DOM at runtime; the chain makes a miss harmless, and `installToggle()`
  returns false rather than guessing a host.
- `tools/recordsDbUi/tool.css` is interim P11 styling — P10 merges the PR’s six SCSS partials, and until then the
  licon glyphs the rows use (`studyIcon`, `studyPublicIcon`) rely on the page’s own `analyse.study` sheets.
- The `ro-RO` strings were written mechanically and need a human pass; the `data/crowdin.json` half of that is AssetGenerator's, never hand-edited.
- The hand-off that opens the window on arrival (`treeHandoffKey`) lives in `sessionStorage`, so it only survives a
  same-tab SPA navigation: a new tab, a middle-click or `target=_blank` loses it and the window stays a manual call.
  It is also one-shot and age-checked, so a study the user reloads by hand never reopens the window behind them.
- Mobile support (§18.14) is proven by the harness, not by a phone: `toggleHost()`'s selector chain is unverified
  against a phone DOM, so a miss means no toggle rather than a misplaced one; and the chapter tooltip still
  answers hover, which a browser emulates on tap but holds only while the finger rests - there is no tap-to-pin
  it yet. Keyboard shortcuts are absent there, so the chips and rows carry the whole touch flow.

## The window machine keeps its hosts (P11.15)

A repaint answers a query, so it runs on every keystroke in the filter textbox. What that paint may swap is
bounded by one rule: an element that leaves the document loses the caret that was in it, whether it was rebuilt
or only moved into a fresh subtree. So the window owns the chain above the textbox for its whole life -
`this.inner` (`div.inner-content`, hung once with the gesture listeners), `this.scrollHost` (the page's own
`.dialog-content` scroll wrapper), `this.treeHost` (the `.record-list` made by `BookmarkTabContent.viewHost()`,
which carries the tree's own listeners), the filters rack inside that host and `this.typedBox` (the textbox in
that rack, kept as the rack's last child). `bookmarkView(content, host, box)` fills the host it is handed and
swaps only the header, the actions rack, the body, the note, the backup rack and the rack's buttons.

The checks assert, after a repaint: the box and the hosts keep their identity; the listeners on a kept host are
hung once (inner host 6, tree host 3, textbox 1); the rack carries its three chips and the box only, the box
last; one of each piece survives; and the read order header -> filters rack -> actions rack -> body -> backup
rack holds. Harness: `studyDbWindow.check.js` 482 -> 498, mutation-tested on the new mechanism (box placed
every paint 1, chips after the box 1, no stale removal 58, inner host per paint 3, fresh rack per paint 5,
tree host per paint 16), each caught and restored green. The harness reaches the paint through cash selectors,
so the frame's piece lookup uses `find`, not `children` - the stubs implement `find` and would silently miss a
`children` call.
