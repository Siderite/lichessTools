(() => {
  class ShowOpeningTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitContentLoaded'];

    preferences = [
      {
        name: 'showOpening',
        category: 'general',
        type: 'multiple',
        possibleValues: ['showInBoard', 'showInMinigames', 'showInExplorer'],
        defaultValue: 'showInBoard,showInMinigames,showInExplorer'
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.showOpening': 'Show game opening names',
        'openingNameTitle': 'LiChess Tools - opening name',
        'showOpening.showInBoard': 'For large board',
        'showOpening.showInMinigames': 'For minigames',
        'showOpening.showInExplorer': 'In Explorer'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.showOpening': 'Arat\u0103 numele deschiderii \u00een partide',
        'openingNameTitle': 'LiChess Tools - numele deschiderii',
        'showOpening.showInBoard': 'Pentru tabla mare',
        'showOpening.showInMinigames': 'Pentru table mici',
        'showOpening.showInExplorer': '\u00cen Explorator'
      }
    }

    miniGameOpening = async (el) => {
      if (!this.options.showInMinigames) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
      let fen = '';
      let gameId = '';
      if (el?.id && el?.fen) {
        fen = el.fen;
        gameId = el.id;
        el = $('.mini-game-' + el.id);
        if (!el.length) return;
      };
      if (!el) el = $.cached('body');
      const elems = $(el).find('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game').get();
      if ($(el).is('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game')) elems.push(el[0]);
      for (const el of elems) {
        fen = fen || $(el).attr('data-state');
        if (!gameId) {
          gameId = $(el).attr('href');
          if (!gameId) {
            fen = '';
            gameId = '';
            continue;
          }
          const m = /\/([^\/]+)/.exec(gameId);
          gameId = m && m[1];
          if (!gameId) {
            fen = '';
            gameId = '';
            continue;
          }
        }
        const result = await this.withOpening(gameId, el, undefined, fen, true);
        if (!result) {
          fen = '';
          gameId = '';
          continue;
        }
        const opening = result.opening;
        const container = result.el;
        let openingEl = $('.lichessTools-opening', container);
        if (!openingEl.length) {
          openingEl = $('<span class="lichessTools-opening"/>')
            .appendTo(container);
        }
        openingEl
          .text(opening)
          .attr('title', opening);
        fen = '';
        gameId = '';
      }
    };
    miniGameOpeningDebounced = this.lichessTools.debounce(this.miniGameOpening, 500);

    openingTime = 0;
    withOpening = async (gameId, el, ply, fen, isMini) => {
      const lt = this.lichessTools;
      if (!lt.inViewport(el)) return;
      const Math = lt.global.Math;
      if (!fen) fen = lt.getPositionFromBoard(el, true);
      const pos = lt.getPositionFromFen(fen);
      if (pos) {
        if (pos=='rnbqkbnrpppppppp8888PPPPPPPPRNBQKBNRw') return { time: Date.now(), opening: '*', el };
        if (!this.opening_dict) {
          const openings = await lt.comm.getData('openings.json');
          if (!openings) {
            lt.global.console.warn('Could not load openings!');
            return;
          }
          this.opening_dict=new Map(Object.keys(openings).map(k=>[k,openings[k]]));
        }
        let opening = this.opening_dict.get(pos);
        if (!opening) {
          const reversed = lt.getPositionFromFen(lt.reverseFen(fen));
          const op = this.opening_dict.get(reversed);
          if (op && op != '*') opening = op + ' (R)';
        }
        if (opening) {
          el.openingData = { time: Date.now(), opening, el };
          return el.openingData;
        }
      }
      

      if (!gameId || gameId == 'synthetic' || gameId == 'broadcast') return;

      const data = el?.openingData;
      if (data) {
        const now = Date.now();
        if (el.maxPly > 14 || now - data.time < 2000) return { time: now, opening: data.opening, el };
        if (isMini) return; // don't get the opening for minigames from API once retrieved
      }

      if (Date.now() - this.openingTime < 1000) return; // not more often than 1 second
      this.openingTime = Date.now();

      const pgn = await lt.api.game.getPgns([gameId], {
        tags: true,
        opening: true,
        moves: false,
        clocks: false,
        evals: false
      });
      const opening = lt.getPgnTag(pgn, 'Opening');
      if (!opening || opening == '?') {
        return;
      }
      if (el) {
        let time = Date.now();
        const termination = lt.getPgnTag(pgn, 'Termination');
        if (termination && termination != 'Unterminated') time += 86400;
        el.openingData = { time: time, opening: opening, el };
        if (ply) {
          el.maxPly = Math.max(ply, +el.maxPly || 0);
        }
        return el.openingData;
      }
    };

    showOpeningInExplorer = (opening) => {
      if (!this.options.showInExplorer) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const elem = $('section.explorer-box div.data div.title a');
      if (!elem.length) return;
      const existing = elem.text();
      opening = opening || '';
      const reg = /[\w\(\)\.\/]+/ig;
      let m = reg.exec(opening);
      let index = 0;
      const words = [];
      while (m) {
        const newIndex = existing.indexOf(m[0], index);
        if (newIndex < 0) {
          words.push(m[0]);
        } else {
          index = newIndex + m[0].length;
        }
        m = reg.exec(opening);
      }
      let openingElem = elem.next('.lichessTools-opening');
      if (!words.length) {
        openingElem.remove();
        return;
      }
      if (!openingElem.length) {
        openingElem = $('<span class="lichessTools-opening">')
          .attr('title', trans.noarg('openingNameTitle'))
          .insertAfter(elem);
      }
      const suffix = ' ' + words.join(' ');
      openingElem.text(suffix);
    };

    refreshOpening = async (ply) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
      if ($.cached('body').is('.playing')) return;
      const trans = lt.translator;
      const tvOptions = lt.getTvOptions();
      const gameId = tvOptions.gameId || lichess.analysis?.data?.game?.id;
      const fen = lichess.analysis?.node?.fen || lichess.analysis?.data?.game?.fen;
      const metaSection = $.cached('div.game__meta section, div.analyse__wiki.empty, div.chat__members:not(.none), .analyse__underboard .copyables, main#board-editor .copyables', 10000);
      const result = await this.withOpening(gameId, $.cached('main.round, main.analyse, main#board-editor', 10000)[0], ply, fen, false);
      if (!result) {
        metaSection.find('.lichessTools-opening').remove();
        this.showOpeningInExplorer(null);
        return;
      }
      if (this.options.showInBoard) {
        metaSection.find('span.lichessTools-opening').filter((i, e) => !lt.inViewport(e)).remove();
        if (!metaSection.find('span.lichessTools-opening').length) {
          const visibleEl = metaSection.filter((i, e) => !!lt.inViewport(e)).eq(0);
          visibleEl
            .append($('<span/>').addClass('lichessTools-opening').attr('title', trans.noarg('openingNameTitle')));
        }
        metaSection.find('span.lichessTools-opening').text(result.opening);
      }
      this.showOpeningInExplorer(result.opening);
      if (!ply) {
        await this.miniGameOpening();
      }
    };
    refreshOpeningDebounced = this.lichessTools.debounce(this.refreshOpening, 500);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('showOpening');
      this.logOption('Show game opening names', value);
      this.options = {
        showInBoard: lt.isOptionSet(value, 'showInBoard'),
        showInMinigames: lt.isOptionSet(value, 'showInMinigames'),
        showInExplorer: lt.isOptionSet(value, 'showInExplorer'),
      };
      const lichess = lt.lichess;
      if (!lichess) return;
      const $ = lt.$;
      lt.uiApi.socket.events.off('fen', this.miniGameOpening);
      lt.uiApi.events.off('ply', this.refreshOpeningDebounced);
      lt.uiApi.socket.events.off('endData', this.refreshOpeningDebounced);
      lt.pubsub.off('content-loaded', this.miniGameOpening);
      lt.global.clearInterval(this.interval);
      const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members:not(.none), .analyse__underboard .copyables, main#board-editor .copyables');
      metaSection.find('.lichessTools-opening').remove();
      $('a.mini-game .lichessTools-opening').remove();
      $('div.title .lichessTools-opening').remove();
      if (this.options.showInBoard) {
        lt.uiApi.socket.events.on('endData', this.refreshOpeningDebounced);
        lt.uiApi.events.on('ply', this.refreshOpeningDebounced);
        const intervalTime = $('main').is('#board-editor')
          ? 1000
          : 3500;
        this.interval = lt.global.setInterval(this.refreshOpeningDebounced, intervalTime);
        //this.refreshOpeningDebounced(); this is not essential to loading
      }
      if (this.options.showInMinigames) {
        lt.uiApi.socket.events.on('fen', this.miniGameOpening);
        lt.pubsub.on('content-loaded', this.miniGameOpening);
        this.miniGameOpeningDebounced();
      }
    }

  }
  LiChessTools.Tools.ShowOpening = ShowOpeningTool;
})();
