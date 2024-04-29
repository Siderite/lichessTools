(()=>{
  class ObsIntegrationTool extends LiChessTools.Tools.ToolBase {

    dependencies=['EmitChapterChange','EmitRedraw'];

    preferences=[
      {
        name:'obsIntegration',
        category: 'integration',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: false,
        hidden: false
      }
    ];

    intl={
      'en-US':{
        'options.integration': 'Integration',
        'options.obsIntegration': 'Open Broadcaster Software (OBS)',
        'OBSText': 'OBS',
        'OBSTitle': 'LiChess Tools - Open Broadcaster Software',
        'obsSetupText': 'Set up OBS',
        'defaultSceneText': 'Default scene',
        'defaultOptionText': ' - default - ',
        'urlInputLabel': 'URL',
        'passwordInputLabel': 'Password',
        'optionsInputLabel': 'Advanced options',
        'btnSaveText': 'Save OBS options',
        'btnSaveTitle': 'LiChess Tools - save OBS options',
        'togglePasswordTitle': 'Show password'
      },
      'ro-RO':{
        'options.integration': 'Integrare',
        'options.obsIntegration': 'Open Broadcaster Software (OBS)',
        'OBSText': 'OBS',
        'OBSTitle': 'LiChess Tools - Open Broadcaster Software',
        'obsSetupText': 'Configureaz\u0103 OBS',
        'defaultSceneText': 'Scen\u0103 standard',
        'defaultOptionText': ' - standard - ',
        'urlInputLabel': 'URL',
        'passwordInputLabel': 'Parol\u0103',
        'optionsInputLabel': 'Op\u0163iuni avansate',
        'btnSaveText': 'Salveaz\u0103 op\u0163iuni OBS',
        'btnSaveTitle': 'LiChess Tools - salveaz\u0103 op\u0163iuni OBS',
        'togglePasswordTitle': 'Arat\u0103 parola'
      }
    }

    _defaultName='_default_';
    _chapterKey='name';

    closeDialog=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      if (parent.global.location.hash='#obsSetup') {
        parent.global.history.pushState(null, null, ' ');
      }
      $('dialog.lichessTools-obsSetup').remove();
    };

    showObsSetup=async ()=>{
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!this.isBroadcast(analysis?.study)) return;
      await this.ensureOptionsSent();
      const $=parent.$;
      const trans=parent.translator;
      $('dialog.lichessTools-obsSetup').remove();

      if (parent.global.location.hash!='#obsSetup') {
        parent.global.history.pushState(null, null, '#obsSetup');
      }
      const dialog=$('<dialog class="lichessTools-obsSetup">')
        .append(`
    <div class="close-button-anchor">
        <a class="help-button" data-icon="&#xE005;" aria-label="Help" href="https://siderite.dev/blog/lichess-tools---user-manual#obsIntegration" target="_blank"></a>
        <button type="button" class="close-button" data-icon="&#xE03F;" aria-label="Close"/>
    </div>
    <div class="scrollable">
        <div class="dialog-content">
            <h2></h2>
            <div class="input-wrapper">
              <div class="mappings"></div>
              <div class="advanced">
                <label data-for="url"></label>
                <input class="form-control" type="text" name="url">
                <label data-for="password"></label>
                <div>
                  <input class="form-control" type="password" name="password">
                  <i data-icon="&#xE069;" aria-hidden="true" class="togglePassword"></i>
                </div>
                <label data-for="options"></label>
                <input class="form-control" type="text" name="options">
              </div>
              <div class="actionButtons">
                <button id="btnSave" type="button" class="btn button"></button>
              </div>
            </div>
        </div>
    </div>
`)
        .appendTo('body');
      $('div.dialog-content>h2').text(trans.noarg('obsSetupText'));
      $('label[data-for="url"]',dialog).text(trans.noarg('urlInputLabel'));
      $('label[data-for="password"]',dialog).text(trans.noarg('passwordInputLabel'));
      $('input[name="password"] + .togglePassword',dialog)
        .attr('title',trans.noarg('togglePasswordTitle'))
        .on('click',(ev)=>{
          ev.preventDefault();
          const input=$('input[name="password"]')
          input.attr('type',input.is('[type="text"]')?'password':'text');
        });
      $('label[data-for="options"]',dialog).text(trans.noarg('optionsInputLabel'));
      $('#btnSave')
        .text(trans.noarg('btnSaveText'))
        .attr('title',trans.noarg('btnSaveTitle'))
        .on('click',(ev)=>{
          ev.preventDefault();
          this.saveSetup(dialog);
        });
      $('button.close-button',dialog)
        .on('click',ev=>{
          ev.preventDefault();
          this.closeDialog();
        });

      const scenes=await parent.comm.send({ type: 'getScenes' }).catch(e=>{ parent.global.console.error(e); });
      const template=$('<select>')
        .append($('<option value=""></option>').text(trans.noarg('defaultOptionText')));
      for (const sceneName of scenes?.sceneNames||[]) {
        $('<option>')
          .text(sceneName)
          .attr('value',sceneName)
          .appendTo(template);
      }
      const chapters=analysis.study.chapters.list.all();
      const setup=await this.getSetup();
      const container=$('div.mappings',dialog);
      let index=0;
      $('<label>')
        .text(trans.noarg('defaultSceneText'))
        .addClass('defaultName')
        .appendTo(container);
      let mapping=setup.mappings[this._defaultName]||'';
      template
        .clone()
        .addClass('defaultName')
        .attr('name',this._defaultName)
        .val(mapping)
        .appendTo(container)
        .find('option').eq(0).text('');
      for (const chapter of chapters) {
        index++;
        $('<label>')
          .text(index+'. '+chapter.name)
          .appendTo(container);
        mapping=setup.mappings[chapter[this._chapterKey]]||'';
        template
          .clone()
          .attr('name',chapter[this._chapterKey])
          .val(mapping)
          .appendTo(container);
      }
      $('input[name="url"]',dialog).val(setup.url);
      $('input[name="password"]',dialog).val(setup.password);
      $('input[name="options"]',dialog).val(setup.connectOptions);
    };

    saveSetup= (dialog)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const setup={
        url:dialog.find('input[name="url"]').val(),
        password:dialog.find('input[name="password"]').val(),
        connectOptions:dialog.find('input[name="options"]').val(),
        mappings:{}
      };
      dialog.find('.mappings select').each((i,e)=>{
        const sceneName=$(e).val();
        if (!sceneName) return;
        setup.mappings[$(e).attr('name')]=sceneName;
      });
      if (!setup.password) delete setup.password;
      if (!setup.connectOptions) delete setup.connectOptions;
      const dict=parent.storage.get('LichessTools.obsIntegration')||{};
      const studyId=parent.lichess.analysis.study.data.id;
      dict[studyId]=setup;
      parent.storage.set('LichessTools.obsIntegration',dict);
      this.optionsSet=false;
      this.closeDialog();
    };

    getSetup=()=>{
      const parent=this.lichessTools;
      const studyId=parent.lichess.analysis.study.data.id;
      const dict=parent.storage.get('LichessTools.obsIntegration')||{};
      const defaults = {
        url:'ws://127.0.0.1:4455',
        password:undefined,
        options:undefined,
        mappings: {
        }
      };
      const setup = {...defaults,...dict[studyId] };
      return setup;
    };

    getSceneName=async (study)=>{
      const setup=this.getSetup();
      const currentChapter=study.currentChapter();
      const mapping=setup.mappings[currentChapter[this._chapterKey]]||setup.mappings[this._defaultName];
      return mapping;
    };

    refreshUI=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      let container=$('nav.relay-tour__tabs');
      if (container.length) {
        if (!container.find('span.lichessTools-obsSetup').length) {
           $('<span class="lichessTools-obsSetup">')
             .text(trans.noarg('OBSText'))
             .attr('title',trans.noarg('OBSTitle'))
             .attr('role','tab')
             .on('mousedown',(ev)=>{
               ev.preventDefault();
               this.showObsSetup();
             })
             .appendTo(container);
        }
      }
      container=$('div.study__buttons div.left-buttons.tabs-horiz');
      if (container.length) {
        if (!container.find('span.lichessTools-obsSetup').length) {
           $('<span class="lichessTools-obsSetup">')
             .attr('title',trans.noarg('OBSTitle'))
             .attr('role','tab')
             .on('mousedown',(ev)=>{
               ev.preventDefault();
               this.showObsSetup();
             })
             .append($('<i>').attr('data-icon','\u24CE'))
             .appendTo(container);
        }
      }
    };

    ensureOptionsSent=async ()=>{
      const parent=this.lichessTools;
      if (this.optionsSet) return;
      const setup=this.getSetup();
      await parent.comm.send({...setup,type: 'setOptions'});
      this.optionsSet=true;
    };

    chapterChange=async (chapterId)=>{
      this.refreshUI();
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      const study=analysis.study;
      if (!this.isBroadcast(study)) return;
      await this.ensureOptionsSent();
      const sceneName=await this.getSceneName(study);
      await parent.comm.send({ 
        type: 'sceneChange',
        sceneName: sceneName
      });
    };

    isBroadcast=(study)=>{
      return !!study?.relay;
    };

    hashchange=(ev)=>{
      const parent=this.lichessTools;
      const location=parent.global.location;
      const dialog=$('dialog.lichessTools-obsSetup');
      if (location.hash=='#obsSetup') {
        if (!dialog.length) {
          this.showObsSetup();
        }
      } else {
        $('dialog.lichessTools-obsSetup').remove();
      }
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const analysis=lichess.analysis;
      if (!this.isBroadcast(analysis?.study)) return;
      const value=parent.currentOptions.getValue('obsIntegration');
      this.logOption('OBS Integration', value);
      lichess.pubsub.off('chapterChange',this.chapterChange);
      lichess.pubsub.off('redraw',this.refreshUI);
      $(parent.global).off('hashchange',this.hashchange);
      if (!value) return;
      lichess.pubsub.on('chapterChange',this.chapterChange);
      lichess.pubsub.on('redraw',this.refreshUI);
      this.refreshUI();
      $(parent.global).on('hashchange',this.hashchange);
      this.hashchange();
    }

  }
  LiChessTools.Tools.ObsIntegration=ObsIntegrationTool;
})();
