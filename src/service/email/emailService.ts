import nodemailer from "nodemailer";

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

  async sendMail(to: string, subject: string,  html: string, context: any) {
    try {
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
}

export default new EmailService();
