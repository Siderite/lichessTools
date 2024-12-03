(() => {
  class LocalDatabaseTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'localDatabase',
        category: 'filesystem',
        type: 'single',
        possibleValues: [false, true],
        defaultValue: true,
        advanced: true,
        hidden: true
      }
    ];

    intl = {
      'en-US': {
        'options.filesystem': 'Local files',
        'options.localDatabase': 'Local database functionality'
      },
      'ro-RO': {
        'options.filesystem': 'Fi\u015fiere locale',
        'options.localDatabase': 'Func\u0163ionalitate baz\u0103 de date local\u0103'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = !!lt.currentOptions.getValue('localDatabase');
      this.logOption('Local database', value || 'not set');
      if (value) {
        lt.file = new FileSystem(lt);
      } else {
        lt.file = null;
      }
    }

  }

  class FileSystem {

    constructor(lichessTools) {
      this.lichessTools = lichessTools;
    }

    async openIndex(fileHandle, isCached = true) {
      const lt = this.lichessTools;
      if (!fileHandle) {
        return;
      }
      const indexFile = new IndexFile(lt, isCached);
      await indexFile.loadFile(fileHandle);
      return indexFile;
    }

  }

  class LtFile {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
      this.position = 0;
    }

    async loadFile(file) {
      if (!file) throw new Error('No file handle provided');
      this.file = await this.getFileWithPermissions(file);
      if (!this.file) return;
      this.position = 0;
    }

    getFileWithPermissions = async (file, readWrite)=>{
      if (!file.getFile) return file;
      if (!file.requestPermission) return file.getFile();
      if (navigator.userActivation) {
        const timeout = (ms)=>{
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        while (!navigator.userActivation.hasBeenActive) {
          await timeout(100);
        }
      }
      const options = {};
      if (readWrite) {
        options.mode = 'readwrite';
      }
      if ((await file.queryPermission(options)) === 'granted') {
        return file.getFile();
      }
      if ((await file.requestPermission(options)) === 'granted') {
        return file.getFile();
      }
      console.warn('No file permission available!');
      return null;
    };

    jump(length) {
      this.position += length;
    }
    seek(length) {
      this.position = length;
    }
    splitToNumbers(bytes, byteCount) {
      const result = [];
      for (var i=0; i<bytes.length; i+=byteCount) {
        let val=0;
        for (var k=0; k<byteCount; k++) {
          val += (bytes.at(i+k) << (k*8));
        }
        result.push(val);
      }
      return result;
    }
    intersect(a, b) {
      const setB = new Set(b);
      return [...new Set(a)].filter(x => setB.has(x));
    }
    async readString(length) {
      const blob = this.file.slice(this.position,this.position+length);
      this.position+=length;
      return await blob.text();
    }
    async readBytes(length) {
      const blob = this.file.slice(this.position,this.position+length);
      this.position+=length;
      const buffer = await blob.arrayBuffer();
      return new Uint8Array(buffer);
    }
    async readByte() {
      const bytes = await this.readBytes(1);
      return bytes.at(0);
    }
    async readUshort() {
      return this.readNumber(2);
    }
    async readUint() {
      return this.readNumber(4);
    }
    async readNumber(byteCount) {
      const bytes = await this.readBytes(byteCount);
      let result = 0;
      for (var i=0; i<byteCount; i++) {
        result+=(bytes.at(i) << (8*i));
      }
      return result;
    }
    sizeInBytes(nr) {
      return Math.max(1,Math.ceil(Math.log(nr)/Math.log(256)));
    }
    dispose() {
      this.file = null;
    }
  }

  class IndexFile extends LtFile {

    constructor(lichessTools, isCached) {
      super(lichessTools);
      this.cache = isCached ? new Map() : null;
    }

    dispose() {
      super.dispose();
      this.cache = null;
      this.idSize = null;
      this.idIndexSize = null;
      this.ngramSize = null;
      this.crcSize = null;
      this.ngramDict = null;
      this.idDict = null;
    }

    async loadFile(file) {
      await super.loadFile(file);
      const nif = await this.readString(3);
      if (nif!='NIF') throw new Error('Not a NIF file');
      const version = await this.readByte();
      if (version!=2) throw new Error('Only NIF version 2 supported');
      const idSize = await this.readByte();
      const idCountSize = await this.readByte();
      const idCount = await this.readUint();
      const idIndexSize = this.sizeInBytes(idCount)
      const ngramSize = await this.readByte();
      const ngramStringSize = await this.readUint();
      const crcSize = await this.readByte();
      if (crcSize!=3) throw new Error('Only crc24 supported');
      const ngramString = await this.readString(ngramStringSize);
      this.idStartPosition = this.position;
      this.jump(idCount * idSize);
      const ngramDict = new Map();
      const ngramBytes = await this.readBytes((ngramStringSize-ngramSize+1)*(4 + idCountSize));
      for (let i=0; i<ngramStringSize-ngramSize+1; i++) {
        const ngram = ngramString.substr(i,ngramSize);
        const data = { 
          pos: 0, 
          idCount: 0
        }
        for (let k=0; k<4; k++) {
          data.pos += (ngramBytes.at(i*(4+idCountSize)+k) << (k*8));
        }
        for (let k=0; k<idCountSize; k++) {
          data.idCount += (ngramBytes.at(i*(4+idCountSize)+4+k) << (k*8));
        }
        ngramDict.set(ngram,data);
      }
      const idBytes = await this.readBytes(idCount*(4+1));
      const idDict = [];
      for (let i=0; i<idCount; i++) {
        const data = {
          pos: 0, 
          crcCount: idBytes.at(i*(4+1)+4)
        }
        for (let k=0; k<4; k++) {
          data.pos += (idBytes.at(i*(4+1)+k) << (k*8));
        }
        idDict.push(data);
      }

      this.idSize = idSize;
      this.idIndexSize = idIndexSize;
      this.ngramSize = ngramSize;
      this.crcSize = crcSize;
      this.ngramDict = ngramDict;
      this.idDict = idDict;
    }

    async search(text) {
      if (!text) return [];
      let result = this.cache?.get(text);
      if (result) return result;
      let hits = 0;
      let data = null;
      for (let i=0; i<=text.length - this.ngramSize; i++) {
        const ngram = text.substr(i,this.ngramSize);
        const info = this.ngramDict.get(ngram);
        if (!info) {
          data=[];
          break;
        }
        if (!info.idCount) continue;
        hits++;
        this.seek(info.pos);
        const bytes = await this.readBytes(info.idCount * this.idIndexSize);
        const indexes = this.splitToNumbers(bytes, this.idIndexSize);
        data = data ? this.intersect(indexes,data) : indexes;
        if (data.length == 0) break;
      }
      const confidence = Math.round(100*hits/(text.length - this.ngramSize+1));
      //data.length && console.debug('confidence: '+confidence+'% ('+data.length+')');
      const idxs = [];
      const lt = this.lichessTools;
      const crc = lt.crc24(text);
      if (data) {
        for (let i=0; i<data.length; i++) {
          const index = data[i];
          const info = this.idDict[index];
          if (info.crcCount) {
            this.seek(info.pos);
            const bytes = await this.readBytes(info.crcCount * this.crcSize);
            const crcs = this.splitToNumbers(bytes, this.crcSize);
            if (crcs.includes(crc)) {
              idxs.push(index);
            }
          }
        }
      }
      result = [];
      for (let index of idxs) {
        const pos = this.idStartPosition + index * this.idSize;
        this.seek(pos);
        const id = await this.readString(this.idSize);
        result.push(id);
      }
      this.cache?.set(text,result);
      return result;
    }
  }

  LiChessTools.Tools.LocalDatabase = LocalDatabaseTool;
})();
