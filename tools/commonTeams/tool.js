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
    getTeams = async ()=>{
      const parent=this.lichessTools;
      if (!this.teamCache) {
        this.teamCache = parent.storage.get('LichessTools.teamCache',{ session:true, zip:true });
      }
      if (!this.teamCache) {
        this.teamCache = await parent.net.json({url:'/api/team/of/{userId}',args:{userId:parent.getUserId()}});
        parent.storage.set('LichessTools.teamCache',this.teamCache,{ session:true, zip:true });
      }
      return this.teamCache;
    };

    refreshTeams=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const userId=parent.getUserId();
      const isMyGame = !!$('.round__app .ruser-top a.user-link,.round__app .ruser-bottom a.user-link')
        .get()
        .find(e=>{
          const href=$(e).attr('href');
          if (!href) return;
          const isPlayer=href.toLowerCase().includes(userId.toLowerCase());
          return isPlayer;
        });
      if (!isMyGame) return;
      $('.round__app .ruser-top a.user-link,.round__app .ruser-bottom a.user-link')
        .each(async (i,e)=>{
          if (e.checkedCommonTeams) return;
          e.checkedCommonTeams=true;
          const href=$(e).attr('href');
          if (!href) return;
          const hrefUserId=/\/([^\/\?]*?)$/.exec(href)[1]?.toLowerCase();
          if (!hrefUserId) return;
          const isPlayer=hrefUserId==userId.toLowerCase();
          if (isPlayer) return;
          const myTeams=await this.getTeams();
          const theirTeams = await parent.net.json({url:'/api/team/of/{userId}',args:{userId:hrefUserId}});
          const commonTeams=myTeams.map(mt=>theirTeams.filter(tt=>tt.id==mt.id)).flat();
          if (!commonTeams.length) return;
          const prefix=trans.plural('commonTeamsTitlePrefix',commonTeams.length,commonTeams.length);
          const url=commonTeams.length==1
            ? '/team/'+parent.global.encodeURIComponent(commonTeams[0].id)
            : '/team/me';
          $('<a class="lichessTools-commonTeams" target="_blank">')
            .attr('data-icon','\uE059')
            .attr('title',prefix+':\r\n'+commonTeams.map(t=>'  '+t.name).join('\r\n'))
            .attr('href',url)
            .appendTo('div.crosstable');
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
      if (!$('.round__app').length) return;
      lichess.pubsub.on('redraw',this.refreshTeams);
      this.refreshTeams();
    }

  }
  LiChessTools.Tools.CommonTeams=CommonTeamsTool;
})();
