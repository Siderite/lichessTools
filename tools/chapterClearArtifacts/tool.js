(() => {
  class ChapterClearArtifactsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['InterceptEventHandlers'];

    preferences = [
      {
        name: 'chapterClearArtifacts',
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
        'options.chapterClearArtifacts': 'Clear chapter artifacts',
        'removeAllText': 'Remove ...',
        'removeAll_commentsText': '... comments',
        'removeAll_commentsQuestion': 'Clear all comments in this chapter?',
        'removeAll_glyphsText': '... glyphs',
        'removeAll_glyphsQuestion': 'Clear all glyphs in this chapter?',
        'removeAll_shapesText': '... drawn shapes',
        'removeAll_shapesQuestion': 'Clear all drawn shapes in this chapter?',
        'removeAll_allText': '... all but PGN tags',
        'removeAll_title': 'LiChess Tools - selective removal of artifacts',
        'removeAll_tagsText': '... PGN tags',
        'removeAll_tagsQuestion': 'Clear all PGN tags for this chapter?',
        'deleteTagTitle': 'LiChess Tools - Delete %s tag'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.chapterClearArtifacts': '\u015Eterge artifacte din capitole',
        'removeAllText': '\u015Eterge ...',
        'removeAll_commentsText': '...comentariile',
        'removeAll_commentsQuestion': '\u015Eterge toate comentariile din acest capitol?',
        'removeAll_glyphsText': '...simbolurile',
        'removeAll_glyphsQuestion': '\u015Eterge toate simbolurile din acest capitol?',
        'removeAll_shapesText': '...figurile desenate',
        'removeAll_shapesQuestion': '\u015Eterge toate figurile desenate din acest capitol?',
        'removeAll_allText': '... tot \u00een afar\u0103 de etichete PGN',
        'removeAll_title': 'LiChess Tools - \u015Ftergere selectiv\u0103 de artifacte',
        'removeAll_tagsText': '... etichete PGN',
        'removeAll_tagsQuestion': '\u015Eterge toate etichetele PGN din acest capitol?',
        'deleteTagTitle': 'LiChess Tools - \u015Eterge eticheta %s'
      },
      'zh-TW': {
        'options.study': '\u7814\u7A76',
        'options.chapterClearArtifacts': '\u6E05\u9664\u7AE0\u7BC0\u4E2D\u6240\u6709\u4F7F\u7528\u8005\u6A19\u8A3B\uFF08\u7BAD\u982D\u3001\u5206\u6790\u7B49\uFF09',
        removeAllText: '\u79FB\u9664 ...',
        removeAll_commentsText: '... \u6587\u5B57\u6A19\u8A3B',
        removeAll_commentsQuestion: '\u662F\u5426\u5728\u6B64\u7AE0\u7BC0\u4E2D\u6E05\u9664\u6240\u6709\u6587\u5B57\u6A19\u8A3B\uFF1F',
        removeAll_glyphsText: '... \u5206\u6790\u6587\u5B57',
        removeAll_glyphsQuestion: '\u662F\u5426\u5728\u6B64\u7AE0\u7BC0\u4E2D\u6E05\u9664\u6240\u6709\u5206\u6790\u6587\u5B57\uFF1F',
        removeAll_shapesText: '... \u5716\u5F62\u6A19\u8A3B\uFF08\u7BAD\u982D\u4EE5\u53CA\u68CB\u76E4\u6A19\u8A3B\uFF09',
        removeAll_shapesQuestion: '\u662F\u5426\u5728\u6B64\u7AE0\u7BC0\u4E2D\u6E05\u9664\u6240\u6709\u5716\u5F62\u6A19\u8A3B\uFF1F',
        removeAll_allText: '... \u9664\u4E86 PGN \u6A19\u7C64\u5916',
        removeAll_title: 'LiChess Tools - selective removal of artifacts',
        removeAll_tagsText: '... PGN tags',
        removeAll_tagsQuestion: 'Clear all PGN tags for this chapter?',
        deleteTagTitle: 'LiChess Tools - Delete %s tag',
      }
    }

    clearTagSelect = () => {
      const parent = this.lichessTools;
      const $ = parent.$;
      $('.study__tags select.button').val('');
    };

    removeAllComments = async (node, chapterId) => {
      const parent = this.lichessTools;
      const analysis = parent.lichess.analysis;
      if (!analysis) return;
      const study = analysis.study;
      if (!study) return;
      if (!node) node = analysis.tree.root;
      if (node.path === undefined) return;
      if (!chapterId) chapterId = study.chapters.editForm.current()?.id;
      if (!chapterId) return;
      for (const comment of node.comments || []) {
        await parent.timeout(300);
        study.makeChange('deleteComment',
          {
            ch: chapterId,
            path: node.path,
            id: comment.id
          });
      }
      for (const child of node.children || []) {
        await this.removeAllComments(child, chapterId);
      }
    };
    removeAllGlyphs = async (node, chapterId) => {
      const parent = this.lichessTools;
      const analysis = parent.lichess.analysis;
      if (!analysis) return;
      const study = analysis.study;
      if (!study) return;
      if (!node) node = analysis.tree.root;
      if (node.path === undefined) return;
      if (!chapterId) chapterId = study.chapters.editForm.current()?.id;
      if (!chapterId) return;
      for (const glyph of node.glyphs || []) {
        await parent.timeout(300);
        study.makeChange('toggleGlyph',
          {
            ch: chapterId,
            path: node.path,
            id: glyph.id
          });
      }
      for (const child of node.children || []) {
        await this.removeAllGlyphs(child, chapterId);
      }
    };
    removeAllTags = async (chapterId) => {
      const parent = this.lichessTools;
      const analysis = parent.lichess.analysis;
      if (!analysis) return;
      const study = analysis.study;
      if (!study) return;
      if (!chapterId) chapterId = study.chapters.editForm.current()?.id;
      if (!chapterId) return;
      for (const tag of study.data?.chapter?.tags || []) {
        await parent.timeout(300);
        study.makeChange('setTag',
          {
            chapterId: chapterId,
            name: tag[0],
            value: ''
          });
      }
      this.clearTagSelect();
    };
    removeAllShapes = async (node, chapterId) => {
      const parent = this.lichessTools;
      const analysis = parent.lichess.analysis;
      if (!analysis) return;
      const study = analysis.study;
      if (!study) return;
      if (!node) node = analysis.tree.root;
      if (node.path === undefined) return;
      if (!chapterId) chapterId = study.chapters.editForm.current()?.id;
      if (!chapterId) return;
      if (node.shapes?.length) {
        await parent.timeout(300);
        analysis.tree.setShapes([], node.path);
        study.makeChange('shapes',
          {
            ch: chapterId,
            path: node.path,
            shapes: []
          });
      }
      for (const child of node.children || []) {
        await this.removeAllShapes(child, chapterId);
      }
    };
    setupButtons = () => {
      const parent = this.lichessTools;
      this.state = parent.traverse();
      const analysis = parent.lichess.analysis;
      const study = analysis?.study;
      if (!study) return;
      const trans = parent.translator;
      const modal = $('div.dialog-content');
      if (!modal.length) return;
      const button = $('div.form-actions-secondary.destructive button:first-child', modal);
      if (!button.length) return;
      const oldHandler = parent.getEventHandlers(button[0], 'click')[0]?.bind(button[0]);
      if (!oldHandler) {
        parent.global.console.debug('Could not find click handler!');
        return;
      }
      button.after($('<select class="lichessTools-removeAll">').attr('title', trans.noarg('removeAll_title'))
        .append($('<option>').text(trans.noarg('removeAllText')))
        .append($('<option value="comments">').text(trans.noarg('removeAll_commentsText')))
        .append($('<option value="glyphs">').text(trans.noarg('removeAll_glyphsText')))
        .append($('<option value="shapes">').text(trans.noarg('removeAll_shapesText')))
        .append($('<option value="tags">').text(trans.noarg('removeAll_tagsText')))
        .append($('<option value="all">').text(trans.noarg('removeAll_allText')))
        .on('change', async (ev) => {
          const elem = $(ev.currentTarget);
          const value = elem.val();
          switch (value) {
            case 'comments':
              if (parent.global.confirm(trans.noarg('removeAll_commentsQuestion'))) {
                elem.after(parent.spinnerHtml).remove();
                await this.removeAllComments();
              }
              break;
            case 'glyphs':
              if (parent.global.confirm(trans.noarg('removeAll_glyphsQuestion'))) {
                elem.after(parent.spinnerHtml).remove();
                await this.removeAllGlyphs();
              }
              break;
            case 'shapes':
              if (parent.global.confirm(trans.noarg('removeAll_shapesQuestion'))) {
                elem.after(parent.spinnerHtml).remove();
                await this.removeAllShapes();
                analysis.withCg(cg => {
                  cg.setShapes([]);
                  cg.redrawAll();
                });
              }
              break;
            case 'tags':
              if (parent.global.confirm(trans.noarg('removeAll_tagsQuestion'))) {
                elem.after(parent.spinnerHtml).remove();
                await this.removeAllTags();
              }
              break;
            case 'all':
              oldHandler();
              break;
          }
          study.chapters.editForm.current(null);
          study.chapters.editForm.redraw();
        })
      )
        .remove();
    };
    setupTagDelete = () => {
      const parent = this.lichessTools;
      const trans = parent.translator;
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess.analysis;
      if (!analysis) return;
      const study = analysis.study;
      if (!study) return;
      if (!study.vm.mode.write) {
        $('table.study__tags button.lichessTools-deleteTag').remove();
        return;
      }
      const tags = study.data?.chapter?.tags;
      const chapterId = study.data?.chapter?.id;
      if (!chapterId || !tags?.length) return;
      const table = $('table.study__tags');
      if (!table.length) return;
      $('th', table).each((i, e) => {
        const tagName = $(e).text();
        if (!tags.find(t => t[0] === tagName)) return;
        if ($('button.lichessTools-deleteTag', e).length) return;
        $('<button class="lichessTools-deleteTag">').text('\uE071')
          .attr('title', trans.pluralSame('deleteTagTitle', tagName))
          .on('click', ev => {
            ev.preventDefault();
            study.makeChange('setTag',
              {
                chapterId: chapterId,
                name: tagName,
                value: ''
              });
            if (tags.length == 1) this.clearTagSelect();
          })
          .prependTo(e);
      });
    };
    setupTagDeleteDebounced = this.lichessTools.debounce(this.setupTagDelete, 100);

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('chapterClearArtifacts');
      this.logOption('Clear chapter artifacts', value);
      if (!parent.getUserId()) {
        parent.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const lichess = parent.lichess;
      const $ = parent.$;
      const study = lichess?.analysis?.study;
      if (!study) return;
      study.vm.toolTab = lichessTools.unwrapFunction(study.vm.toolTab, 'chapterClearArtifacts');
      study.chapters.editForm.toggle = parent.unwrapFunction(study.chapters.editForm.toggle, 'chapterClearArtifacts');
      if (!value) {
        $('table.study__tags button.lichessTools-deleteTag').remove();
        return;
      }
      study.vm.toolTab = lichessTools.wrapFunction(study.vm.toolTab, {
        id: 'chapterClearArtifacts',
        after: ($this, result, ...args) => {
          parent.global.setTimeout(this.setupTagDeleteDebounced, 100);
        }
      });
      this.setupTagDeleteDebounced();
      study.chapters.editForm.toggle = parent.wrapFunction(study.chapters.editForm.toggle, {
        id: 'chapterClearArtifacts',
        after: ($this, result, data) => {
          const interval = parent.global.setInterval(() => {
            const currentChapterId = study.currentChapter()?.id;
            if (!currentChapterId) return;
            const studyChapterId = study.chapters?.editForm?.current()?.id;
            if (currentChapterId !== studyChapterId) return;
            const modal = $('div.dialog-content.edit-' + currentChapterId);
            if (!modal.length) return;
            parent.global.clearInterval(interval);
            this.setupButtons();
          }, 100);
        }
      });
    }

  }
  LiChessTools.Tools.ChapterClearArtifacts = ChapterClearArtifactsTool;
})();
