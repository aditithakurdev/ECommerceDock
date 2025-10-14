import { Request, Response } from "express";
import userService from "../../service/userService/userService";
import { ResponseMessages } from "../../utils/enum/responseMessages";
import { ErrorMessages } from "../../utils/enum/errorMessages";

class UserController {
  // Create a new user
  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      const { password, ...userData } = user.toJSON(); 
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

  // login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: ErrorMessages.EMAIL_PASSWORD_REQUIRED,
        });
      }

      const { token, user } = await userService.loginUser({ email, password });

      return res.status(200).json({
        message: ResponseMessages.LOGIN_SUCCESS,
        data: {
          token,
          user: {
            id: user.id,
            role: user.role,
          },
        },
      });
    } catch (err: any) {
      console.error(err);
      return res.status(401).json({
        message: ErrorMessages.INVALID_CREDENTIALS,
        error: err.message,
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
  async getUserProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserProfile(id);

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