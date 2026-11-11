(() => {
  class CustomBoardImageTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'customBoardImage',
        category: 'appearance',
        type: 'text',
        defaultValue: '',
        offValue: '',
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
        'customBoardImageUrlTitle':'LiChess Tools - custom board',
        'uploadBoardButtonText': 'Upload',
        'notAnImageError': 'Not an image!',
        'imageFiles': 'Image files',
        'uploadedImage': 'Uploaded image'
      },
      'ro-RO': {
        'options.appearance': 'Aspect',
        'options.customBoardImage': 'Tabl\u0103 personalizat\u0103',
        'customBoardUrlPrompt':'Introdu URL-ul imaginii tablei',
        'invalidUrl':'URL nevalid',
        'customBoardImageUrlText':'Tabl\u0103 personalizat\u0103',
        'customBoardImageUrlTitle':'LiChess Tools - tabl\u0103 personalizat\u0103',
        'uploadBoardButtonText': '\u00cencarc\u0103',
        'notAnImageError': 'Nu e imagine!',
        'imageFiles': 'Imagini',
        'uploadedImage': 'Imagine \u00eenc\u0103rcat\u0103'
      }
    }

    // Uploaded images can be several hundred KB of base64; that blows through the
    // currentOptions/localStorage budget. Anything above this threshold goes to
    // IndexedDB under idbKey, and currentOptions keeps only the raw intl key
    // uploadedImagePlaceholder as the persisted value. Consumers map that sentinel
    // through this.uploadedImage (loaded once per start) so a missing or corrupt
    // blob behaves like "no image set".
    idbOptions = { db: true, raw: true };
    uploadedImageKey = 'lichessTools/LT/customBoardImage-upload';
    uploadedImageThreshold = 50000;
    // The persisted option value; kept as the raw intl key so language switches
    // still map currentOptions.customBoardImage back to the IndexedDB blob.
    uploadedImagePlaceholder = 'uploadedImage';
    uploadedImage = null;

    isValidImageDataUrl = (url) => typeof url === 'string' && url.startsWith('data:image/');

    // Sentinel must be the raw intl key (this.uploadedImagePlaceholder = 'uploadedImage')
    // so persisting across language changes still maps currentOptions to the blob. Only
    // the combo entry label is translated for display.
    resolveBoardUrlSync = (url) => url === this.uploadedImagePlaceholder ? this.uploadedImage : url;

    // Async variant used by cross-tool callers (ThemesTool) that may run before
    // our own init/start has had a chance to prime this.uploadedImage from IndexedDB.
    // Reuses the in-memory cache when populated; otherwise reads the blob once.
    resolveBoardUrl = async (url) => {
      if (url !== this.uploadedImagePlaceholder) return url;
      if (this.uploadedImage) return this.uploadedImage;
      return await this.loadUploadedImage();
    };

    previewCssValue = (url) => {
      const resolved = url === this.uploadedImagePlaceholder ? this.uploadedImage : url;
      return resolved ? `url("${resolved}")` : 'none';
    };

    loadUploadedImage = async () => {
      const lt = this.lichessTools;
      this.uploadedImage = null;
      try {
        const stored = await lt.storage.get(this.uploadedImageKey, this.idbOptions);
        if (this.isValidImageDataUrl(stored)) this.uploadedImage = stored;
      } catch (e) {
        lt.global.console.debug('customBoardImage load failed: '+(e?.name ?? e)+' '+e?.message);
      }
      return this.uploadedImage;
    };

    saveUploadedImage = async (dataUrl) => {
      const lt = this.lichessTools;
      try {
        await lt.storage.set(this.uploadedImageKey, dataUrl, this.idbOptions);
        this.uploadedImage = dataUrl;
        return true;
      } catch (e) {
        lt.global.console.debug('customBoardImage save failed: '+(e?.name ?? e)+' '+e?.message);
        return false;
      }
    };

    clearUploadedImage = async () => {
      const lt = this.lichessTools;
      this.uploadedImage = null;
      try { await lt.storage.remove(this.uploadedImageKey, this.idbOptions); } catch(e){}
    };

    updateBoardImage = (forced)=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      try {
        const existingStyle = $('style#lichessTools-customBoardImage');
        const url = this.options.customBoardUrl;
        const resolved = url ? this.resolveBoardUrlSync(url) : null;
        if (!resolved) {
          existingStyle.remove();
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
  background-image: url("${resolved}");
}
</style>`;
          $(styleStr).appendTo('head');
          existingStyle.remove();
          this.addCustomBoard();
        }
      } finally {
        lt.tools.ThemesTool?.setBoardVariables(true);
      }
    };

    isImageFile = (file) => [
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/png',
      'image/apng',
      'image/tiff',
      'image/webp',
      'image/svg+xml',
      'image/jpgx',
      'image/avif'
    ].includes(file?.type);

    fileToDataUrl = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    pickBoardImageFile = async () => {
      // The picker the Upload button offers: File System Access picker when the browser has one,
      // otherwise the browse dialog a clicked <input type=file> opens - the same idiom the chat
      // upload button uses, and the browse dialog is what mobile browsers answer with.
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (lt.global.showOpenFilePicker) {
        try {
          const handles = await lt.global.showOpenFilePicker({
            id: 'lt-customBoardImage-upload',
            multiple: false,
            startIn: 'pictures',
            types: [{
              description: trans.noarg('imageFiles'),
              accept: { 'image/*': ['.png','.jpg','.jpeg','.gif','.webp','.tif','.tiff','.apng','.svg','.jpgx','.avif'] }
            }],
          });
          const file = await handles?.[0]?.getFile();
          return file instanceof Blob ? file : null;
        } catch (e) {
          const reason = e?.type || e?.name || '';
          lt.global.console.debug('File picker closed: '+reason+' '+e?.message);
          if (/AbortError/.test(reason)) return null;
        }
      }
      const files = await new Promise((resolve) => {
        $('<input type="file" accept="image/*"/>')
          .on('change cancel',(e)=>resolve(e.target?.files ?? []))
          .trigger('click');
      });
      return Array.from(files ?? []).find((file)=>file instanceof Blob) ?? null;
    };

    chooseCustomBoardImageUrl = async ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const list = $('#dasher_app .sub.board.d2 .list');
      if (!list.length) return;
      // The persisted option value stays the raw intl key so switching the UI
      // language later still maps currentOptions.customBoardImage to the blob.
      // Only the combo display text is translated.
      const placeholder = this.uploadedImagePlaceholder;
      let pendingUploadedImage = null;
      const promise = lt.uiApi.dialog.prompt(trans.noarg('customBoardUrlPrompt'),this.options.customBoardUrl||'');
      lt.comm.getData('boards.json').then(async (data)=>{
        if (!data?.data?.length) return;
        for (let i=0; i<100; i++) {
          const input = $('dialog[open] input[type="text"]');
          if (!input.length) {
            await lt.timeout(50);
            continue;
          }
          const openDialog = $('dialog[open]');
          openDialog.addClass('lichessTools-customBoard');
          // Augment the boards.json combo with a synthetic item whose value is
          // the sentinel. Users can arrow/click/type it; every path resolves
          // through previewCssValue and the sentinel is skipped by the canParse
          // guard in the change/paste listeners.
          input
            .makeCombo({ 
               noFilter: false,
               showAllOnEmpty: true,
               ... data,
               data: [...data.data, { text: trans.noarg('uploadedImage'), value: placeholder }],
            })
            .on('comboSelect',ev=>{
              const o = input.prop('comboSelected');
              $('body').css('--board-background', this.previewCssValue(o?.value ?? o));
            })
            .on('change',ev=>{
              const val = input.val();
              if (!val) return;
              if (val !== placeholder && !URL.canParse(val)) return;
              $('body').css('--board-background', this.previewCssValue(val));
            })
            .on('paste',ev=>{
              const val = ev.clipboardData?.getData('text');
              if (!val) return;
              if (val !== placeholder && !URL.canParse(val)) return;
              $('body').css('--board-background', this.previewCssValue(val));
            });

          input.on('focus input', ()=>{
            const filtered = input.prop('comboFiltered') || input.prop('combo')?.data;
            input.next('.combo-list')
              .find('.combo-item')
              .each((i,e)=>{
                const o = filtered[i];
                $(e).css('--background', this.previewCssValue(o?.value ?? o));
              });
          });

          const uploadHost = openDialog.find('.dialog-content');
          if (uploadHost.length && !uploadHost.find('.lichessTools-customBoardUploadButton').length) {
            const uploadButton = $('<button class="button button-empty lichessTools-customBoardUploadButton">')
              .text(trans.noarg('uploadBoardButtonText'))
              .on('click', async ()=>{
                if (!openDialog.prop('open')) return;
                const file = await this.pickBoardImageFile();
                if (!this.isImageFile(file)) {
                  lt.announce(trans.noarg('notAnImageError'));
                  return;
                }
                const dataUrl = await this.fileToDataUrl(file);
                if (!dataUrl || !openDialog.prop('open')) return;
                $('body').css('--board-background',`url("${dataUrl}")`);
                if (dataUrl.length > this.uploadedImageThreshold) {
                  // Prime the in-memory cache before input.val(placeholder) so
                  // the change-listener's previewCssValue renders the same blob
                  // the raw preview showed. If the IndexedDB write fails after
                  // the prompt closes, the cache is reset and options stay put.
                  pendingUploadedImage = dataUrl;
                  this.uploadedImage = dataUrl;
                  input.val(placeholder);
                } else {
                  pendingUploadedImage = null;
                  input.val(dataUrl);
                }
              })
              .insertBefore('button.ok');
          }

          break;
        }
      });
      const url = await promise;
      $('body').css('--board-background',null);
      if (url === null) return;
      if (url === placeholder) {
        if (pendingUploadedImage) {
          if (!await this.saveUploadedImage(pendingUploadedImage)) {
            // IndexedDB still holds the prior blob (if any); reload the cache
            // so the in-memory state matches what a page refresh would show.
            await this.loadUploadedImage();
            lt.announce(trans.noarg('notAnImageError'));
            return;
          }
        } else if (!this.uploadedImage) {
          // The combo entry was chosen but no blob is in IndexedDB either; leave
          // currentOptions untouched so the user is effectively Cancelled.
          return;
        }
      } else {
        await this.clearUploadedImage();
        if (url && !URL.canParse(url)) {
          lt.announce(trans.noarg('invalidUrl'));
          return;
        }
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
              await this.clearUploadedImage();
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
      if (this.resolveBoardUrlSync(this.options.customBoardUrl)) {
        list.find('button:not(.lichessTools-customBoardImage).active').removeClass('active');
        list.find('button.lichessTools-customBoardImage').toggleClassSafe('active',true);
      }
      lt.scrollIntoViewIfNeeded(list.find('button.active'));
    };
    
    async init() {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (lt.currentOptions?.enableLichessTools === false) return;
      const value = lt.currentOptions?.getValue('customBoardImage');
      if (!value) return;
      if (value === this.uploadedImagePlaceholder) {
        // Load the IndexedDB blob before observers can fire so resolveBoardUrlSync
        // stays synchronous. A missing or corrupt blob leaves this.uploadedImage at
        // null and the observer below skips the style injection.
        await this.loadUploadedImage();
      }

      const f = (mutations)=>{
        if ($('style#lichessTools-customBoardImage').length) return;
        const current = lt.currentOptions?.getValue('customBoardImage');
        const resolved = current ? this.resolveBoardUrlSync(current) : null;
        if (!resolved) return;
        const styleStr = `<style id="lichessTools-customBoardImage">
body .is2d cg-board::before {
  background-image: url("${resolved}") !important;
}
</style>`;
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
      if (value === this.uploadedImagePlaceholder) {
        await this.loadUploadedImage();
      } else {
        this.uploadedImage = null;
      }

      $('#dasher_app')
        .observer()
        .off('.sub.board.d2',this.addCustomBoard);

      this.updateBoardImage();

      if (lt.currentOptions?.enableLichessTools === false) {
        $('.lichessTools-customBoardImage').remove();
        return;
      }
      $('#dasher_app')
        .observer()
        .on('.sub.board.d2',this.addCustomBoard);
      this.addCustomBoard();
    }

  }
  LiChessTools.Tools.CustomBoardImage = CustomBoardImageTool;
})();
