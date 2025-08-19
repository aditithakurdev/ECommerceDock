import { ErrorMessages } from "../../utils/enum/errorMessages";
import { ResponseMessages } from "../../utils/enum/responseMessages";
import { Request, Response } from "express";
import orderService from "../../service/orderService/orderService";
import { OrderEnum } from "../../utils/enum/order";


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
            message:ResponseMessages.ORDER_CREATED,
            order,
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

}
    
export default new OrderController();
