// controllers/inventory.controller.ts
import { Request, Response } from "express";
import inventoryService from "../../service/inventoryService/inventoryService";
import { ErrorMessages } from "../../utils/enum/errorMessages";
import { ResponseMessages } from "../../utils/enum/responseMessages";

class InventoryController {
  async createInventory(req: Request, res: Response) {
      try {
          const inventory = await inventoryService.addOrUpdateInventory(req.body);
          res.status(201).json(inventory);
      } catch (err: any) {
          console.error(err);
          return res.status(500).json({
              message: ErrorMessages.INTERNAL_SERVER_ERROR,
              error: err.message
          });
      }
  }

  async getAllInventories(req: Request, res: Response) {
      try {
          const inventories = await inventoryService.getAllInventories();
          res.json(inventories);
      } catch (err: any) {
          console.error(err);
          return res.status(500).json({
              message: ErrorMessages.INTERNAL_SERVER_ERROR,
              error: err.message
          });
      }
  }

  async updateInventory(req: Request, res: Response) {
        try {
            const {id} = req.params; 
            const updatedInventory = await inventoryService.updateInventory(id, req.body);

            if (!updatedInventory) {
            return res.status(404).json({ message: ErrorMessages.INVENTORY_NOT_FOUND });
            }

            return res.json(updatedInventory);
        } catch (err: any) {
            console.error("Error updating inventory:", err);
            return res.status(500).json({
            message: ErrorMessages.INTERNAL_SERVER_ERROR,
            error: err.message || err,
            });
        }
    }

  async getInventoryById(req: Request, res: Response) {
  try {
    const { id } = req.params; 
    const inventory = await inventoryService.getInventoryById(id);
    
    if (!inventory) {
      return res.status(404).json({
        message: ErrorMessages.INVENTORY_NOT_FOUND,
      });
    }
    return res.json({ success: true, data: inventory });
  } catch (err: any) {
    console.error("Error fetching inventory by ID:", err);
    return res.status(500).json({
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error: err.message || err,
    });
  }
}

 async increaseStock(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { amount } = req.body; // expecting { "amount": 5 }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const inventory = await inventoryService.increaseStock(id, amount);

    if (!inventory) {
      return res.status(404).json({ message: ErrorMessages.INVENTORY_NOT_FOUND });
    }

    res.json({ message: ResponseMessages.INVENTORY_INCREASE });
   } catch (err: any) {
        console.error(err);
        return res.status(500).json({
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message });
    }
}


  async decreaseStock(req: Request, res: Response) {
      try {
          const { id } = req.params; 
            const { amount } = req.body; // expecting { "amount": 5 }
          
          const inventory = await inventoryService.decreaseStock(id, amount);
          if (!inventory) return res.status(404).json(ErrorMessages.INVENTORY_NOT_FOUND);
          res.json({ message: ResponseMessages.INVENTORY_DECREASE })
      } catch (err: any) {
          console.error(err);
          return res.status(500).json({
              message: ErrorMessages.INTERNAL_SERVER_ERROR,
              error: err.message
          });
      }
  }

  async deleteInventory(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deletedInventory = await inventoryService.deleteInventory(id);

        if (!deletedInventory) {
        return res.status(404).json({ message: ErrorMessages.INVENTORY_NOT_FOUND });
        }

        return res.json({ message: ResponseMessages.INVENTORY_DELETED });
    } catch (err: any) {
        console.error("Error deleting inventory:", err);
        return res.status(500).json({
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message || err,
        });
    }
    }

}

export default new InventoryController();
