# Previous Study Menu Tool

## Purpose

Adds a menu item in the Learn dropdown that links to previously visited studies, with up to N sub-items showing recent study history.

## Functionality

- Depends on `EmitRedraw` and `DetectThirdParties`.
- **previousStudyMenu preference**: single type with values 0 (disabled), 1, 2, 3, 4, 5 (number of menu items). Default: 5. offValue: 0. Advanced.
- Maintains history of up to 6 studies in `previousStudyMenu.study` option (each entry has id, url, name — tourName prepended if present).
- **updateStudy()**: On redraw event:
  - If current study exists and page is NOT practice/learn → updates history: adds current study data to top of list (removes duplicate if same), truncates to 6 items, saves options
  - Creates menu element in `#topnav section a[href="/learn"]+div[role="group"`:
    - Main `<a>` with class `lichessTools-previousStudy`, text "Previous study", span for name, div role="group" for sub-items
    - First item (studyData[0]): href = url or `/study/id`, title "LiChess Tools - name", name in span
    - Sub-items (studyData[1..itemCount]): each `<a>` with href `/study/id`, title, text name — refreshed if any mismatch detected
    - If itemCount < 2 → removes sub-group div
    - If itemCount = 0 → removes entire element

## Preference

- **name**: `previousStudyMenu`
- **category**: study
- **type**: single
- **possibleValues**: [0,1,2,3,4,5]
- **defaultValue**: 5
- **offValue**: 0
- **advanced**: true

## Dependencies

`EmitRedraw`, `DetectThirdParties`
