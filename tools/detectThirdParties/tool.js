(() => {
  class DetectThirdPartiesTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      this.options = {
        isPrettier: !!lt.global.getComputedStyle(lt.global.document.documentElement).getPropertyValue('--main-shadow')
      };

      this.logOption('Detected third parties', Object.keys(this.options).filter(k => this.options[k]).join(', ') || 'none');
      $.cached('body').toggleClass('lichessTools-prettier', this.options.isPrettier);
    }

  }
  LiChessTools.Tools.DetectThirdParties = DetectThirdPartiesTool;
})();
