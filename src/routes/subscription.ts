import { Router } from "express";
import stripeController from "../controller/stripeController/stripeController";
import stripeWebhookController from "../controller/stripeController/stripeWebhookController";

const router = Router();

router.post("/create", stripeController.create);
router.post("/", stripeWebhookController.handle);

export default router;