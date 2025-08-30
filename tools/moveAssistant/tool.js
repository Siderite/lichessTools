(() => {
  class MoveAssistantTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'Stockfish'];

    preferences = [
      {
        name: 'moveAssistant',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.moveAssistant': 'Move assistant',
        'assistantButtonTitle': 'LiChess Tools - selected piece move evaluation'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.moveAssistant': 'Asistent mut\u0103ri',
        'assistantButtonTitle': 'LiChess Tools - evaluarea mut\u0103rilor piesei selectate'
      }
    }

    evaluate = async () => {
      if (this.inEvaluate) return;
      try {
        this.inEvaluate=true;
        await this.evaluateDirect();
      } finally {
        this.inEvaluate=false;
      };
    }

    evaluateDirect = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis.isCevalAllowed()) return;
      if (lt.isGamePlaying()) return;
      const selected = analysis.chessground?.state?.selected;
      const dests = selected
        ? analysis.chessground?.state?.movable?.dests?.get(selected)
        : null;
      const isInteractiveOrPractice = !!(analysis.study?.gamebookPlay || analysis.practice?.running() || analysis.study?.practice);
      const isActive = !!(this.options.enabled
        && this.isEnabled
        && selected
        && dests?.length
        && !isInteractiveOrPractice
      );
      $('main.analyse div.cg-wrap').toggleClassSafe('lichessTools-moveAssistant', isActive);
      $('div.ceval button.lichessTools-moveAssistant')
        .toggleClassSafe('lichessTools-enabled', !!this.isEnabled)
        .toggleClassSafe('lichessTools-hideMoveAssistant',!!isInteractiveOrPractice);
      if (!isActive) {
        if (this._evaluating) {
          this._evaluating = false;
          this._fen = null;
          this.clearSquares();
          await this._sf?.stop();
        }
        return;
      }
      if (!this._sf) {
        const sf = await lt.stockfish.load();
        if (!sf) return;
        sf.setMultiPv(256);
        sf.setTime(90000);
        sf.on('info', this.getInfo);
        this._sf = sf;
      }
      if (!this._evaluating) {
        this._eval = {};
        this._wdl = {};
        this._evaluating = true;
        this._fen = analysis.node.fen;
        this._sf.setPosition(this._fen);
        this._sf.start();
      }
      if (this._fen != analysis.node.fen) {
        this._eval = {};
        this._wdl = {};
        this._fen = analysis.node.fen;
        this._sf.setPosition(this._fen);
      }
      this.refreshSquares();
    };

    _squares = {};
    getSquare = (e, side, isBlack) => {
      if (e.cgKey) return e.cgKey;
      const lt = this.lichessTools;
      const $ = lt.$;
      const matrix = $(e).css('transform');
      if (!matrix) return;
      const key = (isBlack ? 'b' : 'w') + side + matrix;
      let dest = this._squares[key];
      if (dest) return dest;
      const m = /(?<x>\d+(\.\d+)?), (?<y>\d+(\.\d+)?)\)/.exec(matrix);
      if (!m) return;
      const x = Math.floor(+(m.groups.x) * 8 / side);
      const y = Math.floor(+(m.groups.y) * 8 / side);
      const rank = isBlack ? y : 7 - y;
      const file = isBlack ? 7 - x : x;
      dest = String.fromCharCode('a'.charCodeAt(0) + file) + (rank + 1);
      this._squares[key] = dest;
      return dest;
    }

    refreshSquares = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const selected = analysis.chessground?.state?.selected;

      let minCp = 100000;
      let maxCp = -100000;
      Object.keys(this._eval).forEach(k => {
        const cp = this._eval[k];
        if (cp > maxCp) maxCp = cp;
        if (cp < minCp) minCp = cp;
      });

      const side = $('main.analyse div.main-board cg-board').width();
      const isBlack = lichess.analysis.getOrientation() == 'black';
      $('square.move-dest').each((i, e) => {
        const dest = this.getSquare(e, side, isBlack);
        const uci = selected + dest;
        const cp = this._eval[uci];
        if (cp === undefined) {
          return;
        }
        const qPerc = minCp == maxCp ? 1 : (cp - minCp) / (maxCp - minCp);
        const delta = maxCp - cp;
        const deltaColor = lt.getGradientColor(delta, [{ q: 0, color: '#00FF00' }, { q: 100, color: '#FFFF00' }, { q: 200, color: '#FF8000' }, { q: 300, color: '#FF0000' }]);
        const percColor = lt.getGradientColor(qPerc, [{ q: 0, color: '#FF0000' }, { q: 0.5, color: '#FFFF00' }, { q: 1, color: '#00FF00' }]);
        const gradientColor = lt.getGradientColor(0.66, [{ q: 0, color: percColor }, { q: 1, color: '#20202040' }]);
        $(e)
          .css('background', 'radial-gradient(' + gradientColor + ' 19%, rgba(0, 0, 0, 0) 20%)')
          .css('border-color', deltaColor);
        const wdl = this._wdl[uci];
        if (wdl) {
          let bar = $(e).find('div.lichessTools-wdl');
          if (!bar.length) {
            bar = $('<div class="lichessTools-wdl">')
              .appendTo(e);
          }
          bar
            .css('--deg', analysis.turnColor() == analysis.getOrientation() ? '0deg' : '180deg')
            .css('--w', Math.round(100 * wdl.w / wdl.total) + '%')
            .css('--d', Math.round(100 * wdl.d / wdl.total) + '%')
            .css('--l', Math.round(100 * wdl.l / wdl.total) + '%');
        }
      });
    }

    _eval = {};
    _wdl = {};
    getInfo = (info) => {
      const lt = this.lichessTools;
      const uci = info.pv?.at(0);
      if (!uci || (info.cp===undefined && info.mate===undefined)) return;
      if (lt.debug) {
        const depth = +(info.depth?.at(0));
        const seldepth = +(info.seldepth?.at(0));
        if (depth == 1 && this._prevDepth > 1) this._prevDepth = null;
        if (!this._prevDepth || depth > this._prevDepth) {
          this._prevDepth = depth;
          lt.global.console.debug('Depth:', depth + '/' + seldepth);
        }
      }
      const cp = lt.getCentipawns(info);
      this._eval[uci] = cp;
      let wdl = info.wdl;
      if (wdl?.length == 3) {
        wdl = { w: +wdl[0], d: +wdl[1], l: +wdl[2] };
        wdl.total = wdl.w + wdl.d + wdl.l;
        this._wdl[uci] = wdl;
      }
    }

    clearSquares = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('main.analyse div.cg-wrap').removeClass('lichessTools-moveAssistant');
      $('square.move-dest')
        .css('background', '')
        .css('border-color', '');
      $('div.lichessTools-wdl').remove();
    };

    setControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      let container = $('div.analyse__tools div.ceval');
      if (container.length || $('.action-menu').length) {
        $('div.lichessTools-moveListOptions-header').remove();
      } else {
        container = $('div.lichessTools-moveListOptions-header');
        if (!container.length) {
          container = $('<div class="lichessTools-moveListOptions-header">')
            .prependTo('div.analyse__tools');
        }
      }
      let button = $('button.lichessTools-moveAssistant');
      if (!this.options.enabled) {
        button.remove();
        return;
      }
      if (!button.length) {
        button = $('<button type="button" class="lichessTools-moveAssistant">')
          .attr('title', trans.noarg('assistantButtonTitle'))
          .attr('data-icon', lt.icon.Eye)
          .on('click', ev => {
            ev.preventDefault();
            this.isEnabled = !this.isEnabled;
            button.toggleClass('lichessTools-enabled', !!this.isEnabled);
          });
        const anchor = $('div.ceval button.settings-gear')[0];
        if (anchor) {
          button.insertBefore(anchor);
        } else {
          container.prepend(button);
        }
      }
    }

    get isEnabled() {
      if (this._isEnabled !== undefined) return this._isEnabled;
      const lt = this.lichessTools;
      this._isEnabled = lt.storage.get('LichessTools.moveAssistant');
      return this._isEnabled;
    }

    set isEnabled(value) {
      const lt = this.lichessTools;
      lt.storage.set('LichessTools.moveAssistant', value);
      this._isEnabled = value;
      if (!value) this._sf?.destroy();
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('moveAssistant');
      this.logOption('Move assistant', value);
      this.options = { enabled: value };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      if (!lt.global.SharedArrayBuffer) return;
      this.clearSquares();
      lt.global.clearInterval(this.interval);
      this.setControls();
      lt.pubsub.off('lichessTools.redraw', this.setControls);
      if (!value) return;
      this.interval = lt.global.setInterval(this.evaluate, 1000);
      lt.pubsub.on('lichessTools.redraw', this.setControls);
    }

  }
  LiChessTools.Tools.MoveAssistant = MoveAssistantTool;
})();
