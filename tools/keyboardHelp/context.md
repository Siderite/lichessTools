# KeyboardHelp Tool — Context Summary

## Purpose

The **KeyboardHelpTool** injects a "LiChess Tools" section into lichess's keyboard help dialog (`div.keyboard-help > table tbody`) listing keyboard shortcuts from various LiChess tools. It dynamically adds rows based on active tool preferences and analysis state.

## Dependencies

- **KeyShortcuts**, **AdditionalGlyphs**, **ExplorerPractice**, **SearchMovesCommand**

## Preferences

- **name**: `keyboardHelp`
- **category**: `analysis`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `true`
- **offValue**: `false`
- **advanced**: true
- **hidden**: true

When set to `true`, binds analysis.closeAll event and processes help table. When false, unbinds event.

## How It Works

### Help Table Processing (`processHelp`)
Timeout 500ms → checks table exists + !table[0].hasLichessTools → sets flag. Creates title row "LiChess Tools" with class `lichessTools-title`. Then creates rows based on active preferences:

### Row Creation Functions
- **title(text, className)**: `<tr><th colspan="2"><p></p></th></tr>` appended to table, class className, p text = trans.noarg(text)
- **row(keys, text)**: `<tr><td class="keys"></td><td class="desc"></td></tr>` appended. tdKeys: each key → if starts with '!' → `<then>` element for next action; else → `<kbd>` HTML element. tdDesc = trans.noarg(text)

### Shortcut Rows Added (conditional):

#### KeyShortcuts active (`lt.currentOptions.getValue('keyShortcuts')`):
- b, m, i keys existing in table → parent tr with single kbd → class `lichessTools-disabled`, title "see LiChess Tools section below"
- **b**: nextBlunder
- **m** (if !analysis.retro): nextMistake
- **i**: nextInaccuracy
- **g**: nextGood/brilliant/interesting
- **alt+b**: nextOpponentBlunder
- **alt+m**: nextOpponentMistake
- **alt+i**: nextOpponentInaccuracy
- **alt+g**: nextOpponentGood

#### AdditionalGlyphs slow active + !obsSetup + moveCentis + !correspondence:
- **o**: nextSlow move
- **alt+o**: nextOpponentSlow move

#### Variation/CEval/Explorer lines:
- **.** + !then + 1-9: N-th variation line
- **ctrl+.** + !then + 1-9: N-th computer evaluation line
- **shift+.** + !then + 1-9: N-th Explorer line

#### FreezeBoard (`spaceDisabled` active):
- **`** + !then f: freeze board
- space key existing → class `lichessTools-disabled`, title "see LiChess Tools section below"
- **ctrl+space**: bestCevalLine

#### Computer analysis button/round-training advice-summary a.button exists:
- **r**: request computer analysis, Learn from your mistakes

#### chapterNavigation active + random chapterControls button exists:
- **`** + !then r: random study chapter

#### toggleSiteHeader:
- **`** + !then h: toggle site header (works everywhere)

#### ongoing analysis:
- **backspace**: jump to current position

#### explorer enabled:
- **shift+t**: switchExplorerTabs (cycle Lichess/Masters)

#### copyFen:
- **ctrl+c**: copy FEN to clipboard

#### ctrlArrows active (`lt.currentOptions.getValue('ctrlArrows')`):
- **ctrl+→**: randomMove variation move
- **ctrl+←**: previousPosition back to previous position

#### explorerPractice active + explorer enabled:
- **shift+l**: explorerPractice
- if isRunning: **h**: explorerPracticeHideMoves toggle → h key existing → class `lichessTools-disabled`, title "see LiChess Tools section below"

#### obsIntegration active + obsSetup span exists:
- **o**: toggle OBS integration for this broadcast

#### SearchMovesCommand canSearch():
- **ctrl+f**: search in move list

#### customEngineOptions plus set + cevalEnabled():
- **plus**: analyse deeper

### Initialization (`start()`)
Checks lichess + uiApi exist. Reads keyboardHelp value from `lt.currentOptions`. Logs option. Unbinds analysis.closeAll event. If !value: returns. Otherwise: binds analysis.closeAll event → processHelp.