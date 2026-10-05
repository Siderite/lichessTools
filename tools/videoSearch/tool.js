(() => {
  class VideoSearchTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [
      {
        name: 'videoSearch',
        category: 'analysis',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.analysis': 'Analysis',
        'options.videoSearch': 'Search position in videos',
        'videoSearchButtonText': 'Videos',
        'videoSearchButtonTitle': 'LiChess Tools - search videos with current position',
        'videoSearchHeader': 'Video search',
        'chessInsightsLinkText': 'See more at ChessInsights.ai',
        'noVideosFoundText': 'No videos found'
      },
      'ro-RO': {
        'options.analysis': 'Analiz\u0103',
        'options.videoSearch': 'Caut\u0103 pozi\u0163ie \u00een video-uri',
        'videoSearchButtonText': 'Video-uri',
        'videoSearchButtonTitle': 'LiChess Tools - caut\u0103 video-uri cu pozi\u0163ia curent\u0103',
        'videoSearchHeader': 'C\u0103utare video',
        'chessInsightsLinkText': 'Mai mult la ChessInsights.ai',
        'noVideosFoundText': 'Nu s-au g\u0103sit video-uri'
      }
    }

    getVideoSearch = async (ev) => {
      ev.preventDefault();
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const lichess = lt.lichess;
      const analysis = lichess.analysis;
      const fen = analysis.node.fen;
      $('dialog.lichessTools-videoSearch').remove();
      lichess.asset.loadCssPath('bits.dialog');
      lichess.asset.loadCssPath('bits.video');
      const dialog = $('<dialog class="lichessTools-videoSearch video">')
        .append(`<form>
    <div class="close-button-anchor">
        <a class="help-button" data-icon="${lt.icon.toEntity(lt.icon.InfoCircle)}" aria-label="Help" href="https://siderite.dev/blog/lichess-tools---user-manual#videoSearch" target="_blank"></a>
        <button class="close-button" data-icon="${lt.icon.toEntity(lt.icon.X)}" aria-label="Close" formmethod="dialog" value="close"/>
    </div>
    <div class="scrollable">
        <div class="dialog-content">
        </div>
    </div>
</form>`)
        .appendTo('body');

      $('dialog .dialog-content')
        .append($('<h2>').text(trans.noarg('videoSearchHeader')))
        .append(lt.spinnerHtml)
        .append($('<a class="blurb" target="_blank">')
                   .attr('href','https://chess-insights.app/')
                   .text(trans.noarg('chessInsightsLinkText')));

      const asyncFunc = async ()=>{
        const data = await lt.api.chessinsights.getVideos(fen);
        let content = null;
        if (data?.matches?.length) {
          content = $('<div class="list box__pad">');
          for (const vid of data.matches) {
            const card = $('<a class="card" target="_blank">')
                           .attr('href',vid.url)
                           .append($('<span class="img">').css('background-image',`url(https://img.youtube.com/vi/${vid.videoId}/0.jpg)`))
                           .append($('<span class="info">')
                                     .append($('<span class="title">').text(vid.title)))
                           .append($('<span class="reveal">')
                                     .append($('<span class="full-title">').text(vid.title))
                                     .append($('<span class="author">')
                                               .append($('<a target="_blank">').attr('href',vid.channelUrl).text(vid.channel))));
            content.append(card);
          }
        } else {
          content = $('<div class="noVideos">').text(trans.noarg('noVideosFoundText'));
        }
        $(content).replaceAll($('dialog .dialog-content .spinner'));
      };
      asyncFunc();
      dialog[0].showModal();
    };

    closeDialog = (ev) => {
      if (ev && ev.keyCode != 27) return;
      ev?.preventDefault();
      const lt = this.lichessTools;
      const $ = lt.$;
      $('dialog.lichessTools-videoSearch').remove();
    };

    addButtonDirect = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lt.lichess.analysis;
      let afterAnchor = $('main.analyse .copyables .lichessTools-boardImage');
      if (!afterAnchor.length) {
        afterAnchor = $('main.analyse .copyables div.pgn');
      }
      if (!afterAnchor.length) {
        afterAnchor = $('.analyse__underboard__panels .fen-pgn > div').eq(0);
      }
      const containerAnchor = $('main.analyse .study__share .downloads');
      if (afterAnchor.length || containerAnchor.length) {
        let videoSearchLink = $('a.lichessTools-videoSearch');
        if (!videoSearchLink.length) {
          videoSearchLink = $('<a class="lichessTools-videoSearch">')
            .text(trans.noarg('videoSearchButtonText'))
            .attr('title', trans.noarg('videoSearchButtonTitle'))
            .on('click', this.getVideoSearch);
          if (afterAnchor.length) {
            videoSearchLink.insertAfter(afterAnchor);
          } else
          if (containerAnchor.length) {
            videoSearchLink
              .addClass('button text')
              .appendTo(containerAnchor);
          }
        }
      }
    };
    addButton = this.lichessTools.debounce(this.addButtonDirect, 500);

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('videoSearch');
      this.logOption('Video search', value);
      const lichess = lt.lichess;
      const analysis = lichess?.analysis;
      if (!analysis) return;
      const study = analysis.study;
      if (study) {
        study.vm.toolTab = lt.unwrapFunction(study.vm.toolTab, 'videoSearch');
      }
      lt.pubsub.off('lichessTools.redraw', this.addButton);
      if (!value) {
        $('main.analyse .copyables a.lichessTools-videoSearch').remove();
        $('div.study__share a.lichessTools-videoSearch,div.board-editor a.lichessTools-videoSearch')
          .removeClass('lichessTools-videoSearch')
          .off('click', this.getVideoSearch);
        return;
      }
      if (study) {
        study.vm.toolTab = lt.wrapFunction(study.vm.toolTab, {
          id: 'videoSearch',
          after: ($this, result, ...args) => {
            lt.global.setTimeout(this.addButton, 100);
          }
        });
      }
      lt.pubsub.on('lichessTools.redraw', this.addButton);
      this.addButton();
    }

  }
  LiChessTools.Tools.VideoSearch = VideoSearchTool;
})();
