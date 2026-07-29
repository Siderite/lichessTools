# Sticky Study Settings Tool

## Purpose

Persist study settings (chapter form values) and position/move path across study sessions. When opening/editing a chapter, fills the form with previously saved settings; when saving, stores them. Also saves current chapter+path position per study, restores it on reload if not from hash or gamebook play/game playing.

## Functionality

- Requires logged-in user (`needsLogin: true`). Advanced preference (`advanced: true`).
- **stickyStudySettings preference**: multiple type with values `chapterForm` (new/edit chapter settings persistence) and `savePosition` (position/move in study persistence). Default: `savePosition`.
- **isNewForm()**: Checks if study form data has description === undefined → indicates new form (not edit).
- **fillEditFormDirect()**: When dialog div.study-edit exists, if isNewForm and settings exist → fills form fields (`#study-key`) with saved settings values for keys except name/flair.
- **fillEditForm()**: Debounced version of fillEditFormDirect (100ms debounce).
- **saveEditForm(data)**: Saves form data to `stickyStudySettings.settings` option, applies options.
- **addStudyPosition(studyId, chapterId, path)**: Adds position entry to `_studyPositions` map per studyId.
- **saveStudyPositions()**: Saves `_studyPositions` to storage key `LichessTools.studyPositions`.

## Function Wrapping

- Unwraps existing wrapped functions on disable: `study.form.open.toggle`, `study.form.save`, `study.setPath`
- On enable chapterForm: wraps `study.form.open.toggle` (after function → fills edit form if result true); wraps `study.form.save` (after function → saves edit form data)
- On enable savePosition: wraps `study.setPath` (before function → adds study position entry with studyId, chapterId, path); adds beforeunload listener to saveStudyPositions

## Position Restore

- On start (first page load): if NOT gamebookPlay, NOT lt.isGamePlaying(), hash not recent (<1000ms since last hash) → checks storage for saved position in current study/chapter → setTimeout 100ms to jump to saved path (after other tools set Preview mode)

## Preference

- **name**: `stickyStudySettings`
- **category**: study
- **type**: multiple
- **possibleValues**: ['chapterForm', 'savePosition']
- **defaultValue**: 'savePosition'
- **advanced**: true
- **needsLogin**: true

## Dependencies

None.
