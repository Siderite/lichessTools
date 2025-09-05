(() => {
  class GameListOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitContentLoaded'];

    preferences = [
      {
        name: 'gameListOptions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['aborted', 'analysis', 'titledOpponents', 'select', 'analysisLink', 'color', 'extraInfo', 'remove'],
        defaultValue: 'select,analysis,analysisLink,color,aborted,extraInfo,remove',
        advanced: true
      }
    ];

    upgrades = [
      { name:'gameListOptions', value:'extraInfo', version: '2.4.40', type: 'new' },
      { name:'gameListOptions', value:'remove', version: '2.4.47', type: 'new' }
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
        'gameListOptions.extraInfo': 'More info button',
        'gameListOptions.remove': 'Remove games',
        'abortedGamesLabel': 'Show aborted:',
        'colorGamesLabel': 'Color by players:',
        'analysedGamesLabel': 'Only analysed:',
        'notAnalysedGamesLabel': 'Only not analysed:',
        'analysisLinkLabel': 'Click to analysis:',
        'titledOpponentsLabel': 'Only titled opponents:',
        'copyGamesButtonTitle': 'Download selected games as PGN',
        'csvGamesButtonTitle': 'Download selected games as CSV',
        'PGNCopiedToClipboard': 'PGN copied to clipboard',
        'clipboardDenied': 'Clipboard access denied',
        'deleteGamesButtonTitle': 'Delete selected imported games',
        'deleteSelectedQuestion': 'Are you sure you want to delete %s games?',
        'deleteSelectedQuestion:one': 'Are you sure you want to delete one game?',
        'removeBookmarksButtonTitle': 'Remove selected bookmarks',
        'removeBookmarksQuestion': 'Are you sure you want to remove %s bookmarks?',
        'removeBookmarksQuestion:one': 'Are you sure you want to remove the bookmark?',
        'extraInfoButtonTitle': 'More game information',
        'extraInfoTitle': `Accuracy: $accuracy
Average centipawn loss: $acpl
Inaccuracies / mistakes / blunders
  White: $whiteMoves
  Black: $blackMoves`
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
        'gameListOptions.extraInfo': 'Buton informa\u0163ii \u00een plus',
        'gameListOptions.remove': 'Elimin\u0103 jocuri',
        'abortedGamesLabel': 'Arat\u0103 anulate:',
        'colorGamesLabel': 'Culoare dup\u0103 juc\u0103tori:',
        'analysedGamesLabel': 'Doar analizate:',
        'notAnalysedGamesLabel': 'Doar neanalizate:',
        'titledOpponentsLabel': 'Doar adversari cu titlu:',
        'analysisLinkLabel': 'Click pentru analiz\u0103:',
        'copyGamesButtonTitle': 'Descarc\u0103 jocurile selectate ca PGN',
        'csvGamesButtonTitle': 'Descarc\u0103 jocurile selectate ca CSV',
        'PGNCopiedToClipboard': 'PGN copiat \u00een clipboard',
        'clipboardDenied': 'Acces refuzat la clipboard',
        'deleteGamesButtonTitle': '\u015Eterge jocurile importante selectate',
        'deleteSelectedQuestion': 'Sigur vrei sa \u015ftergi %s jocuri selectate?',
        'deleteSelectedQuestion:one': 'Sigur vrei sa \u015ftergi jocul selectat?',
        'removeBookmarksButtonTitle': '\u015Eterge bookmarkurile selectate',
        'removeBookmarksQuestion': 'Sigur vrei sa elimini %s bookmarkuri selectate?',
        'removeBookmarksQuestion:one': 'Sigur vrei sa elimini bookmarkul selectat?',
        'extraInfoButtonTitle': 'Informa\u0163ii \u00een plus despre jocuri',
        'extraInfoTitle': `Acurate\u01063e: $accuracy
ACPL: $acpl
Inexactit\u0103\u0163i/gre\u015feli/gafe
  Alb: $whiteMoves
  Negru: $blackMoves`
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
      if (this.options.extraInfo && container.find('article .metadata').length) {
        if (!$('button.lichessTools-gameListOptions-extraInfo',filters).length) {
          $('<button class="lichessTools-gameListOptions-extraInfo">')
            .attr('data-icon',lt.icon.BarChart)
            .attr('title',trans.noarg('extraInfoButtonTitle'))
            .on('click',async ev=>{
              ev.preventDefault();
              const ids = container.find('article:has(.metadata:not(.lichessTools-extraInfo)) .game-row__overlay')
                .get()
                .map((e)=>{
                  const href = $(e).attr('href');
                  return href ? href.substr(1,8) : null;
                })
                .filter(id=>!!id);
              let info = new Map();
              let batch;
              while ((batch = ids.splice(0,300)).length) {
                if (info.length) {
                  await lt.timeout(2000);
                }
                const games=await lt.api.game.getPgns(batch,{ ndjson: true, accuracy: true, moves: false, tags: false, clocks: false, evals: false, opening: false, literate: false });
                for (const game of games) {
                  info.set(game.id,game);
                }
              }
              container.find('article:has(.metadata:not(.lichessTools-extraInfo)) .game-row__overlay')
                .each((i,e)=>{
                  const href = $(e).attr('href');
                  const gameId = href ? href.substr(1,8) : null;
                  const game = info.get(gameId);
                  if (!game) return;

                  const wa = game.players?.white?.analysis;
                  const ba = game.players?.black?.analysis;
                  const accText = [wa?.accuracy, ba?.accuracy].join(' / ');
                  const acplText = [wa?.acpl, ba?.acpl].join(' / ');
                  const whiteMovesText = [wa.mistake, wa.inaccuracy, wa.blunder].join(' / ')
                  const blackMovesText = [ba.mistake, ba.inaccuracy, ba.blunder].join(' / ')

                  const infoText = accText;
                  const infoTitle = trans.noarg('extraInfoTitle')
                    .replace('$accuracy',accText)
                    .replace('$acpl',acplText)
                    .replace('$whiteMoves',whiteMovesText)
                    .replace('$blackMoves',blackMovesText);


                  $(e).closest('article').find('.metadata')
                    .each((i2,e2)=>{
                      const metadata = $(e2);
                      metadata
                        .addClass('lichessTools-extraInfo')
                        .attr('title',infoTitle)
                        .append($('<span>').text(infoText));
                    });
                });
            })
            .appendTo(filters);
        }
      } else {
        $('lichessTools-gameListOptions-extraInfo',filters).remove();
      }
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
                  return href ? href.substr(1,8) : null;
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
              lt.download(pgns,'lichessTools_' + lt.toTimeString(new Date()) + '.pgn','application/x-chess-pgn');
            })
            .appendTo(filters);
        }
        if (!$('button.lichessTools-gameListOptions-csv',filters).length) {
          $('<button class="lichessTools-gameListOptions-csv">')
            .attr('data-icon',lt.icon.Document)
            .attr('title',trans.noarg('csvGamesButtonTitle'))
            .on('click',async ev=>{
              ev.preventDefault();
              const ids = container.find('.lichessTools-gameListOptions-select input[type="checkbox"]:checked')
                .get()
                .map((e)=>{
                  const href = $(e).next('a').attr('href');
                  return href?href.substr(1,8):null;
                })
                .filter(id=>!!id);
              let pgns = [];
              let batch;
              while ((batch = ids.splice(0,300)).length) {
                if (pgns!='') {
                  pgns+='\r\n';
                  await lt.timeout(2000);
                }
                const batchPgns=await lt.api.game.getPgns(batch,{ moves: true, tags: true, clocks: true, evals: true, opening: true, accuracy: true, literate: true, pgnInJson: true, division: true, ndjson: true });
                pgns=pgns.concat(batchPgns);
              }
              const csv = this.getCsv(pgns);
              lt.writeToClipboard(csv, trans.noarg('PGNCopiedToClipboard'), trans.noarg('clipboardDenied'));
              lt.download(csv,'lichessTools_' + lt.toTimeString(new Date()) + '.csv','text/csv');
            })
            .appendTo(filters);
        }
        const userId = lt.getUserId()?.toLowerCase();
        let m = /\/@\/(?<userId>[^\/\?#]+)\/imported\b/.exec(lt.global.location.pathname);
        const isImportedPage = userId && m?.groups?.userId?.toLowerCase() == userId;
        if (this.options.remove && isImportedPage && !$('button.lichessTools-gameListOptions-delete',filters).length) {
          $('<button class="lichessTools-gameListOptions-delete">')
            .attr('data-icon',lt.icon.Trash)
            .attr('title',trans.noarg('deleteGamesButtonTitle'))
            .on('click',async ev=>{
              ev.preventDefault();
              const items = container.find('.lichessTools-gameListOptions-select input[type="checkbox"]:checked')
                .get()
                .map((e)=>{
                  const href = $(e).next('a').attr('href');
                  const id = href
                    ? href.substr(1,8)
                    : null;
                  return { id: id, el: $(e).closest('article') };
                })
                .filter(item=>!!item.id);
              if (!await lt.uiApi.dialog.confirm(trans.pluralSame('deleteSelectedQuestion',items.length))) {
                return;
              }
              for (const item of items) {
                await lt.api.game.deleteImported(item.id);
                item.el.remove();
                await lt.timeout(100);
              }
              lt.global.document.location.reload();
            })
            .appendTo(filters);
        }
        m = /\/@\/(?<userId>[^\/\?#]+)\/bookmark\b/.exec(lt.global.location.pathname);
        const isBookmarksPage = userId && m?.groups?.userId?.toLowerCase() == userId;
        if (this.options.remove && isBookmarksPage && !$('button.lichessTools-gameListOptions-delete',filters).length) {
          $('<button class="lichessTools-gameListOptions-delete">')
            .attr('data-icon',lt.icon.Trash)
            .attr('title',trans.noarg('removeBookmarksButtonTitle'))
            .on('click',async ev=>{
              ev.preventDefault();
              const items = container.find('.lichessTools-gameListOptions-select input[type="checkbox"]:checked')
                .get()
                .map((e)=>{
                  const href = $(e).next('a').attr('href');
                  const id = href
                    ? href.substr(1,8)
                    : null;
                  return { id: id, el: $(e).closest('article') };
                })
                .filter(item=>!!item.id);
              if (!await lt.uiApi.dialog.confirm(trans.pluralSame('removeBookmarksQuestion',items.length))) {
                return;
              }
              for (const item of items) {
                await lt.api.game.removeBookmark(item.id);
                item.el.remove();
                await lt.timeout(100);
              }
              lt.global.document.location.reload();
            })
            .appendTo(filters);
        }
      } else {
        $('button.lichessTools-gameListOptions-copy',filters).remove();
        $('button.lichessTools-gameListOptions-csv',filters).remove();
        $('button.lichessTools-gameListOptions-delete',filters).remove();
      }
    };

    getCsv = (pgns)=>{
      const lt = this.lichessTools;
      const result=[];
      result.push('"id","rated","variant","speed","perf","createdAt","lastMoveAt","status","white","black","whiteRating","blackRating","whiteRatingDiff","blackRatingDiff","winner","eco","opening","clockInitial","clockIncrement","totalTime","middle","end","pgn","moves","clocks"');
      const dateString = (time)=>{
        const d = new lt.global.Date(time);
        return d.getUTCFullYear() + 
               '-'+(d.getUTCMonth()+1).toString().padStart(2,'0') +
               '-'+d.getUTCDate().toString().padStart(2,'0') +
               ' '+d.getUTCHours().toString().padStart(2,'0') +
               ':'+d.getUTCMinutes().toString().padStart(2,'0') +
               ':'+d.getUTCSeconds().toString().padStart(2,'0');
      };
      const csvString = (arr)=>{
        return arr.map(i=>{
          const s = (i?.toString()||'').replaceAll(/"/g,'""');
          return /[",\r\n]/.test(s)
            ? '"'+s+'"'
            : s;
        }).join(',');
      };
      for (const pgn of pgns) {
        result.push(csvString([
          pgn.id,
          pgn.rated,
          pgn.variant,
          pgn.speed,
          pgn.perf,
          dateString(pgn.createdAt),
          dateString(pgn.lastMoveAt),
          pgn.status,
          pgn.players?.white?.user?.name,
          pgn.players?.black?.user?.name,
          pgn.players?.white?.rating,
          pgn.players?.black?.rating,
          pgn.players?.white?.ratingDiff,
          pgn.players?.black?.ratingDiff,
          pgn.winner,
          pgn.opening?.eco,
          pgn.opening?.name,
          pgn.clock?.initial,
          pgn.clock?.increment,
          pgn.clock?.totalTime,
          pgn.division?.middle,
          pgn.division?.end,
          pgn.pgn,
          pgn.moves,
          '="'+(pgn.clocks||[]).join(',')+'"'
        ]));
      }
      return result.join('\r\n');
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
        if (!$(container).find('#chkNoAnalysis').length) {
          filters
            .prepend($('<input type="checkbox" id="chkNoAnalysis"/>')
              .on('change',ev=>{
                const checked = !!ev.target.checked;
                lt.storage.set('LiChessTools.gameListOptions.noAnalysis',checked);
                container.toggleClass('lichessTools-gameListOptions-noAnalysis',checked);
                $('body').trigger('scroll');
              })     
              .prop('checked', !!lt.storage.get('LiChessTools.gameListOptions.noAnalysis'))
            )
            .prepend($('<label for="chkNoAnalysis"></label>').text(trans.noarg('notAnalysedGamesLabel')));
          filters.find('#chkNoAnalysis').trigger('change');
        }
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
        $(e).toggleClassSafe('lichessTools-hasTitledOpponent', hasTitledOpponent);
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
        extraInfo: lt.isOptionSet(value, 'extraInfo'),
        remove: lt.isOptionSet(value, 'remove'),
        get isSet() { return this.aborted || this.color || this.select || this.analysis || this.analysisLink || this.titledOpponents || this.extraInfo || this.remove; }
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
