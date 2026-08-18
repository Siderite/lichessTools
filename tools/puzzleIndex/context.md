# Puzzle Index Tool

## Purpose

Searches current explorer position FEN against a local NIF (Ngram Index File) database and optionally against puzzles from the user's own games. Displays matching puzzle IDs in explorer-box table with flags (reversed, yours). Shows thumbnail popup on hover. Requires logged-in user. Advanced preference.

## Functionality

- Depends on `LocalDatabase` and `AddNotifications`.
- **puzzleIndex preference**: file type — fileDescription: 'Ngram Index Files (NIF)', fileExtension: '.nif', defaultValue: '', offValue: ''. Stores fileHandle in indexedDB key `lichessTools/LT/puzzleIndex-file`.
- **yourPuzzleIndex preference**: single type with values [false, true]. Default: false. Advanced.

## Update Notification (showUpdateNotification)

- lastRead = lt.storage.get('LiChessTools.puzzleIndexLastRead') || 0; if lastRead > Date.now()-86400000*3 → skip. Creates notification id='puzzleIndexNotify': icon ArcheryTarget, href https://siderite.dev/blog/lichess-tools---user-manual/#puzzleIndex target='_blank', handler sets lastRead=Date.now(), content span options.puzzleIndex + span puzzleIndexUpdateText, title puzzleIndexUpdateTitle ("Server version of the NIF file is newer than your local one"). Adds via lt.notifications.add.

## Data Loading (loadData)

- If loading → skip; try: loading=true; if no indexFile AND lt.file exists: dbKey='lichessTools/LT/puzzleIndex-file'; fileHandle=storage.get(dbKey,db:true,raw:true); if navigator.userActivation.hasBeenActive not true → return; if fileHandle.queryPermission/requestPermission: perm=queryPermission(mode:"read"); if perm!==granted → requestPermission(mode:"read"); file=fileHandle.getFile(); lastModified=file.lastModified; onServer=lt.comm.getHeadData('https://siderite.dev/puzzle.nif.zip'); lastOnServer=Date.parse(onServer.headers.lastModified); if lastOnServer AND lastOnServer-lastModified>86400000 → showUpdateNotification(); indexFile=lt.file.openIndex(fileHandle,true); searchPosition(); finally: loading=false.

## Load Your Data (loadYourData)

- If loadingYours → skip; try: loadingYours=true; puzzles=lt.api.puzzle.getPuzzlesOfPlayer(); yourPuzzles=new Map(); for each puzzle: arr=yourPuzzles.get(puzzle.fen); if no arr→arr=[]; set(puzzle.fen,arr); push(puzzle to arr); yourPuzzles=yourPuzzles; searchPosition(); finally: loadingYours=false.

## Search Position (searchPosition)

- If searching → skip; try: lt.isGamePlaying() → return; lichess.analysis.explorer.enabled() not true → return; explorer.loading() → setTimeout 50ms, return. fen=lichess.analysis.node.fen split(' ').slice(0,2).join(' '); lt.isStartFen(fen) → return; searching=fen. retry=false: if options.puzzleIndex AND no indexFile → loadData(); retry=true; if options.yourPuzzleIndex AND no yourPuzzles → loadYourData(); retry=true; if retry → setTimeout 50ms, return.
- reversedFen=lt.reverseFen(fen). searchItems=[]: if yourPuzzles exists → posFen=fen split[0]; finds=(yourPuzzles.get(posFen)||[]) flatMap(p→{puzzleId:p.id.substr(1),reversed:false,yours:true}); push; posReversedFen=reversedFen split[0]; reverseFinds=(yourPuzzles.get(posReversedFen||[]) flatMap same → push. if indexFile exists → finds=(await indexFile.search(fen)) filter(i→!searchItems.find(p→p.puzzleId==i) map(i→{puzzleId:i,reversed:false}) push; reverseFinds=(await indexFile.search(reversedFen)) filter same map(i→{puzzleId:i,reversed:true}) push.
- container=section.explorer-box div.data; table=table.lichessTools-puzzles in container; button=explorer-title button.lichessTools-puzzles in container. If no searchItems → button/table remove, return. If fen != current → return. If table exists AND next(table,.lichessTools-evalRow) exists → table.appendTo(container). Else: table=$('<table class="lichessTools-puzzles"` thead th title tbody — onmouseleave clears puzzlePopup timeout removes popup; appends to container; th.title text puzzleHeaderText. if no button → button=$('<button class="button-link lichessTools-puzzles"` text lt.icon.ZoomIn, title puzzleHeaderText, click scrolls all table.lichessTools-puzzles intoView nearest; appends to explorer-title container.
- tbody=tbody(table); rows=tr(tbody); each row→toDelete=true. For each item of searchItems.slice(0,500): puzzleId=item.puzzleId; existing=tr(data-id=puzzleId) in tbody; each existing→toDelete=false. if no existing: flags=[] if reversed→{icon:'R',text positionReversedText}; if yours→{icon:'!',text yourPuzzleText}; text=puzzleId+(flags.length ? '('+flags.map(f→f.icon).join('')+')' : ''); title=flags.map(f→f.text).join(', '); row=$('<tr><td><a href="/training/puzzleId" target="_blank">#text</a></td></tr>` attr(title), click prevents default opens /training/puzzleId, mouseover: anc=$('a',ev.currentTarget); offset=anc.offset(); offset.left+=anc.width()+16; clearTimeout popupTimeout; setTimeout 50ms creates $('#puzzlePopup') appends to body; popup html `<img src="/training/export/gif/thumbnail/puzzleId.gif"` css(offset); appendTo tbody. rows.filter(i→e.toDelete).remove(). finally: searching=false.

## Preference

- **name**: `puzzleIndex`
- **category**: puzzles
- **type**: file (fileDescription: 'Ngram Index Files (NIF)', fileExtension: '.nif')
- **possibleValues**: '' (empty)
- **defaultValue**: ''
- **offValue**: ''
- **advanced**: true

- **name**: `yourPuzzleIndex`
- **category**: puzzles
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: false
- **advanced**: true

## Dependencies

`LocalDatabase`, `AddNotifications`
