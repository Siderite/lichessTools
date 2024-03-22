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
        'options.mainPageElements': 'Lobbby page elements',
        'mainPageElements.side': 'Side',
        'mainPageElements.app': 'Play grid',
        'mainPageElements.table': 'Play buttons',
        'mainPageElements.tv': 'TV',
        'mainPageElements.blog': 'Blog',
        'mainPageElements.puzzle': 'Daily puzzle',
        'mainPageElements.support': 'Support',
        'mainPageElements.feed': 'Feed',
        'mainPageElements.tours': 'Tournaments',
        'mainPageElements.leader': 'Leaderboard',
        'mainPageElements.winner': 'Winners',
        'mainPageElements.about': 'About'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.mainPageElements': 'Elemente pagin\u0103 principal\u0103',
        'mainPageElements.side': 'Lateral',
        'mainPageElements.app': 'Gril\u0103 jocuri',
        'mainPageElements.table': 'Butoane joc',
        'mainPageElements.tv': 'TV',
        'mainPageElements.blog': 'Blog',
        'mainPageElements.puzzle': 'Puzzle zilnic',
        'mainPageElements.support': 'Suport',
        'mainPageElements.feed': 'Nout\u0103ti',
        'mainPageElements.tours': 'Turnee',
        'mainPageElements.leader': 'Clasament',
        'mainPageElements.winner': 'C\u00e2stig\u0103tori',
        'mainPageElements.about': 'Despre'
      }
    }

    hashChange=()=>{
      const parent=this.lichessTools;
      parent.global.location.reload();
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('mainPageElements');
      this.logOption('Lobby page elements', value);
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
        about: parent.isOptionSet(value,'about'),
        get allSet() { return this.side && this.app && this.table && this.tv && this.blog && 
                              this.puzzle && this.support && this.feed && this.tours && this.leader && this.winner && this.about; }
      };
      if (this.options.allSet) {
        $('main')
          .removeClass('lichessTools-lobbyPlay')
          .css('grid-template-areas','');
        $('main').find('.lobby__side,.lobby__app,main .lobby__table,.lobby__tv,.lobby__blog,.lobby__puzzle,.lobby__support,'+
           '.lobby__feed,.lobby__tournaments-simuls,.lobby__leaderboard,.lobby__winners,.lobby__about').show();
        return;
      }
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
