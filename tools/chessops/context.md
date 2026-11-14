# ChessOps Tool

## Purpose

Provides access to the ChessOps ES module bundle. ChessOps is a bundled JavaScript library (from LiChessToolsAdjacent project) that provides chess operations functionality for studies and analysis.

## How It Works

### Module Loading

When enabled:
- Creates `lt.chessops` as a Promise function that loads the bundle via comm getChromeUrl from `tools/chessops/chessops.bundle.mjs`
- Uses dynamic import to load the module
- Caches loaded result for subsequent calls

### Disabled Behavior

When disabled (`chessOps=false`): sets `lt.chessops = null`.

## Dependencies

None explicitly listed. Depends on `lt.comm.getChromeUrl`, dynamic import support.

## Preferences

- `chessOps` — single type (false/true), default true, advanced/hidden, category: study

## Key Methods

- `async start()` — creates or disables lt.chessops function

## Bundle API notes (verified 14 Nov 2026)

- The namespace is flat: `co.fen`, `co.san`, `co.Chess`, `co.pgn`, plus helpers such as
  `co.parseUci`, `co.makeUci`, `co.squareFile`, `co.squareRank`.
- Read a position with `co.Chess.fromSetup(co.fen.parseFen(fen).unwrap()).unwrap()`;
  `MoveGen.positionFromFen(fen, co)` wraps the same two calls.
- There is no Position-to-FEN helper here: `pos.fen`, `pos.setup()` and `co.fen.makeFen(pos)`
  all fail (`makeFen` wants a *setup*, i.e. what `parseFen` unwraps, not a `Position`). For
  scratch replay, index squares as `rank * 8 + file` and read them with `pos.board.get(...)`,
  then build the FEN by hand - `co.makeSquare` in this bundle takes a square index and returns
  a name, so the two-argument `(file, rank)` form does not exist.
- `co.san.parseSan(pos, san)` returns a plain `{ from, to, promotion }` with square indices;
  advance with `const nx = pos.clone(); nx.play(m);`.
- A mangled placement is rejected rather than half-read: a FEN whose ranks were all identical
  (eight white kings) fails in `fromSetup` with `ERR_KINGS`, so a bad hand-built FEN is loud.
- Keep the castling field consistent with the replay (clear a side's right when its king leaves
  e8/e1 or a rook leaves a corner), otherwise legal-move counts differ from the real position.

