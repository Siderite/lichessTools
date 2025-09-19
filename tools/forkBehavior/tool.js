(() => {
  class ForkBehaviorTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['RandomVariation', 'EmitRedraw', 'EmitChapterChange', 'TranspositionBehavior', 'InterceptEventHandlers', 'Dialog'];

    preferences = [
      {
        name: 'forkBehavior',
        category: 'analysis',
        type: 'single',
        possibleValues: ['hidden', 'normal', 'hybrid', 'chessbase'],
        defaultValue: 'normal',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.forkBehavior': 'Next move behavior for variations',
        'forkBehavior.hidden': 'Hidden',
        'forkBehavior.normal': 'Normal',
        'forkBehavior.hybrid': 'Hybrid',
        'forkBehavior.chessbase': 'Force choice',
        'movesGroupLabel': 'Moves',
        'transposGroupLabel': 'Transpositions'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.forkBehavior': 'Comportament la mutare urm\u0103toare pentru varia\u0163ii',
        'forkBehavior.hidden': 'Ascunse',
        'forkBehavior.normal': 'Normal',
        'forkBehavior.hybrid': 'Hibrid',
        'forkBehavior.chessbase': 'For\u0163eaz\u0103 alegerea',
        'movesGroupLabel': 'Mut\u0103ri',
        'transposGroupLabel': 'Transpozi\u0163ii'
      }
    }

    getMoveText = (move, isTranspo, length) => {
      const lt = this.lichessTools;
      length = length || 0;
      let result = '';
      if (!length || move.ply % 2 == 1) {
        const moveNumber = Math.floor((move.ply + 1) / 2);
        result += moveNumber + (move.ply % 2 == 1 ? '.' : '...');
      }
      result += move.san;
      if (move.glyphs?.length) {
        result+=move.glyphs.map(g=>g.symbol).join('');
      }
      if (length < 5 && move.children.length == 1) {
        result += ' ' + this.getMoveText(move.children[0], false, length + 1);
      } else if (move.children.length) {
        result += ' '+lt.icon.Ellipsis;
      }
      return result;
    };

    showPopupDirect = async (nextMoves, nextTranspos) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const $ = lt.$;
      const hasTranspos = !!nextTranspos.length;
      const size = nextMoves.length + nextTranspos.length + (hasTranspos ? 2 : 0);
      let dlg = null;
      let selectElem = null;
      const selectedIndex = lichess.analysis?.fork?.selectedIndex || 0;
      if ($('body').is('.mobile')) {
        selectElem = $('<ul>');
        let container = hasTranspos && nextMoves.length
          ? $('<ul>').text(trans.noarg('movesGroupLabel')).appendTo(selectElem)
          : selectElem;
        let index = 0;
        for (const move of nextMoves) {
          $('<li>')
            .attr('value', move.uci)
            .attr('fen', move.fen)
            .toggleClass('selected',selectedIndex == index)
            .text(this.getMoveText(move, false))
            .appendTo(container);
          index++;
        }
        if (hasTranspos) {
          container = $('<ul>').text(trans.noarg('transposGroupLabel')).appendTo(selectElem);
          for (const move of nextTranspos) {
            $('<li>')
              .attr('value', move.uci + ' ' + move.path)
              .attr('fen', move.fen)
              .text(this.getMoveText(move, true))
              .appendTo(container);
          }
        }
        dlg = await lt.dialog({
          htmlText: selectElem[0].outerHTML
        });
      } else {
        selectElem = $('<select>')
          .attr('size', size);
        let container = hasTranspos && nextMoves.length
          ? $('<optgroup>').attr('label', trans.noarg('movesGroupLabel')).appendTo(selectElem)
          : selectElem;
        let index = 0;
        for (const move of nextMoves) {
          $('<option>')
            .attr('value', move.uci)
            .attr('fen', move.fen)
            .text(this.getMoveText(move, false))
            .appendTo(container);
          index++;
        }
        if (hasTranspos) {
          container = $('<optgroup>').attr('label', trans.noarg('transposGroupLabel')).appendTo(selectElem);
          for (const move of nextTranspos) {
            $('<option>')
              .attr('value', move.uci + ' ' + move.path)
              .attr('fen', move.fen)
              .text(this.getMoveText(move, true))
              .appendTo(container);
          }
        }
        dlg = await lt.dialog({
          htmlText: selectElem[0].outerHTML + '<span class="dialog-actions"><button class="button submit">' + trans.noarg('OK') + '</button></span>'
        });
      }
      $('dialog.lichessTools-forkBehavior-chessbase').remove();
      dlg.showModal();
      let f;
      f=()=>{
        dlg.remove();
        lt.uiApi.events.off('ply',f);
      };
      lt.uiApi.events.on('ply',f);
      $('<a class="lichessTools-infoIcon">')
        .attr('href', '/account/preferences/display#lichessTools/forkBehavior')
        .attr('target', '_blank')
        .attr('title', trans.noarg('options.forkBehavior'))
        .attr('data-icon', lt.icon.InfoCircle)
        .appendTo(dlg);
      $(dlg)
        .on('close', () => lichess.analysis.explorer.setHovering(lichess.analysis.node.fen, null))
        .addClass('lichessTools-forkBehavior-chessbase');
      selectElem = $('select,ul', dlg).eq(0);
      const makeMove = (ev) => {
        ev?.preventDefault();
        const val = selectElem.val() || $(ev?.target).attr('value');
        if (!val) {
          return;
        }
        dlg.close();
        const [uci, path] = val.split(' ');
        if (path) {
          lichess.analysis.userJumpIfCan(path);
        } else {
          lichess.analysis.playUci(uci);
        }
        lichess.analysis.redraw();
      }

      const highlight = (ev) => {
        const val = selectElem.val() || $(ev?.target).attr('value');
        if (!val) return;
        const [uci, path] = val.split(' ');
        lichess.analysis.explorer.setHovering(lichess.analysis.node.fen, uci);
        const fork = lichess.analysis.fork;
        if (!fork?.forks?.length) return;
        const index = fork.forks.findIndex(c => c.uci == uci);
        if (index < 0 || fork.selectedIndex == index) return;
        fork.selectedIndex = index;
        lichess.analysis.setAutoShapes();
        lichess.analysis.redraw();
      };

      const mobileMakeMove = (ev) => {
        ev?.preventDefault();
        const elem = $(ev?.target);
        if (!elem.length) return;
        if (!elem.is('.selected')) {
          $('li', selectElem).removeClass('selected');
          elem.addClass('selected');
          highlight(ev);
          return;
        }
        makeMove(ev);
      };

      $('button.submit', dlg).on('click', (ev) => {
        ev.preventDefault();
        makeMove();
      });
      selectElem.on('change', highlight);
      selectElem.find('option')
        .on('mousedown', (ev) => { if (ev.button == 0 && ev.target?.selected) makeMove(); })
        .on('dblclick', makeMove)
        .on('contextmenu', makeMove);
      selectElem.find('li')
        .on('click', mobileMakeMove);

      const keyHandler = (ev) => {
        if (ev.altKey || ev.ctrlKey) return;
        if (ev.shiftKey) {
          const dir = ev.code == 'ShiftLeft' ? -1 : 1;
          const e = ev.currentTarget;
          e.selectedIndex = (e.selectedIndex + e.options.length + dir) % e.options.length;
          highlight();
          e.focus();
          return;
        }
        switch (ev.key) {
          case 'ArrowRight':
          case 'Enter':
            ev.preventDefault();
            ev.stopPropagation();
            makeMove();
            break;
          case 'ArrowLeft':
            ev.preventDefault();
            ev.stopPropagation();
            dlg.close();
            break;
        };
      };

      selectElem.each((i, e) => {
        if (e.selectedIndex != selectedIndex) {
          e.selectedIndex = selectedIndex;
        }
        if (lt.global.document.activeElement != e) {
          lt.global.requestAnimationFrame(()=>e.focus());
        }
        e.addEventListener('keydown', keyHandler, { capture: true });
      });
      highlight();
    };

    showPopup = async (nextMoves, nextTranspos) => {
      try {
        if (this.inShowPopup) return;
        this.inShowPopup = true;
        return await this.showPopupDirect(nextMoves, nextTranspos);
      } finally {
        this.inShowPopup = false;
      }
    };

    mousewheelHandler = (ev) => {
      this.mousewheelOn = true;
      this.oldWheelHandler(ev);
      this.mousewheelOn = false;
    };

    nextResult = false;
    bindFork = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      if (analysis.gamebookPlay() || lt.isGamePlaying()) return;
      if (['hybrid', 'chessbase'].includes(this.options.value)) {
        const board = $('div.main-board');
        if (!board.prop('forkBehavior_init')) {
          this.oldWheelHandler = lt.getEventHandlers($('.main-board')[0], 'wheel')[0];
          if (this.oldWheelHandler) {
            lt.removeEventHandlers($('.main-board')[0], 'wheel');
            board
              .on('wheel', this.mousewheelHandler)
              .prop('forkBehavior_init', true);
          }
        }

        $('div.analyse__fork').each((i, e) => {
          if (e.lichessTools_forkBehavior_init) return;
          e.lichessTools_forkBehavior_init = true;
          e.addEventListener('click', () => this.inForkClick = true, { capture: true });
          e.addEventListener('click', () => this.inForkClick = false, { capture: false });
        });
        if (!lt.isWrappedFunction(analysis.fork.proceed, 'forkBehavior')) {
          analysis.fork.proceed = lt.wrapFunction(analysis.fork.proceed, {
            id: 'forkBehavior',
            before: ($this, ...args) => {
              if (this.mousewheelOn || analysis.gamebookPlay()) {
                this.nextResult = undefined;
                return;
              }
              const nextMoves = lt.getNextMoves(analysis.node, true, false);
              const nextTranspos = lt.getNextMoves(analysis.node, false, true);
              const nextSans = nextMoves.concat(nextTranspos).map(m => m.san);
              const noDuplicates = lt.transpositionBehavior?.groupSameMove;
              const nextSansCount = noDuplicates
                ? new Set(nextSans).size
                : nextSans.length;
              if (!this.inForkClick && (nextSansCount > 1 || nextTranspos.length)) {
                switch (this.options.value) {
                  case 'hybrid':
                    if (analysis.disclosureMode && analysis.disclosureMode()) break;
                    if (this.variationSelect != analysis.path) {
                      this.variationSelect = analysis.path;
                      $('.analyse__tools').addClass('lichessTools-forkBehavior-hybrid');
                      this.nextResult = true;
                      return false;
                    }
                    break;
                  case 'chessbase':
                    this.showPopup(nextMoves, nextTranspos);
                    this.nextResult = true;
                    return false;
                }
              }
              this.nextResult = undefined;
            },
            after: ($this, result, ...args) => {
              return this.nextResult || result;
            }
          });
        }
        if (!lt.isWrappedFunction(analysis.jump, 'forkBehavior')) {
          analysis.jump = lt.wrapFunction(analysis.jump, {
            id: 'forkBehavior',
            after: ($this, result, ...args) => {
              this.clearVariationSelect();
            }
          });
        }
      }
    };

    clearVariationSelect = () => {
      this.variationSelect = 'unset';
      $('.analyse__tools')
        .removeClass('lichessTools-forkBehavior-hidden')
        .removeClass('lichessTools-forkBehavior-hybrid');
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('forkBehavior');
      this.logOption('Fork behavior', value);
      this.options = {
        value: value
      };
      const analysis = lichess?.analysis;
      if (!analysis) return;
      analysis.fork.proceed = lt.unwrapFunction(analysis.fork.proceed, 'forkBehavior');
      lt.pubsub.off('lichessTools.redraw', this.bindFork);
      lt.pubsub.off('lichessTools.chapterChange', this.clearVariationSelect);
      if (this.oldWheelHandler) {
        $('div.main-board')
          .off('wheel', this.mousewheelHandler)
          .on('wheel', this.oldWheelHandler);
        this.oldWheelHandler = null;
      }
      this.clearVariationSelect();
      if (['hybrid', 'chessbase'].includes(value)) {
        lt.pubsub.on('lichessTools.redraw', this.bindFork);
        this.bindFork();
        lt.pubsub.on('lichessTools.chapterChange', this.clearVariationSelect);
      }
      $('.analyse__tools')
        .toggleClassSafe('lichessTools-forkBehavior-hidden',value == 'hidden');
    }

  }
  LiChessTools.Tools.ForkBehavior = ForkBehaviorTool;
})();
