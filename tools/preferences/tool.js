(() => {
  class PreferencesTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties'];

    preferences = [
      {
        name: 'advancedPreferences',
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
        'defaultValueLegend': '*Blue bordered preferences are the ones enabled by default',
        'noDirectoryPickerWarning': 'This browser does not support this functionality',
        'folderButtonTitle': 'Pick a folder',
        'fileButtonTitle': 'Pick a file',
        'userManualLinkTitle': 'User manual (EN)',
        'preferenceFilterPlaceholder': 'Filter preferences'
      },
      'ro-RO': {
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
        'defaultValueLegend': '*Preferin\u0163ele cu margine alb\u0103strie sunt cele implicite',
        'noDirectoryPickerWarning': 'Acest browser nu suport\u0103 aceast\u0103 func\u0163ionalitate',
        'folderButtonTitle': 'Alege un director de fi\u015fiere',
        'fileButtonTitle': 'Alege un fi\u015fier',
        'userManualLinkTitle': 'Manual utilizator (EN)',
        'preferenceFilterPlaceholder': 'Filtru preferin\u0163e'
      }
    }

    openPreferences = () => {
      const lt = this.lichessTools;
      const Math = lt.global.Math;
      const $ = lt.$;
      const trans = lt.translator;
      const tools = lt.tools;
      const htmlEncode = lt.htmlEncode;
      const currentOptions = lt.currentOptions;
      const applyOptions = lt.applyOptions;
      const lichess = lt.lichess;
      const isOptionSet = lt.isOptionSet;
      const isLoggedIn = !!lt.getUserId();

      lt.global.document.title = trans.noarg('lichessToolsPreferences');

      const subnav = $('main nav.subnav').hide();

      const showSaved = () => {
        $('.saved').removeClass('none');
        lt.global.setTimeout(() => $('.saved').addClass('none'), 2000);
      };
      const checkGlobalSwitch = () => {
        $.cached('body').toggleClass('lichessTools-globalDisable', !lt.currentOptions.enableLichessTools);
      };
      const checkAdvanced = () => {
        this.options.advanced = !!lt.currentOptions.getValue('advancedPreferences');
        $.cached('body').toggleClass('lichessTools-advancedPreferences', this.options.advanced);
      };

      //TODO add link to translation project
      let html = `<div class="account box box-pad">
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
        html += `<h3>$trans(feedbackTitle)</h3>
<div class="feedback">
  <textarea enterkeyhint="send"></textarea>
  <button data-icon="${lt.icon.toEntity(lt.icon.PlayTriangle)}" title="$trans(feedbackButtonTitle)"></button>
</div>
<div class="prefFilter">
  <input type="text" class="prefFilter" placeholder="$trans(preferenceFilterPlaceholder)">
</div>`;
      }

      const categs = {};
      for (const tool of tools) {
        if (!tool.preferences) continue;
        for (const pref of tool.preferences) {
          if (!lt.debug) {
            if (pref.hidden) continue;
            if (!isLoggedIn && pref.needsLogin) continue;
          }
          let categ = categs[pref.category];
          if (!categ) {
            categ = [];
            categs[pref.category] = categ;
          }
          categ.push(pref);
        }
      }

      const order = ['languages', 'community', 'general', 'appearance', 'analysis', 'analysis2', 'study', 'friends', 'play', 'puzzles', 'TV', 'mobile', 'comm', 'integration'];
      const diff = new Set(order).symmetricDifference(new Set(Object.keys(categs)));
      if (diff.size) {
        lt.global.setTimeout(()=>lt.global.console.warn('There is a difference between category keys and order: ',diff,100));
      }
      for (const key of order) {
        const categ = categs[key];
        const prefCount = categ.filter(pref=>(this.options.advanced||!pref.advanced) && !pref.hidden && (isLoggedIn || !pref.needsLogin)).length;
        html += '<div><h3><label for="chk_' + key + '"><span class="lichessTools-prefCount">(' + prefCount + ')</span> $trans(options.' + key + ')</label></h3><input type="checkbox" id="chk_' + key + '" class="categoryToggle" checked>';
        for (const pref of categ) {
          const defaultValue = (!isLoggedIn && pref.defaultNotLoggedInValue !== undefined) ? pref.defaultNotLoggedInValue : pref.defaultValue;

          html += `<section data-pref="${pref.name}"`;
          const classes = [];
          if (pref.advanced) {
            classes.push('lichessTools-advancedPreference');
          }
          if (pref.hidden || (!isLoggedIn && pref.needsLogin)) {
            classes.push('lichessTools-hiddenPreference');
          } else {
            if (!pref.advanced) {
              classes.push('lichessTools-normalPreference');
            }
          }
          if (pref.wip) classes.push('lichessTools-wipPreference');
          if (classes.length) html += ' class="' + classes.join(' ') + '"'
          html += `><h2>$trans(options.${pref.name})`;
          if (pref.author) {
            html += '<span class="lichessTools-author">$trans(author,' + htmlEncode(pref.author) + ')</span>';
          }
          html += '</h2>';
          switch (pref.type) {
            case 'single': {
              html += `<group class="radio">`;
              for (const val of pref.possibleValues) {
                const textKey = typeof val === 'boolean'
                  ? (val ? 'yes' : 'no')
                  : (pref.valuePrefix || pref.name + '.') + val;
                html += `<div` + (lt.isOptionSet(defaultValue, val) ? ' class="defaultValue"' : '') + `>
                  <input type="radio" value="${val}" name="${pref.name}"/>
                  <label>$trans(${textKey})</label>
                </div>`;
              }
              html += `</group>`;
            }
              break;
            case 'multiple': {
              html += `<group class="radio">`;
              for (const val of pref.possibleValues) {
                const textKey = typeof val === 'boolean'
                  ? (val ? 'yes' : 'no')
                  : (pref.valuePrefix || pref.name + '.') + val;
                html += `<div` + (lt.isOptionSet(defaultValue, val) ? ' class="defaultValue"' : '') + `>
                  <input type="checkbox" value="${val}" name="${pref.name}"/>
                  <label>$trans(${textKey})</label>
                </div>`;
              }
              html += `</group>`;
            }
              break;
            case 'number': {
              html += `<group>
                <div>
                  <input class="form-control" type="number" name="${pref.name}"/>
                </div></group>`;
            }
              break;
            case 'text': {
              html += `<group>
                <div>
                  <input class="form-control" type="text" name="${pref.name}"/>
                </div></group>`;
            }
              break;
            case 'folder': {
              html += `<group>
                <div class="folder">
                  <input class="form-control" type="text" name="${pref.name}" readonly/>
                  <button class="form-control button picker" type="button" name=${pref.name}-picker" title="$trans(folderButtonTitle)">&#x1F4C1;</button>
                  <button class="form-control button delete" type="button" name=${pref.name}-delete" title="$trans(folderButtonTitle)">&#x2716;</button>
                </div></group>`;
            }
              break;
            case 'file': {
              html += `<group>
                <div class="file">
                  <input class="form-control" type="text" name="${pref.name}" readonly/>
                  <button class="form-control button picker" type="button" name=${pref.name}-picker" title="$trans(folderButtonTitle)" 
                     data-filedescription="${pref.fileDescription||''}" data-fileextension="${pref.fileExtension||''}">&#x1F4C1;</button>
                  <button class="form-control button delete" type="button" name=${pref.name}-delete" title="$trans(folderButtonTitle)">&#x2716;</button>
                </div></group>`;
            }
              break;
            default:
              throw new Error('Preference type ' + pref.type + ' not supported');
          }
          html += `</section>`;
        }
        html += `</div>`;
      }

      html += `</form>
<div class="actionButtons">
<span>$trans(defaultValueLegend)</span>
<button id="btnReset" type="button" class="btn button button-red" title="$trans(resetButtonTitle)">$trans(resetButtonText)</button>
<button id="btnMinimal" type="button" class="btn button button-red" title="$trans(minimalButtonTitle)">$trans(minimalButtonText)</button>
<button id="btnBackup" type="button" class="btn button" title="$trans(backupButtonTitle)">$trans(backupButtonText)</button>
<button id="btnRestore" type="button" class="btn button" title="$trans(restoreButtonTitle)">$trans(restoreButtonText)</button>
</div>
</div>`;
      html = html.replace(/\$trans\(([^\),]+?)(?:\s*,\s*([^\)]+?))?\)/g, function (m, name, value) {
        return htmlEncode(value ? trans.pluralSame(name, value) : trans.noarg(name));
      });

      const container = $('div.page-menu__content');
      let saved = $('p.saved', container);
      saved = saved.length ? saved.clone() : $('<p class="saved text none">').attr('data-icon',lt.icon.Checkmark).text(trans.noarg('preferencesSaved'));
      container.empty()
        .append(html)
        .addClass('lichessTools-preferences');

      $('input.prefFilter',container)
        .on('input',ev=>{
          const tokens = (ev.target.value?.split(/\s+/) || []).filter(t=>t).map(t=>t.toLowerCase());
          const prefs = [];
          for (const key in categs) {
            const categ = categs[key];
            const items = categ
                            .filter(pref=>(this.options.advanced||!pref.advanced) && !pref.hidden && (isLoggedIn || !pref.needsLogin))
                            .map(pref=>({ 
                               name: pref.name,
                               text: [pref.name, pref.category, trans.noarg('options.'+pref.name),trans.noarg('options.'+pref.category)]
                                       .concat((pref.possibleValues||[]).map(v=>{
                                         if (typeof(v) === 'boolean') return v?'yes':'no';
                                         return pref.name+'.'+v;
                                       }).map(v=>trans.noarg(v)))
                                       .concat((pref.possibleValues||[]).map(v=>{
                                         if (typeof(v) !== 'boolean') return pref.name+'.'+v;
                                       }))
                                       .join(' ').toLowerCase()
                             }));
            prefs.push.apply(prefs,items);
          }
          const visiblePrefs = prefs.filter(p=>!tokens.find(t=>!p.text.includes(t))).map(p=>p.name);
          $('section[data-pref]').each((i,e)=>{
            const pref = $(e).attr('data-pref');
            const shown = visiblePrefs.includes(pref);
            $(e)
              .toggleClass('filteredIn',shown && tokens.length)
              .toggleClass('filteredOut',!shown);
          });
        });

      $('form', container).append(saved);
      $('form input:not(.categoryToggle,.prefFilter)', container).add($('main nav.subnav input:not(.categoryToggle,.prefFilter)'))
        .each((i, e) => {
          const type = $(e).prop('type');
          const isCheckable = type == 'radio' || type == 'checkbox';
          const optionName = $(e).attr('name');
          const optionValue = $(e).attr('value');
          const currentValue = currentOptions[optionName];
          const preferences = lt.tools
            .find(t => t.preferences?.find(p => p.name == optionName))?.preferences
            .find(p => p.name == optionName);
          if (currentValue !== undefined) {
            if (isCheckable) {
              const defaultValue = (!isLoggedIn && preferences?.defaultNotLoggedInValue !== undefined) ? preferences?.defaultNotLoggedInValue : preferences?.defaultValue;
              const checked = isOptionSet(currentValue, optionValue, defaultValue);
              $(e).prop('checked', checked);
            }
            else {
              $(e).val(currentValue);
            }
          }
          const label = $(e).next('label');
          if (label.length) {
            let id = $(e).attr('id');
            if (!id) {
              id = (lt.random() + 1).toString(36).substring(8);
              $(e).attr('id', id);
            }
            label.attr('for', id);
          }
        })
        .on('change keyup paste', lt.debounce(async function () {
          const type = $(this).prop('type');
          const isCheckable = type == 'radio' || type == 'checkbox';
          const optionName = $(this).attr('name');
          const optionValues = isCheckable
            ? $('input[name="' + optionName + '"]').filter((i, e) => $(e).is(':checked')).map((i, e) => $(e).attr('value')).get()
            : [$(this).val()];
          let value = optionValues.join(',');
          if (value === 'true') value = true;
          else if (value === 'false') value = false;
          currentOptions[optionName] = value;
          await applyOptions(currentOptions);
          lt.fireReloadOptions();
          checkGlobalSwitch();
          checkAdvanced();
          showSaved();
        }, 500));
      const feedbackTextarea = $('div.feedback textarea', container)
        .on('input keypress paste send', function (ev) {
          if (this.clientHeight < this.scrollHeight) {
            $(this).height(this.scrollHeight);
          }
        });
      $('div.feedback button', container)
        .on('click', ev => {
          ev.preventDefault();
          const text = feedbackTextarea.val();
          feedbackTextarea.val('').css('height', '');
          if (text) {
            this.sendMessageToDev(text);
          }
        });
      $('.folder button.picker', container)
        .on('click', async ev => {
          ev.preventDefault();
          const input=$(ev.target).siblings('input[type="text"]');
          const name = input.attr('name');
          if (!name) {
            throw new Error('Could not find input for folder select button');
          }
          let handle;
          let handleName;
          if (lt.global.showDirectoryPicker) {
            handle = await lt.global.showDirectoryPicker({
              id: 'ltf-'+name,
              mode: 'readwrite',
              startIn: 'documents'
            });
            handleName = handle?.name;
          } else 
          if (lt.global.navigator?.storage?.getDirectory) {
            handle = await lt.global.navigator.storage.getDirectory();
            handleName = handle ? 'internal' : '';
          } else {
            lt.announce(trans.noarg('noDirectoryPickerWarning'));
            return;
          }
          if (!handle) return;
          await lt.storage.set('lichessTools/LT/'+name+'-folder', handle, { db: true, raw: true });
          input
            .val(handleName)
            .trigger('change');
        });
      $('.folder button.delete', container)
        .on('click', async ev => {
          ev.preventDefault();
          const input=$(ev.target).siblings('input[type="text"]');
          const name = input.attr('name');
          if (!name) {
            throw new Error('Could not find input for folder select button');
          }
          await lt.storage.set('lichessTools/LT/'+name+'-folder', undefined, { db: true, raw: true });
          input
            .val('')
            .trigger('change');
        });
      $('.file button.picker', container)
        .on('click', async ev => {
          ev.preventDefault();
          const input=$(ev.target).siblings('input[type="text"]');
          const name = input.attr('name');
          if (!name) {
            throw new Error('Could not find input for file select button');
          }
          let handle;
          let handleName;
          const btn = $(ev.currentTarget);
          if (lt.global.showOpenFilePicker) {
            const filetype = {};
            const description = btn.attr('data-filedescription');
            if (description) filetype.description = description;
            const extension = btn.attr('data-fileextension');
            if (extension) filetype.accept = {
              "application/octet-stream": [ extension ]
            }
            handle= await lt.global.showOpenFilePicker({
              id: 'ltf-'+name,
              multiple: false,
              startIn: 'documents',
              types: [ filetype ]
            });
            handle = handle?.[0];
            handleName = handle?.name;
          } else {
            handle = await new Promise((resolve)=>{
              $('<input type="file" />')
                .on('change cancel',e=>{
                  resolve(e.target.files[0]);
                })
                .trigger('click');
            });
            handleName = handle?.name;
          }
          if (!handle) return;
          await lt.storage.set('lichessTools/LT/'+name+'-file', handle, { db: true, raw: true });
          input
            .val(handleName)
            .trigger('change');
        });
      $('.file button.delete', container)
        .on('click', async ev => {
          ev.preventDefault();
          const input=$(ev.target).siblings('input[type="text"]');
          const name = input.attr('name');
          if (!name) {
            throw new Error('Could not find input for file select button');
          }
          await lt.storage.set('lichessTools/LT/'+name+'-file', undefined, { db: true, raw: true });
          input
            .val('')
            .trigger('change');
        });
      $('div.actionButtons #btnReset', container)
        .on('click', async ev => {
          ev.preventDefault();
          if (!await lt.uiApi.dialog.confirm(trans.noarg('resetButtonWarning'))) return;
          const options = await lt.getOptions();
          const data = lt.tools
            .map(t => t.preferences)
            .flat()
            .filter(p => p)
            .map(p => {
              const defaultValue = (!isLoggedIn && p.defaultNotLoggedInValue !== undefined) ? p.defaultNotLoggedInValue : p.defaultValue;
              return { name: p.name, value: defaultValue };
            });
          for (const { name, value } of data) options[name] = value;
          await applyOptions(options);
          lt.fireReloadOptions();
          checkGlobalSwitch();
          checkAdvanced();
          this.openPreferences();
          showSaved();
        });
      $('div.actionButtons #btnMinimal', container)
        .on('click', async ev => {
          ev.preventDefault();
          if (!await lt.uiApi.dialog.confirm(trans.noarg('minimalButtonWarning'))) return;
          const options = await lt.getOptions();
          const keys = lt.tools.map(t => t.preferences).flat().filter(p => p && (!p.hidden || p.offValue !== undefined)).map(p => ({ key: p.name, offValue: p.offValue || false }));
          for (const { key, offValue } of keys) options[key] = offValue;
          await applyOptions(options);
          lt.fireReloadOptions();
          checkGlobalSwitch();
          checkAdvanced();
          this.openPreferences();
          showSaved();
        });
      $('div.actionButtons #btnBackup', container)
        .on('click', async ev => {
          ev.preventDefault();
          const options = await lt.getOptions();
          const text = lt.global.JSON.stringify({...options, userId: lt.getUserId()}, null, 2);
          const blob = new Blob([text], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          $('<a>')
            .attr('download', 'lichesToolsOptions_' + (new Date().toISOString().replace(/[\-T:]/g, '').slice(0, 14)) + '.json')
            .attr('href', url)
            .trigger('click');
        });
      $('div.actionButtons #btnRestore', container)
        .on('click', async ev => {
          ev.preventDefault();
          $('<input type="file">')
            .on('change', async e => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = async (e) => {
                const text = e.target.result;
                const options = lt.global.JSON.parse(text);
                await applyOptions(options);
                lt.fireReloadOptions();
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

    sendMessageToDev = (msg) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      const data = lt.global.document.body.dataset;
      const baseUrls = (data.socketAlts || data.socketDomains)?.split(',');
      if (!baseUrls?.length) return;
      const url = 'wss://' + baseUrls[lt.global.Math.floor(lt.global.Math.random() * baseUrls.length)];
      const fullUrl = url + '/socket/v5?sri=' + lt.sri;
      const ws = new WebSocket(fullUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({"t":"msgSend","d":{"dest":"totalnoob69","text":msg}}));
        lt.global.setTimeout(()=>ws.close(),1000);
      };
    }


    addInfo() {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      $('div.page-menu__content section[data-pref]').each((i, e) => {
        const pref = $(e).attr('data-pref');
        $('<a>')
          .addClass('lichessTools-infoIcon')
          .attr('title', trans.noarg('userManualLinkTitle'))
          .attr('data-icon', lt.icon.InfoCircle)
          .attr('href', 'https://siderite.dev/blog/lichess-tools---user-manual/#' + pref)
          .attr('target', '_blank')
          .appendTo($('h2',e));
      });
    };

    addPreferencesMenu = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      if (!$('#dasher_app a.lichessTools-preferences').length) {
        const elem = $('<a class="text lichessTools-preferences">')
          .attr('data-icon', lt.icon.Gear)
          .attr('href', '/team/all#lichessTools')
          .text(trans.noarg('lichessTools'))
          .attr('title', trans.noarg('lichessToolsPreferences'));
        let links = $('#dasher_app div.links');
        if (!links.length) {
          links = $('<div class="links">')
            .insertBefore('#dasher_app div.subs');
          elem.appendTo(links);
        } else {
          elem
            .insertAfter($('[href="/account/profile"]',links));
        }
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const location = lt.global.location;
      const trans = lt.translator;
      this.options = {
        enabled: true,
        advanced: !!lt.currentOptions.getValue('advancedPreferences')
      };
      this.logOption('Integration in Preferences', this.options.enabled);
      this.logOption(' ... show advanced', this.options.advanced);
      if (!this.options.enabled) return;

      if (/^\/account\/preferences\/display#lichessTools/.test(lt.global.location.pathname+lt.global.location.hash)) {
        lt.global.location = '/team/all'+lt.global.location.hash;
        return;
      }

      const isTeams = location.pathname == '/team/all';
      lt.global.clearInterval(this.interval);
      this.interval = lt.global.setInterval(this.addPreferencesMenu,500);

      if ($('a.lichessTools-menu').length) return;
      const openPreferences = this.openPreferences;

      let $this = this;
      const f = function () {
        if (location.hash?.startsWith('#lichessTools')) {
          lichess.asset.loadCssPath('bits.account');
          openPreferences();
          const fc = () => {
            const m = /#lichessTools\/(?<pref>.*)$/.exec(location.hash);
            const pref = m?.groups?.pref;
            if (pref && pref != $this._lastScrolled) {
              const elem = $('[data-pref="' + pref + '"]');
              if (!elem.length) {
                lt.global.setTimeout(fc, 500);
                return;
              }
              elem.parents().add(elem).show();
              elem[0]?.scrollIntoView();
              $this._lastScrolled = pref;
            }
          };
          fc();
        } else {
          if ($('.lichessTools-preferences').length) {
            location.reload();
          }
        }
      };
      $(lt.global).on('hashchange', f);

      f();
    }

  }
  LiChessTools.Tools.Preferences = PreferencesTool;
})();
