// controllers/inventory.controller.ts
import { Request, Response } from "express";
import inventoryService from "../../service/inventoryService/inventoryService";
import { ErrorMessages } from "../../utils/enum/errorMessages";

class InventoryController {
  async createInventory(req: Request, res: Response) {
    try {
      const inventory = await inventoryService.createInventory(req.body);
      res.status(201).json(inventory);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllInventories(req: Request, res: Response) {
    try {
      const inventories = await inventoryService.getAllInventories();
      res.json(inventories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getInventoryById(req: Request, res: Response) {
    try {
      const inventory = await inventoryService.getInventoryById(Number(req.params.id));
      if (!inventory) return res.status(404).json(ErrorMessages.INVENTORY_NOT_FOUND );
      res.json(inventory);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateInventory(req: Request, res: Response) {
    try {
      const inventory = await inventoryService.updateInventory(Number(req.params.id), req.body);
     if (!inventory) return res.status(404).json(ErrorMessages.INVENTORY_NOT_FOUND );
      res.json(inventory);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async increaseStock(req: Request, res: Response) {
    try {
      const inventory = await inventoryService.increaseStock(Number(req.params.id), req.body.amount);
      if (!inventory) return res.status(404).json(ErrorMessages.INVENTORY_NOT_FOUND );
      res.json(inventory);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async decreaseStock(req: Request, res: Response) {
    try {
      const inventory = await inventoryService.decreaseStock(Number(req.params.id), req.body.amount);
      if (!inventory) return res.status(404).json(ErrorMessages.INVENTORY_NOT_FOUND );
      res.json(inventory);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteInventory(req: Request, res: Response) {
    try {
      const inventory = await inventoryService.deleteInventory(Number(req.params.id));
     if (!inventory) return res.status(404).json(ErrorMessages.INVENTORY_NOT_FOUND );
      res.json(inventory);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new InventoryController();
