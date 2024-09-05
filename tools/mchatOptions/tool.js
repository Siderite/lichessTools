(()=>{
  class MchatOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies=[ 'AddNotifications' ];

    preferences=[
      {
        name:'mchatOptions',
        category: 'general',
        type:'multiple',
        possibleValues: ['urlify','unlimited','images','teamChatNotifications'],
        defaultValue: 'urlify,unlimited,images,teamChatNotifications',
        advanced: true,
        needsLogin: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.mchatOptions': 'Team/Study chat options',
        'mchatOptions.urlify': 'Highlight URLs',
        'mchatOptions.unlimited': 'No length limit',
        'mchatOptions.images': 'Image support',
        'mchatOptions.teamChatNotifications': 'Team chat notifications',
        'newTeamMessagesText': 'You have new messages in team chat for %s',
        'newTeamMessagesSubtitle': 'New messages',
        'teamNotifyTitle': 'Notifications for team chat message',
        'maximumThreeTeams': 'Maximum team notification limit reached!'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.mchatOptions': 'Op\u0163iuni chat echip\u0103/studiu',
        'mchatOptions.urlify': 'Eviden\u0163iaz\u0103 URLuri',
        'mchatOptions.unlimited': 'F\u0103r\u0103 limit\u0103 lungime',
        'mchatOptions.images': 'Suport imagini',
        'mchatOptions.teamChatNotifications': 'Notific\u0103ri la chat \u00een echip\u0103',
        'newTeamMessagesText': 'Ai noi mesaje \u00een chat-ul echipei %s',
        'newTeamMessagesSubtitle': 'Mesaje noi',
        'teamNotifyTitle': 'Notific\u0103ri mesaje \u00een chat-ul echipei',
        'maximumThreeTeams': 'Ai atins num\u0103rul maxim de echipe pentru notificare!'
      }
    }

    urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    processChat=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const container=$('section.mchat');
      if (!container.length) return;
      const createTextNode=parent.global.document.createTextNode.bind(parent.global.document);
      if (this.options.urlify) {
        $('li>t',container).each((i,e)=>{
          if (!parent.inViewport(e)) return;
          const textNodes = Array.from(e.childNodes).filter(n=>n.nodeType==3);
          for (const textNode of textNodes) {
            const lineText=textNode.textContent;
            const matches=lineText?.matchAll(this.urlRegex).toArray();
            if (!matches.length) continue;
            const newNodes=[];
            let p=0;
            for (const match of matches) {
              const url=match[0];
              if (match.index>p) {
                newNodes.push(createTextNode(lineText.substring(p,match.index)));
              }
              const urlEl=$('<a class="lichessTools-chat-url">')
                .attr('target','_blank')
                .attr('href',url)
                .text(url);
              newNodes.push(urlEl[0]);
              p=match.index+url.length;
            }
            if (p<lineText.length) {
              newNodes.push(createTextNode(lineText.substring(p,lineText.length)));
            }
            for (const newNode of newNodes) {
              e.insertBefore(newNode,textNode);
            }
            e.removeChild(textNode);
          }
        });
      }
      if (this.options.images) {
        $('a.lichessTools-chat-url:not(:has(img))',container).each((i,e)=>{
          const url=new URL($(e).attr('href'));
          if (!/\.(jpeg|jpg|gif|png|apng|tiff)$/.test(url.pathname)) return;
          $('<img>')
            .attr('src',url.toString())
            .appendTo($(e).empty());
        });
      }
      if (this.options.unlimited) {
        const input=$('input.mchat__say',container);
        if (input.attr('maxlength')) {
          input.removeAttr('maxlength');
          const oldHandler=parent.getEventHandlers(input[0],'keydown')[0];
          if (oldHandler) {
            parent.removeEventHandlers(input[0],'keydown');

            const splitLength=(s,l)=>{
              const result=[];
              if (!s) return result;
              let p=0;
              const ellipsis='\u2026';
              if (l<s.length) {
                result.push(s.substr(p,l-1)+ellipsis);
                p+=l-1;
              }
              while (p<s.length && p+l-2<s.length) {
                result.push((p>0?ellipsis:'')+s.substr(p,l-2)+ellipsis);
                p+=l-2;
              }
              if (p<s.length) {
                result.push((p>0?ellipsis:'')+s.substr(p));
              }
              return result;
            };

            input.on('keydown',async (ev)=>{
              if (ev.key!='Enter') return;
              ev.preventDefault();
              const text=input.val();
              const matches=text?.matchAll(this.urlRegex).toArray();
              const newTexts=[];
              let p=0;
              for (const match of matches) {
                const url=match[0];
                if (match.index>p) {
                  newTexts.push(text.substring(p,match.index));
                }
                newTexts.push(url);
                p=match.index+url.length;
              }
              if (p<text.length) {
                newTexts.push(text.substring(p,text.length));
              }
              let sendText='';
              for (const newText of newTexts) {
                if (!sendText || sendText.length+newText.length<=140) {
                  sendText+=newText;
                } else {
                  const splits=splitLength(sendText,140);
                  for (const splitText of splits) {
                    lichess.pubsub.emit('socket.send', 'talk', splitText);
                    await parent.timeout(500);
                  }
                  sendText=newText;
                }
              }
              if (sendText) {
                const splits=splitLength(sendText,140);
                for (const splitText of splits) {
                  lichess.pubsub.emit('socket.send', 'talk', splitText);
                  await parent.timeout(100);
                }
              }
              input.val('');
              lichess.storage.make('chat.input',true).remove();
            });
          }
        }
      }
    };

    createSocket=(teamId)=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const StrongSocket=lichess.socket?.constructor;
      if (!StrongSocket) return;
      const socket=new StrongSocket('/team/'+teamId,1);
      socket.send=(...args)=>{
        console.debug('mchatOptions socket trying to send ',args);
      };
      return socket;
    };

    receiveChatMessage=(teamId,data)=>{
      const parent=this.lichessTools;
      const team=this.teamsData.filter(t=>t.teamId==teamId)[0];
      if (!team) return;
      team.newMessage = {
        user:data.u,
        text:data.t
      };
      this.handleNotifications();
    };

    handleNotificationsDirect=async ()=>{
      if (!this.teamsData?.length) return;
      const parent=this.lichessTools;
      const trans=parent.translator;
      const JSON = parent.global.JSON;
      let saveData=false;
      for (const team of this.teamsData) {
        if (team.newMessage && JSON.stringify(team.newMessage)!=JSON.stringify(team.lastMessage)) {
          const teamName=this.userTeams.find(t=>t.id==team.teamId)?.name || team.teamId;
          const notification={
            getEntries: async ()=>{
              const entry={
                id: 'mchatOptions',
                isNew: true,
                icon: '\uE059',
                href: '/team/'+parent.global.encodeURIComponent(team.teamId),
                content: $('<div>')
                           .append($('<span>').text(trans.pluralSame('newTeamMessagesText',teamName)))
                         .html(),
                title: trans.noarg('newTeamMessagesSubtitle')
              };
              return [ entry ];
            }
          };
          parent.notifications.add(notification);
          team.lastMessage=team.newMessage;
          saveData=true;
        }
      }
      if (saveData) {
        this.saveTeamsData();
      }
    };
    handleNotifications=this.lichessTools.debounce(this.handleNotificationsDirect,5000);

    isTeamsListPage=()=>{
      const parent=this.lichessTools;
      return parent.global.location.pathname=='/team/me';
    };

    toggleNotify=(teamId)=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      let index=this.teamsData?.findIndex(t=>t.teamId==teamId);
      if (index>-1) {
        this.teamsData.splice(index,1);
        index=this.sockets.findIndex(s=>s.teamId==teamId);
        if (index>-1) {
          this.sockets[index].socket.destroy();
          this.sockets.splice(index,1);
        }
      } else {
        if (this.sockets.length>=3) {
          parent.announce(trans.noarg('maximumThreeTeams'));
          return;
        }
        this.teamsData.push({ teamId: teamId });
        this.sockets.push({
          teamId:teamId,
          socket:this.createSocket(teamId)
        });
      }
      this.saveTeamsData();
    };

    saveTeamsData=()=>{
      const parent=this.lichessTools;
      parent.storage.set('LichessTools.chatNotificationTeams',this.teamsData);
      this.notificationButtonInTeams();
    };

    notificationButtonInTeams=()=>{
      if (!this.isTeamsListPage()) return;
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      $('table.slist tr.paginated').each((i,e)=>{
        const href=$('td.subject a',e).attr('href');
        const teamId=/^\/team\/(?<teamId>[^\/]+)$/i.exec(href)?.groups?.teamId;
        if (!teamId) return;
        let button=$('td.lichessTools-notify a',e);
        if (!button.length) {
          button=$('<a>')
                      .attr('data-icon','\uE00F')
                      .attr('title',trans.noarg('teamNotifyTitle'))
                      .on('click',ev=>{
                        ev.preventDefault();
                        this.toggleNotify(teamId);
                      });
          $('<td class="lichessTools-notify" ></td>')
            .append(button)
            .appendTo(e);
        }
        button
          .toggleClass('lichessTools-enabled',!!this.teamsData?.find(t=>t.teamId==teamId))
      });
    };

    sockets=[];
    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const value=parent.currentOptions.getValue('mchatOptions');
      this.logOption('Team/Study chat', value);
      this.options={ 
        urlify: parent.isOptionSet(value,'urlify'),
        unlimited: parent.isOptionSet(value,'unlimited'),
        images: parent.isOptionSet(value,'images'),
        teamChatNotifications: parent.isOptionSet(value,'teamChatNotifications')
      };
      if (!parent.getUserId()) {
        parent.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      if (!lichess.socket) {
        parent.global.console.debug(' ... Disabled (no Lichess socket)');
        return;
      }
      parent.global.clearInterval(this.interval);
      if ($('section.mchat').length && (this.options.urlify || this.options.unlimited || this.options.images)) {
        this.interval = parent.global.setInterval(this.processChat,1000);
        this.processChat();
      }
      if (this.sockets?.length) {
        for (const {teamId,socket} of this.sockets) {
          socket.disconnect();
          socket.destroy();
        }
        this.sockets=null;
      }
      lichess.pubsub.off('content-loaded',this.notificationButtonInTeams);
      if (this.options.teamChatNotifications) {
        this.userTeams=await parent.api.team.getUserTeams(parent.getUserId());
        this.teamsData=parent.storage.get('LichessTools.chatNotificationTeams')||[];
        const configuredTeamsCount=this.teamsData?.length;
        if (configuredTeamsCount) {
          parent.arrayRemoveAll(this.teamsData,t=>!this.userTeams.find(ut=>ut.id==t.teamId));
          if (this.teamsData.length<configuredTeamsCount) {
            this.saveTeamsData();
          }
          const socketUrl=lichess.socket?.url;
          const m=/^\/team\/(?<teamId>[^\/]+)$/i.exec(socketUrl);
          const teams=this.teamsData.filter(t=>t.teamId!=m?.groups?.teamId);
          this.sockets=teams.map(t=>({
            teamId:t.teamId,
            socket:this.createSocket(t.teamId)
          }));
        }
        if (this.isTeamsListPage()) {
          this.notificationButtonInTeams();
          lichess.pubsub.on('content-loaded',this.notificationButtonInTeams);
        }
      }
    }

  }
  LiChessTools.Tools.MchatOptions=MchatOptionsTool;
})();
