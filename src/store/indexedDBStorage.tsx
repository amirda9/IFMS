export default  function createIndexedDBStorage(dbName: string, storeName: string) {
    const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName);
  
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  
    return {
      async getItem(key: string): Promise<string | null> {
        const db = await dbPromise;
        return new Promise<string | null>((resolve, reject) => {
          const transaction = db.transaction(storeName, "readonly");
          const store = transaction.objectStore(storeName);
          const request = store.get(key);
  
          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => reject(request.error);
        });
      },
  
      async setItem(key: string, value: string): Promise<void> {
        const db = await dbPromise;
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(storeName, "readwrite");
          const store = transaction.objectStore(storeName);
          const request = store.put(value, key);
  
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      },
  
      async removeItem(key: string): Promise<void> {
        const db = await dbPromise;
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(storeName, "readwrite");
          const store = transaction.objectStore(storeName);
          const request = store.delete(key);
  
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      },
    };
  }