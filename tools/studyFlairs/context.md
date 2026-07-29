# Study Flairs Tool — Context Summary

## Purpose

Adds chess flair icons (emoji/pictograms) to lichess study elements: study topic tags, study list entries, and navigation links.

## Dependencies

`EmitContentLoaded`

## Preferences

| Name | Category | Type | Default | Advanced |
|------|----------|------|---------|----------|
| `studyFlairs` | study | multiple (checkboxes) | 'topicFlairs' | yes |

Possible values: **authorFlair** (show author's flair), **memberFlairs** (show member flairs), **topicFlairs** (show topic-derived flairs).

## Architecture

The tool extends `LiChessTools.Tools.ToolBase`. It has three processing methods:

### processStudy — Study Page (with topics container)

When the `.study-topics` container is in viewport and `topicFlairs` is enabled:
1. Finds the tagify textarea (`tags+textarea`) inside the container.
2. Creates a "Flairs" button + `flair-picker` div appended to the form. Clicking the button loads `bits.flairPicker` ES module, which lets user select an emoji → adds `flair.<id>` tag via tagify.
3. Wraps `tagify.createTagElem`: after function checks if tag text matches `/flair\.([^\)]+)/`, replaces text with flair image (`lichess.asset.flairSrc(m[1])`), sets `data-lt-text` attribute for restoration, adds `.lichessTools-studyFlairs` class.
4. Wraps `tagify.dropdown.show`: before function filters existing flairs by search term, removes old flair whitelist entries, pushes matching flairs (spliced at 10). After function renders dropdown items with flair images.

### processGeneral — General flair rendering

Cached DOM query (`div.study__topics a.topic`, nav menu links `/study/topic/flair.*`, topic-list links) iterates each element: if text matches `/flair\.([^\)]+)/`, replaces text with flair image, adds title `flair.<id>`, adds class.

### processStudyList — Study list page (paginated)

Fetches study list pages via `lt.api.study.getStudyListPage` up to 40 pages (API limitation). Tracks `_currentPage` and `_nextPage`. Stores studies in `_studies[id] = study`.

For each `div.study.paginated`:
- Extracts study ID from href.
- Collects flairs based on enabled options:
  - **study flair**: from `study.flair` (title "Study flair")
  - **topic flairs**: from `study.topics` matching `/flair\.([^\)]+)/`
  - **author flair**: from `study.owner.flair` (title = `[user.title, user.name]` joined)
  - **member flairs**: from `study.members` excluding owner, mapped to `{ title: fullname, flair, url: /@/<id> }`, filtered for those with flair.

Rendering:
- First flair image prepended to `div.top`, with title. If has user URL → `lichess.powertip.manualUser`. If topic type → contextmenu navigates to `/study/topic/flair.<title>/<mode>` (mode from pager href: hot/newest/oldest/updated/popular/alphabetical/mine).
- Additional flairs in `.lichessTools-bottomFlairs` container appended. Same handling per flair.

Topic-list elements (`div.topic-list > a`) also rendered with flair images when `topicFlairs` enabled.

## Flair List

On start, fetches `lt.api.flair.getList()` → stores as `self.flairs = flairs.map(f => 'flair.' + f.trim())`. Used for tagify whitelist filtering and button picker.

## Start / Stop

- **Start**: reads preference value, sets boolean options. Fetches flair list if not cached. Sets 500ms interval for `processStudy`. On study list page, binds to `lichessTools.contentLoaded` event with debounced (1000ms) handler.
- **Stop**: removes `.lichessTools-studyFlairs` classes, removes flair images, restores `data-lt-text` elements to original text, clears interval, unbinds pubsub.

## Helper Functions

`getFullname(user)` = `[user.title, user.name]` filtered for non-empty → joined with space.