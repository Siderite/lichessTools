# Board Saturate Tool — Context

## Overview

The **BoardSaturateTool** adds a saturation slider control to the Lichess board dasher app (board customization interface). It allows the user to adjust the color saturation of the chess board via CSS custom property `--lt-board-saturate`, ranging from 0% to 200%. The value is persisted in storage.

## Preferences

- **name**: `boardSaturate`
- **category**: `appearance`
- **type**: `single` (radio)
- **possibleValues**: `[false, true]`
- **defaultValue**: `true` (enabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)

## Behavior

### Add Board Saturate Slider (`addBoardSaturate`)

1. Checks for dasher app board container (`#dasher_app .sub.board`) — if not present, returns.
2. Checks for existing saturate div (`lichessTools-boardSaturate`) within container — if present, returns (already created).
3. Creates new div:
   - Class: `lichessTools-boardSaturate`
   - Title: "LiChess Tools - board saturation"
   - Contains label and range input:
     - Label text: "Saturation"
     - Input: min=0, max=200, step=1, type=range.
   - Inserted after `.board-hue` element in container.
4. Range input event handler (`input`):
   - Extracts value from event target.
   - Sets body CSS custom property `--lt-board-saturate` to value/100 (0.0 to 2.0).
   - If value ≠ 100 AND no reset button exists → triggers `.board-hue input` (resets hue slider).
   - Saves value to storage `LiChessTools.boardSaturate`.
5. Input initial value = Math.round(body CSS `--lt-board-saturate` * 100).

### Reset Button Integration

- Checks for reset button in container (`button.reset`).
- If not initialized (`_initBoardSaturate` marker):
  - Sets `_initBoardSaturate` to true.
  - Click handler: sets range input value to 100 and triggers input event (reset saturation to normal).

## CSS Property

- `--lt-board-saturate`: CSS custom property on body element, value = slider value / 100 (range 0.0 to 2.0).
- Controls board color saturation via CSS filter/transform.

## Storage

- `LiChessTools.boardSaturate`: stores the slider value (integer 0-200).

## Page Scope

- Only activates in dasher app (`#dasher_app`) — the board customization interface.

## Event Handling

When enabled:
- Observer on `#dasher_app` watching for `.sub.board.d2` element → triggers `addBoardSaturate`.
- Immediately calls `addBoardSaturate()`.

## Cleanup on Disable

When preference is off:
- Removes all `.lichessTools-boardSaturate` divs.
- Off observer for dasher app board element.
- Sets body CSS `--lt-board-saturate` to 100/100 = 1.0 (normal saturation).