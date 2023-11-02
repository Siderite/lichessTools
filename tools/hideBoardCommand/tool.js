(()=>{
  class HideBoardCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies=['HideBoardCommand'];

    preferences=[
      {
        name:'hideBoardCommand',
        category: 'command',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        'options.hideBoardCommand': 'Command: show/hide board',
        'hideBoardCommand.helpText': '/board\r\nShow/Hide board'
      },
      'ro-RO':{
        'options.hideBoardCommand': 'Comand\u0103: arat\u0103/ascunde tabla',
        'hideBoardCommand.helpText': '/board\r\nArat\u0103/Ascunde tabla'
      }
    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const value=parent.currentOptions.getValue('hideBoardCommand');
      this.logOption('Command - hide board', value);
      if (value) {
        parent.registerCommand('hideBoardCommand',{
          handle:(val)=>{
            if (val=='board') {
              $('body').toggleClass('lichessTools-hideBoard');
              return true;
            }
          },
          getHelp:()=>trans.noarg('hideBoardCommand.helpText')
        });
      } else {
        parent.unregisterCommand('hideBoardCommand');
      }
    }
  }
  LiChessTools.Tools.HideBoardCommand=HideBoardCommandTool;
})();
