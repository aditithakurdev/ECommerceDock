import cron from "node-cron";
import Stripe  from "stripe";
import { UserSubscription } from "../model/index";
import { UserSubscriptionEnum } from "../utils/enum/userSubscriptionEnum";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log(" Running subscription sync job...");

  try {
    const subscriptions = await UserSubscription.findAll();

    for (const sub of subscriptions) {
      //  Force Stripe.Subscription type
      const stripeSub = (await stripe.subscriptions.retrieve(
        sub.stripeSubscriptionId
      )) as Stripe.Subscription;

      //  Safely handle end date
      const endDate = stripeSub.ended_at
        ? new Date(stripeSub.ended_at * 1000)
        : new Date(stripeSub.current_period_end * 1000); // should now work

      // Validate status against enum
      const statusValues = Object.values(UserSubscriptionEnum);
      const status = statusValues.includes(
        stripeSub.status as UserSubscriptionEnum
      )
        ? (stripeSub.status as UserSubscriptionEnum)
        : UserSubscriptionEnum.EXPIRED;

      // Update DB
      await UserSubscription.update(
        {
          status,
          endDate, // <-- must exist in your Sequelize model
        },
        { where: { id: sub.id } }
      );
    }

    console.log("Subscription sync completed");
  } catch (error) {
    console.error("❌ Error syncing subscriptions:", error);
  }
});
