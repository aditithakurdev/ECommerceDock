// services/inventory.service.ts

import Inventory from "../../model/Inventory";
import { ErrorMessages } from "../../utils/enum/errorMessages";

class InventoryService {
  async createInventory(data: { productId: number; quantity: number; warehouseLocation?: string }) {
    return await Inventory.create(data);
  }

  async getAllInventories() {
    return await Inventory.findAll({ where: { isDeleted: false } });
  }

  async getInventoryById(id: number) {
    return await Inventory.findByPk(id);
  }

  async updateInventory(id: number, data: Partial<{ quantity: number; warehouseLocation: string }>) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    return await inventory.update(data);
  }

  async increaseStock(id: number, amount: number) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    inventory.quantity += amount;
    return await inventory.save();
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
    } catch (error) {
    }
  }

  async deleteInventory(id: number) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    inventory.isDeleted = true;
    return await inventory.save();
  }
}

export default new InventoryService();
