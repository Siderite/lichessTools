(()=>{
  class InterceptTimeoutsTool extends LiChessTools.Tools.ToolBase {

    clearLastTimeout=()=>{
      const timeout=this.timeouts.at(-1);
      if (timeout) this.lichessTools.global.clearTimeout(timeout.pointer);
    };

    timeouts=[];
    intervals=[];
    async init() {
      const global=this.lichessTools.global;
      const wrap=this.lichessTools.wrapFunction;
      const removeAll=this.lichessTools.arrayRemoveAll;
      global.setTimeout=wrap(global.setTimeout,{
        id: 'interceptTimeouts',
        after:(target,pointer,func,delay,...args)=>{
          const time=+(new Date());
          this.timeouts.push({pointer, func, delay, args, time});
          removeAll(this.timeouts,t=>t.time+t.delay<time);
        }
      });
      global.clearTimeout=wrap(global.clearTimeout,{
        id: 'interceptTimeouts',
        before:(target,pointer)=>{
          removeAll(this.timeouts,t=>t.pointer===pointer);
        }
      });
      global.setInterval=wrap(global.setInterval,{
        id: 'interceptTimeouts',
        after:(target,pointer,func,delay,...args)=>{
          const time=+(new Date());
          this.intervals.push({pointer, func, delay, args, time});
        }
      });
      global.clearInterval=wrap(global.clearInterval,{
        id: 'interceptTimeouts',
        before:(target,pointer)=>{
          removeAll(this.intervals,t=>t.pointer===pointer);
        }
      });

      this.lichessTools.clearLastTimeout=this.clearLastTimeout;
    }
  }
  LiChessTools.Tools.InterceptTimeouts=InterceptTimeoutsTool;
})();
