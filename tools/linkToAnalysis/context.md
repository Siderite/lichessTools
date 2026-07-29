# LinkToAnalysis Tool — Context Summary

## Purpose

The **LinkToAnalysisTool** generates a link to current analysis position in `copyables .pgn .pair` area. It creates an `<a class="lichessTools-linkToAnalysis"` with Link icon, title "LiChess Tools - link to current analysis", href pointing to `/analysis/pgn/` URL encoded PGN + color parameter + ply/hash path marker. Removes if root children=0+startFen or url>2048 chars. Debounced 500ms on redraw pubsub event.

## Dependencies

- **EmitRedraw**

## Preferences

- **name**: `linkToAnalysis`
- **category**: `analysis2`
- **type**: single (radio)
- **possibleValues**: [`false`, `true`]
- **defaultValue**: `true`
- **advanced**: true

When set to `true`, binds redraw event + generates link. When false, removes button + unbinds.

## How It Works

### Link Generation (`generateLinkDirect`)
Checks button exists → if not: creates `<a class="lichessTools-linkToAnalysis"` with data-icon=Link icon, title trans.noarg('linkToAnalysisTitle'), appended to `.copyables .pgn .pair`. If analysis.tree.root.children.length==0 + lt.isStartFen(analysis.node.fen): button.remove → returns. initialPgn from textarea.copyable.val().trim() or ' *'. url from _links Map (new Map initialized) get(initialPgn). if !url: pgn = initialPgn.replaceAll[\w+"[^"]*"]s+g empty → if !lt.isStartFen(analysis.tree.root.fen): '[FEN "'+root.fen+'"]\r\n'+pgn → pgn.replaceAll(\d+\.(?:\.\.)?)s+g $1 → url = origin+'/analysis/pgn/'+encodeURIComponent(pgn) + 'space' (Lichess issue workaround 17508) → %20 replaced with '+' → _links.set(initialPgn,url). If analysis.getOrientation()=='black': url+='?color=black'. If analysis.onMainline: url += '#'+node.ply; else: url += '#'+encodeURIComponent(analysis.path). if url.length>2048: button.remove → returns. button.attrSafe('href',url). Debounced at 500ms via `generateLink`.

### Initial Hash Handling
init() stores initialHash = location.hash. start(): if initialHash exists → decodeURIComponent hash.slice(1) replaceAll +g space → path → initialHash=null → analysis.tree.nodeAtPath(path) → if node.id: analysis.jump(path). (Workaround for Lichess issue 17507).

### Initialization (`start()`)
Reads preference value from `lt.currentOptions`. Logs option. Unbinds pubsub redraw event. Removes existing button. If !value: returns. Otherwise: binds pubsub redraw → generateLink. Checks initialHash → decode path → jump if node.id exists.