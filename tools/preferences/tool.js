(()=>{
  class PreferencesTool extends LiChessTools.Tools.ToolBase {

    dependencies=['DetectThirdParties'];

    preferences=[
      {
        name:'advancedPreferences',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false,
        advanced: true,
        hidden: true
      }
    ];

    intl={
      'en-US':{
        yes: 'Yes',
        no: 'No',
        'preferencesSaved': 'Your preferences have been saved',
        'rateThisText': 'Rate this!',
        'rateThisTitle': 'Ratings help me a lot',
        'blogLinkTitle': 'The page of the extension. Leave me a message.',
        'enableExtension': 'Enable LiChess Tools extension',
        'advancedPreferences': 'Advanced preferences (show a lot more!)',
        'options.advancedPreferences': 'Advanced preferences',
        'author': 'by %s',
        'lichessTools': 'LiChess Tools',
        'lichessToolsPreferences': 'LiChess Tools preferences',
        'feedbackButtonTitle': 'Send feedback about LiChess Tools',
        'feedbackTitle': 'Send a message to the developer',
        'resetButtonText': 'Reset',
        'resetButtonTitle': 'LiChess Tools - reset settings',
        'resetButtonWarning': 'Are you sure? This will restore all settings to defaults. I recommend a backup first.',
        'minimalButtonText': 'All off',
        'minimalButtonTitle': 'LiChess Tools - turn all features individually off',
        'minimalButtonWarning': 'Are you sure? You will have to reenable each feature one by one. I recommend a backup first.',
        'backupButtonText': 'Backup',
        'backupButtonTitle': 'LiChess Tools - backup preferences in a file',
        'restoreButtonText': 'Restore',
        'restoreButtonTitle': 'LiChess Tools - restore preferences from a file',
        'defaultValueLegend': '*Blue bordered preferences are the ones enabled by default'
      },
      'ro-RO':{
        yes: 'Da',
        no: 'Nu',
        'preferencesSaved': 'Preferin\u0163ele tale au fost salvate',
        'rateThisText': 'D\u0103-i o not\u0103!',
        'rateThisTitle': 'Notele date m\u0103 ajut\u0103 foarte mult',
        'blogLinkTitle': 'Pagina extensiei. Trimite-mi un mesaj.',
        'enableExtension': 'Activeaz\u0103 extensia LiChess Tools',
        'advancedPreferences': 'Preferin\u0163e avansate (arat\u0103 mult mai multe!)',
        'options.advancedPreferences': 'Preferin\u0163e avansate',
        'author': 'de %s',
        'lichessTools': 'LiChess Tools',
        'lichessToolsPreferences': 'Preferin\u0163e LiChess Tools',
        'feedbackButtonTitle': 'Trimite p\u0103reri despre LiChess Tools',
        'feedbackTitle': 'Trimite un mesaj programatorului',
        'resetButtonText': 'Resetare',
        'resetButtonTitle': 'LiChess Tools - reseteaz\u0103 op\u0163iunile',
        'resetButtonWarning': 'Sigur? Toate op\u0163iunile vor fi resetate pe valori standard. Recomand un backup \u00eenainte.',
        'minimalButtonText': 'Toate oprite',
        'minimalButtonTitle': 'LiChess Tools - opre\u015fte toate op\u0163iunile individual',
        'minimalButtonWarning': 'Sigur? Va trebui sa porne\u015fti fiecare op\u0163iune una c\u00e2te una. Recomand un backup \u00eenainte.',
        'backupButtonText': 'Backup',
        'backupButtonTitle': 'LiChess Tools - Descarc\u0103 preferin\u0163ele \u00eentr-un fi\u015Fier',
        'restoreButtonText': 'Restaurare',
        'restoreButtonTitle': 'LiChess Tools - \u00CEncarc\u0103 preferin\u0163ele dintr-un fi\u015Fier',
        'defaultValueLegend': '*Preferin\u0163ele cu margine alb\u0103strie sunt cele implicite'
      }
    }

  openPreferences=()=>{
    const parent=this.lichessTools;
    const Math=parent.global.Math;
    const $=parent.$;
    const trans=parent.translator;
    const tools=parent.tools;
    const htmlEncode=parent.htmlEncode;
    const currentOptions=parent.currentOptions;
    const applyOptions=parent.applyOptions;
    const lichess=parent.lichess;
    const isOptionSet=parent.isOptionSet;
    const isLoggedIn=!!parent.getUserId();

    const lichessToolsText=trans.noarg('lichessTools');
    if (parent.global.document.title.indexOf(lichessToolsText)<0) {
      parent.global.document.title=parent.global.document.title?.replace(/^[^\s]+/,lichessToolsText);
    }

    $('nav.page-menu__menu a.active').removeClass('active');
    $('a.lichessTools-menu').addClass('active');

    const showSaved= ()=> {
      $('.saved').removeClass('none');
      parent.global.setTimeout(()=>$('.saved').addClass('none'),2000);
    };
    const checkGlobalSwitch=()=>{
      $.cached('body').toggleClass('lichessTools-globalDisable',!parent.currentOptions.enableLichessTools);
    };
    const checkAdvanced=()=>{
      this.options.advanced=!!parent.currentOptions.getValue('advancedPreferences');
      $.cached('body').toggleClass('lichessTools-advancedPreferences',this.options.advanced);
    };

    //TODO add link to translation project
    let html=`<div class="account box box-pad">
            <h1 class="box__top">$trans(LiChess Tools)</h1>
            <div class="links">
              <a class="rate" title="$trans(rateThisTitle)"
                 href="https://chromewebstore.google.com/detail/lichess-tools-by-siderite/langlhlcknngldkeliapahbhbcmlcbcj/reviews" target="_blank">$trans(rateThisText)</a>
              <a class="blog" title="$trans(blogLinkTitle)"
                 href="https://siderite.dev/blog/new-chrome-extension-lichess-tools" target="_blank">siderite.dev</a>
            </div>
            <form>
<table class="allows lichessTools-globalSwitch">
    <tbody>
        <tr>
            <td>$trans(enableExtension)</td>
            <td>
                <div class="toggle">
                    <input id="enableLichessTools" name="enableLichessTools" value="true" type="checkbox" class="form-control cmn-toggle"/>
                    <label for="enableLichessTools"/>
                </div>
            </td>
        </tr>
        <tr>
            <td>$trans(advancedPreferences)</td>
            <td>
                <div class="toggle">
                    <input id="advancedPreferences" name="advancedPreferences" value="true" type="checkbox" class="form-control cmn-toggle"/>
                    <label for="advancedPreferences"/>
                </div>
            </td>
        </tr>
    </tbody>
</table>
`;
    if (isLoggedIn) {
      html+=`<h3>$trans(feedbackTitle)</h3>
<div class="feedback">
  <textarea enterkeyhint="send"></textarea>
  <button data-icon="&#xE03A;" title="$trans(feedbackButtonTitle)"></button>
</div>`;
    }
        
    const categs={};
    for (const tool of tools) {
      if (!tool.preferences) continue;
      for (const pref of tool.preferences) {
        if (!parent.debug) {
          if (pref.hidden) continue;
          if (!isLoggedIn && pref.needsLogin) continue;
        }
        let categ=categs[pref.category];
        if (!categ) {
          categ=[];
          categs[pref.category]=categ;
        }
        categ.push(pref);
      }
    }

    for (const key in categs) {
      const categ=categs[key];
      html+='<div><h3><label for="chk_'+key+'">$trans(options.'+key+')</label></h3><input type="checkbox" id="chk_'+key+'" class="categoryToggle">';
      for (const pref of categ) {
        const defaultValue=(!isLoggedIn && pref.defaultNotLoggedInValue!==undefined) ? pref.defaultNotLoggedInValue : pref.defaultValue;

        html+=`<section data-pref="${pref.name}"`;
        const classes=[];
        if (pref.advanced) classes.push('lichessTools-advancedPreference');
        if (pref.hidden||(!isLoggedIn&&pref.needsLogin)) classes.push('lichessTools-hiddenPreference');
        if (pref.wip) classes.push('lichessTools-wipPreference');
        if (classes.length) html+=' class="'+classes.join(' ')+'"'
        html+=`><h2>$trans(options.${pref.name})`;
        if (pref.author) {
          html+='<span class="lichessTools-author">$trans(author,'+htmlEncode(pref.author)+')</span>';
        }
        html+='</h2>';
        switch(pref.type) {
          case 'single': {
            html+=`<group class="radio">`;
            for (const val of pref.possibleValues) {
              const textKey=typeof val==='boolean'
                ? (val?'yes':'no')
                : (pref.valuePrefix||pref.name+'.')+val;
              html+=`<div`+(parent.isOptionSet(defaultValue,val)?' class="defaultValue"':'')+`>
                  <input type="radio" value="${val}" name="${pref.name}"/>
                  <label>$trans(${textKey})</label>
                </div>`;
            }
            html+=`</group>`;
          }
          break;
          case 'multiple': {
            html+=`<group class="radio">`;
            for (const val of pref.possibleValues) {
              const textKey=typeof val==='boolean'
                ? (val?'yes':'no')
                : (pref.valuePrefix||pref.name+'.')+val;
              html+=`<div`+(parent.isOptionSet(defaultValue,val)?' class="defaultValue"':'')+`>
                  <input type="checkbox" value="${val}" name="${pref.name}"/>
                  <label>$trans(${textKey})</label>
                </div>`;
            }
            html+=`</group>`;
          }
          break;
          case 'number': {
            html+=`<group>
                <div>
                  <input class="form-control" type="number" name="${pref.name}"/>
                </div></group>`;
          }
          break;
          case 'text': {
            html+=`<group>
                <div>
                  <input class="form-control" type="text" name="${pref.name}"/>
                </div></group>`;
          }
          break;
          default:
            throw new Error('Preference type '+pref.type+' not supported');
        }
        html+=`</section>`;
      }
      html+=`</div>`;
    }

    html+=`</form>
<div class="actionButtons">
<span>$trans(defaultValueLegend)</span>
<button id="btnReset" type="button" class="btn button button-red" title="$trans(resetButtonTitle)">$trans(resetButtonText)</button>
<button id="btnMinimal" type="button" class="btn button button-red" title="$trans(minimalButtonTitle)">$trans(minimalButtonText)</button>
<button id="btnBackup" type="button" class="btn button" title="$trans(backupButtonTitle)">$trans(backupButtonText)</button>
<button id="btnRestore" type="button" class="btn button" title="$trans(restoreButtonTitle)">$trans(restoreButtonText)</button>
</div>
</div>`;
    html=html.replace(/\$trans\(([^\),]+?)(?:\s*,\s*([^\)]+?))?\)/g,function(m,name,value) {
      return htmlEncode(value?trans.pluralSame(name,value):trans.noarg(name));
    });

    const container=$('div.page-menu__content');
    let saved=$('p.saved',container);
    saved=saved.length?saved.clone():$('<p class="saved text none" data-icon="\ue038"></p>').text(trans.noarg('preferencesSaved'));
    container.empty()
      .append(html)
      .addClass('lichessTools-preferences');
    $('form',container).append(saved);
    $('form input:not(.categoryToggle)',container)
      .each((i,e)=>{
        const type=$(e).prop('type');
        const isCheckable=type=='radio'||type=='checkbox';
        const optionName=$(e).attr('name');
        const optionValue=$(e).attr('value');
        const currentValue=currentOptions[optionName];
        const preferences=this.lichessTools.tools
          .find(t=>t.preferences?.find(p=>p.name==optionName))?.preferences
          .find(p=>p.name==optionName);
        if (currentValue!==undefined) {
          if (isCheckable) {
            const defaultValue=(!isLoggedIn && preferences?.defaultNotLoggedInValue!==undefined) ? preferences?.defaultNotLoggedInValue : preferences?.defaultValue;
            const checked = isOptionSet(currentValue,optionValue,defaultValue);
            $(e).prop('checked',checked);
          }
          else {
            $(e).val(currentValue);
          }
        }
        const label=$(e).next('label');
        if (label.length) {
          let id=$(e).attr('id');
          if (!id) {
            id = (parent.random() + 1).toString(36).substring(8);
            $(e).attr('id',id);
          }
          label.attr('for',id);
        }
      })
      .on('change keyup paste',parent.debounce(async function() {
          const type=$(this).prop('type');
          const isCheckable=type=='radio'||type=='checkbox';
          const optionName=$(this).attr('name');
          const optionValues=isCheckable
		    ? $('input[name="'+optionName+'"]').filter((i,e)=>$(e).is(':checked')).map((i,e)=>$(e).attr('value')).get()
            : [$(this).val()];
          let value=optionValues.join(',');
          if (value==='true') value=true; 
          else if (value==='false') value=false;
          currentOptions[optionName]=value;
          await applyOptions(currentOptions);
          parent.fireReloadOptions();
          checkGlobalSwitch();
          checkAdvanced();
          showSaved();
      },500));
      const feedbackTextarea = $('div.feedback textarea',container)
        .on('input keypress paste send',function(ev) {
          if (this.clientHeight<this.scrollHeight) {
            $(this).height(this.scrollHeight);
          }
        }); 
      $('div.feedback button',container)
        .on('click',ev=>{
          ev.preventDefault();
          const text=feedbackTextarea.val();
          feedbackTextarea.val('').css('height','');
          if (text) {
            lichess.socket.send('msgSend',{"dest":"totalnoob69","text":text});
          }
        });
      $('div.actionButtons #btnReset',container)
        .on('click',async ev=>{
          ev.preventDefault();
          if (!parent.global.confirm(trans.noarg('resetButtonWarning'))) return;
          const options=await parent.getOptions();
          const data=parent.tools
                       .map(t=>t.preferences)
                       .flat()
                       .filter(p=>p)
                       .map(p=>{
                         const defaultValue=(!isLoggedIn && p.defaultNotLoggedInValue!==undefined) ? p.defaultNotLoggedInValue : p.defaultValue;
                         return { name:p.name,value:defaultValue };
                       });
          for (const {name,value} of data) options[name]=value;
          await applyOptions(options);
          parent.fireReloadOptions();
          checkGlobalSwitch();
          checkAdvanced();
          this.openPreferences();
          showSaved();
        });
      $('div.actionButtons #btnMinimal',container)
        .on('click',async ev=>{
          ev.preventDefault();
          if (!parent.global.confirm(trans.noarg('minimalButtonWarning'))) return;
          const options=await parent.getOptions();
          const keys=parent.tools.map(t=>t.preferences).flat().filter(p=>p && (!p.hidden || p.offValue!==undefined) ).map(p=>({ key: p.name, offValue: p.offValue || false }));
          for (const {key,offValue} of keys) options[key]=offValue;
          await applyOptions(options);
          parent.fireReloadOptions();
          checkGlobalSwitch();
          checkAdvanced();
          this.openPreferences();
          showSaved();
        });
      $('div.actionButtons #btnBackup',container)
        .on('click',async ev=>{
          ev.preventDefault();
          const options=await parent.getOptions();
          const text=parent.global.JSON.stringify(options,null,2);
          const blob=new Blob([text],{type:'application/json'});
          const url=URL.createObjectURL(blob);
          $('<a>')
            .attr('download','lichesToolsOptions_'+(new Date().toISOString().replace(/[\-T:]/g,'').slice(0,14))+'.json')
            .attr('href',url)
            .trigger('click');
        });
      $('div.actionButtons #btnRestore',container)
        .on('click',async ev=>{
          ev.preventDefault();
          $('<input type="file">')
            .on('change',async e=>{
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = async (e)=>{
                const text=e.target.result;
                const options=parent.global.JSON.parse(text);
                await applyOptions(options);
                parent.fireReloadOptions();
                checkGlobalSwitch();
                checkAdvanced();
                this.openPreferences();
                showSaved();
              };
              reader.readAsText(file, "UTF-8");
            })
            .trigger('click');
        });
      checkGlobalSwitch();
      checkAdvanced();
      this.addInfo();
    };

    addInfo() {
      const parent=this.lichessTools;
      const $=parent.$;
      $('div.page-menu__content section[data-pref]').each((i,e)=>{
        const pref=$(e).attr('data-pref');
        $('<a>')
          .addClass('lichessTools-infoIcon')
          .attr('title','User manual (EN)')
          .attr('data-icon','\uE005')
          .attr('href','https://siderite.dev/blog/lichess-tools---user-manual/#'+pref)
          .attr('target','_blank')
          .prependTo(e);
      });
    };

    addPreferencesMenu=(isOpening)=>{
      if (!isOpening) return;
      const parent=this.lichessTools;
      const trans=parent.translator;
      const $=parent.$;
      if (!$('#dasher_app a.lichessTools-preferences').length) {
        let links=$('#dasher_app div.links');
        if (!links.length) {
          links=$('<div class="links">')
            .insertBefore('#dasher_app div.subs');
        }
        $('<a class="text lichessTools-preferences">')
          .attr('data-icon','\uE019')
          .attr('href','/team/all#lichessTools')
          .text(trans.noarg('lichessTools'))
          .attr('title',trans.noarg('lichessToolsPreferences'))
          .appendTo(links);
      }

    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const location=parent.global.location;
      const trans=parent.translator;
      this.options={
        enabled: true,
        advanced:!!parent.currentOptions.getValue('advancedPreferences')
      };
      this.logOption('Integration in Preferences', this.options.enabled);
      this.logOption(' ... show advanced', this.options.advanced);

      const isLoggedIn=!!parent.getUserId();
      const isLoggedOutTeams=location.pathname=='/team/all' && !isLoggedIn;
      lichess.pubsub.off('dasher.toggle',this.addPreferencesMenu);
      if (!isLoggedIn) {
        lichess.pubsub.on('dasher.toggle',this.addPreferencesMenu);
      }

      if (!$('main.account').length && !isLoggedOutTeams) {
        return;
      }

      if ($('a.lichessTools-menu').length) return;
      const openPreferences=this.openPreferences;

      let $this=this;
      const f=function() {
        if (location.hash?.startsWith('#lichessTools')) {
          if (isLoggedOutTeams) {
            lichess.asset.loadCssPath('bits.account');
            $('main nav.subnav').hide();
          }
          openPreferences();
          parent.global.setTimeout(()=>{
            const m=/#lichessTools\/(?<pref>.*)$/.exec(location.hash);
            const pref=m?.groups?.pref;
            if (pref!=$this._lastScrolled) {
              const elem=$('[data-pref="'+pref+'"]');
              elem.parents().add(elem).show();
              elem[0]?.scrollIntoView();
              $this._lastScrolled=pref;
            }
          },500);
        } else {
          if ($('.lichessTools-preferences').length) {
            location.reload();
          }
        }
      };
      $(parent.global).on('hashchange',f);

      const prefElem=$('<a>')
        .addClass('lichessTools-menu')
        .attr('href',isLoggedOutTeams?'/team/all#lichessTools':'/account/preferences/display#lichessTools')
	    .append($('<span>').text(trans.noarg('LiChess Tools')));

      $('.page-menu__menu a[href*=privacy]').before(prefElem);
      f();
    }

  }
  LiChessTools.Tools.Preferences=PreferencesTool;
})();
