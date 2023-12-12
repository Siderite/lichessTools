(()=>{
  class AddToTeamTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'addToTeam',
        category: 'community',
        type:'single',
        possibleValues: ['join','quit'],
        defaultValue: false
      }
    ];

    intl={
      'en-US':{
        'options.community': 'Community',
        'options.addToTeam': 'Add me to LiChess Tools team',
        'addToTeam.join': 'Add me',
        'addToTeam.quit': 'Remove me',
        'welcomeToTeam': 'Welcome to the LiChess Tools user team!',
        'byeFromTeam': 'Sorry to see you go!'
      },
      'ro-RO':{
        'options.community': 'Comunitate',
        'options.addToTeam': 'Adaug\u0103-m\u0103 la echipa LiChess Tools',
        'addToTeam.join': 'Adaug\u0103-m\u0103',
        'addToTeam.quit': 'Scoate-m\u0103',
        'welcomeToTeam': 'Bine ai venit \u00een echipa utilizatorilor LiChess Tools!',
        'byeFromTeam': 'Ne pare r\u0103u c\u0103 pleci!'
      }
    }

    async joinLichessTeam() {
      const parent=this.lichessTools;
      const trans=parent.translator;
      const hasJoined = parent.global.localStorage.getItem('LiChessTools.joinedTeam');
      if (hasJoined) return;
      const user=parent.getUserId();
      if (!user) return;
      const r=await fetch("/team/l1chess-tools-users-team/join",{ method: 'POST' });
      if (r.ok) {
        parent.global.localStorage.setItem('LiChessTools.joinedTeam',+(new Date()));
        parent.announce(trans.noarg('welcomeToTeam'));
      }
      return r.ok;
    }

    async quitLichessTeam() {
      const parent=this.lichessTools;
      const trans=parent.translator;
      const hasJoined = parent.global.localStorage.getItem('LiChessTools.joinedTeam');
      if (!hasJoined) return;
      const user=parent.getUserId();
      if (!user) return;
      const r=user=='totalnoob69'
        ? { ok: true }
        : await fetch("/team/l1chess-tools-users-team/quit",{ method: 'POST' });
      if (r.ok) {
        parent.global.localStorage.removeItem('LiChessTools.joinedTeam');
        parent.announce(trans.noarg('byeFromTeam'));
      }
      return r.ok;
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('addToTeam');
      this.logOption('Add to team', value);
      this.options={
        join:parent.isOptionSet(value,'join'),
        quit:parent.isOptionSet(value,'quit') && value!==true,
      }
      if (this.options.join) {
        await this.joinLichessTeam();
      }
      if (this.options.quit) {
        await this.quitLichessTeam();
      }
    }

  }
  LiChessTools.Tools.AddToTeam=AddToTeamTool;
})();
