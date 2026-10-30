(() => {
  class CustomChatButtonsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['DetectThirdParties','InterceptEventHandlers','Dialog'];

    preferences = [
      {
        name: 'customChatButtons',
        category: 'play',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: false,
        needsLogin: true
      }
    ];

    intl = {
      'en-US': {
        'options.play': 'Play',
        'options.customChatButtons': 'Customize chat buttons',
        'addButtonTitle': 'add button',
        'deleteButtonTitle': 'delete button',
        'editButtonTitle': 'LiChess Tools - edit buttons',
        'startButtonsText': 'Start of game',
        'endButtonsText': 'End of game',
        'shortInputText': '-> button',
        'longInputText': '-> message',
        'restoreDefaultsTitle': 'restore default buttons',
        'buttonsEditFormHeader': 'Edit buttons'
      },
      'ro-RO': {
        'options.play': 'Joc',
        'options.customChatButtons': 'Personalizeaz\u0103 butoanele din chat',
        'addButtonTitle': 'adaug\u0103 buton',
        'deleteButtonTitle': '\u015Fterge buton',
        'editButtonTitle': 'LiChess Tools - modific\u0103 butoane',
        'startButtonsText': 'Start de partid\u0103',
        'endButtonsText': 'Sf\u00e2r\u015fit de partid\u0103',
        'shortInputText': '-> buton',
        'longInputText': '-> mesaj',
        'restoreDefaultsTitle': 'restaureaz\u0103 butoanele standard',
        'buttonsEditFormHeader': 'Editare butoane'
      }
    }

    defaultButtons = {
      start: ['hi/Hello', 'gl/Good luck', 'hf/Have fun!', 'u2/You too!'],
      end: ['gg/Good game', 'wp/Well played', 'ty/Thank you', "gtg/I've got to go", 'bye/Bye!'],
    };
    getDefaultButtons = () => {
      return { start: [...this.defaultButtons.start], end: [...this.defaultButtons.end] };
    };
    getStoredButtons = () => {
      const lt = this.lichessTools;
      const stored = lt.currentOptions['customChatButtons.buttons'] || this.getDefaultButtons();
      const defaults = this.getDefaultButtons();
      return {
        start: stored.start ?? defaults.start,
        end: stored.end ?? defaults.end
      };
    };
    splitButton = (str) => {
      const split = (str || '').split('/');
      return {
        short: split[0].trim(),
        long: split.slice(1).join('/').trim()
      };
    };
    makeButton = (short, long) => {
      short = (short || '').replace(/\//g, '').trim().slice(0, 4);
      long = (long || '').trim();
      if (!short || !long) return null;
      return short + '/' + long;
    };
    getButtons = (group) => {
      return this.getStoredButtons()[group].map(this.splitButton);
    };

    saveButtons = async buttons => {
      const lt = this.lichessTools;
      lt.currentOptions['customChatButtons.buttons'] = buttons;
      await lt.saveOptions(lt.currentOptions);
    };
    updateButtons = (buttons) => {
      const lt = this.lichessTools;
      const old = lt.currentOptions['customChatButtons.buttons'] || this.getDefaultButtons();
      if (lt.global.JSON.stringify(buttons) == lt.global.JSON.stringify(old)) return false;
      this.saveButtons(buttons).catch((e)=>{ lt.global.console.error('Failed to save the chat buttons!', e); });
      lt.global.setTimeout(this.discoverChat, 100);
      return true;
    };

    group = 'start';

    detectGroup = (presets) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const spans = $('span:not([data-role])', presets).get();
      for (const e of spans) {
        if (e.isCustomized) continue;
        const text = $(e).text().trim();
        if (text === this.defaultButtons.end[0].split('/')[0]) this.group = 'end';
        else if (text === this.defaultButtons.start[0].split('/')[0]) this.group = 'start';
        break;
      }
    };

    discoverChat = () => {
      const lt = this.lichessTools;
      const trans = lt.translator;
      const $ = lt.$;
      const chat = $('section.mchat');
      if (!chat.length) return;
      const presets = $('div.mchat__presets', chat);
      if (!presets.length) return;
      this.detectGroup(presets);
      const buttons = this.getButtons(this.group);
      const existingButtons = $('section.mchat div.mchat__presets span:not([data-role])').get();
      let index = 0;
      while (index < existingButtons.length) {
        const elem = $(existingButtons[index]);
        const button = buttons[index];
        if (!button) {
          existingButtons.splice(index, 1);
          elem.remove();
        } else {
          index++;
          const title = button.long || button.short;
          if (elem.text() !== button.short || elem.attr('title') !== title) {
            elem.textSafe(button.short).attr('title', title);
          }
          if (!elem[0].isCustomized) {
            elem[0].isCustomized = true;
            lt.removeEventHandlers(elem[0], 'click');
            elem.on('click', this.clickHandler);
          }
        }
      }
      let editButton = $('span.lichessTools-editButton', presets);
      if (!editButton.length) {
        editButton = $('<span class="lichessTools-editButton">')
          .attr('title', trans.noarg('editButtonTitle'))
          .attr('data-role', 'editButtons')
          .attr('data-icon', lt.icon.Gear)
          .on('click', this.configureButton)
          .appendTo(presets);
      }
      while (index < buttons.length) {
        const button = buttons[index];
        const elem = $('<span>')
          .textSafe(button.short)
          .attr('title', button.long || button.short)
          .on('click', this.clickHandler)
          .insertBefore(editButton);
        elem[0].isCustomized = true;
        index++;
      }
    };

    clickHandler = (ev) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (!lt.uiApi) return;
      const elem = $(ev.currentTarget);
      if (!elem.length || elem.is('[data-role]')) return;
      const text = elem.attr('title');
      if (!text) return;
      lt.uiApi.chat.post(text);
    };

    editorDialog = null;

    configureButton = (ev) => {
      const lt = this.lichessTools;
      if (this.editorDialog?.isConnected) return;
      ev.preventDefault();
      lt.global.setTimeout(this.showEditor, 100);
    };

    showEditor = async () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      $('dialog.lichessTools-customChatButtons').remove();
      const dialog = await lt.dialog({
        header: $('<h2>').text(trans.noarg('buttonsEditFormHeader')),
        help: 'https://siderite.dev/blog/lichess-tools---user-manual#customChatButtons',
        noDrag: true
      });
      if (!dialog) return;
      const $dialog = $(dialog)
        .addClass('lichessTools-customChatButtons');
      this.editorDialog = dialog;
      const buttons = this.getStoredButtons();
      for (const phase of ['start','end']) {
        const container = $('<div class="buttons-group">')
          .attr('data-group', phase)
          .appendTo($dialog.find('.dialog-content'));
        $('<h3>')
          .text(trans.noarg(phase == 'start' ? 'startButtonsText' : 'endButtonsText'))
          .appendTo(container);
        const actions = $('<div class="group-actions">').appendTo(container);
        $('<button class="add-button">')
          .attr('type', 'button')
          .attr('title', trans.noarg('addButtonTitle'))
          .attr('data-icon', lt.icon.PlusButton)
          .on('click', (ev)=>{ ev.preventDefault(); this.appendRow(container, phase, ''); })
          .appendTo(actions);
        $('<button class="reset-button">')
          .attr('type', 'button')
          .attr('title', trans.noarg('restoreDefaultsTitle'))
          .attr('data-icon', lt.icon.Reload)
          .on('click', (ev)=>{ ev.preventDefault(); this.resetGroup(phase, container); })
          .appendTo(actions);
        for (const str of buttons[phase]) {
          this.appendRow(container, phase, str);
        }
      }
      $('button.close-button', $dialog)
        .on('click', (ev)=>{
          ev.preventDefault();
          this.closeEditor();
        });
      $dialog.on('close', this.saveEditorState);
      dialog.showModal();
    };

    appendRow = (container, phase, str) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const button = this.splitButton(str);
      const row = $('<div class="button-row">')
        .attr('data-group', phase)
        .appendTo(container);
      const labelInput = $('<input class="label-input">')
        .attr('type', 'text')
        .attr('maxlength', '4')
        .attr('placeholder', trans.noarg('shortInputText'))
        .appendTo(row);
      const textInput = $('<input class="text-input">')
        .attr('type', 'text')
        .attr('placeholder', trans.noarg('longInputText'))
        .appendTo(row);
      labelInput.val(button.short);
      textInput.val(button.long || '');
      const deleteButton = $('<button class="delete-button">')
        .attr('type', 'button')
        .attr('title', trans.noarg('deleteButtonTitle'))
        .attr('data-icon', lt.icon.Trash)
        .appendTo(row);
      deleteButton
        .on('click', (ev)=>{
          ev.preventDefault();
          row.remove();
          this.saveEditorState();
        });
      labelInput.on('input change', this.fieldChanged);
      textInput.on('input change', this.fieldChanged);
      return row;
    };

    readEditor = ($dialog) => {
      const lt = this.lichessTools;
      const buttons = {};
      $dialog.find('div.buttons-group').each((i, e) => {
        const section = lt.$(e);
        const phase = section.attr('data-group');
        if (!phase) return;
        const list = [];
        section.find('div.button-row').each((j, r) => {
          const str = this.makeButton(
            lt.$('input.label-input', r).val(),
            lt.$('input.text-input', r).val()
          );
          if (!str) return;
          list.push(str);
        });
        buttons[phase] = list;
      });
      return buttons;
    };

    saveEditorState = () => {
      const lt = this.lichessTools;
      if (!this.editorDialog?.isConnected) return;
      const buttons = this.readEditor(lt.$(this.editorDialog));
      if (!buttons.start && !buttons.end) return;
      this.updateButtons(buttons);
    };

    fieldChanged = this.lichessTools.debounce(this.saveEditorState, 250);

    closeEditor = () => {
      const lt = this.lichessTools;
      const $ = lt.$;
      $('dialog.lichessTools-customChatButtons')
        .each((i,e)=>{ if (e.open) e.close('cancel'); })
        .remove();
      this.editorDialog = null;
    };

    resetGroup = (phase, container) => {
      const lt = this.lichessTools;
      const buttons = this.getStoredButtons();
      buttons[phase] = [...this.defaultButtons[phase]];
      this.updateButtons(buttons);
      lt.$('div.button-row', container).remove();
      for (const str of this.defaultButtons[phase]) {
        this.appendRow(container, phase, str);
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      if (!lichess || !lt.uiApi) return;
      const value = lt.currentOptions.getValue('customChatButtons');
      this.logOption('Customize chat buttons', value);
      if (!lt.getUserId()) {
        lt.global.console.debug(' ... Disabled (not logged in)');
        return;
      }
      lt.global.clearInterval(this.discoverChatInterval);
      if (!value) {
        $('dialog.lichessTools-customChatButtons').remove();
        $('section.mchat div.mchat__presets span.lichessTools-editButton').remove();
        return;
      }
      this.discoverChatInterval = lt.global.setInterval(this.discoverChat, 1000);
    }

  }
  LiChessTools.Tools.CustomChatButtons = CustomChatButtonsTool;
})();

