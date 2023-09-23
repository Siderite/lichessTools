(()=>{
  class ExplorerSettingsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'explorerSettings',
        category: 'analysis',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        'lichessTools': 'LiChess Tools',
        'moveEvaluationText':'Evaluation',
        'moveEvaluationTitle':'Move evaluation column',
        'gambitsText':'Gambits',
        'gambitsTitle':'Number of gambits column',
        'explorerPracticeText':'Practice',
        'explorerPracticeTitle':'Button to practice against Explorer moves',
        'meButtonText':'Me button',
        'meButtonTitle':'Button to switch player with your user'
       },
      'ro-RO':{
        'lichessTools': 'LiChess Tools',
        'moveEvaluationText':'Evaluare',
        'moveEvaluationTitle':'Coloan\u0103 cu evaluare mut\u0103ri',
        'gambitsText':'Gambituri',
        'gambitsTitle':'Coloan\u0103 cu num\u0103r gambituri',
        'explorerPracticeText':'Antrenament',
        'explorerPracticeTitle':'Buton pentru antrenament contra mut\u0103ri din Explorator',
        'meButtonText':'Button Eu',
        'meButtonTitle':'Buton care schimb\u0103 juc\u0103torul cu tine'
      }
    };

    setOption=async (optionName,value)=>{
      const parent=this.lichessTools;
      parent.currentOptions[optionName]=value;
      await parent.applyOptions(parent.currentOptions);
      parent.fireReloadOptions();
    };

    showSettings=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const container=$('section.explorer-box div.config >div:has(section.speed)');
      if (!container.length) return;
      let section=$('section.lichessTools-explorerSettings',container);
      if (!section.length) {
        const choices=$('<div class="choices">');
        if (parent.tools.find(t=>t.name==='ExplorerEval')) {
          choices
            .append($('<button class="lichessTools-moveEvaluation">').text(trans('moveEvaluationText')).attr('title',trans('moveEvaluationTitle'))
              .on('click',ev=>{
                ev.preventDefault();
                const value=parent.currentOptions.getValue('explorerEval');
                const hidden=parent.isOptionSet(value,'hidden');
                this.setOption('explorerEval',hidden?value.split(',').filter(s=>s!='hidden').join(','):value+',hidden');
                this.showSettings();
              }))
        }
        if (parent.tools.find(t=>t.name==='ExplorerGambits')) {
          choices
            .append($('<button class="lichessTools-gambits">').text(trans('gambitsText')).attr('title',trans('gambitsTitle'))
              .on('click',ev=>{
                ev.preventDefault();
                const value=parent.currentOptions.getValue('explorerGambits');
                this.setOption('explorerGambits',!value);
                this.showSettings();
              }))
        }
        if (parent.tools.find(t=>t.name==='ExplorerPractice')) {
          choices
            .append($('<button class="lichessTools-explorerPractice">').text(trans('explorerPracticeText')).attr('title',trans('explorerPracticeTitle'))
              .on('click',ev=>{
                ev.preventDefault();
                const value=parent.currentOptions.getValue('explorerPractice');
                this.setOption('explorerPractice',!value);
                this.showSettings();
              }))
        }
        if (parent.tools.find(t=>t.name==='OpeningExplorerUsers')) {
          choices
            .append($('<button class="lichessTools-meButton">').text(trans('meButtonText')).attr('title',trans('meButtonTitle'))
              .on('click',ev=>{
                ev.preventDefault();
                const value=parent.currentOptions.getValue('openingExplorerUsers');
                const meButton=parent.isOptionSet(value,'switchWithMe');
                this.setOption('openingExplorerUsers',meButton?value.split(',').filter(s=>s!='switchWithMe').join(','):value+',switchWithMe');
                this.showSettings();
              }));
        }
        section=$('<section class="lichessTools-explorerSettings">')
          .append($('<label>').text(trans('lichessTools')))
          .append(choices)
          .appendTo(container);
      }
      let value=parent.currentOptions.getValue('explorerEval');
      value=!parent.isOptionSet(value,'hidden');
      $('button.lichessTools-moveEvaluation',section)
        .attr('aria-pressed',value.toString());
      value=parent.currentOptions.getValue('explorerGambits');
      $('button.lichessTools-gambits',section)
        .attr('aria-pressed',value.toString());
      value=parent.currentOptions.getValue('explorerPractice');
      $('button.lichessTools-explorerPractice',section)
        .attr('aria-pressed',value.toString());
      value=parent.currentOptions.getValue('openingExplorerUsers');
      value=parent.isOptionSet(value,'switchWithMe');
      $('button.lichessTools-meButton',section)
        .attr('aria-pressed',value.toString());
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('explorerSettings');
      this.logOption('Explorer settings', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const explorer=lichess?.analysis?.explorer;
      if (!explorer) return;
      explorer.config.toggleOpen=parent.unwrapFunction(explorer.config.toggleOpen,'explorerSettings');
      $('section.explorer-box section.lichessTools-explorerSettings').remove();
      if (!value) return;
      explorer.config.toggleOpen=parent.wrapFunction(explorer.config.toggleOpen,{
        id:'explorerSettings',
        after:($this,result)=>{
          parent.global.setTimeout(this.showSettings,100);
        }
      });
      this.showSettings();
    }

  }
  LiChessTools.Tools.ExplorerSettings=ExplorerSettingsTool;
})();
