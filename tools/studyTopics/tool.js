(() => {
  class StudyTopicsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'studyTopics',
        category: 'study',
        type: 'multiple',
        possibleValues: ['sortable','expandable'],
        defaultValue: 'sortable,expandable',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.studyTopics': 'Study topics options',
        'studyTopics.sortable': 'Sortable',
        'studyTopics.expandable': 'Expandable'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.studyTopics': 'Op\u0163iuni subiecte studii',
        'studyTopics.sortable': 'Sortabile',
        'studyTopics.expandable': 'Expandabile'
      }
    };

    getTopicFromAnchor = (e)=>{
      const lt = this.lichessTools;
      const topic = /^\/study\/topic\/(?<topic>[^\/]+)\//.exec($(e).attr('href')).groups.topic;
      return lt.global.decodeURIComponent(topic);
    };

    sortTopics = async ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (!this.options.sortable) return;
      const topics = $('nav.subnav__inner a[href^="/study/topic/"]')
                       .get()
                       .map(this.getTopicFromAnchor);
      await lt.api.study.setTopics(topics);
      lt.global.location.reload();
    };

    sortTags = async (tagify)=>{
      if (!this.options.sortable) return;
      tagify?.updateValueByDOMTags();
    };

    getTagify = async (textarea) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      let tagify = textarea.__tagify;
      if (tagify) return tagify;

      if (!lt.global.Tagify) {
        await lichess.asset.loadIife('npm/tagify.min.js')
      }
      tagify = new lt.global.Tagify(textarea);
      return tagify;
    };

    makeSortable = async (elem, options) => {
      options = {
        handle: 'ontouchstart' in window ? 'span' : undefined,
        animation: 150,
        ghostClass: 'lichessTools-sortableGhost',
        ...options
      };
      const key = Object.keys(elem).find(k=>/^Sortable\d+$/.test(k));
      if (key) return elem[key];
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      this._sortable ||= await lichess.asset.loadEsm('sortable.esm', { npm: true });
      const sortable = this._sortable.create(elem, options);
      this.sortables ||= new Set();
      this.sortables.add(sortable);
    };


    handleTopicsDialog = async ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (!this.options.sortable) return;
      const textarea = $('.study-topics:has(tags) textarea');
      if (textarea.length) {
        const tagify = await this.getTagify(textarea[0]);

        await this.makeSortable($('.study-topics tags')[0], {
          draggable: '.study-topics tags tag',
          onSort: ()=>this.sortTags(tagify)
        });
      }
    }

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('studyTopics');
      this.logOption('Study topic options', value);
      this.options = {
        sortable: lt.isOptionSet(value, 'sortable'),
        expandable: lt.isOptionSet(value, 'expandable')
      };
      const $ = lt.$;

      const topicAnchors = $('nav.subnav__inner a[href^="/study/topic/"]');
      this.sortables?.forEach(s=>s.destroy());
      $('body').observer()
        .off('tags.tagify',this.handleTopicsDialog);
      if (this.options.sortable) {
        if (topicAnchors.length>1) {
          await this.makeSortable($('nav.subnav__inner')[0], {
            draggable: 'nav.subnav__inner a[href^="/study/topic/"]',
            onSort: this.sortTopics
          });

          const textarea = $('#form3-topics');
          if (textarea.length) {
            const tagify = await this.getTagify(textarea[0]);

            await this.makeSortable($('form.form3 tags')[0], {
              draggable: 'form.form3 tags tag',
              onSort: ()=>this.sortTags(tagify)
            });
          }
        }
        $('body').observer()
          .on('tags.tagify',this.handleTopicsDialog);
      }

      if (this.options.expandable && topicAnchors.length && !$('body').is('.mobile')) {
        topicAnchors.each((i,e)=>{
          if (e.__initExpandable) return;
          e.__initExpandable = true;
          const topic = this.getTopicFromAnchor(e);
          const el = $(e);
          el.empty()
              .append($('<button type="button" class="lichessTools-topicExpander">')
                        .on('click',async (ev)=>{
                           ev.preventDefault();
                           el.toggleClass('lichessTools-expandedTopic');
                           if (el.is('.lichessTools-expandedTopic') && !e.__studiesLoaded) {
                             const studies = await lt.api.study.getTopicStudies(topic);
                             const container = el.find('.lichessTools-topicStudies').empty();
                             for (const study of studies) {
                               $('<a>')
                                 .attr('href','/study/'+lt.global.encodeURIComponent(study.id))
                                 .text(study.name)
                                 .appendTo(container);
                             }
                           }
                        })
              )
              .append($('<span>').text(topic))
              .append($('<div class="lichessTools-topicStudies">'));
        });
      }
    }

  }
  LiChessTools.Tools.StudyTopics = StudyTopicsTool;
})();
