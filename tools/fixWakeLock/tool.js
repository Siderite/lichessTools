(() => {
  class FixWakeLockTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixWakeLock',
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
        'options.fixWakeLock': 'Fix WakeLock'
      },
      'ro-RO': {
        'options.fixWakeLock': 'Resolv\u0103 WakeLock'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('fixWakeLock');
      this.logOption('Fix wakelock in debug mode', value);
      const navigator = parent.global.navigator;
      const document = parent.global.document;
      if (!navigator.wakeLock) return;
      navigator.wakeLock.request = parent.unwrapFunction(navigator.wakeLock.request, 'fixWakeLock');
      if (!value) return;
      navigator.wakeLock.request = parent.wrapFunction(navigator.wakeLock.request, {
        id: 'fixWakeLock',
        before: ($this) => {
          return document.visibilityState === 'visible';
        },
        after: ($this, result) => {
          return result || Promise.resolve({
            release: async function () { }
          });
        }
      });
    }
  }
  LiChessTools.Tools.FixWakeLock = FixWakeLockTool;
})();
