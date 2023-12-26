(()=>{
  class TimelineNotifyTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'timelineNotify',
        category: 'general',
        type:'multiple',
        possibleValues: [
          'forum-post',
          'ublog-post',
          'blog-post',
          'stream-start',
          'simul-create',
          'simul-join',
          'team-create',
          'team-join',
          'tour-join',
          'follow',
          'study-like',
          'ublog-post-like'/*,
          'game-end',
          'plan-start',
          'plan-renew'*/
        ],
        defaultValue: 'forum-post,ublog-post',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.timelineNotify': 'Timeline notifications',
        'timeline': 'Timeline',
        'timelineNotification': 'You have %s new entries',
        'timelineNotifyTitle': 'LiChess Tools - go to Timeline',
        'timelineNotify.forum-post': 'Forum post',
        'timelineNotify.ublog-post': 'Blog post',
        'timelineNotify.blog-post': 'Lichess announcement',
        'timelineNotify.stream-start': 'Stream start',
        'timelineNotify.simul-create': 'Simul create',
        'timelineNotify.simul-join': 'Simul join',
        'timelineNotify.team-create': 'Team create',
        'timelineNotify.team-join': 'Team join',
        'timelineNotify.tour-join': 'Tournament join',
        'timelineNotify.follow': 'Following',
        'timelineNotify.study-like': 'Study like',
        'timelineNotify.ublog-post-like': 'Blog post like',
        'timelineNotify.game-end': 'Game end',
        'timelineNotify.plan-start': 'Become patron',
        'timelineNotify.plan-renew': 'Renew patron'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.timelineNotify': 'Notific\u0103ri la activitate recent\u0103',
        'timeline': 'Activitate recent\u0103',
        'timelineNotification': 'Ai %s \u00eentr\u0103ri noi',
        'timelineNotifyTitle': 'LiChess Tools - c\u0103tre Activitate recent\u0103',
        'timelineNotify.forum-post': 'Post pe forum',
        'timelineNotify.ublog-post': 'Post pe blog',
        'timelineNotify.blog-post': 'Anun\u0163 Lichess',
        'timelineNotify.stream-start': 'Stream live',
        'timelineNotify.simul-create': 'Creare simultan\u0103',
        'timelineNotify.simul-join': 'Participare la simultan\u0103',
        'timelineNotify.team-create': 'Creare echip\u0103',
        'timelineNotify.team-join': 'Intrare echip\u0103',
        'timelineNotify.tour-join': 'Intrare turneu',
        'timelineNotify.follow': 'Urm\u0103rire',
        'timelineNotify.study-like': 'Studiu pl\u0103cut',
        'timelineNotify.ublog-post-like': 'Post pe blog pl\u0103cut',
        'timelineNotify.game-end': 'Sf\u00e2r\u015fit de joc',
        'timelineNotify.plan-start': 'Devenire patron',
        'timelineNotify.plan-renew': 'Re\u00eennoire patron'
      }
    }

    setAllRead=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      this.lastRead=new Date().getTime();
      lichess.storage.set('LiChessTools.lastRead',this.lastRead);
    };

    processTimeline=async (el)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      if (lichess.quietMode) return;
      if (parent.global.document.hidden) return;
      const $=parent.$;
      const trans=parent.translator;
      if (el!==true && !$(el).is('div.notifications')) return;
      this.lastRead=+(lichess.storage.get('LiChessTools.lastRead'))||0;
      const timeline=await parent.net.json({url:'/timeline?nb=100&since={lastRead}',args:{lastRead:this.lastRead}});
      if (!timeline) return;
      const newEntries=timeline.entries
        .filter(e=>e.date>this.lastRead)
        .filter(e=>this.types.includes(e.type));

      const toggle=$('#top div.site-buttons #notify-toggle span');
      const app=$('#top div.site-buttons #notify-app');
      let notifications=$('div.notifications',app);

      const count=+toggle.attr('data-count')||0;
      const justNotified=+(lichess.storage.get('just-notified'))||0;
      const isNew=!!newEntries
                     .find(e=>e.date>justNotified);
      const notify=await parent.net.json('/notify?page=1');
      const newCount=notify.unread+(isNew?1:0);
      let title=toggle.attr('title');
      title=title?.replaceAll(count.toString(),newCount.toString());
      toggle
        .attr('data-count',newCount||undefined)
        .attr('title',title)
        .attr('aria-label',title);
      let elem = $('a.site_notification.lichessTools-timelineNotify',notifications);
      if (newEntries.length) {
        if (!notifications.length) {
          const emptyDiv=$('div.empty',app).removeAttr('data-icon').empty();
          notifications=$('<div class="notifications">')
            .appendTo(emptyDiv);
        }
        if (!elem.length) {
          elem=$(`<a class="site_notification lichessTools-timelineNotify" href="/timeline">
               <i data-icon="\uE058"></i>
               <span class="content"></span>
             </a>`)
            .attr('title',trans.noarg('timelineNotifyTitle'))
            .prependTo(notifications)
            .find('span.content')
            .append($('<span>')
                      .text(trans.noarg('timeline'))
            ).append($('<span>'));
        }
        elem
          .toggleClass('new',isNew)
          .find('span.content span:nth-child(2)')
          .text(trans.pluralSame('timelineNotification',newEntries.length));
      } else {
        elem.remove();
      }
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const value=parent.currentOptions.getValue('timelineNotify');
      switch(value) {
        case true: this.types=this.preferences[0].defaultValue.split(','); break;
        case false: this.types=[]; break;
        default: this.types=value?.split(','); break;
      }
      this.logOption('Timeline notifications', value);
      if (!parent.userLoggedIn()) {
        parent.global.console.debug(' ... Disabled (not logged in)');
        return;
      }

      lichess.pubsub.off('content-loaded',this.processTimeline);
      parent.global.clearInterval(this.interval);
      if (!value) return;
      lichess.pubsub.on('content-loaded',this.processTimeline);
      this.interval=parent.global.setInterval(()=>{
        if ($('div.shown #notify-app div.empty.text').length) {
          this.processTimeline(true);
        }
      },500);
      if (!this.readAllStorage) {
        this.readAllStorage = lichess.storage.make('notify-read-all');
        this.readAllStorage.listen(this.setAllRead);
      }
      if (/^\/timeline/i.test(location.pathname)) this.setAllRead();
      parent.global.requestAnimationFrame(()=>this.processTimeline(true));
    }

  }
  LiChessTools.Tools.TimelineNotify=TimelineNotifyTool;
})();
