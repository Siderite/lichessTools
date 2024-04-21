(()=>{
  class WikiFenTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'wikiFen',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.wikiFen': 'Wiki pages based on FEN'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.wikiFen': 'Pagini wiki din FEN'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('wikiFen');
      this.logOption('Wiki by FEN', value);
      this.options={ enabled: value };
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      if (!analysis?.wiki) return;
      analysis.wiki=parent.unwrapFunction(analysis.wiki,'wikiFen');
      if (!value) return;
      analysis.wiki=parent.wrapFunction(analysis.wiki,{
        id:'wikiFen',
        before:($this,nodes)=>{
          if (!this.options.enabled) return;
          const plyPrefix = (node) => `${parent.global.Math.floor((node.ply + 1) / 2)}${node.ply % 2 === 1 ? '._' : '...'}`;
          const pathParts = nodes.slice(1).map(n => `${plyPrefix(n)}${n.san}`);
          const path = pathParts.join('/').replace(/[+!#?]/g, '') ?? '';
          if (pathParts.length > 30 || !path || path.length > 255 - 21) return;
          const title = `Chess_Opening_Theory/${path}`;
          const fen=analysis.node.fen.split(' ').slice(0,2).join('').replaceAll('/','');
          const newTitles=parent.wikiUrls_dict[fen];
          if (!newTitles?.length || newTitles.find(t=>t.replaceAll(' ','_')==title)) return;
          const originalFunction=analysis.wiki.__originalFunction?.bind($this);
          if (!originalFunction) return;
          const newTitle=newTitles[0];
          const newNodes=[{ply:0,san:''}];
          const r=/\/\d+\.+[\s_]*([^\s_\/]+)/g;
          let m=r.exec(newTitle);
          let ply=1;
          while(m) {
            newNodes.push({
              ply:ply,
              san:m[1]
            });
            ply++;
            m=r.exec(newTitle);
          }
          originalFunction(newNodes);
          return false;
        }
      });
    }

  }
  LiChessTools.Tools.WikiFen=WikiFenTool;
})();
