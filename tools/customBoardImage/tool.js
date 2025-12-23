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
      try {
        const existingStyle = $('style#lichessTools-customBoardImage');
        const url = this.options.customBoardUrl;
        if (!url) {
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
  background-image: url("${url}");
}
</style>`;
          const initStyleStr = `<style id="lichessTools-customBoardImage">
body .is2d cg-board::before {
  background-image: url("${url}") !important;
}
</style>`;
          $(styleStr).appendTo('head');
          existingStyle.remove();
          lt.storage.set('customBoardImage-lastStyle',initStyleStr);
          this.addCustomBoard();
        }
      } finally {
        lt.tools.ThemesTool?.setBoardVariables(true);
      }
    };

    chooseCustomBoardImageUrl = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const list = $('#dasher_app .sub.board.d2 .list');
      if (!list.length) return;
      const promise = lt.uiApi.dialog.prompt(trans.noarg('customBoardUrlPrompt'),this.options.customBoardUrl||'');
      lt.comm.getData('boards.json').then(async (data)=>{
        if (!data?.data?.length) return;
        for (let i=0; i<100; i++) {
          const input = $('dialog[open] input[type="text"]');
          if (!input.length) {
            await lt.timeout(50);
            continue;
          }
          $('dialog[open]')
            .addClass('lichessTools-customBoard');
          input
            .makeCombo({ noFilter: true, ... data})
            .on('comboSelect',ev=>{
              const o = input.prop('comboSelected');
              $('body').css('--board-background',`url("${o.value}")`);
            })
            .on('change',ev=>{
              const val = input.val();
              if (!val || !URL.canParse(val)) return;
              $('body').css('--board-background',`url("${val}")`);
            })
            .on('paste',ev=>{
              const val = ev.clipboardData?.getData('text');
              if (!val || !URL.canParse(val)) return;
              $('body').css('--board-background',`url("${val}")`);
            });

          input.on('focus input', ()=>{
            input.next('.combo-list')
              .find('.combo-item')
              .each((i,e)=>{
                const o = data.data[i];
                $(e).css('--background',`url("${o.value}")`);
              });
          });

          break;
        }
      });
      const url = await promise;
      $('body').css('--board-background',null);
      if (url === null) return;
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
      if (lt.currentOptions?.enableLichessTools === false) return;
      if (!lt.currentOptions?.getValue('customBoardImage')) return;

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
      if (lt.currentOptions?.enableLichessTools === false) return;
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
