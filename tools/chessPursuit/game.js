(function (hook) {
  class Canvas {

    constructor(id, width, height) {
      this.canvas = document.createElement("canvas");
      this.canvas.id = id;
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext("2d");
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
      this.canvas.style.top = value+'px';
    }

    pointerEvents(value) {
      if (value === undefined) return this.canvas.style.pointerEvents != 'none';
      this.canvas.style.pointerEvents = value ? undefined : 'none';
    }
  }

  class InputManager {
    KEY_LATENCY = 6;
    KEY_DONE = -1;

    /** Map of key codes -> logical key names */
    keyMap = {
      37: "left", // left arrow
      65: "left", // a
      81: "left", // q
      38: "up", // up arrow
      90: "up", // z
      87: "up", // w
      83: "down", // s
      40: "down", // down arrow
      39: "right", // right arrow
      68: "right", // d
      32: "space", // space
      27: "esc",
      13: "enter",
      77: "mute", // m
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
        if (this.keys.down == this.KEY_LATENCY || this.keys.down === 0) {
          dy = -1;
        }
        if (this.keys.up == this.KEY_LATENCY || this.keys.up === 0) {
          dy = 1;
        }
        if (this.keys.left == this.KEY_LATENCY || this.keys.left === 0) {
          dx = -1;
        }
        if (this.keys.right == this.KEY_LATENCY || this.keys.right === 0) {
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

    /** Core key handler â€“ called from keydown/keyup */
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

    /** Attach all input listeners â€“ call from load() */
    setup(root) {
      this.root = root;

      // ---- Keyboard ----
      root.addEventListener("keydown", (e) => this.onkey(true, e));
      root.addEventListener("keyup", (e) => this.onkey(false, e));

      // ---- Pointer (mouse / touch) ----
      root.addEventListener("pointerdown", (e) => this.onmouse(true, e));
      root.addEventListener("pointerup", (e) => this.onmouse(false, e));
      root.addEventListener("pointercancel", (e) => this.onmouse(false, e));
      root.addEventListener("pointermove", (e) => this.onmousemove(e));
    }

    emit(event){
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
      const blob = new Blob([wavData], { type: "audio/wav" });
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
      let i=0;
      for (const soundData of sound) {
        i++;
        const url = soundData.pool[soundData.tick].src;
        const a = document.createElement("a");
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
     * ax² + bx + c
     */
    quadraticEq(x, a, b, c) {
      return a * x * x + b * x + c;
    }

    /**
     * Solve ax² + bx + c = y for x
     */
    reverseQuadraticEq(y, a, b, c, positiveRoot = true) {
      const discriminant = b * b - 4 * a * (c - y);
      const sqrt = Math.sqrt(discriminant);
      return positiveRoot ? (-b + sqrt) / (2 * a) : (-b - sqrt) / (2 * a);
    }
  }

  class ChessPursuitGame {
    constructor() {
      this.projection = new Projection();

      //pieces id (used in SVG and checkboard)
      this.Piece = {
        HERO_KING: "h",
        ENEMY_KING: "e",
        PAWN: "p",
        ROOK: "r",
        BISHOP: "b",
        KNIGHT: "k",
        LAND_MINE: "l",
        WAR_BEAR: "w",
        CASTLE: "c",
        QUEEN: "q",
      };

      //other SCG ids
      this.SVG = {
        ENEMY_FILTER: "ef",
        CHECK_TEXT: "ct",
      };

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

      this.BG_COLOR = "#193441";
      this.CELL_COLOR_1 = "#D1DBBD";
      this.CELL_COLOR_2 = "#3E606F";
      this.ROLLOVER_COLOR = "#794";
      this.ROLLOVER_COLOR_TOO_FAR = "#898";
      this.PIECE_FILL_COLOR = "#eee";
      this.PIECE_STROKE_COLOR = "#555";
      this.INVALID_CELL_COLOR_RGB = "255,0,0";
      this.CHECK_POINT_COLOR = "rgba(93, 255, 182, 0.56)";

      this.MS_TO_S = 1 / 1000;
      this.THRESHOLD_DOWN = -0.02;
      this.THRESHOLD_UP = 0.02;

      this.svgCache = {};
    }

    load(gameContainer) {
      this.root = gameContainer;

      //------------------------------------------------------------------------------------------------------------------
      // game logic
      //------------------------------------------------------------------------------------------------------------------

      this.now = 0; //Date.now(), set on update
      this.lastTime;
      this.killCount = 0;
      this.checkMateCount = 0;
      this.checkCount = 0;
      this.winScreen = null;
      this.gameOverScreen = null;
      this.gameIsOver = false;
      this.autoMove = false;
      this.progress = 0; //expressed as a number of rows
      this.progressPerSec = 1; //1
      this.checkBoard = null;
      this.checkPoints = null;
      this.topRowDisplayed = -1;
      this.raf = true;
      this.isDocumentActive = true;
      this.removedPieces = [];
      this.lastRowIndex = null;
      this.player = null;
      this.playerAnimDuration = 0.05;
      this.playerInvalidDuration = 0.5;
      this.pressSpaceText = null;
      this.pauseText = null;
      this.introScreen = null;
      this.intro = true;
      this.introStartTime;
      this.perspectiveProgress = 0;
      this.introProgress = 0;
      this.introStep = -1;
      this.dialogBox = null;
      this.dialogSpeakerText = null;
      this.dialogText = null;
      this.checkText = null;

      this.loadAudio();
      this.createCanvases();

      //------------------------------------------------------------------------------------------------------------------
      // initialization
      //------------------------------------------------------------------------------------------------------------------
      this.input = new InputManager();
      this.input.setup(this.root);
      this.input.onEmit(this.handleInput.bind(this));

      this.setupVisibilityChange();

      this.initCheckBoard(0);
      this.tic();
    }

    setupVisibilityChange() {
      // ---- Visibility change (pause when tab is hidden) ----
      document.addEventListener("visibilitychange", () => {
        const isActive = !document.hidden;
        if (isActive && !this.isDocumentActive) {
          this.lastTime = Date.now();
          this.tic();
        }
        this.isDocumentActive = isActive;
      });
    }

    handleInput(ev) {
      switch(ev.type) {
        case 'move':
          if (!this.gameIsOver && !this.intro && this.topRowDisplayed > 0 && !this.player.invalid) {
            this.movePlayer(this.player.row + ev.dy, this.player.col + ev.dx);
          }
          break;
        case 'mouse':
          if (this.input.mouse.click) {
            if (this.gameIsOver) {
              this.setGameIsOver(false);
            } else
            if (this.intro && this.introStep >= 0) {
              this.nextIntroStep();
            }
          }
          if (!this.gameIsOver && !this.intro && this.topRowDisplayed > 0 && !this.player.invalid) {
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
            } else
            if (this.intro && this.introStep >= 0) {
              this.nextIntroStep();
            }
          }
          // Mute toggle on 'm' (only on key-up)
          if (!ev.isDown && this.input.keyBoolMap.mute) {
            this.audio.toggleMute();
          }

          // Special: Enter toggles pause (only when not in intro/game-over)
          if (!this.intro && this.input.keyBoolMap.enter && !this.gameIsOver) {
            this.raf = !this.raf;
            this.pauseText.style.display = this.raf ? "none" : "block";
            if (this.raf) {
              this.lastTime = Date.now();
              this.tic();
            }
          }

          break;
      }
    };

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
      ctx.fillStyle = "#FF8601";
      ctx.beginPath();
      ctx.rect(0, 0, this.SIZE, this.HORIZON_Y);
      ctx.fill();
      ctx.clip();
      //Draw sun
      ctx.fillStyle = "#FFE7CA";
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
      ctx.fillStyle = "rgb(10,20,25)";
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
      const c = "rgba(10,20,25,";
      const c2 = ")";
      grd.addColorStop(0, c + 1 + c2);
      grd.addColorStop(1, c + 0 + c2);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, this.SIZE, shadowSize);
      ctx.restore();
      this.skyCanvas.appendTo(this.root);
    }

    initSvg() {
      const xmlns = "http://www.w3.org/2000/svg";
      const xlinkns = "http://www.w3.org/1999/xlink";
      const boxWidth = this.SIZE;
      const boxHeight = this.SIZE + this.HORIZON_Y;
      this.svgElem = document.createElementNS(xmlns, "svg");
      this.svgElem.setAttribute("xmlns", xmlns);
      this.svgElem.setAttributeNS(
        null,
        "viewBox",
        "0 0 " + boxWidth + " " + boxHeight
      );
      this.svgElem.setAttributeNS(null, "width", boxWidth);
      this.svgElem.setAttributeNS(null, "height", boxHeight);
      this.root.appendChild(this.svgElem);
      this.defs = document.createElementNS(xmlns, "defs");
      this.svgElem.appendChild(this.defs);

      //make pieces layer
      this.svgPiecesLayer = document.createElementNS(xmlns, "g");
      this.svgElem.appendChild(this.svgPiecesLayer);
      this.makeIntroScreen();
      this.makeFilter(this.SVG.ENEMY_FILTER);
      this.makeCheckTextDef(this.SVG.CHECK_TEXT, "CHECK");
      this.makeGameOverScreen();
      this.makeDialogBox();
      this.makePressSpaceText();
      this.makePauseText();
      this.makeWinScreen();

      //For convenience, shape defs are given in a [10,10] rect, transformed to [CELL_SIZE,CELL_SIZE] in actual SVG
      //We also transform the shape positions so that the piece origin is [OX,OY]
      this.svgStyle(
        this.makeDef(this.Piece.PAWN, [
          this.makePath([
            "M",
            [2, 8],
            "Q",
            [5, 10],
            [8, 8],
            "L",
            [5, 3],
            "L",
            [2, 8],
          ]),
          this.makeCircle(5, 3, 2),
        ]),
        this.PIECE_FILL_COLOR,
        this.PIECE_STROKE_COLOR,
        0
      );
      this.svgStyle(
        this.makeDef(this.Piece.ENEMY_KING, [
          this.makePath([
            "M",
            [4.6, 1.4],
            "L",
            [5.4, 1.4],
            "L",
            [5.4, -0.6],
            "L",
            [6.4, -0.6],
            "L",
            [6.4, -1.4],
            "L",
            [5.4, -1.4],
            "L",
            [5.4, -2.4],
            "L",
            [4.6, -2.4],
            "L",
            [4.6, -1.4],
            "L",
            [3.6, -1.4],
            "L",
            [3.6, -0.6],
            "L",
            [4.6, -0.6],
            "L",
            [4.6, 1.4],
          ]),
          this.makePath([
            "M",
            [2, 8],
            "Q",
            [5, 10],
            [8, 8],
            "L",
            [6, 3],
            "L",
            [7, 1],
            "Q",
            [5, 0],
            [3, 1],
            "L",
            [4, 3],
            "L",
            [2, 8],
          ]),
        ]),
        this.PIECE_FILL_COLOR,
        this.PIECE_STROKE_COLOR,
        0
      );
      this.svgStyle(
        this.makeDef(this.Piece.KNIGHT, [
          this.makePath([
            "M",
            [2, 8],
            "Q",
            [5, 10],
            [8, 8],
            "L",
            [7, 6],
            "Q",
            [8, 3],
            [7, 0],
            "L",
            [6, 1],
            "L",
            [5, 1],
            "L",
            [2, 4],
            "L",
            [3, 5],
            "L",
            [5, 4],
            "L",
            [2, 8],
          ]),
        ]),
        this.PIECE_FILL_COLOR,
        this.PIECE_STROKE_COLOR,
        0
      );
      this.svgStyle(
        this.makeDef(this.Piece.ROOK, [
          this.makePath([
            "M",
            [2, 8],
            "Q",
            [5, 10],
            [8, 8],
            "L",
            [6.5, 3],
            "L",
            [8, 2],
            "L",
            [8, 0],
            "L",
            [7, 0],
            "L",
            [7, 1],
            "L",
            [6, 1],
            "L",
            [6, 0],
            "L",
            [4, 0],
            "L",
            [4, 1],
            "L",
            [3, 1],
            "L",
            [3, 0],
            "L",
            [2, 0],
            "L",
            [2, 2],
            "L",
            [3.5, 3],
            "L",
            [2, 8],
          ]),
        ]),
        this.PIECE_FILL_COLOR,
        this.PIECE_STROKE_COLOR,
        0
      );
      this.svgStyle(
        this.makeDef(this.Piece.BISHOP, [
          this.makePath([
            "M",
            [2, 8],
            "Q",
            [5, 10],
            [8, 8],
            "L",
            [6, 4],
            "Q",
            [8, 1.1],
            [5, 0],
            "Q",
            [2, 1.1],
            [4, 4],
            "L",
            [2, 8],
          ]),
          this.makeCircle(5, 0, 0.7),
          this.makePath(["M", [3.8, 0.8], "L", [4.4, 2.5]], {
            "stroke-width": 2,
          }),
        ]),
        this.PIECE_FILL_COLOR,
        this.PIECE_STROKE_COLOR,
        0
      );
      this.svgStyle(
        this.makeDef(this.Piece.WAR_BEAR, [
          this.makePath([
            "M",
            [2, 8],
            "Q",
            [5, 10],
            [8, 8],
            "L",
            [8.5, 6],
            "L",
            [7, 7],
            "L",
            [7, 5],
            "L",
            [6, 6],
            "L",
            [5, 4.5],
            "L",
            [4, 6],
            "L",
            [3, 5],
            "L",
            [3, 7],
            "L",
            [1.5, 6],
            "L",
            [2, 8],
          ]),
        ]),
        this.PIECE_FILL_COLOR,
        this.PIECE_STROKE_COLOR,
        0
      );

      const makePike = (x, y) => {
        return this.makePath([
          "M",
          [x, y],
          "L",
          [x + 1, y],
          "L",
          [x + 0.5, y - 3],
          "L",
          [x, y],
        ]);
      };

      this.svgStyle(
        this.makeDef(
          this.Piece.LAND_MINE,
          [
            makePike(2, 9.5),
            makePike(5, 9),
            makePike(8, 10),
            makePike(7, 8),
            makePike(4, 7.5),
            makePike(1, 8.5),
          ],
          true
        ),
        this.PIECE_FILL_COLOR,
        this.PIECE_STROKE_COLOR,
        0
      );
      //HERO_KING
      this.svgStyle(
        this.makeDef(this.Piece.HERO_KING, [
          this.makePath([
            "M",
            [4.6, 1.4],
            "L",
            [5.4, 1.4],
            "L",
            [5.4, -0.6],
            "L",
            [6.4, -0.6],
            "L",
            [6.4, -1.4],
            "L",
            [5.4, -1.4],
            "L",
            [5.4, -2.4],
            "L",
            [4.6, -2.4],
            "L",
            [4.6, -1.4],
            "L",
            [3.6, -1.4],
            "L",
            [3.6, -0.6],
            "L",
            [4.6, -0.6],
            "L",
            [4.6, 1.4],
          ]),
          this.makePath([
            "M",
            [2, 8],
            "Q",
            [5, 10],
            [8, 8],
            "L",
            [6, 3],
            "L",
            [7, 1],
            "Q",
            [5, 0],
            [3, 1],
            "L",
            [4, 3],
            "L",
            [2, 8],
          ]),
        ]),
        "#002",
        "#333",
        0
      );
      this.svgStyle(
        this.makeDef(this.Piece.QUEEN, [
          this.makeCircle(5, 0.4, 0.6),
          this.makePath([
            "M",
            [2, 8],
            "Q",
            [5, 10],
            [8, 8],
            "L",
            [6, 3],
            "L",
            [7.5, 1],
            "L",
            [5.8, 1.5],
            "L",
            [5, 0.8],
            "L",
            [4.2, 1.5],
            "L",
            [2.5, 1],
            "L",
            [4, 3],
            "L",
            [2, 8],
          ]),
        ]),
        "#002",
        "#333",
        0
      );

      this.svgStyle(
        this.makeDef(
          this.Piece.CASTLE,
          [
            this.makePath(
              [
                "M",
                [25, 30],
                "L",
                [50, 30],
                "L",
                [50, 5],
                "L",
                [45, 5],
                "L",
                [45, 10],
                "L",
                [40, 10],
                "L",
                [40, 5],
                "L",
                [35, 5],
                "L",
                [35, 10],
                "L",
                [30, 10],
                "L",
                [30, 5],
                "L",
                [25, 5],
                "L",
                [25, 30],
              ],
              null,
              2.5,
              50
            ),
            this.makePath(
              [
                "M",
                [0, 50],
                "L",
                [0, 50],
                "L",
                [27.5, 50],
                "L",
                [27.5, 35],
                "L",
                [47.5, 35],
                "L",
                [47.5, 50],
                "L",
                [75, 50],
                "L",
                [75, 20],
                "L",
                [70, 20],
                "L",
                [70, 25],
                "L",
                [65, 25],
                "L",
                [65, 20],
                "L",
                [60, 20],
                "L",
                [60, 25],
                "L",
                [55, 25],
                "L",
                [55, 20],
                "L",
                [50, 20],
                "L",
                [50, 25],
                "L",
                [45, 25],
                "L",
                [45, 20],
                "L",
                [40, 20],
                "L",
                [40, 25],
                "L",
                [35, 25],
                "L",
                [35, 20],
                "L",
                [30, 20],
                "L",
                [30, 25],
                "L",
                [25, 25],
                "L",
                [25, 20],
                "L",
                [20, 20],
                "L",
                [20, 25],
                "L",
                [15, 25],
                "L",
                [15, 20],
                "L",
                [10, 20],
                "L",
                [10, 25],
                "L",
                [5, 25],
                "L",
                [5, 20],
                "L",
                [0, 20],
                "L",
                [0, 50],
              ],
              null,
              2.5,
              50
            ),
          ],
          true
        ),
        this.PIECE_FILL_COLOR,
        this.PIECE_STROKE_COLOR,
        0
      );
    }

    initShadowCanvas() {
      this.shadowCanvas = new Canvas('shadow', this.SIZE, this.SIZE);

      const ctx = this.shadowCanvas.ctx;
      //Top down shadow
      const grd = ctx.createLinearGradient(0, 0, 0, this.SIZE);
      const c = "rgba(10,20,25,";
      const c2 = ")";
      grd.addColorStop(0, c + 0 + c2);
      grd.addColorStop(0.2, c + 0 + c2);
      //grd.addColorStop(0.9,"rgba(0,0,0,0.3)");
      grd.addColorStop(1, c + 0.5 + c2);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, this.SIZE, this.SIZE);
      ctx.restore();
      this.shadowCanvas.top(this.HORIZON_Y)
      this.shadowCanvas.pointerEvents(false);
      this.shadowCanvas.appendTo(this.root)
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

      const block = (...args) => {
        let options = typeof args[0] === "object" ? args.shift() : {};
        let showThreatCell = null;
        const doAdd = startCheckPointIndex < this.checkPoints.length;
        const startRowIndex = currentRowIndex;

        for (let i = args.length - 1; i >= 0; i--) {
          const row = args[i];
          if (row.length > this.NUM_CELLS) throw new Error("Row too long");
          this.checkBoard[currentRowIndex] = [];

          if (doAdd && row !== "") {
            for (let j = 0; j < row.length; j++) {
              const char = row.charAt(j);
              if (char !== " " && char !== ".") {
                const lowerChar = char.toLowerCase();
                const pieceCell = this.addPieceAt(
                  lowerChar,
                  currentRowIndex,
                  j
                );
                if (options.showThreat === lowerChar) {
                  showThreatCell = this.checkBoard[currentRowIndex][j];
                }
                if (char !== lowerChar) {
                  // TODO: allied pieces
                }
                if (options.intro) {
                  pieceCell.piece.intro = true;
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

      // === Level layout using local `block` and `checkPoint` ===

      // 0: Intro
      block(
        { intro: true },
        "........",
        "........",
        "........",
        this.intro ? "..reqr.." : "........",
        this.intro ? "...kk..." : "........",
        "........",
        "........",
        "........",
        "........",
        "........",
        "........",
        "kkkkkkkk"
      );

      // First pawn
      block(
        { showThreat: "p" },
        "........",
        "........",
        "....p...",
        "........",
        "........",
        "........",
        "........",
        "........"
      );

      // Scattered pawns
      block(
        "..pppp..",
        "..pppp..",
        "........",
        "..p.....",
        "........",
        ".....p..",
        "........",
        ".p......"
      );

      // Pawn rows
      block(
        "........",
        "pppppp..",
        "........",
        "..pppppp",
        "........",
        "pppppp..",
        "........",
        "........"
      );

      // Triangle
      block(
        "........",
        "pp...ppp",
        "..p.p...",
        "...p....",
        "........",
        "........",
        "........",
        "........"
      );

      // Sawtooth
      block(
        "........",
        "...pp...",
        "p.p..p.p",
        ".p....p.",
        "........",
        "........",
        "........",
        "........"
      );

      // Wedges
      block(
        "........",
        "....ppp.",
        ".....p..",
        "ppp.....",
        ".p...ppp",
        "......p.",
        "........",
        "........"
      );

      checkPoint(); // CHECK POINT 1

      // First rook
      block(
        { showThreat: "r" },
        "........",
        "...p....",
        "........",
        "...r....",
        "........",
        "...p....",
        "........",
        "........"
      );

      // Rook diagonal
      block(
        "........",
        "........",
        "r.......",
        ".r......",
        "..r.....",
        "...r....",
        "....r...",
        ".....r..",
        "pppppp.."
      );

      // Rook rows
      block(
        "........",
        "........",
        "........",
        ".......p",
        "....rp.r",
        "........",
        "........",
        "pp......",
        "r...p..p",
        "p......."
      );

      // Rook labyrinth
      block(
        "........",
        "p.....r.",
        "r.....p.",
        "r....p..",
        "........",
        "...p....",
        "...p....",
        "p..ppppp",
        "........"
      );

      checkPoint(); // CHECK POINT 2

      // First bishop
      block(
        { showThreat: "b" },
        "........",
        "........",
        "........",
        "........",
        "...b....",
        "........",
        "........",
        "........",
        "........"
      );

      // Bishop field
      block(
        "........",
        ".p.p.p..",
        "b.b.b.b.",
        "........",
        "........",
        "........",
        "........",
        "........",
        "........"
      );

      // Rooks & bishops simple
      block(
        "........",
        "r.p..p.r",
        "p......p",
        "........",
        "b      b",
        "pp....pp",
        "........",
        "........"
      );

      // Pawns, bishops, rooks
      block(
        "........",
        "r.......",
        ".r..p..b",
        ".......r",
        "....p...",
        "...p....",
        "..p.....",
        "pp.....p"
      );

      checkPoint(); // CHECK POINT 3

      // First knight
      block(
        { showThreat: "k" },
        "........",
        "........",
        "...k....",
        "........",
        "........",
        "........",
        "........",
        "........"
      );

      // Knight rows
      block(
        "p.......",
        "r.....p.",
        "........",
        "........",
        "......kk",
        "........",
        "pkk.....",
        "........"
      );

      // Rooks, bishop, knight
      block(
        "p...pppp",
        "r....b.r",
        "...p.b.p",
        "........",
        "........",
        "........",
        ".k......",
        "........",
        "........",
        "........"
      );

      checkPoint(); // CHECK POINT 4

      // First land mine
      block(
        { showThreat: "l" },
        "........",
        "........",
        "........",
        "...l....",
        "........",
        "........",
        "........",
        "........"
      );

      // Land mines
      block(
        "l.llllll",
        "l.l....l",
        "..l.llll",
        ".ll.l...",
        "l...l.l.",
        "l.lll.l.",
        "l.....l.",
        "lllllll."
      );

      // Land mines and pawns
      block(
        ".p..pll.",
        ".l.p...l",
        "lpl.p.p.",
        ".....lp.",
        "ll.ll.l.",
        ".l..l...",
        "........",
        "........"
      );

      // Mixed threats
      block(
        "........",
        "..r.....",
        "..llk...",
        "........",
        "...l....",
        "...p..pb",
        ".......l",
        "..p..l..",
        "........",
        "........",
        "........",
        "........",
        "........"
      );

      checkPoint(); // CHECK POINT 5

      // Final castle
      block(
        "........",
        "c.......",
        "........",
        "........",
        "........",
        "........",
        "........"
      );

      this.lastRowIndex = currentRowIndex;

      // Place player
      if (startCheckPointIndex === 0) {
        this.player = this.addPieceAt(this.Piece.HERO_KING, 5, 4).piece;
        this.progress = 2; // Hide starting pawn row
      } else {
        this.progress = this.checkPoints[startCheckPointIndex];
        this.player = this.addPieceAt(
          this.Piece.HERO_KING,
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

    updateIntro() {
      const whiteKing = this.checkBoard[8][3].piece;
      const blackKing = this.player;

      let i, j, cell, row;
      const now = Date.now();
      const init = !this.introStartTime;
      if (init) {
        this.introStartTime = now;
        this.skipIntroTweens();
        if (whiteKing) {
          whiteKing.talking = false;
          whiteKing.talkingStartTime = now;
        }
        blackKing.talking = false;
        blackKing.talkingStartTime = now;
      }

      if (this.introStep === -1) {
        this.shadowCanvas.opacity(0);
        this.skyCanvas.opacity(0);
        this.perspectiveProgress = 0;
        this.update();
        this.lastTime = null;
        this.introStep = 0;
      } else if (this.introStep === 0) {
        // Waiting for space
      } else if (this.introStep === 1) {
        if (init) {
          this.showDialog(true, [
            "Surrender Black King !",
            "Your army is defeated, and your Queen is mine !",
          ]);
          whiteKing.talking = true;
        }
      } else if (this.introStep === 2) {
        if (init) {
          this.hideDialog();
          for (j = 0; j < this.NUM_CELLS; j++) {
            cell = this.checkBoard[0][j];
            this.addIntroTween(
              cell.piece,
              {
                row: 2,
                col: j + (j % 2 === 0 ? 1 : -1),
              },
              j * 0.1,
              0.5
            );
          }
        }
      } else if (this.introStep === 3) {
        if (init) {
          this.showDialog(true, [
            "You thought I'd only bring two knights to battle ?",
            "You are surrounded,",
            "admit defeat now and I shall be merciful.",
          ]);
          whiteKing.talking = true;
        }
      } else if (this.introStep === 4) {
        if (init) {
          this.showDialog(false, ["Never !"]);
          blackKing.talking = true;
        }
      } else if (this.introStep === 5) {
        if (init) {
          this.showDialog(true, [
            "As you wish...",
            "I am taking the prisoner back to the castle.",
            "Knights, capture him, I want him alive.",
          ]);
          whiteKing.talking = true;
        }
      } else if (this.introStep === 6) {
        if (init) {
          this.hideDialog();
          for (j = 2; j <= 5; j++) {
            cell = this.checkBoard[8][j];
            if (cell) {
              this.addIntroTween(cell.piece, { row: 9 }, 0, 0.5);
              this.addIntroTween(cell.piece, { row: 10 }, 1, 0.5);
            }
          }
          this.addIntroTween(
            this.checkBoard[7][3].piece,
            { row: 8, col: 1 },
            0.5,
            0.5
          );
          this.addIntroTween(
            this.checkBoard[7][3].piece,
            { row: 10, col: 2 },
            1.5,
            0.5
          );
          this.addIntroTween(
            this.checkBoard[7][4].piece,
            { row: 8, col: 6 },
            0.5,
            0.5
          );
          this.addIntroTween(
            this.checkBoard[7][4].piece,
            { row: 10, col: 5 },
            1.5,
            0.5
          );
        }
      } else if (this.introStep === 7) {
        if (init) {
          const anim =
            '<animate attributeType="CSS" attributeName="fill" from="red" to="orange" dur="0.5s" repeatCount="indefinite"/>';
          this.showDialog(false, [
            'It looks like our roles are <tspan fill="red" font-family="impact">REVERSED' +
              anim +
              "</tspan> my Queen.",
            "Today, it is my turn to protect you !",
          ]);
          blackKing.talking = true;

          for (i = 1; i < 2 * this.NUM_CELLS; i++) {
            row = this.checkBoard[i];
            if (row) {
              for (j = 0; j < this.NUM_CELLS; j++) {
                cell = row[j];
                if (cell && cell.piece && cell.piece.intro) {
                  this.removeSvgShape(cell.piece);
                  row[j] = {};
                }
              }
            }
          }
        }
      } else if (this.introStep === 8) {
        if (init) {
          this.hideDialog();
          this.pressSpaceText.style.display = "none";
        }
        this.introProgress = ((now - this.introStartTime) * this.MS_TO_S) / 4;
        if (this.introProgress > 1) {
          this.introStep = 9;
        } else {
          this.introProgress = Math.sin((this.introProgress * Math.PI) / 2);
          this.perspectiveProgress = (this.introProgress - 0.2) / 0.6;
          if (this.perspectiveProgress < 0) {
            this.perspectiveProgress = 0;
          } else if (this.perspectiveProgress > 1) {
            this.perspectiveProgress = 1;
          }
          this.shadowCanvas.opacity(this.perspectiveProgress);
          if (this.introProgress > 0.8) {
            this.introScreen.style.opacity = (1 - this.introProgress) / 0.2;
            this.skyCanvas.opacity(1 - this.introScreen.style.opacity);
          }
        }
      }

      if (init) {
        if (!this.introTweens.length) {
          this.pressSpaceText.style.opacity = 1;
        } else {
          this.pressSpaceText.style.opacity = 0;
          const hasText =
            this.introTweens[0].e === this.dialogBox &&
            this.introTweens[0].to._y === this.dialogOpenY;
          const lastTween = this.introTweens[this.introTweens.length - 1];
          const delay = lastTween.du + lastTween.de;
          if (hasText) {
            this.addIntroTween(
              this.pressSpaceText.style,
              { opacity: 1 },
              delay + 2,
              0.1
            );
          } else if (this.introStep > 1 && this.introStep < 8) {
            this.addIntroCallback(this.nextIntroStep, delay);
          }
        }
      }

      this.updateIntroTweens();

      if (this.introStep === 9) {
        this.intro = false;
        this.perspectiveProgress = 1;
        this.introScreen.style.display = "none";
        this.shadowCanvas.opacity(1);
        this.skyCanvas.opacity(1);
        this.pressSpaceText.style.display = "none";
        this.hideDialog();
        this.player.talking = false;
      }

      this.lastTime = now;
    }

    nextIntroStep() {
      this.introStep++;
      this.introStartTime = null;
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
      this.dialogBox.setAttributeNS(null, "y", this.dialogBox._y);
    }

    addPieceAt(type, row, col) {
      const piece = {
        shape: null,
        type: type,
        row: row,
        col: col,
        showThreat: false,
      };
      if (!this.checkBoard[row]) {
        this.checkBoard[row] = [];
      }
      if (!this.checkBoard[row][col]) {
        this.checkBoard[row][col] = {};
      }
      this.checkBoard[row][col].piece = piece;

      //Walls
      if (type == this.Piece.CASTLE) {
        for (let i = 0; i < this.NUM_CELLS; i++) {
          if (i != 3 && i != 4) {
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
      if (col < 0) {
        col = 0;
      } else if (col >= this.NUM_CELLS) {
        col = this.NUM_CELLS - 1;
      }
      const rowMin = Math.floor(this.progress);
      const rowMax = this.topRowDisplayed - 2;
      if (row < rowMin) {
        row = rowMin;
      } else if (row >= rowMax) {
        row = rowMax;
      }
      if (col != oldCol || row != oldRow) {
        const oldCell = this.checkBoard[oldRow][oldCol];
        if (!this.checkBoard[row]) {
          this.checkBoard[row] = [];
        }
        let cell = this.checkBoard[row][col];
        if (!cell) {
          cell = {};
          this.checkBoard[row][col] = cell;
        }
        if (!cell.wall) {
          const threateningCell = this.getThreateningCell(row, col);
          if (threateningCell) {
            this.audio.play("check");
            this.player.invalid = true;
            this.player.invalidCol = col;
            this.player.invalidRow = row;
            this.player.threateningPiece = threateningCell.piece;
            col = oldCol;
            row = oldRow;
            this.checkCount++;
          } else {
            this.player.invalid = false;
            if (cell.piece) {
              this.destroyPiece(cell.piece);
              this.killCount++;
              this.audio.play("capture");
            } else {
              this.audio.play("move");
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
          if (row >= this.lastRowIndex) {
            this.setGameIsOver(true, true);
          }
        }
      }
    }

    getThreateningCell(row, col) {
      let threateningCell;
      //land mine
      threateningCell = this.getCellWithPieceAt(row, col, this.Piece.LAND_MINE);
      if (threateningCell) {
        return threateningCell;
      }
      //pawns
      threateningCell =
        this.getCellWithPieceAt(row + 1, col - 1, this.Piece.PAWN) ||
        this.getCellWithPieceAt(row + 1, col + 1, this.Piece.PAWN);
      if (threateningCell) {
        return threateningCell;
      }
      //ROOK
      let i, j, cell;
      //Check left
      for (j = col - 1; j >= 0; j--) {
        cell = this.getCellWithPieceAt(row, j);
        if (cell && cell.piece) {
          if (cell.piece.type == this.Piece.ROOK) {
            return cell;
          } else {
            break;
          }
        }
      }
      //Check right
      for (j = col + 1; j <= this.NUM_CELLS; j++) {
        cell = this.getCellWithPieceAt(row, j);
        if (cell && cell.piece) {
          if (cell.piece.type == this.Piece.ROOK) {
            return cell;
          } else {
            break;
          }
        }
      }
      //Check up
      for (i = row + 1; i <= row + this.NUM_CELLS; i++) {
        cell = this.getCellWithPieceAt(i, col);
        if (cell && cell.piece) {
          if (cell.piece.type == this.Piece.ROOK) {
            return cell;
          } else {
            break;
          }
        }
      }
      //Check down
      for (i = row - 1; i >= row - this.NUM_CELLS; i--) {
        cell = this.getCellWithPieceAt(i, col);
        if (cell && cell.piece) {
          if (cell.piece.type == this.Piece.ROOK) {
            return cell;
          } else {
            break;
          }
        }
      }

      //BISHOP
      //diag bottom left
      for (j = col - 1, i = row - 1; j >= 0; j--, i--) {
        cell = this.getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type == this.Piece.BISHOP) {
            return cell;
          } else {
            break;
          }
        }
      }
      //diag bottom right
      for (j = col + 1, i = row - 1; j < this.NUM_CELLS; j++, i--) {
        cell = this.getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type == this.Piece.BISHOP) {
            return cell;
          } else {
            break;
          }
        }
      }
      //diag top left
      for (j = col - 1, i = row + 1; j >= 0; j--, i++) {
        cell = this.getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type == this.Piece.BISHOP) {
            return cell;
          } else {
            break;
          }
        }
      }
      //diag top right
      for (j = col + 1, i = row + 1; j < this.NUM_CELLS; j++, i++) {
        cell = this.getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type == this.Piece.BISHOP) {
            return cell;
          } else {
            break;
          }
        }
      }
      threateningCell =
        this.getCellWithPieceAt(row + 2, col - 1, this.Piece.KNIGHT) ||
        this.getCellWithPieceAt(row - 2, col - 1, this.Piece.KNIGHT) ||
        this.getCellWithPieceAt(row + 2, col + 1, this.Piece.KNIGHT) ||
        this.getCellWithPieceAt(row - 2, col + 1, this.Piece.KNIGHT) ||
        this.getCellWithPieceAt(row + 1, col - 2, this.Piece.KNIGHT) ||
        this.getCellWithPieceAt(row - 1, col - 2, this.Piece.KNIGHT) ||
        this.getCellWithPieceAt(row + 1, col + 2, this.Piece.KNIGHT) ||
        this.getCellWithPieceAt(row - 1, col + 2, this.Piece.KNIGHT);
      return threateningCell;
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
        piece.shape.style.opacity = piece.opacity;
        if (piece.scale > 0) {
          piece.shape.setAttributeNS(
            null,
            "transform",
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
      }

      // Important: elements added to top -> prepend to maintain draw order
      if (this.svgPiecesLayer.firstChild && !piece.onTop) {
        this.svgPiecesLayer.insertBefore(shape, this.svgPiecesLayer.firstChild);
      } else {
        this.svgPiecesLayer.appendChild(shape);
      }

      if (piece.shape) {
        throw new Error("Piece already has a shape");
      }

      piece.shape = shape;
      shape.style.filter = "none";
    }

    removeSvgShape(piece) {
      if (piece.shape) {
        this.svgCache[piece.type].push(piece.shape);
        this.svgPiecesLayer.removeChild(piece.shape);
        piece.shape = null;
      }
    }

    showDialog(whiteKing, texts) {
      if (whiteKing) {
        this.svgInnerHtml(this.dialogSpeakerText, "White King :");
      } else {
        this.svgInnerHtml(this.dialogSpeakerText, "Black King :");
      }

      let txt = "";
      for (let i = 0; i < texts.length; i++) {
        txt += `<tspan x="10" ${i === 0 ? "" : 'dy="1.2em"'}>${
          texts[i]
        }</tspan>`;
      }
      this.svgInnerHtml(this.dialogText, txt);

      this.addIntroTween(this.dialogBox, { _y: this.dialogOpenY }, 0, 0.5);
    }

    hideDialog() {
      this.addIntroTween(this.dialogBox, { _y: this.dialogCloseY }, 0, 0.5);
    }

    restart(checkPointIndex) {
      // Find the checkpoint we were at
      checkPointIndex ??= this.checkPoints.length - 1;
      for (let i = 0; i < this.checkPoints.length; i++) {
        if (this.progress < this.checkPoints[i]) {
          if (i > 0) {
            checkPointIndex = i - 1;
          }
          break;
        }
      }

      // Reinitialize game
      this.initCheckBoard(checkPointIndex);

      // Prepare next update
      this.lastTime = null;
      this.topRowDisplayed = -1;
      this.checkMateCount++;
    }

    tic() {
      this.input.processInput();
      if (!this.gameIsOver) {
        if (this.intro) {
          this.updateIntro();
        } else {
          this.update();
        }
        this.render();
      }
      if (this.raf && this.isDocumentActive) {
        requestAnimationFrame(() => this.tic());
      }
    }

    setGameIsOver(val, win) {
      if (win) {
        this.raf = false;
        this.gameIsOver = true;
        this.winScreen.style.display = "block";
        this.audio.play("win");
      } else {
        if (val != this.gameIsOver) {
          this.gameIsOver = val;
          if (this.gameIsOver) {
            this.gameOverScreen.style.display = "block";
          } else {
            this.gameOverScreen.style.display = "none";
            this.restart();
          }
        }
      }
    }

    update() {
      const now = Date.now();
      if (this.lastTime) {
        this.progress +=
          this.progressPerSec * (now - this.lastTime) * this.MS_TO_S;
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
        this.audio.play("checkmate");
      }

      //update checkboard based on progress
      const topRow = Math.floor(this.progress) + this.NUM_CELLS_DISPLAYED;
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
              if (row[index] && row[index].piece) {
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

      // Update pieces
      let pieceAfterPlayer;
      let row;
      for (
        let rowIndex = this.topRowDisplayed - this.NUM_CELLS_DISPLAYED - 5;
        rowIndex <= this.topRowDisplayed;
        rowIndex++
      ) {
        row = this.checkBoard[rowIndex];
        if (row) {
          for (let colIndex = 0; colIndex < this.NUM_CELLS; colIndex++) {
            if (row[colIndex] && row[colIndex].piece) {
              const piece = row[colIndex].piece;
              const res = this.computeCellPos(piece.row, piece.col);
              Object.assign(piece, res);
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
        }
      }

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
            this.player.threateningPiece.shape.style.filter = "none";
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

      // Update removed pieces
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

          // Mouse over highlight
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

          row = this.checkBoard[i + progressIndex];
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

    /** Create a <g> definition for a piece (used in <defs>) */
    makeDef(id, shapes, skipShadow = false) {
      const xmlns = "http://www.w3.org/2000/svg";
      const def = document.createElementNS(xmlns, "g");
      def.setAttributeNS(null, "id", id);
      if (!skipShadow) def.appendChild(this.makeShadow());
      for (const shape of shapes) {
        // circles / paths are already positioned relative to the piece origin
        if (shape.getAttributeNS(null, "x")) {
          // keep existing x/y (used for rects â€“ not needed here)
        } else {
          shape.setAttributeNS(null, "x", -this.CELL_SIZE / 2);
          shape.setAttributeNS(null, "y", -this.CELL_SIZE);
        }
        def.appendChild(shape);
      }
      this.defs.appendChild(def);
      return def;
    }

    makeFilter(id) {
      const def = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter"
      );
      def.setAttributeNS(null, "id", id);
      this.svgAttrs(def, {
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        "color-interpolation-filters": "sRGB",
      });
      this.svgInnerHtml(
        def,
        '<feFlood flood-color="rgba(255,0,0,0.3)" result="COLOR"></feFlood>' +
          '<feComposite operator="atop" in="COLOR" in2="SourceGraphic"></feComposite>'
      );
      this.defs.appendChild(def);
      return def;
    }

    /** Piece shadow (ellipse) */
    makeShadow(ox = 5, oy = 8) {
      const shadow = this.makeEllipse(ox, oy, 3.1, 1.8);
      this.svgStyle(shadow, "rgba(0,0,0,0.2)", "none");
      return shadow;
    }

    /** <circle> */
    makeCircle(cx, cy, r, ox = 5, oy = 8) {
      const xmlns = "http://www.w3.org/2000/svg";
      const circle = document.createElementNS(xmlns, "circle");
      this.svgAttrs(circle, {
        cx: this.svgFloat(cx - ox),
        cy: this.svgFloat(cy - oy),
        r: this.svgFloat(r),
      });
      return circle;
    }

    /** <ellipse> */
    makeEllipse(cx, cy, rx, ry, ox = 5, oy = 8) {
      const xmlns = "http://www.w3.org/2000/svg";
      const ellipse = document.createElementNS(xmlns, "ellipse");
      this.svgAttrs(ellipse, {
        cx: this.svgFloat(cx - ox),
        cy: this.svgFloat(cy - oy),
        rx: this.svgFloat(rx),
        ry: this.svgFloat(ry),
      });
      return ellipse;
    }

    /** <path> */
    makePath(list, style = null, ox = 5, oy = 8) {
      const xmlns = "http://www.w3.org/2000/svg";
      const path = document.createElementNS(xmlns, "path");
      path.setAttributeNS(null, "d", this.makePathString(list, ox, oy));
      if (style) this.svgAttrs(path, style);
      return path;
    }

    /** Build the "d" attribute string from a list of commands/coords */
    makePathString(list, ox = 5, oy = 8) {
      let path = "";
      for (let i = 0; i < list.length; i++) {
        let e = list[i];
        if (typeof e == "object") {
          e = this.svgFloat(e[0] - ox) + "," + this.svgFloat(e[1] - oy);
        }
        path += e + " ";
      }
      return path;
    }

    /** <use> element that references a definition */
    makeUse(id, attrs = {}) {
      const xmlns = "http://www.w3.org/2000/svg";
      const xlinkns = "http://www.w3.org/1999/xlink";
      const use = document.createElementNS(xmlns, "use");
      this.svgAttrs(use, attrs);
      use.setAttributeNS(xlinkns, "xlink:href", "#" + id);
      use.setAttribute("xmlns:xlink", xlinkns);
      return use;
    }

    /** Round a float for SVG coordinates (CELL_SIZE * f ? 0.1 precision) */
    svgFloat(f) {
      return Math.round(this.CELL_SIZE * f) * 0.1;
    }

    /** <text> definition for the "CHECK" label */
    makeCheckTextDef(id, text) {
      const xmlns = "http://www.w3.org/2000/svg";
      const txt = document.createElementNS(xmlns, "text");
      txt.setAttributeNS(null, "id", id);
      this.svgAttrs(txt, {
        x: "-40",
        "font-size": "28",
        fill: "red",
        stroke: "black",
        "stroke-width": "1",
        "font-family": "Impact",
      });
      this.svgInnerHtml(txt, text);
      this.defs.appendChild(txt);
    }

    /** Game-over overlay */
    makeGameOverScreen() {
      const xmlns = "http://www.w3.org/2000/svg";
      this.gameOverScreen = document.createElementNS(xmlns, "g");
      this.gameOverScreen.style.display = "none";
      this.svgElem.appendChild(this.gameOverScreen);

      const rect = document.createElementNS(xmlns, "rect");
      this.svgAttrs(rect, {
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        fill: "rgba(0,0,0,0.5)",
      });
      this.gameOverScreen.appendChild(rect);

      const title = document.createElementNS(xmlns, "text");
      this.svgAttrs(title, {
        x: "50%",
        y: "50%",
        "font-size": "48px",
        fill: "orange",
        stroke: "red",
        "stroke-width": "2px",
        "text-anchor": "middle",
        "font-family": "Impact",
      });
      this.svgInnerHtml(title, "CHECKMATE !");
      this.gameOverScreen.appendChild(title);

      const hint = document.createElementNS(xmlns, "text");
      this.svgAttrs(hint, {
        x: "50%",
        y: "60%",
        "font-size": "22px",
        fill: "white",
        stroke: "black",
        "stroke-width": "1px",
        "text-anchor": "middle",
        "font-family": "Impact",
      });
      this.svgInnerHtml(
        hint,
        `<tspan x="50%">Press <tspan style="fill:orange;">SPACE</tspan> or <tspan style="fill:orange;">CLICK</tspan></tspan>` +
          `<tspan x="50%" dy="1.5em">to restart from the last checkpoint.</tspan>`
      );
      this.gameOverScreen.appendChild(hint);
    }

    /** Intro title screen */
    makeIntroScreen() {
      const xmlns = "http://www.w3.org/2000/svg";
      this.introScreen = document.createElementNS(xmlns, "g");
      this.svgElem.appendChild(this.introScreen);

      const rect = document.createElementNS(xmlns, "rect");
      this.svgAttrs(rect, {
        x: 0,
        y: 0,
        width: "100%",
        height: this.HORIZON_Y,
        fill: "#FF8601",
        stroke: "#000",
      });
      this.introScreen.appendChild(rect);

      const title = document.createElementNS(xmlns, "text");
      this.svgAttrs(title, {
        x: "50%",
        y: "60",
        "font-size": "48px",
        fill: "orange",
        stroke: "red",
        "stroke-width": "2px",
        "text-anchor": "middle",
        "font-family": "Impact",
      });
      this.svgInnerHtml(
        title,
        'CHESS<tspan style="font-style:italic;">PURSUIT</tspan>'
      );
      this.introScreen.appendChild(title);
    }

    /** "Press SPACE or CLICK" prompt */
    makePressSpaceText() {
      const xmlns = "http://www.w3.org/2000/svg";
      this.pressSpaceText = document.createElementNS(xmlns, "text");
      this.svgAttrs(this.pressSpaceText, {
        x: "50%",
        y: this.HORIZON_Y + this.SIZE - 10,
        "font-size": "22px",
        fill: "white",
        stroke: "black",
        "stroke-width": "1px",
        "text-anchor": "middle",
        "font-family": "Impact",
      });
      this.svgInnerHtml(
        this.pressSpaceText,
        'Press <tspan style="fill:orange;">SPACE</tspan> or <tspan style="fill:orange;">CLICK</tspan>'
      );
      this.svgElem.appendChild(this.pressSpaceText);
    }

    /** Paused overlay */
    makePauseText() {
      const xmlns = "http://www.w3.org/2000/svg";
      this.pauseText = document.createElementNS(xmlns, "text");
      this.svgAttrs(this.pauseText, {
        x: "50%",
        y: "50%",
        "font-size": "32px",
        fill: "orange",
        stroke: "black",
        "stroke-width": "1px",
        "text-anchor": "middle",
        "font-family": "Impact",
      });
      this.svgInnerHtml(this.pauseText, "PAUSED");
      this.pauseText.style.display = "none";
      this.svgElem.appendChild(this.pauseText);
    }

    /** Dialog box (slides in from bottom) */
    makeDialogBox() {
      const xmlns = "http://www.w3.org/2000/svg";
      const width = this.SIZE - 2 * this.DIALOG_MARGIN;
      const height = 0.3 * this.SIZE - 2 * this.DIALOG_MARGIN;

      this.dialogCloseY = this.SIZE + this.HORIZON_Y;
      this.dialogOpenY =
        this.HORIZON_Y + this.SIZE - height - this.DIALOG_MARGIN;

      this.dialogBox = document.createElementNS(xmlns, "svg");
      this.dialogBox._y = this.dialogCloseY; // used for tweening
      this.svgAttrs(this.dialogBox, {
        x: this.DIALOG_MARGIN,
        y: this.dialogCloseY,
        width,
        height,
      });
      this.svgElem.appendChild(this.dialogBox);

      const rect = document.createElementNS(xmlns, "rect");
      this.svgAttrs(rect, {
        width: "100%",
        height: "100%",
        fill: "rgba(0,0,0,0.8)",
        stroke: "#fff",
        "stroke-width": 2,
      });
      this.dialogBox.appendChild(rect);

      this.dialogSpeakerText = document.createElementNS(xmlns, "text");
      this.svgAttrs(this.dialogSpeakerText, {
        x: 10,
        y: 20,
        "font-size": "18px",
        fill: "#fff",
        "text-anchor": "left",
        "font-family": "Impact",
      });
      this.dialogBox.appendChild(this.dialogSpeakerText);

      this.dialogText = document.createElementNS(xmlns, "text");
      this.svgAttrs(this.dialogText, {
        x: 10,
        y: 40,
        "font-size": "16px",
        fill: "#fff",
        "text-anchor": "left",
        "font-family": "sans-serif",
      });
      this.dialogBox.appendChild(this.dialogText);
    }

    /** Win screen */
    makeWinScreen() {
      const xmlns = "http://www.w3.org/2000/svg";
      this.winScreen = document.createElementNS(xmlns, "g");
      this.winScreen.style.display = "none";
      this.svgElem.appendChild(this.winScreen);

      const rect = document.createElementNS(xmlns, "rect");
      this.svgAttrs(rect, {
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        fill: "rgba(0,0,0,0.5)",
      });
      this.winScreen.appendChild(rect);

      const title = document.createElementNS(xmlns, "text");
      this.svgAttrs(title, {
        x: "50%",
        y: "50%",
        "font-size": "48px",
        fill: "#5f7",
        stroke: "black",
        "stroke-width": "2px",
        "text-anchor": "middle",
        "font-family": "Impact",
      });
      this.svgInnerHtml(title, "YOU WIN !");
      this.winScreen.appendChild(title);

      const hint = document.createElementNS(xmlns, "text");
      this.svgAttrs(hint, {
        x: "50%",
        y: "60%",
        "font-size": "22px",
        fill: "white",
        stroke: "black",
        "stroke-width": "1px",
        "text-anchor": "middle",
        "font-family": "Impact",
      });
      this.svgInnerHtml(hint, "Alas, your Queen is in another castle...");
      this.winScreen.appendChild(hint);
    }

    /** Parse HTML string into SVG nodes (needed for <tspan>) */
    svgInnerHtml(svg, html) {
      // Re-use a single temporary div to avoid creating many
      if (!this._svgTmpDiv) this._svgTmpDiv = document.createElement("div");
      const wrapper = `<svg>${html}</svg>`;
      this._svgTmpDiv.innerHTML = wrapper;
      const nodes = Array.from(this._svgTmpDiv.firstChild.childNodes);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      nodes.forEach((node) => svg.appendChild(node));
    }

    /** Set multiple attributes on an SVG element */
    svgAttrs(el, attrs) {
      if (attrs) {
        for (const key in attrs) {
          el.setAttributeNS(null, key, attrs[key]);
        }
      }
      return el;
    }

    /** Convenience for fill / stroke */
    svgStyle(svgElem, fill, stroke, strokeWidth) {
      const attrs = {};
      if (fill !== undefined) attrs.fill = fill;
      if (stroke !== undefined) attrs.stroke = stroke;
      if (strokeWidth !== undefined) attrs["stroke-width"] = strokeWidth;
      return this.svgAttrs(svgElem, attrs);
    }
  }

  hook.loadChessPursuit = function (gameContainer) {
    const game = new ChessPursuitGame();
    game.load(gameContainer);
    return () => game.setGameIsOver(true);
  };
})(window.LiChessTools || window);
