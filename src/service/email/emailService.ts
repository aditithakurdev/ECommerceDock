import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import ejs from "ejs";
class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, templateName: string, data: any) {
    try {
      // load template
      // const templatePath = path.join(__dirname, `../templates/${templateName}`);
      const templatePath = path.join(__dirname, `/template/${templateName}`);
      const template = fs.readFileSync(templatePath, "utf-8");
      const html = ejs.render(template, data);
      const info = await this.transporter.sendMail({
        from: `"Ecomm" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      console.log("Email sent:", info.messageId);
      return info;
    } catch (err: any) {
      console.error("Email error:", err.message || err);
      throw err;
    }
  }

  async sendReminderEmail(
    to: string,
    data: { name: string; plan: string; endDate: Date }
  ) {
    try {
      // point to your template file (make sure it's placed correctly)
      const templatePath = path.join(__dirname, "../templates/subscriptionReminder.ejs");

      const template = fs.readFileSync(templatePath, "utf-8");

      // render with EJS
      const html = ejs.render(template, {
        ...data,
        endDate: data.endDate,
      });

      const info = await this.transporter.sendMail({
        from: `"Ecomm" <${process.env.SMTP_USER}>`,
        to,
        subject: "Subscription Renewal Reminder",
        html,
      });

      console.log("📧 Reminder email sent:", info.messageId);
      return info;
    } catch (err: any) {
      console.error(" Email error:", err.message || err);
      throw err;
    }
  }
}

export default new EmailService();
