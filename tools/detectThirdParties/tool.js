(() => {
  class DetectThirdPartiesTool extends LiChessTools.Tools.ToolBase {

    async init() {
      const lt = this.lichessTools;
      const oldFunc=Node.prototype.insertBefore;
      if (oldFunc.__initErrorCatch) return;
      const newFunc = function() {
        if (lt?.currentOptions?.enabledLichessTools === false) {
          return oldFunc.apply(this,arguments);
        }
        try {
          return oldFunc.apply(this,arguments);
        } catch(e) {
          const args = [...arguments];
          const text = args.map(a=>a?`${a.tagName} #${a.id} .${a.className}`:a).join('\r\n');
          console.warn('LiChess Tools: error with insertBefore:',args,text);
        }
      };
      newFunc.__initErrorCatch=true;
      Node.prototype.insertBefore = newFunc;
    }

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
