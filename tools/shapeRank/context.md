# Shape Rank Tool

## Purpose

Shows numbered ranks (1, 2, 3...) on arrows and circles drawn on the board, indicating their order of drawing. Helps identify which arrow/circle was drawn first, second, etc.

## Functionality

- Depends on `EmitRedraw` and `MobileExperience`.
- Advanced preference (`advanced: true`). Default disabled (`defaultValue: false`).
- **shouldNotBeRanked(shape)**: Checks shape customSvg HTML for `circle` matches — only shapes with exactly 6 circles ("googly horsey") are NOT ranked; others should be ranked.
- **ensureShapeRank()**: Sets up rank numbering on drawable shapes:
  - Gets chessground (from lt.getChessground() or overlay board)
  - If drawable exists and enabled: checks if `shapes` is a property (has getter/setter). If not, defines new property:
    - Getter will set or erase the label of the shapes as the order rank of the shape.
    - Setter stores incoming shapes to `_shapes`
  - If existing shapes exist → redraws chessground
- **waitForChessground()**: Waits for chessground to appear (setTimeout 500ms if not found):
  - calls ensureShapeRank

## Events

- On `lichessTools.shapeRank` and `lichessTools.redraw`: triggers waitForChessground

## Preference

- **name**: `shapeRank`
- **category**: analysis2 (Analysis - minor)
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: false
- **advanced**: true

## Dependencies

`EmitRedraw`, `MobileExperience`
