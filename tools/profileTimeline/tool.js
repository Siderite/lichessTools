(() => {
  class ProfileTimelineTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'profileTimeline',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.profileTimeline': 'Timeline in Profile',
        'timelineText':'Timeline',
        'timelineTitle':'Timeline tab - LiChess Tools'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.profileTimeline': 'Activitate recent\u0103 \u00een Profil',
        'timelineText':'Activitate recent\u0103',
        'timelineTitle':'Tab activitate recent\u0103 - LiChess Tools'
      }
    }

    isMyProfilePage=()=>{
      const lt = this.lichessTools;
      const userId = lt.getUserId()
      if (!userId) return false;
      return lt.global.location.pathname.toLowerCase().startsWith('/@/'+userId.toLowerCase());
    };

    loadTimeline = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const html = await lt.net.fetch('/timeline');
      if (!html) return;
      $('div.angles a[data-tab]').removeClass('active');
      $('div.angles a[data-tab="timeline"]').addClass('active');
      lichess.asset.loadCssPath('bits.slist');
      $('div.angle-content')
        .empty()
        .append($(html).find('table.slist'));
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('profileTimeline');
      this.options = { enabled: value };
      this.logOption('Profile timeline', value);
      if (!this.isMyProfilePage()) return;
      const tabs=$('div.angles');
      if (!tabs.length) return;
      let tab=$('a[data-tab="timeline"]',tabs);
      if (this.options.enabled && !tab.length) {
        tab=$('<a data-tab="timeline" class="nm-item lichessTools-profileTimeline">')
          .attr('title',trans.noarg('timelineTitle'))
          .text(trans.noarg('timelineText'))
          .attr('href','/timeline?nb=30')
          .on('click',ev=>{
             ev.preventDefault();
             ev.stopPropagation();
             this.loadTimeline();
          })
          .appendTo(tabs);
      } else {
        tab.remove();
      }
    }

  }
  LiChessTools.Tools.ProfileTimeline = ProfileTimelineTool;
})();
