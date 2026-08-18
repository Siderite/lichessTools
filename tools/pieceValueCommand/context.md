# Piece Value Command Tool

## Purpose

Provides CLI commands `/piecevalue [depth] [c]` and `/stop` that calculates piece values for current position by removing each piece, running Stockfish eval on modified FEN, comparing to base eval. Shows classes on pieces (terrible/bad/good/great) based on value vs default piece value ratio. Spinner on cg-wrap during execution. Continuous mode repeats on new node.

## Functionality

- Depends on `EmitRedraw`, `CliCommands`, and `Stockfish`.
- Advanced preference (`advanced: true`). Default enabled (`defaultValue: true`). Hidden (`hidden: true`). offValue: false. default depth = 20.

## Stockfish Engine

- **getEngine()**: Waits for sfLoading=false; if sf exists → returns; else loads via lt.stockfish.load(false), setsMultiPv(1), binds on('info') (cp/mate undefined → skip, stores lastInfo, calls onInfo(i)), on('bestmove') (info=lastInfo), on('error') (error=e||'error'); sfLoading=true in try, false in finally.

- **getEval(fen, sf, depth)**: sf.stop(); setDepth(depth); setPosition(fen); info=null; error=null; sf.start(); waits for info (if error → throw, lastProcessedFen=null); sf.stop(); turn = fen includes ' b' → -1 else 1; result = lt.getCentipawns(info) * turn; info/lastInfo=null. Returns centipawn value with sign.

## Invalid Because Check

- **invalidBecauseCheck(board, isBlackTurn)**: Checks if removing piece creates check: turnPieces (black→qrb, white→QRB); targetKing (black→K, white→k). For each turn piece at j,i: rookDirections[-1,0][1,0][0,-1][0,1], bishopDirections[-1,-1][1,1][1,-1][-1,1]; queen=rook+bishop. Traces direction until out of bounds or non-empty ch2 != targetKing → returns true (check exists).

## Show Piece Value (showPieceValue(depth, continuous))

- If cg-wrap spinner not exists → append lt.spinnerHtml. clearValues=true initially. If running → return. try:
  - running=true; getEngine(); fen=analysis.node.fen; splits=fen.split(/\s+/); if lastProcessedFen!=fen → return; lastProcessedFen=fen. board=lt.getBoardFromFen(fen). pieces=cg-container piece:not([data-eval]):not(.ghost) — if no pieces → clearValues=false, return; arrayShuffle(pieces).
  - depths = depth>25 ? [14,depth] : [depth]. For each currentDepth: baseEval=getEval(fen,sf,currentDepth). For each piece e: if analysis.node.fen!=fen or stopRequested → return. key=e.cgKey; x=key.charCodeAt(0)-97; y=56-key.charCodeAt(1); ch=board[y][x]; if k/K/undefined → continue. board[y][x]=undefined. invalidBecauseCheck(board, fen split[1]=='b') → board[y][x]=ch, continue.
  - pfen calculation: psplits=lt.getFenFromBoard(board).split(/\s+/); fenSfills: i<psplits.length→psplits[i]; else splits[i] with special case i==2 (castling rights): filter k if board[0][7]=='r', q if board[0][0]=='r', K if board[7][7]=='R', Q if board[7][7]=='R'; val||='-'. pfen=fenSplits.join(' '). board[y][x]=ch. current={e,ch,baseEval,fen}. style update: transform replaces scale(var(--lt-scale,1)) if not already includes scale. $(e).attr(style=newStyle) if different. val=getEval(pfen,sf,currentDepth). displayValue(e, baseEval-val, ch). current=null.
  - clearValues=false finally: spinner removed; if clearValues → clearValues(); if continuous+!stopRequested → setTimeout showPieceValue(depth,continuous) 100ms; stopRequested=false; running=false.

## Display Value (displayValue(e, val, ch, intermediate))

- pieceValues {p:0.75,r:3.5,n:2.5,b:2.5,q:7.5}. sgn=ch==lowercase→-1 else 1. pieceValue=sgn*Math.round(val/10)/10. text=pieceValue.toFixed(1). defaultValue=pieceValues[ch.toLowerCase()]. q=pieceValue/defaultValue. Classes toggledSafe: intermediateResult(intermediate), terriblePiece(q<=0.5), badPiece(q>0.5&&q<=0.75), goodPiece(q>1.25&&q<=1.5), greatPiece(q>1.5). attrSafe(data-eval=text).

## On Info (onInfo(info))

- If current exists: turn=current.fen split[1]=='b'→-1 else 1; val=lt.getCentipawns(info)*turn; displayValue(current.e, current.baseEval-val, current.ch, true).

## Clear Values (clearValues)

- current=null; lastProcessedFen=null; info=null; lastInfo=null. pieces removeAttrSafe(data-eval), toggle classes false. spinner removed.

## CLI Commands

`/piecevalue [depth] [c]`: depth regex match defaults to 20, continuous if /bc test in val. `/stop`: /stop regex → stopRequested=true. Help text: "/piecevalue [depth=20] [c] ...ontinuous — /stop Stop execution. Show piece values for position".

## Preference

- **name**: `pieceValueCommand`
- **category**: command
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true
- **hidden**: true
- **offValue**: false

## Dependencies

`EmitRedraw`, `CliCommands`, `Stockfish`
