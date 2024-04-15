(()=>{
  class ResizeExplorerTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitChapterChange','EmitRedraw'];

    preferences=[
      {
        name:'resizeExplorer',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.resizeExplorer': 'Resize Explorer'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.resizeExplorer': 'Redimensionare Explorator'
      }
    }

    refreshHeight=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const explorerBox=$('main.analyse .analyse__tools .explorer-box');
      if (!explorerBox.length) return;
      if (this.height===undefined) {
        explorerBox.css({ flex:'',maxHeight:'' });
        return;
      }
      parent.global.requestAnimationFrame(()=>{
        explorerBox.css({
          flex:'1000 1 0',
          maxHeight: this.height
        });
      });    
    };

    dragDivider=(ev)=>{
      if (!ev.pageY) return;
      const parent=this.lichessTools;
      const $=parent.$;
      const tools=$('main.analyse .analyse__tools');
      const th=tools.height();
      const t=tools.offset().top;
      const h=t+th-ev.pageY;
      if (h<=0 || h>th-$('.ceval',tools).height()) return;
      this.height=h;
      const lichess=parent.lichess;
      lichess.storage.set('LichessTools.resizeExplorer',h);
      this.refreshHeight();
    };

    addDividerDirect=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const explorerBox=$('main.analyse .analyse__tools .explorer-box');
      if (!explorerBox.length) return;
      if ($('.lichessTools-resizeExplorer',explorerBox.parent()).length) return;
      $('<div class="lichessTools-resizeExplorer">')
        .append('<div>')
        .prop('draggable',true)
        .on('drag',this.dragDivider)
        .on('dragstart',ev=>{
           $(ev.currentTarget).addClass('dragging');
           $('body')
             .on('dragenter dragover',this.controlCursor);
        })
        .on('dragend',ev=>{
           $(ev.currentTarget).removeClass('dragging');
           $('body')
             .off('dragenter dragover',this.controlCursor);
        })
        .css('order',explorerBox.css('order'))
        .insertBefore(explorerBox);
      this.refreshHeight();
    };
    addDivider=this.lichessTools.debounce(this.addDividerDirect,300);

    controlCursor=(ev)=>{
      ev.preventDefault();
      ev.dataTransfer.dropEffect='move';
      return false;
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('resizeExplorer');
      this.logOption('Resize Explorer', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      if ($('body').is('.mobile')) {
        LiChessTools.enableMobileDragAndDrop();
      }
      lichess.pubsub.off('chapterChange',this.addDivider);
      lichess.pubsub.off('redraw',this.addDivider);
      if (!value) {
        const explorerBox=$('main.analyse .analyse__tools .explorer-box');
        explorerBox.css({ flex:'',maxHeight:'' });
        $('.lichessTools-resizeExplorer',explorerBox).remove();
        return;
      }
      lichess.pubsub.on('chapterChange',this.addDivider);
      lichess.pubsub.on('redraw',this.addDivider);
      this.height=+lichess.storage.get('LichessTools.resizeExplorer')||undefined;
      this.addDivider();
    }

  }
  LiChessTools.Tools.ResizeExplorer=ResizeExplorerTool;
})();
