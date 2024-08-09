import { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

export default function rateLimit(options: {
  interval: number;
  uniqueTokenPerInterval: number;
}) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (req: NextRequest, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        if (isRateLimited) {
          reject();
        } else {
          resolve();
        }
      }),
  };
}