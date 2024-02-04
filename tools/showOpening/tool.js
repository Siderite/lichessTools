(()=>{
  class ShowOpeningTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'showOpening',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.showOpening': 'Show game opening names',
        'openingNameTitle': 'LiChess Tools - opening name'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.showOpening': 'Arat\u0103 numele deschiderii \u00een partide',
        'openingNameTitle': 'LiChess Tools - numele deschiderii'
      }
    }

    miniGameOpening=async (el)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      if (parent.global.document.hidden) return;
      let fen='';
      let gameId='';
      if (el?.id && el?.fen) {
        fen=el.fen;
        gameId=el.id;
        el=$('.mini-game-'+el.id);
        if (!el.length) return;
      };
      if (!el) el=$('body');
      const elems=$(el).find('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game').get();
      if ($(el).is('a[href].mini-game,div.boards>a[href],.study__multiboard a.mini-game,div.mini-game')) elems.push(el[0]);
      for (const el of elems) {
        fen=fen || $(el).attr('data-state');
        if (!gameId) {
          gameId=$(el).attr('href');
          if (!gameId) continue;
          const m=/\/([^\/]+)/.exec(gameId);
          gameId=m&&m[1];
          if (!gameId) continue;
        }
        const result = await this.withOpening(gameId,el,undefined,fen);
        if (!result) continue;
        const opening=result.opening;
        const container=result.el;
        let openingEl=$('.lichessTools-opening',container);
        if (!openingEl.length) {
          openingEl=$('<span class="lichessTools-opening"/>')
                      .appendTo(container);
        }
        openingEl
          .text(opening)
          .attr('title',opening);
        fen='';
      }
    };
    miniGameOpeningDebounced=this.lichessTools.debounce(this.miniGameOpening,500);

    openingTime=0;
    withOpening=async (gameId,el,ply,fen)=>{
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      if (parent.opening_dict) {
        const pos=fen
          ? fen.split(' ').slice(0,4).join('').replaceAll('/','')
          : parent.getPositionFromBoard(el);
        if (pos) {
          const opening=parent.opening_dict.get(pos);
          if (opening) {
            el.openingData={time:Date.now(), opening, el};
            return el.openingData;
          }
        }
      }

      if (!gameId || gameId=='synthetic') return;

      const data=el?.openingData;
      if (data) {
        const now=Date.now();
        if (el.maxPly>14 || now-data.time<2000) return {time:now, opening:data.opening, el};
        if (!ply) return; // don't get the opening for minigames from API once retrieved
      }

      if (Date.now()-this.openingTime<1000) return; // not more often than 1 second
      this.openingTime=Date.now();

      const url='/api/games/export/_ids?tags=true&opening=true&moves=false&clocks=false&evals=false';
      const pgn = await parent.net.fetch(url, {
        method: 'POST',
        body: gameId,
        cache: 'default'
      });
      const m=/\[Opening "([^"]+)"\]/.exec(pgn);
      const opening = m&&m[1];
      if (!opening || opening=='?') {
        return;
      }
      if (el) {
        el.openingData={ time:Date.now(), opening:opening, el };
        if (ply) {
          el.maxPly=Math.max(ply,+el.maxPly||0);
        }
        return el.openingData;
      }
    };

    refreshOpening=async (ply)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      if (parent.global.document.hidden) return;
      if ($('body').is('.playing')) return;
      const trans=parent.translator;
      const tvOptions=parent.getTvOptions();
      const gameId=tvOptions.gameId || lichess.analysis?.data?.game?.id;
      const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members:not(.none), .analyse__underboard .copyables, main#board-editor .copyables');
      const result = await this.withOpening(gameId,$('main.round, main.analyse, main#board-editor')[0],ply);
      if (!result) {
        metaSection.find('.lichessTools-opening').remove();
        return;
      }
      metaSection.find('span.lichessTools-opening').filter((i,e)=>!lichessTools.inViewport(e)).remove();
      if (!metaSection.find('span.lichessTools-opening').length) {
        const visibleEl=metaSection.filter((i,e)=>lichessTools.inViewport(e)).eq(0);
        visibleEl
          .append($('<span/>').addClass('lichessTools-opening').attr('title',trans.noarg('openingNameTitle')));
      }
      metaSection.find('span.lichessTools-opening').text(result.opening);
      if (!ply) {
        await this.miniGameOpening();
      }
    };
    refreshOpeningDebounced=this.lichessTools.debounce(this.refreshOpening,500);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('showOpening');
      this.logOption('Show game opening names', value);
      this.logOption(' ... cached openings', parent.opening_dict?.size);
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      lichess.pubsub.off('socket.in.fen',this.miniGameOpening);
      lichess.pubsub.off('ply',this.refreshOpeningDebounced);
      lichess.pubsub.off('content-loaded',this.miniGameOpening);
      if (lichess.socket?.settings?.events?.endData) {
        lichess.socket.settings.events.endData=parent.unwrapFunction(lichess.socket.settings.events.endData,'showOpening');
      }
      parent.global.clearInterval(this.interval);
      if (value) {
        if (lichess.socket?.settings?.events?.endData) {
          lichess.socket.settings.events.endData=parent.wrapFunction(lichess.socket.settings.events.endData,{
            id:'showOpening',
            after: ($this,result,...args)=>{
              this.refreshOpeningDebounced();
            }
          });
        }
        lichess.pubsub.on('socket.in.fen',this.miniGameOpening);
        lichess.pubsub.on('ply',this.refreshOpeningDebounced);
        lichess.pubsub.on('content-loaded',this.miniGameOpening);
        parent.global.requestAnimationFrame(()=>this.refreshOpeningDebounced());
        if ($('main').is('#board-editor')) {
          this.interval=parent.global.setInterval(this.refreshOpeningDebounced,1000);
        }
      } else {
        const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members:not(.none), .analyse__underboard .copyables, main#board-editor .copyables');
        metaSection.find('.lichessTools-opening').remove();
      }
    }

  }
  LiChessTools.Tools.ShowOpening=ShowOpeningTool;
})();
