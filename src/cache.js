const cache = new Map();
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
let currentCacheSize = 0;

async function get(key) {
  return cache.get(key);
}

async function set(key, value) {
  const valueSize = getValueSize(value);
  if (currentCacheSize + valueSize > MAX_CACHE_SIZE) {
    // Evict oldest cache entries to make room for the new entry
    evictOldestEntries(valueSize);
  }
  cache.set(key, value);
  currentCacheSize += valueSize;
}

async function delete(key) {
  const value = cache.get(key);
  if (value) {
    currentCacheSize -= getValueSize(value);
    cache.delete(key);
  }
}

function getValueSize(value) {
  // Approximate the size of the value in bytes
  return JSON.stringify(value).length;
}

function evictOldestEntries(sizeNeeded) {
  // Evict oldest cache entries until we have enough room
  const keys = Array.from(cache.keys());
  while (currentCacheSize + sizeNeeded > MAX_CACHE_SIZE) {
    const oldestKey = keys.shift();
    const oldestValue = cache.get(oldestKey);
    currentCacheSize -= getValueSize(oldestValue);
    cache.delete(oldestKey);
  }
}

module.exports = { get, set, delete };
