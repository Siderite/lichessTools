(() => {
  class CtrlSpaceForBestComputerMoveTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'spaceDisabled',
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
        'options.spaceDisabled': 'Ctrl-space to play best computer move instead of Space'
      },
      'ro-RO': {
        'options.analysis2': 'Analiz\u0103 - m\u0103run\u0163i\u015furi',
        'options.spaceDisabled': 'Ctrl-space pentru a juca cea mai bun\u0103 mutare a computerului, nu Space'
      }
    }

    bindKeys = ()=>{
      if (!this.oldSpaceHandler) return;
      const lt = this.lichessTools;
      lt.unbindKeyHandler('space');
      lt.unbindKeyHandler('ctrl+space', true);
      if (this.options.enabled && !lt.isBindingDisabled?.(['ctrl', 'space'])) {
        lt.bindKeyHandler('ctrl+space', this.oldSpaceHandler);
        lt.bindKeyHandler('space', this.spaceForGamebookPlay);
      } else {
        lt.bindKeyHandler('space', this.oldSpaceHandler, false);
      }
    };

    oldSpaceHandler = null;
    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('spaceDisabled');
      this.options = { enabled: !!value };
      this.logOption('Ctrl-Space to play best computer move', value);
      if (!this.oldSpaceHandler) {
        this.oldSpaceHandler = lt.getKeyHandler('space');
        if (!this.oldSpaceHandler) return;
      }
      this.bindKeys();
    }

    spaceForGamebookPlay = () => {
      const lt = this.lichessTools;
      const ctrl = lt.lichess.analysis;
      if (!ctrl) return;
      const gb = ctrl.gamebookPlay();
      if (gb) gb.onSpace();
    };

  }
  LiChessTools.Tools.CtrlSpaceForBestComputerMove = CtrlSpaceForBestComputerMoveTool;
})();
