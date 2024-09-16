(() => {
  class InterceptEventHandlersTool extends LiChessTools.Tools.ToolBase {

    eventHandlers = [];
    removeEventHandlers = (target, type) => {
      const items = this.eventHandlers.filter(eh => eh.target === target && eh.type === type);
      for (const item of items) {
        item.target.removeEventListener(item.type, item.listener, item.useCapture);
      }
    };
    getEventHandlers = (target, type) => {
      const items = this.eventHandlers.filter(eh => eh.target === target && eh.type === type);
      return items.map(i => i.listener);
    };

    async init() {
      const EventTarget = this.lichessTools.global.EventTarget;
      const wrap = this.lichessTools.wrapFunction;
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
          this.lichessTools.arrayRemoveAll(this.eventHandlers, eh => eh.target === target && eh.type === type && eh.listener === listener && eh.useCapture === useCapture);
        }
      });

      this.lichessTools.removeEventHandlers = this.removeEventHandlers;
      this.lichessTools.getEventHandlers = this.getEventHandlers;
    }
  }
  LiChessTools.Tools.InterceptEventHandlers = InterceptEventHandlersTool;
})();