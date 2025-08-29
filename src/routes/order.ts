import { Router } from "express";
import { orderController } from "../controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// router.post("/create", authenticateToken, orderController.createOrder);

// User → get their own orders
router.get("/my-orders", authenticateToken, orderController.getUserOrders);

// Admin → get all orders
router.get("/all-orders", authenticateToken, orderController.getAllOrders);

router.post("/purchase", orderController.purchaseProduct);

export default router;
