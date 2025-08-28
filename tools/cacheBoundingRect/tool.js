(() => {
  class CacheBoundingRectTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'cacheBoundingRect',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true,
        offValue: false
      }
    ];

    intl = {
      'en-US': {
        'options.cacheBoundingRect': 'Cache getClientBoundingRect',
        'options.General': 'General'
      },
      'ro-RO': {
        'options.cacheBoundingRect': 'Cache getClientBoundingRect',
        'options.General': 'General'
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('cacheBoundingRect');
      this.logOption('Cache bounding rect', value);
      if (value) {
        if (!this.original) {
          this.cache = new WeakMap();
          const self = this;
          this.original = lt.global.Element.prototype.getBoundingClientRect;
          lt.global.Element.prototype.getBoundingClientRect = function () {
            const now = performance.now();
            let cached = self.cache.get(this);
            if (!cached || now - cached.timestamp > 64) { // Cache for ~1 frame (16ms)
              cached = { result: self.original.call(this), timestamp: now };
              self.cache.set(this, cached);
            }
            return cached.result;
          };
        }
      } else {
        if (this.original) {
          this.cache = null;
          lt.global.Element.prototype.getBoundingClientRect = this.original;
          this.original = null;
        }
      }
    }
  }
  LiChessTools.Tools.CacheBoundingRect = CacheBoundingRectTool;
})();
