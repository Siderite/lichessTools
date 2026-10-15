# ChapterNavigation Tool

## Purpose

Enhances study chapter navigation with: navigation control buttons (first, prev, random, next, last) in side/footer area, percentage display on rnd: chapters, hide next chapter button from gamebook feedback, subchapter collapse/expand functionality, and a compact chapter overview panel above the chapter list.

## How It Works

### Navigation Controls

On `div.study__side div[role="footer"]` or `aside.relay-tour__side div[role="footer"]`:
- Creates `<div role="footer">` with 5 buttons: first (←←), prev (←), random (↓↯), next (→), last (→→)
- Click handler → actionChapterControls navigates to target chapter
- Each button toggles disabled class based on current position in list

### Percentage Display

On `.study__chapters button[data-id] h3`:
- Parses `rnd: [percentage]` from chapter name text via regex
- Displays percentage as `<span class="perc">` alongside original text

### Random Chapter Selection

Random button uses weighted selection based on rnd: percentages:
- Normalizes percentages if total > 100
- Distributes remaining weight to non-percentage chapters
- Picks random index by subtracting cumulative percentages from random value until ≤ 0

### Hide Next Button

On `main` element toggles `lichessTools-hideNextButton`:
- If gamebook has `.feedback.end button.next`, creates `<a class="lichessTools-nextChapter">` in `.gamebook .comment` with Forward icon
- Click: sets study to next chapter via data-chapter-id attribute

### Subchapter Collapse/Expand

On chapters where next chapter is a subchapter (name starts with |, -, or \):
- Creates `<div class="lichessTools-expander">` before h3 of parent chapter
- Click → toggles collapsed state, hides/shows subsequent subchapter buttons via `lichessTools-collapsedChapter` class
- Collapsed chapters stored in localStorage

### Subchapter Sort Override

Wraps `study.chapters.sort`:
- Before call: if collapsed subchapters exist, reorders to include subchapters immediately after their parent chapter
- Calls original sort with new order, returns false (prevents Lichess default behavior)

### Chapter Overview Panel

On `div.study__side .study__chapters` / `aside.relay-tour__side .vertical-resize` (fallback `.relay-games`):
- Creates `.lichessTools-chapterNavigation-panel` inserted before the chapter list
- Left/right circular arrow buttons shift the sliding window (do not change the chapter)
- Center shows a sliding window of 6 chapter circles connected by lines; when there are chapters before/after the window, a fading edge line is shown on that side
- Circles and lines use a single teal color (#50ba96); the current chapter is yellow/orange and its color bleeds into the adjacent lines
- Clicking a chapter circle is the only way to change the chapter
- Mouse wheel / trackpad horizontal scroll over the window shifts the window offset without a scrollbar
- Pointer/touch drag left or right shifts the window offset (mobile)

## Dependencies

- EmitRedraw, EmitChapterChange, DetectThirdParties

## Preferences

- `chapterNavigation` — multiple type: ['controls', 'hideNextButton', 'subChapters', 'panel'], default: 'controls,hideNextButton'

## Key Methods

- `refreshChapterControlsDirect()` → manages all navigation features
- `refreshPanelDirect(list)` → builds/refreshes the chapter overview panel
- `actionChapterControls(ev)` → navigates to chapter based on button action
- `actionPanelControls(ev)` → handles panel arrow/chapter clicks
- `shiftPanelWindow(delta)` → shifts the panel window without changing the chapter
- `onPanelWheel(ev)` → shifts the panel window on horizontal scroll
- `onPanelPointerDown/Move/Up(ev)` → handle pointer/touch drag of the panel window
- `expandChapter(chapterId)` → toggles subchapter collapse/expand
- `isSubChapter(chapterOrName)` → checks if name starts with |, -, or \
- `getChapterElements(chapterId, forced)` → caches and retrieves DOM chapter buttons
