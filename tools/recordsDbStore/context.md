# Records Db Store Tool — Context

## Overview

The **RecordsDbStoreTool** is the data half of the records window: an IndexedDB mirror of the studies a user
owns, contributes to and opens, plus the harvester that fills it. It is the browser-only port of lila PR #22258's
`ui/studyDb` package (`idbStudy.ts`, `syncCtrl.ts`, `studyMetadata.ts`) — there is no `POST /study/db/sync`
endpoint here, so `RecordsHarvester` rebuilds the same shapes from what Lichess already publishes.

It ships ahead of the UI half (`tools/recordsDbUi`, which declares `dependencies = ['RecordsDbStore']`) so the database
is warm before the window exists. Field names follow PR `types.ts` unchanged.

## Preferences

- **name**: `recordsDbHarvest` — **category**: `filesystem`, **type**: `single` `[false, true]`, default `true`, advanced, hidden
- **name**: `recordsDbCapture` — **category**: `filesystem`, **type**: `single` `[false, true]`, default `true`, advanced.
  One switch covers both capture routes: the record of the study the page carries, and the study-list crawl
  that runs only while the mirror holds nothing. It replaced `studyDbSync` + `studyDbHarvest` (2026-11-04).
- The numbers are no longer preferences (2026-11-04): `recordsDbHistoryLimit` (500 newest visits) and
  `recordsDbHarvestPageDelayMs` (300 ms between harvested pages; `lt.net.slowMode` still adds a second per
  page after a 429) are constants at the top of the pair, edited there rather than configured.
- The pair was renamed on 2026-11-04: the tool is `recordsDbStore`, its storage switch is `recordsDbHarvest` and its
  capture switch `recordsDbCapture`, both in the `filesystem` category. Blob keys moved to `recordsDb-*`, and
  `readBlob` spends an old `studyDb-*` blob once - an empty new key reads the old one and rewrites it, so a
  database a user already had survives; the old blob stays behind, never read again.

## Behavior

### `init`
Builds the singletons behind `lt.recordsDbHarvest` — `{ idbStudy, harvester, syncCtrl }` plus the shared
`mergeStudyMetadata` / `matchesMetadata` / `isRecordsDbAvailable` the UI half reuses — and attaches the event hooks.
Idempotent: a second `init()` keeps the first store, so a page change never loses what was captured.

### `start`
1. Disabled when `recordsDbHarvest` is off or `lt.storage.supportsDb` is false.
2. Nothing happens without `lt.getUserId()` — the database is per-user.
3. Captures the study being read when `recordsDbCapture` is on: `harvester.captureFromLivePage()` reads the `page-init-data` blob
   (`lt.pageInitData`, the lazy property `tools/pageInitData` installs, with a DOM fallback) — **no request** —
   and hands the `StudyUpdated` record to `syncCtrl.studyUpdated`, which stores it, records the visit
   `{chapterId, path, orientation, at}` from `study.position`, and schedules the member write.
4. `load()` then `harvest()` run unawaited, so a slow crawl never blocks the other tools' `start()` - and the
   crawl is skipped while the mirror already holds records, so it is paid once rather than on every page.

### Storage (`IdbStudy`)
Every value goes through `lt.storage.get/set(key, value, { db: true, raw: true })`, i.e.
`LiChessTools.IndexedDbStorage` with key shape `dbName/storeName/itemName`, staying inside LiChessTools' own
partition `lichessTools` / `LT`. Each call returns a Promise — every call site awaits.

| key | value | |
|---|---|---|
| `lichessTools/LT/studyDb-member` | `{ studies: StudyData[], complete: boolean }` | studies with a `role` (owned/contributed) |
| `lichessTools/LT/studyDb-captures` | `{ studies: StudyData[] }` | the studies the tree filed that the user does not own |
| `lichessTools/LT/studyDb-history` | `StudyData[]` each carrying `visit` | pruned to `historyLimit` newest visits |
| `lichessTools/LT/studyDb-bookmarks` | `{ entries: BookmarkEntry[] }` | browser-local bookmark tree |
| `lichessTools/LT/studyDb-windows` | `StoredTab[]` | the window tabs to restore |
| `lichessTools/LT/studyDb-syncMeta` | `{ revision, lastHarvestAt, manifest, historyLimit }` | local revision counter |

One **blob per store** rather than one IndexedDB record per study: `IndexedDbStorage` exposes no bulk read
(`getAll`/`cursor`) to callers, so a page cannot enumerate records. `storeMemberAll` writes a batch in one blob
write, and unawaited updates coalesce onto the serial write chain that keeps two tabs from interleaving a
half-written store.

A captured study that carries no `role` (one you only opened) never joins the member blob - `integrateUpdates`
deletes it there and upserts it into `studyDb-captures` only when the tree names it. The tree names its studies
through `BookmarkTabContent.treeStudyIds()`, handed to `SyncCtrl.setTreeIds` on every load and save, and that
call prunes the capture blob to exactly those ids - a leaf that leaves the tree loses its capture with it. So
the member blob keeps its meaning (the user's own list), a study the tree filed answers its tooltip, chips and
search on every page, and a leaf the mirror never saw is uncaptured rather than gone; the proof that a read
found nothing lives on the leaf as `meta.deadAt`.

### Harvest (`RecordsHarvester`)
- `groups()` → the five personal list groups of `StudyBits.scala`: `mine`, `member`, `public`, `private`, `likes`,
  walked in `?page=N` order at `updated` until a page yields no `div.study.paginated` card.
- `parseListPage(html)` reads `div.studies` cards: `a.overlay[href]` for the id, `h2.study-name`, the class-less meta
  `span` ("likes • owner • time" with an empty `<time class="timeago" datetime>`), `icon.icon-flair`,
  `ol.chapters > li.text` (**names only**, no ids) and `ol.members > li.text`. Rows carry
  `partialCoverage {chapters: true, tags: true}`.
- `captureFromLivePage()` / `harvestOne` read the `page-init-data` blob (`{study, data, tagTypes, …}`);
  `harvestOne` fetches with `ignoreStatuses:[404]`, so a deleted study answers a null body and becomes the
  marker `{ studyId, absent: true }` - `SyncCtrl.store` refuses it and the tree keeps the proof on the leaf.
  The per-chapter deep pass (`harvestChapterTags`, one request per chapter) was never asked for by the tree view
  and was deleted 2026-11-03, so only the displayed chapter ever gets tags.
- `updatedAt` is materialised at capture time as `now - secondsSinceUpdate * 1000`; list cards only give
  `createdAt`, which is used as the conservative lower bound.

## Cleanup on disable

Preference off → `start()` returns before anything is captured; nothing clears the blobs - `clearEverything()` had
no caller and was deleted 2026-11-03, so a disabled tool leaves its blobs alone and the next visit re-harvests from
whatever they already hold.
