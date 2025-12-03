(() => {
  class StudyLinksTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'Dialog'];

    preferences = [
      {
        name: 'studyLinks',
        category: 'study',
        type: 'multiple',
        possibleValues: ['video', 'studyLinksSameWindow','commentTab'],
        defaultValue: 'video,studyLinksSameWindow,commentTab',
        advanced: true
      }
    ];

    upgrades = [
      { name:'studyLinks', value:'commentTab', version: '2.4.13', type: 'new' }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.studyLinks': 'Study link options',
        'studyLinks.video': 'Video popup',
        'studyLinks.studyLinksSameWindow': 'Open links to studies in same window',
        'studyLinks.commentTab': 'Ensure comment tab in studies'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.studyLinks': 'Op\u0163iuni linkuri \u00een studii',
        'studyLinks.video': 'Popup video',
        'studyLinks.studyLinksSameWindow': 'Deschide linkuri la studii \u00een aceea\u015Fi fereastr\u0103',
        'studyLinks.commentTab': 'Asigur\u0103 tab de comentarii \u00een studii'
      }
    };

    getYoutubeId = (e) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const URL = lt.global.URL;
      const href = $(e).attr('href');
      if (!href || !URL.canParse(href)) return;
      const url = URL.parse(href);
      const m = /(?:youtube(?:\.\w+)+|youtu\.be)(?:\/watch|\/embed|\/shorts|\/live|\/v|\/e|)(?:\b.*?[\?&]v=|\/|)(?<id>[^\?&#\r\n]+)/i.exec(url.toString());
      return m ? { id: m.groups?.id, time: url.searchParams.get('t') || '', end: url.searchParams.get('e') || '' } : null;
    };

    getTwitchId = (e) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const URL = lt.global.URL;
      const href = $(e).attr('href');
      if (!href || !URL.canParse(href)) return;
      const url = URL.parse(href);
      const m = /twitch\.tv.*?(?:[\?&]video=|\/videos\/)(?<id>[^\?&\/#\r\n]+)/i.exec(url.toString());
      return m ? { id: m.groups?.id, time: url.searchParams.get('t') || '' } : null;
    };

    getVimeoId = (e) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const URL = lt.global.URL;
      const href = $(e).attr('href');
      if (!href || !URL.canParse(href)) return;
      const url = URL.parse(href);
      const m = /vimeo(?:\.\w+)+(\/[^\/]+)*\/(?<id>\d+)[^\r\n]*?(?:#t=(?<time>[\w]+))?/i.exec(url.toString());
      return m ? { id: m.groups?.id, time: m.groups?.time || '' } : null;
    };

    handleVideoLinks = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('.study__comment a, comment a,div.comment a').each((i, e) => {
        if (e.handleVideoLink) return;
        if (this.getYoutubeId(e) || this.getTwitchId(e) || this.getVimeoId(e)) {
          $(e).on('click', this.handleVideoClick);
          $(e).on('contextmenu', ev => ev.stopPropagation());
        }
        e.handleVideoLink = true;
      });
    };

    getVideoUrl = (e,forWindow) => {
      const lt = this.lichessTools;
      let data = this.getYoutubeId(e);
      if (data) {
        return forWindow
          ? `https://www.youtube.com/video/${data.id}?state=1&autoplay=1&autohide=0&showinfo=0&rel=0&t=${data.time}&e=${data.end}`
          : `https://www.youtube.com/embed/${data.id}?state=1&autoplay=1&autohide=0&showinfo=0&rel=0&start=${data.time}&end=${data.end}`;
      }
      data = this.getVimeoId(e);
      if (data) {
        return `https://player.vimeo.com/video/${data.id}?autoplay=1#t=${data.time}`;
      }
      data = this.getTwitchId(e);
      if (data) {
        return `https://player.twitch.tv/?video=${data.id}&parent=${lt.global.location.hostname}&autoplay=true&muted=false&t=${data.time}`;
      }
    }

    ensureInViewport = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const dialog = $('dialog.lichessTools-video');
      if (lt.inViewport($('.dialog-header', dialog)) < 0.5) {
        $(dialog).css({ left: '', top: '', right: '', bottom: '' });
        $('.dialog-content', dialog).css({ width: '', height: '' });
      }
    }

    handleVideoClick = async (ev) => {
      if (ev.shiftKey || ev.ctrlKey) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      let url = this.getVideoUrl(ev.target);
      if (url) {
        ev.preventDefault();
        $('.lichessTools-video').remove();
        const supportsCredentialless = !!lt.global.HTMLIFrameElement?.prototype?.hasOwnProperty('credentialless');
        if (!supportsCredentialless) {
          console.warn('This browser does not support credentialless iframes. Opening in new window.');
          url = this.getVideoUrl(ev.target, true);
          lt.comm.openWindow(url);
          return;
        }
        const dialog = await lt.dialog({
          header: '',
          noClickAway: true,
          resizeable: true,
          htmlText: `<iframe
  width="100%"
  height="100%" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation-by-user-activation"
  allow="autoplay; fullscreen; picture-in-picture"
  allowfullscreen
  loading="lazy"
  src="${url}"
  credentialless=""
/>`
        });
$(dialog).find('iframe').each((i,e)=>console.log(e.sandbox));
        $(dialog)
          .addClass('lichessTools-video')
          .on('close', (ev) => $(ev.target).remove());
        const dialogPlacement = lt.storage.get('LichessTools.dialogPlacement');
        if (dialogPlacement) {
          $(dialog).css('left', dialogPlacement.left || 'unset');
          $(dialog).css('right', dialogPlacement.right || 'unset');
          $(dialog).css('top', dialogPlacement.top || 'unset');
          $(dialog).css('bottom', dialogPlacement.bottom || 'unset');
          $('.dialog-content', dialog).css('width', dialogPlacement.width);
          $('.dialog-content', dialog).css('height', dialogPlacement.height);
        };
        dialog.show();
        this.ensureInViewport();
      }
    };

    setDialogPlacement = (data) => {
      const lt = this.lichessTools;
      lt.storage.set('LichessTools.dialogPlacement', data);
      this.ensureInViewport();
    };

    alterStudyLinksDirect = () => {
      if (!this.options.studyLinksSameWindow) return;
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;
      $('.study__comment a[target],comment a[target],div.comment a[target]').each((i, e) => {
        const href = $(e).attr('href');
        if (!e._contextMenuEnabled) {
          $(e)
            .prop('_contextMenuEnabled',true)
            .on('contextmenu',ev=>ev.stopPropagation());
        }
        let uri;
        try {
          uri = URL.canParse(href)
            ? new URL(href)
            : new URL(href, lt.global.location);
        } catch {
          lt.global.console.debug('Could not URL',href);
          return;
        }
        const m = /\/study\/(?<studyId>[^\/\?#]+)?(?:\/(?<chapterId>[^\/\?#]+))?/.exec(uri.pathname);
        if (!m) return;
        $(e).removeAttr('target');
        if (uri.origin.toLowerCase() == lt.global.location.origin.toLowerCase()
              && !uri.searchParams?.size
              && !uri.hash
              && m.groups?.studyId == study.data?.id
              && m.groups?.chapterId) {
          $(e).on('click',ev=>{
            ev.preventDefault();
            study.setChapter(m.groups.chapterId);
          });
        }
      });
    };

    alterStudyLinks = this.lichessTools.debounce(this.alterStudyLinksDirect, 100);

    countComments = ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;
      const count = analysis.node.comments?.length || 0;
      $('span.comments count').attrSafe('data-count',count || null);
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('studyLinks');
      this.logOption('Study link options', value);
      this.options = {
        studyLinksSameWindow: lt.isOptionSet(value, 'studyLinksSameWindow'),
        video: lt.isOptionSet(value, 'video'),
        commentTab: lt.isOptionSet(value, 'commentTab')
      };
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;

      lt.pubsub.off('lichessTools.redraw', this.handleLinks);
      lt.pubsub.off('lichessTools.setDialogPlacement', this.setDialogPlacement);
      $('.study__comment a,comment a,div.comment a').off('click', this.handleVideoClick);
      if (this.options.video) {
        lt.pubsub.on('lichessTools.redraw', this.handleVideoLinks);
        lt.pubsub.on('lichessTools.setDialogPlacement', this.setDialogPlacement);
        this.handleVideoLinks();
      } else {
        $('.lichessTools-video').remove();
      }

      lt.pubsub.off('lichessTools.commentChange', this.alterStudyLinks);

      lt.pubsub.off('lichessTools.redraw', this.alterStudyLinks);
      lt.pubsub.off('lichessTools.chapterChange', this.alterStudyLinks);
      if (this.options.studyLinksSameWindow) {
        lt.pubsub.on('lichessTools.redraw', this.alterStudyLinks);
        lt.pubsub.on('lichessTools.chapterChange', this.alterStudyLinks);
      }

      lt.pubsub.off('lichessTools.commentChange', this.handleVideoLinks);
      if (this.options.video || this.options.studyLinksSameWindow) {
        lt.pubsub.on('lichessTools.commentChange', this.handleVideoLinks);
        lt.pubsub.on('lichessTools.commentChange', this.alterStudyLinks);
        this.alterStudyLinks();
      }
      lt.uiApi.events.off('analysis.change',this.countComments);
      if (this.options.commentTab) {
        const anchorElem = $('span.tags:not(:has(+span.comments))');
        if (anchorElem.length) {
          $('<span class="lichessTools-comments comments" role="tab">')
            .attr('title',lt.global.i18n?.study?.commentThisPosition)
            .append('<count class="data-count">')
            .append($('<i>').attr('data-icon',lt.icon.BubbleSpeech))
            .on('click',()=>{
              study.vm.toolTab('comments');
              lt.analysisRedraw();
            })
            .insertAfter(anchorElem);
          lt.analysisRedraw();
        }
        lt.uiApi.events.on('analysis.change',this.countComments);
        this.countComments();
      }

    }

  }
  LiChessTools.Tools.StudyLinks = StudyLinksTool;
})();
