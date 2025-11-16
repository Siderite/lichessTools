(() => {
  class DetectThirdPartiesTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      this.options = {
        isPrettier: this.options?.isPrettier === undefined ? !!$('html').css('--boardLightRGB') : this.options.isPrettier,
        lichessHelper: this.options?.lichessHelper === undefined ? !!$('style').get().find((s)=>$(s).text().includes('LichessHelper')) || this.options.lichessHelper
      };

      this.logOption('Detected third parties', Object.keys(this.options).filter(k => this.options[k]).join(', ') || 'none');
      $.cached('body')
        .toggleClassSafe('lichessTools-prettier', this.options.isPrettier)
        .toggleClassSafe('lichessTools-lichessHelper', this.options.lichessHelper);
    }

  }
  LiChessTools.Tools.DetectThirdParties = DetectThirdPartiesTool;
})();
