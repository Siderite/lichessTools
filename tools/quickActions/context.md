# Quick Actions Tool

## Purpose

Adds a tooltip on the board menu button (fbt[data-act="menu"]), board-menu-toggle-btn, or chat submit button showing quick action buttons: flip board, request server analysis, read comments toggle, chat emojis, toggle practice. Tooltip appears on mouseenter or contextmenu; cleared on body click.

## Functionality

- Depends on `EmitChapterChange`.
- **quickActions preference**: multiple type with values `flipBoard`, `requestAnalysis`, `emoji`, `practice`. Default: 'flipBoard,requestAnalysis,emoji'. Advanced.
- Upgrades: emoji added in version 2.3.199.

## Tooltip Buttons

- **clearTooltipClass()**: Removes lichessTools-quickActions class from fbt[data-act="menu"], board-menu-toggle-btn, msg-app__convo__post__submit buttons.
- **refreshTooltipDirect(ev)**: Debounced (100ms): positions tooltip at button offsetLeft/offsetTop. Adds/removes buttons based on can*() checks:

  - **readComments**: If AnalysisReadCommentsTool enabled AND analysis exists AND NOT study.relay → adds `<button class="fbt readComments"` Voice icon, title "LiChess Tools - toggle comment reading", click toggles ReadingComments via lt.tools.AnalysisReadCommentsTool.toggleReadingComments(), button toggles dontReadComments class based on storage LiChessTools.dontReadComments. Else removes.

  - **flipBoard**: If options.flipBoard AND lt.getKeyHandler('f') exists → adds `<button class="fbt flipBoard"` ChasingArrows icon, title "LiChess Tools - flip game board", click calls handler(). Else removes.

  - **requestAnalysis**: If options.requestAnalysis AND (serverEval exists+!requested+!root.data.analysis OR form.future-game-analysis exists) → adds `<button class="fbt requestAnalysis"` BarGraph icon, title "LiChess Tools - request server analysis":
    - Click: if serverEval → requests if not requested and no root analysis; removes button; else triggers all future-game-analysis forms submit; removes button. Else removes.

  - **emoji**: If options.emoji AND msg-app__convo__post__text exists → adds buttons for icons: ThumbsUpSign, ThumbsDownSign, SlightlySmilyingFace, SlightlyFrowningFace, PoutingFace, SmilingFaceWithHorns, SparklingHeart — each click appends icon to chat input text. Else removes.

  - **practice**: If options.practice AND analysis.isCevalAllowed() AND NOT gamebookPlay → adds `<button class="fbt practice"` Bullseye icon, title "LiChess Tools - toggle practice", click toggles analysis.togglePractice(). Else removes.

- **enableTooltip(ev)**: Prevents default; toggles lichessTools-quickActions class on ev.currentTarget.
- **initQuickActions()**: Finds buttons (fbt[data-act="menu"], board-menu-toggle-btn, msg-app__convo__post__submit); if exists → clears tooltip class, binds handlers: mouseenter→refreshTooltip, contextmenu→enableTooltip; body click→clearTooltipClass; creates `<div class="lichessTools-quickActions-tooltip"` after button if not exists. If options.isSet=false → removes tooltip.

## Can Checks

- **canReadComments()**: AnalysisReadCommentsTool enabled AND analysis exists AND NOT study.relay → true
- **canEmoji()**: options.emoji AND msg-app__convo__post__text exists → true
- **canPractice()**: options.practice AND analysis.isCevalAllowed() AND NOT gamebookPlay → true
- **canFlip()**: options.flipBoard AND lt.getKeyHandler('f') exists → true
- **canRequestAnalysis()**: options.requestAnalysis AND (serverEval+!requested+!root.data.analysis OR form.future-game-analysis exists) → true

## Events/Observer

- On `lichessTools.chapterChange`: initQuickActions
- Body observer on events: div.analyse__controls, button.fbt[data-act="menu"], button.board-menu-toggle-btn, button.msg-app__convo__post__submit, .main-board cg-board, .msg-app__convo → initQuickActions

## Preference

- **name**: `quickActions`
- **category**: general
- **type**: multiple
- **possibleValues**: ['flipBoard', 'requestAnalysis', 'emoji', 'practice']
- **defaultValue**: 'flipBoard,requestAnalysis,emoji'
- **advanced**: true

## Dependencies

`EmitChapterChange`
