# GameListOptions Tool — Context Summary

## Purpose

The **GameListOptionsTool** adds filters, selection checkboxes, analysis links, color-by-players styling, extra info buttons, copy/download/delete buttons to lichess game list pages (imported games, bookmarks, search results). It enhances the `div.search__result` container with multiple toggle options.

## Dependencies

- **EmitRedraw**, **EmitContentLoaded**

## Preferences

- **name**: `gameListOptions`
- **category**: `general`
- **type**: multiple (checkboxes)
- **possibleValues**: [`aborted`, `analysis`, `titledOpponents`, `select`, `analysisLink`, `color`, `extraInfo`, `remove`, `textFilter`, `showScore`]
- **defaultValue**: `select,analysis,analysisLink,color,aborted,extraInfo,remove`
- **advanced**: true

### Options:

- **aborted**: filter/show aborted games — checkbox + container class toggle `lichessTools-gameListOptions-hideAborted` (storage persists)
- **analysis**: two checkboxes for "Only analysed" / "Only not analysed" — container class toggles `lichessTools-gameListOptions-analysis`/`noAnalysis` (storage persists)
- **titledOpponents**: filter titled opponents — checkbox + container class toggle `lichessTools-gameListOptions-titledOpponents` (storage persists)
- **select**: selection checkboxes on each article.game-row — triggers refreshActions when checked
- **analysisLink**: analysis direct links — container class toggle, overlay href modified to /gameId8/+black/white suffix, contextmenu opens original href in _blank, data-orig-href stored
- **color**: color by players — container class toggle `lichessTools-gameListOptions-color` (storage persists), each article gets CSS variable `--playersColor = #crc24(players.join('|)).toString(16).padStart(6,'0)+'20`
- **extraInfo**: more info button — fetches pgns with accuracy via API batch (300 per batch, 2000ms timeout between batches), displays accuracy/acpl/inaccuracy/mistake/blunder counts on metadata span
- **remove**: delete games/remove bookmarks buttons — on imported page (/@/user/imported) or bookmarks page (/@/user/bookmark): dialog confirm question → API deleteImported/removeBookmark per item, removes article element, reloads page after 100ms timeout between deletions
- **textFilter**: text filter input — placeholder "filter words", change event sets min-height calc(100vh - offset.top + scrollY), splits regex `"quoted" | unquoted` → each article toggled `lichessTools-textFiltered` if text doesn't include split
- **showScore**: show game results — on games/search players.a=userId or /@/user/search: span after search__status strong. If games<50: auto computeScore; else: click button to computeScore. Computes wins/draws/losses across pages (max 18 pages, 2000ms timeout between, 429 status → 20000ms timeout)

## How It Works

### Filters Creation (`processListsDirect`)
Creates `div.lichessTools-gameListOptions` before gamesContainer in search__result container. Each option creates checkbox/input with label text + change event handler + storage persist + class toggle on container + body scroll trigger. Triggers initial change/input events.

### Selection & RefreshActions (`refreshActions`)
When checkboxes checked: adds buttons to filters area:
- **copy**: Clipboard icon, title "Download selected games as PGN" — fetches IDs from checked inputs → next a href substr(1,8) → batch 300 per batch with timeout 2000ms + '\r\n' separator → API getPgns(moves/tags/clocks/evals/opening/accuracy/literate=true) → writeToClipboard + download lichessTools_+toTimeString().pgn
- **csv**: Document icon, title "Download selected games as CSV" — same ID extraction → batch fetch with pgnInJson/division/ndjson=true → getCsv conversion → writeToClipboard + download .csv
- **delete**: Trash icon — on imported page: dialog confirm "Are you sure you want to delete %s games?" → API deleteImported per item, removes article, reloads; on bookmarks page: dialog confirm "Are you sure you want to remove %s bookmarks?" → API removeBookmark per item, removes article, reloads

### ExtraInfo Button
Container has article .metadata:not(.lichessTools-extraInfo): button BarChart icon — fetches IDs from game-row__overlay href substr(1,8) → batch 300 with timeout 2000ms between → API getPgns(ndjson=true,accuracy=true,moves=false,tags=false,clocks=false,evals=false,opening=false,literate=false) → info Map per gameId → each article metadata span gets lichessTools-extraInfo class + title (Accuracy: accText / ACPL: acplText / Inaccuracies/mistakes/blunders White:whiteMoves/Black:blackMoves) + text accText

### CSV Conversion (`getCsv`)
Header row with 23 columns: id,rated,variant,speed,perf,createdAt,lastMoveAt,status,white/black names/ratings/diffs/winner,eco/opening,clock initial/increment/totalTime,middle/end,pgn/moves,clocks. dateString format UTCFullYear-UTCMonth+1padStart(2,'0)-UTCDate padStart(2,'0) UTCHours:UTCMinutes:UTCSeconds. csvString quotes with "" replacement for containing ",\r\n characters.

### RightClickGame
Contextmenu on article.game-row overlay: prevents default, opens data-orig-href in _blank via lt.global.open.

### ComputeScore (`computeScore`)
InShowScore flag prevents re-entry. URL page=1 → fetch net.json → paginator nbPages capped at 18 → w/d/l counters per rated game (white winner if isWhite→w else→l; black winner if isWhite→l else→w; draw→d). Text searchScoreText wins|draws|losses, title pluralSame scores. Page iteration with nextPage URL param, timeout 2000ms between, 429 status → 20000ms finally removes computing class.

### Player Color Calculation
playerElems from versus div.player span:first-child/a.user-link → text trim → sort → crc24(players.join('|)) → CSS variable --playersColor.

### TitledOpponent Detection
playerElems clone → find .utitle:not([data-bot]) → isTitledPlayer = length > 0 → titleEl removed → isUserId check (userId match) → !isUserId && isTitledPlayer → article toggled lichessTools-hasTitledOpponent.

### AnalysisLink Modification
Container class analysisLink: overlay href modified to /gameId8/+black/white suffix, contextmenu bound rightClickGame, data-orig-href stored. Not analysisLink: removes href modification, off contextmenu, removeAttr data-orig-href.

### Text Filter Splitting
Regex `"quoted" | unquoted` matchAll → groups.quoted or groups.unquoted → filter non-empty → each article text lowercase includes any split → toggled lichessTools-textFiltered if !includes.

### Initialization (`start()`)
Reads preference value via `lt.isOptionSet`. Options object with individual flags + isSet getter (aborted||color||select||analysis||analysisLink||titledOpponents||extraInfo||remove||textFilter). Removes existing lt elements from search__result, select class/checkboxes, hideAborted/color/analysis/analysisLink classes. Unbinds pubsub redraw/contentLoaded. If !options.isSet: returns. Otherwise: binds pubsub events + calls processLists.