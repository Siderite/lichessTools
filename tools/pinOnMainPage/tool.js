(()=>{
  class PinOnMainPageTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'pinOnMainPage',
        category: 'study',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.General': 'General',
        'options.pinOnMainPage': 'Pin broadcasts and studies to home page',
        'pinTitle':'LiChess Tools - pin on home page'
      },
      'ro-RO':{
        'options.General': 'General',
        'options.pinOnMainPage': 'Pune transmisiuni \u015fi studii pe pagina principal\u0103',
        'pinTitle':'LiChess Tools - pune pe pagina principal\u0103'
      }
    };

    pinStudy=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const study=lichess.analysis?.study;
      if (!study) return;
      const studyId=study.data.id;
      const tourName=study.relayData?.tour?.name;
      const studyName=(tourName?tourName+' ':'')+study.data.name;
      const isPinned=!!this.options.pinned.find(p=>p.studyId==studyId);
      if (isPinned) {
        parent.arrayRemoveAll(this.options.pinned,p=>p.studyId==studyId);
      } else {
        this.options.pinned.push({ studyId, studyName });
      }
      lichess.storage.set('LichessTools.pinnedStudies',parent.global.JSON.stringify(this.options.pinned));
      this.addPin();
    };

    addPin=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const $=parent.$;
      const study=lichess?.analysis?.study;
      if (!study) return;
      const container=$('.study__side div[role=tablist]');
      if (!container.length) return;
      let pin=$('span.lichessTools-pin',container);
      if (!this.options.enabled) {
        pin.remove();
        return;
      }
      const studyId=study.data.id;
      if (!pin.length) {
        pin=$('<span class="lichessTools-pin narrow">')
          .attr('data-icon','\uD83D\uDCCC')
          .attr('title',trans.noarg('pinTitle'))
          .on('click',ev=>{
             ev.preventDefault();
             this.pinStudy();
          })
          .insertAfter($('span.search',container));
      }
      const isPinned=!!this.options.pinned.find(p=>p.studyId==studyId);
      pin.toggleClass('lichessTools-pinned',isPinned);
    };

    addToHomepage=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const $=parent.$;
      const container=$('div.lobby__spotlights');
      if (!container.length) return;
      if (!this.options.enabled) {
        $('.lichessTools-pin',container).remove();
        return;
      }
      this.options.pinned.forEach(p=>{
        let elem=$('a.id_'+p.studyId,container);
        if (elem.length) return;
        elem=$('<a class="lichessTools-pin tour-spotlight">')
          .addClass('id_'+p.studyId)
          .attr('href','/study/'+p.studyId)
          .attr('title','LiChess Tools - '+p.studyName)
          .append($('<i class="img">').attr('data-icon','\uD83D\uDCCC'))
          .append($('<span class="content"><span class="name"></span></span>'))
          .appendTo(container);
        elem.find('.content .name').text(p.studyName);
      });
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('pinOnMainPage');
      this.logOption('Pin on main page', value);
      const lichess=parent.lichess;
      const $=parent.$;
      this.options={ 
        enabled: value,
        pinned: parent.jsonParse(_=>lichess.storage.get('LichessTools.pinnedStudies'),[])
      };
      this.addPin();
      this.addToHomepage();
    }

  }
  LiChessTools.Tools.PinOnMainPage=PinOnMainPageTool;
})();
