(() => {
  class PuzzleIndexTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['LocalDatabase'];

    preferences = [
      {
        name: 'puzzleIndex',
        category: 'puzzles',
        type: 'file',
        fileDescription: 'Ngram Index Files (NIF)',
        fileExtension: '.nif',
        defaultValue: '',
        advanced: true,
        wip: true
      }
    ];

    intl = {
      'en-US': {
        'options.puzzles': 'Puzzles',
        'options.puzzleIndex': 'Find position in Lichess puzzles',
        'puzzleHeaderText': 'Puzzles'
      },
      'ro-RO': {
        'options.puzzles': 'Probleme de \u015Fah',
        'options.puzzleIndex': 'G\u0103se\u015fte pozi\u0163ia \u00een problemele de \u015fah Lichess',
        'puzzleHeaderText': 'Probleme de \u015fah'
      }
    }

    loadData = async ()=>{
      const lt = this.lichessTools;
      if (this.loading) return;
      this.loading = true;
      if (!this.indexFile && lt.file) {
        const dbKey = 'lichessTools/LT/puzzleIndex-file';
        const fileHandle = await lt.storage.get(dbKey,{ db: true, raw: true });
        this.indexFile = await lt.file.openIndex(fileHandle, true);
      }
      this.loading = false;
    };

    searchPosition = async ()=>{
      if (this.searching) return;
      try {
        this.searching=true;
        await this.loadData();
        if (!this.indexFile) return;
        const lt = this.lichessTools;
        const lichess = lt.lichess;
        if (!lichess.analysis.explorer.enabled()) return;
        await lt.timeout(200);
        const $ = lt.$;
        const trans = lt.translator;
        const fen = lichess.analysis.node.fen?.split(' ').slice(0,2).join(' ');
        const searchItems = await this.indexFile.search(fen);
        const container = $('section.explorer-box div.data');
        let table = $('table.lichessTools-puzzles',container);
        let button = $('.explorer-title button.lichessTools-puzzles',container);
        if (!searchItems.length) {
          button.remove();
          table.remove();
          return;
        }
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
            .text('\uE02F')
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
        for (const puzzleId of searchItems.slice(0,500)) {
          const existing = $('tr[data-id="'+puzzleId+'"]',tbody);
          existing.each((i,e)=>{ e.toDelete=false; });
          if (!existing.length) {
            const row = $('<tr><td><a href="/training/'+puzzleId+'" target="_blank">#'+puzzleId+'</a><span class="tooltip-content"></td></tr>')
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
      const value = lt.currentOptions.getValue('puzzleIndex');
      this.logOption('Puzzle index', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const trans = lt.translator;
      lt.pubsub.off('lichessTools.redraw', this.searchPosition);
      if (!value) {
        $('section.explorer-box div.data table.lichessTools-puzzles').remove();
        this.indexFile?.dispose();
        this.indexFile = null;
        return;
      }
      lt.pubsub.on('lichessTools.redraw', this.searchPosition);
    }

  }
  LiChessTools.Tools.PuzzleIndex = PuzzleIndexTool;
})();
