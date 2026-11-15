# Harness notes - recordsDbUi window tree (scratch doc, untracked)

Rebuilt this pass: the file is scratch (not in git); if a fuller local copy exists, diff it back.

## Harness files

- `test/recordsDbUiWindow.check.js` - the window itself: fresh `lt` per section, mock DOM +
  cash + events + geometry; evals `tools/recordsDbStore/tool.js` and the Ui tool source.
- `test/recordsDbHarvest.check.js` - harvest pass against the mock store surface.
- `test/recordsDbStore.check.js` - store blob/kind/containment rules.
- Run: `node test/<file>.check.js` (from repo root) - exits non-zero on any FAIL.
- Harness runs green ≠ feature done: live-only wiring can still fail; a live-only path can only
  be confirmed in the browser.

## Harness mechanics (traps)

- Tool code is eval'd into the vm; `init` is deferred - call it explicitly per fixture.
- Class-body methods see siblings only through `this.`; IIFE-scope names (clearDrop, dragDbg)
  work bare. A bare call to a class method throws ReferenceError (harness catches crash; live
  = swallowed async error).
- Event fixtures: `fireEvent` + `await drain()`; never assert inside the same tick as the dispatch.
- Mock geometry: every painted row shares one rect box - per-row hit-test only meaningful live.

## Drag from page (verified live + harness)

- The source is any element `pageLeaf` can name (kind/id from shape table): study `/study/<id>`,
  game `/game/<id>` or bare 8-char id, puzzle `/training/<id>`, player `/'Name'`, chapter
  `data-id` button with an `h3`.
- Press outside the tree arms a pending carry; travel counted from mousemove or dragover; commit
  on `mouseup` (mouse) or the promoted ride's `dragend` (Chrome swallows mousemoves). Thin rides
  (one event) commit when Chrome promoted the press.
- Landing: the pointer row decides the PARENT - bottom half of a row nests inside it, top half is
  the sibling-before; siblings always re-sort (tree is alphabetical by design - `sortTree`).
- A held leaf re-dropped from the page MOVEs when the release is over a row; a bare re-drop
  (no row under the release - e.g. the browser's own `drop` event) keeps it in place.
- Element reads go through `this.domAttr` (raw `getAttribute` first - cash's `prop` answers
  empty for event-wrapped page elements live).

## Puzzle kind (this pass)

- Page shape `/training/<id>` files the leaf (label keeps the page's own text, e.g. `#156iA`).
- `drop()` hook calls `requestPuzzleRead` (once per id): awaits `lt.api.puzzle.getPuzzle(id)` and
  merges `meta.fen` (the api's fen is standard 8-rank FEN already), `meta.lastMove`,
  `meta.orientation` (side to move). Async: a hover before the read is text-only; merge repaints.
- Hover board from `meta.fen` via `boardStateFor` (position/studyPosition/puzzle); data-state
  "fen,orientation,lastMoveUci" like lila's miniBoard contract.
- Icon: registry `puzzle.icon = 'ArcheryTarget'` (puzzleIndex's own mark); open jump resolves
  `/training/<id>` through the registry `openUrl`.

## Add flow (verified harness)

- Add is gesture-only (never fires on page open); dropdown cycles kinds the page can name;
  `enrichFromPage` merges meta (ratings joined, flair/flag paths, study chapters) without
  renaming unless the page has a true name; `pageAddKinds`/`cycleAddChoice` walk the cycle.

## Hover / chips / counts (verified harness)

- Chips answer page state, never "unknown"; a kind with no answer keeps the chip dim and the
  header note absent. `data-href` claim in older notes is aspirational - the row answers via
  rowTarget/openUrl at click time, no href attribute on the jump button.

## Known gaps / open

- `[rdb-drag]` console.debug scaffolding (ENTERED/HIT/MISS/COMMIT/MOVE/ARMED + scratch helpers)
  still in the Ui tool - strip once live drag is confirmed settled.
- Live test pending: puzzle file/hover/click end-to-end in the browser.
