// services/inventory.service.ts

import Inventory from "../../model/Inventory";
import { ErrorMessages } from "../../utils/enum/errorMessages";

class InventoryService {
  async createInventory(data: { productId: number; quantity: number; warehouseLocation?: string }) {
    try {
      return await Inventory.create(data);
    } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      } 
  }

  async getAllInventories() {
    try {
      return await Inventory.findAll({ where: { isDeleted: false } });
    } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      } 
    
  }

  async getInventoryById(id: number) {
    try {
      return await Inventory.findByPk(id);
    } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      } 
  }

  async updateInventory(id: number, data: Partial<{ quantity: number; warehouseLocation: string }>) {
    try {
      const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    return await inventory.update(data);
     } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      } 
  }

  async increaseStock(id: number, amount: number) {
    try {
      const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    inventory.quantity += amount;
    return await inventory.save();
    } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      }
  }

  async decreaseStock(id: number, amount: number) {
    try {
      const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    if (inventory.quantity < amount) {
      throw new Error(ErrorMessages.INSUFFICIENT_STOCK);
    }
    inventory.quantity -= amount;
    return await inventory.save();
     } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      }
  }

  async deleteInventory(id: number) {
    try {
      const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    inventory.isDeleted = true;
    return await inventory.save();
    } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      }
  }
}

export default new InventoryService();
