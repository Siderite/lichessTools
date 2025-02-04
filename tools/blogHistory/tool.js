(() => {
  class BlogHistoryTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'blogHistory',
        category: 'comm',
        type: 'multiple',
        possibleValues: ['showVisited','persistView'],
        defaultValue: 'showVisited,persistView',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.comm': 'Chat, forums, blogs',
        'options.blogHistory': 'Blog visit history',
        'blogHistory.showVisited': 'Show visited',
        'blogHistory.persistView': 'Persistent blog view',
        'visitedTitle': 'LiChess Tools - last visited on %s'
      },
      'ro-RO': {
        'options.comm': 'Chat, forumuri, blog-uri',
        'options.blogHistory': 'Istorie vizite blog',
        'blogHistory.showVisited': 'Arat\u0103 vizite',
        'blogHistory.persistView': 'Persist\u0103 vizualizarea blogurilor',
        'visitedTitle': 'LiChess Tools - ultima vizit\u0103 pe %s'
      }
    }

    ensureLogs = ()=>{
      const lt = this.lichessTools;
      if (!this._logs) {
        const logs = lt.storage.get('LiChessTools.blogHistory', { zip: true }) || [];
        this._logs = new Map(logs);
      }
    };

    logVisit = (userId, slug, postId, isLiked)=>{
      const lt = this.lichessTools;
      this.ensureLogs();
      const key = [userId, slug, postId].join('/');
      let item = this._logs.get(key);
      if (!item) {
        item = {
          visits: 0
        };
        this._logs.set(key,item);
      }
      if (!this._firstTime) {
        this._firstTime = true;
        item.visits++;
      }
      item.lastVisit = Date.now();
      item.isLiked = isLiked || undefined;
      lt.storage.set('LiChessTools.blogHistory', Array.from(this._logs.entries()), { zip: true })
    };

    processVisited = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const m = /^\/@\/(?<userId>[^\/]+)\/blog\/(?<slug>[^\/]+)\/(?<postId>[^\/]+)/.exec(lt.global.location.pathname);
      if (!m) return;
      const isLiked = !!$('button.ublog-post__like.ublog-post__like--liked').length;
      this.logVisit(m.groups.userId,m.groups.slug,m.groups.postId,isLiked);
    };

    processBlogCards = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const cards = $('a.ublog-post-card');
      if (!cards.length) return;
      cards.each((i,e)=>{
        if (e._initVisit) return;
        e._initVisit = true;
        const href = $(e).attr('href');
        if (!href) return;
        const m = /^\/@\/(?<userId>[^\/]+)\/blog\/(?<slug>[^\/]+)\/(?<postId>[^\/]+)/.exec(href);
        if (m) {
          const key = [m.groups.userId, m.groups.slug, m.groups.postId].join('/');
          this.ensureLogs();
          let item = this._logs.get(key);
          if (item) {
            const time = new Date(item.lastVisit).toLocaleDateString(lt.lichess?.displayLocale);
            const checkmark = $('<div class="lichessTools-visited">')
              .attr('title',trans.pluralSame('visitedTitle', time))
              .attr('data-icon',lt.icon.Eye)
              .attr('data-count',item.visits)
              .appendTo(e);
            if (item.isLiked) {
              checkmark
                .attr('data-icon',lt.icon.Heart)
                .addClass('lichessTools-liked');
            }
          }
        }
      });
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('blogHistory');
      this.logOption('Blog history', value);
      this.options = {
        showVisited: lt.isOptionSet(value, 'showVisited'),
        persistView: lt.isOptionSet(value, 'persistView')
      };
      lt.pubsub.off('content-loaded', this.processBlogCards);
      lt.pubsub.off('lichessTools.redraw', this.processBlogCards);
      $('.ublog-post__meta')
        .observer()
        .off('.ublog-post__like',this.processVisited);
      if (this.options.showVisited) {
        const meta = $('.ublog-post__meta');
        if (meta.length) {
          meta
            .observer()
            .on('.ublog-post__like',this.processVisited,{
              subtree:true,
              attributes: true
            });
          this.processVisited();
        }
        lt.pubsub.on('content-loaded', this.processBlogCards);
        lt.pubsub.on('lichessTools.redraw', this.processBlogCards);
        this.processBlogCards();
      }
      if (this.options.persistView) {
        const isBlogUrl = /^\/blog(\/|$)?/i.test(lt.global.location.pathname);
        if (isBlogUrl) {
          lt.storage.set('LiChessTools.blogHistory-view',lt.global.location.href);
        }
        const blogViewUrl = lt.storage.get('LiChessTools.blogHistory-view');
        if (blogViewUrl) {
          $('#topnav section a[href="/blog/community"]').attr('href', blogViewUrl);
        }
      }
    }

  }
  LiChessTools.Tools.BlogHistory = BlogHistoryTool;
})();
