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

    isGamesPage=()=>{
       return /^\/games(\/|$)?/i.test(this.lichessTools.global.location.pathname);
    };

    miniGameOpening=async (el)=>{
      if (this.isGamesPage()) return;
      const parent=this.lichessTools;
      const $=parent.$;
      if (parent.global.document.hidden) return;
      if (!el) el=$('body');
      const elems=$('a[href].mini-game,div.boards>a[href]',el).get();
      if ($(el).is('a[href].mini-game,div.boards>a[href]')) elems.push(el);
      for (const el of elems) {
        if ($('.lichessTools-opening',el).length) continue;
        let gameId=$(el).attr('href');
        if (!gameId) continue;
        const m=/\/([^\/]+)/.exec(gameId);
        gameId=m&&m[1];
        if (!gameId) continue;
        const result = await this.withOpening(gameId,el);
        if (!result) return;
        const opening=result.opening;
        const container=result.el;
        if ($('.lichessTools-opening',container).length) return;
        $(container).append($('<span class="lichessTools-opening"/>').text(opening).attr('title',opening));
      }
    };
    miniGameOpeningDebounced=this.lichessTools.debounce(this.miniGameOpening,500);

    openingTimeout=0;
    withOpening=async (gameId,el,ply)=>{
      const parent=this.lichessTools;
      const Math=parent.global.Math;
      if (parent.opening_dict) {
        const pos=parent.getPositionFromBoard(el);
        if (pos) {
          const opening=parent.opening_dict.get(pos);
          if (opening) {
            return {opening,el};
          }
        }
      }

      if (!gameId || gameId=='synthetic') return;

      const data=el?.openingData;
      if (data) {
        const now=Date.now();
        if (el.maxPly>14 || now-data.time<2000) return {opening:data.opening,el};
      }

      const url='/api/games/export/_ids?tags=true&opening=true&moves=false&clocks=false&evals=false';
      await parent.timeout(this.openingTimeout+500);
      this.openingTimeout+=1000;
      const pgn = await parent.net.fetch(url, {
        method: 'POST',
        body: gameId,
        cache: 'default'
      });
      this.openingTimeout=Math.max(0,this.openingTimeout-1000);
      const m=/\[Opening "([^"]+)"\]/.exec(pgn);
      const opening = m&&m[1];
      if (!opening || opening=='?') {
        return;
      }
      if (el) {
        el.openingData={ time:Date.now(), opening:opening };
        if (ply) {
          el.maxPly=Math.max(ply,+el.maxPly||0);
        }
      }
      return {opening,el};
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
      const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members:not(.none), .analyse__underboard .copyables, main#board-editor .copyables').eq(0);
      const result = await this.withOpening(gameId,$('main.round, main.analyse, main#board-editor')[0],ply);
      if (!result) {
        $('.lichessTools-opening',metaSection).remove();
        return;
      }
      if (!$('span.lichessTools-opening',metaSection).length) {
        metaSection.append($('<span/>').addClass('lichessTools-opening').attr('title',trans.noarg('openingNameTitle')));
      }
      $('span.lichessTools-opening',metaSection).text(result.opening);
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
        lichess.pubsub.on('ply',this.refreshOpeningDebounced);
        lichess.pubsub.on('content-loaded',this.miniGameOpening);
        parent.global.requestAnimationFrame(this.refreshOpeningDebounced);
        if ($('main').is('#board-editor')) {
          this.interval=parent.global.setInterval(this.refreshOpeningDebounced,1000);
        }
      } else {
        const metaSection = $('div.game__meta section, div.analyse__wiki.empty, div.chat__members:not(.none), .analyse__underboard .copyables, main#board-editor .copyables').eq(0);
        $('.lichessTools-opening',metaSection).remove();
      }
    }

  }
  LiChessTools.Tools.ShowOpening=ShowOpeningTool;
})();
