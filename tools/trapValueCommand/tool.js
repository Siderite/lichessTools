(() => {
  class TrapValueCommandTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'CliCommands'];

    preferences = [
      {
        name: 'trapValueCommand',
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
        'options.trapValueCommand': 'Command: show trap value for position',
        'trapValueCommand.helpText': '/trapvalue\r\nShow trap value for position',
        'noExplorerMoves': 'No explorer data available',
        'trapValueCommand.valueText': 'Trap value: %s'
      },
      'ro-RO': {
        'options.trapValueCommand': 'Comand\u0103: arat\u0103 valoare capcan\u0103 pentru pozi\u0163ie',
        'trapValueCommand.helpText': '/trapvalue\r\nArat\u0103 valoare capcan\u0103 pentru pozi\u0163ie',
        'noExplorerMoves': 'Nu exist\u0103 date \u00een Explorator',
        'trapValueCommand.valueText': 'Valoare capcan\u0103: %s'
      }
    };

    explorerItem = (node, value) => {
      if (!node) return;
      const lt = this.lichessTools;
      const explorer = lt.analysis?.explorer;
      if (!explorer) return;
      const components = [
        'explorer.speed',
        'analyse.explorer.player.name',
        'analyse.explorer.rating',
        'analyse.explorer.since-2.masters',
        'explorer.db2.standard',
        'analyse.explorer.since-2.lichess',
        'analyse.explorer.until-2.lichess'
      ];
      const key = lt.hash(components.map(k => lt.storage.get(k, { raw: true }) || '').join('|'));
      let explorerItems = node.explorerItems;
      if (!explorerItems) {
        explorerItems = {};
        node.explorerItems = explorerItems;
      }
      if (value === undefined) {
        value = explorerItems[key];
        if (value) return value;
        value = explorer.cache[node.fen];
        if (value) {
          explorerItems[key] = value;
          return value;
        }
      }
      explorerItems[key] = value;
    };

    showTrapValue = async (initialPath) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const orientation = analysis.getOrientation();
      const explorer = analysis.explorer;
      if (!explorer?.allowed) return;
      if (!explorer.enabled()) {
        explorer.enabled(true);
        analysis.redraw();
      }
      if (initialPath === undefined) {
        initialPath = analysis.path;
      } else {
        if (initialPath != analysis.path) {
          analysis.setPath(initialPath);
        }
      }
      let explorerItem = this.explorerItem(analysis.node);
      if (!explorerItem) {
        await explorer.setNode();
        while (explorer.loading()) {
          await lt.timeout(10);
        }
        explorerItem = explorer.current();
        this.explorerItem(analysis.node, explorerItem || null);
      }
      const total = explorerItem.white + explorerItem.draws + explorerItem.black;
      if (!total) {
        lt.announce(trans.noarg('noExplorerMoves'));
        return;
      }
      const potency = (orientation != 'black' ? explorerItem.white : explorerItem.black) / total;
      const nodes = analysis.tree.getNodeList(initialPath);
      let probability = 1;
      let count = 0;
      let prevTotal = 0;
      for (const node of nodes) {
        const move = explorerItem?.moves?.find(m => m.uci == node.uci);
        const moveProbability = move && prevTotal
          ? (move.black + move.draws + move.white) / prevTotal
          : 0;
        explorerItem = this.explorerItem(node);
        while (!explorerItem) {
          const path = initialPath.substr(0, node.ply * 2);
          analysis.setPath(path);
          await explorer.setNode();
          while (explorer.loading()) {
            await lt.timeout(10);
          }
          explorerItem = explorer.current();
          this.explorerItem(node, explorerItem || null);
        }
        const isOpponentMove = node.ply % 2 === (orientation == 'black' ? 1 : 0);
        const total = explorerItem.white + explorerItem.draws + explorerItem.black;
        if (node.ply && isOpponentMove && prevTotal) {
          probability *= moveProbability || (total / prevTotal);
          count++;
        }
        prevTotal = total;
      }
      if (count > 1) {
        probability = Math.pow(probability, 1 / count);
      }
      const probabilityScore = Math.round(probability * 100);
      const potencyScore = Math.round(potency * 100);
      const trapScore = Math.round(probability * potency * 100);
      const text = probabilityScore || potencyScore
        ? trans.pluralSame('trapValueCommand.valueText', probabilityScore + '% x ' + potencyScore + '% = ' + trapScore + '%')
        : '?';
      lt.announce(text);
      analysis.setPath(initialPath);
      analysis.redraw();
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('trapValueCommand');
      this.options = { enabled: value };
      this.logOption('Command - trap value', value);
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const explorer = analysis?.explorer;
      if (!explorer) return;
      if (value) {
        lt.registerCommand && lt.registerCommand('trapValueCommand', {
          handle: (val) => {
            if (val == 'trapvalue') {
              this.showTrapValue();
              return true;
            }
          },
          getHelp: () => trans.noarg('trapValueCommand.helpText')
        });
      } else {
        lt.unregisterCommand && lt.unregisterCommand('trapValueCommand');
      }
    }
  }
  LiChessTools.Tools.TrapValueCommand = TrapValueCommandTool;
})();
