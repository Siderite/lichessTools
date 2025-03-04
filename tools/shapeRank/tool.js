(() => {
  class ShapeRankTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'shapeRank',
        category: 'analysis2',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.shapeRank': 'Show the order of arrows and circles'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.shapeRank': 'Arat\u0103 ordinea s\u0103ge\u0163ilor \u015Fi cercurilor'
      }
    }


    clearRankShapes = (shapes) => {
      const lt = this.lichessTools;
      lt.arrayRemoveAll(shapes, s => s.type === 'rank');
    };

    ensureShapeRank = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      this.chessground = analysis?.chessground || $('div.cg-wrap.lichessTools-boardOverlay')[0]?.chessground;
      const drawable = this.chessground?.state.drawable;
      if (!drawable || !this.options.enabled) return;

      const descriptor = Object.getOwnPropertyDescriptor(drawable, 'shapes');
      const isProperty = descriptor?.get && descriptor?.set;
      if (!isProperty) {
        const tool = this;
        drawable._shapes = drawable.shapes;
        Object.defineProperty(drawable, 'shapes', {
          configurable: true,
          get: function () {
            if (!tool.options.enabled) return this._shapes;
            const shapes = this._shapes?.filter(s => s.type != 'rank');
            if (shapes) {
              const dict = {}
              const drawnShapes = [];
              let rank = 0;
              for (const shape of shapes) {
                if (dict[shape.orig]) continue;
                rank++;
                const rankShape = {
                  type: 'rank',
                  orig: shape.orig,
                  dest: false, // fix lichess bug where this is found as the shape to erase
                  customSvg: lt.makeSvg('<text x="10%" y="50%" font-size="200%" fill="black" stroke="' + shape.brush + '">' + rank + '</text>', this.chessground)
                };
                dict[rankShape.orig] = true;
                drawnShapes.push(rankShape);
              }
              this._shapes = drawnShapes.concat(shapes);
            }
            return this._shapes;
          },
          set: function (shapes) {
            this._shapes = shapes;
          }
        });
        this.chessground?.redrawAll();
      }
    };

    waitForChessground = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      this.chessground = analysis?.chessground || $('div.cg-wrap.lichessTools-boardOverlay')[0]?.chessground;
      if (!this.chessground) {
        lt.global.setTimeout(this.waitForChessground, 500);
        return;
      }
      const isWrapped = lt.isWrappedFunction(this.chessground.state.drawable.onChange, 'shapeRank');
      if (this.options.enabled) {
        if (!isWrapped && this.chessground.state.drawable.onChange) {
          this.chessground.state.drawable.onChange = lt.wrapFunction(this.chessground.state.drawable.onChange, {
            id: 'shapeRank',
            before: ($this, ...args) => {
              const originalFunction = this.chessground.state.drawable.onChange.__originalFunction.bind($this);
              if (args[0]?.length) {
                this.clearRankShapes(args[0]);
              }
              originalFunction(...args);
              return false;
            }
          });
        }
        lt.global.setTimeout(this.ensureShapeRank, 500); //TODO without the timeout something clears the shapes in about 250ms at first page load (probably a web socket event)
      } else {
        if (isWrapped) {
          this.chessground.state.drawable.onChange = lt.unwrapFunction(this.chessground.state.drawable.onChange, 'shapeRank');
        }
        this.clearRankShapes(this.chessground.state.drawable.shapes);
        this.chessground.redrawAll();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const value = lt.currentOptions.getValue('shapeRank');
      this.options = { enabled: value };
      this.logOption('Show the order of arrows and circles', value);
      lt.pubsub.off('lichessTools.shapeRank', this.waitForChessground);
      lt.pubsub.off('lichessTools.redraw', this.waitForChessground);
      if (this.options.enabled) {
        lt.pubsub.on('lichessTools.shapeRank', this.waitForChessground);
        lt.pubsub.on('lichessTools.redraw', this.waitForChessground);
      }
      this.waitForChessground();
    }

  }
  LiChessTools.Tools.ShapeRank = ShapeRankTool;
})();
