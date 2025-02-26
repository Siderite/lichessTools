(() => {
  class TimelineNotifyTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['AddNotifications'];

    preferences = [
      {
        name: 'timelineNotify',
        category: 'general',
        type: 'multiple',
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
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
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
      'ro-RO': {
        'options.general': 'General',
        'options.timelineNotify': 'Notific\u0103ri la activitate recent\u0103',
        'timeline': 'Activitate recent\u0103',
        'timelineNotification': 'Ai %s intr\u0103ri noi',
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

    setAllRead = () => {
      const lt = this.lichessTools;
      this.lastRead = Date.now();
      lt.storage.set('LiChessTools.lastRead', this.lastRead);
      lt.notifications.refresh();
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const trans = lt.translator;
      const value = lt.currentOptions.getValue('timelineNotify');
      switch (value) {
        case true: this.types = this.preferences[0].defaultValue.split(','); break;
        case false: this.types = []; break;
        default: this.types = value?.split(','); break;
      }
      this.logOption('Timeline notifications', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      if (!value) return;

      if (/^\/timeline/i.test(lt.global.location.pathname)) this.setAllRead();
      const notification = {
        id: 'timelineNotify',
        getEntries: async () => {
          this.lastRead = +(lt.storage.get('LiChessTools.lastRead')) || 0;
          const timeline = await lt.api.timeline.get(this.lastRead);
          if (!this.lastRead) {
            this.setAllRead();
          }
          if (!timeline) return [];
          const newEntries = timeline.entries
            .filter(e => e.date > this.lastRead)
            .filter(e => this.types.includes(e.type));
          const justNotified = +(lt.storage.get('just-notified')) || 0;
          if (!newEntries
            .find(e => e.date > justNotified)) return [];
          const entry = {
            id: 'timelineNotify',
            isNew: true,
            icon: lt.icon.Envelope,
            href: '/timeline',
            content: $('<div>')
              .append($('<span>').text(trans.noarg('timeline')))
              .append($('<span>').text(trans.pluralSame('timelineNotification', newEntries.length)))
              .html(),
            title: trans.noarg('timelineNotifyTitle')
          };
          return [entry];
        }
      };
      lt.notifications.add(notification);
    }

  }
  LiChessTools.Tools.TimelineNotify = TimelineNotifyTool;
})();
