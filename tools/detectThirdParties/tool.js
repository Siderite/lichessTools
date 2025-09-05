(() => {
  class DetectThirdPartiesTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      this.options = {
        isPrettier: !!$('html').css('--boardLightRGB'),
        lichessHelper: !!$('style').get().find((s)=>$(s).text().includes('LichessHelper'))
      };

      this.logOption('Detected third parties', Object.keys(this.options).filter(k => this.options[k]).join(', ') || 'none');
      $.cached('body')
        .toggleClassSafe('lichessTools-prettier', this.options.isPrettier)
        .toggleClassSafe('lichessTools-lichessHelper', this.options.lichessHelper);
    }

  }
  LiChessTools.Tools.DetectThirdParties = DetectThirdPartiesTool;
})();
