# ChapterEditing Tool

## Purpose

Enhances study chapter editing with bulk operations: PGN tag editor dialog, multiple chapter selection/edit/delete, merge PGN lines into a chapter.

## How It Works

### Bulk PGN Tag Editor

On writable study at `.study__topics`:
- Creates `<a class="lichessTools-bulkPgnTagsEdit">` button
- Click: opens dialog with textarea pre-filled with current chapter tags as `[Tag "Value"]` format
- User edits text, click Update → validates PGN tag regex, checks valid tag types via study.tags.types map, applies changes via `study.makeChange('setTag')` or API updatePgnTags

### Bulk Chapter Edit/Delete

On `.study__chapters`:
- Creates `<div class="lichessTools-bulkEditButtons">` before chapters list with:
  - SelectAll checkbox → toggles all chapter checkboxes
  - Edit button → selects checked chapters for bulk edit via `editForm.current({id:[ids], name:"Bulk Edit"})`
  - Cancel button → unchecks all, cancels bulk edit mode

- Each chapter button gets `<input type="checkbox class="lichessTools-selectChapter">` prepended
- Context menu on chapter button → marks it as selected and enters bulkEdit mode

### Bulk Send Override

Wraps `study.chapters.editForm.send`:
- Before call: if deleteChapter with array of IDs → handles batch deletion (500ms timeout between each, announces count)
- Before call: if editChapter with array of IDs → handles batch editing (reads existing config, applies orientation/mode changes, 500ms timeout between each)

### Merge PGN

On writable study at `#chapter-name`:
- Creates `<button class="lichessTools-mergePgn">` (Plus icon) after anchor
- Click: opens dialog with textarea for new PGN to merge
- Click Merge → uses PgnEditorTool to merge existing chapter PGN + new PGN via `pgnEditor.mergePgnText()` then `pgnEditor.gamesToPgn()`, updates via API

## Dependencies

- EmitRedraw, EmitChapterChange, PgnEditor

## Preferences

- `chapterEditing` — multiple type: ['tags', 'bulk', 'merge'], default: true, advanced/true, needsLogin: true

## Key Methods

- `popupPgnTagsEdit(studyId, chapterId, tags)` → opens tag editor dialog
- `setupBulkPgnTagEdit()` → creates bulk PGN tag edit button
- `editSelectedChapters()` → selects checked chapters for bulk edit
- `handleSendEvent(ev, rest)` → handles batch delete/edit operations
- `cancelEditChapters()` → unchecks all, cancels bulk mode
- `refreshChapterEditControls()` → manages bulk buttons and chapter checkboxes
- `mergePgns(pgn1, pgn2)` → merges two PGN texts via PgnEditorTool
