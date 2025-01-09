import nodemailer from "nodemailer";
import { config } from "../config";
import { format } from "date-fns";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: false,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
    });
  }

  async sendAlert(ip: string, attemptCount: number): Promise<void> {
    const now = new Date();
    const formattedTime = format(now, "MMM-d HH:mm");

    await this.transporter.sendMail({
      from: config.SMTP_USER,
      to: config.ALERT_RECIPIENT,
      subject: `Security Alert: Multiple Failed Requests from ${ip}`,
      text: `
        Alert: IP ${ip} has made ${attemptCount} failed attempts
        in the last ${config.WINDOW_MINUTES} minutes.

        Time: ${formattedTime}
      `,
    });
  }
}
