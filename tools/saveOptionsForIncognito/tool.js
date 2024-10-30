(() => {
  class SaveOptionsForIncognitoTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'saveOptionsForIncognito',
        category: 'general',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.saveOptionsForIncognito': 'Also save options for browser private/incognito mode'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.saveOptionsForIncognito': 'Salveaz\u0103 op\u0163iunile \u015Fi pentru modul privat/incognito al browserului'
      }
    }

    getStorageGameId = async (myName) => {
      const lt = this.lichessTools;
      if (this.storageGameId) return this.storageGameId;
      let text = '';
      try {
        text = await lt.net.fetch({ url: '/api/games/user/{myName}?max=1&moves=false&sort=dateAsc', args: { myName: myName } });
      } catch (e) {
        if (e.response?.status == 404) return;
        throw e;
      }
      const m = /\[Site\s*"[^"]*\/(\w{8})"\]/.exec(text || '');
      this.storageGameId = m && m[1];
      return this.storageGameId;
    };

    async init() {
      const lt = this.lichessTools;
      this.oldGetOptions = lt.getOptions.bind(lt);
      lt.getOptions = async () => {
        let options = await this.oldGetOptions();
        if (options.loaded) return options;
        const userId = lt.getUserId();
        if (!userId) return options;
        const gameId = await this.getStorageGameId(userId);
        if (!gameId) return options;
        let text = '';
        try {
          text = await lt.net.fetch({ url: '/{gameId}/note', args: { gameId: gameId } });
        } catch (e) {
          lt.global.console.warn('Could not get incognito preferences', e);
        }
        if (text) {
          const m = /^(.*?)\r\n---- LiChess Tools Preferences ----\r\n(.*)$/.exec(text);
          if (m) {
            const newOptions = lt.jsonParse(m[2], null);
            return {
              loaded: !!newOptions,
              ...options,
              ...newOptions
            };
          }
        }
        return options;
      };
      this.oldSaveOptions = lt.saveOptions.bind(lt);
      lt.saveOptions = async (options) => {
        await this.oldSaveOptions(options);
        if (!lt.currentOptions.getValue('saveOptionsForIncognito')) return;
        const userId = lt.getUserId();
        const gameId = await this.getStorageGameId(userId);
        if (!gameId) return;
        const text = await lt.net.fetch({ url: '/{gameId}/note', args: { gameId: gameId } });
        let m = null;
        if (text) {
          m = /^(.*?)\r\n---- LiChess Tools Preferences ----\r\n(.*)$/.exec(text);
        }
        const data = new URLSearchParams();
        const existingNote = (m && m[1]) || text || '';
        const optionsJson = lt.global.JSON.stringify(options);
        data.append('text', existingNote + '\r\n---- LiChess Tools Preferences ----\r\n' + optionsJson);
        lt.net.fetch({ url: '/{gameId}/note', args: { gameId } }, {
          method: 'POST',
          body: data
        });
      };
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('saveOptionsForIncognito');
      this.logOption('Save options in incognito mode', value);
    }
  }
  LiChessTools.Tools.SaveOptionsForIncognito = SaveOptionsForIncognitoTool;
})();
