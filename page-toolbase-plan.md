# Page tools migration — plan + progress log

Goal: give LiChess Tools features a **real page** (a path Lichess serves as a 404 that the
extension takes over) instead of hijacking an unrelated page through the URL hash
(`preferences`) or a full-screen `<dialog>` (`pgnEditor`, `calculationTrainer`).
`lichessLadders` already does this at `/page/lichessLadders`; its behaviour becomes the
generic base class `PageToolBase`.

Status legend: `[ ]` pending · `[x]` done and verified · `[!]` blocked / known risk

---

## 0. Decisions taken (read these before continuing)

| Feature | Old location | New page | Notes |
|---|---|---|---|
| lichessLadders | `/page/lichessLadders` (already a page) | same, unchanged | becomes the model implementation |
| preferences | `/team/all#lichessTools`, `/account/preferences/display#lichessTools/<pref>#<filter>` | `/page/ltPreferences#<pref>#<filter>` | legacy URLs must **redirect**, not render in place |
| pgnEditor | `/analysis#pgnEditor` + full-screen dialog | `/page/pgnEditor` | dialog removed; PGN handed over through `localStorage` |
| calculationTrainer | topnav button opening a resizable dialog | `/page/calculationTrainer#<fen>` | dialog removed; starting FEN travels in the URL hash |

Other decisions:

- Page URLs use the `#hash` for tool state: preferences `#<pref>#<filter>`,
  calculationTrainer `#<fen>`. PGN text is too big for a URL, so the analysis → editor
  hand-off uses `lt.storage.set('LiChessTools.pgnEditor.pendingPgn', ...)`.
- Every page container keeps the existing `lichessTools-<name>` class, so most JS/CSS
  selectors only change their **element prefix** (`dialog.x` → `main.x`).
- Each page keeps the `html[data-page-href*="<pageUrl>"] main:not(.lichessTools-<name>) { display: none; }`
  CSS rule that `lichessLadders/tool.css` already uses.
- No new files ⇒ `manifest.json*` untouched.
- No new translation keys ⇒ `data/crowdin.json` untouched.
- Verification style: headless node check scripts under `test/` (gitignored, excluded by
  `build.bat`), following `test/installWelcome.check.js`; plus `node --check` for syntax.

---
## 1. `PageToolBase` API (in `scripts/lichessTools-toolBase.js`)

`PageToolBase extends LiChessTools.Tools.ToolBase`; page tools inherit from it instead of `ToolBase`.

| member | purpose |
|---|---|
| `pageUrl` | canonical page path, e.g. `'/page/lichessLadders'` |
| `pageClass` | the class put on the page container (`lichessTools-<pageClass>`) — the tool key, deliberately independent of the url |
| `pageAliases` | legacy locations: `[{ url, test?: regex over the hash, convert?: hash → hash }]` |
| `pageCss` | Lichess stylesheets the page needs, loaded through `lt.loadCss(key)` |
| `pageContainer` | selector of the element the tool owns; default `'#main-wrap main'` |
| `isPage(url?)` | exact path match against `lt.location.pathname` — tool pages have no subpaths, so no matcher is needed |
| `gotoPage(hash)` | navigate to the canonical page |
| `redirectPageAliases()` | navigate from a legacy URL; `true` means "the page was left, stop working" |
| `loadPageCss()` | loads all `pageCss` keys at once through `Promise.all` |
| `preparePage(spinner)` | alias redirect → `isPage()` check → `loadPageCss()` → empty + tag container (+ spinner, kept as `pageSpinner`). Returns `null` when the tool does not own the page |
| `initPageEvents(container)` | end of a page render: wires the Lichess page events and takes the spinner `preparePage` left away |

Supporting change: `scripts/lichessTools-location.js` exposes `pathname` next to `href`/`hash` and
loses the one-off `isLichessLaddersSummary()` — a tool page is an exact path match, so no matcher is needed.

---

## 2. Steps

### Step 1 — infrastructure `[x]`

- [x] `scripts/lichessTools-location.js`: added `get pathname()` next to the other getters, dropped `isLichessLaddersSummary()`.
- [x] `scripts/lichessTools-toolBase.js`: added `PageToolBase` (extends the local `ToolBase`, exported as
  `LiChessTools.Tools.PageToolBase`).
- Verify: `node --check` clean; `test/pageToolBase.check.js` → 24/24 (container tagged + emptied + spinner,
  alias redirect keeps/converts the hash, foreign page loads nothing).

### Step 2 — lichessLadders inherits the base `[x]`

- [x] `tools/lichessLadders/tool.js`: extends `PageToolBase`; `pageUrl = '/page/lichessLadders'`;
  `processPage()` starts with `const main = await this.preparePage(); if (!main) return;` (was
  `isLichessLaddersSummary()` + `$('#main-wrap main').empty().attr('class',...).append(spinner)`).
- Verify: `node --check` clean; `test/lichessLaddersPage.check.js` → 12/12.

### Step 3 — preferences becomes `/page/ltPreferences` `[x]`

- [x] `tools/preferences/tool.js`: extends `PageToolBase`; `pageUrl = '/page/ltPreferences'`, `pageClass = 'preferences'`, `pageCss = ['user.account']`,
  `pageAliases` (`/team/all`, `/account/preferences/display`) with `legacyHash` → `hashFromLegacy`
  (`#lichessTools/<pref>#<filter>` → `#<pref>#<filter>`); `start()` now does
  `redirectPageAliases()` → `isPage()` → `preparePage(false)` → `openPreferences()` → `applyHash`
  (`pageHash` parses `#<pref>#<filter>`); `openPreferences` renders into a fresh
  `div.lichessTools-preferences` appended to the page `main` (was `div.page-menu__content`);
  `addInfo` selector → `main.lichessTools-preferences`; dasher link → `/page/ltPreferences`.
- [x] `tools/preferences/tool.css`: added `html[data-page-href*="/page/ltPreferences"] main:not(.lichessTools-preferences)`.
- [x] `popup.html` link → `https://lichess.org/page/ltPreferences`; `tools/forkBehavior/tool.js` info icon → `/page/ltPreferences#forkBehavior`.
- Verify: `node --check` clean; `test/preferencesPage.check.js` → 37/37 (alias redirects, hash
  conversion, container tagging, css order, no legacy links left).

### Step 4 — pgnEditor becomes `/page/pgnEditor` `[x]`

- [x] `tools/pgnEditor/tool.js`: extends `PageToolBase`; `pageUrl = '/page/pgnEditor'`;
  `pageAliases = [{ test: /^#pgnEditor$/, convert: () => '' }]` (no url: the editor used to
  hijack the hash of *any* page, and the page itself carries no hash); `showPgnEditor()`
  renders `page.append(...)` into `page.find('[data-role=...]')`, `Dialog` dependency dropped,
  no `showModal`/close button/`history.pushState`; the editor title is restored by leaving the
  page instead of by a `close` handler; `$('...', page)` contexts replace `$('...', dialog)`.
- [x] Analysis "send to PGN editor" link: `attr('href', this.pageUrl)` +
  `lt.storage.set('LichessTools.pgnEditor.pendingPgn', pgn)` + `gotoPage('')`; `showPgnEditor()`
  reads and clears it. The topnav link keeps its default navigation (no `preventDefault`).
- [x] `hashchange` only redirects the legacy `#pgnEditor` (and never on the page itself).
- [x] `tools/pgnEditor/tool.css`: `dialog.x` → `main.x` everywhere; the `.dialog-content` rule
  retargeted to `div.input-wrapper`; `div.dialog-header>h2` → `h2`; hide-other-main rule added.
- Verify: `node --check` + `test/pageToolFlow.check.js` + `test/migrationFinal.check.js` — clean
  (no `lt.dialog(`, no `showModal`, no `dialog.lichessTools-pgnEditor` selector, no
  `/analysis#pgnEditor`).

### Step 5 — calculationTrainer becomes `/page/calculationTrainer` `[x]`

- [x] `tools/calculationTrainer/tool.js`: extends `PageToolBase`; no `pageAliases` (the trainer
  never had a hash of its own); `showTrainer()` renders an `<h2>` + help link +
  `div.trainer-content` and calls `trainPosition(container, fen, uci)`; the position comes from
  `lt.storage.get('LiChessTools.calculationTrainer.pendingPosition')` (set by the learn-menu
  link, which then does `gotoPage('')`) or from a FEN typed after `#` in the address;
  `Dialog` dependency dropped; `updatePlacement`, `ensureInViewport` and the
  `lichessTools.setDialogPlacement` listeners removed.
- [x] `this.options.board = false` on the page: the board option pointed at the analysis chessground,
  which a page does not have.
- [x] `tools/calculationTrainer/tool.css`: both `::backdrop` rules deleted, hide-other-main rule and
  a `main.x` sizing rule added, `.dialog-content` → `.trainer-content`, `dialog.x` → `main.x`.
- Verify: `node --check` + the two check scripts — no `dialog` left in js or css.

### Step 6 — docs + final sweep `[ ]`

- [ ] update `tools/<tool>/context.md`, root `context.md`, `HISTORY.md`.
- [ ] final grep sweep: no `isLichessLaddersSummary`, no `#lichessTools` link outside the
  alias table, no `/analysis#pgnEditor`.
- [ ] run every check script; confirm all four manifests still parse and list only files
  that exist.

---

## 3. Known risks / things to test in the browser

- The `/page/...` 404 shell is assumed to contain `#main-wrap main` (it does for
  lichessLadders today). If it ever does not, `preparePage()` bails and the page stays as Lichess
  served it.
- `redirectPageAliases()` navigates; the caller must stop immediately (it returns `true`).
- The editor's "evaluate" button needs the analysis engine; on the page there is none, so
  `showPgnEditor()` removes the button when `lichess.analysis` is missing (the engine-backed
  evaluation still happens on the analysis page itself).
- calculationTrainer's `board` option is forced off on the page (it pointed at the analysis
  chessground); `arrows` stays as it was and is a no-op there.
- `pageCss` for preferences (`user.account`) is loaded by the base before rendering; the
  preferences CSS must keep working without `body.lichessTools` (global-off switch).
- `page-menu__content` does not exist on a `/page/...` shell, so preferences can no longer rely
  on it; it renders into `div.lichessTools-preferences` under the page `main` instead.
- The spinner `preparePage()` leaves in the container is only taken away by the tool's
  `initPageEvents(container)` call at the end of the render — a render that returns early
  without that call leaves a stuck spinner behind. The three pages that use a spinner
  (lichessLadders, pgnEditor, calculationTrainer) each end their render with it; preferences
  asks `preparePage(false)` for no spinner at all.

## 4. Manual QA checklist

- [ ] `/page/ltPreferences` renders the whole options table, filter works, `#<pref>` scrolls to the section.
- [ ] `/team/all#lichessTools` and `/account/preferences/display#lichessTools/<pref>` redirect there.
- [ ] dasher-app "LiChess Tools" link and the popup link go to `/page/ltPreferences`.
- [ ] `/page/pgnEditor` textarea + buttons work; paste/upload/undo/redo/cancel work; the evaluate
      button is absent there.
- [ ] Analysis "send to PGN editor" button puts the exported PGN into the page textarea.
- [ ] `/page/calculationTrainer` trains from the learn-menu hand-off; a FEN after `#` also works;
      with neither it shows the guidance line.
- [ ] `/page/lichessLadders` unchanged (menu, summary page, notifications).
- [ ] No spinner left on the page once its content is in (`/page/pgnEditor`, `/page/calculationTrainer`,
      `/page/lichessLadders`) — `initPageEvents()` at the end of each render takes it away.

## 5. Progress log

- (init) Plan written. Nothing changed in the code yet.
- Steps 1-3 done: `PageToolBase` in `scripts/lichessTools-toolBase.js`, `isPageUrl` in
  `scripts/lichessTools-location.js`, lichessLadders refactored, preferences moved to
  `/page/ltPreferences`. Validated by `test/pageToolBase.check.js` (24), `test/lichessLaddersPage.check.js` (12),
  `test/preferencesPage.check.js` (37).
- Step 4 done: pgnEditor on `/page/pgnEditor` — legacy `#pgnEditor` hash alias, page render with
  `div.input-wrapper`, PGN hand-off through `LichessTools.pgnEditor.pendingPgn`, css rewritten.
- Step 5 done: calculationTrainer on `/page/calculationTrainer` — learn-menu hand-off through
  `LiChessTools.calculationTrainer.pendingPosition` plus a FEN-in-hash fallback, `trainer-content`
  div, board option forced off, backdrop css dropped.
- Validation now: `test/pageToolFlow.check.js` (23) + `test/migrationFinal.check.js` (42) cover the
  new tools; the three earlier scripts still pass. Nothing was loaded in a browser — the page mode
  still needs the manual QA pass in step 4 above.
- Refinement: `PageToolBase` carries a `pageClass` member (the tool key) instead of deriving the
  class from the page url tail, `isPage(url?)` compares `lt.location.pathname` directly (the
  `isPageUrl()` helper in location is gone, `pathname` is now a location getter), and
  `loadPageCss()` loads the sheets with `Promise.all`. The preferences page url was renamed to
  `/page/ltPreferences` while its class stays `preferences`, which shows the two are independent.
  Check counts: `pageToolBase` (29), `lichessLaddersPage` (12), `preferencesPage` (40),
  `pageToolFlow` (23), `migrationFinal` (49) — 153 checks, none failing.
- Bug found in the browser: the pgnEditor page kept showing the `preparePage` spinner forever.
  `PageToolBase` now keeps the spinner as `pageSpinner` and `initPageEvents(container)` — the
  end-of-render call every spinner page already makes — removes it; `lichessLadders` also
  switched from its raw `lt.uiApi.initializeDom(main[0])` to `this.initPageEvents(main)`. The
  trainer had the same leak. Counts now: 32 / 12 / 40 / 23 / 54 = 161 checks, none failing.

