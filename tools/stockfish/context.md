# Stockfish Tool — Context Summary

## Purpose

Provides a local chess engine (Stockfish 18) running in the browser, enabling real-time position analysis without relying on cloud evaluation.

## Preferences

| Name | Category | Type | Default | Advanced | Hidden |
|------|----------|------|---------|----------|--------|
| `stockfish` | general | single (true/false) | true | yes | yes |
| `stockfish-threads` | analysis2 | number | 1 | yes | no |
| `stockfish-hash` | analysis2 | number | 128 MB | yes | no |

## Architecture

The tool extends `LiChessTools.Tools.ToolBase`. It creates a `Stockfish` instance stored on `lt.stockfish`.

### Stockfish Instance

- **Loading**: Loads the Stockfish JS module from lichess analysis engine assets (`npm/lila-stockfish-web/sf_18_relaxed-simd.js` or `sf_18_smallnet_relaxed-simd.js`). Uses a "better engine" (full NNUE) when storage supports indexedDB and memory ≥ 4MB; otherwise uses the small-net variant.
- **NNUE Buffers**: Loads NNUE weight files from lichess assets (`lifat/nnue/`) and caches them in indexedDB under `nnue--db/nnue/<filename>`. Sets buffers for both variants (indices 0, 1).
- **UCI Communication**: Uses `postMessage` to send UCI commands to the engine instance. Commands include: `uci`, `setoption`, `position fen <fen>`, `go depth <depth>` / `go movetime <time>` / `go infinite`, `stop`, `quit`.
- **Engine Options**: Default UCI settings: `UCI_Elo = 3190`, `UCI_ShowWDL = true`, `UCI_AnalyseMode` not set.

### Evaluation Flow

`evaluate(fen, options)` where options can include:
- `pv` (multiPV count, default 1)
- `depth` (search depth, default 16)
- `moves` (searchMoves filter)
- `cancelRequested` (abort flag)

流程: setMultiPv → setDepth → setSearchMoves → setPosition → start → listen for `info` events (collect cp/mate values per multipv) → listen for `bestmove` → stop → return collected info array.

### Event Parsing

The `listen(data)` method parses UCI output strings into structured objects:
- Recognizes keys: `depth`, `seldepth`, `time`, `nodes`, `pv`, `multipv`, `score`, `cp`, `wdl`, `mate`, `lowerbound`, `upperbound`, `currmove`, `currmovenumber`, `hashfull`, `nps`, `tbhits`, `sbhits`, `cpuload`, `string`, `refutation`, `currline`, `ponder`
- Emits events on `info` and `bestmove` names via the handler system (`on(name, handler)` / `off(name, handler)` / `emit(name, event)`).

### Restart Management

Setting any option (Threads, Hash, MultiPV, Depth, SearchMoves, Time, FEN) triggers a debounced restart (500ms debounce). The engine stops → re-positions → re-goes with updated parameters.

### Destroy

`destroy()` stops the engine, sends `quit`, clears all references (`_instance`, `_stockfish`, `_module`).

## Error Handling

Announces translations: "Could not load Stockfish!" / "Error running Stockfish!" via `lt.announce`. Console debug logging at various levels.