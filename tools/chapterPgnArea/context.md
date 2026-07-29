# ChapterPgnArea Tool

## Purpose

Shows chapter PGN in the study share area. Creates a textarea with readonly/autoselect that displays the current chapter's PGN (with tags), plus a copy button.

## How It Works

### PGN Display Area

On `div.study__share form.form3`:
- Creates `<div class="form-group lichessTools-chapterPgnArea">` with:
  - Label "PGN" with title "LiChess Tools - show chapter PGN"
  - Copy-me div containing readonly textarea (spellcheck=false, autoselect) and copy button (Clipboard icon)
- Fetches PGN via `lt.exportPgn('', { exportTags: true })` and sets textarea value

## Dependencies

- EmitRedraw, ExportPGN

## Preferences

- `chapterPgnArea` — single type (false/true), default true, advanced/true

## Key Methods

- `setupAreaDirect()` → creates PGN display area and fetches PGN
- `async start()` → wraps study.vm.toolTab to trigger setup after tool tab opens
