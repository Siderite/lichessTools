# CustomBoardImage Tool

## Purpose

Allows users to set a custom board background image via URL. Creates a button in the dasher app board selection area, opens a dialog prompt for URL input with combo filtering from boards.json data, and injects CSS style to apply the custom image as cg-board::before background.

## How It Works

### Board Image CSS Injection

When customBoardUrl is set:
- Creates `<style id="lichessTools-customBoardImage">` in head with `body.lichessTools .is2d cg-board::before { background-image: url("${url}") }`
- Also stores initStyleStr with !important version in localStorage for recovery

### Board Selection Button

On `#dasher_app .sub.board.d2 .list`:
- Creates `<button class="lichessTools-customBoardImage">` when collapsed and customBoardUrl exists
- Click → opens dialog prompt via lt.uiApi.dialog.prompt for URL input with combo filtering from boards.json data
- Combo select → sets body CSS --board-background to url
- Change/paste → validates URL.canParse(), sets CSS if valid

### More Button Toggle

On `button.more` in board list parent:
- Click → toggles collapsed state, manages customBoardImage button visibility

### Existing Board Buttons Customization

Each existing board button gets click handler that clears customBoardUrl and activates the selected board.

### Recovery Observer

MutationObserver on html link[rel="stylesheet"][href*="/site."] and cg-board:
- If style#lichessTools-customBoardImage not present, restores from localStorage stored initStyleStr

## Dependencies

None explicitly listed. Depends on `lt.uiApi.dialog`, `lt.comm.getData`.

## Preferences

- `customBoardImage` — text type, default '', offValue: '', advanced/true, category: appearance

## Key Methods

- `updateBoardImage(forced)` → injects CSS style for custom board image
- `chooseCustomBoardImageUrl()` → opens dialog prompt with combo filtering for URL input
- `addCustomBoard()` → manages board selection buttons in dasher app
- `async init()` → sets up recovery observers for style restoration
