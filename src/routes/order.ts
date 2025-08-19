import { Router } from "express";
import { orderController } from "../controller";
import { authenticateToken } from "../middleware/auth";

const orderRouter = Router();

orderRouter.post("/create", authenticateToken, orderController.createOrder);

// User → get their own orders
orderRouter.get("/my-orders", authenticateToken, orderController.getUserOrders);

// Admin → get all orders
orderRouter.get("/all-orders", authenticateToken, orderController.getAllOrders);

export default orderRouter;
