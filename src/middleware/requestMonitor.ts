import { Request, Response, NextFunction } from "express";
import { RedisService } from "../services/redisService";
import { EmailService } from "../services/emailService";
import { prisma } from "../services/prismaService";
import { config } from "../config";

const redisService = new RedisService();
const emailService = new EmailService();

export async function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const ip = req.ip || req.socket.remoteAddress || "0.0.0.0";

  try {
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      const reason = "Invalid authorization header";
      const attemptCount = await redisService.trackFailedRequest(ip);
      await prisma.failedRequest.create({
        data: {
          ip,
          reason,
          timestamp: new Date(),
        },
      });

      if (attemptCount >= config.MAX_ATTEMPTS) {
        await emailService.sendAlert(ip, attemptCount);
      }

      return res.status(401).json({ error: reason });
    }

    next();
  } catch (error) {
    console.error("Error in request validation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
