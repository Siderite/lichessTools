(()=>{
  class MoveListOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange'];

    preferences=[
      {
        name:'moveListOptions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['indentedVariations','bookmarks'],
        defaultValue: false
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.moveListOptions': 'Move list options',
        'moveListOptions.indentedVariations':'Indented variations',
        'moveListOptions.bookmarks':'Bookmarks',
        'addBookmarkText':'Add/Remove bookmark',
        'addBookmarkTitle':'LiChess Tools - Add/Remove bookmark',
        'addBookmarkPrompt':'Add/Remove bookmark',
        'collapseExpandTitle':'LiChess Tools - Collapse/Expand'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.moveListOptions': 'Op\u0163iuni pentru list\u0103 mut\u0103ri',
        'moveListOptions.indentedVariations':'Varia\u0163iuni indentate',
        'moveListOptions.bookmarks':'Bookmarkuri',
        'addBookmarkText':'Adaug\u0103/Elimin\u0103 bookmark',
        'addBookmarkTitle':'LiChess Tools - Adaug\u0103/Elimin\u0103 bookmark',
        'addBookmarkPrompt':'Adaug\u0103/Elimin\u0103 bookmark',
        'collapseExpandTitle':'LiChess Tools - Colapseaz\u0103/Expandeaz\u0103'
      }
    }


    getCommentNodes=(elem)=>{
      const parent=this.lichessTools;
      const $=parent.$;

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

    getMoveElements=(elem,list)=>{
      if (!list) list=[];
      let next=$(elem).next();
      if (next.is('move.empty')) next=next.next();
      if (next.is('comment')) {
        list.push(next);
        next=next.next();
      }
      if (next.is('lines')) {
        list.push(next);
        return list;
      }
      if (next.is('interrupt')) {
        const child=next.children().eq(0);
        if (child.is('comment')) list.push(child);
        next=next.next();
      }
      while (next.length) {
        list.push(next);
        next=next.next();
      }
      return list;
    };

    collapseMove=(elem,collapse)=> {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const path=$(elem).attr('p');
      if (!path) return;
      const move=lichess.analysis.tree.nodeAtPath(path);
      if (!move) {
        console.warn('Move missing for',elem);
        return;
      }
      const bookmark=move.bookmark;
      if (collapse===undefined) {
        collapse=!bookmark.collapsed;
      }
      if (bookmark) {
        bookmark.collapsed=collapse;
      }

      $(elem).toggleClass('lichessTools-collapsed',collapse);
      const elems=this.getMoveElements(elem);
      for (const child of elems) {
        child.toggleClass('lichessTools-childCollapsed',collapse);
      }
    }

    setBookmark=(elem, bookmark)=>{
      if (!elem) return;
      const parent=this.lichessTools;
      const trans=parent.translator;
      const $=parent.$;
      if (bookmark) {
        let bookmarkElem=$('bookmark',elem);
        if (!bookmarkElem.length) {
          bookmarkElem=$('<bookmark><button></button><label></label></bookmark>')
            .prependTo(elem);
          $('button',bookmarkElem)
            .attr('title',trans.noarg('collapseExpandTitle'))
            .on('click',(ev)=>{
              ev.preventDefault();
              this.collapseMove(elem);
            });
          $(elem).addClass('lichessTools-bookmark');
        }
        $('label',bookmarkElem).text(bookmark.label);
        this.collapseMove(elem,!!bookmark.collapsed);
      } else {
        this.collapseMove(elem,false);
        $('bookmark',elem).remove();
        $(elem).removeClass('lichessTools-bookmark');
      }
    }

    setBookmarks=()=>{
      const parent=this.lichessTools;
      const r=/bkm:([^\s]+)\s*/s;

      parent.traverse(null,(node,state)=>{
        let bookmark=null;
        const comments=node.comments||[];
        for (const comment of comments) {
          const m = r.exec(comment.text);
          if (m) {
            bookmark=m[1];
            break;
          }
        }
        const elem=parent.getElementForNode(node);
        if (bookmark) {
          if (node.bookmark) {
            if (node.bookmark.label!=bookmark) {
              node.bookmark.label=bookmark;
              this.setBookmark(elem,node.bookmark);
            }
          } else {
            node.bookmark={
              label:bookmark,
              collapsed:false
            };
            this.setBookmark(elem,node.bookmark);
          }
        } else {
          if (node.bookmark) {
            node.bookmark=null;
            this.setBookmark(elem,null);
          }
        }
      });
    };

    addCommentBookmarks=()=>{
      if (!this.options.bookmarks) return;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      const study=analysis?.study;
      if (!study) return;

      this.setBookmarks();

      const commentNodes=this.getCommentNodes($('div.analyse__moves comment, div.gamebook .comment .content'));
      for (const node of commentNodes) {
        const rep=[];
        const r=/bkm:([^\s]+)\s*/s;
        const text=node.textContent;
        let m=r.exec(text);
        if (!m) continue;
        node.textContent=text.slice(0,m.index)+text.slice(m.index+m[0].length);
        const comment=$(node).closest('comment');
        comment.toggleClass('lichessTools-empty',!comment.text());
      }
    }

    debouncedAddCommentBookmarks=this.lichessTools.debounce(this.addCommentBookmarks,200);


    analysisControls=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!analysis) return;
      $('.tview2').toggleClass('lichessTools-indentedVariations',this.options.indentedVariations);
      const container=$('div.analyse__tools div.action-menu');
      if (!container.length) return;
      if (!$('.abset-extendedInteractive',container).length) {
        const html=`<div class="setting abset-extendedInteractive" title="LiChess Tools - $trans(moveListOptions.indentedVariations)">
      <div class="switch">
        <input id="abset-indentedVariations" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-indentedVariations"></label>
      </div>
      <label for="abset-indentedVariations">$trans(moveListOptions.indentedVariations)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g,m=>{
          return parent.htmlEncode(trans.noarg(m.slice(7,-1)));
        });
        $(html).insertAfter($('div.abset-inline',container).eq(0));
        $('#abset-indentedVariations')
          .on('change',async ()=>{
            const arr=[];
            const options=parent.currentOptions
            if ($('#abset-indentedVariations').is(':checked')) arr.push('indentedVariations');
            options.moveListOptions=arr.join(',');
            await parent.applyOptions(options);
            parent.fireReloadOptions();
          });
      }
      $('#abset-indentedVariations')
        .prop('checked',this.options.indentedVariations);
    };

    hashChange=()=>{
      if (!this.options.bookmarks) return;
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      if (this.hash==parent.global.location.hash) return;
      this.hash=parent.global.location.hash;
      if (!this.hash) return;
      let destinationNode=null;
      parent.traverse(null,(node,state)=>{
        if (node.bookmark?.label?.toLowerCase()==this.hash?.slice(1)?.toLowerCase()) {
          if (destinationNode) {
            parent.announce('You have multiple bookmarks with the same label: '+node.bookmark.label);
          } else {
            destinationNode=node;
          }
        }
      });
      if (destinationNode) {
        lichess.analysis.userJump(destinationNode.path);
        lichess.analysis.redraw();
      }
    };

    addOrRemoveBookmark=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const announce=parent.announce;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      const study=analysis?.study;

      const path=analysis.contextMenuPath;
      if (!path) return;
      const node=analysis.tree.nodeAtPath(path);
      if (!node) return;
      const elem=parent.getElementForNode(node);
      if (!elem) return;
      const oldLabel=node.bookmark?.label;
      const label=parent.global.prompt(trans.noarg('addBookmarkPrompt'),oldLabel)?.trim()?.replaceAll(/\s+/g,'_');
      if (label===undefined) return;
      node.bookmark=label
        ? {
            label:label,
            collapsed:node.bookmark?.collapsed||false
          }
        : null;
      this.setBookmark(elem,node.bookmark);

      const myName=parent.getUserId();
      let index=(node.comments||[]).findIndex(c=>c.by.id==myName);
      let comment=index<0
        ? ''
        : node.comments[index].text;
      const r=/bkm:([^\s]+)\s*/s;
      const m=r.exec(comment);
      comment=m
        ? comment.replace(r,label?'bkm:'+label+' ':'')
        : (label?'bkm:'+label+' ':'')+comment;
      parent.saveComment(comment,node.path);
      $('#comment-text').val(comment);
    };

    analysisContextMenu=()=>{
      if (!this.options.bookmarks);
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const announce=parent.announce;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      const study=analysis?.study;

      const menu=$('#analyse-cm');
      if (!menu.length) return;
      
      if (!this.options.bookmarks || !study?.vm.mode.write) return;
      let menuItem=$('a[data-role="bookmark"]',menu);
      if (!menuItem.length) {
        const text=trans.noarg('addBookmarkText');
        const title=trans.noarg('addBookmarkTitle');
        menuItem=$('<a>')
          .attr('data-icon','\uE062')
          .attr('data-role','bookmark')
          .text(text).attr('title',title)
          .on('click',this.addOrRemoveBookmark)
          .appendTo(menu);
      }
    }


    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('moveListOptions');
      this.logOption('Move list options', value);
      const $=parent.$;
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      this.options={
        indentedVariations:parent.isOptionSet(value,'indentedVariations'),
        bookmarks:parent.isOptionSet(value,'bookmarks')
      };
      lichess.pubsub.off('redraw',this.analysisControls);
      lichess.pubsub.on('redraw',this.analysisControls);
      lichess.analysis.actionMenu.toggle=lichessTools.unwrapFunction(lichess.analysis.actionMenu.toggle,'moveListOptions');
      lichess.analysis.actionMenu.toggle=lichessTools.wrapFunction(lichess.analysis.actionMenu.toggle,{
        id:'moveListOptions',
        after: ($this, result, ...args)=>{
          parent.global.setTimeout(this.analysisControls,100);
        }
      });
      this.analysisControls();

      lichess.pubsub.off('redraw',this.debouncedAddCommentBookmarks);
      lichess.pubsub.off('chapterChange',this.debouncedAddCommentBookmarks);
      if (lichess.socket) {
        lichess.socket.handle=parent.unwrapFunction(lichess.socket.handle,'moveListOptions');
      }
      $(window).off('hashchange',this.hashChange);
      if (this.options.bookmarks) {
        lichess.pubsub.on('redraw',this.debouncedAddCommentBookmarks);
        lichess.pubsub.on('chapterChange',this.debouncedAddCommentBookmarks);
        if (lichess.socket) {
          lichess.socket.handle=parent.wrapFunction(lichess.socket.handle,{
            id:'moveListOptions',
            after:($this,result,m)=>{
              if (m.t=='setComment') this.debouncedAddCommentBookmarks();
            }
          });
        }
        this.addCommentBookmarks();
        $(window).on('hashchange',this.hashChange);
        parent.global.setTimeout(this.hashChange,100);
      }


      lichess.pubsub.off('redraw',this.analysisContextMenu);
      if (this.options.bookmarks) {
        lichess.pubsub.on('redraw',this.analysisContextMenu);
      }

    }
  }

  LiChessTools.Tools.MoveListOptions=MoveListOptionsTool;
})();
