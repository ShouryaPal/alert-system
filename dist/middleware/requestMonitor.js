"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const redisService_1 = require("../services/redisService");
const emailService_1 = require("../services/emailService");
const prismaService_1 = require("../services/prismaService");
const config_1 = require("../config");
const redisService = new redisService_1.RedisService();
const emailService = new emailService_1.EmailService();
async function validateRequest(req, res, next) {
    var _a;
    const ip = req.ip || req.socket.remoteAddress || "0.0.0.0";
    try {
        if (!((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer "))) {
            const reason = "Invalid authorization header";
            const attemptCount = await redisService.trackFailedRequest(ip);
            await prismaService_1.prisma.failedRequest.create({
                data: {
                    ip,
                    reason,
                    timestamp: new Date(),
                },
            });
            if (attemptCount >= config_1.config.MAX_ATTEMPTS) {
                await emailService.sendAlert(ip, attemptCount);
            }
            return res.status(401).json({ error: reason });
        }
        next();
    }
    catch (error) {
        console.error("Error in request validation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.validateRequest = validateRequest;