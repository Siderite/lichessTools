(() => {
  class ShowDeviationTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'showDeviation',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.showDeviation': 'Show player score deviation'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.showDeviation': 'Arat\u0103 devierea de scor la juc\u0103tori'
      }
    }

    getPerfKey = (ch)=>{
      switch(ch) {
        case '\uE06E': return 'ultraBullet';
        case '\uE047': return 'bullet';
        case '\uE01D': return 'blitz';
        case '\uE017': return 'rapid';
        case '\uE01F': return 'classical';
        case '\uE02E': return 'correspondence';
        case '\uE047': return 'chess960';
        default: return null;
      }
    };

    addDeviation = async (el)=>{
      const parent = this.lichessTools;
      const $ = parent.$;
      if (!$(el).children().first().is('.upt__info')) return;
      const url = $('.upt__info__top .user-link',el).attr('href');
      const m = /^\/@\/(?<userId>[^\/]+)/.exec(url||'');
      if (!m) return;
      const userId = m.groups.userId.toLowerCase();
      const data = await parent.api.user.getUsers([userId]);
      const user = data[0];
      if (!user) return;
      const ratings = $('.upt__info__ratings>span',el);
      if (!ratings.length) return;
      ratings.each((i,e)=>{
        if (!/\d+/.test($(e).text())) return;
        const key = this.getPerfKey($(e).attr('data-icon'));
        if (!key) return;
        const perf = user.perfs[key];
        if (!perf) return;
        $('.lichessTools-showDeviation',e).remove();
        const deviation = $('<span class="lichessTools-showDeviation">')
          .text('\u00B1'+perf.rd)
          .appendTo(e);
        if (perf.prog) {
          deviation.addClass(perf.prog>0?'good':'bad');
        }
      });
    };

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const lichess = parent.lichess;
      const value = parent.currentOptions.getValue('showDeviation');
      this.logOption('Show deviation', value);
      lichess.pubsub.off('content-loaded',this.addDeviation);
      if (!value) return;
      lichess.pubsub.on('content-loaded',this.addDeviation);
    }
  }
  LiChessTools.Tools.ShowDeviation = ShowDeviationTool;
})();
