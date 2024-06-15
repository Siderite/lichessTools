(()=>{
  class StudyFlairsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'studyFlairs',
        category: 'study',
        type:'multiple',
        possibleValues: ['authorFlair','memberFlairs','topicFlairs'],
        defaultValue: 'topicFlairs',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.studyFlairs': 'Study flairs',
        'studyFlairs.authorFlair':'Author flair',
        'studyFlairs.memberFlairs':'Member flairs',
        'studyFlairs.topicFlairs':'Flairs from study topics',
        'flairButtonText':'Flairs',
        'flairButtonTitle':'LiChess Tools - add a study flair',
        'studyFlairTitle': 'Study flair'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.studyFlairs': 'Pictograme \u00een studii',
        'studyFlairs.authorFlair':'Pictograma autorului',
        'studyFlairs.memberFlairs':'Pictogramele membrilor',
        'studyFlairs.topicFlairs':'Pictograme din subiecte studii',
        'flairButtonText':'Pictograme',
        'flairButtonTitle':'LiChess Tools - adaug\u0103 o pictogram\u0103 studiului',
        'studyFlairTitle': 'Pictograma studiului'
      }
    };

    processStudy=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const trans=parent.translator;
      if (!this.options.topicFlairs) return;
      const container=$('div.dialog-content.study-topics');
      if (parent.inViewport(container)) {
        const tagify=$('tags+textarea',container)[0]?.__tagify;
        if (tagify) {
          if (!$('button.lichessTools-studyFlairs',container).length) {
            const form=$('form',container);
            const flairPicker=$('<div class="flair-picker">');
            $('<button class="button lichessTools-studyFlairs">')
              .text(trans.noarg('flairButtonText'))
              .attr('title',trans.noarg('flairButtonTitle'))
              .on('click',ev=>{
                ev.preventDefault();
                const close=()=>flairPicker.removeClass('emoji-done').empty();
                lichess.asset.loadEsm("bits.flairPicker", {
                  init: {
                    element: flairPicker[0],
                    close: close,
                    onEmojiSelect: e=>{ 
                      tagify.addTags('flair.'+e.id);
                      close();
                    }
                  }
                });
              })
              .appendTo(form);
            flairPicker
              .appendTo(form);
          }
          if (!parent.isWrappedFunction(tagify.createTagElem,'studyFlairs')) {
            const handleTag=tag=>{
              const span=$(tag).find('span.tagify__tag-text');
              const m=/^flair\.([^\)]+)/.exec(span.text());
              if (m) {
                const url=lichess.asset.flairSrc(m[1]);
                span.replaceWith($('<img>')
                  .attr('src',url));
                $(tag).addClass('lichessTools-studyFlairs');
              }
            };

            tagify.createTagElem=parent.wrapFunction(tagify.createTagElem,{
              id: 'studyFlairs',
              after: ($this,result,...args)=>{
                handleTag(result);
              }
            });
            $('tag').each((i,tag)=>{
              handleTag(tag);
            });
          }
          if (!parent.isWrappedFunction(tagify.dropdown.show,'studyFlairs')) {
            tagify.dropdown.show=parent.wrapFunction(tagify.dropdown.show,{
              id: 'studyFlairs',
              before: ($this,term)=>{
                if (!term) return;
                term=term.toLowerCase();
                const flairs=this.flairs.filter(f=>f.includes(term));
                if (!flairs.length) return;
                parent.arrayRemoveAll(tagify.settings.whitelist,f=>/^flair\.([^\)]+)/.test(f));
                tagify.settings.whitelist.push(...flairs);
                tagify.settings.whitelist.splice(10);
              },
              after: ($this,result,term)=>{
                parent.global.setTimeout(()=>{
                $('div.tagify__dropdown__item').each((i,e)=>{
                  const m=/^flair\.([^\)]+)/.exec($(e).text());
                    if (m) {
                      const url=lichess.asset.flairSrc(m[1]);
                      $(e)
                        .text('')
                        .append($('<img>').attr('src',url))
                        .addClass('lichessTools-studyFlairs');
                    }
                });
                },1);
              }
            });
          }
        }
      }

      $('div.study__topics a.topic').each((i,e)=>{
        const m=/^flair\.([^\)]+)/.exec($(e).text());
        if (m) {
          const url=lichess.asset.flairSrc(m[1]);
          $(e)
            .text('')
            .append($('<img>').attr('src',url))
            .addClass('lichessTools-studyFlairs');
        }
      });
    };

    getFullname=(user)=>{
      return [user.title,user.name].filter(s=>s).join(' ');
    };

    _currentPage=0;
    _nextPage=1;
    _studies={};
    processStudyList=async ()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const trans=parent.translator;
      const $=parent.$;
      const href=$('.infinite-scroll .pager > a').attr('href');
      let page=1;
      if (href) {
        const m=/page=(\d+)/.exec(href);
        page=+m?.at(1);
        if (page>this._nextPage) {
          this._nextPage=page;
          page=this._nextPage-1;
        }
      } else if (this._nextPage) {
        page=this._nextPage;
      }
      const baseUrl=parent.global.location.href;
      const mm=/\/(hot|newest|updated|popular)$/.exec(parent.global.location.pathname);
      const mode=mm?.at(1)||'hot';
      const p=baseUrl.includes('?') ? '&' : '?';

      while(this._currentPage<page) {
        const json=await parent.net.json(baseUrl+p+'page='+(this._currentPage+1));
        const loadedPage=+json?.paginator?.currentPage;
        if (loadedPage) {
          this._currentPage=loadedPage;
          for (const study of json.paginator.currentPageResults||[]) {
            this._studies[study.id]=study;
          }
        } else {
          this._currentPage++;
        }
      }
      $('div.study.paginated').each((i,e)=>{
        e=$(e);
        if (e.is('.lichessTools-studyFlairs')) return;
        const studyId=e.children('a').attr('href')?.replace('/study/','');
        const study=this._studies[studyId];
        if (!study) return;
        const flairs=[];
        if (study.flair) {
          flairs.push({ title: trans.noarg('studyFlairTitle'), flair: study.flair });
        }
        if (this.options.topicFlairs && study.topics) {
          for (const topic of study.topics) {
            const m=/^flair\.([^\)]+)/.exec(topic);
            if (m?.at(1)) flairs.push({title:m[1],flair:m[1]});
          }
        }
        if (this.options.authorFlair && study.owner?.flair) {
          flairs.push({title: this.getFullname(study.owner), flair: study.owner.flair, url: '/@/'+study.owner.id});
        }
        if (this.options.memberFlairs && study.members?.length) {
          const members=study.members
                               .filter(m=>m.user.id!=study.owner.id)
                               .map(m=>{ return {title: this.getFullname(m.user), flair: m.user.flair, url: '/@/'+m.user.id}; })
                               .filter(f=>f.flair);
          flairs.push(...members);
        }
        if (flairs.length) {
          e.find('.study__icon').hide();
          e.addClass('lichessTools-studyFlairs');
          const url=lichess.asset.flairSrc(flairs[0].flair);
          let elem=$('<img>')
                       .attr('src',url)
                       .attr('title',flairs[0].title)
                       .prependTo(e.find('div.top'));
          if (flairs[0].url) {
            elem
              .attr('data-href',flairs[0].url)
              .attr('data-name',flairs[0].title);
            lichess.powertip?.manualUser(elem[0]);  
          } else {
            elem
              .on('contextmenu',ev=>{
                ev.preventDefault();
                parent.global.location='/study/topic/flair.'+flairs[0].title+'/'+mode;
              });
          }
          if (flairs.length>1) {
            const container=$('<div class="lichessTools-bottomFlairs">')
              .appendTo(e);
            for (let i=1; i<flairs.length; i++) {
              const url=lichess.asset.flairSrc(flairs[i].flair);
              elem=$('<img>')
                .attr('src',url)
                .attr('title',flairs[i].title)
                .appendTo(container);
              if (flairs[i].url) {
                elem
                  .attr('data-href',flairs[i].url)
                  .attr('data-name',flairs[i].title);
                lichess.powertip?.manualUser(elem[0]);  
              } else {
                elem
                  .on('contextmenu',ev=>{
                    ev.preventDefault();
                    parent.global.location='/study/topic/flair.'+flairs[i].title+'/'+mode;
                  });
              }
            }
          }
        }
      });
      if (this.options.topicFlairs) {
        $('div.topic-list > a').each((i,e)=>{
          const m=/^flair\.([^\)]+)/.exec($(e).text());
          if (m) {
            const url=lichess.asset.flairSrc(m[1]);
            $(e)
              .text('')
              .append($('<img>').attr('src',url))
              .addClass('lichessTools-studyFlairs');
          }
        });
      }
    };
    processStudyListDebounced = this.lichessTools.debounce(this.processStudyList,1000);

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const value=parent.currentOptions.getValue('studyFlairs');
      this.logOption('Study flairs', value);
      this.options={
        authorFlair: parent.isOptionSet(value,'authorFlair'),
        memberFlairs: parent.isOptionSet(value,'memberFlairs'),
        topicFlairs: parent.isOptionSet(value,'topicFlairs')
      };
      lichess.pubsub.off('content-loaded',this.processStudyListDebounced);
      parent.global.clearInterval(this.interval);
      if (!value) {
        $('.study__icon').show();
        return;
      }
      if (lichess.analysis?.study) {
        if (!this.flairs) {
          let text='';
          try {
            text=await parent.net.fetch(parent.assetUrl('flair/list.txt'));
          } catch {
            parent.global.console.debug('Could not retrieve flair list!');
          }
          this.flairs=text.split(/[\r\n]+/).map(f=>'flair.'+f.trim());
        }
        this.interval=parent.global.setInterval(this.processStudy,500);
        this.processStudy();
      } else
      if (/^\/study\b/.test(parent.global.location.pathname)&&$('.studies.list').length) {
        lichess.pubsub.on('content-loaded',this.processStudyListDebounced);
        this.processStudyList();
      }
    }

  }
  LiChessTools.Tools.StudyFlairs=StudyFlairsTool;
})();
