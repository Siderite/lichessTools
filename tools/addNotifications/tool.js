(() => {
  class AddNotificationsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw','EmitContentLoaded'];

    preferences = [
      {
        name: 'addNotifications',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.addNotifications': 'Add notifications'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.addNotifications': 'Adaug\u0103 notific\u0103ri'
      }
    }

    notifications = [];
    addNotification = (notification) => {
      this.notifications.push(notification);
      this.forcedProcessNotifications();
    };

    processNotifications = async (el) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (lichess.quietMode) return;
      if (lt.global.document.hidden) return;
      const $ = lt.$;
      const trans = lt.translator;
      if (el !== true && !$(el).is('div.notifications')) return;
      this.lastRead = lt.storage.get('LiChessTools.lastRead', 0);

      if ($('.shown div.notifications').length || this._unreadNotifications === undefined) {
        this._unreadNotifications = 0;
        lt.global.clearInterval(this.closeInterval);
        this.closeInterval = lt.global.setInterval(() => {
          if (!$('.shown div.notifications').length) {
            lt.global.clearInterval(this.closeInterval);
            this.forcedProcessNotifications();
          }
        }, 500);
      }

      const toggle = $('#top div.site-buttons #notify-toggle > span');
      const app = $('#top div.site-buttons #notify-app');
      let notifications = $('div.notifications', app);
      const totalEntries = {};
      for (const notification of this.notifications) {
        const entries = await notification.getEntries();
        for (const entry of entries) {
          totalEntries[entry.id] = entry;
        }
      }
      const entries = Object.values(totalEntries);
      for (const entry of entries) {
        if (!notifications.length) {
          const emptyDiv = $('div.empty', app).removeAttr('data-icon').empty();
          notifications = $('<div class="notifications">')
            .appendTo(emptyDiv);
        }
        let elem = $('a.site_notification.lichessTools-addNotifications', notifications)
          .filter((i, e) => $(e).attr('data-id') == entry.id);
        if (!elem.length) {
          elem = $(`<a class="site_notification lichessTools-addNotifications">
            </a>`)
            .append($('<i>').attr('data-icon', entry.icon))
            .append($('<span class="content">').append(entry.content))
            .attr('data-id', entry.id)
            .attr('href', entry.href)
            .attr('title', entry.title)
            .prependTo(notifications);
        }
        elem.toggleClass('new', entry.isNew)
      }

      let title = toggle.attr('title');
      const count = +(toggle.attr('data-count')) || 0;
      const newCount = this._unreadNotifications + entries.length;
      title = title?.replaceAll(count.toString(), newCount.toString());
      this.lastNewCount = newCount;
      toggle
        .attrSafe('data-count', newCount)
        .attrSafe('title', title)
        .attrSafe('aria-label', title);
    };
    forcedProcessNotifications = this.lichessTools.debounce(() => this.processNotifications(true), 250);

    _unreadNotifications = undefined;
    updateNotificationCount = (ev) => {
      const lt = this.lichessTools;
      let count = ev?.unread;
      if (count === undefined) {
        lt.global.console.warn('Could not read unread value from socket.in.notifications', ev);
      }
      count = +count;
      if (this._unreadNotifications != count) {
        this._unreadNotifications = count;
        this.processNotifications();
      }
    };

    async start() {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('addNotifications');
      this.logOption('Add notifications', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }

      lt.pubsub.off('content-loaded', this.processNotifications);
      lt.global.clearInterval(this.interval);
      lt.global.clearInterval(this.closeInterval);
      lt.uiApi.socket.events.off('notifications', this.updateNotificationCount);
      lt.notifications = undefined;
      if (!value) return;
      lt.notifications = {
        add: this.addNotification.bind(this),
        refresh: this.forcedProcessNotifications.bind(this)
      };

      lt.pubsub.on('content-loaded', this.processNotifications);
      this.interval = lt.global.setInterval(() => {
        if ($('div.shown #notify-app div.empty.text').length || $('#notify-toggle > span').attr('data-count')!==this.lastNewCount?.toString()) {
          this.forcedProcessNotifications();
        }
      }, 1000);

      lt.storage?.listen('notify-read-all',this.forcedProcessNotifications);

      lt.uiApi.socket.events.on('notifications', this.updateNotificationCount);
      if (this._unreadNotifications === undefined) {
        const unread = await lt.api.notification.getUnread();
        this._unreadNotifications = unread;
      }
      if (!this.notFirstTime) {
        this.notFirstTime = true;
        this.forcedProcessNotifications();
      }
    }

  }
  LiChessTools.Tools.AddNotifications = AddNotificationsTool;
})();
