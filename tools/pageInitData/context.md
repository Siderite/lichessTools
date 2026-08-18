# PageInitData Tool

## Purpose

Captures the `page-init-data` HTML script element's innerHTML content before it is removed, and parses it as JSON for lazy loading. This data contains initial page state information that Lichess embeds in a hidden script tag.

## How It Works

### Function Wrapping (in init())

Wraps `HTMLScriptElement.prototype.remove`:
- Before the original remove call:
  - If element ID is 'page-init-data' and extension is enabled:
    - Captures `this.innerHTML`
    - Calls `lt.lazyLoad(lt, 'pageInitData', ()=>JSON.parse(html))` to parse and store the data
  - Then proceeds with original remove function

### Lazy Load Pattern

The parsed JSON data is stored via LiChessTools' lazy load mechanism — it's available when needed but not immediately processed.

## Dependencies

None explicitly listed. Depends on `lt.lazyLoad`, `lt.currentOptions`.

## Key Methods

- `async init()` — wraps HTMLScriptElement.prototype.remove to capture page-init-data
