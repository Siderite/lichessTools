(() => {
  class LobbyRatingDiffTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'lobbyRatingDiff',
        category: 'appearance',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.lobbyRatingDiff': 'Lobby rating difference',
        'lobbyRatingDiffTitle': 'LiChess Tools - rating difference'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.lobbyRatingDiff': 'Diferen\u0163\u0103 rating \u00een pagina principal\u0103',
        'lobbyRatingDiffTitle': 'LiChess Tools - diferen\u0163\u0103 rating'
      }
    }

    getPerfKey = (ch)=>{
      const lt = this.lichessTools;
      switch(ch) {
        case lt.icon.UltraBullet: return 'ultraBullet';
        case lt.icon.Bullet: return 'bullet';
        case lt.icon.FlameBlitz: return 'blitz';
        case lt.icon.Rabbit: return 'rapid';
        case lt.icon.Turtle: return 'classical';
        case lt.icon.PaperAirplane: return 'correspondence';
        case lt.icon.DieSix: return 'chess960';
        case lt.icon.Crazyhouse: return 'crazyhouse';
        case lt.icon.FlagKingHill: return 'kingOfTheHill';
        case lt.icon.ThreeCheckStack: return 'threeCheck';
        case lt.icon.Antichess: return 'antichess';
        case lt.icon.Atom: return 'atomic';
        case lt.icon.KeyPad: return 'horde';
        case lt.icon.FlagRacingKings: return 'racingKings';
        default: return null;
      }
    };

    showDiff = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      $('table.hooks__list td:nth-child(2):not([data-diff])')
        .each((i,e)=>{
          const rating = +e.textContent?.replaceAll('?','');
          if (!rating) return;
          const icon = $(e).parent().find('span[data-icon]').attr('data-icon');
          if (!icon) return;
          const timeControl = this.getPerfKey(icon);
          if (!timeControl) return;
          const myRating = this.perf?.perfs?.[timeControl]?.rating;
          if (!myRating) return;
          const diff = rating - myRating;
          $(e)
            .attr('title',trans.noarg('lobbyRatingDiffTitle'))
            .attr('data-diff',diff>0 ? `+${diff}` : `${diff}` )
            .toggleClassSafe('lichessTools-plus',diff>0)
            .toggleClassSafe('lichessTools-minus',diff<0);
        });
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('lobbyRatingDiff');
      this.logOption('Lobby rating diff', value);
      const $ = lt.$;
      $('body').observer()
        .off('.lobby__app,.hooks__list tbody',this.showDiff);
      $('[data-diff]').removeAttr('data-diff').removeAttr('title');
      if (!value) return;
      const userId = lt.getUserId();
      if (!userId) return;
      lt.api.user.getUsers([userId]).then((data)=>{
        this.perf = data[0];
        $('body').observer()
          .on('.lobby__app,.hooks__list tbody',this.showDiff);
        this.showDiff();
      });
    }

  }
  LiChessTools.Tools.LobbyRatingDiff = LobbyRatingDiffTool;
})();
