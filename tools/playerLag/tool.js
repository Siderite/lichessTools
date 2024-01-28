(()=>{
  class PlayerLagTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'playerLag',
        category: 'play',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false
      }
    ];

    intl={
      'en-US':{
        'options.play': 'Play',
        'options.playerLag': 'Player lag indicators',
        'playerLagTitle': 'LiChess Tools - lag and latency indicator'
      },
      'ro-RO':{
        'options.play': 'Joc',
        'options.playerLag': 'Indicatori lag pentru juc\u0103tori',
        'playerLagTitle': 'LiChess Tools - indicator de lag \u015Fi laten\u0163\u0103'
      }
    }

    opponentLagFrequency=5000; // calls /mini to get information about opponent which is heavy on the server

    _lag=0;
    onLag=(lag)=>{
      this._lag=lag;
      this.refreshPlayers();
    };

    _latency=0;
    onLatency=(latency)=>{
      this._latency=latency;
    };

    _lagCache=new Map();
    getLag=async (username)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      let item=this._lagCache.get(username);
      if (item && Date.now()-item.time<=this.opponentLagFrequency) {
        return item.value;
      }
      const html=await parent.net.fetch({url:'/@/{username}/mini',args:{username}});
      const lagRating=$(html).find('signal')[0]?.className.substr(1);
      const lag=[750,500,300,150,75][lagRating];
      item={ time:Date.now(), value:lag };
      this._lagCache.set(username,item);
      return lag;
    };

    isPlayingGame=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      return $('body').is('.playing');
    };

    refreshPlayers=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      if (parent.global.document.visibilityState!=='visible') return;
      if (!this.isPlayingGame()) return;
      const userId=parent.getUserId();
      $('.round__app .ruser-top a.user-link,.round__app .ruser-bottom a.user-link')
        .each(async (i,e)=>{
          const href=$(e).attr('href');
          if (!href) return;
          const isPlayer=href.toLowerCase().includes(userId.toLowerCase());
          if (!isPlayer && !this.opponentLagFrequency) return;
          const hrefUserId=/\/([^\/]*?)$/.exec(href)[1]?.toLowerCase();
          if (!hrefUserId) return;
          const lag=isPlayer
            ? this._lag
            : await this.getLag(hrefUserId);
          const latency=this._latency;
          this.refreshLag(e,lag,latency);
        });
    };

    refreshLag=(container,lag,latency)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      container=$(container);
      let canvas=container.find('canvas.lichessTools-playerLag');
      let chart;
      lag=Math.round(Math.log(lag+1)/7*50);
      latency=Math.round(Math.log(latency+1)/7*50);
      if (!canvas.length) {
        canvas=$('<canvas class="lichessTools-playerLag">')
          .attr('title',trans.noarg('playerLagTitle'))
          .appendTo(container);
        chart={ lag: [], latency: [] };
        canvas[0].chart=chart;
      } else {
        chart=canvas[0].chart;
      }
      chart.lag.push(lag);
      if (chart.lag.length>100) {
        chart.lag.splice(0,1);
      }
      chart.latency.push(latency);
      if (chart.latency.length>100) {
        chart.latency.splice(0,1);
      }
      this.drawChart(canvas[0],chart);
    };

    drawChart=(canvas,chart)=>{
      canvas.width=chart.lag.length;
      canvas.height=50;
      const ctx=canvas.getContext('2d');
      ctx.fillStyle='#A0A0A030';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle='#008000';
      ctx.beginPath();
      ctx.moveTo(0,50-chart.lag[0]);
      for (let i=1; i<chart.lag.length; i++) {
        ctx.lineTo(i,50-chart.lag[i]);
      }
      ctx.stroke();
      ctx.strokeStyle='#A02020';
      ctx.beginPath();
      ctx.moveTo(0,50-chart.latency[0]);
      for (let i=1; i<chart.latency.length; i++) {
        ctx.lineTo(i,50-chart.latency[i]);
      }
      ctx.stroke();
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('playerLag');
      this.logOption('Player lag', value);
      lichess.pubsub.off('socket.lag',this.onLag);
      lichess.pubsub.off('socket.in.mlat',this.onLatency);
      $('.round__app .ruser-top a.user-link canvas.lichessTools-playerLag,.round__app .ruser-bottom a.user-link canvas.lichessTools-playerLag').remove();
      if (!value) return;
      lichess.pubsub.emit('socket.send', 'moveLat', true);
      lichess.pubsub.on('socket.lag',this.onLag);
      lichess.pubsub.on('socket.in.mlat',this.onLatency);
    }

  }
  LiChessTools.Tools.PlayerLag=PlayerLagTool;
})();
