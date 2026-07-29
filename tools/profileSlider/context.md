# Profile Slider Tool

## Purpose

Enhances the profile time-range slider with date text labels, one-week filter button, and automatic range expansion when small intervals are selected. Also provides restore full range button.

## Functionality

- **profileSlider preference**: multiple type with values `showText` (show dates on label), `add1w` (one week filter button), `fixSize` (fix small intervals). Default: 'showText,add1w,fixSize'. Advanced.
- Uses noUiSlider from `#time-range-slider`.

- **updateSlider(ev)**: If showText enabled → updates label `.lichessTools-profileSliderText` with start/end dates from slider values (ev[0], ev[1]) converted via Date.toDateString().substr(4).
- **setSlider(ev)**: If fixSize enabled → expands slider range when small interval selected:
  - Calculates newRangeStart = currentEnd - (currentEnd-currentStart)*10, newRangeEnd = currentStart + (currentEnd-currentStart)*10
  - Bounds to rangeStart/rangeEnd
  - Updates uiSlider options if range changed; marks _setSlider=true temporarily
  - Toggles `lichessTools-moreToTheLeft`/`lichessTools-moreToTheRight` classes based on range bounds

- **restoreFullRange(ev)**: Restores slider to full range (rangeStart, rangeEnd) with animate=false. Prevents default.
- **check1wActive()**: Checks if 1w button is active (slider values == rangeEnd - 7*86400000, rangeEnd). Toggles `active` class on `.lichessTools-1w`.

## UI Elements

- If showText enabled: adds `<label class="lichessTools-profileSliderText"` title "LiChess Tools - Profile slider options", binds uiSlider 'update.lichessTools' → updateSlider, initial update.
- If fixSize enabled: binds uiSlider 'set.lichessTools' → setSlider; adds mousedown handler on non-1w buttons → restoreFullRange; initial setSlider().
- If add1w enabled (btn-rack__btn.length > 1): adds `<button class="btn-rack__btn lichessTools-1w"` text "1w", title "LiChess Tools - one week":
  - mousedown: updates range to rangeEnd - 21*86400000 / rangeEnd, start to rangeEnd - 7*86400000 / rangeEnd; if fixSize → setSlider(); else → restore full range; if showText → updateSlider
  - binds 'set.lichessTools' → check1wActive

## Preference

- **name**: `profileSlider`
- **category**: appearance
- **type**: multiple
- **possibleValues**: ['showText', 'add1w', 'fixSize']
- **defaultValue**: 'showText,add1w,fixSize'
- **advanced**: true

## Dependencies

None.
