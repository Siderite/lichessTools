# Generate Lines Command Tool

## Purpose

CLI command `/genline <tokens>` that walks the position forward and builds whole variations out of what the page already shows: the Opening Explorer moves list (whatever tab and filters the user set) and the page's own computer analysis. Every move is played through the page's own affordances, so the extension never fetches data on a side channel and never runs a second engine. The walk is a queue process that can be paused, resumed and stopped from the CLI or from a button in the analyse controls bar (`div.analyse__controls`, under the move list - the Explorer box may be closed while lines run).

## Functionality

- Depends on `CliCommands`, `ChessOps`, `ExportPGN`, `EmitRedraw`, `EmitCeval`, `ExplorerEval`.
- A single advanced preference (`advanced: true`), default enabled (`defaultValue: true`), hidden (`hidden: true`), `offValue: false`, category `command` - it is the only preference, since every run parameter comes from the command line.
- No Explorer tab or column is switched on and no engine depth is chosen by the command: the Explorer tab, its filters, its columns and the engine depth are settings of the page, never changed here.
- The stop/pause toggle button is injected into `div.analyse__controls:not(.lichessTools-liveStatus)` (the analyse controls bar under the move list), right after the last `button[data-act]:not([data-act="menu"])` - the `fbt` class keeps the page's own look, and the button exists even when the Explorer box is closed. The button, bare `/stop` and `/genline stop` all set the same flag. No keyboard shortcut is bound (nothing is added to `keyboardHelp`, and no key is stolen from the page).

## Command Surface

`/genline [w:<chain>[*n]] [b:<chain>[*n]] [min:N] [share:N%] [new|tree] [depth:P] [lines:N] [retry:S] [pace:S|off] [stop:mate,noexplorer,repeat,transposition,filterfail] [pause|resume|prune|stop]`

- `<chain>` is an ordered list of `common rare sharp win brilliant gambit eval mate weighted random`; the first metric that yields a candidate wins, otherwise the walk falls to the engine's line.
- Defaults `w:brilliant,win,eval b:common*4 min:100 share:5% depth:24 lines:200 retry:6 pace:2 new stop:mate,noexplorer,repeat,transposition`; bare `/genline` resumes the in-memory queue.
- Generation root: the run is pinned to the node the command was typed on (`this.startPathFixed` is captured before any tab switch or option reload, and `seedFrontier` jumps back to it and refuses with an empty queue if the page cannot get there). By default only NEW variations count (`newOnly` on both sides), so the walk branches at the current position instead of following a line that is already in the tree; `tree` (`tree:on`) opts back into reusing existing children, `!new` is an alias of it. The start is silent: the generated lines in the tree are the only proof the run began.
- Breadth: `<chain>*n` is per position (Black `b:common*3` keeps 3 replies at every Black node), while `lines:N` caps how many COMPLETED lines the run reports - they are different knobs.
- Pacing: a generated move never lands sooner than `pace` after the previous generated move (whole seconds, default 2, `pace:off` lifts the cap). The gap is taken through the chunked `waitMs` and the stop/pause guards are re-checked right after it, so `/stop` or a pause acts inside the gap and no move lands after it. Only moves already in the tree that the `tree` token allows are walked through and not paced.
- Unknown tokens are announced one by one and the command does not start.
- `/stop` is claimed as a bare alias too (the handler keeps it falsy so the CLI chain still reaches the other commands, `cliCommands/tool.js:44`).
- The handler answers synchronously. `cliCommands/tool.js:134` awaits `handle`, and while that await is suspended the page's own Enter handler has already answered the input with "unknown command" - so the `genline` branch must not await the walk. It captures the token text and defers it with `lt.global.setTimeout(()=>this.runCommand(rest), 0)` (the `readGameCommand/tool.js:158` pattern), then returns `true` on the same tick so the Enter is consumed before the page can object.
- `getHelp` returns `genLineCommand.helpText` for `/help`.

## Guard

The command only runs where a human could pick Explorer/engine moves: an analysis context exists, the page is not a live game, analysis is not deliberately off, no interactive lesson / trainer / puzzle is running and the Explorer moves list is visible. Structural refusals stay silent (as the other cheat-sensitive tools do), actionable ones announce. The guard is re-checked at the head of every drain tick, so walking into a lesson mid-run stops the queue.

## The visual walk

The queue holds two kinds of items and the walk processes exactly one per turn: a **node item** (`uci: null`) ranks a position and queues the moves that apply there - maximum the breadth of that side - as **pair items** `(node, move)`; a **pair item** brings the page to its own node, makes that single move, waits until the node lands, and queues the node the move created as a new node item. Nothing is played while ranking, and a pair that cannot be played is re-queued on its own, so a failed sibling never drops the other moves the policy asked for - that is what keeps the tree complete. `expandOne` always takes the front of the unsorted queue, `expandNode` unshifts the first ranked move to the front and pushes the rest to the back, and `playQueued` unshifts the node a move creates to the front, so the first move of a node is played all the way to its end and the next line reopens at the oldest open branch (the next move of the opening) rather than a variation near the end of the line just finished; one jump then pays the Explorer load and the engine wait per line instead of per node.

Per queued item (`expandOne` routes to `expandNode` for a node item, to `playQueued` for a pair), all waits capped by `retry:` and all aborted by `stopRequested`:

1. `gotoNode(item)` brings the page onto the queued node: `analysis.userJumpIfCan(path)` when the path or the fen differ, then `awaitNodeRendered` waits up to 2 s (50 ms polls) until `analysis.path`, `analysis.node.fen` and `analysis.node.ply` match the item and the Explorer is not loading. `userJumpIfCan` moves `analysis.path` synchronously while the Explorer stream and the rendered node still need ticks; reading before they settle ranks the node the page left behind, and an uci that is illegal there becomes the null move `--` in lichess - which is why the fen is also pinned at the play site. A node that never settles closes the line.
2. Explorer: `await explorer.setNode()`, then `explorer.lastStream.promise`, then the polling guard `while (explorer.loading())` before `analysis.explorer.current()` is read. `explorerEval/tool.js:441` proves the order matters - the eval column bails while the Explorer loads.
3. Engine: `cevalAtNode()` only accepts an eval whose `fen` matches the current node (same test `explorerEval/tool.js:540-543` uses); a running engine (`state === 3`) is waited for until it stops; a deeper search is pushed only when the value is missing or shallower than `cfgDepth`, and only under the page's own `canGoDeeper` guard, followed by another wait for it to stop. `cfgDepth` = `node.autoDeeper || customEngineLevel` pref, falling back to the `depth X/Y` label the page shows; with nothing configured nothing is pushed.
4. The eval column: `await lt.tools.ExplorerEvalTool.doEvaluation()` (the raw async, not the debounced wrapper), then `cache[fen].moves` gives the value the column shows.
5. Candidates are ranked from those numbers only, `min:`/`share:`/`new` filters run before ranking, and up to the breadth of that side are **queued as (node, move) pairs** - nothing is played in the ranking turn. `analysis.explorerMove(uci)` for Explorer rows and `analysis.playUci(uci)` for engine-only rows happen later, in `playQueued`, one pair per turn, and a child is never read before its own turn comes.
6. Only a real uci can be played: `uciOk` requires `^([a-h][1-8]){2}(p?[nqbrk])?$`, and `firstUci` takes the first move of an engine pv from the array the page engine uses or from the space separated string the evaluation api uses (`explorerEval/tool.js:488` splits with `.split(' ')[0]`, `:546` uses `.at(0)` - on a string `.at(0)` answers with ONE character, never a legal move). Anything that fails is dropped, so the walk can never play the `--` null move or a fragment of a pv.
7. `readPosition` re-checks the fen after its waits and answers `stale` when the page moved meanwhile (tab switch, option reload, a manual jump); that node is re-queued, and after three stale re-reads the line closes with reason `stale`.
8. The pair is played by `playQueued`, which calls `playAndWait({ uci, explorable }, item)`: it pins the page to the fen the pair belongs to first (waits, and if needed jumps back with `userJumpIfCan`), then calls `analysis.explorerMove(uci)` or `analysis.playUci(uci)`, then waits until `analysis.tree.getNodeList(analysis.path)?.at(-1)` carries the move - `playUci` lands the node after it returns, and it does not reject an illegal uci: lichess writes the null move `--` into the move list, which is exactly what must never be played. If the page cannot be brought to that fen the move is not played at all (the **pair** is queued again and the line closes after three attempts); a `--` registration stops the run silently. When the move lands, the new node is queued as a node item and the whole rule runs again on it.

Brilliancy uses the column's own helper `ExplorerEvalTool.computeBrilliancy(fen,san,evalBefore,evalAfter,co)` and keeps only `isBrilliant` results; `sharp`/`win` use the WDL idioms and require the Wilson interval to be confident.

## Process state

`this.frontier` (nodes that still need processing), `this.done`, `this.generated`, `this.opts`, `this.running`, `this.paused`, `this.stopRequested`, `this.lastMoveAt` (the pace stamp, reset with each run) live only in memory on the tool instance. Nothing is stored in `lt.storage`: a page reload re-runs `start()` and drops the queue, and a `resume` with an empty queue does nothing. Stop is not an undo - the tree keeps what was walked; `prune` (analysis only, explicit token) rebuilds the PGN without the generated lines through `analysis.changePgn(newPgn,false)`.

## Outputs

Generated lines are added straight to the analysis tree: each accepted pair is played with `explorerMove`/`playUci`, so the tree keeps exactly what the walk played. There is no output-mode token and the command never writes to the board or to a study chapter through a second channel; `prune` is the only way to take generated lines back. The command speaks only twice: an unknown token (`badTokenAnnounce`) and the completed count (`doneAnnounce`); every other condition - guard refusal, stop, pause, resume, prune, a non-move or a fen drift - is silent, and the lines in the tree are the whole result.

## Preferences

- **name**: `genLineCommand`, **category**: command, **type**: single, **possibleValues**: [false, true], **defaultValue**: true, **advanced**: true, **hidden**: true, **offValue**: false (the only preference this tool declares)

## Dependencies

`CliCommands`, `ChessOps`, `ExportPGN`, `EmitRedraw`, `EmitCeval`, `ExplorerEval`
