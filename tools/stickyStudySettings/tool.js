(()=>{
  class StickyStudySettingsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'stickyStudySettings',
        category: 'study',
        type:'multiple',
        possibleValues: ['chapterForm','savePosition'],
        defaultValue: 'savePosition',
        advanced: true,
        needsLogin: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.stickyStudySettings': 'Persist study settings',
        'stickyStudySettings.chapterForm': 'New/edit chapter settings',
        'stickyStudySettings.savePosition': 'Position/move in the study'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.stickyStudySettings': 'Persist\u0103 set\u0103rile studiilor',
        'stickyStudySettings.chapterForm': 'Set\u0103ri la editare/nou capitol',
        'stickyStudySettings.savePosition': 'Pozi\u0163ia/mi\u005Fcarea \u00een capitole studiu'
      }
    };

    isNewForm=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const data = lichess?.analysis?.study?.form?.getData();
      return data && data.description===undefined;
    };

    fillEditFormDirect=()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const study=lichess?.analysis?.study;
      const container=$('dialog div.study-edit');
      if (!container.length) {
         parent.global.setTimeout(this.fillEditForm,500);
         return;
      }
      if (!this.isNewForm()) return;
      let settings=parent.currentOptions.getValue('stickyStudySettings.settings');
      if (!settings) return;
      for (const key in settings) {
        if (['name','flair'].includes(key)) continue;
        $('#study-'+key).val(settings[key]);
      }
    };
    fillEditForm=this.lichessTools.debounce(this.fillEditFormDirect,100);

    saveEditForm=(data)=>{
      const parent=this.lichessTools;
      parent.currentOptions['stickyStudySettings.settings']=data;
      parent.applyOptions(parent.currentOptions);
    };

    _pageLoaded=false;
    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('stickyStudySettings');
      this.logOption('Sticky study settings', value);
      if (!parent.getUserId()) {
        parent.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      this.options={ 
        chapterForm: parent.isOptionSet(value,'chapterForm'),
        savePosition: parent.isOptionSet(value,'savePosition')
      };
      const lichess=parent.lichess;
      const $=parent.$;
      const analysis=lichess?.analysis;
      const study=analysis?.study;
      if (!study) return;
      study.form.open=parent.unwrapFunction(study.form.open,'stickyStudySettings');
      study.form.save=parent.unwrapFunction(study.form.save,'stickyStudySettings');
      study.setPath=parent.unwrapFunction(study.setPath,'stickyStudySettings');
      if (this.options.chapterForm) {
        study.form.open=parent.wrapFunction(study.form.open,{
          id:'stickyStudySettings',
          after:($this,result,data)=>{
            if (result) this.fillEditForm();
          }
        });
        study.form.save=parent.wrapFunction(study.form.save,{
          id:'stickyStudySettings',
          after:($this,result,data)=>{
            this.saveEditForm(data);
          }
        });
        this.fillEditForm();
      }
      if (this.options.savePosition) {
        study.setPath=parent.wrapFunction(study.setPath,{
          id: 'stickyStudySettings',
          before: ($this, path, node)=>{
            const studyId=$this.data.id;
            const chapterId=$this.vm.chapterId;
            const data=parent.jsonParse(lichess.storage.get('LichessTools.studyPositions'),{});
            data[studyId]={
              chapterId: chapterId,
              path: path
            };
            lichess.storage.set('LichessTools.studyPositions',parent.global.JSON.stringify(data));
          }
        });
        if (!this._pageLoaded && !lichess.analysis.study.gamebookPlay && !parent.isGamePlaying()) {
          this._pageLoaded=true;
          const studyId=study.data.id;
          const chapterId=study.vm.chapterId;
          const data=parent.jsonParse(lichess.storage.get('LichessTools.studyPositions'),{});
          const item=data[studyId];
          if (item && item.chapterId==chapterId) {
            parent.global.setTimeout(()=>{
              if (lichess.analysis.study.gamebookPlay) return;
              analysis.jump(item.path);
            },100); // give time to other tools to set Preview mode
          }
        }
      }
    }

  }
  LiChessTools.Tools.StickyStudySettings=StickyStudySettingsTool;
})();
