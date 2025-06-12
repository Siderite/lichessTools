(() => {
  class ReadPositionCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['CliCommands'];

    preferences = [
      {
        name: 'readPositionCommand',
        category: 'command',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true,
        offValue: false
      }
    ];

    defaultSpeed = 100;

    intl = {
      'en-US': {
        'options.readPositionCommand': 'Command: read position to set up a board',
        'readPositionCommand.helpText': '/readposition [speed] [voice]\r\n default speed = ' + this.defaultSpeed + ', voice=0\r\n Esc to stop, Space to pause\r\nRead position'
      },
      'ro-RO': {
        'options.readPositionCommand': 'Comand\u0103: cite\u015fte pozit\u0163ia pentru a aranja tabla',
        'readPositionCommand.helpText': '/readposition [vitez\u0103] [voce]\r\n viteza standard = ' + this.defaultSpeed + ', voce=0\r\n Esc pentru stop, Space pentru pauz\u0103\r\nCite\u015Fte pozi\u0163ia'
      }
    };

    pieces = {
      'N': 'knight',
      'B': 'bishop',
      'R': 'rook',
      'Q': 'queen',
      'K': 'king',
      'P': 'pawn'
    };

    readPosition = async (speed, voiceIndex, instrument) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      if (!this.options.enabled) return;

      speed = +speed || 100;

      const node = analysis.node;
      const board = lt.getBoardFromFen(node.fen);

      this.reading = true;
      for (const color of ['white','black']) {
        for (const p of ['K','Q','R','B','N','P']) {
          const piece = color=='white'? p : p.toLowerCase();
          for (let i = 0; i<8; i++) {
            for (let j = 0; j<8; j++) {
              if (node != analysis.node) {
                this.reading = false;
                this.paused = false;
              }
              if (!this.reading) return;
              const ch = board[j][i];
              if (ch != piece) continue;
              await lt.speak(color+' '+this.pieces[p], { rate: speed ? speed / 100 : 0, voiceIndex: voiceIndex });
              await lt.timeout(50000 / speed);
              await lt.speak(String.fromCharCode(65+i)+'-'+String.fromCharCode(56-j), { rate: speed ? speed / 100 : 0, voiceIndex: voiceIndex });
              await lt.timeout(200000 / speed);
              while (this.paused) {
                await lt.timeout(500);
              }
            }
          }
        }
      }
      
    };

    keyHandler = ev => {
      if (ev.key == 'Escape' && this.reading) {
        this.reading = false;
        this.paused = false;
        ev.preventDefault();
      }
      if (ev.key == ' ' && this.reading) {
        this.paused = !this.paused;
        ev.preventDefault();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('readPositionCommand');
      this.options = { enabled: value };
      this.logOption('Command - read position', value);
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      $.cached('body').off('keydown', this.keyHandler);
      if (value) {
        $.cached('body').on('keydown', this.keyHandler);
        lt.registerCommand && lt.registerCommand('readPositionCommand', {
          handle: (val) => {
            const m = /^\s*readposition(?:\s+(?<speed>\d+))?(?:\s+(?<voice>\d+))?(?:\s+(?<instrument>\d+))?/.exec(val);
            if (!m) return;
            const speed = (+m.groups.speed) || this.defaultSpeed;
            const voice = m.groups.voice === undefined ? undefined : (+m.groups.voice) || 0;
            const instrument = (+m.groups.instrument) || 0;
            lt.global.setTimeout(() => this.readPosition(speed, voice, instrument), 100);
            return true;
          },
          getHelp: () => trans.noarg('readPositionCommand.helpText')
        });
      } else {
        lt.unregisterCommand && lt.unregisterCommand('readPositionCommand');
      }
    }
  }
  LiChessTools.Tools.ReadPositionCommand = ReadPositionCommandTool;
})();
