import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis() {
  if (!process.env.REDIS_URL) return null;
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
    });
    redis.on("error", (err) => console.warn("[redis]", err.message));
  }
  return redis;
}

/** Publish a real-time event (e.g. new order) to subscribers. */
export async function publish(channel: string, payload: unknown) {
  const r = getRedis();
  if (!r) return;
  try {
    await r.publish(channel, JSON.stringify(payload));
  } catch {
    /* fail silently in dev */
  }
}
