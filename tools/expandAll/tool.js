(()=>{
  class ExpandAllTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'expandAll',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.expandAll': 'Expand all variations button',
        'expandAllTitle':'LiChess Tools - expand all variations'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.expandAll': 'Buton expandare toate varia\u0163iunile',
        'expandAllTitle':'LiChess Tools - expandeaz\u0103 toate varia\u0163iunile'
      }
    }

    addExpandAllButton=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=parent.lichess.analysis;
      const button=$('button.lichessTools-expandAll');
      if ($('.tview2 line.expand').length) {
        if (button.length) return;
      } else {
        button.remove();
        return;
      }
      $('<button type="button" class="lichessTools-expandAll">')
        .attr('data-icon','\uE02F')
        .attr('title',trans.noarg('expandAllTitle'))
        .on('mousedown touchstart',ev=>{
          ev.preventDefault();
          ev.stopPropagation();
          analysis.setAllCollapsed('',false);
          button.remove();
        })
        .insertBefore($('index.sbhint1').eq(0));
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('expandAll');
      this.logOption('Expand all', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      $('button.lichessTools-expandAll').remove();
      lichess.pubsub.off('redraw',this.addExpandAllButton);
      if (!value) return;
      lichess.pubsub.on('redraw',this.addExpandAllButton);
      this.addExpandAllButton();
    }

  }
  LiChessTools.Tools.ExpandAll=ExpandAllTool;
})();
