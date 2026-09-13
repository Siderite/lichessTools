(() => {
  class BlogAutosaveTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'blogAutosave',
        category: 'comm',
        type: 'multiple',
        possibleValues: ['autosave', 'savebutton'],
        defaultValue: 'savebutton',
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.comm': 'Chat, forums, blogs',
        'options.blogAutosave': 'Blog editing options',
        'blogAutosave.autosave': 'Auto save',
        'blogAutosave.savebutton': 'Save button',
        'blogSaved': 'Blog saved',
        'blogSave': 'Save',
        'errorSavingBlogMessage': 'Error saving - check content and captcha'
      },
      'ro-RO': {
        'options.comm': 'Chat, forumuri, blog-uri',
        'options.blogAutosave': 'Op\u0163iuni editare blog',
        'blogAutosave.autosave': 'Salvare automat\u0103',
        'blogAutosave.savebutton': 'Buton salvare',
        'blogSaved': 'Blog salvat',
        'blogSave': 'Salveaz\u0103',
        'errorSavingBlogMessage': 'Eroare la salvare - verific\u0103 con\u0163inutul \u015fi captcha'
      }
    }

    checkValidityDirect = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const titleElem = $('#form3-title');
      const title = titleElem.val();
      const titleValid = title && title.length>=3 && title.length<=80;
      titleElem.toggleClassSafe('lichessTools-invalid',!titleValid);
      const introElem = $('#form3-intro');
      const intro = introElem.val();
      const introValid = intro && intro.length<=1000;
      introElem.toggleClassSafe('lichessTools-invalid',!introValid);
      const contentElem = $('.toastui-editor');
      const content = $('#form3-markdown').val();
      const contentValid = !!content;
      contentElem.toggleClassSafe('lichessTools-invalid',!contentValid);
      const captchaElem = $('.captcha cg-board');
      const captcha = $('input[name="move"]').val();
      const captchaValid = captcha && !$('.captcha').is('.failure');
      captchaElem.toggleClassSafe('lichessTools-invalid',!captchaValid);
      return titleValid && introValid && contentValid && captchaValid;
    }
    checkValidity = this.lichessTools.debounce(this.checkValidityDirect,500);

    saveBlog = async (forced) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const form = $('form.ublog-post-form__main');
      if (!form.length) return;
      if (!this.checkValidityDirect()) {
        $('body').toggleClassSafe('lichessTools-blogSaveError',true);
        return;
      }
      if (!forced && form.find('[name="live"]').is(':checked')) return;
      const content = $('#form3-markdown').val();
      if (!content) return;
      const arr = form
        .find('input,textarea,select')
        .get()
        .map(e => {
          e = $(e);
          return {
            name: e.attr('name'),
            value: e.is('[type=checkbox]') ? e.is(':checked') : e.val()
          };
        })
        .filter(a => !!a.name);
      const bodyContent = arr.map(a => a.name + '=' + lt.global.encodeURIComponent(a.value)).join('&');
      if (!forced && bodyContent == this.lastSave) return;
      try {
        $('body').addClass('lichessTools-blogAutosave');
        await lt.api.blog.save(this.blogId, arr);
        $('body').toggleClassSafe('lichessTools-blogSaveError',false);
      } catch(e) {
        if (forced) {
          lt.announce(trans.noarg('errorSavingBlogMessage'));
        } else {
          $('body').toggleClassSafe('lichessTools-blogSaveError',true);
        }
      } finally {
        lt.global.setTimeout(() => $('body').removeClass('lichessTools-blogAutosave'), 2000);
      }
      this.lastSave = bodyContent;
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('blogAutosave');
      this.logOption('Blog autosave', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      this.options = {
        autosave: lt.isOptionSet(value, 'autosave'),
        savebutton: lt.isOptionSet(value, 'savebutton'),
      };
      if (!lt.location.isBlogEdit()) return;
      this.blogId = lt.location.getBlogId();
      const $ = lt.$;
      const trans = lt.translator;
      lt.global.clearTimeout(this.interval);
      lt.global.removeEventListener('beforeunload', this.saveBlog);
      $('p.lichessTools-saved').remove();
      $('div.form-actions button.lichessTools-blogAutosave').remove();
      if (this.options.autosave) {
        this.interval = lt.global.setInterval(this.saveBlog, 30000);
        lt.global.addEventListener('beforeunload', this.saveBlog);
      }
      if (this.options.savebutton) {
        $('<button class="button lichessTools-blogAutosave">')
          .attr('data-icon', lt.icon.FloppyDisk)
          .text(trans.noarg('blogSave'))
          .on('click', ev => {
            ev.preventDefault();
            this.saveBlog(true);
          })
          .insertBefore('form.ublog-post-form__main div.form-actions button[type=submit]');
      }
      $('input, textarea, [contenteditable="true"]').off('input change',this.checkValidity);
      if (this.options.autosave || this.options.savebutton) {
        $('input, textarea, [contenteditable="true"]').on('input change',this.checkValidity);
      }
      if (value) {
        $('<p class="lichessTools-saved">')
          .attr('data-icon', lt.icon.Checkmark)
          .text(trans.noarg('blogSaved'))
          .appendTo('form.ublog-post-form__main');
      }
    }

  }
  LiChessTools.Tools.BlogAutosave = BlogAutosaveTool;
})();
