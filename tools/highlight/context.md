# Highlight Tool — Context Summary

## Purpose

The **HighlightTool** adds CSS class highlights to move elements in analysis mode (`div.analyse__moves move`) and board pieces, based on various criteria: last moves per variation, uncommented moves, transpositions, mainline status, variation depth, checks to kings, current line. It traverses the analysis tree periodically (debounced 800ms) to update highlights.

## Dependencies

- **EmitRedraw**, **DetectThirdParties**, **TranspositionBehavior**

## Preferences

- **name**: `highlight`
- **category**: `analysis`
- **type**: multiple (checkboxes)
- **possibleValues**: [`lastMove`, `notCommented`, `transposition`, `mainLine`, `mainLinePieces`, `variationDepth`, `checks`, `currentLine`]
- **defaultValue**: `lastMove,notCommented,transposition`
- **advanced**: true

### Options:

- **lastMove**: highlights last move in each variation — body class toggle `lichessTools-variationDepth` if set. Each node's lastMoves tracked via traverseTree → elements get `lichessTools-lastInLine` + `inverted` (if ply parity != orientation)
- **notCommented**: highlights not-commented last moves in study mode — nodes filtered by !node.isCommentedOrMate → elements get `lichessTools-uncommented`
- **transposition**: highlights transpositions to current move — currentNode.transposition() filtered by transpositionBehavior.excludeSameLine (exclude same line paths) if >1 transpositions → elements get `lichessTools-transposition`
- **mainLine**: body class toggle `lichessTools-notOnMainline` when analysis.node != analysis.mainline[analysis.node.ply] — listens to redraw pubsub
- **mainLinePieces**: board pieces highlight when out of main line — compares current FEN board vs mainNode FEN board (findLast mainline[i==nodeList index) → squares where board[y][x] != mainBoard[y][x] → piece elements with cgKey in those squares get `lichessTools-notOnMainline`
- **variationDepth**: treeview visible mode — traverses tree from root, each node variationDepth computed (root=0, children depth incremented), path dict = 'vd'+min(7,variationDepth+1) + 'vdm'+variationDepth%7+1 → tview2 move elements toggle classes vdm1-vdm7/vd1-vd7 based on dict
- **checks**: highlights check moves — state.checks from traverseTree → elements get `lichessTools-inCheck`
- **currentLine**: highlights current line path — nodeList from analysis.tree.getNodeList(contextMenuPath||path) → elements get `lichessTools-currentLine`

## How It Works

### Highlight Functions (each):
1. Builds toHighlight Set/Array based on option + state data
2. Finds existing elements with target class in `div.analyse__moves move` — filters those not in toHighlight as toRemove
3. lt.requestAF → toRemove.removeClass(targetClass), toAdd.addClass(targetClass)

### traverseTree (`traverseTree`)
Checks analysis exists + !lt.isTreeviewVisible(). Calls `lt.traverse()` → sets state (lastMoves, checks, etc). Then calls all highlight functions: lastMoves, uncommented, transpositions, variationDepth, checks, currentLine. Debounced at 800ms via `debouncedTraverseTree`.

### Initialization (`start()`)
Reads preference value via `lt.isOptionSet`. Options object with individual flags + isSet getter (lastMove||notCommented||transposition||mainLine||variationDepth||checks||mainLinePieces||currentLine). Unbinds pubsub redraw for highlightMainLine, highlightMainLinePieces, debouncedTraverseTree. If mainLine: binds redraw → highlightMainLine. If mainLinePieces: binds redraw → highlightMainLinePieces. If isSet: binds redraw → debouncedTraverseTree. Toggles body class `lichessTools-variationDepth` if variationDepth set. Calls debouncedTraverseTree.