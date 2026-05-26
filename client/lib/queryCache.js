const cache = new Map();
const inflight = new Map();
const TTL = 30_000; // 30 seconds

export const queryCache = {
  get(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > TTL) { cache.delete(key); return null; }
    return entry.data;
  },

  set(key, data) {
    cache.set(key, { data, ts: Date.now() });
  },

  invalidate(prefix) {
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) cache.delete(key);
    }
  },

  // Deduplication: if same key is already in-flight, return same promise
  async dedupe(key, fetcher) {
    if (inflight.has(key)) return inflight.get(key);
    const promise = fetcher().finally(() => inflight.delete(key));
    inflight.set(key, promise);
    return promise;
  },
};
