# One Click Move Tool

## Purpose

Allows clicking on the board to play a move: click on destination square → if exactly one source piece can move there, plays that UCI; if multiple sources → flashes them and optionally selects from nextMoves PGN list (if moveFromPgn enabled). Also unpacks dests socket events into cache for faster lookup.

## Functionality

- Depends on `ExtendedInteractiveLesson` and `InterceptEventHandlers`.
- **oneClickMove preference**: multiple type with values `analysis` (Analysis/Study), `play` (Play/Puzzles — commented out in code), `onlyOrientation` (Only orientation side to move), `moveFromPgn` (Move from PGN). Default: false. Advanced.

- **_cache**: Map storing destMan by key fen/variant.
- **getDests(board, fen, variant)**: Gets destinations via analysis.node.dests() or cg.state.movable.dests or cache.get(key=fen+variant).
- **flash(sources)**: Adds lichessTools-flash class to sources, timeout 500ms, removes class.

- **getVariant(main)**: Checks main div for variant classes (chess960, antichess, kingOfTheHill, threeCheck, atomic, horde, racingKings, crazyhouse); returns 'standard' if none.
- **boardClick(ev)**: Only left click (which>1 or shiftKey → skip). If analysis+options.analysis OR no analysis+options.play → enabled. No x/y → skip. Board exists → check. Selected square not hidden → skip. Calculates rect, x,y relative to board. Gets variant, orientation (black/white from cg-wrap), fen from getPositionFromBoard(board.closest('cg-container'),true). Turn = b in fen → black, else white. If onlyOrientation enabled and orientation != turn → skip. Square calculated via getSquare(res) (white: 97+x + 8-y; black: 104-x + y+1). width=board.width()/8. destMan via getDests().

- **sources**: piece.turn squares filtered by sq==square OR dests.includes(square). If pieceExists (sq==square) → skip. uci calculation:
  - sources.length == 1 → uci = sources[0].cgKey + square
  - sources.length > 1 → flash(sources); if analysis+moveFromPgn enabled: checks lt.isGamePlaying() or gp+study.members.canContribute() → skip; gets nextMoves via lt.getNextMoves(analysis.node, gp?.threeFoldRepetition) filtered by !lt.isPermanentNode || lt.isPermanentNode(c), maps UCI (O-O castles adjusted h1→g1/a1→c1/h8→g8/a8→c8), filters u ending with square → if length != 1 → skip; uci = nextMoves[0]
  - If uci exists: prevents default, plays via this.playUci(uci, board, orientation)

- **getCoords(square, board, orientation)**: Calculates click coordinates for UCI square (white: x=charcode(0)-97, y=8-charcode(1); black: x=104-charcode(0), y=charcode(1)-1). q=board.width()/8. offset=board.offset(). win.scrollX/scrollY subtracted. Returns {x,y} = offset.left-scrollX+coords.x*q+q/2, offset.top-scrollY+coords.y*q+q/2.

- **playUci(uci, board, orientation)**: Gets mousedown handler from board[0] event handlers. coords for uci.slice(0,2) (from square). fauxEv {isTrusted:true,button:0,clientX:coords.x,clientY:coords.y,preventDefault:()=>{}} → mousedown(fauxEv). board trigger('mouseup'). timeout 50ms. If selected square exists → coords for uci.slice(-2) (to square), fauxEv updated → mousedown(fauxEv).

- **unpackDests(lines)**: Converts dests lines string to Map: uciValue(ch) (!=62,?=63,a-z=charcode-97,A-Z=charcode-39,0-9=charcode+4); uciChar(ch)=x→97+x%8 + 49+x/8. For each line split(''): dests.set(uciChar(line[0]), line.slice(1) split('').map(c→uciChar(c)).

## Function Wrapping

- **handleBoard()**: Board mousedown listener (capture:true) if not already board.lichessTools_oneClickMove=true; wraps lichess.socket.handle with oneClickMove before function: if e.t='dests' → unpackDests(e.d.dests), cache.set(fen,dests).

## Events/Interval

- setInterval 1000ms handleBoard on enabled (analysis+options.analysis OR main.round/main.puzzle exists+options.play).
- Unwraps socket.handle on disable; removes mousedown listener.

## Preference

- **name**: `oneClickMove`
- **category**: analysis2 (Analysis - minor)
- **type**: multiple
- **possibleValues**: ['analysis', 'onlyOrientation', 'moveFromPgn']
- **defaultValue**: false
- **advanced**: true

## Dependencies

`ExtendedInteractiveLesson`, `InterceptEventHandlers`
