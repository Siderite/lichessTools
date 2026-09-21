(() => {
  class ShapeRankTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'MobileExperience'];

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


    shouldNotBeRanked = (shape)=>{
      const circles = shape.customSvg?.html?.matchAll(/circle/g);
      const isGooglyHorsey = circles && [...circles].length==6;
      return !isGooglyHorsey;
    };

    ensureShapeRank = () => {
      const lt = this.lichessTools;
      const analysis = lt.lichess.analysis;
      this.chessground = lt.getChessground() || $('div.cg-wrap.lichessTools-boardOverlay')[0]?.chessground;
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
            let label=1;
            for (const shape of this._shapes.filter(tool.shouldNotBeRanked)) {
              if (tool.options.enabled) {
                shape.label={ text: String(label) };
                label++;
              } else {
                shape.label=undefined;
              }
            }
            return this._shapes;
          },
          set: function (shapes) {
            this._shapes = shapes;
          }
        });
        if (drawable.shapes?.length) {
          this.chessground?.redrawAll();
        }
      }
    };

    waitForChessground = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      this.chessground = lt.getChessground() || $('div.cg-wrap.lichessTools-boardOverlay')[0]?.chessground;
      if (!this.chessground) {
        lt.global.setTimeout(this.waitForChessground, 500);
        return;
      }
      if (this.options.enabled) {
        this.ensureShapeRank();
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
