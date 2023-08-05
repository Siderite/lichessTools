(()=>{
  class PreviousStudyMenuTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'previousStudyMenu',
        category: 'study',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.previousStudyMenu': 'Last visited study menu',
        'previousStudyText': 'Previous study',
        'previousStudyTitle': 'LiChess Tools - "%s"'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.previousStudyMenu': 'Meniu pentru ultimul studiu vizitat',
        'previousStudyText': 'Studiul anterior',
        'previousStudyTitle': 'LiChess Tools - "%s"'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('previousStudyMenu');
      this.logOption('Last study menu', value);
      const lichess=parent.lichess;
      const trans=parent.translator;
      const study=lichess?.analysis?.study;
      if (study) {
        parent.currentOptions['previousStudyMenu.study']={
          id:study.data.id,
          name:study.data.name
        };
        await parent.saveOptions(parent.currentOptions);
      }
      const container=$('#topnav section a[href="/learn"]+div[role="group"]');
      $('a.lichessTools-previousStudy',container).remove();
      if (!value) return;
      let studyData=parent.currentOptions.getValue('previousStudyMenu.study');
      if (!studyData) return;
      $('<a/>')
        .attr('href','/study/'+studyData.id)
        .addClass('lichessTools-previousStudy')
        .text(trans.noarg('previousStudyText'))
        .attr('title',trans.pluralSame('previousStudyTitle',studyData.name))
        .append($('<span>').text(studyData.name))
        .appendTo(container);
    }

  }
  LiChessTools.Tools.PreviousStudyMenu=PreviousStudyMenuTool;
})();
