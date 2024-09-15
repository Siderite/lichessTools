(() => {
  class ResizeExplorerTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitChapterChange', 'EmitRedraw'];

    preferences = [
      {
        name: 'resizeExplorer',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.resizeExplorer': 'Resize Explorer'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.resizeExplorer': 'Redimensionare Explorator'
      }
    }

    refreshHeight = () => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const explorerBox = $('main.analyse .analyse__tools .explorer-box');
      if (!explorerBox.length) return;
      const h = this.isMobile
        ? this.height?.mobile
        : this.height?.desktop;
      if (h === undefined) {
        explorerBox.css({ minHeight: '', maxHeight: '' });
        return;
      }
      parent.global.requestAnimationFrame(() => {
        explorerBox.css({
          maxHeight: h,
          minHeight: h
        });
      });
    };

    dragover = (ev) => {
      if (ev?.dataTransfer?.getData('dnd/lichessTools-resizeExplorer')=='dragging') {
        this.dragDivider(ev);
      }
    };

    dragDivider = (ev) => {
      if (!ev?.pageY) return;
      const parent = this.lichessTools;
      const $ = parent.$;
      const tools = $	('main.analyse .analyse__tools');
      const explorerBox = $('section.explorer-box', tools);
      const th = tools.height();
      const hh = $('.ceval', tools).height() + ($('.pv_box', tools).height() || 0);
      const t = tools.offset().top;
      const et = explorerBox.offset().top;
      const h = this.isMobile
        ? ev.pageY - et
        : t + th - ev.pageY;
      if (h <= 0 || h > th - hh) return;
      this.height = {
        mobile: this.isMobile ? h : this.height?.mobile,
        desktop: this.isMobile ? this.height?.desktop : h
      };
      parent.storage.set('LichessTools.resizeExplorer', this.height);
      this.refreshHeight();
    };

    addDividerDirect = () => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const toolsElem = $('main.analyse .analyse__tools ');
      const explorerBox = toolsElem.find('.explorer-box');
      let divider = $('.lichessTools-resizeExplorer', explorerBox.parent());
      if (!explorerBox.length) {
        divider.remove();
        return;
      }
      if (divider.length) {
        if (!divider.next().is('.explorer-box')) {
          divider.insertBefore(explorerBox);
        }
        return;
      }
      toolsElem
        .off('dragover',this.dragover)
        .on('dragover',this.dragover);
      divider = $('<div class="lichessTools-resizeExplorer">')
        .append('<div>')
        .prop('draggable', true)
        .on('drag', this.dragDivider)
        .on('dragstart', ev => {
          ev.dataTransfer.setData('dnd/lichessTools-resizeExplorer','dragging');
          $(ev.currentTarget).addClass('dragging');
          $('body')
            .on('dragenter dragover', this.controlCursor);
        })
        .on('dragend', ev => {
          $(ev.currentTarget).removeClass('dragging');
          $('body')
            .off('dragenter dragover', this.controlCursor);
        })
        .insertBefore(explorerBox);
      if (this.isMobile) {
        divider.css('order', +explorerBox.css('order') + 1);
      }
      this.refreshHeight();
    };
    addDivider = this.lichessTools.debounce(this.addDividerDirect, 300);

    controlCursor = (ev) => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      return false;
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('resizeExplorer');
      this.logOption('Resize Explorer', value);
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      if (parent.isMobile()) {
        this.isMobile = true;
        LiChessTools.enableMobileDragAndDrop();
      }
      lichess.pubsub.off('lichessTools.chapterChange', this.addDivider);
      lichess.pubsub.off('lichessTools.redraw', this.addDivider);
      analysis.explorer.setNode = parent.unwrapFunction(analysis.explorer.setNode, 'resizeExplorer');
      if (!value) {
        const explorerBox = $('main.analyse .analyse__tools .explorer-box');
        explorerBox.css({ minHeight: '', maxHeight: '' });
        $('.lichessTools-resizeExplorer').remove();
        parent.storage.remove('LichessTools.resizeExplorer');
        return;
      }
      lichess.pubsub.on('lichessTools.chapterChange', this.addDivider);
      lichess.pubsub.on('lichessTools.redraw', this.addDivider);
      analysis.explorer.setNode = parent.wrapFunction(analysis.explorer.setNode, {
        id: 'resizeExplorer',
        after: ($this, result, ...args) => {
          this.addDivider();
        }
      });
      this.height = parent.storage.get('LichessTools.resizeExplorer');
      this.addDivider();
    }

  }
  LiChessTools.Tools.ResizeExplorer = ResizeExplorerTool;
})();
