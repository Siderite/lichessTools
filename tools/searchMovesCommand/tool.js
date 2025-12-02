(() => {
  class SearchMovesCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['CliCommands','ExportPgn'];

    preferences = [
      {
        name: 'searchMovesCommand',
        category: 'command',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true,
        offValue: false
      }
    ];

    intl = {
      'en-US': {
        'options.searchMovesCommand': 'Command: search move list',
        'searchMovesCommand.helpText': '/s <FEN | PGN | text>\r\n * and ? wildcards supported\r\nSearch in move list'
      },
      'ro-RO': {
        'options.searchMovesCommand': 'Comand\u0103: caut\u0103 \u00een lista de mut\u0103ri',
        'searchMovesCommand.helpText': '/s <FEN | PGN | text>\r\n suport\u0103 \u00eenlocuitori * \u015fi ?\r\nCaut\u0103 \u00een lista de mut\u0103ri'
      }
    };

    index = 0;

    goToNode = (index) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;

      const path = this.nodes[index];
      const node = path && analysis.tree.nodeAtPath(path);
      if (node) {
        this.index = index;
      }

      const hasPrev = !!this.nodes[this.index-1];
      $('.lichessTools-searchMovesCommand .prev')
        .toggleClassSafe('disabled',!hasPrev)
        .prop('disabled',!hasPrev);

      const hasNext = !!this.nodes[this.index+1];
      $('.lichessTools-searchMovesCommand .next')
        .toggleClassSafe('disabled',!hasNext)
        .prop('disabled',!hasNext);

      $('.lichessTools-searchMovesCommand .position')
        .text(this.nodes.length ? `${this.index+1}/${this.nodes.length}` : '');

      if (node) {
        analysis.jump(path);
        lt.analysisRedraw();
      }
    };

    hideBar = () => {
      const lt = this.lichessTools;
      const $ = lt.$;

      $('.lichessTools-searchMovesCommand').remove();
    };

    showBar = () => {
      const lt = this.lichessTools;
      const $ = lt.$;

      let bar = $('.lichessTools-searchMovesCommand + .analyse__moves').prev();
      if (bar.length) {
        bar.find('input.search:not(:focus)')
          .each((i,e)=>e.select());
        return bar;
      }

      bar = $('<div class="lichessTools-searchMovesCommand">')
        .append($('<input type="text" class="search">')
          .on('input',ev=>{
            this.searchMoveList($(ev.target).val());
          })
          .on('keypress',ev=>{
            if (ev.key=='Enter' && this.nodes?.length>1) {
              ev.preventDefault();
              let index = this.index+1;
              if (index>=this.nodes.length) index = 0;
              this.goToNode(index);
            }
          })
          .on('keydown',ev=>{
            if (ev.key=='Escape') {
              ev.preventDefault();
              this.hideBar();
            }
          })
        )
        .append($('<button type="button" class="button prev">')
                   .attr('data-icon',lt.icon.LessThan)
                   .on('click',ev=>{
                     ev.preventDefault();
                     this.goToNode(this.index-1);
                   })
        )
        .append($('<button type="button" class="button next">')
                   .attr('data-icon',lt.icon.GreaterThan)
                   .on('click',ev=>{
                     ev.preventDefault();
                     this.goToNode(this.index+1);
                   })
        )
        .append($('<span class="position">'))
        .append($('<button type="button" class="button close">')
                   .attr('data-icon',lt.icon.Cancel)
                   .on('click',ev=>{
                     ev.preventDefault();
                     this.hideBar();
                   })
        )
        .insertBefore('.analyse__moves');

      bar.find('input.search:not(:focus)')
        .each((i,e)=>e.select());
      return bar;
    };

    showResults = (pattern, nodes) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;

      this.nodes = nodes;
      this.index = 0;

      const bar = this.showBar();
      bar.find('input.search')
        .val(pattern);
      bar.find('input.search:not(:focus)')
        .each((i,e)=>e.select());
      this.goToNode(0);
    };

    searchMoveListDirect = async (pattern) => {
      if (!pattern) {
        this.showResults('',[]);
        return;
      }
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const reg = new RegExp(Array.from(lt.normalizeString(pattern)).map(c => {
        switch (c) {
          case '*': return '.*';
          case '?': return '.';
          default: return c.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
        }
      }).join(''),'g');
      const searchObj = { reg, nodes: [] };
      await lt.exportPgn('',{ searchObj, separateLines: true });
      await lt.exportPgn('',{ searchObj, separateLines: true, exportComments: false, exportGlyphs: false });
      await lt.exportPgn('',{ searchObj, separateLines: true, exportComments: false, exportGlyphs: false, exportPly: false });
      this.showResults(pattern, [...new Set(searchObj.nodes)]);
    };
    searchMoveList = this.lichessTools.debounce(this.searchMoveListDirect,500);

    canSearch = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (lt.isGamePlaying()) return;
      if (analysis.gamebookPlay()) return;
      return true;
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('searchMovesCommand');
      this.options = { enabled: value };
      this.logOption('Command - trap value', value);
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      if (value) {
        lt.registerCommand && lt.registerCommand('searchMovesCommand', {
          handle: (val) => {
            if (!this.canSearch()) return;
            const m = /^\s*s(\s+(?<pattern>.*))?/.exec(val);
            if (!m) return;
            const pattern = m?.groups?.pattern;
            this.searchMoveList(pattern);
            return true;
          },
          getHelp: () => trans.noarg('searchMovesCommand.helpText')
        });
      } else {
        lt.unregisterCommand && lt.unregisterCommand('searchMovesCommand');
      }
    }
  }
  LiChessTools.Tools.SearchMovesCommand = SearchMovesCommandTool;
})();
