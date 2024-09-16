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
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      if (parent.isGamePlaying()) return;
      if (!$('.analyse__tools > .ceval').length) return;
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
      $('main.analyse div.cg-wrap').toggleClass('lichessTools-moveAssistant', isActive);
      $('div.ceval button.lichessTools-moveAssistant')
        .toggleClass('lichessTools-enabled', !!this.isEnabled)
        .toggle(!isInteractiveOrPractice);
      if (!isActive) {
        if (this._evaluating) {
          this._evaluating = false;
          this._fen = null;
          this.clearSquares();
          this._sf?.stop();
        }
        return;
      }
      if (!this._sf) {
        const sf = await parent.stockfish.load();
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
      const parent = this.lichessTools;
      const $ = parent.$;
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
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
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
        const deltaColor = parent.getGradientColor(delta, [{ q: 0, color: '#00FF00' }, { q: 100, color: '#FFFF00' }, { q: 200, color: '#FF8000' }, { q: 300, color: '#FF0000' }]);
        const percColor = parent.getGradientColor(qPerc, [{ q: 0, color: '#FF0000' }, { q: 0.5, color: '#FFFF00' }, { q: 1, color: '#00FF00' }]);
        const gradientColor = parent.getGradientColor(0.66, [{ q: 0, color: percColor }, { q: 1, color: '#20202040' }]);
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
      const parent = this.lichessTools;
      const mate = +(info.mate?.at(0));
      const cp = mate
        ? Math.sign(mate) * 10000 - mate
        : +(info.cp?.at(0));
      const uci = info.pv?.at(0);
      if (!uci || Number.isNaN(cp)) return;
      if (parent.debug) {
        const depth = +(info.depth?.at(0));
        const seldepth = +(info.seldepth?.at(0));
        if (depth == 1 && this._prevDepth > 1) this._prevDepth = null;
        if (!this._prevDepth || depth > this._prevDepth) {
          this._prevDepth = depth;
          parent.global.console.debug('Depth:', depth + '/' + seldepth);
        }
      }
      this._eval[uci] = cp;
      let wdl = info.wdl;
      if (wdl?.length == 3) {
        wdl = { w: +wdl[0], d: +wdl[1], l: +wdl[2] };
        wdl.total = wdl.w + wdl.d + wdl.l;
        this._wdl[uci] = wdl;
      }
    }

    clearSquares = () => {
      const parent = this.lichessTools;
      const $ = parent.$;
      $('main.analyse div.cg-wrap').removeClass('lichessTools-moveAssistant');
      $('square.move-dest')
        .css('background', '')
        .css('border-color', '');
      $('div.lichessTools-wdl').remove();
    };

    setControls = () => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const trans = parent.translator;
      let button = $('div.ceval button.lichessTools-moveAssistant');
      if (!this.options.enabled) {
        button.remove();
        return;
      }
      if (!button.length) {
        button = $('<button type="button" class="lichessTools-moveAssistant">')
          .attr('title', trans.noarg('assistantButtonTitle'))
          .attr('data-icon', '\uE069')
          .on('click', ev => {
            ev.preventDefault();
            this.isEnabled = !this.isEnabled;
            button.toggleClass('lichessTools-enabled', !!this.isEnabled);
          })
          .insertBefore('div.ceval button.settings-gear');
      }
    }

    get isEnabled() {
      if (this._isEnabled !== undefined) return this._isEnabled;
      const parent = this.lichessTools;
      this._isEnabled = parent.storage.get('LichessTools.moveAssistant');
      return this._isEnabled;
    }

    set isEnabled(value) {
      const parent = this.lichessTools;
      parent.storage.set('LichessTools.moveAssistant', value);
      this._isEnabled = value;
      if (!value) this._sf?.destroy();
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('moveAssistant');
      this.logOption('Move assistant', value);
      this.options = { enabled: value };
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      if (!parent.global.SharedArrayBuffer) return;
      this.clearSquares();
      parent.global.clearInterval(this.interval);
      this.setControls();
      lichess.pubsub.off('lichessTools.redraw', this.setControls);
      if (!value) return;
      this.interval = parent.global.setInterval(this.evaluate, 1000);
      lichess.pubsub.on('lichessTools.redraw', this.setControls);
    }

  }
  LiChessTools.Tools.MoveAssistant = MoveAssistantTool;
})();
