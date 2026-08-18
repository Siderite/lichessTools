# Play Layout Tool

## Purpose

Controls the visual layout of the playing page — options to hide the left side panel, hide chat, or provide a toggle button to show/hide chat dynamically. Also optionally makes the crosstable non-interactive.

## Functionality

- **playLayout preference**: single type with values `normal`, `noSide`, `smallSide`, `smallSideable`. Default: `normal`.
  - `normal`: standard layout
  - `noSide`: hides left side via `lichessTools-noSide` body class
  - `smallSide`: hides chat via `lichessTools-smallSide` body class; when un-hiding, marks all mchat messages as 'read'
  - `smallSideable`: same as smallSide but adds a toggle button in `.game__meta__infos` area
- **playLayoutElements preference**: multiple type with value `deadCrosstable`. Advanced. Makes crosstable non-interactive via `lichessTools-deadCrosstable` body class.

- **toggleLayout(ev)**: When clicked on `.game__meta__infos`, toggles the layout body class (`lichessTools-noSide` or `lichessTools-smallSide`). If un-hiding chat, marks all mchat messages as 'read'.
- **applyLayout()**: Sets up the control element in `.playing main.round .game__meta__infos`:
  - If layout != normal: adds pointer class, title "LiChess Tools - click on the icon to hide/show chat", binds click handler to toggleLayout
  - If normal: removes these attributes

- Monitors via setInterval (1000ms) if the control element changes (page reload), re-applies layout.

## Preference

- **name**: `playLayout`
- **category**: play
- **type**: single
- **possibleValues**: ['normal', 'noSide', 'smallSide', 'smallSideable']
- **defaultValue**: 'normal'
- **offValue**: 'normal'

- **name**: `playLayoutElements`
- **category**: play
- **type**: multiple
- **possibleValues**: ['deadCrosstable']
- **defaultValue**: false
- **advanced**: true

## Dependencies

None.
