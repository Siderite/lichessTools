(() => {
  class PuzzleIndexTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['LocalDatabase'];

    preferences = [
      {
        name: 'puzzleIndex',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.puzzleIndex': 'Find position in Lichess puzzles',
        'puzzleHeaderText': 'Puzzles'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.puzzleIndex': 'G\u0103se\u015fte pozi\u0163ia \u00een problemele de \u015fah Lichess',
        'puzzleHeaderText': 'Probleme de \u015fah'
      }
    }

    loadData = async ()=>{
      if (this.indexFile) return;
      if (this.loading) return;
      this.loading = true;
      const parent = this.lichessTools;
      if (!parent.file?.enabled) return;
      this.indexFile = await parent.file.openIndex('puzzle.nif', true);
      this.loading = false;
    };

    searchPosition = async ()=>{
      await this.loadData();
      if (!this.indexFile) return;
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      if (!lichess.analysis.explorer.enabled()) return;
      const $ = parent.$;
      const trans = parent.translator;
      const fen = lichess.analysis.node.fen?.split(' ').slice(0,4).join(' ');
      const searchItems = await this.indexFile.search(fen);
      const container = $('section.explorer-box div.data');
      let table = $('table.lichessTools-puzzles',container);
      if (!searchItems.length) {
        table.remove();
        return;
      }
      if (!table.length) {
        table=$('<table class="lichessTools-puzzles"><thead><th class="title"></th></thead><tbody></tbody></table>')
          .on('mouseleave',ev=>{
            parent.global.clearTimeout(this.popupTimeout);
            $('#puzzlePopup')
              .remove();
          })
          .appendTo(container);
        table.find('th.title')
          .text(trans.noarg('puzzleHeaderText'));
      }
      const tbody = $('tbody',table);
      $('tr',tbody).prop('toDelete',true);
      for (const puzzleId of searchItems) {
        const existing = $('tr[data-id="'+puzzleId+'"]',tbody);
        existing.prop('toDelete',false);
        if (!existing.length) {
          const row = $('<tr><td><a href="/training/'+puzzleId+'" target="_blank">'+puzzleId+'</a><span class="tooltip-content"></td></tr>')
            .on('click',ev=>{
              ev.preventDefault();
              parent.global.open('/training/'+puzzleId);
            })
            .on('mouseover',ev=>{
              const anc = $('a',ev.currentTarget);
              const offset = anc.offset();
              offset.left += anc.width() + 16;
              parent.global.clearTimeout(this.popupTimeout);
              this.popupTimeout = parent.global.setTimeout(()=>{
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
      $('tr',tbody).filter(t=>$(t).prop('toDelete')).remove();
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('puzzleIndex');
      this.logOption('Puzzle index', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const trans = parent.translator;
      lichess.pubsub.off('lichessTools.redraw', this.searchPosition);
      if (!value) {
         this.indexFile?.dispose();
         this.indexFile = null;
         return;
      }
      lichess.pubsub.on('lichessTools.redraw', this.searchPosition);
    }

  }
  LiChessTools.Tools.PuzzleIndex = PuzzleIndexTool;
})();
