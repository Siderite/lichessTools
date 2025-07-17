(() => {
  class SoundOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'soundOptions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['noMove', 'flickerSound'],
        defaultValue: false,
        advanced: true
      },
      {
        name: 'soundVolume',
        category: 'general',
        type: 'number',
        defaultValue: 70
      },
      {
        name: 'soundVoice',
        category: 'general',
        type: 'select',
        possibleValues: [], // loaded in init
        defaultValue: 0
      },
      {
        name: 'timeAlert',
        category: 'play',
        type: 'multiple',
        possibleValues: ['s30','s60','s90','s120','s180','s300','beep','speak5'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.play': 'Play',
        'options.soundOptions': 'Sound options',
        'options.soundVolume': 'Sound volume (0-100)',
        'options.soundVoice': 'Speech voice',
        'soundOptions.noMove': 'No move sounds',
        'soundOptions.flickerSound': 'Time flicker sound',
        'options.timeAlert': 'Time alert (minutes)',
        'timeAlert.s30': '0:30',
        'timeAlert.s60': '1:00',
        'timeAlert.s90': '1:30',
        'timeAlert.s120': '2:00',
        'timeAlert.s180': '3:00',
        'timeAlert.s300': '5:00',
        'timeAlert.beep': 'Sound alert',
        'timeAlert.speak5': 'Read seconds when less than 6'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.play': 'Joc',
        'options.soundOptions': 'Op\u0163iuni sunet',
        'options.soundVolume': 'Volum sonor (0-100)',
        'options.soundVoice': 'Voce folosit\u0103',
        'soundOptions.noMove': 'F\u0103r\u0103 sunet la mutare',
        'soundOptions.flickerSound': 'Sunet la salt de timp',
        'options.timeAlert': 'Alert\u0103 timp (minute)',
        'timeAlert.s30': '0:30',
        'timeAlert.s60': '1:00',
        'timeAlert.s90': '1:30',
        'timeAlert.s120': '2:00',
        'timeAlert.s180': '3:00',
        'timeAlert.s300': '5:00',
        'timeAlert.beep': 'Alert\u0103 sonor\u0103',
        'timeAlert.speak5': 'Cite\u015fte secundele c\u00e2nd mai pu\u0163ine de 6'
      }
    }

    alertPlayer = (seconds) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      const el = $('.playing .round__app');
      if (el.is('.lichessTools-timeAlert')) return;
      el.addClass('lichessTools-timeAlert');
      setTimeout(()=>{
        el.removeClass('lichessTools-timeAlert');
      },1000);
      if (this.options.beep) {
        lt.play('piano/LowTime.mp3');
      }
    };

    makeFlickerSound = (seconds) => {
      const lt = this.lichessTools;
      const $ = lt.$;
      if (this.options.flickerSound) {
        lt.play('other/failure2.mp3');
      }
    };

    checkClock = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const timeStr = $('.round__app .rclock-bottom .time').text();
      if (!timeStr) return;
      const m = /^\s*(?:(?<h>\d+):)?(?<m>\d+):(?<s>\d+(?:\.\d+)?)\s*$/.exec(timeStr);
      if (!m) return;
      const time = (+m.groups.h||0)*3600 + (+m.groups.m||0)*60 + (+m.groups.s||0);
      if (this.options.flickerSound) {
        if (time<this.prevTime-1) {
          this.makeFlickerSound();
        }
      }
      this.prevTime = time;

      for (let i=this.options.times.length - 1; i>=0; i--) {
        const t = this.options.times[i];
        if (!t.enabled) continue;
        if (time>t.seconds) continue;
        if (this.lastTime<=t.seconds) continue;
        if (this.lastTime) {
          this.alertPlayer(t.seconds);
        }
        break;
      }
      if (this.options.speak5 && time<=5) {
        const seconds = Math.floor(time);
        if (this.lastSpeak != seconds) {
          this.lastSpeak = seconds;
          lt.stopSpeaking();
          lt.speak(seconds);
        }
      }
      if (!(this.lastTime<time)) {
        this.lastTime = time;
      }
    };

    async init() {
      const lt = this.lichessTools;
      const ss = lt.global.speechSynthesis;
      const pref = this.preferences.find(p=>p.name=='soundVoice');
      if (ss && pref) {

        const loadVoices = ()=>{
          const voices = ss.getVoices();
          if (voices.length) {
            pref.possibleValues = voices.map((v, i) => [i, v.name]);
          } else {
            lt.global.setTimeout(loadVoices, 100);
          }
        };

        // Always call getVoices once to initialize voices in Firefox
        ss.getVoices();
        // Attach event listener for Chromium
        ss.onvoiceschanged = loadVoices;
        // Fallback for Firefox or early-loaded voices
        loadVoices();
      }
    }

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const soundOptions = lt.currentOptions.getValue('soundOptions');
      let soundVolume = +lt.currentOptions.getValue('soundVolume');
      if (Number.isNaN(soundVolume)) soundValume = this.preferences.find(p=>p.name='soundVolume')?.defaultValue;
      lt.soundVolume = soundVolume;
      let soundVoice = +lt.currentOptions.getValue('soundVoice');
      if (Number.isNaN(soundVoice)) soundVaice = this.preferences.find(p=>p.name='soundVoice')?.defaultValue;
      lt.speechVoiceIndex = soundVoice;
      const timeAlert = lt.currentOptions.getValue('timeAlert');
      this.logOption('Sound options', soundOptions);
      this.logOption('Sound volume', soundVolume);
      this.logOption('Sound voice', soundVoice);
      this.logOption('Time alert', timeAlert);
      this.options = {
        noMove: lt.isOptionSet(soundOptions, 'noMove'),
        flickerSound: lt.isOptionSet(soundOptions, 'flickerSound'),
        times: [30,60,90,120,180,300].map(s=>({
          seconds: s,
          enabled: lt.isOptionSet(timeAlert, 's'+s)
        })),
        beep: lt.isOptionSet(timeAlert, 'beep'),
        speak5: lt.isOptionSet(timeAlert, 'speak5')
      };
      if (lichess.sound?.move) {
        lichess.sound.move = lt.unwrapFunction(lichess.sound.move, 'soundOptions');
        if (this.options.noMove) {
          lichess.sound.move = lt.wrapFunction(lichess.sound.move, {
            id: 'soundOptions',
            before: ($this, ...args) => {
              if (this.options.noMove) return false;
            }
          });
        }
      }
      $('.round__app')
        .observer()
        .off('.rclock-bottom *',this.checkClock);
      if ($('.playing .round__app').length) {
        const hasTimeAlert = this.options.flickerSound || this.options.times.find(t=>t.enabled);
        if (hasTimeAlert) {
          $('.round__app')
            .observer()
            .on('.rclock-bottom *',this.checkClock);
        }
      }
    }

  }
  LiChessTools.Tools.SoundOptions = SoundOptionsTool;
})();
