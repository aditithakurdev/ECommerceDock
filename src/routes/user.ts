import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import userController from "../controller/userController/userController";
const userRouter = Router();

userRouter.post("/", userController.createUser)

userRouter.post("/login",userController.login)

// Get all users
userRouter.get("/", userController.getAllUsers);

// Get a single user by ID
userRouter.get("/:id", authenticateToken, userController.getUserProfile);

// Update a user by ID
userRouter.patch("/:id", userController.updateUser);

// Delete a user by ID
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
