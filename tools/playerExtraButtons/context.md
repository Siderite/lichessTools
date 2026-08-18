# Player Extra Buttons Tool

## Purpose

Adds extra buttons to player tooltips and report pages for reporting and blocking players.

## Preference

- **name**: `playerExtraButtons`
- **category**: `general`
- **type**: `multiple` (checkbox)
- **possibleValues**: `['report']`
- **defaultValue**: false
- **advanced**: true

## Dependencies

Requires `EmitContentLoaded` tool.

## Behavior

When enabled (`report` option set):
1. Subscribes to `lichessTools.contentLoaded` pubsub event — on page content loaded, adds buttons dynamically

The `addButtons` method adds two types of buttons:

**TV Tooltip button**:
- On TV pages (`/@<userId>/tv`), in the powerTip actions area (`#powerTip .upt__actions`)
- Adds an `<a class="btn-rack__btn playerExtraButtons-report">` before the TV link button
- Icon: `lt.icon.CautionTriangle`, title: "Report and block", href: `/report?username=<userId>` (opens in new tab)

**Report Page button**:
- On report pages (`main.report div.form-actions`), before the submit button
- Adds a `<button type="button" class="submit button button-red text playerExtraButtons-report">` with icon and text "Report and block"
- On click: prevents default, calls `lt.api.relation.blockPlayer(userId)` to block the user, then submits the report form

When disabled: unsubscribes from contentLoaded event, no buttons added.

## Effect

Users can quickly report and simultaneously block a player from TV tooltips or report pages.