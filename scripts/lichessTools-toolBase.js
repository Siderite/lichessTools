(() => {

  class ToolBase {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
    }
    get name() {
      return this.constructor.name.replace(/Tool$/, '');
    }

    logOption(label, value) {
      const lt = this.lichessTools;
      lt.global.console.log(label + ' %c' + (value === undefined ? '' : value), 'color:#9980FF');
    }

    async init() {
    }

    async start() {
    }
  }

  LiChessTools.Tools = {
    ToolBase: ToolBase
  };

  window.LiChessTools = LiChessTools;
})();