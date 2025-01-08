import dotenv from "dotenv";
dotenv.config();

export const config = {
  WINDOW_MINUTES: 10,
  MAX_ATTEMPTS: 5,
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL!,
  UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN!,
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: 587,
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
  ALERT_RECIPIENT: process.env.ALERT_RECIPIENT!,
};
