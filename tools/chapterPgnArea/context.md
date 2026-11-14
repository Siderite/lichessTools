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

### Copy Button (`button.copy-me__button`)

Lichess's own `copy-me__button` handler only reads `input`/`a` children, so the
textarea display would not be copied by it. The tool binds its own click handler:
- `ev.preventDefault()` so the surrounding `form.form3` is not submitted
- reads the textarea value and writes it to the clipboard as
  `application/x-chess-pgn` when `ClipboardItem.supports` accepts that mime type,
  otherwise as `text/plain`; a rejected PGN write is retried as `text/plain`
- on success it flashes the button like Lichess does: swap the icon to
  `lt.icon.Checkmark` and drop `button-metal` for 1s, then restore
  `lt.icon.Clipboard` and `button-metal`
- on failure it logs to console and announces `clipboardDenied`

## Dependencies

- EmitRedraw, ExportPGN

## Preferences

- `chapterPgnArea` — single type (false/true), default true, advanced/true

## Key Methods

- `setupAreaDirect()` → creates PGN display area and fetches PGN
- `copyAreaPgn(group)` → clipboard write for the copy button plus checkmark flash
- `supportedClipboardMime()` → PGN mime type when the clipboard supports it, else
  `text/plain`
- `showCopyCheckmark(button)` → 1s `Checkmark`/`button-metal` swap and restore
- `async start()` → wraps study.vm.toolTab to trigger setup after tool tab opens
