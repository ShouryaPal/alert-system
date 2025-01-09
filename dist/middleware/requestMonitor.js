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
            // Increment the failed request count
            const attemptCount = await redisService.trackFailedRequest(ip);
            // Only log to the database and send an alert on the 5th attempt or more
            if (attemptCount >= config_1.config.MAX_ATTEMPTS) {
                // Store the failed request details in the database
                await prismaService_1.prisma.failedRequest.create({
                    data: {
                        ip,
                        reason,
                        timestamp: new Date(),
                        formattedTime: new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }).format(new Date()),
                    },
                });
                // Send an alert email if it's the 5th attempt
                if (attemptCount >= config_1.config.MAX_ATTEMPTS) {
                    console.log(`Sending alert for IP ${ip} with ${attemptCount} failed attempts.`);
                    await emailService.sendAlert(ip, attemptCount);
                }
                else {
                    console.log(`IP ${ip} has ${attemptCount} failed attempts. No alert triggered.`);
                }
            }
            return res.status(401).json({ error: reason });
        }
        // If valid, proceed to the next middleware
        next();
    }
    catch (error) {
        console.error("Error in request validation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.validateRequest = validateRequest;
