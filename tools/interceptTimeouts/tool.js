(() => {
  class InterceptTimeoutsTool extends LiChessTools.Tools.ToolBase {

    clearLastTimeout = () => {
      const lt = this.lichessTools;
      const timeout = this.timeouts.at(-1);
      if (timeout) lt.global.clearTimeout(timeout.pointer);
    };

    timeouts = [];
    intervals = [];
    async init() {
      const lt = this.lichessTools;
      const global = lt.global;
      const wrap = lt.wrapFunction.bind(this.lichessTools);
      const removeAll = lt.arrayRemoveAll;
      global.setTimeout = wrap(global.setTimeout, {
        id: 'interceptTimeouts',
        after: (target, pointer, func, delay, ...args) => {
          const time = Date.now();
          this.timeouts.push({ pointer, func, delay, args, time });
          removeAll(this.timeouts, t => t.time + t.delay < time);
        }
      });
      global.clearTimeout = wrap(global.clearTimeout, {
        id: 'interceptTimeouts',
        before: (target, pointer) => {
          removeAll(this.timeouts, t => t.pointer === pointer);
        }
      });
      global.setInterval = wrap(global.setInterval, {
        id: 'interceptTimeouts',
        after: (target, pointer, func, delay, ...args) => {
          const time = Date.now();
          this.intervals.push({ pointer, func, delay, args, time });
        }
      });
      global.clearInterval = wrap(global.clearInterval, {
        id: 'interceptTimeouts',
        before: (target, pointer) => {
          removeAll(this.intervals, t => t.pointer === pointer);
        }
      });

      lt.clearLastTimeout = this.clearLastTimeout;
    }
  }
  LiChessTools.Tools.InterceptTimeouts = InterceptTimeoutsTool;
})();
