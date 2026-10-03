(() => {
  class KeyboardHelpTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['KeyShortcuts','AdditionalGlyphs','ExplorerPractice','SearchMovesCommand'];

    preferences = [
      {
        name: 'keyboardHelp',
        category: 'general',
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
        'options.general': 'General',
        'options.keyboardHelp': 'LiChess Tools section in keyboard help',
        'lichessTools': 'LiChess Tools',
        'nextBlunder': 'Next blunder (all lines)',
        'nextMistake': 'Next mistake (all lines)',
        'nextInaccuracy': 'Next inaccuracy (all lines)',
        'nextGood': 'Next good/brilliant/interesting',
        'nextOpponentBlunder': 'Next opponent blunder',
        'nextOpponentMistake': 'Next opponent mistake',
        'nextOpponentInaccuracy': 'Next opponent inaccuracy',
        'nextOpponentGood': 'Next opponent good/brilliant/interesting',
        'nextSlow': 'Next slow move',
        'nextOpponentSlow': 'Next opponent slow move',
        'variationLine': 'N-th variation',
        'cevalLine': 'N-th computer evaluation line',
        'explorerLine': 'N-th Explorer line',
        'randomMove': 'Random variation move',
        'previousPosition': 'Back to previous position',
        'bestCevalLine': 'Best computer line',
        'explorerPractice': 'Explorer practice',
        'explorerPracticeHideMoves': 'Toggle Explorer move list',
        'seeLichessTools': 'see LiChess Tools section below',
        'freezeBoard': 'Freeze board',
        'randomChapter': 'Random study chapter',
        'jumpToCurrent': 'Jump to current position',
        'obsIntegration': 'Toggle OBS integration for this broadcast',
        'toggleSiteHeader': 'Toggle site header (works everywhere)',
        'switchExplorerTabs': 'Explorer cycle Lichess/Masters',
        'copyFenToClipboard': 'Copy FEN to clipboard',
        'searchMoves': 'Search in move list',
        'deeperPlus': 'Analyse deeper',
        'keyRequestComputerAnalysis': 'Request computer analysis, Learn from your mistakes',
        'then': 'then',
        'goToPlayedMoveText': 'Return to last played move'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.keyboardHelp': 'Sec\u0163iune LiChess Tools \u00een dialogul ajutor pentru taste',
        'lichessTools': 'LiChess Tools',
        'nextBlunder': 'Urm\u0103toarea gaf\u0103 (toate liniile)',
        'nextMistake': 'Urm\u0103toarea gre\u015Feal\u0103 (toate liniile)',
        'nextInaccuracy': 'Urm\u0103toarea inexactitate (toate liniile)',
        'nextGood': 'Urm\u0103toarea bun\u0103/briliant\u0103/interesant\u0103',
        'nextOpponentBlunder': 'Urm\u0103toarea gaf\u0103 a adversarului',
        'nextOpponentMistake': 'Urm\u0103toarea gre\u015Feal\u0103 a adversarului',
        'nextOpponentInaccuracy': 'Urm\u0103toarea inexactitate a adversarului',
        'nextOpponentGood': 'Urm\u0103toarea bun\u0103/briliant\u0103/interesant\u0103 a adversarului',
        'nextSlow': 'Urm\u0103toarea mi\u015fcare lent\u0103',
        'nextOpponentSlow': 'Urm\u0103toarea mi\u015fcare lent\u0103 a adversarului',
        'variationLine': 'A N-a varia\u0163ie',
        'cevalLine': 'A N-a mutare din evaluarea calculatorului',
        'explorerLine': 'A N-a mutare din Explorator',
        'randomMove': 'Mut\u0103 o varia\u0163ie la \u00eent\u00E2mplare',
        'previousPosition': '\u00CEnapoi la pozi\u0163ia precedent\u0103',
        'bestCevalLine': 'Cea mai bun\u0103 mutare din evaluarea calculatorului',
        'explorerPractice': 'Practic\u0103 contra mut\u0103ri din Explorator',
        'explorerPracticeHideMoves': 'Comut\u0103 lista mut\u0103rilor din Explorator',
        'seeLichessTools': 'vezi sec\u0163iunea LiChess Tools de mai jos',
        'freezeBoard': '\u00CEnghea\u0163\u0103 tabla',
        'randomChapter': 'Capitol de studiu aleatoriu',
        'jumpToCurrent': 'Sari la pozi\u0163ia curent\u0103',
        'obsIntegration': 'Comut\u0103 integrarea OBS pentru acest broadcast',
        'toggleSiteHeader': 'Ascunde header-ul paginii',
        'switchExplorerTabs': 'Cicleaz\u0103 Lichess/Masters \u00een Explorator',
        'copyFenToClipboard': 'Copiaz\u0103 FEN \u00een clipboard',
        'searchMoves': 'Caut\u0103 \u00een lista de mut\u0103ri',
        'deeperPlus': 'Analiz\u0103 mai ad\u00e2nc\u0103',
        'keyRequestComputerAnalysis': 'Solicit\u0103 analiza calculatorului, \u00CEnva\u0163\u0103 din gre\u015felile tale',
        'then': 'pe urm\u0103',
        'goToPlayedMoveText': 'Revino la ultima mutare jucat\u0103'
      }
    }

    arrToId = (arr)=>{
      const bytes = new TextEncoder().encode(arr.join('-'));
      const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
      return "id" + hex;
    }

    isBindingDisabled = (keys)=>{
      const lt = this.lichessTools;
      const keyOverrides = lt.storage.get('LiChessTools.keyOverrides')||{};
      const id = this.arrToId(keys);
      return !!keyOverrides[id];
    };

    alterLichessKeys = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const trans = lt.translator;
      const table = $('.dialog-content.help > table tbody');
      if (!table.length) return;
      $('.dialog-content.help .lichessTools-disabled').removeClass('lichessTools-disabled');
      const $title = $('tr.lichessTools-title', table);
      const $kbds = $('td.keys kbd', table).filter((_, el) => {
        return $(el).closest('tr')[0].compareDocumentPosition($title[0]) & Node.DOCUMENT_POSITION_FOLLOWING;
      });
      if (lt.currentOptions.getValue('keyShortcuts')) {
        $kbds
          .filter((i, e) => {
            const text = $(e).text();
            return ['b', 'm', 'i'].includes(text) && (!lt.isBindingDisabled?.([text]) && (text!='m' || !analysis?.keyboardMove));
          })
          .parent()
          .filter((i, e) => $('kbd', e).length == 1)
          .closest('tr')
          .addClass('lichessTools-disabled')
          .attr('title', trans.noarg('seeLichessTools'));
      }
      if (lt.currentOptions.getValue('spaceDisabled') && !lt.isBindingDisabled?.(['ctrl','space'])) {
        $kbds
          .filter((i, e) => $(e).text() == 'space')
          .parent()
          .filter((i, e) => $('kbd', e).length == 1)
          .closest('tr')
          .addClass('lichessTools-disabled')
          .attr('title', trans.noarg('seeLichessTools'));
      }
      if (lt.currentOptions.getValue('explorerPractice') && analysis?.explorer?.enabled()
          && !lt.isBindingDisabled?.(['h']) && lt.tools.ExplorerPracticeTool.isRunning) {
        $kbds
          .filter((i, e) => $(e).text() == 'h')
          .parent()
          .filter((i, e) => $('kbd', e).length == 1)
          .closest('tr')
          .addClass('lichessTools-disabled')
           .attr('title', trans.noarg('seeLichessTools'));
      }
    };

    processHelp = async () => {
      const lt = this.lichessTools;
      await lt.timeout(500);
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const study = analysis?.study;
      const trans = lt.translator;
      const $ = lt.$;
      const table = $('.dialog-content.help > table tbody:has(kbd)');
      if (!table.length) return;
      if (table[0].hasLichessTools) return;
      table[0].hasLichessTools = true;

      const title = (text, className) => {
        const row = $('<tr><th colspan="2"><p></p></th></tr>')
          .addClass(className)
          .appendTo(table);
        $('p', row).text(trans.noarg(text));
      };
      const keyOverrides = lt.storage.get('LiChessTools.keyOverrides')||{};
      const row = (keys, text) => {
        const row = $('<tr><td class="keys"></td><td class="desc"></td></tr>').appendTo(table);
        const tdKeys = $('td.keys', row);
        const id = this.arrToId(keys);
        const checked = !keyOverrides[id];
        $.createToggle('toggle_'+id,'')
          .addClass('lichessTools-toggle')
          .on('change',(ev)=>{
            keyOverrides[id]=!$('[type="checkbox"]',ev.currentTarget).is(':checked');
            lt.storage.set('LiChessTools.keyOverrides',keyOverrides);
            lt.tools.KeyShortcutsTool?.bindKeys();
            lt.tools.CtrlSpaceForBestComputerMoveTool?.bindKeys();
            lt.tools.CtrlArrowsRandomVariationTool?.bindKeys();
            lt.tools.CustomEngineLevelTool?.bindKeys();
            lt.tools.ExplorerPracticeTool?.bindKeys();
            this.alterLichessKeys();
          })
          .appendTo(tdKeys)
          .find('[type="checkbox"]')
            .prop('checked',checked);
        for (const key of keys) {
          if (key.startsWith('!')) {
            tdKeys.append($('<then>').text(trans.noarg(key.substr(1))));
          } else {
            tdKeys.append($('<kbd>').html(key));
          }
        }
        $('td.desc', row).text(trans.noarg(text));
      };

      title('lichessTools', 'lichessTools-title');
      if (analysis) {
        if (lt.currentOptions.getValue('keyShortcuts')) {
          row(['shift','b'], 'boardEditor');
          row(['b'], 'nextBlunder');
          if (!analysis?.retro && !analysis?.keyboardMove) {
            row(['m'], 'nextMistake');
          }
          row(['i'], 'nextInaccuracy');
          row(['g'], 'nextGood');
          row(['alt', 'b'], 'nextOpponentBlunder');
          row(['alt', 'm'], 'nextOpponentMistake');
          row(['alt', 'i'], 'nextOpponentInaccuracy');
          row(['alt', 'g'], 'nextOpponentGood');

          const isCorrespondence = analysis?.data?.game?.speed == 'correspondence';
          if (lt.tools.AdditionalGlyphsTool?.options?.slow && !$('span.lichessTools-obsSetup').length && analysis.data?.game?.moveCentis && !isCorrespondence) {
            row(['o'], 'nextSlow');
            row(['alt', 'o'], 'nextOpponentSlow');
          }

          row(['.', '!then', '1-9'], 'variationLine');
          row(['ctrl', '.', '!then', '1-9'], 'cevalLine');
          row(['shift', '.', '!then', '1-9'], 'explorerLine');
          row(['`', '!then', 'f'], 'freezeBoard');
          if ($('.analyse__underboard__panels .computer-analysis button, .analyse__round-training .advice-summary a.button').length) {
            row(['r'], 'keyRequestComputerAnalysis');
          }
          if (lt.currentOptions.getValue('chapterNavigation') && $('div.lichessTools-chapterControls button[data-act="random"]').length) {
            row(['`', '!then', 'r'], 'randomChapter');
          }
          if (analysis?.ongoing) {
            row(['backspace'], 'jumpToCurrent');
          }
          if (analysis?.explorer?.enabled()) {
            row(['shift', 't'], 'switchExplorerTabs');
          }
        }
        if (lt.currentOptions.getValue('ctrlArrows')) {
          row(['ctrl', '&rarr;'], 'randomMove');
          row(['ctrl', '&larr;'], 'previousPosition');
        }
        if (lt.currentOptions.getValue('spaceDisabled')) {
          row(['ctrl', 'space'], 'bestCevalLine');
        }
        if (lt.currentOptions.getValue('explorerPractice') && analysis?.explorer?.enabled()) {
          row(['shift', 'l'], 'explorerPractice');
        }
        if (lt.currentOptions.getValue('obsIntegration') && $('span.lichessTools-obsSetup').length) {
          row(['o'], 'obsIntegration');
        }
        const customEngineOptions = lt.currentOptions.getValue('customEngineOptions');
        if (analysis?.cevalEnabled() && lt.isOptionSet(customEngineOptions,'plus')) {
          row(['plus'], 'deeperPlus');
        }
        if (analysis?.ongoing) {
          if (!lt.isBindingDisabled?.(['backspace']))
          row(['backspace'], 'goToPlayedMoveText');
        }
        if (lt.currentOptions.getValue('explorerPractice') && analysis?.explorer?.enabled() 
            && lt.tools.ExplorerPracticeTool.isRunning) {
            row(['h'], 'explorerPracticeHideMoves');
        }

        this.alterLichessKeys();
      }
      
      if (lt.currentOptions.getValue('keyShortcuts')) {
        row(['`', '!then', 'h'], 'toggleSiteHeader');
        const shortcutsTool = lt.tools.KeyShortcutsTool;
        if (shortcutsTool?.canCopy()) {
          row(['ctrl', 'c'], 'copyFenToClipboard');
        }
      }
      const searchTool = lt.tools.SearchMovesCommandTool;
      if (searchTool?.canSearch()) {
        row(['ctrl', 'f'], 'searchMoves');
      }
    };

    async init() {
      const lt = this.lichessTools;
      lt.isBindingDisabled = this.isBindingDisabled;
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('keyboardHelp');
      this.logOption('Keyboard help', value);
      lt.uiApi.events.off('analysis.closeAll', this.processHelp);
      $('body').observer()
        .off('.snab-modal-mask',this.processHelp);
      if (!value) return;
      lt.uiApi.events.on('analysis.closeAll', this.processHelp);
      $('body').observer()
        .on('.snab-modal-mask',this.processHelp);
    }

  }
  LiChessTools.Tools.KeyboardHelp = KeyboardHelpTool;
})();
