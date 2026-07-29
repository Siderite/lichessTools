# Resize Explorer Tool

## Purpose

Adds a draggable divider between chessground/move list and explorer box in the analysis tools area, allowing user to resize the explorer height. Saves height preference per mobile/desktop orientation. Also disables double-click on move list for mobile.

## Functionality

- Depends on `EmitChapterChange` and `EmitRedraw`.
- Requires logged-in user (`needsLogin: true`). Advanced preference (`advanced: true`). Default enabled (`defaultValue: true`).
- **refreshHeight()**: Sets explorerBox (main.analyse analyse__tools explorer-box) CSS minHeight/maxHeight to stored height value (mobile or desktop depending on isMobile). Removes 'reduced' class. Uses requestAnimationFrame.
- **dragover(ev)**: If dataTransfer getData('dnd/lichessTools-resizeExplorer') == 'dragging' → calls dragDivider.
- **dragDivider(ev)**: Calculates new height from drag event pageY:
  - Mobile: ev.pageY - explorerBox offset top
  - Desktop: tools offset top + tools height - ev.pageY
  - Bounds check: h <= 0 or h > th - hh (ceval+pv_box heights) → returns
  - Updates height {mobile, desktop} based on isMobile, saves to storage key `LichessTools.resizeExplorer`, refreshHeight()

- **addDividerDirect()**: Adds draggable divider in analyse__tools area:
  - Mobile: fixDblClickOnMoveList() (disables double-click on `.analyse__moves` via capture listener)
  - If explorerBox exists → binds toolsElem dragover handler, creates `<div class="lichessTools-resizeExplorer"` with inner div, draggable=true, drag/dragstart/dragend handlers:
    - dragstart: sets dataTransfer 'dnd/lichessTools-resizeExplorer'='dragging', adds dragging class, body on dragenter/dragover controlCursor
    - dragend: removes dragging class, body off dragenter/dragover
    - insertBefore explorerBox; mobile: CSS order = explorerBox order + 1
  - refreshHeight()

- **addDivider()**: Debounced version of addDividerDirect (300ms debounce).
- **controlCursor(ev)**: Prevents default, sets dataTransfer dropEffect='move', returns false.
- **fixDblClickOnMoveList()**: Adds capture dblclick listener on `.analyse__moves` element that prevents default and stops immediate propagation; marks _dblClickDisabled=true.

## Function Wrapping

- Unwraps `analysis.explorer.setNode` on disable.
- On enable: wraps `analysis.explorer.setNode` (after function → calls addDivider).

## Mobile Handling

- If not isMobile but lt.isMobile() → sets isMobile=true, fixDblClickOnMoveList(), enables mobile drag-and-drop via LiChessTools.enableMobileDragAndDrop().

## Events

- On `lichessTools.chapterChange` and `lichessTools.redraw`: addDivider
- On `.analyse__fork` analyse__tools observer: addDividerDirect

## Preference

- **name**: `resizeExplorer`
- **category**: analysis
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true

## Dependencies

`EmitChapterChange`, `EmitRedraw`
