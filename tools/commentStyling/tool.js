(()=>{
  class CommentStylingTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange'];

    preferences=[
      {
        name:'commentStyling',
        category: 'study',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.commentStyling': 'Styling for study comments',
        'commentStyleCycle': 'LiChess Tools - cycle comment style'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.commentStyling': 'Stilare pentru comentarii \u00een studii',
        'commentStyleCycle': 'LiChess Tools - schimb\u0103 stilul comentariului'
      }
    }


    getCommentNodes=(elem)=>{
      let commentNodes=[];
      $(elem).each((i,e)=>{
        $(e).contents().each((i2,e2)=>{
          if (e2.nodeType===3) { //text
            commentNodes.push(e2);
          } else { //element
            const arr=this.getCommentNodes(e2);
            commentNodes.push.apply(commentNodes,arr);
          }
        });
      });
      return commentNodes;
    };

    addCommentClasses=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      const analysis=lichess?.analysis;
      const study=analysis?.study;
      if (!study) return;
      if (!parent.currentOptions.getValue('commentStyling')) {
        $('.study__buttons span.lichessTools-colors').remove();
        return;
      }
      if (!$('.study__buttons span.lichessTools-colors').length&&lichess.analysis.study.vm.mode.write) {
        const button=$('<span>')
          .attr('title',trans.noarg('commentStyleCycle'))
          .attr('data-icon','\uE029') //'\uE01E')
          .addClass('lichessTools-colors')
          .on('click',this.cycleCommentColor)
          .insertAfter('.study__buttons span.comments');
      }

      const commentNodes=this.getCommentNodes($('div.analyse__moves comment, div.gamebook .comment .content'));
      for (const node of commentNodes) {
        let pos=0;
        let cls=null;
        const rep=[];
        const r=/cls:([^\s]*)\s*/gs;
        const text=node.textContent;
        let m=r.exec(text);
        if (!m) continue;
        while (m) {     
          if (m.index>pos) {
            rep.push($('<span>').addClass(cls).text(text.slice(pos,m.index)));
          }
          cls=m[1];
          if (!cls||cls=='none'||cls=='clear') {
            cls=null;
          } else {
            cls='lichessTools-'+cls;
          }
          pos=m.index+m[0].length;
          m=r.exec(text);
        }
        if (pos<text.length) {
          rep.push($('<span>').addClass(cls).text(text.slice(pos)));
        }
        if (rep.length) {
          for (var i=rep.length-1; i>=0; i--) {
            $(node).after(rep[i]);
          }
          $(node).remove();
        }
      }
    }

    cycleCommentColor=(ev)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      if (ev) ev.preventDefault();
      const classes=['red','orange','yellow','green','lightgreen','cyan','lightblue','blue','violet','magenta','pink','underline','strikethrough','italic','bold','cursive',''];
      const myName=parent.getUserId();
      let index=(analysis.node.comments||[]).findIndex(c=>c.by.id==myName);
      let comment=index<0
        ? ''
        : analysis.node.comments[index].text;
      const m=/^\s*cls:([^\s]*)\s?/.exec(comment);
      let cls=m&&m[1];
      index=classes.indexOf(cls)+1;
      if (index==classes.length) index=0;
      cls=classes[index];
      comment=(cls?'cls:'+cls+' ':'')+comment.slice(m?m[0].length:0);
      parent.saveComment(comment);
      $('#comment-text').val(comment);
    };

    debouncedAddCommentClasses=this.lichessTools.debounce(this.addCommentClasses,200);

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('commentStyling');
      this.logOption('Styling for study comments', value);
      const lichess=parent.lichess;
      const study=lichess?.analysis?.study;
      if (!study) return;
      lichess.pubsub.off('redraw',this.debouncedAddCommentClasses);
      lichess.pubsub.off('chapterChange',this.debouncedAddCommentClasses);
      if (lichess.socket) {
        lichess.socket.handle=parent.unwrapFunction(lichess.socket.handle);
      }
      if (value) {
        lichess.pubsub.on('redraw',this.debouncedAddCommentClasses);
        lichess.pubsub.on('chapterChange',this.debouncedAddCommentClasses);
        if (lichess.socket) {
          lichess.socket.handle=parent.wrapFunction(lichess.socket.handle,{
            after:($this,result,m)=>{
              if (m.t=='setComment') this.debouncedAddCommentClasses();
            }
          });
        }
      }
      this.addCommentClasses();
      lichess.analysis.redraw();
    }

  }
  LiChessTools.Tools.CommentStyling=CommentStylingTool;
})();
