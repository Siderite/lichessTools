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
      this.sortable?.destroy();
      if (this.options.sortable && topicAnchors.length>1) {
        this.makeSortable ||= await site.asset.loadEsm('sortable.esm', { npm: true });
        this.sortable = this.makeSortable.create($('nav.subnav__inner')[0], {
          draggable: 'nav.subnav__inner a[href^="/study/topic/"]',
          handle: 'ontouchstart' in window ? 'span' : undefined,
          onSort: this.sortTopics
        });
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
