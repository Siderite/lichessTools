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

    updateBoardImage = (forced)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const existingStyle = $('style#lichessTools-customBoardImage');
      if (!this.options.customBoardUrl) {
        existingStyle.remove();
        lt.storage.remove('customBoardImage-lastStyle');
        return;
      }
      if (forced) {
        existingStyle.remove();
      } else
      if (existingStyle.length && !existingStyle.html().includes('!important')) {
        return;
      }
      if (this.options.customBoardUrl) {
        const styleStr = `<style id="lichessTools-customBoardImage">
body.lichessTools .is2d cg-board::before {
  background-image: url(${this.options.customBoardUrl});
}
</style>`;
        const initStyleStr = `<style id="lichessTools-customBoardImage">
body .is2d cg-board::before {
  background-image: url(${this.options.customBoardUrl}) !important;
}
</style>`;
        $(styleStr).appendTo('head');
        existingStyle.remove();
        lt.storage.set('customBoardImage-lastStyle',initStyleStr);
        this.addCustomBoard();
      }
      lt.tools.ThemesTool?.setBoardVariables(true);
    };

    chooseCustomBoardImageUrl = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const list = $('#dasher_app .sub.board.d2 .list');
      if (!list.length) return;
      const url = await lt.uiApi.dialog.prompt(trans.noarg('customBoardUrlPrompt'),this.options.customBoardUrl||'');
      if (url && !URL.canParse(url)) {
        lt.announce(trans.noarg('invalidUrl'));
        return;
      }
      list.find('button.active').removeClass('active');
      list.find('button.lichessTools-customBoardImage').addClass('active');
      lt.currentOptions.customBoardImage = url;
      this.options.customBoardUrl = url;
      lt.saveOptions(lt.currentOptions);
      this.updateBoardImage(true);
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
            }
            this.updateBoardImage(true);
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
    
    async init() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const options = this.options || await lt.getOptions();
      if (!options?.getValue('customBoardUrl')) return;

      const f = async (mutations)=>{
        if ($('style#lichessTools-customBoardImage').length) return;
        const styleStr = lt.storage.get('customBoardImage-lastStyle');
        if (!styleStr) return;
        $(styleStr).appendTo('head');
      };

      $('html').observer()
        .on('link[rel="stylesheet"][href*="/site."]',f,{ executeDirect: true });

      $('html').observer()
        .on('cg-board',f,{ executeDirect: true });
    }

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
