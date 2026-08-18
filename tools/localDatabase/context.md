# Local Database Tool

## Purpose

Provides a local file system (`lt.file`) for reading and searching NIF (Neural Index File) format databases stored as files. Creates FileSystem, LtFile, and IndexFile classes for file handling with permission management, binary reading, CRC24 verification, ngram-based text search.

## Functionality

- **localDatabase preference**: single type with values [false, true]. Default: true. Advanced (`advanced: true`). Hidden (`hidden: true`).
- When enabled: `lt.file = new FileSystem(lt)`; when disabled: `lt.file = null`.

## Class Hierarchy

### FileSystem
- Constructor receives lichessTools.
- **openIndex(fileHandle, isCached)**: Creates IndexFile (isCached=true/false), loads file via indexFile.loadFile(fileHandle), returns indexFile.

### LtFile
- Constructor receives lichessTools; position=0.
- **loadFile(file)**: Throws error if no file handle; gets file with permissions via getFileWithPermissions(file, readWrite); resets position=0.
- **getFileWithPermissions(file, readWrite)**: If file has getFile → returns directly; if needs requestPermission → waits for navigator.userActivation.hasBeenActive (100ms loop); queries permission with mode='readwrite' if readWrite requested; grants → returns file.getFile(); console.warn if no permission.
- **jump(length)**: position += length; **seek(length)**: position = length.
- **splitToNumbers(u8, byteCount)**: Floor(byteLength/byteCount) elements; each val = u8[i+k] << (8*k) OR'd across k=0..byteCount-1. Little-endian.
- **intersect(list1, list2)**: Sorted merge intersection — advances i/j based on li<lj comparison. Returns common values.
- **readString(length)**: file.slice(position,position+length), position+=length, returns blob.text().
- **readBytes(length)**: same slice → arrayBuffer → new Uint8Array(buffer).
- **readByte()**: readNumber(1); **readUshort()**: readNumber(2); **readUint()**: readNumber(4).
- **readNumber(byteCount)**: u8 via readBytes(byteCount), result = u8[i] << (i*8) OR'd across i=0..byteCount. Little-endian.
- **sizeInBytes(nr)**: Math.max(1, Math.ceil(Math.log(nr)/Math.log(256)).
- **dispose()**: file=null.

### IndexFile extends LtFile
- Constructor receives lichessTools, isCached (Map or null). checkCrc=true.
- **dispose()**: super.dispose(); cache=null; idSize/idIndexSize/ngramSize/crcSize/ngramDict/idDict=null.
- **loadFile(file)**: super.loadFile(file); reads header:
  - NIF magic bytes (3) → must be 'NIF'
  - version byte → must be 2
  - idSize byte, idCountSize byte
  - idCount uint → idIndexSize = sizeInBytes(idCount)
  - ngramSize byte, ngramStringSize uint
  - crcSize byte → must be 3 (crc24 only)
  - ngramString string (ngramStringSize bytes)
  - idStartPosition = position; jump(idCount * idSize)
  - ngramDict Map: stride=4+idCountSize, reads (ngramStringSize-ngramSize+1)*stride bytes; each i: ngram=ngramString.substr(i,ngramSize), offset=i*stride; data={pos: bytes[offset..offset+3] little-endian uint, idCount: bytes[offset+4..offset+4+idCountSize-1]}
  - idDict Array(idCount): stride=4+1, reads idCount*stride bytes; each i: data={pos: bytes[offset..offset+3] uint, crcCount: byte[offset+4]}

## Search (IndexFile.search(text))

- If no text or no idDict → returns []
- Cache lookup if exists → returns cached result
- For each i=0..text.length-ngramSize: ngram=text.substr(i,ngramSize); info=ngramDict.get(ngram):
  - If no info → data=[]; break
  - If no info.idCount → continue
  - hits++; seek(info.pos); readBytes(info.idCount*idIndexSize); splitToNumbers → indexes; intersect(indexes,data) if data exists; if data.length==0 → break
- confidence = Math.round(100*hits/(text.length-ngramSize+1))
- crc = lt.crc24(text)
- For each index in data: if checkCrc → info=idDict[index]; if info.crcCount → seek(info.pos); readBytes(info.crcCount*crcSize); splitToNumbers → crcs; if crcs.includes(crc) → idxs.push(index); else (no checkCrc) → push
- For each index in idxs: pos=idStartPosition+index*idSize; seek(pos); readString(idSize) → id; result.push(id)
- Cache.set(text,result) if cache exists. Returns result array of IDs.

## Dependencies

None.
