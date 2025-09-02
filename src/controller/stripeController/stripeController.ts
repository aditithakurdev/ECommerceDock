import { Request, Response } from "express";
import StripeService  from "../../service/StripeService/stripeService";

class StripeController {
    // Create a new Product
    async create(req: Request, res: Response) {
    try {
      const { userId, email, paymentMethodId, priceId } = req.body;

      if (!userId || !email || !paymentMethodId || !priceId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await StripeService.createUserSubscription(
        userId,
        email,
        paymentMethodId,
        priceId
      );

      return res.status(201).json({
        message: "Subscription created successfully",
        subscription: result,
      });
    } catch (err: any) {
      return res.status(500).json({
        message: "Subscription creation failed",
        error: err.message,
      });
    }
  }
}

    export default new StripeController();