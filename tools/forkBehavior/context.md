# ForkBehavior Tool — Context Summary

## Purpose

The **ForkBehaviorTool** controls how lichess handles multiple possible next moves (forks/variations/transpositions) during analysis. It intercepts the `analysis.fork.proceed` function to either: hide forks, let them proceed normally, show a hybrid disclosure mode, or force the user to choose via a popup dialog.

## Dependencies

- **RandomVariation**, **EmitRedraw**, **EmitChapterChange**, **TranspositionBehavior**, **InterceptEventHandlers**, **Dialog**

## Preferences

- **name**: `forkBehavior`
- **category**: `analysis`
- **type**: single (radio)
- **possibleValues**: [`hidden`, `normal`, `hybrid`, `chessbase`]
- **defaultValue**: `normal`
- **offValue**: `normal`
- **advanced**: true

### Modes:

- **hidden**: hides fork UI (`analyse__tools` gets class `lichessTools-forkBehavior-hidden`) — no interception, forks are hidden visually
- **normal**: default — no interception of `fork.proceed`, lichess behavior unchanged
- **hybrid**: intercepts `fork.proceed`; if user is on a variation path (not mainline), shows disclosure mode (`analyse__tools` gets class `lichessTools-forkBehavior-hybrid`) and returns false to block proceed; when user jumps back to mainline, clears variation select
- **chessbase**: intercepts `fork.proceed`; forces popup dialog when >1 next moves or transpositions exist — user must explicitly choose via dialog

## Move Text Generation (`getMoveText`)
Formats move display text: includes move number (`.`/`...` based on ply parity), SAN notation, glyphs symbols concatenated. If single-child chain with length < 5, recursively shows child move; otherwise adds ellipsis icon.

## Popup Dialog (`showPopupDirect`)
Creates a modal dialog containing next moves and transpositions:

### Desktop Mode
- `<select>` with `size` attribute (total items count)
- Optgroups labeled "Moves" / "Transpositions" if both exist
- Each option has `value` = UCI + path, `fen`, text = getMoveText(move, isTranspo=false/true)

### Mobile Mode
- `<ul>` with sub-ul groups labeled "Moves"/"Transpositions"
- Each `<li>` has `value` = UCI+path, `fen`, text = getMoveText

Dialog includes submit button ("OK"), infoIcon link to preferences page. Dialog class: `lichessTools-forkBehavior-chessbase`.

### Interaction Handlers
- **Desktop**: option mousedown (button=0, target selected) → makeMove; dblclick → makeMove; contextmenu → makeMove; change event → highlight (explorer hover + fork selectedIndex update); submit button click → makeMove
- **Mobile**: li click → mobileMakeMove (if not selected: select it + highlight; if already selected: makeMove)
- **Keyboard**: ArrowRight/Enter → makeMove; ArrowLeft → close dialog; ShiftLeft/ShiftRight → scroll selection + highlight

### Selection State
Dialog sets `selectedIndex` from `analysis.fork.selectedIndex`. Focus on selected option.

### MakeMove Logic
Extracts UCI+path from value: if path exists → `analysis.userJumpIfCan(path)`; else → `analysis.playUci(uci)`. Redraw after.

### Highlight Logic
Explorer sets hovering on current FEN with selected UCI. Updates fork.selectedIndex (if not already that index). Sets autoShapes + redraw.

## Event Interception (`bindFork`)

### Mousewheel/Pointermove Wrapping
For `hybrid`/`chessbase`: wraps board wheel handler and analyseControls pointermove handler — calls old handlers inside wrapper, sets flags `mousewheelOn`/`pointermoveOn`. Fork.proceed before hook checks these flags to skip interception during mouse interaction.

### Fork Click Detection
`analyse__fork` elements capture `pointerdown` → `inForkClick=true`; release events (`click`, `pointerup`, `pointercancel`, `mouseout`) → `inForkClick=false`. Before hook skips if inForkClick is true.

### WrapFunction on fork.proceed
Before hook: checks mousewheel/pointermove/gamebookPlay flags; gets nextMoves (true/false = mainline/variations) and nextTranspos (false=true = transpositions); counts unique SANs via `transpositionBehavior.groupSameMove`; if >1 unique moves or transpositions exist AND not inForkClick:
- **hybrid**: checks disclosureMode setting — if on, breaks; else checks variationSelect != analysis.path → sets variationSelect + class + returns false (blocks proceed)
- **chessbase**: calls `showPopup(nextMoves, nextTranspos)` → returns true (blocks proceed, popup handles move)

After hook: returns `nextResult` or original result.

### WrapFunction on analysis.jump
After hook: clears variationSelect (`variationSelect='unset'`, removes classes from `analyse__tools`).

## ClearVariationSelect
Sets `variationSelect='unset'`, removes `lichessTools-forkBehavior-hidden` and `lichessTools-forkBehavior-hybrid` classes from `analyse__tools`.

### Initialization (`start()`)
Reads preference value. Unwraps existing fork.proceed wrapping. Removes old handlers. Clears variation select. If hybrid/chessbase: binds pubsub redraw + chapterChange events, calls bindFork. Adds hidden class if value == 'hidden'.