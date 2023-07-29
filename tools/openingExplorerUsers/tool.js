(()=>{
  class OpeningExplorerUsersTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitRedraw'];

    preferences=[
      {
        name:'openingExplorerUsers',
        category: 'analysis',
        type:'multiple',
        possibleValues: ['switchWithMe','deleteUser'],
        defaultValue: 'switchWithMe,deleteUser',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.analysis': 'Analysis',
        'options.openingExplorerUsers': 'Opening explorer player features',
        'switchWithMe': 'Me',
        'switchWithMeTitle': 'LiChess Tools - Switch player with yourself',
        'openingExplorerUsers.switchWithMe': 'Me button to switch to your player',
        'openingExplorerUsers.deleteUser': 'Ability to remove players from name list'
      },
      'ro-RO':{
        'options.analysis': 'Analiz\u0103',
        'options.openingExplorerUsers': 'Facilit\u0103\u0163i pentru juc\u0103tori \u00een Explorator',
        'switchWithMe': 'Eu',
        'switchWithMeTitle': 'LiChess Tools - Schimb\u0103 juc\u0103torul cu tine',
        'openingExplorerUsers.switchWithMe': 'Buton Eu pentru selec\u0163ie rapid\u0103',
        'openingExplorerUsers.deleteUser': '\u015Etergere nume juc\u0103tori din list\u0103'
      }
    }

    addOpeningExplorerUserDeleteButtons=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const explorer=lichess.analysis?.explorer;
      if (!explorer) return;
      const container=$('div.explorer__config__player__choice');
      if (!container.length) return;
      const participants=explorer.config.participants;
      $('button:not(.button-green,.lichessTools-deleteUser)',container).filter((i,e)=>!$(e).next().is('.lichessTools-deleteUser'))
        .each((i,e)=>{
          const el = $(e).wrap('<span class="lichessTools-wrap"/>');
          const user=$(e).text();
          if (participants.findIndex(p=>p==user)>=0) return;
          const delButton=$('<button class="lichessTools-deleteUser"/>').text('\uE071')
            .on('click',function(ev) {
              ev.preventDefault();
              const user=$(this).prev().text();
              let previousUsers=lichess.storage.get('explorer.player.name.previous');
              previousUsers=previousUsers?JSON.parse(previousUsers):[];
              previousUsers=previousUsers.filter(u=>u!=user);
              lichess.storage.set('explorer.player.name.previous',JSON.stringify(previousUsers));
              $('.lichessTools-deleteUser',container).remove();
              const currentUser=explorer.config.data.playerName.value();
              if (currentUser==user) {
                const myName=explorer.config.myName;
                explorer.config.data.playerName.value(myName);
              }
              explorer.reload();
            });
         el.after(delButton);
       });
    };

    addOpeningExplorerUserSwitchButton=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const explorer=lichess.analysis?.explorer;
      const trans=parent.translator;
      if (!explorer) return;
      let previousUsers=lichess.storage.get('explorer.player.name.previous');
      previousUsers=previousUsers?JSON.parse(previousUsers):[];
      if (previousUsers.length<=0) {
        $('div.explorer-title button.lichessTools-switchWithMe').remove();
        return;
      }
      if ($('div.explorer-title button.lichessTools-switchWithMe').length) return;
      const translatedText=trans.noarg('switchWithMe');
      const translatedTitle=trans.noarg('switchWithMeTitle');
      $('<button class="button-link"/>')
        .text(translatedText)
        .attr('title',translatedTitle)
        .addClass('lichessTools-switchWithMe')
        .on('click',function(ev) {
          ev.preventDefault();
          let previousUsers=lichess.storage.get('explorer.player.name.previous');
          previousUsers=previousUsers?JSON.parse(previousUsers):[];
          const myName=explorer.config.myName;
          const currentUser=explorer.config.data.playerName.value();
          const user=currentUser!=myName
            ? myName
            : previousUsers[0];
          if (user) {
            explorer.config.selectPlayer(user);
            explorer.reload();
          }
        })
        .appendTo('div.explorer-title');
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('openingExplorerUsers');
      this.logOption('Opening explorer player features', value);
      const lichess=parent.lichess;
      const analysis=lichess?.analysis;
      if (!analysis) return;
      const $=parent.$;
      $('div.explorer-title button.lichessTools-switchWithMe').remove();
      $('div.explorer__config__player__choice .lichessTools-deleteUser').remove();
      lichess.pubsub.off('redraw',this.addOpeningExplorerUserSwitchButton);
      lichess.pubsub.off('redraw',this.addOpeningExplorerUserDeleteButtons);
      if (parent.isOptionSet(value,'switchWithMe')) {
        lichess.pubsub.on('redraw',this.addOpeningExplorerUserSwitchButton);
        this.addOpeningExplorerUserSwitchButton();
      }    
      if (parent.isOptionSet(value,'deleteUser')) {
        lichess.pubsub.on('redraw',this.addOpeningExplorerUserDeleteButtons);
        this.addOpeningExplorerUserDeleteButtons();
      }    
    }

  }
  LiChessTools.Tools.OpeningExplorerUsers=OpeningExplorerUsersTool;
})();
