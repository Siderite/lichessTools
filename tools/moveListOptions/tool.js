(()=>{
  class MoveListOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'moveListOptions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['indentedVariations'],
        defaultValue: false
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.moveListOptions': 'Move list options',
        'moveListOptions.indentedVariations':'Indented variations'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.moveListOptions': 'Op\u0163iuni pentru list\u0103 mut\u0103ri',
        'moveListOptions.indentedVariations':'Varia\u0163iuni indentate'
      }
    }

    analysisControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      $('.tview2').toggleClass('lichessTools-indentedVariations',this.options.indentedVariations);
      const container=$('div.analyse__tools div.action-menu');
      if (!container.length) return;
      if (!$('.abset-extendedInteractive',container).length) {
        const html=`<div class="setting abset-extendedInteractive" title="LiChess Tools - $trans(moveListOptions.indentedVariations)">
      <div class="switch">
        <input id="abset-indentedVariations" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-indentedVariations"></label>
      </div>
      <label for="abset-indentedVariations">$trans(moveListOptions.indentedVariations)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g,m=>{
          return parent.htmlEncode(trans.noarg(m.slice(7,-1)));
        });
        $(html).insertAfter($('div.abset-inline',container).eq(0));
        $('#abset-indentedVariations')
          .on('change',async ()=>{
            const arr=[];
            const options=parent.currentOptions
            if ($('#abset-indentedVariations').is(':checked')) arr.push('indentedVariations');
            options.moveListOptions=arr.join(',');
            await parent.applyOptions(options);
            parent.fireReloadOptions();
          });
      }
      $('#abset-indentedVariations')
        .prop('checked',this.options.indentedVariations);
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('moveListOptions');
      this.logOption('Move list options', value);
      const $=parent.$;
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      this.options={
        indentedVariations:parent.isOptionSet(value,'indentedVariations')
      };
      lichess.pubsub.off('redraw',this.analysisControls);
      lichess.pubsub.on('redraw',this.analysisControls);
      lichess.analysis.actionMenu.toggle=lichessTools.unwrapFunction(lichess.analysis.actionMenu.toggle,'moveListOptions');
      lichess.analysis.actionMenu.toggle=lichessTools.wrapFunction(lichess.analysis.actionMenu.toggle,{
        id:'moveListOptions',
        after: ($this, result, ...args)=>{
          parent.global.setTimeout(this.analysisControls,100);
        }
      });
      this.analysisControls();
    }
  }

  LiChessTools.Tools.MoveListOptions=MoveListOptionsTool;
})();
