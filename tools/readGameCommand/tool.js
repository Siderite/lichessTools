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

    pieces = {
      'N': 'knight',
      'B': 'bishop',
      'R': 'rook',
      'Q': 'queen',
      'K': 'king'
    };

    glyphs = {
      '!': 'good move',
      '?': 'mistake',
      '!!': 'brilliant',
      '??': 'blunder',
      '!?': 'interesting',
      '?!': 'inaccuracy'
    };

    getReadText = (node) => {
      const lt = this.lichessTools;
      let text = node.san || '';
      const glyph = node.glyphs?.at(0)?.symbol;
      const glyphText = this.glyphs[glyph];
      let commentText = lt.getNodeCommentsText(node) || '';
      if (glyphText && !commentText.toLowerCase().includes(glyphText.toLowerCase())) {
        text += ', ' + glyphText;
      }
      if (commentText) {
        commentText = commentText.replace(/\b(\d+)\.(\d+)/g, '$1point$2');
        text += ', ' + commentText;
      }
      text = text.replace(/[\r\n\.]+/g, ',');
      const r = /(?:\b(?<piece>[NBRQK])?(?<start>[a-h])?(?:[1-8])?(?<takes>x)?(?<end>[a-h][1-8])(?:=(?<promotion>[NBRQK]))?|\b(?<castles>^O-O(?<long>-O)?))(?:(?<check>\+)|(?<mate>#))?/g;
      const pieces = this.pieces;
      text = text.replace(r, function (...args) {
        const groups = args.at(-1);
        let t = '';
        if (groups.piece) {
          t += pieces[groups.piece] + ' ';
        }
        t += (groups.start || '').replace(/\ba/g, 'a-');
        if (groups.takes) {
          t += ' takes ';
        }
        t += (groups.end || '').replace(/\ba/g, 'a-');
        if (groups.promotion) {
          t += ' promotes to ' + pieces[groups.promotion];
        }
        if (groups.check) {
          t += ' check ';
        }
        if (groups.mate) {
          t += ' mate ';
        }
        if (groups.castles) {
          t += ' castles ';
          if (groups.long) {
            t += ' long ';
          }
        }
        return t;
      });
      return text;
    };

    instruments = [null, 'celesta', 'clav'];
    readGame = async (speed, voiceIndex, instrument) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
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
        analysis.redraw();
        const text = this.getReadText(node);
        const evl = node.eval || node.ceval;
        if (instrument && evl) {
          const side = analysis.getOrientation() == 'black' ? -1 : 1;
          const cp = lt.getCentipawns(evl);
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
      if (ev.key == 'Escape') {
        this.reading = false;
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
        if (lt.global.location.hash == '#readgame') {
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
