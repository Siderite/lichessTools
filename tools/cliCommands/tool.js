(()=>{
  class CliCommandsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['InterceptEventHandlers'];

    preferences=[
      {
        name:'cliCommands',
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
        'options.cliCommands': 'CLI commands',
        'options.command': 'Commands'
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

    updateHelp=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const container=$('dialog div.clinput-help>div');
      if (!container.length) {
        parent.global.setTimeout(this.updateHelp,100);
        return;
      }
      const beforeElem=$('h3',container).eq(1);
      for (const key in this.commands) {
        const command=this.commands[key];
        const helpText=command?.getHelp();
        if (!helpText) continue;

        const lines=helpText.split(/[\r\n]+/);
        const lineDiv=$('<div>');
        for (const line of lines.slice(0,-1)) {
          const spaces=/^\s*/.exec(line)[0].length;
          lineDiv.append($('<p>').html('&nbsp;'.repeat(spaces)+parent.htmlEncode(line)));
        }
        $('<div class="command">')
          .attr('data-key',key)
          .attr('title','LiChess Tools')
          .append(lineDiv)
          .append($('<span>').text(lines.at(-1)))
          .insertBefore(beforeElem);
      }
    };

    keydown=(ev)=>{
      let help=false;
      if ([ev.code,ev.key].includes('Escape')||ev.which==27) {
        ev.target.blur();
        return;
      }
      if ([ev.code,ev.key].includes('Enter')||ev.which==13) {
        let val=ev.target.value?.trim();
        if (!val) return;
        if (val=='/?') {
          ev.target.value=(val='/help');
        }
        if (val==='/help') help=true;
        if (val.startsWith('/')) {
           const result=this.executeCommand(val.substr(1));
           if (result) {
             ev.target.blur();
             return;
           }
        }
      }
      const result = this.oldkeydown(ev);
      if (help) {
        this.updateHelp();
      }
      return result;
    };

    retries=0;
    maxRetries=10;

    boot=async ()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const input=$('#clinput input')[0];
      if (!input) {
        parent.global.console.warn('Could not find element ',input);
        return;
      }
      $(input).off('keydown',this.keydown);
      if (this.options.enabled && !this.oldkeydown) {
        const focusin=parent.getEventHandlers(input,'focusin')[0];
        if (!focusin) {
          if (this.retries>this.maxRetries) {
            parent.global.console.warn('Could not get focusin event for ',input);
            return;
          }
          this.retries++;
          parent.global.setTimeout(this.boot,100);
          return;
        }
        this.oldkeydown=parent.getEventHandlers(input,'keydown')[0];
        if (!this.oldkeydown) {
          $(input).trigger('focus');
          $('body').removeClass('clinput');
          if (this.retries>this.maxRetries) {
            parent.global.console.warn('Could not get keydown event for ',input);
            return;
          }
          this.retries++;
          parent.global.setTimeout(this.boot,100);
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
        if (this.oldkeydown) {
          $(input).on('keydown',this.oldkeydown);
        }
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
      if (value) {
        parent.registerCommand=(key,command)=>{
          this.commands[key]=command;
        };
        parent.unregisterCommand=(key)=>{
          delete this.commands[key];
        };
      } else {
        parent.registerCommand=null;
        parent.unregisterCommand=null;
      }
    }
  }
  LiChessTools.Tools.CliCommands=CliCommandsTool;
})();
