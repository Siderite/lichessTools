# CommentEditing Tool

## Purpose

Enhances study comment editing with: copy-and-edit button (copies existing comment into textarea for modification), improved delete confirmation dialog (requires shift key to bypass confirmation).

## How It Works

### Copy-And-Edit Button

On `.study__comment` elements that have an edit button but no lichessTools-commentEditing:
- Creates `<a class="lichessTools-commentEditing">` with DownwardsWhiteArrow icon, title "Copy and edit"
- Click → finds matching comment from analysis.node.comments, appends comment text to textarea#comment-text (with double newline separator), triggers input event, deletes original comment via study.commentForm.delete()

### Delete Comment Button Enhancement

On `.study__comment a[data-icon="Trash"]`:
- Adds `lichessTools-deleteComment` class
- Removes original click handler via lt.removeEventHandlers
- New click handler:
  - If shiftKey pressed → deletes without confirmation
  - If no shiftKey → requires dialog confirm "Delete [by]'s comment?" before deleting

### Shift Key Visual Feedback

MutationObserver on body keydown/keyup:
- Toggles `shiftPressed` class on lichessTools-deleteComment buttons based on ev.shiftKey state

## Dependencies

- InterceptEventHandlers (to remove original click handlers)

## Preferences

- `commentEditing` — single type (false/true), default true, advanced/true, needsLogin: true

## Key Methods

- `addEditButton()` → creates copy-and-edit buttons and enhances delete buttons
- `alterModifierText(ev)` → toggles shiftPressed class on delete buttons
- `async start()` → sets up observers and keydown listener
