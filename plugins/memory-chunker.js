// memory-chunker.js - Heat-based memory system for conversation chunks
import { DecayV3 } from './decay-v3.js';

export class MemoryChunker {
  constructor() {
    this.decay = new DecayV3({ tier: 'temper', startHeat: 50, cooling: 5 });
  }

  async chunk(text, role, timestamp = Date.now()) {
    const sentiment = simpleSentiment(text);
    const key = await sha256(text + timestamp);
    const chunk = {
      text,
      role,
      sentiment,
      heat: 50,
      tier: 'temper',
      created_at: timestamp
    };
    await this.decay.store(key, chunk);
    return chunk;
  }

  async getRecentContext(topK = 5) {
    return this.decay.search({ topK, minHeat: 20 });
  }

  async exportWithChunks() {
    // Returns all chunks above minimum heat for export
    return this.decay.search({ topK: 1000, minHeat: 1 });
  }

  getStats() {
    return this.decay.getStats();
  }

  clear() {
    this.decay.clear();
  }
}

function simpleSentiment(text) {
  // Basic valence scoring: -1 (negative), 0 (neutral), 1 (positive)
  const positive = /\b(love|happy|great|thanks|thank you|wonderful|amazing|awesome|excellent|good|nice|appreciate)\b/i;
  const negative = /\b(hate|sad|angry|frustrated|terrible|awful|bad|wrong|sorry|unfortunately|problem|issue)\b/i;

  const posMatches = (text.match(positive) || []).length;
  const negMatches = (text.match(negative) || []).length;

  if (posMatches > negMatches) return 1;
  if (negMatches > posMatches) return -1;
  return 0;
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
