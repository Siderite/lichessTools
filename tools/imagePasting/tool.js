(() => {
  class ImagePastingTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'imagePasting',
        category: 'general',
        type: 'multiple',
        possibleValues: ['pasteImages', 'bigEmoji'],
        defaultValue: 'pasteImages,bigEmoji',
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.imagePasting': 'Chat/forum options',
        'imagePasting.pasteImages': 'Paste image support',
        'imagePasting.bigEmoji': 'Large one emoji message',
        'pastingError': 'There was an error generating the image URL'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.imagePasting': 'Op\u0163iuni chat/forum',
        'imagePasting.pasteImages': 'Suport lipire imagini',
        'imagePasting.bigEmoji': 'Emoji mare c\u00e2nd singur \u00een mesaj',
        'pastingError': 'A ap\u0103rut o eroare \u00een generarea URLului imaginii'
      }
    }

    isInboxOrForumPage = () => {
      const lt = this.lichessTools;
      return /\/(inbox|forum)(\/\w+|$)/i.test(lt.global.location.pathname);
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
      lt.global.console.debug('Sending image to Imgur...');
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const res = await lt.comm.send({ type: 'pasteBuffer', options: { buffer: base64 } }, undefined, 10000).catch(e => { lt.global.console.error(e); });
      lt.global.console.debug('... got reply ' + JSON.stringify(res));
      if (!res.link) {
        lt.global.console.warn('Could not send image!', res?.err);
        return;
      }
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
      if (this.options.pasteImages) {
        $('textarea.msg-app__convo__post__text, main.forum textarea#form3-text, main.forum textarea#form3-post_text')
          .each((i, e) => {
            if (e.imagePastingInit) return;
            e.imagePastingInit = true;
            $(e).on('paste drop', this.pasteImage);
          });
      }
      if (this.options.bigEmoji) {
        $('.msg-app__convo group t').each((i, e) => {
          if (e.bigEmojied) return;
          e.bigEmojied = true;
          const text = $(e).text();
          $(e).toggleClass('lichessTools-bigEmoji', text.length > 1 && [...text].length == 1);
        });
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('imagePasting');
      this.logOption('Inbox chat', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      this.options = {
        pasteImages: lt.isOptionSet(value, 'pasteImages'),
        bigEmoji: lt.isOptionSet(value, 'bigEmoji')
      };
      if (!this.isInboxOrForumPage()) return;
      lt.global.clearInterval(this.interval);
      $('textarea.msg-app__convo__post__text, main.forum textarea#form3-text, main.forum textarea#form3-post_text')
        .each((i, e) => {
          $(e).off('paste drop', this.pasteImage);
          e.imagePastingInit = false;
        });
      $('lichessTools-bigEmoji').removeClass('lichessTools-bigEmoji');
      if (this.options.pasteImages || this.options.bigEmoji) {
        this.interval = lt.global.setInterval(this.initControls, 1000);
        this.initControls();
      }
    }

  }
  LiChessTools.Tools.ImagePasting = ImagePastingTool;
})();
