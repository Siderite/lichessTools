(()=>{
  class CustomChatButtonsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'customChatButtons',
        category: 'play',
        type:'single',
        possibleValues: [false,true],
        defaultValue: false
      }
    ];

    intl={
      'en-US':{
        'options.play': 'Play',
        'options.customChatButtons': 'Customize chat buttons',
        'addButtonTitle':'LiChess Tools - add button',
        'deleteButtonTitle':'LiChess Tools - delete buttons',
        'editButtonTitle':'LiChess Tools - edit buttons',
        'editButtonsPlaceholder':'button/text  (ex: HF/Have fun! )'
      },
      'ro-RO':{
        'options.play': 'Joc',
        'options.customChatButtons': 'Personalizeaz\u0103 butoanele din chat',
        'addButtonTitle':'LiChess Tools - adaug\u0103 buton',
        'deleteButtonTitle':'LiChess Tools - \u015Fterge butoane',
        'editButtonTitle':'LiChess Tools - modific\u0103 butoane',
        'editButtonsPlaceholder':'buton/text  (ex: SL/Salut! )'
      }
    }

    defaultButtons= {
      start: ['hi/Hello', 'gl/Good luck', 'hf/Have fun!', 'u2/You too!'],
      end: ['gg/Good game', 'wp/Well played', 'ty/Thank you', "gtg/I've got to go", 'bye/Bye!'],
    };
    getDefaultButtons=()=>{
      return { start: [...this.defaultButtons.start],end: [...this.defaultButtons.end] };
    };
    getButtons=()=>{
      const parent=this.lichessTools;
      let buttons=parent.currentOptions.getValue('customChatButtons')||this.getDefaultButtons();
      buttons=buttons[this.group];
      if (!buttons) buttons=this.getDefaultButtons()[this.group];
      if (!buttons) {
        console.warn('chat buttons could not be initialized!');
        parent.global.clearTimeout(this.discoverChatInterval);
        return;
      }
      buttons=buttons.map(b=>{
        const split=b.split('/');
        const item={
          short:split[0].trim(),
          long:split[1]?.trim() 
        };
        return item;
      });
      return buttons;
    }

    saveButtons=async buttons=>{
      const parent=this.lichessTools;
      parent.currentOptions.customChatButtons=buttons;
      await parent.saveOptions(parent.currentOptions);
      parent.lichess.storage.fire('lichessTools.reloadOptions');
    };

    jiggle=elem=>{
      const parent=this.lichessTools;
      elem.addClass('lichessTools-jiggle');
      parent.global.setTimeout(()=>elem.removeClass('lichessTools-jiggle'),1000);
    };

    deleteButton=item=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const isAddButton=$(item.elem).is('.lichessTools-addButton');
      if (isAddButton) return;
      const buttons=parent.currentOptions.getValue('customChatButtons')||this.getDefaultButtons();
      const groupButtons=buttons[this.group];
      const existingButtons=$('section.mchat div.mchat__presets span:not([data-role])').get();
      const index=existingButtons.indexOf(item.elem);
      if (index<0) return;
      groupButtons.splice(index,1);
      if (groupButtons.length) {
        this.saveButtons(buttons);
      } else {
        this.saveButtons(this.getDefaultButtons());
      }
      this.discoverChat();
    };

    updateButton=item=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const buttons=parent.currentOptions.getValue('customChatButtons')||this.getDefaultButtons();
      const groupButtons=buttons[this.group];
      const isAddButton=$(item.elem).is('.lichessTools-addButton');
      if (isAddButton) {
        groupButtons.push(item.short+'/'+item.long);
      } else {
        const existingButtons=$('section.mchat div.mchat__presets span:not([data-role])').get();
        const index=existingButtons.indexOf(item.elem);
        if (index<0) return;
        groupButtons[index]=item.short+'/'+item.long;
      }
      this.saveButtons(buttons);
      this.discoverChat();
    };

    addButton=(ev)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const elem=$(ev.currentTarget);
      const chat=$('section.mchat');
      if (!chat.length) return;
      const chatInput=$('input.mchat__say',chat);
      const chatText=chatInput.val();
      const m=/^(\w{2,4})\/(\w.*)$/i.exec(chatText);
      if (!m) {
        this.jiggle(chatInput);
        return;
      }
      const buttons=this.getButtons();
      const item={
        elem:elem[0],
        short:m[1].trim(),
        long:m[2].trim()
      }
      this.updateButton(item);
      chatInput.val('')[0]?.select();
      chatInput.trigger('change');
    };

    clickHandler=(ev)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const elem=$(ev.currentTarget);
      const chat=$('section.mchat');
      if (!chat.length) return;
      const chatInput=$('input.mchat__say',chat);
      const chatText=chatInput.val();
      if (!this.editMode) {
        const text=elem.attr('title');
        parent.lichess.pubsub.emit("socket.send", "talk", text);
        return;
      }
      const buttons=this.getButtons();
      if (this.editMode=='delete') {
        this.deleteButton({
          elem:elem[0],
          short:elem.text()
        });
        return;
      }
      if (this.editMode=='edit') {
        const m=/^(\w{2,4})\/(\w.*)$/i.exec(chatText);
        if (!m) {
          this.jiggle(chatInput);
          return;
        }
        const item={
          elem:elem[0],
          short:m[1].trim(),
          long:m[2].trim()
        }
        this.updateButton(item);
        chatInput.val('')[0]?.select();
        chatInput.trigger('change');
        return;
      }
    };

    setEditMode=(mode)=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      const $=parent.$;
      const chat=$('section.mchat');
      const chatInput=$('input.mchat__say',chat);
      this.editMode=mode;
      chat.toggleClass('lichessTools-editButtons',this.editMode=='edit');
      chat.toggleClass('lichessTools-deleteButtons',this.editMode=='delete');
      if (!this.oldPlaceholder) this.oldPlaceholder=chatInput.attr('placeholder');
      if (this.editMode=='edit') {
        chatInput.attr('placeholder',trans.noarg('editButtonsPlaceholder'));
      } else {
        chatInput.attr('placeholder',this.oldPlaceholder);
      }
    };

    group='start';
    discoverChat=()=>{
      const parent=this.lichessTools;
      const trans=parent.translator;
      const $=parent.$;
      const chat=$('section.mchat');
      if (!chat.length) return;
      const presets=$('div.mchat__presets',chat);
      if (!presets.length) return;
      if (this.group==='start' && $('span:not([data-role]):first-child',presets).text()===this.getDefaultButtons().end[0].split('/')[0]) {
        this.group='end';
      }
      const buttons=this.getButtons();
      const existingButtons=$('span:not([data-role])',presets).get();
      let index=0;
      while (index<existingButtons.length) {
        const elem=$(existingButtons[index]);
        const button=buttons[index];
        if (!button) {
          existingButtons.splice(index,1);
          elem.remove();
        } else {
          index++;
          if (elem.text()!==button.short||elem.attr('title')!==button.long) {
            elem.text(button.short).attr('title',button.long);
          }
          if (!elem[0].isCustomized) {
            elem[0].isCustomized=true;
            parent.removeEventHandlers(elem[0],'click');
            elem.on('click',this.clickHandler);
          }
        }
      }
      let addButton=$('span.lichessTools-addButton',presets);
      if (!addButton.length) {
        addButton=$('<span class="lichessTools-addButton">')
          .attr('title',trans.noarg('addButtonTitle'))
          .attr('data-role','addButton')
          .attr('data-icon','\uE042')
          .on('click',this.addButton)
          .appendTo(presets);
      }
      if (!$('span.lichessTools-deleteButton',presets).length) {
        $('<span class="lichessTools-deleteButton">')
          .attr('title',trans.noarg('deleteButtonTitle'))
          .attr('data-role','deleteButtons')
          .attr('data-icon','\uE03F')
          .on('click',()=>{
            this.setEditMode(this.editMode=='delete'?'edit':'delete');
          })
          .appendTo(presets);
      }
      if (!$('span.lichessTools-editButton',presets).length) {
        $('<span class="lichessTools-editButton">')
          .attr('title',trans.noarg('editButtonTitle'))
          .attr('data-role','editButtons')
          .attr('data-icon','\uE019')
          .on('click',()=>{
            this.setEditMode(this.editMode?false:'edit');
          })
          .appendTo(presets);
      }
      while (index<buttons.length) {
        const button=buttons[index];
        const elem=$('<span>').text(button.short).attr('title',button.long)
                              .on('click',this.clickHandler)
                              .insertBefore(addButton);
        elem[0].isCustomized=true;
        index++;
      }
      const chatInput=$('input.mchat__say',chat);
      if (!chatInput[0].isCustomized) {
        chatInput[0].isCustomized=true;
        chatInput.on('change keyup paste',()=>{
          const chatText=chatInput.val();
          const m=/^(\w{2,4})\/(\w.*)$/i.exec(chatText);
          addButton.toggleClass('lichessTools-disabled',!m||!m[1]);
        })
        chatInput.trigger('change');
      }
      presets.addClass('lichessTools-customized');
    };

    async start() {
      const parent=this.lichessTools;
      const value=parent.currentOptions.getValue('customChatButtons');
      this.logOption('Customize chat buttons', value);
      parent.global.clearInterval(this.discoverChatInterval);
      if (!value) return;
      this.discoverChatInterval=parent.global.setInterval(this.discoverChat,1000);
    }

  }
  LiChessTools.Tools.CustomChatButtons=CustomChatButtonsTool;
})();
