(() => {
  class FixSnabdomTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixSnabdom',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.fixSnabdom': 'Fix Snabdom issues'
      },
      'ro-RO': {
        'options.fixSnabdom': 'Resolv\u0103 probleme cu Snabdom'
      }
    }


    makeFunctionSafe = (parent, key) => {
      const lt = this.lichessTools;
      const oldFunc=parent[key];
      if (!oldFunc) throw new Error('Could not find member '+key+' to make safe!');
      if (oldFunc.__initErrorCatch) return;
      const newFunc = function() {
        if (lt?.currentOptions?.enabledLichessTools === false || lt?.currentOptions?.fixSnabdom === false) {
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
      const value = lt.currentOptions.getValue('fixSnabdom');
      this.logOption('Fix Snabdom', value);
    }


  }
  LiChessTools.Tools.FixSnabdom = FixSnabdomTool;
})();
