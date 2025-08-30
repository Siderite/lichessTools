(() => {
  class FixChessgroundResizeTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fixChessgroundResize',
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
        'options.fixChessgroundResize': 'Fix Chessground resize'
      },
      'ro-RO': {
        'options.fixChessgroundResize': 'Resolv\u0103 redimensionarea Chessground'
      }
    }

    monitorElement = (element, callback) => {

      // Find all absolutely positioned parents
      const getAbsoluteParents = (el) => {
        const parents = [];
        let current = el.parentElement;
        while (current) {
          if (getComputedStyle(current).position === 'absolute' || getComputedStyle(current).position === 'fixed') {
            parents.push(current);
          }
          current = current.parentElement;
        }
        return parents;
      };

      const absoluteParents = getAbsoluteParents(element);

      // ResizeObserver for size changes of the target element
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          callback({
            type: 'size',
            width,
            height,
            element
          });
        }
      });

      // MutationObserver for style or class changes on the target and its absolute parents
      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          callback({
            type: 'position',
            element: mutation.target,
            attribute: mutation.attributeName,
            value: mutation.target.getAttribute(mutation.attributeName)
          });
        });
      });

      // Observe the target element
      resizeObserver.observe(element);
      mutationObserver.observe(element, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      // Observe all absolutely positioned parents
      absoluteParents.forEach(parent => {
        mutationObserver.observe(parent, {
          attributes: true,
          attributeFilter: ['style', 'class']
        });
      });

      // Return a cleanup function
      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }

    fireResizeDirect = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      lt.debug && lt.global.console.debug('Firing board resize event');
      const boardSize = $('.main-board cg-container').css('width') || $('.main-board cg-container').width()+'px';
      lt.global.document.documentElement.style.setProperty('--board-size', boardSize);
      $('body')
        .toggleClassSafe('lichessTools-hasBoardSize', true)
        .trigger('resize');
    };
    fireResize = lichessTools.debounce(this.fireResizeDirect,200);

    checkBoardPosition = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const element = $('.main-board cg-board')[0];
      if (element!=this.board) {
        this.board = element;
        if (this.cleanup) this.cleanup();
        if (element) {
          this.cleanup = this.monitorElement(element,this.fireResize);
        }
      }
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('fixChessgroundResize');
      this.logOption('Fix Chessground resize', value);
      lt.global.clearInterval(this.interval);
      if (!value) return;
      this.interval = lt.global.setInterval(this.checkBoardPosition, 500);
    }
  }
  LiChessTools.Tools.FixChessgroundResize = FixChessgroundResizeTool;
})();
