(() => {
  class RipDanyaTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'ripDanya',
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
        'options.ripDanya': 'RIP Daniel Naroditsky',
        'ripDanyaTitle': 'Rest in peace, Daniel Naroditsky, you will be missed!'
      },
      'ro-RO': {
        'options.general': 'General'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('ripDanya');
      this.logOption('RIP Danya', value);
      $.cached('body').removeClass('lichessTools-ripDanya');
      $('#user_tag').removeAttr('title','');

      if (!value) return;
      const isRipDanya = /2025-10-2\d+/.test(new Date().toISOString());
      $.cached('body')
        .toggleClass('lichessTools-ripDanya', isRipDanya);
      $('#user_tag').attr('title',trans.noarg('ripDanyaTitle'));
    }
  }
  LiChessTools.Tools.RipDanya = RipDanyaTool;
})();
