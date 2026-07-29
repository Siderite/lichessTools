# Study Topics Tool

## Purpose

Makes study topic navigation sortable (drag-and-drop reorder) and expandable (click to show studies under each topic). Also makes topic tags in study edit form sortable.

## Functionality

- **studyTopics preference**: multiple type with values `sortable` (topic sorting capability) and `expandable` (topic expansion capability). Default: 'sortable,expandable'. Advanced.
- **getTopicFromAnchor(e)**: Extracts topic from href `/study/topic/topic/` via regex, decodeURIComponent.

- **sortTopics()**: Sorts topic anchors in `nav.subnav__inner a[href^="/study/topic/"]`: extracts topics via getTopicFromAnchor, calls lt.api.study.setTopics(topics), reloads page.
- **sortTags(tagify)**: Updates tagify value by DOM tags if sortable enabled.

- **getTagify(textarea)**: Gets or creates Tagify instance on textarea: if already has __tagify → returns; else loads npm/tagify.min.js asset via lichess, creates new lt.global.Tagify(textarea).
- **makeSortable(elem, options)**: Creates Sortable instance on element with default options (handle=span if ontouchstart in window, animation=150, ghostClass=lichessTools-sortableGhost); loads sortable.esm via lichess asset (npm:true) if not cached; adds to sortables Set.

- **handleTopicsDialog()**: On 'tags.tagify' body observer event: if sortable enabled → finds textarea with tags in `.study-topics`, gets tagify, makesSortable on `.study-topics tags` with draggable='tag', onSort=sortTags(tagify).

## Topic Sorting

- If topicAnchors.length > 1 and sortable enabled:
  - MakesSortable `nav.subnav__inner` with draggable='a[href^="/study/topic/"]', onSort=sortTopics
  - If form3-topics textarea exists → gets tagify, makesSortable `form.form3 tags` with draggable='tag', onSort=sortTags(tagify)

## Topic Expansion (expandable only, non-mobile)

- For each topic anchor: if not already __initExpandable → initializes:
  - Empty element, adds button `lichessTools-topicExpander` click handler toggles `lichessTools-expandedTopic` class
  - If expanded and not __studiesLoaded → fetches lt.api.study.getTopicStudies(topic), appends `<a>` with href `/study/encodedId`, text name to `.lichessTools-topicStudies` container
  - Adds span with topic text, div `.lichessTools-topicStudies`

## Preference

- **name**: `studyTopics`
- **category**: study
- **type**: multiple
- **possibleValues**: ['sortable','expandable']
- **defaultValue**: 'sortable,expandable'
- **advanced**: true

## Dependencies

None.
