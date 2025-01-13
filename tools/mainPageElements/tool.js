(() => {
  class MainPageElementsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties'];

    preferences = [
      {
        name: 'mainPageElements',
        category: 'general',
        type: 'multiple',
        possibleValues: ['side', 'side_streams', 'side_spotlights', 'side_timeline', 'app', 'table', 'tv', 'blog', 'puzzle', 'support', 'feed', 'tours', 'about'],
        defaultValue: 'side,app,table,tv,blog,puzzle,support,feed,tours,about,side_streams,side_spotlights,side_timeline',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
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
        'mainPageElements.side_timeline': 'Side:timeline'
      },
      'ro-RO': {
        'options.general': 'General',
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
        'mainPageElements.side_spotlights': 'Side:prim-plan',
        'mainPageElements.side_timeline': 'Side:activitate recent\u0103'
      }
    }

    hashChange = () => {
      const lt = this.lichessTools;
      lt.global.location.reload();
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('mainPageElements');
      this.logOption('Lobby page elements', value);
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      this.options = {
        get side() {
          return lt.isOptionSet(value, 'side')
                   ? this.side_streams || this.side_spotlights || this.side_timeline
                   : false;
        },
        side_streams: lt.isOptionSet(value, 'side_streams'),
        side_spotlights: lt.isOptionSet(value, 'side_spotlights'),
        side_timeline: lt.isOptionSet(value, 'side_timeline'),
        app: lt.isOptionSet(value, 'app'),
        table: lt.isOptionSet(value, 'table'),
        tv: lt.isOptionSet(value, 'tv'),
        blog: lt.isOptionSet(value, 'blog'),
        puzzle: lt.isOptionSet(value, 'puzzle'),
        support: lt.isOptionSet(value, 'support'),
        feed: lt.isOptionSet(value, 'feed'),
        tours: lt.isOptionSet(value, 'tours'),
        about: lt.isOptionSet(value, 'about'),
        get allSet() {
          return this.side && this.app && this.table && this.tv && this.blog &&
            this.puzzle && this.support && this.feed && this.tours && this.about;
        },
        get noneSet() {
          return !this.side && !this.app && !this.table && !this.tv && !this.blog &&
            !this.puzzle && !this.support && !this.feed && !this.tours && !this.about;
        }
      };
      if (this.options.allSet || this.options.noneSet) {
        if (this.initialGrid) {
          $('main')
            .removeClass('lichessTools-lobbyPlay')
            .css('grid-template-areas', '');
          $('main').find('.lobby__side,.lobby__timeline,.lobby__app,main .lobby__table,.lobby__tv,.lobby__blog,.lobby__puzzle,.lobby__support,' +
            '.lobby__feed,.lobby__tournaments-simuls,.lobby__about').removeClass('lichessTools-hideElement');
        }
        return;
      }
      let isPlay = false;
      if (!this.options.app) {
        if (!$('body').is('.mobile')) {
          $('#topnav > section:first-child > a').attr('href', '/#play');
        }
        isPlay = lt.global.location.hash == '#play';
      } else {
        $('#topnav > section:first-child > a').attr('href', '/');
      }
      if (!$('main').is('.lobby')) return;
      if (!this.options.app) {
        $(lt.global).off('hashchange', this.hashChange);
        $(lt.global).on('hashchange', this.hashChange);
      }
      if (!this.initialGrid) {
        this.initialGrid = $('main').css('grid-template-areas');
      }
      $('main').toggleClass('lichessTools-lobbyPlay', isPlay);
      if (isPlay) {
        lt.global.document.title = $('#topnav > section:first-child span.play').text() + ' ' + lt.icon.BulletPoint + ' ' + lt.global.location.hostname;
      } else {
        const grid = this.initialGrid.replace(/[a-z]+/g, t => {
          const ft = t === 'timeline' ? 'side' : t;
          const res = this.options[ft]
            ? t
            : '.'.padEnd(t.length, ' ');
          return res;
        });
        $('main').css('grid-template-areas', grid);
        $('main .lobby__side').toggleClass('lichessTools-hideElement', !this.options.side);
        $('main .lobby__streams').toggleClass('lichessTools-hideElement', !this.options.side || !this.options.side_streams);
        $('main .lobby__spotlights').toggleClass('lichessTools-hideElement', !this.options.side || !this.options.side_spotlights);
        $('main .lobby__timeline').toggleClass('lichessTools-hideElement', !this.options.side || !this.options.side_timeline);
        $('main .lobby__app').toggleClass('lichessTools-hideElement', !this.options.app);
        $('main .lobby__table').toggleClass('lichessTools-hideElement', !this.options.table);
        $('main .lobby__tv').toggleClass('lichessTools-hideElement', !this.options.tv);
        $('main .lobby__blog').toggleClass('lichessTools-hideElement', !this.options.blog);
        $('main .lobby__puzzle').toggleClass('lichessTools-hideElement', !this.options.puzzle);
        $('main .lobby__support').toggleClass('lichessTools-hideElement', !this.options.support);
        $('main .lobby__feed').toggleClass('lichessTools-hideElement', !this.options.feed);
        $('main .lobby__tournaments-simuls').toggleClass('lichessTools-hideElement', !this.options.tours);
        $('main .lobby__about').toggleClass('lichessTools-hideElement', !this.options.about);
      }
    }
  }
  LiChessTools.Tools.MainPageElements = MainPageElementsTool;
})();
