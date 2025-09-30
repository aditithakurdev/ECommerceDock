import { ErrorMessages } from "../../utils/enum/errorMessages";
import { ResponseMessages } from "../../utils/enum/responseMessages";
import { Request, Response } from "express";
import orderService from "../../service/orderService/orderService";
import { OrderEnum } from "../../utils/enum/order";
import { RolesEnum } from "../../utils/enum/userRole";
import stripeService from "../../service/StripeService/stripeService";


class OrderController {
    // Create a new order
    async create(req: Request, res: Response) {
        try {
            const { totalAmt, status } = req.body;

            if (!totalAmt) {
                return res.status(400).json({ message: "Total amount is required." });
            }

            // JWT middleware ensures req.user exists
            let userId;
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
                status: OrderEnum.CONFIRMED,
                userId,
            });

          return res.status(201).json({
              success:true,
              message: ResponseMessages.ORDER_CREATED,
              data: order,
            });
        } catch (err: any) {
          console.error(err);
         return res.status(500).json({
         message:ErrorMessages.INTERNAL_SERVER_ERROR,
          error: err.message
      });
      }
    }
    
  // Fetch orders for logged-in user
  async getUserOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const orders = await orderService.getUserOrders(userId);
      return res.json({ success: true, message:ResponseMessages.ORDER_FETCHED,data: orders });
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
        return res.status(403).json({ success: false, message: ResponseMessages.ACCESS_DENIED });
      }

      const orders = await orderService.getAllOrders();
      return res.json({ success: true, message:ResponseMessages.ORDER_FETCHED_SUCCESS,data: orders });
   } catch (err: any) {
          console.error(err);
         return res.status(500).json({
         message:ErrorMessages.INTERNAL_SERVER_ERROR,
          error: err.message
      });
      }
    }
  
   async purchaseProduct(req: Request, res: Response) {
  try {
    const { userId, email, productId, totalAmt, currency, sourceToken } = req.body;

    if (!userId || !productId || !totalAmt || !currency || !sourceToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // call Stripe service
    const payment = await stripeService.chargeCustomer(
      userId,
      email,  // ✅ email is required in chargeCustomer
      totalAmt,
      currency,
      sourceToken,
      `Purchase of product ${productId}`
    );

    // prepare order object
    const order = {
      userId,
      productId,
      totalAmt,
      currency,
      status: payment.status,
      isDeleted: false,
      stripePaymentIntentId: payment.paymentIntentData?.id,
      stripeCustomerId: payment.paymentIntentData?.customer as string,
      paymentMethod: payment.paymentIntentData?.payment_method as string,
    };

    // TODO: save `order` in DB
    const savedOrder = await orderService.createOrder( order );

    return res.status(201).json({
      message: "Product purchased successfully",
      order:savedOrder,
    });
  } catch (err: any) {
    console.error("Purchase error:", err);
    return res.status(500).json({
      message: "Purchase failed",
      error: err.message,
    });
  }
  }

}
    

export default new OrderController();
