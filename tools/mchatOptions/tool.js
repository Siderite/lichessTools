(() => {
  class MchatOptionsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['AddNotifications', 'EmitContentLoaded'];

    preferences = [
      {
        name: 'mchatOptions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['urlify', 'unlimited', 'images', 'teamChatNotifications'],
        defaultValue: 'urlify,unlimited,images,teamChatNotifications',
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
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
      'ro-RO': {
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

    urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    processChat = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const container = $('section.mchat');
      if (!container.length) return;
      const createTextNode = lt.global.document.createTextNode.bind(lt.global.document);
      if (this.options.urlify) {
        $('li>t', container).each((i, e) => {
          if (!lt.inViewport(e)) return;
          const textNodes = Array.from(e.childNodes).filter(n => n.nodeType == 3);
          for (const textNode of textNodes) {
            const lineText = textNode.textContent;
            const matches = [...lineText?.matchAll(this.urlRegex)];
            if (!matches.length) continue;
            const newNodes = [];
            let p = 0;
            for (const match of matches) {
              const url = match[0];
              if (match.index > p) {
                newNodes.push(createTextNode(lineText.substring(p, match.index)));
              }
              const urlEl = $('<a class="lichessTools-chat-url">')
                .attr('target', '_blank')
                .attr('href', url)
                .text(url);
              newNodes.push(urlEl[0]);
              p = match.index + url.length;
            }
            if (p < lineText.length) {
              newNodes.push(createTextNode(lineText.substring(p, lineText.length)));
            }
            for (const newNode of newNodes) {
              e.insertBefore(newNode, textNode);
            }
            e.removeChild(textNode);
          }
        });
      }
      if (this.options.images) {
        $('a.lichessTools-chat-url:not(:has(img))', container).each((i, e) => {
          const url = new URL($(e).attr('href'));
          if (!/\.(jpeg|jpg|gif|png|apng|tiff)$/.test(url.pathname)) return;
          $('<img>')
            .attr('src', url.toString())
            .appendTo($(e).empty());
        });
      }
      if (this.options.unlimited) {
        const maxLength = 138;
        const input = $('input.mchat__say', container);
        if (input.attr('maxlength')) {
          input.removeAttr('maxlength');
          const oldHandler = lt.getEventHandlers(input[0], 'keydown')[0];
          if (oldHandler) {
            lt.removeEventHandlers(input[0], 'keydown');

            const splitLength = (s, l) => {
              const result = [];
              if (!s) return result;
              let p = 0;
              const ellipsis = '\u2026';
              while (p + l < s.length) {
                let frag = s.substr(p, l);
                const lastWordBoundaryIndex = [...frag.matchAll(/\b/g)].at(-2)?.index;
                if (lastWordBoundaryIndex>l-20) {
                  frag=s.substr(p, lastWordBoundaryIndex);
                } else {
                  frag = s.substr(p, l-1);
                }
                result.push((p > 0 ? ellipsis : '') + frag + ellipsis);
                p += frag.length;
              }
              if (p < s.length) {
                result.push((p > 0 ? ellipsis : '') + s.substr(p));
              }
              return result;
            };

            input.on('keydown', async (ev) => {
              if (ev.key != 'Enter') return;
              ev.preventDefault();
              const text = input.val();
              const matches = [...text?.matchAll(this.urlRegex)];
              const newTexts = [];
              let p = 0;
              for (const match of matches) {
                const url = match[0];
                if (match.index > p) {
                  newTexts.push(text.substring(p, match.index));
                }
                newTexts.push(url);
                p = match.index + url.length;
              }
              if (p < text.length) {
                newTexts.push(text.substring(p, text.length));
              }
              let sendText = '';
              for (const newText of newTexts) {
                if (!sendText || sendText.length + newText.length <= maxLength) {
                  sendText += newText;
                } else {
                  const splits = splitLength(sendText, maxLength);
                  for (const splitText of splits) {
                    lt.uiApi.chat.post(splitText);
                    await lt.timeout(500);
                  }
                  sendText = newText;
                }
              }
              if (sendText) {
                const splits = splitLength(sendText, maxLength);
                for (const splitText of splits) {
                  lt.uiApi.chat.post(splitText);
                  await lt.timeout(100);
                }
              }
              input.val('');
              lt.storage.remove('chat.input', { session: true });
            });
          }
        }
      }
    };

    createSocket = (teamId) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const data = lt.global.document.body.dataset;
      const baseUrls = (data.socketAlts || data.socketDomains)?.split(',');
      if (!baseUrls?.length) return;
      const url = 'wss://' + baseUrls[Math.floor(lt.global.Math.random() * baseUrls.length)];
      const fullUrl = url + '/team/' + teamId + '?v=1&sri=' + lt.sri;
      const ws = new WebSocket(fullUrl);
      const console = lt.global.console;
      const recreateSocket = (e) => {
        if (ws.toDestroy) return;
        if (e?.code != 1006 || lt.debug) {
          console?.debug('reconnecting to ' + fullUrl, e);
        }
        ws?.close();
        this.sockets.find(s => s.teamId == teamId).socket = this.createSocket(teamId);
      };
      ws.onerror = recreateSocket;
      ws.onclose = recreateSocket;
      ws.onopen = () => {
        lt.debug && console?.debug('connected to ' + fullUrl);
      };
      ws.onmessage = e => {
        const m = lt.jsonParse(e.data);
        lt.debug && console?.debug('received ', m);
        if (m.t === 'message') {
          this.receiveChatMessage(teamId, m.d);
        }
        if (m.t === 'crowd') {
          this.receiveCrowdMessage(teamId, m.d);
        }
      };
      ws.destroy = () => {
        ws.toDestroy = true;
        ws.close();
      };
      return ws;
    }

    receiveCrowdMessage = (teamId, data) => {
      const lt = this.lichessTools;
      const watcherCount = data?.users?.length;
      const team = this.teamsData?.find(t => t.teamId == teamId);
      if (team) team.crowd = watcherCount;
      if (watcherCount > 1) {
        lt.global.console.debug(new Date().toLocaleString(lt.intl.lang), ' Someone is in the ' + teamId + ' page', data.users);
      }
      if (!team || !this.isTeamsListPage()) return;
      const row = $('table.slist tr.paginated')
        .filter((i, e) => {
          const href = $('td.subject a', e).attr('href');
          const tid = /^\/team\/(?<teamId>[^\/]+)$/i.exec(href)?.groups?.teamId;
          return (teamId == tid);
        })[0];
      if (row) {
        const button = $('td.lichessTools-notify a', row);
        if (watcherCount > 1) {
          button
            .addClass('data-count')
			.attr('data-count', watcherCount);
        } else {
          button
            .removeClass('data-count')
			.removeAttr('data-count');
        }
      }
    }


    receiveChatMessage = (teamId, data) => {
      const lt = this.lichessTools;
      const team = this.teamsData.find(t => t.teamId == teamId);
      if (!team || data.u?.toLowerCase() == lt.getUserId()?.toLowerCase()) return;
      team.newMessage = {
        user: data.u,
        text: data.t
      };
      this.handleNotifications();
    };

    handleNotificationsDirect = async () => {
      if (!this.teamsData?.length) return;
      const lt = this.lichessTools;
      const trans = lt.translator;
      const JSON = lt.global.JSON;
      let saveData = false;
      for (const team of this.teamsData) {
        const notificationId = 'mchatOptions_'+team.teamId;
        if (team.newMessage && JSON.stringify(team.newMessage) != JSON.stringify(team.lastMessage)) {
          const teamName = this.userTeams.find(t => t.id == team.teamId)?.name || team.teamId;
          const notification = {
            getEntries: async () => {
              const tm = this.teamsData.find(t => t.teamId == team.teamId);
              if (JSON.stringify(tm?.newMessage) == JSON.stringify(tm?.lastMessage)) return [];
              const entry = {
                id: notificationId,
                isNew: true,
                icon: '\uE059',
                href: '/team/' + lt.global.encodeURIComponent(team.teamId),
                content: $('<div>')
                  .append($('<span>').text(trans.pluralSame('newTeamMessagesText', teamName)))
                  .html(),
                title: trans.noarg('newTeamMessagesSubtitle')
              };
              return [entry];
            }
          };
          lt.notifications.add(notification);
          saveData = true;
        }
      }
      if (saveData) {
        this.saveTeamsData();
      }
    };
    handleNotifications = this.lichessTools.debounce(this.handleNotificationsDirect, 5000);

    isTeamsListPage = () => {
      const lt = this.lichessTools;
      return ['/team/me', '/team/leader'].includes(lt.global.location.pathname);
    };

    toggleNotify = (teamId) => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      let index = this.teamsData?.findIndex(t => t.teamId == teamId);
      if (index > -1) {
        this.teamsData.splice(index, 1);
        index = this.sockets.findIndex(s => s.teamId == teamId);
        if (index > -1) {
          this.sockets[index].socket.destroy();
          this.sockets.splice(index, 1);
        }
      } else {
        if (this.sockets.length >= 3) {
          lt.announce(trans.noarg('maximumThreeTeams'));
          return;
        }
        this.teamsData.push({ teamId: teamId });
        this.sockets.push({
          teamId: teamId,
          socket: this.createSocket(teamId)
        });
      }
      this.saveTeamsData();
    };

    loadTeamsData = () => {
      const lt = this.lichessTools;
      this.teamsData = lt.storage.get('LichessTools.chatNotificationTeams') || [];
      this.teamsData.forEach(t=>{ delete t.crowd; });
    };

    saveTeamsData = () => {
      const lt = this.lichessTools;
      const teamsData=this.teamsData.map(t=>{
        const { crowd, ...team } = t;
        return team;
      });
      lt.storage.set('LichessTools.chatNotificationTeams', teamsData);
      this.notificationButtonInTeams();
    };

    notificationButtonInTeamsDirect = () => {
      if (!this.isTeamsListPage()) return;
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      $('table.slist tr.paginated').each((i, e) => {
        const href = $('td.subject a', e).attr('href');
        const teamId = /^\/team\/(?<teamId>[^\/]+)$/i.exec(href)?.groups?.teamId;
        if (!teamId) return;
        let button = $('td.lichessTools-notify a', e);
        if (!button.length) {
          button = $('<a>')
            .attr('data-icon', '\uE00F')
            .attr('title', trans.noarg('teamNotifyTitle'))
            .on('click', ev => {
              ev.preventDefault();
              this.toggleNotify(teamId);
            });
          $('<td class="lichessTools-notify" ></td>')
            .append(button)
            .appendTo(e);
        }
        const team = this.teamsData?.find(t => t.teamId == teamId);
        button
          .toggleClass('lichessTools-enabled', !!team)
        if (team?.crowd > 1) {
          button
            .addClass('data-count')
            .attr('data-count', team.crowd);
        } else {
          button
            .removeClass('data-count')
            .removeAttr('data-count');
        }
      });
    };
    notificationButtonInTeams = this.lichessTools.debounce(this.notificationButtonInTeamsDirect,100);

    sockets = [];
    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const value = lt.currentOptions.getValue('mchatOptions');
      this.logOption('Team/Study chat', value);
      this.options = {
        urlify: lt.isOptionSet(value, 'urlify'),
        unlimited: lt.isOptionSet(value, 'unlimited'),
        images: lt.isOptionSet(value, 'images'),
        teamChatNotifications: lt.isOptionSet(value, 'teamChatNotifications')
      };
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      lt.global.clearInterval(this.interval);
      if ($('section.mchat').length && (this.options.urlify || this.options.unlimited || this.options.images)) {
        this.interval = lt.global.setInterval(this.processChat, 1000);
        this.processChat();
      }
      if (this.sockets?.length) {
        for (const { teamId, socket } of this.sockets) {
          socket.destroy();
        }
        this.sockets = null;
      }
      lt.pubsub.off('content-loaded', this.notificationButtonInTeams);
      if (this.options.teamChatNotifications) {
        lt.storage?.listen('lichessTools.refreshNotifications', ()=>{
          this.loadTeamsData();
          lt.notifications.refresh();
        });
        this.userTeams = await lt.api.team.getUserTeams(lt.getUserId());
        this.loadTeamsData();
        const configuredTeamsCount = this.teamsData?.length;
        if (configuredTeamsCount) {
          let saveTeams = false;
          lt.arrayRemoveAll(this.teamsData, t => !this.userTeams.find(ut => ut.id == t.teamId));
          if (this.teamsData.length < configuredTeamsCount) {
            saveTeams = true;
          }
          for (const team of this.teamsData) {
            if (lt.global.location.pathname.toLowerCase() == '/team/'+team.teamId.toLowerCase()) {
              team.lastMessage = team.newMessage;
              saveTeams = true;
            }
          }
          if (saveTeams) {
            this.saveTeamsData();
            lt.storage?.fire('lichessTools.refreshNotifications');
          }
          const socketUrl = lichess.socket?.url;
          const m = /^\/team\/(?<teamId>[^\/]+)$/i.exec(socketUrl);
          const teams = this.teamsData.filter(t => t.teamId != m?.groups?.teamId);
          this.sockets = teams.map(t => ({
            teamId: t.teamId,
            socket: this.createSocket(t.teamId)
          }));
        }
        if (this.isTeamsListPage()) {
          this.notificationButtonInTeams();
          lt.pubsub.on('content-loaded', this.notificationButtonInTeams);
        }
      }
    }

  }
  LiChessTools.Tools.MchatOptions = MchatOptionsTool;
})();
