# Study Learn From Mistakes Tool

## Purpose

Adds a "Learn from your mistakes" button in the study advice summary area, enabling retro mode analysis where computer variations are highlighted to help identify mistakes.

## Functionality

- Requires logged-in user (`needsLogin: true`). Advanced preference (`advanced: true`).
- Depends on `EmitRedraw` and `EmitChapterChange`.
- **toggleRetro()**: Activates retro mode in the analysis system. If retro already exists, toggles it off; otherwise:
  - Sets initial node eval to `{ cp: 20 }` if missing
  - For each mainline node with children, asserts path set and finds a computer child (via `ch.comp` or `ch.ltComp`, or by matching SAN in lichess comment)
  - Marks found children as `comp=true` and `ltComp=true`
  - Then toggles retro mode and redraws
- **handleButton()**: Checks `div.advice-summary` container. If no button exists, creates one with PlayTriangle icon, "Learn from your mistakes" text, click handler calling toggleRetro(). Inserts after the first side div. Toggles 'active' class based on whether retro is currently active.
- **closeRetro()**: If retro is active, toggles it off and redraws.

## Events

- On `lichessTools.chapterChange`: closes retro mode (study chapter changed → retro should be reset)
- On `lichessTools.redraw`: handles button state (active/inactive toggle)

## Preference

- **name**: `studyLearnFromMistakes`
- **category**: study
- **type**: single (on/off)
- **defaultValue**: false
- **advanced**: true
- **needsLogin**: true

## Dependencies

`EmitRedraw`, `EmitChapterChange`
