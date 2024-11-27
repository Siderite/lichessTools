(() => {
  class CommonTeamsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'commonTeams',
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
        'options.commonTeams': 'Show common teams',
        'commonTeamsTitlePrefix:one': 'LiChess Tools - one common team',
        'commonTeamsTitlePrefix': 'LiChess Tools - %s common teams'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.commonTeams': 'Arat\u0103 echipe comune',
        'commonTeamsTitlePrefix:one': 'LiChess Tools - o echip\u0103 comun\u0103',
        'commonTeamsTitlePrefix': 'LiChess Tools - %s echipe comune'
      }
    }

    refreshTeams = async () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const crosstable = $('div.crosstable');
      if (!crosstable.length || !lt.inViewport(crosstable)) return;
      const commonTeamsLink = $('a.lichessTools-commonTeams');
      if (commonTeamsLink.length) return;
      const teamsArr = [];
      const promises = [];
      $('.game__meta__players a.user-link')
        .each((i, e) => {
          if (e.checkedCommonTeams) return;
          e.checkedCommonTeams = true;
          promises.push((async () => {
            const href = $(e).attr('href');
            if (!href) return;
            const hrefUserId = /\/([^\/\?]*?)$/.exec(href)[1]?.toLowerCase();
            if (!hrefUserId) return;
            const teams = await lt.api.team.getUserTeams(hrefUserId);
            teamsArr.push(teams);
          })());
        });
      await Promise.all(promises);
      if (!teamsArr.length) return;
      let commonTeams = null;
      for (const teams of teamsArr) {
        commonTeams = commonTeams?.filter(t => teams.find(tt => tt.id == t.id)) || teams;
      }
      if (!commonTeams.length) return;
      const teamId = commonTeams[0].id;
      const prefix = trans.plural('commonTeamsTitlePrefix', commonTeams.length, commonTeams.length);
      const isLichessToolsTeam = !!commonTeams.find(t => t.id == 'l1chess-tools-users-team');
      const linkElement = $('<a class="lichessTools-commonTeams" target="_blank">')
        .attr('title', prefix + ':\r\n' + commonTeams.map(t => '  ' + t.name).join('\r\n'))
        .attr('href', '/team/' + lt.global.encodeURIComponent(teamId))
        .appendTo(crosstable);
      if (isLichessToolsTeam) {
        linkElement
          .addClass('lichessTools-lichessToolsTeam')
          .attr('data-icon', lt.icon.Tools);
      } else {
        const flair = commonTeams[0].flair;
        if (flair) {
          $('<img class="uflair">')
            .attr('src', lichess.asset.flairSrc(flair))
            .appendTo(linkElement);
        } else {
          linkElement
            .attr('data-icon', lt.icon.Group);
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('commonTeams');
      this.logOption('Common teams', value);
      $('a.lichessTools-commonTeams').remove();
      lt.pubsub.off('lichessTools.redraw', this.refreshTeams);
      if (!value) return;
      lt.pubsub.on('lichessTools.redraw', this.refreshTeams);
      this.refreshTeams();
    }

  }
  LiChessTools.Tools.CommonTeams = CommonTeamsTool;
})();
