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
        'previousStudyTitle': 'LiChess Tools - Last visited study'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.previousStudyMenu': 'Meniu pentru ultimul studiu vizitat',
        'previousStudyText': 'Studiul anterior',
        'previousStudyTitle': 'LiChess Tools - ultimul studiu vizitat'
      }
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('previousStudyMenu');
      this.logOption('Last study menu', value);
      const lichess=parent.lichess;
      const trans=parent.translator;
      let studyId=lichess?.analysis?.study?.data?.id;
      if (studyId) {
        parent.currentOptions['previousStudyMenu.studyId']=studyId;
        await parent.saveOptions(parent.currentOptions);
        parent.fireReloadOptions();
      }
      const container=$('#topnav section a[href="/learn"]+div[role="group"]');
      $('a.lichessTools-previousStudy',container).remove();
      if (!value) return;
      studyId=parent.currentOptions.getValue('previousStudyMenu.studyId');
      if (!studyId) return;
      $('<a/>')
        .attr('href','/study/'+studyId)
        .addClass('lichessTools-previousStudy')
        .text(trans.noarg('previousStudyText'))
        .attr('title',trans.noarg('previousStudyTitle'))
        .appendTo(container);
    }

  }
  LiChessTools.Tools.PreviousStudyMenu=PreviousStudyMenuTool;
})();
