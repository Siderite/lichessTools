# Crowdin Tool

## Purpose

Adds a "Translate LiChess Tools" link to the language submenu in the dasher app, and loads additional translations from Crowdin project data.

## How It Works

### Translation Link

On `#dasher_app .sub.langs` element appearing (via MutationObserver):
- Adds `<a class="help text lichessTools-helpTranslate">` with:
  - href: https://crowdin.com/project/lichess-tools
  - target: _blank
  - icon: Tools icon
  - text: "Translate LiChess Tools"

### Translation Loading

If HTML lang attribute doesn't start with 'en':
- Fetches `crowdin.json` via comm getData
- Adds each language's translations to `lt.intl[lang+'-crowdin']` as additional translation layer
- Logs loaded count or warns if failed

## Dependencies

None explicitly listed. Depends on `lt.comm.getData`.

## Preferences

- `crowdin` — single type (false/true), default true, category: languages

## Key Methods

- `addHelpTranslateLink()` — adds Crowdin translation link
- `async loadTranslations()` — loads Crowdin JSON translations
- `async start()` — sets up observer, loads translations if enabled
