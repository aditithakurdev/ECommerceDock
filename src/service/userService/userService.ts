import User from "../../model/user";
import bcrypt from "bcrypt"
import { ErrorMessages } from "../../utils/enum/errorMessages";

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
    });
    console.log("User created:", user.toJSON());
    return user;
  } catch (err:any) {
    console.error("Error creating user:", err.message || err);
    throw err;
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
      console.error("Error fetching user:", err.message || err);
      throw err;
    }
  }


  // Get single user by ID
    async getUserById(id: string) {
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
        await user.update({ firstName, lastName, role });

        return user;
      } catch (err: any) {
        console.error("Error updating user:", err.message || err);
        throw err; 
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
      console.error("Error updating user:", err.message || err);
      throw err;
    }
  }    
}

// Export a single instance
export default new UserService();