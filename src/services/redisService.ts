import { Redis } from "@upstash/redis";
import { config } from "../config";

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      url: config.UPSTASH_REDIS_URL,
      token: config.UPSTASH_REDIS_TOKEN,
    });
  }

  async trackFailedRequest(ip: string): Promise<number> {
    const key = `failed:${ip}`;
    const now = Date.now();
    const windowMs = config.WINDOW_MINUTES * 60 * 1000;
    const windowStart = now - windowMs;

    try {
      // Remove old entries
      await this.client.zremrangebyscore(key, 0, windowStart);

      // Add new entry using the correct score member format
      await this.client.zadd(key, { score: now, member: now.toString() });

      // Set expiration
      await this.client.expire(key, config.WINDOW_MINUTES * 60);

      // Get count of failed attempts in window
      const count = await this.client.zcard(key);
      return count;
    } catch (error) {
      console.error("Redis error:", error);
      return 0;
    }
  }
}
