(() => {
  class CommentEditingTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'commentEditing',
        category: 'study',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.commentEditing': 'Improved editing for study comments',
        'editCommentTitle': 'Copy and edit',
        'deleteCommentQuestion': 'Delete %s\'s comment?'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.commentEditing': 'Editare mai bun\u0103 a comentariilor \u00een studii',
        'editCommentTitle': 'Copiaz\u0103 \u015fi modific\u0103',
        'deleteCommentQuestion': '\u015Eterg comentariul de la %s?'
      }
    }

    addEditButton = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const analysis = lt.lichess.analysis;
      $('.study__comment:has(a.edit):not(:has(a.lichessTools-commentEditing))')
        .each((i,e)=>{
          $('<a class="lichessTools-commentEditing">')
            .attr('data-icon',lt.icon.DownwardsWhiteArrow)
            .attr('title',trans.noarg('editCommentTitle'))
            .on('click',(ev)=>{
              ev.preventDefault();
              const comment = (analysis.node.comments || []).find(c=>[...e.classList].includes(c.id));
              if (!comment) return;
              const textarea = $('textarea#comment-text');
              let text = textarea.val().trim();
              if (text) text+='\r\n\r\n';
              text+=comment.text;
              textarea
                .val(text)
                .trigger('input');
              const chapterId = analysis.study.currentChapter().id;
              const path = analysis.path;
              analysis.study.commentForm.delete(chapterId, path, comment.id);
            })
            .prependTo(e);
        });
      $('.study__comment a[data-icon="'+lt.icon.Trash+'"]')
        .each((i,e)=>{
          if (e._initTrash) return;
          e._initTrash = true;
          $(e).addClass('lichessTools-deleteComment');
          lt.removeEventHandlers(e,'click');
          $(e).on('click',async (ev)=>{
            ev.preventDefault();
            const commentElem = $(e).closest('.study__comment')[0];
            const comment = (analysis.node.comments || []).find(c=>[...commentElem.classList].includes(c.id));
            if (!comment) return;
            if (!ev.shiftKey) {
              const confirmDelete = await lt.uiApi.dialog.confirm(trans.pluralSame('deleteCommentQuestion', comment.by));
              if (!confirmDelete) return;
            }
            const chapterId = analysis.study.currentChapter().id;
            const path = analysis.path;
            analysis.study.commentForm.delete(chapterId, path, comment.id);
          });
        });
    };

    alterModifierText = (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('.lichessTools-deleteComment')
        .toggleClassSafe('shiftPressed',!!ev.shiftKey)
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('commentEditing');
      this.logOption('Comment editing', value);
      this.options = { enabled: !!value };
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const lichess = lt.lichess;
      const study = lichess?.analysis?.study;
      if (!study) return;
      $.cached('body').off('keydown keyup', this.alterModifierText);

      $('.analyse__underboard').observer()
        .off('.study__comments,.study__comment',this.addEditButton);
      if (value) {
        $.cached('body').on('keydown keyup', this.alterModifierText);

        $('.analyse__underboard').observer()
          .on('.study__comments,.study__comment',this.addEditButton);
      }
      this.addEditButton();
    }

  }
  LiChessTools.Tools.CommentEditing = CommentEditingTool;
})();
