# Blog Autosave Tool — Context

## Overview

The **BlogAutosaveTool** provides auto-save functionality and a save button for Lichess blog editing pages. It saves the blog post content periodically or on user request, preventing loss of work during accidental navigation or page unload.

## Preferences

- **name**: `blogAutosave`
- **category**: `comm` ("Chat, forums, blogs")
- **type**: `multiple` (checkboxes)
- **possibleValues**: `[autosave, savebutton]`
- **defaultValue**: `savebutton` (auto-save off by default)
- **advanced**: `true` (hidden unless Advanced Preferences toggle is on)
- **needsLogin**: `true` (requires logged-in user)

## Behavior

### Save Blog (`saveBlog`)

Saves the blog post via `lt.api.blog.save(blogId, arr)` where `arr` contains all form field values:

1. Checks for `form.ublog-post-form__main` — if not present, returns.
2. If NOT forced AND live checkbox is checked → returns (live mode means auto-publishing by Lichess).
3. Extracts markdown content from `#form3-markdown`.
4. Collects all form inputs/textarea/select values: name + value (checkboxes use checked state, others use val()).
5. Constructs bodyContent string as URL-encoded parameter pairs joined with `&`.
6. If NOT forced AND bodyContent equals lastSave → returns (no changes since last save).
7. Adds body class `lichessTools-blogAutosave` during save operation.
8. Calls API to save blog post.
9. After save: removes body class after 2000ms setTimeout.
10. Updates `lastSave` to current bodyContent for comparison on next save.

### Save Button (`savebutton`)

- Creates a button in the blog edit form:
  - Class: `lichessTools-blogAutosave`
  - Icon: `lt.icon.FloppyDisk`
  - Text: "Save"
  - Inserted before the native submit button in `form.ublog-post-form__main div.form-actions`.
- When clicked (ev.preventDefault): calls `saveBlog(true)` (forced save regardless of live checkbox or content comparison).

### Saved Indicator (`value present`)

- Creates a `<p class="lichessTools-saved">` element appended to the blog form:
  - Icon: `lt.icon.Checkmark`
  - Text: "Blog saved"
- Shown when any preference value is set (autosave OR savebutton).

### Auto Save Interval (`autosave`)

- Runs every **30000ms** (30 seconds) via interval → triggers `saveBlog`.

### Before Unload Protection

- Adds `beforeunload` event listener → calls `saveBlog` when page is about to unload.
- Only added when `autosave` preference is enabled.

## Page Scope

- Only activates on blog edit pages: path matching regex `/\/ublog\/(?<blogId>[^\/]+)\/edit`.
- Extracts blogId from the URL path.

## Event Handling

When enabled:
- **autosave**: interval every 30 seconds + beforeunload listener.
- **savebutton**: button inserted in form.

## Cleanup on Disable

When preference is off:
- Clears timeout/interval.
- Removes beforeunload listener.
- Removes `.lichessTools-saved` paragraph.
- Removes save button from form.