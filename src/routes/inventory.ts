// routes/inventory.routes.ts
import { Router } from "express";
import InventoryController from "../controller/InventoryController/InventoryController";

const router = Router();

router.post("/", InventoryController.createInventory);

router.get("/", InventoryController.getAllInventories);

router.get("/:id", InventoryController.getInventoryById);

router.put("/:id", InventoryController.updateInventory);

router.patch("/:id/increase", InventoryController.increaseStock);

router.patch("/:id/decrease", InventoryController.decreaseStock);

router.delete("/:id", InventoryController.deleteInventory);

export default router;
