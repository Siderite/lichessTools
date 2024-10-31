(() => {
  class FullScreenTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'fullScreen',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.fullScreen': 'Easy access full screen button',
        'fullScreenTitle': 'LiChess Tools - full screen'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.fullScreen': 'Buton accesibil pentru full screen',
        'fullScreenTitle': 'LiChess Tools - full screen'
      }
    }

    handleResize = (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const isFullscreen = lt.global.screen.height == lt.global.innerHeight;
      $('header#top').toggleClass('lichessTools-fullScreen', isFullscreen);
    };

    addButton = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      if ($('div.site-buttons .lichessTools-fullScreen').length) return;
      $('<div class="lichessTools-fullScreen">').append(
        $('<button class="link">')
          .append($('<span>')
            .attr('data-icon', '\u26F6')
            .attr('title', trans.noarg('fullScreenTitle'))
          )
          .on('click', ev => {
            ev.preventDefault();
            lt.global.document.documentElement.requestFullscreen();
          })
      ).insertBefore($('div.site-buttons .dasher'));
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('fullScreen');
      this.logOption('Full screen button', value);
      $('div.lichessTools-fullScreen').remove();
      $('header#top').removeClass('lichessTools-fullScreen');
      $(lt.global).off('resize', this.handleResize);
      $('body').removeClass('lichessTools-fullScreen-enabled');
      if (!value || lt.isMobile()) return;
      $('body').addClass('lichessTools-fullScreen-enabled');
      $(lt.global).on('resize', this.handleResize);
      this.handleResize();
      this.addButton();
    }

  }
  LiChessTools.Tools.FullScreen = FullScreenTool;
})();
