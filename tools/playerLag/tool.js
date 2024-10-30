(() => {
  class PlayerLagTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'playerLag',
        category: 'play',
        type: 'single',
        possibleValues: ['none', 'bars', 'chart'],
        defaultValue: 'none',
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.playerLag': 'Player lag indicators',
        'playerLagTitle': 'LiChess Tools - ping %1ms/latency %2ms',
        'playerLag.none': 'None',
        'playerLag.bars': 'Bars',
        'playerLag.chart': 'Chart'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.playerLag': 'Indicatori lag pentru juc\u0103tori',
        'playerLagTitle': 'LiChess Tools - ping %1ms/laten\u0163\u0103 %2ms',
        'playerLag.none': 'F\u0103r\u0103',
        'playerLag.bars': 'Bare',
        'playerLag.chart': 'Grafic'
      }
    }

    opponentLagFrequency = 5000; // calls /mini to get information about opponent which is heavy on the server

    _lag = 0;
    onLag = (lag) => {
      this._lag = lag;
      this.refreshPlayers();
    };

    _latency = 0;
    onLatency = (latency) => {
      this._latency = latency;
    };

    _lagCache = new Map();
    getLag = async (username) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      let item = this._lagCache.get(username);
      if (item && Date.now() - item.time <= this.opponentLagFrequency) {
        return item.value;
      }
      const data = await lt.api.user.getUserStatus([username], { withSignal: true });
      const lagRating = data[0]?.signal;
      const lag = [750, 500, 300, 150, 75][lagRating];
      item = { time: Date.now(), value: lag };
      this._lagCache.set(username, item);
      return lag;
    };

    isPlayingGame = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      return $.cached('body').is('.playing');
    };

    refreshPlayers = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (lt.global.document.visibilityState !== 'visible') return;
      if (!this.isPlayingGame()) return;
      const userId = lt.getUserId();
      $('.round__app .ruser-top a.user-link,.round__app .ruser-bottom a.user-link')
        .each(async (i, e) => {
          const href = $(e).attr('href');
          if (!href) return;
          const hrefUserId = /\/([^\/\?]*?)$/.exec(href)[1]?.toLowerCase();
          if (!hrefUserId) return;
          const isPlayer = hrefUserId?.toLowerCase() == userId?.toLowerCase();
          if (!isPlayer) {
            if (!this.opponentLagFrequency || $(e).parent().find('good,bad').length) return;
          }
          const lag = isPlayer
            ? this._lag
            : await this.getLag(hrefUserId);
          const latency = this._latency;
          if (this.options.chart) {
            this.refreshLagChart(e, lag, latency);
          }
          if (this.options.bars) {
            this.refreshLagBars(e, lag, latency);
          }
        });
    };

    refreshLagBars = (container, lag, latency) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      container = $(container);
      let signal = container.find('signal');
      if (!signal.length) {
        signal = $('<signal><i></i><i></i><i></i><i></i></signal>')
          .addClass('lichessTools-playerLag')
          .appendTo(container);
      }
      container.siblings('signal').remove();
      const lagRating = !lag ? 0 : lag < 150 ? 4 : lag < 300 ? 3 : lag < 500 ? 2 : 1;
      signal
        .attr('title', trans.noarg('playerLagTitle').replaceAll('%1', Math.round(lag)).replaceAll('%2', Math.round(latency)))
        .removeClass('q0 q1 q2 q3 q4')
        .addClass('q' + lagRating);
    };

    refreshLagChart = (container, lag, latency) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      container = $(container);
      let canvas = container.find('canvas.lichessTools-playerLag');
      let chart;
      if (!canvas.length) {
        canvas = $('<canvas class="lichessTools-playerLag">')
          .appendTo(container);
        chart = { lag: [], latency: [] };
        canvas[0].chart = chart;
      } else {
        chart = canvas[0].chart;
      }
      canvas.attr('title', trans.noarg('playerLagTitle').replaceAll('%1', Math.round(lag)).replaceAll('%2', Math.round(latency)));
      lag = Math.round(Math.log(lag + 1) / 7 * 50);
      latency = Math.round(Math.log(latency + 1) / 7 * 50);
      chart.lag.push(lag);
      if (chart.lag.length > 100) {
        chart.lag.splice(0, 1);
      }
      chart.latency.push(latency);
      if (chart.latency.length > 100) {
        chart.latency.splice(0, 1);
      }
      this.drawChart(canvas[0], chart);
    };

    drawChart = (canvas, chart) => {
      canvas.width = chart.lag.length;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#A0A0A030';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#008000';
      ctx.beginPath();
      ctx.moveTo(0, 50 - chart.lag[0]);
      for (let i = 1; i < chart.lag.length; i++) {
        ctx.lineTo(i, 50 - chart.lag[i]);
      }
      ctx.stroke();
      ctx.strokeStyle = '#A02020';
      ctx.beginPath();
      ctx.moveTo(0, 50 - chart.latency[0]);
      for (let i = 1; i < chart.latency.length; i++) {
        ctx.lineTo(i, 50 - chart.latency[i]);
      }
      ctx.stroke();
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('playerLag');
      this.logOption('Player lag', value);
      this.options = {
        bars: lt.isOptionSet(value, 'bars'),
        chart: lt.isOptionSet(value, 'chart'),
        get isSet() { return this.bars || this.chart; }
      };
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      lichess.pubsub.off('socket.lag', this.onLag);
      lichess.pubsub.off('socket.in.mlat', this.onLatency);
      $('.round__app .ruser-top a.user-link .lichessTools-playerLag,.round__app .ruser-bottom a.user-link .lichessTools-playerLag').remove();
      if (!this.options.isSet) return;
      lichess.pubsub.emit('socket.send', 'moveLat', true);
      lichess.pubsub.on('socket.lag', this.onLag);
      lichess.pubsub.on('socket.in.mlat', this.onLatency);
    }

  }
  LiChessTools.Tools.PlayerLag = PlayerLagTool;
})();
