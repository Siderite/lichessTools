(() => {
  class AddToTeamTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['AddNotifications'];

    preferences = [
      {
        name: 'addToTeam',
        category: 'community',
        type: 'multiple',
        possibleValues: ['hideForum', 'forumBottom', 'noNotifications'],
        defaultValue: false,
        offValue: 'hideForum,noNotifications',
        needsLogin: true
      }
    ];

    teamId = 'l1chess-tools-users-team';
    teamName = 'L1Chess Tools Users Team';

    intl = {
      'en-US': {
        'options.community': 'Community',
        'options.addToTeam': 'LiChess Tools team',
        'addToTeam.hideForum': 'Hide forum entry',
        'addToTeam.forumBottom': 'Forum entry last',
        'addToTeam.noNotifications': 'Disable notifications',
        'joinTeamText': 'Join the team',
        'teamTitle': 'Users of the LiChess Tools browser extension',
        'teamSubtitle': 'Join the team to access the forum, meet other users, get updates or give feedback',
        'welcomeToTeam': 'Welcome to the LiChess Tools user team!',
        'byeFromTeam': 'Sorry to see you go!'
      },
      'ro-RO': {
        'options.community': 'Comunitate',
        'options.addToTeam': 'Echipa LiChess Tools',
        'addToTeam.hideForum': 'Ascunde sec\u0163iunea din forum',
        'addToTeam.forumBottom': 'Sec\u0163iunea din forum la final',
        'addToTeam.noNotifications': 'F\u0103r\u0103 notific\u0103ri',
        'joinTeamText': 'Intr\u0103 \u00een echip\u0103',
        'teamTitle': 'Echipa utilizatorilor extensiei de browser LiChess Tools',
        'teamSubtitle': 'Intr\u0103 \u00een echip\u0103 pentru acces la forum, al\u0163i utilizatori, nout\u0103\u0163i sau p\u0103reri',
        'welcomeToTeam': 'Bine ai venit \u00een echipa utilizatorilor LiChess Tools!',
        'byeFromTeam': 'Ne pare r\u0103u c\u0103 pleci!'
      }
    }

    async clearJoinState() {
      const lt = this.lichessTools;
      lt.global.setTimeout(async () => {
        lt.currentOptions['addToTeam'] = false;
        await lt.saveOptions(lt.currentOptions);
      }, 500);
    }

    async joinLichessTeam() {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const user = lt.getUserId();
      if (!user) return;
      const r = await fetch('/team/' + this.teamId + '/join', { method: 'POST' });
      if (r.ok) {
        this.options.inTeam = true;
        lt.global.localStorage.setItem('LiChessTools.joinedTeam', Date.now());
        lt.announce(trans.noarg('welcomeToTeam'));
        this.clearJoinState();
      }
      return r.ok;
    }

    async quitLichessTeam() {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const user = lt.getUserId();
      if (!user) return;
      const r = user?.toLowerCase() == 'totalnoob69'
        ? { ok: true }
        : await fetch('/team/' + this.teamId + '/quit', { method: 'POST' });
      if (r.ok) {
        this.options.inTeam = false;
        lt.global.localStorage.removeItem('LiChessTools.joinedTeam');
        lt.announce(trans.noarg('byeFromTeam'));
        this.clearJoinState();
      }
      return r.ok;
    }

    refreshTeam = async (forced) => {
      if (this.options.hideForum && this.options.noNotifications) return;
      const lt = this.lichessTools;
      const user = lt.getUserId();
      if (!user) return;
      const joinedTime = +lt.global.localStorage.getItem('LiChessTools.joinedTeam') || 0;
      if (!forced && joinedTime && Date.now() - joinedTime < 3600000) {
        this.inTeam = true;
        return;
      }
      const r = await lt.api.team.getUserTeams(user);
      this.inTeam = !!r.find(t => t.id == this.teamId);
      if (this.inTeam && !joinedTime) {
        lt.global.localStorage.setItem('LiChessTools.joinedTeam', Date.now());
      }
    };

    isForumPage = () => {
      const lt = this.lichessTools;
      return lt.global.location.pathname == '/forum';
    };

    isTeamPage = () => {
      const lt = this.lichessTools;
      return new lt.global.RegExp('\/' + lt.escapeRegex(this.teamId), 'i').test(lt.global.location.pathname);
    };

    updateForumPage = async () => {
      if (!this.isForumPage()) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('main.forum table.categs').eq(0);
      let row = $('tr.lichessTools-addToTeam', container);
      if (this.options.hideForum) {
        row.remove();
        return;
      }
      const existingRow = $('main.forum table.categs tr:has(a[href="/forum/team-' + this.teamId + '"])');
      if (!row.length) {
        if (existingRow.length) {
          row = existingRow
            .clone()
            .addClass('lichessTools-addToTeam');
        } else {
          if (this.inTeam) {
            lt.global.location.reload()
          }
          row = $(`<tr class="lichessTools-addToTeam">
<td class="subject">
  <h2>
    <a></a>
  </h2>
  <p></p>
</td>
<td class="lichessTools-joinTeam">
  <button class="button">
</td>
</tr>`);
          $('h2 a', row)
            .text(this.teamName)
            .attr('title', trans.noarg('teamTitle'))
            .attr('href', '/team/' + this.teamId);
          const columnCount = $('tr:nth-child(1) > td', container).length;
          $('td', row).first()
            .find('p')
            .text(trans.noarg('teamSubtitle'));
          $('td', row).last()
            .attr('colspan', columnCount - 1);
          $('button', row)
            .text(trans.noarg('joinTeamText'))
            .on('click', async ev => {
              ev.preventDefault();
              const joined = await this.joinLichessTeam();
              if (joined) {
                lt.global.setTimeout(() => lt.global.location.reload(), 5000);
              }
            });
        }
      } else {
        if (!this.inTeam && existingRow.length) {
          lt.global.location.reload()
        }
      }
      const lastForum = $('tr:not(.lichessTools-addToTeam)', container).last();
      if (this.options.forumBottom) {
        row.insertAfter(lastForum);
      } else {
        row.insertBefore(lastForum);
      }
    };

    setVisitedTeamPage = () => {
      const lt = this.lichessTools;
      lt.storage.set('addToTeam-visitedTeamPage', Date.now());
    };

    notifyToJoin = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      if (this.options.noNotifications) return;
      const isNotified = lt.storage.get('addToTeam-visitedTeamPage');
      if (isNotified) return;
      const notification = {
        getEntries: async () => {
          const entry = {
            id: 'addToTeam',
            isNew: true,
            icon: lt.icon.Group,
            href: '/team/' + lt.global.encodeURIComponent(this.teamId),
            content: $('<div>')
              .append($('<span>').text(trans.noarg('joinTeamText')))
              .append($('<span>').text(trans.noarg('teamTitle')))
              .html(),
            title: trans.noarg('teamSubtitle')
          };
          return [entry];
        }
      };
      lt.notifications.add(notification);
    };

    removeWarningFromTeamForum = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      if (lt.global.location.pathname!='/forum/team-l1chess-tools-users-team/form') return;
      $('main.topic-form section.warning').remove();
      $('body').trigger('resize');
    };

    async start() {
      const lt = this.lichessTools;
      if (lt.isDev()) return;
      const value = lt.currentOptions.getValue('addToTeam');
      this.logOption('Add to team', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      if (lt.currentOptions.enableLichessTools === false) return;
      this.options = {
        hideForum: lt.isOptionSet(value, 'hideForum'),
        forumBottom: lt.isOptionSet(value, 'forumBottom'),
        noNotifications: lt.isOptionSet(value, 'noNotifications')
      };
      if (this.isTeamPage()) this.setVisitedTeamPage();
      await this.refreshTeam(this.isForumPage());
      if (!this.inTeam) {
        this.notifyToJoin();
      }
      await this.updateForumPage();
      this.removeWarningFromTeamForum();
    }

  }
  LiChessTools.Tools.AddToTeam = AddToTeamTool;
})();
