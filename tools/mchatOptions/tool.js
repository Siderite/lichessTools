(()=>{
  class MchatOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'mchatOptions',
        category: 'general',
        type:'multiple',
        possibleValues: ['urlify','unlimited','images'],
        defaultValue: 'urlify,unlimited,images',
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.mchatOptions': 'Team/Study chat options',
        'mchatOptions.urlify': 'Highlight URLs',
        'mchatOptions.unlimited': 'No length limit',
        'mchatOptions.images': 'Image support'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.mchatOptions': 'Op\u0163iuni chat echip\u0103/studiu',
        'mchatOptions.urlify': 'Eviden\u0163iaz\u0103 URLuri',
        'mchatOptions.unlimited': 'F\u0103r\u0103 limit\u0103 lungime',
        'mchatOptions.images': 'Suport imagini'
      }
    }

    urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    processChat=()=>{
      const parent=this.lichessTools;
      const $=parent.$;
      const lichess=parent.lichess;
      const container=$('section.mchat');
      if (!container.length) return;
      const createTextNode=parent.global.document.createTextNode.bind(parent.global.document);
      if (this.options.urlify) {
        $('li>t',container).each((i,e)=>{
          if (!parent.inViewport(e)) return;
          const textNodes = Array.from(e.childNodes).filter(n=>n.nodeType==3);
          for (const textNode of textNodes) {
            const lineText=textNode.textContent;
            const matches=lineText?.matchAll(this.urlRegex).toArray();
            if (!matches.length) continue;
            const newNodes=[];
            let p=0;
            for (const match of matches) {
              const url=match[0];
              if (match.index>p) {
                newNodes.push(createTextNode(lineText.substring(p,match.index)));
              }
              const urlEl=$('<a class="lichessTools-chat-url">')
                .attr('target','_blank')
                .attr('href',url)
                .text(url);
              newNodes.push(urlEl[0]);
              p=match.index+url.length;
            }
            if (p<lineText.length) {
              newNodes.push(createTextNode(lineText.substring(p,lineText.length)));
            }
            for (const newNode of newNodes) {
              e.insertBefore(newNode,textNode);
            }
            e.removeChild(textNode);
          }
        });
      }
      if (this.options.images) {
        $('a.lichessTools-chat-url:not(:has(img))',container).each((i,e)=>{
          const url=new URL($(e).attr('href'));
          if (!/\.(jpeg|jpg|gif|png|apng|tiff)$/.test(url.pathname)) return;
          $('<img>')
            .attr('src',url.toString())
            .appendTo($(e).empty());
        });
      }
      if (this.options.unlimited) {
        const input=$('input.mchat__say',container);
        if (input.attr('maxlength')) {
          input.removeAttr('maxlength');
          const oldHandler=parent.getEventHandlers(input[0],'keydown')[0];
          if (oldHandler) {
            parent.removeEventHandlers(input[0],'keydown');

            const splitLength=(s,l)=>{
              const result=[];
              if (!s) return result;
              let p=0;
              while (p<s.length) {
                result.push(s.substr(p,l));
                p+=l;
              }
              return result;
            };

            input.on('keydown',async (ev)=>{
              if (ev.key!='Enter') return;
              ev.preventDefault();
              const text=input.val();
              const matches=text?.matchAll(this.urlRegex).toArray();
              const newTexts=[];
              let p=0;
              for (const match of matches) {
                const url=match[0];
                if (match.index>p) {
                  newTexts.push(text.substring(p,match.index));
                }
                newTexts.push(url);
                p=match.index+url.length;
              }
              if (p<text.length) {
                newTexts.push(text.substring(p,text.length));
              }
              let sendText='';
              for (const newText of newTexts) {
                if (!sendText || sendText.length+newText.length<=140) {
                  sendText+=newText;
                } else {
                  const splits=splitLength(sendText,140);
                  for (const splitText of splits) {
                    lichess.pubsub.emit('socket.send', 'talk', splitText);
                    await parent.timeout(500);
                  }
                  sendText=newText;
                }
              }
              if (sendText) {
                const splits=splitLength(sendText,140);
                for (const splitText of splits) {
                  lichess.pubsub.emit('socket.send', 'talk', splitText);
                  await parent.timeout(100);
                }
              }
              input.val('');
              lichess.tempStorage.make('chat.input').remove();
            });
          }
        }
      }
    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const value=parent.currentOptions.getValue('mchatOptions');
      this.logOption('Team/Study chat', value);
      this.options={ 
        urlify: parent.isOptionSet(value,'urlify'),
        unlimited: parent.isOptionSet(value,'unlimited'),
        images: parent.isOptionSet(value,'images')
      };
      if (!$('section.mchat').length) return;
      parent.global.clearInterval(this.interval);
      if (!value) return;
      this.interval = parent.global.setInterval(this.processChat,1000);
      this.processChat();
    }

  }
  LiChessTools.Tools.MchatOptions=MchatOptionsTool;
})();
