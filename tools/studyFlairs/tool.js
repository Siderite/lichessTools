(()=>{
  class StudyFlairsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'studyFlairs',
        category: 'study',
        type:'multiple',
        possibleValues: ['authorFlair','topicFlairs'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.studyFlairs': 'Assign flairs to studies',
        'studyFlairs.authorFlair':'Use study author flair',
        'studyFlairs.topicFlairs':'Use study topics for flairs'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.studyFlairs': 'Asociaz\u0103 pictograme studiilor',
        'studyFlairs.authorFlair':'Foloseste pictograma autorului',
        'studyFlairs.topicFlairs':'Foloseste subiecte pentru pictograme'
      }
    };

    processStudy=()=>{
    };

    _currentPage=0;
    _nextPage=1;
    _studies={};
    processStudyList=async ()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const href=$('.infinite-scroll .pager > a').attr('href');
      let page=1;
      if (href) {
        const m=/page=(\d+)/.exec(href);
        page=+m?.at(1);
        if (page>this._nextPage) {
          this._nextPage=page;
          page=this._nextPage-1;
        }
      } else if (this._nextPage) {
        page=this._nextPage;
      }
      const baseUrl=parent.global.location.pathname;
      while(this._currentPage<page) {
        const json=await parent.net.json(baseUrl+'?page='+(this._currentPage+1));
        const loadedPage=+json.paginator?.currentPage;
        if (loadedPage) {
          this._currentPage=loadedPage;
          for (const study of json.paginator.currentPageResults||[]) {
            this._studies[study.id]=study;
          }
        }
      }
      $('div.study.paginated').each((i,e)=>{
        e=$(e);
        if (e.is('.lichessTools-studyFlairs')) return;
        const studyId=e.children('a').attr('href')?.replace('/study/','');
        const study=this._studies[studyId];
        if (!study) return;
        const flairs=[];
        if (this.options.topicFlairs && study.topics) {
          for (const topic of study.topics) {
            const m=/flair\(([^\)]+)\)/.exec(topic);
            if (m?.at(1)) flairs.push(m[1]);
          }
        }
        if (this.options.authorFlair && study.owner?.flair) {
          flairs.push(study.owner.flair);
        }
        if (flairs.length) {
          e.addClass('lichessTools-studyFlairs');
          const url=lichess.asset.flairSrc(flairs[0]);
          e.find('div.top').prepend($('<img>').attr('src',url));
          if (flairs.length>1) {
            const container=$('<div class="lichessTools-bottomFlairs">')
              .appendTo(e);
            for (let i=1; i<flairs.length; i++) {
              const url=lichess.asset.flairSrc(flairs[i]);
              $('<img>')
                .attr('src',url)
                .appendTo(container);
            }
          }
        }
      });
    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const value=parent.currentOptions.getValue('studyFlairs');
      this.logOption('Study flairs', value);
      this.options={
        authorFlair: parent.isOptionSet(value,'authorFlair'),
        topicFlairs: parent.isOptionSet(value,'topicFlairs')
      };
      lichess.pubsub.off('content-loaded',this.processStudyList);
      if (!value) return;
      if (lichess.analysis?.study) {
        this.processStudy();
      } else
      if (/^\/study\b/.test(parent.global.location.pathname)&&$('.studies.list').length) {
        lichess.pubsub.on('content-loaded',this.processStudyList);
        this.processStudyList();
      }
    }

  }
  LiChessTools.Tools.StudyFlairs=StudyFlairsTool;
})();
