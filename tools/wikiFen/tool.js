(() => {
  class WikiFenTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [{
        name: 'wikiFen',
        category: 'analysis2',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis2': 'Analysis - minor',
        'options.wikiFen': 'Wiki pages based on FEN'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.wikiFen': 'Pagini wiki din FEN'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('wikiFen');
      this.logOption('Wiki by FEN', value);
      this.options = {
        enabled: value
      };
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      if (!analysis?.wiki)
        return;
      analysis.wiki = lt.unwrapFunction(analysis.wiki, 'wikiFen');
      if (value) {
        analysis.wiki = lt.wrapFunction(analysis.wiki, {
          id: 'wikiFen',
          before: ($this, nodes) => {
            if (!this.options.enabled)
              return;
            if (!this.wikiUrls_dict) {
              lt.comm.getData('wikiUrls.json').then(dict => {
                if (!dict) {
                  lt.global.console.warn('Could not load pawn wiki URLs!');
                  return;
                }
                this.wikiUrls_dict = dict;
                analysis.wiki(nodes);
              });
              return false;
            }
            const plyPrefix = (node) => `${lt.global.Math.floor((node.ply + 1) / 2)}${node.ply % 2 === 1 ? '._' : '...'}`;
            const pathParts = nodes.slice(1).map(n => `${plyPrefix(n)}${n.san}`);
            const path = pathParts.join('/').replace(/[+!#?]/g, '') || '';
            if (pathParts.length > 30 || !path || path.length > 255 - 21)
              return;
            const title = `Chess_Opening_Theory/${path}`;
            const fen = lt.getPositionFromFen(analysis.node.fen);
            const newTitles = this.wikiUrls_dict[fen];
            if (!newTitles?.length || newTitles.find(t => t.replaceAll(' ', '_') == title))
              return;
            const originalFunction = analysis.wiki.__originalFunction?.bind($this);
            if (!originalFunction)
              return;
            const newTitle = newTitles[0];
            const newNodes = [{
                ply: 0,
                san: ''
              }
            ];
            const r = /\/\d+\.+[\s_]*([^\s_\/]+)/g;
            let m = r.exec(newTitle);
            let ply = 1;
            while (m) {
              newNodes.push({
                ply: ply,
                san: m[1]
              });
              ply++;
              m = r.exec(newTitle);
            }
            originalFunction(newNodes);
            return false;
          }
        });
      }
      analysis.wiki(analysis.nodeList);
    }

  }
  LiChessTools.Tools.WikiFen = WikiFenTool;
})();
