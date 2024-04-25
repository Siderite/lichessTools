(()=>{
  class ProfilePuzzleTabTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'profilePuzzleTab',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.profilePuzzleTab': 'Puzzle peformance chart in Profile',
        'puzzleTabTitle': 'LiChess Tools - Puzzles'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.profilePuzzleTab': 'Grafic de performan\u0163\u0103 la probleme de \u015Fah \u00een Profil',
        'puzzleTabTitle': 'LiChess Tools - Probleme de \u015Fah'
      }
    }

    getUserFromUrl=(url)=>{
      const m=/\/@\/([^\/]+)/.exec(url);
      return m&&m[1];
    }

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const value=parent.currentOptions.getValue('profilePuzzleTab');
      this.options = { enabled: value };
      this.logOption('Puzzle perf tab', value);
      const container=$('div.sub-ratings');
      if (!container.length) return;
      const userId=this.getUserFromUrl(parent.global.location.pathname);
      if (!userId) return;
      
      const tab=$('a.lichessTools-profilePuzzleTab',container);
      if (value) {
        if (!tab.length) {
          const existing=$('a[href^="/training/dashboard"]',container);
          existing
            .clone()
            .attr('href','/@/'+userId+'/perf/puzzle')
            .attr('title',trans.noarg('puzzleTabTitle'))
            .addClass('lichessTools-profilePuzzleTab')
            .insertBefore($('hr',container).eq(0));
          existing.removeClass('active');
        }
      } else {
        tab.remove();
      }
    }

  }
  LiChessTools.Tools.ProfilePuzzleTab=ProfilePuzzleTabTool;
})();
