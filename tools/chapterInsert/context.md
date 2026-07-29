# ChapterInsert Tool

## Purpose

When creating a new study chapter, inserts it after the current chapter instead of at the end. Provides a "Create after current" button in the new chapter form dialog.

## How It Works

### Create After Current Button

On `div.dialog-content div.form-actions` (new chapter form):
- Creates `<button class="lichessTools-chapterInsert">` with text "Create after current" and title
- Click: stores chapterData (all chapters + current chapter), triggers form submit via requestSubmit()
- Only shown if current chapter is NOT the last one

### Chapter Insert Logic

On `lichessTools.chapterChange` event (new chapter created):
- Gets newChapterId from event payload
- Finds index of current chapter in remaining order (excluding new)
- Splices newChapterId at index+1 into newOrder array
- Moves DOM element to insertAfter current chapter's button element
- Scrolls into view if needed
- After 1000ms: calls `study.chapters.sort(newOrder)`

## Dependencies

- EmitChapterChange

## Preferences

- `chapterInsert` — single type (false/true), default true, advanced/true, needsLogin: true

## Key Methods

- `setupButtons(studyId)` → creates insert button in new chapter form dialog
- `onChapterAdd(newChapterId)` → inserts new chapter after current via DOM + API sort
- `onChapterChange(chapterId)` → reacts to chapter change event
- `async start()` → wraps newForm.toggle, sets up chapter change listener
