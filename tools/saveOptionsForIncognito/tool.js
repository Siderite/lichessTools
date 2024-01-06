(()=>{
  class SaveOptionsForIncognitoTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'saveOptionsForIncognito',
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
        'options.saveOptionsForIncognito': 'Also save options for browser private/incognito mode'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.saveOptionsForIncognito': 'Salveaz\u0103 op\u0163iunile \u015Fi pentru modul privat/incognito al browserului'
      }
    }

    getStorageGameId=async (myName)=>{
      const parent=this.lichessTools;
      if (this.storageGameId) return this.storageGameId;
      let text='';
      try{
        text=await parent.net.fetch({url:'/api/games/user/{myName}?max=1&moves=false&sort=dateAsc',args:{myName:myName}});
      } catch(e) {
        if (e.response?.status==404) return;
        throw e;
      }
      const m=/\[Site\s*"[^"]*\/(\w{8})"\]/.exec(text||'');
      this.storageGameId=m&&m[1];
      return this.storageGameId;
    };

    async init() {
      const parent=this.lichessTools;
      this.oldGetOptions=parent.getOptions.bind(parent);
      parent.getOptions=async ()=>{
        let options=await this.oldGetOptions();
        if (options.loaded) return options;
        const userId=parent.getUserId();
        if (!userId) return options;
        const gameId = await this.getStorageGameId(userId);
        if (!gameId) return options;
        const text=await parent.net.fetch({url:'/{gameId}/note',args:{gameId:gameId}});
        if (text) {
          const m=/^(.*?)\r\n---- LiChess Tools Preferences ----\r\n(.*)$/.exec(text);
          if (m) {
            const newOptions=parent.jsonParse(m[2],null);
            return {
              loaded:!!newOptions,
              ...options,
              ...newOptions
            };
          }
        }
        return options;
      };
      this.oldSaveOptions=parent.saveOptions.bind(parent);
      parent.saveOptions=async (options)=>{
        await this.oldSaveOptions(options);
        if (!parent.currentOptions.getValue('saveOptionsForIncognito')) return;
        const userId=parent.getUserId();
        const gameId = await this.getStorageGameId(userId);
        if (!gameId) return;
        const text=await parent.net.fetch({url:'/{gameId}/note',args:{gameId:gameId}});
        let m=null;
        if (text) {
          m=/^(.*?)\r\n---- LiChess Tools Preferences ----\r\n(.*)$/.exec(text);
        }
        const data=new URLSearchParams();
        const existingNote=(m&&m[1])||text||'';
        const optionsJson=parent.global.JSON.stringify(options);
        data.append('text',existingNote+'\r\n---- LiChess Tools Preferences ----\r\n'+optionsJson);
        parent.net.fetch({url:'/{gameId}/note',args:{ gameId }}, {
          method: 'POST',
          body: data
        });
      };
    }

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('saveOptionsForIncognito');
      this.logOption('Save options in incognito mode', value);
    }
  }
  LiChessTools.Tools.SaveOptionsForIncognito=SaveOptionsForIncognitoTool;
})();
