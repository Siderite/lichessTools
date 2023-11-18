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

    defaultSpeed=2000;

    intl={
      'en-US':{
        'options.readGameCommand': 'Command: read game moves from here',
        'readGameCommand.helpText': '/readgame [speed]\r\n default speed = '+this.defaultSpeed+'\r\n Esc to stop\r\nRead game moves from here'
      },
      'ro-RO':{
        'options.readGameCommand': 'Comand\u0103: arat\u0103 valoare capcan\u0103 pentru pozi\u0163ie',
        'readGameCommand.helpText': '/readgame [vitez\u0103]\r\n viteza standard = '+this.defaultSpeed+'\r\n Esc pentru stop\r\nCite\u015Fte mut\u0103rile de aici'
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
      const m=/^(?<piece>[NBRQK])?(?<start>[a-h])?([1-8])?(?<takes>x)?(?<end>[a-h][1-8])(=(?<promotion>[NBRQK]))?((?<check>\+)|(?<mate>#))?$|(?<castles>^O-O(?<long>-O)?)$/.exec(node.san);
      let text='';
      if (m.groups.piece) {
        text+=this.pieces[m.groups.piece]+' ';
      }
      text+=m.groups.start||'';
      if (m.groups.takes) {
        text+=' takes ';
      }
      text+=m.groups.end||'';
      if (m.groups.promotion) {
        text+=' promotes to '+this.pieces[m.groups.promotion];
      }
      if (m.groups.check) {
        text+=' check ';
      }
      if (m.groups.mate) {
        text+=' mate ';
      }
      if (m.groups.castles) {
        text+=' castles ';
        if (m.groups.long) {
          text+=' long ';
        }
      }
      const glyph=node.glyphs?.at(0)?.symbol;
      const glyphText=this.glyphs[glyph];
      const commentText=parent.getNodeCommentsText(node)||'';
      if (glyphText && !commentText.toLowerCase().includes(glyphText.toLowerCase())) {
        text+=' '+glyphText+' ';
      }
      text+=commentText;
      return text?.replaceAll('.',',');
    };

    getDuration=(text)=>{
      let duration=0;
      if (!text) return duration;
      duration=text.length/8+text.split(/\s+/).length;
      return duration/4;
    };

    readGame = async (speed)=>{
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
      if (node.id=='') {
        node=node.children?.at(0);
        path+=node?.id;
      }
      while (this.reading && node) {
        analysis.userJump(path);
        analysis.redraw();
        const text=this.getReadText(node);
        const duration=Math.max(1,this.getDuration(text))*speed;
        lichess.sound.say(text,false,true);
        await parent.timeout(duration);
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
            const m=/^\s*readgame(?:\s+(\d+))?/.exec(val);
            if (!m) return;
            const speed=(+m[1])||this.defaultSpeed;
            parent.global.setTimeout(()=>this.readGame(speed),100);
            return true;
          },
          getHelp:()=>trans.noarg('readGameCommand.helpText')
        });
      }
    }
  }
  LiChessTools.Tools.ReadGameCommand=ReadGameCommandTool;
})();
