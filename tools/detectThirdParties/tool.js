(() => {
  class DetectThirdPartiesTool extends LiChessTools.Tools.ToolBase {

    makeFunctionSafe = (parent, key) => {
      const lt = this.lichessTools;
      const oldFunc=parent[key];
      if (!oldFunc) throw new Error('Could not find member '+key+' to make safe!');
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
          console.warn('LiChess Tools: error with '+key+':',args,text);
        }
      };
      newFunc.__initErrorCatch=true;
      parent[key] = newFunc;
    };

    async init() {
      this.makeFunctionSafe(Node.prototype,'insertBefore');
      this.makeFunctionSafe(Node.prototype,'removeChild');
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
