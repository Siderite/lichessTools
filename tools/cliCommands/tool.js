(()=>{
  class CliCommandsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['InterceptEventHandlers'];

    preferences=[
      {
        name:'cliCommands',
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
        'options.cliCommands': 'CLI commands'
      },
      'ro-RO':{
        'options.cliCommands': 'Comenzi CLI'
      }
    };

    executeCommand=(val)=>{
      for (const key in this.commands) {
        const command=this.commands[key];
        if (command.handle(val)) return true;
      }
    };

    keydown=(ev)=>{
      if (ev.code == 'Enter') {
        const val=ev.target.value?.trim();
        if (!val) return;
        if (val.startsWith('/')) {
           const result=this.executeCommand(val.substr(1));
           if (result) {
             ev.target.blur();
             return;
           }
        }
      }
      return this.oldkeydown(ev);
    };

    retries=0;

    boot=async ()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const input=$('#clinput input')[0];
      if (!input) {
        parent.global.console.warn('Could not find element ',input);
        return;
      }
      $(input).off('keydown',this.keydown);
      if (!this.oldkeydown) {
        const focusin=parent.getEventHandlers(input,'focusin')[0];
        if (!focusin) {
          if (this.retries>5) {
            parent.global.console.warn('Could not get focusin event for ',input);
            return;
          }
          this.retries++;
          parent.global.setTimeout(this.boot,500);
          return;
        }
        this.oldkeydown=parent.getEventHandlers(input,'keydown')[0];
        if (!this.oldkeydown) {
          $(input).trigger('focus');
          if (this.retries>5) {
            parent.global.console.warn('Could not get keydown event for ',input);
            return;
          }
          this.retries++;
          parent.global.setTimeout(this.boot,500);
          return;
        }
        $(input).trigger('blur');
        parent.removeEventHandlers(input,'keydown');
      } else {
        $(input).off('keydown',this.oldkeydown);
      }
      if (this.options.enabled) {
        $(input).on('keydown',this.keydown);
      } else {
        $(input).on('keydown',this.oldkeydown);
      }
    };

    commands={};

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const value=parent.currentOptions.getValue('cliCommands');
      this.logOption('CLI commands', value);
      this.options={ enabled:value };
      this.boot();
      parent.registerCommand=(key,command)=>{
        this.commands[key]=command;
      };
    }
  }
  LiChessTools.Tools.CliCommands=CliCommandsTool;
})();
