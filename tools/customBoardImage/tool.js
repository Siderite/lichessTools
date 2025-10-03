(() => {
  class CustomBoardImageTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'customBoardImage',
        category: 'appearance',
        type: 'text',
        defaultValue: '',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.appearance': 'Appearance',
        'options.customBoardImage': 'Custom board image',
        'customBoardUrlPrompt':'Enter your board image URL',
        'invalidUrl':'Invalid URL',
        'customBoardImageUrlText':'Custom board',
        'customBoardImageUrlTitle':'LiChess Tools - custom board'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.customBoardImage': 'Tabl\u0103 personalizat\u0103',
        'customBoardUrlPrompt':'Introdu URL-ul imaginii tablei',
        'invalidUrl':'URL nevalid',
        'customBoardImageUrlText':'Tabl\u0103 personalizat\u0103',
        'customBoardImageUrlTitle':'LiChess Tools - tabl\u0103 personalizat\u0103'
      }
    }

    updateBoardImage = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      $('style#lichessTools-customBoardImage').remove();
      if (!this.options.customBoardUrl) return;
      let styleStr = `<style id="lichessTools-customBoardImage">
body.lichessTools .is2d cg-board::before {
  background-image: url(${this.options.customBoardUrl});
}
</style>`;
      $(styleStr).appendTo('head');
      this.addCustomBoard();
    };

    chooseCustomBoardImageUrl = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const list = $('#dasher_app .sub.board.d2 .list');
      if (!list.length) return;
      const url = await lt.uiApi.dialog.prompt(trans.noarg('customBoardUrlPrompt'));
      if (url && !URL.canParse(url)) {
        lt.announce(trans.noarg('invalidUrl'));
        return;
      }
      list.find('button.active').removeClass('active');
      list.find('button.lichessTools-customBoardImage').addClass('active');
      lt.currentOptions.customBoardImage = url;
      this.options.customBoardUrl = url;
      lt.saveOptions(lt.currentOptions);
      this.updateBoardImage();
    };

    addCustomBoard = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const list = $('#dasher_app .sub.board.d2 .list');
      if (!list.length) return;
      const moreButton = list.parent().find('button.more');
      moreButton
        .off('click',this.addCustomBoard)
        .on('click',this.addCustomBoard);
      const isCollapsed = moreButton.text() != '-';
      if (isCollapsed) {
        list.find('button.lichessTools-customBoardImage').remove();
      }
      list.find('button:not(.lichessTools-customBoardImage)')
        .each((i,e)=>{
          if (e._initCustomBoardImage) return;
          e._initCustomBoardImage = true;
          $(e).on('click',async ()=>{
            if (this.options.customBoardUrl) {
              this.options.customBoardUrl = null;
              lt.currentOptions.customBoardImage = null;
              lt.saveOptions(lt.currentOptions);
              this.updateBoardImage();
            }
            list.find('button.active').removeClass('active');
            $(e).addClass('active');
          });
        });
      if (isCollapsed && !this.options.customBoardUrl) return;
      if (!list.find('button.lichessTools-customBoardImage').length) {
        $('<button type="button" class="lichessTools-customBoardImage">')
          .text(trans.noarg('customBoardImageUrlText'))
          .attr('title',trans.noarg('customBoardImageUrlTitle'))
          .on('click',this.chooseCustomBoardImageUrl)
          .appendTo(list);
      }
      if (this.options.customBoardUrl) {
        list.find('button:not(.lichessTools-customBoardImage).active').removeClass('active');
        list.find('button.lichessTools-customBoardImage').toggleClassSafe('active',true);
      }
      lt.scrollIntoViewIfNeeded(list.find('button.active'));
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('customBoardImage');
      this.logOption('Custom board image', value);
      this.options = { customBoardUrl : value };

      $('#dasher_app')
        .observer()
        .off('.sub.board.d2',this.addCustomBoard);

      this.updateBoardImage();
      $('#dasher_app')
        .observer()
        .on('.sub.board.d2',this.addCustomBoard);
      this.addCustomBoard();
    }

  }
  LiChessTools.Tools.CustomBoardImage = CustomBoardImageTool;
})();
