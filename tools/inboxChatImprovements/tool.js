(()=>{
  class InboxChatImprovementsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'inboxChatImprovements',
        category: 'general',
        type:'multiple',
        possibleValues: ['pasteImages'],
        defaultValue: 'pasteImages'
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.inboxChatImprovements': 'Improved Inbox chat',
        'inboxChatImprovements.pasteImages': 'Paste image support'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.inboxChatImprovements': 'Chat inbox imbun\u0103t\u0103\u0163it',
        'inboxChatImprovements.pasteImages': 'Suport imagini'
      }
    }

    isInboxPage=()=>{
      const parent=this.lichessTools;
      return /\/inbox\/\w+/i.test(parent.global.location.pathname);
    };

    isImage=(file)=>{
      return [
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/png',
        'image/apng',
        'image/tiff'
      ].includes(file?.type);
    };

    chatPaste=async (ev)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const file=ev.clipboardData.files[0];
      if (!this.isImage(file)) return;
      ev.preventDefault();
      const buffer=await file.arrayBuffer();
      const base64=btoa(String.fromCharCode(...new Uint8Array(buffer)));
      parent.global.console.debug('Pasting image...');
      const res=await parent.comm.send({ type: 'pasteBuffer',options:{ buffer: base64 } }).catch(e=>{ parent.global.console.error(e); });
      parent.global.console.debug('... got reply '+JSON.stringify(res));
      if (!res.link) {
        parent.global.console.warn('Could not paste image!',res?.err);
        return;
      }
      $('textarea.msg-app__convo__post__text').val(res.link);
      $('form.msg-app__convo__post').trigger('submit');
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('inboxChatImprovements');
      this.logOption('Inbox chat', value);
      this.options={ 
        pasteImages: parent.isOptionSet(value,'pasteImages')
      };
      if (!this.isInboxPage()) return;
      $('textarea.msg-app__convo__post__text').off('paste',this.chatPaste);
      if (!this.options.pasteImages) return;
      $('textarea.msg-app__convo__post__text').on('paste',this.chatPaste);
    }

  }
  LiChessTools.Tools.InboxChatImprovements=InboxChatImprovementsTool;
})();
