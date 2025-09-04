import Stripe from "stripe";
import UserSubscription from "../../model/userSubscriptions";
import { UserSubscriptionEnum } from "../../utils/enum/userSubscriptionEnum";

export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16" as any,
  });

  //One time payment
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

  //Recrussive to purchase the subscription 
  async createUserSubscription(
    userId: string,
    email: string,
    paymentMethodId: string,
    priceId: string
  ) {
    try {
      // 1. Find existing subscription/customer in DB
      let savedSubscription = await UserSubscription.findOne({
        where: { userId, isDeleted: false },
      });

      let customerId: string;

    if (savedSubscription?.stripeCustomerId) {
      // Reuse existing customer
      customerId = savedSubscription.stripeCustomerId;

      // Ensure payment method is attached
      try {
        await this.stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });
      } catch {
        // ignore if already attached
      }

      await this.stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    } else {
      // Create new customer
      const customer = await this.stripe.customers.create({
        email,
        metadata: { userId },
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      customerId = customer.id;
    }

    // 2. Create subscription in Stripe
    const subscription = (await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
      // payment_settings: {
      //   payment_method_types: ["card"],
      //   save_default_payment_method: "on_subscription",
      // },
    })) as Stripe.Subscription;

      // 3. Extract subscription dates safely
      const startDate = subscription.start_date
    ? new Date(subscription.start_date * 1000)
    : new Date(); // fallback to now

    const endDate = subscription.ended_at
      ? new Date(subscription.ended_at * 1000)
      : undefined;

      const planName =
        subscription.items.data[0]?.price?.nickname || "Default Plan";

    // 4. Save subscription in DB
    if (savedSubscription) {
      await savedSubscription.update({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        planName,
        priceId,
        status: subscription.status as UserSubscriptionEnum,
        startDate,
        endDate,
        isDeleted: false,
      });
    } else {
      savedSubscription = await UserSubscription.create({
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        planName,
        priceId,
        status: subscription.status as UserSubscriptionEnum,
        startDate,
        endDate,
        isDeleted: false,
      });
    }

      return {
        stripeSubscription: subscription,
        dbSubscription: savedSubscription,
      };
    } catch (error: any) {
      console.error("Stripe subscription error:", error);

      if (error.type === "StripeCardError") {
        throw new Error(`Payment failed: ${error.message}`);
      }

      throw new Error(error.message || "Subscription failed. Please try again.");
    }
  }

}

export default new StripeService();
