(() => {
  class ProfilePuzzleTabTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'profilePuzzleTab',
        category: 'puzzles',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.puzzles': 'Puzzles',
        'options.profilePuzzleTab': 'Puzzle performance chart in Profile',
        'puzzleTabTitle': 'LiChess Tools - Puzzle Stats',
        'puzzleTabText': 'Puzzle Stats',
        'dashboard.total': 'Total',
        'dashboard.puzzleCount': 'Puzzles',
        'dashboard.performance': 'Performance',
        'dashboard.replay': 'To replay'
      },
      'ro-RO': {
        'options.puzzles': 'Probleme de \u015Fah',
        'options.profilePuzzleTab': 'Grafic de performan\u0163\u0103 la probleme de \u015Fah \u00een Profil',
        'puzzleTabTitle': 'LiChess Tools - Statistici probleme de \u015Fah',
        'puzzleTabText': 'Statistici probleme \u015Fah',
        'dashboard.total': 'Total',
        'dashboard.puzzleCount': 'Probleme \u015fah',
        'dashboard.performance': 'Performan\u0163\u0103',
        'dashboard.replay': 'De rejucat'
      }
    }

    getUserFromUrl = (url) => {
      const m = /\/@\/([^\/]+)/.exec(url);
      return m && m[1];
    }

    isPuzzleTabPage = ()=>{
      const lt = this.lichessTools;
      const userId = lt.getUserId();
      return lt.global.location.pathname.toLowerCase().startsWith('/@/'+userId.toLowerCase()+'/perf/puzzle');
    };

    enhancePuzzleTabPage = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      if ($('section.lichessTools-profilePuzzleTab').length) return;
      const container = $('.perf-stat__content');
      while (!container.length) {
        await lt.timeout(100);
      }
      $('<section class="lichessTools-profilePuzzleTab">')
        .appendTo(container)
      const uiSlider = $('#time-range-slider')[0]?.noUiSlider;
      uiSlider.on('update.lichessTools', this.updateData);
      this.uiSlider = uiSlider;
      this.updateData();
    };

    updateDataDirect = async (sort)=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const htmlEncode = lt.htmlEncode;
      const trans = lt.translator;
      const [currentStart, currentEnd] = this.uiSlider.get().map(x => parseInt(x));
      const { min: rangeStart, max: rangeEnd } = this.uiSlider.options.range;
      const section = $('section.lichessTools-profilePuzzleTab');
      if (currentEnd < rangeEnd) {
        section
          .removeAttr('data-days')
          .empty();
        return;
      }
      const days = Math.ceil((Date.now()-currentStart)/86400000);
      if (section.attr('data-days')==days && !sort) {
        return;
      }
      const data = await lt.api.puzzle.getDashboard(days);
      if (!data) {
        await this.updateData(sort);
        return;
      }
      const table =$('<table><thead></thead><tbody></tbody></table>');
      let html = '<tr><th></th><th class="puzzleCount nr">$trans(dashboard.puzzleCount)</th><th class="performance nr">$trans(dashboard.performance)</th><th class="replay nr">$trans(dashboard.replay)</th></tr>';
      html = html.replace(/\$trans\(([^\),]+?)(?:\s*,\s*([^\)]+?))?\)/g, function (m, name, value) {
        return htmlEncode(value ? trans.pluralSame(name, value) : trans.noarg(name));
      });
      table.find('thead').append(html);
      let replay = data.global.nb - data.global.firstWins - data.global.replayWins;
      let winperc = data.global.nb ? Math.floor(100 * data.global.firstWins/data.global.nb) : 0;
      let repperc = data.global.nb ? Math.floor(100 * data.global.replayWins/data.global.nb) : 0;
      html = '<tr><th><a href="/training"><img src="'+lichess.asset.url('images/puzzle-themes/mix.svg')+'"/>$trans(dashboard.total)</a></th><td class="perc nr" title="'+data.global.firstWins+'+'+data.global.replayWins+'" style="--win:'+winperc+'%;--rep:'+repperc+'%;">'+data.global.nb+'</td><td class="nr">'+data.global.performance+'</td><td class="nr"><a href="/training/replay/'+days+'/mix">'+replay+'</a></td>';
      for (const theme in data.themes) {
        const r = data.themes[theme].results;
        r.replay = r.nb - r.firstWins - r.replayWins;
        r.winperc = r.nb ? Math.floor(100 * r.firstWins/r.nb) : 0;
        r.repperc = r.nb ? Math.floor(100 * r.replayWins/r.nb) : 0;
      }
      const themeKeys = Object.keys(data.themes);
      themeKeys.sort((t1,t2)=>{
        const v1=data.themes[t1]?.results?.[this.sortColumn];
        const v2=data.themes[t2]?.results?.[this.sortColumn];
        return (v1-v2)*this.sortDirection;
      });
      for (const theme of themeKeys) {
        const d = data.themes[theme];
        const r = d.results;
        const perf = r.performance > data.global.performance ? 'good' : r.performance < data.global.performance ? 'bad' : '';
        html += '<tr><th><a href="/training/'+theme+'"><img src="'+lichess.asset.url('images/puzzle-themes/'+theme+'.svg')+'"/>'+htmlEncode(d.theme)+'</a></th><td class="perc nr" title="'+r.firstWins+'+'+r.replayWins+'" style="--win:'+r.winperc+'%;--rep:'+r.repperc+'%;">'+r.nb+'</td><td class="nr '+perf+'">'+r.performance+'</td><td class="nr"><a href="/training/replay/'+days+'/'+theme+'">'+r.replay+'</a></td>';
      }
      html = html.replace(/\$trans\(([^\),]+?)(?:\s*,\s*([^\)]+?))?\)/g, function (m, name, value) {
        return htmlEncode(value ? trans.pluralSame(name, value) : trans.noarg(name));
      });
      table.find('tbody').append(html);
      table.find('th.puzzleCount')
        .on('click',(ev)=>{
          ev.preventDefault();
          this.sortTable('nb');
        });
      table.find('th.performance')
        .on('click',(ev)=>{
          ev.preventDefault();
          this.sortTable('performance');
        });
      table.find('th.replay')
        .on('click',(ev)=>{
          ev.preventDefault();
          this.sortTable('replay');
        });
      section
        .attr('data-days',days)
        .empty()
        .append($('<div>')
          .append(table));
    };
    updateData = this.lichessTools.debounce(this.updateDataDirect,500);

    sortDirection = -1;
    sortColumn = 'nb';
    sortTable = (column) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (this.sortColumn == column) {
        this.sortDirection = -this.sortDirection;
      } else {
        this.sortDirection = -1;
        this.sortColumn = column;
      }
      this.updateDataDirect(true);
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('profilePuzzleTab');
      this.options = { enabled: value };
      this.logOption('Puzzle perf tab', value);
      const userId = lt.getUserId();
      if (!userId) return;

      if (value) {
        const group = $('#topnav section a[href="/training"]+div[role="group"]');
        if (!$('a.lichessTools-profilePuzzleTab', group).length) {
          $('<a class="lichessTools-profilePuzzleTab">')
            .attr('href', '/@/' + userId + '/perf/puzzle')
            .text(trans.noarg('puzzleTabText'))
            .attr('title', trans.noarg('puzzleTabTitle'))
            .insertBefore($('a[href="/streak"]', group));
        }
        if (this.isPuzzleTabPage()) {
          this.enhancePuzzleTabPage();
        }
        const container = $('div.sub-ratings');
        if (container.length && !$('a.lichessTools-profilePuzzleTab', container).length) {
          const existing = $('a[href^="/training/dashboard"]', container);
          if (existing.length) {
            existing
              .clone()
              .attr('href', '/@/' + userId + '/perf/puzzle')
              .attr('title', trans.noarg('puzzleTabTitle'))
              .attr('data-icon', '\uE051')
              .addClass('lichessTools-profilePuzzleTab')
              .insertBefore($('hr', container).eq(0));
            existing.removeClass('active');
          }
        }
      } else {
        $('.lichessTools-profilePuzzleTab').remove();
        this.uiSlider?.off('.lichessTools');
      }
    }

  }
  LiChessTools.Tools.ProfilePuzzleTab = ProfilePuzzleTabTool;
})();
