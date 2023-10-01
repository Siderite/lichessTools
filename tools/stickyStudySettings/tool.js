(()=>{
  class StickyStudySettingsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'stickyStudySettings',
        category: 'study',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.study': 'Study',
        'options.stickyStudySettings': 'Persist settings on study create/edit'
      },
      'ro-RO':{
        'options.study': 'Studiu',
        'options.stickyStudySettings': 'Persist\u0103 set\u0103rile la creare/editare studiu'
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
        if (key=='name') continue;
        $('#study-'+key).val(settings[key]);
      }
    };
    fillEditForm=this.lichessTools.debounce(this.fillEditFormDirect,100);

    saveEditForm=(data)=>{
      const parent=this.lichessTools;
      parent.currentOptions['stickyStudySettings.settings']=data;
      parent.applyOptions(parent.currentOptions);
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('stickyStudySettings');
      this.logOption('Sticky study settings', value);
      const lichess=parent.lichess;
      const $=parent.$;
      const study=lichess?.analysis?.study;
      if (!study) return;
      study.form.open=parent.unwrapFunction(study.form.open,'stickyStudySettings');
      study.form.save=parent.unwrapFunction(study.form.save,'stickyStudySettings');
      if (!value) return;
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
    }

  }
  LiChessTools.Tools.StickyStudySettings=StickyStudySettingsTool;
})();
