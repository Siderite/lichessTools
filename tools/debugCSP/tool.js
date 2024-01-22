(()=>{
  class DebugCSPTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'debugCSP',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        'options.debugCSP': 'Debug CSP'
      },
      'ro-RO':{
        'options.debugCSP': 'Debug CSP'
      }
    }

    secCheck=e=>{
      this.lichessTools.global.console.debug('CSP error for '+e.blockedUri,e);
    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const value=parent.currentOptions.getValue('debugCSP');
      this.logOption('Debug CSP', value);
      const document=parent.global.document;
      $(document).off('securitypolicyviolation',this.secCheck)
      if (!value) return;
      $(document).on('securitypolicyviolation',this.secCheck)
    }
  }
  LiChessTools.Tools.DebugCSP=DebugCSPTool;
})();
