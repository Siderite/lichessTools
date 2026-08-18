# ChapterClearArtifacts Tool

## Purpose

Provides bulk removal of study chapter artifacts: comments, glyphs (evaluation symbols), shapes (drawn arrows/lines), and PGN tags. Also provides individual tag deletion buttons on the study tags table.

## How It Works

### Bulk Removal Select

On study edit dialog modal (`div.dialog-content.edit-[chapterId]`):
- Creates `<select class="lichessTools-removeAll">` with options: comments, glyphs, shapes, tags, all (but PGN tags)
- Replaces the original destructive button
- Each option requires confirmation via `lt.uiApi.dialog.confirm()` before execution
- Comments/glyphs/shapes removal recursively traverses tree from root, deleting each item with 300ms timeout between operations

### Tag Delete Buttons

On writable study (`study.isWriting()`) at `table.study__tags`:
- Creates `<button class="lichessTools-deleteTag">` (Cancel icon) for each tag column header that has a matching tag in chapter data and has an input field (not readonly)
- Click: sets tag value to empty via `study.makeChange('setTag')`
- If result tag deleted, clears chapter status

### Tag Select Clear

Clears `.study__tags select.button` value.

## Dependencies

- InterceptEventHandlers (to get original click handler for "all" option)

## Preferences

- `chapterClearArtifacts` — single type (false/true), default true, advanced/true, needsLogin: true

## Key Methods

- `removeAllComments(node, chapterId)` → recursively deletes comments via study API
- `removeAllGlyphs(node, chapterId)` → recursively toggles glyphs off via study API
- `removeAllShapes(node, chapterId)` → recursively sets shapes to empty via study API + Chessground redraw
- `removeAllTags(chapterId)` → sets all tags to empty via study API
- `setupButtons()` → creates bulk removal select in edit dialog modal
- `setupTagDelete()` → creates tag delete buttons on tags table
