// decay-v3.js - Heat-based memory decay system with IndexedDB persistence
// v3.0.0: IndexedDB storage for persistence across sessions

export class DecayV3 {
  constructor({ tier = 'temper', startHeat = 50, cooling = 5 } = {}) {
    this.tier = tier;
    this.startHeat = startHeat;
    this.cooling = cooling;
    this.dbName = 'dedobe-memory';
    this.storeName = 'chunks';
    this.dbPromise = this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }

  async store(key, chunk) {
    const db = await this.dbPromise;
    chunk.heat = this.startHeat;
    chunk.key = key;
    chunk.tier = this.tier;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(chunk);

      request.onsuccess = () => resolve(chunk);
      request.onerror = () => reject(request.error);
    });
  }

  async get(key) {
    const db = await this.dbPromise;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll() {
    const db = await this.dbPromise;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async search({ topK = 5, minHeat = 20 } = {}) {
    const allChunks = await this.getAll();
    const candidates = allChunks.filter(c => c.heat >= minHeat);

    // Sort by heat (descending), then by recency
    candidates.sort((a, b) => {
      if (b.heat !== a.heat) return b.heat - a.heat;
      return b.created_at - a.created_at;
    });

    return candidates.slice(0, topK);
  }

  async boost(key, amount = 10) {
    const chunk = await this.get(key);
    if (chunk) {
      chunk.heat = Math.min(100, chunk.heat + amount);

      // Update tier based on heat
      if (chunk.heat >= 80) {
        chunk.tier = 'vow';
      } else if (chunk.heat >= 30) {
        chunk.tier = 'temper';
      } else {
        chunk.tier = 'quench';
      }

      await this.store(key, chunk);
    }
  }

  async nightlyDecay() {
    const db = await this.dbPromise;
    const allChunks = await this.getAll();

    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    for (const chunk of allChunks) {
      chunk.heat = Math.max(0, chunk.heat - this.cooling);

      // Update tier
      if (chunk.heat >= 80) {
        chunk.tier = 'vow';
      } else if (chunk.heat >= 30) {
        chunk.tier = 'temper';
      } else if (chunk.heat > 0) {
        chunk.tier = 'quench';
      }

      // Remove dead chunks (heat reached 0)
      if (chunk.heat === 0) {
        store.delete(chunk.key);
      } else {
        store.put(chunk);
      }
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getStats() {
    const chunks = await this.getAll();
    return {
      total: chunks.length,
      avgHeat: chunks.reduce((sum, c) => sum + c.heat, 0) / chunks.length || 0,
      hottest: chunks.sort((a, b) => b.heat - a.heat)[0] || null,
      byTier: {
        vow: chunks.filter(c => c.tier === 'vow').length,
        temper: chunks.filter(c => c.tier === 'temper').length,
        quench: chunks.filter(c => c.tier === 'quench').length
      }
    };
  }

  async clear() {
    const db = await this.dbPromise;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async size() {
    const db = await this.dbPromise;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
