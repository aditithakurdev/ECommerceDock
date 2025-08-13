import { Router } from "express";
import userController from "../../controller/userController/userController";
const router = Router();

// Create a new user
router.post("/", (req, res) => {
  console.log("POST /api/users hit");
  res.json({ message: "User created successfully" });
});

// Get all users
router.get("/", userController.getAllUsers);

// Get a single user by ID
router.get("/:id", userController.getUserById);

// Update a user by ID
router.put("/:id", userController.updateUser);

// Delete a user by ID
router.delete("/:id", userController.deleteUser);

export default router;
