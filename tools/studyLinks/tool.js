(()=>{
  class StudyLinksTool extends LiChessTools.Tools.ToolBase {

    dependencies = [ 'EmitRedraw' ];

    preferences=[
      {
        name:'studyLinks',
        category: 'study',
        type:'multiple',
        possibleValues: ['video','studyLinksSameWindow'],
        defaultValue: 'video,studyLinksSameWindow',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.studyLinks': 'Study link options',
        'studyLinks.video': 'Video popup',
        'studyLinks.studyLinksSameWindow':'Open links to studies in same window'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.studyLinks': 'Op\u0163iuni linkuri \u00een studii',
        'studyLinks.video': 'Popup video',
        'studyLinks.studyLinksSameWindow':'Deschide linkuri la studii \u00een aceea\u015Fi fereastr\u0103'
      }
    };

    getYoutubeId=(e)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const URL=parent.global.URL;
      const href=$(e).attr('href');
      if (!href || !URL.canParse(href)) return;
      const url=URL.parse(href);
      const m = /(?:youtube(?:\.\w+)+|youtu\.be)(?:\/watch|\/embed|\/shorts|\/live|\/v|\/e|)(?:\b.*?[\?&]v=|\/|)(?<id>[^\?&#\r\n]+)/i.exec(url.toString());
      return m?.groups?.id;
    };

    getTwitchId=(e)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const URL=parent.global.URL;
      const href=$(e).attr('href');
      if (!href || !URL.canParse(href)) return;
      const url=URL.parse(href);
      const m = /twitch\.tv.*?(?:[\?&]video=|\/videos\/)(?<id>[^&\/#\r\n]+)/i.exec(url.toString());
      return m?.groups?.id;
    };

    getVimeoId=(e)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const URL=parent.global.URL;
      const href=$(e).attr('href');
      if (!href || !URL.canParse(href)) return;
      const url=URL.parse(href);
      const m = /vimeo(?:\.\w+)+(\/[^\/]+)*\/(?<id>\d+)/i.exec(url.toString());
      return m?.groups?.id;
    };

    handleVideoLinks=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      $('comment a,div.comment a').each((i,e)=>{
        if (e.handleVideoLink) return;
        if (this.getYoutubeId(e)||this.getTwitchId(e)||this.getVimeoId(e)) {
          $(e).on('click',this.handleVideoClick);
        }
        e.handleVideoLink=true;
      });
    };

    getVideoUrl=(e)=>{
      let id=this.getYoutubeId(e);
      if (id) {
        return `https://www.youtube.com/embed/${id}?state=1&amp;start=2&amp;autoplay=1&amp;autohide=0&amp;showinfo=0&amp;rel=0`;
      }
      id=this.getVimeoId(e);
      if (id) {
        return `https://player.vimeo.com/video/${id}?autoplay=1`;
      }
      id=this.getTwitchId(e);
      if (id) {
        return `https://player.twitch.tv/?video=${id}&parent=lichess.org&autoplay=true&muted=false`;
      }
    }

    handleVideoClick=(ev)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const url=this.getVideoUrl(ev.target);
      if (url) {
        ev.preventDefault();
        $('.lichessTools-video').remove();
        const dialog=parent.dialog({
          header:'',
          resizeable: true,
          html:`<iframe
  width="100%"
  height="100%" 
  frameborder="0" 
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen=""
  src="${url}"
  credentialless=""
/>`
        });
        $(dialog)
          .addClass('lichessTools-video')
          .on('close',(ev)=>$(ev.target).remove());
        const dialogPlacement=parent.storage.get('LichessTools.dialogPlacement');
        if (dialogPlacement) {
          if (dialogPlacement.left) {
            $(dialog).css('left',dialogPlacement.left);
          }
          if (dialogPlacement.top) {
            $(dialog).css('top',dialogPlacement.top);
          }
          if (dialogPlacement.width) {
            $('.dialog-content',dialog).css('width',dialogPlacement.width);
          }
          if (dialogPlacement.height) {
            $('.dialog-content',dialog).css('height',dialogPlacement.height);
          }
        };
        dialog.show();
        if (parent.inViewport(dialog)<1) {
          $(dialog).css({left:'',top:''});
          $('.dialog-content',dialog).css({width:'',height:''});
        }
      }
    };

    setDialogPlacement=(data)=>{
      const parent=this.lichessTools;
      let dialogPlacement=parent.storage.get('LichessTools.dialogPlacement')||{};
      dialogPlacement={...dialogPlacement,...data};
      parent.storage.set('LichessTools.dialogPlacement',dialogPlacement);
    };

    alterStudyLinksDirect=()=>{
      if (!this.options.studyLinksSameWindow) return;
      const parent=this.lichessTools;
      const $=parent.$;
      $('comment a[target],div.comment a[target]').each((i,e)=>{
        const href=$(e).attr('href');
        if (!/\/study\//.test(href)) return;
        $(e).removeAttr('target');
      });
    };

    alterStudyLinks=this.lichessTools.debounce(this.alterStudyLinksDirect,100);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('studyLinks');
      this.logOption('Study link options', value);
      this.options={ 
        studyLinksSameWindow:parent.isOptionSet(value,'studyLinksSameWindow'),
        video: parent.isOptionSet(value,'video')
      };
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      const study=analysis?.study;
      if (!study) return;

      lichess.pubsub.off('redraw',this.handleLinks);
      lichess.pubsub.off('setDialogSize',this.setDialogPlacement);
      lichess.pubsub.off('setDialogPosition',this.setDialogPlacement);
      $('comment a,div.comment a').off('click',this.handleVideoClick);
      if (this.options.video) {
        lichess.pubsub.on('redraw',this.handleVideoLinks);
        lichess.pubsub.on('setDialogSize',this.setDialogPlacement);
        lichess.pubsub.on('setDialogPosition',this.setDialogPlacement);
        this.handleVideoLinks();
      } else {
        $('.lichessTools-video').remove();
      }

      lichess.pubsub.off('redraw',this.alterStudyLinks);
      lichess.pubsub.off('analysis.change',this.alterStudyLinks);
      lichess.pubsub.off('chapterChange',this.alterStudyLinks);
      if (this.options.studyLinksSameWindow) {
        lichess.pubsub.on('redraw',this.alterStudyLinks);
        lichess.pubsub.on('analysis.change',this.alterStudyLinks);
        lichess.pubsub.on('chapterChange',this.alterStudyLinks);
        this.alterStudyLinks();
      }

      if (lichess.socket) {
        lichess.socket.handle=parent.unwrapFunction(lichess.socket.handle,'studyLinks');
        if (this.options.video || this.options.studyLinksSameWindow) {
          lichess.socket.handle=parent.wrapFunction(lichess.socket.handle,{
            id:'studyLinks',
            after:($this,result,m)=>{
              if (m.t=='setComment') {
                if (this.options.video) this.handleVideoLinks();
                if (this.options.studyLinksSameWindow) this.alterStudyLinks();
              }
            }
          });
        }
      }

    }

  }
  LiChessTools.Tools.StudyLinks=StudyLinksTool;
})();
