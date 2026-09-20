(() => {
  class FixCoordsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixCoords',
        category: 'appearance',
        type: 'multiple',
        possibleValues: ['fix', 'larger', 'square'],
        defaultValue: 'fix',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.fixCoords': 'Fix board coordinate position',
        'fixCoords.fix': 'Fix outside coordinates',
        'fixCoords.larger': 'Larger coordinate font',
        'fixCoords.square': 'On each square'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.fixCoords': 'Repar\u0103 pozi\u0163ia coordonatelor tablei',
        'fixCoords.fix': 'Repar\u0103 coordonatele \u00een exterior',
        'fixCoords.larger': 'Font mai mare pentru coordonate',
        'fixCoords.square': 'Pe fiecare p\u0103trat'
      }
    }

    squareCoords = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      let container = $('div.main-board > div.cg-wrap > cg-container');
      if (!container.length) return;
      //if (!container.children('coords').length) return;
      let coords = container.children('coords.lichessTools-fixCoords');
      if (!coords.length) {
        coords = $('<coords class="lichessTools-fixCoords">')
          .appendTo(container);
      }
      if (!coords.find('coord').length) {
        for (let rank = 1; rank <= 8; rank++) {
          for (let file = 1; file <= 8; file++) {
            $('<coord>')
              .text(String.fromCharCode(96 + file) + String.fromCharCode(48 + rank))
              .css('--rank', rank)
              .css('--file', file)
              .addClass((rank+file)%2?'light':'dark')
              .appendTo(coords);
          }
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('fixCoords');
      this.logOption('Fix coordinates', value);
      this.options = {
        fix: lt.isOptionSet(value, 'fix'),
        larger: lt.isOptionSet(value, 'larger'),
        square: lt.isOptionSet(value, 'square')
      };
      const analysis = lichess?.analysis;
      let pref = analysis?.data?.pref?.coords;
      const body = $.cached('body');
      if (body.is('.coords-out')) pref = 2;
      body
        .toggleClass('lichessTools-fixCoords-fix', this.options.fix && pref == 2)
        .toggleClass('lichessTools-fixCoords-larger', this.options.larger)
        .toggleClass('lichessTools-fixCoords-square', this.options.square);
      lt.global.clearInterval(this.interval);
      if (this.options.square) {
        this.interval = lt.global.setInterval(this.squareCoords, 500);
      }
    }

  }
  LiChessTools.Tools.FixCoords = FixCoordsTool;
})();
