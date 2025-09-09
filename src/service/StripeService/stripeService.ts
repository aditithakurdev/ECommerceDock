import Stripe from "stripe";
import UserSubscription from "../../model/userSubscriptions";
import { UserSubscriptionEnum } from "../../utils/enum/userSubscriptionEnum";
import { ErrorMessages } from "../../utils/enum/errorMessages";
import { Op } from "sequelize";

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
        throw new Error(ErrorMessages.INVALID_TOKEN);
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
      await this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId }).catch(err => {
      if (err.code !== "resource_already_attached") throw err;
      });

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
        expand: ["latest_invoice.payment_intent", "items.data.price.product"],
        payment_settings: {
          payment_method_types: ["card"],
          save_default_payment_method: "on_subscription",
        },
      } )) as Stripe.Subscription;

    // --- SAFE handling of PaymentIntent ---
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null;

    if (latestInvoice && (latestInvoice as any).payment_intent) {
      const paymentIntent = (latestInvoice as any)
        .payment_intent as Stripe.PaymentIntent;
    
      if (paymentIntent.status !== "succeeded") {
        const confirmedIntent = await this.stripe.paymentIntents.confirm(
          paymentIntent.id,
          { payment_method: paymentMethodId }
        );
        console.log("Confirmed PaymentIntent:", confirmedIntent.status);
      }
    }


      // 3. Extract subscription dates safely
      const startDate = subscription.start_date
    ? new Date(subscription.start_date * 1000)
    : new Date(); // fallback to now

    const endDate = subscription.ended_at
      ? new Date(subscription.ended_at * 1000)
      : undefined;

    const planName =
      (subscription.items.data[0]?.price?.nickname as string) ||
      ((subscription.items.data[0]?.price?.product as any)?.name ?? "Default Plan");

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
        clientSecret:
        (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    };
    } catch (error: any) {
      console.error("Stripe subscription error:", error);

      if (error.type === "StripeCardError") {
        throw new Error(`Payment failed: ${error.message}`);
      }

      throw new Error(error.message || "Subscription failed. Please try again.");
    }
  }

  async syncSubscription(subId: string): Promise<void> {
    try {
      const stripeSub = (await this.stripe.subscriptions.retrieve(
        subId
      )) as Stripe.Subscription;

      // safe date extraction
      const startDate = stripeSub.start_date
        ? new Date(Number(stripeSub.start_date) * 1000)
        : null;

      const endDate = stripeSub.ended_at
        ? new Date(Number(stripeSub.ended_at) * 1000)
        : stripeSub.trial_end
        ? new Date(Number(stripeSub.trial_end) * 1000)
        : null;

      // safe plan & price extraction
      const firstItem = stripeSub.items?.data?.[0];
      const planName = firstItem?.price?.nickname ?? "Default Plan";
      const priceId = firstItem?.price?.id ?? "";

      // status mapping (keeps your enum or falls back)
      const statusValues = Object.values(UserSubscriptionEnum);
      const status = statusValues.includes(
        stripeSub.status as UserSubscriptionEnum
      )
        ? (stripeSub.status as UserSubscriptionEnum)
        : UserSubscriptionEnum.EXPIRED;

      await UserSubscription.update(
        {
          status,
          // store as ISO strings to avoid TS/Sequelize typing mismatch
          startDate: startDate as Date,
          endDate: endDate as Date,
          planName,
          priceId,
        },
        { where: { stripeSubscriptionId: subId } }
      );

      console.log(` Synced subscription (stripeId=${subId})`);
    } catch (err) {
      console.error(` Failed to sync subscription ${subId}:`, (err as Error).message);
      throw err; 
    }
  }

  // bulk sync: finds all subscriptions with a stripeSubscriptionId and calls syncSubscription
  async syncAllSubscriptions(): Promise<void> {
    console.log("🚀 Running bulk subscription sync...");

    // filter to rows that actually have stripeSubscriptionId and are not deleted
    const subscriptions = await UserSubscription.findAll({
      where: {
        stripeSubscriptionId: { [Op.ne]: null } as any,
        isDeleted: false,
      },
      attributes: ["id", "stripeSubscriptionId"],
    });

    for (const row of subscriptions) {
      const stripeId = (row as any).stripeSubscriptionId as string | null;
      if (!stripeId) {
        console.warn(` Skipping ${row.id} (no stripeSubscriptionId)`);
        continue;
      }

      try {
        // sequential call to avoid big concurrency spikes; change to parallel if you want
        await this.syncSubscription(stripeId);
      } catch (err) {
        // Already logged in syncSubscription; continue to next
        console.error(` - error syncing row id=${(row as any).id}`);
      }
    }

    console.log("🎯 Bulk subscription sync complete");
  }

}

export default new StripeService();
