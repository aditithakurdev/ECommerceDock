import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import userController from "../controller/userController/userController";
const router = Router();

router.post("/", userController.createUser)

router.post("/login",userController.login)

// Get all users
router.get("/", userController.getAllUsers);

// Get a single user by ID
router.get("/:id", authenticateToken, userController.getUserProfile);

// Update a user by ID
router.patch("/:id", userController.updateUser);

// Delete a user by ID
router.delete("/:id", userController.deleteUser);

export default router;
