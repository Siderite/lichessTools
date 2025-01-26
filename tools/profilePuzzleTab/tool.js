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
        'dashboard.replay': 'To replay',
        'daysStatsText': 'The last %s days',
        'puzzleRatingWeekText': 'Puzzle rating gain: %s',
        'streaksWeekText': 'Puzzle streaks: %s',
        'maxStreakWeekText': 'Max streak length: %s'
      },
      'ro-RO': {
        'options.puzzles': 'Probleme de \u015Fah',
        'options.profilePuzzleTab': 'Grafic de performan\u0163\u0103 la probleme de \u015Fah \u00een Profil',
        'puzzleTabTitle': 'LiChess Tools - Statistici probleme de \u015Fah',
        'puzzleTabText': 'Statistici probleme \u015Fah',
        'dashboard.total': 'Total',
        'dashboard.puzzleCount': 'Probleme \u015fah',
        'dashboard.performance': 'Performan\u0163\u0103',
        'dashboard.replay': 'De rejucat',
        'daysStatsText': '\u00CEn ultimele %s zile',
        'puzzleRatingWeekText': 'C\u00e2\u015ftig \u00een probleme de \u015fah: %s',
        'streaksWeekText': 'Serii de probleme \u015fah: %s',
        'maxStreakWeekText': 'Seria cea mai lung\u0103: %s'
      }
    }

    isPuzzleDashboardPage = ()=>{
      const lt = this.lichessTools;
      return /^\/training\/dashboard\/\d+\/dashboard/i.test(lt.global.location.pathname);
    };

    enhancePuzzleDashboardPage = async ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const asset = lichess.asset;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('.puzzle-dashboard__global');
      while (!container.length) {
        await lt.timeout(100);
      }

      const userId = lt.getUserId();
      const data = await lt.api.user.getRatingHistory(userId);
      const puzzles = data.find(i=>i.name=='Puzzles');
      const m = /^\/training\/dashboard\/(?<days>\d+)\/dashboard/i.exec(lt.global.location.pathname);
      const days = +m.groups.days;
      let afterEl = '.puzzle-dashboard__radar';
      if (days && puzzles) {
        const date = new Date();
        date.setDate(date.getDate()-days);
        lt.arrayRemoveAll(puzzles.points,p=>{
          return new Date(p[0],p[1],p[2])<date;
        });
        afterEl = $('<div class="chart-container"><canvas class="rating-history"></div>').insertAfter(afterEl);
        asset.loadEsm('chart.ratingHistory',{ 
          init: {
            data: data,
            singlePerfName: 'Puzzles'
          }
        });
      }
      const activity = await lt.api.user.getActivity(userId);
      if (activity?.length) {
        activity.reverse();
        const stats = {};
        for (const item of activity) {
          if (!stats.ratingStart && item.puzzles?.score?.rp?.before) {
            stats.ratingStart = +item.puzzles.score.rp.before;
          }
          if (item.puzzles?.score?.rp?.after) {
            stats.ratingEnd = +item.puzzles.score.rp.after;
          }
          if (item.streak) {
            stats.streaks = (stats.streaks || 0) + (+item.streak.runs);
            stats.maxStreak = stats.maxStreak 
                                ? Math.max(stats.maxStreak, +item.streak.score) 
                                : +item.streak.score;
          }
        }
        if ((stats.ratingStart && stats.ratingEnd)||(stats.streaks && stats.maxStreak)) {
          const text = trans.pluralSame('daysStatsText',activity.length);
          afterEl = $('<label class="lichessTools-profilePuzzleTab header">')
            .text(text)
            .insertAfter(afterEl);
        }
        if (stats.ratingStart && stats.ratingEnd) {
          const text = trans.pluralSame('puzzleRatingWeekText', stats.ratingEnd-stats.ratingStart);
          afterEl = $('<label class="lichessTools-profilePuzzleTab">')
            .text(text)
            .insertAfter(afterEl);
        }
        if (stats.streaks && stats.maxStreak) {
          const text = trans.pluralSame('streaksWeekText', stats.streaks)+' '+trans.pluralSame('maxStreakWeekText', stats.maxStreak);
          afterEl = $('<label class="lichessTools-profilePuzzleTab">')
            .text(text)
            .insertAfter(afterEl);
        }
      }

      $('<section class="lichessTools-profilePuzzleTab">')
       .insertAfter(afterEl);
      this.updateData();
    };

    updateDataDirect = async (sort)=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const htmlEncode = lt.htmlEncode;
      const trans = lt.translator;
      let currentStart, currentEnd, rangeStart, rangeEnd, days;
      if (this.uiSlider) {
        [currentStart, currentEnd] = this.uiSlider.get().map(x => parseInt(x));
        const range = this.uiSlider.options.range;
        rangeStart = range.min;
        rangeEnd = range.max;
        days = Math.ceil((Date.now()-currentStart)/86400000);
      } else {
        const m = /^\/training\/dashboard\/(?<days>\d+)\/dashboard/i.exec(lt.global.location.pathname);
        days = +m.groups.days;
        currentEnd = Date.now();
        currentStart = currentEnd - days*86400000;
        rangeStart = currentStart;
        rangeEnd = currentEnd;
      }
      const section = $('section.lichessTools-profilePuzzleTab');
      if (currentEnd < rangeEnd) {
        section
          .removeAttr('data-days')
          .empty();
        return;
      }
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
        if (this.isPuzzleDashboardPage()) {
          this.enhancePuzzleDashboardPage();
        }
      } else {
        $('.lichessTools-profilePuzzleTab').remove();
        this.uiSlider?.off('.lichessTools');
      }
    }

  }
  LiChessTools.Tools.ProfilePuzzleTab = ProfilePuzzleTabTool;
})();
