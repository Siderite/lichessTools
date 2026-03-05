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

    getStructure = (board, blackOrientation) => {
      if (!board) return null;
      const lt = this.lichessTools;
      const result = {
        pawns: {
          'w': new Array(8).fill(-1),
          'b': new Array(8).fill(-1)
        },
        led: {
          'w': new Array(8).fill(false),
          'b': new Array(8).fill(false)
        },
        islands: { w: [], b: [] },
        qSide: { 'w': 0, 'b': 0 },
        kSide: { 'w': 0, 'b': 0 }
      };
      for (let y = 0; y < 8; y++) {
        const rank = board[y];
        for (let x = 0; x < 8; x++) {
          switch (rank[x]) {
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

      const buildIslands = (color) => {
        const ps = result.pawns[color];
        const list = result.islands[color];
        let current = null;
        for (let x = 0; x < 8; x++) {
          if (ps[x] === -1) {
            current = null;
            continue;
          }
          if (current && current.end === x - 1) {
            current.end = x;
          } else {
            current = { start: x, end: x };
            list.push(current);
          }
        }
      };

      buildIslands('w');
      buildIslands('b');

      const calcSide = (color) => {
        const list = result.islands[color];
        if (list.length === 0) return;

        const first = list[0];
        if (first.start < 2) {
          result.qSide[color] = Math.min(3, first.end) - first.start + 1;
        }

        const last = list[list.length - 1];
        if (last.end > 5) {
          result.kSide[color] = last.end - Math.max(4, last.start) + 1;
        }
      };

      calcSide('w');
      calcSide('b');

      const [ me, they ] = blackOrientation ? ['b','w'] : ['w','b'];
      const toChar = (s)=>{
        if (s==' ') return s;
        if (s=='Q') {
          const mv=result.qSide[me];
          const mt=result.qSide[they];
          return mv>mt ? 'M' : mv<mt ? 'T' : 'X';
        }
        if (s=='K') {
          const mv=result.kSide[me];
          const mt=result.kSide[they];
          return mv>mt ? 'M' : mv<mt ? 'T' : 'X';
        }
        if (s.startsWith('P')) {
          const v=result.pawns[s[1]=='M'?me:they][+s[2]];
          return v<0 ? 'X' : v;
        }
        if (s.startsWith('L')) {
          const v=result.led[s[1]=='M'?me:they][+s[2]];
          return v ? 'L' : 'X';
        }
        throw new Error('Unknown primitive: '+s);
      };
      const structureText = [
        'PM3','PM4','PM2','PT3','PT4','PT2','Q','K',' ',
        'PM5','PM1','PM6','PT5','PT1','PT6',' ',
        'PM0','PM7','PT0','PT7',' ',
        'LM3','LM4','LM2','LT3','LT4','LT2',' ',
        'LM5','LM1','LM6','LT5','LT1','LT6',' ',
        'LM0','LM7','LT0','LT7',
      ].map(toChar).join('');
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
      const analysis = lt.lichess.analysis;
      if (lt.global.document.hidden) return;
      if ($.cached('body').is('.playing') || (analysis?.showFishnetAnalysis() === false && !analysis?.cevalEnabled())) return;
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
        if ($(el).closest('.now-playing').length) continue;

        fen = fen || $(el).attr('data-state') || lt.getPositionFromBoard(el, true);
        if (!fen) {
          //lt.global.console.warn('Could not get fen for element', el);
          continue;
        }
        const board = lt.getBoardFromFen(fen);
        const structure = this.getStructure(board, $(el).attr('data-state')?.includes('black'));
        const structureName = await this.getStructureName(structure);
        this.addStructureAnchor(el, structureName, structure);
        fen = '';
      }
      if (notInViewport) this.miniGameStructureDebounced();
    };
    miniGameStructureDebounced = this.lichessTools.debounce(this.miniGameStructure, 500, { defer:true });

    refreshStructure = async (ply) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const $ = lt.$;
      if (lt.global.document.hidden) return;
      if ($.cached('body').is('.playing') || (analysis?.showFishnetAnalysis() === false && !analysis?.cevalEnabled())) return;
      if (this.isGamesPage()) {
        return;
      }
      const trans = lt.translator;
      const metaSection = $.cached('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables', 10000);
      const fen = analysis?.node?.fen || lt.getPositionFromBoard($('main'), true);
      if (!fen) return;
      const board = lt.getBoardFromFen(fen);
      const analysisOrientation = analysis?.getOrientation();
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
      $('body').observer()
        .off('input[type=checkbox]',this.miniGameStructure);
      $('body').observer()
        .off('input[type=checkbox]',this.refreshStructureDebounced);
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
        $('body').observer()
          .on('input[type=checkbox]',this.miniGameStructure,{ attributes: true });
        $('body').observer()
          .on('input[type=checkbox]',this.refreshStructureDebounced,{ attributes: true });
      } else {
        const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members, div.analyse__underboard .copyables, main#board-editor .copyables');
        metaSection.find('.lichessTools-structure').remove();
      }
      if (this.isGamesPage()) {
        $.cached('body').toggleClass('lichessTools-structureMiniGames', this.options.enabled);
      }
    }

  }
  LiChessTools.Tools.ShowPawnStructure = ShowPawnStructureTool;
})();
