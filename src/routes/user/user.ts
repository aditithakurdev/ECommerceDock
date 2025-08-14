import { Router } from "express";
import userController from "../../controller/userController/userController";
const router = Router();

router.post("/",userController.createUser)

// Get all users
router.get("/", userController.getAllUsers);

// Get a single user by ID
router.get("/:id", userController.getUserById);

// Update a user by ID
router.patch("/:id", userController.updateUser);

// Delete a user by ID
router.delete("/:id", userController.deleteUser);

export default router;
