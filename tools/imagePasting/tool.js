(()=>{
  class ImagePastingTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'imagePasting',
        category: 'general',
        type:'multiple',
        possibleValues: ['pasteImages'],
        defaultValue: 'pasteImages'
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.imagePasting': 'Image pasting in chat/forum',
        'imagePasting.pasteImages': 'Paste image support'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.imagePasting': 'Suport imagini \u00een chat/forum',
        'imagePasting.pasteImages': 'Suport imagini'
      }
    }

    isInboxOrForumPage=()=>{
      const parent=this.lichessTools;
      return /\/(inbox|forum)\/\w+/i.test(parent.global.location.pathname);
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

    getImageUrl=async (ev)=>{
      const parent=this.lichessTools;
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
      return res.link;
    };

    pasteImage=async (ev)=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const url = await this.getImageUrl(ev);
      if (!url) return;
      const el=ev.target;
      const [start, end] = [el.selectionStart, el.selectionEnd];
      el.setRangeText(url, start, end, 'end');
    };

    async start() {
      const parent=this.lichessTools;
      const lichess=parent.lichess;
      const $=parent.$;
      const value=parent.currentOptions.getValue('imagePasting');
      this.logOption('Inbox chat', value);
      this.options={ 
        pasteImages: parent.isOptionSet(value,'pasteImages')
      };
      if (!this.isInboxOrForumPage()) return;
      $('textarea.msg-app__convo__post__text').off('paste',this.pasteImage);
      $('main.forum textarea#form3-text').off('paste',this.pasteImage);
      if (!this.options.pasteImages) return;
      $('textarea.msg-app__convo__post__text').on('paste',this.pasteImage);
      $('main.forum textarea#form3-text').on('paste',this.pasteImage);
    }

  }
  LiChessTools.Tools.ImagePasting=ImagePastingTool;
})();
