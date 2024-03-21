(()=>{
  class MainPageElementsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'mainPageElements',
        category: 'general',
        type:'multiple',
        possibleValues: ['side','app','table','tv','blog','puzzle','support','feed','tours','leader','winner','about'],
        defaultValue: 'side,app,table,tv,blog,puzzle,support,feed,tours,leader,winner,about',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.mainPageElements': 'Main page elements',
        'mainPageElements.side': 'Side',
        'mainPageElements.app': 'App',
        'mainPageElements.table': 'Table',
        'mainPageElements.tv': 'TV',
        'mainPageElements.blog': 'Blog',
        'mainPageElements.puzzle': 'Puzzle',
        'mainPageElements.support': 'Support',
        'mainPageElements.feed': 'Feed',
        'mainPageElements.tours': 'Tours',
        'mainPageElements.leader': 'Leader',
        'mainPageElements.winner': 'Winner',
        'mainPageElements.about': 'About'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.mainPageElements': 'Elemente pagin\u0103 principal\u0103'
      }
    }

    hashChange=()=>{
      const parent=this.lichessTools;
      parent.global.location.reload();
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('mainPageElements');
      this.logOption('Main page elements', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      if (!$('main').is('.lobby')) return;
      this.options={
        side: parent.isOptionSet(value,'side'),
        app: parent.isOptionSet(value,'app'),
        table: parent.isOptionSet(value,'table'),
        tv: parent.isOptionSet(value,'tv'),
        blog: parent.isOptionSet(value,'blog'),
        puzzle: parent.isOptionSet(value,'puzzle'),
        support: parent.isOptionSet(value,'support'),
        feed: parent.isOptionSet(value,'feed'),
        tours: parent.isOptionSet(value,'tours'),
        leader: parent.isOptionSet(value,'leader'),
        winner: parent.isOptionSet(value,'winner'),
        about: parent.isOptionSet(value,'about')
      };
      if (!this.initialGrid) {
        this.initialGrid=$('main').css('grid-template-areas');
      }
      let isPlay=false;
      if (!this.options.app) {
        $(parent.global).off('hashchange',this.hashChange);
        $(parent.global).on('hashchange',this.hashChange);
        $('#topnav > section:first-child > a').attr('href','/#play');
        isPlay=parent.global.location.hash=='#play';
      } else {
        $('#topnav > section:first-child > a').attr('href','/');
      }
      $('main').toggleClass('lichessTools-lobbyPlay',isPlay);
      if (!isPlay) {
        const grid=this.initialGrid.replace(/[a-z]+/g,t=>{
          const res=this.options[t]
            ? t
            : '.'.padEnd(t.length,' ');
          return res;
        });
        $('main').css('grid-template-areas',grid);
        $('main .lobby__side').toggle(this.options.side);
        $('main .lobby__app').toggle(this.options.app);
        $('main .lobby__table').toggle(this.options.table);
        $('main .lobby__tv').toggle(this.options.tv);
        $('main .lobby__blog').toggle(this.options.blog);
        $('main .lobby__puzzle').toggle(this.options.puzzle);
        $('main .lobby__support').toggle(this.options.support);
        $('main .lobby__feed').toggle(this.options.feed);
        $('main .lobby__tournaments-simuls').toggle(this.options.tours);
        $('main .lobby__leaderboard').toggle(this.options.leader);
        $('main .lobby__winners').toggle(this.options.winner);
        $('main .lobby__about').toggle(this.options.about);
      }
    }
  }
  LiChessTools.Tools.MainPageElements=MainPageElementsTool;
})();
