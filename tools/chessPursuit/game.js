(function (hook) {
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
  }

  hook.loadChessPursuit = function (gameContainer) {
    "use strict";

    const aa = new ArcadeAudio();
    aa.add('check', 1, [[2,, 0.1747,, 0.1291, 0.6731, 0.2, -0.2999,,,,,, 0.4368, 0.1862,, 0.28,, 1,,, 0.1596,, 0.5]]);
    aa.add('move', 5, [[3,, 0.0316,, 0.1483, 0.5871,, -0.6609,,,,,,,,,,, 1,,, 0.0227,, 0.25]]);
    aa.add('capture', 5, [[0,, 0.3065,, 0.2516, 0.36,, 0.1584,,,,,, 0.1149,,,,, 1,,, 0.2188,, 0.25]]);
    aa.add('checkmate', 1, [[1,, 0.2402,, 0.3917, 0.2242,, 0.1535,,,,,,,, 0.5609,,, 1,,,,, 0.5]]);

    var win = window;
    var document = win.document;
    var root = gameContainer;
    var Math = win.Math;
    var PI = Math.PI;

    //------------------------------------------------------------------------------------------------------------------
    // sizes and DOM
    //------------------------------------------------------------------------------------------------------------------

    var SCALE = 1;
    var HORIZON_Y = 100 * SCALE;
    var SIZE = 400 * SCALE;
    var NUM_CELLS = 8;
    var CELL_SIZE = SIZE / NUM_CELLS;
    var NUM_CELLS_DISPLAYED = NUM_CELLS * 2 + 3;
    var DIALOG_MARGIN = 6;
    var bgCanvas = makeCanvas(SIZE, SIZE, "bg");
    var bgCtx = getContext(bgCanvas);
    var shadowCanvas = makeCanvas(SIZE, SIZE, "shadow");
    var shadowCtx = getContext(shadowCanvas);
    var skyCanvas = makeCanvas(SIZE, 2 * SIZE, "sky");
    var skyCtx = getContext(skyCanvas);

    //------------------------------------------------------------------------------------------------------------------
    // game logic
    //------------------------------------------------------------------------------------------------------------------

    var now = 0; //Date.now(), set on update
    var lastTime;
    var MS_TO_S = 1 / 1000;
    var killCount = 0;
    var checkMateCount = 0;
    var checkCount = 0;
    var winScreen = null;
    var gameOverScreen = null;
    var gameIsOver = false;
    var autoMove = false;
    var progress = 0; //expressed as a number of rows
    var progressPerSec = 1; //1
    var checkBoard = null;
    var checkPoints = null;
    var topRowDisplayed = -1;
    var raf = true;
    var isDocumentActive = true;
    var removedPieces = [];
    var lastRowIndex;
    var player = null;
    var playerAnimDuration = 0.05;
    var playerInvalidDuration = 0.5;
    var pressSpaceText = null;
    var pauseText = null;
    var introScreen = null;
    var intro = true;
    var introStartTime;
    var perspectiveProgress = 0;
    var introProgress = 0;
    var introStep = -1;
    var dialogBox;
    var dialogSpeakerText;
    var dialogText;
    var checkText;

    //pieces id (used in SVG and checkboard)
    var HERO_KING = "h";
    var ENEMY_KING = "e";
    var PAWN = "p";
    var ROOK = "r";
    var BISHOP = "b";
    var KNIGHT = "k";
    var LAND_MINE = "l";
    var WAR_BEAR = "w";
    var CASTLE = "c";
    var QUEEN = "q";

    //other SCG ids
    var ENEMY_FILTER = "ef";
    var CHECK_TEXT = "ct";

    //------------------------------------------------------------------------------------------------------------------
    // initialization
    //------------------------------------------------------------------------------------------------------------------

    function init() {
      initCheckBoardCanvas();
      initSkyCanvas();
      initSvg();
      initShadowCanvas();

      //intro = false;
      initCheckBoard(0);
      tic();
    }

    //------------------------------------------------------------------------------------------------------------------
    // checkboard management
    //------------------------------------------------------------------------------------------------------------------

    function restart(checkPointIndex) {
      //find we checkpoint we were at
      checkPointIndex || (checkPointIndex = checkPoints.length - 1);
      for (var i = 0; i < checkPoints.length; i++) {
        if (progress < checkPoints[i]) {
          if (i > 0) {
            checkPointIndex = i - 1;
          }
          break;
        }
      }
      //reinitialize game
      initCheckBoard(checkPointIndex);
      //prepare next update
      lastTime = null;
      topRowDisplayed = -1;
      checkMateCount++;
    }
    function initCheckBoard(startCheckPointIndex) {
      if (checkBoard) {
        destroyCheckBoard();
      }
      checkBoard = [];
      checkPoints = [0];
      var CHECK_POINT_HEIGHT = 5;
      var currentRowIndex = 0;

      //0 TODO: intro: first pawn
      block(
        {
          intro: true,
        },
        "........",
        "........",
        "........",
        intro 
          ? "..reqr.."
          : "........",
        intro 
          ? "...kk..." 
          : "........",
        "........",
        "........",
        "........",
        "........",
        "........",
        "........",
        "kkkkkkkk"
      );

      // first pawn
      block(
        {
          showThreat: "p",
        },
        "........",
        "........",
        "....p...",
        "........",
        "........",
        "........",
        "........",
        "........"
      );

      // scattered pawns
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

      // pawn rows
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

      // triangle
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

      // sawtooth
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

      // wedges
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

      //CHECK POINT 1
      checkPoint();

      // first rook
      block(
        {
          showThreat: "r",
        },
        "........",
        "...p....",
        "........",
        "...r....",
        "........",
        "...p....",
        "........",
        "........"
      );

      // rook diag
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

      // rook rows
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

      // rook labyrinth
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

      //CHECK POINT 2
      checkPoint();

      //10 first bishop
      block(
        {
          showThreat: "b",
        },
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

      //11 bishop field
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

      //12 rooks & bishops simple
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

      //13 pawns, bishops and rooks
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

      //CHECK POINT 3
      checkPoint();

      //14 first knight
      block(
        {
          showThreat: "k",
        },
        "........",
        "........",
        "...k....",
        "........",
        "........",
        "........",
        "........",
        "........"
      );

      //15 knight rows
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

      //rooks bishop and knight
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

      //CHECK POINT 4
      checkPoint();

      //first land mine
      block(
        {
          showThreat: "l",
        },
        "........",
        "........",
        "........",
        "...l....",
        "........",
        "........",
        "........",
        "........"
      );

      //land mines
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

      //land mines and pawns
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

      //k,r,b,p,l
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

      //CHECK POINT 5
      checkPoint();

      block(
        "........", 
        "c.......",
        "........",
        "........",
        "........",
        "........",
        "........"
      );


      lastRowIndex = currentRowIndex;
      if (startCheckPointIndex === 0) {
        //Add player
        player = addPieceAt(HERO_KING, 5, 4).piece;
        progress = 2; //hide starting pawn row
      } else {
        progress = checkPoints[startCheckPointIndex];
        player = addPieceAt(HERO_KING, progress, 3).piece;
        progress -= 4;
      }
      function checkPoint() {
        var center = Math.ceil(CHECK_POINT_HEIGHT / 2);
        checkPoints.push(currentRowIndex + center);
        for (var i = 0; i < CHECK_POINT_HEIGHT; i++) {
          checkBoard[currentRowIndex] = [];
          if (i == center) {
            for (var j = 0; j < NUM_CELLS; j++) {
              checkBoard[currentRowIndex][j] = {
                checkPoint: true,
              };
            }
          }
          currentRowIndex++;
        }
      }

      //Create a block of 8/8
      function block(...args) {
        var options;
        if (typeof args[0] == "object") {
          options = args.shift();
        } else {
          options = {};
        }
        var showThreatCell;
        var doAdd = startCheckPointIndex < checkPoints.length;
        var startRowIndex = currentRowIndex;
        var row, i, j;
        for (i = args.length - 1; i >= 0; i--) {
          row = args[i];
          if (row.length > NUM_CELLS) throw new Error();
          checkBoard[currentRowIndex] = [];
          if (doAdd) {
            if (row !== "") {
              for (j = 0; j < row.length; j++) {
                var char = row.charAt(j);
                if (char !== " " && char !== ".") {
                  var lowerChar = char.toLowerCase();
                  var pieceCell = addPieceAt(lowerChar, currentRowIndex, j);
                  if (options.showThreat == lowerChar) {
                    showThreatCell = checkBoard[currentRowIndex][j];
                  }
                  if (char != lowerChar) {
                    //TODO: allied pieces
                  }
                  if (options.intro) {
                    pieceCell.piece.intro = true;
                  }
                }
              }
            }
          }
          currentRowIndex++;
        }
        if (showThreatCell) {
          showThreatCell.piece.showThreat = true;
          for (i = startRowIndex; i < currentRowIndex; i++) {
            row = checkBoard[i];
            for (j = 0; j < NUM_CELLS; j++) {
              var cell = getThreateningCell(i, j);
              if (cell && cell.piece == showThreatCell.piece) {
                if (!checkBoard[i][j]) {
                  checkBoard[i][j] = {};
                }
                checkBoard[i][j].showThreat = true;
              }
            }
          }
        }
      }
    }
    function destroyCheckBoard() {
      for (var row in checkBoard) {
        if (checkBoard[row]) {
          for (var col in checkBoard[row]) {
            var cell = checkBoard[row][col];
            if (cell && cell.piece) {
              removeSvgShape(cell.piece);
            }
          }
        }
      }
    }
    function addPieceAt(type, row, col) {
      var piece = {
        shape: null,
        type: type,
        row: row,
        col: col,
        showThreat: false,
      };
      if (!checkBoard[row]) {
        checkBoard[row] = [];
      }
      if (!checkBoard[row][col]) {
        checkBoard[row][col] = {};
      }
      checkBoard[row][col].piece = piece;

      //Walls
      if (type == CASTLE) {
        for (var i = 0; i < NUM_CELLS; i++) {
          if (i != 3 && i != 4) {
            if (!checkBoard[row][i]) {
              checkBoard[row][i] = {};
            }
            checkBoard[row][i].wall = true;
          }
        }
      }
      return checkBoard[row][col];
    }
    function movePlayer(row, col) {
      var oldCol = player.col;
      var oldRow = player.row;
      if (col < 0) {
        col = 0;
      } else if (col >= NUM_CELLS) {
        col = NUM_CELLS - 1;
      }
      var rowMin = Math.floor(progress);
      var rowMax = topRowDisplayed - 2;
      if (row < rowMin) {
        row = rowMin;
      } else if (row >= rowMax) {
        row = rowMax;
      }
      if (col != oldCol || row != oldRow) {
        var oldCell = checkBoard[oldRow][oldCol];
        if (!checkBoard[row]) {
          checkBoard[row] = [];
        }
        var cell = checkBoard[row][col];
        if (!cell) {
          cell = {};
          checkBoard[row][col] = cell;
        }
        if (!cell.wall) {
          //can cell be taken ?
          var threateningCell = getThreateningCell(row, col);
          if (threateningCell) {
            aa.play("check");
            //invalid position
            player.invalid = true;
            player.invalidCol = col;
            player.invalidRow = row;
            player.threateningPiece = threateningCell.piece;
            col = oldCol;
            row = oldRow;
            checkCount++;
          } else {
            player.invalid = false;
            if (cell.piece) {
              //take the piece
              destroyPiece(cell.piece);
              killCount++;
              aa.play("capture");
            } else {
              aa.play("move");
            }
            //move piece on check board
            oldCell.piece = null;
            cell.piece = player;
          }
          player.oldCol = oldCol;
          player.oldRow = oldRow;
          player.anim = true;
          player.animStartTime = now;
          player.col = col;
          player.row = row;
          if (row >= lastRowIndex) {
            setGameIsOver(true, true);
          }
        }
      }
    }
    function getThreateningCell(row, col) {
      var threateningCell;
      //land mine
      threateningCell = getCellWithPieceAt(row, col, LAND_MINE);
      if (threateningCell) {
        return threateningCell;
      }
      //pawns
      threateningCell =
        getCellWithPieceAt(row + 1, col - 1, PAWN) ||
        getCellWithPieceAt(row + 1, col + 1, PAWN);
      if (threateningCell) {
        return threateningCell;
      }
      //ROOK
      var i, j, cell;
      //Check left
      for (j = col - 1; j >= 0; j--) {
        cell = getCellWithPieceAt(row, j);
        if (cell && cell.piece) {
          if (cell.piece.type == ROOK) {
            return cell;
          } else {
            break;
          }
        }
      }
      //Check right
      for (j = col + 1; j <= NUM_CELLS; j++) {
        cell = getCellWithPieceAt(row, j);
        if (cell && cell.piece) {
          if (cell.piece.type == ROOK) {
            return cell;
          } else {
            break;
          }
        }
      }
      //Check up
      for (i = row + 1; i <= row + NUM_CELLS; i++) {
        cell = getCellWithPieceAt(i, col);
        if (cell && cell.piece) {
          if (cell.piece.type == ROOK) {
            return cell;
          } else {
            break;
          }
        }
      }
      //Check down
      for (i = row - 1; i >= row - NUM_CELLS; i--) {
        cell = getCellWithPieceAt(i, col);
        if (cell && cell.piece) {
          if (cell.piece.type == ROOK) {
            return cell;
          } else {
            break;
          }
        }
      }

      //BISHOP
      //diag bottom left
      for (j = col - 1, i = row - 1; j >= 0; j--, i--) {
        cell = getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type == BISHOP) {
            return cell;
          } else {
            break;
          }
        }
      }
      //diag bottom right
      for (j = col + 1, i = row - 1; j < NUM_CELLS; j++, i--) {
        cell = getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type == BISHOP) {
            return cell;
          } else {
            break;
          }
        }
      }
      //diag top left
      for (j = col - 1, i = row + 1; j >= 0; j--, i++) {
        cell = getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type == BISHOP) {
            return cell;
          } else {
            break;
          }
        }
      }
      //diag top right
      for (j = col + 1, i = row + 1; j < NUM_CELLS; j++, i++) {
        cell = getCellWithPieceAt(i, j);
        if (cell && cell.piece) {
          if (cell.piece.type == BISHOP) {
            return cell;
          } else {
            break;
          }
        }
      }
      threateningCell =
        getCellWithPieceAt(row + 2, col - 1, KNIGHT) ||
        getCellWithPieceAt(row - 2, col - 1, KNIGHT) ||
        getCellWithPieceAt(row + 2, col + 1, KNIGHT) ||
        getCellWithPieceAt(row - 2, col + 1, KNIGHT) ||
        getCellWithPieceAt(row + 1, col - 2, KNIGHT) ||
        getCellWithPieceAt(row - 1, col - 2, KNIGHT) ||
        getCellWithPieceAt(row + 1, col + 2, KNIGHT) ||
        getCellWithPieceAt(row - 1, col + 2, KNIGHT);
      return threateningCell;
    }
    function getCellWithPieceAt(row, col, type) {
      var rowArray = checkBoard[row];
      if (rowArray) {
        var cell = rowArray[col];
        if (cell && cell.piece && (!type || cell.piece.type == type)) {
          return cell;
        }
      }
    }
    function destroyPiece(piece) {
      removedPieces.push(piece);
      piece.removedTime = now;
      piece.justRemoved = true;
      if (piece.showThreat) {
        //not very subtle but does the job, just scan everything in a wide range, we ensure it won't be a problem when building the checkboard
        for (var i = piece.row - NUM_CELLS; i < piece.row + NUM_CELLS; i++) {
          var rowContent = checkBoard[i];
          if (rowContent) {
            for (
              var j = piece.col - NUM_CELLS;
              j < piece.col + NUM_CELLS;
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

    //------------------------------------------------------------------------------------------------------------------
    //  game loop
    //------------------------------------------------------------------------------------------------------------------

    function tic() {
      if (gameIsOver) {
        if (keys.space === 0 || mouse.click) {
          setGameIsOver(false);
          keys.space = -1;
        }
      } else {
        if (!intro) {
          processInput();
          update();
        } else {
          if (introStep >= 0) {
            if (keys.space === 0 || mouse.click) {
              keys.space = -1;
              nextIntroStep();
            }
          }
          updateIntro();
        }
        render();
      }
      mouse.click = false;
      if (raf && isDocumentActive) {
        requestAnimationFrame(tic);
      }
    }
    function setGameIsOver(val, win) {
      if (win) {
        raf = false;
        gameIsOver = true;
        winScreen.style.display = "block";
      } else {
        if (val != gameIsOver) {
          gameIsOver = val;
          if (gameIsOver) {
            gameOverScreen.style.display = "block";
          } else {
            gameOverScreen.style.display = "none";
            restart();
          }
        }
      }
    }

    //------------------------------------------------------------------------------------------------------------------
    //  game update
    //------------------------------------------------------------------------------------------------------------------

    //input
    var KEY_LATENCY = 6;
    var KEY_DONE = -1;
    var keysBlockedUntilAllUp = false;
    var mouse = {};
    var mouseRow = -1;
    var mouseCol = -1;
    function processInput() {
      if (topRowDisplayed <= 0) {
        return;
      }
      if (player.invalid || intro) {
        //can't during animation
        return;
      }
      var dx = 0;
      var dy = 0;
      if (!keysBlockedUntilAllUp) {
        //read keys that were just released or that were pressed just a few frames ago
        //this leaves some time for a combination (ie: up+right)
        if (keys.down == KEY_LATENCY || keys.down === 0) {
          dy = -1;
        }
        if (keys.up == KEY_LATENCY || keys.up === 0) {
          dy = 1;
        }
        if (keys.left == KEY_LATENCY || keys.left === 0) {
          dx = -1;
        }
        if (keys.right == KEY_LATENCY || keys.right === 0) {
          dx = 1;
        }
        if (dx || dy) {
          //look for a combo: another key that was pressed during the latency
          if (!dx) {
            if (keys.left <= KEY_LATENCY && keys.left > 0) {
              dx = -1;
            }
            if (keys.right <= KEY_LATENCY && keys.right > 0) {
              dx = 1;
            }
          } else {
            if (keys.up <= KEY_LATENCY && keys.up > 0) {
              dy = 1;
            }
            if (keys.down <= KEY_LATENCY && keys.down > 0) {
              dy = -1;
            }
          }
          movePlayer(player.row + dy, player.col + dx);
          keysBlockedUntilAllUp = true;
        }
      }
      var keyName;
      if (keysBlockedUntilAllUp) {
        var allUp = true;
        for (keyName in keyBoolMap) {
          if (keyBoolMap[keyName]) {
            allUp = false;
            break;
          }
        }
        keysBlockedUntilAllUp = !allUp;
      }

      //update key pressed counters
      for (keyName in keys) {
        if (keys[keyName] >= 1) {
          keys[keyName]++;
        } else if (keys[keyName] > KEY_DONE) {
          keys[keyName]--;
        }
      }

      // no keyboard input => check mouse
      if (
        !player.anim &&
        mouse.x > 0 &&
        mouse.x < SIZE &&
        mouse.y > HORIZON_Y &&
        mouse.y < SIZE + HORIZON_Y
      ) {
        var mouseX = mouse.x / SIZE;
        var mouseY = (mouse.y - HORIZON_Y) / SIZE;
        reverseProject(mouseX, mouseY);
        mouseCol = Math.floor(reverseProject.res.x * NUM_CELLS);
        mouseRow = Math.floor(reverseProject.res.y * NUM_CELLS + progress);
        dx = mouseCol - player.col;
        dy = mouseRow - player.row;
        mouseRow = player.row + dy;
        mouseCol = player.col + dx;
        if (mouse.click && (dx || dy)) {
          dx = Math.max(-1, Math.min(1, dx));
          dy = Math.max(-1, Math.min(1, dy));
          mouseRow = player.row + dy;
          mouseCol = player.col + dx;

          movePlayer(mouseRow, mouseCol);
        }
      } else {
        mouseCol = -1;
        mouseRow = -1;
      }
    }
    function update() {
      now = Date.now();
      if (lastTime) {
        progress += progressPerSec * (now - lastTime) * MS_TO_S;
      }
      if (player.row < progress - 0.9) {
        //player out of view
        if (autoMove) {
          // auto move if possible
          if (!getThreateningCell(player.row + 1, player.col)) {
            movePlayer(player.row + 1, player.col);
          } else if (!getThreateningCell(player.row + 1, player.col + 1)) {
            movePlayer(player.row + 1, player.col + 1);
          } else if (!getThreateningCell(player.row + 1, player.col - 1)) {
            movePlayer(player.row + 1, player.col + 1);
          } else {
            setGameIsOver(true);
            return;
          }
        } else {
          setGameIsOver(true);
        }
        aa.play("checkmate");
      }

      //update checkboard based on progress
      var topRow = Math.floor(progress) + NUM_CELLS_DISPLAYED;
      if (!lastTime || topRowDisplayed < topRow) {
        var row, colIndex, changes;
        //Destroy out of view rows
        for (
          var i = topRow - NUM_CELLS_DISPLAYED - 5;
          i > topRowDisplayed - NUM_CELLS_DISPLAYED - 5;
          i--
        ) {
          row = checkBoard[i];
          if (row) {
            changes = true;
            for (colIndex = 0; colIndex < NUM_CELLS; colIndex++) {
              if (row[colIndex] && row[colIndex].piece) {
                removeSvgShape(row[colIndex].piece);
              }
            }
          }
        }

        //Create missing shapes in new rows elements
        for (i = topRowDisplayed + 1; i <= topRow; i++) {
          row = checkBoard[i];
          if (row) {
            changes = true;
            for (colIndex = 0; colIndex < NUM_CELLS; colIndex++) {
              //make sure elements can't overlap
              var index = NUM_CELLS / 2;
              if (colIndex % 2 === 0) {
                index += colIndex / 2;
              } else {
                index -= (colIndex + 1) / 2;
              }
              if (row[index] && row[index].piece) {
                addSvgShape(row[index].piece);
              }
            }
          }
        }
        topRowDisplayed = topRow;
      }
      lastTime = now;
    }

    //------------------------------------------------------------------------------------------------------------------
    //  intro
    //------------------------------------------------------------------------------------------------------------------

    var introTweens;
    function updateIntro() {
      var whiteKing = checkBoard[8][3].piece;
      var blackKing = player;

      var i, j, cell, row;
      now = Date.now();
      var init = !introStartTime;
      if (init) {
        introStartTime = now;
        skipIntroTweens();
        if (whiteKing) {
          whiteKing.talking = false;
          whiteKing.talkingStarTime = now;
        }
        blackKing.talking = false;
        blackKing.talkingStarTime = now;
      }
      if (introStep == -1) {
        shadowCanvas.style.opacity = 0;
        skyCanvas.style.opacity = 0;
        perspectiveProgress = 0;
        //force a refresh for pieces
        update();
        lastTime = null;
        introStep = 0;
      } else if (introStep === 0) {
        //Waiting for space
      } else if (introStep == 1) {
        if (init) {
          showDialog(true, [
            "Surrender Black King !",
            "Your army is defeated, and your Queen is mine !",
          ]);
          whiteKing.talking = true;
        }
      } else if (introStep == 2) {
        if (init) {
          hideDialog();
          //bring knights in
          for (j = 0; j < NUM_CELLS; j++) {
            cell = checkBoard[0][j];
            addIntroTween(
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
      } else if (introStep == 3) {
        if (init) {
          showDialog(true, [
            "You thought I'd only bring two knights to battle ?",
            "You are surrounded,",
            "admit defeat now and I shall be merciful.",
          ]);
          whiteKing.talking = true;
        }
      } else if (introStep == 4) {
        if (init) {
          showDialog(false, ["Never !"]);
          blackKing.talking = true;
        }
        //sword ?
      } else if (introStep == 5) {
        if (init) {
          showDialog(true, [
            "As you wish...",
            "I am taking the prisoner back to the castle.",
            "Knights, capture him, I want him alive.",
          ]);
          whiteKing.talking = true;
        }
      } else if (introStep == 6) {
        if (init) {
          hideDialog();
          //white king moves out
          for (j = 2; j <= 5; j++) {
            cell = checkBoard[8][j];
            if (cell) {
              addIntroTween(
                cell.piece,
                {
                  row: 9,
                },
                0,
                0.5
              );
              addIntroTween(
                cell.piece,
                {
                  row: 10,
                },
                1,
                0.5
              );
            }
          }
          addIntroTween(
            checkBoard[7][3].piece,
            {
              row: 8,
              col: 1,
            },
            0.5,
            0.5
          );
          addIntroTween(
            checkBoard[7][3].piece,
            {
              row: 10,
              col: 2,
            },
            1.5,
            0.5
          );
          addIntroTween(
            checkBoard[7][4].piece,
            {
              row: 8,
              col: 6,
            },
            0.5,
            0.5
          );
          addIntroTween(
            checkBoard[7][4].piece,
            {
              row: 10,
              col: 5,
            },
            1.5,
            0.5
          );
        }
      } else if (introStep == 7) {
        if (init) {
          var anim =
            '<animate attributeType="CSS" attributeName="fill" from="red" to="orange" dur="0.5s" repeatCount="indefinite"/>';
          showDialog(false, [
            'It looks like our roles are <tspan fill="red" font-family="impact">REVERSED' +
              anim +
              "</tspan> my Queen.",
            "Today, it is my turn to protect you !",
          ]);
          blackKing.talking = true;

          //remove intro pieces
          for (i = 1; i < 2 * NUM_CELLS; i++) {
            row = checkBoard[i];
            if (row) {
              for (j = 0; j < NUM_CELLS; j++) {
                cell = row[j];
                if (cell && cell.piece && cell.piece.intro) {
                  removeSvgShape(cell.piece);
                  row[j] = {};
                }
              }
            }
          }
        }
      } else if (introStep == 8) {
        if (init) {
          hideDialog();
          pressSpaceText.style.display = "none";
        }
        //perspective switch
        introProgress = (now - introStartTime) / (4 * 1000);
        if (introProgress > 1) {
          introStep = 9;
        } else {
          introProgress = Math.sin((introProgress * PI) / 2);
          perspectiveProgress = (introProgress - 0.2) / 0.6;
          if (perspectiveProgress < 0) {
            perspectiveProgress = 0;
          } else if (perspectiveProgress > 1) {
            perspectiveProgress = 1;
          }
          shadowCanvas.style.opacity = perspectiveProgress;
          if (introProgress > 0.8) {
            introScreen.style.opacity = (1 - introProgress) / 0.2;
            skyCanvas.style.opacity = 1 - introScreen.style.opacity;
          }
        }
      }
      if (init) {
        if (!introTweens.length) {
          pressSpaceText.style.opacity = 1;
        } else {
          pressSpaceText.style.opacity = 0;
          var hasText =
            introTweens[0].e == dialogBox &&
            introTweens[0].to._y == dialogOpenY;
          var lastTween = introTweens[introTweens.length - 1];
          var delay = lastTween.du + lastTween.de;
          if (hasText) {
            addIntroTween(
              pressSpaceText.style,
              {
                opacity: 1,
              },
              delay + 2,
              0.1
            );
          } else if (introStep > 1 && introStep < 8) {
            addIntroCallback(nextIntroStep, delay);
          }
        }
      }
      updateIntroTweens();
      if (introStep == 9) {
        intro = false;
        perspectiveProgress = 1;
        introScreen.style.display = "none";
        shadowCanvas.style.opacity = 1;
        skyCanvas.style.opacity = 1;
        pressSpaceText.style.display = "none";
        hideDialog();
        player.talking = false;
      }
      lastTime = now;
    }
    function nextIntroStep() {
      introStep++;
      introStartTime = null;
    }
    function addIntroTween(element, props, delay, duration) {
      introTweens.push({
        e: element,
        to: props,
        de: delay || 0,
        du: duration,
      });
    }
    function addIntroCallback(callback, duration) {
      introTweens.push({
        cb: callback,
        de: 0,
        du: duration,
      });
    }
    function skipIntroTweens() {
      if (introTweens) {
        for (var i = 0; i < introTweens.length; i++) {
          var t = introTweens[i];
          if (t.e) {
            for (var key in t.to) {
              t.e[key] = t.to[key];
            }
          }
        }
      }
      introTweens = [];
    }
    function updateIntroTweens() {
      var time = (now - introStartTime) * MS_TO_S;
      var key;
      for (var i = 0; i < introTweens.length; i++) {
        var tween = introTweens[i];
        if (time <= tween.de) {
          //Not started
        } else if (time >= tween.de + tween.du) {
          //Done
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
            var p = (time - tween.de) / tween.du;
            //Ease
            p = Math.sin((p * PI) / 2);
            for (key in tween.to) {
              tween.e[key] = tween.from[key] * (1 - p) + tween.to[key] * p;
            }
          }
        }
      }
      dialogBox.setAttributeNS(null, "y", dialogBox._y);
    }

    //------------------------------------------------------------------------------------------------------------------
    //  RENDER
    //------------------------------------------------------------------------------------------------------------------

    var BG_COLOR = "#193441";
    var CELL_COLOR_1 = "#D1DBBD";
    var CELL_COLOR_2 = "#3E606F";
    var ROLLOVER_COLOR = "#794";
    var ROLLOVER_COLOR_TOO_FAR = "#898";
    var PIECE_FILL_COLOR = "#eee";
    var PIECE_STROKE_COLOR = "#555";
    var INVALID_CELL_COLOR_RGB = "255,0,0";
    var CHECK_POINT_COLOR = "rgba(93, 255, 182, 0.56)";
    function render() {
      // SVG ------------------------------------------------------------------------------------------------------

      //update pieces
      var pieceAfterPlayer;
      var row;
      for (
        var rowIndex = topRowDisplayed - NUM_CELLS_DISPLAYED - 5;
        rowIndex <= topRowDisplayed;
        rowIndex++
      ) {
        row = checkBoard[rowIndex];
        if (row) {
          for (var colIndex = 0; colIndex < NUM_CELLS; colIndex++) {
            if (row[colIndex] && row[colIndex].piece) {
              var piece = row[colIndex].piece;
              computeCellPos(piece.row, piece.col, piece);
              if (piece.talking) {
                var bounce =
                  -Math.abs(
                    Math.sin(((now - piece.talkingStarTime) * PI) / 800)
                  ) *
                  CELL_SIZE *
                  0.2;
                piece.y += bounce;
              }
              updatePieceStyle(piece);
              if (
                piece.y > player.y &&
                (!pieceAfterPlayer || pieceAfterPlayer.y > piece.y)
              ) {
                pieceAfterPlayer = piece;
              }
            }
          }
        }
      }

      //update player anim
      var playerAnimProgress;
      if (player.anim) {
        if (!player.invalid) {
          playerAnimProgress =
            (MS_TO_S * (now - player.animStartTime)) / playerAnimDuration;
        } else {
          playerAnimProgress =
            (MS_TO_S * (now - player.animStartTime)) / playerInvalidDuration;
        }
        if (playerAnimProgress < 0 || playerAnimProgress >= 1) {
          var _player$threateningPi;
          player.anim = false;
          if (
            player.invalid &&
            (_player$threateningPi = player.threateningPiece) !== null &&
            _player$threateningPi !== void 0 &&
            _player$threateningPi.shape
          ) {
            player.threateningPiece.shape.style.filter = "none";
          }
          player.invalid = false;
        } else {
          playerAnimProgress = Math.sin(playerAnimProgress * PI * 0.5); //Ease out
          if (player.invalid) {
            var _player$threateningPi2;
            computeCellPos(player.row, player.col);
            var shakeAmplitude =
              0.4 *
              (playerAnimProgress < 0.5
                ? playerAnimProgress
                : 1 - playerAnimProgress) *
              CELL_SIZE;
            var shake = Math.sin(6 * playerAnimProgress * PI) * shakeAmplitude;
            player.x += shake;
            updatePieceStyle(player);
            //color enemy piece
            if (
              (_player$threateningPi2 = player.threateningPiece) !== null &&
              _player$threateningPi2 !== void 0 &&
              _player$threateningPi2.shape
            )
              player.threateningPiece.shape.style.filter =
                "url(#" + ENEMY_FILTER + ")";
          } else {
            //compute old pos
            computeCellPos(player.oldRow, player.oldCol);
            //interpolate
            player.opacity =
              playerAnimProgress * player.opacity +
              (1 - playerAnimProgress) * computeCellPos.res.opacity;
            player.scale =
              playerAnimProgress * player.scale +
              (1 - playerAnimProgress) * computeCellPos.res.scale;
            player.x =
              playerAnimProgress * player.x +
              (1 - playerAnimProgress) * computeCellPos.res.x;
            player.y =
              playerAnimProgress * player.y +
              (1 - playerAnimProgress) * computeCellPos.res.y;
            updatePieceStyle(player);
          }
        }
      }

      //update removedPieces
      for (i = 0, len = removedPieces.length; i < len; i++) {
        var removedPiece = removedPieces[i];
        var removedPieceProgress = (now - removedPiece.removedTime) / 1000;
        if (removedPieceProgress > 1) {
          removeSvgShape(removedPiece);
          removedPieces[i] = removedPieces[len - 1];
          len--;
          i--;
          removedPieces = removedPieces.slice(0, len);
        } else {
          if (removedPiece.justRemoved) {
            removedPiece.justRemoved = false;
            removedPiece.removedX = removedPiece.x;
            removedPiece.removedY = removedPiece.y;
          }
          if (removedPiece.x < SIZE * 0.5) {
            removedPiece.x =
              removedPiece.removedX - removedPieceProgress * SIZE;
          } else {
            removedPiece.x =
              removedPiece.removedX + removedPieceProgress * SIZE;
          }
          removedPiece.y =
            removedPiece.removedY -
            Math.sin(removedPieceProgress * PI) * SIZE * 0.4;
          updatePieceStyle(removedPiece);
        }
      }

      //Check text
      if (player.anim && player.invalid) {
        if (!checkText) {
          checkText = {
            onTop: true,
            type: CHECK_TEXT,
          };
        }
        if (!checkText.shape) {
          addSvgShape(checkText);
          checkText.row = player.invalidRow;
          checkText.col = player.invalidCol;
        }
        computeCellPos(player.invalidRow, player.invalidCol, checkText);
        checkText.scale = 1;
        checkText.y -= playerAnimProgress * checkText.scale * CELL_SIZE * 0.2;
        checkText.opacity =
          playerAnimProgress < 0.8
            ? 1
            : 1 - (playerAnimProgress - 0.8) / (1 - 0.8);
        updatePieceStyle(checkText);
      } else if (checkText && checkText.shape) {
        removeSvgShape(checkText);
      }
      if (
        pieceAfterPlayer &&
        pieceAfterPlayer.shape &&
        player.shape &&
        player.shape.nextSibling != pieceAfterPlayer.shape
      ) {
        //adjust player z-index
        svgPiecesLayer.insertBefore(player.shape, pieceAfterPlayer.shape);
      }

      // CANVAS ------------------------------------------------------------------------------------------------------

      //clear & fill
      bgCtx.save();
      bgCtx.translate(0, HORIZON_Y);
      bgCtx.fillStyle = BG_COLOR;
      bgCtx.beginPath();
      bgCtx.rect(0, 0, SIZE, SIZE);
      bgCtx.fill();
      bgCtx.clip();
      var progressIndex = Math.floor(progress);
      var di = -(progress - Math.floor(progress));
      var p1 = {},
        p2 = {},
        p3 = {},
        p4 = {};
      var i, j, len;
      for (i = -1; i < NUM_CELLS_DISPLAYED; i++) {
        for (j = 0; j < NUM_CELLS; j++) {
          project(j / NUM_CELLS, (i + di) / NUM_CELLS, p1);
          project(j / NUM_CELLS, (i + 1 + di) / NUM_CELLS, p4);
          project((j + 1) / NUM_CELLS, (i + 1 + di) / NUM_CELLS, p3);
          project((j + 1) / NUM_CELLS, (i + di) / NUM_CELLS, p2);
          bgCtx.beginPath();
          bgCtx.moveTo(p1.x * SIZE, p1.y * SIZE);
          bgCtx.lineTo(p2.x * SIZE, p2.y * SIZE);
          bgCtx.lineTo(p3.x * SIZE, p3.y * SIZE);
          bgCtx.lineTo(p4.x * SIZE, p4.y * SIZE);
          bgCtx.closePath();
          bgCtx.lineWidth = 1;
          //bgCtx.strokeStyle = STROKE_COLOR;

          if (
            mouseRow != -1 &&
            mouseCol != -1 &&
            i + progressIndex == mouseRow &&
            j == mouseCol
          ) {
            //mouse over
            const dx = mouseCol - player.col;
            const dy = mouseRow - player.row;
            bgCtx.fillStyle =
              dx < -1 || dx > 1 || dy < -1 || dy > 1
                ? ROLLOVER_COLOR_TOO_FAR
                : ROLLOVER_COLOR;
          } else {
            if ((i + j + progressIndex) % 2 === 0) {
              bgCtx.fillStyle = CELL_COLOR_1;
            } else {
              bgCtx.fillStyle = CELL_COLOR_2;
            }
          }
          bgCtx.fill();
          row = checkBoard[i + progressIndex];
          if (row && row[j]) {
            var cell = row[j];
            if (cell.showThreat) {
              bgCtx.fillStyle = "rgba(" + INVALID_CELL_COLOR_RGB + ",0.5)";
              bgCtx.fill();
            }
            if (cell.checkPoint) {
              bgCtx.fillStyle = CHECK_POINT_COLOR;
              bgCtx.fill();
            }
          }
          if (
            player.invalid &&
            player.invalidCol == j &&
            player.invalidRow == i + progressIndex
          ) {
            //invalid tile
            var invalidOpacity =
              1.5 *
              (playerAnimProgress < 0.5
                ? playerAnimProgress
                : 1 - playerAnimProgress);
            bgCtx.fillStyle =
              "rgba(" + INVALID_CELL_COLOR_RGB + "," + invalidOpacity + ")";
            bgCtx.fill();
          }
        }
      }
      bgCtx.restore();
    }
    var THRESHOLD_DOWN = -0.02;
    var THRESHOLD_UP = 0.02;
    computeCellPos.res = {};
    function computeCellPos(row, col, res) {
      res = res || computeCellPos.res;
      project((col + 0.5) / NUM_CELLS, (row - progress + 0.5) / NUM_CELLS);
      var thresholdUp = 0.02;
      var opacity = 1;
      if (project.res.y < THRESHOLD_DOWN) {
        opacity = 0;
      } else if (project.res.y < THRESHOLD_UP) {
        opacity =
          1 - (thresholdUp - project.res.y) / (THRESHOLD_UP - THRESHOLD_DOWN);
      }
      res.opacity = opacity;
      res.x = project.res.x * SIZE;
      res.y = project.res.y * SIZE + HORIZON_Y;
      res.scale = project.res.scaleX;
      return res;
    }
    function updatePieceStyle(piece) {
      if (piece.shape) {
        piece.shape.style.opacity = piece.opacity;
        if (piece.scale > 0) {
          //Note: svg transform origin is the root SVG element origin
          piece.shape.setAttributeNS(
            null,
            "transform",
            "scale(" +
              piece.scale +
              ") translate(" +
              piece.x / piece.scale +
              "," +
              piece.y / piece.scale +
              ")"
          );
        }
      }
    }

    //------------------------------------------------------------------------------------------------------------------
    //  projections
    //------------------------------------------------------------------------------------------------------------------

    // For y, projection of a [0,2] position in logical chessboard into a [1,0] position inside the canvas
    // we want: 0->1 and 2->1. You don't want to know how I got those coeff. Don't ask.
    // http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiItKDMvMTYpKngqeCsoMC8xNikqeCsxIiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTYuNiIsIjYuNCIsIi0zLjkyIiwiNC4wOCJdfV0-
    var A_Y = 3 / 16;
    var B_Y = -14 / 16;
    var C_Y = 1;
    //For scale, we roughly inverse the curve
    var A_S = -2.5 / 16;
    var B_S = 0 / 16;
    var C_S = 1;

    // [0,2] in logical chessboard => [0,1] in canvas coordinates (y reversed)
    project.res = {};
    function project(x, y, res) {
      res = res || project.res;
      res.y = quadraticEq(y, A_Y, B_Y, C_Y);
      res.scaleX = quadraticEq(y, A_S, B_S, C_S);
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
    reverseProject.res = {};
    function reverseProject(x, y, res) {
      res = res || reverseProject.res;
      res.y = reverseQuadraticEq(y, A_Y, B_Y, C_Y, false);
      var scale = quadraticEq(res.y, A_S, B_S, C_S);
      res.x = (x - (1 - scale) / 2) / scale;
      return res;
    }
    function quadraticEq(x, a, b, c) {
      return a * x * x + b * x + c;
    }
    function reverseQuadraticEq(y, a, b, c, pos) {
      if (pos) {
        return (-b + Math.sqrt(b * b - 4 * a * (c - y))) / (2 * a);
      } else {
        return (-b - Math.sqrt(b * b - 4 * a * (c - y))) / (2 * a);
      }
    }

    //------------------------------------------------------------------------------------------------------------------
    //  canvases
    //------------------------------------------------------------------------------------------------------------------

    function initCheckBoardCanvas() {
      root.appendChild(bgCanvas);
      bgCanvas.width = SIZE;
      bgCanvas.height = SIZE + HORIZON_Y;
    }
    function initShadowCanvas() {
      var ctx = shadowCtx;
      //Top down shadow */
      var grd = ctx.createLinearGradient(0, 0, 0, SIZE);
      var c = "rgba(10,20,25,";
      var c2 = ")";
      grd.addColorStop(0, c + 0 + c2);
      grd.addColorStop(0.2, c + 0 + c2);
      //grd.addColorStop(0.9,"rgba(0,0,0,0.3)");
      grd.addColorStop(1, c + 0.5 + c2);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.restore();
      shadowCanvas.style.top = HORIZON_Y + "px";
      shadowCanvas.style.pointerEvents = "none";
      root.appendChild(shadowCanvas);
    }
    function initSkyCanvas() {
      var shadowSize = SIZE * 0.02;
      skyCanvas.width = SIZE;
      skyCanvas.height = HORIZON_Y + shadowSize;
      var ctx = skyCtx;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.save();
      //Draw sky
      ctx.fillStyle = "#FF8601";
      ctx.beginPath();
      ctx.rect(0, 0, SIZE, HORIZON_Y);
      ctx.fill();
      ctx.clip();
      //Draw sun
      ctx.fillStyle = "#FFE7CA";
      var sunRadius = SIZE / 4;
      ctx.beginPath();
      ctx.arc(SIZE / 2, HORIZON_Y + 0.3 * sunRadius, sunRadius, 0, PI, true);
      ctx.fill();
      ctx.restore();
      //Draw Mountains
      ctx.beginPath();
      ctx.fillStyle = "rgb(10,20,25)";
      var mountainMaxHeight = 40;
      var points = [
        0, 0.7, 0.1, 0.3, 0.2, 1, 0.3, 0.5, 0.35, 0.8, 0.42, 0.5, 0.55, 0.9,
        0.7, 0.45, 0.8, 1.1, 0.88, 0.4, 1, 0.8,
      ];
      for (var i = 0; i < points.length; i += 2) {
        var x = points[i] * SIZE;
        var y = HORIZON_Y - mountainMaxHeight * points[i + 1];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.lineTo(SIZE, HORIZON_Y);
      ctx.lineTo(0, HORIZON_Y);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.translate(0, HORIZON_Y);
      var grd = ctx.createLinearGradient(0, 0, 0, shadowSize);
      var c = "rgba(10,20,25,";
      var c2 = ")";
      grd.addColorStop(0, c + 1 + c2);
      grd.addColorStop(1, c + 0 + c2);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, SIZE, shadowSize);
      ctx.restore();
      root.appendChild(skyCanvas);
    }
    function makeCanvas(width, height, id) {
      var canvas = document.createElement("canvas");
      if (id) canvas.id = id;
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }
    function getContext(canvas) {
      return canvas.getContext("2d");
    }

    // c: color string or canvas/image

    //------------------------------------------------------------------------------------------------------------------
    //  SVG
    //------------------------------------------------------------------------------------------------------------------

    var svgMakeUse;
    var svgElem;
    var svgPiecesLayer = null;
    var svgCache = {};
    function addSvgShape(piece) {
      var shape;
      if (!svgCache[piece.type]) {
        svgCache[piece.type] = [];
      }
      if (svgCache[piece.type].length) {
        shape = svgCache[piece.type].pop();
      } else {
        shape = svgMakeUse(piece.type);
      }
      //Important: we assume element are always added to the top of the screen
      //so they have to be prepended in order to be painted in the correct order
      if (svgPiecesLayer.firstChild && !piece.onTop) {
        svgPiecesLayer.insertBefore(shape, svgPiecesLayer.firstChild);
      } else {
        svgPiecesLayer.appendChild(shape);
      }
      if (piece.shape) {
        throw new Error();
      }
      piece.shape = shape;
      shape.style.filter = "none";
    }
    function removeSvgShape(piece) {
      if (piece.shape) {
        svgCache[piece.type].push(piece.shape);
        svgPiecesLayer.removeChild(piece.shape);
        piece.shape = null;
      }
    }
    function initSvg() {
      svgMakeUse = makeUse;
      var xmlns = "http://www.w3.org/2000/svg";
      var xlinkns = "http://www.w3.org/1999/xlink";
      var boxWidth = SIZE;
      var boxHeight = SIZE + HORIZON_Y;
      svgElem = document.createElementNS(xmlns, "svg");
      svgElem.setAttribute("xmlns", xmlns);
      svgElem.setAttributeNS(
        null,
        "viewBox",
        "0 0 " + boxWidth + " " + boxHeight
      );
      svgElem.setAttributeNS(null, "width", boxWidth);
      svgElem.setAttributeNS(null, "height", boxHeight);
      root.appendChild(svgElem);
      var defs = document.createElementNS(xmlns, "defs");
      svgElem.appendChild(defs);

      //make pieces layer
      svgPiecesLayer = document.createElementNS(xmlns, "g");
      svgElem.appendChild(svgPiecesLayer);
      makeIntroScreen();
      makeFilter(ENEMY_FILTER);
      makeCheckTextDef(CHECK_TEXT, "CHECK");
      makeGameOverScreen();
      makeDialogBox();
      makePressSpaceText();
      makePauseText();
      makeWinScreen();

      //For convenience, shape defs are given in a [10,10] rect, transformed to [CELL_SIZE,CELL_SIZE] in actual SVG
      //We also transform the shape positions so that the piece origin is [OX,OY]
      var OX = 5;
      var OY = 8;
      svgStyle(
        makeDef(PAWN, [
          makePath([
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
          makeCircle(5, 3, 2),
        ]),
        PIECE_FILL_COLOR,
        PIECE_STROKE_COLOR,
        0
      );
      svgStyle(
        makeDef(ENEMY_KING, [
          makePath([
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
          makePath([
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
        PIECE_FILL_COLOR,
        PIECE_STROKE_COLOR,
        0
      );
      svgStyle(
        makeDef(KNIGHT, [
          makePath([
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
        PIECE_FILL_COLOR,
        PIECE_STROKE_COLOR,
        0
      );
      svgStyle(
        makeDef(ROOK, [
          makePath([
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
        PIECE_FILL_COLOR,
        PIECE_STROKE_COLOR,
        0
      );
      svgStyle(
        makeDef(BISHOP, [
          makePath([
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
          makeCircle(5, 0, 0.7),
          makePath(["M", [3.8, 0.8], "L", [4.4, 2.5]], {
            "stroke-width": 2,
          }),
        ]),
        PIECE_FILL_COLOR,
        PIECE_STROKE_COLOR,
        0
      );
      svgStyle(
        makeDef(WAR_BEAR, [
          makePath([
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
        PIECE_FILL_COLOR,
        PIECE_STROKE_COLOR,
        0
      );
      function makePike(x, y) {
        return makePath([
          "M",
          [x, y],
          "L",
          [x + 1, y],
          "L",
          [x + 0.5, y - 3],
          "L",
          [x, y],
        ]);
      }
      svgStyle(
        makeDef(
          LAND_MINE,
          [
            //makePath(['M',[2,8],'Q',[5,10],[8,8],'L',[8.5,6],'L',[7,7],'L',[7,5],'L',[6,6],'L',[5,4.5],'L',[4,6],'L',[3,5],'L',[3,7],'L',[1.5,6],'L',[2,8]])
            makePike(2, 9.5),
            makePike(5, 9),
            makePike(8, 10),
            makePike(7, 8),
            makePike(4, 7.5),
            makePike(1, 8.5),
          ],
          true
        ),
        PIECE_FILL_COLOR,
        PIECE_STROKE_COLOR,
        0
      );
      //HERO_KING
      svgStyle(
        makeDef(HERO_KING, [
          makePath([
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
          makePath([
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
      svgStyle(
        makeDef(QUEEN, [
          makeCircle(5, 0.4, 0.6),
          makePath([
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
      OX = 2.5;
      OY = 50;
      svgStyle(
        makeDef(
          CASTLE,
          [
            makePath([
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
            ]),
            makePath([
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
            ]),
          ],
          true
        ),
        PIECE_FILL_COLOR,
        PIECE_STROKE_COLOR,
        0
      );
      function makeDef(id, shapes, skipShadow) {
        var def = document.createElementNS(xmlns, "g");
        def.setAttributeNS(null, "id", id);
        if (!skipShadow) def.appendChild(makeShadow());
        for (var i = 0; i < shapes.length; i++) {
          var shape = shapes[i];
          if (shape.getAttributeNS(null, "x")) {
            //Rect
            //shape.setAttributeNS(null,'x',parseInt(shape.getAttributeNS(null,'x'))-CELL_SIZE/2);
            //shape.setAttributeNS(null,'y',parseInt(shape.getAttributeNS(null,'y'))-CELL_SIZE);
          } else {
            shape.setAttributeNS(null, "x", -CELL_SIZE / 2);
            shape.setAttributeNS(null, "y", -CELL_SIZE);
          }
          def.appendChild(shape);
        }
        defs.appendChild(def);
        return def;
      }
      function makeFilter(id) {
        var def = document.createElementNS(xmlns, "filter");
        def.setAttributeNS(null, "id", id);
        svgAttrs(def, {
          x: "0",
          y: "0",
          width: "100%",
          height: "100%",
          "color-interpolation-filters": "sRGB",
        });
        svgInnerHtml(
          def,
          '<feFlood flood-color="rgba(255,0,0,0.3)" result="COLOR"></feFlood>' +
            '<feComposite operator="atop" in="COLOR" in2="SourceGraphic"></feComposite>'
        );
        defs.appendChild(def);
        return def;
      }
      function makeShadow() {
        var shadow = makeEllipse(5, 8, 3.1, 1.8);
        svgStyle(shadow, "rgba(0,0,0,0.2)", "none");
        return shadow;
      }
      function makeCircle(cx, cy, r) {
        var circle = document.createElementNS(xmlns, "circle");
        svgAttrs(circle, {
          cx: svgFloat(cx - OX),
          cy: svgFloat(cy - OY),
          r: svgFloat(r),
        });
        return circle;
      }
      function makeEllipse(cx, cy, rx, ry) {
        var ellipse = document.createElementNS(xmlns, "ellipse");
        svgAttrs(ellipse, {
          cx: svgFloat(cx - OX),
          cy: svgFloat(cy - OY),
          rx: svgFloat(rx),
          ry: svgFloat(ry),
        });
        return ellipse;
      }
      function makePath(list, style) {
        var path = document.createElementNS(xmlns, "path");
        path.setAttributeNS(null, "d", makePathString(list));
        if (style) {
          svgAttrs(path, style);
        }
        return path;
      }
      function makePathString(list) {
        var path = "";
        for (var i = 0; i < list.length; i++) {
          var e = list[i];
          if (typeof e == "object") {
            e = svgFloat(e[0] - OX) + "," + svgFloat(e[1] - OY);
          }
          path += e + " ";
        }
        return path;
      }
      function makeUse(id, attrs) {
        var use = document.createElementNS(xmlns, "use");
        svgAttrs(use, attrs);
        use.setAttributeNS(xlinkns, "xlink:href", "#" + id);
        use.setAttribute("xmlns:xlink", xlinkns);
        return use;
      }
      function svgFloat(f) {
        return Math.round(CELL_SIZE * f) * 0.1;
      }
      function makeCheckTextDef(id, text) {
        /*
      //Gradient
      var def = document.createElementNS (xmlns, 'linearGradient');
      def.setAttributeNS (null, 'id', CHECK_GRADIENT);
      svgAttrs(def, { x1:'0', x2:'0', y1:'0', y2:'100%', height:'100%', 'gradientUnits':'userSpaceOnUse' });
      def.innerHTML =
                     '<stop stop-color="#FF5B99" offset="0%"></stop>' +
                     '<stop stop-color="#FF5447" offset="50%"></stop>' +
                     '<stop stop-color="#FF7B21" offset="100%"></stop>';
               defs.appendChild(def);
               */

        var def = document.createElementNS(xmlns, "text");
        def.setAttributeNS(null, "id", id);
        svgAttrs(def, {
          x: "-40",
          "font-size": "28",
          fill: "red",
          stroke: "black",
          "stroke-width": "1",
          "font-family": "Impact",
        });
        svgInnerHtml(def, text);
        defs.appendChild(def);
      }
      function makeGameOverScreen() {
        gameOverScreen = document.createElementNS(xmlns, "g");
        gameOverScreen.style.display = "none";
        svgElem.appendChild(gameOverScreen);
        var rect = document.createElementNS(xmlns, "rect");
        svgAttrs(rect, {
          x: 0,
          y: 0,
          width: "100%",
          height: "100%",
          fill: "rgba(0,0,0,0.5)",
        });
        gameOverScreen.appendChild(rect);
        var text = document.createElementNS(xmlns, "text");
        svgAttrs(text, {
          x: "50%",
          y: "50%",
          "font-size": "48px",
          fill: "orange",
          stroke: "red",
          "stroke-width": "2px",
          "text-anchor": "middle",
          "font-family": "Impact",
        });
        svgInnerHtml(text, "CHECKMATE !");
        gameOverScreen.appendChild(text);
        text = document.createElementNS(xmlns, "text");
        svgAttrs(text, {
          x: "50%",
          y: "60%",
          "font-size": "22px",
          fill: "white",
          stroke: "black",
          "stroke-width": "1px",
          "text-anchor": "middle",
          "font-family": "Impact",
        });
        svgInnerHtml(
          text,
          '<tspan x="50%">Press <tspan style="fill:orange;">SPACE</tspan> or <tspan style="fill:orange;">CLICK</tspan></tspan>' +
            '<tspan x="50%" dy="1.5em">to restart from the last checkpoint.</tspan>'
        );
        gameOverScreen.appendChild(text);
      }
      function makeIntroScreen() {
        introScreen = document.createElementNS(xmlns, "g");
        svgElem.appendChild(introScreen);
        var rect = document.createElementNS(xmlns, "rect");
        svgAttrs(rect, {
          x: 0,
          y: 0,
          width: "100%",
          height: HORIZON_Y,
          fill: BG_COLOR,
          stroke: "#000",
        });
        introScreen.appendChild(rect);
        var text = document.createElementNS(xmlns, "text");
        svgAttrs(text, {
          x: "50%",
          y: "60",
          "font-size": "48px",
          fill: "orange",
          stroke: "red",
          "stroke-width": "2px",
          "text-anchor": "middle",
          "font-family": "Impact",
        });
        svgInnerHtml(
          text,
          'CHESS<tspan style="font-style:italic;">PURSUIT</tspan>'
        );
        introScreen.appendChild(text);
      }
      function makePressSpaceText() {
        pressSpaceText = document.createElementNS(xmlns, "text");
        svgAttrs(pressSpaceText, {
          x: "50%",
          y: HORIZON_Y + SIZE - 10,
          "font-size": "22px",
          fill: "white",
          stroke: "black",
          "stroke-width": "1px",
          "text-anchor": "middle",
          "font-family": "Impact",
        });
        svgInnerHtml(
          pressSpaceText,
          'Press <tspan style="fill:orange;">SPACE</tspan> or <tspan style="fill:orange;">CLICK</tspan>'
        );
        svgElem.appendChild(pressSpaceText);
      }
      function makePauseText() {
        pauseText = document.createElementNS(xmlns, "text");
        svgAttrs(pauseText, {
          x: "50%",
          y: "50%",
          "font-size": "32px",
          fill: "orange",
          stroke: "black",
          "stroke-width": "1px",
          "text-anchor": "middle",
          "font-family": "Impact",
        });
        svgInnerHtml(pauseText, "PAUSED");
        pauseText.style.display = "none";
        svgElem.appendChild(pauseText);
      }
      function makeDialogBox() {
        var width = SIZE - 2 * DIALOG_MARGIN;
        var height = 0.3 * SIZE - 2 * DIALOG_MARGIN;
        dialogCloseY = SIZE + HORIZON_Y;
        dialogOpenY = HORIZON_Y + SIZE - height - DIALOG_MARGIN;
        dialogBox = document.createElementNS(xmlns, "svg");
        dialogBox._y = dialogCloseY; //used for tweening
        svgAttrs(dialogBox, {
          x: DIALOG_MARGIN,
          y: dialogCloseY,
          width: width,
          height: height,
        });
        svgElem.appendChild(dialogBox);
        var rect = document.createElementNS(xmlns, "rect");
        svgAttrs(rect, {
          width: "100%",
          height: "100%",
          fill: "rgba(0,0,0,0.8)",
          stroke: "#fff",
          "stroke-width": 2,
        });
        dialogBox.appendChild(rect);
        dialogSpeakerText = document.createElementNS(xmlns, "text");
        svgAttrs(dialogSpeakerText, {
          x: 10,
          y: 20,
          "font-size": "18px",
          fill: "#fff",
          "text-anchor": "left",
          "font-family": "Impact",
        });
        dialogBox.appendChild(dialogSpeakerText);
        dialogText = document.createElementNS(xmlns, "text");
        svgAttrs(dialogText, {
          x: 10,
          y: 40,
          "font-size": "16px",
          fill: "#fff",
          "text-anchor": "left",
          "font-family": "sans-serif",
        });
        dialogBox.appendChild(dialogText);
      }
      function makeWinScreen() {
        winScreen = document.createElementNS(xmlns, "g");
        winScreen.style.display = "none";
        svgElem.appendChild(winScreen);
        var rect = document.createElementNS(xmlns, "rect");
        svgAttrs(rect, {
          x: 0,
          y: 0,
          width: "100%",
          height: "100%",
          fill: "rgba(0,0,0,0.5)",
        });
        winScreen.appendChild(rect);
        var text = document.createElementNS(xmlns, "text");
        svgAttrs(text, {
          x: "50%",
          y: "50%",
          "font-size": "48px",
          fill: "#5f7",
          stroke: "black",
          "stroke-width": "2px",
          "text-anchor": "middle",
          "font-family": "Impact",
        });
        svgInnerHtml(text, "YOU WIN !");
        winScreen.appendChild(text);
        text = document.createElementNS(xmlns, "text");
        svgAttrs(text, {
          x: "50%",
          y: "60%",
          "font-size": "22px",
          fill: "white",
          stroke: "black",
          "stroke-width": "1px",
          "text-anchor": "middle",
          "font-family": "Impact",
        });
        svgInnerHtml(text, "Alas, your Queen is in another castle...");
        winScreen.appendChild(text);
      }
    }
    var dialogOpenY;
    var dialogCloseY;
    function showDialog(whiteKing, texts) {
      if (whiteKing) {
        svgInnerHtml(dialogSpeakerText, "White King :");
      } else {
        svgInnerHtml(dialogSpeakerText, "Black King :");
      }
      var txt = "";
      for (var i = 0; i < texts.length; i++) {
        txt +=
          '<tspan x="10" ' +
          (i === 0 ? "" : 'dy="1.2em"') +
          ">" +
          texts[i] +
          "</tspan>";
      }
      svgInnerHtml(dialogText, txt);
      addIntroTween(
        dialogBox,
        {
          _y: dialogOpenY,
        },
        0,
        0.5
      );
    }
    function hideDialog() {
      addIntroTween(
        dialogBox,
        {
          _y: dialogCloseY,
        },
        0,
        0.5
      );
    }
    var svgInnerHtmlElement = document.createElement("div");
    function svgInnerHtml(svg, html) {
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
      var svgText = "<svg>" + html + "</svg>";
      svgInnerHtmlElement.innerHTML = svgText;
      var nodes = Array.prototype.slice.call(
        svgInnerHtmlElement.childNodes[0].childNodes
      );
      nodes.forEach(function (el) {
        svg.appendChild(el);
      });
    }
    function svgAttrs(el, attrs) {
      if (attrs) {
        for (var key in attrs) {
          el.setAttributeNS(null, key, attrs[key]);
        }
      }
      return el;
    }
    function svgStyle(svgElem, fill, stroke, strokeWidth) {
      var attrs = {};
      if (typeof fill != "undefined") {
        attrs.fill = fill;
      }
      if (typeof stroke != "undefined") {
        attrs.stroke = stroke;
      }
      if (typeof strokeWidth != "undefined") {
        attrs.strokeWidth = strokeWidth;
      }
      svgAttrs(svgElem, attrs);
      return svgElem;
    }

    //-----------------------------------------------------------
    // Input
    //-----------------------------------------------------------

    var keyMap = {
      37: "left",
      // left arrow
      65: "left",
      // a
      81: "left",
      // q
      38: "up",
      // up arrow
      90: "up",
      // z
      87: "up",
      // w
      83: "down",
      // s
      40: "down",
      39: "right",
      // right arrow
      68: "right",
      // d
      32: "space",
      27: "esc",
      13: "enter",
      77: "mute", // m
    };
    // keyName => isDown bool
    var keyBoolMap = {};
    // keyName => int
    var keys = {};
    //Set up key listener
    function onkey(isDown, e) {
      var c = e.keyCode;
      if (e.charCode && !c) c = e.charCode;
      var keyName = keyMap[c];
      if (keyName) {
        e.preventDefault();
        if (!isDown && keyName == "mute") {
          aa.toggleMute();
        }
        //only take events that represent an actual change
        if (keyBoolMap[keyName] !== isDown) {
          keyBoolMap[keyName] = isDown;
          if (typeof keys[keyName] == "undefined") {
            keys[keyName] = -1;
          }
          if (isDown) {
            if (keys[keyName] < 1) {
              keys[keyName] = 1;
            }
          } else {
            if (keys[keyName] > 0) {
              keys[keyName] = 0;
            }
          }
        }
      }
    }

    document.addEventListener("visibilitychange", () => {
      const isActive = !document.hidden;
      if (isActive && !isDocumentActive) {
        lastTime = Date.now();
        tic();
      }
      isDocumentActive = isActive;
    });

    root.addEventListener("keyup", function (e) {
      //DEBUG/CHEAT: pause
      if (!intro && keyBoolMap.enter && !gameIsOver) {
        e.preventDefault();
        raf = !raf;
        pauseText.style.display = raf ? "none" : "block";
        if (raf) {
          lastTime = Date.now();
          tic();
        }
      }
      onkey(false, e);
    });
    root.addEventListener("keydown", function (e) {
      onkey(true, e);
    });
    function onmouse(isClick, e) {
      e.preventDefault();
      mouse.click = isClick;
      onmousemove(e);
      if (!isClick) {
        root?.releasePointerCapture(e.pointerId);
      }
    }
    root.addEventListener("pointerdown", function (e) {
      onmouse(true, e);
    });
    root.addEventListener("pointerup", function (e) {
      onmouse(false, e);
    });
    root.addEventListener("pointercancel", function (e) {
      onmouse(false, e);
    });
    function onmousemove(e) {
      const rect = root.getBoundingClientRect();
      const scaleX = SIZE / rect.width;
      const scaleY = (1.25 * SIZE) / rect.height;

      mouse.x = (e.clientX - rect.left) * scaleX;
      mouse.y = (e.clientY - rect.top) * scaleY;
    }
    root.addEventListener("pointermove", onmousemove);

    init();
    return () => setGameIsOver(true);
  };
})(window.LiChessTools || window);
