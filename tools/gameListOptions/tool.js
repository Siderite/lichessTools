(() => {
  class GameListOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitContentLoaded'];

    preferences = [
      {
        name: 'gameListOptions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['aborted', 'analysis', 'titledOpponents', 'select', 'analysisLink', 'color'],
        defaultValue: 'select,analysis,analysisLink,color,aborted',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.gameListOptions': 'Game list options',
        'gameListOptions.aborted': 'Filter aborted',
        'gameListOptions.analysis': 'Filter analysed',
        'gameListOptions.titledOpponents': 'Filter titled opponents',
        'gameListOptions.color': 'Color by players',
        'gameListOptions.select': 'Selection',
        'gameListOptions.analysisLink': 'Go direct to analysis',
        'abortedGamesLabel': 'Show aborted:',
        'colorGamesLabel': 'Color by players:',
        'analysedGamesLabel': 'Only analysed:',
        'analysisLinkLabel': 'Click to analysis:',
        'titledOpponentsLabel': 'Only titled opponents:',
        'copyGamesButtonTitle': 'Download selected game PGNs',
        'PGNCopiedToClipboard': 'PGN copied to clipboard',
        'clipboardDenied': 'Clipboard access denied' 
      },
      'ro-RO': {
        'options.general': 'General',
        'options.gameListOptions': 'Opt\u0163uni \u00een liste de jocuri',
        'gameListOptions.aborted': 'Filtru anulate',
        'gameListOptions.analysis': 'Filtru analizate',
        'gameListOptions.titledOpponents': 'Filtru adversari cu titlu',
        'gameListOptions.color': 'Culoare dup\u0103 juc\u0103tori',
        'gameListOptions.select': 'Selec\u0163ie',
        'gameListOptions.analysisLink': 'Direct la analiz\u0103',
        'abortedGamesLabel': 'Arat\u0103 anulate:',
        'colorGamesLabel': 'Culoare dup\u0103 juc\u0103tori:',
        'analysedGamesLabel': 'Doar analizate:',
        'titledOpponentsLabel': 'Doar adversari cu titlu:',
        'analysisLinkLabel': 'Click pentru analiz\u0103:',
        'copyGamesButtonTitle': 'Descarc\u0103 PGNurile jocurilor selectate',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'clipboardDenied': 'Acces refuzat la clipboard'
      }
    }

    refreshActions = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!this.options.isSet) return;
      const container = $('div.search__result');
      if (!container.length) return;
      const filters = $('.lichessTools-gameListOptions',container);
      if (container.find('.lichessTools-gameListOptions-select input[type="checkbox"]:checked').length) {
        if (!$('button.lichessTools-gameListOptions-copy',filters).length) {
          $('<button class="lichessTools-gameListOptions-copy">')
            .attr('data-icon',lt.icon.Clipboard)
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
                  await lt.timeout(2000);
                }
                const batchPgns=await lt.api.game.getPgns(batch,{ moves: true, tags: true, clocks: true, evals: true, opening: true, accuracy: true, literate: true });
                pgns+=batchPgns;
              }
              lt.writeToClipboard(pgns, trans.noarg('PGNCopiedToClipboard'), trans.noarg('clipboardDenied'));
            })
            .appendTo(filters);
        }
      } else {
        $('button.lichessTools-gameListOptions-copy',filters).remove();
      }
    };

    processListsDirect = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!this.options.isSet) return;
      const container = $('div.search__result');
      if (!container.length) return;
      let filters = $('.lichessTools-gameListOptions',container);
      if (!filters.length) {
        filters = $('<div class="lichessTools-gameListOptions">')
          .insertBefore($('.search__rows, .games',container));
      }
      if (this.options.aborted) {
        if (!$(container).find('#chkAborted').length) {
          filters
            .prepend($('<input type="checkbox" id="chkAborted"/>')
              .on('change',ev=>{
                const checked = !!ev.target.checked;
                lt.storage.set('LiChessTools.gameListOptions.aborted',checked);
                container.toggleClass('lichessTools-gameListOptions-hideAborted',!checked);
                $('body').trigger('scroll');
              })
              .prop('checked', !!lt.storage.get('LiChessTools.gameListOptions.aborted'))
            )
            .prepend($('<label for="chkAborted"></label>').text(trans.noarg('abortedGamesLabel')));
          filters.find('#chkAborted').trigger('change');
        }
      }
      if (this.options.analysis) {
        if (!$(container).find('#chkAnalysis').length) {
          filters
            .prepend($('<input type="checkbox" id="chkAnalysis"/>')
              .on('change',ev=>{
                const checked = !!ev.target.checked;
                lt.storage.set('LiChessTools.gameListOptions.analysis',checked);
                container.toggleClass('lichessTools-gameListOptions-analysis',checked);
                $('body').trigger('scroll');
              })     
              .prop('checked', !!lt.storage.get('LiChessTools.gameListOptions.analysis'))
            )
            .prepend($('<label for="chkAnalysis"></label>').text(trans.noarg('analysedGamesLabel')));
          filters.find('#chkAnalysis').trigger('change');
        }
      }
      const m = /\/@\/(?<userId>[^\/\?#]+)/.exec(lt.global.location.pathname);
      const userId = m?.groups?.userId || lt.getUserId();
      if (this.options.titledOpponents) {
        if (!$(container).find('#chkTitledOpponents').length) {
          filters
            .prepend($('<input type="checkbox" id="chkTitledOpponents"/>')
              .on('change',ev=>{
                const checked = !!ev.target.checked;
                lt.storage.set('LiChessTools.gameListOptions.titledOpponents',checked);
                container.toggleClass('lichessTools-gameListOptions-titledOpponents',checked);
                $('body').trigger('scroll');
              })     
              .prop('checked', !!lt.storage.get('LiChessTools.gameListOptions.titledOpponents'))
            )
            .prepend($('<label for="chkTitledOpponents"></label>').text(trans.noarg('titledOpponentsLabel')));
          filters.find('#chkTitledOpponents').trigger('change');
        }
      }
      if (this.options.color) {
        if (!$(container).find('#chkColor').length) {
          filters
            .prepend($('<input type="checkbox" id="chkColor"/>')
              .on('change',ev=>{
                const checked = !!ev.target.checked;
                lt.storage.set('LiChessTools.gameListOptions.color',checked);
                container.toggleClass('lichessTools-gameListOptions-color',checked);
              })     
              .prop('checked', !!lt.storage.get('LiChessTools.gameListOptions.color'))
            )
            .prepend($('<label for="chkColor"></label>').text(trans.noarg('colorGamesLabel')));
          filters.find('#chkColor').trigger('change');
        }
      }
      if (this.options.analysisLink) {
        if (!$(container).find('#chkAnalysisLink').length) {
          filters
            .prepend($('<input type="checkbox" id="chkAnalysisLink"/>')
              .on('change',ev=>{
                const checked = !!ev.target.checked;
                lt.storage.set('LiChessTools.gameListOptions.analysisLink',checked);
                container.toggleClass('lichessTools-gameListOptions-analysisLink',checked);
                this.processLists();
              })     
              .prop('checked', !!lt.storage.get('LiChessTools.gameListOptions.analysisLink'))
            )
            .prepend($('<label for="chkAnalysisLink"></label>').text(trans.noarg('analysisLinkLabel')));
          filters.find('#chkAnalysisLink').trigger('change');
        }
      }
      if (this.options.select) {
        $('article.game-row',container).each((i,e)=>{
          const article=$(e).addClass('lichessTools-gameListOptions-select');
          if ($('input[type="checkbox"]',article).length) return;
          $('<input type="checkbox">')
            .on('change',this.refreshActions)
            .prependTo(article);
        });
        this.refreshActions();
      }
      $('article.game-row',container).each((i,e)=>{
        const playerElems = $('.versus div.player>span:first-child, .versus div.player a.user-link',e)
                          .get();
        const players = playerElems
                          .map(e2=>$(e2).text()?.trim());
        players.sort();
        const color = '#'+lt.crc24(players.join('|')).toString(16).padStart(6,'0')+'20';
        $(e).css('--playersColor',color);

        const isAnalysisLink = container.is('.lichessTools-gameListOptions-analysisLink');
        if (isAnalysisLink && !$(e).attr('data-orig-href')) {
          const isBlack = $(e).find('.game-row__board .mini-board').is('.orientation-black');
          const elem = $(e).find('a.game-row__overlay');
          const href = elem.attr('href');
          const m = /^\/(?<gameId>[^\/]+)/.exec(href);
          const xref = m
            ? '/' + m.groups.gameId.slice(0,8) + (isBlack?'/black':'')
            : href;
          elem.attr('href',xref);
          $(e).attr('data-orig-href',href);
        }  
        if (!isAnalysisLink && $(e).attr('data-orig-href')) {
          const elem = $(e).find('a.game-row__overlay');
          const href = $(e).attr('data-orig-href');
          elem.attr('href',href);
          $(e).removeAttr('data-orig-href');
        }

        const hasTitledOpponent = !!playerElems
                          .find(e3 => {
                            const el = $(e3).clone();
                            const titleEl = el.find('.utitle:not([data-bot])');
                            const isTitledPlayer = !!titleEl.length;
                            titleEl.remove();
                            const isUserId = userId && el.text()?.trim()?.toLowerCase() == userId?.toLowerCase();
                            return !isUserId && isTitledPlayer;
                          });
        $(e).toggleClass('lichessTools-hasTitledOpponent',hasTitledOpponent);
      });
    };
    processLists = this.lichessTools.debounce(this.processListsDirect,100);

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const value = lt.currentOptions.getValue('gameListOptions');
      this.logOption('Games filters', value);
      this.options = {
        aborted: lt.isOptionSet(value, 'aborted'),
        color: lt.isOptionSet(value, 'color'),
        select: lt.isOptionSet(value, 'select'),
        analysis: lt.isOptionSet(value, 'analysis'),
        analysisLink: lt.isOptionSet(value, 'analysisLink'),
        titledOpponents: lt.isOptionSet(value, 'titledOpponents'),
        get isSet() { return this.aborted || this.color || this.select || this.analysis || this.analysisLink || this.titledOpponents; }
      };
      $('div.search__result .lichessTools-gameListOptions').remove();
      $('.lichessTools-gameListOptions-select')
        .removeClass('lichessTools-gameListOptions-select')
        .find('input[type="checkbox"]')
        .remove();
      $('.lichessTools-gameListOptions-hideAborted')
        .removeClass('lichessTools-gameListOptions-hideAborted')
      $('.lichessTools-gameListOptions-color')
        .removeClass('lichessTools-gameListOptions-color')
      $('.lichessTools-gameListOptions-analysis')
        .removeClass('lichessTools-gameListOptions-analysis')
      $('.lichessTools-gameListOptions-analysisLink')
        .removeClass('lichessTools-gameListOptions-analysisLink')
      lt.pubsub.off('lichessTools.redraw',this.processLists);
      lt.pubsub.off('content-loaded',this.processLists);
      if (!this.options.isSet) return;
      lt.pubsub.on('lichessTools.redraw',this.processLists);
      lt.pubsub.on('content-loaded',this.processLists);
      this.processLists();
    }

  }
  LiChessTools.Tools.GameListOptions = GameListOptionsTool;
})();
