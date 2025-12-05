// decay-v3.js - Heat-based memory decay system
// v3.0.0: In-memory storage (Map)
// v3.1.0+: Will migrate to IndexedDB for persistence

export class DecayV3 {
  constructor({ tier = 'temper', startHeat = 50, cooling = 5 } = {}) {
    this.tier = tier;
    this.startHeat = startHeat;
    this.cooling = cooling;
    this.db = new Map(); // In-memory storage
  }

  async store(key, chunk) {
    chunk.heat = this.startHeat;
    chunk.key = key;
    chunk.tier = this.tier;
    this.db.set(key, chunk);
    return chunk;
  }

  async get(key) {
    return this.db.get(key);
  }

  async search({ topK = 5, minHeat = 20 } = {}) {
    const candidates = [...this.db.values()].filter(c => c.heat >= minHeat);

    // Sort by heat (descending), then by recency
    candidates.sort((a, b) => {
      if (b.heat !== a.heat) return b.heat - a.heat;
      return b.created_at - a.created_at;
    });

    return candidates.slice(0, topK);
  }

  async boost(key, amount = 10) {
    const chunk = this.db.get(key);
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
    }
  }

  nightlyDecay() {
    // Run this on a schedule (or on extension load)
    for (const [key, chunk] of this.db) {
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
        this.db.delete(key);
      }
    }
  }

  getStats() {
    const chunks = [...this.db.values()];
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

  clear() {
    this.db.clear();
  }

  size() {
    return this.db.size;
  }
}
