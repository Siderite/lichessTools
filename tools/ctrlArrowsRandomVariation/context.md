# CtrlArrowsRandomVariation Tool

## Purpose

Maps keyboard shortcuts: Ctrl+RightArrow plays random variation from current node's children, Ctrl+LeftArrow backtracks to previous position (if one was recorded via random variation).

## How It Works

### Random Variation Forward

Ctrl+RightArrow → `playRandomVariation()`:
- Gets random child via `lt.getRandomVariation(node)`
- Records current path/position in prevPositions array
- User jumps to child's path or (path + child.id)
- Triggers analysisRedraw()

### Backtrack

Ctrl+LeftArrow → `backOneMove()`:
- Checks if last recorded position matches previous path node position
- If match: removes from prevPositions, jumps back to recorded path, redraws
- If mismatch: clears all prevPositions, userJumpIfCan to previous path, redraws

## Dependencies

- RandomVariation (for lt.getRandomVariation function)

## Preferences

- `ctrlArrows` — single type (false/true), default true, advanced/true, category: analysis

## Key Methods

- `playRandomVariation()` → plays random variation from node children
- `backOneMove()` → backtracks to previous recorded position or general previous path
- `async start()` → unbinds existing ctrl+right/left handlers, binds new ones if enabled
