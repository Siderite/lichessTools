(() => {
  class CliCommandsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'cliCommands',
        category: 'command',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true,
        offValue: false
      },
      {
        name: 'cliCommandsOptions',
        category: 'command',
        type: 'multiple',
        possibleValues: ['disableMouseOver'],
        defaultValue: false,
        advanced: true
      }

    ];

    intl = {
      'en-US': {
        'options.cliCommands': 'CLI commands',
        'options.cliCommandsOptions': 'CLI commands options',
        'cliCommandsOptions.disableMouseOver': 'Disable mouse over',
        'options.command': 'Commands'
      },
      'ro-RO': {
        'options.cliCommands': 'Comenzi CLI',
        'options.cliCommandsOptions': 'Op\u0163iuni comenzi CLI',
        'cliCommandsOptions.disableMouseOver': 'Dezactiveaz\u0103 mouse over',
        'options.command': 'Comenzi'
      }
    };

    executeCommand = (val) => {
      for (const key in this.commands) {
        const command = this.commands[key];
        if (command.handle(val)) return true;
      }
    };

    updateHelp = async () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      let container = $('dialog div.clinput-help>div');
      let k=0;
      while (!container.length) {
        await lt.timeout(100);
        container = $('dialog div.clinput-help>div');
        k++;
        if (k>20) return;
      }
      const beforeElem = $('h3', container).eq(1);
      for (const key in this.commands) {
        const command = this.commands[key];
        const helpText = command?.getHelp();
        if (!helpText) continue;

        const lines = helpText.split(/[\r\n]+/);
        const lineDiv = $('<div>');
        for (const line of lines.slice(0, -1)) {
          const spaces = /^\s*/.exec(line)[0].length;
          lineDiv.append($('<p>').html('&nbsp;'.repeat(spaces) + lt.htmlEncode(line)));
        }
        $('<div class="command">')
          .attr('data-key', key)
          .attr('title', 'LiChess Tools')
          .append(lineDiv)
          .append($('<span>').text(lines.at(-1)))
          .insertBefore(beforeElem);
      }
    };

    keydown = (ev) => {
      let help = false;
      if ([ev.code, ev.key].includes('Escape') || ev.which == 27) {
        ev.target.blur();
        ev.preventDefault();
        ev.stopPropagation();
        return;
      }
      if ([ev.code, ev.key].includes('Enter') || ev.which == 13) {
        let val = ev.target.value?.trim();
        if (!val) return;
        if (val == '/?') {
          ev.target.value = (val = '/help');
        }
        if (val === '/help') help = true;
        if (val.startsWith('/')) {
          const result = this.executeCommand(val.substr(1));
          if (result) {
            ev.target.blur();
            ev.preventDefault();
            ev.stopPropagation();
            return;
          }
        }
      }
      if (help) {
        this.updateHelp();
      }
    };

    retries = 0;
    maxRetries = 10;

    boot = async () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const input = $('#clinput input');
      if (!input.length) {
        lt.global.console.warn('Could not find element ', input);
        return;
      }
      input.off('keydown', this.keydown);
      if (this.options.enabled) {
        input.on('keydown', this.keydown);
      }
    };

    removeCommandFunctions = () => {
      const lt = this.lichessTools;
      if (this.options.enabled) return;
      if (Object.keys(this.commands).length) {
        lt.global.setTimeout(this.removeCommandFunctions, 100);
        return;
      }
      lt.registerCommand = null;
      lt.unregisterCommand = null;
    };

    handleCliEvents = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const elem = $('#clinput')[0];
      if (!elem || elem.__blockMouseOver) return;
      elem.__blockMouseOver = true;
      elem.addEventListener('mouseover',(ev) => this.options.disableMouseOver && ev.stopPropagation(),{ capture: true });
    };

    commands = {};

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('cliCommands');
      const optionsValue = lt.currentOptions.getValue('cliCommandsOptions');
      this.logOption('CLI commands', value);
      this.logOption('CLI commands options', optionsValue);
      this.options = { 
        enabled: !!value,
        disableMouseOver: value && lt.isOptionSet(optionsValue, 'disableMouseOver')
      };
      this.boot();
      if (this.options.enabled) {
        lt.registerCommand = (key, command) => {
          this.commands[key] = command;
        };
        lt.unregisterCommand = (key) => {
          delete this.commands[key];
        };
      } else {
        this.removeCommandFunctions();
      }
      this.handleCliEvents();
    }
  }
  LiChessTools.Tools.CliCommands = CliCommandsTool;
})();
