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
      const dbKey = 'lichessTools/LT/localDatabase-NIF-'+fileHandle.name+'-data';
      let indexData = await lt.storage.get(dbKey,{ db: true, raw: true });
      const indexFile = new IndexFile(lt, isCached);
      if (indexData) {
        await indexFile.loadData(indexData,fileHandle);
      } else {
        await indexFile.loadFile(fileHandle);
      }
      const newIndexData = indexFile.getIndexData();
      if (indexData?.file?.lastModified != newIndexData?.file?.lastModified) {
        await lt.storage.set(dbKey, newIndexData, { db: true, raw: true });
      }
      return indexFile;
    }

  }

  class LtFile {
    constructor(lichessTools) {
      this.lichessTools = lichessTools;
      this.position = 0;
    }

    async loadData(data, file) {
      if (!file) throw new Error('No file handle provided');
      this.file = await this.getFileWithPermissions(file);
      if (!this.file) return;
      if (this.file?.lastModified != data.lastModified) {
        await this.loadFile(file);
        return;
      }
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

    dispose() {
      this.file = null;
    }
  }

  class IndexFile extends LtFile {

    constructor(lichessTools, isCached) {
      super(lichessTools);
      this.cache = isCached ? new Map() : null;
    }

    async loadData(data, file) {
      await super.loadData(data,file);
      this.idsString = data.idsString;
      this.ngramDict = data.ngramDict;
      this.ngramsize = data.ngramsize;
      this.ngramIndexSize = data.ngramIndexSize;
      this.idsize = data.idsize;
      this.idIndexSize = data.idIndexSize;
      this.idCountSize = data.idCountSize;
      this.crcCountSize = data.crcCountSize;
      this.crcSize = data.crcSize;
      this.crcs = data.crcs;
    }

    getIndexData() {
      return {
        idsString: this.idsString,
        ngramDict: this.ngramDict,
        ngramsize: this.ngramsize,
        ngramIndexSize: this.ngramIndexSize,
        idsize: this.idsize,
        idIndexSize: this.idIndexSize,
        idCountSize: this.idCountSize,
        crcCountSize: this.crcCountSize,
        crcSize: this.crcSize,
        crcs: this.crcs,
        lastModified: this.file?.lastModified
      };
    }

    dispose() {
      super.dispose();
      this.cache = null;
      this.idsString = null;
      this.ngramDict = null;
      this.ngramsize = null;
      this.ngramIndexSize = null;
      this.idsize = null;
      this.idIndexSize = null;
      this.idCountSize = null;
      this.crcCountSize = null;
      this.crcSize = null;
      this.crcs = null;
    }

    async loadFile(file) {
      await super.loadFile(file);
      const nif = await this.readString(3);
      if (nif!='NIF') throw new Error('Not a NIF file');
      const version = await this.readByte();
      if (version!=1) throw new Error('Only NIF version 1 supported');
      const ngramsize = await this.readByte();
      const ngramIndexSize = await this.readByte();
      const idsize = await this.readByte();
      const idIndexSize = await this.readByte();
      const idCountSize = await this.readByte();
      const flags = await this.readUshort();
      if (flags!=7) throw new Error('Only NIF with ngram and identifier counters and ngram compression supported');
      this.jump(10);
      const idCount = await this.readUint();
      this.idsString = await this.readString(idCount*idsize);
      const compressedSize = await this.readUint();
      const ngrams = await this.readString(compressedSize);
      const ngramDict = new Map();
      const ngramFromIndexDict = new Map();
      for (let i=0; i<=compressedSize - ngramsize; i++) {
        const ngram = ngrams.substr(i,ngramsize);
        if (ngramDict.has(ngram)) continue;
        ngramDict.set(ngram, { index: i });
        ngramFromIndexDict.set(i,ngram);
      }
      const ngramCount = await this.readUint();
      let dataPos = this.position + ngramCount * (ngramIndexSize+idCountSize);
      for (let i=0; i<ngramCount; i++) {
        const ngramIndex = await this.readNumber(ngramIndexSize);
        const ngram = ngramFromIndexDict.get(ngramIndex);
        const info = ngramDict.get(ngram);
        info.indexCount = await this.readNumber(idCountSize);
        info.position = dataPos;
        dataPos += info.indexCount * idIndexSize;
      }
      this.seek(dataPos);
      const crcCountSize = await this.readByte();
      if (crcCountSize) {
        const crcSize = await this.readByte();
        const crcCounts = this.splitToNumbers(await this.readBytes(idCount * crcCountSize),crcCountSize);
        const crcs = [];
        dataPos = this.position;
        for (const crcCount of crcCounts) {
          crcs.push({
            count: crcCount,
            position: dataPos
          });
          dataPos += crcCount * crcSize;
        }
        this.crcCountSize = crcCountSize;
        this.crcSize = crcSize;
        this.crcs = crcs;
      }
      this.ngramDict = ngramDict;
      this.ngramsize = ngramsize;
      this.ngramIndexSize = ngramIndexSize;
      this.idsize = idsize;
      this.idIndexSize = idIndexSize;
      this.idCountSize = idCountSize;
    }

    async search(text) {
      if (!text) return [];
      let result = this.cache?.get(text);
      if (result) return result;
      let hits = 0;
      let data = null;
      for (let i=0; i<=text.length - this.ngramsize; i++) {
        const ngram = text.substr(i,this.ngramsize);
        const info = this.ngramDict.get(ngram);
        if (!info) {
          data=[];
          break;
        }
        if (!info.indexCount) continue;
        hits++;
        this.seek(info.position);
        const bytes = await this.readBytes(info.indexCount * this.idIndexSize);
        const ids = this.splitToNumbers(bytes, this.idIndexSize);
        data = data ? this.intersect(ids,data) : ids;
        if (data.length == 0) break;
      }
      const confidence = Math.round(100*hits/(text.length - this.ngramsize+1));
      //data.length && console.debug('confidence: '+confidence+'% ('+data.length+')');
      result = [];
      const lt = this.lichessTools;
      const crc = lt.crc24(text);
      if (data) {
        for (let i=0; i<data.length; i++) {
          const index = data[i];
          const id = this.idsString.substr(index*this.idsize,this.idsize);
          if (this.crcs?.length) {
            const crcInfo = this.crcs[index];
            this.seek(crcInfo.position);
            const bytes = await this.readBytes(crcInfo.count * this.crcSize);
            const crcs = this.splitToNumbers(bytes, this.crcSize);
            if (crcs.includes(crc)) {
              result.push(id);
            }
          } else {
            result.push(id);
          }
        }
      }
      this.cache?.set(text,result);
      return result;
    }
  }

  LiChessTools.Tools.LocalDatabase = LocalDatabaseTool;
})();
