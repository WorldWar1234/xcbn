const cache = new Map();

async function get(key) {
  return cache.get(key);
}

async function set(key, value) {
  cache.set(key, value);
}

async function delete(key) {
  cache.delete(key);
}

module.exports = { get, set, delete };
