(() => {
  class CommentStylingTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw', 'EmitChapterChange'];

    preferences = [
      {
        name: 'commentStyling',
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
        'options.commentStyling': 'Styling for study comments',
        'commentStyleCycle': 'LiChess Tools - cycle comment style'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.commentStyling': 'Stilare pentru comentarii \u00een studii',
        'commentStyleCycle': 'LiChess Tools - schimb\u0103 stilul comentariului'
      }
    }


    getCommentNodes = (elem) => {
      const parent = this.lichessTools;
      const $ = parent.$;

      let commentNodes = [];
      $(elem).each((i, e) => {
        $(e).contents().each((i2, e2) => {
          if (e2.nodeType === 3) { //text
            commentNodes.push(e2);
          } else { //element
            const arr = this.getCommentNodes(e2);
            commentNodes.push.apply(commentNodes, arr);
          }
        });
      });
      return commentNodes;
    };

    addCommentClasses = () => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const trans = parent.translator;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;
      if (!this.options.enabled) {
        $('.study__buttons span.lichessTools-colors').remove();
        return;
      }
      if (!study.vm.mode.write) {
        $('.study__buttons span.lichessTools-colors').remove();
      } else {
        if (!$('.study__buttons span.lichessTools-colors').length) {
          const button = $('<span>')
            .attr('title', trans.noarg('commentStyleCycle'))
            .attr('data-icon', '\uE029')
            .addClass('lichessTools-colors')
            .on('click', this.cycleCommentColor)
            .insertAfter('.study__buttons span.comments');
        }
      }

      const commentNodes = this.getCommentNodes($('div.analyse__moves comment, div.gamebook .comment .content'));
      for (const node of commentNodes) {
        let pos = 0;
        let cls = null;
        const rep = [];
        const r = /cls:([^\s]*)\s*/gs;
        const text = node.textContent;
        let m = r.exec(text);
        if (!m) continue;
        while (m) {
          if (m.index > pos) {
            rep.push($('<span>').addClass(cls).text(text.slice(pos, m.index)));
          }
          cls = m[1];
          if (!cls || cls == 'none' || cls == 'clear') {
            cls = null;
          } else {
            cls = 'lichessTools-' + cls;
          }
          pos = m.index + m[0].length;
          m = r.exec(text);
        }
        if (pos < text.length) {
          rep.push($('<span>').addClass(cls).text(text.slice(pos)));
        }
        if (rep.length) {
          for (let i = rep.length - 1; i >= 0; i--) {
            $(node).after(rep[i]);
          }
          $(node).remove();
        }
      }
    }

    debouncedAddCommentClasses = this.lichessTools.debounce(this.addCommentClasses, 200);

    cycleCommentColor = (ev) => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;
      const node = analysis.node;
      const path = analysis.path;
      if (ev) ev.preventDefault();
      const classes = ['red', 'orange', 'yellow', 'green', 'lightgreen', 'cyan', 'lightblue', 'blue', 'violet', 'magenta', 'pink', 'underline', 'strikethrough', 'italic', 'bold', 'cursive', ''];

      const r = /^\s*cls:([^\s]*)\s?/;
      const myName = parent.getUserId();
      const comments = (node.comments || [])
        .filter(c => c.by?.id == myName || r.test(c.text));
      let commentText = comments.map(c => c.text).join('\r\n\r\n');
      r.lastIndex = 0;
      const m = r.exec(commentText);
      let cls = m?.at(1);
      let index = classes.indexOf(cls) + 1;
      if (index == classes.length) index = 0;
      cls = classes[index];
      commentText = (cls ? 'cls:' + cls + ' ' : '') + commentText.replace(r, '').trim();
      const chapterId = study.currentChapter()?.id;
      if (!chapterId) {
        parent.global.console.warn('Could not determine chapterId');
        return;
      }
      for (const comment of comments.filter(c => c.by?.id != myName)) {
        study.commentForm.delete(chapterId, path, comment.id)
      }
      parent.saveComment(commentText, path);
      $('#comment-text').val(commentText);
    };

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('commentStyling');
      this.logOption('Styling for study comments', value);
      this.options = { enabled: !!value };
      if (!parent.getUserId()) {
        parent.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      const lichess = parent.lichess;
      const study = lichess?.analysis?.study;
      if (!study) return;
      lichess.pubsub.off('lichessTools.redraw', this.debouncedAddCommentClasses);
      lichess.pubsub.off('analysis.change', this.debouncedAddCommentClasses);
      lichess.pubsub.off('lichessTools.chapterChange', this.debouncedAddCommentClasses);
      if (lichess.socket) {
        lichess.socket.handle = parent.unwrapFunction(lichess.socket.handle, 'commentStyling');
      }
      if (value) {
        lichess.pubsub.on('lichessTools.redraw', this.debouncedAddCommentClasses);
        lichess.pubsub.on('analysis.change', this.debouncedAddCommentClasses);
        lichess.pubsub.on('lichessTools.chapterChange', this.debouncedAddCommentClasses);
        if (lichess.socket) {
          lichess.socket.handle = parent.wrapFunction(lichess.socket.handle, {
            id: 'commentStyling',
            after: ($this, result, m) => {
              if (m.t == 'setComment') this.debouncedAddCommentClasses();
            }
          });
        }
      }
      this.addCommentClasses();
      lichess.analysis.redraw();
    }

  }
  LiChessTools.Tools.CommentStyling = CommentStylingTool;
})();
