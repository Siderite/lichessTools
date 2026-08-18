# Themes Tool — Context

## Overview

The **ThemesTool** provides a system of visual CSS themes for Lichess that users can select and toggle. It applies theme-specific CSS classes to the body element, loads corresponding CSS files from `tools/themes/*.css`, manages board background variables, and provides a interactive menu button in the dasher_app UI for theme selection.

## Dependencies

- **DetectThirdParties** — Required
- **InterceptEventHandlers** — Required

## Preferences

Two preferences:

1. **`themes`**: category appearance, type multiple (checkboxes), possibleValues ['performance', 'justExplorer', 'mobile', 'slimArrows', 'slimmerArrows', 'flairX', 'lessIcons', 'nonStickyHeader', 'toggleStudyChat', 'pieceDrag', 'noPractice', 'gameMoveList', 'fatGauge', 'fatMove', 'gridBoard', 'adamisko', 'arcade', 'fixThirdParties', 'timeControls', 'firstInteraction', 'noVariants', 'noBullet', 'squares', 'experimental'], defaultValue 'fixThirdParties', advanced yes
2. **`themesMenu`**: category appearance, type single (radio), possibleValues [false, true], defaultValue true, advanced yes

When themes selected: CSS classes `lichessTools-theme_<themeName>` added to body. When themesMenu enabled: a themes menu button appears in dasher_app for user selection.

## Theme Names and Descriptions

| theme | description |
|-------|-------------|
| performance | Performance theme |
| justExplorer | Just Explorer |
| mobile | Mobile theme |
| slimArrows | Slim arrows |
| flairX | Nicer flairs |
| lessIcons | Fewer icons |
| nonStickyHeader | No sticky header |
| toggleStudyChat | Toggle study chat |
| pieceDrag | Nicer piece drag |
| noPractice | No Practice button |
| gameMoveList | Flexible game move list |
| fatGauge | Thick analysis gauge |
| fatMove | Larger analysis move font |
| slimmerArrows | Slimmer arrows |
| gridBoard | Grid board squares |
| adamisko | Vintage Adamisko |
| arcade | Arcade (requires Board Styling) |
| fixThirdParties | Fix third parties |
| timeControls | Hover time controls, formatted in minutes (for example, `60+1` is shown as `1+1` and `15+0` as `¼+0`) |
| firstInteraction | First interaction |
| noVariants | No chess variants |
| noBullet | Hide Bullet chess |
| squares | Squares for circles |
| experimental | Experimental (requires Board Styling) |

## CSS Class Application Mechanism

Themes are applied as CSS classes on body element:
- Each theme → class `lichessTools-theme_<themeName>`
- Body className filtered to remove existing `lichessTools-theme_*` classes, then concatenated with configured themes, joined with spaces
- Applied via `body.attr('class', newClassName)`

CSS files loaded from extension assets at `tools/themes/<themeName>.css`.

## Board Background Management (`setBoardVariables`)

Sets CSS variable `--board-background` on html element:

1. Gets board background image URL via `getBoardBackground`:
   - If customBoardImage option enabled AND not 3D → returns customBoardImage value
   - Otherwise: fetches `/dgt` HTML (if boardChanged) or uses existing html container
   - Extracts preloaded image links (`link[rel=preload][as=image]`) matching png/jpg/jpeg/svg extensions
   - Gets image size via Image.onload promise for each URL (width >100 filter)
   - Collects valid board URLs, selects index 0 (non-3D) or min(1, length-1) (3D)
2. Sets `--board-background` CSS variable on html to `url("backgroundImage")` or 'unset'
3. Toggles body class `lichessTools-hasBoardBackground` based on presence of background

## Board Change Detection (`checkBody`)

Debounced (1000ms) function triggered by body observer on attributes changes:
- Monitors `data-board`, `data-board3d`, `class` attributes
- Detects board change when dataBoard != current attribute OR board DOM element changed OR no --board-background CSS variable set
- Calls `applyThemes(boardChanged)` when detected

## Theme Application (`applyThemes`)

Async function (guarded by `_inApplyThemes` flag to prevent re-entry):
1. Calls `setBoardVariables(boardChanged)`
2. Updates body className with theme classes
3. Calls `toggleFlairX()`

Triggered on hashchange events AND body observer attribute changes when enabled.

## Themes Menu (`themesMenu` option)

When enabled: adds interactive menu in dasher_app for theme selection.

### AddThemesMenu (`addThemesMenu`)

Creates a button in `#dasher_app .subs`:
- Class: `lichessTools-themesMenu`
- Icon: GreaterThan icon
- Text: "Themes" (translated)
- Title: "LiChess Tools - visual themes"
- Click handler: prevents default, calls stored `_soundHandler` (original sound button click handler), then calls `populateThemes()`

### PopulateThemes (`populateThemes`)

Populates the theme selector in `#dasher_app .sub.sound`:
1. Container toggles classes: removes 'sound', adds 'lichessTools-themes'
2. Head button text = "Themes", adds infoIcon link to user manual themes section
3. Removes existing input from content div
4. Creates buttons for each theme in possibleValues list:
   - Sorted by translated text localeCompare
   - Class: `text`, icon: Checkmark
   - Toggles 'active' if currently selected, toggles 'default' if in defaultThemes
   - Text = translated theme description
   - Click handler: prevents default
     - If new theme is arcade/experimental AND boardStyle not enabled → asks via dialog "This theme requires Board Styling for full functionality. Should I enable it?" → if confirmed sets boardStyle=true
     - Updates `this.themes` string (filters current themes, removes old theme or adds new)
     - Toggles active class on clicked button
     - Sets lt.currentOptions['themes'] = this.themes
     - Saves options via lt.saveOptions
     - Calls applyThemes()
5. Setup scrollClasses on selector container

## Scroll Classes (`setupScrollClasses`)

Sets scroll-related classes on containers:
- `can-scroll-up`: true when scrollTop != 0 (with 1px tolerance)
- `can-scroll-down`: true when scrollTop + clientHeight >= scrollHeight - tolerance
- Triggered on scroll event, prop '__scrollClasses' set to prevent re-setup

## flairX Theme Behavior (`toggleFlairX`)

When 'flairX' theme is in themes string:
- Adds pointerenter event listener on document (capture phase) with `flairEnter` handler
- When not enabled: removes the listener

### flairEnter Handler

On pointerenter event:
1. Checks target is DOM element AND NOT img.uflair → proceeds
2. Walks up parent chain (depth < 3, until document.documentElement): adds class `lichessTools-flair-ancestor` to each ancestor element

This enhances flair display by marking ancestor elements when pointer enters near a flair image.

## firstInteraction Theme Behavior (`addFirstInteractionClass`)

When 'firstInteraction' theme enabled:
- Adds click/keydown/touchstart/pointerdown event listener on document
- Handler checks: ev.isTrusted AND navigator.userActivation.hasBeenActive → proceeds
- Adds class `lichessTools-userInteraction` to body
- Removes listener after first trusted activation

## Board Style Theme Detection (`isBoardStyleTheme`)

Themes 'arcade' and 'experimental' are classified as board style themes requiring additional Board Styling functionality. When selecting these without boardStyle enabled, a dialog confirmation is prompted.

## Activation Logic in `async start()`

1. Reads preferences values for themes and themesMenu
2. Unregisters hashchange observer, body observer on checkBody
3. If no value AND not ranStart → returns (no activation)
4. If value present:
   - Registers hashchange event → applyThemes
   - Registers body observer with attributeFilter ['data-board','data-board3d','class'] → checkBody
   - Registers document click/keydown/touchstart/pointerdown events → addFirstInteractionClass
5. Calls applyThemes() immediately
6. Unregisters dasher_app observer on addThemesMenu, removes existing themesMenu button
7. If themesMenu enabled: registers dasher_app observer on div (executeDirect) → addThemesMenu, calls it
