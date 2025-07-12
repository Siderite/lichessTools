(() => {
  class ExpandAllTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'expandAll',
        category: 'analysis',
        type: 'multiple',
        possibleValues: ['showButton', 'autoExpand'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.expandAll': 'Expand all variations',
        'expandAll.showButton': 'Show button',
        'expandAll.autoExpand': 'Auto expand',
        'expandAllVariationsTitle': 'LiChess Tools - expand all variations'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.expandAll': 'Expandare toate varia\u0163iile',
        'expandAll.showButton': 'Arat\u0103 butonul',
        'expandAll.autoExpand': 'Expandeaz\u0103 automat',
        'expandAllVariationsTitle': 'LiChess Tools - expandeaz\u0103 toate varia\u0163iile'
      }
    }

    addExpandAllButton = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      $('.tview2').toggleClassSafe('lichessTools-expandAllVariations',true);
      let button = $('button.lichessTools-expandAll');
      if ($.single('.tview2 a.disclosure[data-icon="'+lt.icon.PlusButton+'"]').length) {
        if (button.length) return;
      } else {
        button.remove();
        return;
      }
      button = $('<button type="button" class="lichessTools-expandAll">')
        .attr('data-icon', lt.icon.ZoomIn)
        .attr('title', trans.noarg('expandAllVariationsTitle'))
        .on('mousedown touchstart', ev => {
          ev.preventDefault();
          ev.stopPropagation();
          this.expandAll();
        })
        .insertBefore($('index.sbhint1').eq(0));
    };

    expandAll = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const analysis = lt.lichess.analysis;
      if (!this.expandAllHandler) {
        $('.analyse__moves')
          .trigger('contextmenu')
          .trigger('click');
        const menuItems = $('#analyse-cm a[data-icon="'+lt.icon.PlusButton+'"]');
        var item;
        switch (menuItems.length) {
          case 0: return;
          case 1:
            item = menuItems[0];
            break;
          default:
            item = menuItems.get().find((e)=>$(e).text()=='Show all variations') || menuItems[menuItems.length-1];
            break;
        }
        if (item) {
          this.expandAllHandler = lt.getEventHandlers(item,'click')[0];
        }
      }
      if (this.expandAllHandler) {
        this.expandAllHandler();
        $('button.lichessTools-expandAll').remove();
      }
    }

    autoExpand = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const analysis = lt.lichess.analysis;
      const tview2 = $('.tview2')[0];
      if (!tview2) return;
      const autoExpanded = analysis.tree.root;
      if (tview2.autoExpanded !== autoExpanded) {
        tview2.autoExpanded = autoExpanded;
        this.expandAll();
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('expandAll');
      this.logOption('Expand all', value);
      this.options = {
        showButton: lt.isOptionSet(value, 'showButton'),
        autoExpand: lt.isOptionSet(value, 'autoExpand'),
        get isSet() { return this.showButton || this.autoExpand; }
      };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      $('button.lichessTools-expandAll').remove();
      lt.pubsub.off('lichessTools.redraw', this.addExpandAllButton);
      lt.pubsub.off('lichessTools.redraw', this.autoExpand);
      if (this.options.showButton) {
        lt.pubsub.on('lichessTools.redraw', this.addExpandAllButton);
        this.addExpandAllButton();
      }
      if (this.options.autoExpand) {
        lt.pubsub.on('lichessTools.redraw', this.autoExpand);
        lt.global.setTimeout(this.autoExpand,500);
      } else {
        $('.tview2').removeClass('lichessTools.expandAllVariations');
      }
    }

  }
  LiChessTools.Tools.ExpandAll = ExpandAllTool;
})();
