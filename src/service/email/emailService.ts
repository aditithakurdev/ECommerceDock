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

   async sendReminderEmail(to: string, data: { name: string; plan: string; endDate: Date }) {
    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your ${data.plan} subscription renews soon`,
      text: `Hi ${data.name},\n\nYour ${data.plan} subscription will renew on ${data.endDate.toDateString()}.
              We just wanted to remind you in advance.\n\nThanks,\nYour Team`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
