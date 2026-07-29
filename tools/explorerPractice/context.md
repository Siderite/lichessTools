# Explorer Practice Tool — Context

## Overview

The **ExplorerPracticeTool** allows the user to practice against moves from Lichess's Opening Explorer. The computer opponent picks random moves weighted by game statistics (white/draw/black counts) from Explorer data. It shows a smiley emoji glyph at branch ends when out of Explorer moves, displays opponent player names on the board, and provides a clickable Σ (sum) row to make a random move.

## Dependencies

- `EmitRedraw` — dependency
- `DetectThirdParties` — dependency
- `Stockfish` — dependency (for local engine evaluation when out of moves)
- `AdditionalGlyphs` — dependency

## Preferences

### Primary Preference
- **name**: `explorerPractice`
- **category**: `analysis`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)

### Secondary Preference (Advanced)
- **name**: `explorerPracticeOptions`
- **category**: `analysis`
- **type**: `multiple` (checkboxes)
- **possibleValues**: `[showSmileys, sumClick, showNames, showInfoStudy, showInfoAnalysis]`
- **defaultValue**: `showSmileys,sumClick,showInfoStudy`

## Behavior

### Write Player Name (`writePlayerName`)

Displays opponent player name on the board when running:
1. Only if `showNames` enabled AND running AND turn ≠ orientation (user is not playing this side).
2. Removes label if conditions not met.
3. Waits for explorer loading to finish.
4. Gets current Explorer data, last Uci square.
5. If no square/current/running/mismatch → removes label.
6. Creates label `lichessTools-explorerPractice` with span on board:
   - Data-fen = current node FEN.
   - Position coordinates based on square and orientation (x from file charCode, y from rank digit).
   - Scale factor q = board.width() / 8.
   - Span text = randomly selected player name from recentGames/topGames for the turn color (reversed: white→black, black→white).
7. Toggles class `black` if turn is black.

### Remove Player Name (`removePlayerName`)

- Removes `.lichessTools-explorerPractice` label from board.

### Play Move (`playMove`)

Picks a random move from Explorer weighted by game counts:
1. If not ignoreSide AND turn == orientation → stops (user should not play their own side): sets inPlayMove=false, stopCeval=true.
2. Checks explorer enabled — if not, returns.
3. If already playing this FEN (`inPlayMove == node.fen`) → returns.
4. If explorer loading → setTimeout process(500ms).
5. Gets current Explorer data, copies moves list.
6. Calculates total = sum of all move totals (black+draws+white).
7. Picks random index = lt.random() * total.
8. Accumulates through moves until index ≤ accumulated total → selects that move.
9. Sets `_lastUci` to selected move UCI, calls `analysis.playUci(move.uci)`, sets inPlayMove to current FEN.

### Out of Moves Handling

- If no move found AND running AND not already playing: toggles button class `lichessTools-outOfMoves`, announces "Out of Explorer moves", evaluates position via `evaluatePosition()`.

### Get Engine (`getEngine`)

Loads Stockfish for local evaluation:
1. Waits for sfLoading to finish.
2. If sf exists → returns.
3. Loads Stockfish via `lt.stockfish.load()` — sets MultiPv=1.
4. On 'info' event: stores lastInfo (cp/mate values).
5. On 'bestmove' event: info = lastInfo.
6. Returns sf, clears sfLoading in finally block.

### Evaluate Position (`evaluatePosition`)

When out of Explorer moves AND `showSmileys` enabled:
1. If glyphs already present → returns.
2. Gets customEngineLevel depth (default 20).
3. If node.ceval depth ≥ depth → uses existing ceval as info, side=1.
4. Otherwise if ceval not enabled: starts local Stockfish evaluation:
   - Sets depth, position (node.fen), starts engine.
   - Waits for info while stopCeval=false AND node unchanged.
   - Stops engine after wait.
5. If no info → returns.
6. Creates smiley glyph based on winValue:
   - boardSign = orientation black→-1, white→+1.
   - winValue = (centipawns or mate) × boardSign × side.
   - Glyph symbols and fills:
     - < -200: CryingFace (#FF4040)
     - < -20: SlightlyFrowningFace (#FF8040)
     - < 20: NeutralFace (no fill)
     - < 200: SlightlySmilyingFace (#80FF80)
     - ≥ 200: GrinningFaceWithSmilingEyes (#40FF40)
7. Sets node.glyphs = [glyph], triggers redraw via `lt.analysisRedraw()`.

### Make Random Move (`makeRandomMove`)

- Calls `playMove(true)` (ignoreSide=true — allows playing any side).

### Set Running (`setRunning`)

- Sets isRunning value. If false → removes player name label.

### Process (`process`)

Main setup and control logic:
1. If gamebookPlay OR gamePlaying → sets running=false, returns.
2. Checks explorer container `section.explorer-box` eq(0) — if not present → sets running=false.
3. Sum row (`tr.sum`): off click handler.
4. If `sumClick` enabled AND NOT relay study AND isWriting !== false: adds class `lichessTools-sumClick`, title "click to make a move", click handler → makeRandomMove. Otherwise removes class/title.
5. Explorer title container — if not present → sets running=false.
6. Practice button (`lichessTools-explorerPractice`): creates if not present in explorer-title:
   - Icon: ArcheryTarget, title "practice against Explorer moves".
   - Click toggles isRunning, calls process, emits redraw.
   - Prepended to container.
7. If explorer not enabled → sets running=false.
8. Button toggles class `active` based on isRunning.
9. Hide button (`lichessTools-hideExplorerMovesButton`): creates if not present in explorer-box:
   - Icon: Eye, title "toggle Explorer move stats".
   - Click toggles showInfoStudy (in study) OR showInfoAnalysis (in analysis), saves options via `lt.currentOptions.explorerPracticeOptions`, calls process.
10. Hide data class on container based on isRunning AND hideData (showInfoStudy/Analysis negated).
11. If running → setTimeout playMove(500ms).

### Process — debounced version (500ms debounce).

## Event Handling & Wrapping

When enabled:
- **Binds** key handler `shift+l` → toggles isRunning, calls process, emits redraw.
- Listens to `lichessTools.redraw` pubsub → triggers `processDebounced`.
- Listens to `lichessTools.uiApi.events.ply` → triggers `writePlayerName`.
- Listens to `click touchend` on `main.analyse div.analyse__controls` → triggers `process`.
- **Wraps** `analysis.userJump` function with `after` hook: removes button class `lichessTools-outOfMoves`, sets inPlayMove=false.

## Cleanup on Disable

When preference is off:
- Removes `.lichessTools-explorerPractice` buttons from explorer-box.
- Off pubsub listener for redraw.
- Off ply event listener.
- Off click/touchend handler on analyse controls.
- Unbinds key handler `shift+l`.
- Unwraps `analysis.userJump`.

## Login Requirement

- Requires logged-in user (`lt.getUserId()` must exist). If not logged in, disabled with console debug message.

## Gamebook Play Exclusion

- Does not activate when `analysis.gamebookPlay()` is true (Interactive Lesson mode).