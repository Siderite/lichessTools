(() => {
  class ShowPawnStructureTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitContentLoaded'];

    preferences = [
      {
        name: 'showPawnStructure',
        category: 'general',
        type: 'multiple',
        possibleValues: ['enabled', 'onlyNamed', 'fuzzy'],
        defaultValue: 'onlyNamed,fuzzy'
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.showPawnStructure': 'Show pawn structures',
        'showPawnStructure.enabled': 'Enabled',
        'showPawnStructure.onlyNamed': 'Only named structures',
        'showPawnStructure.fuzzy': 'Fuzzy search',
        'structureNameTitle': 'LiChess Tools - pawn structure - %s'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.showPawnStructure': 'Arat\u0103 structura de pioni \u00een partide',
        'showPawnStructure.enabled': 'Activat',
        'showPawnStructure.onlyNamed': 'Doar structuri cu nume',
        'showPawnStructure.fuzzy': 'C\u0103utare aproximativ\u0103',
        'structureNameTitle': 'LiChess Tools - structura de pioni - %s'
      }
    }

    getStructureName = async (structure, onlyNamed) => {
      const lt = this.lichessTools;
      if (!structure) return null;
      const threshold = this.options.fuzzy ? 90 : 100;

      if (!this.pawnStructures) {
        this.pawnStructures = await lt.comm.getData('pawnStructures.json');
        if (!this.pawnStructures) {
          lt.global.console.warn('Could not load pawn structures!');
          return;
        }
      }

      const getArr = (structure) => {
        if (!this.pawnStructures) return [];
        const arr = [];
        for (const item of this.pawnStructures) {
          const value = { name: item.name, url: item.url };
          for (const k of item.structures || []) {
            arr.push({
              key: k,
              value: value,
              similarity: LiChessTools.PawnStructure.keySimilarity(structure, k)
            });
          }
        }
        arr.sort((o1, o2) => o2.similarity - o1.similarity);
        return arr;
      };

      const arr = getArr(structure);
      if (arr[0].similarity == 100) return arr[0].value;
      const opp = LiChessTools.PawnStructure.getOpposingStructure(structure);
      const oppArr = getArr(opp).map(i => {
        return {
          ...i,
          value: {
            ...i.value,
            name: i.value.name + ' (R)'
          }
        };
      });
      if (oppArr[0].similarity == 100) return oppArr[0].value;

      const arrItem = arr[0].similarity > oppArr[0].similarity
        ? arr[0]
        : oppArr[0];

      if (arrItem.similarity >= threshold) {
        return arrItem.value;
      }

      if (onlyNamed || this.options.onlyNamed) return null;
      return {
        name: structure.split(' ')[0],
        best: arrItem
      };
    };

    getEuweKramerUrl = (code) => {
      return 'https://siderite.dev/LiChessTools/pawnStructures.html#ek-' + code.toLowerCase().replace(/\./g, '');
    };

    addStructureAnchor = (el, structureName, structure, euweKramer) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!el.length) el = $(el);
      const ek = euweKramer?.code ? euweKramer : null;
      let structureElem = el.find('.lichessTools-structure');
      if (!structureName && !ek) {
        structureElem.remove();
        return;
      }

      if (!structureElem.length) {
        const visibleEl = el.filter((i, e) => !!lt.inViewport(e)).eq(0);
        structureElem = $('<span>')
          .addClass('lichessTools-structure')
          .appendTo(visibleEl);
      }

      let nameEl = structureElem.find('.lichessTools-structureName');
      if (structureName) {
        const isLink = !!structureName.url;
        let title = trans.pluralSame('structureNameTitle', structure);
        if (structureName.best) title += '\r\n' + structureName.best.value.name + ' ' + structureName.best.similarity + '%';

        if (!nameEl.length || nameEl.is('a') !== isLink) {
          nameEl = $('<' + (isLink ? 'a' : 'span') + '>')
            .addClass('lichessTools-structureName');
          const ekExisting = structureElem.find('.lichessTools-euweKramer');
          if (ekExisting.length) nameEl.insertBefore(ekExisting);
          else nameEl.appendTo(structureElem);
        }
        nameEl
          .textSafe(structureName.name)
          .attrSafe('title', title);
        if (isLink) {
          nameEl.attrSafe('target', '_blank');
          nameEl.attrSafe('href', structureName.url);
        }
      } else {
        nameEl.remove();
      }

      let ekEl = structureElem.find('.lichessTools-euweKramer');
      if (ek) {
        let ekTitle = ek.code + ' ' + ek.name + ' \u2014 ' + ek.category;
        const others = (ek.matches || []).map(m => m?.code).filter(c => c && c !== ek.code);
        if (others.length) {
          ekTitle += '\r\n' + others.join(', ');
        }
        if (!ekEl.length) {
          ekEl = $('<a>')
            .addClass('lichessTools-euweKramer')
            .appendTo(structureElem);
        }
        ekEl
          .attrSafe('target', '_blank')
          .attrSafe('href', this.getEuweKramerUrl(ek.code))
          .attrSafe('title', ekTitle)
          .textSafe(ek.code);
      } else {
        ekEl.remove();
      }
    };

    miniGameStructure = async (el) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const analysis = lt.lichess.analysis;
      if (lt.global.document.hidden) return;
      const showStaticAnalysis = analysis?.settings?.showStaticAnalysis;
      if ($.cached('body').is('.playing') || (showStaticAnalysis === false && !analysis?.cevalEnabled())) {
        $('.lichessTools-structure').remove();
        return;
      }
      const evalCheckbox = $.cached('body').find('.study__multiboard__options label.eval input');
      if (evalCheckbox.length && !evalCheckbox.is(':checked')) return;

      const withParameter = !!el;
      const trans = lt.translator;
      let fen = '';
      if (el?.id && el?.fen) {
        fen = el.fen;
        el = $('.mini-game-' + el.id);
        if (!el.length) return;
      };
      if (!$(el).length) el = $.cached('body');
      const elems = $(el).find('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game').get();
      if ($(el).is('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game')) elems.push(el[0]);
      if (withParameter && !elems.length) {
        this.miniGameStructure();
        return;
      }
      let notInViewport = false;
      for (const el of elems) {
        if (!lt.inViewport(el)) {
          notInViewport = true;
          continue;
        }
        if ($(el).closest('.lichessTools-lichessLadders-userChallenges').length) continue;

        fen = fen || $(el).attr('data-state') || lt.getPositionFromBoard(el, true);
        if (!fen) {
          //lt.global.console.warn('Could not get fen for element', el);
          continue;
        }
        const board = lt.getBoardFromFen(fen);
        const structure = LiChessTools.ChessMetrics.getStructure(board);
        const euweKramer = LiChessTools.ChessMetrics.getEuweKramer(board);
        const inCurrentGames = !!$(el).closest('.now-playing').length;
        const structureName = await this.getStructureName(structure, inCurrentGames);
        this.addStructureAnchor(el, structureName, structure, euweKramer);
        fen = '';
      }
      if (notInViewport) this.miniGameStructureDebounced();
    };
    miniGameStructureDebounced = this.lichessTools.debounce(this.miniGameStructure, 500);

    refreshStructure = async (ply) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
      if (lt.location.isGamesPage()) {
        return;
      }
      const showStaticAnalysis = analysis?.settings?.showStaticAnalysis;
      if ($.cached('body').is('.playing') || (showStaticAnalysis === false && !analysis?.cevalEnabled())) {
        $('.lichessTools-structure').remove();
        return;
      }
      const trans = lt.translator;
      const fen = analysis?.node?.fen || lt.getPositionFromBoard($('main'), true);
      if (!fen) return;
      const board = lt.getBoardFromFen(fen);
      const structure = await LiChessTools.ChessMetrics.getStructure(board);
      const metaSection = $.cached('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables', 10000);
      if (!structure) {
        metaSection.find('.lichessTools-structure').remove();
        return;
      }
      const euweKramer = LiChessTools.ChessMetrics.getEuweKramer(board);
      const structureName = await this.getStructureName(structure);
      this.addStructureAnchor(metaSection, structureName, structure, euweKramer);
      if (!ply) {
        await this.miniGameStructure();
      }
    };
    refreshStructureDebounced = this.lichessTools.debounce(this.refreshStructure, 500);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('showPawnStructure');
      this.logOption('Show pawn structures', value);
      this.options = {
        enabled: lt.isOptionSet(value, 'enabled'),
        onlyNamed: lt.isOptionSet(value, 'onlyNamed'),
        fuzzy: lt.isOptionSet(value, 'fuzzy')
      };
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      lt.uiApi.socket.events.off('endData', this.refreshStructureDebounced);
      lt.uiApi.socket.events.off('fen', this.miniGameStructure);
      lt.uiApi.events.off('ply', this.refreshStructureDebounced);
      lt.pubsub.off('lichessTools.redraw', this.refreshStructureDebounced);
      lt.pubsub.off('lichessTools.contentLoaded', this.miniGameStructureDebounced);
      lt.global.clearInterval(this.interval);
      $('body').observer()
        .off('input[type=checkbox]',this.miniGameStructure);
      $('body').observer()
        .off('input[type=checkbox]',this.refreshStructureDebounced);
      if (this.options.enabled) {
        lt.uiApi.socket.events.on('endData', this.refreshStructureDebounced);
        lt.uiApi.socket.events.on('fen', this.miniGameStructure);
        lt.uiApi.events.on('ply', this.refreshStructureDebounced);
        lt.pubsub.on('lichessTools.redraw', this.refreshStructureDebounced);
        lt.pubsub.on('lichessTools.contentLoaded', this.miniGameStructureDebounced);
        lt.global.setTimeout(this.refreshStructureDebounced,1000); // this is not essential to loading
        if ($('main').is('#board-editor')) {
          this.interval = lt.global.setInterval(this.refreshStructureDebounced, 1000);
        }
        $('body').observer()
          .on('input[type=checkbox]',this.miniGameStructure,{ attributes: true });
        $('body').observer()
          .on('input[type=checkbox]',this.refreshStructureDebounced,{ attributes: true });
      } else {
        const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables');
        metaSection.find('.lichessTools-structure').remove();
      }
      if (lt.location.isGamesPage()) {
        $.cached('body').toggleClass('lichessTools-structureMiniGames', this.options.enabled);
      }
    }

  }
  LiChessTools.Tools.ShowPawnStructure = ShowPawnStructureTool;
})();
