(() => {
  class PreviousGameMenuTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'previousGameMenu',
        category: 'TV',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true
      }
    ];

    intl = {
      'en-US': {
        'options.TV': 'TV',
        'options.previousGameMenu': 'Previously viewed game menu item',
        'lastViewedGame': 'Last viewed game',
        'lastViewedGameTitle': 'LiChess Tools - Open last viewed TV game'
      },
      'ro-RO': {
        'options.TV': 'TV',
        'options.previousGameMenu': 'Op\u0163iune de meniu pentru ultimul joc vizionat',
        'lastViewedGame': 'Ultimul joc vizionat',
        'lastViewedGameTitle': 'LiChess Tools - Deschide ultimul joc vizionat'
      }
    }

    storeGameId = (gameId) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const prevGames = lt.currentOptions.getValue('prevGames') || [];
      if (prevGames.find(g => g == gameId)) return;
      lt.debug && lt.global.console.debug('Putting /' + gameId + ' in history');

      prevGames.push(gameId);
      if (prevGames.length > 10) {
        prevGames.shift();
      }
      lt.currentOptions.prevGames = prevGames;
      lt.saveOptions(lt.currentOptions);
      $('a.lichessTools-previousGame').attr('href', '/' + gameId);
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('previousGameMenu');
      this.logOption('Previous viewed game menu item', value);
      const lichess = lt.lichess;
      if (!lichess) return;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('#topnav section a[href="/tv"]+div[role="group"],#topnav section a[href="/broadcast"]+div[role="group"]');
      $('a.lichessTools-previousGame', container).remove();
      if (!value) return;

      const tvOptions = lt.getTvOptions();
      if (tvOptions.isTv && tvOptions.gameId) {
        this.storeGameId(tvOptions.gameId);
      }

      const translatedText = trans.noarg('lastViewedGame');
      const translatedTitle = trans.noarg('lastViewedGameTitle');
      const games = lt.currentOptions.getValue('prevGames') || [];
      const item = $('<a/>')
        .addClass('lichessTools-previousGame')
        .text(translatedText)
        .attr('title', translatedTitle);

      const m = /^\/([^\/]+)/.exec(location.pathname);
      const possibleGameId = m && m[1];
      let index = games.findIndex(g => g == possibleGameId);
      if (index <= 0) index = games.length;
      const gameId = games[index - 1];
      if (gameId) {
        item.attr('href', '/' + gameId);
        const f = ()=>{
          lichess.powertip?.manualGame(item[0]);
          item
            .off('mouseover',f)
            .trigger('mouseover');
        };
        item.on('mouseover',f);
      } else {
        item.removeAttr('href');
      }
      container.append(item);
    }

  }
  LiChessTools.Tools.PreviousGameMenu = PreviousGameMenuTool;
})();
