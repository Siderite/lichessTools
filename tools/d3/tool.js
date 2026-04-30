(() => {
  class D3Tool extends LiChessTools.Tools.ToolBase {

    preferences = [{
      name: 'd3',
      category: 'appearance',
      type: 'single',
      possibleValues: [false, true],
      defaultValue: true,
      advanced: true,
      hidden: true
    }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.d3': 'd3 support'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.d3': 'Suport pentru d3'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('d3');
      if (!value) {
        lt.d3 = null;
        return;
      }
      if (!lt.d3) {
        // generate this with the BundleChessOps project from LiChessToolsAdjacent
        lt.comm.getChromeUrl('tools/d3/d3.bundle.mjs').then(async (url)=>{
          lt.d3 = await import(url);
        });
      }
    }

  }
  LiChessTools.Tools.D3 = D3Tool;
})();
