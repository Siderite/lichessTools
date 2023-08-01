(()=>{
  class PreferencesTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'advancedPreferences',
        category: 'general',
        type:'single',
        possibleValues: [true,false],
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
        'advancedPreferences': 'Advanced preferences',
        'options.advancedPreferences': 'Advanced preferences',
        'author': 'by %s'
      },
      'ro-RO':{
        yes: 'Da',
        no: 'Nu',
        'preferencesSaved': 'Preferin\u0163ele tale au fost salvate',
        'rateThisText': 'D\u0103-i o not\u0103!',
        'rateThisTitle': 'Notele date m\u0103 ajut\u0103 foarte mult',
        'blogLinkTitle': 'Pagina extensiei. Trimite-mi un mesaj.',
        'enableExtension': 'Activeaz\u0103 extensia LiChess Tools',
        'advancedPreferences': 'Preferin\u0163e avansate',
        'options.advancedPreferences': 'Preferin\u0163e avansate',
        'author': 'de %s'
      }
    }

  openPreferences=()=>{
    const $=this.lichessTools.$;
    const trans=this.lichessTools.translator;
    const tools=this.lichessTools.tools;
    const htmlEncode=this.lichessTools.htmlEncode;
    const currentOptions=this.lichessTools.currentOptions;
    const applyOptions=this.lichessTools.applyOptions;
    const lichess=this.lichessTools.lichess;
    const isOptionSet=this.lichessTools.isOptionSet;

    $('nav.page-menu__menu.subnav a.active').removeClass('active');
    $('a.lichessTools-menu').addClass('active');

    const showSaved= ()=> {
      $('.saved').removeClass('none');
      this.lichessTools.global.setTimeout(()=>$('.saved').addClass('none'),2000);
    };
    const checkGlobalSwitch=()=>{
      $('body').toggleClass('lichessTools-globalDisable',!currentOptions.enableLichessTools);
    };
    const checkAdvanced=()=>{
      $('body').toggleClass('lichessTools-advancedPreferences',!!currentOptions.getValue('advancedPreferences'));
    };

    //TODO add link to translation project
    let html=`<div class="account box box-pad">
            <h1 class="box__top">$trans(LiChess Tools)</h1>
            <div class="links">
              <a class="rate" title="$trans(rateThisTitle)"
                 href="https://chrome.google.com/webstore/detail/lichess-tools-by-siderite/langlhlcknngldkeliapahbhbcmlcbcj" target="_blank">$trans(rateThisText)</a>
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
</table>            `;
        
    const categs={};
    for (const tool of tools) {
      if (!tool.preferences) continue;
      for (const pref of tool.preferences) {
        if (pref.hidden) continue;
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
        html+=`<section data-pref="${pref.name}"`;
        if (pref.advanced) html+=' class="lichessTools-advancedPreference"'
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
              html+=`<div>
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
              html+=`<div>
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
          default:
            throw new Error('Preference type '+pref.type+' not supported');
        }
        html+=`</section>`;
      }
      html+=`</div>`;
    }

    html+=`</form><div>`;
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
    $('input:not(.categoryToggle)',container)
      .each((i,e)=>{
        const type=$(e).prop('type');
        const isCheckable=type=='radio'||type=='checkbox';
        const optionName=$(e).attr('name');
        const optionValue=$(e).attr('value');
        const currentValue=currentOptions[optionName];
        if (currentValue!==undefined) {
          if (isCheckable) {
            const checked = isOptionSet(currentValue,optionValue);
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
            id = (Math.random() + 1).toString(36).substring(8);
            $(e).attr('id',id);
          }
          label.attr('for',id);
        }
      })
      .on('change keyup paste click',this.lichessTools.debounce(function() {
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
          applyOptions(currentOptions).then(function() {
            lichess.storage.fire('lichessTools.reloadOptions');
            checkGlobalSwitch();
            checkAdvanced();
            showSaved();
          }).catch(e=>{ throw e; });
      },500));
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

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const location=parent.global.location;
      const trans=parent.translator;
      this.logOption('Integration in Preferences', true);
      this.logOption(' ... show advanced', !!parent.currentOptions.getValue('advancedPreferences'));
      if (!$('main.account').length) return;
      if ($('a.lichessTools-menu').length) return;
      const openPreferences=this.openPreferences;

      const f=function() {
        if (location.hash=='#lichessTools') {
          openPreferences();
        } else {
          if ($('.lichessTools-preferences').length) {
            location.reload();
          }
        }
      };
      f();
      $(parent.global).on('hashchange',f);

      const prefElem=$('<a>')
        .addClass('lichessTools-menu')
        .attr('href','/account/preferences/display#lichessTools')
	    .append($('<span>').text(trans.noarg('LiChess Tools')));

      $('nav.page-menu__menu.subnav a[href*=privacy]').before(prefElem);
    }

  }
  LiChessTools.Tools.Preferences=PreferencesTool;
})();
