(function (hook) {
  class Canvas {

    constructor(id, width, height) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = id;
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext('2d');
    }

    appendTo(parent) {
      parent.appendChild(this.canvas);
    }

    opacity(value) {
      if (value === undefined) return this.canvas.style.opacity;
      this.canvas.style.opacity = value;
    }

    top(value) {
      if (value === undefined) return parseFloat(this.canvas.style.top);
      this.canvas.style.top = value + 'px';
    }

    pointerEvents(value) {
      if (value === undefined) return this.canvas.style.pointerEvents !== 'none';
      this.canvas.style.pointerEvents = value ? undefined : 'none';
    }
  }

  class InputManager {
    KEY_LATENCY = 6;
    KEY_DONE = -1;

    /** Map of key codes -> logical key names */
    keyMap = {
      37: 'left', // left arrow
      65: 'left', // a
      81: 'left', // q
      38: 'up', // up arrow
      90: 'up', // z
      87: 'up', // w
      83: 'down', // s
      40: 'down', // down arrow
      39: 'right', // right arrow
      68: 'right', // d
      32: 'space', // space
      27: 'esc',
      13: 'enter',
      77: 'mute', // m
      78: 'n', // n
    };

    /** Tracks whether a key is currently held down */
    keyBoolMap = {};

    /** Tracks press state: >0 = down, 0 = released */
    keys = {};

    /** Mouse / touch state */
    mouse = { click: false, x: 0, y: 0 };

    handlers = [];

    processInput() {
      let dx = 0;
      let dy = 0;
      if (!this.keysBlockedUntilAllUp) {
        //read keys that were just released or that were pressed just a few frames ago
        //this leaves some time for a combination (ie: up+right)
        if (this.keys.down === this.KEY_LATENCY || this.keys.down === 0) {
          dy = -1;
        }
        if (this.keys.up === this.KEY_LATENCY || this.keys.up === 0) {
          dy = 1;
        }
        if (this.keys.left === this.KEY_LATENCY || this.keys.left === 0) {
          dx = -1;
        }
        if (this.keys.right === this.KEY_LATENCY || this.keys.right === 0) {
          dx = 1;
        }
        if (dx || dy) {
          //look for a combo: another key that was pressed during the latency
          if (!dx) {
            if (this.keys.left <= this.KEY_LATENCY && this.keys.left > 0) {
              dx = -1;
            }
            if (this.keys.right <= this.KEY_LATENCY && this.keys.right > 0) {
              dx = 1;
            }
          } else {
            if (this.keys.up <= this.KEY_LATENCY && this.keys.up > 0) {
              dy = 1;
            }
            if (this.keys.down <= this.KEY_LATENCY && this.keys.down > 0) {
              dy = -1;
            }
          }
          this.emit({type:'move',dx,dy});
          this.keysBlockedUntilAllUp = true;
        }
      }
      let keyName;
      if (this.keysBlockedUntilAllUp) {
        let allUp = true;
        for (keyName in this.keyBoolMap) {
          if (this.keyBoolMap[keyName]) {
            allUp = false;
            break;
          }
        }
        this.keysBlockedUntilAllUp = !allUp;
      }

      //update key pressed counters
      for (keyName in this.keys) {
        if (this.keys[keyName] >= 1) {
          this.keys[keyName]++;
        } else if (this.keys[keyName] > this.KEY_DONE) {
          this.keys[keyName]--;
        }
      }

      this.emit({type:'mouse',...this.mouse});
    }

    /** Core key handler - called from keydown/keyup */
    onkey(isDown, e) {
      const c = e.keyCode || e.charCode;
      const keyName = this.keyMap[c];
      if (!keyName) return;

      e.preventDefault();

      // Only react to state changes
      if (this.keyBoolMap[keyName] !== isDown) {
        this.keyBoolMap[keyName] = isDown;
        if (!this.keys[keyName]) this.keys[keyName] = -1;

        if (isDown) {
          if (this.keys[keyName] < 1) this.keys[keyName] = 1;
        } else {
          if (this.keys[keyName] > 0) this.keys[keyName] = 0;
        }
      }
      this.emit({type:'key',isDown});
    }

    /** Pointer down/up/cancel ? click handling */
    onmouse(isClick, e) {
      e.preventDefault();
      this.mouse.click = isClick;
      this.onmousemove(e);
      if (!isClick) {
        this.root?.releasePointerCapture?.(e.pointerId);
      }
    }

    /** Update mouse position (scaled to game coordinates) */
    onmousemove(e) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }

    /** Attach all input listeners - call from load() */
    setup(root) {
      this.root = root;

      // ---- Keyboard ----
      root.addEventListener('keydown', (e) => this.onkey(true, e));
      root.addEventListener('keyup', (e) => this.onkey(false, e));

      // ---- Pointer (mouse / touch) ----
      root.addEventListener('pointerdown', (e) => this.onmouse(true, e));
      root.addEventListener('pointerup', (e) => this.onmouse(false, e));
      root.addEventListener('pointercancel', (e) => this.onmouse(false, e));
      root.addEventListener('pointermove', (e) => this.onmousemove(e));
    }

    emit(event) {
      for (const handler of this.handlers) handler(event);
    }

    onEmit(handler) {
      this.handlers.push(handler);
    }
  }

  class SoundParams {
    constructor(settings) {
      for (let i = 0; i < 24; i++) {
        this[String.fromCharCode(97 + i)] = settings[i] || 0;
      }
      if (this.c < 0.01) this.c = 0.01;
      const totalDuration = this.b + this.c + this.e;
      if (totalDuration < 0.18) {
        const scaleFactor = 0.18 / totalDuration;
        this.b *= scaleFactor;
        this.c *= scaleFactor;
        this.e *= scaleFactor;
      }
    }
  }

  class SoundGenerator {
    constructor() {
      this.params = new SoundParams([]);
    }

    reset() {
      const params = this.params;
      this.period = 100 / (params.f * params.f + 0.001);
      this.maxPeriod = 100 / (params.g * params.g + 0.001);
      this.slide = 1 - params.h * params.h * params.h * 0.01;
      this.deltaSlide = -params.i * params.i * params.i * 0.000001;
      if (!params.a) {
        this.fpos = 0.5 - params.n / 2;
        this.fdpos = 5e-5 * -params.o;
      }
      this.periodSpeed = 1 + params.l * params.l * (params.l > 0 ? -0.9 : 10);
      this.periodTime = 0;
      this.arp =
        params.m === 1 ? 0 : (1 - params.m) * (1 - params.m) * 20000 + 32;
    }

    getApproxLength() {
      const params = this.params;
      this.attackLen = params.b * params.b * 100000;
      this.sustainLen = params.c * params.c * 100000;
      this.decayLen = params.e * params.e * 100000 + 12;
      return 3 * (((this.attackLen + this.sustainLen + this.decayLen) / 3) | 0);
    }

    fillBuffer(buffer, length) {
      this.reset();
      const params = this.params;
      const hasFilter = 1 !== params.s || params.v;
      let filterDamp = params.v * params.v * 0.1;
      const filterWidth = 1 + 3e-4 * params.w;
      let filterResD = params.s * params.s * params.s * 0.1;
      const filterHpWidth = 1 + 1e-4 * params.t;
      const hasHpFilter = 1 !== params.s;
      const masterVol = params.x * params.x;
      const freqSlide = params.g;
      const hasPhaser = params.q || params.r;
      const phaseSweep = params.r * params.r * params.r * 0.2;
      let phaserPos = params.q * params.q * (params.q < 0 ? -1020 : 1020);
      const repeatLimit = params.p
        ? (((1 - params.p) * (1 - params.p) * 20000) | 0) + 32
        : 0;
      const punch = params.d;
      const vibSpeed = params.j / 2;
      const vibAmp = params.k * params.k * 0.01;
      const waveShape = params.a;
      let envLen = this.attackLen;
      const invAttack = 1 / this.attackLen;
      const invSustain = 1 / this.sustainLen;
      const invDecay = 1 / this.decayLen;
      let filterAr = (5 / (1 + params.u * params.u * 20)) * (0.01 + filterResD);
      if (filterAr > 0.8) filterAr = 0.8;
      filterAr = 1 - filterAr;
      let done = false;
      let sampleCount = 0;
      let envStage = 0;
      let envVol = 0;
      let fpp = 0;
      let filterDiff = 0;
      let vibPhase = 0;
      let p = 0;
      let pp = 0;
      let noiseShifter = 0;
      let ipp = 0;
      let ssample = 0;
      let prevSample = 0;
      const phaserBuf = new Array(1024).fill(0);
      const noiseBuf = new Array(32);
      for (let i = 0; i < 32; i++) {
        noiseBuf[i] = Math.random() * 2 - 1;
      }
      for (let i = 0; i < length; i++) {
        if (done) return i;
        if (repeatLimit && ++noiseShifter >= repeatLimit) {
          noiseShifter = 0;
          this.reset();
        }
        if (this.arp && ++this.periodTime >= this.arp) {
          this.arp = 0;
          this.period *= this.periodSpeed;
        }
        this.slide += this.deltaSlide;
        this.period *= this.slide;
        if (this.period > this.maxPeriod) {
          this.period = this.maxPeriod;
          if (freqSlide > 0) done = true;
        }
        p = this.period;
        if (vibAmp > 0) {
          vibPhase += vibSpeed;
          p *= 1 + Math.sin(vibPhase) * vibAmp;
        }
        p |= 0;
        if (p < 8) p = 8;
        if (!waveShape) {
          this.fpos += this.fdpos;
          if (this.fpos < 0) this.fpos = 0;
          if (this.fpos > 0.5) this.fpos = 0.5;
        }
        if (++sampleCount > envLen) {
          sampleCount = 0;
          ++envStage;
          switch (envStage) {
            case 1:
              envLen = this.sustainLen;
              break;
            case 2:
              envLen = this.decayLen;
              break;
          }
        }
        switch (envStage) {
          case 0:
            envVol = sampleCount * invAttack;
            break;
          case 1:
            envVol = 1 + (1 - sampleCount * invSustain) * 2 * punch;
            break;
          case 2:
            envVol = 1 - sampleCount * invDecay;
            break;
          case 3:
            envVol = 0;
            done = true;
        }
        if (hasPhaser) {
          phaserPos += phaseSweep;
          ipp = phaserPos | 0;
          if (ipp < 0) ipp = -ipp;
          if (ipp > 1023) ipp = 1023;
        }
        if (filterDamp) {
          filterDamp *= filterWidth;
          if (filterDamp < 1e-5) filterDamp = 1e-5;
          if (filterDamp > 0.1) filterDamp = 0.1;
        }
        let totalSample = 0;
        for (let j = 0; j < 8; j++) {
          pp++;
          if (pp >= p) {
            pp %= p;
            if (waveShape === 3) {
              for (let k = 0; k < 32; k++) {
                noiseBuf[k] = Math.random() * 2 - 1;
              }
            }
          }
          switch (waveShape) {
            case 0:
              ssample = pp / p < this.fpos ? 0.5 : -0.5;
              break;
            case 1:
              ssample = 1 - (pp / p) * 2;
              break;
            case 2:
              let cp = pp / p;
              cp = cp > 0.5 ? cp - 1 : cp;
              cp *= 6.28318531;
              ssample =
                1.27323954 * cp + 0.405284735 * cp * cp * (cp < 0 ? 1 : -1);
              ssample =
                0.225 * ((cp < 0 ? -1 : 1) * ssample * ssample - ssample) +
                ssample;
              break;
            case 3:
              ssample = noiseBuf[Math.abs(((32 * pp) / p) | 0)];
              break;
          }
          if (hasFilter) {
            fpp = prevSample;
            filterResD *= filterHpWidth;
            if (filterResD < 0) filterResD = 0;
            if (filterResD > 0.1) filterResD = 0.1;
            if (hasHpFilter) {
              filterDiff += (ssample - prevSample) * filterResD;
              filterDiff *= filterAr;
            } else {
              prevSample = ssample;
              filterDiff = 0;
            }
            prevSample += filterDiff;
            fpp += prevSample - fpp;
            ssample = fpp * (1 - filterDamp);
          }
          if (hasPhaser) {
            phaserBuf[noiseShifter % 1024] = ssample;
            ssample += phaserBuf[(noiseShifter - ipp + 1024) % 1024];
            noiseShifter++;
          }
          totalSample += ssample;
        }
        totalSample = 0.125 * totalSample * envVol * masterVol;
        buffer[i] =
          totalSample >= 1
            ? 32767
            : totalSample <= -1
            ? -32768
            : (totalSample * 32767) | 0;
      }
      return length;
    }
  }

  class ArcadeAudio {
    constructor() {
      this.isMute = false;
      this.sounds = {};
      this.generator = new SoundGenerator();
    }

    generateSoundUrl(settings) {
      this.generator.params = new SoundParams(settings);
      let approxLen = this.generator.getApproxLength();
      const wavData = new Uint8Array(4 * (((approxLen + 1) / 2) | 0) + 44);
      const sampleBuf = new Uint16Array(wavData.buffer, 44);
      const dataLen = 2 * this.generator.fillBuffer(sampleBuf, approxLen);
      const header = new Uint32Array(wavData.buffer, 0, 11);
      header[0] = 1179011410; // 'RIFF'
      header[1] = dataLen + 36;
      header[2] = 1163280727; // 'WAVE'
      header[3] = 544501094; // 'fmt '
      header[4] = 16;
      header[5] = 65537; // format (1) and channels (1)
      header[6] = 44100;
      header[7] = 88200;
      header[8] = 1048578; // block align (2) and bits (16)
      header[9] = 1635017060; // 'data'
      header[10] = dataLen;
      const blob = new Blob([wavData], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    }

    add(key, count, settings) {
      this.sounds[key] = [];
      settings.forEach((params, index) => {
        this.sounds[key].push({
          tick: 0,
          count: count,
          pool: [],
        });
        for (let i = 0; i < count; i++) {
          const audio = new Audio(this.generateSoundUrl(params));
          this.sounds[key][index].pool.push(audio);
        }
      });
    }

    toggleMute(value) {
      this.isMute = value === undefined ? !this.isMute : !!value;
    }

    play(key) {
      if (this.isMute) return;
      const sound = this.sounds[key];
      const soundData =
        sound.length > 1
          ? sound[Math.floor(Math.random() * sound.length)]
          : sound[0];
      soundData.pool[soundData.tick].play();
      soundData.tick = (soundData.tick + 1) % soundData.count;
    }

    downloadWav(key) {
      const sound = this.sounds[key];
      let i = 0;
      for (const soundData of sound) {
        i++;
        const url = soundData.pool[soundData.tick].src;
        const a = document.createElement('a');
        a.href = url;
        a.download = key+'_'+i+'.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  }

  class Projection {
    constructor() {
      // Projection constants
      this.A_Y = 3 / 16;
      this.B_Y = -14 / 16;
      this.C_Y = 1;
      this.A_S = -2.5 / 16;
      this.B_S = 0 / 16;
      this.C_S = 1;
    }

    /**
     * Project logical [0,2] -> canvas [0,1] with perspective
     * @param {number} x - [0,1] logical x
     * @param {number} y - [0,2] logical y
     * @param {boolean} intro - whether intro perspective is active
     * @param {number} perspectiveProgress - 0 to 1
     * @returns {{x: number, y: number, scaleX: number, scaleY: number}}
     */
    project(x, y, intro = false, perspectiveProgress = 0) {
      const res = {};

      res.y = this.quadraticEq(y, this.A_Y, this.B_Y, this.C_Y);
      res.scaleX = this.quadraticEq(y, this.A_S, this.B_S, this.C_S);
      res.scaleY = res.scaleX;
      res.x = (1 - res.scaleX) / 2 + x * res.scaleX;

      if (intro) {
        res.x = perspectiveProgress * res.x + (1 - perspectiveProgress) * x;
        res.y =
          perspectiveProgress * res.y + (1 - perspectiveProgress) * (1 - y);
        res.scaleX =
          perspectiveProgress * res.scaleX + (1 - perspectiveProgress) * 1;
        res.scaleY = res.scaleX;
      }

      return res;
    }

    /**
     * Reverse project canvas [0,1] -> logical [0,2]
     * @param {number} x - canvas x
     * @param {number} y - canvas y
     * @returns {{x: number, y: number}}
     */
    reverseProject(x, y) {
      const res = {};

      res.y = this.reverseQuadraticEq(y, this.A_Y, this.B_Y, this.C_Y, false);
      const scale = this.quadraticEq(res.y, this.A_S, this.B_S, this.C_S);
      res.x = (x - (1 - scale) / 2) / scale;

      return res;
    }

    /**
     * ax^2 + bx + c
     */
    quadraticEq(x, a, b, c) {
      return a * x * x + b * x + c;
    }

    /**
     * Solve ax^2 + bx + c = y for x
     */
    reverseQuadraticEq(y, a, b, c, positiveRoot = true) {
      const discriminant = b * b - 4 * a * (c - y);
      const sqrt = Math.sqrt(discriminant);
      return positiveRoot ? (-b + sqrt) / (2 * a) : (-b - sqrt) / (2 * a);
    }
  }

  // Game data is loaded from ChessPursuit.dat (see ChessPursuit.md for the format).

  // A board row is exactly 8 squares; each square is a piece letter, '.' or ' '.
  const BOARD_ROW_PATTERN = /^[. prnbkqlwcPRNBKQLWC]{8}$/;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const XLINK_NS = 'http://www.w3.org/1999/xlink';

  // Piece ids (used in SVG defs and the checkBoard) - PGN piece names:
  // White (enemy, checks the hero) is uppercase; Black (hero's side, blocks) is lowercase.
  const PIECE = {
    KING_W: 'K', QUEEN_W: 'Q', ROOK_W: 'R', BISHOP_W: 'B', KNIGHT_W: 'N', PAWN_W: 'P',
    KING_B: 'k', QUEEN_B: 'q', ROOK_B: 'r', BISHOP_B: 'b', KNIGHT_B: 'n', PAWN_B: 'p',
    LAND_MINE_W: 'L', LAND_MINE_B: 'l', WAR_BEAR_W: 'W', WAR_BEAR_B: 'w',
    CASTLE_W: 'C', CASTLE_B: 'c',
  };

  // Other SVG ids.
  const SVG_IDS = {
    ENEMY_FILTER: 'ef',
    CHECK_TEXT: 'ct',
  };

  // SAN piece letter -> internal piece id (used to resolve speech actors).
  const SAN_TO_PIECE = {
    K: PIECE.KING_W, k: PIECE.KING_B,
    Q: PIECE.QUEEN_W, q: PIECE.QUEEN_B,
    R: PIECE.ROOK_W, r: PIECE.ROOK_B,
    B: PIECE.BISHOP_W, b: PIECE.BISHOP_B,
    N: PIECE.KNIGHT_W, n: PIECE.KNIGHT_B,
    P: PIECE.PAWN_W, p: PIECE.PAWN_B,
    W: PIECE.WAR_BEAR_W, w: PIECE.WAR_BEAR_B,
    C: PIECE.CASTLE_W, c: PIECE.CASTLE_B,
    L: PIECE.LAND_MINE_W, l: PIECE.LAND_MINE_B,
  };

  // Speaker labels shown in the dialog box (e.g. "White King :").
  const SPEAKER_NAMES = {
    K: 'King', Q: 'Queen', R: 'Rook', B: 'Bishop', N: 'Knight',
    P: 'Pawn', W: 'War Bear', C: 'Castle', L: 'Land Mine',
  };

  // Injected into the game so the whole look can be restyled (and overridden by
  // the tool's own stylesheet) via classes and the --cp-* custom properties.
  // Canvas colours are read back in readPalette(); the PALETTE fallbacks below
  // mirror these defaults.
  const STYLE = `
.lichessTools-chessPursuit-game {
  --cp-bg-color: #193441;
  --cp-cell-color-1: #D1DBBD;
  --cp-cell-color-2: #3E606F;
  --cp-rollover-color: #779944;
  --cp-rollover-too-far-color: #889988;
  --cp-invalid-rgb: 255,0,0;
  --cp-checkpoint-color: #5DFFB68F;
  --cp-sky-color: #FF8601;
  --cp-sun-color: #FFE7CA;
  --cp-mountain-rgb: 10,20,25;
  --cp-piece-white-fill: #EEEEEE;
  --cp-piece-white-stroke: #000000;
  --cp-piece-black-fill: #000022;
  --cp-piece-black-stroke: #555555;
}

.lichessTools-chessPursuit-game .lichessTools-chessPursuit-piece--white { fill: var(--cp-piece-white-fill); stroke: var(--cp-piece-white-stroke); stroke-width: 0; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-piece--black { fill: var(--cp-piece-black-fill); stroke: var(--cp-piece-black-stroke); stroke-width: 0; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-piece--pawn { stroke-width: 0.2; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-counter { font-size: 24px; fill: #55FF77; stroke: #000000; stroke-width: 1px; font-family: Impact; }

.lichessTools-chessPursuit-game .lichessTools-chessPursuit-screen-overlay { fill: #00000080; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-screen--intro .lichessTools-chessPursuit-screen-overlay { fill: var(--cp-sky-color); stroke: #000000; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-screen-title { font-size: 48px; font-family: Impact; stroke: #000000; stroke-width: 2px; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-screen--gameover .lichessTools-chessPursuit-screen-title { fill: #FFA500; stroke: #FF0000; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-screen--win .lichessTools-chessPursuit-screen-title { fill: #55FF77; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-screen--intro .lichessTools-chessPursuit-screen-title { fill: #FFA500; stroke: #FF0000; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-screen-hint { font-size: 22px; fill: #FFFFFF; stroke: #000000; stroke-width: 1px; font-family: Impact; }

.lichessTools-chessPursuit-game .lichessTools-chessPursuit-press-space { font-size: 22px; fill: #FFFFFF; stroke: #000000; stroke-width: 1px; font-family: Impact; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-pause { font-size: 32px; fill: #FFA500; stroke: #000000; stroke-width: 1px; font-family: Impact; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-check { font-size: 28px; fill: #FF0000; stroke: #000000; stroke-width: 1px; font-family: Impact; }

.lichessTools-chessPursuit-game .lichessTools-chessPursuit-dialog-bg { fill: #000000CC; stroke: #FFFFFF; stroke-width: 2px; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-dialog-speaker { font-size: 18px; fill: #FFFFFF; font-family: Impact; }
.lichessTools-chessPursuit-game .lichessTools-chessPursuit-dialog-text { font-size: 16px; fill: #FFFFFF; font-family: sans-serif; }
`;

  // Canvas colours read from the CSS palette above: [custom property, field, fallback].
  const PALETTE = [
    ['--cp-bg-color', 'BG_COLOR', '#193441'],
    ['--cp-cell-color-1', 'CELL_COLOR_1', '#D1DBBD'],
    ['--cp-cell-color-2', 'CELL_COLOR_2', '#3E606F'],
    ['--cp-rollover-color', 'ROLLOVER_COLOR', '#779944'],
    ['--cp-rollover-too-far-color', 'ROLLOVER_COLOR_TOO_FAR', '#889988'],
    ['--cp-invalid-rgb', 'INVALID_CELL_COLOR_RGB', '255,0,0'],
    ['--cp-checkpoint-color', 'CHECK_POINT_COLOR', '#5DFFB68F'],
    ['--cp-sky-color', 'SKY_COLOR', '#FF8601'],
    ['--cp-sun-color', 'SUN_COLOR', '#FFE7CA'],
    ['--cp-mountain-rgb', 'MOUNTAIN_RGB', '10,20,25'],
  ];

  class ChessPursuitGame {
    constructor() {
      this.projection = new Projection();
      this.Piece = PIECE;
      this.SVG = SVG_IDS;

      //------------------------------------------------------------------------------------------------------------------
      // sizes and DOM
      //------------------------------------------------------------------------------------------------------------------

      const SCALE = 1;
      this.HORIZON_Y = 100 * SCALE;
      this.SIZE = 400 * SCALE;
      this.NUM_CELLS = 8;
      this.CELL_SIZE = this.SIZE / this.NUM_CELLS;
      this.NUM_CELLS_DISPLAYED = this.NUM_CELLS * 2 + 3;
      this.DIALOG_MARGIN = 6;
      this.CHECK_POINT_HEIGHT = 5;
      // @block: the block is "in view" when its first row (rank 1) is this many
      // rows above the death line (progress). "5th from the bottom" = 4.
      this.BLOCK_VIEW_OFFSET = 4;

      this.MS_TO_S = 1 / 1000;
      this.THRESHOLD_DOWN = -0.02;
      this.THRESHOLD_UP = 0.02;

      this.svgCache = {};
    }

    /** Inject the stylesheet that restyles the game (see STYLE above). */
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = STYLE;
      this.root.appendChild(style);
    }

    /** Read the --cp-* palette from CSS so canvas drawing is overridable too. */
    readPalette() {
      const computed = window.getComputedStyle ? window.getComputedStyle(this.root) : null;
      for (const [cssVar, field, fallback] of PALETTE) {
        const value = computed ? computed.getPropertyValue(cssVar).trim() : '';
        this[field] = value || fallback;
      }
    }

    load(gameContainer, levelData) {
      this.root = gameContainer;
      this.root.classList.add('lichessTools-chessPursuit-game');
      this.injectStyles();
      this.readPalette();

      //------------------------------------------------------------------------------------------------------------------
      // game logic
      //------------------------------------------------------------------------------------------------------------------

      this.lastTime = null;
      this.killCount = 0;
      this.moveCount = 0;
      this.deathCount = 0;
      this.checkCount = 0;
      this.winScreen = null;
      this.gameOverScreen = null;
      this.gameIsOver = false;
      this.won = false;
      this.autoMove = false;
      this.progress = 0; // expressed as a number of rows
      this.progressPerSec = 1;
      this.checkBoard = null;
      this.checkPoints = null;
      this.checkpointKillCounts = [];
      this.checkpointMoveCounts = [];
      this.topRowDisplayed = -1;
      this.running = true;
      this.isDocumentActive = true;
      this.removedPieces = [];
      this.lastRowIndex = null;
      this.player = null;
      this.playerAnimDuration = 0.05;
      this.pieceMoveDuration = 0.3;
      this.playerInvalidDuration = 0.5;
      this.pressSpaceText = null;
      this.pauseText = null;
      this.introScreen = null;
      this.intro = true;
      this.introStartTime = null;
      this.perspectiveProgress = 0;
      this.viewAnim = null;
      this.dialogBox = null;
      this.dialogSpeakerText = null;
      this.dialogText = null;
      this.checkText = null;
      this.captureCounterText = null;
      this.moveCounterText = null;
      this.deathCounterText = null;
      // data-driven script state
      this.title = null;
      this.activeScript = [];
      this.playedScripts = new Set();
      this.blocks = [];
      this.genericWin = [];
      this.genericLoss = [];
      this.activeScriptBlockIndex = -1;
      this.activeBeat = -1;
      this.scriptBusy = false;
      this.scrollingStopped = true;
      this.blockWait = null;
      this.pendingGameOver = null;
      this.pendingGameOverText = null;
      this.boardRendered = false;

      this.loadAudio();
      this.parseGameData(levelData);
      this.createCanvases();

      //------------------------------------------------------------------------------------------------------------------
      // initialization
      //------------------------------------------------------------------------------------------------------------------
      this.input = new InputManager();
      this.input.setup(this.root);
      this.input.onEmit(this.handleInput.bind(this));

      this.setupVisibilityChange();

      this.initCheckBoard(0);
      this.playBlockScript(0);
      this.tic();
    }

    setupVisibilityChange() {
      // ---- Visibility change (pause when tab is hidden) ----
      document.addEventListener('visibilitychange', () => {
        const isActive = !document.hidden;
        if (isActive && !this.isDocumentActive) {
          this.lastTime = Date.now();
          this.tic();
        }
        this.isDocumentActive = isActive;
      });
    }

    handleInput(ev) {
      switch (ev.type) {
        case 'move':
          if (!this.gameIsOver && !this.scriptBusy && this.topRowDisplayed > 0 && !this.player.invalid) {
            this.movePlayer(this.player.row + ev.dy, this.player.col + ev.dx);
          }
          break;
        case 'mouse':
          if (this.input.mouse.click) {
            if (this.gameIsOver) {
              this.setGameIsOver(false);
            } else if (this.scriptBusy) {
              this.dismissScript();
            }
          }
          if (!this.gameIsOver && !this.scriptBusy && this.topRowDisplayed > 0 && !this.player.invalid) {
            const rect = this.root.getBoundingClientRect();
            const scaleX = this.SIZE / rect.width;
            const scaleY = (1.25 * this.SIZE) / rect.height;

            const mx = (ev.x - rect.left) * scaleX;
            const my = (ev.y - rect.top) * scaleY;
            if (
              !this.player.anim &&
              mx > 0 &&
              mx < this.SIZE &&
              my > this.HORIZON_Y &&
              my < this.SIZE + this.HORIZON_Y
            ) {
              const mouseX = mx / this.SIZE;
              const mouseY = (my - this.HORIZON_Y) / this.SIZE;
              const revPos = this.projection.reverseProject(mouseX, mouseY);
              this.mouseCol = Math.floor(revPos.x * this.NUM_CELLS);
              this.mouseRow = Math.floor(revPos.y * this.NUM_CELLS + this.progress);
              let dx = this.mouseCol - this.player.col;
              let dy = this.mouseRow - this.player.row;
              this.mouseRow = this.player.row + dy;
              this.mouseCol = this.player.col + dx;
              if (ev.click && (dx || dy)) {
                dx = Math.max(-1, Math.min(1, dx));
                dy = Math.max(-1, Math.min(1, dy));
                this.mouseRow = this.player.row + dy;
                this.mouseCol = this.player.col + dx;

                this.movePlayer(this.mouseRow, this.mouseCol);
              }
            } else {
              this.mouseCol = -1;
              this.mouseRow = -1;
            }
          }
          this.input.mouse.click = false;
          break;
        case 'key':
          if (this.input.keys.space === 0) {
            this.input.keys.space = -1;
            if (this.gameIsOver) {
              this.setGameIsOver(false);
            } else if (this.scriptBusy) {
              this.dismissScript();
            }
          }
          // Mute toggle on 'm' (only on key-up)
          if (!ev.isDown && this.input.keyBoolMap.mute) {
            this.audio.toggleMute();
          }

          // Special: Enter toggles pause (only when not in intro/game-over)
          if (!this.scriptBusy && this.input.keyBoolMap.enter && !this.gameIsOver) {
            this.running = !this.running;
            this.pauseText.style.display = this.running ? 'none' : 'block';
            if (this.running) {
              this.lastTime = Date.now();
              this.tic();
            }
          }

          // N: jump to the next block (checkpoint)
          if (this.input.keys.n === 0 && !this.scriptBusy && !this.gameIsOver) {
            this.input.keys.n = -1;
            this.jumpToNextBlock();
          }

          break;
      }
    }

    loadAudio() {
      // http://sfxr.me/
      this.audio = new ArcadeAudio();
      this.audio.add('check', 1, [[2,, 0.1747,, 0.1291, 0.6731, 0.2, -0.2999,,,,,, 0.4368, 0.1862,, 0.28,, 1,,, 0.1596,, 0.5]]);
      this.audio.add('move', 5, [[3,, 0.0316,, 0.1483, 0.5871,, -0.6609,,,,,,,,,,, 1,,, 0.0227,, 0.25]]);
      this.audio.add('capture', 5, [[0,, 0.3065,, 0.2516, 0.36,, 0.1584,,,,,, 0.1149,,,,, 1,,, 0.2188,, 0.25]]);
      this.audio.add('checkmate', 1, [[1,, 0.2402,, 0.3917, 0.2242,, 0.1535,,,,,,,, 0.5609,,, 1,,,,, 0.5]]);
      this.audio.add('win', 1, [[3, -0.895, 0.437, 0.012, 1.019, 1.207, 0, -0.861, 0.083, -0.005, -0.687, -0.541, 0.477, 0.876, -0.24, 0.709, -0.071, 0.414, 0.9, -0.135, 0.514, 0.148, -0.388, 0.25]]);
    }

    createCanvases() {
      this.initCheckBoardCanvas();
      this.initSkyCanvas();
      this.initSvg();
      this.initShadowCanvas();
    }

    initCheckBoardCanvas() {
      this.bgCanvas = new Canvas('bg', this.SIZE, this.SIZE + this.HORIZON_Y);
      this.bgCanvas.appendTo(this.root);
    }

    initSkyCanvas() {
      this.skyCanvas = new Canvas('sky', this.SIZE, 0.2 * this.SIZE + this.HORIZON_Y);
      const shadowSize = this.SIZE * 0.02;
      const ctx = this.skyCanvas.ctx;
      ctx.clearRect(0, 0, this.SIZE, this.SIZE);
      ctx.save();
      //Draw sky
      ctx.fillStyle = this.SKY_COLOR;
      ctx.beginPath();
      ctx.rect(0, 0, this.SIZE, this.HORIZON_Y);
      ctx.fill();
      ctx.clip();
      //Draw sun
      ctx.fillStyle = this.SUN_COLOR;
      const sunRadius = this.SIZE / 4;
      ctx.beginPath();
      ctx.arc(
        this.SIZE / 2,
        this.HORIZON_Y + 0.3 * sunRadius,
        sunRadius,
        0,
        Math.PI,
        true
      );
      ctx.fill();
      ctx.restore();
      //Draw Mountains
      ctx.beginPath();
      ctx.fillStyle = 'rgb(' + this.MOUNTAIN_RGB + ')';
      const mountainMaxHeight = 40;
      const points = [
        0, 0.7, 0.1, 0.3, 0.2, 1, 0.3, 0.5, 0.35, 0.8, 0.42, 0.5, 0.55, 0.9,
        0.7, 0.45, 0.8, 1.1, 0.88, 0.4, 1, 0.8,
      ];
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i] * this.SIZE;
        const y = this.HORIZON_Y - mountainMaxHeight * points[i + 1];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.lineTo(this.SIZE, this.HORIZON_Y);
      ctx.lineTo(0, this.HORIZON_Y);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.translate(0, this.HORIZON_Y);
      const grd = ctx.createLinearGradient(0, 0, 0, shadowSize);
      grd.addColorStop(0, 'rgba(' + this.MOUNTAIN_RGB + ',1)');
      grd.addColorStop(1, 'rgba(' + this.MOUNTAIN_RGB + ',0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, this.SIZE, shadowSize);
      ctx.restore();
      this.skyCanvas.appendTo(this.root);
    }

    initSvg() {
      const boxWidth = this.SIZE;
      const boxHeight = this.SIZE + this.HORIZON_Y;
      this.svgElem = document.createElementNS(SVG_NS, 'svg');
      this.svgElem.setAttribute('xmlns', SVG_NS);
      this.svgElem.setAttributeNS(
        null,
        'viewBox',
        '0 0 ' + boxWidth + ' ' + boxHeight
      );
      this.svgElem.setAttributeNS(null, 'width', boxWidth);
      this.svgElem.setAttributeNS(null, 'height', boxHeight);
      this.root.appendChild(this.svgElem);
      this.defs = document.createElementNS(SVG_NS, 'defs');
      this.svgElem.appendChild(this.defs);

      //make pieces layer
      this.svgPiecesLayer = document.createElementNS(SVG_NS, 'g');
      this.svgElem.appendChild(this.svgPiecesLayer);
      this.makeIntroScreen();
      this.makeFilter(this.SVG.ENEMY_FILTER);
      this.makeCheckTextDef(this.SVG.CHECK_TEXT, 'CHECK');
      this.makeGameOverScreen();
      this.makeDialogBox();
      this.makePressSpaceText();
      this.makePauseText();
      this.makeWinScreen();

      // Piece shapes are authored as SVG markup in a 10x10 grid (origin [5,8]).
      // makeDef scales/translates them so a <use> can position each piece on the board.
      this.definePiece(
        this.Piece.PAWN_W,
        `
            <path d="M 2 8 Q 5 10 8 8 L 5 3 L 2 8"/>
            <circle cx="5" cy="3" r="2"/>
          `
      );
      this.definePiece(
        this.Piece.KING_W,
        `
            <path d="M 4.6 1.4 L 5.4 1.4 L 5.4 -0.6 L 6.4 -0.6 L 6.4 -1.4 L 5.4 -1.4 L 5.4 -2.4 L 4.6 -2.4 L 4.6 -1.4 L 3.6 -1.4 L 3.6 -0.6 L 4.6 -0.6 L 4.6 1.4"/>
            <path d="M 2 8 Q 5 10 8 8 L 6 3 L 7 1 Q 5 0 3 1 L 4 3 L 2 8"/>
          `
      );
      this.definePiece(
        this.Piece.KNIGHT_W,
        `
            <path d="M 2 8 Q 5 10 8 8 L 7 6 Q 8 3 7 0 L 6 1 L 5 1 L 2 4 L 3 5 L 5 4 L 2 8"/>
          `
      );
      this.definePiece(
        this.Piece.ROOK_W,
        `
            <path d="M 2 8 Q 5 10 8 8 L 6.5 3 L 8 2 L 8 0 L 7 0 L 7 1 L 6 1 L 6 0 L 4 0 L 4 1 L 3 1 L 3 0 L 2 0 L 2 2 L 3.5 3 L 2 8"/>
          `
      );
      this.definePiece(
        this.Piece.BISHOP_W,
        `
            <path d="M 2 8 Q 5 10 8 8 L 6 4 Q 8 1.1 5 0 Q 2 1.1 4 4 L 2 8"/>
            <circle cx="5" cy="0" r="0.7"/>
            <path d="M 3.8 0.8 L 4.4 2.5" stroke-width="2" vector-effect="non-scaling-stroke"/>
          `
      );
      this.definePiece(
        this.Piece.QUEEN_W,
        `
            <circle cx="5" cy="0.4" r="0.6"/>
            <path d="M 2 8 Q 5 10 8 8 L 6 3 L 7.5 1 L 5.8 1.5 L 5 0.8 L 4.2 1.5 L 2.5 1 L 4 3 L 2 8"/>
          `
      );
      this.definePiece(
        this.Piece.WAR_BEAR_W,
        `
            <path d="M 2 8 Q 5 10 8 8 L 8.5 6 L 7 7 L 7 5 L 6 6 L 5 4.5 L 4 6 L 3 5 L 3 7 L 1.5 6 L 2 8"/>
          `
      );
      this.definePiece(
        this.Piece.WAR_BEAR_B,
        `
            <path d="M 2 8 Q 5 10 8 8 L 8.5 6 L 7 7 L 7 5 L 6 6 L 5 4.5 L 4 6 L 3 5 L 3 7 L 1.5 6 L 2 8"/>
          `
      );

      const makePike = (x, y) => {
        return `<path d="M ${x} ${y} L ${x + 1} ${y} L ${x + 0.5} ${y - 3} L ${x} ${y}"/>`;
      };

      const minePikes = [
        makePike(2, 9.5),
        makePike(5, 9),
        makePike(8, 10),
        makePike(7, 8),
        makePike(4, 7.5),
        makePike(1, 8.5),
      ].join('\n');

      this.definePiece(this.Piece.LAND_MINE_W, minePikes, { skipShadow: true });
      this.definePiece(this.Piece.LAND_MINE_B, minePikes, { skipShadow: true });
      // HERO_KING
      this.definePiece(
        this.Piece.KING_B,
        `
            <path d="M 4.6 1.4 L 5.4 1.4 L 5.4 -0.6 L 6.4 -0.6 L 6.4 -1.4 L 5.4 -1.4 L 5.4 -2.4 L 4.6 -2.4 L 4.6 -1.4 L 3.6 -1.4 L 3.6 -0.6 L 4.6 -0.6 L 4.6 1.4"/>
            <path d="M 2 8 Q 5 10 8 8 L 6 3 L 7 1 Q 5 0 3 1 L 4 3 L 2 8"/>
          `
      );
      this.definePiece(
        this.Piece.QUEEN_B,
        `
            <circle cx="5" cy="0.4" r="0.6"/>
            <path d="M 2 8 Q 5 10 8 8 L 6 3 L 7.5 1 L 5.8 1.5 L 5 0.8 L 4.2 1.5 L 2.5 1 L 4 3 L 2 8"/>
          `
      );

      this.definePiece(
        this.Piece.PAWN_B,
        `
            <path d="M 2 8 Q 5 10 8 8 L 5 3 L 2 8"/>
            <circle cx="5" cy="3" r="2"/>
          `
      );
      this.definePiece(
        this.Piece.KNIGHT_B,
        `
            <path d="M 2 8 Q 5 10 8 8 L 7 6 Q 8 3 7 0 L 6 1 L 5 1 L 2 4 L 3 5 L 5 4 L 2 8"/>
          `
      );
      this.definePiece(
        this.Piece.BISHOP_B,
        `
            <path d="M 2 8 Q 5 10 8 8 L 6 4 Q 8 1.1 5 0 Q 2 1.1 4 4 L 2 8"/>
            <circle cx="5" cy="0" r="0.7"/>
            <path d="M 3.8 0.8 L 4.4 2.5" stroke-width="2" vector-effect="non-scaling-stroke"/>
          `
      );
      this.definePiece(
        this.Piece.ROOK_B,
        `
            <path d="M 2 8 Q 5 10 8 8 L 6.5 3 L 8 2 L 8 0 L 7 0 L 7 1 L 6 1 L 6 0 L 4 0 L 4 1 L 3 1 L 3 0 L 2 0 L 2 2 L 3.5 3 L 2 8"/>
          `
      );
      const castleMarkup = `
            <path d="M 25 30 L 50 30 L 50 5 L 45 5 L 45 10 L 40 10 L 40 5 L 35 5 L 35 10 L 30 10 L 30 5 L 25 5 L 25 30"/>
            <path d="M 0 50 L 0 50 L 27.5 50 L 27.5 35 L 47.5 35 L 47.5 50 L 75 50 L 75 20 L 70 20 L 70 25 L 65 25 L 65 20 L 60 20 L 60 25 L 55 25 L 55 20 L 50 20 L 50 25 L 45 25 L 45 20 L 40 20 L 40 25 L 35 25 L 35 20 L 30 20 L 30 25 L 25 25 L 25 20 L 20 20 L 20 25 L 15 25 L 15 20 L 10 20 L 10 25 L 5 25 L 5 20 L 0 20 L 0 50"/>
          `;

      this.definePiece(this.Piece.CASTLE_W, castleMarkup, { skipShadow: true, ox: 2.5, oy: 50 });
      this.definePiece(this.Piece.CASTLE_B, castleMarkup, { skipShadow: true, ox: 2.5, oy: 50 });
      this.makeCounter('captureCounterText', '10');
      this.makeCounter('moveCounterText', this.SIZE - 10, 'end');
      this.makeCounter('deathCounterText', '50%', 'middle');
    }

    /** Create one of the three on-screen stat counters. */
    makeCounter(field, x, textAnchor) {
      const el = document.createElementNS(SVG_NS, 'text');
      el.setAttribute('class', 'lichessTools-chessPursuit-counter');
      const attrs = { x, y: '30' };
      if (textAnchor) attrs['text-anchor'] = textAnchor;
      this[field] = el;
      this.svgAttrs(el, attrs);
      this.svgElem.appendChild(el);
    }

    initShadowCanvas() {
      this.shadowCanvas = new Canvas('shadow', this.SIZE, this.SIZE);

      const ctx = this.shadowCanvas.ctx;
      //Top down shadow
      const grd = ctx.createLinearGradient(0, 0, 0, this.SIZE);
      grd.addColorStop(0, 'rgba(' + this.MOUNTAIN_RGB + ',0)');
      grd.addColorStop(0.2, 'rgba(' + this.MOUNTAIN_RGB + ',0)');
      grd.addColorStop(1, 'rgba(' + this.MOUNTAIN_RGB + ',0.5)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, this.SIZE, this.SIZE);
      ctx.restore();
      this.shadowCanvas.top(this.HORIZON_Y);
      this.shadowCanvas.pointerEvents(false);
      this.shadowCanvas.appendTo(this.root);
    }

    parseGameData(levelData) {
      const data = levelData || '';
      this.title = null;
      this.activeScript = [];
      this.blocks = [];
      this.genericWin = [];
      this.genericLoss = [];

      let currentBeat = null;
      let currentGeneric = null;
      let currentBlockGeneric = null;
      let block = null;
      let pendingScript = [];

      const newBlock = () => ({
        checkpoint: false,
        showThreat: null,
        win: [],
        loss: [],
        winText: [],
        lossText: [],
        script: pendingScript,
        state: 1,
        rows: [],
      });

      for (const rawLine of data.split('\n')) {
        const line = rawLine.trim();
        if (line.startsWith('@')) {
          currentBeat = null;
          currentGeneric = null;
          currentBlockGeneric = null;
          const { head, trigger, state } = this.parseDirective(line);

          if (head === 'title') {
            currentBeat = { kind: 'title', lines: [] };
            pendingScript.push(currentBeat);
          } else if (head === 'screen') {
            currentBeat = { kind: 'screen', trigger: trigger || null, state: state, lines: [] };
            pendingScript.push(currentBeat);
          } else if (head === 'block' && !trigger) {
            // @block[/N]: hold the king (and pause the script) until the block scrolls into view.
            currentBeat = { kind: 'block', offset: state };
            pendingScript.push(currentBeat);
          } else if (
            ['2d', 'iso', 'stop', 'start', 'hide', 'show'].includes(head) &&
            !trigger &&
            state === null
          ) {
            // View/scroll actions are script beats so they play in order with @block and text.
            currentBeat = { kind: 'action', action: head };
            pendingScript.push(currentBeat);
          } else if (head === 'win' || head === 'loss') {
            if (trigger) {
              if (!block || block.checkpoint) {
                block = newBlock();
                this.blocks.push(block);
                pendingScript = [];
              }
              if (head === 'win') {
                block.win.push(trigger);
                currentBlockGeneric = 'win';
              } else {
                block.loss.push(trigger);
                currentBlockGeneric = 'loss';
              }
            } else {
              currentGeneric = head;
            }
          } else if (head === 'checkpoint') {
            this.blocks.push({ checkpoint: true, showThreat: null, win: [], loss: [], script: [], state: 1, rows: [] });
            block = null;
            pendingScript = [];
          } else if (head.startsWith('showThreat')) {
            if (!block || block.checkpoint) {
              block = newBlock();
              this.blocks.push(block);
              pendingScript = [];
            }
            block.showThreat = head.slice('showThreat'.length).trim();
          } else {
            currentBeat = { kind: 'text', actor: head, trigger: trigger || null, state: state, lines: [] };
            pendingScript.push(currentBeat);
          }
        } else if (!line) {
          currentBeat = null;
          currentGeneric = null;
          currentBlockGeneric = null;
          block = null;
        } else if (line.startsWith('//')) {
          currentBeat = null;
          currentGeneric = null;
          currentBlockGeneric = null;
        } else {
          if (this.isBoardRow(line)) {
            currentBeat = null;
            currentGeneric = null;
            currentBlockGeneric = null;
            if (!block || block.checkpoint) {
              block = newBlock();
              this.blocks.push(block);
              pendingScript = [];
            }
            block.rows.push(line.split('/').map((s) => s.trim()));
          } else if (currentGeneric === 'win') {
            this.genericWin.push(line);
          } else if (currentGeneric === 'loss') {
            this.genericLoss.push(line);
          } else if (currentBlockGeneric === 'win' && block) {
            block.winText.push(line);
          } else if (currentBlockGeneric === 'loss' && block) {
            block.lossText.push(line);
          } else if (currentBeat && (currentBeat.kind === 'text' || currentBeat.kind === 'screen' || currentBeat.kind === 'title')) {
            currentBeat.lines.push(line);
          }
        }
      }

      for (const b of this.blocks) {
        const titleBeat = (b.script || []).find((beat) => beat.kind === 'title');
        if (titleBeat) {
          this.title = titleBeat.lines.join('');
          break;
        }
      }
    }

    /** Split an "@..." directive into its head, trigger and optional state. */
    parseDirective(line) {
      const parts = line.slice(1).split('/');
      const head = parts[0];
      const rest = parts.slice(1);
      let state = null;
      if (rest.length && /^\d+$/.test(rest[rest.length - 1])) {
        state = parseInt(rest.pop(), 10);
      }
      const trigger = rest.length ? rest.join('/') : null;
      return { head, trigger, state };
    }

    /** True when a trimmed line is one or more "/"-separated board rows. */
    isBoardRow(line) {
      return line.split('/').every((segment) => BOARD_ROW_PATTERN.test(segment));
    }

    initCheckBoard(startCheckPointIndex) {
      if (this.checkBoard) {
        this.destroyCheckBoard();
      }
      this.checkBoard = [];
      this.checkPoints = [0];
      let currentRowIndex = 0;

      // Local helper functions
      const checkPoint = () => {
        const center = Math.ceil(this.CHECK_POINT_HEIGHT / 2);
        this.checkPoints.push(currentRowIndex + center);
        for (let i = 0; i < this.CHECK_POINT_HEIGHT; i++) {
          this.checkBoard[currentRowIndex] = [];
          if (i === center) {
            for (let j = 0; j < this.NUM_CELLS; j++) {
              this.checkBoard[currentRowIndex][j] = { checkPoint: true };
            }
          }
          currentRowIndex++;
        }
      };

      const buildBlock = (b) => {
        let showThreatCell = null;
        const doAdd = startCheckPointIndex < this.checkPoints.length;
        const startRowIndex = currentRowIndex;
        b.startRow = startRowIndex;

        for (let i = b.rows.length - 1; i >= 0; i--) {
          const variants = b.rows[i];
          const idx = Math.min(b.state || 1, variants.length) - 1;
          const row = variants[idx] || '';
          if (row.length > this.NUM_CELLS) throw new Error('Row too long');
          this.checkBoard[currentRowIndex] = [];

          if (doAdd && row !== '') {
            for (let j = 0; j < row.length; j++) {
              const char = row.charAt(j);
              if (char !== ' ' && char !== '.') {
                const pieceCell = this.addPieceAt(char, currentRowIndex, j);
                if (b.showThreat === char && !showThreatCell) {
                  showThreatCell = pieceCell;
                }
              }
            }
          }
          currentRowIndex++;
        }

        if (showThreatCell) {
          showThreatCell.piece.showThreat = true;
          for (let i = startRowIndex; i < currentRowIndex; i++) {
            const rowData = this.checkBoard[i];
            for (let j = 0; j < this.NUM_CELLS; j++) {
              const cell = this.getThreateningCell(i, j);
              if (cell && cell.piece === showThreatCell.piece) {
                if (!this.checkBoard[i][j]) this.checkBoard[i][j] = {};
                this.checkBoard[i][j].showThreat = true;
              }
            }
          }
        }
      };

      for (const b of this.blocks) {
        if (b.checkpoint) checkPoint();
        buildBlock(b);
      }

      this.lastRowIndex = currentRowIndex;

      // Place player
      if (startCheckPointIndex === 0) {
        this.player = this.addPieceAt(this.Piece.KING_B, 5, 4).piece;
        this.progress = 2; // Hide starting pawn row
      } else {
        this.progress = this.checkPoints[startCheckPointIndex];
        this.player = this.addPieceAt(
          this.Piece.KING_B,
          this.progress,
          3
        ).piece;
        this.progress -= 4;
      }
    }

    destroyCheckBoard() {
      for (const row in this.checkBoard) {
        if (this.checkBoard[row]) {
          for (const col in this.checkBoard[row]) {
            const cell = this.checkBoard[row][col];
            if (cell && cell.piece) {
              this.removeSvgShape(cell.piece);
            }
          }
        }
      }
    }

    // ===== Script engine =====

    updateScript() {
      const now = Date.now();
      if (!this.boardRendered) {
        this.boardRendered = true;
        this.skipIntroTweens();
        this.update();
      }
      this.updateView(now);
      this.updateIntroTweens();
      this.lastTime = now;
    }

    playBlockScript(blockIndex) {
      const block = blockIndex >= 0 ? this.blocks[blockIndex] : null;
      const script = block ? block.script || [] : [];
      this.activeScript = script;
      this.activeScriptBlockIndex = blockIndex;
      if (blockIndex < 0 || this.playedScripts.has(blockIndex)) return;
      this.playedScripts.add(blockIndex);
      for (const b of script) b.fired = false;
      this.activeBeat = -1;
      const first = script.findIndex((b) => !b.trigger || b.trigger === 'start');
      if (first === 0) {
        this.activeBeat = first;
        this.playBeat(script[first]);
      }
    }

    fireTrigger(trigger) {
      if (!trigger) return;
      const script = this.activeScript || [];
      for (let i = 0; i < script.length; i++) {
        if (script[i].trigger === trigger) {
          this.activeBeat = i;
          this.playBeat(script[i]);
          return;
        }
      }
    }

    playBeat(beat) {
      if (beat.kind === 'title') {
        this.scriptBusy = true;
        // Title screen stays until the player dismisses it (SPACE/CLICK).
      } else if (beat.kind === 'block') {
        const block = this.activeScriptBlockIndex >= 0 ? this.blocks[this.activeScriptBlockIndex] : null;
        const offset = beat.offset != null ? beat.offset : this.BLOCK_VIEW_OFFSET;
        if (block && this.progress < block.startRow - offset) {
          this.blockWait = { blockIndex: this.activeScriptBlockIndex, startRow: block.startRow, offset };
        } else {
          this.advanceBeat();
        }
      } else if (beat.kind === 'action') {
        this.runAction(beat.action);
        this.advanceBeat();
      } else if (beat.kind === 'text' || beat.kind === 'screen') {
        this.showDialog(beat.kind === 'text' ? beat.actor : null, beat.lines);
        this.scriptBusy = true;
      }
    }

    advanceBeat() {
      const script = this.activeScript || [];
      const next = script[this.activeBeat + 1];
      if (next && (!next.trigger || next.trigger === 'start')) {
        this.activeBeat++;
        this.playBeat(next);
      } else {
        this.activeBeat = -1;
        this.scriptBusy = false;
        this.hideDialog();
        this.clearTalking();
        if (this.introScreen) this.introScreen.style.display = 'none';
        if (this.pressSpaceText) this.pressSpaceText.style.display = 'none';
      }
    }

    dismissScript() {
      const script = this.activeScript || [];
      const beat = this.activeBeat >= 0 ? script[this.activeBeat] : null;
      if (this.scriptBusy && beat) {
        if (beat.kind === 'title') {
          if (this.introScreen) this.introScreen.style.display = 'none';
          if (this.pressSpaceText) this.pressSpaceText.style.display = 'none';
        } else if (beat.kind === 'text' || beat.kind === 'screen') {
          this.hideDialog();
          this.clearTalking();
        }
        if (beat.state !== null) {
          this.setBlockState(this.activeScriptBlockIndex, beat.state);
        }
        this.advanceBeat();
      }
    }

    currentBlockIndex() {
      return this.blocks.findIndex(
        (b) =>
          this.player.row >= b.startRow &&
          this.player.row < b.startRow + b.rows.length
      );
    }

    runAction(action) {
      if (action === '2d') {
        this.setView(true);
      } else if (action === 'iso') {
        this.setView(false);
      } else if (action === 'stop') {
        this.scrollingStopped = true;
      } else if (action === 'start') {
        this.scrollingStopped = false;
      } else if (action === 'hide') {
        this.player.hidden = true;
      } else if (action === 'show') {
        this.player.hidden = false;
      }
    }

    setView(flat) {
      // '2d' -> flat (perspective 0); 'iso' -> tilted (perspective 1).
      const to = flat ? 0 : 1;
      if (!flat && !this.intro && this.perspectiveProgress >= 1) return;
      this.intro = true;
      this.viewAnim = {
        start: Date.now(),
        duration: 4000,
        from: this.perspectiveProgress,
        to,
      };
    }

    updateView(now) {
      if (!this.viewAnim) return;
      const anim = this.viewAnim;
      let p = (now - anim.start) / anim.duration;
      if (p >= 1) {
        p = 1;
        this.viewAnim = null;
        this.perspectiveProgress = anim.to;
        if (anim.to >= 1) this.intro = false;
      } else {
        p = Math.sin((p * Math.PI) / 2);
        this.perspectiveProgress = anim.from + (anim.to - anim.from) * p;
      }
      this.shadowCanvas.opacity(this.perspectiveProgress);
      this.skyCanvas.opacity(this.perspectiveProgress);
    }

    setBlockState(blockIndex, state) {
      const b = blockIndex >= 0 ? this.blocks[blockIndex] : null;
      if (!b || b.checkpoint) return;
      const oldState = b.state || 1;
      if (oldState === state) return;
      b.state = state;

      // Collect every changed cell: pieces leaving a square (removals) and
      // pieces arriving on a square (additions).
      const removals = [];
      const additions = [];
      for (let i = 0; i < b.rows.length; i++) {
        const variants = b.rows[i];
        if (variants.length <= 1) continue;
        const oldRow = variants[Math.min(oldState, variants.length) - 1] || '';
        const newRow = variants[Math.min(state, variants.length) - 1] || '';
        if (oldRow === newRow) continue;
        const boardRow = b.startRow + (b.rows.length - 1 - i);
        const rowArray = this.checkBoard[boardRow];
        for (let j = 0; j < this.NUM_CELLS; j++) {
          const oldChar = oldRow.charAt(j);
          const newChar = newRow.charAt(j);
          if (oldChar === newChar) continue;
          if (
            oldChar !== '.' &&
            oldChar !== ' ' &&
            rowArray &&
            rowArray[j] &&
            rowArray[j].piece
          ) {
            removals.push({ char: oldChar, row: boardRow, col: j, piece: rowArray[j].piece });
            rowArray[j] = {};
          }
          if (newChar !== '.' && newChar !== ' ') {
            additions.push({ char: newChar, row: boardRow, col: j });
          }
        }
      }

      // Pair removals with additions of the same piece letter: those pieces
      // "moved" and should slide onto their new square (capturing whatever was
      // there). Greedy closest-first matching by letter keeps nearby pairs
      // together when several pieces share a letter.
      const usedRemovals = new Set();
      const usedAdditions = new Set();
      const moves = [];
      for (let a = 0; a < additions.length; a++) {
        if (usedAdditions.has(a)) continue;
        const add = additions[a];
        let best = -1;
        let bestDist = Infinity;
        for (let r = 0; r < removals.length; r++) {
          if (usedRemovals.has(r)) continue;
          const rem = removals[r];
          if (rem.char !== add.char) continue;
          const dist = Math.abs(rem.row - add.row) + Math.abs(rem.col - add.col);
          if (dist < bestDist) {
            bestDist = dist;
            best = r;
          }
        }
        if (best >= 0) {
          usedAdditions.add(a);
          usedRemovals.add(best);
          moves.push({
            piece: removals[best].piece,
            fromRow: removals[best].row,
            fromCol: removals[best].col,
            toRow: add.row,
            toCol: add.col,
          });
        }
      }

      // Slide moved pieces to their new squares.
      for (const move of moves) {
        this.movePieceTo(move.piece, move.fromRow, move.fromCol, move.toRow, move.toCol);
      }

      // Removed pieces with no matching addition were captured or vanished.
      for (let r = 0; r < removals.length; r++) {
        if (!usedRemovals.has(r)) this.destroyPiece(removals[r].piece);
      }

      // Additions with no matching removal are brand-new pieces fading in.
      for (let a = 0; a < additions.length; a++) {
        if (usedAdditions.has(a)) continue;
        const add = additions[a];
        const pieceCell = this.addPieceAt(add.char, add.row, add.col);
        pieceCell.piece.appearing = true;
        pieceCell.piece.appearTime = Date.now();
        if (
          this.topRowDisplayed >= 0 &&
          add.row >= this.topRowDisplayed - this.NUM_CELLS_DISPLAYED - 5 &&
          add.row <= this.topRowDisplayed
        ) {
          this.addSvgShape(pieceCell.piece);
        }
      }
    }

    /** Move a piece to a new square, animating the slide (used for state changes). */
    movePieceTo(piece, fromRow, fromCol, toRow, toCol) {
      if (!this.checkBoard[toRow]) this.checkBoard[toRow] = [];
      if (!this.checkBoard[toRow][toCol]) this.checkBoard[toRow][toCol] = {};
      this.checkBoard[toRow][toCol].piece = piece;
      piece.row = toRow;
      piece.col = toCol;
      piece.fromRow = fromRow;
      piece.fromCol = fromCol;
      piece.moving = true;
      piece.moveStartTime = Date.now();
      if (
        !piece.shape &&
        this.topRowDisplayed >= 0 &&
        toRow >= this.topRowDisplayed - this.NUM_CELLS_DISPLAYED - 5 &&
        toRow <= this.topRowDisplayed
      ) {
        this.addSvgShape(piece);
      }
    }

    clearTalking() {
      for (const row of this.checkBoard) {
        if (!row) continue;
        for (const cell of row) {
          if (cell && cell.piece) cell.piece.talking = false;
        }
      }
    }

    addIntroTween(element, props, delay, duration) {
      this.introTweens = this.introTweens || [];
      this.introTweens.push({
        e: element,
        to: props,
        de: delay || 0,
        du: duration,
      });
    }

    addIntroCallback(callback, duration) {
      this.introTweens = this.introTweens || [];
      this.introTweens.push({
        cb: callback,
        de: 0,
        du: duration,
      });
    }

    skipIntroTweens() {
      if (this.introTweens) {
        for (let i = 0; i < this.introTweens.length; i++) {
          const t = this.introTweens[i];
          if (t.e) {
            for (const key in t.to) {
              t.e[key] = t.to[key];
            }
          }
        }
      }
      this.introTweens = [];
    }

    updateIntroTweens() {
      if (!this.introTweens) {
        if (this.dialogBox) this.dialogBox.setAttributeNS(null, 'y', this.dialogBox._y);
        return;
      }
      if (!this.introStartTime) this.introStartTime = Date.now();
      const time = (Date.now() - this.introStartTime) * this.MS_TO_S;
      let key;
      for (let i = 0; i < this.introTweens.length; i++) {
        const tween = this.introTweens[i];
        if (time <= tween.de) {
          // Not started
        } else if (time >= tween.de + tween.du) {
          // Done
          if (tween.cb) {
            tween.cb();
            tween.cb = null;
          }
        } else {
          if (tween.e) {
            if (!tween.from) {
              tween.from = {};
              for (key in tween.to) {
                tween.from[key] = tween.e[key];
              }
            }
            let p = (time - tween.de) / tween.du;
            p = Math.sin((p * Math.PI) / 2);
            for (key in tween.to) {
              tween.e[key] = tween.from[key] * (1 - p) + tween.to[key] * p;
            }
          }
        }
      }
      this.dialogBox.setAttributeNS(null, 'y', this.dialogBox._y);
    }

    addPieceAt(type, row, col) {
      const piece = {
        shape: null,
        type: type,
        row: row,
        col: col,
        showThreat: false,
        hidden: false,
      };
      if (!this.checkBoard[row]) {
        this.checkBoard[row] = [];
      }
      if (!this.checkBoard[row][col]) {
        this.checkBoard[row][col] = {};
      }
      this.checkBoard[row][col].piece = piece;

      //Walls
      if (type === this.Piece.CASTLE_W || type === this.Piece.CASTLE_B) {
        for (let i = 0; i < this.NUM_CELLS; i++) {
          if (i !== 3 && i !== 4) {
            if (!this.checkBoard[row][i]) {
              this.checkBoard[row][i] = {};
            }
            this.checkBoard[row][i].wall = true;
          }
        }
      }
      return this.checkBoard[row][col];
    }

    movePlayer(row, col) {
      const oldCol = this.player.col;
      const oldRow = this.player.row;
      col = this.clampCol(col);
      row = this.clampRow(row);
      if (col !== oldCol || row !== oldRow) {
        this.applyMove(oldRow, oldCol, row, col);
      }
    }

    /** Clamp a column index to the board's horizontal bounds. */
    clampCol(col) {
      if (col < 0) return 0;
      if (col >= this.NUM_CELLS) return this.NUM_CELLS - 1;
      return col;
    }

    /** Clamp a row index to the playable vertical range. */
    clampRow(row) {
      const rowMin = Math.floor(this.progress);
      if (row < rowMin) {
        row = rowMin;
      } else if (!this.scrollingStopped && row >= this.topRowDisplayed - 2) {
        row = this.topRowDisplayed - 2;
      }
      if (this.blockWait && row > this.blockWait.startRow) {
        row = this.blockWait.startRow;
      }
      return row;
    }

    /** Index of the first checkpoint above `row` (used to snapshot counters). */
    checkpointIndexForRow(row) {
      return this.checkPoints.findIndex((cp) => row < cp);
    }

    /** Resolve a move attempt (row/col are already clamped). */
    applyMove(oldRow, oldCol, row, col) {
      let capturedType = null;
      const oldCell = this.checkBoard[oldRow][oldCol];
      if (!this.checkBoard[row]) {
        this.checkBoard[row] = [];
      }
      let cell = this.checkBoard[row][col];
      if (!cell) {
        cell = {};
        this.checkBoard[row][col] = cell;
      }
      if (cell.wall || (cell.piece && this.isBlackPiece(cell.piece.type))) {
        return;
      }
      const threateningCell = this.getThreateningCell(row, col);
      if (threateningCell) {
        this.audio.play('check');
        this.player.invalid = true;
        this.player.invalidCol = col;
        this.player.invalidRow = row;
        this.player.threateningPiece = threateningCell.piece;
        row = oldRow;
        col = oldCol;
        this.checkCount++;
        this.moveCount++;
        this.checkpointMoveCounts[this.checkpointIndexForRow(row)] = this.moveCount;
      } else {
        this.player.invalid = false;
        this.moveCount++;
        const checkpointIndex = this.checkpointIndexForRow(row);
        this.checkpointMoveCounts[checkpointIndex] = this.moveCount;
        if (cell.piece) {
          capturedType = cell.piece.type;
          this.destroyPiece(cell.piece);
          this.killCount++;
          this.checkpointKillCounts[checkpointIndex] = this.killCount;
          this.audio.play('capture');
        } else {
          this.audio.play('move');
        }
        oldCell.piece = null;
        cell.piece = this.player;
      }
      this.player.oldCol = oldCol;
      this.player.oldRow = oldRow;
      this.player.anim = true;
      this.player.animStartTime = Date.now();
      this.player.col = col;
      this.player.row = row;
      this.checkTriggers(capturedType);
      if (!this.gameIsOver && row >= this.lastRowIndex) {
        this.pendingGameOver = true;
      }
    }

    checkTriggers(capturedType) {
      const blockIndex = this.currentBlockIndex();
      const block = blockIndex >= 0 ? this.blocks[blockIndex] : null;

      this.playBlockScript(blockIndex);
      if (this.blockWait) return; // the @block beat is holding the script until the block is in view

      const rank = block ? this.player.row - block.startRow + 1 : null;
      const file = this.player.col;

      if (rank !== null) {
        const script = this.activeScript || [];
        for (let i = 0; i < script.length; i++) {
          const beat = script[i];
          if (!beat.trigger || beat.trigger === 'start' || beat.trigger === 'win' || beat.trigger === 'lose') continue;
          if (beat.fired) continue;
          if (this.triggerMatches(beat.trigger, rank, file, capturedType)) {
            beat.fired = true;
            this.activeBeat = i;
            this.playBeat(beat);
            break;
          }
        }
      }

      if (!block) return;
      for (const cond of block.win) {
        if (this.triggerMatches(cond, rank, file, capturedType)) {
          this.fireTrigger('win');
          this.pendingGameOver = true;
          this.pendingGameOverText = block.winText && block.winText.length ? block.winText : null;
          return;
        }
      }
      for (const cond of block.loss) {
        if (this.triggerMatches(cond, rank, file, capturedType)) {
          this.fireTrigger('lose');
          this.pendingGameOver = false;
          this.pendingGameOverText = block.lossText && block.lossText.length ? block.lossText : null;
          return;
        }
      }
    }

    triggerMatches(trigger, rank, file, capturedType) {
      return trigger.split(',').every((f) => {
        f = f.trim();
        const rm = /^(\d+)-rank$/.exec(f);
        if (rm) return rank === parseInt(rm[1], 10);
        const fm = /^([a-h])-file$/.exec(f);
        if (fm) return file === fm[1].charCodeAt(0) - 97;
        if (f === 'capture') return !!capturedType;
        if (/^[a-z]-capture$/.test(f)) return capturedType === f[0];
        return false;
      });
    }

    getThreateningCell(row, col) {
      let threateningCell;
      //land mines (and white war bears) - stepping on one is death
      threateningCell =
        this.getCellWithPieceAt(row, col, this.Piece.LAND_MINE_W) ||
        this.getCellWithPieceAt(row, col, this.Piece.WAR_BEAR_W);
      if (threateningCell) {
        return threateningCell;
      }
      //White pawns (enemy) - Black pawns never check
      threateningCell =
        this.getCellWithPieceAt(row + 1, col - 1, this.Piece.PAWN_W) ||
        this.getCellWithPieceAt(row + 1, col + 1, this.Piece.PAWN_W);
      if (threateningCell) {
        return threateningCell;
      }
      // Rook - orthogonal lines, blocked by the first piece in each direction.
      const rook = this.findRookThreat(row, col);
      if (rook) {
        return rook;
      }
      // Bishop - diagonal lines.
      const bishop = this.findBishopThreat(row, col);
      if (bishop) {
        return bishop;
      }
      // Knight - L-shaped jumps.
      return this.findKnightThreat(row, col);
    }

    /** Find a threatening white rook along any orthogonal line. */
    findRookThreat(row, col) {
      let cell;
      // left
      for (let j = col - 1; j >= 0; j--) {
        cell = this.getCellWithPieceAt(row, j);
        if (cell && cell.piece) {
          if (cell.piece.type === this.Piece.ROOK_W) {
            return cell;
          } else {
            break;
          }
        }
      }
      // right
      for (let j = col + 1; j <= this.NUM_CELLS; j++) {
        cell = this.getCellWithPieceAt(row, j);
        if (cell && cell.piece) {
          if (cell.piece.type === this.Piece.ROOK_W) {
            return cell;
          } else {
            break;
          }
        }
      }
      // up
      for (let i = row + 1; i <= row + this.NUM_CELLS; i++) {
        cell = this.getCellWithPieceAt(i, col);
        if (cell && cell.piece) {
          if (cell.piece.type === this.Piece.ROOK_W) {
            return cell;
          } else {
            break;
          }
        }
      }
      // down
      for (let i = row - 1; i >= row - this.NUM_CELLS; i--) {
        cell = this.getCellWithPieceAt(i, col);
        if (cell && cell.piece) {
          if (cell.piece.type === this.Piece.ROOK_W) {
            return cell;
          } else {
            break;
          }
        }
      }
      return undefined;
    }

    /** Find a threatening white bishop along any diagonal. */
    findBishopThreat(row, col) {
      let cell;
      // diag bottom-left
      for (let j = col - 1, i = row - 1; j >= 0; j--, i--) {
        cell = this.getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type === this.Piece.BISHOP_W) {
            return cell;
          } else {
            break;
          }
        }
      }
      // diag bottom-right
      for (let j = col + 1, i = row - 1; j < this.NUM_CELLS; j++, i--) {
        cell = this.getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type === this.Piece.BISHOP_W) {
            return cell;
          } else {
            break;
          }
        }
      }
      // diag top-left
      for (let j = col - 1, i = row + 1; j >= 0; j--, i++) {
        cell = this.getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type === this.Piece.BISHOP_W) {
            return cell;
          } else {
            break;
          }
        }
      }
      // diag top-right
      for (let j = col + 1, i = row + 1; j < this.NUM_CELLS; j++, i++) {
        cell = this.getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type === this.Piece.BISHOP_W) {
            return cell;
          } else {
            break;
          }
        }
      }
      return undefined;
    }

    /** Find a threatening white knight on any L-shaped square. */
    findKnightThreat(row, col) {
      return (
        this.getCellWithPieceAt(row + 2, col - 1, this.Piece.KNIGHT_W) ||
        this.getCellWithPieceAt(row - 2, col - 1, this.Piece.KNIGHT_W) ||
        this.getCellWithPieceAt(row + 2, col + 1, this.Piece.KNIGHT_W) ||
        this.getCellWithPieceAt(row - 2, col + 1, this.Piece.KNIGHT_W) ||
        this.getCellWithPieceAt(row + 1, col - 2, this.Piece.KNIGHT_W) ||
        this.getCellWithPieceAt(row - 1, col - 2, this.Piece.KNIGHT_W) ||
        this.getCellWithPieceAt(row + 1, col + 2, this.Piece.KNIGHT_W) ||
        this.getCellWithPieceAt(row - 1, col + 2, this.Piece.KNIGHT_W)
      );
    }

    getCellWithPieceAt(row, col, type) {
      const rowArray = this.checkBoard[row];
      if (rowArray) {
        const cell = rowArray[col];
        if (cell && cell.piece && (!type || cell.piece.type === type)) {
          return cell;
        }
      }
    }

    isBlackPiece(type) {
      return (
        type === this.Piece.KING_B ||
        type === this.Piece.QUEEN_B ||
        type === this.Piece.ROOK_B ||
        type === this.Piece.BISHOP_B ||
        type === this.Piece.KNIGHT_B ||
        type === this.Piece.PAWN_B ||
        type === this.Piece.WAR_BEAR_B ||
        type === this.Piece.LAND_MINE_B
      );
    }

    /** 'white' for uppercase pieces, 'black' for lowercase (includes castles). */
    pieceScheme(type) {
      return type === type.toLowerCase() ? 'black' : 'white';
    }

    /** Pawns are outline shapes (circle + triangle) that need a visible border. */
    isPawn(type) {
      return type === this.Piece.PAWN_W || type === this.Piece.PAWN_B;
    }

    destroyPiece(piece) {
      this.removedPieces.push(piece);
      piece.removedTime = Date.now();
      piece.justRemoved = true;
      if (piece.showThreat) {
        for (
          let i = piece.row - this.NUM_CELLS;
          i < piece.row + this.NUM_CELLS;
          i++
        ) {
          const rowContent = this.checkBoard[i];
          if (rowContent) {
            for (
              let j = piece.col - this.NUM_CELLS;
              j < piece.col + this.NUM_CELLS;
              j++
            ) {
              if (rowContent[j]) {
                rowContent[j].showThreat = false;
              }
            }
          }
        }
      }
    }

    computeCellPos(row, col) {
      const res = this.projection.project(
        (col + 0.5) / this.NUM_CELLS,
        (row - this.progress + 0.5) / this.NUM_CELLS,
        this.intro,
        this.perspectiveProgress
      );

      let opacity = 1;
      if (res.y < this.THRESHOLD_DOWN) {
        opacity = 0;
      } else if (res.y < this.THRESHOLD_UP) {
        opacity =
          1 -
          (this.THRESHOLD_UP - res.y) /
            (this.THRESHOLD_UP - this.THRESHOLD_DOWN);
      }
      res.opacity = opacity;
      res.x = res.x * this.SIZE;
      res.y = res.y * this.SIZE + this.HORIZON_Y;
      res.scale = res.scaleX;
      return res;
    }

    updatePieceStyle(piece) {
      if (piece.shape) {
        piece.shape.style.opacity = piece.hidden ? 0 : piece.opacity;
        if (piece.scale > 0) {
          piece.shape.setAttributeNS(
            null,
            'transform',
            `scale(${piece.scale}) translate(${piece.x / piece.scale},${
              piece.y / piece.scale
            })`
          );
        }
      }
    }

    addSvgShape(piece) {
      let shape;
      if (!this.svgCache[piece.type]) {
        this.svgCache[piece.type] = [];
      }
      if (this.svgCache[piece.type].length) {
        shape = this.svgCache[piece.type].pop();
      } else {
        shape = this.makeUse(piece.type);
        const shapeClass = piece.type === this.SVG.CHECK_TEXT
          ? 'lichessTools-chessPursuit-check'
          : 'lichessTools-chessPursuit-piece lichessTools-chessPursuit-piece--' + this.pieceScheme(piece.type)
            + (this.isPawn(piece.type) ? ' lichessTools-chessPursuit-piece--pawn' : '');
        shape.setAttribute('class', shapeClass);
      }

      // Important: elements added to top -> prepend to maintain draw order
      if (this.svgPiecesLayer.firstChild && !piece.onTop) {
        this.svgPiecesLayer.insertBefore(shape, this.svgPiecesLayer.firstChild);
      } else {
        this.svgPiecesLayer.appendChild(shape);
      }

      if (piece.shape) {
        throw new Error('Piece already has a shape');
      }

      piece.shape = shape;
      shape.style.filter = 'none';
    }

    removeSvgShape(piece) {
      if (piece.shape) {
        this.svgCache[piece.type].push(piece.shape);
        this.svgPiecesLayer.removeChild(piece.shape);
        piece.shape = null;
      }
    }

    showDialog(actorStr, texts) {
      if (this.pressSpaceText) this.pressSpaceText.style.display = 'none';
      this.skipIntroTweens();
      this.introStartTime = Date.now();
      const pieces = actorStr ? this.resolveActor(actorStr) : [];
      this.svgInnerHtml(
        this.dialogSpeakerText,
        pieces.length ? this.speakerLabel(actorStr.split(',')[0].trim()) : ''
      );
      this.clearTalking();
      const now = Date.now();
      for (const piece of pieces) {
        piece.talking = true;
        piece.talkingStartTime = now;
      }

      let txt = '';
      for (let i = 0; i < texts.length; i++) {
        txt += `<tspan x="10" ${i === 0 ? "" : 'dy="1.2em"'}>${
          texts[i]
        }</tspan>`;
      }
      this.svgInnerHtml(this.dialogText, txt);

      this.addIntroTween(this.dialogBox, { _y: this.dialogOpenY }, 0, 0.5);
    }

    hideDialog() {
      this.skipIntroTweens();
      this.introStartTime = Date.now();
      this.addIntroTween(this.dialogBox, { _y: this.dialogCloseY }, 0, 0.5);
    }

    resolveActor(actorStr) {
      const pieces = [];
      for (const id of actorStr.split(',')) {
        const piece = this.resolveSingleActor(id.trim());
        if (piece && !pieces.includes(piece)) pieces.push(piece);
      }
      return pieces;
    }

    resolveSingleActor(id) {
      const m = /^([A-Za-z])([a-h]?)(\d*)$/.exec(id);
      if (!m) return null;
      const type = SAN_TO_PIECE[m[1]];
      if (!type) return null;
      const file = m[2] ? m[2].charCodeAt(0) - 97 : null;
      const rank = m[3] ? parseInt(m[3], 10) : null;
      const matches = [];
      for (const row of this.checkBoard) {
        if (!row) continue;
        for (const cell of row) {
          if (!cell || !cell.piece || cell.piece.type !== type) continue;
          if (file !== null && cell.piece.col !== file) continue;
          if (rank !== null) {
            const block = this.blocks.find(
              (b) =>
                cell.piece.row >= b.startRow &&
                cell.piece.row < b.startRow + b.rows.length
            );
            const pieceRank = block
              ? cell.piece.row - block.startRow + 1
              : cell.piece.row + 1;
            if (pieceRank !== rank) continue;
          }
          matches.push(cell.piece);
        }
      }
      if (matches.length === 1) return matches[0];
      if (matches.length === 0) return null;
      // Ambiguous: prefer pieces in the player's current block.
      const currentBlockIndex = this.currentBlockIndex();
      const currentBlock =
        currentBlockIndex >= 0 ? this.blocks[currentBlockIndex] : null;
      if (currentBlock) {
        const inBlock = matches.filter(
          (p) =>
            p.row >= currentBlock.startRow &&
            p.row < currentBlock.startRow + currentBlock.rows.length
        );
        if (inBlock.length === 1) return inBlock[0];
      }
      return null;
    }

    speakerLabel(sanLetter) {
      const upper = sanLetter.toUpperCase();
      const name = SPEAKER_NAMES[upper] || upper;
      return (sanLetter === upper ? 'White ' : 'Black ') + name + ' :';
    }

    restart(checkPointIndex) {
      if (checkPointIndex === undefined) {
        // Find the checkpoint we were at
        checkPointIndex = this.checkPoints.length - 1;
        for (let i = 0; i < this.checkPoints.length; i++) {
          if (this.progress < this.checkPoints[i]) {
            if (i > 0) {
              checkPointIndex = i - 1;
            }
            break;
          }
        }
      }
      this.killCount = this.checkpointKillCounts[checkPointIndex] || 0;
      this.moveCount = this.checkpointMoveCounts[checkPointIndex] || 0;

      // Reinitialize game
      const respawnRow = checkPointIndex === 0 ? 5 : this.checkPoints[checkPointIndex];
      this.playedScripts.clear();
      for (let i = 0; i < this.blocks.length; i++) {
        const b = this.blocks[i];
        if (b.checkpoint) continue;
        if (b.startRow < respawnRow) {
          this.playedScripts.add(i);
        } else {
          b.state = 1;
        }
      }

      this.initCheckBoard(checkPointIndex);
      this.activeBeat = -1;
      this.scriptBusy = false;
      this.blockWait = null;
      this.activeScript = [];

      // Prepare next update
      this.lastTime = null;
      this.topRowDisplayed = -1;
      this.deathCount++;
    }

    jumpToNextBlock() {
      let nextIndex = -1;
      for (let i = 0; i < this.checkPoints.length; i++) {
        if (this.player.row < this.checkPoints[i]) {
          nextIndex = i;
          break;
        }
      }
      if (nextIndex !== -1) {
        this.restart(nextIndex);
      }
    }

    tic() {
      this.input.processInput();
      if (!this.gameIsOver) {
        if (this.scriptBusy) {
          this.updateScript();
        } else {
          this.update();
        }
        this.render();
      }
      if (this.running && this.isDocumentActive) {
        requestAnimationFrame(() => this.tic());
      }
    }

    setGameIsOver(val, win, text) {
      if (win) {
        if (text && text.length) {
          this.svgInnerHtml(this.winTitle, text[0] || 'YOU WIN !');
          this.svgInnerHtml(this.winHint, text[1] || '');
        }
        this.running = false;
        this.gameIsOver = true;
        this.won = true;
        this.winScreen.style.display = 'block';
        this.audio.play('win');
      } else {
        if (this.won) return;
        if (text && text.length) {
          this.svgInnerHtml(this.gameOverTitle, text[0] || 'CHECKMATE !');
        }
        if (val !== this.gameIsOver) {
          this.gameIsOver = val;
          if (this.gameIsOver) {
            this.gameOverScreen.style.display = 'block';
          } else {
            this.gameOverScreen.style.display = 'none';
            this.restart();
          }
        }
      }
    }

    update() {
      const now = Date.now();
      this.updateView(now);
      this.updateIntroTweens();
      if (!this.scrollingStopped && this.lastTime) {
        this.progress +=
          this.progressPerSec * (now - this.lastTime) * this.MS_TO_S;
      }
      if (this.blockWait && this.progress >= this.blockWait.startRow - this.blockWait.offset) {
        this.blockWait = null;
        this.advanceBeat();
      }
      if (this.player.row < this.progress - 0.9) {
        //player out of view
        if (this.autoMove) {
          // auto move if possible
          if (!this.getThreateningCell(this.player.row + 1, this.player.col)) {
            this.movePlayer(this.player.row + 1, this.player.col);
          } else if (
            !this.getThreateningCell(this.player.row + 1, this.player.col + 1)
          ) {
            this.movePlayer(this.player.row + 1, this.player.col + 1);
          } else if (
            !this.getThreateningCell(this.player.row + 1, this.player.col - 1)
          ) {
            this.movePlayer(this.player.row + 1, this.player.col + 1);
          } else {
            this.setGameIsOver(true);
            return;
          }
        } else {
          this.setGameIsOver(true);
        }
        this.audio.play('checkmate');
      }

      //update checkboard based on progress
      const topRow = Math.max(
        Math.floor(this.progress) + this.NUM_CELLS_DISPLAYED,
        this.player.row + 2
      );
      if (!this.lastTime || this.topRowDisplayed < topRow) {
        let row, colIndex, changes;
        //Destroy out of view rows
        for (
          let i = topRow - this.NUM_CELLS_DISPLAYED - 5;
          i > this.topRowDisplayed - this.NUM_CELLS_DISPLAYED - 5;
          i--
        ) {
          row = this.checkBoard[i];
          if (row) {
            changes = true;
            for (colIndex = 0; colIndex < this.NUM_CELLS; colIndex++) {
              if (row[colIndex] && row[colIndex].piece) {
                this.removeSvgShape(row[colIndex].piece);
              }
            }
          }
        }

        //Create missing shapes in new rows elements
        for (let i = this.topRowDisplayed + 1; i <= topRow; i++) {
          row = this.checkBoard[i];
          if (row) {
            changes = true;
            for (colIndex = 0; colIndex < this.NUM_CELLS; colIndex++) {
              //make sure elements can't overlap
              let index = this.NUM_CELLS / 2;
              if (colIndex % 2 === 0) {
                index += colIndex / 2;
              } else {
                index -= (colIndex + 1) / 2;
              }
              if (row[index] && row[index].piece && !row[index].piece.shape) {
                this.addSvgShape(row[index].piece);
              }
            }
          }
        }
        this.topRowDisplayed = topRow;
      }
      this.lastTime = now;
    }

    render() {
      const now = Date.now();

      // SVG ------------------------------------------------------------------------------------------------------

      // Update pieces and counters.
      const pieceAfterPlayer = this.renderPieces(now);
      this.renderCounters();

      // Update player animation
      let playerAnimProgress;
      if (this.player.anim) {
        if (!this.player.invalid) {
          playerAnimProgress =
            (this.MS_TO_S * (now - this.player.animStartTime)) /
            this.playerAnimDuration;
        } else {
          playerAnimProgress =
            (this.MS_TO_S * (now - this.player.animStartTime)) /
            this.playerInvalidDuration;
        }
        if (playerAnimProgress < 0 || playerAnimProgress >= 1) {
          this.player.anim = false;
          if (
            this.player.invalid &&
            this.player.threateningPiece &&
            this.player.threateningPiece.shape
          ) {
            this.player.threateningPiece.shape.style.filter = 'none';
          }
          this.player.invalid = false;
        } else {
          playerAnimProgress = Math.sin(playerAnimProgress * Math.PI * 0.5); // Ease out
          if (this.player.invalid) {
            const shakeAmplitude =
              0.4 *
              (playerAnimProgress < 0.5
                ? playerAnimProgress
                : 1 - playerAnimProgress) *
              this.CELL_SIZE;
            const shake =
              Math.sin(6 * playerAnimProgress * Math.PI) * shakeAmplitude;
            this.player.x += shake;
            this.updatePieceStyle(this.player);
            // Highlight threatening piece
            if (this.player.threateningPiece?.shape) {
              this.player.threateningPiece.shape.style.filter = `url(#${this.SVG.ENEMY_FILTER})`;
            }
          } else {
            // Compute old position
            const oldPos = this.computeCellPos(
              this.player.oldRow,
              this.player.oldCol
            );
            // Interpolate
            this.player.opacity =
              playerAnimProgress * this.player.opacity +
              (1 - playerAnimProgress) * oldPos.opacity;
            this.player.scale =
              playerAnimProgress * this.player.scale +
              (1 - playerAnimProgress) * oldPos.scale;
            this.player.x =
              playerAnimProgress * this.player.x +
              (1 - playerAnimProgress) * oldPos.x;
            this.player.y =
              playerAnimProgress * this.player.y +
              (1 - playerAnimProgress) * oldPos.y;
            this.updatePieceStyle(this.player);
          }
        }
      }

      // Apply pending win/loss once the king's move animation has finished
      if (this.pendingGameOver !== null && !this.player.anim) {
        const won = this.pendingGameOver;
        const text = this.pendingGameOverText;
        this.pendingGameOver = null;
        this.pendingGameOverText = null;
        this.setGameIsOver(true, won, text);
      }

      // Animate and clean up captured pieces.
      this.renderRemovedPieces(now);

      // "CHECK" text
      if (this.player.anim && this.player.invalid) {
        if (!this.checkText) {
          this.checkText = {
            onTop: true,
            type: this.SVG.CHECK_TEXT,
          };
        }
        if (!this.checkText.shape) {
          this.addSvgShape(this.checkText);
          this.checkText.row = this.player.invalidRow;
          this.checkText.col = this.player.invalidCol;
        }
        const res = this.computeCellPos(
          this.player.invalidRow,
          this.player.invalidCol
        );
        Object.assign(this.checkText, res);
        this.checkText.scale = 1;
        this.checkText.y -=
          playerAnimProgress * this.checkText.scale * this.CELL_SIZE * 0.2;
        this.checkText.opacity =
          playerAnimProgress < 0.8 ? 1 : 1 - (playerAnimProgress - 0.8) / 0.2;
        this.updatePieceStyle(this.checkText);
      } else if (this.checkText?.shape) {
        this.removeSvgShape(this.checkText);
      }

      // Adjust player z-index
      if (
        pieceAfterPlayer?.shape &&
        this.player.shape &&
        this.player.shape.nextSibling !== pieceAfterPlayer.shape
      ) {
        this.svgPiecesLayer.insertBefore(
          this.player.shape,
          pieceAfterPlayer.shape
        );
      }

      // CANVAS ------------------------------------------------------------------------------------------------------

      this.renderBoardCanvas(playerAnimProgress);
    }

    /** Update SVG shapes for all visible pieces; returns the piece drawn just behind the player. */
    renderPieces(now) {
      let pieceAfterPlayer;
      for (
        let rowIndex = this.topRowDisplayed - this.NUM_CELLS_DISPLAYED - 5;
        rowIndex <= this.topRowDisplayed;
        rowIndex++
      ) {
        const row = this.checkBoard[rowIndex];
        if (!row) continue;
        for (let colIndex = 0; colIndex < this.NUM_CELLS; colIndex++) {
          if (!row[colIndex] || !row[colIndex].piece) continue;
          const piece = row[colIndex].piece;
          const res = this.computeCellPos(piece.row, piece.col);
          Object.assign(piece, res);
          if (piece.moving) {
            const mp = Math.min(1, (now - piece.moveStartTime) * this.MS_TO_S / this.pieceMoveDuration);
            if (mp >= 1) {
              piece.moving = false;
            } else {
              const eased = Math.sin((mp * Math.PI) / 2);
              const oldPos = this.computeCellPos(piece.fromRow, piece.fromCol);
              piece.opacity = res.opacity * eased + oldPos.opacity * (1 - eased);
              piece.scale = res.scale * eased + oldPos.scale * (1 - eased);
              piece.x = res.x * eased + oldPos.x * (1 - eased);
              piece.y = res.y * eased + oldPos.y * (1 - eased);
            }
          }
          if (piece.appearing) {
            const ap = Math.min(1, (now - piece.appearTime) * this.MS_TO_S / 0.5);
            const ae = Math.sin((ap * Math.PI) / 2);
            piece.opacity = res.opacity * ae;
            piece.scale = res.scale * (0.5 + 0.5 * ae);
            if (ap >= 1) piece.appearing = false;
          }
          if (piece.talking) {
            const bounce =
              -Math.abs(
                Math.sin(((now - piece.talkingStartTime) * Math.PI) / 800)
              ) *
              this.CELL_SIZE *
              0.2;
            piece.y += bounce;
          }
          this.updatePieceStyle(piece);
          if (
            piece.y > this.player.y &&
            (!pieceAfterPlayer || pieceAfterPlayer.y > piece.y)
          ) {
            pieceAfterPlayer = piece;
          }
        }
      }
      return pieceAfterPlayer;
    }

    /** Update the on-screen capture / move / death counters. */
    renderCounters() {
      const inGame = !this.scriptBusy && !this.scrollingStopped;
      this.svgInnerHtml(this.captureCounterText, inGame ? 'Captures: ' + this.killCount : '');
      this.svgInnerHtml(this.moveCounterText, inGame ? 'Moves: ' + this.moveCount : '');
      this.svgInnerHtml(this.deathCounterText, inGame ? 'Deaths: ' + this.deathCount : '');
    }

    /** Animate captured pieces flying off, then recycle their SVG shapes. */
    renderRemovedPieces(now) {
      for (let i = 0, len = this.removedPieces.length; i < len; i++) {
        const removedPiece = this.removedPieces[i];
        const removedPieceProgress =
          (now - removedPiece.removedTime) * this.MS_TO_S;
        if (removedPieceProgress > 1) {
          this.removeSvgShape(removedPiece);
          this.removedPieces[i] = this.removedPieces[--len];
          this.removedPieces.length = len;
          i--;
        } else {
          if (removedPiece.justRemoved) {
            removedPiece.justRemoved = false;
            removedPiece.removedX = removedPiece.x;
            removedPiece.removedY = removedPiece.y;
          }
          if (removedPiece.x < this.SIZE * 0.5) {
            removedPiece.x =
              removedPiece.removedX - removedPieceProgress * this.SIZE;
          } else {
            removedPiece.x =
              removedPiece.removedX + removedPieceProgress * this.SIZE;
          }
          removedPiece.y =
            removedPiece.removedY -
            Math.sin(removedPieceProgress * Math.PI) * this.SIZE * 0.4;
          this.updatePieceStyle(removedPiece);
        }
      }
    }

    /** Draw the isometric board (and highlights) on the background canvas. */
    renderBoardCanvas(playerAnimProgress) {
      const bgCtx = this.bgCanvas.ctx;
      bgCtx.save();
      bgCtx.translate(0, this.HORIZON_Y);
      bgCtx.fillStyle = this.BG_COLOR;
      bgCtx.beginPath();
      bgCtx.rect(0, 0, this.SIZE, this.SIZE);
      bgCtx.fill();
      bgCtx.clip();

      const progressIndex = Math.floor(this.progress);
      const di = -(this.progress - progressIndex);
      for (let i = -1; i < this.NUM_CELLS_DISPLAYED; i++) {
        for (let j = 0; j < this.NUM_CELLS; j++) {
          const p1 = this.projection.project(
            j / this.NUM_CELLS,
            (i + di) / this.NUM_CELLS,
            this.intro,
            this.perspectiveProgress
          );
          const p4 = this.projection.project(
            j / this.NUM_CELLS,
            (i + 1 + di) / this.NUM_CELLS,
            this.intro,
            this.perspectiveProgress
          );
          const p3 = this.projection.project(
            (j + 1) / this.NUM_CELLS,
            (i + 1 + di) / this.NUM_CELLS,
            this.intro,
            this.perspectiveProgress
          );
          const p2 = this.projection.project(
            (j + 1) / this.NUM_CELLS,
            (i + di) / this.NUM_CELLS,
            this.intro,
            this.perspectiveProgress
          );

          bgCtx.beginPath();
          bgCtx.moveTo(p1.x * this.SIZE, p1.y * this.SIZE);
          bgCtx.lineTo(p2.x * this.SIZE, p2.y * this.SIZE);
          bgCtx.lineTo(p3.x * this.SIZE, p3.y * this.SIZE);
          bgCtx.lineTo(p4.x * this.SIZE, p4.y * this.SIZE);
          bgCtx.closePath();
          bgCtx.lineWidth = 1;

          // Mouse-over highlight.
          if (
            this.mouseRow !== -1 &&
            this.mouseCol !== -1 &&
            i + progressIndex === this.mouseRow &&
            j === this.mouseCol
          ) {
            const dx = this.mouseCol - this.player.col;
            const dy = this.mouseRow - this.player.row;
            bgCtx.fillStyle =
              dx < -1 || dx > 1 || dy < -1 || dy > 1
                ? this.ROLLOVER_COLOR_TOO_FAR
                : this.ROLLOVER_COLOR;
          } else {
            bgCtx.fillStyle =
              (i + j + progressIndex) % 2 === 0
                ? this.CELL_COLOR_1
                : this.CELL_COLOR_2;
          }
          bgCtx.fill();

          const row = this.checkBoard[i + progressIndex];
          if (row?.[j]) {
            const cell = row[j];
            if (cell.showThreat) {
              bgCtx.fillStyle = `rgba(${this.INVALID_CELL_COLOR_RGB},0.5)`;
              bgCtx.fill();
            }
            if (cell.checkPoint) {
              bgCtx.fillStyle = this.CHECK_POINT_COLOR;
              bgCtx.fill();
            }
          }

          if (
            this.player.invalid &&
            this.player.invalidCol === j &&
            this.player.invalidRow === i + progressIndex
          ) {
            const invalidOpacity =
              1.5 *
              (playerAnimProgress < 0.5
                ? playerAnimProgress
                : 1 - playerAnimProgress);
            bgCtx.fillStyle = `rgba(${this.INVALID_CELL_COLOR_RGB},${invalidOpacity})`;
            bgCtx.fill();
          }
        }
      }
      bgCtx.restore();
    }

    // ---------------------------------------------------------------------
    // SVG / DOM helpers
    // ---------------------------------------------------------------------

    /** Set multiple attributes on an SVG element */
    svgAttrs(el, attrs) {
      if (attrs) {
        for (const key in attrs) {
          el.setAttributeNS(null, key, attrs[key]);
        }
      }
      return el;
    }

    /** Parse an HTML string into SVG nodes (needed for <tspan>) */
    svgInnerHtml(svg, html) {
      // Reuse a single temporary div for parsing.
      if (!this._svgTmpDiv) this._svgTmpDiv = document.createElement('div');
      const wrapper = `<svg>${html}</svg>`;
      this._svgTmpDiv.innerHTML = wrapper;
      const nodes = Array.from(this._svgTmpDiv.firstChild.childNodes);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      nodes.forEach((node) => svg.appendChild(node));
    }

    /** Parse an SVG markup string into element nodes (whitespace-only text ignored) */
    makeElems(html) {
      if (!this._svgTmpDiv) this._svgTmpDiv = document.createElement('div');
      this._svgTmpDiv.innerHTML = `<svg>${html}</svg>`;
      return Array.from(this._svgTmpDiv.firstChild.children);
    }

    /** Create a <g> definition for a piece (used in <defs>) */
    makeDef(id, html, skipShadow = false, ox = 5, oy = 8) {
      const def = document.createElementNS(SVG_NS, 'g');
      def.setAttributeNS(null, 'id', id);
      // Shapes are authored in a 10x10 grid with the piece origin at [ox,oy].
      // Scale and translate so the origin maps to the def's local (0,0), where a
      // <use> then positions the piece on the board.
      const scale = this.CELL_SIZE / 10;
      def.setAttributeNS(
        null,
        'transform',
        `translate(${-scale * ox} ${-scale * oy}) scale(${scale})`
      );
      if (!skipShadow) def.appendChild(this.makeShadow());
      for (const shape of this.makeElems(html)) {
        def.appendChild(shape);
      }
      this.defs.appendChild(def);
      return def;
    }

    /** Define a piece shape in <defs> (the <use> element carries the styling class). */
    definePiece(id, html, options = {}) {
      const { skipShadow = false, ox = 5, oy = 8 } = options;
      this.makeDef(id, html, skipShadow, ox, oy);
    }

    makeFilter(id) {
      const def = document.createElementNS(SVG_NS, 'filter');
      def.setAttributeNS(null, 'id', id);
      this.svgAttrs(def, {
        x: '0',
        y: '0',
        width: '100%',
        height: '100%',
        'color-interpolation-filters': 'sRGB',
      });
      this.svgInnerHtml(
        def,
        '<feFlood flood-color="#FF0000" flood-opacity="0.3" result="COLOR"></feFlood>' +
          '<feComposite operator="atop" in="COLOR" in2="SourceGraphic"></feComposite>'
      );
      this.defs.appendChild(def);
      return def;
    }

    /** Piece shadow (ellipse); styled via attributes so it survives <use> cloning. */
    makeShadow() {
      const shadow = document.createElementNS(SVG_NS, 'ellipse');
      this.svgAttrs(shadow, {
        cx: 5,
        cy: 8,
        rx: 3.1,
        ry: 1.8,
        fill: '#000000',
        'fill-opacity': 0.2,
        stroke: 'none',
      });
      return shadow;
    }

    /** <use> element that references a definition */
    makeUse(id, attrs = {}) {
      const use = document.createElementNS(SVG_NS, 'use');
      this.svgAttrs(use, attrs);
      use.setAttributeNS(XLINK_NS, 'xlink:href', '#' + id);
      use.setAttribute('xmlns:xlink', XLINK_NS);
      return use;
    }

    /** <text> definition for the "CHECK" label */
    makeCheckTextDef(id, text) {
      const txt = document.createElementNS(SVG_NS, 'text');
      txt.setAttributeNS(null, 'id', id);
      txt.setAttribute('class', 'lichessTools-chessPursuit-check');
      this.svgAttrs(txt, { x: '-40' });
      this.svgInnerHtml(txt, text);
      this.defs.appendChild(txt);
    }

    /** Game-over overlay */
    makeGameOverScreen() {
      this.gameOverScreen = document.createElementNS(SVG_NS, 'g');
      this.gameOverScreen.setAttribute('class', 'lichessTools-chessPursuit-screen lichessTools-chessPursuit-screen--gameover');
      this.gameOverScreen.style.display = 'none';
      this.svgElem.appendChild(this.gameOverScreen);

      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('class', 'lichessTools-chessPursuit-screen-overlay');
      this.svgAttrs(rect, { x: 0, y: 0, width: '100%', height: '100%' });
      this.gameOverScreen.appendChild(rect);

      const title = document.createElementNS(SVG_NS, 'text');
      title.setAttribute('class', 'lichessTools-chessPursuit-screen-title');
      this.svgAttrs(title, { x: '50%', y: '50%', 'text-anchor': 'middle' });
      this.svgInnerHtml(title, this.genericLoss[0] || 'CHECKMATE !');
      this.gameOverScreen.appendChild(title);
      this.gameOverTitle = title;

      const hint = document.createElementNS(SVG_NS, 'text');
      hint.setAttribute('class', 'lichessTools-chessPursuit-screen-hint');
      this.svgAttrs(hint, { x: '50%', y: '60%', 'text-anchor': 'middle' });
      this.svgInnerHtml(
        hint,
        `<tspan x="50%">Press <tspan style="fill:#FFA500;">SPACE</tspan> or <tspan style="fill:#FFA500;">CLICK</tspan></tspan>` +
          `<tspan x="50%" dy="1.5em">to restart from the last checkpoint.</tspan>`
      );
      this.gameOverScreen.appendChild(hint);
    }

    /** Intro title screen */
    makeIntroScreen() {
      this.introScreen = document.createElementNS(SVG_NS, 'g');
      this.introScreen.setAttribute('class', 'lichessTools-chessPursuit-screen lichessTools-chessPursuit-screen--intro');
      this.svgElem.appendChild(this.introScreen);

      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('class', 'lichessTools-chessPursuit-screen-overlay');
      this.svgAttrs(rect, { x: 0, y: 0, width: '100%', height: this.HORIZON_Y });
      this.introScreen.appendChild(rect);

      const title = document.createElementNS(SVG_NS, 'text');
      title.setAttribute('class', 'lichessTools-chessPursuit-screen-title');
      this.svgAttrs(title, { x: '50%', y: '60', 'text-anchor': 'middle' });
      this.svgInnerHtml(
        title,
        this.title || 'CHESS<tspan style="font-style:italic;">PURSUIT</tspan>'
      );
      this.introScreen.appendChild(title);
    }

    /** "Press SPACE or CLICK" prompt */
    makePressSpaceText() {
      this.pressSpaceText = document.createElementNS(SVG_NS, 'text');
      this.pressSpaceText.setAttribute('class', 'lichessTools-chessPursuit-press-space');
      this.svgAttrs(this.pressSpaceText, { x: '50%', y: this.HORIZON_Y + this.SIZE - 10, 'text-anchor': 'middle' });
      this.svgInnerHtml(
        this.pressSpaceText,
        'Press <tspan style="fill:#FFA500;">SPACE</tspan> or <tspan style="fill:#FFA500;">CLICK</tspan>'
      );
      this.svgElem.appendChild(this.pressSpaceText);
    }

    /** Paused overlay */
    makePauseText() {
      this.pauseText = document.createElementNS(SVG_NS, 'text');
      this.pauseText.setAttribute('class', 'lichessTools-chessPursuit-pause');
      this.svgAttrs(this.pauseText, { x: '50%', y: '50%', 'text-anchor': 'middle' });
      this.svgInnerHtml(this.pauseText, 'PAUSED');
      this.pauseText.style.display = 'none';
      this.svgElem.appendChild(this.pauseText);
    }

    /** Dialog box (slides in from bottom) */
    makeDialogBox() {
      const width = this.SIZE - 2 * this.DIALOG_MARGIN;
      const height = 0.3 * this.SIZE - 2 * this.DIALOG_MARGIN;

      this.dialogCloseY = this.SIZE + this.HORIZON_Y;
      this.dialogOpenY =
        this.HORIZON_Y + this.SIZE - height - this.DIALOG_MARGIN;

      this.dialogBox = document.createElementNS(SVG_NS, 'svg');
      this.dialogBox.setAttribute('class', 'lichessTools-chessPursuit-dialog');
      this.dialogBox._y = this.dialogCloseY; // used for tweening
      this.svgAttrs(this.dialogBox, {
        x: this.DIALOG_MARGIN,
        y: this.dialogCloseY,
        width,
        height,
      });
      this.svgElem.appendChild(this.dialogBox);

      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('class', 'lichessTools-chessPursuit-dialog-bg');
      this.svgAttrs(rect, { width: '100%', height: '100%' });
      this.dialogBox.appendChild(rect);

      this.dialogSpeakerText = document.createElementNS(SVG_NS, 'text');
      this.dialogSpeakerText.setAttribute('class', 'lichessTools-chessPursuit-dialog-speaker');
      this.svgAttrs(this.dialogSpeakerText, { x: 10, y: 20, 'text-anchor': 'left' });
      this.dialogBox.appendChild(this.dialogSpeakerText);

      this.dialogText = document.createElementNS(SVG_NS, 'text');
      this.dialogText.setAttribute('class', 'lichessTools-chessPursuit-dialog-text');
      this.svgAttrs(this.dialogText, { x: 10, y: 40, 'text-anchor': 'left' });
      this.dialogBox.appendChild(this.dialogText);
    }

    /** Win screen */
    makeWinScreen() {
      this.winScreen = document.createElementNS(SVG_NS, 'g');
      this.winScreen.setAttribute('class', 'lichessTools-chessPursuit-screen lichessTools-chessPursuit-screen--win');
      this.winScreen.style.display = 'none';
      this.svgElem.appendChild(this.winScreen);

      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('class', 'lichessTools-chessPursuit-screen-overlay');
      this.svgAttrs(rect, { x: 0, y: 0, width: '100%', height: '100%' });
      this.winScreen.appendChild(rect);

      const title = document.createElementNS(SVG_NS, 'text');
      title.setAttribute('class', 'lichessTools-chessPursuit-screen-title');
      this.svgAttrs(title, { x: '50%', y: '50%', 'text-anchor': 'middle' });
      this.svgInnerHtml(title, this.genericWin[0] || 'YOU WIN !');
      this.winScreen.appendChild(title);
      this.winTitle = title;

      const hint = document.createElementNS(SVG_NS, 'text');
      hint.setAttribute('class', 'lichessTools-chessPursuit-screen-hint');
      this.svgAttrs(hint, { x: '50%', y: '60%', 'text-anchor': 'middle' });
      this.svgInnerHtml(hint, this.genericWin[1] || '');
      this.winScreen.appendChild(hint);
      this.winHint = hint;
    }
  }

  hook.loadChessPursuit = function (gameContainer, dataUrl) {
    let game = null;
    let disposed = false;
    (async () => {
      let levelData;
      try {
        const res = await fetch(dataUrl);
        if (res.ok) {
          levelData = await res.text();
        }
      } catch (e) {
        console.error('Could not load Chess Pursuit data', e);
      }
      if (disposed) {
        return;
      }
      if (!levelData) {
        console.error('Chess Pursuit data is empty');
      }
      try {
        game = new ChessPursuitGame();
        game.load(gameContainer, levelData);
      } catch (e) {
        console.error('Could not start Chess Pursuit', e);
      }
    })();
    return () => {
      disposed = true;
      if (game) {
        game.setGameIsOver(true);
      }
    };
  };

  // Expose the game's building blocks under a single namespace so they can be
  // unit-tested and reused without reaching into this closure. This is a
  // read-only registry and does not change any game behaviour; the legacy
  // `hook.loadChessPursuit` entry point above is preserved for compatibility.
  hook.ChessPursuit = {
    Canvas,
    InputManager,
    SoundParams,
    SoundGenerator,
    ArcadeAudio,
    Projection,
    ChessPursuitGame,
  };
})(window.LiChessTools || window);
