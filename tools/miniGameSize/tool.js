(() => {
  class MiniGameSizeTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'miniGameSize',
        category: 'general',
        type: 'number',
        defaultValue: undefined,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.miniGameSize': 'Custom mini-game size'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.miniGameSize': 'Dimensiune mini joc'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const value = +(parent.currentOptions.getValue('miniGameSize'));
      this.logOption('Mini-game size', value || 'Not set');
      $.cached('body').toggleClass('lichessTools-miniGameSize', !!value);
      if (value) {
        $.cached('body')[0].style.setProperty('--lichessToolsMiniGameSize', value + 'rem');
      }
    }

  }
  LiChessTools.Tools.MiniGameSize = MiniGameSizeTool;
})();
