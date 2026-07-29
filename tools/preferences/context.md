
Debug builds also allow `filesystem`. Mismatch between this order and discovered categories logs a console warning.

Footer action buttons:

- Legend: blue border = default value
- **Reset** - all prefs to defaults (logged-in vs not-logged-in defaults)
- **All off** - each pref to `offValue` or `false` (skips pure hidden prefs without `offValue`)
- **Backup** - download JSON (`[userId_]lichessToolsOptions_<timestamp>.json`), includes `userId`
- **Restore** - file picker, `JSON.parse`, `applyOptions`, reload UI

## Preference Model (from other tools)

Each tool may define `preferences: [{ ... }]`. Fields used by this UI:

| Field | Role |
|-------|------|
| `name` | Option key in `currentOptions`; section `data-pref` |
| `category` | Group key; title via `options.<category>` |
| `type` | `single` \| `multiple` \| `number` \| `select` \| `text` \| `folder` \| `file` |
| `possibleValues` | Radios/checkboxes values, or `[value,label]` pairs for select |
| `defaultValue` | Default when logged in |
| `defaultNotLoggedInValue` | Optional alternate default when logged out |
| `offValue` | Explicit off for "All off" (else false) |
| `advanced` | Hidden unless Advanced preferences is on |
| `hidden` | Hidden unless debug mode |
| `needsLogin` | Hidden when logged out (unless debug) |
| `wip` | Sepia + "WIP" label in advanced mode |
| `author` | Italic "by X" on the section title |
| `valuePrefix` | i18n key prefix instead of `name.` |
| `fileDescription` / `fileExtension` | File picker filters |

Translation keys: `options.<name>`, `options.<category>`, and for enum values `name.val` or `valuePrefix.val` (booleans use `yes`/`no`).

### Control types rendered

- **single**: radio group per `possibleValues`
- **multiple**: checkbox group; stored as comma-separated string (or true/false if single token)
- **number**: number input
- **select**: `<select>` from `[value, label]` pairs
- **text**: text input
- **folder**: readonly text + directory picker + clear; handle stored IndexedDB `lichessTools/LT/<name>-folder`
- **file**: same with open-file picker / fallback `<input type="file">`; key `...-file`

Default-matching option cells get class `defaultValue` (blue border).

## Save Path

On change (debounced 500 ms):

1. Read checked values or input value into `currentOptions[name]`
2. Coerce `"true"`/`"false"` strings to booleans
3. If name is `enableLichessTools` or `advancedPreferences` -> `lt.applyOptions`; else `lt.saveOptions`
4. `lt.fireReloadOptions()` so tools re-`start`
5. Update global-switch UI and advanced body class
6. Flash "preferences saved" for 2 s

## Filter and Categories

- Filter tokenizes on whitespace; a pref is shown if every token appears in a combined string of name, category, translated titles, and possible value keys.
- Classes: `filteredIn` (matched while filtering), `filteredOut` (hidden).
- Category checkbox `chk_<key>` collapses sections; Expand all toggles all category checkboxes.
- CSS: category blocks hidden until they contain a normal preference, a filter match, or advanced mode is on.
- Advanced mode body class `lichessTools-advancedPreferences` reveals `.lichessTools-advancedPreference` sections.
- Global disable: form sections under prefs get `pointer-events: none; opacity: 0.5` via `body.lichessTools-globalDisable`.

## Info Links

`addInfo` appends to each section `h2` an external link to  
`https://siderite.dev/blog/lichess-tools---user-manual/#<prefName>`.

## Unused / Peripheral Code

- `sendMessageToDev(msg)` opens a Lichess websocket and sends a private message to `totalnoob69` (not wired to the visible feedback inbox link).
- Special case: changing `soundVoice` select also sets `lt.speechVoiceIndex` and speaks a sample line.

## Design Notes for Future Changes

- Preferences page hijacks the Teams "all teams" page DOM; hash routing is required.
- CSS must remain usable without `body.lichessTools` so users can re-enable the extension when globally off.
- `applyOptions` vs `saveOptions` distinction matters for global/advanced switches (immediate full apply).
- "All off" does not clear hidden prefs without `offValue`; global enable flag is separate from individual feature prefs.
- Folder/file prefs store browser File System Access API handles in IndexedDB, not paths in the options JSON; backup JSON will not recreate those handles.
- Category order array is the source of truth for display order; new categories need an entry there.
- Deep-link scroll retries until the section exists (advanced/filter may delay visibility).