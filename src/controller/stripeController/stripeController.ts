import { Request, Response } from "express";
import StripeService  from "../../service/StripeService/stripeService";
import { ResponseMessages } from "../../utils/enum/responseMessages";
import { ErrorMessages } from "../../utils/enum/errorMessages";

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
      message: ResponseMessages.SUBSCRIPTION_CREATED,
      subscriptionId: result.stripeSubscription.id,
      status: result.stripeSubscription.status,
      clientSecret:
        (result.stripeSubscription.latest_invoice as any)?.payment_intent
          ?.client_secret || null,
      dbSubscription: result.dbSubscription,
    });
   } catch (err: any) {
        console.error(err);
        return res.status(500).json({
          message:ErrorMessages.INTERNAL_SERVER_ERROR,
          error: err.message
        });
      }
    }

}

    export default new StripeController();