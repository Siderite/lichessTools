(()=>{
  class TrapValueCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','CliCommands'];

    preferences=[
      {
        name:'trapValueCommand',
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
        'options.trapValueCommand': 'Command: show trap value for position',
        'trapValueCommand.helpText': '/trapvalue\r\nShow trap value for position',
        'noExplorerMoves': 'No explorer data available',
        'trapValueCommand.valueText': 'Trap value: %s'
      },
      'ro-RO':{
        'options.trapValueCommand': 'Comand\u0103: arat\u0103 valoare capcan\u0103 pentru pozi\u0163ie',
        'trapValueCommand.helpText': '/trapvalue\r\nArat\u0103 valoare capcan\u0103 pentru pozi\u0163ie',
        'noExplorerMoves': 'Nu exist\u0103 date \u00een Explorator',
        'trapValueCommand.valueText': 'Valoare capcan\u0103: %s'
      }
    };

    explorerItem=(node,value)=>{
      if (!node) return;
      const parent=this.lichessTools;
      const components=[
        'explorer.speed',
        'analyse.explorer.player.name',
        'analyse.explorer.rating',
        'analyse.explorer.since-2.masters',
        'explorer.db2.standard',
        'analyse.explorer.since-2.lichess',
        'analyse.explorer.until-2.lichess'
      ];
      const key=parent.hash(components.map(k=>parent.lichess.storage.get(k)||'').join('|'));
      let explorerItems=node.explorerItems;
      if (!explorerItems) {
        explorerItems={};
        node.explorerItems=explorerItems;
      }
      if (value===undefined) return explorerItems[key];
      explorerItems[key]=value;
    };

    showTrapValue=async (initialPath)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      if (!analysis) return;
      const orientation=analysis.getOrientation();
      const explorer=analysis.explorer;
      if (!explorer?.allowed) return;
      if (!explorer.enabled()) {
        explorer.enabled(true);
        analysis.redraw();
      }
      if (initialPath===undefined) {
        initialPath=analysis.path;
      } else {
        if (initialPath!=analysis.path) {
          analysis.setPath(initialPath);
        }
      }
      let explorerItem=this.explorerItem(analysis.node);
      if (!explorerItem) {
        await explorer.setNode();
        while(explorer.loading()) {
          await parent.timeout(10);
        }
        explorerItem=explorer.current();
        this.explorerItem(analysis.node,explorerItem||null);
      }
      const total=explorerItem.white+explorerItem.draws+explorerItem.black;
      if (!total) {
        parent.announce(trans.noarg('noExplorerMoves'));
        return;
      }
      const potency=(orientation!='black'?explorerItem.white:explorerItem.black)/total;
      const nodes=analysis.tree.getNodeList(initialPath);
      let probability=1;
      let count=0;
      let prevTotal=0;
      for (const node of nodes) {
        explorerItem=this.explorerItem(node);
        while (!explorerItem) {
          const path=initialPath.substr(0,node.ply*2);
          analysis.setPath(path);
          await explorer.setNode();
          while(explorer.loading()) {
            await parent.timeout(10);
          }
          explorerItem=explorer.current();
          this.explorerItem(node,explorerItem||null);
        }
        const isOpponentMove=node.ply%2===(orientation=='black'?1:0);
        const total=explorerItem.white+explorerItem.draws+explorerItem.black;
        if (node.ply&&isOpponentMove&&prevTotal) {
          probability*=total/prevTotal;
          count++;
        }
        prevTotal=total;
      }
      if (count>1) {
        probability=Math.pow(probability,1/count);
      }
      const probabilityScore=Math.round(probability*100);
      const potencyScore=Math.round(potency*100);
      const trapScore=Math.round(probability*potency*100);
      const text=trapScore?trans.pluralSame('trapValueCommand.valueText',probabilityScore+'% x '+potencyScore+'% = '+trapScore+'%'):'?';
      parent.announce(text);
      analysis.setPath(initialPath);
      analysis.redraw();
    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const value=parent.currentOptions.getValue('trapValueCommand');
      this.options={ enabled:value };
      this.logOption('Command - trap value', value);
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      const explorer=analysis?.explorer;
      if (!explorer) return;
      parent.unregisterCommand('trapValueCommand');
      if (value) {
        parent.registerCommand('trapValueCommand',{
          handle:(val)=>{
            if (val=='trapvalue') {
              this.showTrapValue();
              return true;
            }
          },
          getHelp:()=>trans.noarg('trapValueCommand.helpText')
        });
      }
    }
  }
  LiChessTools.Tools.TrapValueCommand=TrapValueCommandTool;
})();
