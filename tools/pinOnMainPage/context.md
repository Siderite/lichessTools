# Pin On Main Page Tool

## Purpose

Allows pinning broadcasts/studies to the lichess home page (lobby side), with a toggle button on the study/broadcast sidebar and unpin buttons in the pinned list.

## Functionality

- Advanced preference (`advanced: true`). Default enabled (`defaultValue: true`).
- **pinCurrentStudy()**: Pin/unpin the current study:
  - Gets studyId from `study.data.id`, tourName from `relayData.tour.name` if present
  - Study name = (tourName + ' ') + study data name
  - If already pinned → removes from pinned list; else → adds to pinned list
  - Saves to storage key `LichessTools.pinnedStudies`
  - Calls addPin() to update button state
- **unpinStudy(studyId)**: Removes the study from pinned list, saves to storage.
- **addPin()**: Adds a pin button in study sidebar (`div[role=tablist]`) or relay tour header (`relay-tour__side__header`):
  - PushPin icon, title "LiChess Tools - pin on home page"
  - Click handler calls pinCurrentStudy()
  - Inserts after downloadBroadcastPgn button/search button/relay-tour side name
  - Toggles `lichessTools-pinned` class based on pinned status
  - When disabled: removes the button
- **addToHomepage()**: Creates a pinned list in lobby side (`lobby__side`):
  - `<div class="lichessTools-pins"` container
  - For each pinned study, creates an `<a>` with href `/study/studyId`, title "LiChess Tools - studyName", PushPin icon
  - Each element has inner span with name text and unpin button (Cancel icon, title "LiChess Tools - unpin from home page")
  - Unpin click handler: removes the pinned element from homepage

## Preference

- **name**: `pinOnMainPage`
- **category**: appearance
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: true
- **advanced**: true

## Dependencies

None.
