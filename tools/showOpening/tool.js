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
        'options.showOpening': 'Show game opening names'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.showOpening': 'Arat\u0103 numele deschiderii \u00een partide'
      }
    }

    miniGameOpening=async (el)=>{
      const parent=this.lichessTools;
      const $=parent.$;
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
        const container=result.data;
        if ($('.lichessTools-opening',container).length) return;
        $(container).append($('<span class="lichessTools-opening"/>').text(opening).attr('title',opening));
      }
    };

    openingTimeout=0;
    withOpening=async (gameId,data)=>{
      const parent=this.lichessTools;
      const url='/api/games/export/_ids?opening=true&moves=false&accuracy';
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
      return {opening,data};
    };

    refreshOpening=async ()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const tvOptions=parent.getTvOptions();
      const gameId=tvOptions.gameId || lichess.analysis?.data?.game?.id;
      if (!gameId||gameId=='synthetic') return;
      const metaSection = $('div.game__meta section').eq(0);
      $('.lichessTools-opening',metaSection).remove();
      const result = await this.withOpening(gameId);
      if (!result) return;
      metaSection.append($('<span/>').addClass('lichessTools-opening').text(result.opening));
      await this.miniGameOpening();
    };
    refreshOpeningDebounced=this.lichessTools.debounce(this.refreshOpening,2000);
    refreshOpeningSub=(ply)=>{
      if (ply>10) return;
      this.refreshOpeningDebounced();
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('showOpening');
      this.logOption('Show game opening names', value);
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      lichess.pubsub.off('ply',this.refreshOpeningSub);
      lichess.pubsub.off('content-loaded',this.miniGameOpening);
      if (value) {
        lichess.pubsub.on('ply',this.refreshOpeningSub);
        lichess.pubsub.on('content-loaded',this.miniGameOpening);
        this.refreshOpening();
      } else {
        const metaSection = $('div.game__meta section').eq(0);
        $('.lichessTools-opening',metaSection).remove();
      }
    }

  }
  LiChessTools.Tools.ShowOpening=ShowOpeningTool;
})();
