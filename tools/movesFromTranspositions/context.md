# Moves From Transpositions Tool

## Purpose

Shows a transposition fork box in the analysis tools area displaying next moves from transposition nodes (positions reached via different move sequences but same board state). Also shows the single next move if only one child exists.

## Functionality

- Depends on `TranspositionBehavior`.
- Advanced preference (`advanced: true`). Default enabled (`defaultValue: true`).
- **findTranspositionsDirect()**: On redraw event (only when treeview visible):
  - Gets current node, path; sets currNode.path if undefined
  - If disclosureMode exists → removes fork box and returns
  - Uses lt.traverse() state
  - Gets transpositions via currNode.transposition(); if excludeSameLine → filters by path not starting with each other's path (or keeps self)
  - If no transpositions or length <= 1 → removes fork
  - Creates `<div class="analyse__fork lichessTools-transpositions"` title "LiChess Tools - moves following transpositions" after analyse__fork/analyse__moves last element; reposition if not preceded by analyse__fork and one exists
  - Filters transpositions to exclude currNode itself
  - Sets dataset transpositions = uci of all transpositions joined + comma, plus 'ND' (noDuplicates) or 'D' (duplicates) flag if groupSameMove enabled
  - If dataset matches existing → returns; else empties fork and rebuilds

- **addForkMove(targetElem, path, child, isNextMove)**: Creates `<move>` element:
  - Prefix = '' for next move, 'T' for transposition
  - Toggles `lichessTools-transposition` class (not isNextMove)
  - attr('p') = path
  - Adds `<index>` with sbhint + child.ply, text prefix + Math.ceil(child.ply/2) + '.' if odd or '...' if even
  - Adds `<san>` with child.san text
  - Mouseover: removes selected from all fork moves, adds lichessTools-highlight to targetElem, explorer.setHovering(fen, child.uci); mouseout: removes highlight, setHovering(null,null)
  - Click: prevents default, userJumpIfCan(path), analysisRedraw()
  - If glyph exists → adds `<glyph>` with title glyph.name, text symbol
  - Next move → prependTo fork; transposition → appendTo fork

- Builds transposition moves for each transposition node's visible children (checks path duplicates, sans duplicates if noDuplicates). If currChildren.length == 1 → adds single next move.

## Preference

- **name**: `movesFromTranspositions`
- **category**: analysis
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true

## Dependencies

`TranspositionBehavior`
