# Random Variation Tool

## Purpose

Provides probability-based random selection of next moves from variations in analysis, with configurable depth for considering descendants. Replaces LiChessTools's populatePercent, getNextMoves, and getRandomVariation functions.

## Functionality

- Depends on `TranspositionBehavior`.
- **randomVariationDepth preference**: single type with values 0 (equal), 2 (one move), 4 (two moves), 6 (three moves), 8 (four moves), 10 (five moves). Default: 4. offValue: 0. Advanced.

- **populatePercent(nodes, isInteractive, depth)**: Assigns probability percentages to variation nodes:
  - For each node: if interactive and not gamebook → prc=0; else checks comments for `prc:` regex match → sets prc from comment text
  - Nodes without prc set go into defaultPrc list
  - If total prc > 100 → warns console
  - For default nodes: calculates descendants count via getGamebookDescendants (recursive up to depth, filtering interactive non-gamebook)
  - Weight = 1 + count of descendants with more than 1 visible children
  - Distributes remaining percentage (100 - total) proportionally by weight across default nodes

- **getNextMoves(node, noTranspositions, noMoves)**: Gets next move candidates from node's visible children. Optionally includes transposition variations:
  - If noTranspositions or no transpositionBehavior/consideredVariations/node.transposition → returns just visible children
  - Otherwise: gets transpositions via node.transposition(), filters out self
  - If excludeSameLine → further filters by path not starting with each other's path
  - For each transposition child, adds its grandchildren (visibleChildren) to the array

- **getRandomVariation(node, noTranspositions, depth)**: Randomly selects a variation based on probability distribution:
  - Gets next moves via getNextMoves
  - If empty → returns nothing
  - Determines isInteractive from gamebookPlay()
  - Calls populatePercent with depth (default = this.depth) to assign prc values
  - Calculates random index = lt.random() * total
  - Accumulates prc across children until index <= acc → returns that child

## Integration

- Replaces `lt.populatePercent`, `lt.getNextMoves`, `lt.getRandomVariation` with its own implementations on start.

## Preference

- **name**: `randomVariationDepth`
- **category**: analysis2 (Analysis - minor)
- **type**: single
- **possibleValues**: [0, 2, 4, 6, 8, 10]
- **defaultValue**: 4
- **offValue**: 0
- **advanced**: true

## Dependencies

`TranspositionBehavior`
