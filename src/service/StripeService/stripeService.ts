import Stripe from "stripe";

export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16" as any,
  });

  async chargeCustomer(
    userId: string,
    email: string,
    amount: number,
    currency: string,
    sourceToken: string,
    description: string
  ) {
    try {
      // 1. Validate token
      const token = await this.stripe.tokens.retrieve(sourceToken);
      if (!token || !token.card) {
        throw new Error("Invalid token provided");
      }

      // 2. Create customer (store userId in metadata)
      const customer = await this.stripe.customers.create({
        email,
        metadata: { userId },
      });

      // 3. Create payment method from token
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: "card",
        card: { token: sourceToken },
        billing_details: {
          email,
        },
      });

      // 4. Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id,
      });

      // 5. Set as default payment method
      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });

      // 6. Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customer.id,
        payment_method: paymentMethod.id,
        description,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });

      return {
        status: paymentIntent.status,
        paymentIntentData: paymentIntent,
      };
    } catch (error: any) {
      console.error("Stripe error:", error);
      throw new Error(error.message || "Payment failed. Please try again.");
    }
  }
}

export default new StripeService();
