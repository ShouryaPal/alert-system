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
      await this.client.zremrangebyscore(key, 0, windowStart);
      await this.client.zadd(key, { score: now, member: now.toString() });
      await this.client.expire(key, config.WINDOW_MINUTES * 60);
      const count = await this.client.zcard(key);
      if (count === 0) {
        await this.client.del(key);
        console.log(
          `Key deleted for IP ${ip} as no attempts are within the window`,
        );
      } else {
        console.log(`Failed attempts for IP ${ip}: ${count}`);
      }

      return count;
    } catch (error) {
      console.error("Redis error:", error);
      return 0;
    }
  }
}
