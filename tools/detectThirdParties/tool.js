(() => {
  class DetectThirdPartiesTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const parent = this.lichessTools;
      const $ = parent.$;
      this.options = {
        isPrettier: !!parent.global.getComputedStyle(parent.global.document.documentElement).getPropertyValue('--main-shadow')
      };

      this.logOption('Detected third parties', Object.keys(this.options).filter(k => this.options[k]).join(', ') || 'none');
      $.cached('body').toggleClass('lichessTools-prettier', this.options.isPrettier);
    }

  }
  LiChessTools.Tools.DetectThirdParties = DetectThirdPartiesTool;
})();
