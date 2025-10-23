(() => {
  class ChatForumBlogsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['Dialog'];

    preferences = [
      {
        name: 'chatForumBlogs',
        category: 'comm',
        type: 'multiple',
        possibleValues: ['pasteImages', 'bigEmoji', 'refreshOnMessage'],
        defaultValue: 'pasteImages,bigEmoji,refreshOnMessage',
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.comm': 'Chat, forums, blogs',
        'options.chatForumBlogs': 'Chat/forum options',
        'chatForumBlogs.pasteImages': 'Paste image support',
        'chatForumBlogs.bigEmoji': 'Large one emoji message',
        'chatForumBlogs.refreshOnMessage': 'Refresh on new message',
        'pastingError': 'There was an error generating the image URL',
        'deleteImageButtonTitle': 'LiChess Tools - delete image',
        'deleteImageQuestion': 'Are you sure you want to delete this image for everybody?',
        'imageDeletedSuccessfully': 'Image deleted'
      },
      'ro-RO': {
        'options.comm': 'Chat, forumuri, blog-uri',
        'options.chatForumBlogs': 'Op\u0163iuni chat/forum',
        'chatForumBlogs.pasteImages': 'Suport lipire imagini',
        'chatForumBlogs.bigEmoji': 'Emoji mare c\u00e2nd singur \u00een mesaj',
        'chatForumBlogs.refreshOnMessage': 'Re\uee00mprosp\u0103teaz\u0103 la mesaj nou',
        'pastingError': 'A ap\u0103rut o eroare \u00een generarea URLului imaginii',
        'deleteImageButtonTitle': 'LiChess Tools - \u015fterge imaginea',
        'deleteImageQuestion': 'Sigur \u015fterg imaginea pentru toat\u0103 lumea?',
        'imageDeletedSuccessfully': 'Imaginea a fost \u015ftears\u0103'
      }
    }

    isInboxOrForumOrProfilePage = () => {
      const lt = this.lichessTools;
      return /\/(inbox|forum|profile)(\/\w+|$)/i.test(lt.global.location.pathname);
    };

    isImage = (file) => {
      return [
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/png',
        'image/apng',
        'image/tiff'
      ].includes(file?.type);
    };

    getImageUrl = async (ev) => {
      const lt = this.lichessTools;
      const file = ev.clipboardData?.files[0] || ev.dataTransfer?.files[0]
      if (!this.isImage(file)) return;
      ev.preventDefault();
      lt.global.console.debug('Sending image to hosting service...');
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const res = await lt.comm.send({ type: 'pasteBuffer', options: { buffer: base64 } }, undefined, 10000).catch(e => { lt.global.console.error(e); });
      lt.global.console.debug('... got reply ' + JSON.stringify(res));
      if (!res?.link) {
        lt.global.console.warn('Could not send image!', res?.err);
        return;
      }
      const imageData = lt.storage.get('LiChessTools.imageData')||[];
      const key = res.link.replace(/\.(?:png|jpg|jpeg)$/,'');
      imageData.push([key,res]);
      lt.storage.set('LiChessTools.imageData', imageData, { zip:true });
      return res.link;
    };

    pasteImage = async (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const el = ev.target;
      let loader = null;
      try {
        $(el).addClass('lichessTools-imagePasting');
        loader = $('<div class="ddloader"></div>').insertAfter(el);
        const url = await this.getImageUrl(ev);
        if (!url) return;
        const [start, end] = [el.selectionStart, el.selectionEnd];
        el.setRangeText(url, start, end, 'end');
      } catch (e) {
        lt.announce(trans.noarg('pastingError'));
      } finally {
        loader.remove();
        $(el).removeClass('lichessTools-imagePasting');
      }
    };

    initControls = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      if (this.options.pasteImages) {
        $('textarea.msg-app__convo__post__text, main.forum textarea#form3-text, main.forum textarea#form3-post_text, main.forum textarea.edit-post-box, #form3-bio')
          .each((i, e) => {
            if (e.imagePastingInit) return;
            e.imagePastingInit = true;
            $(e).on('paste drop', this.pasteImage);
          });

        let imageData = null;
        const container = $('.msg-app__convo__msgs__content');
        $('group a img, .forum-post__message img',container).each((i, e) => {
          if (e._lichessTools_chat_init) return;
          e._lichessTools_chat_init = true;
          $(e).on('click',async (ev)=>{
            ev.preventDefault();
            const dlg = await lt.dialog({
              htmlText: $('<div>').append($(e).clone().addClass('lichessTools-imagePasting-image')).html()
            });
            dlg.showModal();
          });
        });
        $('group a img, .forum-post__message img, .forum-post__message a',container).each((i, e) => {
          if (e._lichessTools_imageDelete_init) return;
          e._lichessTools_imageDelete_init = true;
          const url = $(e).attr('src') || $(e).attr('href');
          if (url?.match(/imgur\.com\/[^\/\.]+\.|ibb\.co\/[^\/]+\/[^\/\.]+\./)) {
            imageData ||= new Map(lt.storage.get('LiChessTools.imageData')||[]);
            const key = url.replace(/\.(?:png|jpg|jpeg)$/,'');
            const data = imageData.get(key);
            if (data) {
              $('<button type="button" class="lichessTools-deleteImage"/>')
                .attr('title',trans.noarg('deleteImageButtonTitle'))
                .on('click',async ev=>{
                  ev.preventDefault();
                  if (await lt.uiApi.dialog.confirm(trans.noarg('deleteImageQuestion'))) {
                    const success = await lt.comm.deleteImage(data.id, data.deleteHash, data.service);
                    if (success) {
                      $(ev.target).remove();
                      imageData = new Map(lt.storage.get('LiChessTools.imageData')||[]);
                      imageData.delete(key);
                      lt.storage.set('LiChessTools.imageData', [...imageData.entries()], { zip:true });
                      lt.announce(trans.noarg('imageDeletedSuccessfully'));
                    }
                  }
                })
                .insertAfter(e);
            }
          }
        });
      }
      if (this.options.bigEmoji) {
        $('.msg-app__convo group t').each((i, e) => {
          if (e.bigEmojied) return;
          e.bigEmojied = true;
          const text = $(e).text().replace(/[\uFE00-\uFE0F\u200D\s]/g, '');
          $(e).toggleClass('lichessTools-bigEmoji', [...text].length <= 5 && /^\p{Extended_Pictographic}+$/u.test(text) );
        });
      }
      if (this.options.refreshOnMessage) {
        const moreButton = $('button.msg-app__convo__msgs__more')[0];
        if (moreButton && !moreButton.__initRefreshOnMessage) {
          moreButton.__initRefreshOnMessage = true;
          $(moreButton).on('click',()=>{
            $('.msg-app__convo__msgs__content').toggleClassSafe('lichessTools-moreButtonPressed',true);
          });
        }
      }
    };

    refreshChatDirect = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if ($('.msg-app__convo__msgs__content').is('.lichessTools-moreButtonPressed')) return;
      let scrollQ = 0;
      $('.msg-app__convo__msgs').each((i,e)=>{
        scrollQ = e.scrollTop/e.scrollHeight;
      });
      if (scrollQ<0.9) return;
      const el = $('.msg-app__side__contact.active')[0];
      if (!el) return;
      const handler = lt.getEventHandlers(el,'mousedown')[0]?.bind(el);
      if (handler) handler();
    };
    refreshChat = lichessTools.debounce(this.refreshChatDirect,3000,{ defer:true });


    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('chatForumBlogs');
      this.logOption('Inbox chat', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      this.options = {
        pasteImages: lt.isOptionSet(value, 'pasteImages'),
        bigEmoji: lt.isOptionSet(value, 'bigEmoji'),
        refreshOnMessage: lt.isOptionSet(value, 'refreshOnMessage'),
        get isSet() { return this.pasteImages || this.bigEmoji || this.refreshOnMessage },
      };
      if (!this.isInboxOrForumOrProfilePage()) return;
      lt.global.clearInterval(this.interval);
      $('textarea.msg-app__convo__post__text, main.forum textarea#form3-text, main.forum textarea#form3-post_text, main.forum textarea.edit-post-box, #form3-bio')
        .each((i, e) => {
          $(e).off('paste drop', this.pasteImage);
          e.imagePastingInit = false;
        });
      $('lichessTools-bigEmoji').removeClass('lichessTools-bigEmoji');
      if (this.options.pasteImages || this.options.bigEmoji) {
        this.interval = lt.global.setInterval(this.initControls, 1000);
        this.initControls();
      }
      $('.msg-app.pane-convo').observer()
        .off('their,mine',this.refreshChat);
      if (this.options.refreshOnMessage) {
        $('.msg-app.pane-convo').observer()
          .on('their,mine',this.refreshChat);
      }
    }

  }
  LiChessTools.Tools.ChatForumBlogs = ChatForumBlogsTool;
})();
