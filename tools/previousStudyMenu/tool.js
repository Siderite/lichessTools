(()=>{
  class PreviousStudyMenuTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','DetectThirdParties'];

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

    updateStudy=async ()=>{
      const parent=this.lichessTools;
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
      const studyData=parent.currentOptions.getValue('previousStudyMenu.study');
      const container=$('#topnav section a[href="/learn"]+div[role="group"]');
      $('a.lichessTools-previousStudy',container).remove();
      if (this.options.enabled && studyData) {
        $('<a/>')
          .attr('href','/study/'+studyData.id)
          .addClass('lichessTools-previousStudy')
          .text(trans.noarg('previousStudyText'))
          .attr('title',trans.pluralSame('previousStudyTitle',studyData.name))
          .append($('<span>').text(studyData.name))
          .appendTo(container);
      }
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('previousStudyMenu');
      this.logOption('Last study menu', value);
      this.options={ enabled: value };
      const lichess=parent.lichess;
      await this.updateStudy();
      lichess.pubsub.off('redraw',this.updateStudy);
      if (value) {
        lichess.pubsub.on('redraw',this.updateStudy);
      }
    }

  }
  LiChessTools.Tools.PreviousStudyMenu=PreviousStudyMenuTool;
})();
