import { ErrorMessages } from "../../utils/enum/errorMessages";
import { ResponseMessages } from "../../utils/enum/responseMessages";
import { Request, Response } from "express";
import orderService from "../../service/orderService/orderService";
import { OrderEnum } from "../../utils/enum/order";
import { Order } from "../../model/index";
import { RolesEnum } from "../../utils/enum/userRole";


class OrderController {
    // Create a new order
    async createOrder(req: Request, res: Response) {
        try {
            const { totalAmt, status } = req.body;

            if (!totalAmt) {
                return res.status(400).json({ message: "Total amount is required." });
            }

            // JWT middleware ensures req.user exists
            let userId: string | undefined;
            if (typeof req.user === "string") {
                userId = req.user;
            } else if (req.user && typeof req.user === "object" && "id" in req.user) {
                userId = (req.user as any).id;
            }
            if (!userId) {
                return res.status(401).json({ message: ErrorMessages.USER_NOT_FOUND });
            }

            const order = await orderService.createOrder({
                totalAmt,
                status: OrderEnum.PENDING,
                userId,
            });

            return res.status(201).json({
                message: ResponseMessages.ORDER_CREATED,
                order,
            });
        } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }
    
  // Fetch orders for logged-in user
  async getUserOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const orders = await orderService.getUserOrders(userId);
      return res.json({ success: true, data: orders });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }

  // Fetch all orders (Admin only)
    async getAllOrders(req: Request, res: Response) {
    try {
      const userRole = (req as any).user.role;

      // Allow only SUPERADMIN or ADMIN
      if (userRole !== RolesEnum.SUPERADMIN && userRole !== RolesEnum.ADMIN) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      const orders = await orderService.getAllOrders();
      return res.json({ success: true, data: orders });
    } catch (err: any) {
      console.error("Error fetching all orders:", err.message || err);
      return res.status(500).json({ success: false, message: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
}
    
export default new OrderController();
