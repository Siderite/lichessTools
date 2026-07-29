# Search Moves Command Tool

## Purpose

Provides a CLI command `/s <pattern>` that searches the move list for matches using regex wildcards (* and ?). Shows a search bar with input, prev/next buttons, position indicator, close button. Searches via PGN export (SAN, comments, glyphs, ply) plus optionally pawn structure patterns if ShowPawnStructureTool exists.

## Functionality

- Depends on `CliCommands` and `ExportPGN`.
- Advanced preference (`advanced: true`). Default enabled (`defaultValue: true`). Hidden (`hidden: true`). offValue: false.
- **index**: 0 — current search result index.

- **goToNode(index)**: Navigates to node at this.nodes[index]:
  - Gets path, analysis.tree.nodeAtPath(path) if exists → sets index
  - Toggles prev/next button disabled classes based on hasPrev/hasNext (nodes[this.index-1]/this.index+1)
  - Position span text = `${index+1}/${nodes.length}` or empty
  - If node exists → analysis.jump(path), analysisRedraw()

- **hideBar()**: Removes `.lichessTools-searchMovesCommand` element.
- **showBar()**: Creates search bar before `.analyse__moves`:
  - `<input type="text class="search"`: input event → searchMoveList(val); keypress Enter (nodes.length>1) → index+1 wraps to 0, goToNode(index); keydown Escape → hideBar()
  - `<button class="prev"` LessThan icon → click → goToNode(this.index-1)
  - `<button class="next"` GreaterThan icon → click → goToNode(this.index+1)
  - `<span class="position"`
  - `<button class="close"` Cancel icon → click → hideBar()
  - Selects all non-focused search input text

- **showResults(pattern, nodes)**: Sets this.nodes=nodes, index=0; shows bar with input val=pattern, selects text, goToNode(0).

- **searchMoveListDirect(pattern)**: Debounced (500ms):
  - If no pattern → showResults('',[])
  - Normalizes pattern string, converts to regex: *→.*, ?→., |→|, others escaped; global flag
  - Creates searchObj {reg, nodes[]}
  - Three exportPgn calls: with separateLines=true (full), then without comments/glyphs, then without comments/glyphs/ply
  - Set from searchObj.nodes
  - If ShowPawnStructureTool exists → additional pawn structure search: regex on pattern (no escape for |/?/*), traverse analysis.tree.root checking getStructure(board,false) and getOpposingStructure(structure) against regex → adds node.path to set if match
  - showResults(pattern, [...set])

- **canSearch()**: Returns false if lt.isGamePlaying(), analysis.gamebookPlay(), dialog.lichessTools-pgnEditor exists; otherwise true.

## CLI Command

`/s <pattern>`: pattern with * and ? wildcards supported. Help text: "/s <FEN | PGN | text> — * and ? wildcards supported. Search in move list".

## Preference

- **name**: `searchMovesCommand`
- **category**: command
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true
- **hidden**: true
- **offValue**: false

## Dependencies

`CliCommands`, `ExportPGN`
