# OBS Integration Tool — Context Summary

## Purpose

Integrates lichess study broadcasts with Open Broadcaster Software (OBS) via WebSocket, allowing automatic scene switching when study chapters change.

## Dependencies

`EmitChapterChange`, `EmitRedraw`

## Preferences

| Name | Category | Type | Default | Advanced | Hidden |
|------|----------|------|---------|----------|--------|
| `obsIntegration` | integration | single (true/false) | false | yes | no |

## Architecture

The tool extends `LiChessTools.Tools.ToolBase`. It manages OBS WebSocket connection and scene mappings for study chapters.

### Setup Storage

Setup data stored in localStorage under key `LichessTools.obsIntegration`, organized as a dict keyed by **studyId**:
```
{ url: 'ws://127.0.0.1:4455', password, connectOptions, mappings { chapterKey → sceneName }, disabled }
```

Defaults: URL = `ws://127.0.0.1:4455`, password/options undefined, mappings empty, disabled = true.

### Chapter Key

Uses `chapter.name` as the mapping key (`_chapterKey = 'name'`).

### isBroadcast / isBoardListView

- `isBroadcast(study)` = `!!study?.relay` — checks if study has a relay (broadcast).
- `isBoardListView()` = `!!study.relay?.tourShow()` — checks if board is in tour/show mode.

### getSceneName

Returns the scene name to switch:
- If boardListView → uses default mapping (`setup.mappings[this._defaultName]` where `_defaultName = '_default_`).
- Otherwise → current chapter's mapped scene, fallback to default mapping.

## UI Elements

### OBS Button

A `span.lichessTools-obsSetup` button added in two locations:
1. `nav.relay-tour__tabs` — text "OBS", icon info circle, role tab.
2. `div.study__buttons div.left-buttons.tabs-horiz` — circled Latin capital letter Y icon.

Button behavior:
- **Left click (which=1)** → opens OBS setup dialog (`showObsSetup`).
- **Right click (which=3)** → toggles disabled state (`toggleButton`).
- Keyboard shortcut `O` binds to toggleButton when button is added.

### Disabled State

`refreshObsButtonState(disabled)` toggles `.disabled` class on the span, updates title text ("OBSTitle" or "OBSTitleDisabled").

## OBS Setup Dialog

`showObsSetup()` creates a `<dialog class="lichessTools-obsSetup>` with:
- Help button (link to siderite.dev blog manual)
- Close button
- Scrollable content area with:
  - **Mappings section**: default scene label + select dropdown, then per-chapter labels + select dropdowns. Each select maps chapter → OBS scene name.
  - **Advanced section**: URL input, password input (with toggle eye icon to show/hide), options text input.
  - **Action buttons**: Save button (`btnSave`).

Dialog hash: `#obsSetup`. Hashchange handler closes dialog when hash changes away from `#obsSetup`.

### saveSetup(dialog)

Extracts values from dialog inputs, builds setup object with mappings from select dropdowns (only non-empty values). Saves to storage dict keyed by studyId. Clears optionsSet flag, closes dialog.

### getSetup()

Retrieves stored setup for current studyId, merges with defaults.

## Scene Fetching

Via `lt.comm.send({ type: 'getScenes', options: { url, password, connectOptions } })` → returns `scenes.sceneNames`. Used to populate select dropdowns in the dialog.

## Event Handlers

### chapterChange(chapterId)

On `lichessTools.chapterChange` pubsub event:
- Checks isBroadcast + setup not disabled.
- Gets scene name for current chapter.
- Sends `lt.comm.send({ type: 'sceneChange', sceneName, options })` to service worker (which connects to OBS WebSocket).

### refreshUI(setup)

On `lichessTools.redraw` pubsub event:
- Refreshes OBS button presence/state.
- If boardListView state changed → triggers chapterChange.

### hashchange

Handles global hashchange: opens dialog if `#obsSetup`, removes dialog otherwise.

## Start / Stop

- **Start**: checks isBroadcast, reads preference value. On enabled: binds to `chapterChange` and `redraw` pubsub events, binds key handler 'O', adds OBS button, handles hashchange. Sends disconnect via comm if disabled.
- **Stop**: unbinds all pubsub/key handlers, removes OBS button/dialog, sends disconnect command.