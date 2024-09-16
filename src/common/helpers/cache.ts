import { LRUCache } from "lru-cache";

export const cache = new LRUCache({
  // https://www.npmjs.com/package/lru-cache
  max: 1000,
  ttl: 1000 * 60 * 5,
});
