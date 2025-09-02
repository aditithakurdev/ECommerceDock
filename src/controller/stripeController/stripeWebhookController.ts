import { Request, Response } from "express";
import WebhookService from "../../service/StripeService/stripeWebhookService"

 class StripeWebhookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const sig = req.headers["stripe-signature"] as string;

    try {
      // Stripe requires rawBody for verification, not the parsed JSON
      const event = await WebhookService.verifyEvent((req as any).rawBody, sig);

      await WebhookService.handleEvent(event);

      return res.json({ received: true });
    } catch (err: any) {
      console.error("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}

export default new StripeWebhookController();