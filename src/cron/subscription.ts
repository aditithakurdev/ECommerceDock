import cron from "node-cron";
import Stripe  from "stripe";
import { UserSubscription } from "../model/index";
import { UserSubscriptionEnum } from "../utils/enum/userSubscriptionEnum";
import { StripeController } from "../controller";
import stripeService from "../service/StripeService/stripeService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

// Run every day at midnight
// cron.schedule("0 0 * * *", async () => {
//   console.log("🚀 Running subscription sync job...");

//   try {
//     const subscriptions = await UserSubscription.findAll();

//     for (const sub of subscriptions) {
//       try {
//         if (!sub.stripeSubscriptionId) {
//           console.warn(`⚠️ Skipping subscription ${sub.id}: missing Stripe ID`);
//           continue;
//         }

//         // Fetch subscription from Stripe
//         const stripeSub = (await stripe.subscriptions.retrieve(
//           sub.stripeSubscriptionId
//         )) as Stripe.Subscription;

//         // Get end date safely
//         const endDate = stripeSub.ended_at
//           ? new Date(stripeSub.ended_at * 1000)
//           : stripeSub.trial_end
//           ? new Date(stripeSub.trial_end * 1000)
//           : null;

//         // Validate status
//         const statusValues = Object.values(UserSubscriptionEnum);
//         const status = statusValues.includes(
//           stripeSub.status as UserSubscriptionEnum
//         )
//           ? (stripeSub.status as UserSubscriptionEnum)
//           : UserSubscriptionEnum.EXPIRED;

//         // Update DB record
//         await UserSubscription.update(
//           { status, endDate:endDate as any  },
//           { where: { id: sub.id } }
//         );

//         console.log(`Subscription ${sub.id} synced with status: ${status}`);
//       } catch (subError) {
//         console.error(`Error syncing subscription ${sub.id}:`,
//           (subError as Error).message
//         );
//       }
//     }

//     console.log("Subscription sync completed");
//   } catch (error) {
//     console.error(" Fatal error syncing subscriptions:", (error as Error).message);
//   }
// });
cron.schedule("0 0 * * *", async () => {
  try {
    await stripeService.syncAllSubscriptions(); // call service directly
    console.log("✅ Cron job: subscriptions synced");
  } catch (err) {
    console.error("🔥 Cron job failed:", (err as Error).message);
  }
});