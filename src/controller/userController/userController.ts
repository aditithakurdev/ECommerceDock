import { Request, Response } from "express";
import userService from "../../service/userService/userService";

class UserController {
  // Create a new user
  async createUser(req: Request, res: Response) {
  try {
    const user = await userService.createUser(req.body);
    const { password, ...userData } = user.toJSON(); // exclude password
    res.status(201).json({
      message: "User created successfully",
      user: userData,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}



  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

// Export a single instance
export default new UserController();
