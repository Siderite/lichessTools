(() => {
  class NoUiSliderTool extends LiChessTools.Tools.ToolBase {

    preferences = [{
      name: 'nouislider',
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
        'options.nouislider': 'noUiSlider support'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.nouislider': 'Suport pentru noUiSlider'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('nouislider');
      if (!value) {
        lt.noUiSlider = null;
        return;
      }
      if (!lt.noUiSlider) {
        let noUiSlider = null;
        lt.noUiSlider=()=>new Promise((resolve)=>{
          if (noUiSlider) {
            resolve(noUiSlider);
            return;
          }
          // generate this with the BundleJsLibraries project from LiChessToolsAdjacent
          lt.comm.getChromeUrl('tools/nouislider/nouislider.bundle.mjs').then(async (url)=>{
            noUiSlider = await import(url);
            resolve(noUiSlider);
          });
        });
      }
    }

  }
  LiChessTools.Tools.NoUiSlider = NoUiSliderTool;
})();
