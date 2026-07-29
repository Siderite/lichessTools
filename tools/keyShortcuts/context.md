# KeyShortcuts Tool — Context Summary

## Purpose

The **KeyShortcutsTool** adds custom keyboard shortcuts for analysis mode, board editor mode, and general lichess pages. It intercepts original key handlers, binds new ones based on active preferences, manages move preparation modes (pgn/ceval/explorer/general), digit keys for selecting moves from lists, glyph jumping, freeze board, header toggle, FEN/image clipboard copy.

## Dependencies

- **EmitRedraw**, **ExplorerPractice**, **AdditionalGlyphs**, **SearchMovesCommand**

## Preferences

- **name**: `keyShortcuts`
- **category**: `general`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `true`
- **advanced**: true

When set to `true`, binds all custom shortcuts. When false, restores original handlers + clears move mode.

## How It Works

### Move Mode Management (`clearMoveMode`)
Clears makeMoveTimeout → sets makeMoveMode=null → removes body classes `lichessTools-keyMode-pgn`, `lichessTools-keyMode-ceval`, `lichessTools-keyMode-explorer`, `lichessTools-keyMode-general`.

### PrepareMove (`prepareMove(mode)`)
Clears move mode first. Checks mode validity:
- **pgn**: moves in `div.analyse__tools div.analyse__fork move` must exist
- **ceval**: analysis.ceval + cevalEnabled() must exist
- **explorer**: explorer-box:not(.loading) .moves tbody tr must exist
- **general**: no check required
Sets makeMoveMode=mode → adds body class `lichessTools-keyMode-mode` → setTimeout 1500ms to clearMoveMode.

### Digit Key Handler (`handleDigitKey(combo)`)
combo as number (index--). If !makeMoveMode + oldHandlers[combo] exists: calls oldHandler. Otherwise switches makeMoveMode:
- **pgn**: moves[index].click()
- **ceval**: analysis.node.ceval.pvs[index].moves[0] → playUci(uci)
- **explorer**: moves.eq(index).attr('data-uci') → playUci(uci)
Clears move mode after.

### FreezeBoard (`freezeBoard`)
If makeMoveMode != 'general': calls oldHandlers['f']. Clears move mode. Toggles boardFrozen flag. Unbinds/ binds pubsub redraw to renderFreeze if frozen. renderFreeze: if !boardFrozen → remove cg-container.lichessTools-freezeBoard; else → clone cg-container add class appendTo div.cg-wrap.

### H Key Handler (`handleHKey`)
If makeMoveMode != 'general': if ExplorerPracticeTool.isRunning → trigger lichessTools-hideExplorerMovesButton click; else → call oldHandlers['h']. Clears move mode. Toggles body class `lichessTools-hideSiteHeader`.

### R Key Handler (`handleRKey`)
If study exists: randomChapter(); else: requestAnalysis().

### RequestAnalysis
If makeMoveMode exists: returns. Trigger button `.analyse__underboard__panels .computer-analysis button` or `.analyse__round-training .advice-summary a.button`.

### RandomChapter
If makeMoveMode != 'general': calls oldHandlers['r']. Clears move mode. Trigger `div.lichessTools-chapterControls button[data-act="random"`.

### JumpToCurrentMove
analysis.ongoing + data.game.turns > 0 → jumpToIndex(turns-1) + analysisRedraw(). Returns false if conditions not met.

### SwitchExplorerTabs
explorer.enabled() → switch config.data.db between 'masters'/'lichess' → explorer.reload().

### Glyph Jump (`lt.jumpToGlyphSymbols`)
Binds key handlers for i/m/b/g/alt+i/alt+m/alt+b/alt+g: jump to glyph symbols. i→?! (inaccuracy), m→? (mistake — if analysis.retro calls oldHandler), b→?? (blunder), g→[!,!?!!,WhiteStar] (good/brilliant/interesting). alt variants with true parameter for opponent side.

### Slow Moves Jump (`jumpToSlowMoves(black)`)
AdditionalGlyphsTool.options.slow active + !obsSetup span → traverses analysis.mainline, path accumulates node.id, processSlow(node if isSlow undefined), isSlow && ply%2==!black → nodes.push(path). index = nodes.indexOf(analysis.path) (index<0?0:index+1)%nodes.length → userJumpIfCan(nodes[index) + analysisRedraw.

### Editor Mode Keys (`bindKeysForEditor`)
Unbinds 1-8 combos + shift+1-8 + c + p. If enabled: binds 1→handleEditorDigit(i,true), shift+1→handleEditorDigit(i,false). p→handleEditorAction(0), c→handleEditorAction(1). handleEditorDigit(index,mySide): creates mousedown/mmouseup event (clientX/Y=-100) on container (spare-bottom if mySide=true, spare-top if false) .no-square.eq(index-1). handleEditorAction(index): trigger container.children().eq(index).

### General Keys (`bindKeysForGeneral`)
Unbinds ` + h. Unbinds document copy event. If enabled: binds `→prepareMove('general'), h→handleHKey, document on copy→copyFenOrImage.

### Copy FEN or Image (`copyFenOrImage(event)`)
Checks selection.toString() — if exists: returns. Checks dialog.lichessTools-boardImage canvas → toBlob(image/png) Promise → clipboard.write([ClipboardItem('image/png':blob)]) → announce "ImageCopiedToClipboard" in .lichessTools-boardImage area. Else: analysis.node.fen or getPositionFromBoard(main-board,true) → event.clipboardData.setData('text/plain',fen) + preventDefault → announce "FENCopiedToClipboard".

### Search (`search`)
SearchMovesCommandTool.canSearch() → showBar() → if bar.prop('_restrictCtrlF'): returns; else → prop '_restrictCtrlF=true' + input.search on keydown: if key='f' + ctrlKey/metaKey → preventDefault + select(). Else → button[data-role="search"].trigger('click').

### PreserveOriginalHandlers (`preserveOriginalHandlers`)
If !oldHandlers: creates {i, m, b, f, r, h} from lt.getKeyHandler for each.

### BindKeysForAnalysis (`bindKeysForAnalysis`)
Unbinds i/m/b/g/alt+i/alt+m/alt+b/alt+g/o/alt+o/.ctrl+.shift+.`/f/r/backspace/ctrl+f + 1-9 combos + shift+t. If enabled: binds all shortcuts above (glyph jumps, prepareMove digits, freezeBoard, R key, backspace jumpToCurrent if ongoing, switchExplorerTabs if explorer enabled, ctrl+f search). Else: restores oldHandlers for i/m/b/f/r + 1-9 combos with true parameter.

### Initialization (`start()`)
Reads preference value from `lt.currentOptions`. Options = {enabled: !!value}. If !value && !loaded: returns. loaded=true. Checks lichess/analysis exists or isEditorBoard (main.is('#board-editor)). preserveOriginalHandlers. If analysis: bindKeysForAnalysis; else if editor: bindKeysForEditor. bindKeysForGeneral. If !value: clearMoveMode.