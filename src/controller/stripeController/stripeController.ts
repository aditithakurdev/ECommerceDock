import { Request, Response } from "express";
import { ResponseMessages } from "../../utils/enum/responseMessages";
import { ErrorMessages } from "../../utils/enum/errorMessages";
import {stripeService} from "../../service/index";

class StripeController {
    // Create a new Product
    async create(req: Request, res: Response) {
    try {
      const { userId, email, paymentMethodId, priceId } = req.body;

      if (!userId || !email || !paymentMethodId || !priceId) {
        return res.status(400).json({ message: ErrorMessages.MISSING_FIELD });
      }

      const result = await stripeService.createUserSubscription(
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
  
  
    async manualSync(req: Request, res: Response) {
  try {
    const { subId } = req.params; 
    if (!subId) {
      return res.status(400).json({ error:ErrorMessages.MISSING_ID});
    }

    await stripeService.syncSubscription(subId);
    res.json({ message: `Subscription ${subId} sync completed` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
}

    export default new StripeController();