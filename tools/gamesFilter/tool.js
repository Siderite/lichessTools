(() => {
  class GamesFilterTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'gamesFilter',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.gamesFilter': 'Game list filters',
        'abortedGamesLabel': 'Show aborted games:'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.gamesFilter': 'Filtre \u00een liste de jocuri',
        'abortedGamesLabel': 'Arat\u0103 jocuri anulate:'
      }
    }

    processLists = ()=>{
      const parent = this.lichessTools;
      const $ = parent.$;
      const trans = parent.translator;
      const container = $('div.search__result');
      if (!container.length) return;
      let filters = $('.lichessTools-gamesFilter',container);
      if (filters.length) return;
      filters = $('<div class="lichessTools-gamesFilter">')
        .append($('<label for="chkAborted"></label>').text(trans.noarg('abortedGamesLabel')))
        .append($('<input type="checkbox" id="chkAborted"/>')
          .on('change',ev=>{
            const checked = !!ev.target.checked;
            container.toggleClass('lichessTools-gamesFilter-hideAborted',!checked);
          })
        )
        .insertBefore($('.search__rows, .games',container));
      filters.find('#chkAborted').trigger('change');
    };

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const lichess = parent.lichess;
      const value = parent.currentOptions.getValue('gamesFilter');
      this.logOption('Games filters', value);
      $('div.search__result .lichessTools-gamesFilter').remove();
      lichess.pubsub.off('lichess.redraw',this.processLists);
      if (!value) return;
      lichess.pubsub.on('lichess.redraw',this.processLists);
      this.processLists();
    }

  }
  LiChessTools.Tools.GamesFilter = GamesFilterTool;
})();
