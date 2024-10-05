(() => {
  class ProfileTimelineTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'profileTimeline',
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
      const parent = this.lichessTools;
      const userId = parent.getUserId()
      if (!userId) return false;
      return parent.global.location.pathname.toLowerCase().startsWith('/@/'+userId.toLowerCase());
    };

    loadTimeline = async ()=>{
      const parent = this.lichessTools;
      const $ = parent.$;
      const lichess = parent.lichess;
      const html = await parent.net.fetch('/timeline');
      if (!html) return;
      $('div.angles a[data-tab]').removeClass('active');
      $('div.angles a[data-tab="timeline"]').addClass('active');
      lichess.asset.loadCssPath('bits.slist');
      $('div.angle-content')
        .empty()
        .append($(html).find('table.slist'));
    };

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const trans = parent.translator;
      const value = parent.currentOptions.getValue('profileTimeline');
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
