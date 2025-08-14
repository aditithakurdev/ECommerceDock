import { Request, Response } from "express";
import userService from "../../service/userService/userService";
import { ResponseMessages } from "../../utils/enum/responseMessages";
import { ErrorMessages } from "../../utils/enum/errorMessages";

class UserController {
  // Create a new user
  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      const { password, ...userData } = user.toJSON(); // exclude password
      res.status(201).json({
        message: ResponseMessages.USER_CREATED,
        data: userData,
      });
     } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json({
        message: ResponseMessages.USER_FETCHED,
        data: users
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          message: ErrorMessages.USER_NOT_FOUND,
        });
      }

      return res.status(200).json({
        message: ResponseMessages.USER_FETCHED,
        data: user
      });
     } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const updatedUser = await userService.updateUser(id, data);

      if (!updatedUser) {
        return res.status(404).json({ message: ErrorMessages.USER_NOT_FOUND });
      }

      return res.status(200).json({
        message: ResponseMessages.USER_UPDATED,
        data: updatedUser
      });
     } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }

  // Delete user 
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedUser = await userService.deleteUser(id);

      if (!deletedUser) {
        return res.status(404).json({ message: ErrorMessages.USER_NOT_FOUND });
      }

      return res.status(200).json({
        message: ResponseMessages.USER_DELETED
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }
}

// Export a single instance
export default new UserController();