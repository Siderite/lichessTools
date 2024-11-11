(() => {
  class StudyLinksTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'Dialog'];

    preferences = [
      {
        name: 'studyLinks',
        category: 'study',
        type: 'multiple',
        possibleValues: ['video', 'studyLinksSameWindow'],
        defaultValue: 'video,studyLinksSameWindow',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.studyLinks': 'Study link options',
        'studyLinks.video': 'Video popup',
        'studyLinks.studyLinksSameWindow': 'Open links to studies in same window'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.studyLinks': 'Op\u0163iuni linkuri \u00een studii',
        'studyLinks.video': 'Popup video',
        'studyLinks.studyLinksSameWindow': 'Deschide linkuri la studii \u00een aceea\u015Fi fereastr\u0103'
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
      $('comment a,div.comment a').each((i, e) => {
        if (e.handleVideoLink) return;
        if (this.getYoutubeId(e) || this.getTwitchId(e) || this.getVimeoId(e)) {
          $(e).on('click', this.handleVideoClick);
          $(e).on('contextmenu', ev => ev.stopPropagation());
        }
        e.handleVideoLink = true;
      });
    };

    getVideoUrl = (e) => {
      const lt = this.lichessTools;
      let data = this.getYoutubeId(e);
      if (data) {
        return `https://www.youtube.com/embed/${data.id}?state=1&autoplay=1&autohide=0&showinfo=0&rel=0&start=${data.time}&end=${data.end}`;
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

    handleVideoClick = (ev) => {
      const lt = this.lichessTools;
      const supportsCredentialless = !!lt.global.HTMLIFrameElement?.prototype?.hasOwnProperty('credentialless');
      if (!supportsCredentialless) {
        console.warn('This browser does not support credentialless iframes. Video popups cannot work!');
        return;
      }
      const $ = lt.$;
      const url = this.getVideoUrl(ev.target);
      if (url) {
        ev.preventDefault();
        $('.lichessTools-video').remove();
        const dialog = lt.dialog({
          header: '',
          resizeable: true,
          html: `<iframe
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
      const $ = lt.$;
      $('comment a[target],div.comment a[target]').each((i, e) => {
        const href = $(e).attr('href');
        if (!e._contextMenuEnabled) {
          $(e)
            .prop('_contextMenuEnabled',true)
            .on('contextmenu',ev=>ev.stopPropagation());
        }
        if (!/\/study\//.test(href)) return;
        $(e).removeAttr('target');
      });
    };

    alterStudyLinks = this.lichessTools.debounce(this.alterStudyLinksDirect, 100);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('studyLinks');
      this.logOption('Study link options', value);
      this.options = {
        studyLinksSameWindow: lt.isOptionSet(value, 'studyLinksSameWindow'),
        video: lt.isOptionSet(value, 'video')
      };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;

      lt.pubsub.off('lichessTools.redraw', this.handleLinks);
      lt.pubsub.off('lichessTools.setDialogPlacement', this.setDialogPlacement);
      $('comment a,div.comment a').off('click', this.handleVideoClick);
      if (this.options.video) {
        lt.pubsub.on('lichessTools.redraw', this.handleVideoLinks);
        lt.pubsub.on('lichessTools.setDialogPlacement', this.setDialogPlacement);
        this.handleVideoLinks();
      } else {
        $('.lichessTools-video').remove();
      }

      lt.pubsub.off('lichessTools.redraw', this.alterStudyLinks);
      lt.pubsub.off('lichessTools.chapterChange', this.alterStudyLinks);
      if (this.options.studyLinksSameWindow) {
        lt.pubsub.on('lichessTools.redraw', this.alterStudyLinks);
        lt.pubsub.on('lichessTools.chapterChange', this.alterStudyLinks);
        this.alterStudyLinks();
      }

      if (lichess.socket) {
        lichess.socket.handle = lt.unwrapFunction(lichess.socket.handle, 'studyLinks');
        if (this.options.video || this.options.studyLinksSameWindow) {
          lichess.socket.handle = lt.wrapFunction(lichess.socket.handle, {
            id: 'studyLinks',
            after: ($this, result, m) => {
              if (m.t == 'setComment') {
                if (this.options.video) this.handleVideoLinks();
                if (this.options.studyLinksSameWindow) this.alterStudyLinks();
              }
            }
          });
        }
      }

    }

  }
  LiChessTools.Tools.StudyLinks = StudyLinksTool;
})();
