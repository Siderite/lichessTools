(()=>{
  class CommonTeamsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'commonTeams',
        category: 'play',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.play': 'Play',
        'options.commonTeams': 'Show common teams',
        'commonTeamsTitlePrefix:one': 'LiChess Tools - one common team',
        'commonTeamsTitlePrefix': 'LiChess Tools - %s common teams'
      },
      'ro-RO':{
        'options.play': 'Joc',
        'options.commonTeams': 'Arat\u0103 echipe comune',
        'commonTeamsTitlePrefix:one': 'LiChess Tools - o echip\u0103 comun\u0103',
        'commonTeamsTitlePrefix': 'LiChess Tools - %s echipe comune'
      }
    }

    teamCache=null;
    getTeams = async (userId)=>{
      const parent=this.lichessTools;
      if (!this.teamCache) {
        this.teamCache = parent.storage.get('LichessTools.teamCache',{ session:true, zip:true });
      }
      if (!this.teamCache||Array.isArray(this.teamCache)) this.teamCache={};
      let teams=this.teamCache[userId];
      if (!teams) {
        teams = await parent.net.json({url:'/api/team/of/{userId}',args:{userId:userId}});
        this.teamCache[userId]=teams;
        parent.storage.set('LichessTools.teamCache',this.teamCache,{ session:true, zip:true });
      }
      return teams;
    };

    refreshTeams=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const crosstable=$('div.crosstable');
      if (!crosstable.length) return;
      const commonTeamsLink=$('a.lichessTools-commonTeams');
      if (commonTeamsLink.length) return;
      const userId=parent.getUserId();
      const isMyGame = !!$('.game__meta__players a.user-link')
        .get()
        .find(e=>{
          const href=$(e).attr('href');
          if (!href) return;
          const isPlayer=href.toLowerCase().includes(userId.toLowerCase());
          return isPlayer;
        });
      if (!isMyGame) return;
      $('.game__meta__players a.user-link')
        .each(async (i,e)=>{
          if (e.checkedCommonTeams) return;
          e.checkedCommonTeams=true;
          const href=$(e).attr('href');
          if (!href) return;
          const hrefUserId=/\/([^\/\?]*?)$/.exec(href)[1]?.toLowerCase();
          if (!hrefUserId) return;
          const isPlayer=hrefUserId==userId.toLowerCase();
          if (isPlayer) return;
          const myTeams=await this.getTeams(userId);
          const theirTeams = await this.getTeams(hrefUserId);
          const commonTeams=myTeams.map(mt=>theirTeams.filter(tt=>tt.id==mt.id)).flat();
          if (!commonTeams.length) return;
          const prefix=trans.plural('commonTeamsTitlePrefix',commonTeams.length,commonTeams.length);
          const teamId=commonTeams.length==1
            ? commonTeams[0].id
            : 'me';
          const icon=commonTeams.find(t=>t.id=='l1chess-tools-users-team')
            ? '\uE000'
            : '\uE059';
          $('<a class="lichessTools-commonTeams" target="_blank">')
            .attr('data-icon',icon)
            .attr('title',prefix+':\r\n'+commonTeams.map(t=>'  '+t.name).join('\r\n'))
            .attr('href','/team/'+parent.global.encodeURIComponent(teamId))
            .appendTo(crosstable);
        });
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('commonTeams');
      this.logOption('Common teams', value);
      lichess.pubsub.off('redraw',this.refreshTeams);
      if (!value) return;
      lichess.pubsub.on('redraw',this.refreshTeams);
      this.refreshTeams();
    }

  }
  LiChessTools.Tools.CommonTeams=CommonTeamsTool;
})();
