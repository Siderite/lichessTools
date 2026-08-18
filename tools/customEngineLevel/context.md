# Custom Engine Level Tool — Context Summary

## Overview

The **CustomEngineLevelTool** allows users to customize the depth (analysis level) of Lichess's chess engine evaluation in analysis mode and practice mode. It also provides options to ignore cloud data, enable infinite external analysis, apply settings in practice mode, fix 503 errors from external engines, and a "plus" shortcut for going deeper.

## Dependencies

- **EmitRedraw** — Needed for board redraw events
- **EmitCeval** — Needed for cloud evaluation events

## Preferences

| Preference | Type | Category | Description |
|------------|------|----------|-------------|
| `customEngineLevel` | number | analysis | Custom depth for the main analysis engine (0–50) |
| `customEnginePracticeLevel` | number | analysis | Custom depth for practice mode engine (0–15, limited by Lichess) |
| `customEngineOptions` | multiple | analysis | Set of options: noCloud, noCloudExternal, infiniteExternal, practice, fix503, plus |

### customEngineOptions values:
- **noCloud**: Ignore cloud data for evaluation (cloud-eval results are not shown)
- **noCloudExternal**: Ignore cloud data specifically for external engines
- **infiniteExternal**: Infinite analysis depth for external engines (depth = 99)
- **practice**: Apply custom engine settings in Practice mode
- **fix503**: Fix external engine 503 errors — when a 503 error occurs, the tool retries `goDeeper()` after 5 seconds cooldown
- **plus**: Bind the '+' keyboard shortcut to trigger `goDeeper()` (push analysis deeper)

## Functionality

### Depth Control
The tool sets a custom depth value for the Lichess engine. When the current evaluation depth is below the target depth, it triggers `analysis.ceval.goDeeper()`. The depth slider UI appears in the analysis action menu with range 0–50. For practice mode, a separate slider (0–15) is available when the "practice" option is enabled.

### Cloud Data Ignoring
When `noCloud` or `noCloudExternal` is set:
- The tool wraps `analysis.evalCache.fetch` to return `false` in the before function (preventing cloud fetch)
- It wraps `analysis.explorer.fetchTablebaseHit` to reject with "Cloud disabled" in the after function
- The analysis UI gets a `lichessTools-noCloud` class toggle on `.tview2`

### Infinite External Analysis
When `infiniteExternal` is set and an external engine is active, depth is forced to 99.

### Practice Mode Application
When `practice` option is enabled, custom depth settings apply in practice mode (both regular analysis and study practice). A separate "practiceDepth" preference can override the main depth for practice only.

### 503 Error Fix
When `fix503` is set: wraps `analysis.ceval.engineFailed`. When an error message contains "Status 503", it triggers `goDeeper()` to restart the engine, with a 5-second cooldown between retries.

### Plus Shortcut
When `plus` is set: binds '+' keyboard shortcut to call `goDeeper()`, which sets `analysis.node.autoDeeper = 99` and forces deeper analysis.

## DOM UI Elements

The tool creates UI elements in the analysis action menu (`div.analyse__tools div.action-menu .inner`):
- **lichessTools-separator**: A heading "LiChess Tools" separating its controls from Lichess native controls
- **abset-noCloud**: Toggle checkbox for ignoring cloud data
- **abset-noCloudExternal**: Toggle checkbox (only visible when external engine is active) for ignoring cloud on external engines
- **abset-engine-depth**: Range slider (0–50) for custom analysis depth
- **abset-practice**: Toggle checkbox for applying settings in practice mode
- **abset-practice-depth**: Range slider (0–15) for practice mode depth (disabled when practice option is off)

## Function Wrapping

The tool wraps several Lichess analysis functions with id `'customEngineOptions'`:
- `analysis.evalCache.onLocalCeval` — before function calls `determineCevalState()` to decide whether to go deeper
- `analysis.evalCache.fetch` — before/after functions block cloud fetch when noCloud is set
- `analysis.explorer.fetchTablebaseHit` — after function rejects when noCloud is set
- `analysis.ceval.engineFailed` — before function handles 503 errors with retry logic
- `analysis.actionMenu.toggle` — after function triggers `analysisControls()` after toggle
- `analysis.instanciateEvalCache` — after function calls `wrapEval()` to reapply wraps

## determineCevalState Logic

This method evaluates whether the engine should go deeper or stop:
- Checks if practice mode is running and whether "practice" option applies
- Compares current depth vs target depth (autoDeeper or custom depth)
- If idle state and can go deeper, triggers `goDeeper()` when conditions match (cloud ignored, depth insufficient, infinite external active)
- If depth reached target, sets autoDeeper to undefined and stops worker if needed

## Key Handlers

The tool unbinds the native '+' key handler. When "plus" option is enabled, it rebinds '+' to `goDeeper()`.

## Global Interval

A 5-second interval runs `determineCevalState()` continuously to monitor evaluation state and trigger deeper analysis when needed.