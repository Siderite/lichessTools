# Records database tools — port of lila PR #22258 (the pair was renamed from the study database on
2026-11-04; the phase logs below keep the old names, and the pair now lives in `tools/recordsDbUi` + `tools/recordsDbStore`)

Goal: take the **study navigation / search / organization UI** from lila PR [#22258](https://github.com/lichess-org/lila/pull/22258)
(the `ui/studyDb` package: a floating, draggable, resizable multi-window with **Member / Bookmarks / History / Search** tabs,
client-side IndexedDB stores, and study-to-study navigation) and ship it as a **LiChessTools tool**, with **no server component**:
the browser IndexedDB replaces every `/study/db/*` endpoint and the Elasticsearch-backed search.

Scope agreed with the request: **only the study pages matter**. Nothing outside `/study/...` is touched.

**UI v2 (2026-11-02): the four-tab window is superseded by §18 — one view, tri-state filter chips (plus §19's kind
chip), a textbox filter, an action rack and a folder tree, generalized to any lichess object by §19. §18/§19 also
record what P11 deletes and what stays. The store layer (§3 shapes, §4 storage, §10 harvester) and P9's capture hooks
are unchanged by that redesign. Read §18 and §19 before touching §5/§6/§7.**

Legend: `[ ]` pending · `[x]` done · `[!]` blocked / known risk

---

## 0. What the PR actually contains (inventory)

Client (TypeScript / TSX — this is the part we port), lila head commit `683e9ffc436246d5937cd3c9694a9b05a0cc3b46`:

| PR file (`ui/studyDb/src/…`) | LOC | Role |
|---|---|---|
| `types.ts` | 156 | All the data shapes: `StudyData`, `ChapterData`, `StudyVisit`, `StudyPosition`, `StudyUpdated`, `TabStorage`, `StoredTab`, `StudySearchQuery`, `StudySearchOrder`, `SyncRecord/Update/Cache`, `Bookmark`, `BookmarkFolder`, `BookmarkEntry`, `StudyDrag` |
| `idbStudy.ts` | 135 | `IdbStudy` — the two IndexedDB stores (`study-history-<user>`, `study-db-<user>`), `historyLimit = 500`, `getHistory/updateStudy/getMember/storeMember/updatePosition/pruneHistory/write` |
| `syncCtrl.ts` | 207 | `SyncCtrl` — in-memory `Map<studyId, StudyData>` mirror, `loadHistory`, `load`, `synchronize` (POST `/study/db/sync`, ndjson), `store(incoming, partial)`, `publish()` rAF batching, `history` getter |
| `studyMetadata.ts` | 25 | `mergeStudyMetadata(cached, incoming)`, `matchesMetadata(value, query)` (deep, tags-aware) |
| `tabContentCtrl.ts` | 52 | `TabContentCtrl` — abstract tab base: `kind`, `label`, `icon`, `id = study-db-tab-<n>`, `closable`, `sync`, `signal`, `init()`, `destroy()`, `onChange`, `load()` |
| `studyList.ts` | 100 | `StudyList extends TabContentCtrl` — `ids`/`selected`/`query`/`revision`/`visible=50`/`anchor`, `entries` get/set, `select()`, `clearSelection()`, `drag()`, `includes()/matches()/compare()`, `filtered` getter, `results`, `hasMore`, `filterChanged()`, `loadMore()` |
| `memberTabContent.ts` | 45 | `MemberTabContent` — filters `{role, private}`, `includes()` role ranks `{member:0, contributor:1, owner:2}` |
| `historyTabContent.ts` | 38 | `HistoryTabContent` — entries = `sync.history` (already sorted by `visit.at`) |
| `bookmarkTabContent.ts` | 246 | `BookmarkTabContent` — bookmark **tree** (`entries`, `selected`, `expanded`, `editing`), `rows`/`results`/`hasMore`, `at(path)`, `siblings()`, `contains()`, `select()`, `drag()`, `drop(payload,parent,before)`, `prune()`, `save()` (POST `/study/db/bookmarks`) |
| `searchTabContent.ts` | 49 | `SearchTabContent` — the form model: `query`, `order`, `study{}`, `tags{}`, `pending`, `message`, `search` getter, `canSubmit` |
| `resultTabContent.ts` | 140 | `ResultTabContent(search)` — `closable = true`, `highlights` per field, `matchingChapterFields`, `submitted`, `label`, `fill()` = POST `/study/db/search` cursor paging |
| `studyDbCtrl.ts` | 296 | `StudyDbCtrl` — owns the singleton tabs, `Map<WindowCtrl, TabContent[]>`, `savedState = storedJsonProp('study.db.state')`, `open/close/toggle`, `mount`, `closeWindow`, `closeContent`, `bringToFront`, `search(source)`, `transfer(src,content,dest,geometry)`, `save()`, `load()`, `createWindow`, `attach`, `sortContents`, `initialGeometry()`, `offsetGeometry()`, `canOpen()` |
| `studyDb.ts` | 12 | `initModule({action})` entry — `ctrl ??= new StudyDbCtrl(); ctrl[action]()` |
| `windowBounds.ts` | 63 | `Rect`, `windowViewport()`, `fitWindow(rect, viewport)`, `moveWindow(rect,dx,dy,edge,viewport)`, `resizeEdges = ['e','se','s','sw','w']`, `minWindowWidth = 280` |
| `windowCtrl.ts` | 70 | `WindowCtrl` — `owner`, `tabCtrls`, `geometry`, `selectedTabId`, `windowFrame`, `redraw`, `show()`, `dispose()`, `freeze()`, `setGeometry()`, `activeContentCtrl`, `focusContent()`, `selectTab()` |
| `windowFrame.tsx` | 198 | `WindowFrame` — `snabDialog({class:'study-db', css:[{key:'studyDb'}], modal:false, …})` + tabs/content-frame/resize spans + drag-over/drop handling for bookmarks |
| `windowEventHandler.ts` | 250 | `windowEventHandler` — pointer gesture machine: `start`, `move`, `up`, `pointerCancel`, `click`, `keyDown`(Escape closes), `navKeyDown`(Home/End/Arrows), `cancel`, `clear`, tab-preview clone, drop-target marking |
| `popupData.ts` | 82 | chapter-count tooltips via `$.powerTip` (`popupId: 'studyContentPreview'`) |
| views (`studyListView.tsx` 367, `searchView.tsx` 176, `bookmarkView.tsx` 260, `memberView.tsx` 94, `historyView.tsx` 37) | 934 | the whole rendered UI: `.study-list`, `.tabs > button[role=tab]`, `.study-row` listbox rows, `.study-navigation`, `.study-match`, `.search` form, `member-controls`, `scroll-boundary` infinite scroll |
| `windowEventHandler`/`types` etc. above + SCSS `_bookmark/_frame/_member/_result/_search/_study-list` (852 lines) | | styling |

Integration on study pages (also PR, kept in spirit): `ui/analyse/src/study/studyNavigation.ts` (80 lines, `/study/db/load/:id`),
`studyCtrl.ts` (+117/-16 → `studyMetadata()` and `publishUpdated()` emitting `studyDb.updated` + `idbStudy.updateStudy`), `studyKeyboard.ts` (+18/-6), `css/study/_buttons.scss` (`button.study-db-button`).

Server (thrown away entirely): `POST /study/db/sync`, `POST /study/db/search`, `GET|POST /study/db/bookmarks`, `GET /study/db/load/:id`
(`app/controllers/Study.scala` +122 lines), `JsonView.studyDbMetadata`, `SearchClient/SearchCursor/SearchPaginator`,
`bin/elastic/study.ts` + `ingest.ts` Elasticsearch ingestion, `lila.study.studyRepo.syncSource`.

## 1. Keep / drop / replace

| PR thing | Verdict | LiChessTools replacement |
|---|---|---|
| `IdbStudy` over `lila.lib.objectStorage` (`study-history-<user>`, `study-db-<user>`, index `updatedAt`) | **keep, re-implemented** | `IdbStudy` over `LiChessTools.Storage` with `{ db: true, raw: true }` → `LiChessTools.IndexedDbStorage`, key shape `dbName/storeName/itemName`. One **blob per logical store** (not one IDB record per study) because `IndexedDbStorage` exposes no bulk read/`cursor`; filtering happens in the in-memory `Map`. |
| `SyncCtrl` in-memory DB (`store()`, `history`, `publish()`) | **keep 1:1** | events renamed to `lichessTools.*`. `synchronize()` (server ndjson) → `harvest()`. |
| `POST /study/db/sync` enumeration of every study of the user | **drop** | `StudyHarvester` scrapes Lichess's own study-list pages (`/study/mine/:order`, `/study/member/…`, `/study/public/…`, `/study/private/…`, `/study/likes/…`, `/study/by/:username/:order`, `/study/search?q=…`, `?page=N`) and parses rows; plus per-study JSON capture; plus opportunistic capture on page visit. |
| `metadataRevision` (server counter) | **drop** | local `revision` counter bumped per capture, kept in `studyDb-syncMeta`. |
| Elasticsearch `POST /study/db/search` | **drop** | client-side filtering + the 7 orderings scored in JS (§11). |
| `GET\|POST /study/db/bookmarks` (server-synced bookmarks) | **drop** | bookmark tree in IDB key `lichessTools/LT/studyDb-bookmarks`; **browser-local only**; cross-tab write guard through `Cache.lock` / `APISemaphore`. |
| `GET /study/db/load/:id` (switch study inside the same page) | **drop** | `StudyNavigation.load()`: same study → `analysis.study.setChapter(id)`; other study → `lt.location.set('/study/<id>/<chapterId>')`. |
| `studyDbExcluded` server flag | **keep client-side** | `!!(study.relay \|\| study.practice)`. |
| window/tab/geometry/gesture machine, list rendering, search form, bookmark tree ops | **keep 1:1** | Cash DOM instead of snabdom/TSX; the `<dialog>` shell comes from `lt.dialog` (`lt.uiApi.dialog.domDialog`). |
| `ui/analyse/src/ctrl.ts` cleanup hooks (+115/−47) | **out of scope** | "no changes outside the study pages". |

## 2. Where the code lands

```
tools/recordsDbUi/tool.js        # one IIFE, all classes (repo precedent: tools/localDatabase/tool.js has 3 classes)
tools/recordsDbUi/tool.css       # the 6 SCSS partials merged, LT-prefixed
tools/recordsDbUi/context.md     # tool doc (repo convention)
manifest.json / .chrome / .edge / .ff  # + "tools/recordsDbUi/tool.js" in the tools block, + "tools/recordsDbUi/tool.css" in css[]
scripts/lichessTools-init.js # lichessTools.loadTool(LiChessTools.Tools.StudyDb);  after EmitChapterChange/EmitCommentChange, after Dialog
data/crowdin.json            # new intl keys (§12)
scripts/context.md, root context.md, HISTORY.md, issues-worklist.md  # docs
test/studyDb.check.js        # gitignored node harness (§16)
```

Fallback split (only if the single file becomes unreadable, target > 2 500 lines):
`tools/recordsDbUi/tool.js` = UI shell + views, `tools/recordsDbStore/tool.js` = `IdbStudy` + `SyncCtrl` + `StudyHarvester` + metadata merge,
with `dependencies = ['StudyDbStore']`.

## 3. Data model (TS interfaces → JS shapes + doc comments)

All PR `interface`/`type` declarations become plain object literals documented with `@typedef`; `as const` arrays become frozen arrays.
Field names are **kept identical** so the plan, the PR review thread and the eventual code all speak the same language.

```js
// StudyData  (unchanged field set from PR types.ts)
{ studyId, studyName, metadataRevision /* local revision counter */, role /* 'owner'|'contributor'|'member' */,
  visibility /* 'public'|'unlisted'|'private' */, updatedAt /* epoch ms */, createdAt, description,
  ownerId, public, settings, from, topics /* string[] */, chapterCount, studyDbExcluded, liked, likes, flair,
  owner /* LightUser|null */, members /* [{user, role:'r'|'w'}] */, chapters /* ChapterData[] */,
  matchingChapterIds, matchingChapterFields /* {chapterId: string[]} */, visit /* StudyVisit */ }

// ChapterData
{ id, name, description, variant, setup {variant{key,name}, orientation, gameId, fromFen},
  tags /* [[name,value]] */, order, ownerId, createdAt, conceal, practice, gamebook }

// StudyPosition { chapterId, orientation, path /* TreePath string */ };  StudyVisit = StudyPosition + { at: epoch }
// TabStorage  { kind: 'historyTab'|'memberTab'|'bookmarkTab'|'searchTab'|'resultTab', active, search? }
// StoredTab   = TabStorage + { geometry: Rect }
// StudySearchOrder = 'relevant'|'hot'|'newest'|'oldest'|'updated'|'popular'|'alphabetical'
// StudySearchQuery { order, study{ text,name,description,topics,owner,member },
//                    chapter{ text,name,description, tags{variant,eco,opening,player1,player2,
//                                                        fideId1,fideId2,color1,color2,event} } }
// SyncUpdate  = { type:'upsert', study } | { type:'delete', studyId } | { type:'complete' }
// Bookmark { name, studyId, studyName };  BookmarkFolder { name, children: BookmarkEntry[] }
// StudyDrag = { kind:'studies', entries:[{studyId,studyName}] } | { kind:'bookmarks', paths:number[][] }
// LT addition — HarvestMeta { fetchedAt, pages, complete, partialCoverage{ chapters:boolean, tags:boolean } }
```

## 4. Storage layer

### `IdbStudy` — same method names as the PR

Everything goes through `lt.storage.get/set(key, value, { db: true, raw: true })` (returns a Promise — always `await`),
which routes to `LiChessTools.IndexedDbStorage` and keeps us inside LiChessTools' own IDB partition (`db = lichessTools`, `store = LT`).

| key | value | replaces |
|---|---|---|
| `lichessTools/LT/studyDb-member` | `{ studies: StudyData[], complete: boolean }` (`SyncCache`) | the `study-db-<user>` store and its `updatedAt` index |
| `lichessTools/LT/studyDb-captures` | `{ studies: StudyData[] }` | nothing - the studies the tree filed that the user does not own |
| `lichessTools/LT/studyDb-history` | `StudyData[]`, each with `visit` | the `study-history-<user>` store (cap `historyLimit = 500`) |
| `lichessTools/LT/studyDb-bookmarks` | `{ entries: BookmarkEntry[] }` | `GET`/`POST /study/db/bookmarks` |
| `lichessTools/LT/studyDb-windows` | `StoredTab[]` | `storedJsonProp('study.db.state')` |
| `lichessTools/LT/studyDb-syncMeta` | `{ revision, lastHarvestAt, manifest, historyLimit }` | server `metadataRevision` bookkeeping |

Methods: `getHistory(signal)`, `updateStudy(study, chapterId, path, orientation)`, `getMember(onBatch, signal)`,
`storeMember(update)`, `updatePosition(path, position)`, `getCaptures(onBatch, signal)`, `storeCapturesAll(updates)`,
`pruneCaptures(keepIds)`, `pruneHistory()`, `write(op)` (identical serial chain), plus new `harvestMember(groups, signal)`,
`harvestOne(studyId, signal)`, `clearEverything()`, `saveBookmarks(entries)`.
`isStudyDbAvailable(pathname)` kept (`!/^\/(?:broadcast|practice|learn)(?:\/|$)/`) with `lt.location.isStudyList()` as the positive gate.
`myUserId()` → **`lt.getUserId()`**; `structuredClone` → **`lt.clone`**.

### `SyncCtrl` — in-memory mirror (PR names kept)

Fields `complete`, `error`, `studies: Map<string, StudyData>`, `pendingUpdates: Set`, `listeners: Set`, `frame`, `request`, `updating`;
methods/getters `get loading`, `get history`, `watch(onChange)`, `store(incoming, partial = false)`, `loadHistory(signal)`,
`load(signal)`, `publish()` (single `requestAnimationFrame` batching pass), `studyUpdated(update)`, `integrateUpdates()`.
`load()` = `await IdbStudy.getMember(batch → { store each; publish() })` → `integrateUpdates()`.

**New** `harvest(signal)` replaces `synchronize()`:

```js
harvest(signal) {
  for (const group of StudyHarvester.groups())            // mine | member | public | private | likes
    for (let page = 1; !complete && !signal.aborted; page++) {
      const rows = await StudyHarvester.fetchPage(group, page, order, signal);   // lt.network.fetch + DOM parse
      if (!rows.length) break;
      for (const row of rows) store(row, true);                                  // partial StudyData
      publish();
      await lt.timeout(harvestDelayMs);                                          // honour lt.network.slowMode
    }
  await IdbStudy.storeMember({ type: 'complete' });
  complete = true; publish();
}
```

### `StudyMetadata` helpers (PR `studyMetadata.ts`, names kept)

`mergeStudyMetadata(cached, incoming)` and `matchesMetadata(value, query)` port verbatim (drop TS generics / `Extract<>`).

### `StudyHarvester` — replaces the whole server DB

- `groups()` → the list groups above; `pageOf(group, page, order)` → `'/study/mine/newest?page=N'`, `/study/by/<user>/<order>?page=N`,
  `/study/search?q=…&page=N`, fetched with `lt.network.fetch` (free `X-UA`, free 429 → `slowMode`).
- `parseListPage(html)` → `lt.global.DOMParser` + `lt.$(doc)`. Row markup is known exactly from `StudyListUi.paginate` +
  `StudyBits.widget`: `div.studies` (optionally `infinite-scroll`, `compact`), row = `a.study.compact.paginated` (href `/study/<id>`)
  or `div.study.paginated` containing `a.overlay[href=/study/<id>]`, `div.top > div.study__icon` (flair), `h2.study-name`,
  meta `span` = padlock `[data-icon]` ⇒ private, filled/outlined heart ⇒ `liked`, likes count, `titleNameOrId(ownerId)`,
  `<time data-ut>` ⇒ `createdAt`, `div.body > ol.chapters > li.text` (**names only**), `div.body > ol.members > li.text`
  (`data-icon` radio tower ⇒ canContribute ⇒ `role`). `div.nostudies` ⇒ empty page.
- `parseStudyJson(url)` → the study page's embedded module JSON (`script[type="application/x.lichess+json"]` / `script#page-init-data`,
  the tag `tools/pageInitData` already intercepts) → **full** `StudyData` incl. `chapters[]` ids/tags. Probe this in P1 (§15) before depending on it.
- `captureFromLivePage()` — builds `StudyData` from `lt.lichess.analysis.study` on a study page (mirror of PR `StudyCtrl.studyMetadata()`):
  `study.data.{id,name,description,topics,liked,likes,flair,settings,from,chapter}`, `study.chapters.list` ids/names/order,
  `study.vm.updatedAt`, `owner`/`members` from `study.data.members`. Defensive per-field `?.` because the live lila build differs from the PR build.
- Throttling/completeness: `Cache.lock('studyDb.harvest')` + `lt.APISemaphore` so two tabs never harvest at once; stop on `signal.aborted`.

## 5. Content tabs

> **§18 supersedes this section's UI**: P11 keeps `TabContentCtrl`/`StudyList` only as far as the bookmark tree needs
> them and deletes `MemberTabContent`, `HistoryTabContent`, `SearchTabContent` and `ResultTabContent` (§18.9). The
> shapes below stay in the store, which P11 does not touch.

### `TabContentCtrl` (abstract base — PR names kept)

`kind`, `label`, `icon`, `id = 'lichessTools-study-db-tab-' + nextId++`, `closable = false`, `sync` (the `SyncCtrl` singleton),
`signal`, `lifetime`, `loaded`, `init()` (creates `lifetime`, awaits `load()`), `destroy()` (aborts lifetime, neutralises `onChange`),
`onChange = () => {}`, `load()` (returns `void | Promise<void>`).
`AbortController`/`AbortSignal` stay — declare the **`FixAbortController`** dependency (that tool patches `abort()`).

### `StudyList extends TabContentCtrl` (PR names kept)

`ids: string[]`, `selected: Set<string>`, `query`, `revision`, `visible = 50`, `anchor`,
`get entries` / `set entries` (JS accessor pair kept), `select(studyId, event)` (ctrl/meta/shift range logic kept),
`clearSelection()`, `drag(studyId, event)` (sets `event.dataTransfer.setData(studyDragType, …)`),
`protected` → plain methods: `includes(entry)`, `matches(entry, query)`, `compare(left, right)`,
`get filtered` (filter → sort), `get results` (`filtered.slice(0, visible)`), `get hasMore`, `filterChanged()`, `async loadMore()`.

### `MemberTabContent`

`filters = { role: 'member', private: false }`; `includes()` keeps the rank map `permissions = {member:0, contributor:1, owner:2}`;
`get loading` / `get exhausted` / `get error` delegate to `sync`; `load()` → `sync.load(signal)`; `retry()`.

### `HistoryTabContent`

`entries` → `sync.history` (sorted by `visit.at` desc, capped at `historyLimit`), `compare()` → `0`,
`load()` → `sync.loadHistory(signal)` with the PR's `request` counter guard against stale errors, `retry()`.

### `BookmarkTabContent`

The whole tree handling is kept: `entries: BookmarkEntry[]`, `selected: Set<BookmarkEntry>`, `expanded: Set<BookmarkFolder>`,
`query`, `revision`, `editing {entry, name}`, `error {message, retry}`, `visible`, `anchor`, `writes` serial chain,
`get rows` (recursive `visit(entries, parent)` with query pruning + `expanded` expansion), `get results`, `get hasMore`,
`filterChanged()`, `loadMore()`, `select(entry, event)`, `clearSelection()`, `at(path)`, `siblings(target, entries)`,
`contains(entry, target)`, `canDrop(payload, parent)`, `drop(payload, parent, before)`, `drag(entry)`, `prune()`,
`editName(entry, name)`, and `save()` → `await IdbStudy.saveBookmarks(this.entries)` (replaces `POST /study/db/bookmarks`
and the follow-up study re-store, unnecessary because the studies are already local).

### `SearchTabContent`

`query`, `order`, `study {}`, `tags {}`, `pending?: ResultTabContent`, `message?`,
`get search` (the `clean()` field-trimmer stays a local function), `get canSubmit`, `destroy()` override.

### `ResultTabContent(search)`

`closable = true`, `search = lt.clone(search)`, `highlights` (the PR's field→terms table kept verbatim),
`matchingChapterFields: Map`, `exhausted`, `error`, `cursor`, `request`, `get submitted`, `get label`,
`get filtered` → `entries`, `get loading`, `hasMore` override, `load()`, `loadMore()`, `retry()`.
`fill()` is the only real change: instead of `POST /study/db/search` it calls the in-browser sorter

```js
const { items, nextCursor } = await StudySearchEngine.run(this.search, { cursor, size }, signal);
this.entries = [...(loaded ? this.entries : []), ...items];
this.cursor = nextCursor ?? undefined;
this.exhausted = nextCursor == null;
```

`matchingChapterFields` comes from the same pass — it is what says *which* chapter fields matched.

## 6. Window shell

### `windowBounds` (module-level functions, PR names kept)

`Rect = {left, top, width, height}`; `minWindowWidth = 280`; `resizeEdges = ['e','se','s','sw','w']`;
`windowViewport()` (reads `---site-header-height` via `lt.global.getComputedStyle(document.body, …)`), `fitWindow(rect, viewport)`,
`moveWindow(rect, dx, dy, edge, viewport)`. `lib/algo.clamp` → local `clamp(value, {min, max})`.

### `StudyDbCtrl` (PR names kept; `savedState` becomes async)

`tabs = { memberTab, bookmarkTab, historyTab, searchTab }`, `windowContents: Map<WindowCtrl, TabContent[]>`,
`get windows`, `hasWindow(ctrl)`, `clearSelection(except?)`, `mount(ctrl)`, `closeWindow(ctrl)`, `closeContent(ctrl, content)`,
`bringToFront(ctrl)`, `open()`, `close()`, `toggle()`, `async search(source)`, `transfer(src, content, dest?, geometry)`,
`save()` → `await IdbStudy.saveWindows(this.windows.map(ctrl => ctrl.freeze()).flat())`, `load()` (validate `StoredTab[]`,
group rows by identical `Rect`, rebuild windows, append the four singletons to the first group),
`createWindow(contents, geometry)`, `attach(ctrl, incoming)`, `sortContents(contents)`,
`initialGeometry()` (kept as-is: `aside.analyse__side` / `div.analyse__tools` / `.analyse__board` / `div.study__chapters`
and `---block-gap`), `offsetGeometry(ctrl)`, `canOpen()` = `!!lt.getUserId() && isStudyDbAvailable(lt.location.pathname) && !lt.isMobile()`.
`storedJsonProp('study.db.state')` → the IDB blob `studyDb-windows`, hence `load()`/`save()` become `async`.

### `WindowCtrl` (PR names kept)

`owner`, `tabCtrls`, `geometry`, `selectedTabId`, `windowFrame`, `redraw = () => windowFrame?.redraw()`,
`unwatch = syncCtrl.watch(redraw)`, `show()`, `dispose()`, `freeze()`, `setGeometry(rect)`,
`get activeContentCtrl`, `focusContent()`, `selectTab(id)`.

### `WindowFrame` — TSX/snabDialog → Cash + `lt.dialog`

- `show()` = `await lt.dialog({ closedBy: 'none', modal: false, class: 'study-db', noEscClose: true, header: false })`.
  `tools/dialog` calls Lichess's own `lt.uiApi.dialog.domDialog`, i.e. **the same `<dialog>` component the PR wraps**,
  which gives the modal toggle, Escape-close, scrollable wrapper and base styling for free. The frame then renders
  itself with Cash into that node: `div.tabs [role=tablist]` → `button[role=tab]` per `tabCtrls`
  (`id`, `aria-selected`, `tabindex`, `title`, `.tab-icon` with `data-icon` or `.tab-label`, `.tab-close` only for
  `closable` tabs when `tabCtrls.length > 1`), `button.window-close`, `div.content-frame` → `contentView(active, submit)`,
  and the five `span.resize[data-resize=e|se|s|sw|w]`.
- `apply(rect)`, `readonly fit()`, `redraw()`, `close()`, `setOrder(order)` (custom property `---study-db-frame-order` kept).
- Event wiring: Cash delegation `$('<selector>').on(...)` over the dialog subtree — `pointerdown/pointermove/pointerup/lostpointercapture`,
  `click`, `keydown`, plus `dragover`/`drop` on the Bookmarks tab button; `dragstart` on `.study-row` is kept and
  `studyDragType = 'application/x-lichess-study-db'` stays the `dataTransfer` MIME.
- snabbdom virtual keys (`key={list.revision}`, `key={studyId}`) have no Cash equivalent: keep the same values and re-render
  the `.body` div wholesale on `revision++`; for more than 100 rows use `$.cached` + `toggleClassSafe` rather than rebuilding.

### `windowEventHandler` (module singleton, PR names kept)

`gesture {source, content, selected, edge, rect, moved, capture, pointerId, x, y, offsetX, offsetY, preview, ghostTab, target, destination, cursorTimer}`,
`releaseClick`, `start(source, event)`, `move(event)`, `up(event)`, `pointerCancel(event)`, `cancel(ctrl?)`, `click(source, event)`,
`keyDown(ctrl, event)` (Escape closes the window), `navKeyDown(ctrl, event)` (Home/End/Arrows cycle tabs), `clear()`.
The tab-preview clone (`div.study-db.tab-preview`, `inert`, ids stripped) and `setPointerCapture`/`releasePointerCapture` are kept.

### `StudyPopup` (PR `popupData.ts`)

PR uses `$.powerTip` (jQuery plugin, `ui/site/src/powertip.ts`) — not available on Cash.
Replacement: `showStudyPopup(anchorEl, items, title)` / `hideStudyPopup(anchorEl)` around one lazily created
`div#lichessTools-studyContentPreview` (`role=tooltip`, `max-height` bounded as in the PR, placement `se` with a title, `s` without).
Keep `focusin/focusout`, Enter/Space/Escape and click-to-navigate with the same button/modifier guards.
`popupData(items, title)` keeps its name and returns a wiring record consumed by `applyPopup(el, items, title)`.

## 7. View builders (TSX → Cash functions, same names)

`studyListView(list, controls)`, `studyRow(list, study)`, `studyNavigator(study, position, matchingFields?)`,
`studyLink(study, position)` (returns `{ href, navigate() }` — `navigate()` = `lt.location.set(href)`),
`studyFilterInput(content)`, `studyMatchView(entry, termsFor, matchingFields)`, `highlightMatch(text, terms)`,
`matchSnippet(text, terms)`, `memberView(content)`, `historyView(content)`, `bookmarkView(content)`,
`searchView(content, submit)`, `contentView(content, submit)`, `spinners()` (return `lt.spinnerHtml` nodes),
`infiniteScroll(onGrow)` → IntersectionObserver/scroll watcher built on `$.observer()` (Cash helper) or
a simpler `.scroll-boundary` + `loadMore()` call, `listData(id)` → `{ attr('id'), attr('data-lt-id') }`.
`i18n.site.none` → `trans.noarg('studyDb.none')`. `licon.X` names (`licon.User/Clock/Book/Search/X/Reload/Meridians/Book/InternalArrow/Padlock/Heart`)
→ keep `data-icon` attributes; on study pages the licon font is already loaded (`analyse.study` sheet),
fall back to `fontIcons` glyphs if the selector turns out to be scoped.

## 8. The tool class

```js
class StudyDbTool extends LiChessTools.Tools.ToolBase {
  dependencies = ['EmitRedraw','EmitChapterChange','EmitCommentChange','FixAbortController',
                  'DetectThirdParties','Dialog','PageInitData'];

  preferences = [
    { name:'studyDb',             category:'study', type:'single',   possibleValues:[false,true], defaultValue:true, advanced:true },
    { name:'studyDbTabs',         category:'study', type:'multiple', possibleValues:['history','member','bookmarks','search'],
                                 defaultValue:'history,member,bookmarks,search', advanced:true },
    { name:'studyDbSync',         category:'study', type:'single',   possibleValues:['off','manual','auto'],
                                 defaultValue:'manual', offValue:'off', advanced:true },
    { name:'studyDbHistoryLimit', category:'study', type:'number',   defaultValue:500,   minValue:50,    maxValue:2000,  advanced:true, hidden:true },
    { name:'studyDbMaxResults',   category:'study', type:'number',   defaultValue:1000,  minValue:100,   maxValue:10000, advanced:true, hidden:true },
    { name:'studyDbHarvestDelay', category:'study', type:'number',   defaultValue:400,   minValue:0,     maxValue:5000,  advanced:true, hidden:true },
    { name:'studyDbWindowCount',  category:'study', type:'number',   defaultValue:1,     minValue:1,     maxValue:4,     advanced:true }
  ];
}
LiChessTools.Tools.StudyDb = StudyDbTool;
```

`init()` installs the module singletons once (`studyDbCtrl`, `syncCtrl`, `idbStudy`, `windowEventHandler`,
module-level `nextTabId`, `studySearchEngine`) and registers the hooks:

| hook | where | why |
|---|---|---|
| `lt.pubsub.on('lichessTools.redraw', …)` | debounced render pass | the PR re-renders through `syncCtrl.publish()`; here `publish()` emits and this tool listens |
| `lt.pubsub.on('lichessTools.chapterChange')` / `…commentChange` | `captureFromLivePage()` + row refresh | mirror of PR `studyCtrl.publishUpdated()` |
| `lt.uiApi.events.on('analysis.change', fn)` | `idbStudy.updatePosition(path, position)` | **exact** PR equivalent — `studyLinks` and `cevalLineOptions` already use `lt.uiApi.events.on('analysis.change', …)` |
| `lt.wrapFunction(analysis.study.setChapter, {id:'studyDb', after})` | keep the visit pointer fresh after a chapter switch | same reason as the PR's `analysis.change` listener |
| `lt.location.isStudyList()` | harvest-page gate | only scrape on `/study…` list pages |

`start()` does, in repo order:
1. `const value = lt.currentOptions.getValue('studyDb'); this.logOption('Study database', value);`
2. unwrap then (if enabled) re-wrap `analysis.study.setChapter` / `study.vm.toolTab` — the repo's unwrap-first pattern;
3. when disabled: remove `.lichessTools-studyDb` nodes, drop listeners, **keep the IndexedDB data**, return;
4. when `canOpen()` is false (`!lt.getUserId()`, `lt.isMobile()`, `/practice|learn|broadcast`): remove the window, keep the DB warm;
5. otherwise `await studyDbCtrl.load()` → `studyDbCtrl.open()` (or `toggle()` if the option asks for a closed restore),
   with disabled tabs removed from `studyDbCtrl.tabs` per `studyDbTabs`.

`intl` keys to add (also into `data/crowdin.json`): `options.study`, `options.studyDb`, `options.studyDbTabs`,
`options.studyDbSync`, `options.studyDbHistoryLimit`, `options.studyDbMaxResults`, `options.studyDbHarvestDelay`,
`options.studyDbWindowCount`, the option values (`off/manual/auto/history/member/bookmarks/search`), and the UI strings
`studyDb.none`, `studyDb.member`, `studyDb.history`, `studyDb.bookmarks`, `studyDb.search`, `studyDb.relevance`, `studyDb.hot`,
`studyDb.newest`, `studyDb.oldest`, `studyDb.updated`, `studyDb.popular`, `studyDb.alphabetical`, `studyDb.private`,
`studyDb.owner`, `studyDb.contributor`, `studyDb.synchronize`, `studyDb.retry`, `studyDb.noResults`, `studyDb.closeWindow`,
`studyDb.closeTab`, `studyDb.navigateAria`, `studyDb.chaptersAria`, `studyDb.filterPlaceholder`, `studyDb.searchPlaceholder`,
`studyDb.localOnlyNote` (this last one replaces the PR's "bookmarks are synced with the server" copy).

## 9. TS → JS translation rules

| TS construct in the PR | JS port in LiChessTools |
|---|---|
| `import { X } from './y'` (pnpm workspace `study-db`) | none — one IIFE; class order must satisfy use-before-instantiation (class *declarations* hoist, module-level `new IdbStudy()` singletons do not) |
| `export class C extends B { override m() {} }`, `private`, `readonly`, `protected` | plain `class C extends B`; access modifiers become doc comments (the repo uses no `#fields`) |
| `get x()` / `set x(v)` accessor pair | kept as JS accessors (`StudyList.entries`, `SyncCtrl.history`, `WindowCtrl.windows`) |
| `interface T {…}`, `type A = A \| B`, `Extract<SyncRecord, {type:'upsert'}>`, generics | `@typedef` comments + plain object literals; unions become documented shapes |
| `const orders: [X,string][]`, `as const` | `const orders = [['relevant','Relevance'], …]` |
| TSX `<div class={[cond && 'x']} attrs={{…}} on={{…}} hook={…}>` | Cash `$('<div class="x">')`, `.attr()`, `.text()`, `.append()`, `.on()`; class arrays → `addClass` per truthy entry |
| `snabDialog({ctx, render, css:[{key:'studyDb'}], modal:false})` | `lt.dialog({ closedBy:'none', modal:false, … })` (`Dialog` dependency) + Cash content |
| `lib/xhr` `json()`, `text()`, `xhrHeader`, `jsonHeader`, `readNdJson` | `lt.network.json/postForm/fetch`; `lt.ndjsonParse` exists but becomes unused once there is no server |
| `structuredClone(x)` | `lt.clone(x)` |
| `lib/storage.storedJsonProp('study.db.state')` (sync) | `lt.storage` `{db:true, raw:true}` blobs inside `IdbStudy` — **every `save()`/`load()` call site becomes `await`-ed** |
| lila `pubsub.on/emit('analysis.change')` | `lt.uiApi.events.on/off('analysis.change', fn)`; LiChessTools' own events stay on `lt.pubsub` with `lichessTools.` prefixes |
| `lib/common.myUserId()` | `lt.getUserId()` |
| `lib/licon.licon.User/Clock/Book/Search/X/Reload/Meridians/InternalArrow` | keep the `data-icon` attribute values |
| `lib/view.focusableWithin`, snabbdom `patch` | `$` queries; re-render on `revision` (Cash has no virtual DOM) |
| `$.powerTip` (jQuery plugin) | `StudyPopup` (§6) |
| `document.querySelector` | `lt.$(selector)`; only `getComputedStyle` reads go via `lt.global` |
| `requestAnimationFrame` | `lt.global.requestAnimationFrame` |
| lila CSS custom props `---block-gap`, `---site-header-height`, `---study-db-frame-order` | kept — study pages ship the `analyse.study` sheets; `lt.loadCss('analyse.study')` covers a missing key |

Traps found while reading the PR:
- `abort()` on an already-aborted signal → covered by the `FixAbortController` tool; declare the dependency.
- `IndexedDbStorage` has **no bulk read** (`getAll`/`cursor`) → blob-per-store design instead of per-record records (§4).
- `Object.values(this.tabs)` ordering decides tab order in `sortContents`/`load()` → replace with an explicit `tabOrder` array.
- `pruneHistory()` and `write()` make IndexedDB a *sequenced* resource → keep the `this.writes` chain unchanged.
- The PR's `ResultTabContent` assumes the server did the search; the client sorter must also return `matchingChapterFields`,
  which the row renderer depends on.

## 10. Replacing the server DB with a browser DB (`StudyHarvester`)

Three complementary sources, merged with `mergeStudyMetadata`:

1. **List-page scrape** — login-gated groups `/study/mine/:order`, `/study/member/:order`, `/study/public/:order`,
   `/study/private/:order`, `/study/likes/:order` + public `/study/all/:order`, `/study/by/:username/:order`,
   `/study/search?q=…&order=…`; `StudyListUi.paginate` adds `?page=N` itself and renders `div.nostudies` on an
   empty group ⇒ that is the paging stop rule.
   Default GET renders the **card** format (`format.compact == false`): `div.studies[.infinite-scroll]` >
   `div.study.paginated` > `StudyBits.widget` = `a.overlay[href=/study/ID, title=name]`,
   `div.top > div.study__icon[icon flair|studyBoard]`, `h2.study-name`, meta `<span>` =
   `[icon class=private]?  [icon heart|heart-outline]  <likes> • <owner> • <time class="timeago" datetime="…Z">`;
   `div.body > ol.chapters > li.text[data-icon]` (**chapter names go through `removeMultibyteSymbols` for non-members** —
   exact names only from page-init JSON), `div.body > ol.members > li.text[data-icon]`.
   The **compact** format (`a.study.compact.paginated` > `span.study__icon` + `span(name)`) is cheaper but carries
   no likes/owner/time/chapters ⇒ `parseListPage` targets the card widget and tolerates compact.
   Sets `partialCoverage = {chapters: true, tags: false}`.
2. **Per-study page-init JSON fetch** — **verified present**: `GET /study/:id` HTML contains
   `<script nonce="…" type="application/json" id="page-init-data">{…}</script>` (no `x.lichess+json` variant;
   nonce varies ⇒ select by `id`). Validated by `JSON.parse` of `test/_pr22258/_probe_pageInitData.json`:
   top level `study, data, tagTypes, userId, chat, socketUrl, socketVersion, explorer, externalEngineEndpoint`;
   `study` = `id,name,members,position,ownerId,settings,visibility,createdAt,secondsSinceUpdate,from,likes,liked,
   features,topics,chapter,chapters,showRatings`; `chapters[i]` = `id,name,fen,players,lastMove,status` (+ `orientation`);
   `chapter` (the **displayed** one only) = `id,name,ownerId,setup,tags,features` (+ optional `description`, `gamebook`);
   `tags` = `[[type, value], …]` — e.g. `[["Event","ChessBench Arena"],["Variant","Chess960"],["Result","1-0"],["Date","2026.04.29"]]`
   ⇒ `StudySearchEngine` maps its tag fields onto those pair keys, and the **vocabulary is the top-level `tagTypes`**,
   so no guessing is needed for the search chips. `userId` in the same blob replaces `myUserId()`.
   **List pages carry no `page-init-data`** ⇒ they must be DOM-scraped. One request per study, but
   **`tags`/`description` exist only for the displayed chapter**, so a chapter-tags harvest is
   1 request per chapter (`GET /study/:id/:chapterId`) — opt-in only.
3. **Live-page capture** — on a study page, read the in-page `<script id="page-init-data">` blob and `JSON.parse` it
   (`document.scripts` equivalent via `lt.$('script#page-init-data')`): it already carries the full `study` object
   **including `position{chapterId,path}`**, i.e. exactly the `visit.{chapterId,path}` the History tab needs, plus
   `chapters[i].orientation`. This replaces the PR's `StudyCtrl.studyMetadata()` DOM/board-reading path and is free
   (no request). Keep `lt.lichess.analysis.study` only for the *keyboard/overlay* affordances, not for metadata.
   Note the blob is the **displayed** chapter's state, so a study opened in several chapters needs one capture per
   chapter visit (`GET /study/:id/:chapterId` or in-page `setChapter` + re-read) to get per-chapter tags.

Rules: never let a thinner record overwrite a fuller one (compare `metadataRevision`, then `chapterCount`);
`studyDbExcluded` computed client-side for relays/practice; `complete` only when every group finished without an error;
`clearEverything()` makes the tool re-harvest from scratch — that preserves the PR's "everything can be cleared from
site data with no ill effects" guarantee.

### 10.1 P1 probe results (2026-11-01, curl from this machine, artifacts `test/_pr22258/_probe_*`)

| Probe | Result |
|---|---|
| `GET /study/EBd1w3fy` | 200, 19 002 b; **one** `page-init-data` script (index 14 194) → 4 757-char study JSON; `x.lichess+json` absent |
| `GET /study/jtlLwUvh` ("Caro-Kann Defense", 9 chapters) | 27 687 b; `tags`=1 `chapters`=1 → tags only for the displayed chapter |
| `GET /study/jtlLwUvh/ccJj8Q0b` | 200, 27 705 b, same `page-init-data` shape → deep pass = 1 request/chapter |
| `GET /study/all/newest` | 200, 25 738 b; 16× `div class="study paginated"`, 16× `ol class="chapters"`, 16× `class="timeago"`, **no** `page-init-data` |
| `GET /study/all/newest?page=2` | 200, 25 254 b, 16 rows → `?page=N` works |
| `GET /study/search?q=openings&order=popular` | 200, 26 268 b, 16 rows, no init JSON |
| `GET /study/by/bbrum/newest` | 200, 25 659 b — owner group works anonymous |
| `GET /study/public/newest` (a `mine*` group) | **303 → `/signup`** — login-gated. Markup is nevertheless identical: `StudyListUi.scala` funnels `all`/`byOwner`/`mine`/`mineLikes`/`mineMember`/`minePublic`/`minePrivate`/`search` through the same private `page(…)`/`paginate(…)` |
| Row markup sample | `<div class="studies infinite-scroll"><div class="study paginated"><a class="overlay" href="/study/EBd1w3fy" title="…">` — matches `paginate` + `StudyBits.widget` exactly |

Consequences: `parseListPage` targets the card widget; `parseStudyJson` reads `script#page-init-data`
(`$.parseHtml` + `JSON.parse`, select by `id` because the CSP nonce varies); absolute times come from
`createdAt` (unix ms) and `time[datetime]` (`secondsSinceUpdate` is the relative one). Login-gated fetches
work from inside the extension because `lt.network.fetch` runs same-origin on a logged-in page (cookies included).
The **live** page also runs the `infinite-scroll` ESM, which can append rows to `div.studies` — harvest must page
explicitly and not trust the rendered row count.

## 11. Search without Elasticsearch (`StudySearchEngine`)

```js
await StudySearchEngine.run(query, { cursor, size }, signal) → { items, nextCursor, matchingChapterFields }

  field matchers
    query.study.text      → studyName, description, topics.join(', '), chapters.name, chapters.description
    query.study.name / description / topics / owner / member → the individual fields
    query.chapter.text / name / description                  → per ChapterData
    query.chapter.tags.{variant,eco,opening,event}           → ChapterData.tags + setup.variant
    query.chapter.tags.{player1,player2,fideId1,fideId2,color1,color2}
                                                            → tags player1/player2/fideId1/fideId2 + orientation

  relevance(order)
    relevant     Σ termHits × weight(name 8, topics 4, description 2, chapters 1)
    hot          likes / max(1, ageHours + 2)
    newest       createdAt desc            oldest    createdAt asc
    updated      updatedAt desc            popular   likes desc
    alphabetical studyName.localeCompare, tie-break studyId

  then slice(cursor, cursor + size); nextCursor = null when exhausted
```

The Member/History **filter box** keeps the PR's `StudyList.matches()` + `matchesMetadata` path; only the Search tab
submits a structured query and spawns a `ResultTabContent`. Everything is synchronous and in-memory, so
`ResultTabContent.loadMore()` needs no request and `exhausted` is usually true after the first pass
(unless the deferred deep chapter-tags pass is enabled). Cap scoring work at `studyDbMaxResults`
and show `trans.noarg('studyDb.tooMany')` above it.

`StudySearchEngine` also feeds `ResultTabContent.matchingChapterFields` (`{chapterId: [matchedField,…]}`), which is what
`studyMatchView` uses to render the "why did this match" lines.

Two facts from the P1 probes change the engine's inputs: the chapter-tag vocabulary is **not** hard-coded — it is the
page-init `tagTypes` blob, and chapter tags are `[type, value]` pairs, so `tags.{eco,opening,event,…}` match against
pair names/keys rather than a fixed record. And `updatedAt` is never absolute in the payloads: the page-init blob gives
`createdAt` (unix ms) and `secondsSinceUpdate`, so `updatedAt = now - secondsSinceUpdate` must be materialised at
capture time and stored as an absolute value (otherwise `order:'updated'` drifts with clock skew).

## 12. Bookmarks, browser-local

> **§18 changes what the tree is for**: study leaves now sit at any depth and the action rack adds/removes them, the
> blob record grows the two chip states (§18.3) and the filters of §18.4 run over the tree. Persistence, the serial
> `writes` chain and the `Cache.waitRelease('studyDb.bookmarks')` guard below stay exactly as written.

`BookmarkTabContent` keeps the PR's tree semantics (`at(path)`, `siblings`, `contains`, `canDrop`, `drop`, `prune`,
`drag`, `select`, `expanded`, `editing`). Only the persistence changes:

- `load()` → `await IdbStudy.getBookmarks()` (no `studies` re-store: the studies are already in `SyncCtrl.studies`).
- `save()` → `await IdbStudy.saveBookmarks(this.entries)` chained on `this.writes` (the PR's serial-write chain is kept).
- Cross-tab guard: `Cache.lock('studyDb.bookmarks')` before `save()`, and `lt.storage.fire`/`listen` are **not** used
  because IndexedDB does not fire `storage` events; instead the other tab re-reads the blob on next `load()`.
- The UI must say the bookmarks are browser-local: `trans.noarg('studyDb.localOnlyNote')` in the Bookmarks tab header
  (this replaces the PR's "bookmarks are synced with the server" sentence).
- The drag-and-drop transfer format (`studyDragType` MIME + `StudyDrag` payloads `{kind:'studies'|'bookmarks'}`)
  is kept inside the window; dropping onto a **non-bookmarks** tab or outside the window must be rejected
  (`canDrop` already covers nesting cycles).

## 13. Study navigation

`StudyNavigation.load(studyId, chapterId?, {path, orientation})` — PR shape kept:

- Validate ids with `/^[a-zA-Z0-9]{8}$/` (kept).
- Same study: `lt.lichess.analysis.study.setChapter(chapterId)` (this is what `studyLinks` already does),
  then optionally restore the position by wrapping `analysis.setVariation`/`analysis.jump` — out of scope, skip the path restore.
- Different study: `lt.location.set('/study/' + studyId + '/' + chapterId)` (full page load). The PR's in-page swap
  via `GET /study/db/load` cannot exist without the server, so this is the honest degradation; the keyboard affordance
  (`Enter` on a row navigates) and the `study-navigate` link keep working.
- `this.pending`/`AbortController` sequencing is kept so a newer request wins over an older one.

## 14. CSS port

The PR's six partials (`_bookmark.scss` 148, `_frame.scss` 226, `_member.scss` 50, `_result.scss` 8, `_search.scss` 153,
`_study-list.scss` 258 = 852 lines) merge into **`tools/recordsDbUi/tool.css`** with these mechanical changes:

- Prefix every selector with `body.lichessTools` (repo convention, cf. `tools/previousStudyMenu/tool.css`) and anchor the
  window subtree at the dialog element: `body.lichessTools .lichessTools-studyDb …`. Keep the PR class names
  (`.tabs`, `.study-row`, `.content-frame`, `.resize`, `.tab-close`, …) — they are scoped under the dialog —
  and put `lichessTools-studyDb` on the dialog root only.
- `button.study-db-button` (the PR's `css/study/_buttons.scss` addition, the study-page button that toggles the window)
  keeps its name; the `body:has(dialog .study-db)` accent rule is copied as-is.
- Keep lila custom properties (`---block-gap`, `---site-header-height`, `---study-db-frame-order`, `--c-font-dim`, …)
  but add fallbacks for the two that matter: `---study-db-frame-order` (z-index) and `---block-gap` (inset).
- Lichess SCSS nests rules; extension CSS is not preprocessed ⇒ flatten everything.
- Desktop-only guard, matching both the PR's claim and the repo's breakpoint used in `previousStudyMenu`:
  wrap the window rules in `@media (min-width: 1019.3px)` and add `body.lichessTools.mobile … { display: none; }`.
  (2026-11-04: the two `display: none` mobile rules were replaced by phone rules - see 18.14.)
- No `html[data-page-href*="…"] main:not(.lichessTools-…) { display: none; }` rule — that belongs to `/page/...`
  tools, and we stay on study pages.

## 15. Phases

```
[ ] P0  Re-read the PR; keep the downloaded sources under test/_pr22258/ as the reference
[x] P1  Probes — DONE 2026-11-01, results in §10.1 (`test/_pr22258/_probe_*`):
        - page-init JSON: YES, `script[type="application/json" id="page-init-data"]` (no `x.lichess+json`);
          chapters for the whole study, but tags/description only for the displayed chapter
        - list pages: NO init JSON, DOM scrape only; 16 rows/page, `?page=N` works, `div.nostudies` = stop
        - `mine/member/public/private/likes` are login-gated (303 → /signup) yet share the same page()/paginate() builder
        - still to confirm from inside the extension (needs a logged-in tab, deferred to P4/P5):
          `analysis.study.setChapter` reachability and `lt.uiApi.events.on('analysis.change', fn)`
          — both already exercised by `tools/studyLinks`, so they are not blocking P2
[x] P2  Data model + `IdbStudy` + `mergeStudyMetadata`/`mergeChapters` + `matchesMetadata` — DONE 2026-11-01,
        shipped in `tools/recordsDbStore/tool.js`, validated by `test/studyDbStore.check.js` (74 checks, 0 failures)
[x] P3  `SyncCtrl` + `StudyHarvester` (`groups`/`pageOf`/`fetchPage`/`parseListPage`/`mapInitStudy`) — DONE 2026-11-01,
        same file and same harness. Deviations recorded here:
        - blob-per-store (one IndexedDB item per logical store) instead of one record per study, because
          `LiChessTools.IndexedDbStorage` gives callers no bulk read; `storeMemberAll` replaces the PR's
          per-record `put`, and a burst of unawaited updates collapses onto the serial write chain
        - `partialCoverage{chapters,tags}` marks which field group a record is known to be missing
          (`true` = incomplete): list cards have `{chapters:true,tags:true}`, page-init has `{chapters:false,tags:true}`
        - `mergeChapters` matches by id OR name — list pages give chapter names without ids, and a name-only
          merge must not drop the tags/description already captured for that chapter
        - `metadataRevision` is a local counter in `studyDb-syncMeta`, bumped once per full capture
        - `features` is kept next to `settings` (page-init has both; merging them loses the visibility strings)
        - the four manifests and `lichessTools-init.js` were wired here as well (P10 item pulled forward), so the
          store layer is live in the extension while the UI half is still being built
[x] P4  `StudyList` + Member/History tabs (filter, sort, selection) as a plain panel — DONE 2026-11-01,
        shipped in `tools/recordsDbUi/tool.js` (+ interim `tools/recordsDbUi/tool.css`, `tools/recordsDbUi/context.md`,
        wired into the four manifests and `lichessTools-init.js`), validated by `test/studyDb.check.js`
        (88 checks, 0 failures; `test/studyDbStore.check.js` re-run green at 76 checks). Deviations recorded:
        - `PanelCtrl` is the interim host for the P5 window: it keeps the PR wiring (`tab.onChange = redraw`
          from `StudyDbCtrl.mount()`, `syncCtrl.watch(redraw)`, re-render keyed by `revision`) but stacks the
          tabs in one fixed container instead of floating them; P5 deletes this class only
        - preference names: `studyDbSync`/`studyDbHarvest`/`studyDbHistoryLimit`/`studyDbHarvestDelay` are
          already declared by `studyDbStore`, so the UI tool adds only `studyDb`, `studyDbTabs`,
          `studyDbMaxResults` (§8's `studyDbWindowCount` waits for P5, and `studyDbSync` keeps the boolean
          shape the store shipped rather than `off/manual/auto`)
        - `HistoryTabContent.error` became an accessor pair backed by `tabError`: JS forbids a data field
          shadowing the base tab's getter, which TS allowed
        - views: `popupData` (jQuery powertip) is parked on `title` until P9's `StudyPopup`; `studyMatchView`
          and the highlight helpers wait for P7; `infiniteScroll` uses a real `IntersectionObserver` and falls
          back to a click-to-load button inside `div.scroll-boundary`
        - `StudyNavigation` is §13's honest degradation: same study → `analysis.study.setChapter`, otherwise
          `lt.location.set`; row `Enter` uses it, row `Space` selects, `drag()` still emits the PR MIME
        - the panel host is a selector chain (`div.study__side` → `aside.analyse__side` → `div.analyse__tools`
          → `main.analyse` → `main` → `#main-wrap` → `body`) because the saved probes are curl shells whose
          study DOM the ESM builds at runtime — still unconfirmed from a logged-in tab, and the fallback
          keeps a miss harmless
        - pulling P4 forward also fixed a real `SyncCtrl` gap found while reading the PR: `load()`/`harvest()`
          now clear `this.request` in their `finally` (the PR's `finally` does), so `loading` stops reporting
          "still loading" once a request finished
[x] P5  Window shell: `windowBounds` + `WindowCtrl` + `WindowFrame` + `StudyDbCtrl(open/close/load/save)` — DONE 2026-11-01,
        shipped in `tools/recordsDbUi/tool.js` (+ `tools/recordsDbUi/tool.css` re-anchored to the window subtree,
        `tools/recordsDbUi/context.md` rewritten), validated by `test/studyDbWindow.check.js` (127 checks, 0 failures)
        with `test/studyDb.check.js` re-run green at 137 checks and `test/studyDbStore.check.js` at 76. Deviations:
        - `PanelCtrl` is deleted as planned: `StudyDbCtrl` + `WindowCtrl`/`WindowFrame` own the tabs, and
          `contentView()` only knows member/history — bookmarks wait for P8, search/results for P7
        - `lt.dialog({closedBy:'none', modal:false, noEscClose:true, noTabCycle:true, header:false,
          focus:'.content-frame input'})` replaces `snabDialog`; `noEscClose` swallows Escape, so
          `WindowEventHandler.keyDown` closes the window and the frame's `close` event catches an outside close
        - the PR's `storedJsonProp('study.db.state')` is the `studyDb-windows` blob, hence `load()`/`save()`
          (and `close()`/`toggle()`) became `async`; `load()` drops malformed records, regroups identical
          `Rect`s and keeps the first `studyDbWindowCount` groups
        - §user: `button.study-db-button` is installed in the sidebar strip (`.study__side .tabs-horiz` chain,
          falling back to the sidebar and the tools column) rather than in the study UI, and `canOpen()` adds
          the port's "a study is open on this page" test (`lt.lichess?.analysis?.study`); `toggle()` therefore
          tests the **frame** (`ctrl.windowFrame`), not `windowContents.size`, because `load()` creates windows
          without showing them
        - `WindowEventHandler` keeps only the P5 subset (`tabButton`/`click`/`keyDown`/`navKeyDown`) with
          `cancel(_) => false` and `clear() => noop`: the pointer gesture machine, the tab-preview clone, drop
          targets and `transfer()` wait for P6 — which is also why the five `.resize` strips are styled but inert
        - `infiniteScroll`'s disposers were being collected but never run: `StudyList.disposeObservers()` is now
          called by `studyListView` (every repaint detaches the old `.scroll-boundary`) and by a new
          `StudyList.destroy()` override, so a detached node cannot keep an `IntersectionObserver` alive
        - the stylesheet grew the window subtree (`.tabs`, `button[role=tab]`, `.tab-icon`/`.tab-label`/`.tab-close`,
          `.content-frame`, the five `.resize-*` strips, `button.study-db-button`) and dropped the P4
          `.lichessTools-studyDb-tab` rules plus the `max-height` guard, which `fitWindow` replaced
[x] P6  `windowEventHandler` drag/resize/Escape + `transfer()` between windows — DONE 2026-11-02,
        shipped in `tools/recordsDbUi/tool.js` (+ the P6 fidelity block in `tools/recordsDbUi/tool.css`),
        validated by `test/studyDbWindow.check.js` (171 checks, 0 failures) with `test/studyDb.check.js`
        still green at 137 and `test/studyDbStore.check.js` at 76. Deviations:
        - Cash delegates an event through **every** node in the ancestor chain while snabbdom called only
          the closest handler, so `click` and `keyDown` carry one-shot memo flags on the event
          (`_studyDbClick`/`_studyDbEscape`): the drag-release click must be suppressed exactly once, and
          Escape must unwind (or close) exactly once. Pointer listeners stay on the inner content only
        - the PR's inlined preview clone, drop-target scan and ghost tabs become the named methods
          `previewTab`/`dropTarget`/`ghostTabs`, and the gesture payload lives on `this.gesture`
          (source, capture, rect, edge, content, selected, pointerId, x/y, offsetX/offsetY, moved,
          preview, ghostTab, target, destination) — Cash keeps the elements as selections, not nodes
        - the body-level `.tab-preview` clone sheds `id`/`aria-controls`/`role` through `removeAttr` and
          carries `lichessTools-studyDb` so it borrows the window styling without cloning the `<dialog>`
        - `listData()` had translated snabbdom's `key: tab` into an `id`, which put two elements under one
          id in the page: `ghostTabs`' `find('#' + content.id)` then answered with the panel as well as the
          tab button and cloned both ghosts. The key now keeps a `data-key` attribute, leaving the tab
          button the only element per id — which is what every id lookup in the shell assumes
        - `transfer(src, content, dest, geometry)` is async (it shows the destination and saves); Escape
          mid-drag unwinds through `cancel()` and only closes when there is no gesture to unwind
        - the harness grew a real `deepClone` (Cash's `clone()` deep-copies and detaches), a `children(sel)`
          that filters direct children like Cash, DOMRect-shaped `box()` readings plus style-derived
          geometry for rebuilt nodes, and a whole-document `$()` scope so `appendTo($('body'))` lands
[x] P7  `SearchTabContent` + `StudySearchEngine` + `ResultTabContent` + `searchView` + `studyMatchView`/`highlightMatch`
        — DONE 2026-11-02, shipped in `tools/recordsDbUi/tool.js` (+ the P7 block in `tools/recordsDbUi/tool.css` and the
        new `studyDb.search*` intl keys in both tables), validated by `test/studyDbWindow.check.js` (247 checks,
        0 failures) with `test/studyDb.check.js` still green at 137 and `test/studyDbStore.check.js` at 76.
        Deviations:
        - the PR's `POST /study/db/search` (Elasticsearch) becomes `StudySearchEngine.run(search, page, signal)`,
          one scoring pass over `SyncCtrl.studies`: weights name 8 / topics 4 / description 2 / owner+member 1 /
          each chapter 1, so `relevant` sorts by that score and the other six orderings read the same candidates
          by `hot`/`createdAt`/`updatedAt`/`likes`/`studyName` with a `studyId` tie-break
        - the cursor contract is kept verbatim (`slice(cursor, cursor + size)`, `nextCursor` = next offset or
          `null`), so `ResultTabContent.fill()`/`loadMore()` page through the engine exactly as they paged through
          the endpoint; scoring visits at most `studyDbMaxResults` studies, which is what bounds a 10 000-study
          mirror (the harness times each of the seven orderings over 10 000 synthetic studies under 250 ms)
        - Cash keeps no text nodes between elements, so `highlightMatch` emits inline `<span>` runs (PR emitted raw
          text runs) around the `<mark>` hits; `studyMatchView`/`matchSnippet` keep the PR's 40-character context
          windows and ` ... ` joins
        - chapter tags arrive as `[name, value]` pairs, so `chapterTagValues` reads pair names lowercased; the
          positional `players` fallback exists only for chapters harvested from a study-list card (names, no tags)
          and keeps the API order — white first — because `setup.orientation` flips the drawn board, not the data
        - `matchSnippet`/`highlightMatch` are page-level functions published on the module (`studyDbModule.matchSnippet`
          /`.highlightMatch`) so the views and the harness reuse the exact snippet and split the highlights feed
        - `StudyList`'s stub `exhausted`/`error` getters had to become slot-backed accessor pairs: PR TS declared
          them as fields, and `ResultTabContent` writes them on every page (a getter-only slot throws on the write)
        - `contentView(content, submit)` gained the submit callback so the form's click reaches
          `ctrl.owner.search(ctrl)`; the search singleton stays `closable = false` while a spawned
          `ResultTabContent` is `closable = true`, which is what the strip's close button tests
[x] P8  `BookmarkTabContent` + `bookmarkView` + folders + drag/drop + IDB persistence — DONE 2026-11-02,
        shipped in `tools/recordsDbUi/tool.js` (+ the P8 block in `tools/recordsDbUi/tool.css` and the new
        `studyDb.bookmarks*`/folder/rename intl keys in both tables), validated by `test/studyDbWindow.check.js`
        (382 checks, 0 failures) with `test/studyDb.check.js` still green at 137 and `test/studyDbStore.check.js`
        at 76. Deviations:
        - `save()` is the PR's serial-write chain with the endpoint replaced by one `studyDb-bookmarks` blob set
          through `store.idbStudy.saveBookmarks(entries)` — the follow-up study re-store (the PR's DB was the
          server's) is skipped because the studies a bookmark points at already live in `SyncCtrl.studies`
        - §12's cross-tab guard is `Cache.waitRelease('studyDb.bookmarks')` → `lock` → write → `release` inside
          the chained closure (IndexedDB fires no `storage` event, so a second tab's write is waited for, not
          notified); the harness holds a foreign lock, asserts the blob stays untouched for 30 ms, then releases
          it and asserts exactly one write lands and the key is free again
        - `BookmarkTabContent.error` became a slot-backed pair over `tabError` (same JS rule P7 hit: the base tab
          exposes `error` as a getter and a data field cannot shadow it), while `visible`/`anchor`/`writes` stay
          plain fields because PR TS `private` is only a compile-time fence
        - `drop()` found the sibling index with `siblings.indexOf(entry)` and spliced unconditionally — a stale
          payload would splice an unrelated sibling off; the port keeps the lookup and skips it when it is `-1`
        - the commit is registered on `'dragend drop'` with a one-shot `_studyDbDrop` flag on the event: Cash
          delegates both names for one native gesture, and registering `drop` alone (as the PR's snabbdom did)
          never fires in the port's harness — same one-shot pattern as P6's `_studyDbClick`
        - rows carry `data-path` and the marker carries the insertion position (`before`/`inside`/`after`), so the
          keyboard rack (`Space` select, `Enter` toggle-or-navigate, `Delete`, `F2`, `ctrl+a`) and `insertion()`
          can walk the tree through `at(path)` instead of a PR `data-*` closure
        - only a bookmark row gets `studyNavigator`; a folder is a label, not a destination, and `.bookmark-end`
          is the root drop zone (it spells `studyDb.none` while the tree is empty). Dropping a StudyDrag MIME
          payload onto another tab or a payload without the MIME is refused because the handlers live only on
          bookmark rows and the root zone — asserted both ways
        - §16's separate `test/studyDbBookmarks.check.js` is folded into `test/studyDbWindow.check.js`: the tree
          surface (`at/siblings/contains/canDrop/drop/prune`, cycle rejection, blob round-trip) needs the store
          and a live tab to chain writes, so the P8b/P8c/P8e blocks cover it beside the DOM asserts
        - `_bookmark.scss` flattened into the `body.lichessTools .lichessTools-studyDb` subtree: `---bookmark-depth`
          drives `margin-inline-start` in `rem`, the folder caret is an inline SVG triangle (the repo has no chevron
          licon to rotate), and the local-only note (`studyDb.localOnlyNote`) replaces the PR's "synced with the
          server" sentence
[x] P9  History capture (`captureFromLivePage`, `updatePosition` via `lt.uiApi.events.on('analysis.change')`) + `StudyPopup`
        — DONE 2026-11-02, shipped in `tools/recordsDbStore/tool.js` (`SyncCtrl` capture hooks) and
        `tools/recordsDbUi/tool.js` (the popup section before `spinners()` + the P9 block in `tools/recordsDbUi/tool.css`),
        validated by `test/studyDbStore.check.js` (99 checks, 0 failures) with `test/studyDbWindow.check.js`
        green at 425 and `test/studyDb.check.js` at 137. Deviations:
        - lila's `$.powerTip` is a jQuery plugin and Cash has none, so §6's `StudyPopup` owns the tooltip: one
          `#lichessTools-studyContentPreview` div (the PR's flat `#studyContentPreview` rule under this tool's
          namespacing) built on the first `showStudyPopup` and kept on the page, toggled by the PR's
          `focusin/focusout` pair plus hover, Enter/Space and Escape. `popupData(items, title)` keeps the PR
          name and returns the record (`tabindex` + `aria-describedby` + items/title) that `applyPopup` puts
          onto a Cash node; `popupPreviews` is the PR's WeakMap so a show with no arguments re-reads its anchor
        - powertip's `se`/`s` placement and 4px offset become the inline `top`/`left` the view writes (measured
          once from the anchor's rect) plus the `.popup-s` centring in `tool.css` — one rule instead of a second
          layout read; powertip's max-height bound is the same `innerHeight - bottom - 12` floor 80
        - the keyboard guard compares Cash's `closest('a')` identity against the anchor instead of the PR's
          `isLink` boolean, so a `<button>` anchor keeps Enter/Space for the tooltip while a real link keeps
          the browser's own activation; a popup entry only navigates on an unmodified left click and hides
          itself before jumping (PR's guards)
        - the PR's snabbdom `destroy` hook is `StudyList.disposeObservers()` → `hidePopupOf(tabId)`, keyed on the
          panel's `data-key` read when the repaint asks rather than at build time — a fresh anchor is still
          detached and knows no panel, so a build-time key would never match
        - §8's capture is three hooks on the port's stand-in for `studyCtrl.publishUpdated()`: `chapterChanged`
          on `lichessTools.chapterChange`/`commentChange`, `analysisChanged` through `lt.uiApi.events.on('analysis.change')`
          (the position inside a chapter — `updatePosition` refuses an event that names another chapter, which is
          what makes the third hook necessary), and the PR's `setChapter` wrap installed with the repo's
          `lt.wrapFunction` (`after` runs on the lt object and hands the original result back) so a chapter
          switch refreshes the visit from the page blob; `detachEvents` unwraps it with `lt.unwrapFunction`
        - `captureVisit()` re-reads `page-init-data` through `harvester.captureFromLivePage()` — no request —
          and pushes it through `studyUpdated`, so a visit keeps one `visit.at` bump per real write and a
          `studyDbSync`-off page registers nothing
        - `studyIcon` and `studyNavigator`'s count button moved off the parked `title` (P7's stand-in) onto the
          tooltip; `tool.css` gates the PR's `cursor: pointer`/hover rules on the `[tabindex]` the record
          carries, so an anchor with nothing to preview gets neither
        - the harnesses gained a condensed `lt.uiApi` emitter and the core's wrap/unwrap trio
          (`scripts/lichessTools.js`'s `__originalFunction`/`__wrapId` shape) so the hooks are installed and
          unwrapped exactly as in the page; `test/studyDbStore.check.js` drives `analysis.change` →
          `updatePosition`, a refused chapter switch, the wrap's visit refresh and detach/re-attach
[ ] P10 CSS merge + the four manifests + `lichessTools-init.js` order + docs (`data/crowdin.json` is AssetGenerator's, a manual pass)
        (`tools/recordsDbUi/context.md`, `scripts/context.md`, root `context.md`, `HISTORY.md`, `issues-worklist.md`)
[x] P11 UI v2 (§18) — one view, two tri-state chips, textbox filter, action racks, tree actions, the open-and-return
        session hand-off and download/restore; deletes the four-tab UI (§18.9) and rewrites the harness halves
        Sub-order (§18.14): P11a `BookmarkTabContent` filters + haystack cache + chip cycle (no new tab class) ->
        P11b the four racks in `bookmarkView` + row checkboxes + add/newFolder/delete+confirm/setSelect ->
        P11c `harvestOne` on Add + the open chip, double-click and the `{ session: true }` flag with `start()`'s
        one-shot read -> P11d `downloadTree`/`restoreTree` over one `readTree` -> P11e the deletions, the orphan-rule
        CSS pass, the harness rewrite and the docs. Counts once it landed: `studyDbStore.check.js` 99/0,
        `studyDbWindow.check.js` 386/0 (assembled from the `test/_p11_*` chunks by `test/_p11_assemble.js`),
        `studyDb.check.js` 71/0 after the four-tab half was retired against live code.
        Shipped with three deliberate departures from §18: the `open` chip and its `studyDb.open` string are gone
        (double-click plus the row-end link icon `button.btn-row-open` cover the jump, and the session hand-off still runs
        there), the backup rack carries one `Backup` chip instead of two download chips (one file, so one action),
        and Restore reads only the IDB blob — the paste `<textarea>` died, so a downloaded file is restored through
        the same `readTree` path after being pasted into preferences. Selection paints a native
        `input.tree-select` checkbox per row (§18.11.4) rather than only `aria-selected`; Rename appears only when
        exactly one folder is selected; the chips print `Readonly`/`Unlisted` (lila's own spellings) because
        `visibilityState` keeps unlisted apart from public (§19.2).
        The user's second pass shipped six more calls: the backup rack is appended last so Backup/Restore stay at the
        bottom whatever the last action had to say; the row's jump affordance is a link icon at its right end
        (`btn-row-open` with the Link icon) rather than the title being a link; the chapter tooltip stays up while the
        pointer sits inside it (so a long list can be scrolled) and closes only when the pointer leaves it; a folder
        with no children still takes a drop (`insertion()` reads `entry.children?.[0]` - the old `entry.children[0]`
        threw for a childless folder, which is why dropping into an empty folder silently did nothing); `folderName`
        binds `const lt = this.lichessTools` like every other method; and the header's `N more hidden` line asks the
        new `studyDb.hiddenCount` key, which both intl tables now carry.
        A fourth departure was corrected by the third pass (2026-11-03): §18.9 names `studyDbTabs` for deletion, and that pass
        deleted it - nothing reads it any more, `data/crowdin.json` never carried its keys, and the tables simply lost
        `options.studyDbTabs` plus the four value labels.
        The same pass cut the dead weight: the UI half dropped eight members no live line calls (`selectLeaf`, `spinners`,
        `hidePopupOf`, `studyNavigator`, `studyFilterInput`, `studyIcon`, `appendParts`, `applyPopup`) and the store half
        twelve (`countLeaves`, `updateStudy`, `getBookmarks`, `saveBookmarks`, `loadHistory`, `detachEvents`,
        `unwrapSetChapter`, `getHistory`, `pruneHistory`, `orders`, `clearEverything`, `harvestChapterTags`), each with the
        comment that documented it; the dead-member audit now sits at a fixpoint over the pair, and the store harness
        dropped exactly the checks that exercised the removed API (99 -> 90).
        Intl took the shape the user asked for: `options.<name>` labels a preference (and `options.<category>` its
        category), `<name>.<value>` labels a preference value, and no other key carries a dot - every UI string is flat
        camelCase (`studyDbMissingStudy`, `accessReadonly`, `visibilityUnlisted`, `kindStudy`, `filtersAccess`), and the
        four dynamic builders compose exactly that through one module helper
        `const camel = (word) => word.charAt(0).toUpperCase() + word.slice(1)`: `"studyDb" + camel(content.message)`
        (in `noarg` and its `pluralSame` twin), `"kind" + camel(kind)`, `which + camel(state)` and `"filters" + tail`.
        Both tables now hold 60 keys in lockstep and nothing in either is left unasked.
        P11 also owns §19's leaf model from day one: leaf = {kind,id,label,meta?}, the kind chip, the containment rule
        and a registry holding **all eight rows**, while the window services `study` and `chapter` only — every other
        kind is carried (parse, prune, save, restore, rendered as a dead link) but not offered (§19.6).
[x] P11.3 the comment diet over the shipped pair (2026-11-04) - the audit that made the two files readable
        without the port narration. Every comment in `tools/recordsDbUi/tool.js`, `tool.css` and
        `tools/recordsDbStore/tool.js` was re-read: narration that only recorded where a line came from
        (PR names, lila/lts paths, `sec N`/`P N.N` steps, `file.ts:123` citations, harness and probe
        notes) was dropped, and the survivors were rewritten to say why the code is the way it is.
        - The diet replaced whole lines, and a comment that sat at the end of a code line carried that
          line's code with it: twelve statements died with the comments that documented them - the popup
          state `popupShown` and `treePaint` in the UI half, eight fields of the kind table (the `read`
          notes for `chapter`/`forumPost`, the `canWrite`/`visibility` answers parked as `undefined` for
          `game`/`position`/`puzzle`/`blog`/`forumPost`), and the `memberState` initialiser in the store's
          `IdbStudy` constructor. Each was restored from the comment that survived plus §18.11/§19.6's
          registry table; `node --check` is clean over both halves and the view opens.
        - The window harness went 386 -> 381 and the tool harness 70 -> 69 because five of their needles
          matched comment text the diet removed: `studyDb-windows` and `collectionBranches` now assert
          against the store (which owns both keys), `window-close` became `closeWindow`, and the view-grew
          needle `close-button` became `btn-newfolder` (the close button is `tools/dialog`'s, not ours).
          The store harness stays at 90/0 and all three report zero failures.
        - Sweep results, all clean: `_p11_commentCite.js` finds no port-history comment left in the three
          files, `_p11_deadPair.js` is still at a fixpoint with 0 dead members, `_p11_keyLive3.js` reads
          54/54 en/ro keys and 7/7 store keys with `_p11_shapeKeys.js` reporting no illegal dots,
          `_p11_cssAudit.js` shows only the host-page and media-query selectors, `_p11_asciiAudit.js`
          counts zero non-ASCII characters, and `_p11_eolCheck2.js` keeps the packed pair LF while docs
          and the store keep CRLF.
        - A style pass over the three files followed: the six method bodies that reached the instance now
          bind `const lt = this.lichessTools;`, the loop variable that shadowed the `window` global is
          `studyWindow`, three css rules whose classes no DOM builds (`.study-filter`, `.study-navigation`
          and its `a.study-navigate`) were deleted, and the eight comments inside method bodies were cut to
          one short line each - narration that needs room stays at class-field level. `_p11_styleAudit.js`
          and `_p11_structAudit.js` are the durable checks of that pass - style hits and tool/manifest
          wiring - and both now report nothing to fix.
        - Docs were retargeted in the same pass: `tools/recordsDbUi/context.md` names the popup set that
          ships (`popupData`/`popupNode`/`showStudyPopup`/`hideStudyPopup`/`pointerInPopup` plus the
          `popupShown`/`treePaint` state), and its `aria-describedby`/`aria-label` claims were dropped
          because no shipped line carries an `aria-` attribute any more; the root `context.md` gained the
          two conventions this audit enforces - comments carry no port history, and the packed pair is LF
          while every doc is CRLF.

[x] P11.4 the honest dead rule (2026-11-04) - a study that exists was painted `.study-missing` and lost its
        row button, because "the mirror has no record" and "lila deleted it" were the same test. The store
        answers the two states apart: `isDead: gone` became `isDead: absent` on every registry row (`position`
        stays `() => false`), `harvestOne` fetches with `ignoreStatuses:[404]` and returns the marker
        `{ studyId, absent: true }` for a 404, and `SyncCtrl.store` refuses a marker. The proof belongs to the
        tree, so Add stamps `meta.deadAt` on the leaf - it survives the member blob, which keeps only
        role-carrying records, and a stamped study drags its chapter leaves through `goneNodes`, which
        `refreshCaches` builds. `isGone` answers both `missingCount` and the row paint, so a merely uncaptured
        leaf keeps its `btn-row-open`, its label and its dim chips, while the header prints `studyDbUncachedNote`
        in a `.tree-uncached` span. Enter and double click stop on a proven leaf only. The window harness went
        381 -> 392 checks: the cold-mirror asserts now read openable, a stamped leaf drives the paint, the
        header line and the collapsed-folder count, and a proven leaf is checked to carry no open button.
        Store 90/0 and tool 69/0 unchanged; the sweep stayed clean (`keyLive3` 56/56 + 7/7, no illegal dots).

[x] P11.5 every fact a row needs lives in the local db (2026-11-04) - the tooltip of a study the
      tree filed came back empty on the pages where the browser is not standing on that study: its
      record lived in the mirror only, and `integrateUpdates` deleted a role-less record from the
      member blob. The local db gained a blob of its own, `studyDb-captures`, so `studyDb-member`
      keeps its meaning as the user's own list: `integrateUpdates` routes a role-less record there
      when the tree names it, and `SyncCtrl.load` feeds both blobs into the mirror. The tree names
      its studies through `BookmarkTabContent.treeStudyIds()`, handed to `SyncCtrl.setTreeIds` on
      every load and save - that call also prunes the capture blob, so a leaf that leaves the tree
      drops its capture and stays honest. Add persists the record it just read through
      `SyncCtrl.persist`, once the save has named the leaf. Harness: window 392 -> 404 checks (a
      role-less capture reaches its blob, the member blob stays owned-only, a page reload reads the
      chapters back, the `.tree-uncached` line drops, the prune takes the capture with the leaf);
      store 90 -> 101/0.

[x] P11.6 the surface narrows and the phone answers (2026-11-04) - two switches were one job, so
      `studyDbSync` + `studyDbHarvest` became `studyDbCapture`: the live page is offered under it, and
      the study-list crawl under it only while the mirror holds nothing (a default-on crawl would
      otherwise pay the lists on every page). `studyDbHistoryLimit`, `studyDbHarvestPageDelayMs` and
      `studyDbMaxResults` stopped being preferences and became constants at the top of the pair that
      owns them. `windowCount` left the module - one window per kind, and only `treeTab` is registered.
      The §14 desktop guard is lifted: `canOpen()` drops the mobile test, `initialGeometry()` derives
      a phone box, `start()` takes a touch contact (`button: -1`), and the two CSS hide-rules became
      thumb-sized affordances. Harness: window 404 -> 415 (a 390x780 phone opens the box inside its
      viewport, a finger narrows it, a desktop size comes back clamped); tool 69 -> 70 (a phone page
      answers canOpen); store 101/0 and preferencesPage 40/0 unchanged. §18.12 + §18.14 record it.

[x] P11.7 opening a row comes back with the window (2026-11-04) - the row's `openLeaf` already left a
      session flag before it navigated, but nothing spent it: a study reached from the tree always landed
      on a closed window and made the user find the toggle again. `StudyDbCtrl.handoff` now reads that key
      and drops it in the same breath, and `start()` opens the window when the flag is younger than
      `treeHandoffMs` and names the study the page carries (`pageStudyId` answers the open analysis first,
      the url otherwise). One key constant feeds writer and reader; only a study or chapter leaf leaves it.
      Harness: window 415 -> 433 (the trip leaves the flag, navigates, arrives with the window already open;
      a second load, a stale flag and a flag naming another study all stay manual and all drop the key);
      tool 70 -> 72 (one key constant, one session value with an age guard). §18.6 carries the decision.
[x] P11.8 the tooltip answers on a page that never visited the study (2026-11-04) - a row for a study
      you do not own showed its chapter tooltip only while standing on that study; on other pages the
      row was bare. The capture was in `studyDb-captures` all along, it just lands late: `SyncCtrl.load`
      reads the member blob first and the captures blob after it, off the critical path, and `bookmarkView`
      reused the `recordCache` the first paint built. `refreshCaches` now stamps the mirror revision its
      caches answer for (`hayRevision`), and `bookmarkView` refreshes whenever that stamp trails - the
      repaint every publish already triggers carries the tooltip, the chips and the `.tree-uncached` line.
      Harness: window 433 -> 438 (a cold paint leaves no tooltip and says so; the publish that lands the
      capture repaints the row, its `data-popup` appears, and the cache answers the chapters). §18.15.


[x] P11.9 the page's own resize stops crashing the window (2026-11-04) - `tools/fixChessgroundResize`
      dispatches a `resize` event from its own monitor, and the window had handed `addEventListener`
      the class method `this.fit`: an event invokes a callback with its own receiver, so `this` came
      in as cash's dispatch context and `this.ctrl.geometry` read `undefined.geometry` and threw on
      every viewport change. `WindowFrame` registers a captured closure (`this.resizeHandler`) and
      hands that one identity to add and remove, and `fit()` answers a disposed frame by doing
      nothing. Harness: window 438 -> 443 (one listener per open window, a detached call does not
      throw, a narrower page refits the box, refitting a fitting box is a no-op, closing drops the
      listener by identity). §18.16.


[-] P11.10 The header stopped restating the tree: `On screen: n / m` and `Filed but not captured yet` are
      gone from `bookmarkView`, and their intl keys and CSS rules went with them. The per-kind lines already
      count the painted rows, and an uncaptured leaf already shows what it can do - its row, its button, its
      dim chips - so the header now carries only what the tree cannot show itself: an empty tree, a leaf a
      read proved gone, a restore waiting, a confirm armed. §18.17.
[-] P11.11 The missing action in §14.6's list: `folderNodes()` walks the tree in paint order,
      `toggleAllExpanded()` keeps the caret's reading (open all while any folder is closed, fold all once
      every one is open) and publishes one revision; the `btn-fold` chip names the press it will make.
      `expanded` is view-only, so the gesture costs no blob write. §18.17.
[-] P11.12 The tooltip became a reading surface (2026-11-04) - a row with more chapters than the box showed
      the list and a scrollbar, and the pointer could not get to either: the row's `mouseout` hid the
      tooltip before its own `mouseover` could hold it. A `mouseout` on either side now schedules a hide
      150 ms out and a `mouseover` on either side clears it, so crossing from the row into the tooltip is
      one gesture that never hides, and a pointer that leaves both sides spends the hide. The box also got
      a floor of 160px and `overscroll-behavior: contain` instead of sizing to the gap under the row.
      `pointerInPopup` and its guess about where the pointer went are gone. Harness: window 458 -> 464.
      §18.18.
[-] P11.13 The shape a user left survives an open (2026-11-04) - a user who leaves a folder open and
      goes away came back to a folded tree: only the filter chips survived a reload, and `load()`
      cleared `selected` and `expanded` on every visit. The shape now travels in the window blob:
      `freeze()` adds a `view` row field, `frozenView()` names every open folder and selected row as
      its path plus its own name or id, and `load()` hands those rows to `restoreView`, which walks
      the freshly rebuilt tree and re-adopts only the rows the blob still names by both path and key.
      A folder the blob no longer names stays folded rather than opening whatever now sits in that
      slot. Harness: window 464 -> 476, and the new checks were mutation-tested on both sides (kill
      the write -> 8 FAILs, kill the read -> 4 FAILs, both restored green). §18.19.
[-] P11.14 Typing in the filter box stopped after one letter (2026-11-04) - the paint rebuilds the
      textbox along with the rows, and a rebuild carries no focus, so the repaint every keystroke
      makes to answer a query left the next keystroke going nowhere. `WindowFrame.render()` now ends
      with the frame's focus: it calls `focusContent()`, which puts the caret back in the box the
      frame named as its focus when it opened. Harness: window 476 -> 482, mutation-tested (kill the
      refocus -> 3 FAILs, all inside the new typing checks). §18.20 - superseded by P11.15: the
      refocus put the caret at the start of the text instead of its end, so typing "Par" one letter
      at a time answered "raP".
[-] P11.15 The paint keeps the chain above the textbox (2026-11-04) - refocusing the rebuilt box was
      the wrong shape: focus came back but the caret offset did not, and every letter landed at
      position 0. The window now keeps what carries the textbox for its whole life - `div.inner-
      content` with the gesture listeners, `div.content-frame`, the `.study-list` tree host with the
      tree's own listeners (`viewHost()`), the filters rack inside it, and the textbox in that rack -
      and a paint only swaps the pieces under them: `bookmarkView(content, host, box)` drops the
      header, the actions rack, the body, the note and the backup rack by class, puts the fresh ones
      around the rack that stays, and swaps only the rack's buttons, the box keeping its last slot.
      A textbox that never leaves the page keeps its caret, so the word grows one letter at a time.
      Harness: window 482 -> 498 (identity, focus, rack and host identity, listener counts hung once,
      the box as the rack's last child, the read order of the pieces, no piece left twice), all six
      mutations caught (box placed every paint -> 1, chips after the box -> 1, no stale removal -> 58,
      inner host per paint -> 3, fresh rack per paint -> 5, tree host per paint -> 16), and the page
      was read by a user typing "Par" - it appends now. §18.21.


[ ] P12 `game` servicing (its row is already carried from P11): batch refresh `game.getPgns(ids,{ndjson:true})` chunked
        like `/round/minis?ids=`, the mine test, the opt-in "also bookmark on lichess" (`game.bookmark`), no destructive
        delete
[ ] P13 `puzzle` servicing: per-id `puzzle.getPuzzle` with the checked count printed in the header; access and
        visibility chips dim for that kind
[ ] P14 `blog`/`blogPost` servicing: DOM fetch with `ignoreStatuses:[404]`, `meta` captured at add time, blogHistory's
        `userId/slug/postId` identity reused
[ ] P15 `forumPost` servicing: URL-only leaves, label from add time, dead decided by fetch
[ ] P16 `position` servicing: FEN leaves, `openUrl` materializes an analysis (path unverified, §19.7), never a server
        write
```

[-] P11.16 The pair renames to recordsDbUi / recordsDbStore (2026-11-04) - the store stopped being
    study-only, so the pair sheds the word study from its own names: the window tool is `recordsDbUi`
    (now in the `general` category) and the data tool `recordsDbStore`, whose storage switch is `recordsDbHarvest`
    and capture switch `recordsDbCapture` (both `filesystem`). Classes, modules, prefs, intl keys, blob keys,
    DOM classes and the drag payload follow; `study` stays wherever it names an actual lichess study
    (`studyId`, `StudyData`, `idbStudy`, the `study` kind, `.study__side`, `/study/db`, the PR's `ui/studyDb`).
    Renaming the blob keys would have dropped what users had saved, so `readBlob` spends an old `studyDb-*`
    blob once and rewrites it under the new key; the old blob is left behind, never read again. §19.10.

## 16. Verification

- `node --check tools/recordsDbUi/tool.js` (plus `tools/recordsDbStore/tool.js` if split).
- Check harnesses under `test/` (gitignored, skipped by `build.bat`), modelled on `test/pageToolFlow.check.js`:
  fake `global.LiChessTools = { Tools: { ToolBase } }`, stub `lt.storage` with an in-memory `Map` for `{db:true}` keys,
  stub `lt.getUserId()`, `lt.location` (`href` getter/setter as in the existing harness), and reuse
  **`test/pageToolDom.js`** as the Cash-ish DOM so the views can be rendered and asserted.
  - `test/studyDbStore.check.js` — merge/overwrite rules, `pruneHistory()` at the 500 cap, `store()`'s visit-wins rule,
    harvest parse of a fixture HTML matching `StudyListUi.paginate` + `StudyBits.widget` markup, round-trip through the IDB stub.
  - `test/studyDbSearch.check.js` — the seven orderings over 10 000 synthetic studies (perf: full relevance pass < 250 ms),
    chapter-tag matching incl. `color1/color2` × orientation, `matchingChapterFields` shape.
  - `test/studyDbWindow.check.js` — `freeze()`/`load()` round-trip, `initialGeometry()` at 2/3/4 display columns,
    `transfer()` moving a `ResultTabContent` into a new window, Escape closes the window.
  - `test/studyDbBookmarks.check.js` — `at/siblings/contains/canDrop/drop/prune`, cycle rejection, persistence round-trip.
  - UI v2 (§18) extends `test/studyDbWindow.check.js` instead of adding a fifth harness: the two tri-state chips, the
    haystack filter, `addCurrentStudy`/`newFolder`/`deleteSelected`/`setSelect`, the `{ session: true }` hand-off (set,
    one-shot read, remove) and `readTree` for restore. `test/studyDb.check.js`'s 137 and the member/history/search/tab
    halves of `test/studyDbWindow.check.js`'s 425 are **replaced**, not kept green — §15 records the new counts.
- Manual QA for UI v2: file a study, drag it between folders, delete a folder and confirm, select three rows and delete
  them on one confirm, filter by a member name (empty folders stay dim), open a row and watch the window reopen on that
  study with that row selected, then download the tree and restore it. Nothing may appear on mobile.
- Manual QA (desktop Chrome + Firefox, logged in): open the window on `/study/<id>`; switch tabs; drag a tab out into a
  second window; resize from each of the five edges; Escape closes; `Enter` on a row navigates; drag a row into Bookmarks;
  bookmarks survive a reload; clearing site data leaves the tool able to re-harvest with no errors; nothing appears on mobile.

## 17. Known risks / accepted degradations

- **No cross-device bookmarks** (the PR synced them server-side). Optional later: JSON export/import through
  `localStorage` + `LiChessTools.zip` (the `blogHistory` pattern).
- **Chapter coverage depends on capture.** List pages carry chapter **names** only; tags/descriptions exist only for
  studies that were opened or fetched with `parseStudyJson`. Show `trans.noarg('studyDb.partialCoverage')` in the Member
  tab footer and let the user trigger the deep pass.
- **10 000 studies is the PR's own ceiling** for responsive filtering; `studyDbMaxResults` and the blob write chain keep us
  below it. A 10 000-study blob is several MB — `{db:true}` avoids localStorage quota; keep the `zip` path only for the
  no-IndexedDB fallback.
- **In-page study switching is lost** (it needs `GET /study/db/load`); page navigation replaces it.
- `lt.isMobile()` gate: the PR is desktop-only → **lifted 2026-11-04 (18.14)**: the phone gets the
  toggle, a viewport-fit box, and strips a finger can take.
- **UI v2 (§18)** brings its own risks (§18.13): the textbox only sees captured data, the tree has no cursor paging,
  and the four-tab harness numbers in §15 become history rather than a passing count once P11 rewrites them.
- IndexedDB in MV3 lives in the extension's own partition (shared across all Lichess tabs); Firefox MV2 shares the profile
  DB — same keys, consistent behaviour. `Storage.supportsDb === false` ⇒ tool disables itself with a console warning
  (mirror the `stockfish` availability check).
- **A reload re-applies the saved shape** (§18.19): a restore retry reloads the tree, so the blob's
  open folders and selected rows come back even when the user had changed them after the last save.
  The next close writes what the user left, so the shape only moves at a reload.
- DOM scraping of study list pages is fragile across lila releases: keep `parseListPage` tolerant (anchor on
  `div.studies`, walk relatively), tag the parser with a `formatVersion`, and fail soft (`error: 'Unable to load studies'`).

## 18. UI v2 — one view, two chips, one tree (user requirements, 2026-11-02)

This supersedes §5 (four content tabs), the multi-window half of §6 and §7's tab views. **§3 (data shapes), §4
(storage), §10 (harvester) and P9's capture hooks stay exactly as they are** — the database keeps every field,
only what is rendered changes. The tab classes stay in the file only while P11 is in flight; P11 deletes them (§18.9).

> **§19 generalizes this tree to any lichess object** (one mixed tree, a kind chip, the containment rule, a kind
> registry in `tools/recordsDbStore`). Where the two disagree, **§19 wins about kinds, chips and blobs** and §18 wins
> about the window layout, the gestures, the confirms and the session hand-off. Read both before implementing P11.

### 18.1 Why the old shape read badly

- four tabs over one database: Member / History / Search / Bookmarks showed the same studies in four places, and
  only Bookmarks could hold a folder, so "where is this study?" had four answers;
- the Member chips read as tabs: on an all-public list the three role radios are identical
  (`permissions[entry.role] >= permissions[filters.role]`), so they looked inert;
- moving a row between tabs needs the `application/x-lichess-study-db` `dataTransfer` gesture, which is invisible;
- the folder tree and the study list were separate views, so nothing could be filed.

### 18.2 The window, read top to bottom

```
+----------------------------------------------------------------+
| [read/write]  [public/private]   [ filter text ............ ]  |  filters rack
| [add]  [select]  [delete]                                     |  actions rack
| v  Chess endgames                                             |
|      Petrov defense                        [open]              |  the tree
|      > Openings (3)                        [new folder]        |
| [download]  [restore]                                         |  backup rack
+----------------------------------------------------------------+
```

- **one window, one content**: `WindowCtrl`/`WindowFrame`/`StudyDbCtrl` keep their names, but a window holds exactly
  one `BookmarkTabContent` — no tab strip, no `tab-close`, no `transfer()`, no ghost tabs, and one saved `Rect`
  (`studyDbWindowCount` is dropped); resizing and Escape-close stay;
- the racks are `button-rack` rows, so the `.btn-rack__btn` styling P10 merged is reused as-is;
- `canOpen()` is unchanged: no `lt.getUserId()`, `lt.isMobile()`, `/practice|learn|broadcast` => no window.
- **the tree is curated** (§18.11.3, user's call): a study is in it only after Add, the root is itself a destination,
  so an empty tree is the normal first state — the header line (`filed / in database`, `studyDb.emptyNote`) explains
  an empty window instead of seeding the tree with everything the store knows.

### 18.3 The two state chips (tri-state, a click cycles)

| chip | cycle | test against the stored record (§3 shape) |
|---|---|---|
| `studyDb.access` | `all` -> `writable` -> `readable` -> `all` | writable = `role in {owner, contributor}`; readable = `role = 'member'` or no role |
| `studyDb.visibility` | `all` -> `public` -> `private` -> `all` | public = `visibility in {public, unlisted}`; private = `visibility = 'private'` |

- the state is `(state + 1) % 3` and **`all` is the default**, drawn dim (only a filtering state gets the accent),
  so a fresh window shows everything and both chips read "no filter";
- each chip's `title`/`aria-label` names the current state — a cycling button whose state you cannot read is as
  confusing as the tabs it replaces;
- a filtered study is **dropped from the tree**, not dimmed; a folder is never dropped (§18.4), it only goes dim
  when empty, so the tree's shape stays putable while filtering;
- the states live in the tree blob (`{ entries, filters: { access, visibility } }`) written through the existing
  `save()` chain, **not** in the options page: clicking a chip must not reload the page (`fireReloadOptions`
  would), and the state belongs to the same browser as the tree it filters (§12 keeps the tree browser-local);
- the chips are "what do I have here" switches, so they also decide **what the textbox can hit**: a study the
  chips hide is not searched either — one filter model, two knobs, no hidden second filter.

### 18.4 The textbox filter

- one visible `<input type="text">` in the filters rack, `aria-label` only, placeholder `studyDb.searchPlaceholder`;
- a term is a word, terms **AND**, and a study matches when every term hits its haystack — one lowercased string
  per study: `studyName + ' ' + topics + ' ' + description + ' ' + owner + ' ' + members + ' ' + chapter names
  + ' ' + chapter tag values`;
- reuse `StudySearchEngine.run(terms, { order: 'relevant' })` rather than writing a matcher: the weights (name 8 /
  topics 4 / description 2 / owner+member 1 / chapter 1), `matchingChapterFields` and the row highlight already
  exist, so the textbox is the old Search tab minus its form — that is why no new tab class appears in v2;
- rows keep their folder position; a folder with nothing matching stays and gets `.folder-empty` (dim) so the tree
  never reflows, and the header prints `shown / total`, which is what makes an empty branch read as a filter;
- haystacks are built once per render and cached against `store.studies`' revision, so typing filters over the
  already-scored map instead of rescanning every chapter on every keystroke.
- **filed studies only** (§18.11.3): the textbox runs over the tree's leaves, so a study that was never added cannot
  be hit. The header's `filed / in database` count is what makes that miss explainable, and `Add` is the only way in.

### 18.5 The actions rack (the user's flow, made explicit)

1. **Add** — hidden while Select is on, and hidden when no study is open (`canOpen()`). It inserts the page's
   study (`lt.lichess?.analysis?.study`) as a leaf under the selected folder, root when nothing is selected,
   then `await store.harvester.harvestOne(studyId)` (one request, all chapters) so the new leaf is searchable,
   then one `save()`. Adding a study that is already in the tree **moves** the leaf — never a duplicate.
2. **Select** — toggles the checkboxes: every row grows a `.checkbox` in front of it (the `form-check` markup P10
   merged already styles) backed by the existing `selected: Set<BookmarkEntry>`; clicking a row toggles that row,
   `Space` keeps the keyboard path; while Select is on, Add is hidden (the user's rule) and Delete takes the set.
3. **Delete** — one leaf drops that leaf; one folder drops the folder and its whole subtree. The number handed to
   the confirm is `leaves + folders` removed. Confirm is
   `await lt.uiApi.dialog.confirm(trans.pluralSame('studyDb.deleteQuestion', n))` — the mechanism `tools/preferences`
   line 614 and `tools/gameListOptions` line 287 already use; when the page offers no `dialog` service, fall back
   to "press again": the first press arms a one-shot 5s confirm bar, the second press commits.
4. **New folder** — kept from P8: makes a folder inside the selected folder (root when nothing is selected).
5. **Drag** — the one gesture the user asked for: a leaf or a folder dragged onto a folder is a **move**. P8's
   drop-half semantics stay (`upper` half = insert before, `lower` half of a folder = inside, otherwise after; the
   root zone appends) and `canDrop` still refuses only descendant cycles.
6. Folder **rename is dropped** from v2 — folders are named at creation. Double-click is taken by "open a study"
   (§18.6) and an inline text edit inside a drag-heavy tree invites mis-clicks; `editName` stays in the class for
   a pencil chip later.

### 18.6 Open a study and come back

- a study row carries an `open` chip on its right (`<button class="study-open">`, label `studyDb.open`, no icon, so
  nothing depends on the licon font); double click on the row does the same, and the keyboard `Enter` on a row keeps
  P8's behaviour;
- both paths go through the existing `studyLink` / `StudyNavigation.load`: same study -> `analysis.study.setChapter`,
  another study -> `lt.location.set('/study/' + studyId + '/' + chapterId)` (§13's honest degradation stays);
- just before navigating, set the hand-off flag:
  `lt.storage.set('LichessTools.studyDb.openFromTree', { studyId, at: Date.now() }, { session: true })` — the
  `sessionStorage` path of `LiChessTools.Storage` (`tools/pgnEditor/tool.js` lines 227 and 2424 show the shape);
- `start()` reads that key once per page load: when the page's study id matches and `Date.now() - at < 5000`, it
  **opens** the window instead of only installing the toggle and selects the row pointing at that `studyId`; the key
  is then removed (`lt.storage.remove(key, { session: true })`) straight away, so re-loading the study by hand never
  reopens the window;
  (as built 2026-11-04: `StudyDbCtrl.handoff()` does that read-and-drop, `treeHandoffKey` and `treeHandoffMs` are
  module constants shared by the writer and the reader, the payload is `{ studyId, at }` and only a study or chapter
  leaf writes it - the other kinds land where the window cannot open anyway. The spend happens before the preference
  gate, so a flag can never linger. The row is **not** auto-selected: `setSelect(on)` is a mode that paints a
  checkbox on every row and hides Add, so switching it on for one row would hide Add and lie about the rest of the
  tree; the window coming along is the whole affordance.)
- `sessionStorage` survives SPA navigation in the same tab, which is what `lt.location.set` does, so the trip works;
  a new tab, a middle-click or `target=_blank` loses it (accepted degradation, §18.13);
- match on `studyId` only — the tree's `studyName` may be a stale label and the user may have moved the row.

### 18.7 Backup / restore of the folder structure

- **Download** chip: `lt.download(JSON.stringify(entries, null, 2), filename, 'application/json')` with
  `filename = (userId ? userId + '_' : '') + 'lichessToolsStudyDbTree_' + lt.toTimeString(new Date()) + '.json'`
  — the shape `tools/preferences/tool.js` lines 629-637 and `tools/gameListOptions/tool.js` line 210 use;
- **Restore** chip: `$('<input type="file">').on('change', ...)` + `FileReader.readAsText` — the verbatim precedent at
  `tools/preferences/tool.js` lines 638-659. Parse, validate the `{ entries }` shape, `prune()`, then replace the
  tree after `dialog.confirm('studyDb.restoreQuestion')` quoting the incoming `N studies / M folders`;
- one parse feeds both paths: `readTree(text)` takes JSON from the file **or** from a `<textarea>` paste fallback,
  because a file picker inside a page the extension drives is unverified (§18.13) and the IDB blob is that same JSON;
- restore is **replace** for v2; union-plus-reparent merge is recorded as a later nicety, not built.

### 18.8 What the store must keep true

- the tree persists `{ studyId, studyName }` leaves and folder names only; every other fact (members, tags, chapters,
  `updatedAt`, `likes`) is read off `store.studies` at render time, and `entry.studyName` is the fallback label, so a
  cold store still draws every row — the tree never depends on a fresh harvest;
- refresh triggers already built and kept: page-init capture at `start()`, `chapterChanged` / `commentChange` capture,
  `analysis.change` -> `updatePosition`, on-demand harvest (`studyDbSync` / `studyDbHarvest`);
- new trigger: `harvestOne(studyId)` on Add (one request), and the open trip of §18.6 refreshes from the page blob
  for free — that is what "refresh when we open studies and cycle chapters, then rely on what we stored" buys;
- absence needs proof: `harvestOne` fetches with `ignoreStatuses:[404]`, and a 404 becomes the marker
  `{ studyId, absent: true }`, which `SyncCtrl.store` refuses and Add stamps on the leaf as `meta.deadAt`.
  That stamp is what draws `.study-missing` and counts into the delete confirm, so cleaning up stays a user
  action; a leaf the mirror never saw is uncaptured rather than deleted - it stays openable with its row
  button, and `studyDbUncachedNote` says so in the header. What the tree names stays put: `treeStudyIds()` hands
  its study ids to `SyncCtrl.setTreeIds` on every load and save, a role-less capture for one of them is persisted
  to `studyDb-captures` and that call prunes the blob to exactly those ids - a study the tree filed lists its
  chapters on pages where you are not standing on it, and a leaf that leaves the tree drops its capture with it;
  auto-prune is opt-in and fires only after a harvest
  that reported `exhausted` with no `error`, because a partial pass must never eat bookmarks;
- freshness is stated once in the header (`studyDb.staleNote`) instead of pretending the counts are live.

### 18.9 What P11 deletes (so the file carries no dead UI)

- classes: `MemberTabContent`, `HistoryTabContent`, `SearchTabContent`, `ResultTabContent`, and `StudyList`'s
  cross-tab `drag` payload half; views: `memberView`, `historyView`, `searchView`, `studyListView`/`studyRow`,
  `studyMatchView`, `highlightMatch`, `matchSnippet`, `studyFilterInput`;
- shell: the tab strip in `WindowFrame` (`button[role=tab]`, `.tab-icon`/`.tab-label`/`.tab-close`), and
  `windowEventHandler`'s `previewTab`/`dropTarget`/`ghostTabs`/`transfer()` plus `navKeyDown`'s tab cycling
  (`Home`/`End`/arrows become tree navigation); `windowBounds`, `fitWindow`, the five `.resize` strips, Escape-close
  and the `studyDb-windows` blob stay;
- prefs: drop `studyDbTabs`, `studyDbWindowCount` and the member-filter prefs; keep `studyDb`, `studyDbSync`,
  `studyDbHarvest`/`studyDbHarvestDelay`, `studyDbHistoryLimit` (store-side), `studyDbMaxResults`, the sort pref and
  the chapter prefs;
  (2026-11-04 narrowed this again - one capture switch and three module constants, recorded in 18.12);
- `tool.css`: the PR->CSS audit flips meaning — with most of the PR's 69 class tokens no longer emitted, the pass
  must prove **no rule without an emitted class** over the surviving subtree and prune the rest (the §14 desktop
  guard, the `.btn-rack__btn` rules and the `.member-sync`/`form-check` spacing stay; on 2026-11-04 the two
  `body.lichessTools.mobile` hide-rules became phone rules - 18.14);
- harnesses: `test/studyDb.check.js` (137) and the member/history/search/tab halves of `test/studyDbWindow.check.js`
  (425) are rewritten, not kept green; the new counts get recorded in §15.

### 18.10 New intl keys (both `_intl` tables; `data/crowdin.json` stays AssetGenerator's)

`studyDb.add` `studyDb.select` `studyDb.selectOn` `studyDb.delete` `studyDb.newFolder` `studyDb.open`
`studyDb.downloadTree` `studyDb.restoreTree` `studyDb.filtersAccess` `studyDb.filtersVisibility`
`studyDb.access.all|writable|readable` `studyDb.visibility.all|public|private`
`studyDb.deleteQuestion` (+ `:one` `:few` `:many`, the `removeBookmarksQuestion` plural shape) `studyDb.restoreQuestion`
`studyDb.addedStudy` `studyDb.addFailed` `studyDb.removedCount` (+ plurals) `studyDb.downloadedTree`
`studyDb.restoredTree` `studyDb.staleNote` `studyDb.missingStudy` `studyDb.emptyNote` `studyDb.unfiledNote`
(the header hint that `N` studies in the database are **not** filed — there is no `Unfiled` branch, §18.11.3).
Each needs its `ro-RO` string; the other 21 locales keep falling back through `Translator.get siteI18n`
(§10's P10 deviation), and `data/crowdin.json` is regenerated by `AssetGenerator` — never hand-edited.

### 18.11 Deviations from the literal request (proposals, pending the user's call)

The request is implemented as asked except for these, each there to keep the window legible and cheap to build:

1. **tri-state chips, not checkboxes**: two buttons cycling `all -> A -> B`. Three states need either a 3-state
   control or two booleans (four combinations, one of which means "nothing", which no filter should offer); one
   click per state change plus a `title` that names the state is the shortest machine that reads well.
2. **one window, no tabs, no multi-window**: `studyDbTabs` and `studyDbWindowCount` die with the tab strip. The tree
   and the two chips already answer what splitting windows used to answer, and `transfer()` has no user left to want it.
3. **no `Unfiled` pseudo-folder (user's call, 2026-11-02)**: the tree is strictly curated — a study is in it only
   once it has been added, the root counts as "added", and the folder structure is optional organisation on top of
   that ("only to organize the added studies"). An empty tree is therefore a **normal** first state, and what makes
   it legible is the header line (`filed / in database`, plus `studyDb.emptyNote`), not a hidden branch. The textbox
   consequently searches **filed studies only** (§18.4 spells the consequence out).
4. **the chips also bound the textbox**: a hidden study is not searched, so there is one filter model rather than a
   visible filter plus a hidden second one.
5. **folders stay visible when empty** (the request's rule) plus a `shown / total` header count, so an empty branch is
   visibly a filter rather than a lost folder.
6. **`New folder` kept**: the described flow adds studies but nothing creates a folder, and the tree is pointless
   without that control.
7. **folder rename dropped** for v2 (double-click is now "open a study"); `editName` stays in the class.
8. **one confirm for a whole selection** (`deleteQuestion` with plurals) rather than one per row.
9. **Add runs `harvestOne`**: members/tags/chapter titles exist only after a capture, and one request per Add is what
   makes the textbox honest.
10. **Select is a mode toggle**: the checkboxes appear on every row while on and Add hides, per the request.
11. **the session hand-off is one-shot and age-checked** (`< 5s`) — otherwise the request's flag would reopen the
    window on every later visit of that study.

### 18.12 Open questions (defaults apply unless the user answers)

- **Q1 what the tree holds at all** — **ANSWERED (user, 2026-11-02): strictly curated.** A study enters the tree only
  through Add, the root is a valid destination ("it's in there, even if it's in the root"), the folder structure is
  optional organisation only, and there is **no** `Unfiled` pseudo-folder. The consequence — the textbox can only hit
  filed studies, so the header count is what makes an empty window legible — is written into §18.2 and §18.4.
- **Q2 chip state persistence** — **ANSWERED: the tree-side key** (`collectionTree-filters` per §19.4), per browser,
  no page reload. The options page never sees the three chips.
- **Q3 `unlisted`** — **ANSWERED: public.** `private` means `visibility === 'private'` only.
- **Q4 is a `member` writable** — **ANSWERED: no.** Only `role in {owner, contributor}`. lila's member rows carry
  `members?[{user, role('r'|'w')}]` and a `'w'` member can edit, but that list belongs to the study rather than to
  the mirror, so the refinement stays a recorded follow-up and not a P11 dependency.
- **Q5 row order inside a folder** — **ANSWERED: alphabetical inside a folder**, the saved sort order for anything
  unpinned (the `Unfiled` branch of §18.11.3 never shipped, so in practice that is the root).
- **Q6 restore** — **ANSWERED: replace**, with the incoming `N studies / M folders` count shown before confirming.
- **Q7 mobile** — **ANSWERED: still nothing.** `canOpen()` keeps refusing `lt.isMobile()`.
- **Q8 History** — **ANSWERED: gone from the UI**, `visit` records stay in the store because they are what freshness
  reading needs.

### 18.13 Risks specific to v2

- the textbox only searches **captured** data: a filed-but-never-opened study answers name only until `harvestOne`,
  and tags/descriptions need the `harvestChapterTags` chapter pass (one request per chapter, paced by
  `studyDbHarvestDelay`) — the header says so (`studyDb.staleNote`) rather than over-hitting;
- `lt.uiApi.dialog.confirm` was read off `tools/preferences` and `tools/gameListOptions` handlers on other pages;
  reachability from a study-page click handler is unverified, which is why the "press again" fallback exists;
- a `<input type="file">` picker inside a page the extension drives is unverified; `readTree(text)` plus the
  `<textarea>` paste fallback keeps restore working without it;
- the session hand-off is per tab: a new tab, a middle-click or `target=_blank` loses it (accepted);
- the tree has one visible page where the four-tab UI had `hasMore`/cursor paging, so a filed set above
  `studyDbMaxResults` must print `N more hidden` in the header rather than truncate silently;
- deleting the four tabs invalidates part of the shipped harness counts — §15 keeps the old numbers as history and
  P11 records the new ones.

### 18.14 Implementation order for P11 (all inside the two shipped files, no new tool)

1. `BookmarkTabContent` grows `filters {access, visibility}`, `query`, the haystack cache and the tri-state cycle;
   the blob record gains `filters` so the states survive a reload;
2. `bookmarkView` grows the four racks (filters, actions, tree, backup) in the DOM order of §18.2 and the row
   checkboxes, keeping P8's `data-path`/`insertion()` keyboard rack;
3. actions: `addCurrentStudy()` (with `harvestOne`), `newFolder()`, `deleteSelected()` (count + confirm +
   `dialog.confirm` fallback), `setSelect(on)` hiding Add;
4. `openStudy(entry)`: set the `{ session: true }` flag, then `StudyNavigation.load`, and `start()` reads/removes it
   and selects the row — assert the one-shot and the age guard in the harness (as built: `openLeaf` leaves it and
   `StudyDbCtrl.handoff` spends it; the row is not selected - see 18.6);
5. `downloadTree()` / `restoreTree()` over one `readTree(text)`;
6. delete the four tab classes, their views, the tab strip and the dead prefs, then re-run the CSS audit as an
   orphan-rule pass and rewrite the two harnesses.










### 18.12 The switches the product owns (2026-11-04)

- one switch governs capture: `studyDbCapture` replaced `studyDbSync` + `studyDbHarvest`. Opening a study
  offers its page record, and the study-list crawl runs only while the mirror holds nothing - the crawl is
  paid by the first page, never by every page. `harvest()` itself stays callable on demand.
- three numbers stopped being preferences and became constants at the top of the pair that owns them:
  `studyDbHistoryLimit` (500 newest visits) and `studyDbHarvestPageDelayMs` (300 ms between harvested pages)
  in the store tool, `studyDbMaxResults` (1000 records scored while filtering) in the UI tool. Edit them
  there; no label, no `data/crowdin.json` entry, no hidden option.
- `windowCount` left the module. The shell keeps one window per registered kind and only `treeTab` is
  registered, so one popup is the whole state; `saveWindows`/`loadWindows` stay because a new kind is a
  new window, not a new tab.

### 18.14 The phone gets the window too (2026-11-04)

The §14 desktop guard is lifted, so the window answers a touch layout:

- `canOpen()` drops the `!lt.isMobile()` test; what still has to hold is a user, a study page and
  a study open on it. The store already captured studies on a phone, so only the window was missing.
- `initialGeometry()` derives a phone box from the viewport instead of the PR's fixed `400x480`: one
  column, the width the viewport has under the site header. A size the user saved on a desktop is
  clamped by `fitWindow` into the phone rather than hanging off it, so the saved geometry survives.
- `windowEventHandler.start` accepts a touch contact: a finger reports no button (`-1`), and both it
  and a left press open the gate, while a right or middle click never does. `moveWindow` clamps to
  the same `minWindowWidth` for both.
- `tool.css`: the two `body.lichessTools.mobile … { display: none; }` rules are gone. In their place the
  header grows to a thumb grab, the five resize strips widen into tap bands, the toggle becomes a
  thumb-sized box, and `touch-action: none` keeps a dragging finger from panning the page.
- Harness: `test/studyDbWindow.check.js` (404 -> 415) drives a 390x780 phone - toggle present, one
  window open, the box inside the viewport, a `button: -1` gesture on the east strip narrows the
  window, and a desktop-shaped row comes back clamped; `test/studyDb.check.js` (69 -> 70) asserts a
  phone page answers `canOpen`.

### 18.15 The tooltip follows the mirror onto a row that painted cold (2026-11-04)

Symptom from the field: a study in the tree that is not the user's own showed its chapter tooltip
only while standing on that study's page; on any other page the row had no tooltip at all - even
though §18.8/§19.3 keep the whole capture in `studyDb-captures` for exactly that case.

The capture is there, it arrives **late**. `SyncCtrl.load` runs off the critical path, and inside it
the member blob is read first and the captures blob only afterwards - so the mirror gains a foreign
study a beat after the tree painted. `bookmarkView` reads facts through `recordFor`, a cache built
by `refreshCaches`, and nothing refreshed it: `WindowCtrl` watches the mirror and every publish
calls `redraw` -> `render` -> `bookmarkView`, but that rebuild reused the cache the first paint left
behind. Standing on the study's page was the one order that worked by luck: `studyDbStore.start()`
awaits `captureFromLivePage()` *before* deferring the blob read, so that record is already in the
mirror when the tree opens.

The fix is the stamp the caches already had a use for. `refreshCaches` ends by writing
`hayRevision = sync.publishRevision` - the revision its caches answer for - and `bookmarkView`
refreshes whenever that stamp trails the mirror. The repaint every publish already triggers is
what carries the tooltip, the chips and the `.tree-uncached` line up to the mirror it now sees.
Cost stays bounded: `publish` guards its redraw with `this.frame`, so the refresh runs at most once
per animation frame whatever the batch size.

What the window harness went through after this: **438/0** (433 + 5 checks: a row painted over a
mirror that has not landed yet carries no tooltip and the header says so, the publish that lands the
capture repaints the row and its `data-popup` appears, and the record cache behind the paint answers
the chapters rather than the cold first cache).

### 18.16 The page fires resize on its own, so the listener must not read `this` (2026-11-04)

The field report: every viewport change threw
`Uncaught TypeError: Cannot read properties of undefined (reading 'geometry')` at `fit`, with the
stack arriving through `tools/fixChessgroundResize`'s `fireResizeDirect` -> cash's `trigger`. That
tool watches chessground and calls `resize` on its own, so our listener was being invoked by
something other than a browser resize.

An event hands its callback a receiver of its own. Handing a class method
(`addEventListener('resize', this.fit)`) means the method runs detached from its object - cash calls
it with its own context, the browser with the global object - so `this.ctrl` is missing and
`this.ctrl.geometry` throws on every resize. It also left the window never refitting, so the crash
was both noisy and load-bearing. `tools/gameAnalysisLayout` never had this problem because its
`scheduleUpdate` is an arrow property rather than a method.

The shape that survives: the frame builds one closure in its constructor
(`this.resizeHandler = () => this.fit()`) and `show()`/`close()` hand that same reference to add and
remove - `removeEventListener` compares by reference, so one identity has to feed both. `fit()` keeps
its direct call from `show()` and now answers a frame that has been disposed by doing nothing, so a
resize landing between a close and its listener removal cannot resave geometry.

What the window harness went through after this: **443/0** (438 + 5 checks: exactly one listener per
open window, the listener called detached does not throw, a narrower page refits the box, refitting a
box that already fits is a no-op, and closing drops the listener by identity).



### 18.17 Less noise in the header; one press for every folder (P11.10 + P11.11)

**The header stopped restating the tree.** The user called `On screen: 2 / 2` and `Filed but not captured
yet` superfluous, and both were narration that also failed under `refresh()`'s own timing. `On screen`
counted the same rows the per-kind lines already count - one pass, two numbers - and it was stale whenever
the header ran before the capture mirror landed, a "2 / 2" sitting over rows whose tooltip was still empty.
`Filed but not captured yet` announced a fact the user never acts on: an uncaptured leaf keeps its row, its
open button and its dim chips, so the tree already shows what that row can do, and §18.15's refresh path is
what fills the tooltip in when the mirror arrives. So `bookmarkView` now prints only what the tree cannot
show by itself - an empty tree (otherwise the header would be blank), a leaf a read proved gone, a restore
waiting, a confirm armed - and the intl keys and CSS rules for the two deleted lines went with them.
`uncachedCount()` went too: nothing in the tree or the header reads it, an uncaptured leaf keeps its row, its
open button and its dim chips anyway, and the harness counts the same fact over the content class's own
primitives (`folder`, `isGone`, `recordCache`).

**One press for the whole tree.** §14.6 promised "double press expands or collapses all folders" and only
the per-row caret had been built. `folderNodes()` walks the tree in paint order and returns every folder,
nested ones included; `toggleAllExpanded()` reads them with the caret's own rule - while any folder is
closed the press opens every one, once every one is open the press clears them - and calls `onChange()`
once, so the repaint is one revision like every other state change. The chip says which way it is going in
its own label (`Expand all folders` / `Collapse all folders`), the same reading a row's caret carries in its
`title`, and it is disabled only on a tree that has no folders. `expanded` is view state - cleared on load,
never written into a blob - so folding a deep tree is one gesture and no storage write.

The window harness carries both halves: after a cold mirror the header prints no capture note, after the
mirror lands still none, one press opens both folders and paints the branch under them, the chip's label
follows the state, and the next press folds the branches back. 443 → 458 window checks.

### 18.18 The tooltip is shown but unreachable, so scrolling it is impossible (P11.12)

**The field report:** a study row with more chapters than the box held showed the list and a scrollbar, and
"there is no way to move the mouse to it and scroll". The tooltip was there, painted and clipped - but the
pointer could never get inside it.

**The order the page fires is the whole problem.** Moving the pointer from the row down into the tooltip
fires the row's `mouseout` first, then the tooltip's own `mouseover`. The handler answered the first event
by hiding the tooltip, and the second handler could not bring it back: it asked whether a tooltip was still
shown, and the hide had just cleared that state. So every attempt to reach the list ended with the list
gone, and the one gesture that made the scrollbar useless made reading it impossible.

**A hide that can be spent before it lands.** A `mouseout` on either side schedules a hide 150 ms out; a
`mouseover` on either side clears the timer. The crossing from row to tooltip is one pointer move - both
events land inside that window, so the hide never runs - while a pointer that leaves both sides lets the
timer fire. The same rule makes a row hover spend a hide a nearby tooltip had left, so one gesture moves
the tooltip from one row to the next rather than hiding and reshowing. `hideStudyPopup` spends the timer
too, so the hide a repaint asks for is the hide that happens. The window is deliberately one pointer move,
never a stretch a reader would notice.

**What makes the box worth scrolling.** `showStudyPopup` sized the box to the gap under the row, so a row in
the lower half got 80px - a scrollbar over three lines. It now has a floor of 160px and the box is kept
inside the page, so the wheel has something to scroll wherever the row sits, and the popup rule carries
`overscroll-behavior: contain` so scrolling inside the tooltip stops at the tooltip instead of chaining into
the tree or the page behind it.

**What the window harness went through after this: 458 → 464** - hovering a row shows the tooltip and lists
its chapters; the row's `mouseout` leaves it shown; after the tooltip's own `mouseover`, a wait longer than
the window still finds it shown (remove the cancel and that check fails); and a pointer that leaves both
sides finds it hidden once the window has passed.


### 18.19 The tree keeps the shape a user left when they go away (P11.13)

**The field report:** "when I leave a folder open and go away, coming back folds everything". The
tree remembered the filter chips and forgot the rest: `load()` cleared `selected` and `expanded` on
every visit, so a study the user was halfway through reading came back as four collapsed roots and
the reading position had to be found again by hand.

**Where the shape lives.** The window already writes one blob row per content (`StoredTab`), so the
shape joins that row rather than starting a key of its own: `freeze()` adds a `view`, and a content
that owns no shape hands over nothing - the tab base says so with a stub. The shape is two lists:
the open folders and the selected rows, the two things a user leaves behind.

**Why a row is named by path and key.** A path alone would open the wrong folder: rename one, and the
blob's slot now points at something else. Each record therefore carries the row's own name (folders
carry names, leaves carry ids) beside its path, and a load re-adopts only the rows whose path *and*
key still match. A slot collision is refused rather than guessed, and the honest answer to a tree that
changed shape since the save is a folder that stays folded.

**What stays session state.** The anchor, `editing` and an armed confirm describe where the user is
pointing inside one visit; only the open folders and the selection cross a visit, so only those enter
the blob. A load re-applies what the blob holds, which is what makes the restore retry re-adopt the
saved shape instead of a selection made after the last save (§17).


### 18.20 Typing in the filter box survives the repaint it causes (P11.14)

**The field report:** "typing in the filter box and losing focus at every keypress". The first
letter reached the box and the next one did not, so a query had to be typed one letter at a time with
the caret hunted down again between letters.

**Why a keystroke is a repaint.** A keystroke changes the query, the query decides which rows are
painted, and a paint rebuilds the whole subtree - rows, racks and the textbox itself. A rebuilt
element is a new element, and a new element carries no focus: the browser had already moved the caret
out when the old box was taken away from the page. The frame's own declared focus is the textbox,
named in the dialog's `focus` option, so that focus was spent on the first keystroke and never put
back - which is exactly the symptom of a repaint, not of the filter.

**The paint hands that focus back.** `render()` ends by asking the window for its focus, and the
window answers with the textbox inside `.content-frame`. One name owns the frame's focus, and one
place knows that the box was just replaced. The text typed so far already survived, because the paint
writes the query back into the box; only the caret needed returning.

**What that costs.** A repaint returns the keyboard to the textbox even when a keyboard user had
tabbed elsewhere in the frame. The chips are read by clicking, and the frame already opens with the
caret in the box, so the frame keeps one focus rather than remembering where a second one was.

**What it did not buy.** The refocus returned the keyboard but not the caret: every letter landed at
the start of the text, so a user typing "Par" heard "raP". §18.21 keeps the box on the page instead,
which is what returns both.


### 18.21 The paint keeps the chain above the textbox (P11.15)

**The field report:** P11.14's refocus returned the keyboard and typing still went wrong, now in the
other direction: the caret came back to the start of the text, so "Par" typed one letter at a time
answered "raP". Focus and caret are two pieces of state, and a rebuild that is papered over returns
only the one the tool knew about.

**The rule that settles it.** Nothing on the way from the textbox up to the page may be taken off the
page while the window is open: an element that leaves the document loses the keyboard that was on it,
whether it is rebuilt or only moved into a fresh subtree. So the window keeps that whole chain - the
inner host that carries the gesture listeners, the scroll host under it, the tree host under that and
the filters rack under that - and a paint swaps only what hangs under them: the header, the actions
rack, the body of rows, the note and the backup rack. Inside the rack only its buttons are swapped,
which leaves the textbox in its last slot with its caret where the user left it.

**Where the listeners went.** A kept host is hung once, so the listeners that belong to the tree
(`Delete`, `Home`/`End`, `Ctrl+A` and the drag clean-up) come from `BookmarkTabContent.viewHost()`,
which makes the tree host; `clearDrop` moved to module scope because the rows and that host both need
it. `bookmarkView(content, host, box)` fills a host the window hands it instead of making one, and
`contentView` carries the host and the textbox through the kind test.

**What that costs.** The window owns more of the tree shape now: the pieces a paint swaps are named
twice - the builder's order and the repaint's five class selectors - so a new top level piece has to
be added to both. The checks say so: the read order of the pieces and the "one of each piece" counts
are asserted after a repaint, and killing the stale removal fails 58 of them.

## 19. The same tree, generalized to any lichess object (user's call, 2026-11-02)

Chosen shape: **one mixed tree**, a **kind chip** as the third filter, the **containment rule** for nested kinds, and
**one engine in `tools/recordsDbStore`** driven by a **kind registry**. Where §18 and §19 disagree, §19 wins about
*kinds* and §18 wins about the *window*: the racks, the chips' cycle, the drag semantics, the confirm count, the
checkbox select mode and the session hand-off are §18's and do not change.

### 19.1 The leaf, the tree, and what stops a tree from lying

```
leaf  = { kind, id, label, meta? }      // meta = the fields captured at add time, for kinds with no read API
folder = { name, children }             // kind-agnostic: a folder may hold any leaves
kinds  = study | chapter | game | position | puzzle | blog | blogPost | forumPost
```

- the tree stores **id + label only**; every other fact is what the registry's `read` returns, so the tree stays valid
  when the store is cold (§18.8's rule, kept for every kind);
- **containment rule** (the two pairs where lichess already nests): a `chapter` leaf may only be a child of its own
  `study` leaf, and a `blogPost` leaf only a child of its author's `blog` leaf. `canDrop` keeps the descendant-cycle
  guard and grows these two checks, so a chapter cannot be filed somewhere its study is not. Everything else may sit
  in any folder or at the root;
- folders stay kind-agnostic: a folder's actions follow the **selected leaf's** kind, never the folder's, which is
  what keeps one machine serve eight kinds;
- `position` is our own leaf: no lichess object exists for a bare position, so its `id` is a FEN key and its `meta`
  carries the line; opening it materializes an analysis rather than a saved object (§19.7 says what is unverified);
- mixed kinds dilute nothing because the **chips are per-kind** (§19.2 answers `canWrite`/`visibility` per kind and
  §19.3 dims a chip that has no meaning for the kind on screen).

### 19.2 The kind registry (one table holds every per-kind behaviour)

```js
kinds[kind] = { openUrl(id, meta), icon, canWrite(record), visibility(record),
                haystack(record), read(id) | readSet(ids), isDead(record) }
```

| kind | open | canWrite (access chip) | visibility chip | read / refresh | dead means |
|---|---|---|---|---|---|
| `study` | `/study/<id>` | `role in {owner, contributor}` | `visibility` | `harvestOne` (1 request) or page-init on visit | a `harvestOne` 404 stamps `meta.deadAt` |
| `chapter` | `/study/<id>/<chapterId>` | inherits its parent study leaf | inherits | free with the parent; `study.getChapterPgn` when the PGN is wanted | parent stamped |
| `game` | `/game/<id>` | mine (`/@user/imported` + `game.deleteImported` are the mine test) | `visibility` | **batch**: `game.getPgns(ids, { ndjson: true })` answers a whole folder in one request | the batch omits the id |
| `position` | `/games/import?fen=…` (materialize, §19.7) | always ours | n/a — chip dim | none; `meta` holds the line | never |
| `puzzle` | `/training/<id>` | never — chip dim | public only — chip dim | `puzzle.getPuzzle(id)` one request per id, so cap the pass and say so | the id was rebatched (404) |
| `blog` | `/@<user>/blog` | my own | public | `user.getMini` for the author label | profile gone |
| `blogPost` | `/@user/blog/<slug>/<postId>` | mine | public | DOM fetch with `ignoreStatuses:[404]`; the key shape `userId/slug/postId` is what `tools/blogHistory` already uses | 404 |
| `forumPost` | the URL the leaf carries | never — chip dim | public only — chip dim | nothing to read — `meta` holds title/author/board from add time | 404 |

- the registry is one plain object in the store file, so **adding a kind is adding a row** — the tree code, the racks,
  the drag machine and the harnesses do not change;
- `read` is allowed to be per-id, per-set or absent: the tree never assumes a batch exists, and a kind whose read is
  per-id gets a **cap** in the header (`N of M checked`) instead of a silent partial pass;
- an unknown `kind` in an old blob is **kept and rendered as a dead link**, never dropped: §17's fail-soft rule, so
  a future kind cannot silently eat a user's tree on downgrade.

### 19.3 What §18 means once kinds exist

- the filters rack grows a **kind chip**: the cycle walks only the kinds actually present in the tree, so a tree of
  studies never offers a games state and never shows an empty kind branch;
- **dim, never inert**: while the kind on screen has no answer for a chip, that chip is dim and its `title` says
  "not applicable to puzzles" (etc.). This is the cure for §18.1 — the old role radios looked inert because they were
  *silently* identical; a dim chip says why it does nothing;
- `Add` becomes **add whatever this page is**, in resolver order: the page-init blob first (game, study and puzzle
  ids come free from `lt.pageInitData`), then `lt.location.pathname` parse for the rest (blog reuses the regex
  `tools/blogHistory` already matches, forum and imported pages are path parses), then refuse with a
  `nothing here to file` note — no page-type guessing beyond what is already read;
- the open chip, the double click and the keyboard `Enter` all become `openUrl(kind, meta)`; the session hand-off key
  is `LichessTools.collectionTree.openFromTree = { kind, id, at }`, one-shot with the age guard exactly as §18.6;
- the header prints one line **per kind present** (`3 studies / 2 games / 1 puzzle`, plus `shown / total`), because a
  mixed tree needs per-kind counts before the two state chips are checkable at all;
- download and restore stay one file: `{ trees: { kind: entries } }`, replaced **per branch** after one confirm, so
  restoring a games tree never rewrites the studies branch.

### 19.4 Blob layout — why one blob per kind, not one blob for the tree

- keys follow §12's style: `LiChessTools/LT/studyDb-tree-<kind>` — one blob **per kind branch**, and `chapter` is not
  its own branch because containment puts chapter leaves inside their study leaf (§19.1);
- the reason is mechanical, not cosmetic: every `save()` goes through the serial `writes` chain and holds
  `Cache.waitRelease(key)` for that key, so one mixed blob would rewrite every study the moment a game is filed —
  quota churn and a lock that blocks unrelated tabs;
- record shape `{ formatVersion: 2, kind, entries }`; the three chip states live in their **own** small key
  (`collectionTree-filters`) so changing a chip never writes a tree branch;
- `readTree`/`writeTree` stay the only two entry points, so a restored file, a paste and the IDB blob all feed the
  same parser and the same `prune()`.

### 19.5 Additive, never destructive

- deleting a leaf removes it **from the tree only**. It never deletes a game, never calls `game.deleteImported`, never
  un-bookmarks: the tree is an organiser, and §18.5's confirm count is a count of *filing* changes;
- where lichess already has its own collection concept, the two stay separate and the bridge is explicit and one-way:
  games offer an opt-in "also bookmark on lichess" (`POST /bookmark/{id}`, the `game.bookmark` in the api module),
  studies offer an opt-in "also tag with this topic" (`study.setTopics` / `study.getTopicStudies`);
- the rule that keeps it honest: a folder is never a synonym for a lichess concept. A lichess bookmark can exist
  without the tree, and a tree leaf can exist without a bookmark — the two only agree by the button the user pressed.

### 19.6 Staging — P11 writes the machine once, later kinds add registry rows

- **The registry carries every row from P11 on; P11 services only `study` and `chapter`.** That split is the user's
  call, and it is the whole point of the phase: the **DB** must round-trip any kind even while the **UI** never offers
  it. Concretely, "serviced" means Add, open, refresh and the haystack exist for that kind; "carried" means the kind
  parses, survives `prune()`, survives a save and survives a restore. So:
  - the registry object in `tools/recordsDbStore` holds all eight rows from the start, but only the two serviced rows
    get `add`/`open`/`read` wired into the window;
  - `readTrees` accepts leaves of an unserviced kind and **keeps them** — they render through the generic renderer as
    a dead-link row with their stored `label` (and stored URL when the kind has one), never dropped;
  - `save()`/`writeTree` **never invents** a blob for an unserviced kind and never rewrites one it did not read, so
    carrying costs bytes only;
  - the kind chip degenerates honestly: it walks the kinds present, so today it has one real state plus `all`, and it
    is still exercised by the harness so a second kind is a row, not a rewire;
  - a leaf whose kind is unknown to the registry (a future downgrade) follows the same rule as an unserviced kind:
    kept, rendered dead, never eaten (§19.1's fail-soft line).
- **P12–P16 stay deferred behind a green P11**: each is a registry row plus its harness asserts (Add resolver branch,
  open branch, refresh policy, per-kind header count) — no new window, no new gesture, no new rack, no new blob shape.
- **promotion rule**: the engine stays inside `tools/recordsDbStore/tool.js` until a second kind works end to end.
  Only then does it move to `scripts/lichessTools-collections.js`, and only then do we pay the four-manifest and
  `lichessTools-init.js` bump — a speculative core move costs exactly that wiring today and buys nothing yet;
- the studyDb window is not renamed while kinds grow: the tool stays `studyDb`/`studyDbStore`, the key prefix stays
  `studyDb-*`, and a future rename is a separate, deliberate change with its own manifest pass.

### 19.7 Still unverified in the page (check before coding against it, do not assume)

- `/games/import?fen=…` as the way to materialize a **position** leaf — never exercised from inside the extension;
- the forum post URL shape and how its title/author/board are captured at add time (no api entry exists at all);
- how a blog post's label is read by DOM fetch, and whether `ignoreStatuses: [404]` is the real dead signal there;
- how far `game.getPgns(ids, { ndjson: true })` scales — the api module chunks `/round/minis?ids=` at 1900 characters,
  so a game folder of hundreds of ids needs the same chunking, not one POST;
- `puzzle.getPuzzle` id drift: whether a rebatched puzzle 404s or silently answers something else decides how a dead
  puzzle leaf is drawn;
- `lt.uiApi.dialog.confirm` reachability from a study-page click handler and the `<input type="file">` picker — both
  shared with §18.13, both read off other pages (`tools/preferences`, `tools/gameListOptions`);
- `lt.pageInitData` availability per page type: the resolver of §19.3 depends on it, and §10.1's probe only confirmed
  it on study pages.

### 19.8 intl keys the generalization adds

Kind labels only — the actions, chips and notes keep §18's `studyDb.*` keys:
`collectionTree.kind.study chapter game position puzzle blog blogPost forumPost`, `collectionTree.kindAll`
(the kind chip's "everything" state), `collectionTree.notApplicable` (the dim chip's `title`, interpolated with the
kind label), `collectionTree.nothingToFile` (Add refuses off-page), and the per-kind header counts reuse the kind
labels. Same rules as §18.10: every key gets its `ro-RO` string in both `_intl` tables, the other 21 locales fall
back through `Translator.get siteI18n`, and `data/crowdin.json` is regenerated by `AssetGenerator`, never hand-edited.







---

Reference material kept on disk while implementing: `test/_pr22258/` (all 36 client files from the PR head commit
`683e9ffc436246d5937cd3c9694a9b05a0cc3b46`, plus the key Scala views/controllers and `conf/routes`),
`test/_pr22258_files.txt` (all 195 changed paths with LOC deltas). `test/` is gitignored, so nothing ships from there.











### 19.10 The names the pair ships under (2026-11-04)

- The tools are `recordsDbUi` (the window, `general` category) and `recordsDbStore` (the data, whose
  switches `recordsDbHarvest` and `recordsDbCapture` are `filesystem`), so a future kind needs no rename.
- `study` survives where it names a lichess study: `studyId`, `studyName`, `StudyData`, `idbStudy`,
  `mergeStudyMetadata`, `mapInitStudy`, the `study` branch/kind, `.study__side` and the rest of the page
  DOM, `/study/db` requests, and the PR's `ui/studyDb` package.
- The storage keys moved to `recordsDb-*`; `IdbStudy.readBlob` reads an old `studyDb-*` blob once when the
  new key is empty and rewrites it, so a database a user already had survives. The old blob stays, unread.
- Harnesses follow the pair: `test/recordsDbUiWindow.check.js`, `test/recordsDbStore.check.js`,
  `test/recordsDbHarvest.check.js`.
