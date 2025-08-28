import { Request, Response } from "express";
import paymentService from "../../service/paymentService/payment.service";

class PaymentController {
  // Create Stripe checkout session
  async createCheckoutSession(req: Request, res: Response) {
    try {
      const { name, price } = req.body;

      if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
      }

      const session = await paymentService.createCheckoutSession({ name, price });

      return res.status(200).json({ url: session.url });
    } catch (err: any) {
      console.error("Stripe Session Error:", err);
      return res.status(500).json({
        message: "Failed to create checkout session",
        error: err.message,
      });
    }
  }
}

export default new PaymentController();
