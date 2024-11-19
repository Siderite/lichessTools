(() => {
  class InterceptEventHandlersTool extends LiChessTools.Tools.ToolBase {

    eventHandlers = [];
    removeEventHandlers = (target, type) => {
      const items = this.eventHandlers.filter(eh => eh.target === target && eh.type === type);
      for (const item of items) {
        item.target.removeEventListener(item.type, item.listener, item.useCapture);
      }
      return items.map(i => i.listener);
    };
    getEventHandlers = (target, type) => {
      const items = this.eventHandlers.filter(eh => eh.target === target && eh.type === type);
      return items.map(i => i.listener);
    };

    async init() {
      const lt = this.lichessTools;
      const EventTarget = lt.global.EventTarget;
      const wrap = lt.wrapFunction.bind(this.lichessTools);
      EventTarget.prototype.addEventListener = wrap(EventTarget.prototype.addEventListener, {
        id: 'interceptEventHandlers',
        before: (target, type, listener, options) => {
          const useCapture = typeof options === 'boolean'
            ? options
            : !!options?.capture;
          this.eventHandlers.push({ target, type, listener, useCapture });
        }
      });
      EventTarget.prototype.removeEventListener = wrap(EventTarget.prototype.removeEventListener, {
        id: 'interceptEventHandlers',
        before: (target, type, listener, options) => {
          const useCapture = typeof options === 'boolean'
            ? options
            : !!options?.capture;
          lt.arrayRemoveAll(this.eventHandlers, eh => eh.target === target && eh.type === type && eh.listener === listener && eh.useCapture === useCapture);
        }
      });

      lt.removeEventHandlers = this.removeEventHandlers;
      lt.getEventHandlers = this.getEventHandlers;
    }
  }
  LiChessTools.Tools.InterceptEventHandlers = InterceptEventHandlersTool;
})();