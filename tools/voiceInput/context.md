# VoiceInput Tool — Context

## Overview

The **VoiceInputTool** provides speech-to-text functionality for entering study comments on Lichess. It uses the browser's native SpeechRecognition API to allow users to dictate text into comment fields via a microphone button.

## Dependencies

- None explicitly listed (uses general browser APIs)

## Preferences

| name | category | type | possibleValues | defaultValue | advanced |
|------|----------|------|----------------|--------------|----------|
| `voiceInput` | general | multiple (checkboxes) | ['studyComments'] | '' (none selected) | yes |

Only one option available: `studyComments`. When selected, voice input is enabled for study comment editing. When not selected, the feature is disabled.

## Browser Support Constraints

SpeechRecognition (`window.SpeechRecognition` or `window.webkitSpeechRecognition`) only works on certain browsers:
- **Supported**: Chrome, Chromium-based browsers (Edge)
- **NOT supported**: Firefox, Brave, Vivaldi, DuckDuckGo, Safari (non-Chromium)
- Brave browser specifically blocked via `navigator.brave` check

The tool returns null if the browser is not supported.

## SpeechRecognition Configuration

When recognition is available:
- Language: `"en-US"`
- Continuous mode: enabled (keeps listening)
- Interim results: disabled (only final results emitted)

## Event Handler System (`handlers`)

A Map-based event handler registry for speech recognition events:
- `on(name, f)` — adds a handler function to an event name's list
- `off(name, f)` — removes specific handler; `off(null)` clears all handlers
- `emit(ev)` — dispatches event to all registered handlers

Events emitted by SpeechRecognition:
- **`input`** — contains `text` (the transcript from recognition results)
- **`error`** — contains `error`, `message` (from recognition error events)

## Study Comments Setup (`setupStudyComments`)

Triggered when `.study__comments .form3` DOM element appears (via body observer):
1. Checks if a voice button already exists — skips if present
2. Registers handlers:
   - **error handler**: toggles `lichessTools-error` class on button for 2 seconds, then removes it
   - **input handler**: inserts received text into `#comment-text` via `insertText()`
3. Creates a `<button>` with:
   - Class: `lichessTools-voiceInput`
   - Icon: `lt.icon.Mic` (microphone icon)
   - Title: translated "Voice input" string
4. Event bindings:
   - **pointerdown**: prevents default, calls `startInput()` to begin recording
   - **pointerup / pointercancel**: calls `endInput()` to stop recording
5. Appends button to the study comments form container

## Start/End Recording

- `startInput()`: sets `_inputStarted=true`, calls `recognition.start()`
- `endInput()`: checks `_inputStarted` is true, sets false, calls `recognition.stop()`

## Activation Logic

In `async start()`:
1. Reads preference value for `voiceInput` → determines `studyComments` option status
2. Removes any existing voice button from DOM (cleanup)
3. Unregisters body observer on `.study__comments`
4. If option is set AND recognition available:
   - Creates SpeechRecognition instance with config above
   - Sets `onresult` handler → emits `input` event with transcript
   - Sets `onerror` handler → emits `error` event
   - Registers body observer on `.study__comments` to trigger setupStudyComments
   - Calls setupStudyComments immediately
5. If option not set: clears all handlers (`off()`)
