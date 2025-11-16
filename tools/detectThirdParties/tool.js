(() => {
  class DetectThirdPartiesTool extends LiChessTools.Tools.ToolBase {

    foundStyleContaining = (str) => {
      const styles = document.getElementsByTagName('style');
      for (const style of styles) {
        if (style.textContent.indexOf(str) !== -1) return true;
      }
      return false;
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      this.options = {
        isPrettier: this.options?.isPrettier === undefined ? !!$('html').css('--boardLightRGB') : this.options.isPrettier,
        lichessHelper: this.options?.lichessHelper === undefined ? this.foundStyleContaining('LichessHelper') : this.options.lichessHelper
      };

      this.logOption('Detected third parties', Object.keys(this.options).filter(k => this.options[k]).join(', ') || 'none');
      $.cached('body')
        .toggleClassSafe('lichessTools-prettier', this.options.isPrettier)
        .toggleClassSafe('lichessTools-lichessHelper', this.options.lichessHelper);
    }

  }
  LiChessTools.Tools.DetectThirdParties = DetectThirdPartiesTool;
})();
