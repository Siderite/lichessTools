(() => {
  class BlogAutosaveTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'blogAutosave',
        category: 'general',
        type: 'multiple',
        possibleValues: ['autosave', 'savebutton'],
        defaultValue: 'savebutton',
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.blogAutosave': 'Blog editing options',
        'blogAutosave.autosave': 'Auto save',
        'blogAutosave.savebutton': 'Save button',
        'blogSaved': 'Blog saved',
        'blogSave': 'Save'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.blogAutosave': 'Op\u0163iuni editare blog',
        'blogAutosave.autosave': 'Salvare automat\u0103',
        'blogAutosave.savebutton': 'Buton salvare',
        'blogSaved': 'Blog salvat',
        'blogSave': 'Salveaz\u0103'
      }
    }

    saveBlog = async (forced) => {
      const parent = this.lichessTools;
      const $ = parent.$;
      const form = $('form.ublog-post-form__main');
      if (!form.length) return;
      if (!forced && form.find('[name="live"]').is(':checked')) return;
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
      const bodyContent = arr.map(a => a.name + '=' + parent.global.encodeURIComponent(a.value)).join('&');
      if (!forced && bodyContent == this.lastSave) return;
      try {
        $('body').addClass('lichessTools-blogAutosave');
        await parent.api.blog.save(this.blogId, arr);
      } finally {
        parent.global.setTimeout(() => $('body').removeClass('lichessTools-blogAutosave'), 2000);
      }
      this.lastSave = bodyContent;
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('blogAutosave');
      this.logOption('Blog autosave', value);
      if (!parent.getUserId()) {
        parent.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      this.options = {
        autosave: parent.isOptionSet(value, 'autosave'),
        savebutton: parent.isOptionSet(value, 'savebutton'),
      };
      const isBlogEdit = /^\/ublog\/(?<blogId>[^\/]+)\/edit/.exec(parent.global.location.pathname);
      if (!isBlogEdit) return;
      this.blogId = isBlogEdit.groups.blogId;
      const $ = parent.$;
      const trans = parent.translator;
      parent.global.clearTimeout(this.interval);
      parent.global.removeEventListener('beforeunload', this.saveBlog);
      $('p.lichessTools-saved').remove();
      $('div.form-actions button.lichessTools-blogAutosave').remove();
      if (this.options.autosave) {
        this.interval = parent.global.setInterval(this.saveBlog, 30000);
        parent.global.addEventListener('beforeunload', this.saveBlog);
      }
      if (this.options.savebutton) {
        $('<button class="button lichessTools-blogAutosave">')
          .attr('data-icon', '\uD83D\uDCBE')
          .text(trans.noarg('blogSave'))
          .on('click', ev => {
            ev.preventDefault();
            this.saveBlog(true);
          })
          .insertBefore('form.ublog-post-form__main div.form-actions button[type=submit]');
      }
      if (value) {
        $('<p class="lichessTools-saved">')
          .attr('data-icon', '\uE038')
          .text(trans.noarg('blogSaved'))
          .appendTo('form.ublog-post-form__main');
      }
    }

  }
  LiChessTools.Tools.BlogAutosave = BlogAutosaveTool;
})();
