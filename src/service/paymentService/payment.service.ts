// src/services/stripeService.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
apiVersion:'2023-10-16' as any, 
});

class PaymentService {
  async chargeCustomer(
    user: {
      firstName: string;
      lastName: string;
      email: string;
      stripeCustomerId?: string;
    },
    amount: number,
    currency: string,
    sourceToken: string,
    description: string
  ) {
    try {
      // Step 1: Validate token
      const token = await stripe.tokens.retrieve(sourceToken);
      if (!token || !token.card) {
        throw new Error("Invalid token provided");
      }

      let customerId = user.stripeCustomerId;

      // Step 2: Create customer if not exists
      if (!customerId) {
        const customer = await stripe.customers.create({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        });
        customerId = customer.id;
      }

      // Step 3: Create payment method from token
      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: { token: sourceToken },
        billing_details: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      });

      // Step 4: Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });

      // Step 5: Update default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethod.id },
      });

      // Step 6: Create & confirm PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // convert to cents
        currency,
        customer: customerId,
        payment_method: paymentMethod.id,
        description,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });

      return {
        status: "succeeded",
        paymentIntentData: paymentIntent,
      };
    } catch (error: any) {
      console.error("Stripe Error:", error);
      throw new Error(error.message || "Payment failed.");
    }
  }
}

export default new PaymentService();
