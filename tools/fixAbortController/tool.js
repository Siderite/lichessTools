(() => {
  class FixAbortControllerTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixAbortController',
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
        'options.fixAbortController': 'Fix AbortController'
      },
      'ro-RO': {
        'options.fixAbortController': 'Resolv\u0103 AbortController'
      }
    }

    async init() {
      const lt = this.lichessTools;
      if (!lt.global.AbortController) return;
      const value = lt.currentOptions?.getValue('fixAbortController');
      if (!value) return;
      lt.global.AbortController.prototype.abort = lt.wrapFunction(lt.global.AbortController.prototype.abort, {
        id: 'fixAbortController',
        before: ($this, ...args) => {
          if ($this.signal?.aborted) return false;
        },
        ignoreErrors: true
      });
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('fixAbortController');
      this.logOption('Fix AbortController in debug mode', value);
      lt.global.AbortController.prototype.abort = lt.unwrapFunction(lt.global.AbortController.prototype.abort, 'fixAbortController');
      if (!value) return;
      this.init();
    }
  }
  LiChessTools.Tools.FixAbortController = FixAbortControllerTool;
})();
