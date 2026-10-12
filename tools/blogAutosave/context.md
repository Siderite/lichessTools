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

### Validity Check (`checkValidityDirect`)

Validates the blog form fields (debounced 500ms as `checkValidity`), toggling the `lichessTools-invalid` class on each invalid field:
- **title** (`#form3-title`): must be 3–80 characters long.
- **intro** (`#form3-intro`): must be present and ≤1000 characters.
- **content** (`#form3-markdown` / `.toastui-editor`): must be non-empty.
- **captcha** (`input[name="move"]` + `.captcha`): must be non-empty and not in a failure state.

Returns `true` only when all fields are valid.

### Save Blog (`saveBlog`)

Saves the blog post via `lt.api.blog.save(blogId, arr)` where `arr` contains all form field values:

1. Checks for `form.ublog-post-form__main` — if not present, returns.
2. Runs `checkValidityDirect()` — if invalid, toggles body class `lichessTools-blogSaveError` and returns.
3. If NOT forced AND live checkbox is checked → returns (live mode means auto-publishing by Lichess).
4. Extracts markdown content from `#form3-markdown` — if empty, returns.
5. Collects all form inputs/textarea/select values: name + value (checkboxes use checked state, others use val()).
6. Constructs bodyContent string as URL-encoded parameter pairs joined with `&`.
7. If NOT forced AND bodyContent equals lastSave → returns (no changes since last save).
8. Adds body class `lichessTools-blogAutosave` during save operation.
9. Calls API to save blog post; on success clears `lichessTools-blogSaveError`, on error announces "errorSavingBlogMessage" (if forced) or toggles `lichessTools-blogSaveError` (if auto).
10. After save: removes body class `lichessTools-blogAutosave` after 2000ms setTimeout.
11. Updates `lastSave` to current bodyContent for comparison on next save.

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
- **validity**: `input change` listeners on `input, textarea, [contenteditable="true"]` → triggers `checkValidity` (debounced).

## Cleanup on Disable

When preference is off:
- Clears timeout/interval.
- Removes beforeunload listener.
- Removes `.lichessTools-saved` paragraph.
- Removes save button from form.