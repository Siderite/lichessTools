(() => {
  class SoundOptionsTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'soundOptions',
        category: 'general',
        type: 'multiple',
        possibleValues: ['noMove'],
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
        name: 'timeAlert',
        category: 'play',
        type: 'multiple',
        possibleValues: ['s30','s60','s90','s120','s180','s300','beep'],
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
        'soundOptions.noMove': 'No move sounds',
        'options.timeAlert': 'Time alert (minutes)',
        'timeAlert.s30': '0:30',
        'timeAlert.s60': '1:00',
        'timeAlert.s90': '1:30',
        'timeAlert.s120': '2:00',
        'timeAlert.s180': '3:00',
        'timeAlert.s300': '5:00',
        'timeAlert.beep': 'Sound alert'
      },
      'ro-RO': {
        'options.general': 'General',
        'options.play': 'Joc',
        'options.soundOptions': 'Op\u0163iuni sunet',
        'options.soundVolume': 'Volum sonor (0-100)',
        'soundOptions.noMove': 'F\u0103r\u0103 sunet la mutare',
        'options.timeAlert': 'Alert\u0103 timp (minute)',
        'timeAlert.s30': '0:30',
        'timeAlert.s60': '1:00',
        'timeAlert.s90': '1:30',
        'timeAlert.s120': '2:00',
        'timeAlert.s180': '3:00',
        'timeAlert.s300': '5:00',
        'timeAlert.beep': 'Alert\u0103 sonor\u0103'
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

    checkClock = ()=>{
      const lt = this.lichessTools;
      const $ = lt.$;
      const timeStr = $('.round__app .rclock-bottom .time').text();
      if (!timeStr) return;
      const m = /^\s*(?:(?<h>\d+):)?(?<m>\d+):(?<s>\d+(?:\.\d+)?)\s*$/.exec(timeStr);
      if (!m) return;
      const time = (+m.groups.h||0)*3600 + (+m.groups.m||0)*60 + (+m.groups.s||0);
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
      if (!(this.lastTime<time)) {
        this.lastTime = time;
      }
    };

    async start() {
      const lt = this.lichessTools;
      const $ = lt.$;
      const lichess = lt.lichess;
      const soundOptions = lt.currentOptions.getValue('soundOptions');
      let soundVolume = +lt.currentOptions.getValue('soundVolume');
      if (Number.isNaN(soundVolume)) soundValume = this.preferences.find(p=>p.name='soundVolume')?.defaultValue;
      lt.soundVolume = soundVolume;
      const timeAlert = lt.currentOptions.getValue('timeAlert');
      this.logOption('Sound options', soundOptions);
      this.logOption('Sound volumne', soundVolume);
      this.logOption('Time alert', timeAlert);
      if (!$('.playing .round__app').length) return; 
      this.options = {
        noMove: lt.isOptionSet(soundOptions, 'noMove'),
        times: [30,60,90,120,180,300].map(s=>({
          seconds: s,
          enabled: lt.isOptionSet(timeAlert, 's'+s)
        })),
        beep: lt.isOptionSet(timeAlert, 'beep')
      };
      if (lichess.sound?.move) lichess.sound.move = lt.unwrapFunction(lichess.sound.move, 'soundOptions');
      if (this.options.noMove) {
        if (lichess.sound?.move) lichess.sound.move = lt.wrapFunction(lichess.sound.move, {
          id: 'soundOptions',
          before: ($this, ...args) => {
            if (this.options.noMove) return false;
          }
        });
      }
      const hasTimeAlert = this.options.times.find(t=>t.enabled);
      $('.round__app')
        .removeObserver('soundOptions')
      if (hasTimeAlert) {
        $('.round__app')
          .observer('soundOptions')
          .on('.rclock-bottom *',this.checkClock);
      }
    }

  }
  LiChessTools.Tools.SoundOptions = SoundOptionsTool;
})();
