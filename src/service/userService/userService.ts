import User from "../../model/user";
import bcrypt from "bcrypt"
import { ErrorMessages } from "../../utils/enum/errorMessages";
import jwt, { SignOptions } from "jsonwebtoken";
import { RolesEnum } from "../../utils/enum/userRole";

class UserService {
  // Create a new user
  async createUser(data: { firstName: string; lastName?: string; email: string; password: string; role?: string }) {
    try {
      // Destructure data
      const { firstName, lastName, email, password, role } = data;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: email } });
      if (existingUser) {
        throw new Error(ErrorMessages.EMAIL_ALREADY_EXISTS);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        ...data,
        password: hashedPassword,
        role: data.role as any as User['role'],
      });
      console.log("User created:", user.toJSON());
      return user;
    } catch (err: any) {
      console.error("Error fetching user by ID:", err.message || err);
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async loginUser(data: { email: string; password: string }) {
    try {
      const { email, password } = data;

      // 1. Find user
      const user = await User.findOne({
        where: { email }
      });
      if (!user) {
        throw new Error(ErrorMessages.USER_NOT_FOUND);
      }

      // 3. Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error(ErrorMessages.INVALID_CREDENTIALS);
      }

      // 4. Generate JWT
      const expiresIn = process.env.JWT_ACCESS_TOKEN as SignOptions["expiresIn"];

      // include role in token
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET!,
        { expiresIn }
      );
      return { token, user };
    } catch (err: any) {
      console.error("Error fetching user by ID:", err.message || err);
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  // Get all users
    async getAllUsers() {
      try {
        const users = await User.findAll({
          attributes: { exclude: ['password'] },
          order: [['createdAt', 'DESC']]
        });
      return users;
   } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      }
  }


  // Get single user by ID
    async getUserProfile(id: string) {
      try {
        const user = await User.findByPk(id, {
          attributes: { exclude: ['password'] } 
        });

        if (!user) {
          return null; 
        }

        return user;
      } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }

  // Update user
    async updateUser(id: string,data: { firstName?: string; lastName?: string; email?: string; role?: string }) {
      try {
        const user = await User.findByPk(id);
        if (!user) return null;

        // Prevent email update
        if (data.email && data.email !== user.getDataValue('email')) {
          throw new Error("You cannot update the email of this user");
        }

        // Update allowed fields only
        const { firstName, lastName, role } = data;
       let updateData: any = { firstName, lastName };

      if (role) {
        // Convert string to Roles enum if necessary
        updateData.role = RolesEnum[role as keyof typeof RolesEnum] || role;
      }
      
      await user.update(updateData);
     } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }


  // Delete user
  async deleteUser(id: string) {
    try {
      const user = await User.findByPk(id);
      if (!user) return null;

      await user.destroy();
      return user;
    } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      }
  }    
}

// Export a single instance
export default new UserService();