(() => {
  class PlayerExtraButtonsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitContentLoaded'];

    preferences = [
      {
        name: 'playerExtraButtons',
        category: 'general',
        type: 'multiple',
        possibleValues: ['report'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.playerExtraButtons': 'Player tooltip buttons',
        'playerExtraButtons.report': 'Report and block'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.playerExtraButtons': 'Butoane tooltip juc\u0103tori',
        'playerExtraButtons.report': 'Raporteaz\u0103 \u105fi blocheaz\u0103'
      }
    }

    addButtons = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (this.options.report) {
        const tvButton = $('#powerTip .upt__actions a.btn-rack__btn[href$="/tv"]');
        if (tvButton.length) {
          const container = tvButton.closest('.upt__actions');
          const el = $('a.playerExtraButtons-report',container);
          if (!el.length) {
            const m = /@\/(?<userId>[^\/]+)\/tv/.exec(tvButton.attr('href'));
            const userId = m.groups.userId;
            $('<a class="btn-rack__btn playerExtraButtons-report">')
              .attr('data-icon',lt.icon.CautionTriangle)
              .attr('target','_blank')
              .attr('title',trans.noarg('playerExtraButtons.report'))
              .attr('href','/report?username='+encodeURIComponent(userId))
              .insertBefore(tvButton);
          }
        }
        const reportButton = $('main.report div.form-actions button[type=submit]');
        if (reportButton.length) {
          const container = reportButton.closest('.form-actions');
          const el = $('button.playerExtraButtons-report',container);
          if (!el.length) {
            const userId = $('input[name=username]').val();
            if (userId) {
              $('<button type="button" class="submit button button-red text playerExtraButtons-report">')
                .attr('data-icon',lt.icon.CautionTriangle)
                .text(trans.noarg('playerExtraButtons.report'))
                .on('click',async (ev)=>{
                  ev.preventDefault();
                  await lt.api.relations.blockPlayer(userId);
                  reportButton.closest('form')[0].submit();
                })
                .insertBefore(reportButton);
            }
          }
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const value = lt.currentOptions.getValue('playerExtraButtons');
      this.logOption('Player extra buttons', value);
      this.options = {
        report: lt.isOptionSet(value, 'report')
      };
      lt.pubsub.off('content-loaded',this.addButtons);
      if (this.options.report) {
        lt.pubsub.on('content-loaded',this.addButtons);
        this.addButtons();
      }
    }
  }
  LiChessTools.Tools.PlayerExtraButtons = PlayerExtraButtonsTool;
})();
