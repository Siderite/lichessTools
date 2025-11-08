(() => {
  class PuzzleIndexTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['LocalDatabase', 'AddNotifications'];

    preferences = [
      {
        name: 'puzzleIndex',
        category: 'puzzles',
        type: 'file',
        fileDescription: 'Ngram Index Files (NIF)',
        fileExtension: '.nif',
        defaultValue: '',
        advanced: true
      },
      {
        name: 'yourPuzzleIndex',
        category: 'puzzles',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.puzzles': 'Puzzles',
        'options.puzzleIndex': 'Find position in Lichess puzzles',
        'options.yourPuzzleIndex': 'Find position in puzzles from your games',
        'puzzleHeaderText': 'Puzzles',
        'positionReversedText': 'Position reversed',
        'yourPuzzleText': 'From your games',
        'puzzleIndexUpdateText': 'Update your NIF file!',
        'puzzleIndexUpdateTitle': 'Server version of the NIF file is newer than your local one'
      },
      'ro-RO': {
        'options.puzzles': 'Probleme de \u015Fah',
        'options.puzzleIndex': 'G\u0103se\u015fte pozi\u0163ia \u00een problemele de \u015fah Lichess',
        'options.yourPuzzleIndex': 'G\u0103se\u015fte pozi\u0163ia \u00een problemele de \u015fah din jocurile tale',
        'puzzleHeaderText': 'Probleme de \u015fah',
        'positionReversedText': 'Pozi\u0163ie inversat\u0103',
        'yourPuzzleText': 'Din jocurile tale',
        'puzzleIndexUpdateText': 'Actualizeaz\u0103 fi\u015fierul NIF!',
        'puzzleIndexUpdateTitle': 'Versiunea fi\u015fierului NIF de pe server este mai nou\u0103 dec\u00e2t cea local\u0103'
      }
    }

    showUpdateNotification = ()=>{
      const lt = this.lichessTools;
      const trans = lt.translator;
      this.lastRead = +(lt.storage.get('LiChessTools.puzzleIndexLastRead')) || 0;
      if (this.lastRead>Date.now()-86400000*3) return;
      const notification = {
        id: 'puzzleIndexNotify',
        getEntries: async () => {
          const entry = {
            id: 'puzzleIndexNotify',
            isNew: true,
            icon: lt.icon.ArcheryTarget,
            href: 'https://siderite.dev/blog/lichess-tools---user-manual/#puzzleIndex',
            target: '_blank',
            handler: ()=>lt.storage.set('LiChessTools.puzzleIndexLastRead',Date.now()),
            content: $('<div>')
              .append($('<span>').text(trans.noarg('options.puzzleIndex')))
              .append($('<span>').text(trans.noarg('puzzleIndexUpdateText')))
              .html(),
            title: trans.noarg('puzzleIndexUpdateTitle')
          };
          return [entry];
        }
      };
      lt.notifications.add(notification);
    };

    loadData = async ()=>{
      const lt = this.lichessTools;
      if (this.loading) return;
      try {
        this.loading = true;
        if (!this.indexFile && lt.file) {
          const dbKey = 'lichessTools/LT/puzzleIndex-file';
          const fileHandle = await lt.storage.get(dbKey,{ db: true, raw: true });
          const file = await fileHandle.getFile();
          const lastModified = file.lastModified;
          const onServer = await lt.comm.getHeadData('https://siderite.dev/puzzle.nif.zip');
          const lastOnServer = Date.parse(onServer?.headers?.lastModified);
          if (lastOnServer && lastOnServer-lastModified>86400000) {
            this.showUpdateNotification();
          }
          this.indexFile = await lt.file.openIndex(fileHandle, true);
          this.searchPosition();
        }
      } finally {
        this.loading = false;
      }
    };

    loadYourData = async ()=>{
      const lt = this.lichessTools;
      if (this.loadingYours) return;
      try {
        this.loadingYours = true;
        const puzzles = await lt.api.puzzle.getPuzzlesOfPlayer();
        const yourPuzzles = new Map();
        for (const puzzle of puzzles) {
          let arr = yourPuzzles.get(puzzle.fen);
          if (!arr) {
            arr=[];
            yourPuzzles.set(puzzle.fen,arr);
          }
          arr.push(puzzle);
        }
        this.yourPuzzles = yourPuzzles;
        this.searchPosition();
      } finally {
        this.loadingYours = false;
      }
    };

    searchPosition = async ()=>{
      if (this.searching) return;
      try {
        const lt = this.lichessTools;
        const lichess = lt.lichess;
        if (lt.isGamePlaying()) return;
        if (!lichess.analysis.explorer.enabled()) return;
        if (lichess.analysis.explorer.loading()) {
          lt.global.setTimeout(this.searchPosition,50);
        }
        const fen = lichess.analysis.node.fen?.split(' ').slice(0,2).join(' ');
        if (lt.isStartFen(fen)) return;
        this.searching=fen;
        if (this.options.puzzleIndex && !this.indexFile) {
          this.loadData();
        }
        if (this.options.yourPuzzleIndex && !this.yourPuzzles) {
          this.loadYourData();
        }

        const $ = lt.$;
        const trans = lt.translator;
        const reversedFen = lt.reverseFen(fen);

        const searchItems = [];
        if (this.yourPuzzles) {
          const posFen = fen.split(' ')[0];
          const finds = (this.yourPuzzles.get(posFen)||[])
                          .flatMap(p=>({ puzzleId: p.id?.substr(1), reversed: false, yours: true }));
          searchItems.push(...finds);
          const posReversedFen = reversedFen.split(' ')[0];
          const reverseFinds = (this.yourPuzzles.get(posReversedFen)||[])
                          .flatMap(p=>({ puzzleId: p.id?.substr(1), reversed: false, yours: true }));
          searchItems.push(...reverseFinds);
        }
        if (this.indexFile) {
          const finds = (await this.indexFile.search(fen))
                              .filter(i=>!searchItems.find(p=>p.puzzleId == i))
                              .map(i=>({ puzzleId: i, reversed: false }));
          searchItems.push(...finds);
          const reverseFinds = (await this.indexFile.search(reversedFen))
                                  .filter(i=>!searchItems.find(p=>p.puzzleId == i))
                                  .map(i=>({ puzzleId: i, reversed: true }));
          searchItems.push(...reverseFinds);
        }

        const container = $('section.explorer-box div.data');
        let table = $('table.lichessTools-puzzles',container);
        let button = $('.explorer-title button.lichessTools-puzzles',container);
        if (!searchItems.length) {
          button.remove();
          table.remove();
          return;
        }
        if (fen != lichess.analysis.node.fen?.split(' ').slice(0,2).join(' ')) return;
        if (table.length) {
          if (table.next('table').length) {
            table.appendTo(container);
          }
        } else {
          table=$('<table class="lichessTools-puzzles"><thead><th class="title"></th></thead><tbody></tbody></table>')
            .on('mouseleave',ev=>{
              lt.global.clearTimeout(this.popupTimeout);
              $('#puzzlePopup')
                .remove();
            })
            .appendTo(container);
          table.find('th.title')
            .text(trans.noarg('puzzleHeaderText'));
        }
        if (!button.length) {
          button = $('<button class="button-link lichessTools-puzzles">')
            .text(lt.icon.ZoomIn)
            .attr('title',trans.noarg('puzzleHeaderText'))
            .on('click',ev=>{
              ev.preventDefault();
              $('.explorer-box table.lichessTools-puzzles').each((i,e)=>e.scrollIntoView());
            })
            .appendTo($('.explorer-title',container));
        }
        const tbody = $('tbody',table);
        const rows = $('tr',tbody);
        rows.each((i,e)=>{ e.toDelete=true; });
        for (const item of searchItems.slice(0,500)) {
          const puzzleId = item.puzzleId;
          const existing = $('tr[data-id="'+puzzleId+'"]',tbody);
          existing.each((i,e)=>{ e.toDelete=false; });
          if (!existing.length) {
            const flags = [];
            if (item.reversed) flags.push({ icon:'R', text: trans.noarg('positionReversedText')});
            if (item.yours) flags.push({ icon:'!', text: trans.noarg('yourPuzzleText')});
            const text = puzzleId+(flags.length ? ' ('+flags.map(f=>f.icon).join('')+')' : '');
            const title = flags.map(f=>f.text).join(', ');
            const row = $('<tr><td><a href="/training/'+puzzleId+'" target="_blank">#'+text+'</a></td></tr>')
              .attr('title',title)
              .on('click',ev=>{
                ev.preventDefault();
                lt.global.open('/training/'+puzzleId);
              })
              .on('mouseover',ev=>{
                const anc = $('a',ev.currentTarget);
                const offset = anc.offset();
                offset.left += anc.width() + 16;
                lt.global.clearTimeout(this.popupTimeout);
                this.popupTimeout = lt.global.setTimeout(()=>{
                  let popup = $('#puzzlePopup');
                  if (!popup.length) {
                    popup = $('<div id="puzzlePopup">').appendTo('body');
                  }
                  popup
                    .html('<img src="/training/export/gif/thumbnail/'+puzzleId+'.gif"/>')
                    .css(offset);
                },500);
              })
              .appendTo(tbody);
          }
        }
        rows.filter((i,e)=>e.toDelete).remove();
      } finally {
        this.searching = false;
      }
    };

    async start() {
      const lt = this.lichessTools;
      const puzzleIndex = lt.currentOptions.getValue('puzzleIndex');
      this.logOption('Puzzle index', puzzleIndex);
      const yourPuzzleIndex = lt.currentOptions.getValue('yourPuzzleIndex');
      this.logOption('Your puzzle index', yourPuzzleIndex);
      this.options = {
        puzzleIndex: puzzleIndex,
        yourPuzzleIndex: yourPuzzleIndex
      };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const trans = lt.translator;
      lt.pubsub.off('lichessTools.redraw', this.searchPosition);

      if (!puzzleIndex && !yourPuzzleIndex) {
        $('section.explorer-box div.data table.lichessTools-puzzles').remove();
        this.indexFile?.dispose();
        this.indexFile = null;
        return;
      }

      lt.pubsub.on('lichessTools.redraw', this.searchPosition);
      this.searchPosition();
    }

  }
  LiChessTools.Tools.PuzzleIndex = PuzzleIndexTool;
})();
