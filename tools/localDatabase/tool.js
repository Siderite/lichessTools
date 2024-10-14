(() => {
  class LocalDatabaseTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'localDatabase',
        category: 'filesystem',
        type: 'folder',
        defaultValue: '',
        advanced: true,
        wip: true
      }
    ];

    intl = {
      'en-US': {
        'options.filesystem': 'Local files',
        'options.localDatabase': 'Local database functionality'
      },
      'ro-RO': {
        'options.filesystem': 'Fi\u015fiere locale',
        'options.localDatabase': 'Func\u0163ionalitate baz\u0103 de date local\u0103'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('localDatabase');
      this.logOption('Local database', value || 'not set');
      this.options = {
        folder: await parent.storage.get('lichessTools/LT/localDatabase-folder',{ db: true, raw: true })
      };
      this.logOption(' ... ', this.options.folder?.name || 'none');
    }

  }
  LiChessTools.Tools.LocalDatabase = LocalDatabaseTool;
})();
