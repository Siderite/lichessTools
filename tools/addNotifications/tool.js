(() => {
  class AddNotificationsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

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
      },
      'zh-TW': {
        'options.general': '\u4E3B\u8981',
        'options.addNotifications': '\u65B0\u589E\u901A\u77E5',
      }
    }

    notifications = [];
    addNotification = (notification) => {
      this.notifications.push(notification);
      this.forcedProcessNotifications();
    };
    markEntryRead = (id) => {
      const notification = this.notifications.find(n => n.id == id);
      if (notification) {
        notification.isNew = false;
      }
      this.processNotifications();
    }

    processNotifications = async (el) => {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      if (lichess.quietMode) return;
      if (parent.global.document.hidden) return;
      const $ = parent.$;
      const trans = parent.translator;
      if (el !== true && !$(el).is('div.notifications')) return;
      this.lastRead = parent.storage.get('LiChessTools.lastRead', 0);

      if ($('.shown div.notifications').length) {
        this._unreadNotifications = 0;
        parent.global.clearInterval(this.closeInterval);
        this.closeInterval = parent.global.setInterval(() => {
          if (!$('.shown div.notifications').length) {
            parent.global.clearInterval(this.closeInterval);
            this.forcedProcessNotifications();
          }
        }, 500);
      }

      const toggle = $('#top div.site-buttons #notify-toggle span');
      const app = $('#top div.site-buttons #notify-app');
      let notifications = $('div.notifications', app);
      const count = +(toggle.attr('data-count')) || 0;
      let newCount = this._unreadNotifications;
      for (const notification of this.notifications) {
        const entries = await notification.getEntries();
        newCount += entries.length;
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
      }
      let title = toggle.attr('title');
      title = title?.replaceAll(count.toString(), newCount.toString());
      toggle
        .attr('data-count', newCount)
        .attr('title', title)
        .attr('aria-label', title);
    };
    forcedProcessNotifications = this.lichessTools.debounce(() => this.processNotifications(true), 500);

    _unreadNotifications = 0;
    updateNotificationCount = (ev) => {
      const parent = this.lichessTools;
      const count = ev?.unread;
      if (count === undefined) {
        parent.global.console.warn('Could not read unread value from socket.in.notifications', ev);
      }
      this._unreadNotifications = +count;
    };

    async start() {
      const parent = this.lichessTools;
      const lichess = parent.lichess;
      const $ = parent.$;
      const value = parent.currentOptions.getValue('addNotifications');
      this.logOption('Add notifications', value);
      if (!parent.getUserId()) {
        parent.global.console.debug(' ... Disabled (not logged in)');
        return;
      }

      lichess.pubsub.off('content-loaded', this.processNotifications);
      parent.global.clearInterval(this.interval);
      parent.global.clearInterval(this.closeInterval);
      lichess.pubsub.off('socket.in.notifications', this.updateNotificationCount);
      parent.notifications = undefined;
      if (!value) return;
      parent.notifications = {
        add: this.addNotification.bind(this),
        markEntryRead: this.markEntryRead.bind(this),
        refresh: this.forcedProcessNotifications.bind(this)
      };

      lichess.pubsub.on('content-loaded', this.processNotifications);
      this.interval = parent.global.setInterval(() => {
        if ($('div.shown #notify-app div.empty.text').length) {
          this.forcedProcessNotifications();
        }
      }, 500);

      lichess.pubsub.on('socket.in.notifications', this.updateNotificationCount);
      const unread = await parent.api.notification.getUnread();
      this._unreadNotifications = unread;
      this.forcedProcessNotifications();
    }

  }
  LiChessTools.Tools.AddNotifications = AddNotificationsTool;
})();
