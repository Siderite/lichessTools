(()=>{
  class HideCrosstableTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'hideCrosstable',
        category: 'play',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false
      }
    ];

    intl={
      'en-US':{
        'options.play': 'Play',
        'options.hideCrosstable': 'Hide score tally crosstable',
        'hideCrosstableTitle':'LiChess Tools - hide/show tally'
      },
      'ro-RO':{
        'options.play': 'Joc',
        'options.hideCrosstable': 'Ascunde lista de scoruri',
        'hideCrosstableTitle':'LiChess Tools - arat\u0103/ascunde lista de scor'
      }
    }

    showCrosstable=(ev)=>{
      ev.preventDefault();
      $(ev.currentTarget).toggleClass('lichessTools-showCrosstable');
    };

    async start() {
      const parent=this.lichessTools;
      const trans=parent.translator;
      const value=parent.currentOptions.hideCrosstable;
      this.logOption('Hide crosstable', value);
      const elem=$('main.round div.crosstable')
        .toggleClass('lichessTools-showCrosstable',!value)
        .toggleClass('lichessTools-hideCrosstableEnabled',value)
        .off('click',this.showCrosstable);
      if (value) {
        elem
          .attr('title',trans.noarg('hideCrosstableTitle'))
          .on('click',this.showCrosstable);
      } else {
        elem.removeAttr('title');
      }
    }

  }
  LiChessTools.Tools.HideCrosstable=HideCrosstableTool;
})();
