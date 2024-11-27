(() => {
  class ShowDeviationTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitContentLoaded'];

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
      const lt = this.lichessTools;
      switch(ch) {
        case lt.icon.UltraBullet: return 'ultraBullet';
        case lt.icon.Bullet: return 'bullet';
        case lt.icon.FireBlitz: return 'blitz';
        case lt.icon.Rabbit: return 'rapid';
        case lt.icon.Turtle: return 'classical';
        case lt.icon.PaperAirplane: return 'correspondence';
        case lt.icon.DieSix: return 'chess960';
        default: return null;
      }
    };

    addDeviation = async (el)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!$(el).children().first().is('.upt__info')) return;
      const url = $('.upt__info__top .user-link',el).attr('href');
      const m = /^\/@\/(?<userId>[^\/]+)/.exec(url||'');
      if (!m) return;
      const userId = m.groups.userId.toLowerCase();
      const data = await lt.api.user.getUsers([userId]);
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
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const value = lt.currentOptions.getValue('showDeviation');
      this.logOption('Show deviation', value);
      lt.pubsub.off('content-loaded',this.addDeviation);
      if (!value) return;
      lt.pubsub.on('content-loaded',this.addDeviation);
    }
  }
  LiChessTools.Tools.ShowDeviation = ShowDeviationTool;
})();
