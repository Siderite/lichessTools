# GameAnalysisLayout Tool — Context Summary

## Purpose

The **GameAnalysisLayoutTool** modifies the layout of game analysis mode (when a game is being analyzed with game meta visible) to "fit page" — adds a cross-table toggle button, a review chat tab, a layout toggle button, and tracks player positions for crosstable placement CSS variables.

## Preferences

- **name**: `gameAnalysisLayout`
- **category**: `analysis`
- **type**: multiple (checkboxes)
- **possibleValues**: [`fitPage`]
- **defaultValue**: `false`
- **advanced**: true

When `fitPage` is set, applies the layout modifications. When false, removes everything.

## How It Works

### Game Detection (`isGame`)
Checks if `.analyse__side .game__meta` exists — indicates game analysis mode (not study/explorer).

### Player Position Tracking (`handleGamePlayers`)
Uses `ElementPositionTracker` on `.analyse__side .game__meta__players[0]`. Callback receives position {x,y,width,height}. Sets body CSS variables: `--crosstable-x = pos.x+pos.width-mainOffset.left px`, `--crosstable-y = pos.y+pos.height/2-mainOffset.top px`. Toggles `.analyse__underboard .ctable` class `lichessTools-reverse` if white player href != crosstable first user href.

### ElementPositionTracker Class
Tracks DOM element position via multiple observers:
- **constructor**: takes element + callback, initializes lastKnown {x:-1,y:-1}
- **getPosition**: getBoundingClientRect + window.scrollX/scrollY → page coordinates + width/height
- **update**: compares JSON stringify of lastKnown vs new pos — if different, updates lastKnown + calls callback
- **scheduleUpdate**: uses requestAnimationFrame to batch updates (avoid layout thrashing)
- **start**: immediate update + ResizeObserver on element + MutationObserver on document.body (childList/subtree/attributes/characterData with attributeFilter ['style','class','width','height']) + window scroll event (passive) + window resize event (passive)
- **stop**: cancelAnimationFrame, disconnect observers, remove window listeners

### Cross Table Toggle (`toggleCrossTable`)
Prevents default on click. Toggles `.analyse__underboard .ctable` class `lichessTools-show`.

### Clear Cross Table (`clearCrossTable`)
Removes `lichessTools-show` class from ctable. Listens to body pointerup (capture=true).

### Review Tab (`setReviewTab`)
Calls `lichess.analysis.chatCtrl.setTab({key:'review'})` + redraw. Triggered by computer-analysis form submit event.

### Layout Application (`applyLayout`)
Checks chatCtrl exists. Unbinds existing handlers (toggleCrossTable click, clearCrossTable pointerup, setReviewTab submit). If fitPage:
1. Adds review tab to `chat.allTabs` if not present → redraw → `.mchat__tab.review` gets title "LiChess Tools - game review" + text "Review"
2. Triggers buttons for move-times and computer-analysis panels
3. Creates ElementPositionTracker on game__meta__players element
4. Binds ctable current/current a click to toggleCrossTable, body pointerup to clearCrossTable (capture), computer-analysis form submit to setReviewTab
5. Replaces `.analyse__puzzle br` with `<span>&nbsp;</span><br>`
6. Adds `a.lichessTools-gameAnalysisLayout-toggle` button in `main.analyse`: text "Toggle layout", title "LiChess Tools - toggle game analysis layout" — click toggles body class `lichessTools-gameAnalysisLayout`, sets toggleLayout flag, toggles button class
Else (not fitPage): removes toggle button, stops tracker, removes review tab from chat.allTabs + redraw.

### Initialization (`start()`)
Reads preference value via `lt.isOptionSet`. Options = {fitPage}. Checks analysis exists + isGame(). Toggles body class if fitPage && !toggleLayout. Calls applyLayout.