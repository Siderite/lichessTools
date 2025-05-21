(() => {
  class DetectThirdPartiesTool extends LiChessTools.Tools.ToolBase {

  styleBlockContains(text) {
    const lt = this.lichessTools;
    const styleTags = document.querySelectorAll('style');
  for (const style of styleTags) {
    if (style.textContent.includes(text)) {
      return true;
    }
  }
  return false;
}

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      this.options = {
        isPrettier: !!lt.global.getComputedStyle(lt.global.document.documentElement).getPropertyValue('--main-shadow'),
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
