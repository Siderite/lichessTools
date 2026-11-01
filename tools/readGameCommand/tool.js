(() => {
  class ReadGameCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'CliCommands'];

    preferences = [
      {
        name: 'readGameCommand',
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
        'options.readGameCommand': 'Command: read game moves from here',
        'readGameCommand.helpText': '/readgame [speed] [voice] [instrument]\r\n default speed = ' + this.defaultSpeed + ', voice=0, instrument=0\r\n Esc to stop\r\nRead game moves from here'
      },
      'ro-RO': {
        'options.readGameCommand': 'Comand\u0103: cite\u015fte mut\u0103rile jocului de aici',
        'readGameCommand.helpText': '/readgame [vitez\u0103] [voce] [instrument]\r\n viteza standard = ' + this.defaultSpeed + ', voce=0, instrument=0\r\n Esc pentru stop\r\nCite\u015Fte mut\u0103rile de aici'
      }
    };

    instruments = [null, 'celesta', 'clav'];
    readGame = async (speed, voiceIndex, instrument) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      if (!this.options.enabled) return;

      speed = +speed || 0;
      instrument = this.instruments[+instrument];

      this.reading = true;
      let node = analysis.node;
      let path = analysis.path;
      while (this.reading && node) {
        analysis.userJump(path);
        lt.analysisRedraw();
        const san = node.san||'';
        const comments = lt.getNodeCommentsText(node)||'';
        const text = lt.getSpeakableText(san+(comments?' '+comments:''),{
          readAnnotations: true, glyphs: node.glyphs,
          isCheck: san.endsWith('+'), isMate: san.endsWith('#'),
          dotDecimalWord: true, periodsToCommas: true, fileAid: true,
          pieceColors: false, briefMateWord: true, castlePhrase: false, glyphsAfter: true, glyphsAfterMove: true
        });
        const evl = lt.getNodeCeval(node);
        if (instrument && evl) {
          const side = analysis.getOrientation() == 'black' ? -1 : 1;
          const cp = LiChessTools.ChessMetrics.getCentipawnOnlyValue(evl);
          const q = 24 / (1 + Math.exp(-0.004 * cp * side));
          const sndIndex = parseInt(q).toString().padStart(3, '0');
          lt.play('instrument/' + instrument + '/c' + sndIndex + '.mp3', 0.05);
        }
        await lt.speak(text, { rate: speed ? speed / 100 : 0, voiceIndex: voiceIndex });
        if (node != analysis.node) {
          this.reading = false;
        }
        node = node.children?.at(0);
        path += node?.id;
      }
    };

    keyHandler = ev => {
      const lt = this.lichessTools;
      if (ev.key == 'Escape') {
        this.reading = false;
        lt.stopSpeaking();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('readGameCommand');
      this.options = { enabled: value };
      this.logOption('Command - read game', value);
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      if (!analysis) return;
      $.cached('body').off('keyup', this.keyHandler);
      if (value) {
        $.cached('body').on('keyup', this.keyHandler);
        lt.registerCommand && lt.registerCommand('readGameCommand', {
          handle: (val) => {
            const m = /^\s*readgame(?:\s+(?<speed>\d+))?(?:\s+(?<voice>\d+))?(?:\s+(?<instrument>\d+))?/.exec(val);
            if (!m) return;
            const speed = (+m.groups.speed) || this.defaultSpeed;
            const voice = m.groups.voice === undefined ? undefined : (+m.groups.voice) || 0;
            const instrument = (+m.groups.instrument) || 0;
            lt.global.setTimeout(() => this.readGame(speed, voice, instrument), 100);
            return true;
          },
          getHelp: () => trans.noarg('readGameCommand.helpText')
        });
        if (lt.location.hash == '#readgame') {
          lt.global.history.replaceState(null, null, ' ');
          analysis.jumpToIndex();
          this.readGame(this.defaultSpeed, 0, 0);
        }
      } else {
        lt.unregisterCommand && lt.unregisterCommand('readGameCommand');
      }
    }
  }
  LiChessTools.Tools.ReadGameCommand = ReadGameCommandTool;
})();
