(() => {
  class MayTenthTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'mayTenth',
        category: 'general',
        type: 'single',
        possibleValues: ['mayTenth','never','always'],
        defaultValue: 'mayTenth',
        offValue: 'never',
        advanced: true
      }
    ];

    upgrades = [
      { name:'mayTenth', value:'mayTenth', version: '2.4.202', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.mayTenth': 'LiChess Tools day!',
        'mayTenthTitle': 'Happy LiChess Tools day!',
        'mayTenth.mayTenth': 'On May 10th',
        'mayTenth.never': 'Never',
        'mayTenth.always': 'Always'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.mayTenth': 'Ziua LiChess Tools!',
        'mayTenthTitle': 'La mul\u0163i ani, LiChess Tools!',
        'mayTenth.mayTenth': 'Pe 10 mai',
        'mayTenth.never': 'Niciodat\u0103',
        'mayTenth.always': 'Totdeauna'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('mayTenth');
      this.logOption('LT day', value);
      this.options = {
        mayTenth: lt.isOptionSet(value,'mayTenth'),
        never: lt.isOptionSet(value,'never'),
        always: lt.isOptionSet(value,'always'),
      };
      const isMayTenth = !this.options.never && new Date().toISOString().includes('-05-10');
      $.cached('body')
        .toggleClass('lichessTools-mayTenth', isMayTenth || this.options.always);
      if (isMayTenth) {
        $('a.site-title,#topnav section a:has(span.home)')
          .attr('title', isMayTenth ? trans.noarg('mayTenthTitle') : null);
      }
    }
  }
  LiChessTools.Tools.MayTenth = MayTenthTool;
})();
