# CustomChatButtons Tool

## Purpose

Lets a player set the quick chat buttons that appear under the game chat — the short label shown in the preset row and the message it posts when clicked. The buttons are edited in a proper dialog editor opened from the chat, one list for the start of the game and one for the end. Writing configuration text into the chat box is gone.

## How It Works

### Stored buttons

- `lt.currentOptions['customChatButtons.buttons']` = `{ start: [...], end: [...] }`, each button a `short/long` string (`hi/Hello`): the label in the chat preset row, and the text posted on click. The same key and format the old version used, so existing saved lists survive.
- Defaults match Lichess's own presets: start `hi/Hello`, `gl/Good luck`, `hf/Have fun!`, `u2/You too!`; end `gg/Good game`, `wp/Well played`, `ty/Thank you`, `gtg/I've got to go`, `bye/Bye!`.
- An empty group means no buttons for that phase, so a player can hide a whole phase.

### Chat buttons

- `start()` keeps a 1s `discoverChat()` interval while the preference is on; when it is off it removes the gear button and any open editor dialog.
- `discoverChat()` works on `section.mchat div.mchat__presets`: Lichess's own `[data-role]` buttons are left alone, the plain spans are updated/removed/appended to match the stored list for the current phase, and a single gear button (`span.lichessTools-editButton`, `data-role="editButtons"`, `data-icon` `lt.icon.Gear`) is appended.
- Clicking a preset span posts its `title` through `lt.uiApi.chat.post()`; Lichess's own click handlers are dropped with `lt.removeEventHandlers()` so only ours answer.
- The phase is `start` or `end`, tracked per page and re-detected in `detectGroup()` from the first preset span Lichess renders itself (its `gg` button marks the end phase). Spans we touched carry an `isCustomized` flag and are skipped by the detection.

### Dialog editor

- `configureButton(ev)` bails while an editor is already open and defers `showEditor()` by 100ms, so the chat click does no heavy work.
- `showEditor()` removes any stale `dialog.lichessTools-customChatButtons`, opens the modal with `await lt.dialog({ header, help, noDrag: true })` from the Dialog tool, marks it `lichessTools-customChatButtons` with `$(dialog).addClass(...)`, and must call `dialog.showModal()`.
- Two sections `div.buttons-group[data-group="start|end"]`, each with an `<h3>` caption, a `div.group-actions` holding the `+` add button and the `Reload` restore-defaults button, and one `div.button-row[data-group]` per button: `input.label-input` (a real `maxlength="4"` attribute, so typing cannot overflow the preset label) + `input.text-input` + a `Trash` delete button.
- Every row's inputs are bound to `fieldChanged` (`this.lichessTools.debounce(this.saveEditorState, 250)`) on `input change`, so typing saves as you go and the chat buttons under the dialog update through `discoverChat()`; empty rows are skipped, and `makeButton()` strips `/` from labels and caps them at 4 chars.
- `readEditor()` reads the dialog back into the stored `{ start, end }` shape in DOM order; `updateButtons()` compares with the current value, writes it through `saveButtons()` and re-renders the chat. `fireReloadOptions()` is deliberately not fired: nothing else reads this key, and restarting every tool on each keystroke is far too heavy.
- The dialog's `close` event runs `saveEditorState()`, so the X button (or Lichess's Escape-to-close) applies what you see; `closeEditor()` closes and removes the element after the save, and the Dialog factory removes a closed dialog 100ms later.

## Removed from the old design

- The chat box configuration channel: `getButtonRegex()`, the `input.mchat__say` `change keyup paste` watcher, the placeholder swap, the `lichessTools-editButtons`/`lichessTools-deleteButtons` classes, the add/delete/edit mode toggles, `setEditMode()`, `jiggle()` and the `editButtonsPlaceholder` hint styling. Only the `editButtonsPlaceholder` translation key is kept so the Crowdin table stays in sync.

## Dependencies

- DetectThirdParties, InterceptEventHandlers — remove Lichess's own click handlers on the preset spans.
- Dialog — the shared `lt.dialog` factory that builds the editor modal.

## Preferences

- `customChatButtons` — single type (false/true), default false, needsLogin: true, category: play

## Key Methods

- `discoverChat()` → matches the preset spans to the stored list for the phase, creates the gear button
- `detectGroup(presets)` → re-reads the phase from Lichess's own preset buttons
- `clickHandler(ev)` → posts the button's message in the chat
- `configureButton(ev)` / `showEditor()` → open the dialog editor for both phases
- `appendRow(container, phase, str)` → builds one editable row
- `resetGroup(phase, container)` → restores the default buttons of a phase
- `readEditor($dialog)` → reads the dialog rows back into the stored format
- `saveEditorState()` / `fieldChanged` → debounced save while the dialog is open
- `closeEditor()` → closes and removes the dialog (the close event saved first)
- `updateButtons(buttons)` / `saveButtons(buttons)` → persist and refresh the chat
- `getDefaultButtons()` / `getStoredButtons()` / `getButtons(group)` → defaults, the saved list and the parsed `{short,long}` form
- `splitButton(str)` / `makeButton(short, long)` → read a stored button apart and build one back safely
