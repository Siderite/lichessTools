(() => {
  class VoiceInputTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'voiceInput',
        category: 'general',
        type: 'multiple',
        possibleValues: ['studyComments'],
        defaultValue: '',
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.voiceInput': 'Voice input',
        'voiceInput.studyComments': 'Study comments',
        'voiceInputTitle': 'Voice input'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.voiceInput': 'Dictare',
        'voiceInput.studyComments': 'Comentarii studiu',
        'voiceInputTitle': 'Dictare'
      }
    }

    getSpeechRecognition = () => {
      const lt = this.lichessTools;

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        return;
      }

      const ua = lt.global.navigator.userAgent;

      const notSupportedBrowsers = [
        /Firefox/i,
        /Brave/i,
        /Vivaldi/i,
        /DuckDuckGo/i
      ];

      if (notSupportedBrowsers.some(rx => rx.test(ua))) {
        return;
      }

      if (lt.global.navigator?.brave) return;

      if (/Safari/i.test(ua) && !/Chrome|Chromium|Edg/i.test(ua)) {
        return;
      }

      return new SpeechRecognition();
    }

    startInput = ()=>{
      this.transcript = null;
      if (!this.recognition) return;
      this._inputStarted = true;
      this.recognition.start();
    };

    endInput = ()=>{
      if (!this._inputStarted) return;
      this._inputStarted = false;
      this.recognition?.stop();
    };

    on = (name, f)=>{
      this.handlers ||= new Map();
      let arr = this.handlers.get(name);
      if (!arr) this.handlers.set(name,(arr=[]));
      if (arr.includes(f)) return;
      arr.push(f);
    };

    off = (name, f)=>{
      if (!name) {
        this.handlers = null;
        return;
      }
      const lt = this.lichessTools;
      let arr = this.handlers?.get(name);
      if (!arr) return;
      if (f) {
        lt.arrayRemoveAll(arr, x=>x===f);
      } else {
        this.handlers.delete(name);
      }
    };

    emit = (ev)=>{
      if (!ev?.name) return;
      let arr = this.handlers?.get(ev.name);
      if (!arr) return;
      for (const handler of arr) {
        handler(ev);
      }
    };

    setupStudyComments = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('.study__comments .form3');
      if (!container.length) return;
      let button = container.find('.lichessTools-voiceInput');
      if (button.length) return;

      this.on('error',()=>{
        button.toggleClassSafe('lichessTools-error',true);
        lt.global.clearTimeout(this.errorTimeout);
        this.errorTimeout = lt.global.setTimeout(()=>{
          button.toggleClassSafe('lichessTools-error',false);
        },2000);
      });

      this.on('input',ev=>{
        const text = ev.text;
        if (text?.length) {
          $('#comment-text').insertText(text);
        }
      });

      button = $('<button class="lichessTools-voiceInput" type="button">')
                 .attr('data-icon',lt.icon.Mic)
                 .attr('title',trans.noarg('voiceInputTitle'))
                 .on('pointerdown',(ev)=>{
                   ev.preventDefault();
                   this.startInput();
                 })
                 .on('pointerup pointercancel',this.endInput)
                 .appendTo(container);
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const value = lt.currentOptions.getValue('voiceInput');
      this.logOption('Voice input', value);
      this.options = {
        studyComments: lt.isOptionSet(value,'studyComments'),
        get isSet() { return this.studyComments; }
      };

      $('.study__comments .form3 .lichessTools-voiceInput').remove();
      $('body').observer()
        .off('.study__comments',this.setupStudyComments);

      if (this.options.isSet) {
        if (!this.recognition) {
          const recognition = this.getSpeechRecognition();
          if (recognition) {
            recognition.lang = "en-US";
            recognition.continuous = true;
            recognition.interimResults = false;

            recognition.onresult = (ev)=>{
              let transcript = "";

              for (let i = ev.resultIndex; i < ev.results.length; i++) {
                transcript += event.results[i][0].transcript;
              }

              this.transcript = transcript;
              this.emit({ name: 'input',text: transcript });
            };

            recognition.onerror = (ev)=>{
              this.emit({ name: 'error',error: ev.error,message: ev.message });
            };
            this.recognition = recognition;
          }
        }
        if (this.recognition && this.options.studyComments) {
          $('body').observer()
            .on('.study__comments',this.setupStudyComments);
          this.setupStudyComments();
        }
      } else {
        this.off();
      }
    }
  }
  LiChessTools.Tools.VoiceInput = VoiceInputTool;
})();
