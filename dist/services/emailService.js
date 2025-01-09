"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const date_fns_1 = require("date-fns");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: config_1.config.SMTP_HOST,
            port: config_1.config.SMTP_PORT,
            secure: false,
            auth: {
                user: config_1.config.SMTP_USER,
                pass: config_1.config.SMTP_PASSWORD,
            },
        });
    }
    async sendAlert(ip, attemptCount) {
        const now = new Date();
        const formattedTime = (0, date_fns_1.format)(now, "MMM-d HH:mm");
        await this.transporter.sendMail({
            from: config_1.config.SMTP_USER,
            to: config_1.config.ALERT_RECIPIENT,
            subject: `Security Alert: Multiple Failed Requests from ${ip}`,
            text: `
        Alert: IP ${ip} has made ${attemptCount} failed attempts
        in the last ${config_1.config.WINDOW_MINUTES} minutes.

        Time: ${formattedTime}
      `,
        });
    }
}
exports.EmailService = EmailService;
