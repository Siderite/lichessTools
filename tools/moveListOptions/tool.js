(()=>{
  class MoveListOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw','EmitChapterChange','DetectThirdParties','GamebookPlayClass'];

    preferences=[
      {
        name:'moveListOptions',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['indentedVariations','bookmarks','fullWidthAnalysis','hideLeftSide','analysisPopup','fixCevalToggle'],
        defaultValue: 'bookmarks'
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.moveListOptions': 'Move list options',
        'moveListOptions.indentedVariations':'Indented variations',
        'moveListOptions.bookmarks':'Bookmarks',
        'moveListOptions.fullWidthAnalysis':'Expanded move list',
        'moveListOptions.hideLeftSide':'Hide left side',
        'moveListOptions.analysisPopup':'Open in new window',
        'moveListOptions.fixCevalToggle':'Eval button on the right',
        'addBookmarkText':'Add/Remove bookmark',
        'addBookmarkTitle':'LiChess Tools - Add/Remove bookmark',
        'addBookmarkPrompt':'Add/Remove bookmark',
        'collapseExpandTitle':'LiChess Tools - Collapse/Expand',
        'URLCopiedToClipboard': 'URL copied to clipboard',
        'clipboardDenied':'Clipboard access denied',
        'getBookmarkUrlText':'Get bookmark link',
        'getBookmarkUrlTitle':'LiChess Tools - get bookmark link',
        'collapseAllText':'Collapse all bookmarks',
        'collapseAllTitle':'LiChess Tools - Collapse all bookmarks',
        'expandAllText':'Expand all bookmarks',
        'expandAllTitle':'LiChess Tools - Expand all bookmarks',
        'bookmarkSplitConfirmationText':'Sure you want to split the chapter on this bookmark?',
        'bookmarkSplitConfirmationDeleteText':'Sure you want to split the chapter on this bookmark?\r\nTHIS WILL DELETE FROM THIS CHAPTER THE MOVES THAT FOLLOW',
        'bookmarkSplitText':'Split chapter here',
        'bookmarkSplitTitle':'LiChess Tools - create a new chapter with following moves from here\r\nPress Shift to also delete them from here',
        'chapterLink':'Continue here: %s',
        'analysisPopupButtonTitle':'LiChess Tools - move list in another window (use SYNC button)',
        'bookmarkLabelForInteractive':'Bookmark: '
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.moveListOptions': 'Op\u0163iuni pentru list\u0103 mut\u0103ri',
        'moveListOptions.indentedVariations':'Varia\u0163iuni indentate',
        'moveListOptions.bookmarks':'Bookmarkuri',
        'moveListOptions.fullWidthAnalysis':'List\u0103 mut\u0103ri l\u0103rgit\u0103',
        'moveListOptions.hideLeftSide':'Ascunde partea st\u00e2ng\u0103',
        'moveListOptions.analysisPopup':'Deschide \u00een alt\u0103 fereastr\u0103',
        'moveListOptions.fixCevalToggle':'Buton evaluare \u00een dreapta',
        'addBookmarkText':'Adaug\u0103/Elimin\u0103 bookmark',
        'addBookmarkTitle':'LiChess Tools - Adaug\u0103/Elimin\u0103 bookmark',
        'addBookmarkPrompt':'Adaug\u0103/Elimin\u0103 bookmark',
        'collapseExpandTitle':'LiChess Tools - Colapseaz\u0103/Expandeaz\u0103',
        'URLCopiedToClipboard': 'URL copiat \u00een clipboard',
        'clipboardDenied':'Acces refuzat la clipboard',
        'getBookmarkUrlText':'Link la bookmark',
        'getBookmarkUrlTitle':'LiChess Tools - link la bookmark',
        'collapseAllText':'Colapseaz\u0103 toate bookmarkurile',
        'collapseAllTitle':'LiChess Tools - Colapseaz\u0103 toate bookmarkurile',
        'expandAllText':'Expandeaz\u0103 toate bookmarkurile',
        'expandAllTitle':'LiChess Tools - Expandeaz\u0103 toate bookmarkurile',
        'bookmarkSplitConfirmationText':'Sigur vrei s\u0103 tai un nou capitol de la acest bookmark?',
        'bookmarkSplitConfirmationDeleteText':'Sigur vrei s\u0103 tai un nou capitol de la acest bookmark?\r\nASTA VA \u015ETERGE MUT\u0102RILE URM\u0102TOARE DIN ACEST CAPITOL',
        'bookmarkSplitText':'Taie un nou capitol de aici',
        'bookmarkSplitTitle':'LiChess Tools - creaz\u0103 un nou capitol din mut\u0103rile urm\u0103toare\r\nApas\u0103 Shift ca s\u0103 la \u015Ftergi de aici',
        'chapterLink':'Continu\u0103 aici: %s',
        'analysisPopupButtonTitle':'LiChess Tools - list\u0103 mut\u0103ri \u00een alt\u0103 fereastr\u0103 (folose\u015Fte butonul SYNC)',
        'bookmarkLabelForInteractive':'Bookmark: '
      }
    }


    getCommentNodes=(elem)=>{
      const parent=this.lichessTools;
      const $=parent.$;

      let commentNodes=[];
      $(elem).each((i,e)=>{
        $(e).contents().each((i2,e2)=>{
          if (!e2) return;
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

    toBookmarkName=(text)=>{
      let result=text?.trim()?.replace(/\s+/g,'_');
      if (/^\d+$/.test(result)) result='_'+result;
      return result;
    };

    fromBookmarkName=(text)=>{
      let result=text?.replaceAll('_',' ')?.trim();
      return result;
    }

    setBookmark=(elem, node, bookmark)=>{
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
        $('button',bookmarkElem)
          .toggleClass('lichessTools-noChildren',!node.children?.length);
        $('label',bookmarkElem)
          .text(this.fromBookmarkName(bookmark.label))
          .attr('title',this.fromBookmarkName(bookmark.label));
        this.collapseMove(elem,!!bookmark.collapsed);
      } else {
        this.collapseMove(elem,false);
        $('bookmark',elem).remove();
        $(elem).removeClass('lichessTools-bookmark');
      }
    }

    setBookmarks=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const r=/bkm:([^\s]+)\s*/s;
      const thereAreBookmarks = !!parent.global.document.querySelector('bookmark');

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
        if (bookmark) {
          if (node.bookmark) {
            if (node.bookmark.label!=bookmark) {
              node.bookmark.label=bookmark;
            }
          } else {
            node.bookmark={
              label:bookmark,
              collapsed:false
            };
          }
          const elem=parent.getElementForNode(node);
          this.setBookmark(elem,node,node.bookmark);
        } else {
          if (node.bookmark) {
            node.bookmark=null;
            if (thereAreBookmarks) {
              const elem=parent.getElementForNode(node);
              this.setBookmark(elem,node,null);
            }
          }
        }
      },true);
    };

    addCommentBookmarks=()=>{
      if (!this.options.bookmarks) return;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
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
        const comment=$(node).closest('comment');
        const divComment=$(node).closest('div.comment');
        if (comment.length) {
          node.textContent=text.slice(0,m.index)+text.slice(m.index+m[0].length);
          const isEmpty=!Array.from(comment[0].childNodes||[]).filter(n=>n.nodeType==3).find(n=>!!n.nodeValue?.trim());
          comment.toggleClass('lichessTools-empty',isEmpty);
        } else if (divComment.length) {
          node.textContent=text.replace(r,trans.noarg('bookmarkLabelForInteractive')+this.fromBookmarkName(m[1]));
        }
      }

      const nodes=analysis.tree.getNodeList(analysis.path);
      for (let i=nodes.length-2; i>=0; i--) {
        const move=nodes[i];
        if (move.bookmark?.collapsed) {
          const elem=parent.getElementForNode(move);
          this.collapseMove(elem,false);
        }
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

      if (!$('.abset-indentedVariations',container).length) {
        const html=`<div class="setting abset-indentedVariations" title="LiChess Tools - $trans(moveListOptions.indentedVariations)">
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
            this.options.indentedVariations=$('#abset-indentedVariations').is(':checked');
            const options=parent.currentOptions;
            options.moveListOptions=this.options.getString();
            await parent.applyOptions(options);
            parent.fireReloadOptions();
          });
      }
      $('#abset-indentedVariations')
        .prop('checked',this.options.indentedVariations);

      if (!$('.abset-fullWidthAnalysis',container).length) {
        const html=`<div class="setting abset-fullWidthAnalysis" title="LiChess Tools - $trans(moveListOptions.fullWidthAnalysis)">
      <div class="switch">
        <input id="abset-fullWidthAnalysis" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-fullWidthAnalysis"></label>
      </div>
      <label for="abset-fullWidthAnalysis">$trans(moveListOptions.fullWidthAnalysis)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g,m=>{
          return parent.htmlEncode(trans.noarg(m.slice(7,-1)));
        });
        $(html).insertAfter($('div.abset-indentedVariations',container).eq(0));
        $('#abset-fullWidthAnalysis')
          .on('change',async ()=>{
            this.options.fullWidthAnalysis=$('#abset-fullWidthAnalysis').is(':checked');
            const options=parent.currentOptions;
            options.moveListOptions=this.options.getString();
            await parent.applyOptions(options);
            parent.fireReloadOptions();
          });
      }
      $('#abset-fullWidthAnalysis')
        .prop('checked',this.options.fullWidthAnalysis);

      if (!$('.abset-hideLeftSide',container).length) {
        const html=`<div class="setting abset-hideLeftSide" title="LiChess Tools - $trans(moveListOptions.hideLeftSide)">
      <div class="switch">
        <input id="abset-hideLeftSide" class="cmn-toggle" type="checkbox" checked="">
        <label for="abset-hideLeftSide"></label>
      </div>
      <label for="abset-hideLeftSide">$trans(moveListOptions.hideLeftSide)</label>
    </div>`.replace(/\$trans\(([^\)]+)\)/g,m=>{
          return parent.htmlEncode(trans.noarg(m.slice(7,-1)));
        });
        $(html).insertAfter($('div.abset-fullWidthAnalysis',container).eq(0));
        $('#abset-hideLeftSide')
          .on('change',async ()=>{
            this.options.hideLeftSide=$('#abset-hideLeftSide').is(':checked');
            const options=parent.currentOptions;
            options.moveListOptions=this.options.getString();
            await parent.applyOptions(options);
            parent.fireReloadOptions();
          });
      }
      $('#abset-hideLeftSide')
        .prop('checked',this.options.hideLeftSide);
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
      const hash=parent.global.decodeURIComponent(this.hash?.slice(1)?.toLowerCase());
      parent.traverse(null,(node,state)=>{
        if (node.bookmark?.label?.toLowerCase()==hash) {
          if (destinationNode) {
            parent.announce('You have multiple bookmarks with the same label: '+node.bookmark.label);
          } else {
            destinationNode=node;
          }
        }
      },true);
      if (destinationNode?.path) {
        lichess.analysis.jump(destinationNode.path);
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
      const oldLabel=this.fromBookmarkName(node.bookmark?.label)||'';
      const label=this.toBookmarkName(parent.global.prompt(trans.noarg('addBookmarkPrompt'),oldLabel));
      if (label===undefined) return;
      node.bookmark=label
        ? {
            label:label,
            collapsed:node.bookmark?.collapsed||false
          }
        : null;
      this.setBookmark(elem,node,node.bookmark);

      const r=/bkm:([^\s]+)\s*/gs;
      const myName=parent.getUserId();
      const comments=(node.comments||[])
                 .filter(c=>c.by?.id==myName || r.test(c.text));
      let commentText=comments.map(c=>c.text).join('\r\n\r\n');
      r.lastIndex=0;
      commentText=(label?'bkm:'+label+' ':'')+commentText.replace(r,'').trim();
      const chapterId=study.currentChapter()?.id;
      if (!chapterId) {
        parent.global.console.warn('Could not determine chapterId');
        return;
      }
      for(const comment of comments.filter(c=>c.by?.id!=myName)) {
        study.commentForm.delete(chapterId,node.path,comment.id)
      }
      parent.saveComment(commentText,path);
      $('#comment-text').val(commentText);
    };

    getBookmarkUrl=async (bookmark)=>{
      const label=bookmark?.label;
      if (!label) return;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const announce=parent.announce;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      const study=analysis?.study;
      if (!study) return;

      const chapterId=study.currentChapter()?.id;
      if (!chapterId) {
        parent.global.console.warn('Could not determine chapterId');
        return;
      }
      const url=parent.global.location.origin+'/study/'+study.data.id+'/'+chapterId+'#'+parent.global.encodeURIComponent(label);
      const result=await parent.global.navigator.permissions.query({ name: 'clipboard-write' });
      if (['granted','prompt'].includes(result.state)) {
        try {
          await parent.global.navigator.clipboard.writeText(url);
          const announcement = trans.noarg('URLCopiedToClipboard');
          announce(announcement);
        } catch(e) {
          const announcement = trans.noarg('clipboardDenied');
          announce(announcement);
        }
      } else {
        const announcement = trans.noarg('clipboardDenied');
        announce(announcement);
      }
    };

    collapseExpandAll=()=>{
      if (!this.options.bookmarks) return;
      const parent=this.lichessTools;
      const $=parent.$;
      const anyCollapsed=$('move.lichessTools-collapsed').eq(0)[0];
      if (anyCollapsed) {
        $('move.lichessTools-bookmark.lichessTools-collapsed bookmark button').trigger('click');
      } else {
        $('move.lichessTools-bookmark:not(.lichessTools-collapsed) bookmark button').trigger('click');
      }
    };

    bookmarkSplit=async (ev)=>{
      const deleteMoves=ev.shiftKey;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      const study=analysis?.study;
      const nodePath=analysis?.contextMenuPath;
      if (!study || nodePath===undefined) return;
      const pgn = await parent.exportPgn(nodePath,{ fromPosition: true });
      if (!pgn) return;
      const node=analysis.tree.nodeAtPath(nodePath);
      const label = node?.bookmark?.label;
      if (!label) return;
      const position=study.data?.position;
      if (!position) throw 'Cannot find study position!';
      if (!parent.global.confirm(trans.noarg(deleteMoves?'bookmarkSplitConfirmationDeleteText':'bookmarkSplitConfirmationText'))) return;
      if (deleteMoves) {
        for (const child of node.children||[]) {
          const path=nodePath+child.id;
          study.deleteNode(path);
          analysis.tree.deleteNodeAt(path);
        }
      }
      const setup=study.data?.chapter?.setup;
      study.chapters.newForm.submit({ 
        name:this.fromBookmarkName(label),
        pgn:pgn,
        variant:setup?.variant?.key||'standard',
        orientation:setup?.orientation||'white',
        mode:'normal',
        isDefaultName:false
      })
      let commentText=parent.getNodeComment(node)||'';
      if (commentText) commentText+='\r\n';

      while(!study.currentChapter() || study.currentChapter().id==position.chapterId) {
        await parent.timeout(50);
      }
      const newChapterId=study.currentChapter().id;
      const chapterUrl=parent.global.location.origin+'/study/'+study.data.id+'/'+newChapterId;
      const chapterText=trans.pluralSame('chapterLink',chapterUrl);
      study.setChapter(position.chapterId);
      
      while(!study.currentChapter() || study.currentChapter().id!=position.chapterId) {
        await parent.timeout(50);
      }
      analysis.jump(nodePath);
      analysis.redraw();

      while(analysis.path!=nodePath) {
        await parent.timeout(50);
      }
      parent.saveComment(commentText+chapterText, nodePath, position.chapterId);
    };

    analysisContextMenu=()=>{
      if (!this.options.bookmarks) return;
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const announce=parent.announce;
      const trans=parent.translator;
      const analysis=lichess.analysis;
      const study=analysis?.study;

      const menu=$('#analyse-cm');
      if (!menu.length) return;
      
      if (!this.options.bookmarks) return;
      if (study?.vm.mode.write) {
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
      if (analysis.contextMenuPath) {
        const node=analysis.tree.nodeAtPath(analysis.contextMenuPath);
        if (node?.bookmark?.label) {
          let menuItem=$('a[data-role="bookmarkUrl"]',menu);
          if (!menuItem.length) {
            const text=trans.noarg('getBookmarkUrlText');
            const title=trans.noarg('getBookmarkUrlTitle');
            menuItem=$('<a>')
              .attr('data-icon','\uE016')
              .attr('data-role','bookmarkUrl')
              .text(text).attr('title',title)
              .on('click',()=>this.getBookmarkUrl(node.bookmark))
              .appendTo(menu);
          }

          menuItem=$('a[data-role="collapseAll"]',menu);
          if (!menuItem.length) {
            menuItem=$('<a>')
              .attr('data-role','collapseAll')
              .on('click',()=>this.collapseExpandAll())
              .appendTo(menu);
          }
          const anyCollapsed=$('move.lichessTools-collapsed').eq(0)[0];
          let text=undefined;
          let title=undefined;
          let icon=undefined;
          if (anyCollapsed) {
            text=trans.noarg('expandAllText');
            title=trans.noarg('expandAllTitle');
            icon='\uE042';
          } else {
            text=trans.noarg('collapseAllText');
            title=trans.noarg('collapseAllTitle');
            icon='\uE043';
          }
          menuItem
            .attr('data-icon',icon)
            .text(text).attr('title',title);

          if (study?.vm.mode.write && node.children?.length) {
            let menuItem=$('a[data-role="bookmarkSplit"]',menu);
            if (!menuItem.length) {
              const text=trans.noarg('bookmarkSplitText');
              const title=trans.noarg('bookmarkSplitTitle');
              menuItem=$('<a>')
                .attr('data-icon','\u2704')
                .attr('data-role','bookmarkSplit')
                .text(text).attr('title',title)
                .on('click',this.bookmarkSplit)
                .appendTo(menu);
            }
          }
        }
      }
    }

    setupAnalysisPopup=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const study=parent.lichess.analysis?.study;
      let button=$('div.analyse__tools a.lichessTools-analysisPopup');
      if (this.options.analysisPopup && study) {
        let container=$('div.analyse__tools div.ceval');
        if (container.length) {
          $('div.lichessTools-moveListOptions-header').remove();
        } else {
          container=$('div.lichessTools-moveListOptions-header');
          if (!container.length) {
            container=$('<div class="lichessTools-moveListOptions-header">')
              .prependTo('div.analyse__tools');
          }
        }
        if (!button.length) {
          button=$('<a class="lichessTools-analysisPopup">')
            .attr('data-icon','\uE024')
            .attr('title',trans.noarg('analysisPopupButtonTitle'))
            .on('click',ev=>{
              ev.preventDefault();
              this.popup?.close();
              this.popup=parent.global.open(parent.global.location.href,'lichessTools-moves','fullscreen=yes,menubar=no,location=no,status=no,titlebar=no,toolbar=no,');
              this.popup.addEventListener('DOMContentLoaded',()=>$('body',this.popup.document).addClass('lichessTools-analysisPopup'));
              parent.global.addEventListener('unload',()=>{
                this.popup.close();
              });
            });
          const elem=$('help,div.engine',container);
          if (elem.length) {
            button
              .insertAfter(elem);
          } else {
            button
              .appendTo(container);
          }
        }
      } else {
        button.remove();
        $('div.lichessTools-moveListOptions-header').remove();
      }
    };

    setupCevalToggle=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      $('main.analyse').toggleClass('lichessTools-fixCevalToggle',this.options.fixCevalToggle);
    };

    addMissingIndexes=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      $.cached('.tview2.lichessTools-indentedVariations inline+move',2000).each((i,e)=>{
        e=$(e);
        if (e.children('index').length) return;
        const elem=e.prev().prev('move:has(index)').children('index').clone();
        if (!elem.length) return;
        elem
          .addClass('lichessTools-index')
          .text(elem.text()+'..');
        $(e).prepend(elem);
      });
    };

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
        bookmarks:parent.isOptionSet(value,'bookmarks'),
        fullWidthAnalysis:parent.isOptionSet(value,'fullWidthAnalysis'),
        hideLeftSide:parent.isOptionSet(value,'hideLeftSide'),
        analysisPopup:parent.isOptionSet(value,'analysisPopup'),
        fixCevalToggle:parent.isOptionSet(value,'fixCevalToggle'),
        getString:function() {
          const arr=[];
          if (this.indentedVariations) arr.push('indentedVariations');
          if (this.bookmarks) arr.push('bookmarks');
          if (this.fullWidthAnalysis) arr.push('fullWidthAnalysis');
          if (this.hideLeftSide) arr.push('hideLeftSide');
          if (this.analysisPopup) arr.push('analysisPopup');
          if (this.fixCevalToggle) arr.push('fixCevalToggle');
          return arr.join(',');
        }
      };
      lichess.pubsub.off('lichessTools.redraw',this.analysisControls);
      lichess.pubsub.on('lichessTools.redraw',this.analysisControls);
      analysis.actionMenu.toggle=lichessTools.unwrapFunction(analysis.actionMenu.toggle,'moveListOptions');
      analysis.actionMenu.toggle=lichessTools.wrapFunction(analysis.actionMenu.toggle,{
        id:'moveListOptions',
        after: ($this, result, ...args)=>{
          parent.global.setTimeout(this.analysisControls,100);
          parent.emitRedraw();
        }
      });
      this.analysisControls();

      lichess.pubsub.off('lichessTools.redraw',this.addMissingIndexes);
      if (this.options.indentedVariations) {
        lichess.pubsub.on('lichessTools.redraw',this.addMissingIndexes);
      }

      lichess.pubsub.off('lichessTools.redraw',this.debouncedAddCommentBookmarks);
      lichess.pubsub.off('lichessTools.chapterChange',this.debouncedAddCommentBookmarks);
      if (lichess.socket) {
        lichess.socket.handle=parent.unwrapFunction(lichess.socket.handle,'moveListOptions');
      }
      $(parent.global).off('hashchange',this.hashChange);
      if (this.options.bookmarks) {
        lichess.pubsub.on('lichessTools.redraw',this.debouncedAddCommentBookmarks);
        lichess.pubsub.on('lichessTools.chapterChange',this.debouncedAddCommentBookmarks);
        if (lichess.socket) {
          lichess.socket.handle=parent.wrapFunction(lichess.socket.handle,{
            id:'moveListOptions',
            after:($this,result,m)=>{
              if (m.t=='setComment') this.debouncedAddCommentBookmarks();
            }
          });
        }
        this.addCommentBookmarks();
        $(parent.global).on('hashchange',this.hashChange);
        parent.global.setTimeout(this.hashChange,100);
      }

      lichess.pubsub.off('lichessTools.redraw',this.analysisContextMenu);
      if (this.options.bookmarks) {
        lichess.pubsub.on('lichessTools.redraw',this.analysisContextMenu);
      }

      $.cached('body')
        .toggleClass('lichessTools-fullWidthAnalysis',this.options.fullWidthAnalysis)
        .toggleClass('lichessTools-hideLeftSide',this.options.hideLeftSide);
      lichess.pubsub.off('lichessTools.redraw',this.setupAnalysisPopup);
      if (analysis.study && this.options.analysisPopup) {
        lichess.pubsub.on('lichessTools.redraw',this.setupAnalysisPopup);
      }
      this.setupAnalysisPopup();

      $('.lichessTools-fixCevalToggle').removeClass('lichessTools-fixCevalToggle');
      lichess.pubsub.off('lichessTools.redraw',this.setupCevalToggle);
      if (analysis && this.options.fixCevalToggle) {
        lichess.pubsub.on('lichessTools.redraw',this.setupCevalToggle);
      }
      this.setupCevalToggle();
    }
  }

  LiChessTools.Tools.MoveListOptions=MoveListOptionsTool;
})();
