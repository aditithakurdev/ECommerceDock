// services/inventory.service.ts

import Inventory from "../../model/Inventory";
import { ErrorMessages } from "../../utils/enum/errorMessages";

class InventoryService {
  async addOrUpdateInventory(data: { 
    productId: string; 
    quantity: number; 
    stock?: number; 
    warehouseLocation: string 
  }) {
    try {
      const existing = await Inventory.findOne({ 
        where: { 
          productId: data.productId,
          warehouseLocation: data.warehouseLocation, 
        } 
      });

      if (existing) {
        // Increase lifetime purchased
        existing.quantity += data.quantity;

        // Increase stock (if stock passed, otherwise use quantity)
        existing.stock += data.stock ?? data.quantity;

        await existing.save();
        return { inventory: existing, created: false };
      } else {
        // Create new record
        const newInventory = await Inventory.create({
          productId: data.productId,
          quantity: data.quantity,
          stock: data.stock ?? data.quantity, // initial stock = purchased
          warehouseLocation: data.warehouseLocation,
        });
        return { inventory: newInventory, created: true };
      }
    } catch (err: any) {
      console.error("Error adding/updating inventory:", err.message || err);
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllInventories() {
    try {
      return await Inventory.findAll({ where: { isDeleted: false } });
    } catch (err: any) {
      console.error("Error fetching inventories:", err.message || err);
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async updateInventory(id: string, data: Partial<{ stock: number; warehouseLocation: string }>) {
    try {
      const inventory = await Inventory.findByPk(id);
      if (!inventory) return null;
      return await inventory.update(data);
    } catch (err: any) {
      console.error("Error updating inventory:", err.message || err);
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }
  async getInventoryById(id: string) {
    try {
      const inventory = await Inventory.findByPk(id);
      return inventory;
    } catch (err: any) {
      console.error("Error fetching inventory by ID:", err.message || err);
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  

  /**
   * Increase stock (when you restock)
   */
  async increaseStock(id: string, amount: number) {
  try {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;

    // assuming model has both lifetime quantity and current stock
    inventory.quantity += amount; // lifetime purchased always increases
    inventory.stock += amount;    // current stock increases

    return await inventory.save();
  } catch (err: any) {
    console.error("Error increasing stock:", err.message || err);
    throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
  }
}


  /**
   * Decrease stock (when you sell or damage)
   */
  async decreaseStock(id:string, amount: number) {
    try {
      const inventory = await Inventory.findByPk(id);
      if (!inventory) return null;

      if (inventory.stock < amount) {
        throw new Error(ErrorMessages.INSUFFICIENT_STOCK);
      }

      inventory.stock -= amount; // reduce only stock, not quantity
      return await inventory.save();
    } catch (err: any) {
      console.error("Error decreasing stock:", err.message || err);
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteInventory(id: string) {
  try {
    const inventory = await Inventory.findByPk(id);

    if (!inventory || inventory.isDeleted) {
      // either not found or already deleted
      return null;
    }

    inventory.isDeleted = true;
    return await inventory.save();
  } catch (err: any) {
    console.error("Error deleting inventory:", err.message || err);
    throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
  }
}

}

export default new InventoryService();