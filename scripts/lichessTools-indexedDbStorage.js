(() => {
  class IndexedDbStorage {
    async getItem(key) {
      const dbInfo = this.getDbInfo(key);
      const db = await this.dbConnect(dbInfo);
      const store = db.transaction([dbInfo.storeName],'readonly').objectStore(dbInfo.storeName);
      const result = store.get(dbInfo.itemName);
      return await this.actionPromise(result,true);
    }

    async setItem(key, value) {
      const dbInfo = this.getDbInfo(key);
      const db = await this.dbConnect(dbInfo);
      const store = db.transaction([dbInfo.storeName],'readwrite').objectStore(dbInfo.storeName);
      const result = store.put(value, dbInfo.itemName);
      return await this.actionPromise(result,true);
    }

    async removeItem(key) {
      const dbInfo = this.getDbInfo(key);
      const db = await this.dbConnect(dbInfo);
      const store = db.transaction([dbInfo.storeName],'readwrite').objectStore(dbInfo.storeName);
      const result = store.delete(dbInfo.itemName);
      return await this.actionPromise(result,true);
    }

    async clearStore(key) {
      const dbInfo = this.getDbInfo(key);
      const db = await this.dbConnect(dbInfo);
      const store = db.transaction([dbInfo.storeName],'readwrite').objectStore(dbInfo.storeName);
      const result = store.clear();
      return await this.actionPromise(result,true);
    }

    getDbInfo(key) {
      const match=/^(?<dbName>[^\/]+?)\/(?<storeName>[^\/]+?)\/(?<itemName>[^\/]+)$/.exec(key);
      if (!match) throw new Error('Invalid db storage key: '+key);
      const { dbName, storeName, itemName } = match.groups;
      return { dbName, storeName, itemName };
    }

    async removeAllBy(key, fieldName, method, threshold) {
      const dbInfo = this.getDbInfo(key);
      let db = await this.dbConnect(dbInfo);

      let store = db.transaction([dbInfo.storeName],'readwrite').objectStore(dbInfo.storeName);
      if (!store.indexNames.contains(fieldName)) {
        db.close();
        db = await this.upgradeDbWithIndex(dbInfo, fieldName);
        store = db.transaction([dbInfo.storeName],'readwrite').objectStore(dbInfo.storeName);
      }
      const index = store.index(fieldName);

      let range;
      if (method === 'upperBound') {
        range = IDBKeyRange.upperBound(threshold, true); // Exclusive upper bound
      } else {
        throw new Error(`Unsupported method: ${method}. Only 'upperBound' is supported.`);
      }

      const deletions = [];
      const request = index.openCursor(range);

      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            deletions.push(this.actionPromise(store.delete(cursor.primaryKey)));
            cursor.continue();
          } else {
            Promise.all(deletions)
              .then(() => resolve({ length: deletions.length }))
              .catch(reject)
              .finally(()=>{
                db.close();
              });
          }
        };

        request.onerror = (event) => {
          reject(new Error(`Cursor error: ${event.target.error}`));
        };
      });
    }

    async upgradeDbWithIndex(dbInfo, fieldName) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbInfo.dbName, dbInfo.version + 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const txn = event.target.transaction;
          const store = txn.objectStore(dbInfo.storeName);
          store.createIndex(fieldName, fieldName, { unique: false });
        };

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(new Error(`Upgrade error: ${event.target.error}`));
        };
      });
    }

    actionPromise(res,closeAtEnd) {
      return new Promise((resolve, reject) => {
        res.onsuccess = (e) => {
          if (closeAtEnd) {
            const db = e.target.transaction?.db;
            db?.close();
          }
          resolve(e.target.result);
        };
        res.onerror = (e) => {
          if (e.target.error.name === "QuotaExceededError") {
            globalThis.console.warn("Storage limit reached!");
          }
          if (closeAtEnd) {
            const db = e.target.transaction?.db;
            db?.close();
          }
          reject(e.target.error);
        };
      });
    }

    async dbConnect(dbInfo) {
      return new Promise((resolve, reject) => {
        const versionCheckRequest = globalThis.indexedDB.open(dbInfo.dbName);

        versionCheckRequest.onsuccess = (ev) => {
          const db = ev.target.result;
          const currentVersion = db.version;
          const needsUpgrade = !db.objectStoreNames.contains(dbInfo.storeName);
          db.close();

          const finalVersion = needsUpgrade ? currentVersion+1 : currentVersion;
          dbInfo.version = finalVersion;
          const result = globalThis.indexedDB.open(dbInfo.dbName, finalVersion);

          result.onsuccess = (e) => {
            const result = e.target.result;
            result.onversionchange = (ev)=>{
              result.close();
              globalThis.console.debug("Database is outdated, please reload the page.",ev)
            };
            resolve(result);
          };
          result.onerror = (e) => reject(e.target.error ?? 'IndexedDB Unavailable');
          result.onupgradeneeded = (e) => {
            const db = e.target.result;
            const txn = e.target.transaction;
            const store = db.objectStoreNames.contains(dbInfo.storeName)
              ? txn.objectStore(dbInfo.storeName)
              : db.createObjectStore(dbInfo.storeName);

            dbInfo.upgrade?.(e, store);
          };
          result.onblocked = ()=>{
            throw new Error("Database is blocked, connection must be open elsewhere.")
          };
        };
      });

      versionCheckRequest.onerror = (event) => {
        globalThis.console.error("Database version check failed:", event.target.errorCode);
      };
    }
  }

  LiChessTools.IndexedDbStorage = IndexedDbStorage;
})();