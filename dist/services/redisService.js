"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const redis_1 = require("@upstash/redis");
const config_1 = require("../config");
class RedisService {
    constructor() {
        this.client = new redis_1.Redis({
            url: config_1.config.UPSTASH_REDIS_URL,
            token: config_1.config.UPSTASH_REDIS_TOKEN,
        });
    }
    async trackFailedRequest(ip) {
        const key = `failed:${ip}`;
        const now = Date.now();
        const windowMs = config_1.config.WINDOW_MINUTES * 60 * 1000;
        const windowStart = now - windowMs;
        try {
            await this.client.zremrangebyscore(key, 0, windowStart);
            await this.client.zadd(key, { score: now, member: now.toString() });
            await this.client.expire(key, config_1.config.WINDOW_MINUTES * 60);
            const count = await this.client.zcard(key);
            if (count === 0) {
                await this.client.del(key);
                console.log(`Key deleted for IP ${ip} as no attempts are within the window`);
            }
            else {
                console.log(`Failed attempts for IP ${ip}: ${count}`);
            }
            return count;
        }
        catch (error) {
            console.error("Redis error:", error);
            return 0;
        }
    }
}
exports.RedisService = RedisService;
