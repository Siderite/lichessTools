(() => {
  class MainPageElementsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties'];

    preferences = [
      {
        name: 'mainPageElements',
        category: 'appearance',
        type: 'multiple',
        possibleValues: ['side', 'side_streams', 'side_spotlights', 'side_timeline', 'app','app_bullet','app_blitz','app_rapid','app_classical', 'table', 'tv', 'blog', 'puzzle', 'support', 'feed', 'tours', 'about'],
        defaultValue: 'side,app,table,app_bullet,app_blitz,app_rapid,app_classical,tv,blog,puzzle,support,feed,tours,about,side_streams,side_spotlights,side_timeline',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.mainPageElements': 'Lobby page elements',
        'mainPageElements.side': 'Side',
        'mainPageElements.app': 'Play grid',
        'mainPageElements.table': 'Play buttons',
        'mainPageElements.tv': 'TV',
        'mainPageElements.blog': 'Blog',
        'mainPageElements.puzzle': 'Daily puzzle',
        'mainPageElements.support': 'Support',
        'mainPageElements.feed': 'Feed',
        'mainPageElements.tours': 'Tournaments',
        'mainPageElements.about': 'About',
        'mainPageElements.side_streams': 'Side:streams',
        'mainPageElements.side_spotlights': 'Side:spotlights',
        'mainPageElements.side_timeline': 'Side:timeline',
        'mainPageElements.app_bullet': 'Play:bullet',
        'mainPageElements.app_blitz': 'Play:blitz',
        'mainPageElements.app_rapid': 'Play:rapid',
        'mainPageElements.app_classical': 'Play:classical'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.mainPageElements': 'Elemente pagin\u0103 principal\u0103',
        'mainPageElements.side': 'Lateral',
        'mainPageElements.app': 'Gril\u0103 jocuri',
        'mainPageElements.table': 'Butoane joc',
        'mainPageElements.tv': 'TV',
        'mainPageElements.blog': 'Blog',
        'mainPageElements.puzzle': 'Puzzle zilnic',
        'mainPageElements.support': 'Suport',
        'mainPageElements.feed': 'Nout\u0103\u0163i',
        'mainPageElements.tours': 'Turnee',
        'mainPageElements.about': 'Despre',
        'mainPageElements.side_streams': 'Lateral:stream-uri',
        'mainPageElements.side_spotlights': 'Lateral:prim-plan',
        'mainPageElements.side_timeline': 'Lateral:activitate recent\u0103',
        'mainPageElements.app_bullet': 'Joc:bullet',
        'mainPageElements.app_blitz': 'Joc:blitz',
        'mainPageElements.app_rapid': 'Joc:rapid',
        'mainPageElements.app_classical': 'Joc:clasic'
      }
    }

    hashChange = () => {
      const lt = this.lichessTools;
      lt.global.location.reload();
    }

    applyLobbyElements = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!this.initialGrid) {
        this.initialGrid = $('main').css('grid-template-areas');
      }
      $('main').toggleClass('lichessTools-lobbyPlay', this.isPlay);
      if (this.isPlay) {
        lt.global.document.title = $('#topnav > section:first-child span.play').text() + ' ' + lt.icon.BulletPoint + ' ' + lt.global.location.hostname;
      } else {
        const grid = this.initialGrid.replace(/[a-z]+/g, t => {
          const ft = t === 'timeline' ? 'side' : t;
          const res = this.options[ft] || (ft == 'side' && $('.lichessTools-pins *,.lichessTools-dailyQuote.side').length)
            ? t
            : '.'.padEnd(t.length, ' ');
          return res;
        });
        $('main').css('grid-template-areas', grid);
        $('main .lobby__side').toggleClassSafe('lichessTools-hideElement', !this.options.side);
        $('main .lobby__streams').toggleClassSafe('lichessTools-hideElement', !this.options.side || !this.options.side_streams);
        $('main .lobby__spotlights').toggleClassSafe('lichessTools-hideElement', !this.options.side || !this.options.side_spotlights);
        $('main .lobby__timeline').toggleClassSafe('lichessTools-hideElement', !this.options.side || !this.options.side_timeline);
        $('main .lobby__app').toggleClassSafe('lichessTools-hideElement', !this.options.app);
        $('main .lobby__app').find('div[data-id="1+0"],div[data-id="2+1"]')
          .toggleClassSafe('lichessTools-hideElement', !this.options.app || !this.options.app_bullet);
        $('main .lobby__app').find('div[data-id="3+0"],div[data-id="3+2"],div[data-id="5+0"],div[data-id="5+3"]')
          .toggleClassSafe('lichessTools-hideElement', !this.options.app || !this.options.app_blitz);
        $('main .lobby__app').find('div[data-id="10+0"],div[data-id="10+5"],div[data-id="15+10"]')
          .toggleClassSafe('lichessTools-hideElement', !this.options.app || !this.options.app_rapid);
        $('main .lobby__app').find('div[data-id="30+0"],div[data-id="30+20"]')
          .toggleClassSafe('lichessTools-hideElement', !this.options.app || !this.options.app_classical);
        $('main .lobby__table').toggleClassSafe('lichessTools-hideElement', !this.options.table);
        $('main .lobby__tv').toggleClassSafe('lichessTools-hideElement', !this.options.tv);
        $('main .lobby__blog').toggleClassSafe('lichessTools-hideElement', !this.options.blog);
        $('main .lobby__puzzle').toggleClassSafe('lichessTools-hideElement', !this.options.puzzle);
        $('main .lobby__support').toggleClassSafe('lichessTools-hideElement', !this.options.support);
        $('main .lobby__feed').toggleClassSafe('lichessTools-hideElement', !this.options.feed);
        $('main .lobby__tournaments-simuls').toggleClassSafe('lichessTools-hideElement', !this.options.tours);
        $('main .lobby__about').toggleClassSafe('lichessTools-hideElement', !this.options.about);

        if (this.options.side && !this.options.side_timeline && this.options.feed) {
          if (!$('.lobby__side').parent().is('.lobby__feed')) {
            $('.lobby__feed').appendTo('.lobby__side');
          }
        } else {
          if (!$('.lobby__side .lobby__feed').parent().is('main.lobby')) {
            $('.lobby__side .lobby__feed').appendTo('main.lobby');
          }
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('mainPageElements');
      this.logOption('Lobby page elements', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const userId = lt.getUserId();
      this.options = {
        get side() {
          return lt.isOptionSet(value, 'side')
                   ? this.side_streams || this.side_spotlights || this.side_timeline
                   : false;
        },
        get app_all() {
          return this.app_bullet && this.app_blitz && this.app_rapid && this.app_classical;
        },
        side_streams: lt.isOptionSet(value, 'side_streams'),
        side_spotlights: lt.isOptionSet(value, 'side_spotlights'),
        side_timeline: userId && lt.isOptionSet(value, 'side_timeline'),
        app: lt.isOptionSet(value, 'app'),
        app_bullet: lt.isOptionSet(value, 'app_bullet'),
        app_blitz: lt.isOptionSet(value, 'app_blitz'),
        app_rapid: lt.isOptionSet(value, 'app_rapid'),
        app_classical: lt.isOptionSet(value, 'app_classical'),
        table: lt.isOptionSet(value, 'table'),
        tv: lt.isOptionSet(value, 'tv'),
        blog: lt.isOptionSet(value, 'blog'),
        puzzle: lt.isOptionSet(value, 'puzzle'),
        support: lt.isOptionSet(value, 'support'),
        feed: lt.isOptionSet(value, 'feed'),
        tours: lt.isOptionSet(value, 'tours'),
        about: lt.isOptionSet(value, 'about'),
        get allSet() {
          return this.side && this.app && this.app_all && this.table && this.tv && this.blog &&
            this.puzzle && this.support && this.feed && this.tours && this.about;
        },
        get noneSet() {
          return !this.side && !this.app && !this.table && !this.tv && !this.blog &&
            !this.puzzle && !this.support && !this.feed && !this.tours && !this.about;
        }
      };
      if (!this.options.side_streams && !this.options.side_spotlights && !this.options.side_timeline) {
        this.options.side_streams = true;
        this.options.side_spotlights = true;
        this.options.side_timeline = true;
      }
      if (!this.options.app_bullet && !this.options.app_blitz && !this.options.app_rapid && !this.options.app_classical) {
        this.options.app_bullet = true;
        this.options.app_blitz = true;
        this.options.app_rapid = true;
        this.options.app_classical = true;
      }
      if (this.options.allSet || this.options.noneSet) {
        if (this.initialGrid) {
          $('main')
            .removeClass('lichessTools-lobbyPlay')
            .css('grid-template-areas', '');
          $('main.lobby .lichessTools-hideElement')
            .removeClass('lichessTools-hideElement');
        }
        return;
      }
      this.isPlay = false;
      if (!this.options.app) {
        if (!$('body').is('.mobile')) {
          $('#topnav > section:first-child > a').attr('href', '/#play');
        }
        this.isPlay = lt.global.location.hash == '#play';
      } else {
        $('#topnav > section:first-child > a').attr('href', '/');
      }
      if (!$('main').is('.lobby')) return;
      if (!this.options.app) {
        $(lt.global).off('hashchange', this.hashChange);
        $(lt.global).on('hashchange', this.hashChange);
      }
      this.applyLobbyElements();
      $('main.lobby').observer()
        .on('.lobby__app-pools',this.applyLobbyElements);
    }
  }
  LiChessTools.Tools.MainPageElements = MainPageElementsTool;
})();
