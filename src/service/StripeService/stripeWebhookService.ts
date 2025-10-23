import Stripe from "stripe";

export class StripeWebhookService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16" as any,
  });

  handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(" Subscription created:", subscription.id);
        // TODO: Save subscription in DB + send welcome email
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(" Invoice paid:", invoice.id);
        // TODO: mark subscription active + send payment success email
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(" Invoice payment failed:", invoice.id);
        // TODO: notify user + pause access
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(" Subscription cancelled:", subscription.id);
        // TODO: update DB + send cancellation email
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  verifyEvent(payload: Buffer | string, sig: string | string[]) {
    console.log("paylod==============",payload)
    return this.stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  }
}

export default new StripeWebhookService();
