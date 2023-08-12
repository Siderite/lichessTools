(()=>{
  class TimelineNotifyTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'timelineNotify',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.timelineNotify': 'Timeline notifications',
        'timeline': 'Timeline',
        'timelineNotification': 'You have %s new entries',
        'timelineNotifyTitle': 'LiChess Tools - go to Timeline'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.timelineNotify': 'Notific\u0103ri la activitate recent\u0103',
        'timeline': 'Activitate recent\u0103',
        'timelineNotification': 'Ai %s intr\u0103ri noi',
        'timelineNotifyTitle': 'LiChess Tools - c\u0103tre Activitate recent\u0103'
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
      const $=parent.$;
      const trans=parent.translator;
      if (el!==true && !$(el).is('div.notifications')) return;
      this.lastRead=+(lichess.storage.get('LiChessTools.lastRead'))||0;
      const timeline=await parent.net.json('/timeline?nb=100');
      const newEntries=timeline.entries
        .filter(e=>e.date>this.lastRead)
        .filter(e=>['forum-post','blog-post'].includes(e.type));

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
      title=title.replaceAll(count.toString(),newCount.toString());
      toggle
        .attr('data-count',newCount)
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
      this.logOption('Post notifications', value);
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
      this.processTimeline(true);
    }

  }
  LiChessTools.Tools.TimelineNotify=TimelineNotifyTool;
})();
