(() => {
  class GameListOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'gameListOptions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['filters', 'select'],
        defaultValue: 'filters,select',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.gameListOptions': 'Game list options',
        'gameListOptions.filters': 'Filters',
        'gameListOptions.select': 'Selection',
        'abortedGamesLabel': 'Show aborted games:',
        'copyGamesButtonTitle': 'Download selected game PGNs',
        'PGNCopiedToClipboard': 'PGN copied to clipboard',
        'clipboardDenied': 'Clipboard access denied'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.gameListOptions': 'Opt\u0163uni \u00een liste de jocuri',
        'gameListOptions.filters': 'Filtre',
        'gameListOptions.select': 'Selec\u0163ie',
        'abortedGamesLabel': 'Arat\u0103 jocuri anulate:',
        'copyGamesButtonTitle': 'Descarc\u0103 PGNurile jocurilor selectate',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'clipboardDenied': 'Acces refuzat la clipboard'
      }
    }

    refreshActions = ()=>{
      const parent = this.lichessTools;
      const $ = parent.$;
      const trans = parent.translator;
      if (!this.options.isSet) return;
      const container = $('div.search__result');
      if (!container.length) return;
      const filters = $('.lichessTools-gameListOptions',container);
      if (container.find('.lichessTools-gameListOptions-select input[type="checkbox"]:checked').length) {
        if (!$('button.lichessTools-gameListOptions-copy',filters).length) {
          $('<button class="lichessTools-gameListOptions-copy">')
            .attr('data-icon','\uE070')
            .attr('title',trans.noarg('copyGamesButtonTitle'))
            .on('click',async ev=>{
              ev.preventDefault();
              const ids = container.find('.lichessTools-gameListOptions-select input[type="checkbox"]:checked')
                .get()
                .map((e)=>{
                  const href = $(e).next('a').attr('href');
                  return href?href.substr(1,8):null;
                })
                .filter(id=>!!id);
              let pgns = '';
              let batch;
              while ((batch = ids.splice(0,300)).length) {
                if (pgns!='') {
                  pgns+='\r\n';
                  await parent.timeout(2000);
                }
                const batchPgns=await parent.api.game.getPgns(batch,{ moves: true, tags: true, clocks: true, evals: true, opening: true, accuracy: true, literate: true });
                pgns+=batchPgns;
              }
              parent.writeToClipboard(pgns, trans.noarg('PGNCopiedToClipboard'), trans.noarg('clipboardDenied'));
            })
            .appendTo(filters);
        }
      } else {
        $('button.lichessTools-gameListOptions-copy',filters).remove();
      }
    };

    processLists = ()=>{
      const parent = this.lichessTools;
      const $ = parent.$;
      const trans = parent.translator;
      if (!this.options.isSet) return;
      const container = $('div.search__result');
      if (!container.length) return;
      let filters = $('.lichessTools-gameListOptions',container);
      if (!filters.length) {
        filters = $('<div class="lichessTools-gameListOptions">')
          .insertBefore($('.search__rows, .games',container));
      }
      if (this.options.filters && !$(container).find('#chkAborted').length) {
        filters
          .prepend($('<input type="checkbox" id="chkAborted"/>')
            .on('change',ev=>{
              const checked = !!ev.target.checked;
              container.toggleClass('lichessTools-gameListOptions-hideAborted',!checked);
            })     
          )
          .prepend($('<label for="chkAborted"></label>').text(trans.noarg('abortedGamesLabel')));
        filters.find('#chkAborted').trigger('change');
      }
      if (this.options.select) {
        $('article.game-row',container).each((i,e)=>{
          const article=$(e).addClass('lichessTools-gameListOptions-select');
          if ($('input[type="checkbox"]',article).length) return;
          $('<input type="checkbox">')
            .attr('title',trans.noarg('selectCheckboxTitle'))
            .on('change',this.refreshActions)
            .prependTo(article);
        });
        this.refreshActions();
      }
    };

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const lichess = parent.lichess;
      const value = parent.currentOptions.getValue('gameListOptions');
      this.logOption('Games filters', value);
      this.options = {
        filters: parent.isOptionSet(value, 'filters'),
        select: parent.isOptionSet(value, 'select'),
        get isSet() { return this.filters || this.select; }
      };
      $('div.search__result .lichessTools-gameListOptions').remove();
      $('.lichessTools-gameListOptions-select')
        .removeClass('lichessTools-gameListOptions-select')
        .find('input[type="checkbox"]')
        .remove();
      lichess.pubsub.off('lichess.redraw',this.processLists);
      lichess.pubsub.off('content-loaded',this.processLists);
      if (!this.options.isSet) return;
      lichess.pubsub.on('lichess.redraw',this.processLists);
      lichess.pubsub.on('content-loaded',this.processLists);
      this.processLists();
    }

  }
  LiChessTools.Tools.GameListOptions = GameListOptionsTool;
})();
