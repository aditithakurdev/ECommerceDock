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
      subscriptionId: result.stripeSubscription.id,
      status: result.stripeSubscription.status,
      clientSecret:
        (result.stripeSubscription.latest_invoice as any)?.payment_intent
          ?.client_secret || null, // important for payment confirmation
      dbSubscription: result.dbSubscription,
    });
  } catch (err: any) {
    console.error("Subscription create error:", err);
    return res.status(500).json({
      message: "Subscription creation failed",
      error: err.message,
    });
  }
}

}

    export default new StripeController();