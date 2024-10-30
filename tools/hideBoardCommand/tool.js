(() => {
  class HideBoardCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['CliCommands'];

    preferences = [
      {
        name: 'hideBoardCommand',
        category: 'command',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true,
        offValue: false
      }
    ];

    intl = {
      'en-US': {
        'options.hideBoardCommand': 'Command: show/hide board',
        'hideBoardCommand.helpText': '/board\r\nShow/Hide board'
      },
      'ro-RO': {
        'options.hideBoardCommand': 'Comand\u0103: arat\u0103/ascunde tabla',
        'hideBoardCommand.helpText': '/board\r\nArat\u0103/Ascunde tabla'
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('hideBoardCommand');
      this.logOption('Command - hide board', value);
      if (value && lichess.analysis) {
        lt.registerCommand && lt.registerCommand('hideBoardCommand', {
          handle: (val) => {
            if (val == 'board') {
              $.cached('body').toggleClass('lichessTools-hideBoard');
              return true;
            }
          },
          getHelp: () => trans.noarg('hideBoardCommand.helpText')
        });
      } else {
        lt.unregisterCommand && lt.unregisterCommand('hideBoardCommand');
      }
    }
  }
  LiChessTools.Tools.HideBoardCommand = HideBoardCommandTool;
})();
