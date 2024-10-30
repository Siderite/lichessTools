(() => {
  class MayTenthTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'mayTenth',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.mayTenth': 'LiChess Tools day!',
        'mayTenthTitle': 'Happy LiChess Tools day!'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.mayTenth': 'Ziua LiChess Tools!',
        'mayTenthTitle': 'La mul\u0163i ani, LiChess Tools!'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('mayTenth');
      this.logOption('LT day', value);
      $.cached('body').removeClass('lichessTools-mayTenth');
      $('a.site-title,#topnav section a:has(span.home)').removeAttr('title');
      if (!value) return;
      const isMayTenth = new Date().toISOString().includes('-05-10');
      $.cached('body')
        .toggleClass('lichessTools-mayTenth', isMayTenth);
      if (isMayTenth) {
        $('a.site-title,#topnav section a:has(span.home)')
          .attr('title', trans.noarg('mayTenthTitle'));
      }
    }
  }
  LiChessTools.Tools.MayTenth = MayTenthTool;
})();
