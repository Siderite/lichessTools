(() => {
  class StickyStudySettingsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'stickyStudySettings',
        category: 'study',
        type: 'multiple',
        possibleValues: ['chapterForm', 'savePosition'],
        defaultValue: 'savePosition',
        advanced: true,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.stickyStudySettings': 'Persist study settings',
        'stickyStudySettings.chapterForm': 'New/edit chapter settings',
        'stickyStudySettings.savePosition': 'Position/move in the study'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.stickyStudySettings': 'Persist\u0103 set\u0103rile studiilor',
        'stickyStudySettings.chapterForm': 'Set\u0103ri la editare/nou capitol',
        'stickyStudySettings.savePosition': 'Pozi\u0163ia/mi\u015Fcarea \u00een capitole studiu'
      }
    };

    isNewForm = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const data = lichess?.analysis?.study?.form?.getData();
      return data && data.description === undefined;
    };

    fillEditFormDirect = () => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const $ = lt.$;
      const study = lichess?.analysis?.study;
      const container = $('dialog div.study-edit');
      if (!container.length) {
        lt.global.setTimeout(this.fillEditForm, 500);
        return;
      }
      if (!this.isNewForm()) return;
      let settings = lt.currentOptions.getValue('stickyStudySettings.settings');
      if (!settings) return;
      for (const key in settings) {
        if (['name', 'flair'].includes(key)) continue;
        $('#study-' + key).val(settings[key]);
      }
    };
    fillEditForm = this.lichessTools.debounce(this.fillEditFormDirect, 100);

    saveEditForm = (data) => {
      const lt = this.lichessTools;
      lt.currentOptions['stickyStudySettings.settings'] = data;
      lt.applyOptions(lt.currentOptions);
    };

    addStudyPosition = (studyId, chapterId, path) => {
      const lt = this.lichessTools;
      this._studyPositions =  this._studyPositions || lt.storage.get('LichessTools.studyPositions') || {};
      this._studyPositions[studyId] = {
        chapterId: chapterId,
        path: path
      };
    };

    saveStudyPositions = ()=>{
      const data = this._studyPositions;
      if (!data) return;
      const lt = this.lichessTools;
      lt.storage.set('LichessTools.studyPositions', data);
    };

    _pageLoaded = false;
    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('stickyStudySettings');
      this.logOption('Sticky study settings', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      this.options = {
        chapterForm: lt.isOptionSet(value, 'chapterForm'),
        savePosition: lt.isOptionSet(value, 'savePosition')
      };
      const lichess = lt.lichess;
      const $ = lt.$;
      const analysis = lichess?.analysis;
      const study = analysis?.study;
      if (!study) return;
      study.form.open = lt.unwrapFunction(study.form.open, 'stickyStudySettings');
      study.form.save = lt.unwrapFunction(study.form.save, 'stickyStudySettings');
      study.setPath = lt.unwrapFunction(study.setPath, 'stickyStudySettings');
      lt.global.removeEventListener('beforeunload', this.saveStudyPositions);
      if (this.options.chapterForm) {
        study.form.open = lt.wrapFunction(study.form.open, {
          id: 'stickyStudySettings',
          after: ($this, result, data) => {
            if (result) this.fillEditForm();
          }
        });
        study.form.save = lt.wrapFunction(study.form.save, {
          id: 'stickyStudySettings',
          after: ($this, result, data) => {
            this.saveEditForm(data);
          }
        });
        this.fillEditForm();
      }
      if (this.options.savePosition) {
        study.setPath = lt.wrapFunction(study.setPath, {
          id: 'stickyStudySettings',
          before: ($this, path, node) => {
            const studyId = $this.data.id;
            const chapterId = $this.vm.chapterId;
            this.addStudyPosition(studyId, chapterId, path);
          }
        });
        lt.global.addEventListener('beforeunload', this.saveStudyPositions);
        if (!this._pageLoaded && !lichess.analysis.study.gamebookPlay && !lt.isGamePlaying()) {
          this._pageLoaded = true;
          const studyId = study.data.id;
          const chapterId = study.vm.chapterId;
          const data = lt.storage.get('LichessTools.studyPositions') || {};
          const item = data[studyId];
          if (item && item.chapterId == chapterId) {
            lt.global.setTimeout(() => {
              if (lichess.analysis.study.gamebookPlay) return;
              analysis.jump(item.path);
            }, 100); // give time to other tools to set Preview mode
          }
        }
      }
    }

  }
  LiChessTools.Tools.StickyStudySettings = StickyStudySettingsTool;
})();
