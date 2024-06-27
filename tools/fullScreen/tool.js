(()=>{
  class FullScreenTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'fullScreen',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.fullScreen': 'Easy access full screen button',
        'fullScreenTitle': 'LiChess Tools - full screen'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.fullScreen': 'Buton accesibil pentru full screen',
        'fullScreenTitle': 'LiChess Tools - full screen'
      }
    }

    handleResize=(ev)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const isFullscreen=parent.global.screen.height==parent.global.innerHeight;
      $('header#top').toggleClass('lichessTools-fullScreen',isFullscreen);
    };

    addButton=()=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      const $=parent.$;
      if ($('div.site-buttons .lichessTools-fullScreen').length) return;
      $('<div class="lichessTools-fullScreen">').append(
        $('<button class="link">')
          .append($('<span>')
                    .attr('data-icon','\u26F6')
                    .attr('title',trans.noarg('fullScreenTitle'))
          )
          .on('click',ev=>{
            ev.preventDefault();
            parent.global.document.documentElement.requestFullscreen();
          })
      ).insertBefore($('div.site-buttons .dasher'));
    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const value=parent.currentOptions.getValue('fullScreen');
      this.logOption('Full screen button', value);
      $('div.lichessTools-fullScreen').remove();
      $('header#top').removeClass('lichessTools-fullScreen');
      $(parent.global).off('resize', this.handleResize);
      if (!value || parent.isMobile()) return;
      $(parent.global).on('resize', this.handleResize);
      this.handleResize();
      this.addButton();
    }

  }
  LiChessTools.Tools.FullScreen=FullScreenTool;
})();
