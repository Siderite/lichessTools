(() => {
  class ProfilePuzzleTabTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'profilePuzzleTab',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.profilePuzzleTab': 'Puzzle performance chart in Profile',
        'puzzleTabTitle': 'LiChess Tools - Puzzle Stats',
        'puzzleTabText': 'Puzzle Stats',
        'dashboard.total': 'Total',
        'dashboard.puzzleCount': 'Puzzles',
        'dashboard.performance': 'Performance',
        'dashboard.replay': 'To replay'
      },
      'ro-RO': {
        'options.general': 'General',
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
      const parent = this.lichessTools;
      const userId = parent.getUserId();
      return parent.global.location.pathname.toLowerCase().startsWith('/@/'+userId.toLowerCase()+'/perf/puzzle');
    };

    enhancePuzzleTabPage = async ()=>{
      const parent = this.lichessTools;
      const $ = parent.$;
      if ($('section.lichessTools-profilePuzzleTab').length) return;
      $('<section class="lichessTools-profilePuzzleTab">')
        .appendTo('.perf-stat__content')
      const uiSlider = $('#time-range-slider')[0]?.noUiSlider;
      uiSlider.on('update.lichessTools', this.updateData);
      this.uiSlider = uiSlider;
      this.updateData();
    };

    updateDataDirect = async ()=>{
      const parent = this.lichessTools;
      const $ = parent.$;
      const htmlEncode = parent.htmlEncode;
      const trans = parent.translator;
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
      if (section.attr('data-days')==days) {
        return;
      }
      section
        .attr('data-days',days)
        .empty();
      const data = await parent.api.puzzle.getDashboard(days);
      if (!data) return;
      const table =$('<table><thead></thead><tbody></tbody></table>');
      $('<div>')
        .append(table)
        .appendTo(section);
      let html = '<tr><th></th><th class="nr">$trans(dashboard.puzzleCount)</th><th class="nr">$trans(dashboard.performance)</th><th class="nr">$trans(dashboard.replay)</th></tr>';
      html = html.replace(/\$trans\(([^\),]+?)(?:\s*,\s*([^\)]+?))?\)/g, function (m, name, value) {
        return htmlEncode(value ? trans.pluralSame(name, value) : trans.noarg(name));
      });
      table.find('thead').append(html);
      let replay = data.global.nb - data.global.firstWins - data.global.replayWins;
      let winperc = data.global.nb ? Math.floor(100 * data.global.firstWins/data.global.nb) : 0;
      let repperc = data.global.nb ? Math.floor(100 * data.global.replayWins/data.global.nb) : 0;
      html = '<tr><th><a href="/training">$trans(dashboard.total)</a></th><td class="perc nr" title="'+data.global.firstWins+'+'+data.global.replayWins+'" style="--win:'+winperc+'%;--rep:'+repperc+'%;">'+data.global.nb+'</td><td class="nr">'+data.global.performance+'</td><td class="nr"><a href="/training/replay/'+days+'/mix">'+replay+'</a></td>';
      for (const theme in data.themes) {
        const d = data.themes[theme];
        replay = d.results.nb - d.results.firstWins - d.results.replayWins;
        winperc = d.results.nb ? Math.floor(100 * d.results.firstWins/d.results.nb) : 0;
        repperc = d.results.nb ? Math.floor(100 * d.results.replayWins/d.results.nb) : 0;
        const perf = d.results.performance > data.global.performance ? 'good' : d.results.performance < data.global.performance ? 'bad' : '';
        html += '<tr><th><a href="/training/'+theme+'">'+htmlEncode(d.theme)+'</a></th><td class="perc nr" title="'+d.results.firstWins+'+'+d.results.replayWins+'" style="--win:'+winperc+'%;--rep:'+repperc+'%;">'+d.results.nb+'</td><td class="nr '+perf+'">'+d.results.performance+'</td><td class="nr"><a href="/training/replay/'+days+'/'+theme+'">'+replay+'</a></td>';
      }
      html = html.replace(/\$trans\(([^\),]+?)(?:\s*,\s*([^\)]+?))?\)/g, function (m, name, value) {
        return htmlEncode(value ? trans.pluralSame(name, value) : trans.noarg(name));
      });
      table.find('tbody').append(html);
    };
    updateData = this.lichessTools.debounce(this.updateDataDirect,500);

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const trans = parent.translator;
      const value = parent.currentOptions.getValue('profilePuzzleTab');
      this.options = { enabled: value };
      this.logOption('Puzzle perf tab', value);
      const userId = parent.getUserId();
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
