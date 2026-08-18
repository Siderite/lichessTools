# Auto Analyse Game Tool — Context

## Overview

The **AutoAnalyseGameTool** automatically navigates the user to the analysis page when their game ends, based on the game outcome. It also provides a button to manually request computer analysis and navigate to analysis if no automatic outcome preference is set.

## Preferences

- **name**: `autoAnalyseGame`
- **category**: `play`
- **type**: `multiple` (checkboxes)
- **possibleValues**: `[loss, draw, win, showRequestAnalysis]`
- **defaultValue**: `false` (disabled by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)
- **needsLogin**: `true` (requires logged-in user)

## Behavior

### Outcome Detection (`checkEndGame`)

Triggered on the `lichessTools.uiApi.socket.events.endData` event:

1. Checks if body class `.playing` exists — if not, resets retries counter and returns (game already ended or not playing).
2. Checks for result element (`.result-wrap .result`) AND analysis button href (`a.fbt.analysis`). If neither present: retries up to 8 times with 500ms delay between checks.
3. When both result and analysis href are found:
   - Determines outcome based on winner:
     - Extracts winner's user link href from `.game__meta__players .player.[winner] a.user-link`.
     - Parses userId from regex `/\/@\/(?<userId>[^\/\?#]+)/`.
     - Compares winner userId (lowercased) against current logged-in userId:
       - **win**: if winner is the user
       - **loss**: if winner is opponent
       - **draw**: if no winner (`ev.winner` undefined/null)
4. If outcome preference is set (`this.options[outcome]`): navigates to analysis page via `lt.global.location.href = href` (where href is from `a.fbt.analysis`).

### Request Analysis Button (`showRequestAnalysis`)

- When the user won/lost/drew but none of those outcome preferences are set, AND `showRequestAnalysis` preference is enabled:
  - Creates a button in `.round__side`:
    - Class: `lichessTools-requestAnalysis`
    - Icon: `lt.icon.BarChart`
    - Text: "Request a computer analysis"
  - When clicked:
    - Extracts game ID from analysis href via regex `/\/(?<id>[^\/?#\s]+)/`.
    - Calls `lt.api.game.requestAnalysis(gameId)` to request server computer analysis.
    - Sets storage `analysis.panel` to `"computer-analysis"` (raw=true).
    - Navigates to the analysis page.

## Retry Mechanism

- If result element and analysis href are not immediately available after endData event: retries up to 8 times with 500ms setTimeout delay between each check.
- Resets retry counter when body loses `.playing` class or when both elements found.

## Event Handling

When enabled (any outcome preference OR showRequestAnalysis):
- Listens to `lichessTools.uiApi.socket.events.endData` → triggers `checkEndGame`.

## Cleanup on Disable

When preference is off:
- Removes `endData` event listener.
- Resets retries counter.
- Removes `.lichessTools-requestAnalysis` button if present.

## Login Requirement

- Requires logged-in user (`lt.getUserId()` must exist). If not logged in, disabled with console debug message.