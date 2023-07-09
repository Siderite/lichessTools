(()=>{
  class DetectThirdPartiesTool extends LiChessTools.Tools.ToolBase {

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      this.options={
        isPrettier:!!parent.global.getComputedStyle(parent.global.document.documentElement).getPropertyValue('--main-shadow')
      };
      this.logOption('Detect third parties', this.options);
      $('body').toggleClass('lichessTools-prettier',this.options.isPrettier);
    }

  }
  LiChessTools.Tools.DetectThirdParties=DetectThirdPartiesTool;
})();
