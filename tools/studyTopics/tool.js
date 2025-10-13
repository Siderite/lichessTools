(() => {
  class StudyTopicsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'studyTopics',
        category: 'study',
        type: 'multiple',
        possibleValues: ['sortable'],
        defaultValue: 'sortable',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.studyTopics': 'Study topics options',
        'studyTopics.sortable': 'Sortable'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.studyTopics': 'Op\u0163iuni subiecte studii',
        'studyTopics.sortable': 'Sortabile'
      }
    };

    sortTopics = async ()=>{
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      if (!this.options.sortable) return;
      const topics = $('nav.subnav__inner a[href^="/study/topic/"]')
                       .get()
                       .map((e)=>/^\/study\/topic\/(?<topic>[^\/]+)\//.exec($(e).attr('href')).groups.topic)
                       .map((t)=>lt.global.decodeURIComponent(t));
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
        sortable: lt.isOptionSet(value, 'sortable')
      };
      const $ = lt.$;

      if (this.options.sortable && $('nav.subnav__inner a[href^="/study/topic/"]').length>1) {
        this.makeSortable ||= await site.asset.loadEsm('sortable.esm', { npm: true });
        this.sortable = this.makeSortable.create($('nav.subnav__inner')[0], {
          draggable: 'nav.subnav__inner a[href^="/study/topic/"]',
          handle: 'ontouchstart' in window ? 'span' : undefined,
          onSort: this.sortTopics
        });
      }
    }

  }
  LiChessTools.Tools.StudyTopics = StudyTopicsTool;
})();
