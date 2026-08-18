# TrapValueCommand Tool — Context

## Overview

The **TrapValueCommandTool** provides a CLI command `/trapvalue` that calculates a "trap value" score for the current chess position in analysis/study mode. The trap value combines two metrics: **potency** (how strong the winning/losing move is) and **probability** (likelihood of that move being played through the game path), producing a composite score indicating how dangerous/tricky a position is.

## Dependencies

- **EmitRedraw** — Required for redraw events
- **CliCommands** — Required for CLI command registration system

## Preferences

| name | category | type | possibleValues | defaultValue | advanced | hidden | offValue |
|------|----------|------|----------------|--------------|----------|--------|--------|
| `trapValueCommand` | command | single (radio) | [false, true] | true | yes | yes | false |

Hidden preference — only visible in debug mode. When enabled, the `/trapvalue` CLI command is registered. When disabled, it is unregistered.

## CLI Command Registration

When enabled:
- Registers via `lt.registerCommand('trapValueCommand', {...})`
- **handle(val)**: if val == 'trapvalue' → calls `showTrapValue()` → returns true
- **getHelp()**: returns translated help text "/trapvalue — Show trap value for position"

When disabled: unregisters via `lt.unregisterCommand('trapValueCommand')`.

## Explorer Item Storage (`explorerItem`)

A mechanism to cache explorer data per node using a hashed key based on stored preferences components:
- Components list: `explorer.speed`, `analyse.explorer.player.name`, `analyse.explorer.rating`, `analyse.explorer.since-2.masters`, `explorer.db2.standard`, `analyse.explorer.since-2.lichess`, `analyse.explorer.until-2.lichess`
- Key = hash of joined raw storage values with '|' separator

For a given node:
1. Checks `node.explorerItems` cache map (created if absent)
2. If value undefined → retrieves from cache or from `explorer.cache[node.fen]`
3. Stores value in `node.explorerItems[key]` for future reuse

This avoids repeated explorer API calls by caching per-node results keyed to user's explorer settings.

## Trap Value Calculation (`showTrapValue`)

Async function triggered by `/trapvalue` command:

### Setup Phase
1. Checks analysis exists, explorer allowed/enabled
2. If explorer not enabled → enables it, triggers redraw
3. Uses `initialPath` (defaults to current `analysis.path`, or sets path if different)
4. Gets current node's explorerItem via cache lookup
5. If no cached item → sets explorer node, waits for loading completion, gets current explorer data, caches it

### Potency Calculation
- **total** = white + draws + black from explorerItem
- If total = 0 → announces "No explorer data available" and exits
- **potency** = (orientation != 'black' ? white : black) / total
  - Represents the strength of the winning side's moves relative to all moves

### Probability Calculation Through Path
Iterates through nodes in `initialPath`:
1. For each node: retrieves explorerItem via cache or API fetch (sets path to node.ply*2 prefix, waits for loading)
2. **moveProbability**: if move exists AND prevTotal > 0 → (move.black + draws + white) / prevTotal; else 0
3. If node has ply AND is opponent move AND prevTotal > 0:
   - `probability *= moveProbability || (total / prevTotal)`
   - count++
4. prevTotal = total for each node

### Probability Adjustment
- If count > 1 → `probability = Math.pow(probability, 1/count)` (geometric mean)

### Score Computation
- **probabilityScore** = round(probability * 100)
- **potencyScore** = round(potency * 100)
- **trapScore** = round(probability * potency * 100)

### Output
- If probabilityScore or potencyScore > 0 → announces: "probabilityScore% x potencyScore% = trapScore%"
- Otherwise → announces "?"

Restores original path, triggers redraw.

## Metrics Interpretation

- **Potency**: percentage of winning moves (white for white orientation, black for black orientation) out of all moves — indicates how decisive the position is
- **Probability**: geometric mean of opponent move probabilities through the game path — indicates likelihood of reaching this position with the winning/losing move being played
- **Trap Value**: product of probability × potency — composite score indicating how likely and dangerous a trap exists at this position
