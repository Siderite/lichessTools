(() => {
  class StudyFlairsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitContentLoaded'];

    preferences = [
      {
        name: 'studyFlairs',
        category: 'study',
        type: 'multiple',
        possibleValues: ['authorFlair', 'memberFlairs', 'topicFlairs'],
        defaultValue: 'topicFlairs',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.studyFlairs': 'Study flairs',
        'studyFlairs.authorFlair': 'Author flair',
        'studyFlairs.memberFlairs': 'Member flairs',
        'studyFlairs.topicFlairs': 'Flairs from study topics',
        'flairButtonText': 'Flairs',
        'flairButtonTitle': 'LiChess Tools - add a study flair',
        'studyFlairTitle': 'Study flair'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.studyFlairs': 'Pictograme \u00een studii',
        'studyFlairs.authorFlair': 'Pictograma autorului',
        'studyFlairs.memberFlairs': 'Pictogramele membrilor',
        'studyFlairs.topicFlairs': 'Pictograme din subiecte studii',
        'flairButtonText': 'Pictograme',
        'flairButtonTitle': 'LiChess Tools - adaug\u0103 o pictogram\u0103 studiului',
        'studyFlairTitle': 'Pictograma studiului'
      }
    };

    processStudy = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      if (!this.options.topicFlairs) return;
      if (lichess.analysis?.gamebookPlay()) return;
      const container = $('.study-topics');
      if (lt.inViewport(container)) {
        const tagify = $('tags+textarea', container)[0]?.__tagify;
        if (tagify) {
          if (!$('button.lichessTools-studyFlairs', container).length) {
            const form = $('form', container);
            const flairPicker = $('<div class="flair-picker">');
            $('<button class="button lichessTools-studyFlairs">')
              .text(trans.noarg('flairButtonText'))
              .attr('title', trans.noarg('flairButtonTitle'))
              .on('click', ev => {
                ev.preventDefault();
                const close = () => flairPicker.removeClass('emoji-done').empty();
                lichess.asset.loadEsm("bits.flairPicker", {
                  init: {
                    element: flairPicker[0],
                    close: close,
                    onEmojiSelect: e => {
                      tagify.addTags('flair.' + e.id);
                      close();
                    }
                  }
                });
              })
              .appendTo(form);
            flairPicker
              .appendTo(form);
          }
          if (!lt.isWrappedFunction(tagify.createTagElem, 'studyFlairs')) {
            const handleTag = tag => {
              const span = $(tag).find('span.tagify__tag-text');
              const m = /^flair\.([^\)]+)/.exec(span.text());
              if (m) {
                const url = lichess.asset.flairSrc(m[1]);
                span.replaceWith($('<img>')
                  .attr('src', url));
                $(tag).addClass('lichessTools-studyFlairs');
              }
            };

            tagify.createTagElem = lt.wrapFunction(tagify.createTagElem, {
              id: 'studyFlairs',
              after: ($this, result, ...args) => {
                handleTag(result);
              }
            });
            $('tag').each((i, tag) => {
              handleTag(tag);
            });
          }
          if (!lt.isWrappedFunction(tagify.dropdown.show, 'studyFlairs')) {
            tagify.dropdown.show = lt.wrapFunction(tagify.dropdown.show, {
              id: 'studyFlairs',
              before: ($this, term) => {
                if (!term) return;
                term = term.toLowerCase();
                const flairs = this.flairs.filter(f => f.includes(term));
                if (!flairs.length) return;
                lt.arrayRemoveAll(tagify.settings.whitelist, f => /^flair\.([^\)]+)/.test(f));
                tagify.settings.whitelist.push(...flairs);
                tagify.settings.whitelist.splice(10);
              },
              after: ($this, result, term) => {
                lt.global.setTimeout(() => {
                  $('div.tagify__dropdown__item').each((i, e) => {
                    const m = /^flair\.([^\)]+)/.exec($(e).text());
                    if (m) {
                      const url = lichess.asset.flairSrc(m[1]);
                      $(e)
                        .text('')
                        .append($('<img>').attr('src', url))
                        .addClass('lichessTools-studyFlairs');
                    }
                  });
                }, 1);
              }
            });
          }
        }
      }

      $('div.study__topics a.topic, nav.page-menu__menu a[href^="/study/topic/flair."], .topic-list a[href^="/study/topic/flair."]').each((i, e) => {
        const m = /^flair\.([^\)]+)/.exec($(e).text());
        if (m) {
          const url = lichess.asset.flairSrc(m[1]);
          $(e)
            .text('')
            .attr('title', 'flair.' + m[1])
            .append($('<img>').attr('src', url))
            .addClass('lichessTools-studyFlairs');
        }
      });
    };

    getFullname = (user) => {
      return [user.title, user.name].filter(s => s).join(' ');
    };

    _currentPage = 0;
    _nextPage = 1;
    _studies = {};
    processStudyList = async () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const trans = lt.translator;
      const $ = lt.$;
      if (lichess.analysis?.gamebookPlay()) return;
      const href = $('.infinite-scroll .pager > a').attr('href');
      const modeMatch = /\/(?<mode>hot|newest|oldest|updated|popular|alphabetical|mine)\b/i.exec(lt.global.location.pathname);
      const mode = modeMatch?.groups?.mode || 'hot';
      let page = 1;
      if (href) {
        const m = /page=(\d+)/.exec(href);
        page = +m?.at(1);
        if (page > this._nextPage) {
          this._nextPage = page;
          page = this._nextPage - 1;
        }
      } else if (this._nextPage) {
        page = this._nextPage;
      }
      const baseUrl = lt.global.location.href;
      while (this._currentPage < page) {
        const json = await lt.api.study.getStudyListPage(baseUrl, this._currentPage + 1);
        const loadedPage = +json?.paginator?.currentPage;
        if (loadedPage) {
          this._currentPage = loadedPage;
          for (const study of json.paginator.currentPageResults || []) {
            this._studies[study.id] = study;
          }
        } else {
          this._currentPage++;
        }
      }
      $('div.study.paginated').each((i, e) => {
        e = $(e);
        if (e.is('.lichessTools-studyFlairs')) return;
        const studyId = e.children('a').attr('href')?.replace('/study/', '');
        const study = this._studies[studyId];
        if (!study) return;
        const flairs = [];
        if (study.flair) {
          flairs.push({ title: trans.noarg('studyFlairTitle'), flair: study.flair, type: 'study' });
        }
        if (this.options.topicFlairs && study.topics) {
          for (const topic of study.topics) {
            const m = /^flair\.([^\)]+)/.exec(topic);
            if (m?.at(1)) flairs.push({ title: m[1], flair: m[1], type: 'topic' });
          }
        }
        if (this.options.authorFlair && study.owner?.flair) {
          flairs.push({ title: this.getFullname(study.owner), flair: study.owner.flair, url: '/@/' + study.owner.id, type: 'owner' });
        }
        if (this.options.memberFlairs && study.members?.length) {
          const members = study.members
            .filter(m => m.user.id != study.owner.id)
            .map(m => { return { title: this.getFullname(m.user), flair: m.user.flair, url: '/@/' + m.user.id, type: 'member' }; })
            .filter(f => f.flair);
          flairs.push(...members);
        }
        if (flairs.length) {
          e.addClass('lichessTools-studyFlairs');
          const url = lichess.asset.flairSrc(flairs[0].flair);
          let elem = $('<img class="lichessTools-studyFlair">')
            .attr('src', url)
            .attr('title', flairs[0].title)
            .prependTo(e.find('div.top'));
          if (flairs[0].url) {
            elem
              .attr('data-href', flairs[0].url)
              .attr('data-name', flairs[0].title);
            lichess.powertip?.manualUser(elem[0]);
          } else
          if (flairs[0].type=='topic') {
            elem
              .on('contextmenu', ev => {
                ev.preventDefault();
                lt.global.location = '/study/topic/flair.' + flairs[0].title + '/' + mode;
              });
          }
          if (flairs.length > 1) {
            const container = $('<div class="lichessTools-bottomFlairs">')
              .appendTo(e);
            for (let i = 1; i < flairs.length; i++) {
              const url = lichess.asset.flairSrc(flairs[i].flair);
              elem = $('<img>')
                .attr('src', url)
                .attr('title', flairs[i].title)
                .appendTo(container);
              if (flairs[i].url) {
                elem
                  .attr('data-href', flairs[i].url)
                  .attr('data-name', flairs[i].title);
                lichess.powertip?.manualUser(elem[0]);
              } else
              if (flairs[i].type=='topic') {
                elem
                  .on('contextmenu', ev => {
                    ev.preventDefault();
                    lt.global.location = '/study/topic/flair.' + flairs[i].title + '/' + mode;
                  });
              }
            }
          }
        }
      });
      if (this.options.topicFlairs) {
        $('div.topic-list > a').each((i, e) => {
          const m = /^flair\.([^\)]+)/.exec($(e).text());
          if (m) {
            const url = lichess.asset.flairSrc(m[1]);
            $(e)
              .text('')
              .append($('<img>').attr('src', url))
              .addClass('lichessTools-studyFlairs');
          }
        });
      }
    };
    processStudyListDebounced = this.lichessTools.debounce(this.processStudyList, 1000);

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const value = lt.currentOptions.getValue('studyFlairs');
      this.logOption('Study flairs', value);
      this.options = {
        authorFlair: lt.isOptionSet(value, 'authorFlair'),
        memberFlairs: lt.isOptionSet(value, 'memberFlairs'),
        topicFlairs: lt.isOptionSet(value, 'topicFlairs')
      };
      lt.pubsub.off('content-loaded', this.processStudyListDebounced);
      lt.global.clearInterval(this.interval);
      $('div.lichessTools-studyFlairs').removeClass('lichessTools-studyFlairs');
      $('img.lichessTools-studyFlair,.lichessTools-bottomFlairs').remove();
      if (!value) {
        return;
      }
      if (lichess.analysis?.study || $('.study-topics,.topic-list').length) {
        if (!this.flairs) {
          const flairs = await lt.api.flair.getList();
          this.flairs = flairs.map(f => 'flair.' + f.trim());
        }
        this.interval = lt.global.setInterval(this.processStudy, 500);
        this.processStudy();
      }
      if (/^\/study\b/.test(lt.global.location.pathname) && $('.studies.list').length) {
        lt.pubsub.on('content-loaded', this.processStudyListDebounced);
        this.processStudyList();
      }
    }

  }
  LiChessTools.Tools.StudyFlairs = StudyFlairsTool;
})();
