# CustomChatButtons Tool

## Purpose

Customizes chat preset buttons in the mchat area. Allows users to add/delete/edit chat buttons with short/long format (e.g., "HF/Have fun!"). Provides edit mode and delete mode toggles via special buttons in presets list.

## How It Works

### Default Buttons

- **start**: ['hi/Hello', 'gl/Good luck', 'hf/Have fun!', 'u2/You too!']
- **end**: ['gg/Good game', 'wp/Well played', 'ty/Thank you', "gtg/I've got to go", 'bye/Bye!']

### Button Format

Each button is `short/long` format where short is 2-4 letters (Unicode letters/numbers), long is Unicode letter text. Regex: /^([\p{L}\p{N]{2,4})\/(\p{L}.*)$/u

### Discover Chat

On `section.mchat div.mchat__presets`:
- Updates existing buttons to match stored button list via lt.currentOptions['customChatButtons.buttons']
- Removes missing buttons, adds new ones before addButton span
- Creates addButton (Plus icon), deleteButton (X icon), editButton (Gear icon) in presets

### Edit Mode

When editMode='edit':
- chatInput placeholder changed to "button/text (ex: SL/Salut!)"
- Chat toggles lichessTools-editButtons class
- Click on preset button → parses chatText via regex, updates button at index position

### Delete Mode

When editMode='delete':
- chatInput placeholder restored to old value
- Chat toggles lichessTools-deleteButtons class
- Click on preset button → removes button from list (except addButton), saves remaining buttons or defaults if empty

### Add Button

Click on addButton span:
- Parses chatText via regex → creates new item with short/long, pushes to groupButtons list, saves buttons

### Chat Input Customization

ChatInput gets change/keyup/paste handler that toggles addButton disabled class based on regex match validity.

### Group Detection

Auto-detects start vs end group: if first preset span text matches defaultButtons.end[0] short → switches to end group.

## Dependencies

- DetectThirdParties, InterceptEventHandlers (to remove original click handlers)

## Preferences

- `customChatButtons` — single type (false/true), default false, needsLogin: true, category: play

## Key Methods

- `discoverChat()` → manages preset buttons list, creates special buttons
- `clickHandler(ev)` → handles preset button clicks in normal/edit/delete modes
- `addButton(ev)` → adds new button from chatText input
- `deleteButton(item)` → removes button from stored list
- `updateButton(item)` → updates/adds button to stored list
- `setEditMode(mode)` → toggles edit/delete mode with placeholder changes
