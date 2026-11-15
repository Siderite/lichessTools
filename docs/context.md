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
  game `/game/<id>` (optional `/white|/black` tail, `#hash` stripped), puzzle `/training/<id>`,
  player `/'Name'`, chapter `data-id` button with an `h3`, forum `/forum/<board>`, forum post
  `/forum/<board>/<thread>` (`#<comment>` optional), blog `/'<user>/blog'`, blog post
  `/'<user>/blog/<slug>/<id8>'` (the 8-char post id is not optional).
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
  `meta.orientation` stored straight as the side to move - the puzzle board is shown from the
  side that moves, so the solver sits closest. Async: a hover before the read is text-only;
  the merge repaints.
- Hover board from `meta.fen` via `boardStateFor` (position/studyPosition/puzzle); data-state
  "fen,orientation,lastMoveUci" like lila's miniBoard contract.
- Study positions import the board side from the chapter's own `setup.orientation` when it has
  one; the view the import happened to watch is only a fallback, so importing from a flipped
  board never flips the leaf's hover board.
- Icon: registry `puzzle.icon = 'ArcheryTarget'` (puzzleIndex's own mark); open jump resolves
  `/training/<id>` through the registry `openUrl`.

## Forum / blog kinds (this pass)

- Registry gains a `forum` kind (SpeechBubble, openUrl `/forum/<slug>`); `forumPost` gains
  `containment: 'forum'` + `branch: 'forum'` (rides the board's blob, like blogPost on blog).
  `collectionKindOrder` inserts `forum` before `forumPost` - eleven kinds, still seven blobs.
- Blog leaves from drags now carry `meta.url` (the dragged href); blog/blogPost `openUrl`
  prefers it, falling back to the constructed path. Blog leaf id = the user name.
- New intl keys both tables: `kindForum`, `recordsDbCountForum`.
- Harness needles widened with the registry: eleven kinds, blob keys `...blog,forum,player`.

## Add flow (verified harness)

- Add is gesture-only (never fires on page open); dropdown cycles kinds the page can name;
  `enrichFromPage` merges meta (ratings joined, flair/flag paths, study chapters) without
  renaming unless the page has a true name; `pageAddKinds`/`cycleAddChoice` walk the cycle.

## Hover / chips / counts (verified harness)

- Select mode: every row grows a native checkbox; each `change` feeds `select` additively
  (ctrl-click semantics), so boxes accumulate a multi-row set and toggling one never erases
  the others - the fix this pass (a bare `select(entry)` replaced the set every time).
- Chapter count badge (`record-chapter-count`) rides study rows only: chapter records carry
  their study's chapters for the tooltip, so the badge guards `entry.kind != 'chapter'`.
- Game row icons answer from data, not the registry: `gameIconName` (module scope, shared by
  class and paint) maps variant classes first (chess960→DieSix, kingofthehill→FlagKingHill,
  threecheck→ThreeCheckStack, antichess→Antichess, atomic→Atom, horde→Keypad, racingkings→
  FlagRacingKings, crazyhouse→Crazyhouse), then speeds (ultrabullet/bullet/blitz/rapid/classical/
  correspondence → UltraBullet/Bullet/FlameBlitz/Rabbit/Turtle/PaperAirplane) - the exact map the
  recent-games css dresses - and Crown for unknown. The game read parks `meta.speed/variant`;
  registry `game.icon` became 'Crown' (bare ChessPiece had no mark).
- Naming policy: drag never adopts link text as the name outright. Slug/handle kinds name
  themselves from the url at file time (`humaniseSlug`; blog = the handle). study/game/puzzle
  keep the text only as `meta.nameTemp = 'page'`: `leafLabel` lets the mirror record name
  outrank it, and the reads (`requestPuzzleRead` → `puzzleName` from themes, `requestGameName`
  → 'white vs black' via `lt.api.game.getGame`) overwrite `label` and delete the marker.
  `openLeaf` awaits either read whenever the row's own data is missing (waiting name, puzzle
  without fen, game without speed/variant), so a failed read stays uncaptured and the next
  open asks again. A hand rename deletes the marker too: the chosen title is never talked
  over, and a later read only grows the row's board data.
- Page shapes come from `pageInitData` too, where the url misses them (the content reads it
  through `pageInitBlob`, which falls back to the `page-init-data` script still in the DOM when
  the page has not dropped it yet - no request either way): the replay page (`mode: 'replay'`,
  game named in `cfg.data` - players title, speed/variant icon), the plain game page (no mode,
  the same fields under `data`), and the training page (`data.puzzle` themes name the row, no
  api wait). `resolvePageLeaves` keeps one leaf per kind/id with the page-data leaf winning over
  the url-shaped one, and its rename clears the waiting marker (`dataName` flag on the shaped leaf).
- Game keys are the 8-char game id alone. A game url carries `/game/<8>`, `/game/<8>/<side>`, a
  bare `<8>` or the 12-char full id whose tail names the player whose page it is; `gameKeyId`
  cuts that tail, so every spelling - drag, page visit, open jump - reaches the same leaf.
- A page drop that carries a leaf the tree already holds (`externalDrop` hands `nodes`, not
  `paths`) puts it down twice - the path branch lifts it out of its old slot first, the node
  branch did not, so re-filing a link of a filed game grew a second row. `drop` now applies the
  same two rules to both payloads: lift the leaf out, and spend nothing when the target is the
  slot it already occupies.

- Chips answer page state, never "unknown"; a kind with no answer keeps the chip dim and the
  header note absent. `data-href` claim in older notes is aspirational - the row answers via
  rowTarget/openUrl at click time, no href attribute on the jump button.

## Known gaps / open

- The `[rdb-drag]` console scaffolding and the `dragDbg` scratch helper are gone from the Ui
  tool; live drag is now read only through the handlers.
- Toggle and window share one page gate now: `canPlace` (user + route) and `canOpen` answers
  through it, so a press on a game, a replay or a training page lifts the frame - it hangs off
  the viewport through the dialog factory, and `initialGeometry` answers a page that lost its
  panels with an honest box. `start()` still opens the window only on a trip or a return, so an
  arrival installs the button and keeps the window short until the thumb presses. A page that
  keeps its window short reads itself anyway: `enrichFromPage` dresses any filed leaf from
  `pageInitData`, so opening a game names its row for the next tree load even unpressed.
- `lt.api.game` answers with `getPgns` only - there is no `getGame` in the api definitions - so
  the drag read `requestGameName` is inert live and stays a harness-only path: a dragged game
  link waits on its link text, and the page visit is what names it. Wiring the read to the PGN
  headers (`White`/`Black`/`Speed`/`Variant`) would name it without the visit.
- Live test pending: puzzle file/hover/click end-to-end in the browser.
