# CommentStyling Tool

## Purpose

Adds color styling to study comments via `cls: [color]` syntax in comment text. Also provides a cycle button that rotates through available colors for the user's own comments. Supports chapter name coloring via `cls:` prefix.

## How It Works

### Color Parsing

Comment text with `cls:[color]` pattern → splits text into spans with corresponding CSS classes:
- Colors: red, orange, yellow, green, lightgreen, cyan, lightblue, blue, violet, magenta, pink, underline, strikethrough, italic, bold, cursive, none/clear (no class)
- Applied to `div.analyse__moves comment` and `div.gamebook .comment .content` text nodes

### Chapter Name Coloring

On `.study__chapters button[data-id] > h3`:
- Parses `cls:[color]` from chapter name text → removes pattern, adds `lichessTools-[color]` class to h3 element

### Cycle Comment Color Button

On writable study with node comments:
- Creates `<button class="lichessTools-colors">` in `.study__buttons` after comments button (InkQuill icon)
- Click → cycles through color classes for user's own comments + any cls: prefixed comments:
  - Removes other users' comments from current position
  - Saves combined text with new cls prefix via `lt.saveComment()`
  - Sets textarea#comment-text value

### Color Classes Array

['red', 'orange', 'yellow', 'green', 'lightgreen', 'cyan', 'lightblue', 'blue', 'violet', 'magenta', 'pink', 'underline', 'strikethrough', 'italic', 'bold', 'cursive', ''] — cycles through these.

## Dependencies

- EmitRedraw, EmitChapterChange, EmitCommentChange

## Preferences

- `commentStyling` — single type (false/true), default true, advanced/true, needsLogin: true

## Key Methods

- `getCommentNodes(elem)` → recursively extracts text nodes from element contents
- `addCommentClasses()` → parses cls: patterns and applies color classes to comments/chapters
- `cycleCommentColor(ev)` → cycles through colors for user's comments
- `debouncedAddCommentClasses()` → debounced version of addCommentClasses
