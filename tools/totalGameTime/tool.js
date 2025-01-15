(() => {
  class TotalGameTimeTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'totalGameTime',
        category: 'play',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.totalGameTime': 'Show total game duration',
        'durationLabelTitle': 'LiChess Tools - total game duration',
        'durationLabelText': 'Total duration: %s'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.totalGameTime': 'Arat\u0103 durata total\u0103 a jocului',
        'durationLabelTitle': 'LiChess Tools - durata total\u0103 a jocului',
        'durationLabelText': 'Durata total\u0103: %s'
      }
    }

    calculateDuration = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const game = lichess.analysis?.data?.game;
      if (!game?.moveCentis) return;
      const chart = $('#movetimes-chart');
      if (!chart.length) return;
      let label = chart.next('.lichessTools-totalGameTime');
      if (!label.length) {
        label = $('<div class="lichessTools-totalGameTime">')
          .attr('title',trans.noarg('durationLabelTitle'))
          .insertAfter(chart);
      }
      const Math = lt.global.Math;
      const duration = Math.round(game.moveCentis.reduce((s,v)=>s+v,0)/100);
      const h = Math.floor(duration / 3600);
      const m = Math.floor((duration % 3600) / 60);
      const s = duration % 60;
      const arr = [];
      if (h) arr.push(h.toString().padStart(2,'0'));
      arr.push(m.toString().padStart(2,'0'));
      arr.push(s.toString().padStart(2,'0'));
      const durationText = arr.join(':');
      label
        .text(trans.pluralSame('durationLabelText',durationText));
    }

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess) return;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('totalGameTime');
      this.logOption('Total game duration', value);
      if (!lichess.analysis) return;
      lt.pubsub.off('lichessTools.redraw', this.calculateDuration);
      $('.lichessTools-totalGameTime').remove();
      if (!value) return;
      lt.pubsub.on('lichessTools.redraw', this.calculateDuration);
    }

  }
  LiChessTools.Tools.TotalGameTime = TotalGameTimeTool;
})();
