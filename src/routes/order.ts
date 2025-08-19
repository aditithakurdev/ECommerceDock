import { Router } from "express";
import { orderController } from "../controller";
import { authenticateToken } from "../middleware/auth";

const orderRouter = Router();

orderRouter.post("/create", authenticateToken, orderController.createOrder);


export default orderRouter;
