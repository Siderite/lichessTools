(()=>{
  class ReadGameCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','CliCommands'];

    preferences=[
      {
        name:'readGameCommand',
        category: 'command',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    defaultSpeed=100;

    intl={
      'en-US':{
        'options.readGameCommand': 'Command: read game moves from here',
        'readGameCommand.helpText': '/readgame [speed] [voice]\r\n default speed = '+this.defaultSpeed+', voice=0\r\n Esc to stop\r\nRead game moves from here'
      },
      'ro-RO':{
        'options.readGameCommand': 'Comand\u0103: arat\u0103 valoare capcan\u0103 pentru pozi\u0163ie',
        'readGameCommand.helpText': '/readgame [vitez\u0103] [voce]\r\n viteza standard = '+this.defaultSpeed+', voce=0\r\n Esc pentru stop\r\nCite\u015Fte mut\u0103rile de aici'
      }
    };

    pieces={
      'N':'knight',
      'B':'bishop',
      'R':'rook',
      'Q':'queen',
      'K':'king'
    };

    glyphs={
      '!':'good move',
      '?':'mistake',
      '!!':'brilliant',
      '??':'blunder',
      '!?':'interesting',
      '?!':'inaccuracy'
    };

    getReadText = (node)=>{
      const parent=this.lichessTools;
      let text=node.san||'';
      const glyph=node.glyphs?.at(0)?.symbol;
      const glyphText=this.glyphs[glyph];
      let commentText=parent.getNodeCommentsText(node)||'';
      if (glyphText && !commentText.toLowerCase().includes(glyphText.toLowerCase())) {
        text+=' '+glyphText;
      }
      if (commentText) {
        commentText=commentText.replace(/\b(\d+)\.(\d+)/g,'$1point$2');
        text+=', '+commentText;
      }
      text=text.replace(/[\r\n\.]+/g,',');
      const r=/(?:\b(?<piece>[NBRQK])?(?<start>[a-h])?(?:[1-8])?(?<takes>x)?(?<end>[a-h][1-8])(?:=(?<promotion>[NBRQK]))?|\b(?<castles>^O-O(?<long>-O)?))(?:(?<check>\+)|(?<mate>#))?/g;
      const pieces=this.pieces;
      text=text.replace(r,function (...args) {
        const groups=args.at(-1);
        let t='';
        if (groups.piece) {
          t+=pieces[groups.piece]+' ';
        }
        t+=(groups.start||'').replace(/\ba(\d+)/g,'a-$1');
        if (groups.takes) {
          t+=' takes ';
        }
        t+=(groups.end||'').replace(/\ba(\d+)/g,'a-$1');
        if (groups.promotion) {
          t+=' promotes to '+pieces[groups.promotion];
        }
        if (groups.check) {
          t+=' check ';
        }
        if (groups.mate) {
          t+=' mate ';
        }
        if (groups.castles) {
          t+=' castles ';
          if (groups.long) {
            t+=' long ';
          }
        }
        return t;
      });
      return text;
    };

    readGame = async (speed,voiceIndex)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      if (!this.options.enabled) return;

      this.reading=true;
      let node=analysis.node;
      let path=analysis.path;
      while (this.reading && node) {
        analysis.userJump(path);
        analysis.redraw();
        const text=this.getReadText(node);
        speed=+speed||0;
        await parent.speak(text, { rate : speed?100/speed:0, voiceIndex:voiceIndex });
        if (node!=analysis.node) {
          this.reading=false;
        }
        node=node.children?.at(0);
        path+=node?.id;
      }
    };

    keyHandler=ev=>{
      if (ev.key=='Escape') {
        this.reading=false;
      }
    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const value=parent.currentOptions.getValue('readGameCommand');
      this.options={ enabled:value };
      this.logOption('Command - read game', value);
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      parent.unregisterCommand('readGameCommand');
      $('body').off('keyup',this.keyHandler);
      if (value) {
        $('body').on('keyup',this.keyHandler);
        parent.registerCommand('readGameCommand',{
          handle:(val)=>{
            const m=/^\s*readgame(?:\s+(?<speed>\d+))?(?:\s+(?<voice>\d+))?/.exec(val);
            if (!m) return;
            const speed=(+m.groups.speed)||this.defaultSpeed;
            const voice=m.groups.voice===undefined?undefined:(+m.groups.voice)||0;
            parent.global.setTimeout(()=>this.readGame(speed,voice),100);
            return true;
          },
          getHelp:()=>trans.noarg('readGameCommand.helpText')
        });
      }
    }
  }
  LiChessTools.Tools.ReadGameCommand=ReadGameCommandTool;
})();
