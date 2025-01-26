(() => {
  class TournamentTopBoardTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'tournamentTopBoard',
        category: 'play',
        type: 'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.tournamentTopBoard': 'Follow tournament top board'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.tournamentTopBoard': 'Urm\u0103re\u015fte tabla principal\u0103 \u00een turneu'
      }
    }

    findNextBoard = async () => {
      const lt = this.lichessTools;
      const currentId = /^\/(?<gameId>\w{8})(?:\/|$)/.exec(lt.global.location.pathname)?.groups?.gameId;
      //if (!currentId) return;
      const data = await lt.api.tournament.getInfo(this.tourId);
      const isFinished = data?.isFinished;
      if (isFinished) return;
      const gameId = data?.featured?.id;
      if (!gameId || currentId == gameId) {
        this.timeout = lt.global.setTimeout(this.findNextBoard,3000);
        return;
      }
      const orientation = data.featured.orientation || 'white';
      const newLocation = `/${gameId}/${orientation}#tournament=${this.tourId}`;
      lt.global.location = newLocation;
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('tournamentTopBoard');
      this.logOption('Tournament top board', value);
      if (!lt.getUserId()) return;
      lt.global.clearTimeout(this.timeout);
      lt.uiApi.socket.events.off('endData', this.findNextBoard);
      if (!value) return;
      const tourId = $('body').attr('data-tournament-id');
      if (tourId) {
        const hash = '#tournament='+tourId;
        const a = $('div.tour__featured > a.cg-wrap');
        const href=a.attr('href');
        if (href && !href.includes(hash)) {
          a.attr('href',href+hash);
        }
      }
      this.tourId = /^#tournament=(?<tourId>[\w]{8})/.exec(lt.global.location.hash)?.groups?.tourId;
      if (!this.tourId) return;
      lt.uiApi.socket.events.on('endData', this.findNextBoard);
      await this.findNextBoard();
    }

  }
  LiChessTools.Tools.TournamentTopBoard = TournamentTopBoardTool;
})();
