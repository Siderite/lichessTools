(()=>{
  class PreviousGameMenuTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'previousGameMenu',
        category: 'TV',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.TV': 'TV',
        'options.previousGameMenu': 'Previously viewed game menu item',
        'lastViewedGame': 'Last viewed game',
        'lastViewedGameTitle': 'LiChess Tools - Open last viewed TV game'
      },
      'ro-RO':{
        'options.TV': 'TV',
        'options.previousGameMenu': 'Op\u0163iune de meniu pentru ultimul joc vizionat',
        'lastViewedGame': 'Ultimul joc vizionat',
        'lastViewedGameTitle': 'LiChess Tools - Deschide ultimul joc vizionat'
      }
    }

    storeGameId=(gameId)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const prevGames=parent.currentOptions.getValue('prevGames')||[];
      if (prevGames.find(g=>g==gameId)) return;
      parent.debug && parent.global.console.debug('Putting /'+gameId+' in history');

      prevGames.push(gameId);
      if (prevGames.length>10) {
        prevGames.shift();
      }
      parent.currentOptions.prevGames=prevGames;
      parent.saveOptions(parent.currentOptions);
      $('a.lichessTools-previousGame').attr('href','/'+gameId);
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('previousGameMenu');
      this.logOption('Previous viewed game menu item', value);
      const lichess=parent.lichess;
      if (!lichess) return;
      const $=parent.$;
      const trans=parent.translator;
      const container=$('#topnav section a[href="/tv"]+div[role="group"],#topnav section a[href="/broadcast"]+div[role="group"]');
      $('a.lichessTools-previousGame',container).remove();
      if (!value) return;

      const tvOptions=parent.getTvOptions();
      if (tvOptions.isTv && tvOptions.gameId) {
        this.storeGameId(tvOptions.gameId);
      }

      const translatedText=trans.noarg('lastViewedGame');
      const translatedTitle=trans.noarg('lastViewedGameTitle');
      const games=parent.currentOptions.getValue('prevGames')||[];
      const item=$('<a/>')
        .addClass('lichessTools-previousGame')
        .text(translatedText)
        .attr('title',translatedTitle);

      const m = /^\/([^\/]+)/.exec(location.pathname);
      const possibleGameId=m&&m[1];
      let index=games.findIndex(g=>g==possibleGameId);
      if (index<=0) index=games.length;
      const gameId=games[index-1];
      if (gameId) {
        item.attr('href','/'+gameId);
        if (lichess.powertip) {
          lichess.powertip.manualGame(item[0]);
        }
      } else {
        item.removeAttr('href');
      }
      container.append(item);
    }

  }
  LiChessTools.Tools.PreviousGameMenu=PreviousGameMenuTool;
})();
