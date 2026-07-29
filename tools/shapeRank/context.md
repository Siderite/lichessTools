# Shape Rank Tool

## Purpose

Shows numbered ranks (1, 2, 3...) on arrows and circles drawn on the board, indicating their order of drawing. Helps identify which arrow/circle was drawn first, second, etc.

## Functionality

- Depends on `EmitRedraw` and `MobileExperience`.
- Advanced preference (`advanced: true`). Default disabled (`defaultValue: false`).
- **clearRankShapes(shapes)**: Removes all shapes with type 'rank' from a shapes array. Returns true if any were removed.
- **shouldNotBeRanked(shape)**: Checks shape customSvg HTML for `circle` matches — only shapes with exactly 6 circles ("googly horsey") are NOT ranked; others should be ranked.
- **ensureShapeRank()**: Sets up rank numbering on drawable shapes:
  - Gets chessground (from lt.getChessground() or overlay board)
  - If drawable exists and enabled: checks if `shapes` is a property (has getter/setter). If not, defines new property:
    - Getter filters out 'rank' type shapes from `_shapes`, then for each non-ranked shape (shouldNotBeRanked), assigns increasing rank number (1,2,3...) with unique orig key
    - Creates rankShape with customSvg `<text>` showing the rank number in shape's brush color
    - Concat rankShapes + filtered shapes as new `_shapes`
    - Setter stores incoming shapes to `_shapes`
  - If existing shapes exist → redraws chessground
- **waitForChessground()**: Waits for chessground to appear (setTimeout 500ms if not found):
  - When enabled: wraps `chessground.state.drawable.onChange` function with shapeRank wrapper:
    - Before function: clears rank shapes from incoming args[0], calls original function, returns false (prevents lichess execution)
  - setTimeout ensureShapeRank after 500ms (needed to avoid clearing at first page load)
  - When disabled: unwraps the function; if rank shapes exist in drawable.shapes → clears them and redraws

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
