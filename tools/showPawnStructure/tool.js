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

    isGamesPage = () => {
      const lt = this.lichessTools;
      return /^\/games(\/|$)?/i.test(lt.global.location.pathname);
    };

    isBroadcastPage = () => {
      const lt = this.lichessTools;
      return /^\/broadcast\//i.test(lt.global.location.pathname);
    };

    getStructure = (board, blackOrientation) => {
      if (!board) return null;
      const lt = this.lichessTools;
      const result = {
        pawns: {
          'w': [-1, -1, -1, -1, -1, -1, -1, -1],
          'b': [-1, -1, -1, -1, -1, -1, -1, -1]
        },
        led: {
          'w': [false, false, false, false, false, false, false, false],
          'b': [false, false, false, false, false, false, false, false]
        },
        islands: { w: [], b: [] },
        qSide: { 'w': 0, 'b': 0 },
        kSide: { 'w': 0, 'b': 0 }
      };
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const ch = board[y][x];
          switch (ch) {
            case 'p':
              if (y <= 4) {
                if (result.pawns.b[x] > -1) result.led.b[x] = true;
                result.pawns.b[x] = y - 1;
              }
              break;
            case 'P':
              if (y >= 3) {
                if (result.pawns.w[x] > -1) result.led.w[x] = true;
                result.pawns.w[x] = 6 - y;
              }
              break;
          }
        }
      }
      for (let x = 0; x < 8; x++) {
        if (result.pawns.w[x] == -1) continue;
        let island = result.islands.w.at(-1);
        if (island?.end === x - 1) {
          island.end++;
        } else {
          island = { start: x, end: x };
          result.islands.w.push(island);
        }
      }
      for (let x = 0; x < 8; x++) {
        if (result.pawns.b[x] == -1) continue;
        let island = result.islands.b.at(-1);
        if (island?.end === x - 1) {
          island.end++;
        } else {
          island = { start: x, end: x };
          result.islands.b.push(island);
        }
      }

      let isle = result.islands.w.at(0);
      if (isle?.start < 2) result.qSide.w = Math.min(3, isle.end) - isle.start + 1;
      isle = result.islands.b.at(0);
      if (isle?.start < 2) result.qSide.b = Math.min(3, isle.end) - isle.start + 1;
      isle = result.islands.w.at(-1);
      if (isle?.end > 5) result.kSide.w = isle.end - Math.max(4, isle.start) + 1;
      isle = result.islands.b.at(-1);
      if (isle?.end > 5) result.kSide.b = isle.end - Math.max(4, isle.start) + 1;

      const me = blackOrientation ? 'b' : 'w';
      const they = blackOrientation ? 'w' : 'b';
      let structureText = '';
      structureText += result.pawns[me][3] < 0 ? 'X' : result.pawns[me][3];
      structureText += result.pawns[me][4] < 0 ? 'X' : result.pawns[me][4];
      structureText += result.pawns[me][2] < 0 ? 'X' : result.pawns[me][2];
      structureText += result.pawns[they][3] < 0 ? 'X' : result.pawns[they][3];
      structureText += result.pawns[they][4] < 0 ? 'X' : result.pawns[they][4];
      structureText += result.pawns[they][2] < 0 ? 'X' : result.pawns[they][2];
      structureText += result.qSide[me] > result.qSide[they] ? 'M' : result.qSide[me] < result.qSide[they] ? 'T' : 'X';
      structureText += result.kSide[me] > result.kSide[they] ? 'M' : result.kSide[me] < result.kSide[they] ? 'T' : 'X';
      structureText += ' ';
      structureText += result.pawns[me][5] < 0 ? 'X' : result.pawns[me][5];
      structureText += result.pawns[me][1] < 0 ? 'X' : result.pawns[me][1];
      structureText += result.pawns[me][6] < 0 ? 'X' : result.pawns[me][6];
      structureText += result.pawns[they][5] < 0 ? 'X' : result.pawns[they][5];
      structureText += result.pawns[they][1] < 0 ? 'X' : result.pawns[they][1];
      structureText += result.pawns[they][6] < 0 ? 'X' : result.pawns[they][6];
      structureText += ' ';
      structureText += result.pawns[me][0] < 0 ? 'X' : result.pawns[me][0];
      structureText += result.pawns[me][7] < 0 ? 'X' : result.pawns[me][7];
      structureText += result.pawns[they][0] < 0 ? 'X' : result.pawns[they][0];
      structureText += result.pawns[they][7] < 0 ? 'X' : result.pawns[they][7];
      structureText += ' ';
      structureText += result.led[me][3] ? 'L' : 'X';
      structureText += result.led[me][4] ? 'L' : 'X';
      structureText += result.led[me][2] ? 'L' : 'X';
      structureText += result.led[they][3] ? 'L' : 'X';
      structureText += result.led[they][4] ? 'L' : 'X';
      structureText += result.led[they][2] ? 'L' : 'X';
      structureText += ' ';
      structureText += result.led[me][5] ? 'L' : 'X';
      structureText += result.led[me][1] ? 'L' : 'X';
      structureText += result.led[me][6] ? 'L' : 'X';
      structureText += result.led[they][5] ? 'L' : 'X';
      structureText += result.led[they][1] ? 'L' : 'X';
      structureText += result.led[they][6] ? 'L' : 'X';
      structureText += ' ';
      structureText += result.led[me][0] ? 'L' : 'X';
      structureText += result.led[me][7] ? 'L' : 'X';
      structureText += result.led[they][0] ? 'L' : 'X';
      structureText += result.led[they][7] ? 'L' : 'X';
      return structureText;
    };

    keySimilarityDirect = (kSearch, kNamed) => {
      kSearch = kSearch.replaceAll(' ', '');
      kNamed = kNamed.replaceAll(' ', '');
      const l = Math.min(kSearch.length, kNamed.length);
      let sim = 0;
      let prefixOver = false;
      for (let i = 0; i < l; i++) {
        if (kSearch[i] == kNamed[i]) {
          sim += prefixOver ? 0.8 : 1;
        } else {
          prefixOver = true;
          const pSearch = +kSearch[i];
          const pNamed = +kNamed[i];
          if (pSearch >= 0 && pNamed >= 0 && pSearch < pNamed) {
            sim += 0.2;
          }
        }
      }
      return Math.round(sim * 100 / l);
    };
    keyCache = {};
    keySimilarity = (kSearch, kNamed) => {
      const k = kSearch + '|' + kNamed;
      let result = this.keyCache[k];
      if (!result) {
        result = this.keySimilarityDirect(kSearch, kNamed);
        this.keyCache[k] = result;
      }
      return result;
    };

    getOpposingStructure = structure => {
      const result =
        structure.substr(3, 3) +
        structure.substr(0, 3) +
        structure.substr(6, 2).replaceAll('M', 'x').replaceAll('T', 'M').replaceAll('x', 'T') +
        ' ' +
        structure.substr(12, 3) +
        structure.substr(9, 3) +
        ' ' +
        structure.substr(18, 2) +
        structure.substr(16, 2) +
        ' ' +
        structure.substr(24, 3) +
        structure.substr(21, 3) +
        ' ' +
        structure.substr(31, 3) +
        structure.substr(28, 3) +
        ' ' +
        structure.substr(37, 2) +
        structure.substr(35, 2);
      return result;
    };

    getStructureName = async (structure) => {
      const lt = this.lichessTools;
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
        const arr = Object.keys(this.pawnStructures).map(k => {
          return {
            key: k,
            value: this.pawnStructures[k],
            similarity: this.keySimilarity(structure, k)
          };
        });
        arr.sort((o1, o2) => o2.similarity - o1.similarity);
        return arr;
      };

      const arr = getArr(structure);
      if (arr[0].similarity == 100) return arr[0].value;
      const opp = this.getOpposingStructure(structure);
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

      if (this.options.onlyNamed) return null;
      return {
        name: structure.split(' ')[0],
        best: arrItem
      };
    };

    addStructureAnchor = (el, structureName, structure) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (!el.length) el = $(el);
      let structureElem = el.find('.lichessTools-structure');
      if (!structureName) {
        structureElem.remove();
        return;
      }

      const isLink = !!structureName.url;
      if ((isLink && structureElem.is('span')) || (!isLink && structureElem.is('a'))) {
        structureElem.remove();
        structureElem = el.find('.lichessTools-structure');
      }
      if (!structureElem.length) {
        const visibleEl = el.filter((i, e) => !!lt.inViewport(e)).eq(0);
        structureElem = $('<' + (isLink ? 'a' : 'span') + '>')
          .addClass('lichessTools-structure')
          .appendTo(visibleEl);
        if (isLink) {
          structureElem.attr('target', '_blank');
        }
      }
      let title = trans.pluralSame('structureNameTitle', structure);
      if (structureName.best) title += '\r\n' + structureName.best.value.name + ' ' + structureName.best.similarity + '%';
      structureElem
        .replaceText(structureName.name)
        .attrSafe('title', title);
      if (isLink) {
        structureElem.attrSafe('href', structureName.url);
      }
    };

    miniGameStructure = async (el) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
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
      for (const el of elems) {
        if (!lt.inViewport(el)) continue;
        fen = fen || $(el).attr('data-state') || lt.getPositionFromBoard(el, true);
        if (!fen) {
          lt.global.console.warn('Could not get fen for element', el);
          continue;
        }
        const board = lt.getBoardFromFen(fen);
        const structure = this.getStructure(board, $(el).attr('data-state')?.includes('black'));
        const structureName = await this.getStructureName(structure);
        this.addStructureAnchor(el, structureName, structure);
        fen = '';
      }
    };
    miniGameStructureDebounced = this.lichessTools.debounce(this.miniGameStructure, 500, { defer:true });

    refreshStructure = async (ply) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
      if ($.cached('body').is('.playing')) return;
      if (this.isGamesPage() || this.isBroadcastPage()) {
        return;
      }
      const trans = lt.translator;
      const metaSection = $.cached('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables', 10000);
      const fen = lichess.analysis?.node?.fen || lt.getPositionFromBoard($('main'), true);
      if (!fen) return;
      const board = lt.getBoardFromFen(fen);
      const analysisOrientation = lichess.analysis?.getOrientation();
      const isBlackOrientation = (analysisOrientation && analysisOrientation == 'black') || $('.cg-wrap').eq(0).is('.orientation-black');
      const structure = await this.getStructure(board, isBlackOrientation);
      if (!structure) {
        metaSection.find('.lichessTools-structure').remove();
        return;
      }
      const structureName = await this.getStructureName(structure);
      this.addStructureAnchor(metaSection, structureName, structure);
      if (!ply) {
        await this.miniGameStructure();
      }
    };
    refreshStructureDebounced = this.lichessTools.debounce(this.refreshStructure, 500, { defer:true });

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
      lt.pubsub.off('content-loaded', this.miniGameStructureDebounced);
      lt.global.clearInterval(this.interval);
      if (this.options.enabled) {
        lt.uiApi.socket.events.on('endData', this.refreshStructureDebounced);
        lt.uiApi.socket.events.on('fen', this.miniGameStructure);
        lt.uiApi.events.on('ply', this.refreshStructureDebounced);
        lt.pubsub.on('lichessTools.redraw', this.refreshStructureDebounced);
        lt.pubsub.on('content-loaded', this.miniGameStructureDebounced);
        lt.global.setTimeout(this.refreshStructureDebounced,1000); // this is not essential to loading
        if ($('main').is('#board-editor')) {
          this.interval = lt.global.setInterval(this.refreshStructureDebounced, 1000);
        }
      } else {
        const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables');
        metaSection.find('.lichessTools-structure').remove();
      }
      if (this.isGamesPage() || this.isBroadcastPage()) {
        $.cached('body').toggleClass('lichessTools-structureMiniGames', this.options.enabled);
      }
    }

  }
  LiChessTools.Tools.ShowPawnStructure = ShowPawnStructureTool;
})();
