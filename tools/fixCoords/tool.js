(() => {
  class FixCoordsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixCoords',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['fix', 'larger', 'square'],
        defaultValue: 'fix',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.fixCoords': 'Fix board coordinate position',
        'fixCoords.fix': 'Fix outside coordinates',
        'fixCoords.larger': 'Larger coordinate font',
        'fixCoords.square': 'On each square'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.fixCoords': 'Repar\u0103 pozi\u0163ia coordonatelor tablei',
        'fixCoords.fix': 'Repar\u0103 coordonatele \u00een exterior',
        'fixCoords.larger': 'Font mai mare pentru coordonate',
        'fixCoords.square': 'Pe fiecare p\u0103trat'
      }
    }

    squareCoords = () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      let container = $('div.main-board > div.cg-wrap > cg-container');
      if (!container.length) return;
      if (container.children('coords.lichessTools-fixCoords').length) return;
      if (!container.children('coords').length) return;
      const coords = $('<coords class="lichessTools-fixCoords">')
        .appendTo(container);
      for (let rank = 1; rank <= 8; rank++) {
        for (let file = 1; file <= 8; file++) {
          $('<coord>')
            .text(String.fromCharCode(96 + file) + String.fromCharCode(48 + rank))
            .css('--rank', rank)
            .css('--file', file)
            .appendTo(coords);
        }
      }
    };

    async start() {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const value = parent.currentOptions.getValue('fixCoords');
      this.logOption('Fix coordinates', value);
      this.options = {
        fix: parent.isOptionSet(value, 'fix'),
        larger: parent.isOptionSet(value, 'larger'),
        square: parent.isOptionSet(value, 'square')
      };
      const body = $.cached('body');
      body
        .toggleClass('lichessTools-fixCoords-fix', this.options.fix)
        .toggleClass('lichessTools-fixCoords-larger', this.options.larger)
        .toggleClass('lichessTools-fixCoords-square', this.options.square);
      const analysis = lichess?.analysis;
      if (this._init_in === undefined) this._init_in = body.is('.coords-in');
      if (this._init_out === undefined) this._init_out = body.is('.coords-out');
      if (this.options.fix && analysis) {
        const pref = analysis.data?.pref?.coords;
        if (pref) {
          body
            .toggleClass('coords-in', pref == 1)
            .toggleClass('coords-out', pref == 2);
        }
      } else {
        body
          .toggleClass('coords-in', this._init_in)
          .toggleClass('coords-out', this._init_out);
      }
      parent.global.clearInterval(this.interval);
      if (this.options.square) {
        this.interval = parent.global.setInterval(this.squareCoords, 500);
      }
    }

  }
  LiChessTools.Tools.FixCoords = FixCoordsTool;
})();
