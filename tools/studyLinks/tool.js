(()=>{
  class StudyLinksTool extends LiChessTools.Tools.ToolBase {

    dependencies = [ 'EmitRedraw' ];

    preferences=[
      {
        name:'studyLinks',
        category: 'study',
        type:'multiple',
        possibleValues: ['video'],
        defaultValue: 'video',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.studyLinks': 'Study link options',
        'studyLinks.video': 'Video popup'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.studyLinks': 'Op\u0163iuni linkuri \u00een studii',
        'studyLinks.video': 'Popup video'
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
return false; // TODO vimeo URLs not supported by Lichess
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
          if (dialogPlacement.left) $(dialog).css('left',dialogPlacement.left);
          if (dialogPlacement.top) $(dialog).css('top',dialogPlacement.top);
          if (dialogPlacement.width) $('.dialog-content',dialog).css('width',dialogPlacement.width);
          if (dialogPlacement.height) $('.dialog-content',dialog).css('height',dialogPlacement.height);
        };
        dialog.show();
      }
    };

    setDialogPlacement=(data)=>{
      const parent=this.lichessTools;
      let dialogPlacement=parent.storage.get('LichessTools.dialogPlacement')||{};
      dialogPlacement={...dialogPlacement,...data};
      parent.storage.set('LichessTools.dialogPlacement',dialogPlacement);
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('studyLinks');
      this.logOption('Study link options', value);
      this.options={ 
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
      }
    }

  }
  LiChessTools.Tools.StudyLinks=StudyLinksTool;
})();
