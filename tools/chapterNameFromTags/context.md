# ChapterNameFromTags Tool

## Purpose

Provides suggested chapter name buttons based on PGN tags (Event, White-Black) and chess operations parsing of the first few moves. When editing a study chapter, shows clickable buttons that set the chapter name to suggested values.

## How It Works

### Name Suggestions

1. **Event tag**: Event text from PGN headers, stripped if starts with study name prefix
2. **White-Black**: White player + " - " + Black player
3. **Moves**: ChessOps parsePgn → first moves up to ply 13 (with move numbers)
4. **Variations**: If node has multiple children at ply < 13, adds variation branches in parentheses

### Button Creation

On `#chapter-name` closest `.form-group`:
- Creates `<button class="button button-empty lichessTools-changeNameButton">` for each unique suggested name (excluding current name)
- Text: " %s" with title "LiChess Tools - Easy change name", ArrowUpRight icon
- Click: sets `#chapter-name` value to suggestion and selects text

## Dependencies

- DetectThirdParties, ChessOps, ExportPGN

## Preferences

- `chapterNameFromTags` — single type (false/true), default true, advanced/true, needsLogin: true

## Key Methods

- `getPgn(studyId, chapterId)` → fetches chapter PGN via API or exportPgn
- `setupButtons(studyId, chapterId)` → creates name suggestion buttons
- `async start()` → wraps editForm.toggle to trigger button setup after dialog opens
