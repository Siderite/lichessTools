(() => {
  class SoundOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'soundOptions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['noMove', 'flickerSound','volumeBar'],
        defaultValue: false,
        advanced: true
      },
      {
        name: 'soundThemes',
        category: 'general',
        type: 'multiple',
        possibleValues: ['mortalKombat'],
        defaultValue: 'mortalKombat',
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
        possibleValues: ['s30','s60','s90','s120','s180','s300','beep','speak5', 'behind'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.general': 'General',
        'options.play': 'Play',
        'options.soundOptions': 'Sound options',
        'options.soundThemes': 'Sound themes',
        'options.soundVolume': 'Sound volume (0-100)',
        'options.soundVoice': 'Speech voice',
        'soundOptions.noMove': 'No move sounds',
        'soundOptions.flickerSound': 'Time flicker sound',
        'soundOptions.volumeBar': 'Main menu volume bar',
        'options.timeAlert': 'Time alert (minutes)',
        'timeAlert.s30': '0:30',
        'timeAlert.s60': '1:00',
        'timeAlert.s90': '1:30',
        'timeAlert.s120': '2:00',
        'timeAlert.s180': '3:00',
        'timeAlert.s300': '5:00',
        'timeAlert.beep': 'Sound alert',
        'timeAlert.speak5': 'Read seconds when less than 6',
        'timeAlert.behind': 'Alert when behind on time',
        'soundThemes.mortalKombat': 'Mortal Kombat'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.play': 'Joc',
        'options.soundOptions': 'Op\u0163iuni sunet',
        'options.soundThemes': 'Teme de sunet',
        'options.soundVolume': 'Volum sonor (0-100)',
        'options.soundVoice': 'Voce folosit\u0103',
        'soundOptions.noMove': 'F\u0103r\u0103 sunet la mutare',
        'soundOptions.flickerSound': 'Sunet la salt de timp',
        'soundOptions.volumeBar': 'Bar\u0103 volum \u00een meniul principal',
        'options.timeAlert': 'Alert\u0103 timp (minute)',
        'timeAlert.s30': '0:30',
        'timeAlert.s60': '1:00',
        'timeAlert.s90': '1:30',
        'timeAlert.s120': '2:00',
        'timeAlert.s180': '3:00',
        'timeAlert.s300': '5:00',
        'timeAlert.beep': 'Alert\u0103 sonor\u0103',
        'timeAlert.speak5': 'Cite\u015fte secundele c\u00e2nd mai pu\u0163ine de 6',
        'timeAlert.behind': 'Alert\u0103 c\u00e2nd \u00een urm\u0103 la timp',
        'soundThemes.mortalKombat': 'Mortal Kombat'
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
      if (this.options.behind) {
        const timeStr = $('.round__app .rclock-top .time').text();
        if (timeStr) {
          const m = /^\s*(?:(?<h>\d+):)?(?<m>\d+):(?<s>\d+(?:\.\d+)?)\s*$/.exec(timeStr);
          if (m) {
            const opponentTime = (+m.groups.h||0)*3600 + (+m.groups.m||0)*60 + (+m.groups.s||0);
            const difference = time - opponentTime;
            if (this.lastDifference >= 0 && difference < 0) {
              this.alertPlayer(difference);
            }
            this.lastDifference = difference;
          }
        }
      }
      if (!(this.lastTime<time)) {
        this.lastTime = time;
      }
    };

    addVolumeBar = ()=>{
      const lt = this.lichessTools;
      const sound = lt.lichess.sound;
      const $ = lt.$;
      const trans = lt.translator;
      const container = $('#dasher_app');
      let volumeBar = container.find('.lichessTools-volumeBar');
      if (!volumeBar.length) {
        const setVolume = lt.debounce((value)=>{
          sound.setVolume(value);
          if (sound.theme=='speech') {
            sound.say('knight F 7');
          } else {
            sound.play('genericNotify');
          }
        },100);
        volumeBar = $('<input type="range" min="0" max="1" step="0.01" orient="vertical" class="lichessTools-volumeBar">')
          .on('input',async ev=>{
            ev.preventDefault();
            setVolume($(ev.target).val());
          })
          .prependTo(container);
      }
      volumeBar.toggleClassSafe('silent',sound.theme=='silent');
    };

    addThemes = ()=>{
      const lt = this.lichessTools;
      const sound = lt.lichess.sound;
      const $ = lt.$;
      const trans = lt.translator;
      const list = $('#dasher_app .sub.sound .content .selector');
      if (!list.length) return;
      list.find('button.lichessTools-extraThemes').remove();
      const template = list.find('button').eq(0).clone().removeClass('active');
      const pref = this.preferences.find(p=>p.name=='soundThemes');
      if (!pref) return;
      const soundThemes = lt.currentOptions.getValue('soundThemes');
      const themes = pref.possibleValues
                         .filter(v=>lt.isOptionSet(soundThemes, v));

      if (!themes.length) return;

      const currentTheme = lt.storage.get('LichessTools.customSoundTheme');
      if (currentTheme) {
        list.find('button.active').removeClass('active');
      }
      for (const theme of themes) {
        template.clone()
          .text(trans.noarg('soundThemes.'+theme))
          .attr('data-name',theme)
          .addClass('lichessTools-extraThemes')
          .toggleClassSafe('active',theme==currentTheme)
          .on('click',()=>{
            sound.changeSet(theme);
            this.loadSound('genericNotify').then(u=>{
              if (u) sound.play('genericNotify');
            });
          })
          .appendTo(list);
      }
      lt.scrollIntoViewIfNeeded(list.find('button.active'));
    };
    

    allSoundNames = [
      'berserk', 'capture', 'check', 'checkmate', 'confirmation', 'countdown0', 'countdown1', 'countdown10', 'countdown2', 'countdown3',
      'countdown4', 'countdown5', 'countdown6', 'countdown7', 'countdown8', 'countdown9', 'defeat', 'draw', 'error', 'explosion',
      'genericnotify', 'lowtime', 'move', 'newchallenge', 'newpm', 'outofbound', 'tournament1st', 'tournament2nd', 'tournament3rd',
      'tournamentother', 'victory' ];
    themeUrls = new Map([
      ['mortalKombat','https://fordcrownvictoria1234-art.github.io/MK1SFX/']
    ]);
    soundUrls = new Map();
    loadSound = async (e) => {
      const lt = this.lichessTools;
      const lichess = lt.lichess;
      if (!this.options.customThemeUrl) return;
      const url = this.options.customThemeUrl+e?.[0]?.toUpperCase()+e?.substr(1)+'.mp3';
      const data = await lt.comm.getDataUrl(url);
      if (data.dataUrl) {
        const dataUrl = data.dataUrl;
        this.soundUrls.set(e,dataUrl);
        return dataUrl;
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
      const soundThemes = lt.currentOptions.getValue('soundThemes');
      let customTheme = lt.storage.get('LichessTools.customSoundTheme');
      if (customTheme) {
        const index = this.preferences.find(p=>p.name=='soundThemes').possibleValues.indexOf(customTheme);
        if (index<0) customTheme = null;
      }
      let soundVolume = +lt.currentOptions.getValue('soundVolume');
      if (Number.isNaN(soundVolume)) soundValume = this.preferences.find(p=>p.name='soundVolume')?.defaultValue;
      lt.soundVolume = soundVolume;
      let soundVoice = +lt.currentOptions.getValue('soundVoice');
      if (Number.isNaN(soundVoice)) soundVaice = this.preferences.find(p=>p.name='soundVoice')?.defaultValue;
      lt.speechVoiceIndex = soundVoice;
      const timeAlert = lt.currentOptions.getValue('timeAlert');
      this.logOption('Sound options', soundOptions);
      this.logOption('Sound themes', soundThemes);
      if (customTheme) {
        this.logOption('Custom sound theme', customTheme);
      }
      this.logOption('Sound volume', soundVolume);
      this.logOption('Sound voice', soundVoice);
      this.logOption('Time alert', timeAlert);
      this.options = {
        noMove: lt.isOptionSet(soundOptions, 'noMove'),
        flickerSound: lt.isOptionSet(soundOptions, 'flickerSound'),
        volumeBar: lt.isOptionSet(soundOptions, 'volumeBar'),
        times: [30,60,90,120,180,300].map(s=>({
          seconds: s,
          enabled: lt.isOptionSet(timeAlert, 's'+s)
        })),
        beep: lt.isOptionSet(timeAlert, 'beep'),
        speak5: lt.isOptionSet(timeAlert, 'speak5'),
        behind: lt.isOptionSet(timeAlert, 'behind') 
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
        .off('.rclock-bottom *,.rclock-top *',this.checkClock);
      if ($('.playing .round__app').length) {
        const hasTimeAlert = this.options.flickerSound || this.options.times.find(t=>t.enabled) || this.options.speak5 || this.options.behind;
        if (hasTimeAlert) {
          $('.round__app')
            .observer()
            .on('.rclock-bottom *,.rclock-top *',this.checkClock);
        }
      }
      lichess.sound.changeSet = lt.unwrapFunction(lichess.sound.changeSet,'soundOptions');
      lichess.sound.resolvePath = lt.unwrapFunction(lichess.sound.resolvePath,'soundOptions');
      this.options.customThemeUrl = null;
      $('#dasher_app')
        .observer()
        .off('.sub.sound',this.addThemes);

      if (soundThemes) {
        lichess.sound.changeSet = lt.wrapFunction(lichess.sound.changeSet,{
          id: 'soundOptions',
          after: ($this,result,e)=>{
            this.soundUrls.clear();
            let customThemeUrl = this.themeUrls.get(e);
            if (customThemeUrl) {
              this.options.customThemeUrl = customThemeUrl;
              if (!customThemeUrl.endsWith('/')) customThemeUrl+='/';
              this.allSoundNames.forEach(e=>this.loadSound(e));
              lt.storage.set('LichessTools.customSoundTheme',e);
            } else {
              lt.storage.remove('LichessTools.customSoundTheme');
              this.options.customThemeUrl = null;
            }
            this.addThemes();
          }
        });
        lichess.sound.resolvePath = lt.wrapFunction(lichess.sound.resolvePath,{
          id: 'soundOptions',
          before: ($this,e)=>{
            if (!this.options.customThemeUrl) return;
            const url = this.soundUrls.get(e);
            if (url) return false;
            this.loadSound(e);
          },
          after: ($this,result,e)=>{
            if (!this.options.customThemeUrl) return;
            const url = this.soundUrls.get(e);
            return url || result;
          }
        });
        $('#dasher_app')
          .observer()
          .on('.sub.sound',this.addThemes);
      }

      $('.lichessTools-volumeBar').remove();
      $('#dasher_app')
        .observer()
        .off('div',this.addVolumeBar);
      $('body').observer()
        .off('body',this.addVolumeBar)
      if (this.options.volumeBar) {
        $('#dasher_app')
          .observer()
          .on('div',this.addVolumeBar);
        $('body').observer()
          .on('body',this.addVolumeBar,{ 
             subtree: false,
             childList: false,
             atttributes: true,
             attributeFiler: ['data-sound-set']
          })
      }

      lichess.sound.changeSet(customTheme || $('body').attr('data-sound-set'));
    }

  }
  LiChessTools.Tools.SoundOptions = SoundOptionsTool;
})();