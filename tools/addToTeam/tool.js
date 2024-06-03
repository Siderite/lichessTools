(()=>{
  class AddToTeamTool extends LiChessTools.Tools.ToolBase {

    dependencies=[ 'AddNotifications' ];

    preferences=[
      {
        name:'addToTeam',
        category: 'community',
        type:'multiple',
        possibleValues: ['hideForum','noNotifications'],
        defaultValue: false
      }
    ];

    teamId='l1chess-tools-users-team';
    teamName='L1Chess Tools Users Team';

    intl={
      'en-US':{
        'options.community': 'Community',
        'options.addToTeam': 'LiChess Tools team',
        'addToTeam.hideForum': 'Hide forum entry',
        'addToTeam.noNotifications': 'Disable notifications',
        'joinTeamText': 'Join the team',
        'teamTitle': 'Users of the LiChess Tools browser extension',
        'teamSubtitle': 'Join the team to access the forum, meet other users, get updates or give feedback',
        'welcomeToTeam': 'Welcome to the LiChess Tools user team!',
        'byeFromTeam': 'Sorry to see you go!'
      },
      'ro-RO':{
        'options.community': 'Comunitate',
        'options.addToTeam': 'Echipa LiChess Tools',
        'addToTeam.hideForum': 'Ascunde sec\u0163iunea din forum',
        'addToTeam.noNotifications': 'F\u0103r\u0103 notific\u0103ri',
        'joinTeamText': 'Intr\u0103 \u00een echip\u0103',
        'teamTitle': 'Echipa utilizatorilor extensiei de browser LiChess Tools',
        'teamSubtitle': 'Intr\u0103 \u00een echip\u0103 pentru acces la forum, al\u0163i utilizatori, nout\u0103\u0163i sau p\u0103reri',
        'welcomeToTeam': 'Bine ai venit \u00een echipa utilizatorilor LiChess Tools!',
        'byeFromTeam': 'Ne pare r\u0103u c\u0103 pleci!'
      }
    }

    async clearJoinState() {
      const parent=this.lichessTools;
      parent.global.setTimeout(async ()=>{
        parent.currentOptions['addToTeam']=false;
        await parent.saveOptions(parent.currentOptions);
      },500);
    }

    async joinLichessTeam() {
      const parent=this.lichessTools;
      const trans=parent.translator;
      const user=parent.getUserId();
      if (!user) return;
      const r=await fetch('/team/'+this.teamId+'/join',{ method: 'POST' });
      if (r.ok) {
        this.options.inTeam=true;
        parent.global.localStorage.setItem('LiChessTools.joinedTeam',Date.now());
        parent.announce(trans.noarg('welcomeToTeam'));
        this.clearJoinState();
      }
      return r.ok;
    }

    async quitLichessTeam() {
      const parent=this.lichessTools;
      const trans=parent.translator;
      const user=parent.getUserId();
      if (!user) return;
      const r=user=='totalnoob69'
        ? { ok: true }
        : await fetch('/team/'+this.teamId+'/quit',{ method: 'POST' });
      if (r.ok) {
        this.options.inTeam=false;
        parent.global.localStorage.removeItem('LiChessTools.joinedTeam');
        parent.announce(trans.noarg('byeFromTeam'));
        this.clearJoinState();
      }
      return r.ok;
    }

    refreshTeam=async ()=>{
      const parent=this.lichessTools;
      const user=parent.getUserId();
      if (!user) return;
      const r=await parent.net.json({url:'/api/team/of/{user}',args:{ user }});
      this.inTeam=!!r.find(t=>t.id==this.teamId);
    };

    isForumPage=()=>{
      return this.lichessTools.global.location.pathname=='/forum';
    };

    updateForumPage=async ()=>{
      if (!this.isForumPage()) return;
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const container=$('main.forum table.categs').eq(0);
      let row=$('tr.lichessTools-addToTeam',container);
      if (this.options.hideForum) {
        row.remove();
        return;
      }
      const existingRow=$('main.forum table.categs tr:has(a[href="/forum/team-'+this.teamId+'"])');
      if (!row.length) {
        if (existingRow.length) {
          row=existingRow
                .clone()
                .addClass('lichessTools-addToTeam');
        } else {
          if (this.inTeam) {
            parent.global.location.reload()
          }
          row=$(`<tr class="lichessTools-addToTeam">
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
          $('h2 a',row)
            .text(this.teamName)
            .attr('title',trans.noarg('teamTitle'))
            .attr('href','/team/'+this.teamId);
          const columnCount=$('tr:nth-child(1) > td',container).length;
          $('td',row).first()
            .find('p')
            .text(trans.noarg('teamSubtitle'));
          $('td',row).last()
            .attr('colspan',columnCount-1);
          $('button',row)
            .text(trans.noarg('joinTeamText'))
            .on('click',async ev=>{
               ev.preventDefault();
               const joined=await this.joinLichessTeam();
               if (joined) {
                 parent.global.setTimeout(()=>parent.global.location.reload(),5000);
               }
            });
        }
        row.insertBefore($('tr',container).last());
      } else {
        if (!this.inTeam && existingRow.length) {
          parent.global.location.reload()
        }
      }
    };

    setWasNotified=()=>{
      const parent=this.lichessTools;
      parent.storage.set('addToTeam-wasNotified',Date.now());
    };

    notifyToJoin=()=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      if (this.options.noNotifications) return;
      const isNotified = parent.storage.get('addToTeam-wasNotified');
      if (isNotified) return;
      const notification={
        getEntries: async ()=>{
          const entry={
            id: 'addToTeam',
            isNew: true,
            icon: '\uE059',
            href: '/team/l1chess-tools-users-team',
            content: $('<div>')
                       .append($('<span>').text(trans.noarg('joinTeamText')))
                       .append($('<span>').text(trans.noarg('teamTitle')))
                     .html(),
            title: trans.noarg('teamSubtitle')
          };
          return [ entry ];
        }
      };
      parent.notifications.add(notification);
      
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('addToTeam');
      this.logOption('Add to team', value);
      this.options={
        hideForum:parent.isOptionSet(value,'hideForum'),
        noNotifications:parent.isOptionSet(value,'noNotifications')
      };
      if (/\/l1chess-tools-users-team/i.test(location.pathname)) this.setWasNotified();
      await this.refreshTeam();
      if (!this.inTeam) {
        this.notifyToJoin();
      }
      await this.updateForumPage();
    }

  }
  LiChessTools.Tools.AddToTeam=AddToTeamTool;
})();
