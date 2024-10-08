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
      }
    ];

    intl = {
      'en-US': {
        'options.cliCommands': 'CLI commands',
        'options.command': 'Commands'
      },
      'ro-RO': {
        'options.cliCommands': 'Comenzi CLI'
      }
    };

    executeCommand = (val) => {
      for (const key in this.commands) {
        const command = this.commands[key];
        if (command.handle(val)) return true;
      }
    };

    updateHelp = async () => {
      const parent = this.lichessTools;
      const $ = parent.$;
      let container = $('dialog div.clinput-help>div');
      let k=0;
      while (!container.length) {
        await parent.timeout(100);
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
          lineDiv.append($('<p>').html('&nbsp;'.repeat(spaces) + parent.htmlEncode(line)));
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
      const parent = this.lichessTools;
      const $ = parent.$;
      const input = $('#clinput input');
      if (!input.length) {
        parent.global.console.warn('Could not find element ', input);
        return;
      }
      input.off('keydown', this.keydown);
      if (this.options.enabled) {
        input.on('keydown', this.keydown);
      }
    };

    removeCommandFunctions = () => {
      const parent = this.lichessTools;
      if (this.options.enabled) return;
      if (Object.keys(this.commands).length) {
        parent.global.setTimeout(this.removeCommandFunctions, 100);
        return;
      }
      parent.registerCommand = null;
      parent.unregisterCommand = null;
    };

    commands = {};

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      const value = parent.currentOptions.getValue('cliCommands');
      this.logOption('CLI commands', value);
      this.options = { enabled: value };
      this.boot();
      if (value) {
        parent.registerCommand = (key, command) => {
          this.commands[key] = command;
        };
        parent.unregisterCommand = (key) => {
          delete this.commands[key];
        };
      } else {
        this.removeCommandFunctions();
      }
    }
  }
  LiChessTools.Tools.CliCommands = CliCommandsTool;
})();
